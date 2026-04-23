import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey && process.env.NODE_ENV === "production") {
  throw new Error("STRIPE_SECRET_KEY is required in production");
}

export const stripe = new Stripe(secretKey ?? "sk_test_placeholder", {
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
  billingMode: "ONE_TIME" | "SUBSCRIPTION";
  stripePriceId?: string | null;
  locale: "de" | "en" | "tr";
  customerEmail: string;
}

/**
 * Creates a Checkout Session for either a one-time payment or a yearly
 * subscription. Falls back to inline `price_data` if no Price ID is configured
 * yet (useful during dev before Stripe dashboard setup).
 */
export async function createCheckoutSession(
  args: CreateCheckoutSessionArgs
): Promise<Stripe.Checkout.Session> {
  const siteUrl = getSiteUrl();
  const successUrl = `${siteUrl}/${args.locale}/products/digital-card/thanks/${args.orderId}?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${siteUrl}/${args.locale}/products/digital-card#order`;

  const isSubscription = args.billingMode === "SUBSCRIPTION";
  const mode = isSubscription ? "subscription" : "payment";

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
          ...(isSubscription
            ? { recurring: { interval: "year" as const } }
            : {}),
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
