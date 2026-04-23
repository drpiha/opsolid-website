import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

// The Stripe SDK is instantiated eagerly so route modules can import `stripe`
// at the top level. Missing key surfaces as a runtime auth error on the first
// real API call — we deliberately do NOT throw here because Next.js evaluates
// route modules during `next build` page-data collection, and the build env
// (docker builder stage, CI) often has no STRIPE_SECRET_KEY available.
export const stripe = new Stripe(secretKey ?? "sk_test_placeholder_for_build", {
  typescript: true,
});

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_URL?.replace(/^/, "https://") ??
    "http://localhost:3000"
  );
}

export interface CreateCheckoutSessionArgs {
  orderId: string;
  amountCents: number;
  currency: string;
  templateName: string;
  billingMode: "ONE_TIME" | "MONTHLY" | "YEARLY";
  stripePriceId?: string | null;
  locale: "de" | "en" | "tr";
  customerEmail: string;
}

/**
 * Creates a Checkout Session for a one-time, monthly, or yearly purchase.
 * Falls back to inline `price_data` if no Price ID is configured yet (useful
 * during dev before Stripe dashboard setup).
 */
export async function createCheckoutSession(
  args: CreateCheckoutSessionArgs
): Promise<Stripe.Checkout.Session> {
  const siteUrl = getSiteUrl();
  const successUrl = `${siteUrl}/${args.locale}/products/digital-card/thanks/${args.orderId}?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${siteUrl}/${args.locale}/products/digital-card#order`;

  const isSubscription = args.billingMode !== "ONE_TIME";
  const mode = isSubscription ? "subscription" : "payment";
  const interval =
    args.billingMode === "MONTHLY"
      ? ("month" as const)
      : args.billingMode === "YEARLY"
      ? ("year" as const)
      : undefined;

  const lineItem = args.stripePriceId
    ? { price: args.stripePriceId, quantity: 1 }
    : {
        quantity: 1,
        price_data: {
          currency: args.currency.toLowerCase(),
          unit_amount: args.amountCents,
          product_data: {
            name: `OpSolid Digital Card — ${args.templateName}`,
            metadata: {
              orderId: args.orderId,
              templateName: args.templateName,
            },
          },
          ...(interval ? { recurring: { interval } } : {}),
        },
      };

  return stripe.checkout.sessions.create({
    mode,
    line_items: [lineItem],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: args.customerEmail,
    locale: args.locale,
    metadata: {
      orderId: args.orderId,
      billingMode: args.billingMode,
    },
    ...(isSubscription
      ? {
          subscription_data: {
            metadata: { orderId: args.orderId },
          },
        }
      : {
          payment_intent_data: {
            metadata: { orderId: args.orderId },
          },
        }),
  } as Parameters<typeof stripe.checkout.sessions.create>[0]);
}

/**
 * Verifies a Stripe webhook signature. Throws on invalid.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
}
