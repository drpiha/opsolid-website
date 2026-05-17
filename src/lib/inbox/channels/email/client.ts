// =============================================================================
// Email outbound — thin nodemailer wrapper for inbox v2.
//
// Reuses the SMTP env vars already configured for OpSolid (Zoho) — see
// .env / project_opsolid_email_setup memory for the working creds.
//
// We intentionally keep this stateless and pull credentials per-call so a
// future per-user SMTP override (channel.config) drops in without changing
// callers.
// =============================================================================

import type { Transporter } from "nodemailer";

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName?: string;
  fromAddress?: string;
}

export function emailConfigFromEnv(): EmailConfig | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  const port = Number(process.env.SMTP_PORT) || 587;
  return {
    host,
    port,
    secure: port === 465,
    user,
    pass,
    fromName: "OpSolid Kutasia",
    fromAddress: process.env.SMTP_FROM || user,
  };
}

async function createTransport(
  config: EmailConfig,
): Promise<Transporter> {
  const nodemailer = await import("nodemailer");
  return nodemailer.default.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
  });
}

export interface SendEmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  inReplyTo?: string | null;
  references?: string[] | null;
  replyTo?: string | null;
}

export interface SendEmailResult {
  messageId: string;
  accepted: number;
}

export async function sendEmail(
  config: EmailConfig,
  params: SendEmailParams,
): Promise<SendEmailResult> {
  const transporter = await createTransport(config);
  const fromHeader = config.fromName
    ? `"${config.fromName}" <${config.fromAddress ?? config.user}>`
    : (config.fromAddress ?? config.user);

  const info = await transporter.sendMail({
    from: fromHeader,
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html,
    inReplyTo: params.inReplyTo ?? undefined,
    references: params.references?.length ? params.references.join(" ") : undefined,
    replyTo: params.replyTo ?? undefined,
  });

  return {
    messageId: String(info.messageId ?? ""),
    accepted: Array.isArray(info.accepted) ? info.accepted.length : 0,
  };
}
