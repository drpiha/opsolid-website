// POST /api/auth/signup — passwordless account creation.
// A single-use email link proves ownership before creating an authenticated session.
// Legacy password submissions fail explicitly before any database or email work.

import { NextResponse } from "next/server";
import { z } from "zod";
import { issueMagicLink } from "@/lib/auth/magic-link";
import { hitWindow, clientIp } from "@/lib/auth/rate-limit";
import { hashIp } from "@/lib/auth/ip-hash";
import { sendEmail } from "@/lib/email/client";
import {
  renderMagicLinkHtml,
  renderMagicLinkText,
  magicLinkSubject,
} from "@/lib/email/templates/magic-link";
import { captureAuthEvent, errorResponse, readJson } from "../_helpers";
import { fireMarketingOptIn } from "@/lib/marketing/consent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const SignupSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z
    .string()
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
  // GDPR / §7 UWG — separate, unticked-by-default marketing opt-in. The
  // account/card data is NOT consent to be marketed to (purpose limitation),
  // so this is its own boolean, defaulted off. Only true here triggers the DOI.
  marketingOptIn: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Marketing double-opt-in (DOI) — fire-and-forget.
//
// Called AFTER the account is created / link issued. Delegates to the shared
// `fireMarketingOptIn` (src/lib/marketing/consent.ts), which is internally
// safe (own try/catch, never throws) so it can never delay or fail the signup
// response. Failures are captured with ip_hash ONLY — never the raw email.
// ---------------------------------------------------------------------------
function fireOptIn(email: string, locale: string, ip: string): void {
  void fireMarketingOptIn({
    email,
    locale,
    ipHash: hashIp(ip),
    source: "signup",
    onError: (err) => {
      void captureAuthEvent("marketing_optin_failed", {
        ip_hash: hashIp(ip),
        err: String(err),
      });
    },
  });
}

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
  const { email, password, name, locale, marketingOptIn } = parsed.data;
  const consentLocale = locale ?? "de";

  if (password) {
    return errorResponse("password_signup_disabled", "Create your account with Google or an email sign-in link. Passwords are available only for previously verified accounts.", 422);
  }

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
    // GDPR / §7 UWG — separate marketing DOI. Fire-and-forget; never blocks
    // or fails the signup response. Only when the user explicitly ticked it.
    if (marketingOptIn === true) {
      fireOptIn(email, consentLocale, ip);
    }
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
