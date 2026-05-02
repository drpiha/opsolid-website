// =============================================================================
// requireUser — server-side auth guard for API routes (Faz 7.0a).
//
// Two acceptable credentials, in priority order:
//   1. Authorization: Bearer <jwt>   (mobile app, third-party tools)
//   2. Cookie `opsolid_refresh`      (web SPA — refresh token, validated via
//                                      Session table, NOT used as a JWT)
//
// The web flow accepts the refresh cookie directly here so authenticated SSR
// loaders / API routes don't have to maintain a separate access-cookie.
// Strict reading: we never accept the access JWT in a cookie (that would
// negate sameSite protection) and never accept a refresh token in a header.
//
// On failure we throw an `AuthError` that carries a 401 Response — callers
// can catch + re-throw, or call `respondToAuthError(err)` to return it.
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { User } from "@/generated/prisma";
import { verifyAccessToken } from "./jwt";
import { getSessionUser, REFRESH_COOKIE_NAME } from "./session";

export class AuthError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(code: string, status = 401) {
    super(code);
    this.name = "AuthError";
    this.code = code;
    this.status = status;
  }
  toResponse() {
    return NextResponse.json(
      { error: { code: this.code, message: "Authentication required." } },
      { status: this.status },
    );
  }
}

const BEARER_PREFIX = /^Bearer\s+/i;

/**
 * Resolve a User from the request, or throw AuthError(401).
 *
 * Accepts Web Request (Next.js route handlers receive this), so it works
 * uniformly for app/api/.../route.ts, edge-compatible routes, and tests.
 */
export async function requireUser(req: Request): Promise<User> {
  // 1. Bearer JWT (mobile / API clients).
  const authHeader = req.headers.get("authorization");
  if (authHeader && BEARER_PREFIX.test(authHeader)) {
    const token = authHeader.replace(BEARER_PREFIX, "").trim();
    const claims = await verifyAccessToken(token);
    if (!claims) throw new AuthError("invalid_token");
    const user = await prisma.user.findUnique({ where: { id: claims.userId } });
    if (!user) throw new AuthError("user_not_found");
    return user;
  }

  // 2. Refresh cookie (web). We parse the cookie header manually instead of
  //    reaching for Next.js `cookies()` because this helper is called from
  //    plain route handlers that receive a generic Request.
  const cookieHeader = req.headers.get("cookie") ?? "";
  const refreshToken = readCookie(cookieHeader, REFRESH_COOKIE_NAME);
  if (!refreshToken) {
    throw new AuthError("not_authenticated");
  }
  const user = await getSessionUser(refreshToken);
  if (!user) throw new AuthError("session_invalid");
  return user;
}

/**
 * Best-effort: returns the User if authenticated, null otherwise. Never
 * throws. Use for routes that show different content for guests vs members
 * but never reject outright.
 */
export async function getOptionalUser(req: Request): Promise<User | null> {
  try {
    return await requireUser(req);
  } catch {
    return null;
  }
}

/**
 * Cookie header parser — kept here (no `cookie` package dep) because the
 * format is trivial and we only ever read one specific name.
 */
function readCookie(header: string, name: string): string | null {
  if (!header) return null;
  const parts = header.split(";");
  for (const part of parts) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const k = trimmed.slice(0, eq);
    if (k !== name) continue;
    const v = trimmed.slice(eq + 1);
    try {
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  }
  return null;
}
