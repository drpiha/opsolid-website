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
} as const;

export type ApiCardRow = Pick<
  CardOrder,
  keyof typeof CARD_API_SELECT
>;

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
    cardData: row.cardData,
    brandPrimaryHex: row.brandPrimaryHex,
    brandAccentHex: row.brandAccentHex,
    photoPath: row.photoPath,
    logoPath: row.logoPath,
    qrStyle: row.qrStyle,
    videoUrl: row.videoUrl,
    visibility: row.visibility,
    feedbackEnabled: row.feedbackEnabled,
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
    cardData: row.cardData,
    brandPrimaryHex: row.brandPrimaryHex,
    brandAccentHex: row.brandAccentHex,
    photoPath: row.photoPath,
    logoPath: row.logoPath,
    publishedAt: row.publishedAt?.toISOString() ?? null,
  };
}
