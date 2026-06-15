// =============================================================================
// Card pricing-mode configuration — the single switch that decides whether
// the card product runs as a freemium business or a fully free tool.
//
//   CARD_PRICING_MODE=all_free   (default) everything free: paid tiers hidden
//                                in the order form, the orders API coerces any
//                                paid billingMode to FREE (no Stripe call is
//                                ever made), and every Pro feature gate is open.
//   CARD_PRICING_MODE=freemium   opt-in: FREE tier + paid tiers + Pro gates.
//
// The card is a self-serve free tool: people create their own cards, so the
// default is all_free and the wizard reads as "create & publish", never as a
// payment/order. The Stripe code stays intact but is never reached under
// all_free, so flipping back to a paid model is a one-word env change
// (CARD_PRICING_MODE=freemium) — no deploy, no code edit.
//
// Server-only: read process.env here and pass the resolved values down to
// client components as props (never via NEXT_PUBLIC_* duplication, which
// drifts).
//
//   CARD_ANALYTICS_PRO_ONLY=true re-arms the 402 pro_required gate on the
//   owner analytics endpoint. Default is open: basic analytics (views, leads,
//   saves, shares) is table-stakes in this market — every serious competitor
//   ships it free — so we do too unless explicitly told otherwise.
// =============================================================================

import type { CardTemplateDef } from "@/config/card-templates";

export type CardPricingMode = "freemium" | "all_free";

export function getCardPricingMode(): CardPricingMode {
  // Default is all_free — only an explicit `freemium` re-enables paid tiers.
  // Safe-by-default: a preview deploy or fresh env that forgets the var stays
  // free (never shows paid tiles, never hits Stripe) rather than silently
  // exposing a payment step the product no longer has.
  return process.env.CARD_PRICING_MODE === "freemium" ? "freemium" : "all_free";
}

/** True when paid tiers exist at all (freemium). False under all_free. */
export function cardPaymentsEnabled(): boolean {
  return getCardPricingMode() !== "all_free";
}

/**
 * Owner analytics gate. Open by default; closes only when the operator sets
 * CARD_ANALYTICS_PRO_ONLY=true while running freemium. Under all_free every
 * gate is open regardless.
 */
export function analyticsRequiresPro(): boolean {
  if (getCardPricingMode() === "all_free") return false;
  return process.env.CARD_ANALYTICS_PRO_ONLY === "true";
}

// =============================================================================
// Entitlement resolver — the SINGLE server-side point where a card's price is
// decided. The orders API must call this and nothing else to size an order, so
// that the control we want over who pays (and who doesn't) lives in one place.
//
// SEAM: future per-person / per-group / event / date-range / duration /
// setup-fee grants resolve HERE. To add comped access we only extend this
// function (look up an active CardGrant after the all_free short-circuit and
// return reason "grant"); no call site changes.
//
// Deferred CardGrant model (NOT built this round — design only):
//   model CardGrant {
//     id             String   @id @default(cuid())
//     code           String?  @unique        // optional redeemable code
//     scope          GrantScope               // PERSON | GROUP | EVENT | GLOBAL
//     email          String?                  // PERSON scope
//     groupKey       String?                  // GROUP scope (domain, org id…)
//     eventSlug      String?                  // EVENT scope -> ties to Event
//     billingMode    BillingMode?             // tier the grant unlocks (null=any)
//     amountCents    Int?                     // price override (0=free; null=full waiver)
//     waiveSetupFee  Boolean  @default(false)
//     startsAt       DateTime?                // date-range validity
//     endsAt         DateTime?
//     durationDays   Int?                     // grant lifetime once redeemed
//     maxRedemptions Int?
//     redemptions    Int      @default(0)
//     isActive       Boolean  @default(true)
//   }
// Future logic: after the all_free branch, match an active grant by
// email/group/event within its date window -> reason "grant".
// =============================================================================

export type CardBillingMode = "FREE" | "ONE_TIME" | "MONTHLY" | "YEARLY";

export interface EntitlementInput {
  billingMode: CardBillingMode;
  template: CardTemplateDef;
  contactEmail: string;
  eventSlug?: string | null;
  // future: grantCode?: string;
}

export interface ResolvedEntitlement {
  billingMode: CardBillingMode;
  amountCents: number;
  isFree: boolean;
  /** Why this amount was charged — observability + future grant accounting. */
  reason: "all_free" | "tier_price" | "grant";
}

/** Raised when a paid tier is requested for a template that doesn't offer it.
 *  The route maps this to a 400 (the resolver itself never speaks HTTP). */
export class EntitlementError extends Error {
  constructor(public readonly billingMode: CardBillingMode) {
    super(`This template does not offer a ${billingMode.toLowerCase()} plan.`);
    this.name = "EntitlementError";
  }
}

export function resolveCardEntitlement(
  input: EntitlementInput,
): ResolvedEntitlement {
  const { template } = input;

  // all_free: no order may ever reach Stripe, even one submitted from a stale
  // form that still offered paid tiers. Coercing (rather than rejecting) errs
  // in the customer's favor — under all_free every feature is free anyway.
  if (!cardPaymentsEnabled() || input.billingMode === "FREE") {
    return {
      billingMode: "FREE",
      amountCents: 0,
      isFree: true,
      reason: cardPaymentsEnabled() ? "tier_price" : "all_free",
    };
  }

  // SEAM: a CardGrant lookup for input.contactEmail / input.eventSlug would go
  // here, before tier pricing, and return reason "grant" when matched.

  const amountCents =
    input.billingMode === "MONTHLY"
      ? template.monthlyCents
      : input.billingMode === "YEARLY"
        ? template.yearlyCents
        : template.oneTimeCents;

  // ONE_TIME is always present; MONTHLY/YEARLY may be null for a template.
  if (input.billingMode !== "ONE_TIME" && !amountCents) {
    throw new EntitlementError(input.billingMode);
  }

  return {
    billingMode: input.billingMode,
    amountCents: amountCents ?? 0,
    isFree: false,
    reason: "tier_price",
  };
}
