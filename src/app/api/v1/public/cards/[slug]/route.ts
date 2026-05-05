// =============================================================================
// GET /api/v1/public/cards/[slug] — public, unauthenticated card read.
//
// Returns the card payload only when status === PUBLISHED. Used by share
// screens, scanner consumers, and 3rd-party indexers.
//
// Caching: `Cache-Control: public, max-age=60` — fresh enough that owner
// edits propagate quickly, slow enough to absorb scan bursts (NFC tap on a
// crowded event etc).
//
// Rate limit: 120 / hour / IP (per-anon traffic is light, but absent any
// limit a single misbehaving consumer could hammer this).
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/lib/validation";
import { errorJson } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";
import { CARD_API_SELECT, toPublicApiCard } from "@/lib/api/v1/card-mapping";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SLUG_RE = /^[a-z0-9-]{3,60}$/;
const RATE_MAX = 120;
const RATE_WINDOW_MS = 60 * 60 * 1000;

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
) {
  const limit = rateLimit("public-card", req, null, RATE_MAX, RATE_WINDOW_MS);
  if (!limit.ok) {
    return applyCors(
      errorJson("rate_limited", "Too many requests.", 429, {
        "Retry-After": String(limit.retryAfterSeconds ?? 60),
      }),
      req,
    );
  }

  if (!SLUG_RE.test(params.slug)) {
    return applyCors(errorJson("not_found", "Card not found.", 404), req);
  }

  const card = await prisma.cardOrder.findUnique({
    where: { slug: params.slug },
    select: CARD_API_SELECT,
  });
  if (!card || card.status !== OrderStatus.PUBLISHED) {
    return applyCors(errorJson("not_found", "Card not found.", 404), req);
  }

  // Phase 8.1 — visibility enforcement.
  // "private" cards are owner-only; all other callers receive a 404 so the
  // existence of the slug is not leaked. "unlisted" cards are accessible by
  // direct link (this endpoint) but excluded from discovery — no change here.
  if (card.visibility === 'private') {
    return applyCors(errorJson("not_found", "Card not found.", 404), req);
  }

  return applyCors(
    NextResponse.json(
      { card: toPublicApiCard(card) },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
        },
      },
    ),
    req,
  );
}
