// =============================================================================
// SESSION (REFRESH TOKEN) MANAGEMENT — Faz 7.0a.
//
// Two-token model:
//   - Refresh token: 32 random bytes, base64url-encoded, 30-day TTL. Stored as
//     SHA-256 hash in `Session.tokenHash`. Plaintext token is delivered to the
//     client ONCE in the response (cookie for web, body for mobile) and never
//     persisted server-side.
//   - Access token (JWT): short-lived (15 min), stateless, signed by jwt.ts.
//
// Single-use rotation: every successful refresh revokes the old session row
// and issues a new one. If an attacker steals a refresh token and uses it,
// the legitimate user's next refresh fails (revokedAt set) — and the next
// time the legit user comes back, we surface a re-login. (Token-reuse
// detection / family revocation can be layered on later.)
// =============================================================================

import { randomBytes, createHash, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { User } from "@/generated/prisma";

const REFRESH_TOKEN_BYTES = 32;
const DEFAULT_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? "30");

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const REFRESH_COOKIE_NAME = "opsolid_refresh";

export interface IssuedSession {
  refreshToken: string;
  expiresAt: Date;
  sessionId: string;
}

/**
 * Generate a cryptographically random refresh token (URL-safe base64).
 * 32 random bytes -> ~43 character string with 256 bits of entropy.
 */
function generateRefreshToken(): string {
  return randomBytes(REFRESH_TOKEN_BYTES).toString("base64url");
}

/**
 * SHA-256 of the refresh token. Stored in DB; the plaintext token is never
 * persisted, so a database leak alone cannot impersonate a user.
 */
export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Create a new session row and return the plaintext token. Caller is
 * responsible for delivering the token to the client (cookie or response body)
 * and discarding it from memory afterwards.
 */
export async function issueSession(
  userId: string,
  userAgent: string | null = null,
  ipHash: string | null = null,
): Promise<IssuedSession> {
  const refreshToken = generateRefreshToken();
  const tokenHash = hashRefreshToken(refreshToken);
  const expiresAt = new Date(Date.now() + DEFAULT_TTL_DAYS * MS_PER_DAY);

  const session = await prisma.session.create({
    data: {
      userId,
      tokenHash,
      userAgent: userAgent ? userAgent.slice(0, 255) : null,
      ipHash,
      expiresAt,
    },
    select: { id: true },
  });

  return { refreshToken, expiresAt, sessionId: session.id };
}

/**
 * Find a non-revoked, non-expired session by refresh token. Returns null on
 * any miss. Uses tokenHash lookup (indexed unique) — never queries by raw
 * token. The `timingSafeEqual` here is defence-in-depth: the unique index
 * already gives us O(1) lookup, but we re-compare to make absolutely sure
 * the row we got back matches the input even if the hash collided (it
 * cannot, but defensive coding never hurt).
 */
async function findActiveSessionByToken(refreshToken: string) {
  if (!refreshToken || typeof refreshToken !== "string") return null;
  const tokenHash = hashRefreshToken(refreshToken);
  const session = await prisma.session.findUnique({ where: { tokenHash } });
  if (!session) return null;
  if (session.revokedAt) return null;
  if (session.expiresAt.getTime() < Date.now()) return null;
  // Defensive constant-time compare against re-derived hash.
  const storedHashBuf = Buffer.from(session.tokenHash, "hex");
  const inputHashBuf = Buffer.from(tokenHash, "hex");
  if (
    storedHashBuf.length !== inputHashBuf.length ||
    !timingSafeEqual(storedHashBuf, inputHashBuf)
  ) {
    return null;
  }
  return session;
}

/**
 * Resolve a refresh token to the owning User. Returns null when the token is
 * unknown, revoked, or expired. Performs a single DB roundtrip (join via
 * include).
 */
export async function getSessionUser(
  refreshToken: string,
): Promise<User | null> {
  const tokenHash = hashRefreshToken(refreshToken);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });
  if (!session) return null;
  if (session.revokedAt) return null;
  if (session.expiresAt.getTime() < Date.now()) return null;
  return session.user;
}

/**
 * Single-use refresh: verify old token, revoke it, issue a new one. Returns
 * null if the old token is invalid/expired/already-used so the caller can map
 * to a 401 + force re-login.
 *
 * Uses an interactive transaction to ensure revoke + issue are atomic — an
 * attacker can't slip a parallel rotate request between the two writes.
 */
export async function rotateSession(
  oldRefreshToken: string,
  userAgent: string | null = null,
  ipHash: string | null = null,
): Promise<IssuedSession | null> {
  const old = await findActiveSessionByToken(oldRefreshToken);
  if (!old) return null;

  const newToken = generateRefreshToken();
  const newHash = hashRefreshToken(newToken);
  const expiresAt = new Date(Date.now() + DEFAULT_TTL_DAYS * MS_PER_DAY);

  try {
    const created = await prisma.$transaction(async (tx) => {
      // Revoke (idempotent guard via where clause). If revokedAt was already
      // set between findActiveSessionByToken and now (race), updateMany
      // returns count=0 and we abort.
      const revoke = await tx.session.updateMany({
        where: { id: old.id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      if (revoke.count === 0) {
        throw new Error("ROTATE_RACE");
      }
      const next = await tx.session.create({
        data: {
          userId: old.userId,
          tokenHash: newHash,
          userAgent: userAgent ? userAgent.slice(0, 255) : null,
          ipHash,
          expiresAt,
        },
        select: { id: true },
      });
      return next;
    });
    return { refreshToken: newToken, expiresAt, sessionId: created.id };
  } catch (err) {
    // Race or DB error — caller treats as auth failure.
    return null;
  }
}

/**
 * Revoke a single session by its refresh token. Idempotent — revoking an
 * unknown / already-revoked token is a no-op (we don't throw, because the
 * caller is usually a logout handler that doesn't care).
 */
export async function revokeSession(refreshToken: string): Promise<void> {
  if (!refreshToken) return;
  const tokenHash = hashRefreshToken(refreshToken);
  await prisma.session.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

/**
 * Revoke ALL active sessions for a user. Use when password is changed or
 * after detecting a suspicious event. Currently unused but exposed for
 * upcoming "sign out everywhere" UI.
 */
export async function revokeAllSessions(userId: string): Promise<number> {
  const res = await prisma.session.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  return res.count;
}
