/* eslint-disable no-console */
// =============================================================================
// seed-events.ts — Sprint F2 — Seed 4 fictional events / fairs and pre-attach
// 3-4 of the seeded demo public cards (see scripts/seed-public-cards.ts) to
// each so the Discover rail and Events tab look populated immediately.
//
// Idempotent: upserts events by slug, then re-syncs the attendance list
// (delete-then-insert) so attendee changes in this file converge on every run.
//
// Import the generated client directly so the script runs from BOTH the local
// dev tree AND the production container, same pattern as seed-public-cards.ts.
// =============================================================================

import { PrismaClient } from "../src/generated/prisma";
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

interface SeedEvent {
  slug: string;
  name: string;
  city: string;
  country: string;
  venue?: string;
  // Days in the future (relative to script run time) for startAt.
  startInDays: number;
  // Duration in days. Most fairs run 2-3 days.
  durationDays: number;
  description: string;
  /** Card slugs to attach as attendees. Resolved to ids at run time. */
  attendeeSlugs: string[];
}

const SEEDS: SeedEvent[] = [
  {
    slug: "dmexco-2026",
    name: "DMEXCO 2026",
    city: "Köln",
    country: "DE",
    venue: "Koelnmesse Hall 6-8",
    startInDays: 30,
    durationDays: 2,
    description:
      "Europe's leading digital marketing & tech conference. Two days of stage talks, expo halls, and after-hours networking across the Cologne fairgrounds.",
    attendeeSlugs: ["elon-musk", "sheryl-sandberg", "christine-mueller", "tobias-bauer"],
  },
  {
    slug: "bits-pretzels-2026",
    name: "Bits & Pretzels",
    city: "München",
    country: "DE",
    venue: "ICM — Internationales Congress Center München",
    startInDays: 60,
    durationDays: 3,
    description:
      "Founder festival in Munich during Oktoberfest. Three days of speakers, table captains, founder breakfasts, and the legendary closing day at the Schottenhamel tent.",
    attendeeSlugs: ["bill-gates", "sundar-pichai", "jana-vogel", "florian-reiter"],
  },
  {
    slug: "webrazzi-zirve-2026",
    name: "Webrazzi Zirvesi",
    city: "Istanbul",
    country: "TR",
    venue: "Haliç Kongre Merkezi",
    startInDays: 45,
    durationDays: 1,
    description:
      "Türkiye'nin en büyük dijital ve girişimcilik konferansı. Bir gün boyunca Türk teknoloji ekosisteminin liderleri, yatırımcılar ve marka ekipleri Haliç'te buluşuyor.",
    attendeeSlugs: ["aylin-yildiz", "mehmet-aydin", "sara-lindqvist"],
  },
  {
    slug: "ihm-2026",
    name: "IHM München",
    city: "München",
    country: "DE",
    venue: "Messe München",
    startInDays: 90,
    durationDays: 4,
    description:
      "Internationale Handwerksmesse — die Leitmesse für das Handwerk in Europa. Vier Tage Hallen, Sonderschauen und Live-Demos rund um Bau, Holz, Metall und Gestaltung.",
    attendeeSlugs: ["markus-schmidt", "mehmet-aydin", "christine-mueller"],
  },
];

function addDays(d: Date, days: number): Date {
  const out = new Date(d);
  out.setUTCDate(out.getUTCDate() + days);
  return out;
}

async function main() {
  console.log(`Seeding ${SEEDS.length} demo events...\n`);
  const now = new Date();

  for (const seed of SEEDS) {
    const startAt = addDays(now, seed.startInDays);
    const endAt = addDays(startAt, seed.durationDays);

    // Resolve attendee card slugs → ids. Skip silently if a slug isn't in the
    // DB yet (the public-card seed may not have run, or a slug was renamed).
    const cards = await prisma.cardOrder.findMany({
      where: { slug: { in: seed.attendeeSlugs } },
      select: { id: true, slug: true },
    });
    const foundSlugs = cards.map((c) => c.slug ?? "");
    const missingSlugs = seed.attendeeSlugs.filter((s) => !foundSlugs.includes(s));

    const upserted = await prisma.event.upsert({
      where: { slug: seed.slug },
      create: {
        slug: seed.slug,
        name: seed.name,
        city: seed.city,
        country: seed.country,
        venue: seed.venue,
        startAt,
        endAt,
        description: seed.description,
        coverPath: null,
        isActive: true,
      },
      update: {
        name: seed.name,
        city: seed.city,
        country: seed.country,
        venue: seed.venue,
        startAt,
        endAt,
        description: seed.description,
        isActive: true,
      },
      select: { id: true, slug: true },
    });

    // Replace the attendance set so re-runs converge on the seeded list.
    await prisma.$transaction(async (tx) => {
      await tx.eventAttendee.deleteMany({ where: { eventId: upserted.id } });
      if (cards.length > 0) {
        await tx.eventAttendee.createMany({
          data: cards.map((c) => ({ eventId: upserted.id, cardId: c.id })),
          skipDuplicates: true,
        });
      }
    });

    console.log(
      `  [ok] ${seed.slug.padEnd(22)} (id=${upserted.id}, ${cards.length} attendees${
        missingSlugs.length > 0 ? `, missing: ${missingSlugs.join(",")}` : ""
      })`,
    );
  }

  console.log(`\nDone. ${SEEDS.length} events seeded.`);
  console.log(`\nVerify via: GET https://opsolid.de/api/v1/events`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

// =============================================================================
// HOW TO RUN
// =============================================================================
//
// # Local against prod (rare — usually do this on the VPS):
// npx tsx scripts/seed-events.ts
//
// # On VPS via SSH (recommended):
// ssh root@72.62.0.111 "cd /opt/opsolid-website && \
//   docker exec opsolid-app npx tsx scripts/seed-events.ts"
//
// Pre-req: scripts/seed-public-cards.ts must have been run, otherwise the
// attendee slugs won't resolve and events end up empty (the script logs the
// missing slugs but does not error out).
// =============================================================================
