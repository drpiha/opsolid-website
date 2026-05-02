// =============================================================================
// EMAIL CLIENT — provider abstraction for auth + transactional emails.
//
// Provider precedence (evaluated at call time, not module load):
//   1. Resend    — RESEND_API_KEY is set
//   2. SMTP      — SMTP_HOST + SMTP_USER + SMTP_PASS are set
//   3. Console   — dev fallback; logs full payload, returns ok: true
//
// Usage:
//   import { sendEmail } from "@/lib/email/client";
//   await sendEmail({ to, subject, html, text });
//
// TODO: Install @react-email/components and @react-email/render when upgrading
//       to React Email-based templates. The `react` prop (ReactElement) can then
//       be added and rendered here before handing off to the provider.
//
// Sentry: if SENTRY_DSN is set and @sentry/nextjs is reachable, send errors
//         are captured. Import is dynamic so missing Sentry never crashes the
//         email path.
// =============================================================================

export interface SendEmailInput {
  /** Recipient address */
  to: string;
  /** From address — defaults to RESEND_FROM_EMAIL or SMTP_FROM or SMTP_USER */
  from?: string;
  subject: string;
  /** Full HTML body (already rendered) */
  html: string;
  /** Plain-text fallback */
  text: string;
  /** Extra SMTP/Resend headers (e.g. Message-ID, List-Unsubscribe) */
  headers?: Record<string, string>;
}

export interface SendEmailResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// Internal: resolve sender address
// ---------------------------------------------------------------------------

function resolveFrom(override?: string): string {
  if (override) return override;
  // Resend path
  const resendFrom = process.env.RESEND_FROM_EMAIL;
  if (resendFrom) return resendFrom;
  // SMTP path
  const smtpFrom = process.env.SMTP_FROM || process.env.SMTP_USER;
  if (smtpFrom) return smtpFrom;
  return "noreply@opsolid.de";
}

// ---------------------------------------------------------------------------
// Sentry capture helper (optional — silently skipped when Sentry not present)
// ---------------------------------------------------------------------------

async function captureToSentry(err: unknown, context: object): Promise<void> {
  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.withScope((scope) => {
      scope.setExtras(context);
      Sentry.captureException(err);
    });
  } catch {
    // Sentry not available — ignore
  }
}

// ---------------------------------------------------------------------------
// Provider: Resend
// ---------------------------------------------------------------------------

async function sendViaResend(
  input: SendEmailInput,
  from: string
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY!;

  const body: Record<string, unknown> = {
    from,
    to: [input.to],
    subject: input.subject,
    html: input.html,
    text: input.text,
  };
  if (input.headers && Object.keys(input.headers).length > 0) {
    body.headers = input.headers;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const raw = await res.text().catch(() => "(no body)");
    const errMsg = `Resend HTTP ${res.status}: ${raw}`;
    await captureToSentry(new Error(errMsg), {
      provider: "resend",
      to: input.to,
      subject: input.subject,
    });
    console.error("[email:resend] send failed", errMsg);
    return { ok: false, error: errMsg };
  }

  const data = (await res.json()) as { id?: string };
  return { ok: true, messageId: data.id };
}

// ---------------------------------------------------------------------------
// Provider: SMTP (nodemailer — already in package.json)
// ---------------------------------------------------------------------------

async function sendViaSmtp(
  input: SendEmailInput,
  from: string
): Promise<SendEmailResult> {
  const smtpHost = process.env.SMTP_HOST!;
  const smtpUser = process.env.SMTP_USER!;
  const smtpPass = process.env.SMTP_PASS!;

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.default.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: (process.env.SMTP_PORT ?? "587") === "465",
    auth: { user: smtpUser, pass: smtpPass },
  });

  try {
    const info = await transporter.sendMail({
      from: `"OpSolid" <${from}>`,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      headers: input.headers,
    });
    return { ok: true, messageId: info.messageId ?? undefined };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    await captureToSentry(err, {
      provider: "smtp",
      to: input.to,
      subject: input.subject,
    });
    console.error("[email:smtp] send failed", errMsg);
    return { ok: false, error: errMsg };
  }
}

// ---------------------------------------------------------------------------
// Provider: console (dev fallback)
// ---------------------------------------------------------------------------

function sendViaConsole(input: SendEmailInput, from: string): SendEmailResult {
  console.log(
    [
      "",
      "╔══════════════════════════════════════════╗",
      "║  [email:console] DEV — no provider set   ║",
      "╚══════════════════════════════════════════╝",
      `  From   : ${from}`,
      `  To     : ${input.to}`,
      `  Subject: ${input.subject}`,
      "",
      input.text,
      "──────────────────────────────────────────",
      "",
    ].join("\n")
  );
  return { ok: true, messageId: "console-dev" };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function sendEmail(
  input: SendEmailInput
): Promise<SendEmailResult> {
  const from = resolveFrom(input.from);

  // 1. Resend
  if (process.env.RESEND_API_KEY) {
    return sendViaResend(input, from);
  }

  // 2. SMTP
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    return sendViaSmtp(input, from);
  }

  // 3. Console fallback
  return sendViaConsole(input, from);
}
