// =============================================================================
// M5 — password-protected card unlock cookie helpers.
//
// The unlock cookie is set by POST /api/cards/[slug]/unlock and read by the
// public viewer SSR (`src/app/c/[slug]/page.tsx`). Single-source-of-truth
// helper here so both sides agree on the name format.
// =============================================================================

import { createHmac, timingSafeEqual } from "node:crypto";

export function unlockCookieName(slug: string): string {
  // Slug regex is [a-z0-9-]+; safe in cookie names. Cap to 60 chars to be
  // defensive against a future schema change that allows longer slugs.
  return `verso_unlock_${slug.slice(0, 60)}`;
}

export const UNLOCK_COOKIE_MAX_AGE_S = 24 * 60 * 60;

function signature(slug: string, passwordHash: string, expiresAt: number): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) throw new Error("Card unlock signing is unavailable");
  return createHmac("sha256", secret)
    .update(JSON.stringify(["opsolid-card-unlock", 1, slug, passwordHash, expiresAt]))
    .digest("base64url");
}

/** The password hash is bound into the MAC, never exposed in the cookie payload. */
export function signUnlockCookie(slug: string, passwordHash: string, nowSeconds = Math.floor(Date.now() / 1000)): string {
  if (!slug || !passwordHash || !Number.isSafeInteger(nowSeconds) || nowSeconds < 0) throw new Error("Invalid card unlock context");
  const expiresAt = nowSeconds + UNLOCK_COOKIE_MAX_AGE_S;
  return `v1.${expiresAt}.${signature(slug, passwordHash, expiresAt)}`;
}

export function verifyUnlockCookie(value: string | null | undefined, slug: string, passwordHash: string, nowSeconds = Math.floor(Date.now() / 1000)): boolean {
  if (!value || value.length > 96 || !slug || !passwordHash || !Number.isSafeInteger(nowSeconds) || nowSeconds < 0) return false;
  const match = /^v1\.([0-9]{1,12})\.([A-Za-z0-9_-]{43})$/.exec(value);
  if (!match) return false;
  const expiresAt = Number(match[1]);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= nowSeconds || expiresAt > nowSeconds + UNLOCK_COOKIE_MAX_AGE_S) return false;
  try {
    const expected = Buffer.from(signature(slug, passwordHash, expiresAt), "ascii");
    return timingSafeEqual(expected, Buffer.from(match[2], "ascii"));
  } catch { return false; }
}

/** Reject duplicate cookies rather than choosing an attacker-controlled shadow value. */
export function hasValidUnlockCookie(cookieHeader: string | null | undefined, slug: string, passwordHash: string): boolean {
  if (!cookieHeader || cookieHeader.length > 16_384) return false;
  const prefix = `${unlockCookieName(slug)}=`;
  const matches = cookieHeader.split(";").map((part) => part.trim()).filter((part) => part.startsWith(prefix));
  return matches.length === 1 && verifyUnlockCookie(matches[0].slice(prefix.length), slug, passwordHash);
}
