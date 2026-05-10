// GET /api/auth/google/callback?code=...&state=...
//
// Handles Google's OAuth2 redirect. Validates CSRF state, exchanges the code for
// an id_token, extracts email + name, then finds or creates a User by email.
//
// Account integrity rule (non-negotiable):
//   - Same email → same User, regardless of whether they previously used a
//     password or magic-link. We do NOT require a separate googleId column.
//   - Different Google account email → always a different User. Never merged.
//
// On success (web):  sets refresh cookie, redirects to `next` path (default /de/dashboard/cards).
// On success (mobile): redirects to opsolid://auth/google?rt=REFRESH&at=ACCESS
//                      — the app's WebBrowser session intercepts this deep link.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { issueSession } from "@/lib/auth/session";
import { signAccessToken } from "@/lib/auth/jwt";
import { setRefreshCookie, serializeCookie } from "@/lib/auth/cookies";
import { hashIp } from "@/lib/auth/ip-hash";
import { clientIp } from "@/lib/auth/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATE_COOKIE = "opsolid_oauth_state";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

function clearStateCookie(): string {
  const isProd = process.env.NODE_ENV === "production";
  return serializeCookie({
    name: STATE_COOKIE,
    value: "",
    maxAge: 0,
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
}

function errorRedirect(locale: string, message: string): NextResponse {
  const res = NextResponse.redirect(
    `https://opsolid.de/${locale}/login?error=${encodeURIComponent(message)}`,
  );
  res.headers.append("Set-Cookie", clearStateCookie());
  return res;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const stateRaw = url.searchParams.get("state");
  const errorParam = url.searchParams.get("error");

  // User cancelled
  if (errorParam) {
    return NextResponse.redirect("https://opsolid.de/de/login");
  }

  if (!code || !stateRaw) {
    return errorRedirect("de", "oauth_invalid");
  }

  // Decode state
  let statePayload: { nonce: string; next: string; mobile: boolean };
  try {
    statePayload = JSON.parse(
      Buffer.from(stateRaw, "base64url").toString(),
    ) as typeof statePayload;
  } catch {
    return errorRedirect("de", "oauth_invalid");
  }

  // CSRF check: state.nonce must match the cookie nonce
  const cookieNonce = req.cookies.get(STATE_COOKIE)?.value;
  if (!cookieNonce || cookieNonce !== statePayload.nonce) {
    return errorRedirect("de", "oauth_state_mismatch");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://opsolid.de";
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ?? `${origin}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return errorRedirect("de", "oauth_not_configured");
  }

  // Exchange code for tokens
  let idToken: string;
  try {
    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });
    if (!tokenRes.ok) {
      console.error("[google/callback] token exchange failed:", await tokenRes.text());
      return errorRedirect("de", "oauth_exchange_failed");
    }
    const tokenData = (await tokenRes.json()) as { id_token?: string };
    if (!tokenData.id_token) {
      return errorRedirect("de", "oauth_no_id_token");
    }
    idToken = tokenData.id_token;
  } catch (err) {
    console.error("[google/callback] fetch error:", err);
    return errorRedirect("de", "oauth_network_error");
  }

  // Verify id_token via Google's tokeninfo endpoint — cryptographic signature
  // check + audience/expiry enforcement, not just base64 decode.
  let email: string;
  let name: string | null;
  try {
    const verifyRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
    );
    if (!verifyRes.ok) {
      return errorRedirect("de", "oauth_token_invalid");
    }
    const claims = (await verifyRes.json()) as {
      email?: string;
      name?: string;
      email_verified?: string;
      aud?: string;
    };
    if (!claims.email) throw new Error("no email in token claims");
    if (claims.aud !== clientId) throw new Error("token audience mismatch");
    if (claims.email_verified !== "true") throw new Error("email not verified");
    email = claims.email.trim().toLowerCase();
    name = claims.name ?? null;
  } catch (err) {
    console.error("[google/callback] token verify error:", err);
    return errorRedirect("de", "oauth_token_decode");
  }

  // Find or create user by email
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        emailVerifiedAt: new Date(),
        locale: "de",
      },
    });
  } else if (!user.emailVerifiedAt) {
    // Mark verified if not already (Google has verified the email)
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: new Date() },
    });
  }

  // Issue session
  const ip = clientIp(req);
  const session = await issueSession(
    user.id,
    req.headers.get("user-agent"),
    hashIp(ip),
  );
  const accessToken = await signAccessToken(user.id);

  // Clear the state cookie in every response
  const cookieClear = clearStateCookie();

  if (statePayload.mobile) {
    // Deep-link via HTML page — NOT a 30x redirect.
    //
    // Chromium 89+ (Chrome, Brave, Edge, etc.) blocks server-issued redirects
    // to non-http(s) schemes for anti-fingerprinting. A 307 with
    // `Location: opsolid://...` shows "this page isn't working". A
    // client-side `location.href = "opsolid://..."` from a same-origin HTML
    // page is still allowed in CustomTabs.
    const deepLink =
      `opsolid://auth/google?rt=${encodeURIComponent(session.refreshToken)}` +
      `&at=${encodeURIComponent(accessToken)}`;
    const escapedForJs = deepLink.replace(/[\\'"<>&]/g, (ch) => {
      switch (ch) {
        case "\\": return "\\\\";
        case "'": return "\\'";
        case '"': return "\\\"";
        case "<": return "\\u003c";
        case ">": return "\\u003e";
        case "&": return "\\u0026";
        default: return ch;
      }
    });
    const escapedForHref = deepLink
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;");
    const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="referrer" content="no-referrer">
<title>Verso</title>
<style>
body{margin:0;font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;text-align:center}
.box{max-width:360px}
h1{font-size:18px;font-weight:600;margin:0 0 12px}
p{font-size:14px;color:#94a3b8;margin:0 0 24px;line-height:1.5}
a{display:inline-block;background:#1AA6B7;color:#fff;text-decoration:none;padding:14px 24px;border-radius:10px;font-weight:600;font-size:15px}
</style>
</head>
<body>
<div class="box">
<h1>Verso wird geöffnet …</h1>
<p>Falls die App nicht automatisch öffnet, tippe auf den Knopf.</p>
<a href="${escapedForHref}">App öffnen</a>
</div>
<script>
// Trigger the deep-link immediately. CustomTabs follows client-side scheme
// jumps even when 30x redirects to non-http schemes are blocked.
window.location.href = '${escapedForJs}';
</script>
</body>
</html>`;
    const res = new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
    res.headers.append("Set-Cookie", cookieClear);
    return res;
  }

  // Web: set cookie, redirect to dashboard
  const next = statePayload.next.startsWith("/")
    ? statePayload.next
    : "/dashboard/cards";
  const locale = "de"; // TODO: detect from user.locale
  const redirectTarget = `${origin}/${locale}${next}`;

  const res = NextResponse.redirect(redirectTarget);
  res.headers.append("Set-Cookie", cookieClear);
  setRefreshCookie(res, session.refreshToken);
  return res;
}
