/* eslint-disable no-console */
// =============================================================================
// seed-templates.ts — Sync the full 96-template catalog from
// `src/config/card-templates.ts` into the `card_templates` table.
//
// Why: prod DB only had ids 1..20 seeded; seed-public-cards.ts and the mobile
// template picker reference ids up to 96. Without this, FK constraints fail
// (P2003) and the picker thumbnails point at orphan ids.
//
// Idempotent: upserts on `id`. Re-running updates existing rows in place.
// Imports the generated Prisma client directly (no src/lib reliance) so it
// runs from both local dev and the production container.
// =============================================================================

import { PrismaClient } from "../src/generated/prisma";
import { cardTemplates } from "../src/config/card-templates";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

async function main() {
  console.log(`Seeding ${cardTemplates.length} templates...`);
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const tpl of cardTemplates) {
    // Look up by both id and slug. If a row with our slug already exists at
    // a DIFFERENT id, the older DB seed assigned that slug to a different
    // template — skip rather than steal it (would break orphan cards already
    // pointing at the original id).
    const [byId, bySlug] = await Promise.all([
      prisma.cardTemplate.findUnique({ where: { id: tpl.id }, select: { id: true } }),
      prisma.cardTemplate.findUnique({ where: { slug: tpl.slug }, select: { id: true } }),
    ]);

    if (bySlug && bySlug.id !== tpl.id) {
      console.log(`  [skip] slug "${tpl.slug}" already at id ${bySlug.id}, can't claim for id ${tpl.id}`);
      skipped++;
      continue;
    }

    const data = {
      slug: tpl.slug,
      name: tpl.name,
      sectorHint: tpl.sectorHint,
      componentKey: tpl.componentKey,
      previewPath: tpl.previewPath,
      oneTimeCents: tpl.oneTimeCents,
      monthlyCents: tpl.monthlyCents ?? null,
      yearlyCents: tpl.yearlyCents ?? null,
      stripeOneTimePriceId: tpl.stripeOneTimePriceId ?? null,
      stripeMonthlyPriceId: tpl.stripeMonthlyPriceId ?? null,
      stripeYearlyPriceId: tpl.stripeYearlyPriceId ?? null,
      isActive: tpl.isActive,
      sortOrder: tpl.sortOrder,
    };

    await prisma.cardTemplate.upsert({
      where: { id: tpl.id },
      update: data,
      create: { id: tpl.id, ...data },
    });

    if (byId) updated++;
    else created++;
  }

  console.log(`\nDone. Created ${created}, updated ${updated}, skipped ${skipped}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
