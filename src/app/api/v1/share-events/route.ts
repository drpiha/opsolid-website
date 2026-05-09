// =============================================================================
// POST /api/v1/share-events — log a public-viewer share gesture.
//
// Body: { sourceCardId, channel }
//   - sourceCardId: the CardOrder.id whose share button was tapped.
//   - channel: 'qr' | 'link' | 'nfc' | 'native_share'
//
// Auth: bearer-only. (We could accept anonymous events, but the auth gate
//   keeps the rate limit honest — anonymous gestures from the public web
//   viewer use the slug-resolving variant in the web route, not this one.)
//
// Behaviour: insert one row, return 201. Failures swallowed at the call site
//   (telemetry must never block the share gesture).
//
// Rate limit: 60 / hour / user. Generous because power-sharers may fire a
//   handful per minute at a fair.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthError } from "@/lib/auth/require-user";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson, readJsonBody } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 60;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const SHARE_CHANNELS = ["qr", "link", "nfc", "native_share"] as const;
export type ShareChannel = (typeof SHARE_CHANNELS)[number];

const Body = z
  .object({
    sourceCardId: z.string().trim().min(8).max(40),
    channel: z.enum(SHARE_CHANNELS),
  })
  .strict();

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function POST(req: Request) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit(
      "share-events:create",
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

    const raw = await readJsonBody(req);
    const parsed = Body.safeParse(raw);
    if (!parsed.success) {
      return applyCors(
        errorJson(
          "invalid_payload",
          parsed.error.issues[0]?.message ?? "Invalid payload.",
          400,
        ),
        req,
      );
    }

    // The card needs to exist + be PUBLISHED. We don't restrict to the
    // requester's own cards because share gestures fire from a visitor
    // viewing someone else's card — we still want the source card's owner
    // to see it in their analytics.
    const card = await prisma.cardOrder.findUnique({
      where: { id: parsed.data.sourceCardId },
      select: { id: true, status: true },
    });
    if (!card || card.status !== "PUBLISHED") {
      return applyCors(errorJson("not_found", "Card not found.", 404), req);
    }

    await prisma.shareEvent.create({
      data: {
        sourceCardId: card.id,
        channel: parsed.data.channel,
      },
      select: { id: true },
    });

    return applyCors(
      NextResponse.json({ ok: true }, { status: 201 }),
      req,
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return applyCors(
        errorJson(err.code, "Authentication required.", err.status),
        req,
      );
    }
    console.error("[v1/share-events] failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}
