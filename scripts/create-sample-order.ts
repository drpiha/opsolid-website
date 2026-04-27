/* eslint-disable no-console */
// =============================================================================
// One-shot sample card creator. Use to seed real-feeling demo cards without
// going through Stripe checkout.
//
// Usage:
//   npx tsx scripts/create-sample-order.ts asya-konak
//   npx tsx scripts/create-sample-order.ts asya-konak --publish
//
// Without --publish: leaves the order in PAID status. Operator can then visit
// /admin/orders/<id> and click "Publish".
// With --publish:   sets status=PUBLISHED, generates a unique slug, and
// prints the public URL + edit URL.
//
// Idempotency: re-running for the same SAMPLE_KEY is detected by
// `sampleSlug` in `cardData.designNotes` — the script aborts so it doesn't
// duplicate orders. Pass --force to override.
// =============================================================================

import crypto from "node:crypto";
import { prisma } from "../src/lib/prisma";
import { ensureUniqueSlug } from "../src/lib/slug";

type CardDataBlob = Record<string, unknown>;

interface SampleSpec {
  key: string;
  templateId: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  brandPrimaryHex: string;
  brandAccentHex: string;
  locale: "de" | "en" | "tr";
  cardData: CardDataBlob;
}

const SAMPLES: Record<string, SampleSpec> = {
  // -----------------------------------------------------------------------------
  // Asya Konak — Boutique Hotel (templateId=15). Personal demo for the OpSolid
  // founder's family property. Hospitality tone, warm copper/cream palette.
  // -----------------------------------------------------------------------------
  "asya-konak": {
    key: "asya-konak",
    templateId: 15,
    contactName: "Neslihan Dönmez",
    contactEmail: "drhasanhd@gmail.com",
    contactPhone: "+90 555 000 0000",
    brandPrimaryHex: "#1F2530",
    brandAccentHex: "#C8A961",
    locale: "tr",
    cardData: {
      name: "Neslihan Dönmez",
      title: "Asya Konak — Konukevi Sahibi",
      position: "Konukevi Sahibi",
      company: "Asya Konak",
      email: "info@asyakonak.com.tr",
      phone: "+90 555 000 0000",
      whatsapp: "+90 555 000 0000",
      website: "https://asyakonak.com.tr",
      address: "Asya Konak, Türkiye",
      bio: "Asya Konak'ta misafirlerimizi sıcak Türk konukseverliği ile karşılıyoruz. Sessiz odalar, sade bir avlu ve ev yapımı kahvaltı.",
      sectorKey: "hospitality",
      services: [
        {
          title: "Standart Oda",
          description:
            "Ahşap döşeme, pamuklu nevresimler, sade banyo. Çift veya tek kişilik.",
          priceLabel: "kahvaltı dahil",
        },
        {
          title: "Avlu Manzaralı Suit",
          description:
            "Geniş yatak, küçük oturma köşesi, avlu balkonu. Çift kişilik.",
          priceLabel: "kahvaltı dahil",
        },
        {
          title: "Aile Süiti",
          description: "İki yatak odası, ortak salon. Aileler için.",
          priceLabel: "kahvaltı dahil",
        },
      ],
      testimonials: [
        {
          author: "Ayşe & Mehmet",
          role: "Köln'den misafirler",
          quote:
            "Eve dönmüş gibi hissettik. Kahvaltı sade ama özenli, oda sessizdi. Tekrar geleceğiz.",
        },
        {
          author: "Lisa",
          role: "Berlin'den misafir",
          quote:
            "Türkiye'de bulduğum en huzurlu konaklamalardan biri. Neslihan Hanım her detayı düşünmüş.",
        },
      ],
      socials: {
        instagram: "https://www.instagram.com/asyakonak/",
      },
      designNotes: "sample:asya-konak",
    },
  },
};

const FORCE = process.argv.includes("--force");
const PUBLISH = process.argv.includes("--publish");
const sampleKey = process.argv[2];

async function main() {
  if (!sampleKey || !SAMPLES[sampleKey]) {
    console.error(
      `Usage: npx tsx scripts/create-sample-order.ts <sample-key> [--publish] [--force]`
    );
    console.error(`Available: ${Object.keys(SAMPLES).join(", ")}`);
    process.exitCode = 1;
    return;
  }

  const spec = SAMPLES[sampleKey];
  const sampleMarker = `sample:${spec.key}`;

  // Idempotency check.
  if (!FORCE) {
    const existing = await prisma.cardOrder.findFirst({
      where: {
        contactEmail: spec.contactEmail,
        cardData: {
          path: ["designNotes"],
          equals: sampleMarker,
        },
      },
      select: {
        id: true,
        slug: true,
        status: true,
        editToken: true,
      },
    });
    if (existing) {
      console.log(`Sample "${spec.key}" already exists — skipping create.`);
      console.log(`  orderId=${existing.id}`);
      console.log(`  status=${existing.status}`);
      if (existing.slug) console.log(`  publicUrl=https://opsolid.de/c/${existing.slug}`);
      if (existing.editToken)
        console.log(
          `  editUrl=https://opsolid.de/de/card/edit/${existing.id}?t=${existing.editToken}`
        );
      console.log(`  (pass --force to create a duplicate)`);
      return;
    }
  }

  const editToken = crypto.randomUUID();
  const slug = PUBLISH ? await ensureUniqueSlug(spec.contactName) : null;

  const created = await prisma.cardOrder.create({
    data: {
      templateId: spec.templateId,
      contactName: spec.contactName,
      contactEmail: spec.contactEmail,
      contactPhone: spec.contactPhone,
      cardData: spec.cardData as object,
      brandPrimaryHex: spec.brandPrimaryHex,
      brandAccentHex: spec.brandAccentHex,
      billingMode: "YEARLY",
      amountCents: 0, // Demo — no charge.
      currency: "EUR",
      locale: spec.locale,
      status: PUBLISH ? "PUBLISHED" : "PAID",
      slug,
      editToken,
      paidAt: new Date(),
      publishedAt: PUBLISH ? new Date() : null,
    },
    select: {
      id: true,
      slug: true,
      status: true,
      editToken: true,
    },
  });

  console.log(`Sample "${spec.key}" created.`);
  console.log(`  orderId=${created.id}`);
  console.log(`  status=${created.status}`);
  if (created.slug) {
    console.log(`  publicUrl=https://opsolid.de/c/${created.slug}`);
  } else {
    console.log(`  publicUrl=(not published; run with --publish)`);
  }
  console.log(
    `  editUrl=https://opsolid.de/${spec.locale}/card/edit/${created.id}?t=${created.editToken}`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
