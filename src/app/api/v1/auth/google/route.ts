// POST /api/v1/auth/google — mobile Google Sign-In (ID token verification).
//
// Body: { idToken: string }
//
// The mobile client obtains an ID token via Google Sign-In SDK (or
// expo-auth-session), sends it here. We verify it server-side with Google's
// tokeninfo endpoint, then find-or-create the user by email (same rule as the
// web callback: email = account identity, never by provider ID).
//
// Rate limit: 20 / hour / IP.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { issueSession } from "@/lib/auth/session";
import { signAccessToken } from "@/lib/auth/jwt";
import { hashIp } from "@/lib/auth/ip-hash";
import { hitWindow, clientIp } from "@/lib/auth/rate-limit";
import { errorJson, readJsonBody } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const BodySchema = z.object({
  idToken: z.string().min(10).max(4096),
});

interface GoogleTokenInfo {
  aud: string;
  email: string;
  email_verified: string; // "true" | "false" as string
  name?: string;
  sub: string;
  exp: string;
}

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const limit = hitWindow(`v1::google::${ip}`, RATE_MAX, RATE_WINDOW_MS);
  if (!limit.ok) {
    return applyCors(
      errorJson("rate_limited", "Too many requests. Try again later.", 429, {
        "Retry-After": String(limit.retryAfterSeconds ?? 60),
      }),
      req,
    );
  }

  const body = await readJsonBody(req);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return applyCors(errorJson("invalid_request", "idToken is required.", 400), req);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return applyCors(
      errorJson("not_configured", "Google Sign-In is not configured.", 503),
      req,
    );
  }

  // Verify the ID token with Google's tokeninfo endpoint.
  // This is lightweight (one HTTP call) and doesn't require a client secret.
  let info: GoogleTokenInfo;
  try {
    const tokenRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(parsed.data.idToken)}`,
    );
    if (!tokenRes.ok) {
      return applyCors(
        errorJson("invalid_token", "Google ID token is invalid or expired.", 401),
        req,
      );
    }
    info = (await tokenRes.json()) as GoogleTokenInfo;
  } catch {
    return applyCors(
      errorJson("token_verify_failed", "Could not verify Google token.", 502),
      req,
    );
  }

  // Verify token was issued for our app
  if (info.aud !== clientId) {
    return applyCors(
      errorJson("invalid_token", "Token audience mismatch.", 401),
      req,
    );
  }

  // Reject unverified emails
  if (info.email_verified !== "true") {
    return applyCors(
      errorJson("email_not_verified", "Google account email is not verified.", 403),
      req,
    );
  }

  const email = info.email.trim().toLowerCase();

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: info.name ?? null,
        emailVerifiedAt: new Date(),
        locale: "de",
      },
    });
  } else if (!user.emailVerifiedAt) {
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: new Date() },
    });
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
          role: user.role,
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
