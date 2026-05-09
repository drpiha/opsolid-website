// =============================================================================
// GET /api/v1/events — public, unauthenticated event list.
//
// Returns up to 50 active events, ordered by startAt asc. The list filters out
// events whose endAt is more than 1 day in the past (so just-finished events
// stay visible for ~24h before they self-expire from the feed). Authenticated
// or not — same response.
//
// Caching: `Cache-Control: public, max-age=120` — events change rarely.
// Rate limit: 120 / hour / IP — generous; the mobile Discover rail polls this
// every cold start.
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorJson } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 120;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const PAST_GRACE_MS = 24 * 60 * 60 * 1000;

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function GET(req: Request) {
  const limit = rateLimit("events:list", req, null, RATE_MAX, RATE_WINDOW_MS);
  if (!limit.ok) {
    return applyCors(
      errorJson("rate_limited", "Too many requests.", 429, {
        "Retry-After": String(limit.retryAfterSeconds ?? 60),
      }),
      req,
    );
  }

  const cutoff = new Date(Date.now() - PAST_GRACE_MS);

  const events = await prisma.event.findMany({
    where: {
      isActive: true,
      endAt: { gte: cutoff },
    },
    orderBy: { startAt: "asc" },
    take: 50,
    select: {
      id: true,
      slug: true,
      name: true,
      city: true,
      country: true,
      venue: true,
      startAt: true,
      endAt: true,
      description: true,
      coverPath: true,
      _count: { select: { attendees: true } },
    },
  });

  const items = events.map((e) => ({
    id: e.id,
    slug: e.slug,
    name: e.name,
    city: e.city,
    country: e.country,
    venue: e.venue,
    startAt: e.startAt.toISOString(),
    endAt: e.endAt.toISOString(),
    description: e.description,
    coverPath: e.coverPath,
    attendeeCount: e._count.attendees,
  }));

  return applyCors(
    NextResponse.json(
      { items },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=120, s-maxage=120, stale-while-revalidate=600",
        },
      },
    ),
    req,
  );
}
