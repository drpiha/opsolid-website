// GET /api/auth/google[?next=PATH&mobile=1]
//
// Initiates Google OAuth2 flow. Generates a CSRF nonce stored in a short-lived
// httpOnly cookie; encodes {nonce, next, mobile} as state for the round-trip.
//
// Environment variables required:
//   GOOGLE_CLIENT_ID       — OAuth 2.0 client ID
//   GOOGLE_REDIRECT_URI    — must match exactly what's registered in Google Cloud Console
//                            default: https://opsolid.de/api/auth/google/callback

import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { serializeCookie } from "@/lib/auth/cookies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const STATE_COOKIE = "opsolid_oauth_state";
const STATE_TTL_SECONDS = 600;

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://opsolid.de";
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ?? `${origin}/api/auth/google/callback`;

  if (!clientId) {
    return NextResponse.json(
      { error: "OAuth not configured" },
      { status: 503 },
    );
  }

  const url = new URL(req.url);
  const next = url.searchParams.get("next") ?? "/dashboard/cards";
  const mobile = url.searchParams.get("mobile") === "1";
  // The visitor's UI locale rides through the state so the post-login
  // redirect and any error pages come back in their language instead of
  // the previously hardcoded "de".
  const localeParam = url.searchParams.get("locale");
  const locale = ["de", "en", "tr"].includes(localeParam ?? "")
    ? (localeParam as string)
    : "de";

  // nonce → stored in cookie for CSRF check on callback
  // state → round-trips through Google (opaque to them)
  const nonce = randomBytes(16).toString("base64url");
  const state = Buffer.from(
    JSON.stringify({ nonce, next, mobile, locale }),
  ).toString("base64url");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "select_account",
  });

  const res = NextResponse.redirect(
    `${GOOGLE_AUTH_URL}?${params.toString()}`,
  );

  // SameSite=None; Secure for mobile WebView OAuth flows where the redirect
  // from Google back to the callback is a cross-site top-level navigation.
  // SameSite=Lax works for desktop Chrome but can be dropped by some Android
  // WebView implementations. None is safe here because the cookie is
  // httpOnly + short-lived (10 min) and carries only a CSRF nonce.
  const isProd = process.env.NODE_ENV === "production";
  res.headers.append(
    "Set-Cookie",
    serializeCookie({
      name: STATE_COOKIE,
      value: nonce,
      maxAge: STATE_TTL_SECONDS,
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    }),
  );

  return res;
}
