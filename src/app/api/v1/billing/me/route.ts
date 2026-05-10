// =============================================================================
// GET /api/v1/billing/me — current Pro subscription state for the caller.
//
// Auth: bearer-only. Returns the user's pro flags + subscription details so
// the mobile Settings tab can render the right "Manage" / "Upgrade" CTA in
// one round-trip.
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthError } from "@/lib/auth/require-user";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";
import { isPro } from "@/lib/auth/pro";

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

    const limit = rateLimit("billing:me", req, user, RATE_MAX, RATE_WINDOW_MS);
    if (!limit.ok) {
      return applyCors(
        errorJson("rate_limited", "Too many requests.", 429, {
          "Retry-After": String(limit.retryAfterSeconds ?? 60),
        }),
        req,
      );
    }

    const fresh = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        proSince: true,
        role: true,
        stripeCustomerId: true,
        userSubscription: {
          select: {
            status: true,
            priceId: true,
            currentPeriodEnd: true,
            cancelAtPeriodEnd: true,
          },
        },
      },
    });

    return applyCors(
      NextResponse.json(
        {
          isPro: isPro({
            proSince: fresh?.proSince ?? null,
            role: fresh?.role ?? null,
          }),
          proSince: fresh?.proSince?.toISOString() ?? null,
          hasStripeCustomer: Boolean(fresh?.stripeCustomerId),
          subscription: fresh?.userSubscription
            ? {
                status: fresh.userSubscription.status,
                priceId: fresh.userSubscription.priceId,
                currentPeriodEnd:
                  fresh.userSubscription.currentPeriodEnd?.toISOString() ?? null,
                cancelAtPeriodEnd: fresh.userSubscription.cancelAtPeriodEnd,
              }
            : null,
          prices: {
            monthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? null,
            yearly: process.env.STRIPE_PRICE_PRO_YEARLY ?? null,
          },
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
    console.error("[v1/billing/me] failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}
