// =============================================================================
// Inbox dispatcher — send an outbound message via the right channel adapter.
//
// Sits between the API layer ("user clicked Send") and channel-specific
// clients. Keeps the API thin: POST /api/inbox/threads/[id]/messages just
// calls `dispatchOutbound(thread, body)` and we handle the rest.
//
// Adding a channel = adding a case here + a client. Repository / route stay
// untouched.
// =============================================================================

import { prisma } from "@/lib/prisma";
import {
  createOutboundDraft,
  markOutboundFailed,
  markOutboundSent,
} from "./repository";
import {
  sendMessage as sendTelegramMessage,
  TelegramApiError,
  type TelegramConfig,
} from "./channels/telegram/client";
import {
  sendEmail,
  emailConfigFromEnv,
} from "./channels/email/client";
import {
  sendText as sendWhatsAppText,
  WhatsAppApiError,
  type WhatsAppConfig,
} from "./channels/whatsapp/client";
import type { MessageSentBy } from "./types";

export async function dispatchOutbound(params: {
  userId: string;
  threadId: string;
  body: string;
  sentBy?: MessageSentBy;
}): Promise<{ messageId: string; status: "sent" | "pending" | "failed" }> {
  const thread = await prisma.inboxThread.findFirst({
    where: { id: params.threadId, userId: params.userId },
    include: {
      channel: true,
      messages: {
        where: { direction: "in" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { externalId: true },
      },
    },
  });
  if (!thread) throw new Error("thread_not_found");
  const lastInboundExternalId = thread.messages[0]?.externalId ?? null;

  const message = await createOutboundDraft(
    params.userId,
    params.threadId,
    params.body,
    params.sentBy ?? "user",
  );

  try {
    switch (thread.channel.type) {
      case "telegram": {
        const config = (thread.channel.config ?? {}) as Partial<TelegramConfig>;
        if (!config.botToken) throw new Error("telegram_no_bot_token");
        const sent = await sendTelegramMessage(
          config as TelegramConfig,
          thread.externalThreadId,
          params.body,
        );
        await markOutboundSent(message.id, String(sent.message_id), "sent");
        return { messageId: message.id, status: "sent" };
      }
      case "whatsapp": {
        const config = (thread.channel.config ?? {}) as Partial<WhatsAppConfig>;
        if (!config.apiKey || !config.phoneNumberId) {
          throw new Error("whatsapp_channel_not_configured");
        }
        const sent = await sendWhatsAppText(
          config as WhatsAppConfig,
          thread.contactHandle,
          params.body,
        );
        const messageId = sent.messages[0]?.id ?? null;
        await markOutboundSent(message.id, messageId, "sent");
        return { messageId: message.id, status: "sent" };
      }
      case "email": {
        const config = emailConfigFromEnv();
        if (!config) throw new Error("email_smtp_not_configured");
        const subject = thread.subject
          ? thread.subject.toLowerCase().startsWith("re:")
            ? thread.subject
            : `Re: ${thread.subject}`
          : "Re: Kutasia Inbox";
        const sent = await sendEmail(config, {
          to: thread.contactHandle,
          subject,
          text: params.body,
          inReplyTo: lastInboundExternalId
            ? `<${lastInboundExternalId}>`
            : null,
          references: lastInboundExternalId
            ? [`<${lastInboundExternalId}>`]
            : null,
        });
        const messageId = sent.messageId.replace(/[<>]/g, "");
        await markOutboundSent(
          message.id,
          messageId || null,
          sent.accepted > 0 ? "sent" : "pending",
        );
        return {
          messageId: message.id,
          status: sent.accepted > 0 ? "sent" : "pending",
        };
      }
      default:
        throw new Error(`unsupported_channel:${thread.channel.type}`);
    }
  } catch (err) {
    const description =
      err instanceof TelegramApiError
        ? err.description
        : err instanceof WhatsAppApiError
          ? err.detail
          : err instanceof Error
            ? err.message
            : String(err);
    await markOutboundFailed(message.id, description);
    return { messageId: message.id, status: "failed" };
  }
}
