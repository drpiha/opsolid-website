// =============================================================================
// POST /api/auth/signup — Faz 7.0a.
//
// Body: { email, password?, name?, locale? }
//
// Two paths:
//   - With password: argon2id-hash → create User → issue session + access JWT.
//   - Without password (or empty password): treat as magic-link signup → email
//     a single-use link, return a neutral 202. The client should switch the UI
//     to a "check your inbox" state.
//
// Rate limit: 5/hour/IP. Email collision -> 409 with neutral wording.
// Email is lowercase-normalised before insert.
//
// Privacy: never confirm or deny existence of an email. The 409 path leaks
// existence on the password-signup flow by necessity (we have to tell the
// caller they can't create another row), but the magic-link path always
// returns 202 regardless of whether the row existed.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { issueSession } from "@/lib/auth/session";
import { issueMagicLink } from "@/lib/auth/magic-link";
import { signAccessToken } from "@/lib/auth/jwt";
import { setRefreshCookie } from "@/lib/auth/cookies";
import { hitWindow, clientIp } from "@/lib/auth/rate-limit";
import { hashIp } from "@/lib/auth/ip-hash";
import { sendEmail } from "@/lib/email/client";
import {
  renderMagicLinkHtml,
  renderMagicLinkText,
  magicLinkSubject,
} from "@/lib/email/templates/magic-link";
import { captureAuthEvent, errorResponse, readJson } from "../_helpers";
import { redeemReferral } from "@/lib/referrals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const SignupSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z
    .string()
    .min(8)
    .max(256)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  name: z
    .string()
    .trim()
    .max(160)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  locale: z.enum(["de", "en", "tr"]).optional(),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limit = hitWindow(`signup::${ip}`, RATE_MAX, RATE_WINDOW_MS);
  if (!limit.ok) {
    return errorResponse(
      "rate_limited",
      "Too many signup attempts. Try again later.",
      429,
      { "Retry-After": String(limit.retryAfterSeconds ?? 60) },
    );
  }

  const body = await readJson(req);
  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("invalid_input", "Invalid signup payload.", 400);
  }
  const { email, password, name, locale } = parsed.data;

  // ---------------- Magic-link path (no password supplied) ----------------
  if (!password) {
    try {
      const issued = await issueMagicLink(email, { locale, name });
      const html = renderMagicLinkHtml({ link: issued.link, locale: locale ?? "de" });
      const text = renderMagicLinkText({ link: issued.link, locale: locale ?? "de" });
      const subject = magicLinkSubject(locale ?? "de");
      // Fire-and-forget: don't block the response on SMTP. The user sees the
      // "check inbox" UI immediately; if the send fails we log + capture but
      // we never expose that to the client (would leak existence).
      void sendEmail({ to: email, subject, html, text }).catch((err) => {
        void captureAuthEvent("magic_link_email_failed", {
          email_hash: hashIp(email),
          err: String(err),
        });
      });
    } catch (err) {
      void captureAuthEvent("magic_link_issue_failed", {
        ip_hash: hashIp(ip),
        err: String(err),
      });
      // Still respond 202 to avoid revealing internal state.
    }
    return NextResponse.json(
      {
        ok: true,
        method: "magic_link",
        message: "If the address is valid, a sign-in link has been sent.",
      },
      { status: 202 },
    );
  }

  // ---------------- Password signup path ----------------
  let passwordHash: string;
  try {
    passwordHash = await hashPassword(password);
  } catch (err) {
    void captureAuthEvent("password_hash_failed", {
      ip_hash: hashIp(ip),
      err: String(err),
    });
    return errorResponse(
      "server_error",
      "Could not process the request. Please try again.",
      500,
    );
  }

  let user;
  try {
    user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name ?? null,
        locale: locale ?? "de",
      },
      select: { id: true, email: true, name: true, locale: true },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      // Unique constraint violated — email already exists.
      void captureAuthEvent("signup_email_collision", {
        ip_hash: hashIp(ip),
      });
      return errorResponse(
        "email_unavailable",
        "This email cannot be used to sign up.",
        409,
      );
    }
    void captureAuthEvent("signup_db_error", {
      ip_hash: hashIp(ip),
      err: String(err),
    });
    return errorResponse(
      "server_error",
      "Could not process the request. Please try again.",
      500,
    );
  }

  // Issue session + access JWT.
  const session = await issueSession(
    user.id,
    req.headers.get("user-agent"),
    hashIp(ip),
  );
  const accessToken = await signAccessToken(user.id);

  // M3 — attribute referral if the cookie is set. Failures must NEVER block
  // the signup response; fire-and-forget. Cookie cleared either way.
  const refCookie = req.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith("verso_ref="))
    ?.split("=")[1];
  if (refCookie) {
    try {
      const ref = decodeURIComponent(refCookie);
      void redeemReferral(ref, user.id).catch(() => {});
    } catch {
      /* malformed cookie — ignore */
    }
  }

  const res = NextResponse.json(
    {
      user: { id: user.id, email: user.email, name: user.name, locale: user.locale },
      accessToken,
      sessionExpiresAt: session.expiresAt.toISOString(),
    },
    { status: 201 },
  );
  setRefreshCookie(res, session.refreshToken);
  if (refCookie) {
    res.headers.append(
      "Set-Cookie",
      "verso_ref=; Path=/; Max-Age=0; SameSite=Lax",
    );
  }
  return res;
}
