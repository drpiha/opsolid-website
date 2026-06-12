// =============================================================================
// Card pricing-mode configuration — the single switch that decides whether
// the card product runs as a freemium business or a fully free tool.
//
//   CARD_PRICING_MODE=freemium   (default) FREE tier + paid tiers + Pro gates
//   CARD_PRICING_MODE=all_free   everything free: paid tiers hidden in the
//                                order form, the orders API coerces any paid
//                                billingMode to FREE (no Stripe call is ever
//                                made), and every Pro feature gate is open.
//
// Server-only: read process.env here and pass the resolved values down to
// client components as props (never via NEXT_PUBLIC_* duplication, which
// drifts). Flipping the mode requires only an env change + restart — no
// deploy, no code edit, no Stripe reconfiguration.
//
//   CARD_ANALYTICS_PRO_ONLY=true re-arms the 402 pro_required gate on the
//   owner analytics endpoint. Default is open: basic analytics (views, leads,
//   saves, shares) is table-stakes in this market — every serious competitor
//   ships it free — so we do too unless explicitly told otherwise.
// =============================================================================

export type CardPricingMode = "freemium" | "all_free";

export function getCardPricingMode(): CardPricingMode {
  return process.env.CARD_PRICING_MODE === "all_free" ? "all_free" : "freemium";
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
