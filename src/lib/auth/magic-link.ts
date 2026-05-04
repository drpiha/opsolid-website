// =============================================================================
// MAGIC-LINK TOKENS — Faz 7.0a primary auth flow.
//
// Single-use, time-bounded one-click login. The user requests a link, we
// email them a URL with `?token=<random>`, they click it, we verify, sign
// them in. No password required.
//
// Security properties:
//   - 32 random bytes (256 bits) → URL-safe base64. Unguessable.
//   - SHA-256 of token stored in DB. Plaintext token only lives in the email
//     and the user's browser tab.
//   - 15-minute TTL (configurable via MAGIC_LINK_TTL_MINUTES).
//   - Single-use: usedAt set on first successful consume; subsequent attempts
//     return null. Prevents replay if a link is leaked from an email archive.
//   - On consume, User.emailVerifiedAt is stamped — clicking the magic link
//     proves email ownership.
//
// Auto-signup: issueMagicLink creates a User row when no match exists. This
// is the documented primary flow ("passwordless signup is auto-magic"). Email
// is normalised to lowercase before insert/lookup.
// =============================================================================

import { randomBytes, createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

const MAGIC_TOKEN_BYTES = 32;
const DEFAULT_TTL_MINUTES = Number(process.env.MAGIC_LINK_TTL_MINUTES ?? "15");
const MS_PER_MINUTE = 60 * 1000;

const RAW_SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export interface IssuedMagicLink {
  /** Plaintext token — embed in email URL, never store. */
  token: string;
  /** Full HTTPS URL for the browser/cookie flow. Locale prefix is the caller's responsibility. */
  link: string;
  /**
   * Deep-link URL for the mobile app
   * (`opsolid://magic-link/verify?token=…`).
   *
   * The path mirrors the Expo Router file at
   * `mobile/app/(auth)/magic-link/verify.tsx`. Route groups in parentheses
   * (e.g. `(auth)`) do not appear in the URL, so the deep link skips the
   * group and resolves directly to the segment.
   *
   * If the app is not installed, Android/iOS shows "no app can handle this
   * link" — acceptable for MVP because the email always also includes the
   * web `link` as a fallback CTA.
   */
  appLink: string;
  userId: string;
  email: string;
  expiresAt: Date;
  /** True when this call created a new User row (auto-signup). */
  isNewUser: boolean;
}

function normalizeEmail(email: string): string {
  return String(email).trim().toLowerCase();
}

function generateToken(): string {
  return randomBytes(MAGIC_TOKEN_BYTES).toString("base64url");
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Issue a magic link for the given email. Creates the User if not present.
 *
 * NOTE: The route handler that calls this MUST NOT differentiate its response
 * based on isNewUser — always 200, always neutral message — to avoid leaking
 * email-enumeration. The flag exists for analytics / templating only.
 */
export async function issueMagicLink(
  rawEmail: string,
  options: { locale?: string; name?: string } = {},
): Promise<IssuedMagicLink> {
  const email = normalizeEmail(rawEmail);
  if (!email || !email.includes("@")) {
    throw new Error("issueMagicLink: invalid email");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  let user = existing;
  let isNewUser = false;
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        locale: options.locale ?? "de",
        name: options.name ?? null,
      },
    });
    isNewUser = true;
  }

  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + DEFAULT_TTL_MINUTES * MS_PER_MINUTE);

  await prisma.magicLinkToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  // Link points at the API GET route which consumes the token, sets the
  // refresh cookie, and 302-redirects to /dashboard/cards (locale-resolved
  // by middleware downstream).
  const link = `${RAW_SITE_URL}/api/auth/magic-link/verify?token=${encodeURIComponent(token)}`;

  // Deep-link for the mobile app. Expo Router file-system routing handles
  // `mobile/app/(auth)/magic-link/verify.tsx` when the scheme is set to
  // "opsolid" in `mobile/app.json`. Route groups (parens) are stripped
  // from the URL — the public path is /magic-link/verify, not
  // /(auth)/magic-link/verify. If the app is not installed, Android/iOS
  // shows "no app handles this link" — users fall back to the browser CTA
  // in the same email.
  const appLink = `opsolid://magic-link/verify?token=${encodeURIComponent(token)}`;

  return {
    token,
    link,
    appLink,
    userId: user.id,
    email: user.email,
    expiresAt,
    isNewUser,
  };
}

/**
 * Consume a magic-link token — verify, mark used, stamp emailVerifiedAt,
 * return the User. Returns null on any failure (unknown, expired, already
 * used). Caller maps null to "invalid_or_expired_link".
 *
 * The mark-used + verify-email update happens in a single transaction so a
 * crash mid-flow can't leave a token half-consumed.
 */
export async function consumeMagicLink(
  rawToken: string,
): Promise<import("@/generated/prisma").User | null> {
  if (!rawToken || typeof rawToken !== "string") return null;
  const tokenHash = hashToken(rawToken);

  const tokenRow = await prisma.magicLinkToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });
  if (!tokenRow) return null;
  if (tokenRow.usedAt) return null;
  if (tokenRow.expiresAt.getTime() < Date.now()) return null;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // updateMany with usedAt: null guard prevents double-consume race.
      const consume = await tx.magicLinkToken.updateMany({
        where: { id: tokenRow.id, usedAt: null },
        data: { usedAt: new Date() },
      });
      if (consume.count === 0) {
        throw new Error("CONSUME_RACE");
      }
      // Stamp emailVerifiedAt (idempotent — only set if null).
      if (!tokenRow.user.emailVerifiedAt) {
        await tx.user.update({
          where: { id: tokenRow.user.id },
          data: { emailVerifiedAt: new Date() },
        });
      }
      return tx.user.findUnique({ where: { id: tokenRow.user.id } });
    });
    return result;
  } catch {
    return null;
  }
}

/**
 * Best-effort cleanup of expired magic-link rows. Called by the retention
 * cron; safe to invoke ad-hoc. Does not throw.
 */
export async function purgeExpiredMagicLinks(): Promise<number> {
  try {
    const res = await prisma.magicLinkToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    return res.count;
  } catch {
    return 0;
  }
}
