// =============================================================================
// POST /api/v1/referrals/redeem — attribute a new signup to a referrer.
//
// Body: { code: string } — either a 6-char referral code OR a card slug
//   (the public-viewer "Create yours" CTA passes the slug as `ref`; the
//   redeem helper resolves both forms via `resolveReferrerByRef`).
//
// Auth: bearer-only. The route is invoked post-authentication by the mobile
//   shell as soon as it has both a session AND a `ref` query param it
//   stashed during the magic-link / signup flow.
//
// Idempotency: per (referrerId, refereeUserId). A second call with the same
//   pair just returns 200 with `created: false`. A self-referral attempt is
//   silently ignored (also `created: false`).
//
// Rate limit: 10 / hour / user — tighter than reads because this writes to
//   the redemption table.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError } from "@/lib/auth/require-user";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson, readJsonBody } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";
import { redeemReferral } from "@/lib/referrals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const Body = z
  .object({
    code: z.string().trim().min(1).max(80),
  })
  .strict();

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function POST(req: Request) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit(
      "referrals:redeem",
      req,
      user,
      RATE_MAX,
      RATE_WINDOW_MS,
    );
    if (!limit.ok) {
      return applyCors(
        errorJson("rate_limited", "Too many requests.", 429, {
          "Retry-After": String(limit.retryAfterSeconds ?? 60),
        }),
        req,
      );
    }

    const raw = await readJsonBody(req);
    const parsed = Body.safeParse(raw);
    if (!parsed.success) {
      return applyCors(
        errorJson(
          "invalid_payload",
          parsed.error.issues[0]?.message ?? "Invalid payload.",
          400,
        ),
        req,
      );
    }

    const result = await redeemReferral(parsed.data.code, user.id);

    return applyCors(
      NextResponse.json(
        { created: result.created, referrerUserId: result.referrerUserId },
        { status: 200, headers: { "Cache-Control": "no-store" } },
      ),
      req,
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return applyCors(
        errorJson(err.code, "Authentication required.", err.status),
        req,
      );
    }
    console.error("[v1/referrals/redeem] failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}
