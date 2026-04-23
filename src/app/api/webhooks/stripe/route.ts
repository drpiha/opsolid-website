import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/stripe";
import { OrderStatus } from "@/lib/validation";
import { notifyOrderEvent } from "@/lib/notifications";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[stripe webhook] STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = verifyWebhookSignature(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe webhook] signature verify failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(sub);
        break;
      }
      default:
        // Other events are ignored for now.
        break;
    }
  } catch (error) {
    console.error(`[stripe webhook] handler error for ${event.type}:`, error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    console.warn("[stripe webhook] session without orderId metadata", session.id);
    return;
  }

  const order = await prisma.cardOrder.findUnique({
    where: { id: orderId },
  });
  if (!order) {
    console.warn("[stripe webhook] order not found", orderId);
    return;
  }
  // Idempotent: anything past PAID has already processed this webhook.
  if (
    order.status === OrderStatus.AWAITING_DESIGN ||
    order.status === OrderStatus.PUBLISHED ||
    order.status === OrderStatus.PAID
  ) {
    return;
  }

  const now = new Date();

  // Stamp payment metadata + transition PENDING_PAYMENT -> PAID. We don't
  // generate a slug here — the designer does hand-review first, slug is
  // assigned at the publish endpoint.
  await prisma.cardOrder.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.PAID,
      paidAt: now,
      stripeSessionId: order.stripeSessionId ?? session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : order.stripePaymentIntentId,
      stripeSubscriptionId:
        typeof session.subscription === "string"
          ? session.subscription
          : order.stripeSubscriptionId,
      stripeCustomerId:
        typeof session.customer === "string"
          ? session.customer
          : order.stripeCustomerId,
    },
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId: orderId,
      fromStatus: order.status,
      toStatus: OrderStatus.PAID,
      actor: "stripe",
      note: `Checkout completed (${session.id})`,
    },
  });

  // Immediately hand off to the designer queue.
  await prisma.cardOrder.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.AWAITING_DESIGN,
      awaitingDesignAt: now,
    },
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId: orderId,
      fromStatus: OrderStatus.PAID,
      toStatus: OrderStatus.AWAITING_DESIGN,
      actor: "system",
      note: "Queued for hand-designed review (48h SLA).",
    },
  });

  // Fire notifications (non-blocking, silent failures). Prefer the
  // awaiting_design event so admin sees "ready for design review".
  notifyOrderEvent({
    orderId: order.id,
    orderNumber: order.orderNumber,
    contactName: order.contactName,
    contactEmail: order.contactEmail,
    contactPhone: order.contactPhone,
    callMeBack: order.callMeBack,
    amountCents: order.amountCents,
    billingMode: order.billingMode,
    slug: null,
    event: "awaiting_design",
  }).catch((e) => console.error("[stripe webhook] notification error:", e));

  // TODO(track-B): send "designer working" email to the customer here,
  // reusing the editToken for the eventual self-service edit link.
}

async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  const orderId = sub.metadata?.orderId;
  if (!orderId) return;

  const order = await prisma.cardOrder.findUnique({
    where: { id: orderId },
  });
  if (!order) return;

  const periodEndSec =
    (sub as unknown as { current_period_end?: number }).current_period_end ??
    Math.floor(Date.now() / 1000);

  await prisma.subscription.upsert({
    where: { orderId },
    create: {
      orderId,
      stripeSubscriptionId: sub.id,
      status: sub.status,
      currentPeriodEnd: new Date(periodEndSec * 1000),
      cancelAt: sub.cancel_at ? new Date(sub.cancel_at * 1000) : null,
      canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
    },
    update: {
      status: sub.status,
      currentPeriodEnd: new Date(periodEndSec * 1000),
      cancelAt: sub.cancel_at ? new Date(sub.cancel_at * 1000) : null,
      canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
    },
  });

  // If subscription ended, cancel the order so the public page 404s.
  if (sub.status === "canceled" && order.status !== "CANCELLED") {
    await prisma.cardOrder.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });
    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        fromStatus: order.status,
        toStatus: OrderStatus.CANCELLED,
        actor: "stripe",
        note: `Subscription canceled (${sub.id})`,
      },
    });
  }
}
