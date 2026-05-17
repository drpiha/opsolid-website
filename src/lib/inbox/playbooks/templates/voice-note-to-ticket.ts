// =============================================================================
// Playbook: Voice Note → Ticket
//
// Trigger: message.in
// Condition: inbound has voiceTranscript (or voiceUrl that AI/regen
//            transcribed before this runs).
// Action:
//   1. Extract structured fields (items + qty + date + notes) via Haiku.
//   2. Tag the thread with "voice-order" + set priority=1.
//   3. Send a Telegram alert to the owner if their channel has one
//      (or fall back to a system message on the thread).
// =============================================================================

import { prisma } from "@/lib/prisma";
import { completeJson } from "@/lib/inbox/ai/claude";
import { sendMessage as sendTelegram } from "@/lib/inbox/channels/telegram/client";
import type { TelegramConfig } from "@/lib/inbox/channels/telegram/client";
import type { PlaybookTemplate } from "../types";

interface ExtractedTicket {
  items: Array<{ name: string; quantity?: number; unit?: string }>;
  dueDate: string | null;
  notes: string | null;
}

export const voiceNoteToTicket: PlaybookTemplate = {
  slug: "voice-note-to-ticket",
  name: "Voice Note → Ticket",
  description:
    "When a customer or supplier sends a voice note, transcribe it, extract items / quantities / dates, and ping you on Telegram with a structured summary.",
  triggerType: "message.in",
  defaultSteps: { extractItems: true, telegramAlert: true, tagThread: true },
  async run({ user, thread, message, playbook }) {
    if (!thread || !message) return { summary: "skipped — no thread/message" };
    if (!message.voiceTranscript)
      return { summary: "skipped — no voice transcript" };

    const transcript = message.voiceTranscript.slice(0, 4000);
    const ownerLocale = user.locale ?? "en";

    let extracted: ExtractedTicket = { items: [], dueDate: null, notes: null };
    try {
      const { data } = await completeJson<ExtractedTicket>(
        "haiku",
        `You convert a voice memo into a structured order/request ticket.
Return ONE JSON object only:
{
  "items": [{"name": "...", "quantity": <number or null>, "unit": "..."}],
  "dueDate": "<ISO date or null>",
  "notes": "<one-sentence summary in ${ownerLocale} or null>"
}`,
        `Voice memo from ${thread.contactName ?? thread.contactHandle}:\n"${transcript}"\n\nReturn the JSON.`,
        { maxTokens: 400, temperature: 0.1 },
      );
      extracted = {
        items: Array.isArray(data.items) ? data.items.slice(0, 20) : [],
        dueDate: data.dueDate ?? null,
        notes: data.notes ?? null,
      };
    } catch (err) {
      console.warn("[playbook/voice-note-to-ticket] extract failed", err);
    }

    // Tag + elevate priority.
    await prisma.inboxThread.update({
      where: { id: thread.id },
      data: {
        tags: { set: ["voice-order"] },
        priority: 1,
      },
    });

    // Telegram alert if the user has a telegram channel configured.
    const telegramChannel = await prisma.inboxChannel.findFirst({
      where: { userId: user.id, type: "telegram", status: "active" },
    });
    let telegramSent = false;
    if (telegramChannel) {
      const config = (telegramChannel.config ?? {}) as Partial<TelegramConfig>;
      const ownerChatId = playbook.triggerConfig &&
        typeof playbook.triggerConfig === "object" &&
        "ownerChatId" in playbook.triggerConfig
        ? (playbook.triggerConfig as { ownerChatId?: string | number })
            .ownerChatId
        : undefined;
      if (config.botToken && ownerChatId) {
        const itemList =
          extracted.items
            .slice(0, 8)
            .map(
              (i) =>
                `• ${i.quantity ? `${i.quantity}${i.unit ? " " + i.unit : ""} ` : ""}${i.name}`,
            )
            .join("\n") || "(no items extracted)";
        const text = [
          `🎙 Voice ticket from ${thread.contactName ?? thread.contactHandle}`,
          extracted.notes ? `\n${extracted.notes}` : "",
          extracted.dueDate ? `\nDue: ${extracted.dueDate}` : "",
          `\n${itemList}`,
        ].join("");
        try {
          await sendTelegram(config as TelegramConfig, ownerChatId, text);
          telegramSent = true;
        } catch (err) {
          console.warn("[playbook/voice-note-to-ticket] telegram failed", err);
        }
      }
    }

    return {
      summary: `extracted ${extracted.items.length} item(s)${telegramSent ? " + Telegram alert" : ""}`,
      details: { extracted, telegramSent },
    };
  },
};
