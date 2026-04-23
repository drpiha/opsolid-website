// =============================================================================
// Prisma seed — syncs the CardTemplate table with src/config/card-templates.ts
// Run with: npx prisma db seed  (requires DATABASE_URL set)
// =============================================================================

import { PrismaClient } from "../src/generated/prisma";
import { cardTemplates } from "../src/config/card-templates";

const prisma = new PrismaClient();

async function main() {
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
  const count = await prisma.cardTemplate.count();
  console.log(`[seed] Synced ${cardTemplates.length} templates; DB now has ${count}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
