// =============================================================================
// Playbook: Appointment Confirm
//
// Trigger: schedule (runs daily) — checks upcoming appointments and sends
//          WhatsApp confirmations 24h before + on the day.
// Inputs (via extra at scheduled fire):
//   - appointments: Array<{ phone, name?, startsAt: ISO, service?, locale? }>
//
// V1 ships a stub: when called without `extra.appointments`, returns
// "skipped — no appointments". Wiring this up to the VoiceAppointmentRule
// table is left for a follow-up — the data model is already in place.
// =============================================================================

import { prisma } from "@/lib/prisma";
import {
  sendTemplate as sendWhatsAppTemplate,
  type WhatsAppConfig,
} from "@/lib/inbox/channels/whatsapp/client";
import type { PlaybookTemplate } from "../types";

interface Appointment {
  phone: string;
  name?: string;
  startsAt: string;
  service?: string;
  locale?: string;
}

interface PlaybookConfig {
  templateName?: string;
  templateLanguage?: string;
}

export const appointmentConfirm: PlaybookTemplate = {
  slug: "appointment-confirm",
  name: "Appointment Confirm",
  description:
    "Daily WhatsApp confirmations 24h before + on the day, pulling appointments from the voice agent (or your calendar). Reduces no-shows.",
  triggerType: "schedule",
  defaultConfig: {
    templateName: "appointment_reminder",
    templateLanguage: "tr",
  },
  defaultSteps: { window: "24h+0h" },
  async run({ user, playbook, extra }) {
    const appointments =
      (extra?.appointments as Appointment[] | undefined) ?? [];
    if (appointments.length === 0) {
      return { summary: "skipped — no appointments in window" };
    }

    const config = (playbook.triggerConfig ?? {}) as PlaybookConfig;
    const templateName = config.templateName ?? "appointment_reminder";
    const templateLang = config.templateLanguage ?? "tr";

    const channel = await prisma.inboxChannel.findFirst({
      where: { userId: user.id, type: "whatsapp", status: "active" },
    });
    if (!channel) return { summary: "skipped — no active WhatsApp channel" };

    const waConfig = (channel.config ?? {}) as Partial<WhatsAppConfig>;
    if (!waConfig.apiKey || !waConfig.phoneNumberId) {
      return { summary: "skipped — WhatsApp channel not configured" };
    }

    const results = await Promise.allSettled(
      appointments.map((appt) => {
        const components = [
          {
            type: "body" as const,
            parameters: [
              { type: "text" as const, text: appt.name ?? "Hello" },
              { type: "text" as const, text: appt.startsAt },
              { type: "text" as const, text: appt.service ?? "your appointment" },
            ],
          },
        ];
        return sendWhatsAppTemplate(
          waConfig as WhatsAppConfig,
          appt.phone,
          templateName,
          appt.locale ?? templateLang,
          components,
        );
      }),
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    return {
      summary: `${sent}/${appointments.length} confirmation(s) sent`,
      details: { sent, failed: appointments.length - sent },
    };
  },
};
