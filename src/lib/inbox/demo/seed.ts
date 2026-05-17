// =============================================================================
// Inbox demo seed
//
// Fair-friendly canned content. Creates one fake channel per type (with
// label prefixed by [DEMO]) and a handful of threads with realistic
// multilingual conversations. Idempotent: calling seed twice doesn't
// duplicate — we upsert on (type, externalId) where externalId follows
// the convention "demo:<user.id>:<n>".
//
// `clearDemo` removes every row whose channel label starts with "[DEMO]".
// =============================================================================

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";

interface DemoMessage {
  body: string;
  direction: "in" | "out";
  minsAgo: number;
  voiceTranscript?: string;
  language?: string;
}

interface DemoThread {
  contactName: string;
  contactHandle: string;
  contactLocale: string;
  subject?: string;
  priority?: number;
  tags?: string[];
  aiSummary?: string;
  aiSentiment?: "positive" | "neutral" | "negative" | "urgent";
  aiIntent?: string;
  unreadCount?: number;
  messages: DemoMessage[];
}

interface DemoChannel {
  type: "whatsapp" | "telegram" | "email" | "voice";
  label: string;
  threads: DemoThread[];
}

const DATA: DemoChannel[] = [
  {
    type: "whatsapp",
    label: "[DEMO] Sample Bakery — WhatsApp",
    threads: [
      {
        contactName: "Ahmet — Un Tedarikçi",
        contactHandle: "905551234567",
        contactLocale: "tr",
        priority: 1,
        tags: ["voice-order"],
        aiSummary:
          "Tedarikçi 50 kg buğday unu, 10 kg çavdar ve 5 kg kepekli un siparişi geçti. Çarşamba teslimat.",
        aiSentiment: "neutral",
        aiIntent: "booking",
        unreadCount: 1,
        messages: [
          {
            direction: "in",
            minsAgo: 14,
            voiceTranscript:
              "Selam usta, bu hafta için 50 kilo buğday unu, 10 kilo çavdar, bir de 5 kilo kepekli un göndereceğim. Çarşamba sabah getiririm, uygun mu?",
            language: "tr",
            body: null as unknown as string,
          },
        ],
      },
      {
        contactName: "Frau Becker",
        contactHandle: "4915155512345",
        contactLocale: "de",
        aiSummary:
          "Stammkundin fragt nach Bestellung von 20 Sauerteig-Broten für Samstagsfeier.",
        aiSentiment: "positive",
        aiIntent: "quote_request",
        messages: [
          {
            direction: "in",
            minsAgo: 95,
            body: "Hallo! Können Sie 20 Sauerteigbrote für Samstag um 10 Uhr vorbereiten? Geburtstag der Oma 🎂",
            language: "de",
          },
          {
            direction: "out",
            minsAgo: 88,
            body: "Liebe Frau Becker, sehr gerne! 20 Brote zum 10 Uhr Samstag — kein Problem. Soll ich auch ein paar Streusel-Brote dazulegen?",
          },
        ],
      },
    ],
  },
  {
    type: "telegram",
    label: "[DEMO] Sample Clinic — Telegram Bot",
    threads: [
      {
        contactName: "Maria Schäfer",
        contactHandle: "@mariaS",
        contactLocale: "de",
        priority: 2,
        aiSummary:
          "Patient bittet um Verschiebung des morgigen Zahnreinigungstermins wegen Krankheit.",
        aiSentiment: "negative",
        aiIntent: "booking",
        unreadCount: 1,
        messages: [
          {
            direction: "in",
            minsAgo: 22,
            body: "Hallo, ich bin krank geworden und kann morgen leider nicht zur Zahnreinigung kommen. Können wir den Termin verschieben?",
            language: "de",
          },
        ],
      },
    ],
  },
  {
    type: "email",
    label: "[DEMO] Sample B2B Studio — Email",
    threads: [
      {
        contactName: "Caner Aksoy",
        contactHandle: "caner@startupx.io",
        contactLocale: "en",
        subject: "RFQ — translation services",
        priority: 1,
        tags: ["quote-draft-ready"],
        aiSummary:
          "RFQ for ongoing EN→DE translation of marketing copy, ~3,000 words/month.",
        aiSentiment: "neutral",
        aiIntent: "quote_request",
        messages: [
          {
            direction: "in",
            minsAgo: 240,
            body: "Hi team,\n\nWe're launching a new product in DACH and need ongoing EN→DE translation of our marketing copy (~3,000 words/month, weekly cadence). Could you send a quote with retainer pricing?\n\nThanks,\nCaner — StartupX",
            language: "en",
          },
        ],
      },
    ],
  },
  {
    type: "voice",
    label: "[DEMO] Voice agent — front desk",
    threads: [
      {
        contactName: "Inbound caller +49 ...",
        contactHandle: "+4917612345678",
        contactLocale: "de",
        aiSummary:
          "Caller booked a haircut for Tuesday 14:00 via the voice agent. Confirmation sent via SMS.",
        aiSentiment: "positive",
        aiIntent: "booking",
        messages: [
          {
            direction: "in",
            minsAgo: 360,
            body: "[Voice transcript] Guten Tag, ich hätte gern einen Termin für einen Herrenhaarschnitt nächsten Dienstag, wenn möglich um 14 Uhr.",
            language: "de",
          },
          {
            direction: "out",
            minsAgo: 358,
            body: "[Voice transcript] Sehr gern, ich habe Sie für Dienstag um 14:00 eingebucht. Sie bekommen gleich eine SMS mit der Bestätigung. Auf Wiederhören!",
          },
        ],
      },
    ],
  },
];

export async function seedDemoForUser(userId: string): Promise<{
  channels: number;
  threads: number;
  messages: number;
}> {
  let channelCount = 0;
  let threadCount = 0;
  let messageCount = 0;

  for (let ci = 0; ci < DATA.length; ci++) {
    const def = DATA[ci];
    const externalId = `demo:${userId}:${ci}`;

    const channel = await prisma.inboxChannel.upsert({
      where: {
        type_externalId: { type: def.type, externalId },
      },
      create: {
        userId,
        type: def.type,
        externalId,
        label: def.label,
        config: { demo: true } as Prisma.InputJsonValue,
        status: "active",
      },
      update: {
        userId,
        label: def.label,
        status: "active",
      },
    });
    channelCount++;

    for (let ti = 0; ti < def.threads.length; ti++) {
      const t = def.threads[ti];
      const threadExtId = `demo-thread:${ci}:${ti}`;
      const newest = t.messages[t.messages.length - 1];
      const lastAt = new Date(Date.now() - newest.minsAgo * 60_000);

      const thread = await prisma.inboxThread.upsert({
        where: {
          channelId_externalThreadId: {
            channelId: channel.id,
            externalThreadId: threadExtId,
          },
        },
        create: {
          userId,
          channelId: channel.id,
          channelType: def.type,
          externalThreadId: threadExtId,
          contactName: t.contactName,
          contactHandle: t.contactHandle,
          contactLocale: t.contactLocale,
          subject: t.subject ?? null,
          priority: t.priority ?? 0,
          tags: t.tags ?? [],
          aiSummary: t.aiSummary ?? null,
          aiSentiment: t.aiSentiment ?? null,
          aiIntent: t.aiIntent ?? null,
          aiUpdatedAt: t.aiSummary ? new Date() : null,
          aiMessageCount: t.messages.length,
          lastMessageAt: lastAt,
          unreadCount: t.unreadCount ?? 0,
        },
        update: {
          contactName: t.contactName,
          subject: t.subject ?? null,
          priority: t.priority ?? 0,
          tags: t.tags ?? [],
          aiSummary: t.aiSummary ?? null,
          aiSentiment: t.aiSentiment ?? null,
          aiIntent: t.aiIntent ?? null,
          aiMessageCount: t.messages.length,
          lastMessageAt: lastAt,
          unreadCount: t.unreadCount ?? 0,
          status: "open",
        },
      });
      threadCount++;

      // Recreate messages cleanly: delete + insert. Idempotent on re-seed.
      await prisma.inboxMessage.deleteMany({ where: { threadId: thread.id } });
      for (let mi = 0; mi < t.messages.length; mi++) {
        const m = t.messages[mi];
        const createdAt = new Date(Date.now() - m.minsAgo * 60_000);
        await prisma.inboxMessage.create({
          data: {
            threadId: thread.id,
            direction: m.direction,
            sentBy: m.direction === "out" ? "user" : "customer",
            status: m.direction === "out" ? "sent" : "delivered",
            body: m.body ?? null,
            voiceTranscript: m.voiceTranscript ?? null,
            language: m.language ?? null,
            externalId: `demo-msg:${ci}:${ti}:${mi}`,
            createdAt,
            deliveredAt: createdAt,
          },
        });
        messageCount++;
      }
    }
  }

  return { channels: channelCount, threads: threadCount, messages: messageCount };
}

export async function clearDemoForUser(userId: string): Promise<number> {
  // Cascade delete kills threads + messages + suggestions.
  const result = await prisma.inboxChannel.deleteMany({
    where: { userId, label: { startsWith: "[DEMO]" } },
  });
  return result.count;
}
