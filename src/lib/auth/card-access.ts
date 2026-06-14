// =============================================================================
// Card edit-access resolver — token OR account-session ownership.
//
// The original self-service model gated edit/manage purely on the per-order
// `editToken` (email-link flow). Once cards can be claimed into an account,
// a logged-in owner must also be able to edit from the dashboard WITHOUT the
// email token. This helper unifies both:
//
//   1. valid `?t=<editToken>`            → access via "token"
//   2. session user with order.userId    → access via "session"
//
// On neither, it throws the same EditTokenError codes the token-only gate used,
// so existing callers (edit page, PATCH route) keep their rejection contract.
// =============================================================================

import { timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { CardOrder } from "@/generated/prisma";
import { EditTokenError } from "./edit-token";
import { getOptionalUser } from "./require-user";
import { getSessionUser } from "./session";

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "utf8");
  const bBuf = Buffer.from(b, "utf8");
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export type CardAccessVia = "token" | "session";

export interface CardAccess {
  order: CardOrder;
  via: CardAccessVia;
}

/**
 * Resolve edit access to a card order. Provide the order id plus the candidate
 * `token` (?t=) and ONE session source:
 *   - `req`          for API route handlers (reads cookie/bearer), or
 *   - `refreshToken` for server components that already read the refresh cookie.
 *
 * Returns the loaded order + which credential granted access, or throws
 * EditTokenError (missing_token / not_found / bad_token).
 */
export async function resolveCardEditAccess(opts: {
  orderId: string;
  token?: string | null;
  req?: Request;
  refreshToken?: string | null;
}): Promise<CardAccess> {
  const order = await prisma.cardOrder.findUnique({
    where: { id: opts.orderId },
  });
  if (!order) throw new EditTokenError("not_found");

  // 1) Per-order edit token (email-link flow). Unchanged constant-time check.
  const token = opts.token?.trim();
  if (
    token &&
    token.length >= 8 &&
    order.editToken &&
    safeEqual(token, order.editToken)
  ) {
    return { order, via: "token" };
  }

  // 2) Account-session ownership (dashboard / owner flow).
  let user = null;
  if (opts.req) {
    user = await getOptionalUser(opts.req);
  } else if (opts.refreshToken) {
    user = await getSessionUser(opts.refreshToken);
  }
  if (user && order.userId && order.userId === user.id) {
    return { order, via: "session" };
  }

  // Neither credential granted access — mirror the token-only error codes.
  if (!token || token.length < 8) throw new EditTokenError("missing_token");
  throw new EditTokenError("bad_token");
}
