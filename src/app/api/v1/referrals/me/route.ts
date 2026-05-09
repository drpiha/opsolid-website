// =============================================================================
// GET /api/v1/referrals/me — return the authenticated user's referral row,
// creating it lazily if missing.
//
// Auth: bearer-only.
// Rate limit: 60 / hour / user.
//
// Response: { code, redemptions, deepLink }
//   - code: 6-char uppercase alphanumeric.
//   - redemptions: int, denormalised counter on the Referral row.
//   - deepLink: pre-built share URL (`https://opsolid.de/c/?ref=<CODE>`) —
//     mobile Settings tab uses this verbatim with native Share.
// =============================================================================

import { NextResponse } from "next/server";
import { AuthError } from "@/lib/auth/require-user";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";
import { ensureReferralForUser } from "@/lib/referrals";
import { getSiteUrl } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 60;
const RATE_WINDOW_MS = 60 * 60 * 1000;

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function GET(req: Request) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit("referrals:me", req, user, RATE_MAX, RATE_WINDOW_MS);
    if (!limit.ok) {
      return applyCors(
        errorJson("rate_limited", "Too many requests.", 429, {
          "Retry-After": String(limit.retryAfterSeconds ?? 60),
        }),
        req,
      );
    }

    const referral = await ensureReferralForUser(user.id);

    const site = getSiteUrl().replace(/\/$/, "");
    const deepLink = `${site}/c/?ref=${referral.code}`;

    return applyCors(
      NextResponse.json(
        {
          code: referral.code,
          redemptions: referral.redemptions,
          deepLink,
        },
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
    console.error("[v1/referrals/me] failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}
