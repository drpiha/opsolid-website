// =============================================================================
// POST /api/auth/logout — Faz 7.0a.
//
// Revokes the current session (if any) and clears the refresh cookie. Always
// returns 200 — calling logout when not signed in is a no-op success, not an
// error. (Mobile clients that send a Bearer JWT have no server-side session
// to revoke beyond the refresh token, so they should call this only when
// they want to wipe their refresh token; otherwise just discarding the JWT
// locally is enough.)
// =============================================================================

import { NextResponse } from "next/server";
import { revokeSession, REFRESH_COOKIE_NAME } from "@/lib/auth/session";
import { clearRefreshCookie } from "@/lib/auth/cookies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  const cookieHeader = req.headers.get("cookie") ?? "";
  const token = readCookie(cookieHeader, REFRESH_COOKIE_NAME);
  if (token) {
    await revokeSession(token);
  }
  const res = NextResponse.json({ ok: true }, { status: 200 });
  clearRefreshCookie(res);
  return res;
}
