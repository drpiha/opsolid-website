// =============================================================================
// WhatsApp (Meta Cloud API / 360dialog) → InboundMessage adapter
//
// Cloud API webhooks bundle multiple messages per call inside a fixed
// envelope: entry[].changes[].value.messages[]. We iterate messages,
// resolve any media-id to a downloadable URL (voice / image / document),
// and emit one InboundMessage per WhatsApp message.
//
// Status callbacks (delivered / read) arrive in the same envelope under
// value.statuses[] — those map to InboxMessage.status updates and are
// handled separately by the webhook route.
// =============================================================================

import type { InboundMessage } from "../../types";
import { downloadMediaUrl, type WhatsAppConfig } from "./client";

export interface WhatsAppWebhookValue {
  messaging_product?: string;
  metadata?: { display_phone_number?: string; phone_number_id?: string };
  contacts?: Array<{
    wa_id: string;
    profile?: { name?: string };
  }>;
  messages?: WhatsAppMessage[];
  statuses?: WhatsAppStatus[];
}

export interface WhatsAppWebhookPayload {
  object?: string;
  entry?: Array<{
    id?: string;
    changes?: Array<{ value: WhatsAppWebhookValue; field?: string }>;
  }>;
}

interface BaseMessage {
  id: string;
  from: string;
  timestamp: string;
  type: string;
}

export type WhatsAppMessage =
  | (BaseMessage & { type: "text"; text: { body: string } })
  | (BaseMessage & {
      type: "voice" | "audio";
      voice?: { id: string; mime_type?: string };
      audio?: { id: string; mime_type?: string };
    })
  | (BaseMessage & {
      type: "image" | "document" | "video";
      image?: { id: string; caption?: string; mime_type?: string };
      document?: { id: string; caption?: string; filename?: string };
      video?: { id: string; caption?: string };
    })
  | (BaseMessage & { type: "button"; button: { text: string; payload: string } })
  | (BaseMessage & {
      type: "interactive";
      interactive?: {
        type: string;
        button_reply?: { id: string; title: string };
        list_reply?: { id: string; title: string };
      };
    });

export interface WhatsAppStatus {
  id: string;
  recipient_id: string;
  status: "sent" | "delivered" | "read" | "failed";
  timestamp: string;
  errors?: Array<{ code: number; title: string }>;
}

export async function toInboundMessages(
  config: WhatsAppConfig,
  externalChannelId: string,
  payload: WhatsAppWebhookPayload,
): Promise<{
  messages: InboundMessage[];
  statuses: WhatsAppStatus[];
}> {
  const allMessages: InboundMessage[] = [];
  const allStatuses: WhatsAppStatus[] = [];

  const changes = payload.entry?.flatMap((e) => e.changes ?? []) ?? [];

  for (const change of changes) {
    const value = change.value;
    if (!value) continue;

    if (value.statuses?.length) {
      allStatuses.push(...value.statuses);
    }

    if (!value.messages?.length) continue;

    const contactByWaId = new Map(
      (value.contacts ?? []).map((c) => [c.wa_id, c]),
    );

    for (const msg of value.messages) {
      const contact = contactByWaId.get(msg.from);
      const inbound = await normalizeMessage(
        config,
        externalChannelId,
        msg,
        contact?.profile?.name ?? null,
      );
      if (inbound) allMessages.push(inbound);
    }
  }

  return { messages: allMessages, statuses: allStatuses };
}

async function normalizeMessage(
  config: WhatsAppConfig,
  externalChannelId: string,
  msg: WhatsAppMessage,
  contactName: string | null,
): Promise<InboundMessage | null> {
  let body: string | null = null;
  let voiceUrl: string | null = null;
  const mediaUrls: string[] = [];

  switch (msg.type) {
    case "text":
      body = msg.text.body;
      break;

    case "voice":
    case "audio": {
      const media = msg.voice ?? msg.audio;
      if (media?.id) {
        voiceUrl = await downloadMediaUrl(config, media.id);
      }
      body = null;
      break;
    }

    case "image":
    case "document":
    case "video": {
      const media = msg.image ?? msg.document ?? msg.video;
      const caption =
        ("caption" in (media ?? {}) ? media?.caption : undefined) ?? null;
      body = caption;
      if (media && "id" in media && media.id) {
        const url = await downloadMediaUrl(config, media.id);
        if (url) mediaUrls.push(url);
      }
      break;
    }

    case "button":
      body = msg.button.text;
      break;

    case "interactive":
      body =
        msg.interactive?.button_reply?.title ??
        msg.interactive?.list_reply?.title ??
        null;
      break;

    default:
      return null;
  }

  return {
    channelType: "whatsapp",
    externalChannelId,
    externalThreadId: msg.from,
    externalMessageId: msg.id,
    contactHandle: msg.from,
    contactName,
    contactLocale: null,
    body,
    mediaUrls,
    voiceUrl,
    voiceTranscript: null,
    language: null,
    receivedAt: new Date(Number(msg.timestamp) * 1000),
  };
}
