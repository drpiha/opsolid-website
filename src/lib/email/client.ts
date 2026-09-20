// =============================================================================
// EMAIL CLIENT — provider abstraction for auth + transactional emails.
//
// Provider precedence (evaluated at call time, not module load):
//   1. Brevo     — BREVO_API_KEY is set (EU/GDPR sending, matches positioning)
//   2. Resend    — RESEND_API_KEY is set
//   3. SMTP      — SMTP_HOST + SMTP_USER + SMTP_PASS are set
//   4. Unavailable - no send and no submission logging; returns ok: false
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
// Parse a from value that may be a bare email ("info@opsolid.de") OR a
// display form ("OpSolid <info@opsolid.de>" / '"OpSolid" <info@opsolid.de>').
// Avoids double-wrapping (the SMTP/Brevo "from" used to become
// `"OpSolid" <OpSolid <info@opsolid.de>>` when CONTACT_FROM_EMAIL carried a
// display name).
// ---------------------------------------------------------------------------

function parseFromAddress(from: string): { email: string; name?: string } {
  const m = from.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  if (m && m[2]) {
    const name = m[1].trim();
    return { email: m[2].trim(), name: name || undefined };
  }
  return { email: from.trim() };
}

// ---------------------------------------------------------------------------
// Sentry capture helper (optional — silently skipped when Sentry not present)
// ---------------------------------------------------------------------------

type EmailProvider = "brevo" | "resend" | "smtp";
type EmailFailure = "http_rejected" | "transport_failed";

// The original error, response body, mail headers and recipient are never
// retained in diagnostics or exposed through a SendEmailResult.
async function deliveryFailure(
  provider: EmailProvider,
  category: EmailFailure,
  status?: number,
): Promise<SendEmailResult> {
  const code = `${provider}_${category}`;
  const context = { provider, category, ...(status === undefined ? {} : { status }) };
  console.error("[email] delivery failed", context);
  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureException(new Error(code), { extra: context });
  } catch {
    // Optional diagnostics must not affect delivery handling.
  }
  return { ok: false, error: code };
}

// ---------------------------------------------------------------------------
// One hard deadline covers both response headers and JSON consumption.
// (the orders route fires card-live mail fire-and-forget, but the contact +
// resend-link routes await the send).
// ---------------------------------------------------------------------------

const EMAIL_HTTP_TIMEOUT_MS = 10_000;

async function fetchWithTimeout(
  url: string,
  init: RequestInit
): Promise<{ response: Response; data: unknown }> {
  const controller = new AbortController();
  let response: Response | undefined;
  let timer: ReturnType<typeof setTimeout>;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error("email_http_timeout"));
      controller.abort();
      // Abort also interrupts a locked response reader in the real fetch
      // implementation. Cancel an unlocked body without reading its contents.
      void response?.body?.cancel().catch(() => undefined);
    }, EMAIL_HTTP_TIMEOUT_MS);
  });
  try {
    const consume = async () => {
      response = await fetch(url, { ...init, signal: controller.signal });
      if (controller.signal.aborted) {
        void response.body?.cancel().catch(() => undefined);
        throw new Error("email_http_timeout");
      }
      const data: unknown = response.ok ? await response.json().catch(() => ({})) : undefined;
      return { response, data };
    };
    // The explicit race also releases the caller if a transport fails to
    // settle its promise when aborted. No automatic retry can duplicate mail.
    return await Promise.race([consume(), deadline]);
  } finally {
    clearTimeout(timer!);
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
  const sender = parseFromAddress(from);
  const senderName =
    sender.name || process.env.BREVO_SENDER_NAME || "OpSolid";

  const body: Record<string, unknown> = {
    sender: { email: sender.email, name: senderName },
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
    const { response: res, data } = await fetchWithTimeout("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      void res.body?.cancel().catch(() => undefined);
      return deliveryFailure("brevo", "http_rejected", res.status);
    }

    return { ok: true, messageId: (data as { messageId?: string }).messageId };
  } catch {
    // Timeout (abort) or network error — never throw out of the provider.
    return deliveryFailure("brevo", "transport_failed");
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
    const { response: res, data } = await fetchWithTimeout("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      void res.body?.cancel().catch(() => undefined);
      return deliveryFailure("resend", "http_rejected", res.status);
    }

    return { ok: true, messageId: (data as { id?: string }).id };
  } catch {
    return deliveryFailure("resend", "transport_failed");
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

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: (process.env.SMTP_PORT ?? "587") === "465",
      auth: { user: smtpUser, pass: smtpPass },
      dnsTimeout: 10_000,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 30_000,
    });

    // Preserve existing display-form sender handling.
    const fromHeader = from.includes("<") ? from : `"OpSolid" <${from}>`;
    const info = await transporter.sendMail({
      from: fromHeader,
      to: input.to,
      replyTo: input.replyTo,
      subject: input.subject,
      html: input.html,
      text: input.text,
      headers: input.headers,
    });
    return { ok: true, messageId: info.messageId ?? undefined };
  } catch {
    return deliveryFailure("smtp", "transport_failed");
  }
}

// ---------------------------------------------------------------------------
// Configuration presence only. This does not claim the provider is reachable.
// ---------------------------------------------------------------------------

export function hasEmailProvider(): boolean {
  return Boolean(
    process.env.BREVO_API_KEY || process.env.RESEND_API_KEY ||
    (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
  );
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

  // Never print submission contents or report a send when nothing was sent.
  return { ok: false, error: "provider_unavailable" };
}
