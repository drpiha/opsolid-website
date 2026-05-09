// =============================================================================
// M5 — Pro tier Stripe helpers.
//
// Single place that knows the Pro Price IDs (env-driven), creates checkout
// sessions for the user-scoped Pro subscription, opens the Stripe Customer
// Portal, and writes the resulting Subscription state back to the DB.
//
// Price IDs are NEVER hardcoded — they come from STRIPE_PRICE_PRO_MONTHLY /
// STRIPE_PRICE_PRO_YEARLY. If either is missing the relevant interval throws
// `pro_not_configured` so the route can return a 503 cleanly.
//
// Idempotency: the webhook is the source of truth. Multiple checkout sessions
// for the same user are fine — Stripe deduplicates by customer; the webhook
// upserts on `userId`.
// =============================================================================

import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe, getSiteUrl } from "@/lib/stripe";

export type ProInterval = "monthly" | "yearly";

/**
 * Resolve the configured Stripe Price ID for a Pro interval. Throws when the
 * env var is missing — the caller converts to an HTTP 503 with
 * `pro_not_configured`.
 */
export function getProPriceId(interval: ProInterval): string {
  const id =
    interval === "monthly"
      ? process.env.STRIPE_PRICE_PRO_MONTHLY
      : process.env.STRIPE_PRICE_PRO_YEARLY;
  if (!id) {
    throw new Error("pro_not_configured");
  }
  return id;
}

/**
 * Ensure the user has a Stripe Customer attached. Creates the customer on
 * first call and caches the id on `users.stripe_customer_id`.
 */
export async function ensureStripeCustomerForUser(args: {
  userId: string;
  email: string;
  name?: string | null;
}): Promise<string> {
  const existing = await prisma.user.findUnique({
    where: { id: args.userId },
    select: { stripeCustomerId: true },
  });
  if (existing?.stripeCustomerId) return existing.stripeCustomerId;

  const customer = await stripe.customers.create({
    email: args.email,
    name: args.name ?? undefined,
    metadata: { userId: args.userId },
  });

  await prisma.user.update({
    where: { id: args.userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

/**
 * Create a Pro subscription Checkout Session. Returns the session URL for
 * the client to open (mobile = expo-web-browser; web = redirect).
 */
export async function createProCheckoutSession(args: {
  userId: string;
  email: string;
  name?: string | null;
  interval: ProInterval;
  locale: "de" | "en" | "tr";
}): Promise<Stripe.Checkout.Session> {
  const priceId = getProPriceId(args.interval);
  const customerId = await ensureStripeCustomerForUser({
    userId: args.userId,
    email: args.email,
    name: args.name,
  });

  const siteUrl = getSiteUrl().replace(/\/$/, "");
  // Mobile clients open this in expo-web-browser; the success/cancel URLs are
  // hard-coded to a small static page that closes the browser. The web SPA
  // can override with its own URLs by passing successUrl/cancelUrl in v2.
  const successUrl = `${siteUrl}/billing/pro/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${siteUrl}/billing/pro/cancel`;

  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    locale: args.locale,
    allow_promotion_codes: true,
    metadata: {
      userId: args.userId,
      proInterval: args.interval,
    },
    subscription_data: {
      metadata: {
        userId: args.userId,
        proInterval: args.interval,
      },
    },
  });
}

/**
 * Create a Stripe Customer Portal session for self-service management
 * (cancel, update card, view invoices). The user must already have a
 * stripeCustomerId — caller should redirect to checkout if not.
 */
export async function createProPortalSession(args: {
  customerId: string;
}): Promise<Stripe.BillingPortal.Session> {
  const siteUrl = getSiteUrl().replace(/\/$/, "");
  return stripe.billingPortal.sessions.create({
    customer: args.customerId,
    return_url: `${siteUrl}/billing/pro/return`,
  });
}

// ---------------------------------------------------------------------------
// Webhook upsert helpers — the Stripe webhook calls these on
// customer.subscription.{created,updated,deleted} + invoice.{paid,payment_failed}.
// ---------------------------------------------------------------------------

/**
 * Resolve the user id from Stripe subscription metadata or by walking back
 * through Customer.metadata. Returns null on miss — the webhook then logs
 * + skips (this happens for the legacy per-card subscriptions whose
 * metadata only carries `orderId`).
 */
export async function userIdForStripeSubscription(
  sub: Stripe.Subscription | { metadata?: Stripe.Metadata; customer: string | Stripe.Customer | null },
): Promise<string | null> {
  const fromSub = sub.metadata?.userId;
  if (typeof fromSub === "string" && fromSub) return fromSub;

  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null;
  if (!customerId) return null;

  // 1) Cached on User row (fast path).
  const cached = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
    select: { id: true },
  });
  if (cached) return cached.id;

  // 2) Fall back to Stripe Customer.metadata.userId.
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer && !customer.deleted) {
      const md = (customer as Stripe.Customer).metadata?.userId;
      if (typeof md === "string" && md) return md;
    }
  } catch {
    // ignore — fall through to null
  }
  return null;
}

const ACTIVE_STATUSES = new Set<string>(["active", "trialing"]);

/**
 * Upsert the user-scoped subscription row + flip `User.proSince` based on
 * the Stripe subscription status. Single writer; idempotent.
 */
export async function upsertUserSubscriptionFromStripe(
  sub: Stripe.Subscription,
): Promise<void> {
  const userId = await userIdForStripeSubscription(sub);
  if (!userId) {
    // Legacy per-card subscription (metadata.orderId, no userId) — leave
    // alone. The other webhook branch handles those.
    return;
  }

  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null;

  const periodEndSec =
    (sub as unknown as { current_period_end?: number }).current_period_end ?? null;
  const currentPeriodEnd =
    periodEndSec && typeof periodEndSec === "number"
      ? new Date(periodEndSec * 1000)
      : null;

  // Identify the price id of the FIRST item — Pro is single-line.
  const priceId = sub.items?.data?.[0]?.price?.id ?? null;

  const isActive = ACTIVE_STATUSES.has(sub.status);

  await prisma.userSubscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: sub.id,
      status: sub.status,
      priceId,
      currentPeriodEnd,
      cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
    },
    update: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: sub.id,
      status: sub.status,
      priceId,
      currentPeriodEnd,
      cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
    },
  });

  // Mirror to User.proSince. `proSince` keeps its OLD value when going from
  // active → past_due so the user retains access during retry. Only flip to
  // null when the subscription is definitively terminated.
  if (isActive) {
    // Set proSince once on first activation; subsequent updates leave it.
    await prisma.user.update({
      where: { id: userId },
      data: {
        proSince: { set: undefined } as never, // bare update only when null
      },
    }).catch(() => undefined);
    // Prisma doesn't have a coalesce — do it as a 2-step.
    const u = await prisma.user.findUnique({
      where: { id: userId },
      select: { proSince: true },
    });
    if (!u?.proSince) {
      await prisma.user.update({
        where: { id: userId },
        data: { proSince: new Date() },
      });
    }
  } else if (sub.status === "canceled" || sub.status === "incomplete_expired" || sub.status === "unpaid") {
    await prisma.user.update({
      where: { id: userId },
      data: { proSince: null },
    });
  }
  // past_due / incomplete: leave proSince as-is (grace period).
}

/**
 * Webhook helper for `invoice.paid` — bumps `currentPeriodEnd` defensively
 * when the subscription update event hasn't arrived yet. Also a safe no-op
 * if invoice has no related subscription.
 */
export async function applyInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  const subId =
    typeof (invoice as unknown as { subscription?: string | null }).subscription === "string"
      ? ((invoice as unknown as { subscription?: string | null }).subscription as string)
      : null;
  if (!subId) return;
  const sub = await stripe.subscriptions.retrieve(subId);
  await upsertUserSubscriptionFromStripe(sub);
}

/**
 * Webhook helper for `invoice.payment_failed` — flips status to past_due
 * (Stripe will follow with subscription.updated; we mirror immediately for
 * UI freshness).
 */
export async function applyInvoiceFailed(invoice: Stripe.Invoice): Promise<void> {
  const subId =
    typeof (invoice as unknown as { subscription?: string | null }).subscription === "string"
      ? ((invoice as unknown as { subscription?: string | null }).subscription as string)
      : null;
  if (!subId) return;
  const sub = await stripe.subscriptions.retrieve(subId);
  await upsertUserSubscriptionFromStripe(sub);
}
