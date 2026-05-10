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

// Import the generated client directly so the script runs from BOTH the local
// dev tree (full src/) AND the production container (which only ships
// src/generated/, not src/lib/). Without this, `docker exec npx tsx
// scripts/seed-public-cards.ts` fails with `Cannot find module '../src/lib/prisma'`.
import { PrismaClient } from "../src/generated/prisma";
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

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
  // DACH/EU SME personas (Sprint F1) — fair-attendee archetype Hasan described.
  // These complement the 8 famous-name cards above with cards that look like a
  // real customer's first 30 seconds in the Discover tab. Same idempotent
  // upsert path; emails use @example-demo.opsolid.de, phones are reserved
  // fictional numbers (DE +49 30 / AT +43 1 / TR +90 850 ranges with 555/000
  // local prefixes that won't ring a real subscriber).
  // ---------------------------------------------------------------------------

  // 9. Christine Müller — family-run Stuttgart carpentry, hospitality fittings.
  {
    slug: "christine-mueller",
    templateId: 8, // Maker — warm wood/atelier feel
    contactName: "Christine Müller",
    contactEmail: "christine@example-demo.opsolid.de",
    contactPhone: "+49 30 555 1101",
    brandPrimaryHex: "#7A4A2B",
    brandAccentHex: "#1F1A14",
    industry: "Hospitality fittings",
    city: "Stuttgart",
    country: "DE",
    languages: ["de", "en"],
    acceptingClients: true,
    themeKey: "editorial",
    layoutKey: "editorial",
    qrPreset: "rounded",
    cardData: {
      name: "Christine Müller",
      title: "CEO, Müller Schreinerei",
      position: "Geschäftsführerin",
      company: "Müller Schreinerei GmbH",
      email: "christine@example-demo.opsolid.de",
      phone: "+49 30 555 1101",
      website: "https://example-demo.opsolid.de/mueller-schreinerei",
      address: "Königstraße 22, 70173 Stuttgart, Deutschland",
      bio: "Familienbetrieb in dritter Generation. Wir entwerfen und bauen Festeinbauten für Hotels, Restaurants und Boutiquen — vom ersten Skizzenblatt bis zur fertigen Montage vor Ort. Spezialgebiet: massive Eiche, geräucherte Esche und furnierte Sonderlösungen.",
      sectorKey: "construction",
      services: [
        {
          title: "Hotelzimmer-Vollausstattung",
          description: "Schrankwand, Bett, Schreibtisch — als Set, einbaufertig geliefert.",
        },
        {
          title: "Restaurant-Einrichtung",
          description: "Theken, Wandvertäfelungen und Sitzbänke aus Massivholz.",
        },
        {
          title: "Boutique- & Showroom-Bau",
          description: "Vitrinen, Präsentationsflächen, Kassenmöbel mit individuellem Finish.",
        },
        {
          title: "Reparatur & Restaurierung",
          description: "Aufarbeitung historischer Stücke und Hotel-Bestandsmöbel.",
        },
      ],
      socials: {
        linkedin: "https://example-demo.opsolid.de/in/christine-mueller",
        instagram: "https://example-demo.opsolid.de/mueller_schreinerei",
      },
      customButtons: [
        { label: "Portfolio", href: "https://example-demo.opsolid.de/mueller-schreinerei/portfolio", style: "primary" },
        { label: "Werkstatt-Termin", href: "https://example-demo.opsolid.de/mueller-schreinerei/termin", style: "secondary" },
      ],
      designNotes: "demo:public-card:christine-mueller",
    },
  },

  // 10. Tobias Bauer — industrial design studio Hamburg.
  {
    slug: "tobias-bauer",
    templateId: 84, // Architect — Noir, dark industrial editorial
    contactName: "Tobias Bauer",
    contactEmail: "tobias@example-demo.opsolid.de",
    contactPhone: "+49 30 555 1102",
    brandPrimaryHex: "#1B1B1B",
    brandAccentHex: "#C8A24B",
    industry: "Industrial design",
    city: "Hamburg",
    country: "DE",
    languages: ["de", "en"],
    acceptingClients: true,
    themeKey: "editorial",
    layoutKey: "editorial",
    qrPreset: "monoNeon",
    cardData: {
      name: "Tobias Bauer",
      title: "Founder, Bauer Werk",
      position: "Founder & Lead Designer",
      company: "Bauer Werk Industriedesign",
      email: "tobias@example-demo.opsolid.de",
      phone: "+49 30 555 1102",
      website: "https://example-demo.opsolid.de/bauer-werk",
      address: "Speicherstadt 14, 20457 Hamburg, Deutschland",
      bio: "Industriedesign-Studio mit Schwerpunkt auf Werkzeugen, Hardware und kleinen Elektrogeräten. Wir arbeiten zwischen Ingenieursdisziplin und Form — vom 3D-Druck-Mockup über die DFM-Phase bis zur Serienreife mit europäischen Fertigern.",
      sectorKey: "architecture",
      services: [
        {
          title: "Produktdesign",
          description: "Konzept, CAD, Prototypen — von der Idee bis zur Werkzeugabnahme.",
        },
        {
          title: "DFM & Fertigungsplanung",
          description: "Toleranzen, Materialauswahl, Fertigerauswahl in DACH und Polen.",
        },
        {
          title: "Branding für Hardware",
          description: "Verpackung, Markenfarben und Produktfotografie aus einer Hand.",
        },
      ],
      socials: {
        linkedin: "https://example-demo.opsolid.de/in/tobias-bauer",
        instagram: "https://example-demo.opsolid.de/bauerwerk",
      },
      customButtons: [
        { label: "Case Studies", href: "https://example-demo.opsolid.de/bauer-werk/cases", style: "primary" },
        { label: "Briefing-Call", href: "https://example-demo.opsolid.de/bauer-werk/call", style: "secondary" },
      ],
      designNotes: "demo:public-card:tobias-bauer",
    },
  },

  // 11. Aylin Yıldız — Turkish PR / Marketing lead, Istanbul.
  {
    slug: "aylin-yildiz",
    templateId: 38, // Content Creator — Noir
    contactName: "Aylin Yıldız",
    contactEmail: "aylin@example-demo.opsolid.de",
    contactPhone: "+90 850 555 1103",
    brandPrimaryHex: "#D81B60",
    brandAccentHex: "#1F1F1F",
    industry: "Public relations",
    city: "Istanbul",
    country: "TR",
    languages: ["tr", "en", "de"],
    acceptingClients: true,
    themeKey: "editorial",
    layoutKey: "editorial",
    qrPreset: "gradient",
    cardData: {
      name: "Aylın Yıldız",
      title: "Marketing Lead, Beyaz İletişim",
      position: "Pazarlama Direktörü",
      company: "Beyaz İletişim",
      email: "aylin@example-demo.opsolid.de",
      phone: "+90 850 555 1103",
      website: "https://example-demo.opsolid.de/beyaz-iletisim",
      address: "Bağdat Caddesi 188, Kadıköy, İstanbul, Türkiye",
      bio: "12 yıllık halkla ilişkiler ve içerik pazarlaması deneyimi. Lüks otel, gastronomi ve moda markaları için marka konumlandırma, basın ilişkileri ve dijital lansman kampanyaları yürütüyorum. Türkçe, İngilizce ve Almanca tam akıcılık.",
      sectorKey: "consultant",
      services: [
        {
          title: "Marka konumlandırma",
          description: "Hedef kitle, mesaj mimarisi ve sektör analizi ile tam günlük çalıştay.",
        },
        {
          title: "Basın ilişkileri",
          description: "Türkiye + DACH bölgesi medya bağlantıları, lansman dosyaları ve etkinlik koordinasyonu.",
        },
        {
          title: "İçerik & sosyal kampanya",
          description: "Editöryal takvim, fotoğrafçı koordinasyonu, Reels/Story yönetimi.",
        },
      ],
      socials: {
        linkedin: "https://example-demo.opsolid.de/in/aylin-yildiz",
        instagram: "https://example-demo.opsolid.de/aylin.yildiz.pr",
      },
      customButtons: [
        { label: "Portföy", href: "https://example-demo.opsolid.de/beyaz-iletisim/portfoy", style: "primary" },
        { label: "Tanışma görüşmesi", href: "https://example-demo.opsolid.de/beyaz-iletisim/randevu", style: "secondary" },
      ],
      designNotes: "demo:public-card:aylin-yildiz",
    },
  },

  // 12. Markus Schmidt — boutique hotel chain, Bavaria.
  {
    slug: "markus-schmidt",
    templateId: 15, // Hotel
    contactName: "Markus Schmidt",
    contactEmail: "markus@example-demo.opsolid.de",
    contactPhone: "+49 30 555 1104",
    brandPrimaryHex: "#2F4F4F",
    brandAccentHex: "#B8956A",
    industry: "Hospitality",
    city: "Garmisch-Partenkirchen",
    country: "DE",
    languages: ["de", "en", "it"],
    acceptingClients: true,
    themeKey: "editorial",
    layoutKey: "stack",
    qrPreset: "classic",
    cardData: {
      name: "Markus Schmidt",
      title: "Hotelier, Schmidt Privathotels",
      position: "Inhaber & Direktor",
      company: "Schmidt Privathotels",
      email: "markus@example-demo.opsolid.de",
      phone: "+49 30 555 1104",
      website: "https://example-demo.opsolid.de/schmidt-privathotels",
      address: "Ludwigstraße 7, 82467 Garmisch-Partenkirchen, Deutschland",
      bio: "Vier inhabergeführte Boutique-Hotels in Bayern und Tirol. Familientradition seit 1962 — heute mit moderner Sterneküche, Bergblick aus jedem Zimmer und einer Geschichte, die wir gerne persönlich erzählen.",
      sectorKey: "hospitality",
      services: [
        {
          title: "Suiten & Bergblick-Zimmer",
          description: "Vier Häuser, 142 Zimmer, alle mit eigenem Charakter.",
        },
        {
          title: "Hochzeiten & private Feiern",
          description: "Bis zu 120 Gäste in unseren historischen Sälen.",
        },
        {
          title: "Bergrestaurant & Wellness",
          description: "Sauna, Hallenbad, Sterneküche unter Chef Lukas Müller.",
        },
        {
          title: "Tagungen & Klausuren",
          description: "Drei Tagungsräume, Glasfaser-WLAN, Catering inklusive.",
        },
      ],
      socials: {
        linkedin: "https://example-demo.opsolid.de/in/markus-schmidt",
        instagram: "https://example-demo.opsolid.de/schmidt_privathotels",
        facebook: "https://example-demo.opsolid.de/schmidtprivathotels",
      },
      customButtons: [
        { label: "Direktbuchung", href: "https://example-demo.opsolid.de/schmidt-privathotels/buchen", style: "primary" },
        { label: "Hotels ansehen", href: "https://example-demo.opsolid.de/schmidt-privathotels/haeuser", style: "secondary" },
      ],
      designNotes: "demo:public-card:markus-schmidt",
    },
  },

  // 13. Sara Lindqvist — sustainability consultant Berlin (Nordic transplant).
  {
    slug: "sara-lindqvist",
    templateId: 41, // Wellness Teacher — Pure (clean, calm aesthetic)
    contactName: "Sara Lindqvist",
    contactEmail: "sara@example-demo.opsolid.de",
    contactPhone: "+49 30 555 1105",
    brandPrimaryHex: "#0F4C3A",
    brandAccentHex: "#E8E4DC",
    industry: "Sustainability consulting",
    city: "Berlin",
    country: "DE",
    languages: ["en", "sv", "de"],
    acceptingClients: true,
    themeKey: "editorial",
    layoutKey: "stack",
    qrPreset: "rounded",
    cardData: {
      name: "Sara Lindqvist",
      title: "Sustainability Consultant, NORDIC ZERO",
      position: "Lead Consultant & Founder",
      company: "NORDIC ZERO",
      email: "sara@example-demo.opsolid.de",
      phone: "+49 30 555 1105",
      website: "https://example-demo.opsolid.de/nordic-zero",
      address: "Torstraße 89, 10119 Berlin, Deutschland",
      bio: "I help mid-sized European companies move from CSR slide-decks to operational decarbonisation. Background: 8 years at a Stockholm consultancy, BSc Environmental Engineering (KTH), Climate Reality Leader. Working language: English. Reports in English, Swedish or German.",
      sectorKey: "consultant",
      services: [
        {
          title: "Scope 1–3 carbon baseline",
          description: "GHG Protocol-aligned audit with prioritised reduction roadmap.",
        },
        {
          title: "CSRD readiness",
          description: "Materiality assessment, data collection, report drafting for the 2026 cycle.",
        },
        {
          title: "Supplier engagement program",
          description: "Workshops + scorecards to bring your top suppliers along.",
        },
      ],
      socials: {
        linkedin: "https://example-demo.opsolid.de/in/sara-lindqvist",
      },
      customButtons: [
        { label: "Discovery call", href: "https://example-demo.opsolid.de/nordic-zero/call", style: "primary" },
        { label: "Sample report", href: "https://example-demo.opsolid.de/nordic-zero/sample", style: "secondary" },
      ],
      designNotes: "demo:public-card:sara-lindqvist",
    },
  },

  // 14. Florian Reiter — freelance DevOps, Vienna.
  {
    slug: "florian-reiter",
    templateId: 36, // Software Dev — Vivid
    contactName: "Florian Reiter",
    contactEmail: "florian@example-demo.opsolid.de",
    contactPhone: "+43 1 555 1106",
    brandPrimaryHex: "#7C3AED",
    brandAccentHex: "#0EA5E9",
    industry: "Software & DevOps",
    city: "Vienna",
    country: "AT",
    languages: ["de", "en"],
    acceptingClients: true,
    themeKey: "cinema",
    layoutKey: "bento",
    qrPreset: "dots",
    cardData: {
      name: "Florian Reiter",
      title: "Freelance DevOps Engineer",
      position: "Senior DevOps / Platform Engineer",
      company: "Reiter Cloud Engineering e.U.",
      email: "florian@example-demo.opsolid.de",
      phone: "+43 1 555 1106",
      website: "https://example-demo.opsolid.de/reiter-cloud",
      address: "Mariahilfer Straße 88, 1070 Wien, Österreich",
      bio: "10+ Jahre Linux/Kubernetes/AWS in Produktion. Ich helfe Teams, ihre Pipelines auf <10 Minuten zu bekommen, ihre Infra zu codifizieren (Terraform, Pulumi) und nachts ruhig zu schlafen (SLO-basiertes Alerting, Runbooks, Chaos Engineering).",
      sectorKey: "software",
      services: [
        {
          title: "Kubernetes-Plattform-Setup",
          description: "EKS/GKE/AKS, GitOps via ArgoCD, Secret-Management mit Vault.",
        },
        {
          title: "CI/CD-Refactoring",
          description: "Build-Zeiten halbieren, Caching, parallele Stages, Test-Sharding.",
        },
        {
          title: "Observability-Stack",
          description: "Prometheus + Grafana + Loki, SLO-Dashboards, PagerDuty-Integration.",
        },
        {
          title: "Cost optimisation",
          description: "AWS-Reserved Instances, K8s Right-Sizing, FinOps-Setup für Engineering-Teams.",
        },
      ],
      socials: {
        linkedin: "https://example-demo.opsolid.de/in/florian-reiter",
        x: "https://example-demo.opsolid.de/floreiter",
      },
      customButtons: [
        { label: "GitHub", href: "https://example-demo.opsolid.de/freiter", style: "primary" },
        { label: "Verfügbarkeit", href: "https://example-demo.opsolid.de/reiter-cloud/cal", style: "secondary" },
      ],
      designNotes: "demo:public-card:florian-reiter",
    },
  },

  // 15. Jana Vogel — patent lawyer, Munich.
  {
    slug: "jana-vogel",
    templateId: 56, // Legal Counsel — Noir
    contactName: "Jana Vogel",
    contactEmail: "jana@example-demo.opsolid.de",
    contactPhone: "+49 30 555 1107",
    brandPrimaryHex: "#0B2447",
    brandAccentHex: "#A5907E",
    industry: "Legal services",
    city: "Munich",
    country: "DE",
    languages: ["de", "en"],
    acceptingClients: true,
    themeKey: "editorial",
    layoutKey: "editorial",
    qrPreset: "classic",
    cardData: {
      name: "Dr. Jana Vogel",
      title: "Partner, Vogel & Partners",
      position: "Patentanwältin, European Patent Attorney",
      company: "Vogel & Partners Patentanwälte PartG",
      email: "jana@example-demo.opsolid.de",
      phone: "+49 30 555 1107",
      website: "https://example-demo.opsolid.de/vogel-partners",
      address: "Maximilianstraße 35, 80539 München, Deutschland",
      bio: "Patentanwältin mit Schwerpunkt auf Mechatronik, Medizintechnik und Software-implementierten Erfindungen. Promotion in Maschinenbau (TUM), zugelassen vor dem EPA und dem Einheitlichen Patentgericht (UPC).",
      sectorKey: "lawyer",
      services: [
        {
          title: "Patentanmeldung & Prüfungsverfahren",
          description: "DE, EP und PCT — von der Erstberatung bis zur Erteilung.",
        },
        {
          title: "Freedom-to-Operate-Analysen",
          description: "Risikoanalyse vor Markteinführung, schriftliches Gutachten inklusive.",
        },
        {
          title: "Einspruch & UPC-Verfahren",
          description: "Verteidigung erteilter Patente und Klagen vor dem Einheitlichen Patentgericht.",
        },
        {
          title: "IP-Portfolio-Strategie",
          description: "Jährliches Portfolio-Review für Mittelständler und Scale-ups.",
        },
      ],
      socials: {
        linkedin: "https://example-demo.opsolid.de/in/jana-vogel",
      },
      customButtons: [
        { label: "Erstgespräch", href: "https://example-demo.opsolid.de/vogel-partners/termin", style: "primary" },
        { label: "Kanzlei", href: "https://example-demo.opsolid.de/vogel-partners", style: "secondary" },
      ],
      designNotes: "demo:public-card:jana-vogel",
    },
  },

  // 16. Mehmet Aydın — restaurant owner, Asya Konak Hamburg (real voice-agent
  // pilot customer per project_voice_agent_pilot.md). Card kept demo-only:
  // demo phone, demo email, demo URL — does not expose real venue contact info.
  {
    slug: "mehmet-aydin",
    templateId: 14, // Restaurant
    contactName: "Mehmet Aydın",
    contactEmail: "mehmet@example-demo.opsolid.de",
    contactPhone: "+49 30 555 1108",
    brandPrimaryHex: "#8B1A1A",
    brandAccentHex: "#E5C07B",
    industry: "Restaurant",
    city: "Hamburg",
    country: "DE",
    languages: ["tr", "de", "en"],
    acceptingClients: true,
    themeKey: "cinema",
    layoutKey: "cinema",
    qrPreset: "watercolor",
    cardData: {
      name: "Mehmet Aydın",
      title: "Owner, Asya Konak",
      position: "Inhaber & Küchenchef",
      company: "Asya Konak Restaurant",
      email: "mehmet@example-demo.opsolid.de",
      phone: "+49 30 555 1108",
      website: "https://example-demo.opsolid.de/asya-konak",
      address: "Steindamm 42, 20099 Hamburg, Deutschland",
      bio: "Asya Konak ist seit zwölf Jahren ein Stück Anatolien mitten in Hamburg-St. Georg. Hausgemachte Manti, Lammgerichte vom Lavasteingrill, frischgebackenes Pide — und die Geschichten meiner Mutter aus Konya, die bis heute die Rezepte vorgibt.",
      sectorKey: "restaurant",
      services: [
        {
          title: "Mittagstisch & À-la-carte",
          description: "Täglich 11:30–22:00, durchgehend warme Küche.",
        },
        {
          title: "Hochzeiten & Familienfeiern",
          description: "Großer Festsaal für bis zu 80 Gäste, Live-Musik möglich.",
        },
        {
          title: "Catering & Lieferung",
          description: "Hamburg-weit, Mindestbestellwert 150 €. Komplettes Mezze-Programm.",
        },
        {
          title: "Türkisches Frühstück (sa/so)",
          description: "Wochenend-Brunch von 10:00–14:00, Reservierung empfohlen.",
        },
      ],
      socials: {
        instagram: "https://example-demo.opsolid.de/asyakonak",
        facebook: "https://example-demo.opsolid.de/asyakonakhamburg",
      },
      customButtons: [
        { label: "Tisch reservieren", href: "https://example-demo.opsolid.de/asya-konak/reservieren", style: "primary" },
        { label: "Speisekarte", href: "https://example-demo.opsolid.de/asya-konak/karte", style: "secondary" },
      ],
      designNotes: "demo:public-card:mehmet-aydin",
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
