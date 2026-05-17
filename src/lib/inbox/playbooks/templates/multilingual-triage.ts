// =============================================================================
// Playbook: Multilingual Triage
//
// Trigger: message.in
// Condition: customer language differs from owner locale.
// Action:
//   1. Translate the inbound message into the owner's locale (one-line).
//   2. Send that one-liner to Telegram (or stash as a system suggestion).
//   3. Optionally auto-reply in customer's language with an "I'll get back
//      to you" templated message (off by default — UX-sensitive).
// =============================================================================

import { prisma } from "@/lib/prisma";
import { completeText } from "@/lib/inbox/ai/claude";
import {
  sendMessage as sendTelegram,
  type TelegramConfig,
} from "@/lib/inbox/channels/telegram/client";
import type { PlaybookTemplate } from "../types";

export const multilingualTriage: PlaybookTemplate = {
  slug: "multilingual-triage",
  name: "Multilingual Triage",
  description:
    "If a customer writes in a language different from yours, AI summarises in one line in your language and pings you on Telegram. Optional auto-reply in customer language.",
  triggerType: "message.in",
  defaultConfig: { autoReplyEnabled: false },
  defaultSteps: { translateForOwner: true, telegramAlert: true },
  async run({ user, thread, message, playbook }) {
    if (!thread || !message) return { summary: "skipped — no thread/message" };
    const text = message.body ?? message.voiceTranscript;
    if (!text) return { summary: "skipped — no text" };

    const ownerLocale = (user.locale ?? "en").toLowerCase();
    const customerLocale = (
      message.language ??
      thread.contactLocale ??
      ""
    )
      .toLowerCase()
      .split(/[-_]/)[0];

    if (!customerLocale || customerLocale === ownerLocale) {
      return { summary: "skipped — same language" };
    }

    let translated = "";
    try {
      const { text: out } = await completeText(
        "haiku",
        `Translate the message into ${ownerLocale}. Reply with the translation only, no quotes, no preamble. One sentence max.`,
        text.slice(0, 1500),
        { maxTokens: 200, temperature: 0.1 },
      );
      translated = out;
    } catch (err) {
      console.warn("[playbook/multilingual-triage] translate failed", err);
      return { summary: "translate failed" };
    }

    const telegramChannel = await prisma.inboxChannel.findFirst({
      where: { userId: user.id, type: "telegram", status: "active" },
    });
    let telegramSent = false;
    if (telegramChannel) {
      const config = (telegramChannel.config ?? {}) as Partial<TelegramConfig>;
      const ownerChatId =
        playbook.triggerConfig &&
        typeof playbook.triggerConfig === "object" &&
        "ownerChatId" in playbook.triggerConfig
          ? (playbook.triggerConfig as { ownerChatId?: string | number })
              .ownerChatId
          : undefined;
      if (config.botToken && ownerChatId) {
        try {
          await sendTelegram(
            config as TelegramConfig,
            ownerChatId,
            `🌐 ${customerLocale.toUpperCase()} → ${ownerLocale.toUpperCase()}\nFrom: ${thread.contactName ?? thread.contactHandle}\n${translated}`,
          );
          telegramSent = true;
        } catch (err) {
          console.warn("[playbook/multilingual-triage] telegram failed", err);
        }
      }
    }

    return {
      summary: `translated ${customerLocale}→${ownerLocale}${telegramSent ? " + Telegram" : ""}`,
      details: { customerLocale, ownerLocale, translated, telegramSent },
    };
  },
};
