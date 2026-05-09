// =============================================================================
// GET /api/v1/events/[slug] — public event detail + attendee roster.
//
// Returns the event metadata plus an `attendees` array shaped like
// `toPublicApiCard` so the mobile detail screen can reuse the same renderer
// pieces it uses on the Discover viewer. Privacy semantics match the public
// card endpoint: only PUBLISHED + non-private cards are listed; cancelled or
// private cards are silently filtered out.
//
// 404 (not 410) for inactive or past-by-more-than-a-day events so consumers
// can't enumerate the catalog.
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

const SLUG_RE = /^[a-z0-9-]{3,80}$/;
const RATE_MAX = 120;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const PAST_GRACE_MS = 24 * 60 * 60 * 1000;

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
) {
  const limit = rateLimit("events:detail", req, null, RATE_MAX, RATE_WINDOW_MS);
  if (!limit.ok) {
    return applyCors(
      errorJson("rate_limited", "Too many requests.", 429, {
        "Retry-After": String(limit.retryAfterSeconds ?? 60),
      }),
      req,
    );
  }

  if (!SLUG_RE.test(params.slug)) {
    return applyCors(errorJson("not_found", "Event not found.", 404), req);
  }

  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
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
      isActive: true,
      attendees: {
        select: {
          card: {
            select: CARD_API_SELECT,
          },
        },
      },
    },
  });

  if (!event || !event.isActive) {
    return applyCors(errorJson("not_found", "Event not found.", 404), req);
  }

  const cutoff = new Date(Date.now() - PAST_GRACE_MS);
  if (event.endAt < cutoff) {
    return applyCors(errorJson("not_found", "Event not found.", 404), req);
  }

  const attendees = event.attendees
    .map((a) => a.card)
    .filter(
      (c) =>
        c.status === OrderStatus.PUBLISHED &&
        c.visibility !== "private" &&
        c.slug,
    )
    .map(toPublicApiCard);

  const body = {
    event: {
      id: event.id,
      slug: event.slug,
      name: event.name,
      city: event.city,
      country: event.country,
      venue: event.venue,
      startAt: event.startAt.toISOString(),
      endAt: event.endAt.toISOString(),
      description: event.description,
      coverPath: event.coverPath,
    },
    attendees,
  };

  return applyCors(
    NextResponse.json(body, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=120, s-maxage=120, stale-while-revalidate=600",
      },
    }),
    req,
  );
}
