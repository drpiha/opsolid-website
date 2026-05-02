// =============================================================================
// GET /api/auth/magic-link/verify?token=<token> — Faz 7.0a.
//
// User clicks the link in their email; we:
//   1. Consume the single-use token (marks usedAt + sets emailVerifiedAt).
//   2. Issue a fresh session + access JWT.
//   3. Set the refresh cookie.
//   4. 302-redirect to /dashboard/cards (locale prefix added by the link
//      generator if applicable; we use a locale-less default that the locale
//      middleware will redirect to /<locale>/dashboard/cards).
//
// Failure → redirect to /auth/login?error=invalid_or_expired_link.
//
// We accept GET (browser navigation) only. The token is single-use, so even
// if a referrer leak occurs the token is already burned.
// =============================================================================

import { NextResponse } from "next/server";
import { consumeMagicLink } from "@/lib/auth/magic-link";
import { issueSession } from "@/lib/auth/session";
import { signAccessToken } from "@/lib/auth/jwt";
import { setRefreshCookie } from "@/lib/auth/cookies";
import { hitWindow, clientIp } from "@/lib/auth/rate-limit";
import { hashIp } from "@/lib/auth/ip-hash";
import { captureAuthEvent } from "../../_helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

// Anti-abuse: an attacker could brute-force tokens; cap at 30/hour/IP.
// Real users only verify a couple of links a day, so this is generous.
const RATE_MAX = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function loginErrorRedirect(): NextResponse {
  return NextResponse.redirect(
    `${SITE_URL}/auth/login?error=invalid_or_expired_link`,
    { status: 302 },
  );
}

export async function GET(req: Request) {
  const ip = clientIp(req);
  const limit = hitWindow(`mlverify::${ip}`, RATE_MAX, RATE_WINDOW_MS);
  if (!limit.ok) {
    return loginErrorRedirect();
  }

  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return loginErrorRedirect();
  }

  const user = await consumeMagicLink(token);
  if (!user) {
    void captureAuthEvent("magic_link_consume_failed", {
      ip_hash: hashIp(ip),
    });
    return loginErrorRedirect();
  }

  // Issue session + access token.
  const session = await issueSession(
    user.id,
    req.headers.get("user-agent"),
    hashIp(ip),
  );
  // We don't return the access token via redirect URL (would leak it to
  // browser history / referrer). The client SPA picks it up by calling
  // /api/auth/refresh after navigation, which uses the freshly-set cookie.
  await signAccessToken(user.id); // pre-warm jose key cache; JWT itself unused here.

  const res = NextResponse.redirect(`${SITE_URL}/dashboard/cards`, {
    status: 302,
  });
  setRefreshCookie(res, session.refreshToken);
  return res;
}
