// =============================================================================
// CUSTOMER EMAIL SENDER
// Small wrapper around nodemailer used by the customer-facing order emails
// (confirmation, revision-ready, cancellation). Mirrors the transport setup
// used by src/lib/notifications.ts so SMTP env wiring stays identical.
//
// Design rules:
//   - Gracefully no-op (warn + return null) if SMTP is not configured. Callers
//     must not crash when env is missing — important for preview/dev builds.
//   - From: CONTACT_FROM_EMAIL override, else SMTP_USER.
//   - Reply-To: defaults to CONTACT_TO_EMAIL (operator inbox) so when a
//     customer hits reply, we answer them — not bounce to a no-reply.
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
