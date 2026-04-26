// Voice-call notification dispatch — fans out to email / Telegram / WhatsApp / webhook configs.

import { createHmac, randomUUID } from "node:crypto";
import * as Sentry from "@sentry/nextjs";
import type {
  VoiceAgent,
  VoiceCall,
  VoiceNotificationConfig,
  VoiceTenant,
} from "@/generated/prisma";
import { sendCustomerEmail } from "@/lib/email/send";

const WEBHOOK_TIMEOUT_MS = 5_000;

// ---------------------------------------------------------------------------
// Public types.
// ---------------------------------------------------------------------------

export interface ExtractedCallFields {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  intent?: string | null;
  requestedDate?: string | null;
  requestedTime?: string | null;
  service?: string | null;
  partySize?: number | null;
  orderItems?: Array<{ name: string; qty: number; notes?: string }> | null;
  address?: string | null;
  urgency?: string | null;
  nextAction?: string | null;
  summary?: string | null;
  outcomeType?: string | null;
  [key: string]: unknown;
}

export interface CallCompletedInfo {
  callId: string;
  tenantBusinessName: string;
  fromNumber: string;
  durationSeconds: number | null;
  language: string | null;
  outcomeType: string | null;
  callerName: string | null;
  callerPhone: string | null;
  summaryText: string | null;
  extractedFields: Record<string, unknown>;
}

type VoiceCallWithRelations = VoiceCall & {
  agent: VoiceAgent & { tenant: VoiceTenant };
};

// ---------------------------------------------------------------------------
// Public entry point.
// ---------------------------------------------------------------------------

/**
 * Fan out a "call_ended" notification to every active config whose
 * triggerOn array contains "call_ended". Uses Promise.allSettled so a
 * single channel failure doesn't block the others; failures land in
 * Sentry tagged with the channel name.
 */
export async function notifyCallCompleted(
  call: VoiceCallWithRelations,
  extracted: ExtractedCallFields,
  notifConfigs: VoiceNotificationConfig[],
): Promise<void> {
  const info = buildInfo(call, extracted);

  const targets = notifConfigs.filter(
    (c) => c.isActive && (c.triggerOn ?? []).includes("call_ended"),
  );
  if (targets.length === 0) return;

  const results = await Promise.allSettled(
    targets.map((cfg) => dispatchOne(cfg, info)),
  );

  results.forEach((r, idx) => {
    if (r.status === "rejected") {
      const cfg = targets[idx];
      Sentry.captureException(r.reason, {
        tags: {
          area: "voice-notification",
          channel: cfg.channelType,
          configId: cfg.id,
        },
        extra: { callId: info.callId },
      });
    }
  });
}

function buildInfo(
  call: VoiceCallWithRelations,
  extracted: ExtractedCallFields,
): CallCompletedInfo {
  return {
    callId: call.id,
    tenantBusinessName: call.agent.tenant.businessName,
    fromNumber: call.fromNumber,
    durationSeconds: call.durationSeconds,
    language: call.detectedLanguage,
    outcomeType: call.outcomeType,
    callerName: call.callerName ?? (extracted.name ?? null),
    callerPhone: call.callerPhone ?? (extracted.phone ?? null),
    summaryText: call.summaryText,
    extractedFields: { ...extracted },
  };
}

async function dispatchOne(
  cfg: VoiceNotificationConfig,
  info: CallCompletedInfo,
): Promise<void> {
  const config = (cfg.config ?? {}) as Record<string, unknown>;
  switch (cfg.channelType) {
    case "email":
      await sendCallEmail(info, config);
      break;
    case "telegram":
      await sendCallTelegram(info, config);
      break;
    case "whatsapp":
      await sendCallWhatsApp(info, config);
      break;
    case "webhook":
      await sendCallWebhook(info, config);
      break;
    default:
      throw new Error(`Unknown notification channel: ${cfg.channelType}`);
  }
}

// ---------------------------------------------------------------------------
// Telegram
// ---------------------------------------------------------------------------

async function sendCallTelegram(
  info: CallCompletedInfo,
  config: Record<string, unknown>,
): Promise<void> {
  const botToken = typeof config.botToken === "string" ? config.botToken : "";
  const chatId = typeof config.chatId === "string" ? config.chatId : "";
  if (!botToken || !chatId) {
    throw new Error("Telegram config requires botToken and chatId");
  }

  const emoji = pickEmoji(info.outcomeType);
  const lines = [
    `${emoji} *Anruf abgeschlossen — ${escapeMd(info.tenantBusinessName)}*`,
    ``,
    `📞 *Von:* ${escapeMd(info.fromNumber)}`,
    info.callerName ? `👤 *Name:* ${escapeMd(info.callerName)}` : "",
    info.callerPhone && info.callerPhone !== info.fromNumber
      ? `📱 *Rückruf:* ${escapeMd(info.callerPhone)}`
      : "",
    info.durationSeconds !== null
      ? `⏱ *Dauer:* ${formatDuration(info.durationSeconds)}`
      : "",
    info.language ? `🌐 *Sprache:* ${escapeMd(info.language)}` : "",
    info.outcomeType
      ? `🏷 *Ergebnis:* ${escapeMd(humanOutcome(info.outcomeType))}`
      : "",
    info.summaryText ? `📝 *Zusammenfassung:* ${escapeMd(info.summaryText)}` : "",
  ].filter(Boolean);

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: lines.join("\n"),
      parse_mode: "Markdown",
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram API ${res.status}: ${body}`);
  }
}

// ---------------------------------------------------------------------------
// WhatsApp (CallMeBot)
// ---------------------------------------------------------------------------

async function sendCallWhatsApp(
  info: CallCompletedInfo,
  config: Record<string, unknown>,
): Promise<void> {
  const phone = typeof config.phone === "string" ? config.phone : "";
  const apiKey = typeof config.apiKey === "string" ? config.apiKey : "";
  if (!phone || !apiKey) {
    throw new Error("WhatsApp config requires phone and apiKey");
  }

  const message = [
    `Anruf abgeschlossen — ${info.tenantBusinessName}`,
    `Von: ${info.fromNumber}`,
    info.callerName ? `Name: ${info.callerName}` : "",
    info.durationSeconds !== null
      ? `Dauer: ${formatDuration(info.durationSeconds)}`
      : "",
    info.outcomeType ? `Ergebnis: ${humanOutcome(info.outcomeType)}` : "",
    info.summaryText ? `Zusammenfassung: ${info.summaryText}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
    phone,
  )}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`CallMeBot ${res.status}: ${body}`);
  }
}

// ---------------------------------------------------------------------------
// Email
// ---------------------------------------------------------------------------

async function sendCallEmail(
  info: CallCompletedInfo,
  config: Record<string, unknown>,
): Promise<void> {
  const to = typeof config.to === "string" ? config.to : "";
  if (!to) throw new Error("Email config requires `to`");

  const subject = `[Voice] ${humanOutcome(info.outcomeType ?? "no_action")} — ${info.tenantBusinessName}`;

  const fields = info.extractedFields ?? {};
  const fieldRows = Object.entries(fields)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => {
      const value =
        typeof v === "string" || typeof v === "number" || typeof v === "boolean"
          ? String(v)
          : JSON.stringify(v);
      return `<tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">${escapeHtml(k)}</td><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">${escapeHtml(value)}</td></tr>`;
    })
    .join("");

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1e293b;">
      <div style="background:#0f172a;border-radius:12px;padding:20px 24px;margin-bottom:20px;">
        <div style="color:#94a3b8;font-size:12px;letter-spacing:0.05em;text-transform:uppercase;">Voice Agent</div>
        <h2 style="color:#fff;margin:6px 0 0;font-size:18px;">Anruf abgeschlossen — ${escapeHtml(info.tenantBusinessName)}</h2>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">Von</td><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">${escapeHtml(info.fromNumber)}</td></tr>
        ${info.callerName ? `<tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">Name</td><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">${escapeHtml(info.callerName)}</td></tr>` : ""}
        ${info.callerPhone ? `<tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">Rückruf</td><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">${escapeHtml(info.callerPhone)}</td></tr>` : ""}
        ${info.durationSeconds !== null ? `<tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">Dauer</td><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">${formatDuration(info.durationSeconds)}</td></tr>` : ""}
        ${info.language ? `<tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">Sprache</td><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">${escapeHtml(info.language)}</td></tr>` : ""}
        ${info.outcomeType ? `<tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">Ergebnis</td><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">${escapeHtml(humanOutcome(info.outcomeType))}</td></tr>` : ""}
      </table>
      ${info.summaryText ? `<div style="margin-top:16px;padding:14px 16px;background:#f8fafc;border-radius:8px;font-size:14px;line-height:1.5;">${escapeHtml(info.summaryText)}</div>` : ""}
      ${fieldRows ? `<h3 style="margin:24px 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;">Extrahierte Felder</h3><table style="width:100%;border-collapse:collapse;font-size:13px;">${fieldRows}</table>` : ""}
    </div>
  `;

  const text = [
    `Anruf abgeschlossen — ${info.tenantBusinessName}`,
    `Von: ${info.fromNumber}`,
    info.callerName ? `Name: ${info.callerName}` : "",
    info.durationSeconds !== null
      ? `Dauer: ${formatDuration(info.durationSeconds)}`
      : "",
    info.outcomeType ? `Ergebnis: ${humanOutcome(info.outcomeType)}` : "",
    info.summaryText ? `Zusammenfassung: ${info.summaryText}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const result = await sendCustomerEmail({ to, subject, html, text });
  if (result.skipped) {
    throw new Error(`Email skipped: ${result.reason ?? "unknown"}`);
  }
}

// ---------------------------------------------------------------------------
// Webhook
// ---------------------------------------------------------------------------

async function sendCallWebhook(
  info: CallCompletedInfo,
  config: Record<string, unknown>,
): Promise<void> {
  const url = typeof config.url === "string" ? config.url : "";
  const secret = typeof config.secret === "string" ? config.secret : "";
  if (!url) throw new Error("Webhook config requires `url`");

  const envelope = {
    event: "call_ended" as const,
    delivery: randomUUID(),
    deliveredAt: new Date().toISOString(),
    data: info,
  };
  const body = JSON.stringify(envelope);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "OpSolid-Voice/1.0",
    "X-Voice-Event": "call_ended",
    "X-Voice-Delivery": envelope.delivery,
  };

  if (secret) {
    const signature = createHmac("sha256", secret).update(body).digest("hex");
    headers["X-Voice-Signature"] = `sha256=${signature}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body,
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Webhook ${url} returned ${res.status}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pickEmoji(outcome: string | null): string {
  switch (outcome) {
    case "appointment_booked":
      return "📅";
    case "order_placed":
      return "🛒";
    case "callback_requested":
      return "📞";
    case "transferred":
      return "↪️";
    case "error":
      return "⚠️";
    default:
      return "✅";
  }
}

function humanOutcome(o: string): string {
  switch (o) {
    case "appointment_booked":
      return "Termin angefragt";
    case "order_placed":
      return "Bestellung aufgenommen";
    case "callback_requested":
      return "Rückruf angefragt";
    case "info_provided":
      return "Auskunft erteilt";
    case "transferred":
      return "Weitergeleitet";
    case "no_action":
      return "Keine Aktion";
    case "error":
      return "Fehler";
    default:
      return o;
  }
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function escapeMd(text: string): string {
  return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
