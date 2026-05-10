// =============================================================================
// M5 — Pro tier helper.
//
// Single source of truth for "is this user a Pro subscriber?". Reads the
// denormalised `User.proSince` mirror that the Stripe webhook flips on
// active/cancelled. Never read `userSubscription.status` from feature gates
// directly — the mirror lets a card-create check stay a single column read.
//
// Free tier: 1 published/active card, all 96 templates, basic analytics.
// Pro tier:  up to 5 cards + custom domain + advanced analytics + HTML
//            export + tip jar + password protection.
//
// Pricing: €7/mo or €60/yr (28% saving). Both Stripe-managed.
// =============================================================================

const FREE_TIER_CARD_LIMIT = 1;
const PRO_TIER_CARD_LIMIT = 5;

/**
 * Resolve effective Pro status for a user.
 *
 * Two sources flip a user to Pro:
 *  - proSince column (Stripe webhook + admin grant + promo redeem all write here)
 *  - role === 'ADMIN' — operators always have Pro features so they can test/
 *    support without a Stripe subscription. Admin status is granted manually
 *    via scripts/seed-admin.ts and is not transient.
 *
 * Both reads are denormalised on the User row, so this stays a single column
 * read inside the request transaction.
 */
export function isPro(user: {
  proSince: Date | null;
  role?: string | null;
}): boolean {
  if (user.role === "ADMIN") return true;
  return user.proSince !== null && user.proSince <= new Date();
}

/**
 * Cap on active (non-cancelled, non-soft-deleted) cards a user can have.
 * Read by the gate in `POST /api/v1/cards`.
 */
export function cardLimitForUser(user: {
  proSince: Date | null;
  role?: string | null;
}): number {
  return isPro(user) ? PRO_TIER_CARD_LIMIT : FREE_TIER_CARD_LIMIT;
}

export const FREE_TIER_LIMIT = FREE_TIER_CARD_LIMIT;
export const PRO_TIER_LIMIT = PRO_TIER_CARD_LIMIT;
