// =============================================================================
// MARKETING CONSENT — GDPR / §7 UWG double-opt-in (DOI) service layer.
//
// Germany requires prior express opt-in (Einwilligung, §7 UWG) before any
// marketing email may be sent, and double-opt-in is the norm. The data given
// to create an account / card is NOT consent to be marketed to (purpose
// limitation), so consent is captured SEPARATELY (unticked checkbox at signup)
// and confirmed via a DOI email. Only rows with status="confirmed" are usable
// for marketing later.
//
// Lifecycle:
//   recordMarketingOptIn()   → upsert by email, status="pending", fresh token,
//                              returns { token, shouldSend }
//   fireMarketingOptIn()     → record + (if shouldSend) send the DOI email;
//                              internally safe (never throws) so signup /
//                              magic-link routes can fire-and-forget it
//   confirmMarketingConsent()→ token → "confirmed" | "already" | "invalid"
//   unsubscribeMarketingConsent() → token → "unsubscribed" | "invalid"
//
// All actions are by-token only (256-bit hex, node:crypto). Email is lowercased
// by the caller; we also lowercase defensively. The exact checkbox wording the
// user agreed to is stored in `consentText` (+ `consentVersion`) for the
// consent log (Nachweis).
//
// SERVER-ONLY. The verbatim checkbox copy lives in the client-safe sibling
// module `./copy` (no prisma / no node:crypto) so the signup UI can import the
// same source of truth; it is re-exported here for server callers' convenience.
// =============================================================================

import { randomBytes } from "node:crypto";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/stripe";
import { sendEmail } from "@/lib/email/client";
import {
  subject as marketingOptInSubject,
  renderHtml as renderMarketingOptInHtml,
  renderText as renderMarketingOptInText,
} from "@/lib/email/templates/marketing-optin";

// Re-export the client-safe consent copy so existing server imports of
// `@/lib/marketing/consent` keep resolving. `./copy` is the single source of
// truth (also imported by the client SignupClient).
export {
  MARKETING_CONSENT_TEXT_VERSION,
  MARKETING_CHECKBOX_TEXT,
  marketingCheckboxText,
} from "./copy";
import {
  MARKETING_CONSENT_TEXT_VERSION,
  marketingCheckboxText,
} from "./copy";

/**
 * Lifetime of a pending DOI confirmation link, in days. After this window an
 * unconfirmed opt-in is treated as lapsed and the confirm link no longer works
 * (the user must opt in again). The exact window is a legal judgement call and
 * is PENDING COUNSEL — common practice is 24h–30d; 14 days is a conservative
 * placeholder aligned with the §355 BGB withdrawal period already used here.
 */
export const MARKETING_DOI_EXPIRY_DAYS = 14;

const DOI_EXPIRY_MS = MARKETING_DOI_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export interface RecordMarketingOptInInput {
  email: string;
  locale?: string;
  source?: string;
  ipHash?: string | null;
  /** The EXACT checkbox wording the user agreed to, in the signup locale. */
  consentText: string;
}

export interface RecordMarketingOptInResult {
  /** Fresh DOI token (only meaningful when shouldSend === true). */
  token: string;
  /**
   * Whether the caller should send the DOI confirmation email. False when an
   * already-confirmed row exists (don't re-spam a confirmed subscriber).
   */
  shouldSend: boolean;
}

function freshToken(): string {
  // 256-bit token, hex-encoded. By-token-only actions + never-leak-existence.
  return randomBytes(32).toString("hex");
}

/**
 * Upsert a marketing opt-in by email.
 *
 * - If a CONFIRMED row already exists → no-op, returns { shouldSend: false }
 *   (we already have valid consent; re-confirming would spam the subscriber).
 * - If new, or status is "pending" / "unsubscribed" → (re)issue a fresh token,
 *   reset to "pending", store the consent context (incl. consentVersion), and
 *   clear confirmed / unsubscribed timestamps. Returns { token, shouldSend }.
 *
 * Token-collision safe: the create branch retries on a P2002 (unique-token)
 * violation with a new token so an astronomically-rare collision can't silently
 * drop the DOI.
 */
export async function recordMarketingOptIn(
  input: RecordMarketingOptInInput,
): Promise<RecordMarketingOptInResult> {
  const email = input.email.trim().toLowerCase();
  const locale = input.locale ?? "de";
  const source = input.source ?? "signup";
  const ipHash = input.ipHash ?? null;

  const existing = await prisma.marketingConsent.findUnique({
    where: { email },
    select: { status: true, token: true },
  });

  if (existing?.status === "confirmed") {
    // Already have valid, confirmed consent — do not re-send the DOI email.
    return { token: existing.token, shouldSend: false };
  }

  const MAX_ATTEMPTS = 3;
  let lastErr: unknown;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const token = freshToken();
    try {
      await prisma.marketingConsent.upsert({
        where: { email },
        create: {
          email,
          status: "pending",
          token,
          consentText: input.consentText,
          consentVersion: MARKETING_CONSENT_TEXT_VERSION,
          source,
          locale,
          ipHash,
        },
        update: {
          status: "pending",
          token,
          consentText: input.consentText,
          consentVersion: MARKETING_CONSENT_TEXT_VERSION,
          source,
          locale,
          ipHash,
          confirmedAt: null,
          unsubscribedAt: null,
        },
      });
      return { token, shouldSend: true };
    } catch (err) {
      // P2002 on `token` is the only retryable case (vanishingly rare hex
      // collision). Anything else (incl. a P2002 race on `email`) re-throws.
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002" &&
        Array.isArray(err.meta?.target) &&
        (err.meta!.target as string[]).includes("token")
      ) {
        lastErr = err;
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

/**
 * Record the opt-in AND send the DOI confirmation email. Internally safe — it
 * has its own try/catch and NEVER throws — so callers (signup / magic-link
 * routes) can `void fireMarketingOptIn(...)` fire-and-forget without ever
 * blocking or failing the auth response.
 *
 * `onError` lets the caller log a failure (with an ip_hash only, never the raw
 * email) without this function deciding how to log.
 */
export async function fireMarketingOptIn(input: {
  email: string;
  locale: string;
  ipHash: string | null;
  source?: string;
  onError?: (err: unknown) => void;
}): Promise<void> {
  try {
    const email = input.email.trim().toLowerCase();
    const locale = input.locale;
    const { token, shouldSend } = await recordMarketingOptIn({
      email,
      locale,
      source: input.source ?? "signup",
      ipHash: input.ipHash,
      consentText: marketingCheckboxText(locale),
    });
    if (!shouldSend) return;
    const confirmUrl = `${getSiteUrl()}/${locale}/marketing/confirm?token=${token}`;
    await sendEmail({
      to: email,
      subject: marketingOptInSubject(locale),
      html: renderMarketingOptInHtml({ confirmUrl, locale }),
      text: renderMarketingOptInText({ confirmUrl, locale }),
    });
  } catch (err) {
    input.onError?.(err);
  }
}

export type ConfirmResult = "confirmed" | "already" | "invalid";

/**
 * Confirm a pending opt-in by token (the DOI step).
 *
 * Atomic + token-scoped: a single `updateMany` flips ONLY a row that is
 * (token AND status="pending" AND created within the DOI window) to confirmed.
 * This closes the read-then-update race where a token rotated between read and
 * write could confirm the wrong row.
 *   - exactly 1 row updated → "confirmed"
 *   - 0 rows updated → disambiguate via a token lookup:
 *       • status already "confirmed" → "already"
 *       • lapsed (pending but older than the window) / unsubscribed / no row
 *         → "invalid"
 */
export async function confirmMarketingConsent(
  token: string,
): Promise<ConfirmResult> {
  if (!token) return "invalid";

  const cutoff = new Date(Date.now() - DOI_EXPIRY_MS);

  const { count } = await prisma.marketingConsent.updateMany({
    where: { token, status: "pending", createdAt: { gte: cutoff } },
    data: { status: "confirmed", confirmedAt: new Date() },
  });
  if (count === 1) return "confirmed";

  // Nothing flipped — figure out why without leaking email existence.
  const row = await prisma.marketingConsent.findUnique({
    where: { token },
    select: { status: true },
  });
  if (row?.status === "confirmed") return "already";
  // Unknown token, lapsed pending, or unsubscribed — treat all as invalid.
  return "invalid";
}

export type UnsubscribeResult = "unsubscribed" | "invalid";

/**
 * Unsubscribe by token. Intentionally lenient / idempotent: any existing row
 * (pending, confirmed, or already-unsubscribed) is set to "unsubscribed" so a
 * second click on the same link still reports success.
 *
 * Atomic + token-scoped: a single `updateMany` on the token both checks
 * existence and applies the change, with no read-then-update window.
 *   - count > 0 → "unsubscribed"
 *   - count === 0 (no such token) → "invalid"
 */
export async function unsubscribeMarketingConsent(
  token: string,
): Promise<UnsubscribeResult> {
  if (!token) return "invalid";

  const { count } = await prisma.marketingConsent.updateMany({
    where: { token },
    data: { status: "unsubscribed", unsubscribedAt: new Date() },
  });

  return count > 0 ? "unsubscribed" : "invalid";
}
