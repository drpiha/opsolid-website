// =============================================================================
// M4 — POST /api/v1/push/register
//
// Mobile registers its Expo push token after auth. Body:
//   { token: string, deviceId: string, platform: "ios" | "android" }
//
// Idempotent on (userId, deviceId): the unique constraint promotes the call to
// an upsert so re-registering from the same install just refreshes the token
// and `lastSeenAt`. Distinct device ids (e.g. tablet + phone for the same
// user) create distinct rows.
//
// Auth: bearer-only.
// Rate limit: 60/hr per user — generous on purpose; the client may re-register
// on every cold start while we're settling, and stale calls are cheap.
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

const Body = z
  .object({
    // Expo's documented shape: ExponentPushToken[xxxx…] (≤200 chars in
    // practice). We accept anything that looks like a non-empty string up to
    // 256 chars to avoid being too strict on Expo's future format changes.
    token: z.string().trim().min(8).max(256),
    deviceId: z.string().trim().min(4).max(128),
    platform: z.enum(["ios", "android"]),
  })
  .strict();

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function POST(req: Request) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit(
      "push:register",
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

    const body = await readJsonBody(req);
    const parsed = Body.safeParse(body);
    if (!parsed.success) {
      return applyCors(
        errorJson(
          "invalid_payload",
          parsed.error.issues[0]?.message ?? "Invalid payload.",
          400,
          undefined,
          parsed.error.issues,
        ),
        req,
      );
    }

    const { token, deviceId, platform } = parsed.data;

    const row = await prisma.pushDevice.upsert({
      where: {
        userId_deviceId: { userId: user.id, deviceId },
      },
      create: {
        userId: user.id,
        deviceId,
        platform,
        expoPushToken: token,
      },
      update: {
        expoPushToken: token,
        platform,
        lastSeenAt: new Date(),
      },
      select: { id: true },
    });

    return applyCors(
      NextResponse.json({ ok: true, id: row.id }, { status: 200 }),
      req,
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return applyCors(
        errorJson(err.code, "Authentication required.", err.status),
        req,
      );
    }
    console.error("[v1/push/register] failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}
