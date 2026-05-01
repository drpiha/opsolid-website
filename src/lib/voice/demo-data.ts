// Demo seed data for a tenant — business hours, KB, handoff rules, and synthetic calls.

import { randomBytes } from "node:crypto";
import { Prisma, type VoiceTenant } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { renderSystemPrompt } from "./prompts";
import { formatBillingMonth } from "./analytics";

export const DEMO_TENANT_SLUG = "demo-restaurant-berlin";

// ---------------------------------------------------------------------------
// Seed helper — idempotent. Skips items that already exist for this tenant.
// ---------------------------------------------------------------------------

export async function seedVoiceDemoData(tenantId: string): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "seedVoiceDemoData refuses to run in NODE_ENV=production — demo data would contaminate real tenant records",
    );
  }

  const tenant = await prisma.voiceTenant.findUnique({
    where: { id: tenantId },
  });
  if (!tenant) {
    throw new Error(`seedVoiceDemoData: tenant ${tenantId} not found`);
  }

  // ---- Business hours --------------------------------------------------
  // Mon-Fri 09:00-18:00, Sat 10:00-14:00, Sun closed.
  type HoursSeed = {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  };
  const weekly: HoursSeed[] = [
    { dayOfWeek: 0, openTime: "00:00", closeTime: "00:00", isClosed: true }, // Sun
    { dayOfWeek: 1, openTime: "09:00", closeTime: "18:00", isClosed: false },
    { dayOfWeek: 2, openTime: "09:00", closeTime: "18:00", isClosed: false },
    { dayOfWeek: 3, openTime: "09:00", closeTime: "18:00", isClosed: false },
    { dayOfWeek: 4, openTime: "09:00", closeTime: "18:00", isClosed: false },
    { dayOfWeek: 5, openTime: "09:00", closeTime: "18:00", isClosed: false },
    { dayOfWeek: 6, openTime: "10:00", closeTime: "14:00", isClosed: false }, // Sat
  ];
  // Prisma's compound unique key types reject `null` for the nullable
  // `overrideDate` part even though the DB allows it; use findFirst + create/update
  // to stay strictly typed.
  for (const w of weekly) {
    const existing = await prisma.voiceBusinessHours.findFirst({
      where: {
        tenantId,
        dayOfWeek: w.dayOfWeek,
        isOverride: false,
        overrideDate: null,
      },
      select: { id: true },
    });
    if (existing) {
      await prisma.voiceBusinessHours.update({
        where: { id: existing.id },
        data: {
          openTime: w.openTime,
          closeTime: w.closeTime,
          isClosed: w.isClosed,
          aiMode: "always_on",
        },
      });
    } else {
      await prisma.voiceBusinessHours.create({
        data: {
          tenantId,
          dayOfWeek: w.dayOfWeek,
          openTime: w.openTime,
          closeTime: w.closeTime,
          isClosed: w.isClosed,
          isOverride: false,
          aiMode: "always_on",
        },
      });
    }
  }

  // ---- Knowledge base --------------------------------------------------
  const kbItems: Array<{
    itemType: string;
    title: string;
    content: string;
    sortOrder: number;
  }> = [
    {
      itemType: "faq",
      title: "Reservierungen & Stornierungen",
      content:
        "Reservierungen sind bis zu 30 Tage im Voraus möglich. Stornierungen bis 2 Stunden vor dem Termin sind kostenfrei.",
      sortOrder: 0,
    },
    {
      itemType: "pricing",
      title: "Mittagskarte (Mo–Fr)",
      content:
        "Tagesgericht 12,50 €, Suppe + Hauptgang 15,90 €, Dessert 4,50 €. Vegetarische und vegane Optionen verfügbar.",
      sortOrder: 1,
    },
    {
      itemType: "location",
      title: "Adresse & Anfahrt",
      content:
        "Friedrichstraße 123, 10117 Berlin. U-Bahn Friedrichstraße (200 m). Parkhaus Quartier 207 fußläufig.",
      sortOrder: 2,
    },
  ];
  for (const item of kbItems) {
    const existing = await prisma.voiceKnowledgeBaseItem.findFirst({
      where: { tenantId, title: item.title },
    });
    if (!existing) {
      await prisma.voiceKnowledgeBaseItem.create({
        data: { tenantId, ...item, isActive: true },
      });
    }
  }

  // ---- Handoff rules ---------------------------------------------------
  const rules: Array<{
    name: string;
    triggerType: string;
    triggerValue: string | null;
    actionType: string;
    actionConfig: Record<string, unknown>;
    sortOrder: number;
  }> = [
    {
      name: "Eskalation auf Wunsch",
      triggerType: "keyword",
      triggerValue: "spreche mit Mensch",
      actionType: "transfer_call",
      actionConfig: {
        transferNumber: tenant.contactPhone ?? "+493012345678",
      },
      sortOrder: 0,
    },
    {
      name: "Negative Stimmung",
      triggerType: "sentiment",
      triggerValue: "negative",
      actionType: "transfer_call",
      actionConfig: {
        transferNumber: tenant.contactPhone ?? "+493012345678",
      },
      sortOrder: 1,
    },
  ];
  for (const r of rules) {
    const existing = await prisma.voiceHandoffRule.findFirst({
      where: { tenantId, name: r.name },
    });
    if (!existing) {
      await prisma.voiceHandoffRule.create({
        data: {
          tenantId,
          name: r.name,
          triggerType: r.triggerType,
          triggerValue: r.triggerValue,
          actionType: r.actionType,
          actionConfig: r.actionConfig as unknown as Prisma.InputJsonValue,
          sortOrder: r.sortOrder,
          isActive: true,
        },
      });
    }
  }

  // ---- Appointment rule ------------------------------------------------
  const apptExisting = await prisma.voiceAppointmentRule.findFirst({
    where: { tenantId, name: "Standard Reservierung" },
  });
  if (!apptExisting) {
    await prisma.voiceAppointmentRule.create({
      data: {
        tenantId,
        name: "Standard Reservierung",
        bookingType: "email_request",
        bufferMinutes: 15,
        minNoticeMinutes: 60,
        maxDaysAhead: 30,
        slotDurationMin: 90,
        conflictPolicy: "offer_next",
        confirmationMsg:
          "Wir bestätigen Ihre Reservierung kurz per E-Mail oder Anruf.",
        requireFields: [
          "name",
          "phone",
          "partySize",
          "reservationDate",
          "reservationTime",
        ] as unknown as Prisma.InputJsonValue,
        isActive: true,
      },
    });
  }

  // ---- Default agent if none exists ------------------------------------
  let agent = await prisma.voiceAgent.findFirst({
    where: { tenantId },
  });
  if (!agent) {
    const systemPrompt = renderSystemPrompt("restaurant_reservation", {
      businessName: tenant.businessName,
      agentName: "Lina",
      businessDescription:
        tenant.businessDescription ??
        "Modernes Bistro mit saisonaler Küche im Herzen Berlins.",
      businessAddress:
        tenant.businessAddress ?? "Friedrichstraße 123, 10117 Berlin",
      timezone: tenant.timezone,
      knowledgeBaseItems: kbItems.map((k) => ({
        itemType: k.itemType,
        title: k.title,
        content: k.content,
      })),
      handoffRules: rules.map((r) => ({
        name: r.name,
        triggerType: r.triggerType,
        triggerValue: r.triggerValue,
        actionType: r.actionType,
      })),
    });

    agent = await prisma.voiceAgent.create({
      data: {
        tenantId,
        name: "demo-agent",
        displayName: "Lina",
        language: "de",
        voiceId: "mock-anna-de",
        status: "active",
        promptTemplate: "restaurant_reservation",
        systemPrompt,
        maxDurationSeconds: 600,
        interruptionSensitivity: 0.8,
        responseDelayMs: 500,
        endCallPhrases: ["auf wiedersehen", "tschüss", "ciao"],
        ambientSoundEnabled: false,
      },
    });
  }

  // ---- Synthetic calls -------------------------------------------------
  const existingCalls = await prisma.voiceCall.count({
    where: { agentId: agent.id, providerCallId: { startsWith: "demo-" } },
  });
  if (existingCalls === 0) {
    await seedDemoCalls(agent.id, agent.tenantId);
  }
}

// ---------------------------------------------------------------------------
// Synthetic call seeder — 5 calls spread over the last 7 days, mixed outcomes.
// ---------------------------------------------------------------------------

interface DemoCallSeed {
  daysAgo: number;
  hourOffset: number;
  durationSeconds: number;
  outcomeType: string;
  status: string;
  fromNumber: string;
  callerName: string;
  language: string;
  summary: string;
  extractedFields: Record<string, unknown>;
  costUnits: number;
}

const DEMO_CALLS: DemoCallSeed[] = [
  {
    daysAgo: 6,
    hourOffset: 19,
    durationSeconds: 132,
    outcomeType: "appointment_booked",
    status: "ended",
    fromNumber: "+491511234567",
    callerName: "Müller",
    language: "de-DE",
    summary:
      "Tisch für 2 Personen am Freitag um 19:30 Uhr auf den Namen Müller reserviert.",
    extractedFields: {
      name: "Müller",
      phone: "+491511234567",
      partySize: 2,
      requestedDate: isoOffset(-1),
      requestedTime: "19:30",
      outcomeType: "appointment_booked",
    },
    costUnits: 18,
  },
  {
    daysAgo: 4,
    hourOffset: 12,
    durationSeconds: 88,
    outcomeType: "info_provided",
    status: "ended",
    fromNumber: "+491607654321",
    callerName: "Schmidt",
    language: "de-DE",
    summary: "Auskunft zu Öffnungszeiten und Mittagskarte erteilt.",
    extractedFields: {
      name: "Schmidt",
      outcomeType: "info_provided",
    },
    costUnits: 12,
  },
  {
    daysAgo: 3,
    hourOffset: 13,
    durationSeconds: 47,
    outcomeType: "no_action",
    status: "no_answer",
    fromNumber: "+491729998877",
    callerName: "Unbekannt",
    language: "de-DE",
    summary: "Anrufer hat aufgelegt, bevor das Gespräch begonnen hat.",
    extractedFields: {
      outcomeType: "no_action",
    },
    costUnits: 4,
  },
  {
    daysAgo: 2,
    hourOffset: 18,
    durationSeconds: 245,
    outcomeType: "order_placed",
    status: "ended",
    fromNumber: "+491715551234",
    callerName: "Yılmaz",
    language: "tr-TR",
    summary:
      "Abholbestellung: 1× Tagesgericht, 1× Suppe, 1× Dessert auf den Namen Yılmaz.",
    extractedFields: {
      name: "Yılmaz",
      phone: "+491715551234",
      orderItems: [
        { name: "Tagesgericht", qty: 1 },
        { name: "Suppe", qty: 1 },
        { name: "Dessert", qty: 1 },
      ],
      outcomeType: "order_placed",
    },
    costUnits: 32,
  },
  {
    daysAgo: 1,
    hourOffset: 11,
    durationSeconds: 178,
    outcomeType: "appointment_booked",
    status: "ended",
    fromNumber: "+491704443322",
    callerName: "Kim",
    language: "en-US",
    summary:
      "Reservation for 4 guests next Saturday 8 pm under Kim. Birthday celebration noted.",
    extractedFields: {
      name: "Kim",
      phone: "+491704443322",
      partySize: 4,
      requestedDate: isoOffset(5),
      requestedTime: "20:00",
      specialRequests: "Geburtstag",
      outcomeType: "appointment_booked",
    },
    costUnits: 22,
  },
];

async function seedDemoCalls(agentId: string, tenantId: string): Promise<void> {
  for (const seed of DEMO_CALLS) {
    const startedAt = new Date(
      Date.now() - seed.daysAgo * 24 * 60 * 60 * 1000,
    );
    startedAt.setUTCHours(seed.hourOffset, 0, 0, 0);
    const endedAt = new Date(startedAt.getTime() + seed.durationSeconds * 1000);

    const providerCallId = `demo-${randomBytes(6).toString("hex")}`;
    const call = await prisma.voiceCall.create({
      data: {
        agentId,
        providerCallId,
        providerName: "mock",
        direction: "inbound",
        fromNumber: seed.fromNumber,
        toNumber: "+493012345678",
        status: seed.status,
        outcomeType: seed.outcomeType,
        detectedLanguage: seed.language,
        durationSeconds: seed.durationSeconds,
        sentiment:
          seed.outcomeType === "no_action"
            ? "neutral"
            : seed.outcomeType === "transferred"
              ? "negative"
              : "positive",
        callerName: seed.callerName,
        callerPhone: seed.fromNumber,
        summaryText: seed.summary,
        transcriptText: seed.summary,
        extractedFields:
          seed.extractedFields as unknown as Prisma.InputJsonValue,
        costUnits: seed.costUnits,
        processingStatus: "done",
        startedAt,
        endedAt,
      },
    });

    const billable = Math.max(1, Math.ceil(seed.durationSeconds / 60));
    await prisma.voiceUsageRecord.upsert({
      where: { callId: call.id },
      create: {
        tenantId,
        callId: call.id,
        billingMonth: formatBillingMonth(startedAt),
        durationSeconds: seed.durationSeconds,
        billableMinutes: billable,
        costUnits: seed.costUnits,
        overageUnits: 0,
        overageCents: 0,
      },
      update: {},
    });
  }
}

function isoOffset(days: number): string {
  const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const y = d.getUTCFullYear();
  const m = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = d.getUTCDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ---------------------------------------------------------------------------
// Convenience — create a complete demo tenant in one call.
// ---------------------------------------------------------------------------

export async function createDemoTenant(): Promise<VoiceTenant> {
  const existing = await prisma.voiceTenant.findUnique({
    where: { slug: DEMO_TENANT_SLUG },
  });
  if (existing) {
    await seedVoiceDemoData(existing.id);
    return existing;
  }

  const tenant = await prisma.voiceTenant.create({
    data: {
      slug: DEMO_TENANT_SLUG,
      businessName: "Bistro Demo Berlin",
      contactEmail: "demo@example.invalid",
      contactPhone: "+493012345678",
      timezone: "Europe/Berlin",
      locale: "de",
      mode: "standalone",
      status: "active",
      tenantToken: randomBytes(32).toString("hex"),
      webhookSecret: randomBytes(32).toString("hex"),
      providerName: "mock",
      businessDescription:
        "Modernes Bistro mit saisonaler Küche im Herzen Berlins. Mittagskarte Mo–Fr, Brunch am Wochenende.",
      businessAddress: "Friedrichstraße 123, 10117 Berlin",
      businessCategory: "restaurant",
      featureFlags: {} as unknown as Prisma.InputJsonValue,
    },
  });

  await seedVoiceDemoData(tenant.id);
  return tenant;
}
