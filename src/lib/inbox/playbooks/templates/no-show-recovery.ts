// =============================================================================
// Playbook: No-Show Recovery
//
// Trigger: calendar.cancelled (Cal.com webhook) OR manual
// Inputs (via extra):
//   - cancelledSlot: { start: ISO, end: ISO, service?: string }
//   - waitlist:      Array<{ phone: string; name?: string; locale?: string }>
//                    OR pulled from triggerConfig.waitlist
// Action:
//   1. Pick top N (default 3) from waitlist.
//   2. Send a WhatsApp template message to each in parallel.
//   3. The "first reply wins" race is handled by an inbound listener on
//      replies to the playbook's outbound message (out of scope for v1 —
//      v1 just fires the templates and records who got pinged).
// =============================================================================

import { prisma } from "@/lib/prisma";
import {
  sendTemplate as sendWhatsAppTemplate,
  type WhatsAppConfig,
} from "@/lib/inbox/channels/whatsapp/client";
import type { PlaybookTemplate } from "../types";

interface WaitlistEntry {
  phone: string;
  name?: string;
  locale?: string;
}

interface PlaybookConfig {
  templateName?: string;
  templateLanguage?: string;
  waitlist?: WaitlistEntry[];
  topN?: number;
}

export const noShowRecovery: PlaybookTemplate = {
  slug: "no-show-recovery",
  name: "No-Show Recovery",
  description:
    "When a booking cancels, fire a WhatsApp template to the top N people on your waitlist in parallel — first 'YES' takes the slot.",
  triggerType: "calendar.cancelled",
  defaultConfig: {
    templateName: "waitlist_slot_offer",
    templateLanguage: "tr",
    waitlist: [],
    topN: 3,
  },
  defaultSteps: { parallelDispatch: true },
  async run({ user, playbook, extra }) {
    const config = (playbook.triggerConfig ?? {}) as PlaybookConfig;
    const cancelledSlot = (extra?.cancelledSlot ?? null) as
      | { start?: string; service?: string }
      | null;
    if (!cancelledSlot) {
      return { summary: "skipped — no cancelledSlot in extra" };
    }

    const waitlist = (extra?.waitlist as WaitlistEntry[] | undefined) ??
      config.waitlist ??
      [];
    const topN = Math.max(1, Math.min(config.topN ?? 3, 10));
    const slice = waitlist.slice(0, topN);
    if (slice.length === 0) {
      return { summary: "skipped — empty waitlist" };
    }

    const channel = await prisma.inboxChannel.findFirst({
      where: { userId: user.id, type: "whatsapp", status: "active" },
    });
    if (!channel) return { summary: "skipped — no active WhatsApp channel" };

    const waConfig = (channel.config ?? {}) as Partial<WhatsAppConfig>;
    if (!waConfig.apiKey || !waConfig.phoneNumberId) {
      return { summary: "skipped — WhatsApp channel not configured" };
    }

    const templateName = config.templateName ?? "waitlist_slot_offer";
    const templateLang = config.templateLanguage ?? "tr";

    const results = await Promise.allSettled(
      slice.map(async (entry) => {
        const components = [
          {
            type: "body" as const,
            parameters: [
              { type: "text" as const, text: entry.name ?? "Hello" },
              {
                type: "text" as const,
                text: cancelledSlot.start ?? "today",
              },
              {
                type: "text" as const,
                text: cancelledSlot.service ?? "appointment",
              },
            ],
          },
        ];
        return sendWhatsAppTemplate(
          waConfig as WhatsAppConfig,
          entry.phone,
          templateName,
          entry.locale ?? templateLang,
          components,
        );
      }),
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - sent;

    return {
      summary: `${sent}/${slice.length} WhatsApp template(s) fired`,
      details: {
        templateName,
        topN: slice.length,
        sent,
        failed,
        recipients: slice.map((e) => ({
          phone: e.phone.slice(0, 4) + "***",
          name: e.name,
        })),
      },
    };
  },
};
