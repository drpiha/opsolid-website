// =============================================================================
// GET /api/v1/share-events/summary — last-30-days share telemetry for the
// authenticated user's published cards.
//
// Auth: bearer-only.
// Rate limit: 60 / hour / user.
//
// Response:
//   { totals: { qr, link, nfc, native_share }, total, days: 30 }
//
// Implementation: groupBy on (channel) over the user's card ids, with a
// single createdAt >= cutoff filter. Postgres uses the
// (sourceCardId, createdAt) index for the IN-list scan + range filter.
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthError } from "@/lib/auth/require-user";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 60;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const WINDOW_DAYS = 30;
const SHARE_CHANNELS = ["qr", "link", "nfc", "native_share"] as const;

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function GET(req: Request) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit(
      "share-events:summary",
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

    const ownedCards = await prisma.cardOrder.findMany({
      where: { userId: user.id },
      select: { id: true },
    });
    const ownedIds = ownedCards.map((c) => c.id);

    const totals: Record<string, number> = {
      qr: 0,
      link: 0,
      nfc: 0,
      native_share: 0,
    };

    if (ownedIds.length > 0) {
      const cutoff = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000);
      const grouped = await prisma.shareEvent.groupBy({
        by: ["channel"],
        where: {
          sourceCardId: { in: ownedIds },
          createdAt: { gte: cutoff },
        },
        _count: { _all: true },
      });
      for (const row of grouped) {
        if ((SHARE_CHANNELS as readonly string[]).includes(row.channel)) {
          totals[row.channel] = row._count._all;
        }
      }
    }

    const total = Object.values(totals).reduce((a, b) => a + b, 0);

    return applyCors(
      NextResponse.json(
        { totals, total, days: WINDOW_DAYS },
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
    console.error("[v1/share-events/summary] failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}
