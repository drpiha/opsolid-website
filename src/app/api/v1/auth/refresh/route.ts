// =============================================================================
// POST /api/v1/auth/refresh — rotate a refresh token (no cookies).
//
// Body: { refreshToken }
// Response: { accessToken, refreshToken, sessionExpiresAt, user }
//
// Single-use rotation: the supplied refreshToken is revoked and a new pair
// is returned. If the supplied token is unknown / revoked / expired we
// return 401; the client should drop both tokens and route the user to the
// login screen.
//
// Rate limit: 60 / hour / IP — generous enough for active SPA-style clients
// (one refresh every access-token expiry = ~4/hour) but firm enough to stop
// a token-rolling bot.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rotateSession } from "@/lib/auth/session";
import { signAccessToken } from "@/lib/auth/jwt";
import { hitWindow, clientIp } from "@/lib/auth/rate-limit";
import { hashIp } from "@/lib/auth/ip-hash";
import { errorJson, readJsonBody } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 60;
const RATE_WINDOW_MS = 60 * 60 * 1000;

// Refresh tokens are 32 random bytes -> 43-char base64url string. Allow a
// generous range for forward compatibility.
const RefreshSchema = z.object({
  refreshToken: z.string().trim().min(20).max(200),
});

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limit = hitWindow(`v1::refresh::${ip}`, RATE_MAX, RATE_WINDOW_MS);
  if (!limit.ok) {
    return applyCors(
      errorJson(
        "rate_limited",
        "Too many requests. Try again in a moment.",
        429,
        { "Retry-After": String(limit.retryAfterSeconds ?? 60) },
      ),
      req,
    );
  }

  const body = await readJsonBody(req);
  const parsed = RefreshSchema.safeParse(body);
  if (!parsed.success) {
    return applyCors(
      errorJson("invalid_request", "refreshToken is required.", 400),
      req,
    );
  }

  const rotated = await rotateSession(
    parsed.data.refreshToken,
    req.headers.get("user-agent"),
    hashIp(ip),
  );
  if (!rotated) {
    return applyCors(
      errorJson(
        "session_invalid",
        "Session expired. Please sign in again.",
        401,
      ),
      req,
    );
  }

  const session = await prisma.session.findUnique({
    where: { id: rotated.sessionId },
    select: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          locale: true,
          emailVerifiedAt: true,
        },
      },
      expiresAt: true,
    },
  });

  if (!session) {
    return applyCors(
      errorJson(
        "session_invalid",
        "Session expired. Please sign in again.",
        401,
      ),
      req,
    );
  }

  const accessToken = await signAccessToken(session.user.id);

  return applyCors(
    NextResponse.json(
      {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          locale: session.user.locale,
          emailVerifiedAt: session.user.emailVerifiedAt?.toISOString() ?? null,
        },
        accessToken,
        refreshToken: rotated.refreshToken,
        sessionExpiresAt: rotated.expiresAt.toISOString(),
      },
      { status: 200 },
    ),
    req,
  );
}
