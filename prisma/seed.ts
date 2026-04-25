// =============================================================================
// Prisma seed — syncs the CardTemplate table with src/config/card-templates.ts
// AND publishes the founder's own Smart Card so card.opsolid.de/hasan works
// on first deploy. Idempotent — re-running upserts existing rows in place.
//
// Run with: npx prisma db seed  (requires DATABASE_URL set)
// =============================================================================

import { PrismaClient } from "../src/generated/prisma";
import { cardTemplates } from "../src/config/card-templates";

const prisma = new PrismaClient();

const FOUNDER_CARD = {
  slug: "hasan",
  templateId: 1,
  contactName: "Hasan Dönmez",
  contactEmail: "info@kutasia.com",
  contactPhone: "+49 176 31020654",
  brandPrimaryHex: "#C27940",
  brandAccentHex: "#1F2530",
  cardData: {
    name: "Hasan Dönmez",
    title: "Founder & Automation Engineer",
    position: "IT Project Manager",
    company: "OpSolid",
    email: "info@kutasia.com",
    phone: "+49 176 31020654",
    whatsapp: "+49 176 31020654",
    website: "https://opsolid.de",
    bio: "Praktische Automatisierung & KI-Systeme für den Mittelstand. Ich plane, baue und betreibe maßgeschneiderte Workflows, die Ihre operativen Prozesse beschleunigen.",
    bookingUrl: "https://cal.com/solidra/discovery-call",
    impressumUrl: "https://opsolid.de/de/impressum",
    privacyUrl: "https://opsolid.de/de/privacy",
    socials: {
      linkedin: "https://www.linkedin.com/in/hasandonmez/",
    },
    services: [
      {
        title: "Automatisierung & Workflows",
        description: "Maßgeschneiderte Pipelines für Ihre operativen Prozesse — keine SaaS-Falle.",
      },
      {
        title: "KI-Integration",
        description: "Praktische LLM- und Voice-Agent-Integrationen mit klarem ROI.",
      },
      {
        title: "Smart Card · Digital Visitenkarte",
        description: "Mobile-first Visitenkarte mit Lead-Erfassung, NFC und QR.",
        priceLabel: "ab 49 €/Jahr",
      },
    ],
  },
} as const;

async function syncTemplates() {
  for (const t of cardTemplates) {
    await prisma.cardTemplate.upsert({
      where: { id: t.id },
      create: {
        id: t.id,
        slug: t.slug,
        name: t.name,
        sectorHint: t.sectorHint,
        componentKey: t.componentKey,
        previewPath: t.previewPath,
        oneTimeCents: t.oneTimeCents,
        monthlyCents: t.monthlyCents,
        yearlyCents: t.yearlyCents,
        stripeOneTimePriceId: t.stripeOneTimePriceId ?? null,
        stripeMonthlyPriceId: t.stripeMonthlyPriceId ?? null,
        stripeYearlyPriceId: t.stripeYearlyPriceId ?? null,
        isActive: t.isActive,
        sortOrder: t.sortOrder,
      },
      update: {
        slug: t.slug,
        name: t.name,
        sectorHint: t.sectorHint,
        componentKey: t.componentKey,
        previewPath: t.previewPath,
        oneTimeCents: t.oneTimeCents,
        monthlyCents: t.monthlyCents,
        yearlyCents: t.yearlyCents,
        stripeOneTimePriceId: t.stripeOneTimePriceId ?? null,
        stripeMonthlyPriceId: t.stripeMonthlyPriceId ?? null,
        stripeYearlyPriceId: t.stripeYearlyPriceId ?? null,
        isActive: t.isActive,
        sortOrder: t.sortOrder,
      },
    });
  }
}

async function publishFounderCard() {
  const c = FOUNDER_CARD;
  const existing = await prisma.cardOrder.findUnique({ where: { slug: c.slug } });

  let orderId: string;

  if (existing) {
    await prisma.cardOrder.update({
      where: { slug: c.slug },
      data: {
        cardData: c.cardData,
        contactName: c.contactName,
        contactEmail: c.contactEmail,
        contactPhone: c.contactPhone,
        brandPrimaryHex: c.brandPrimaryHex,
        brandAccentHex: c.brandAccentHex,
        status: "PUBLISHED",
        publishedAt: existing.publishedAt ?? new Date(),
      },
    });
    orderId = existing.id;
    console.log(`[seed] Updated founder card /c/${c.slug}.`);
  } else {
    const created = await prisma.cardOrder.create({
      data: {
        slug: c.slug,
        templateId: c.templateId,
        contactName: c.contactName,
        contactEmail: c.contactEmail,
        contactPhone: c.contactPhone,
        cardData: c.cardData,
        brandPrimaryHex: c.brandPrimaryHex,
        brandAccentHex: c.brandAccentHex,
        billingMode: "ONE_TIME",
        amountCents: 0,
        currency: "EUR",
        locale: "de",
        status: "PUBLISHED",
        publishedAt: new Date(),
        paidAt: new Date(),
      },
    });
    orderId = created.id;
    console.log(`[seed] Published founder card /c/${c.slug}.`);
  }

  // Ensure the main short link exists for the founder card so
  // go.opsolid.de/<slug> works immediately. Idempotent — the unique constraint
  // on `code` plus an empty `update` block means re-running the seed never
  // disturbs an existing link.
  await prisma.cardLink.upsert({
    where: { code: c.slug },
    create: {
      orderId,
      code: c.slug,
      label: "main",
      source: "nfc",
      active: true,
    },
    update: {},
  });
  console.log(`[seed] Ensured short link go.opsolid.de/${c.slug}.`);
}

async function main() {
  await syncTemplates();
  const count = await prisma.cardTemplate.count();
  console.log(`[seed] Synced ${cardTemplates.length} templates; DB now has ${count}.`);

  await publishFounderCard();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
