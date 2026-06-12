// =============================================================================
// GET /api/v1/cards/[id]/analytics — 30-day analytics for a single card.
//
// Auth: bearer-only. Authorization: card.userId === user.id (owner only).
// Gate: free by default; CARD_ANALYTICS_PRO_ONLY=true re-arms the 402
// `pro_required` response for free-tier users — the upgrade CTA in the
// mobile UI catches this and opens the paywall.
//
// Aggregates over CardView, CardLead, SavedCard, ShareEvent. The numbers are
// owner-private CRM data; we never expose them on the public viewer.
// Rate limit: 30 / hour / user.
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthError } from "@/lib/auth/require-user";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";
import { isPro } from "@/lib/auth/pro";
import { analyticsRequiresPro } from "@/lib/billing/plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const WINDOW_DAYS = 30;
const SHARE_CHANNELS = ["qr", "link", "nfc", "native_share"] as const;

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireBearerUser(req);

    // Basic owner analytics is free by default (market table-stakes). The
    // 402 gate only arms when the operator sets CARD_ANALYTICS_PRO_ONLY=true,
    // and never under CARD_PRICING_MODE=all_free.
    if (analyticsRequiresPro() && !isPro(user)) {
      return applyCors(
        errorJson("pro_required", "Pro subscription required.", 402),
        req,
      );
    }

    const limit = rateLimit(
      "cards:analytics",
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

    const card = await prisma.cardOrder.findFirst({
      where: { id: params.id, userId: user.id },
      select: { id: true, slug: true },
    });
    if (!card) {
      return applyCors(
        errorJson("card_not_found", "Card not found.", 404),
        req,
      );
    }

    const cutoff = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000);

    const [views, leads, saves, shareGroups] = await Promise.all([
      // Total views in window.
      prisma.cardView.count({
        where: { orderId: card.id, createdAt: { gte: cutoff } },
      }),
      // Leads count.
      prisma.cardLead.count({
        where: { orderId: card.id, createdAt: { gte: cutoff } },
      }),
      // Distinct users who saved this card (mutual-saves not differentiated;
      // SavedCard is the canonical "saved by user" model).
      prisma.savedCard.count({
        where: { cardOrderId: card.id, createdAt: { gte: cutoff } },
      }),
      // Share events grouped by channel.
      prisma.shareEvent.groupBy({
        by: ["channel"],
        where: { sourceCardId: card.id, createdAt: { gte: cutoff } },
        _count: { _all: true },
      }),
    ]);

    // Distinct visitors = unique (UA prefix + country) hash. Postgres distinct
    // on a generated key is a single query but Prisma's groupBy across two
    // nullable columns is awkward; do it in app code over a small per-card
    // result set (CardView already lives behind the index on (orderId, createdAt)).
    const recentViews = await prisma.cardView.findMany({
      where: { orderId: card.id, createdAt: { gte: cutoff } },
      select: { ua: true, country: true, city: true, referer: true },
      // Cap defense — at very high volume this can still be 5-figure rows;
      // we only need an approximate count, so a 5000-row sample is plenty.
      take: 5000,
    });
    const uniqueVisitors = new Set<string>();
    for (const v of recentViews) {
      // Approximate visitor key: UA prefix + country + city. The ScanEvent
      // table carries a real ipHash; CardView doesn't, so we fall back to
      // these noisy proxies. v2 should backfill an ipHash column on
      // CardView so this number stops being a soft estimate.
      const key = `${(v.ua ?? "").slice(0, 60)}|${v.country ?? ""}|${v.city ?? ""}`;
      uniqueVisitors.add(key);
    }

    // Mutual saves — count saves where the saving user is also the owner of
    // a card the requester has saved. Approximation: a SavedCard with
    // status="pending_mutual" or where we have a reciprocal SavedCard row.
    // For v1 we surface the simple count; v2 can join properly.
    const mutualSaves = await prisma.savedCard.count({
      where: {
        cardOrderId: card.id,
        createdAt: { gte: cutoff },
        OR: [
          { status: "pending_mutual" },
          { referredByUserId: { not: null } },
        ],
      },
    });

    const sharesByChannel: Record<string, number> = {
      qr: 0,
      link: 0,
      nfc: 0,
      native_share: 0,
    };
    for (const row of shareGroups) {
      if ((SHARE_CHANNELS as readonly string[]).includes(row.channel)) {
        sharesByChannel[row.channel] = row._count._all;
      }
    }
    const sharesTotal = Object.values(sharesByChannel).reduce(
      (a, b) => a + b,
      0,
    );

    return applyCors(
      NextResponse.json(
        {
          cardId: card.id,
          slug: card.slug,
          windowDays: WINDOW_DAYS,
          totals: {
            views,
            uniqueVisitors: uniqueVisitors.size,
            leads,
            saves,
            mutualSaves,
            shares: sharesTotal,
          },
          shareEventsByChannel: sharesByChannel,
        },
        { status: 200, headers: { "Cache-Control": "no-store" } },
      ),
      req,
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return applyCors(
        errorJson(err.code, "Authentication required.", err.status),
        req,
      );
    }
    console.error("[v1/cards/:id/analytics] failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}
