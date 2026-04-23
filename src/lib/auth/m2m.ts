// =============================================================================
// Machine-to-machine bearer auth for federated admin (Kutasia dashboard).
//
// Unlike the URL-based ADMIN_TOKEN used by /admin/orders in a browser, this
// token is only ever sent from one server to another in an Authorization
// header. Constant-time compare avoids timing-leak fingerprinting.
// =============================================================================

import { timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";

export type M2MAuthResult =
  | { ok: true }
  | { ok: false; reason: "missing_env" | "no_header" | "mismatch" };

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "utf8");
  const bBuf = Buffer.from(b, "utf8");
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export function authorizeM2M(req: NextRequest): M2MAuthResult {
  const expected = process.env.M2M_ADMIN_TOKEN;
  if (!expected || expected.length < 16) {
    return { ok: false, reason: "missing_env" };
  }
  const header = req.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return { ok: false, reason: "no_header" };
  const token = match[1].trim();
  if (!safeEqual(token, expected)) {
    return { ok: false, reason: "mismatch" };
  }
  return { ok: true };
}
