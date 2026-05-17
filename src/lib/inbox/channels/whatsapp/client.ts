// =============================================================================
// WhatsApp (360dialog) client
//
// 360dialog v2 is a thin proxy over Meta Cloud API — bodies match the
// official Meta JSON exactly, only the base URL + API key header differ.
// That means this module is "Cloud API compatible" and can be swapped to
// Twilio's WhatsApp endpoint with a different header + URL.
//
// Auth header: D360-API-KEY
// Base URL:    https://waba-v2.360dialog.io
//
// We deliberately ship the smallest surface needed by the inbox:
//   - sendText (utility / service-window reply)
//   - sendTemplate (paid notification, e.g. no-show recovery playbook)
//   - downloadMedia (resolve a Meta media-id → bytes for Whisper)
// =============================================================================

const D360_BASE = "https://waba-v2.360dialog.io";

export interface WhatsAppConfig {
  apiKey: string;
  /** E.164 phone number (no leading +) of the business number. */
  phoneNumberId: string;
  /** Optional override (Twilio etc.); defaults to 360dialog. */
  baseUrl?: string;
}

export class WhatsAppApiError extends Error {
  readonly status: number;
  readonly detail: string;
  constructor(status: number, detail: string) {
    super(`WhatsApp API ${status}: ${detail}`);
    this.name = "WhatsAppApiError";
    this.status = status;
    this.detail = detail;
  }
}

function baseUrl(config: WhatsAppConfig): string {
  return (config.baseUrl ?? D360_BASE).replace(/\/$/, "");
}

interface SendResult {
  messages: Array<{ id: string }>;
  contacts?: Array<{ wa_id: string; input?: string }>;
}

export async function sendText(
  config: WhatsAppConfig,
  to: string,
  body: string,
  opts: { previewUrl?: boolean } = {},
): Promise<SendResult> {
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: { body, preview_url: opts.previewUrl ?? false },
  };
  const res = await fetch(`${baseUrl(config)}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "D360-API-KEY": config.apiKey,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new WhatsAppApiError(res.status, text.slice(0, 300));
  }
  return (await res.json()) as SendResult;
}

export interface TemplateComponent {
  type: "body" | "header" | "button";
  parameters?: Array<
    | { type: "text"; text: string }
    | { type: "currency"; currency: { fallback_value: string; code: string; amount_1000: number } }
    | { type: "date_time"; date_time: { fallback_value: string } }
  >;
  sub_type?: "quick_reply" | "url";
  index?: string;
}

export async function sendTemplate(
  config: WhatsAppConfig,
  to: string,
  templateName: string,
  languageCode: string,
  components: TemplateComponent[] = [],
): Promise<SendResult> {
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      components,
    },
  };
  const res = await fetch(`${baseUrl(config)}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "D360-API-KEY": config.apiKey,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new WhatsAppApiError(res.status, text.slice(0, 300));
  }
  return (await res.json()) as SendResult;
}

/**
 * Resolve a Meta-style media id to a direct download URL, then fetch the
 * bytes. Used for voice notes — the URL Whisper needs is the actual binary,
 * not the proxied JSON envelope.
 *
 * Returns null on failure so callers can ingest the message without the
 * transcript (we'll fill it in async later).
 */
export async function downloadMediaUrl(
  config: WhatsAppConfig,
  mediaId: string,
): Promise<string | null> {
  try {
    const meta = await fetch(`${baseUrl(config)}/${mediaId}`, {
      headers: { "D360-API-KEY": config.apiKey },
    });
    if (!meta.ok) return null;
    const json = (await meta.json()) as { url?: string };
    return json.url ?? null;
  } catch {
    return null;
  }
}
