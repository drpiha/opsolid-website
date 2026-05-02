// =============================================================================
// /api/v1/* — per-user OR per-IP rate limit.
//
// Wraps the existing in-memory hitWindow / clientIp from src/lib/auth/rate-limit
// to add a "prefer-user-id-over-IP" key strategy. Authenticated traffic is
// limited per-user (one key shared across the user's devices); anonymous
// traffic is limited per-IP.
//
// This is in-memory and process-local. Acceptable for single-container deploys
// (current VPS topology). When we move to multi-instance, swap this module's
// internals for Redis / Upstash — every call site is a single-line function
// invocation, so the migration is mechanical.
// =============================================================================

import { hitWindow, clientIp } from "@/lib/auth/rate-limit";
import type { User } from "@/generated/prisma";

export interface RateLimitDecision {
  ok: boolean;
  retryAfterSeconds?: number;
}

/**
 * Build a stable bucket key for a route. When the caller is authenticated we
 * key on the user id (so a user with five devices on one shared NAT doesn't
 * starve a sibling on the same IP). Otherwise we key on the IP.
 */
function bucketKey(scope: string, req: Request, user: User | null): string {
  if (user) return `v1::${scope}::u::${user.id}`;
  return `v1::${scope}::ip::${clientIp(req)}`;
}

export function rateLimit(
  scope: string,
  req: Request,
  user: User | null,
  max: number,
  windowMs: number,
): RateLimitDecision {
  const key = bucketKey(scope, req, user);
  return hitWindow(key, max, windowMs);
}
