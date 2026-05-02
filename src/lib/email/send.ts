// =============================================================================
// EMAIL SEND HELPERS
//
// Two layers:
//   1. sendCustomerEmail() — legacy nodemailer wrapper for order emails
//      (confirmation, revision-ready, cancellation). Used by existing callers;
//      do not change its signature.
//
//   2. Auth send helpers (bottom of file) — consume client.ts (Resend > SMTP >
//      console) and the new auth templates. Exported for B0.2 auth routes:
//        sendMagicLinkEmail / sendWelcomeEmail / sendPasswordResetEmail
// =============================================================================

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
// SECTION 1 — Legacy order email sender (nodemailer, unchanged)
// ---------------------------------------------------------------------------

export async function sendCustomerEmail(
  input: SendCustomerEmailInput
): Promise<SendCustomerEmailResult> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromOverride = process.env.CONTACT_FROM_EMAIL;
  const replyToDefault = process.env.CONTACT_TO_EMAIL;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn(
      "[customer-email] SMTP not configured — skipping send",
      { to: input.to, subject: input.subject }
    );
    return {
      messageId: null,
      skipped: true,
      reason: "SMTP env vars missing (SMTP_HOST / SMTP_USER / SMTP_PASS).",
    };
  }

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.default.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: (process.env.SMTP_PORT || "587") === "465",
    auth: { user: smtpUser, pass: smtpPass },
  });

  const fromAddress = fromOverride || smtpUser;
  const info = await transporter.sendMail({
    from: `"OpSolid" <${fromAddress}>`,
    to: input.to,
    replyTo: input.replyTo ?? replyToDefault ?? fromAddress,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });

  return {
    messageId: info.messageId ?? null,
    skipped: false,
  };
}

// ---------------------------------------------------------------------------
// SECTION 2 — Auth email helpers (Resend > SMTP > console via client.ts)
// ---------------------------------------------------------------------------

import { sendEmail, type SendEmailResult } from "./client";
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
