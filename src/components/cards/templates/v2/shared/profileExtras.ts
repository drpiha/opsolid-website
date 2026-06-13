// =============================================================================
// profileExtras — resolvers for the owner-editable profile extras (stats,
// tagline, location chip). Server-safe, no React.
//
// Contract (2026-06 hardcoded-data purge): templates NEVER invent display
// data. Every resolver returns `null` when the owner provided nothing, and
// the template renders nothing in that case. Literal fallbacks like
// `|| "Berlin"` or `|| "Walker & Stein"` are banned — the coverage audit
// (scripts/audit-template-coverage.ts) fails the build if they reappear.
// =============================================================================

import type { CardData, CardStat } from "@/lib/validation";

/** Normalizes the owner's stats list. Returns null when there is nothing to
 *  render so templates can `{stats && (...)}` their bespoke markup. */
export function resolveStats(stats: CardData["stats"]): CardStat[] | null {
  if (!stats || stats.length === 0) return null;
  const cleaned = stats.filter((s) => s.value.trim() && s.label.trim());
  return cleaned.length > 0 ? cleaned : null;
}

/** Claim line under the name. Owner tagline wins; otherwise fall back to
 *  real profile data (position, then title) — never to template copy. */
export function resolveTagline(cardData: CardData): string | null {
  return (
    cardData.tagline?.trim() ||
    cardData.position?.trim() ||
    cardData.title?.trim() ||
    null
  );
}

/** Last comma-segment of the address ("Hauptstr. 1, 10115 Berlin" → "10115
 *  Berlin" → digits stripped → "Berlin"). Exported for templates that derive
 *  a city chip from the address. */
export function lastAddressSegment(address: string | undefined): string | null {
  if (!address) return null;
  const seg = address.split(",").pop()?.trim().replace(/^\d{4,5}\s*/, "");
  return seg || null;
}

/** Location chip text. Priority: owner override > city derived from address
 *  > nothing. `hideLocation` suppresses the chip entirely. */
export function resolveLocation(cardData: CardData): string | null {
  if (cardData.hideLocation) return null;
  return cardData.location?.trim() || lastAddressSegment(cardData.address);
}
