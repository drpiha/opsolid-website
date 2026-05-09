// =============================================================================
// POST /api/v1/billing/checkout — start a Pro subscription Checkout Session.
//
// Auth: bearer-only. Body: { interval: "monthly" | "yearly" }.
// Response: { url } — caller opens it in a browser (mobile uses
// expo-web-browser; web does a window.location redirect).
// Rate limit: 10 / hour / user (intentionally tight — checkout is unusual).
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError } from "@/lib/auth/require-user";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson, readJsonBody } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";
import { createProCheckoutSession } from "@/lib/billing/pro";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const BodySchema = z
  .object({
    interval: z.enum(["monthly", "yearly"]),
  })
  .strict();

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function POST(req: Request) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit(
      "billing:checkout",
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

    const body = await readJsonBody(req);
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return applyCors(
        errorJson(
          "invalid_payload",
          parsed.error.issues[0]?.message ?? "Invalid payload.",
          400,
          undefined,
          parsed.error.issues,
        ),
        req,
      );
    }

    const locale =
      user.locale === "de" || user.locale === "en" || user.locale === "tr"
        ? (user.locale as "de" | "en" | "tr")
        : "de";

    let session;
    try {
      session = await createProCheckoutSession({
        userId: user.id,
        email: user.email,
        name: user.name,
        interval: parsed.data.interval,
        locale,
      });
    } catch (err) {
      if (err instanceof Error && err.message === "pro_not_configured") {
        return applyCors(
          errorJson(
            "pro_not_configured",
            "Pro pricing not configured on this server.",
            503,
          ),
          req,
        );
      }
      throw err;
    }

    if (!session.url) {
      return applyCors(
        errorJson("checkout_failed", "Could not create checkout session.", 500),
        req,
      );
    }

    return applyCors(
      NextResponse.json(
        { url: session.url, sessionId: session.id },
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
    console.error("[v1/billing/checkout] failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}
