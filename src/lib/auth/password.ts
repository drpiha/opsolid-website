// =============================================================================
// PASSWORD HASHING — argon2id (Faz 7.0a).
//
// We use argon2id with conservative-but-modern parameters:
//   memory cost (m): 64 MiB  (m=65536)
//   iterations  (t): 3
//   parallelism (p): 4
//
// These are ~OWASP 2023 recommendations and run in ~150-300 ms on a modern
// VPS — fast enough for login latency, slow enough that GPU-cracking a leaked
// hash is economically painful.
//
// IMPORTANT: argon2 is a native module. If `npm install argon2` fails on the
// build host (eg missing build tools), we fall back to a dynamic import so the
// rest of the auth surface still type-checks. The fallback path THROWS at
// runtime — it never silently downgrades to weaker hashing. The operator must
// install argon2 (or @node-rs/argon2 — see the optional shim below) before
// shipping to production.
//
// Constant-time verification is provided by argon2 itself. Both hash and verify
// are async (CPU-bound work happens off the libuv main thread).
// =============================================================================

// Type-only import keeps the build green even when the native module is not
// yet installed; the actual call site uses dynamic require so a missing module
// fails fast at runtime instead of at TypeScript compile time.
type Argon2Module = {
  hash: (
    plain: string,
    options?: {
      type?: number;
      memoryCost?: number;
      timeCost?: number;
      parallelism?: number;
    }
  ) => Promise<string>;
  verify: (hash: string, plain: string) => Promise<boolean>;
  argon2id: number;
};

let cached: Argon2Module | null = null;

function loadArgon2(): Argon2Module {
  if (cached) return cached;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("argon2") as Argon2Module;
    cached = mod;
    return mod;
  } catch (err) {
    throw new Error(
      "[auth/password] argon2 native module is not installed. " +
        "Run `npm install argon2` (or `@node-rs/argon2` and update the import) " +
        "before using password authentication.",
    );
  }
}

const PARAMS = {
  memoryCost: 65536, // 64 MiB
  timeCost: 3,
  parallelism: 4,
} as const;

/**
 * Hash a plaintext password with argon2id. Returns a self-describing string
 * containing algorithm, parameters, salt, and digest — verifyPassword reads
 * everything it needs from this single value, so we can change parameters in
 * the future without breaking existing hashes.
 */
export async function hashPassword(plain: string): Promise<string> {
  if (typeof plain !== "string" || plain.length === 0) {
    throw new Error("hashPassword: plaintext is empty");
  }
  if (plain.length > 1024) {
    // Defensive cap — argon2 accepts arbitrarily long inputs but this protects
    // against pathological inputs (eg paste-bomb DoS) at the API boundary.
    throw new Error("hashPassword: input too long");
  }
  const argon2 = loadArgon2();
  return argon2.hash(plain, {
    type: argon2.argon2id,
    memoryCost: PARAMS.memoryCost,
    timeCost: PARAMS.timeCost,
    parallelism: PARAMS.parallelism,
  });
}

/**
 * Verify a plaintext password against a stored hash. Returns false (not throws)
 * for malformed/non-argon2 hashes so the caller can give a generic
 * "invalid credentials" response without leaking which column was bad.
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
    const argon2 = loadArgon2();
    return await argon2.verify(hash, plain);
  } catch {
    return false;
  }
}
