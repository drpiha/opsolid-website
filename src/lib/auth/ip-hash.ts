// =============================================================================
// IP hashing — privacy-by-default for Session.ipHash + auditing.
//
// We never store raw client IPs. The salt is read from AUTH_IP_SALT and falls
// back to a stable per-process placeholder in dev. The salt should be rotated
// periodically; rotation invalidates correlation across the rotation but is
// fine for our analytic use (per-session-window deduplication only).
// =============================================================================

import { createHash } from "node:crypto";

const SALT =
  process.env.AUTH_IP_SALT ??
  process.env.SESSION_IP_SALT ??
  "opsolid-dev-ip-salt-rotate-in-prod";

export function hashIp(ip: string | null | undefined): string | null {
  if (!ip || ip === "unknown") return null;
  return createHash("sha256").update(`${SALT}::${ip}`).digest("hex");
}
