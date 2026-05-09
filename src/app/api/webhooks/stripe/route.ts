import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/stripe";
import { OrderStatus } from "@/lib/validation";
import { ensureUniqueSlug, isSlugAvailable } from "@/lib/slug";
import { notifyOrderEvent } from "@/lib/notifications";
import { sendCustomerEmail } from "@/lib/email/send";
import { normalizeLocale } from "@/lib/email/shell";
import {
  renderConfirmationHtml,
  renderConfirmationText,
  confirmationSubject,
} from "@/lib/email/templates/confirmation";
import {
  renderCancellationHtml,
  renderCancellationText,
  cancellationSubject,
} from "@/lib/email/templates/cancellation";
import { getTemplateById } from "@/config/card-templates";
import {
  upsertUserSubscriptionFromStripe,
  applyInvoicePaid,
  applyInvoiceFailed,
} from "@/lib/billing/pro";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature") ?? "";
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[stripe webhook] STRIPE_WEBHOOK_SECRET not set");
      Sentry.captureMessage("Stripe webhook secret missing", {
        level: "error",
        tags: { area: "stripe-webhook" },
      });
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(rawBody, signature, webhookSecret);
    } catch (error) {
      console.error("[stripe webhook] signature verify failed:", error);
      Sentry.captureException(error, {
        tags: { area: "stripe-webhook", step: "signature" },
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          await handleCheckoutCompleted(session);
          break;
        }
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const sub = event.data.object as Stripe.Subscription;
          // M5 — Pro subscription path. The helper short-circuits when the
          // subscription has no userId metadata (legacy order-scoped subs are
          // identified by `metadata.orderId` and stay on the original handler).
          await upsertUserSubscriptionFromStripe(sub);
          await handleSubscriptionUpdated(sub);
          break;
        }
        case "invoice.paid": {
          const invoice = event.data.object as Stripe.Invoice;
          await applyInvoicePaid(invoice);
          break;
        }
        case "invoice.payment_failed": {
          const invoice = event.data.object as Stripe.Invoice;
          await applyInvoiceFailed(invoice);
          break;
        }
        default:
          // Other events are ignored for now.
          break;
      }
    } catch (error) {
      console.error(`[stripe webhook] handler error for ${event.type}:`, error);
      Sentry.captureException(error, {
        tags: { area: "stripe-webhook", step: "handler", eventType: event.type },
      });
      // Return 500 so Stripe retries — business-critical events must not be
      // silently dropped. Notification-only failures are swallowed deeper in
      // the handler (see handleCheckoutCompleted) so we still ack Stripe when
      // the DB transition succeeded but SMTP/Telegram didn't.
      return NextResponse.json({ error: "Handler failed" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    // Catch-all: anything above throwing before Stripe handler also surfaces.
    Sentry.captureException(error, {
      tags: { area: "stripe-webhook", step: "outer" },
    });
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
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

  // -------------------------------------------------------------------------
  // Hybrid publish flow (premium foundation, 2026-04-23):
  //   • conciergeAddon = false (default) → SELF-SERVE auto-publish.
  //     Generate a slug, set status PUBLISHED + publishedAt, customer's card
  //     goes live immediately at /c/{slug}. Notification event="published".
  //   • conciergeAddon = true            → DESIGNER REVIEW.
  //     Hand off to AWAITING_DESIGN queue, designer publishes manually via
  //     /api/admin/orders/{id}/publish (existing endpoint, unchanged).
  //     Notification event="awaiting_design".
  // -------------------------------------------------------------------------
  let publishedSlug: string | null = null;

  if (order.conciergeAddon) {
    // Existing concierge flow — designer reviews then publishes.
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
        note: "Concierge add-on: queued for hand-designed review (48h SLA).",
      },
    });
  } else {
    // Self-serve auto-publish — Phase 8: prefer the customer-chosen slug
    // (`desiredSlug`) when it's still free at publish time. Fall back to
    // the auto-generated `name-xxxx` form when there's no choice or the
    // chosen slug got snatched between order create and webhook (rare but
    // possible — desiredSlug isn't reserved in DB until publish).
    if (order.desiredSlug && (await isSlugAvailable(order.desiredSlug))) {
      publishedSlug = order.desiredSlug;
    } else {
      publishedSlug = await ensureUniqueSlug(order.contactName, order.id);
    }

    await prisma.cardOrder.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.PUBLISHED,
        slug: publishedSlug,
        publishedAt: now,
      },
    });
    await prisma.orderStatusHistory.create({
      data: {
        orderId: orderId,
        fromStatus: OrderStatus.PAID,
        toStatus: OrderStatus.PUBLISHED,
        actor: "system",
        note: `Self-serve auto-publish at /c/${publishedSlug}.`,
      },
    });
  }

  // Fire notifications (non-blocking, silent failures). Event mirrors the
  // chosen branch above so admin/customer messaging matches what happened.
  notifyOrderEvent({
    orderId: order.id,
    orderNumber: order.orderNumber,
    contactName: order.contactName,
    contactEmail: order.contactEmail,
    contactPhone: order.contactPhone,
    callMeBack: order.callMeBack,
    amountCents: order.amountCents,
    billingMode: order.billingMode,
    slug: publishedSlug,
    event: order.conciergeAddon ? "awaiting_design" : "published",
  }).catch((e) => console.error("[stripe webhook] notification error:", e));

  // Customer "designer working" email. Logs and swallows errors — the webhook
  // must ack Stripe quickly regardless of SMTP outcomes.
  try {
    const locale = normalizeLocale(order.locale);
    const template = getTemplateById(order.templateId);
    const confirmInput = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      contactName: order.contactName,
      templateName: template?.name ?? `Template #${order.templateId}`,
      billingMode: order.billingMode,
      amountCents: order.amountCents,
      currency: order.currency,
      editToken: order.editToken ?? "",
    };
    const result = await sendCustomerEmail({
      to: order.contactEmail,
      subject: confirmationSubject(confirmInput, locale),
      html: renderConfirmationHtml(confirmInput, locale),
      text: renderConfirmationText(confirmInput, locale),
    });
    if (!result.skipped) {
      console.log(
        `[stripe webhook] confirmation email sent to ${order.contactEmail} (${result.messageId ?? "no-id"})`
      );
    }
  } catch (err) {
    console.error("[stripe webhook] confirmation email failed:", err);
    Sentry.captureException(err, {
      tags: { area: "customer-email", template: "confirmation" },
      extra: { orderId: order.id, orderNumber: order.orderNumber },
    });
  }
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

    // Customer cancellation email — log/swallow errors.
    try {
      const locale = normalizeLocale(order.locale);
      const cancelInput = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        contactName: order.contactName,
        editToken: order.editToken ?? "",
        accessThrough: new Date(periodEndSec * 1000).toISOString(),
      };
      const result = await sendCustomerEmail({
        to: order.contactEmail,
        subject: cancellationSubject(cancelInput, locale),
        html: renderCancellationHtml(cancelInput, locale),
        text: renderCancellationText(cancelInput, locale),
      });
      if (!result.skipped) {
        console.log(
          `[stripe webhook] cancellation email sent to ${order.contactEmail} (${result.messageId ?? "no-id"})`
        );
      }
    } catch (err) {
      console.error("[stripe webhook] cancellation email failed:", err);
      Sentry.captureException(err, {
        tags: { area: "customer-email", template: "cancellation" },
        extra: { orderId: order.id, orderNumber: order.orderNumber },
      });
    }
  }
}
