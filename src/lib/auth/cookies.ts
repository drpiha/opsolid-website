// =============================================================================
// Cookie helpers for /api/auth/* responses (Faz 7.0a).
//
// We render the Set-Cookie header manually rather than going through
// next/headers `cookies()` because some of our routes return NextResponse
// objects and we want full control over flags (httpOnly, secure, sameSite,
// path, domain). Centralising the format here keeps every auth route
// consistent.
// =============================================================================

import type { NextResponse } from "next/server";
import { REFRESH_COOKIE_NAME } from "./session";

const REFRESH_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? "30");
const SECONDS_PER_DAY = 24 * 60 * 60;

export interface CookieAttrs {
  name: string;
  value: string;
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
}

export function serializeCookie(attrs: CookieAttrs): string {
  const parts: string[] = [];
  parts.push(`${attrs.name}=${encodeURIComponent(attrs.value)}`);
  if (attrs.maxAge !== undefined) parts.push(`Max-Age=${attrs.maxAge}`);
  if (attrs.expires) parts.push(`Expires=${attrs.expires.toUTCString()}`);
  parts.push(`Path=${attrs.path ?? "/"}`);
  if (attrs.domain) parts.push(`Domain=${attrs.domain}`);
  if (attrs.httpOnly !== false) parts.push("HttpOnly");
  if (attrs.secure) parts.push("Secure");
  parts.push(`SameSite=${attrs.sameSite ?? "Lax"}`);
  return parts.join("; ");
}

const isProd = () => process.env.NODE_ENV === "production";

/**
 * Attach the refresh-token cookie to a NextResponse. Always httpOnly + sameSite=Lax.
 * Secure flag is ON in production (works behind Traefik with HTTPS terminated
 * upstream) and OFF in development so localhost flows function without TLS.
 */
export function setRefreshCookie(
  res: NextResponse,
  token: string,
): void {
  const cookie = serializeCookie({
    name: REFRESH_COOKIE_NAME,
    value: token,
    maxAge: REFRESH_TTL_DAYS * SECONDS_PER_DAY,
    path: "/",
    httpOnly: true,
    secure: isProd(),
    sameSite: "lax",
  });
  res.headers.append("Set-Cookie", cookie);
}

/**
 * Clear the refresh-token cookie (logout). Browsers expire on Max-Age=0 +
 * matching name/path; we keep the same flags as the issuer to make sure the
 * UA actually overwrites the existing cookie.
 */
export function clearRefreshCookie(res: NextResponse): void {
  const cookie = serializeCookie({
    name: REFRESH_COOKIE_NAME,
    value: "",
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: isProd(),
    sameSite: "lax",
  });
  res.headers.append("Set-Cookie", cookie);
}
