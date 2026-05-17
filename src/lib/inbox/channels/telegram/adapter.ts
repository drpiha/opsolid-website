// =============================================================================
// Telegram → InboundMessage adapter
//
// Normalises Telegram Update payloads into the shape the inbox repository
// understands. Voice notes are resolved to absolute https URLs but NOT
// transcribed here — the AI layer (Faz G) takes care of transcription as an
// async step so the webhook stays under Telegram's 60s response window.
// =============================================================================

import type { InboundMessage } from "../../types";
import { getFileUrl, type TelegramConfig } from "./client";

// Minimal Telegram Update shape — only the fields we use.
export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
}

export interface TelegramMessage {
  message_id: number;
  from?: {
    id: number;
    is_bot?: boolean;
    first_name?: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  };
  chat: { id: number; type: string; title?: string; username?: string };
  date: number;
  text?: string;
  caption?: string;
  voice?: { file_id: string; duration: number; mime_type?: string };
  audio?: { file_id: string; duration: number; mime_type?: string };
  photo?: Array<{ file_id: string; width: number; height: number }>;
  document?: { file_id: string; mime_type?: string; file_name?: string };
}

function fullName(from?: TelegramMessage["from"]): string {
  if (!from) return "Telegram user";
  const first = from.first_name?.trim() ?? "";
  const last = from.last_name?.trim() ?? "";
  const joined = `${first} ${last}`.trim();
  if (joined) return joined;
  if (from.username) return `@${from.username}`;
  return `Telegram ${from.id}`;
}

function contactHandle(msg: TelegramMessage): string {
  if (msg.from?.username) return `@${msg.from.username}`;
  if (msg.from?.id) return `tg:${msg.from.id}`;
  return `tg:chat:${msg.chat.id}`;
}

/**
 * Pick the largest photo variant from the Telegram photo array — the API
 * always returns multiple resolutions for the same image and the last one
 * is the original.
 */
function largestPhoto(photos: NonNullable<TelegramMessage["photo"]>) {
  return photos.reduce((best, current) =>
    current.width * current.height > best.width * best.height ? current : best,
  );
}

/**
 * Build the normalized inbound payload. The function takes the bot's
 * TelegramConfig because resolving voice / image URLs needs the bot token.
 */
export async function toInboundMessage(
  config: TelegramConfig,
  externalChannelId: string,
  update: TelegramUpdate,
): Promise<InboundMessage | null> {
  const msg = update.message ?? update.edited_message;
  if (!msg) return null;
  // Ignore bot-to-bot echoes.
  if (msg.from?.is_bot) return null;

  const mediaUrls: string[] = [];
  let voiceUrl: string | null = null;

  if (msg.photo && msg.photo.length > 0) {
    try {
      const photo = largestPhoto(msg.photo);
      mediaUrls.push(await getFileUrl(config, photo.file_id));
    } catch {
      // Silently skip media we can't resolve — message still ingests.
    }
  }
  if (msg.document) {
    try {
      mediaUrls.push(await getFileUrl(config, msg.document.file_id));
    } catch {
      // ignore
    }
  }
  if (msg.voice ?? msg.audio) {
    try {
      const fileId = (msg.voice ?? msg.audio)!.file_id;
      voiceUrl = await getFileUrl(config, fileId);
    } catch {
      // ignore
    }
  }

  return {
    channelType: "telegram",
    externalChannelId,
    externalThreadId: String(msg.chat.id),
    externalMessageId: String(msg.message_id),
    contactHandle: contactHandle(msg),
    contactName: fullName(msg.from),
    contactLocale: msg.from?.language_code ?? null,
    body: msg.text ?? msg.caption ?? null,
    mediaUrls,
    voiceUrl,
    voiceTranscript: null,
    language: msg.from?.language_code ?? null,
    receivedAt: new Date(msg.date * 1000),
  };
}
