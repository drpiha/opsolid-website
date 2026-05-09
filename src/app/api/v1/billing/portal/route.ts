// =============================================================================
// POST /api/v1/billing/portal — open the Stripe Customer Portal.
//
// Auth: bearer-only. Returns 404 `no_subscription` when the user has never
// gone through checkout (no Customer yet); the client can then redirect to
// /api/v1/billing/checkout. Rate limit: 20 / hour / user.
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthError } from "@/lib/auth/require-user";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";
import { createProPortalSession } from "@/lib/billing/pro";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000;

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function POST(req: Request) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit(
      "billing:portal",
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

    // Need a stripeCustomerId. Read from the User cache; fall back to the
    // UserSubscription row (covers a user who somehow lost the cache).
    const fresh = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        stripeCustomerId: true,
        userSubscription: { select: { stripeCustomerId: true } },
      },
    });
    const customerId =
      fresh?.stripeCustomerId ?? fresh?.userSubscription?.stripeCustomerId ?? null;
    if (!customerId) {
      return applyCors(
        errorJson("no_subscription", "No active subscription.", 404),
        req,
      );
    }

    const session = await createProPortalSession({ customerId });
    return applyCors(
      NextResponse.json(
        { url: session.url },
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
    console.error("[v1/billing/portal] failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}
