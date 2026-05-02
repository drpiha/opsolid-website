// =============================================================================
// POST /api/auth/login — Faz 7.0a.
//
// Body: { email, password }
//
// Privacy / timing:
//   - We always perform an argon2 verify, even when the user does not exist.
//     The verify is run against a constant fake hash so the response time is
//     indistinguishable between "no such email" and "wrong password" — closing
//     the classic email-enumeration timing side channel.
//   - 4xx responses are uniform: { error: { code: "invalid_credentials", ... } }.
//
// Rate limiting:
//   - 10 / hour / IP (broad spray protection)
//   - 3 fails in 5 min / email → 60s lockout (targeted brute-force protection)
//
// On success: issues session + access JWT, sets refresh cookie. Response shape
// matches /api/auth/signup so the client can use one helper for both flows.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { issueSession } from "@/lib/auth/session";
import { signAccessToken } from "@/lib/auth/jwt";
import { setRefreshCookie } from "@/lib/auth/cookies";
import {
  hitWindow,
  hitFailedLogin,
  clearFailedLogins,
  isLocked,
  clientIp,
} from "@/lib/auth/rate-limit";
import { hashIp } from "@/lib/auth/ip-hash";
import { captureAuthEvent, errorResponse, readJson } from "../_helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Pre-computed argon2id hash of a fixed dummy string. We pass this into
// verifyPassword when no user exists so the work factor matches the real
// path. Generated once at import time via a synthetic value; the real hash
// is computed lazily on first miss (we can't do top-level await). Until
// computed, we still spend roughly the same CPU thanks to verifyPassword's
// dynamic load + verify path.
let dummyHashPromise: Promise<string> | null = null;
async function getDummyHash(): Promise<string> {
  if (!dummyHashPromise) {
    // Lazy-load argon2 via the same module to keep the work factor identical.
    const { hashPassword } = await import("@/lib/auth/password");
    dummyHashPromise = hashPassword("dummy::no-such-user::placeholder").catch(
      () =>
        // If argon2 isn't installed, fall back to a sentinel that verifyPassword
        // will reject. Timing will be different but the production deploy will
        // have argon2 — this only matters in the broken-deps dev edge case.
        "$argon2id$v=19$m=65536,t=3,p=4$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    );
  }
  return dummyHashPromise;
}

const RATE_MAX = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(1024),
});

export async function POST(req: Request) {
  const ip = clientIp(req);

  const limit = hitWindow(`login::${ip}`, RATE_MAX, RATE_WINDOW_MS);
  if (!limit.ok) {
    return errorResponse(
      "rate_limited",
      "Too many sign-in attempts. Try again later.",
      429,
      { "Retry-After": String(limit.retryAfterSeconds ?? 60) },
    );
  }

  const body = await readJson(req);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("invalid_credentials", "Invalid email or password.", 400);
  }
  const { email, password } = parsed.data;

  const lockKey = `email::${email}`;
  const locked = isLocked(lockKey);
  if (!locked.ok) {
    return errorResponse(
      "rate_limited",
      "Too many failed attempts. Try again in a moment.",
      429,
      { "Retry-After": String(locked.retryAfterSeconds ?? 60) },
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Always verify against SOMETHING — when no user, verify against the
  // dummy hash so timing / CPU matches the real path.
  const hashToVerify = user?.passwordHash ?? (await getDummyHash());
  const ok = await verifyPassword(password, hashToVerify);

  // No user, or user has no password (magic-link-only account): treat as
  // wrong credentials. We deliberately don't tell the caller "this account
  // uses magic links" — would leak existence. Front-end can offer a
  // "forgot password / try magic link" affordance independently.
  if (!user || !user.passwordHash || !ok) {
    hitFailedLogin(lockKey);
    void captureAuthEvent("login_failed", { ip_hash: hashIp(ip) });
    return errorResponse(
      "invalid_credentials",
      "Invalid email or password.",
      401,
    );
  }

  clearFailedLogins(lockKey);

  const session = await issueSession(
    user.id,
    req.headers.get("user-agent"),
    hashIp(ip),
  );
  const accessToken = await signAccessToken(user.id);

  const res = NextResponse.json(
    {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        locale: user.locale,
      },
      accessToken,
      sessionExpiresAt: session.expiresAt.toISOString(),
    },
    { status: 200 },
  );
  setRefreshCookie(res, session.refreshToken);
  return res;
}
