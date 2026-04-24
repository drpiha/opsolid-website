import { prisma } from "@/lib/prisma";

/**
 * Produces a URL-safe slug from a display name, appending a short random
 * suffix for uniqueness. Example: "Anna Fischer" -> "anna-fischer-x7k"
 */
export function buildSlug(name: string, seed?: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  const suffix =
    seed?.slice(-4) ??
    Math.random().toString(36).replace(/[^a-z0-9]/g, "").slice(-4);

  const core = base || "card";
  return `${core}-${suffix}`;
}

/**
 * Generate a slug from `name` and verify it doesn't collide with any existing
 * `CardOrder.slug`. On collision, regenerate with a fresh random suffix —
 * the suffix space (4 base36 chars = 1.6M combinations) makes collisions
 * vanishingly rare even with millions of cards sharing the same display name.
 *
 * Used by:
 *   • Stripe webhook on self-serve auto-publish (conciergeAddon=false)
 *   • Admin publish endpoint when a designer manually publishes a concierge
 *     order
 *
 * Throws after MAX_RETRIES so a runaway loop in the unlikely event of a DB-
 * wide collision storm becomes observable instead of hanging the request.
 */
const MAX_SLUG_RETRIES = 6;

export async function ensureUniqueSlug(
  name: string,
  seed?: string
): Promise<string> {
  for (let attempt = 0; attempt < MAX_SLUG_RETRIES; attempt++) {
    // Pass `seed` only on the first try — subsequent retries should re-roll
    // the suffix to actually have a chance of resolving the collision.
    const slug = buildSlug(name, attempt === 0 ? seed : undefined);
    const existing = await prisma.cardOrder.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing) return slug;
  }
  throw new Error(
    `Failed to generate unique slug for "${name}" after ${MAX_SLUG_RETRIES} attempts`
  );
}
