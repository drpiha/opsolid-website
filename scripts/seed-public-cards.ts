/* eslint-disable no-console */
// =============================================================================
// seed-public-cards.ts — Seed 8 PUBLISHED + visibility=public demo cards for
// famous people so the mobile app's Discover tab (/api/discover/cards) feels
// populated and a new user can immediately see what a fully-fleshed-out card
// looks like.
//
// IMPORTANT — Demo data only. Famous-person likenesses used for visual demo of
// card capabilities; no real contact info is exposed. Emails are routed to a
// fake @example-demo.opsolid.de domain and phones use the +1 555 0XX XXXX
// reserved fictional range. NO photos are seeded (we don't have rights to
// host their images — the public viewer falls back to an initial-letter
// avatar, which is exactly what we want).
//
// Idempotent: upserts by slug, so re-running is safe — existing rows are
// updated in place rather than duplicated.
// =============================================================================

import { prisma } from "../src/lib/prisma";

// -----------------------------------------------------------------------------
// Demo owner — CardOrder.userId is nullable in the schema (Faz 7.0a allows
// "orphan" public cards for legacy editToken-only orders), so we leave userId
// null on the seeded rows. This means they show up as ownerless public cards,
// which is fine: they exist purely to populate Discover, never to be edited.
// -----------------------------------------------------------------------------

interface SeedCard {
  slug: string;
  templateId: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  brandPrimaryHex: string;
  brandAccentHex: string;
  industry: string;
  city: string;
  country: string; // ISO 3166-1 alpha-2
  languages: string[];
  acceptingClients: boolean;
  themeKey: "aurora" | "editorial" | "cinema";
  layoutKey: "stack" | "editorial" | "cinema" | "bento";
  qrPreset:
    | "classic"
    | "rounded"
    | "dots"
    | "diamond"
    | "gradient"
    | "monoNeon"
    | "watercolor"
    | "brandSync";
  cardData: Record<string, unknown>;
}

// 8 famous-person demo cards spanning tech, automotive, philanthropy and
// operations leadership — varied templateIds + sectors so the Discover feed
// looks like a healthy cross-section of professions.
const SEEDS: SeedCard[] = [
  // ---------------------------------------------------------------------------
  // 1. Elon Musk — Tesla / SpaceX. Tesla red, cinema theme, tech sector.
  // ---------------------------------------------------------------------------
  {
    slug: "elon-musk",
    templateId: 16, // Tech Startup
    contactName: "Elon Musk",
    contactEmail: "elon@example-demo.opsolid.de",
    contactPhone: "+1 555 010 1001",
    brandPrimaryHex: "#CC0000",
    brandAccentHex: "#1B1B1B",
    industry: "Technology",
    city: "Austin",
    country: "US",
    languages: ["en"],
    acceptingClients: false,
    themeKey: "cinema",
    layoutKey: "cinema",
    qrPreset: "monoNeon",
    cardData: {
      name: "Elon Musk",
      title: "CEO, Tesla & SpaceX",
      position: "Chief Executive Officer",
      company: "Tesla, Inc. / SpaceX",
      email: "elon@example-demo.opsolid.de",
      phone: "+1 555 010 1001",
      website: "https://www.tesla.com",
      address: "Austin, TX, United States",
      bio: "Engineer-entrepreneur leading the transition to sustainable energy at Tesla and making humanity multi-planetary at SpaceX. Also founded Neuralink (brain-computer interfaces) and The Boring Company (tunneling infrastructure). Known for first-principles thinking, vertical integration, and aggressive timelines.",
      sectorKey: "tech",
      services: [
        {
          title: "Electric vehicles & energy storage",
          description: "Tesla — Model S/3/X/Y, Cybertruck, Powerwall, Megapack.",
        },
        {
          title: "Reusable rockets & Starlink",
          description: "SpaceX — Falcon 9, Falcon Heavy, Starship, global satellite internet.",
        },
        {
          title: "Brain-computer interfaces",
          description: "Neuralink — implantable neural devices for medical applications.",
        },
        {
          title: "Tunneling infrastructure",
          description: "The Boring Company — fast, low-cost transit tunnels.",
        },
      ],
      socials: {
        x: "https://x.com/elonmusk",
        linkedin: "https://www.linkedin.com/in/elonrmusk/",
        instagram: "https://www.instagram.com/elonmusk/",
      },
      customButtons: [
        { label: "Tesla", href: "https://www.tesla.com", style: "primary" },
        { label: "SpaceX", href: "https://www.spacex.com", style: "secondary" },
      ],
      designNotes: "demo:public-card:elon-musk",
    },
  },

  // ---------------------------------------------------------------------------
  // 2. Bill Gates — Gates Foundation. Gates blue, editorial theme, philanthropy.
  // ---------------------------------------------------------------------------
  {
    slug: "bill-gates",
    templateId: 13, // Universal Pro
    contactName: "Bill Gates",
    contactEmail: "bill@example-demo.opsolid.de",
    contactPhone: "+1 555 020 2002",
    brandPrimaryHex: "#0078D4",
    brandAccentHex: "#5C2D91",
    industry: "Philanthropy",
    city: "Seattle",
    country: "US",
    languages: ["en"],
    acceptingClients: false,
    themeKey: "editorial",
    layoutKey: "editorial",
    qrPreset: "rounded",
    cardData: {
      name: "Bill Gates",
      title: "Co-chair, Bill & Melinda Gates Foundation",
      position: "Co-chair & Trustee",
      company: "Bill & Melinda Gates Foundation",
      email: "bill@example-demo.opsolid.de",
      phone: "+1 555 020 2002",
      website: "https://www.gatesfoundation.org",
      address: "Seattle, WA, United States",
      bio: "Co-founder of Microsoft and co-chair of the Bill & Melinda Gates Foundation, the world's largest private charitable foundation. Focused on global health, poverty alleviation, and climate. Also founded Breakthrough Energy to accelerate clean-energy innovation.",
      sectorKey: "consultant",
      services: [
        {
          title: "Global health",
          description: "Eradicating polio, fighting malaria & HIV, strengthening primary care.",
        },
        {
          title: "Climate & clean energy",
          description: "Breakthrough Energy — funding next-generation low-carbon technology.",
        },
        {
          title: "Education & poverty",
          description: "K-12 education in the US and economic mobility worldwide.",
        },
      ],
      socials: {
        linkedin: "https://www.linkedin.com/in/williamhgates/",
        x: "https://x.com/BillGates",
        instagram: "https://www.instagram.com/thisisbillgates/",
      },
      customButtons: [
        { label: "Gates Notes", href: "https://www.gatesnotes.com", style: "primary" },
        { label: "Breakthrough Energy", href: "https://www.breakthroughenergy.org", style: "secondary" },
      ],
      designNotes: "demo:public-card:bill-gates",
    },
  },

  // ---------------------------------------------------------------------------
  // 3. Tim Cook — Apple. Apple gray/silver, pure aesthetic.
  // ---------------------------------------------------------------------------
  {
    slug: "tim-cook",
    templateId: 35, // Software Dev — Pure
    contactName: "Tim Cook",
    contactEmail: "tim@example-demo.opsolid.de",
    contactPhone: "+1 555 030 3003",
    brandPrimaryHex: "#1D1D1F",
    brandAccentHex: "#A1A1A6",
    industry: "Technology",
    city: "Cupertino",
    country: "US",
    languages: ["en"],
    acceptingClients: false,
    themeKey: "editorial",
    layoutKey: "editorial",
    qrPreset: "classic",
    cardData: {
      name: "Tim Cook",
      title: "CEO, Apple Inc.",
      position: "Chief Executive Officer",
      company: "Apple Inc.",
      email: "tim@example-demo.opsolid.de",
      phone: "+1 555 030 3003",
      website: "https://www.apple.com",
      address: "One Apple Park Way, Cupertino, CA, United States",
      bio: "Chief Executive Officer of Apple since 2011, leading the company through a period of unprecedented product expansion — Apple Watch, AirPods, Apple Silicon, Vision Pro — while pushing privacy as a fundamental human right and committing the supply chain to carbon neutrality.",
      sectorKey: "tech",
      services: [
        {
          title: "Operations excellence",
          description: "World-class supply chain and just-in-time manufacturing.",
        },
        {
          title: "Privacy by design",
          description: "On-device intelligence, end-to-end encryption, App Tracking Transparency.",
        },
        {
          title: "Environmental commitment",
          description: "Carbon neutral by 2030 across the entire Apple value chain.",
        },
      ],
      socials: {
        x: "https://x.com/tim_cook",
        linkedin: "https://www.linkedin.com/in/tim-cook-46b0a258/",
      },
      customButtons: [
        { label: "Apple", href: "https://www.apple.com", style: "primary" },
        { label: "Apple Newsroom", href: "https://www.apple.com/newsroom/", style: "secondary" },
      ],
      designNotes: "demo:public-card:tim-cook",
    },
  },

  // ---------------------------------------------------------------------------
  // 4. Satya Nadella — Microsoft. Microsoft blue, aurora theme, tech leadership.
  // ---------------------------------------------------------------------------
  {
    slug: "satya-nadella",
    templateId: 16, // Tech Startup
    contactName: "Satya Nadella",
    contactEmail: "satya@example-demo.opsolid.de",
    contactPhone: "+1 555 040 4004",
    brandPrimaryHex: "#0078D4",
    brandAccentHex: "#00A4EF",
    industry: "Technology",
    city: "Redmond",
    country: "US",
    languages: ["en"],
    acceptingClients: false,
    themeKey: "aurora",
    layoutKey: "bento",
    qrPreset: "gradient",
    cardData: {
      name: "Satya Nadella",
      title: "Chairman & CEO, Microsoft",
      position: "Chairman and Chief Executive Officer",
      company: "Microsoft",
      email: "satya@example-demo.opsolid.de",
      phone: "+1 555 040 4004",
      website: "https://www.microsoft.com",
      address: "One Microsoft Way, Redmond, WA, United States",
      bio: "Chairman and CEO of Microsoft. Author of Hit Refresh. Steered Microsoft's transformation into a cloud-and-AI company built around Azure, Microsoft 365, and the Copilot family. Believes the purpose of technology is to empower every person and every organization on the planet to achieve more.",
      sectorKey: "tech",
      services: [
        {
          title: "Cloud platform",
          description: "Microsoft Azure — global cloud, AI infrastructure, hybrid edge.",
        },
        {
          title: "AI Copilots",
          description: "Microsoft Copilot across Windows, 365, GitHub, Dynamics, and Security.",
        },
        {
          title: "Productivity & collaboration",
          description: "Microsoft 365, Teams, LinkedIn — work, hire, learn, connect.",
        },
        {
          title: "Gaming",
          description: "Xbox, Game Pass, Activision Blizzard — play across screens.",
        },
      ],
      socials: {
        linkedin: "https://www.linkedin.com/in/satyanadella/",
        x: "https://x.com/satyanadella",
      },
      customButtons: [
        { label: "Microsoft", href: "https://www.microsoft.com", style: "primary" },
        { label: "Hit Refresh", href: "https://news.microsoft.com/hitrefresh/", style: "secondary" },
      ],
      designNotes: "demo:public-card:satya-nadella",
    },
  },

  // ---------------------------------------------------------------------------
  // 5. Sundar Pichai — Alphabet/Google. Google multi-color, aurora.
  // ---------------------------------------------------------------------------
  {
    slug: "sundar-pichai",
    templateId: 16, // Tech Startup
    contactName: "Sundar Pichai",
    contactEmail: "sundar@example-demo.opsolid.de",
    contactPhone: "+1 555 050 5005",
    brandPrimaryHex: "#4285F4",
    brandAccentHex: "#EA4335",
    industry: "Technology",
    city: "Mountain View",
    country: "US",
    languages: ["en"],
    acceptingClients: false,
    themeKey: "aurora",
    layoutKey: "bento",
    qrPreset: "dots",
    cardData: {
      name: "Sundar Pichai",
      title: "CEO, Alphabet & Google",
      position: "Chief Executive Officer",
      company: "Alphabet Inc. / Google",
      email: "sundar@example-demo.opsolid.de",
      phone: "+1 555 050 5005",
      website: "https://about.google",
      address: "1600 Amphitheatre Parkway, Mountain View, CA, United States",
      bio: "Chief Executive Officer of Alphabet and Google, leading the company's AI-first strategy across Search, YouTube, Cloud, Android, and the Gemini family of models. Joined Google in 2004 and previously led product for Chrome, Android, and Google Apps.",
      sectorKey: "tech",
      services: [
        {
          title: "Search & information",
          description: "Google Search, Maps, News — organising the world's information.",
        },
        {
          title: "AI & Gemini",
          description: "Gemini models, Google DeepMind research, AI-first products.",
        },
        {
          title: "Cloud",
          description: "Google Cloud Platform & Workspace for businesses worldwide.",
        },
        {
          title: "Android & devices",
          description: "Android, Pixel, Chromebook, Nest — billions of users.",
        },
      ],
      socials: {
        linkedin: "https://www.linkedin.com/in/sundarpichai/",
        x: "https://x.com/sundarpichai",
      },
      customButtons: [
        { label: "About Google", href: "https://about.google", style: "primary" },
        { label: "Google AI", href: "https://ai.google", style: "secondary" },
      ],
      designNotes: "demo:public-card:sundar-pichai",
    },
  },

  // ---------------------------------------------------------------------------
  // 6. Jensen Huang — NVIDIA. NVIDIA green, vivid theme, AI/GPU.
  // ---------------------------------------------------------------------------
  {
    slug: "jensen-huang",
    templateId: 36, // Software Dev — Vivid
    contactName: "Jensen Huang",
    contactEmail: "jensen@example-demo.opsolid.de",
    contactPhone: "+1 555 060 6006",
    brandPrimaryHex: "#76B900",
    brandAccentHex: "#1A1A1A",
    industry: "Semiconductors",
    city: "Santa Clara",
    country: "US",
    languages: ["en"],
    acceptingClients: false,
    themeKey: "cinema",
    layoutKey: "cinema",
    qrPreset: "diamond",
    cardData: {
      name: "Jensen Huang",
      title: "Founder & CEO, NVIDIA",
      position: "Founder, President & CEO",
      company: "NVIDIA Corporation",
      email: "jensen@example-demo.opsolid.de",
      phone: "+1 555 060 6006",
      website: "https://www.nvidia.com",
      address: "2788 San Tomas Expy, Santa Clara, CA, United States",
      bio: "Founder, president and CEO of NVIDIA, which he co-founded in 1993. Pioneered accelerated computing and the GPU, the engine powering modern AI. Known for the leather jacket, long-form keynotes, and the operating principle: 'Run, don't walk.'",
      sectorKey: "tech",
      services: [
        {
          title: "Data center & AI",
          description: "Hopper, Blackwell, Grace — GPUs and superchips for the AI era.",
        },
        {
          title: "CUDA & developer platform",
          description: "CUDA, cuDNN, TensorRT — the software stack for GPU acceleration.",
        },
        {
          title: "Robotics & automotive",
          description: "Isaac, DRIVE, Omniverse — physical AI and digital twins.",
        },
        {
          title: "Gaming & creators",
          description: "GeForce RTX, DLSS — real-time ray tracing and AI graphics.",
        },
      ],
      socials: {
        linkedin: "https://www.linkedin.com/in/jenhsunhuang/",
        x: "https://x.com/nvidia",
      },
      customButtons: [
        { label: "NVIDIA", href: "https://www.nvidia.com", style: "primary" },
        { label: "NVIDIA Blog", href: "https://blogs.nvidia.com", style: "secondary" },
      ],
      designNotes: "demo:public-card:jensen-huang",
    },
  },

  // ---------------------------------------------------------------------------
  // 7. Sheryl Sandberg — Lean In Foundation, ex-COO Meta. Lean In red, editorial.
  // ---------------------------------------------------------------------------
  {
    slug: "sheryl-sandberg",
    templateId: 13, // Universal Pro
    contactName: "Sheryl Sandberg",
    contactEmail: "sheryl@example-demo.opsolid.de",
    contactPhone: "+1 555 070 7007",
    brandPrimaryHex: "#E91E63",
    brandAccentHex: "#1F1F1F",
    industry: "Author & Advocacy",
    city: "Menlo Park",
    country: "US",
    languages: ["en"],
    acceptingClients: true,
    themeKey: "editorial",
    layoutKey: "editorial",
    qrPreset: "rounded",
    cardData: {
      name: "Sheryl Sandberg",
      title: "Founder, LeanIn.Org & OptionB.Org",
      position: "Founder & Author",
      company: "Lean In Foundation",
      email: "sheryl@example-demo.opsolid.de",
      phone: "+1 555 070 7007",
      website: "https://leanin.org",
      address: "Menlo Park, CA, United States",
      bio: "Founder of LeanIn.Org and OptionB.Org and former Chief Operating Officer of Meta. Author of three #1 New York Times bestsellers — Lean In, Option B, and Lean In for Graduates — focused on women's leadership, resilience after adversity, and workplace equality.",
      sectorKey: "consultant",
      services: [
        {
          title: "Lean In Circles",
          description: "Small peer groups for women to learn and grow together — 50,000+ worldwide.",
        },
        {
          title: "Option B community",
          description: "Resources for building resilience and finding meaning after life's hardest moments.",
        },
        {
          title: "Public speaking",
          description: "Keynotes on leadership, equality, grief and resilience.",
        },
      ],
      socials: {
        linkedin: "https://www.linkedin.com/in/sheryl-sandberg-5126652/",
        facebook: "https://www.facebook.com/sheryl",
        instagram: "https://www.instagram.com/sherylsandberg/",
      },
      customButtons: [
        { label: "Lean In", href: "https://leanin.org", style: "primary" },
        { label: "Option B", href: "https://optionb.org", style: "secondary" },
      ],
      designNotes: "demo:public-card:sheryl-sandberg",
    },
  },

  // ---------------------------------------------------------------------------
  // 8. Steve Jobs — historical demo card. Apple monochrome, cinema layout.
  // (Estate not officially associated; included as a visual archetype only.)
  // ---------------------------------------------------------------------------
  {
    slug: "steve-jobs",
    templateId: 92, // Noir Luxury
    contactName: "Steve Jobs",
    contactEmail: "steve@example-demo.opsolid.de",
    contactPhone: "+1 555 080 8008",
    brandPrimaryHex: "#000000",
    brandAccentHex: "#999999",
    industry: "Technology",
    city: "Cupertino",
    country: "US",
    languages: ["en"],
    acceptingClients: false,
    themeKey: "cinema",
    layoutKey: "cinema",
    qrPreset: "classic",
    cardData: {
      name: "Steve Jobs",
      title: "Co-founder, Apple & Pixar",
      position: "Co-founder",
      company: "Apple Inc. / Pixar Animation Studios",
      email: "steve@example-demo.opsolid.de",
      phone: "+1 555 080 8008",
      website: "https://www.apple.com",
      address: "Cupertino, CA, United States",
      bio: "Co-founder of Apple and Pixar. Champion of the intersection of technology and the liberal arts. Brought to market the Apple II, Macintosh, iMac, iPod, iPhone, iPad, and the App Store — products that redefined personal computing, music, phones, and tablets.",
      sectorKey: "tech",
      services: [
        {
          title: "Personal computing",
          description: "Apple II, Macintosh — the computer for the rest of us.",
        },
        {
          title: "Mobile revolution",
          description: "iPod, iPhone, iPad, App Store — a thousand songs in your pocket.",
        },
        {
          title: "Storytelling at Pixar",
          description: "Toy Story, Finding Nemo, The Incredibles — computer animation as art form.",
        },
      ],
      socials: {
        x: "https://x.com/apple",
      },
      customButtons: [
        { label: "Apple", href: "https://www.apple.com", style: "primary" },
        { label: "Stanford Commencement (2005)", href: "https://news.stanford.edu/2005/06/14/jobs-061505/", style: "secondary" },
      ],
      designNotes: "demo:public-card:steve-jobs",
    },
  },
];

async function main() {
  console.log(`Seeding ${SEEDS.length} public demo cards...\n`);

  const results: Array<{ slug: string; action: "created" | "updated"; id: string }> = [];

  for (const seed of SEEDS) {
    const qrStyle = {
      preset: seed.qrPreset,
      primary: seed.brandPrimaryHex,
      accent: seed.brandAccentHex,
      withLogo: false,
      withPhoto: false,
    };

    // Common fields written on both create + update so re-runs converge
    // every row to the canonical seeded shape (in case the schema or copy
    // evolves between runs).
    const commonData = {
      templateId: seed.templateId,
      contactName: seed.contactName,
      contactEmail: seed.contactEmail,
      contactPhone: seed.contactPhone,
      callMeBack: false,
      cardData: seed.cardData as object,
      brandPrimaryHex: seed.brandPrimaryHex,
      brandAccentHex: seed.brandAccentHex,
      // photoPath/logoPath intentionally NULL — we don't have rights to host
      // these public figures' images. The card viewer falls back to the
      // initial-letter avatar, which is perfect for a demo.
      photoPath: null,
      logoPath: null,
      qrStyle: qrStyle as object,
      videoUrl: null,
      conciergeAddon: false,
      layoutKey: seed.layoutKey,
      themeKey: seed.themeKey,
      billingMode: "FREE",
      amountCents: 0,
      currency: "EUR",
      locale: "en",
      status: "PUBLISHED",
      visibility: "public",
      openToNetworking: true,
      acceptingClients: seed.acceptingClients,
      industry: seed.industry,
      city: seed.city,
      country: seed.country,
      languages: seed.languages,
      feedbackEnabled: false,
      paidAt: new Date(),
      publishedAt: new Date(),
      // userId left null — orphan public card (schema allows; CardOrder.userId
      // is `String?` with onDelete: SetNull). No demo user needed.
    };

    const existing = await prisma.cardOrder.findUnique({
      where: { slug: seed.slug },
      select: { id: true },
    });

    if (existing) {
      const updated = await prisma.cardOrder.update({
        where: { slug: seed.slug },
        data: commonData,
        select: { id: true, slug: true },
      });
      results.push({ slug: updated.slug ?? seed.slug, action: "updated", id: updated.id });
      console.log(`  [updated] ${seed.slug.padEnd(20)} (id=${updated.id})`);
    } else {
      const created = await prisma.cardOrder.create({
        data: {
          slug: seed.slug,
          ...commonData,
        },
        select: { id: true, slug: true },
      });
      results.push({ slug: created.slug ?? seed.slug, action: "created", id: created.id });
      console.log(`  [created] ${seed.slug.padEnd(20)} (id=${created.id})`);
    }
  }

  const createdCount = results.filter((r) => r.action === "created").length;
  const updatedCount = results.filter((r) => r.action === "updated").length;

  console.log(`\nDone. ${createdCount} created, ${updatedCount} updated, ${results.length} total.`);
  console.log(`\nSlugs (visit at https://opsolid.de/c/<slug>):`);
  for (const r of results) {
    console.log(`  - ${r.slug}`);
  }
  console.log(
    `\nVerify via Discover API: GET https://opsolid.de/api/discover/cards?country=US`
  );
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
// # Local (only if your DATABASE_URL points to production — usually it does
// # NOT, so prefer the SSH path below):
// npx tsx scripts/seed-public-cards.ts
//
// # On VPS via SSH (recommended — avoid leaking prod creds locally):
// ssh root@72.62.0.111 "cd /opt/opsolid-website && docker exec opsolid-app npx tsx scripts/seed-public-cards.ts"
//
// =============================================================================
