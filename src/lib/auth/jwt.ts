// =============================================================================
// JWT ACCESS TOKENS — Faz 7.0a.
//
// Short-lived stateless access tokens used for both web (returned in JSON
// responses, stored in memory by the SPA) and mobile (Bearer auth header).
//
// Algorithm: HS256 with a single shared secret pulled from JWT_SECRET. We
// chose symmetric over RS256 because:
//   - Only our own services verify (no third-party validators).
//   - Operationally simpler — one secret, no key rotation tooling needed yet.
//   - HS256 is significantly faster.
//
// Rotation strategy (out of scope for this task): when JWT_SECRET rotates we
// flip a feature flag, accept both old and new for a grace period, then drop
// the old. Hooks for that live in verifyAccessToken (multi-key support is a
// trivial change to the signature, just not done now).
//
// Secret hygiene:
//   - Refuse to start in production with JWT_SECRET unset.
//   - Refuse a secret shorter than 32 bytes.
//   - In dev, accept a placeholder but warn loudly.
// =============================================================================

import { SignJWT, jwtVerify, errors as joseErrors } from "jose";

const ACCESS_TTL_MINUTES = Number(
  process.env.ACCESS_TOKEN_TTL_MINUTES ?? "15",
);

const ISSUER = "opsolid";
const AUDIENCE = "opsolid-app";
const ALG = "HS256";

let cachedKey: Uint8Array | null = null;

function getSecret(): Uint8Array {
  if (cachedKey) return cachedKey;
  const raw = process.env.JWT_SECRET;
  if (!raw || raw.length === 0) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "[auth/jwt] JWT_SECRET is required in production. " +
          "Generate with `node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\"`.",
      );
    }
    console.warn(
      "[auth/jwt] JWT_SECRET is unset — using insecure dev placeholder. DO NOT ship without setting it.",
    );
    cachedKey = new TextEncoder().encode(
      "dev-only-insecure-placeholder-do-not-use-in-prod-32b",
    );
    return cachedKey;
  }
  if (raw.length < 32) {
    throw new Error(
      "[auth/jwt] JWT_SECRET is too short (min 32 chars). Generate a longer one.",
    );
  }
  cachedKey = new TextEncoder().encode(raw);
  return cachedKey;
}

export interface AccessTokenClaims {
  userId: string;
}

/**
 * Sign a short-lived access token. Payload is intentionally minimal — userId
 * only. Resolve user details server-side from the DB on each request to avoid
 * stale role/permission data. (Stateless tokens that contain roles are a
 * common bug vector in long-lived JWTs.)
 */
export async function signAccessToken(userId: string): Promise<string> {
  if (!userId || typeof userId !== "string") {
    throw new Error("signAccessToken: userId required");
  }
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ typ: "access" })
    .setProtectedHeader({ alg: ALG, typ: "JWT" })
    .setSubject(userId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt(now)
    .setExpirationTime(now + ACCESS_TTL_MINUTES * 60)
    .sign(getSecret());
}

/**
 * Verify a JWT and return its claims. Returns null on any failure
 * (signature mismatch, expired, malformed, wrong audience/issuer). Never
 * throws — the caller maps null to 401.
 */
export async function verifyAccessToken(
  jwt: string,
): Promise<AccessTokenClaims | null> {
  if (!jwt || typeof jwt !== "string") return null;
  try {
    const { payload } = await jwtVerify(jwt, getSecret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
      algorithms: [ALG],
    });
    if (payload.typ !== "access") return null;
    if (typeof payload.sub !== "string" || payload.sub.length === 0) return null;
    return { userId: payload.sub };
  } catch (err) {
    // Differentiate only for logging hygiene; caller always sees null.
    if (
      err instanceof joseErrors.JWTExpired ||
      err instanceof joseErrors.JWSSignatureVerificationFailed ||
      err instanceof joseErrors.JWTClaimValidationFailed
    ) {
      return null;
    }
    return null;
  }
}
