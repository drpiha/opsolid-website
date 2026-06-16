// =============================================================================
// Customer edit-token gate for self-service endpoints.
//
// Every CardOrder has a per-order random UUID in `editToken`. The customer
// receives it embedded in the "your card is being designed" / "your card is
// live" emails as `?t=...`. It is the ONLY auth for edit and cancel operations
// — no password, no account. That's deliberate: the customer paid, they know
// their email, and the token is high-entropy (128 bits) and per-order.
//
// Rejection matrix:
//   - no `?t=` query param                  → 403 missing_token
//   - order not found                       → 404 not_found
//   - order has no token (ancient order)    → 403 bad_token (forces operator
//                                              to re-issue via backfill)
//   - token length mismatch                 → 403 bad_token (short-circuit
//                                              before constant-time compare)
//   - token value mismatch                  → 403 bad_token (constant-time)
//
// Constant-time compare uses node:crypto.timingSafeEqual to prevent an
// attacker from fingerprinting the token byte-by-byte via response timing.
// =============================================================================

import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CardOrder } from "@/generated/prisma";

export type EditTokenErrorCode =
  | "missing_token"
  | "not_found"
  | "bad_token";

export class EditTokenError extends Error {
  readonly code: EditTokenErrorCode;
  readonly status: number;

  constructor(code: EditTokenErrorCode) {
    super(code);
    this.code = code;
    this.status = code === "not_found" ? 404 : 403;
    this.name = "EditTokenError";
  }
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "utf8");
  const bBuf = Buffer.from(b, "utf8");
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

/** Pull the `t` token out of a NextRequest query or a pre-parsed string. */
function extractToken(
  reqOrToken: NextRequest | string | null | undefined
): string | null {
  if (typeof reqOrToken === "string") return reqOrToken;
  if (reqOrToken && "url" in reqOrToken) {
    return new URL(reqOrToken.url).searchParams.get("t");
  }
  return null;
}

/**
 * Loads the order and verifies the `t` query param matches `editToken`.
 * Throws EditTokenError on any mismatch. On success, returns the loaded order.
 *
 * Accepts either a NextRequest (reads `new URL(req.url).searchParams`) or a
 * pre-extracted token string (server components that already parsed the query).
 */
export async function requireEditToken(
  reqOrToken: NextRequest | string | null | undefined,
  orderId: string
): Promise<CardOrder> {
  const token = extractToken(reqOrToken);
  if (!token || token.length < 8) {
    throw new EditTokenError("missing_token");
  }

  const order = await prisma.cardOrder.findUnique({ where: { id: orderId } });
  if (!order) throw new EditTokenError("not_found");
  if (!order.editToken) throw new EditTokenError("bad_token");
  if (!safeEqual(token, order.editToken)) {
    throw new EditTokenError("bad_token");
  }

  return order;
}

/**
 * Authorize a card edit/manage request via EITHER credential:
 *   A. Session ownership — a logged-in user whose `id` matches `order.userId`
 *      (a claimed card). No token needed in the URL. This is what lets the
 *      dashboard "Düzenle" button and any return visit work across devices,
 *      and fixes the 403 a logged-in owner hit when the email link's `?t=`
 *      wasn't present.
 *   B. Per-order edit token — the high-entropy `?t=` from the order email,
 *      unchanged behaviour for anonymous / pre-account owners.
 *
 * Path A is only attempted when a `user` is supplied. To avoid leaking order
 * existence to unauthenticated callers, an absent/short token with no user
 * fails with `missing_token` BEFORE any DB lookup — exactly like
 * `requireEditToken`. Callers resolve `user` with `getOptionalUser` (API) or
 * `getSessionUser` (server component) and pass it in; this module stays free
 * of session-layer imports.
 */
export async function requireCardEditAccess(
  reqOrToken: NextRequest | string | null | undefined,
  orderId: string,
  user?: { id: string } | null
): Promise<CardOrder> {
  const token = extractToken(reqOrToken);
  const hasToken = !!token && token.length >= 8;

  // No usable token AND no candidate owner → fail like the token-only gate,
  // without revealing whether the order exists.
  if (!hasToken && !user) {
    throw new EditTokenError("missing_token");
  }

  const order = await prisma.cardOrder.findUnique({ where: { id: orderId } });
  if (!order) throw new EditTokenError("not_found");

  // Path A — claimed-card owner (session). order.userId is null until claimed.
  if (user && order.userId && order.userId === user.id) {
    return order;
  }

  // Path B — per-order edit token.
  if (!hasToken) throw new EditTokenError("missing_token");
  if (!order.editToken) throw new EditTokenError("bad_token");
  if (!safeEqual(token as string, order.editToken)) {
    throw new EditTokenError("bad_token");
  }

  return order;
}
