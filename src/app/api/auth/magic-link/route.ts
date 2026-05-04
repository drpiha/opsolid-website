// =============================================================================
// POST /api/auth/magic-link — Faz 7.0a primary auth flow.
//
// Body: { email, locale? }
//
// Behaviour:
//   - Always returns 202 ("if the address is valid, we sent a link").
//   - If the user does not exist, we create one (auto-signup) and email a
//     verification + sign-in link.
//   - If the user exists, we issue a fresh single-use token and email it.
//   - Email send failures are logged but never surfaced — would leak existence.
//
// Rate limit: 5 requests / hour / IP (hard cap; magic links cost SMTP credits).
// =============================================================================

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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const RequestSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  locale: z.enum(["de", "en", "tr"]).optional(),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limit = hitWindow(`magic::${ip}`, RATE_MAX, RATE_WINDOW_MS);
  if (!limit.ok) {
    return errorResponse(
      "rate_limited",
      "Too many requests. Try again later.",
      429,
      { "Retry-After": String(limit.retryAfterSeconds ?? 60) },
    );
  }

  const body = await readJson(req);
  const parsed = RequestSchema.safeParse(body);
  // Even on invalid input, return the same 202 so probing the validator
  // doesn't reveal whether a given email exists.
  if (!parsed.success) {
    return NextResponse.json(
      { ok: true, message: "If the address is valid, a sign-in link has been sent." },
      { status: 202 },
    );
  }
  const { email, locale } = parsed.data;

  try {
    const issued = await issueMagicLink(email, { locale });
    const localeForCopy = locale ?? "de";
    // Always include the opsolid:// deep-link as a secondary CTA. We can't
    // know whether the user will open the email on phone or desktop, so the
    // single email serves both surfaces. Desktop users without the app
    // installed simply ignore the "Open in app" button.
    const html = renderMagicLinkHtml({
      link: issued.link,
      appLink: issued.appLink,
      locale: localeForCopy,
    });
    const text = renderMagicLinkText({
      link: issued.link,
      appLink: issued.appLink,
      locale: localeForCopy,
    });
    const subject = magicLinkSubject(localeForCopy);
    void sendEmail({ to: email, subject, html, text }).catch((err) => {
      void captureAuthEvent("magic_link_email_failed", {
        ip_hash: hashIp(ip),
        err: String(err),
      });
    });
  } catch (err) {
    void captureAuthEvent("magic_link_issue_failed", {
      ip_hash: hashIp(ip),
      err: String(err),
    });
  }

  return NextResponse.json(
    { ok: true, message: "If the address is valid, a sign-in link has been sent." },
    { status: 202 },
  );
}
