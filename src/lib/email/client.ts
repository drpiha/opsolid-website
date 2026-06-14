// =============================================================================
// EMAIL CLIENT — provider abstraction for auth + transactional emails.
//
// Provider precedence (evaluated at call time, not module load):
//   1. Brevo     — BREVO_API_KEY is set (EU/GDPR sending, matches positioning)
//   2. Resend    — RESEND_API_KEY is set
//   3. SMTP      — SMTP_HOST + SMTP_USER + SMTP_PASS are set
//   4. Console   — dev fallback; logs full payload, returns ok: true
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
  /** Reply-To address — lead/contact forms set the visitor's email here so a
   *  reply from the inbox goes straight back to them. */
  replyTo?: string;
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
  // Brevo path
  const brevoFrom = process.env.BREVO_FROM_EMAIL;
  if (brevoFrom) return brevoFrom;
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

async function captureToSentry(err: unknown, context: Record<string, unknown>): Promise<void> {
  try {
    const Sentry = await import("@sentry/nextjs");
    // captureException accepts a CaptureContext with an `extra` field —
    // simpler and avoids Sentry's strict setExtra type that broke the
    // build under newer @sentry/nextjs versions.
    Sentry.captureException(err, { extra: context });
  } catch {
    // Sentry not available — ignore
  }
}

// ---------------------------------------------------------------------------
// fetch with a hard timeout — a hung provider must not wedge the request
// (the orders route fires card-live mail fire-and-forget, but the contact +
// resend-link routes await the send).
// ---------------------------------------------------------------------------

const EMAIL_HTTP_TIMEOUT_MS = 10_000;

async function fetchWithTimeout(
  url: string,
  init: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), EMAIL_HTTP_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Provider: Brevo (EU/GDPR — POST https://api.brevo.com/v3/smtp/email)
// Raw fetch, no SDK. Returns Brevo's messageId on success.
// ---------------------------------------------------------------------------

async function sendViaBrevo(
  input: SendEmailInput,
  from: string
): Promise<SendEmailResult> {
  const apiKey = process.env.BREVO_API_KEY!;
  const senderName = process.env.BREVO_SENDER_NAME || "OpSolid";

  const body: Record<string, unknown> = {
    sender: { email: from, name: senderName },
    to: [{ email: input.to }],
    subject: input.subject,
    htmlContent: input.html,
    textContent: input.text,
  };
  if (input.replyTo) body.replyTo = { email: input.replyTo };
  if (input.headers && Object.keys(input.headers).length > 0) {
    body.headers = input.headers;
  }

  try {
    const res = await fetchWithTimeout("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const raw = await res.text().catch(() => "(no body)");
      // 400/401 almost always means a bad key or an unverified sender —
      // the #1 Brevo setup gotcha, so spell it out in the log.
      const hint =
        res.status === 400 || res.status === 401
          ? " — verify BREVO_API_KEY and that the sender (BREVO_FROM_EMAIL) is a verified Brevo sender/domain"
          : "";
      const errMsg = `Brevo HTTP ${res.status}: ${raw}${hint}`;
      await captureToSentry(new Error(errMsg), {
        provider: "brevo",
        to: input.to,
        subject: input.subject,
      });
      console.error("[email:brevo] send failed", errMsg);
      return { ok: false, error: errMsg };
    }

    const data = (await res.json().catch(() => ({}))) as { messageId?: string };
    return { ok: true, messageId: data.messageId };
  } catch (err) {
    // Timeout (abort) or network error — never throw out of the provider.
    const errMsg = err instanceof Error ? err.message : String(err);
    await captureToSentry(err, {
      provider: "brevo",
      to: input.to,
      subject: input.subject,
    });
    console.error("[email:brevo] send error", errMsg);
    return { ok: false, error: errMsg };
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
  if (input.replyTo) body.reply_to = input.replyTo;
  if (input.headers && Object.keys(input.headers).length > 0) {
    body.headers = input.headers;
  }

  try {
    const res = await fetchWithTimeout("https://api.resend.com/emails", {
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

    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, messageId: data.id };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    await captureToSentry(err, {
      provider: "resend",
      to: input.to,
      subject: input.subject,
    });
    console.error("[email:resend] send error", errMsg);
    return { ok: false, error: errMsg };
  }
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
      replyTo: input.replyTo,
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

  // 1. Brevo (EU/GDPR — the connected real provider when BREVO_API_KEY is set)
  if (process.env.BREVO_API_KEY) {
    return sendViaBrevo(input, from);
  }

  // 2. Resend
  if (process.env.RESEND_API_KEY) {
    return sendViaResend(input, from);
  }

  // 3. SMTP
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    return sendViaSmtp(input, from);
  }

  // 4. Console fallback
  return sendViaConsole(input, from);
}
