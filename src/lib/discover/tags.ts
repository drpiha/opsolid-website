// =============================================================================
// M2 — Discover sector/topic tags. Canonical list.
//
// Tag slugs are intentionally English-only and lowercase-kebab — they ride
// through the network as stable identifiers. The user-facing display label
// is a separate concern handled in the locale files (`tags.<slug>`).
//
// 24 curated sectors selected to cover the DACH solo / SMB market without
// being so granular that every card picks something different. The picker UI
// also accepts free-form custom tags (still kebab-case, ≤24 chars) so power
// users aren't capped by the menu.
//
// IMPORTANT: do NOT remove a slug after release — existing cards reference
// these by string. Append-only is the only safe edit pattern. To "remove"
// a sector visually, drop it from the locale labels and from the discover
// chip strip; the underlying tag string survives untouched.
// =============================================================================

export const CURATED_TAG_SLUGS = [
  "tech",
  "design",
  "architecture",
  "hospitality",
  "health",
  "legal",
  "finance",
  "coaching",
  "marketing",
  "engineering",
  "education",
  "art",
  "music",
  "food",
  "fitness",
  "realestate",
  "consulting",
  "freelance",
  "startup",
  "enterprise",
  "nonprofit",
  "government",
  "agriculture",
  "craft",
] as const;

export type CuratedTagSlug = (typeof CURATED_TAG_SLUGS)[number];

const CURATED_TAG_SET: ReadonlySet<string> = new Set(CURATED_TAG_SLUGS);

/** Format check: lowercase, hyphens only, 1–24 chars, leading char must be a letter. */
const TAG_SLUG_RE = /^[a-z][a-z0-9-]{0,23}$/;

/**
 * Normalize an input string into a kebab-case tag slug or return null if it
 * cannot be coerced into the allowed shape. Used for owner-side custom tags.
 */
export function normalizeTagSlug(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  if (!cleaned) return null;
  if (!TAG_SLUG_RE.test(cleaned)) return null;
  return cleaned;
}

/** True iff the slug is one of the curated sector tags (drives chip-strip rendering). */
export function isCuratedTag(slug: string): boolean {
  return CURATED_TAG_SET.has(slug);
}

/** Owner-side cap: at most 5 tags per card. */
export const MAX_TAGS_PER_CARD = 5;
