// =============================================================================
// POST /api/auth/refresh — Faz 7.0a.
//
// Reads the refresh cookie, rotates it (single-use), returns a fresh access
// JWT and writes the new refresh cookie. On any failure (no cookie / unknown
// session / revoked / expired) we return 401 and clear the cookie so the
// client lands on the login page on next navigation.
//
// Rate limit: 60 / hour / IP — generous enough for active SPAs (refresh on
// every access-token expiry is ~ 4/hour) but firm enough to stop a bot from
// rolling sessions in a tight loop.
// =============================================================================

import { NextResponse } from "next/server";
import { rotateSession, REFRESH_COOKIE_NAME } from "@/lib/auth/session";
import { signAccessToken } from "@/lib/auth/jwt";
import { setRefreshCookie, clearRefreshCookie } from "@/lib/auth/cookies";
import { hitWindow, clientIp } from "@/lib/auth/rate-limit";
import { hashIp } from "@/lib/auth/ip-hash";
import { errorResponse } from "../_helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 60;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function readCookie(header: string, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    if (trimmed.slice(0, eq) !== name) continue;
    try {
      return decodeURIComponent(trimmed.slice(eq + 1));
    } catch {
      return trimmed.slice(eq + 1);
    }
  }
  return null;
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limit = hitWindow(`refresh::${ip}`, RATE_MAX, RATE_WINDOW_MS);
  if (!limit.ok) {
    return errorResponse(
      "rate_limited",
      "Too many requests. Try again in a moment.",
      429,
      { "Retry-After": String(limit.retryAfterSeconds ?? 60) },
    );
  }

  const cookieHeader = req.headers.get("cookie") ?? "";
  const oldToken = readCookie(cookieHeader, REFRESH_COOKIE_NAME);

  if (!oldToken) {
    return errorResponse(
      "not_authenticated",
      "Sign in required.",
      401,
    );
  }

  const rotated = await rotateSession(
    oldToken,
    req.headers.get("user-agent"),
    hashIp(ip),
  );
  if (!rotated) {
    const res = errorResponse(
      "session_invalid",
      "Session expired. Please sign in again.",
      401,
    );
    clearRefreshCookie(res);
    return res;
  }

  // Look up the user via the new session (we just created it; included in
  // the rotation result via sessionId). For payload assembly we need the
  // userId — fetch via session row.
  // We avoid a second DB hit by signing the JWT off the userId already
  // implicit in the rotated session: use prisma.session lookup minimal.
  // (Cheap: indexed by id.)
  const { prisma } = await import("@/lib/prisma");
  const session = await prisma.session.findUnique({
    where: { id: rotated.sessionId },
    select: {
      user: {
        select: { id: true, email: true, name: true, locale: true, emailVerifiedAt: true },
      },
      expiresAt: true,
    },
  });

  if (!session) {
    const res = errorResponse(
      "session_invalid",
      "Session expired. Please sign in again.",
      401,
    );
    clearRefreshCookie(res);
    return res;
  }

  const accessToken = await signAccessToken(session.user.id);

  const res = NextResponse.json(
    {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        locale: session.user.locale,
        emailVerifiedAt: session.user.emailVerifiedAt?.toISOString() ?? null,
      },
      accessToken,
      sessionExpiresAt: session.expiresAt.toISOString(),
    },
    { status: 200 },
  );
  setRefreshCookie(res, rotated.refreshToken);
  return res;
}
