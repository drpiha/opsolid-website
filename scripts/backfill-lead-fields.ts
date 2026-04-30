#!/usr/bin/env tsx
// scripts/backfill-lead-fields.ts
// Backfills CardLead.interest, meetingContext, company from the old
// concatenated message format used in Phase 1-5.
//
// Run with: DATABASE_URL=... npx tsx scripts/backfill-lead-fields.ts
// Add --apply to actually write (default is dry-run).

import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();
const DRY_RUN = !process.argv.includes("--apply");

function parseField(message: string, prefix: string): string | null {
  const line = message.split("\n").find((l) => l.startsWith(prefix));
  return line ? line.slice(prefix.length).trim() || null : null;
}

async function main() {
  console.log(DRY_RUN ? "[DRY RUN] " : "[APPLY] ", "Backfilling CardLead fields...");

  const leads = await prisma.cardLead.findMany({
    where: {
      message: { not: null },
      AND: [
        { interest: null },
        { meetingContext: null },
        { company: null },
      ],
    },
    select: { id: true, message: true },
  });

  console.log(`Found ${leads.length} leads to backfill`);

  let updated = 0;
  for (const lead of leads) {
    if (!lead.message) continue;

    const interest = parseField(lead.message, "Interesse: ");
    const meetingContext = parseField(lead.message, "Kontext: ");
    const company = parseField(lead.message, "Unternehmen: ");

    if (!interest && !meetingContext && !company) continue;

    console.log(`Lead ${lead.id}: interest=${interest}, context=${meetingContext}, company=${company}`);

    if (!DRY_RUN) {
      await prisma.cardLead.update({
        where: { id: lead.id },
        data: {
          ...(interest && { interest }),
          ...(meetingContext && { meetingContext }),
          ...(company && { company }),
        },
      });
    }
    updated++;
  }

  console.log(`\n${DRY_RUN ? "Would update" : "Updated"} ${updated} leads`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
