// =============================================================================
// Telegram Bot client — narrow surface for inbox v2.
//
// We use webhooks (set per-channel with a secret token), never long-polling.
// Outbound text + file URL building. Voice notes arrive as file_ids on the
// inbound update; we resolve them to absolute https URLs via getFile.
//
// Bot tokens live in InboxChannel.config and are passed in explicitly — this
// module is stateless so it stays testable and works across multiple bots
// for different users without pulling globals.
// =============================================================================

const TG_BASE = "https://api.telegram.org";

export interface TelegramConfig {
  botToken: string;
  secretToken?: string;
  botUsername?: string;
  botId?: number;
}

export class TelegramApiError extends Error {
  readonly status: number;
  readonly description: string;
  constructor(status: number, description: string) {
    super(`Telegram API ${status}: ${description}`);
    this.name = "TelegramApiError";
    this.status = status;
    this.description = description;
  }
}

async function call<T>(
  config: TelegramConfig,
  method: string,
  payload?: Record<string, unknown>,
): Promise<T> {
  const url = `${TG_BASE}/bot${config.botToken}/${method}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const json = (await res.json()) as {
    ok: boolean;
    result?: T;
    description?: string;
    error_code?: number;
  };
  if (!json.ok) {
    throw new TelegramApiError(
      json.error_code ?? res.status,
      json.description ?? "unknown_error",
    );
  }
  return json.result as T;
}

export async function sendMessage(
  config: TelegramConfig,
  chatId: number | string,
  text: string,
  opts: { replyToMessageId?: number; parseMode?: "Markdown" | "HTML" } = {},
): Promise<{ message_id: number; date: number }> {
  return call(config, "sendMessage", {
    chat_id: chatId,
    text,
    ...(opts.parseMode ? { parse_mode: opts.parseMode } : {}),
    ...(opts.replyToMessageId
      ? { reply_to_message_id: opts.replyToMessageId }
      : {}),
  });
}

export async function getMe(
  config: TelegramConfig,
): Promise<{ id: number; username: string; first_name: string }> {
  return call(config, "getMe");
}

export async function setWebhook(
  config: TelegramConfig,
  webhookUrl: string,
  secretToken: string,
): Promise<true> {
  await call(config, "setWebhook", {
    url: webhookUrl,
    secret_token: secretToken,
    allowed_updates: ["message", "edited_message"],
    drop_pending_updates: true,
  });
  return true;
}

export async function deleteWebhook(config: TelegramConfig): Promise<true> {
  await call(config, "deleteWebhook", { drop_pending_updates: false });
  return true;
}

/**
 * Resolve a Telegram file_id (voice / photo / document) to an absolute https
 * URL that callers can download or hand to Whisper. Telegram file URLs are
 * short-lived (~1h) and embed the bot token, so do not store them long-term.
 */
export async function getFileUrl(
  config: TelegramConfig,
  fileId: string,
): Promise<string> {
  const file = await call<{ file_path: string }>(config, "getFile", {
    file_id: fileId,
  });
  return `${TG_BASE}/file/bot${config.botToken}/${file.file_path}`;
}
