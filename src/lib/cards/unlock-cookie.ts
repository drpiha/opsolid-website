// =============================================================================
// M5 — password-protected card unlock cookie helpers.
//
// The unlock cookie is set by POST /api/cards/[slug]/unlock and read by the
// public viewer SSR (`src/app/c/[slug]/page.tsx`). Single-source-of-truth
// helper here so both sides agree on the name format.
// =============================================================================

export function unlockCookieName(slug: string): string {
  // Slug regex is [a-z0-9-]+; safe in cookie names. Cap to 60 chars to be
  // defensive against a future schema change that allows longer slugs.
  return `verso_unlock_${slug.slice(0, 60)}`;
}

export const UNLOCK_COOKIE_MAX_AGE_S = 24 * 60 * 60;
