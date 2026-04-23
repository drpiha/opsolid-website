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
  let token: string | null = null;
  if (typeof reqOrToken === "string") {
    token = reqOrToken;
  } else if (reqOrToken && "url" in reqOrToken) {
    token = new URL(reqOrToken.url).searchParams.get("t");
  }
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
