// =============================================================================
// POST /api/v1/auth/magic-link/verify — JWT-returning magic-link consume (C7.3).
//
// Body: { token }
// Response on success (200):
//   {
//     accessToken: <jwt 15min>,
//     refreshToken: <opaque token, 30d>,
//     sessionExpiresAt: ISO,
//     user: { id, email, name, locale, emailVerifiedAt }
//   }
//
// Mirrors /api/auth/magic-link/verify (cookie path) but returns tokens in JSON
// for mobile / API clients that can't use cookies. Single-use token; same
// 30/hour/IP brute-force ceiling.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { consumeMagicLink } from "@/lib/auth/magic-link";
import { issueSession } from "@/lib/auth/session";
import { signAccessToken } from "@/lib/auth/jwt";
import { hitWindow, clientIp } from "@/lib/auth/rate-limit";
import { hashIp } from "@/lib/auth/ip-hash";
import { errorJson, readJsonBody } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { captureAuthEvent } from "../../../../auth/_helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const VerifySchema = z.object({
  token: z.string().min(8).max(512),
});

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limit = hitWindow(`v1::mlverify::${ip}`, RATE_MAX, RATE_WINDOW_MS);
  if (!limit.ok) {
    return applyCors(
      errorJson(
        "rate_limited",
        "Too many verification attempts. Try again later.",
        429,
        { "Retry-After": String(limit.retryAfterSeconds ?? 60) },
      ),
      req,
    );
  }

  const body = await readJsonBody(req);
  const parsed = VerifySchema.safeParse(body);
  if (!parsed.success) {
    return applyCors(
      errorJson("invalid_or_expired_link", "Invalid or expired link.", 400),
      req,
    );
  }

  const user = await consumeMagicLink(parsed.data.token);
  if (!user) {
    void captureAuthEvent("magic_link_consume_failed", {
      ip_hash: hashIp(ip),
      surface: "v1",
    });
    return applyCors(
      errorJson("invalid_or_expired_link", "Invalid or expired link.", 401),
      req,
    );
  }

  const session = await issueSession(
    user.id,
    req.headers.get("user-agent"),
    hashIp(ip),
  );
  const accessToken = await signAccessToken(user.id);

  return applyCors(
    NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          locale: user.locale,
          emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
        },
        accessToken,
        refreshToken: session.refreshToken,
        sessionExpiresAt: session.expiresAt.toISOString(),
      },
      { status: 200 },
    ),
    req,
  );
}
