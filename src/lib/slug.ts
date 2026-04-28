import { prisma } from "@/lib/prisma";

const SLUG_MIN = 3;
const SLUG_MAX = 40;

/**
 * Phase 8 — slug a free-form string the same way `buildSlug()` does its base
 * pass, without appending a uniqueness suffix. Used both as a normalizer for
 * customer-typed slug input and as the building block for `buildSlug()`.
 */
export function normalizeSlugBase(input: string): string {
  return input
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
    .slice(0, SLUG_MAX);
}

/**
 * Validate a customer-typed manual slug. Returns either { ok: true, slug }
 * (with the normalized form) or { ok: false, reason } where reason is a short
 * machine-readable code the API can map to a localized message.
 */
export type SlugValidation =
  | { ok: true; slug: string }
  | { ok: false; reason: "too_short" | "too_long" | "invalid_chars" | "reserved" };

const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "card",
  "edit",
  "preview",
  "wallet",
  "qr",
  "vcard",
  "lead",
  "contribute",
  "checkout",
  "stripe",
  "webhooks",
  "uploads",
  "favicon",
  "robots",
  "sitemap",
]);

export function validateManualSlug(input: string): SlugValidation {
  const normalized = normalizeSlugBase(input);
  if (normalized.length < SLUG_MIN) return { ok: false, reason: "too_short" };
  if (normalized.length > SLUG_MAX) return { ok: false, reason: "too_long" };
  if (!/^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/.test(normalized)) {
    return { ok: false, reason: "invalid_chars" };
  }
  if (RESERVED_SLUGS.has(normalized)) return { ok: false, reason: "reserved" };
  return { ok: true, slug: normalized };
}

/**
 * Check whether a given (already-validated) slug is unique in CardOrder.
 * Returns true when free.
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const existing = await prisma.cardOrder.findUnique({
    where: { slug },
    select: { id: true },
  });
  return !existing;
}

interface BuildSlugOptions {
  /** When true, no random suffix is appended — used for customer-typed slugs. */
  allowBare?: boolean;
}

/**
 * Produces a URL-safe slug from a display name, appending a short random
 * suffix for uniqueness. Example: "Anna Fischer" -> "anna-fischer-x7k".
 *
 * Pass `{ allowBare: true }` to skip the suffix when the caller has already
 * validated uniqueness (e.g. customer-chosen slug from the order form).
 */
export function buildSlug(
  name: string,
  seed?: string,
  opts: BuildSlugOptions = {},
): string {
  const base = normalizeSlugBase(name);
  const core = base || "card";
  if (opts.allowBare) return core;

  const suffix =
    seed?.slice(-4) ??
    Math.random().toString(36).replace(/[^a-z0-9]/g, "").slice(-4);

  return `${core}-${suffix}`;
}

/**
 * Generate a slug from `name` that is unique in CardOrder.
 *
 * Strategy (in order):
 *   1. Try the bare normalized name: "anna-fischer"
 *   2. Try numeric suffixes: "anna-fischer-2", "anna-fischer-3", …
 *   3. Fall back to a random 4-char base36 suffix after 8 numeric attempts
 *
 * This keeps auto-generated slugs clean and human-readable while still
 * guaranteeing uniqueness.
 */
const MAX_SLUG_RETRIES = 8;

export async function ensureUniqueSlug(
  name: string,
  seed?: string
): Promise<string> {
  const base = normalizeSlugBase(name) || "card";

  // First attempt: bare name (no suffix)
  const bare = base;
  if (!(await prisma.cardOrder.findUnique({ where: { slug: bare }, select: { id: true } }))) {
    return bare;
  }

  // Numeric suffixes: anna-fischer-2, -3, …
  for (let n = 2; n <= MAX_SLUG_RETRIES; n++) {
    const slug = `${base}-${n}`;
    if (!(await prisma.cardOrder.findUnique({ where: { slug }, select: { id: true } }))) {
      return slug;
    }
  }

  // Last resort: random 4-char base36 (same as before, handles extreme collision)
  const suffix =
    seed?.slice(-4) ??
    Math.random().toString(36).replace(/[^a-z0-9]/g, "").slice(-4);
  return `${base}-${suffix}`;
}
