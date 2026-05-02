// =============================================================================
// POST /api/v1/auth/login — public API auth bridge (B0.8).
//
// Body: { email, password }
// Response on success (200):
//   {
//     accessToken: <jwt 15min>,
//     refreshToken: <opaque token, 30d>,
//     sessionExpiresAt: ISO,
//     user: { id, email, name, locale, emailVerifiedAt }
//   }
//
// Differences vs. the internal /api/auth/login:
//   - No Set-Cookie header (mobile / API clients store tokens themselves).
//   - refreshToken is returned in the JSON body.
//   - CORS headers applied per allowlist.
//
// Security parity with the cookie path:
//   - Constant-time argon2 verify against a dummy hash on missing user.
//   - 10 / hour / IP broad limit + 3-fail / 5min lockout per email.
//   - Uniform invalid_credentials response (no email enumeration).
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { issueSession } from "@/lib/auth/session";
import { signAccessToken } from "@/lib/auth/jwt";
import {
  hitWindow,
  hitFailedLogin,
  clearFailedLogins,
  isLocked,
  clientIp,
} from "@/lib/auth/rate-limit";
import { hashIp } from "@/lib/auth/ip-hash";
import { errorJson, readJsonBody } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(1024),
});

let dummyHashPromise: Promise<string> | null = null;
async function getDummyHash(): Promise<string> {
  if (!dummyHashPromise) {
    const { hashPassword } = await import("@/lib/auth/password");
    dummyHashPromise = hashPassword(
      "dummy::no-such-user::placeholder::v1",
    ).catch(
      () =>
        "$argon2id$v=19$m=65536,t=3,p=4$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    );
  }
  return dummyHashPromise;
}

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limit = hitWindow(`v1::login::${ip}`, RATE_MAX, RATE_WINDOW_MS);
  if (!limit.ok) {
    return applyCors(
      errorJson(
        "rate_limited",
        "Too many sign-in attempts. Try again later.",
        429,
        { "Retry-After": String(limit.retryAfterSeconds ?? 60) },
      ),
      req,
    );
  }

  const body = await readJsonBody(req);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return applyCors(
      errorJson("invalid_credentials", "Invalid email or password.", 400),
      req,
    );
  }
  const { email, password } = parsed.data;

  const lockKey = `v1-email::${email}`;
  const locked = isLocked(lockKey);
  if (!locked.ok) {
    return applyCors(
      errorJson(
        "rate_limited",
        "Too many failed attempts. Try again in a moment.",
        429,
        { "Retry-After": String(locked.retryAfterSeconds ?? 60) },
      ),
      req,
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

  const hashToVerify = user?.passwordHash ?? (await getDummyHash());
  const ok = await verifyPassword(password, hashToVerify);

  if (!user || !user.passwordHash || !ok) {
    hitFailedLogin(lockKey);
    return applyCors(
      errorJson("invalid_credentials", "Invalid email or password.", 401),
      req,
    );
  }

  clearFailedLogins(lockKey);

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
