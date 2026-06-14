// =============================================================================
// EMAIL SEND HELPERS
//
// Two layers:
//   1. sendCustomerEmail() — order emails (card-live, resend-link,
//      confirmation, revision-ready, cancellation). Delegates to the shared
//      client.ts provider chain (Brevo > Resend > SMTP > console) so these
//      emails actually flow even without SMTP. Signature unchanged; callers
//      still get { messageId, skipped, reason }.
//
//   2. Auth send helpers (bottom of file) — consume client.ts and the auth
//      templates. Exported for B0.2 auth routes:
//        sendMagicLinkEmail / sendWelcomeEmail / sendPasswordResetEmail
// =============================================================================

import { sendEmail, type SendEmailResult } from "./client";

export interface SendCustomerEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export interface SendCustomerEmailResult {
  messageId: string | null;
  skipped: boolean;
  reason?: string;
}

// ---------------------------------------------------------------------------
// SECTION 1 — Order email sender (delegates to the shared provider chain)
// ---------------------------------------------------------------------------

export async function sendCustomerEmail(
  input: SendCustomerEmailInput
): Promise<SendCustomerEmailResult> {
  // CONTACT_FROM_EMAIL still overrides the From (so customers see a friendly
  // sender); CONTACT_TO_EMAIL stays the default Reply-To. Everything else now
  // goes through sendEmail() (Brevo > Resend > SMTP > console) instead of the
  // old SMTP-only path that silently skipped when SMTP was unset.
  const result = await sendEmail({
    to: input.to,
    from: process.env.CONTACT_FROM_EMAIL || undefined,
    replyTo: input.replyTo ?? process.env.CONTACT_TO_EMAIL ?? undefined,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });

  // `skipped` now means "not delivered" — true only when the underlying send
  // failed. The console transport (dev / no provider) returns ok:true, so a
  // local run reports skipped:false and the callers log the send.
  return {
    messageId: result.messageId ?? null,
    skipped: !result.ok,
    reason: result.ok ? undefined : result.error,
  };
}

// ---------------------------------------------------------------------------
// SECTION 2 — Auth email helpers (Brevo > Resend > SMTP > console via client.ts)
// ---------------------------------------------------------------------------

import {
  renderMagicLinkHtml,
  renderMagicLinkText,
  magicLinkSubject,
} from "./templates/magic-link";
import {
  renderWelcomeHtml,
  renderWelcomeText,
  welcomeSubject,
} from "./templates/welcome";
import {
  renderPasswordResetHtml,
  renderPasswordResetText,
  passwordResetSubject,
} from "./templates/password-reset";

export interface SendMagicLinkEmailInput {
  to: string;
  link: string;
  locale: string;
  brandName?: string;
}

export async function sendMagicLinkEmail(
  input: SendMagicLinkEmailInput
): Promise<SendEmailResult> {
  const templateInput = {
    link: input.link,
    locale: input.locale,
    brandName: input.brandName,
  };
  return sendEmail({
    to: input.to,
    subject: magicLinkSubject(input.locale),
    html: renderMagicLinkHtml(templateInput),
    text: renderMagicLinkText(templateInput),
  });
}

export interface SendWelcomeEmailInput {
  to: string;
  name?: string;
  locale: string;
  dashboardUrl: string;
}

export async function sendWelcomeEmail(
  input: SendWelcomeEmailInput
): Promise<SendEmailResult> {
  const templateInput = {
    name: input.name,
    locale: input.locale,
    dashboardUrl: input.dashboardUrl,
  };
  return sendEmail({
    to: input.to,
    subject: welcomeSubject(input.locale),
    html: renderWelcomeHtml(templateInput),
    text: renderWelcomeText(templateInput),
  });
}

export interface SendPasswordResetEmailInput {
  to: string;
  link: string;
  locale: string;
  expiresInMinutes: number;
}

export async function sendPasswordResetEmail(
  input: SendPasswordResetEmailInput
): Promise<SendEmailResult> {
  const templateInput = {
    link: input.link,
    locale: input.locale,
    expiresInMinutes: input.expiresInMinutes,
  };
  return sendEmail({
    to: input.to,
    subject: passwordResetSubject(input.locale),
    html: renderPasswordResetHtml(templateInput),
    text: renderPasswordResetText(templateInput),
  });
}
