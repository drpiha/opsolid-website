// =============================================================================
// OpSolid — Digital Business Card (DBC) Templates
//
// Source of truth for the template catalog. Numbered 1..N so customers can
// reference a design by its number ("Ich möchte Design #03"). The matching
// React component lives under src/components/cards/templates/<componentKey>.tsx
// and the thumbnail at /images/templates/card-<id>.png.
//
// Three billing modes per template:
//   - monthly (recurring)     — lowest-friction entry
//   - yearly  (recurring)     — ~35% discount vs monthly, the "sweet spot"
//   - one-time (lifetime)     — pricey anchor, rare in market
//
// Stripe Price IDs are populated by scripts/setup-stripe.ts. Re-run it with
// the LIVE secret key to get a parallel set for production.
// =============================================================================

export interface CardTemplateDef {
  id: number;
  slug: string;
  name: string;
  sectorHint:
    | "general"
    | "realEstate"
    | "salon"
    | "restaurant"
    | "creator"
    | "freelancer"
    | "lawyer"
    | "clinic"
    | "fitness"
    | "music"
    | "architecture"
    | "retail"
    | "hospitality"
    | "events"
    | "construction"
    | "tourism"
    | "corporate"
    | "tech"
    | "consultant"
    | "dentist"
    | "psychologist"
    | "beauty"
    | "accounting"
    | "software"
    | "content-creator";
  componentKey:
    | "Template01"
    | "Template02"
    | "Template03"
    | "Template04"
    | "Template05"
    | "SmartCard";
  /**
   * Optional default theme preset for this template (Phase 6). The preview
   * thumbnail and the order form's "Style preset" select use this to seed
   * the customer's choice. CSS-only via `data-theme` on the SmartCard root —
   * no DOM swap. See src/lib/cardThemes.ts for available presets.
   */
  themeKey?: "aurora" | "editorial" | "cinema";
  previewPath: string;
  /** One-time "lifetime" purchase — no renewal. */
  oneTimeCents: number;
  /** Monthly subscription (EUR). Null = not offered for this template. */
  monthlyCents: number | null;
  /** Yearly subscription (EUR). Null = not offered. */
  yearlyCents: number | null;
  stripeOneTimePriceId?: string;
  stripeMonthlyPriceId?: string;
  stripeYearlyPriceId?: string;
  isActive: boolean;
  sortOrder: number;
  /**
   * Phase 7 marker. `true` for ids 13..20 — sector-tailored SmartCard presets
   * that don't yet have a hand-built v2 component. The Phase 7.2 carousel
   * filters these out so customers only see the curated 12-template line-up.
   * Legacy entries continue to render via SmartCard fallback for any
   * pre-existing CardOrder rows whose templateId points here.
   */
  legacy?: boolean;
}

export const cardTemplates: readonly CardTemplateDef[] = [
  // Pricing rationale (2026-04-23 rev2):
  //
  // Market floor references (researched 2026-04-23):
  //   TR: vTAG ₺79/ay Standard (~€2), vTAG Pro+ ₺129/ay (~€3.4), Digi Card
  //       Starter ₺299/ay (~€7.7). Physical NFC ₺500-600 one-time.
  //   Global: Blinq Premium $5.89/mo, Lemontaps €6/mo, Popl ~€60/yr teams.
  //
  // We match Blinq / Lemontaps on monthly (global market floor) and sit
  // ~40% below them on yearly — since our annual price anchors long-term.
  // One-time is deliberately priced ~1.5× yearly so subscription is the
  // obvious default.
  {
    id: 1,
    slug: "real-estate",
    // Phase 7.1 alignment — id=1 is the Real Estate (kart_01) v2 component.
    // Pricing/Stripe IDs unchanged; only the human-facing name + sector hint
    // are updated to match the v2 registry. The carousel and order form both
    // resolve visuals via templateRegistry[1], so the catalog entry only
    // governs billing + filter-pill metadata.
    name: "Real Estate",
    sectorHint: "realEstate",
    componentKey: "SmartCard",
    themeKey: "editorial",
    previewPath: "/images/templates/card-01.png",
    monthlyCents: 500, // €5 / month  (~₺190)
    yearlyCents: 3900, // €39 / year (~₺1.480) — 35% off monthly
    oneTimeCents: 7900, // €79 lifetime (~₺3.000)
    stripeOneTimePriceId: "price_1TPLkX25H593hnObbB3cDjRZ",
    stripeMonthlyPriceId: "price_1TPLkX25H593hnObFsuYfkwG",
    stripeYearlyPriceId: "price_1TPLkX25H593hnObhWn3obfm",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 2,
    slug: "warm-serif",
    name: "Warm Serif",
    sectorHint: "creator",
    componentKey: "SmartCard",
    themeKey: "editorial",
    previewPath: "/images/templates/card-02.png",
    monthlyCents: 600, // €6 / month
    yearlyCents: 4900, // €49 / year
    oneTimeCents: 9900, // €99 lifetime
    stripeOneTimePriceId: "price_1TPLkY25H593hnObMOVYfp1B",
    stripeMonthlyPriceId: "price_1TPLkY25H593hnObd5Q7nkuA",
    stripeYearlyPriceId: "price_1TPLkY25H593hnObrtlEaUmW",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 3,
    slug: "estate-brass",
    name: "Estate Brass",
    sectorHint: "realEstate",
    componentKey: "SmartCard",
    themeKey: "cinema",
    previewPath: "/images/templates/card-03.png",
    monthlyCents: 700, // €7 / month   (premium — real-estate buyer)
    yearlyCents: 5900, // €59 / year
    oneTimeCents: 12900, // €129 lifetime
    stripeOneTimePriceId: "price_1TPLkZ25H593hnObjnIT7vxk",
    stripeMonthlyPriceId: "price_1TPLkZ25H593hnObZUdrkDxI",
    stripeYearlyPriceId: "price_1TPLkZ25H593hnOb6qOoofB1",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 4,
    slug: "atelier-clean",
    name: "Atelier Clean",
    sectorHint: "salon",
    componentKey: "SmartCard",
    themeKey: "aurora",
    previewPath: "/images/templates/card-04.png",
    monthlyCents: 600,
    yearlyCents: 4900,
    oneTimeCents: 9900,
    stripeOneTimePriceId: "price_1TPLka25H593hnObJmK5wAeF",
    stripeMonthlyPriceId: "price_1TPLka25H593hnObfAyNuZ0d",
    stripeYearlyPriceId: "price_1TPLka25H593hnObXq3wHwq0",
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 5,
    slug: "restaurant-noir",
    name: "Restaurant Noir",
    sectorHint: "restaurant",
    componentKey: "SmartCard",
    themeKey: "cinema",
    previewPath: "/images/templates/card-05.png",
    monthlyCents: 600,
    yearlyCents: 4900,
    oneTimeCents: 9900,
    stripeOneTimePriceId: "price_1TPLkb25H593hnObAB5WaiHB",
    stripeMonthlyPriceId: "price_1TPLkb25H593hnObuLNC7kEz",
    stripeYearlyPriceId: "price_1TPLkb25H593hnOb6U92Tq4k",
    isActive: true,
    sortOrder: 5,
  },

  // ---------------------------------------------------------------------------
  // Sector-tailored SmartCard presets (IDs 6–20). Each entry reuses the
  // SmartCard component but ships a sector-specific preset (see card-sectors.ts)
  // so the customer-facing copy/icons read native to the trade. Stripe price
  // IDs are populated by `npm run setup-stripe` once these become live SKUs.
  // ---------------------------------------------------------------------------
  {
    id: 6,
    slug: "avukat-hukuk",
    name: "Anwalt & Kanzlei",
    sectorHint: "lawyer",
    componentKey: "SmartCard",
    themeKey: "cinema",
    previewPath: "/images/templates/card-06.png",
    oneTimeCents: 12900,
    monthlyCents: 700,
    yearlyCents: 5900,
    stripeOneTimePriceId: "price_1TQCko25H593hnObiEXja3cd",
    stripeMonthlyPriceId: "price_1TQCkp25H593hnObJzi7IuBx",
    stripeYearlyPriceId: "price_1TQCkp25H593hnObxBk5EL2T",
    isActive: true,
    sortOrder: 6,
  },
  {
    id: 7,
    slug: "fotograf-kreatif",
    name: "Fotografie & Kreativ",
    sectorHint: "creator",
    componentKey: "SmartCard",
    themeKey: "editorial",
    previewPath: "/images/templates/card-07.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    stripeOneTimePriceId: "price_1TQCkq25H593hnObfKAsn6ab",
    stripeMonthlyPriceId: "price_1TQCkq25H593hnObArGlInUU",
    stripeYearlyPriceId: "price_1TQCkq25H593hnObRqBI275I",
    isActive: true,
    sortOrder: 7,
  },
  {
    id: 8,
    slug: "doktor-klinik",
    name: "Arzt & Klinik",
    sectorHint: "clinic",
    componentKey: "SmartCard",
    themeKey: "editorial",
    previewPath: "/images/templates/card-08.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    stripeOneTimePriceId: "price_1TQCkr25H593hnObcKA69AzJ",
    stripeMonthlyPriceId: "price_1TQCkr25H593hnObDFkAwRiC",
    stripeYearlyPriceId: "price_1TQCks25H593hnOb5jdKOyHZ",
    isActive: true,
    sortOrder: 8,
  },
  {
    id: 9,
    slug: "fitness-trainer",
    name: "Fitness & Personal Training",
    sectorHint: "fitness",
    componentKey: "SmartCard",
    themeKey: "aurora",
    previewPath: "/images/templates/card-09.png",
    oneTimeCents: 7900,
    monthlyCents: 500,
    yearlyCents: 3900,
    stripeOneTimePriceId: "price_1TQCkt25H593hnObwXLeNaWf",
    stripeMonthlyPriceId: "price_1TQCkt25H593hnObrKTFeL96",
    stripeYearlyPriceId: "price_1TQCkt25H593hnObY2PMOEc7",
    isActive: true,
    sortOrder: 9,
  },
  {
    id: 10,
    slug: "dj-muzik",
    name: "DJ & Musik",
    sectorHint: "music",
    componentKey: "SmartCard",
    themeKey: "aurora",
    previewPath: "/images/templates/card-10.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    stripeOneTimePriceId: "price_1TQCku25H593hnObfaQu44rw",
    stripeMonthlyPriceId: "price_1TQCku25H593hnOb7aUEVBP3",
    stripeYearlyPriceId: "price_1TQCku25H593hnObxFlkUgCw",
    isActive: true,
    sortOrder: 10,
  },
  {
    id: 11,
    slug: "mimar-tasarim",
    name: "Architektur & Design",
    sectorHint: "architecture",
    componentKey: "SmartCard",
    themeKey: "editorial",
    previewPath: "/images/templates/card-11.png",
    oneTimeCents: 12900,
    monthlyCents: 700,
    yearlyCents: 5900,
    stripeOneTimePriceId: "price_1TQCkv25H593hnObzwNJ16rP",
    stripeMonthlyPriceId: "price_1TQCkv25H593hnOb5Adb6AOX",
    stripeYearlyPriceId: "price_1TQCkw25H593hnObpCVBGhGN",
    isActive: true,
    sortOrder: 11,
  },
  {
    id: 12,
    slug: "eticaret-butik",
    name: "E-Commerce & Boutique",
    sectorHint: "retail",
    componentKey: "SmartCard",
    themeKey: "aurora",
    previewPath: "/images/templates/card-12.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    stripeOneTimePriceId: "price_1TQCkw25H593hnObDZneJL2x",
    stripeMonthlyPriceId: "price_1TQCkx25H593hnOb6tQUsYud",
    stripeYearlyPriceId: "price_1TQCkx25H593hnOb4ecB4pYH",
    isActive: true,
    sortOrder: 12,
  },
  // ---------------------------------------------------------------------------
  // Phase 7.7 — id=13 is the new "Universal Pro" sector-agnostic v2 template.
  // (The previous legacy "Hotel & Hospitality" placeholder under id=13 was
  // never surfaced by the carousel — `legacy: true` filtered it out — so
  // promoting this slot to a real v2 template doesn't hide anything customers
  // could already buy. Stripe price IDs are placeholders until run-stripe.)
  //
  // ---------------------------------------------------------------------------
  // Phase 7 legacy entries (ids 14..20). Kept so any pre-existing CardOrder
  // row whose templateId is here still resolves to a label + billing record.
  // The carousel filters these out via `legacy: true`; SmartCard handles render.
  // ---------------------------------------------------------------------------
  {
    id: 13,
    slug: "universal-pro",
    name: "Universal Pro",
    sectorHint: "consultant",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-13.png",
    monthlyCents: 500,
    yearlyCents: 3900,
    oneTimeCents: 7900,
    isActive: true,
    sortOrder: 13,
  },
  // ---------------------------------------------------------------------------
  // Phase 7.8 — designer-team v2 templates promoted from legacy. Stripe price
  // IDs preserved (re-used for the new SKUs); name/sector/legacy adjusted to
  // reflect the new sector-specific designs the v2 registry now wires up.
  // ---------------------------------------------------------------------------
  {
    id: 14,
    slug: "trattoria",
    name: "Trattoria",
    sectorHint: "restaurant",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-14.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    stripeOneTimePriceId: "price_1TQCkz25H593hnObxNBuGryn",
    stripeMonthlyPriceId: "price_1TQCkz25H593hnObZD93zURb",
    stripeYearlyPriceId: "price_1TQCl025H593hnObjR85tF3A",
    isActive: true,
    sortOrder: 14,
  },
  {
    id: 15,
    slug: "boutique-hotel",
    name: "Boutique Hotel",
    sectorHint: "hospitality",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-15.png",
    oneTimeCents: 12900,
    monthlyCents: 700,
    yearlyCents: 5900,
    stripeOneTimePriceId: "price_1TQCl025H593hnObBKBIRdxI",
    stripeMonthlyPriceId: "price_1TQCl025H593hnObMjeJRuv2",
    stripeYearlyPriceId: "price_1TQCl125H593hnObO1l4ELQH",
    isActive: true,
    sortOrder: 15,
  },
  {
    id: 16,
    slug: "tech-startup",
    name: "Tech Startup",
    sectorHint: "tech",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-16.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    stripeOneTimePriceId: "price_1TQCl125H593hnObu26AAzHw",
    stripeMonthlyPriceId: "price_1TQCl225H593hnObMuchpegq",
    stripeYearlyPriceId: "price_1TQCl225H593hnOb79HRO35d",
    isActive: true,
    sortOrder: 16,
  },
  {
    id: 17,
    slug: "developer",
    name: "Developer",
    sectorHint: "tech",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-17.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    stripeOneTimePriceId: "price_1TQCl225H593hnObmevKBs9x",
    stripeMonthlyPriceId: "price_1TQCl325H593hnObCyJqEMB5",
    stripeYearlyPriceId: "price_1TQCl325H593hnObrHbt5rbh",
    isActive: true,
    sortOrder: 17,
  },
  {
    id: 18,
    slug: "yoga-studio",
    name: "Yoga Studio",
    sectorHint: "fitness",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-18.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    stripeOneTimePriceId: "price_1TQCl425H593hnObjDMOJ69q",
    stripeMonthlyPriceId: "price_1TQCl425H593hnObf504NEXe",
    stripeYearlyPriceId: "price_1TQCl425H593hnObhBvTqugn",
    isActive: true,
    sortOrder: 18,
  },
  {
    id: 19,
    slug: "personal-trainer",
    name: "Personal Trainer",
    sectorHint: "fitness",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-19.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    stripeOneTimePriceId: "price_1TQCl525H593hnObl2DslNta",
    stripeMonthlyPriceId: "price_1TQCl525H593hnObO56KdLOz",
    stripeYearlyPriceId: "price_1TQCl625H593hnObXBVOMCqm",
    isActive: true,
    sortOrder: 19,
  },
  {
    id: 20,
    slug: "music-producer",
    name: "Music Producer",
    sectorHint: "music",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-20.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    stripeOneTimePriceId: "price_1TQCl625H593hnObRa5iYL0r",
    stripeMonthlyPriceId: "price_1TQCl725H593hnOb5UwrmIpa",
    stripeYearlyPriceId: "price_1TQCl725H593hnObpVPgYQCx",
    isActive: true,
    sortOrder: 20,
  },
  {
    id: 21,
    slug: "wedding-planner",
    name: "Wedding Planner",
    sectorHint: "events",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-21.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    isActive: true,
    sortOrder: 21,
  },
  // ---------------------------------------------------------------------------
  // Phase 7.10 Batch A — Dentist · Psychologist · Beauty (3 sectors × 3 styles)
  // Stripe price IDs left empty until `npm run setup-stripe` is re-run with
  // the new SKUs in scope.
  // ---------------------------------------------------------------------------
  {
    id: 22,
    slug: "dentist",
    name: "Dentist",
    sectorHint: "dentist",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-22.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    isActive: true,
    sortOrder: 22,
  },
  {
    id: 23,
    slug: "dentist-pure",
    name: "Dentist — Pure",
    sectorHint: "dentist",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-23.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    isActive: true,
    sortOrder: 23,
  },
  {
    id: 24,
    slug: "dentist-vivid",
    name: "Dentist — Vivid",
    sectorHint: "dentist",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-24.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    isActive: true,
    sortOrder: 24,
  },
  {
    id: 25,
    slug: "psychologist",
    name: "Psychologist",
    sectorHint: "psychologist",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-25.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    isActive: true,
    sortOrder: 25,
  },
  {
    id: 26,
    slug: "psychologist-pure",
    name: "Psychologist — Pure",
    sectorHint: "psychologist",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-26.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    isActive: true,
    sortOrder: 26,
  },
  {
    id: 27,
    slug: "psychologist-vivid",
    name: "Psychologist — Vivid",
    sectorHint: "psychologist",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-27.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    isActive: true,
    sortOrder: 27,
  },
  {
    id: 28,
    slug: "beauty-salon",
    name: "Beauty Salon",
    sectorHint: "beauty",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-28.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    isActive: true,
    sortOrder: 28,
  },
  {
    id: 29,
    slug: "beauty-salon-noir",
    name: "Beauty Salon — Noir",
    sectorHint: "beauty",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-29.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    isActive: true,
    sortOrder: 29,
  },
  {
    id: 30,
    slug: "beauty-salon-pure",
    name: "Beauty Salon — Pure",
    sectorHint: "beauty",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-30.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    isActive: true,
    sortOrder: 30,
  },
  // ---------------------------------------------------------------------------
  // Phase 7.10 Batch B — Accounting · Software · Content Creator (3 sectors × 3 styles)
  // Stripe price IDs left empty until `npm run setup-stripe` is re-run with
  // the new SKUs in scope.
  // ---------------------------------------------------------------------------
  {
    id: 31,
    slug: "accounting",
    name: "Accounting",
    sectorHint: "accounting",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-31.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    isActive: true,
    sortOrder: 31,
  },
  {
    id: 32,
    slug: "accounting-noir",
    name: "Accounting — Noir",
    sectorHint: "accounting",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-32.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    isActive: true,
    sortOrder: 32,
  },
  {
    id: 33,
    slug: "accounting-pure",
    name: "Accounting — Pure",
    sectorHint: "accounting",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-33.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    isActive: true,
    sortOrder: 33,
  },
  {
    id: 34,
    slug: "software-dev",
    name: "Software Dev",
    sectorHint: "software",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-34.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    isActive: true,
    sortOrder: 34,
  },
  {
    id: 35,
    slug: "software-dev-pure",
    name: "Software Dev — Pure",
    sectorHint: "software",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-35.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    isActive: true,
    sortOrder: 35,
  },
  {
    id: 36,
    slug: "software-dev-vivid",
    name: "Software Dev — Vivid",
    sectorHint: "software",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-36.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    isActive: true,
    sortOrder: 36,
  },
  {
    id: 37,
    slug: "content-creator",
    name: "Content Creator",
    sectorHint: "content-creator",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-37.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    isActive: true,
    sortOrder: 37,
  },
  {
    id: 38,
    slug: "content-creator-noir",
    name: "Content Creator — Noir",
    sectorHint: "content-creator",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-38.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    isActive: true,
    sortOrder: 38,
  },
  {
    id: 39,
    slug: "content-creator-pure",
    name: "Content Creator — Pure",
    sectorHint: "content-creator",
    componentKey: "SmartCard",
    previewPath: "/images/templates/card-39.png",
    oneTimeCents: 9900,
    monthlyCents: 600,
    yearlyCents: 4900,
    isActive: true,
    sortOrder: 39,
  },
];

export function getTemplateById(id: number): CardTemplateDef | undefined {
  return cardTemplates.find((t) => t.id === id);
}

export function getActiveTemplates(): CardTemplateDef[] {
  return cardTemplates
    .filter((t) => t.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Format a cent amount as a localized euro string (e.g. 4900 -> "€49,00" in de).
 */
export function formatEuro(cents: number, locale = "de-DE"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
