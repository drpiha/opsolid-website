// =============================================================================
// GET /api/v1/discover/suggestions — "people you may know" feed.
//
// Auth: bearer-only (M2 — auth-gated, scoped to the requester so we can
// compute mutual-saved overlap and exclude already-saved cards).
// Response: top 12 PUBLIC cards excluding the requester's own + already-saved.
//
// Scoring (M2 spec):
//   score = 0.3 * normalized_recency
//         + 0.4 * mutual_saved_count_norm
//         + 0.2 * sector_overlap_norm
//         + 0.1 * same_city
//
// Cache: in-memory Map keyed by user id, 60s TTL. The map is process-local —
// fine on the single-Docker-container deploy. At >1k DAU we revisit (move to
// Redis + recompute on save/unsave).
//
// Rate limit: 60/hour/user. Tight so a misbehaving client can't burn DB.
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthError } from "@/lib/auth/require-user";
import { OrderStatus } from "@/lib/validation";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 60;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const CACHE_TTL_MS = 60 * 1000;
const RESULT_LIMIT = 12;
const RECENCY_WINDOW_MS = 60 * 24 * 60 * 60 * 1000; // 60 days

// Scoring weights — tuned in the M2 spec. A card with a maxed-out signal in
// each axis can score at most 1.0; cards with mixed signals interpolate.
const W_RECENCY = 0.3;
const W_MUTUAL = 0.4;
const W_SECTOR = 0.2;
const W_GEO = 0.1;

// Mutual-saved cap. Beyond ~5 mutual contacts, additional ones don't shift
// the ranking — we soft-cap so a user with 30 saved contacts in common with
// every candidate isn't flattened to "everyone scores the same."
const MUTUAL_CAP = 5;
const SECTOR_CAP = 5;

// In-memory cache. Keyed by `${userId}` -> { ts, body }.
// Simple Map; never grows past O(active users) and gets cleaned by TTL on read.
type CacheEntry = { ts: number; body: SuggestionsBody };
const cache = new Map<string, CacheEntry>();

interface SuggestionItem {
  id: string;
  slug: string | null;
  name: string;
  title: string | null;
  company: string | null;
  photoPath: string | null;
  city: string | null;
  country: string | null;
  tags: string[];
  publishedAt: string | null;
  /** Score in [0..1]. Exposed for client-side debugging only — UI ignores it. */
  score: number;
}

interface SuggestionsBody {
  items: SuggestionItem[];
}

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function GET(req: Request) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit(
      "discover:suggestions",
      req,
      user,
      RATE_MAX,
      RATE_WINDOW_MS,
    );
    if (!limit.ok) {
      return applyCors(
        errorJson("rate_limited", "Too many requests.", 429, {
          "Retry-After": String(limit.retryAfterSeconds ?? 60),
        }),
        req,
      );
    }

    // --- Cache hit fast path. ---
    const cached = cache.get(user.id);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      return applyCors(
        NextResponse.json(cached.body, {
          status: 200,
          headers: { "Cache-Control": "private, max-age=60" },
        }),
        req,
      );
    }

    // --- Resolve the requester's "self profile" used for scoring. ---
    // We need: the requester's own card ids (to exclude self), the set of
    // cardOrderIds the requester has saved (mutual overlap + exclude saved),
    // a representative "self city" + "self tags" picked from the requester's
    // most-recent published card.
    const [myCards, mySaved] = await Promise.all([
      prisma.cardOrder.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        select: { id: true, city: true, cardData: true },
      }),
      prisma.savedCard.findMany({
        where: { userId: user.id },
        select: { cardOrderId: true },
      }),
    ]);

    const myCardIds = new Set(myCards.map((c) => c.id));
    const mySavedIds = new Set(mySaved.map((s) => s.cardOrderId));
    // tsconfig target predates Set spread, so build the union explicitly.
    const excludeIds = new Set<string>();
    myCardIds.forEach((id) => excludeIds.add(id));
    mySavedIds.forEach((id) => excludeIds.add(id));

    // Pick the requester's "primary" card (most recently updated) for sector
    // + city overlap. Falls back to any-city when the requester hasn't filled
    // those fields — geo + sector overlap simply contribute 0 in that case.
    const myPrimary = myCards[0] ?? null;
    const myCity = (myPrimary?.city ?? "").trim().toLowerCase();
    const myTags = readTags(myPrimary?.cardData);
    const myTagSet = new Set(myTags);

    // Cold-start guard. If the requester has zero signal — no saved cards,
    // no city set, no tags picked — there's nothing meaningful to score
    // against. Return empty so the mobile rail auto-hides on first install
    // rather than showing what would amount to a "newest cards" feed under
    // a misleading "people you may know" label.
    const hasAnySignal = mySaved.length > 0 || myCity.length > 0 || myTags.length > 0;
    if (!hasAnySignal) {
      const empty: SuggestionsBody = { items: [] };
      cache.set(user.id, { ts: Date.now(), body: empty });
      return applyCors(
        NextResponse.json(empty, {
          status: 200,
          headers: { "Cache-Control": "private, max-age=60" },
        }),
        req,
      );
    }

    // --- Pull the candidate pool. ---
    // Up to ~200 most-recently-published public cards, minus self/saved.
    // We score in JS — at this scale (16-200 candidates) the JS pass is
    // <5ms; pushing the score into SQL would couple us to Postgres-only
    // syntax for negligible win.
    const candidates = await prisma.cardOrder.findMany({
      where: {
        status: OrderStatus.PUBLISHED,
        visibility: "public",
        id: { notIn: Array.from(excludeIds) },
      },
      orderBy: { publishedAt: "desc" },
      take: 200,
      select: {
        id: true,
        slug: true,
        contactName: true,
        photoPath: true,
        city: true,
        country: true,
        publishedAt: true,
        cardData: true,
      },
    });

    if (candidates.length === 0) {
      const body: SuggestionsBody = { items: [] };
      cache.set(user.id, { ts: Date.now(), body });
      return applyCors(
        NextResponse.json(body, {
          status: 200,
          headers: { "Cache-Control": "private, max-age=60" },
        }),
        req,
      );
    }

    // --- Mutual-saved overlap.
    // Find every user-to-card save where the cardOrderId is in our candidate
    // pool — for any candidate that >0 of our saved-card-saver-peers also
    // saved, we get a mutual signal. We approximate "mutual contact" as
    // "another user also saved this candidate AND that other user appears
    // in OUR saved cards". To compute that efficiently in SQL we'd need a
    // recursive join; instead we use a single round-trip to fetch every
    // SavedCard row that targets a candidate, then count how many of those
    // savers are users we ourselves have a saved-card relationship with.
    //
    // Step 1: every (savingUserId, savedCardOrderId) pair touching the pool.
    const candidateIds = candidates.map((c) => c.id);
    const candidateSaves = await prisma.savedCard.findMany({
      where: { cardOrderId: { in: candidateIds } },
      select: { userId: true, cardOrderId: true },
    });

    // Step 2: figure out who I "know" — anyone whose card is in mySaved AND
    // that mapping points back to a userId. This is a single small query.
    const knownUserIds = new Set<string>();
    if (mySaved.length > 0) {
      const knownOwners = await prisma.cardOrder.findMany({
        where: {
          id: { in: Array.from(mySavedIds) },
          userId: { not: null },
        },
        select: { userId: true },
      });
      for (const k of knownOwners) if (k.userId) knownUserIds.add(k.userId);
    }

    // Step 3: count mutual savers per candidate.
    const mutualByCandidate = new Map<string, number>();
    for (const s of candidateSaves) {
      if (knownUserIds.has(s.userId)) {
        mutualByCandidate.set(
          s.cardOrderId,
          (mutualByCandidate.get(s.cardOrderId) ?? 0) + 1,
        );
      }
    }

    // --- Score each candidate. ---
    const now = Date.now();
    const scored: SuggestionItem[] = candidates.map((c) => {
      const data = (c.cardData ?? {}) as Record<string, unknown>;
      const tags = readTags(c.cardData);

      // Recency: linear decay over 60 days, clamped to [0..1]. A card
      // published today scores 1.0; one published 60+ days ago scores 0.
      const ageMs = c.publishedAt
        ? Math.max(0, now - c.publishedAt.getTime())
        : RECENCY_WINDOW_MS;
      const recency = Math.max(0, 1 - ageMs / RECENCY_WINDOW_MS);

      // Mutual: cap at 5 then normalize.
      const mutualCount = mutualByCandidate.get(c.id) ?? 0;
      const mutual = Math.min(mutualCount, MUTUAL_CAP) / MUTUAL_CAP;

      // Sector overlap: count of tags in common, capped at 5.
      let overlap = 0;
      for (const t of tags) if (myTagSet.has(t)) overlap += 1;
      const sector = Math.min(overlap, SECTOR_CAP) / SECTOR_CAP;

      // Geo: 1 when same city, 0 otherwise (case-insensitive trim compare).
      const cTheirCity = (c.city ?? "").trim().toLowerCase();
      const geo = myCity && cTheirCity && myCity === cTheirCity ? 1 : 0;

      const score =
        W_RECENCY * recency +
        W_MUTUAL * mutual +
        W_SECTOR * sector +
        W_GEO * geo;

      return {
        id: c.id,
        slug: c.slug,
        name: c.contactName,
        title: typeof data.title === "string" ? data.title : null,
        company: typeof data.company === "string" ? data.company : null,
        photoPath: c.photoPath,
        city: c.city,
        country: c.country,
        tags,
        publishedAt: c.publishedAt?.toISOString() ?? null,
        score,
      };
    });

    // Sort by score DESC, drop any with score === 0 (no signal at all),
    // then take top RESULT_LIMIT.
    const ranked = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, RESULT_LIMIT);

    const body: SuggestionsBody = { items: ranked };
    cache.set(user.id, { ts: Date.now(), body });

    return applyCors(
      NextResponse.json(body, {
        status: 200,
        headers: { "Cache-Control": "private, max-age=60" },
      }),
      req,
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return applyCors(
        errorJson(err.code, "Authentication required.", err.status),
        req,
      );
    }
    console.error("[v1/discover/suggestions] failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}

/** Read the tags array from cardData defensively, dropping any non-strings. */
function readTags(cardData: unknown): string[] {
  if (!cardData || typeof cardData !== "object") return [];
  const tags = (cardData as Record<string, unknown>).tags;
  if (!Array.isArray(tags)) return [];
  return tags.filter((t): t is string => typeof t === "string");
}
