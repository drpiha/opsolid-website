// M2 — Discover sector / topic tags (mobile mirror).
//
// Mirrors `src/lib/discover/tags.ts` on the server. Slugs are the
// network-stable English identifiers; display labels live in `locale.ts`
// under `tags.<slug>`. Custom tags (free-form kebab-case) are also accepted
// in the picker — same `normalizeTagSlug` guard runs both sides.
//
// IMPORTANT: keep this list in sync with the server file. The server does NOT
// reject unknown tag slugs (so an old client can keep adding `someUnknownTag`
// without the server failing the PATCH); the chip strip on Discover only
// renders the curated set, but custom tags still match cards via `?tag=`.

export const CURATED_TAG_SLUGS = [
  'tech',
  'design',
  'architecture',
  'hospitality',
  'health',
  'legal',
  'finance',
  'coaching',
  'marketing',
  'engineering',
  'education',
  'art',
  'music',
  'food',
  'fitness',
  'realestate',
  'consulting',
  'freelance',
  'startup',
  'enterprise',
  'nonprofit',
  'government',
  'agriculture',
  'craft',
] as const;

export type CuratedTagSlug = (typeof CURATED_TAG_SLUGS)[number];

const TAG_SLUG_RE = /^[a-z][a-z0-9-]{0,23}$/;

/** Normalize a free-form input into a kebab-case tag, or null if invalid. */
export function normalizeTagSlug(input: string): string | null {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24);
  if (!cleaned) return null;
  if (!TAG_SLUG_RE.test(cleaned)) return null;
  return cleaned;
}

export const MAX_TAGS_PER_CARD = 5;
