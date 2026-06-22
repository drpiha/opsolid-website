// =============================================================================
// PASSWORD HASHING — scrypt via node:crypto (no native module).
//
// WHY NOT argon2: the production image is Alpine/musl (Node 22). The `argon2`
// package is a node-gyp native module with no prebuilt binary for that
// platform/ABI, so `require("argon2")` threw at runtime and EVERY password
// signup returned 500 (every existing account was passwordless / magic-link
// because of this). scrypt is built into Node, has zero native dependencies,
// and works identically on glibc and musl — this class of failure can't recur.
//
// scrypt is an OWASP-accepted password KDF. Parameters below target ~64 MiB of
// memory per hash (matching the previous argon2 cost), heavy enough to make
// GPU cracking of a leaked hash expensive, cheap enough for login latency.
//
// The stored hash is self-describing: "scrypt$N$r$p$saltB64$hashB64", so
// verifyPassword reads the parameters from the value itself and the cost can be
// raised later without invalidating older hashes. There were no existing
// password hashes when this landed, so no migration was needed.
// =============================================================================

import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

// N=2^16, r=8, p=1 → ~64 MiB working memory (128 * N * r bytes).
const PARAMS = { N: 65536, r: 8, p: 1 } as const;
const KEYLEN = 32;
const SALT_BYTES = 16;
// Node's default scrypt maxmem is 32 MiB, which our N would exceed — raise the
// ceiling comfortably above the ~64 MiB the chosen params actually need.
const MAXMEM = 160 * 1024 * 1024;

/**
 * Hash a plaintext password with scrypt. Returns a self-describing string
 * ("scrypt$N$r$p$saltB64$hashB64") containing the parameters, salt and digest,
 * so verifyPassword needs nothing else and cost can be tuned over time.
 */
export async function hashPassword(plain: string): Promise<string> {
  if (typeof plain !== "string" || plain.length === 0) {
    throw new Error("hashPassword: plaintext is empty");
  }
  if (plain.length > 1024) {
    // Defensive cap against pathological inputs (paste-bomb DoS) at the boundary.
    throw new Error("hashPassword: input too long");
  }
  const salt = randomBytes(SALT_BYTES);
  const derived = await scrypt(plain, salt, KEYLEN, {
    N: PARAMS.N,
    r: PARAMS.r,
    p: PARAMS.p,
    maxmem: MAXMEM,
  });
  return [
    "scrypt",
    PARAMS.N,
    PARAMS.r,
    PARAMS.p,
    salt.toString("base64"),
    derived.toString("base64"),
  ].join("$");
}

/**
 * Verify a plaintext password against a stored hash. Returns false (never
 * throws) for malformed/non-scrypt hashes so the caller can give a generic
 * "invalid credentials" response without leaking which field was bad.
 * Comparison is constant-time.
 */
export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  if (
    typeof plain !== "string" ||
    typeof hash !== "string" ||
    plain.length === 0 ||
    hash.length === 0
  ) {
    return false;
  }
  try {
    const parts = hash.split("$");
    if (parts.length !== 6 || parts[0] !== "scrypt") return false;
    const N = Number(parts[1]);
    const r = Number(parts[2]);
    const p = Number(parts[3]);
    const salt = Buffer.from(parts[4], "base64");
    const expected = Buffer.from(parts[5], "base64");
    if (
      !Number.isInteger(N) ||
      !Number.isInteger(r) ||
      !Number.isInteger(p) ||
      salt.length === 0 ||
      expected.length === 0
    ) {
      return false;
    }
    const derived = await scrypt(plain, salt, expected.length, {
      N,
      r,
      p,
      maxmem: Math.max(MAXMEM, 256 * N * r),
    });
    return (
      derived.length === expected.length && timingSafeEqual(derived, expected)
    );
  } catch {
    return false;
  }
}
