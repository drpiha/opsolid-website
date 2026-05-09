// =============================================================================
// /api/v1/* — card serialization.
//
// CardOrder is an internal-shaped row: it carries Stripe IDs, status history
// pointers, billing details, and other fields that have no business in the
// public API contract. `toApiCard` strips it down to a stable, well-named
// shape mobile / 3rd-party clients can rely on.
//
// Design rule: every field returned here MUST stay backward-compatible. Add
// new fields freely; never rename or remove without a /v2 bump.
// =============================================================================

import type { CardOrder } from "@/generated/prisma";

/**
 * The subset of CardOrder we need for serialization. Selecting only these
 * fields at the DB layer keeps wire size + memory bounded.
 *
 * Note: nested `attendingEvents` is a relation include, not a column. The
 * generated row shape gains `attendingEvents: { eventId: string }[]` which
 * `toApiCard` flattens into `attendingEventIds`.
 */
export const CARD_API_SELECT = {
  id: true,
  slug: true,
  status: true,
  templateId: true,
  layoutKey: true,
  themeKey: true,
  cardData: true,
  brandPrimaryHex: true,
  brandAccentHex: true,
  photoPath: true,
  logoPath: true,
  qrStyle: true,
  videoUrl: true,
  desiredSlug: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  // Phase 8.1 — needed for visibility enforcement in public API + page route
  visibility: true,
  // Phase 8.4 — exposed on owner GET so the mobile edit form can hydrate the
  // toggle. Stays out of toPublicApiCard (visitors infer it from /feedback GET).
  feedbackEnabled: true,
  // Sprint F2 — currently-attending events. Owner-only on the wire (we strip
  // it in toPublicApiCard). Mobile edit form pre-fills the EventsAttendingSection
  // chip multi-select from this array.
  attendingEvents: { select: { eventId: true } },
} as const;

// `Pick` from CardOrder doesn't capture relation includes; merge the relation
// shape in explicitly so consumers see `attendingEvents` typed correctly.
export type ApiCardRow = Pick<
  CardOrder,
  Exclude<keyof typeof CARD_API_SELECT, "attendingEvents">
> & {
  attendingEvents: { eventId: string }[];
};

export interface ApiCard {
  id: string;
  slug: string | null;
  status: string;
  templateId: number;
  layoutKey: string | null;
  themeKey: string | null;
  cardData: unknown;
  brandPrimaryHex: string | null;
  brandAccentHex: string | null;
  photoPath: string | null;
  logoPath: string | null;
  qrStyle: unknown;
  videoUrl: string | null;
  visibility: string;
  feedbackEnabled: boolean;
  /** Sprint F2 — events this card is currently attending. Owner-only. */
  attendingEventIds: string[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function toApiCard(row: ApiCardRow): ApiCard {
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    templateId: row.templateId,
    layoutKey: row.layoutKey,
    themeKey: row.themeKey,
    cardData: redactCardDataForOwner(row.cardData),
    brandPrimaryHex: row.brandPrimaryHex,
    brandAccentHex: row.brandAccentHex,
    photoPath: row.photoPath,
    logoPath: row.logoPath,
    qrStyle: row.qrStyle,
    videoUrl: row.videoUrl,
    visibility: row.visibility,
    feedbackEnabled: row.feedbackEnabled,
    attendingEventIds: (row.attendingEvents ?? []).map((a) => a.eventId),
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

/**
 * Public-facing (unauthenticated) card shape. Subset of ApiCard with internal
 * IDs stripped — only what a card scanner / share-screen consumer needs.
 */
export interface PublicApiCard {
  slug: string;
  status: string;
  templateId: number;
  layoutKey: string | null;
  themeKey: string | null;
  cardData: unknown;
  brandPrimaryHex: string | null;
  brandAccentHex: string | null;
  photoPath: string | null;
  logoPath: string | null;
  publishedAt: string | null;
}

export function toPublicApiCard(row: ApiCardRow): PublicApiCard {
  return {
    slug: row.slug ?? "",
    status: row.status,
    templateId: row.templateId,
    layoutKey: row.layoutKey,
    themeKey: row.themeKey,
    cardData: stripSensitiveFromCardData(row.cardData),
    brandPrimaryHex: row.brandPrimaryHex,
    brandAccentHex: row.brandAccentHex,
    photoPath: row.photoPath,
    logoPath: row.logoPath,
    publishedAt: row.publishedAt?.toISOString() ?? null,
  };
}

/**
 * Public callers must never receive ESP API keys / webhook tokens stored on
 * `cardData.contactForm.esps.*`. Owners see those fields on the bearer-auth
 * GET because they're the ones who configured them; everyone else gets a
 * sanitized clone with the secrets dropped.
 */
function stripSensitiveFromCardData(cardData: unknown): unknown {
  if (!cardData || typeof cardData !== "object") return cardData;
  const cd = cardData as Record<string, unknown>;
  // M5 — never expose the password hash on public reads. Replace with the
  // boolean `passwordSet` so the public viewer can decide whether to render
  // the lock screen.
  const out: Record<string, unknown> = { ...cd };
  if ("password" in out) {
    out.passwordSet =
      typeof out.password === "string" && (out.password as string).length > 0;
    delete out.password;
  }

  const cf = out.contactForm as Record<string, unknown> | undefined;
  if (cf && typeof cf === "object") {
    const esps = cf.esps as Record<string, unknown> | undefined;
    if (esps) {
      // Build a sanitized esps object — keep the presence flags (so the
      // public viewer can render the form) but never echo apiKey / webhook URL.
      const sanitizedEsps: Record<string, unknown> = {};
      for (const provider of Object.keys(esps)) {
        const v = esps[provider];
        if (!v || typeof v !== "object") continue;
        const cfg = v as Record<string, unknown>;
        const safe: Record<string, unknown> = {};
        for (const [k, val] of Object.entries(cfg)) {
          if (k === "apiKey" || k === "url") continue;
          safe[k] = val;
        }
        sanitizedEsps[provider] = safe;
      }
      out.contactForm = { ...cf, esps: sanitizedEsps };
    }
  }
  return out;
}

/**
 * M5 — owner-side cardData redaction. The owner can read everything they
 * configured EXCEPT the raw password hash. We replace `password` with
 * `passwordSet: boolean` so the edit form can render "(password set — change?)".
 * If the owner wants to clear or change the password they POST a fresh plain
 * string; the existing hash never round-trips client-side.
 */
function redactCardDataForOwner(cardData: unknown): unknown {
  if (!cardData || typeof cardData !== "object") return cardData;
  const cd = cardData as Record<string, unknown>;
  if (!("password" in cd)) return cd;
  const out: Record<string, unknown> = { ...cd };
  out.passwordSet = typeof cd.password === "string" && (cd.password as string).length > 0;
  delete out.password;
  return out;
}
