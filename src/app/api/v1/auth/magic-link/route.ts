// =============================================================================
// POST /api/v1/auth/magic-link — issue a magic-link email.
//
// Mobile clients can't open the link directly (the link redirects to the web
// session-cookie flow), but this endpoint lets a mobile-side email entry
// trigger the same link the user will then click on their phone's mail app.
//
// Always returns 202 ("if the address is valid, we sent a link"); never
// confirms or denies user existence. Same rate limit as the cookie path.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { issueMagicLink } from "@/lib/auth/magic-link";
import { hitWindow, clientIp } from "@/lib/auth/rate-limit";
import { sendEmail } from "@/lib/email/client";
import {
  renderMagicLinkHtml,
  renderMagicLinkText,
  magicLinkSubject,
} from "@/lib/email/templates/magic-link";
import { errorJson, readJsonBody } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const RequestSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  // M6 follow-up: auth-email templates ship in all 7 locales (en/de/tr +
  // es/it/fr/ar). Mobile clients now forward es|it|fr|ar directly instead of
  // collapsing to "en" client-side.
  locale: z.enum(["de", "en", "tr", "es", "it", "fr", "ar"]).optional(),
});

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limit = hitWindow(`v1::magic::${ip}`, RATE_MAX, RATE_WINDOW_MS);
  if (!limit.ok) {
    return applyCors(
      errorJson(
        "rate_limited",
        "Too many requests. Try again later.",
        429,
        { "Retry-After": String(limit.retryAfterSeconds ?? 60) },
      ),
      req,
    );
  }

  const body = await readJsonBody(req);
  const parsed = RequestSchema.safeParse(body);
  // Even on invalid input — always 202 so probing the validator can't tell
  // valid emails from invalid ones.
  if (!parsed.success) {
    return applyCors(
      NextResponse.json(
        {
          ok: true,
          message:
            "If the address is valid, a sign-in link has been sent.",
        },
        { status: 202 },
      ),
      req,
    );
  }

  const { email, locale } = parsed.data;
  const localeForCopy = locale ?? "de";

  try {
    const issued = await issueMagicLink(email, { locale });
    // The v1 route is hit by the mobile client. Render BOTH the web fallback
    // link AND the opsolid:// deep-link so the same email works whether the
    // user opens it on their phone (deep link) or on desktop (browser link).
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
    // Don't await — keep the response fast and uniform (202) regardless of
    // provider latency or failure. But surface every failure mode to container
    // logs so the operator can see misconfigured SMTP/Resend env. sendEmail()
    // returns { ok: false, error } on provider failure (no throw), and
    // { ok: true, messageId: "console-dev" } when no provider is configured —
    // both are silent in production unless we log them here.
    void sendEmail({ to: email, subject, html, text })
      .then((result) => {
        if (!result.ok) {
          console.error("[magic-link] sendEmail failed", {
            to: email,
            error: result.error,
          });
        } else if (result.messageId === "console-dev") {
          console.error("[magic-link] no email provider configured", {
            to: email,
            hint: "set RESEND_API_KEY or SMTP_HOST/USER/PASS",
          });
        }
      })
      .catch((err) => {
        console.error("[magic-link] sendEmail threw", {
          to: email,
          error: err instanceof Error ? err.message : String(err),
        });
      });
  } catch {
    /* swallow — same 202 either way */
  }

  return applyCors(
    NextResponse.json(
      {
        ok: true,
        message: "If the address is valid, a sign-in link has been sent.",
      },
      { status: 202 },
    ),
    req,
  );
}
