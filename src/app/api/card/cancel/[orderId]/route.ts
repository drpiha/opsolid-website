// =============================================================================
// Customer self-service subscription cancel — POST /api/card/cancel/[orderId]?t=
//
// Calls stripe.subscriptions.cancel (immediate) on the associated subscription.
// We DO NOT flip the order to CANCELLED here — the existing stripe webhook
// handler for `customer.subscription.deleted` does that. This route's job is
// to fire the Stripe API call and return the scheduled cancel timing so the
// UI can render "your card stays live until {date}".
//
// Behaviour for ONE_TIME orders: there's no subscription to cancel, so we
// return 404 with a helpful body rather than crashing.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { EditTokenError, requireEditToken } from "@/lib/auth/edit-token";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const order = await requireEditToken(req, params.orderId);

    const subRow = await prisma.subscription.findUnique({
      where: { orderId: order.id },
    });

    if (!subRow) {
      return NextResponse.json(
        {
          error: "no_subscription",
          message:
            "This order is a one-time purchase; there is no recurring subscription to cancel.",
        },
        { status: 404 }
      );
    }

    // Cancel at period end — the customer paid for this billing cycle.
    // Stripe's webhook will then set Subscription.canceledAt and eventually
    // flip the order status once the subscription is fully terminated.
    const canceled = await stripe.subscriptions.update(
      subRow.stripeSubscriptionId,
      { cancel_at_period_end: true }
    );

    const cancelAtSec =
      canceled.cancel_at ??
      (canceled as unknown as { current_period_end?: number })
        .current_period_end ??
      null;

    const cancelAt = cancelAtSec ? new Date(cancelAtSec * 1000) : null;

    // Mirror Stripe's response into our row so UI doesn't wait for the webhook.
    if (cancelAt) {
      await prisma.subscription.update({
        where: { orderId: order.id },
        data: { cancelAt },
      });
    }

    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        fromStatus: order.status,
        toStatus: order.status,
        actor: "customer-self-cancel",
        note: `Subscription ${subRow.stripeSubscriptionId} scheduled to cancel at period end`,
      },
    });

    return NextResponse.json({
      ok: true,
      cancelAt: cancelAt?.toISOString() ?? null,
      currentPeriodEnd: subRow.currentPeriodEnd.toISOString(),
    });
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.code }, { status: err.status });
    }
    console.error("[card/cancel POST] unexpected error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
