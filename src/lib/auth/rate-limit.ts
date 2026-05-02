// =============================================================================
// In-memory rate limiter for /api/auth/* routes (Faz 7.0a).
//
// Mirrors the pattern in src/app/api/cards/[slug]/lead/route.ts: a process-
// local Map<key, timestamps[]>. Fine for single-container deploys (current
// VPS topology). When we move to multi-instance we swap the implementation
// behind these named functions for Redis or Upstash — the call sites stay
// unchanged.
//
// Two distinct limiters:
//   - hitWindow(key, max, windowMs)
//       generic IP-bucket rate limit (5/hour, 10/hour, 60/hour …)
//   - hitFailedLogin(emailKey)
//       per-email login throttle: 3 fails in 5 min → 60s lockout. Stays
//       separate so an attacker spraying many emails from one IP doesn't
//       interact with a real user's lockout window.
//
// All buckets use Date.now() timestamps and prune-on-read to avoid an
// unbounded memory footprint.
// =============================================================================

const buckets = new Map<string, number[]>();
const lockouts = new Map<string, number>(); // key -> unlockAt epoch ms

export interface RateLimitResult {
  ok: boolean;
  retryAfterSeconds?: number;
}

/**
 * Sliding-window IP rate limit. Returns ok:false with retryAfterSeconds when
 * the bucket is full. Does NOT throw — caller renders the 429.
 */
export function hitWindow(
  key: string,
  max: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? [];
  const fresh = bucket.filter((t) => now - t < windowMs);
  if (fresh.length >= max) {
    buckets.set(key, fresh);
    const oldest = fresh[0] ?? now;
    const retryAfterSeconds = Math.ceil((windowMs - (now - oldest)) / 1000);
    return { ok: false, retryAfterSeconds: Math.max(retryAfterSeconds, 1) };
  }
  fresh.push(now);
  buckets.set(key, fresh);
  return { ok: true };
}

/**
 * Per-email failed-login throttle. Records a failure timestamp; if 3 happen
 * within FAIL_WINDOW we lock the email for LOCKOUT_MS, returning ok:false
 * for any further attempts (even with the right password — by design).
 *
 * Call hitFailedLogin(key) AFTER a verifyPassword:false outcome.
 * Call clearFailedLogins(key) after a successful login to reset the bucket.
 * Call isLocked(key) BEFORE doing any work, including password verify, so
 * a locked-out attacker doesn't consume CPU on argon2 verifications.
 */
const FAIL_WINDOW_MS = 5 * 60 * 1000;
const FAIL_THRESHOLD = 3;
const LOCKOUT_MS = 60 * 1000;

export function isLocked(emailKey: string): RateLimitResult {
  const unlockAt = lockouts.get(emailKey);
  if (!unlockAt) return { ok: true };
  const now = Date.now();
  if (unlockAt > now) {
    return { ok: false, retryAfterSeconds: Math.ceil((unlockAt - now) / 1000) };
  }
  lockouts.delete(emailKey);
  return { ok: true };
}

export function hitFailedLogin(emailKey: string): void {
  const now = Date.now();
  const bucket = (buckets.get("fail::" + emailKey) ?? []).filter(
    (t) => now - t < FAIL_WINDOW_MS,
  );
  bucket.push(now);
  buckets.set("fail::" + emailKey, bucket);
  if (bucket.length >= FAIL_THRESHOLD) {
    lockouts.set(emailKey, now + LOCKOUT_MS);
    buckets.delete("fail::" + emailKey);
  }
}

export function clearFailedLogins(emailKey: string): void {
  buckets.delete("fail::" + emailKey);
  lockouts.delete(emailKey);
}

/**
 * Extract the client IP from common proxy headers, falling back to a literal
 * "unknown" sentinel so unidentifiable callers share one bucket (a reasonable
 * default for self-hosted Traefik + same-origin traffic).
 */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}
