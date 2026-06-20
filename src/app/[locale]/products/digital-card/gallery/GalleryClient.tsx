"use client";

// =============================================================================
// GalleryClient — browsable public gallery of all OpSo Smart digital-card
// designs. Reads cardTemplates (98 entries) as the data source; thumbnails
// live at /images/templates/card-<id>.png with a graceful fallback tile when
// an image fails to load. Sector filter chips derive from the catalog's
// distinct sectorHint values; "All" resets to the full lineup.
//
// i18n: labels are inline here (EN/DE/TR) keyed to the active locale from
// useLocale(). The lead wires these into locale content files in a later pass.
// =============================================================================

import * as React from "react";
import { useLocale } from "@/context/LocaleContext";
import { LocaleLink } from "@/components/shared/LocaleLink";
import { cardTemplates } from "@/config/card-templates";
import type { CardTemplateDef } from "@/config/card-templates";

// -----------------------------------------------------------------------------
// Inline label map — DE / EN / TR. Kept minimal; content team moves these to
// locale files in a later pass.
// -----------------------------------------------------------------------------

type LabelKey =
  | "heading"
  | "subheading"
  | "countLabel"
  | "allChip"
  | "useDesign"
  | "backLink"
  | "imgFallbackLabel"
  // sector names
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
  | "content-creator"
  | "wellness"
  | "eventPlanner"
  | "auto"
  | "interior";

const LABELS: Record<"en" | "de" | "tr", Record<LabelKey, string>> = {
  en: {
    heading: "All designs",
    subheading: "Browse the full lineup and pick the design that fits your work.",
    countLabel: "designs",
    allChip: "All",
    useDesign: "Use this design",
    backLink: "Back to Digital Card",
    imgFallbackLabel: "Template preview",
    // sectors
    general: "General",
    realEstate: "Real Estate",
    salon: "Salon & Barber",
    restaurant: "Restaurant",
    creator: "Creator & Photo",
    freelancer: "Freelancer",
    lawyer: "Legal",
    clinic: "Clinic",
    fitness: "Fitness",
    music: "Music & DJ",
    architecture: "Architecture",
    retail: "Retail",
    hospitality: "Hospitality",
    events: "Events",
    construction: "Construction",
    tourism: "Tourism",
    corporate: "Corporate",
    tech: "Tech",
    consultant: "Consultant",
    dentist: "Dentist",
    psychologist: "Psychology",
    beauty: "Beauty",
    accounting: "Accounting",
    software: "Software",
    "content-creator": "Content Creator",
    wellness: "Wellness",
    eventPlanner: "Event Planner",
    auto: "Auto Dealer",
    interior: "Interior Design",
  },
  de: {
    heading: "Alle Designs",
    subheading: "Die komplette Auswahl — passend fur Ihre Branche.",
    countLabel: "Designs",
    allChip: "Alle",
    useDesign: "Dieses Design wahlen",
    backLink: "Zuruck zur digitalen Karte",
    imgFallbackLabel: "Vorschau",
    // sectors
    general: "Allgemein",
    realEstate: "Immobilien",
    salon: "Salon & Barber",
    restaurant: "Restaurant",
    creator: "Kreativ & Foto",
    freelancer: "Freelancer",
    lawyer: "Recht & Kanzlei",
    clinic: "Klinik",
    fitness: "Fitness",
    music: "Musik & DJ",
    architecture: "Architektur",
    retail: "Handel",
    hospitality: "Hotellerie",
    events: "Events",
    construction: "Bau",
    tourism: "Tourismus",
    corporate: "Unternehmen",
    tech: "Tech",
    consultant: "Beratung",
    dentist: "Zahnarzt",
    psychologist: "Psychologie",
    beauty: "Beauty",
    accounting: "Buchhaltung",
    software: "Software",
    "content-creator": "Content Creator",
    wellness: "Wellness",
    eventPlanner: "Eventplanung",
    auto: "Autohandel",
    interior: "Innenarchitektur",
  },
  tr: {
    heading: "Tum Tasarimlar",
    subheading: "Tum koleksiyonu kesfet ve sektörune en uygun tasarimi sec.",
    countLabel: "tasarim",
    allChip: "Tümü",
    useDesign: "Bu tasarimi kullan",
    backLink: "Dijital Kartlara Don",
    imgFallbackLabel: "On izleme",
    // sectors
    general: "Genel",
    realEstate: "Emlak",
    salon: "Salon & Berber",
    restaurant: "Restoran",
    creator: "Kreatif & Foto",
    freelancer: "Freelancer",
    lawyer: "Hukuk",
    clinic: "Klinik",
    fitness: "Fitness",
    music: "Muzik & DJ",
    architecture: "Mimari",
    retail: "Perakende",
    hospitality: "Otelcilik",
    events: "Etkinlik",
    construction: "Insaat",
    tourism: "Turizm",
    corporate: "Kurumsal",
    tech: "Teknoloji",
    consultant: "Danismanlik",
    dentist: "Dis Hekimi",
    psychologist: "Psikoloji",
    beauty: "Guzellik",
    accounting: "Muhasebe",
    software: "Yazilim",
    "content-creator": "Icerik Uretici",
    wellness: "Saglik & Wellness",
    eventPlanner: "Etkinlik Planlama",
    auto: "Otomotiv",
    interior: "Ic Mimarlik",
  },
};

function useLabels() {
  const { locale } = useLocale();
  const lang = (["de", "tr"].includes(locale) ? locale : "en") as
    | "en"
    | "de"
    | "tr";
  return LABELS[lang];
}

// -----------------------------------------------------------------------------
// Sector type — derived from the catalog union
// -----------------------------------------------------------------------------

type SectorHint = CardTemplateDef["sectorHint"];

// -----------------------------------------------------------------------------
// Fallback tile — shown when thumbnail fails to load
// -----------------------------------------------------------------------------

function ThumbnailFallback({
  name,
  sectorLabel,
}: {
  name: string;
  sectorLabel: string;
}) {
  return (
    <div
      aria-hidden="false"
      className="flex h-full w-full flex-col items-center justify-center gap-3 px-5 text-center"
      style={{
        background:
          "radial-gradient(110% 75% at 20% 10%, rgba(232,162,82,0.15), transparent 55%), linear-gradient(165deg, #FAF6EF 0%, #ECE6D8 100%)",
      }}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full border border-copper/45 bg-copper/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/70">
        {sectorLabel}
      </span>
      <p className="max-w-[18ch] font-serif text-[17px] leading-snug text-ink/80">
        {name}
      </p>
      <span
        aria-hidden
        className="block h-px w-10"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(232,162,82,0.6), transparent)",
        }}
      />
    </div>
  );
}

// -----------------------------------------------------------------------------
// TemplateThumbnail — image with onError fallback swap
// -----------------------------------------------------------------------------

function TemplateThumbnail({
  template,
  sectorLabel,
}: {
  template: CardTemplateDef;
  sectorLabel: string;
}) {
  const [failed, setFailed] = React.useState(false);

  // Derive the thumbnail path from id, zero-padded to 2 digits for ids < 100
  const thumbSrc = `/images/templates/card-${String(template.id).padStart(2, "0")}.png`;

  if (failed) {
    return (
      <ThumbnailFallback name={template.name} sectorLabel={sectorLabel} />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={thumbSrc}
      alt={`${template.name} — ${sectorLabel}`}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/tile:scale-[1.03]"
      onError={() => setFailed(true)}
      loading="lazy"
      decoding="async"
    />
  );
}

// -----------------------------------------------------------------------------
// TemplateCard — single grid tile
// -----------------------------------------------------------------------------

function TemplateCard({
  template,
  sectorLabel,
  useDesignLabel,
}: {
  template: CardTemplateDef;
  sectorLabel: string;
  useDesignLabel: string;
}) {
  return (
    <article className="group/tile flex flex-col rounded-2xl border border-line bg-bg-1 shadow-[0_2px_14px_-8px_rgba(15,15,15,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-copper/30 hover:shadow-[0_10px_30px_-16px_rgba(15,15,15,0.28),0_4px_12px_-8px_rgba(194,121,64,0.18)]">
      {/* Thumbnail frame — aspect 3:4 (portrait card proportions) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-2xl bg-bg-2">
        <TemplateThumbnail template={template} sectorLabel={sectorLabel} />

        {/* ID badge */}
        <span
          aria-hidden
          className="absolute right-2.5 top-2.5 rounded-full border border-ink/10 bg-bg-0/80 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink/45 backdrop-blur-sm"
        >
          #{String(template.id).padStart(2, "0")}
        </span>
      </div>

      {/* Card footer */}
      <div className="flex flex-col gap-3 p-4">
        {/* Sector chip + template name */}
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-ink/45">
            {sectorLabel}
          </span>
          <h3 className="truncate font-serif text-[15px] leading-snug text-ink">
            {template.name}
          </h3>
        </div>

        {/* CTA */}
        <LocaleLink
          href={`/card/new?template=${template.id}`}
          className="btn btn-ghost inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-ink/15 bg-bg-0 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/70 transition-colors hover:border-copper/50 hover:text-ink"
          aria-label={`${useDesignLabel} — ${template.name}`}
        >
          {useDesignLabel}
        </LocaleLink>
      </div>
    </article>
  );
}

// -----------------------------------------------------------------------------
// SectorPills — horizontally scrollable on mobile, wrapping on desktop
// -----------------------------------------------------------------------------

function SectorPills({
  sectors,
  active,
  allLabel,
  labelFor,
  onChange,
}: {
  sectors: SectorHint[];
  active: SectorHint | "all";
  allLabel: string;
  labelFor: (s: SectorHint) => string;
  onChange: (s: SectorHint | "all") => void;
}) {
  return (
    <div
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible md:px-0"
      role="group"
      aria-label="Filter by sector"
    >
      {/* All chip */}
      <button
        type="button"
        onClick={() => onChange("all")}
        aria-pressed={active === "all"}
        className={`shrink-0 snap-start rounded-full px-4 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] transition-all duration-200 ${
          active === "all"
            ? "border border-copper/55 bg-copper/15 text-ink shadow-[0_1px_0_rgba(194,121,64,0.3)_inset]"
            : "border border-ink/12 bg-bg-1/60 text-ink/55 hover:border-ink/25 hover:text-ink/90"
        }`}
      >
        {allLabel}
      </button>

      {sectors.map((sec) => (
        <button
          key={sec}
          type="button"
          onClick={() => onChange(sec)}
          aria-pressed={active === sec}
          className={`shrink-0 snap-start rounded-full px-4 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] transition-all duration-200 ${
            active === sec
              ? "border border-copper/55 bg-copper/15 text-ink shadow-[0_1px_0_rgba(194,121,64,0.3)_inset]"
              : "border border-ink/12 bg-bg-1/60 text-ink/55 hover:border-ink/25 hover:text-ink/90"
          }`}
        >
          {labelFor(sec)}
        </button>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// GalleryClient — root component
// -----------------------------------------------------------------------------

// All active templates from the catalog, sorted by sortOrder
const ALL_TEMPLATES: CardTemplateDef[] = cardTemplates
  .filter((t) => t.isActive)
  .slice()
  .sort((a, b) => a.sortOrder - b.sortOrder);

// Unique sectors in catalog order (first appearance wins)
const ALL_SECTORS: SectorHint[] = (() => {
  const seen = new Set<SectorHint>();
  const out: SectorHint[] = [];
  for (const t of ALL_TEMPLATES) {
    if (!seen.has(t.sectorHint)) {
      seen.add(t.sectorHint);
      out.push(t.sectorHint);
    }
  }
  return out;
})();

export function GalleryClient() {
  const L = useLabels();
  const [activeFilter, setActiveFilter] = React.useState<SectorHint | "all">(
    "all"
  );

  const filtered = React.useMemo(() => {
    if (activeFilter === "all") return ALL_TEMPLATES;
    return ALL_TEMPLATES.filter((t) => t.sectorHint === activeFilter);
  }, [activeFilter]);

  const labelFor = React.useCallback(
    (s: SectorHint) => L[s] ?? s,
    [L]
  );

  return (
    <main className="wrap py-16 md:py-24">
      {/* Back link */}
      <LocaleLink
        href="/products/digital-card"
        className="mb-10 inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/50 transition-colors hover:text-copper"
        aria-label={L.backLink}
      >
        {/* Inline chevron-left to avoid lucide import */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5" />
          <path d="m12 5-7 7 7 7" />
        </svg>
        {L.backLink}
      </LocaleLink>

      {/* Page heading */}
      <div className="mb-10 flex flex-col gap-2 md:mb-14">
        <span className="mono-label text-[11px] text-ink/40">
          {String(ALL_TEMPLATES.length).padStart(2, "0")} {L.countLabel}
        </span>
        <h1 className="font-serif text-display-sm text-ink md:text-display-md">
          {L.heading}
        </h1>
        <p className="mt-1 max-w-xl text-body text-ink/60">{L.subheading}</p>
      </div>

      {/* Sector filter */}
      <div className="mb-8 md:mb-10">
        <SectorPills
          sectors={ALL_SECTORS}
          active={activeFilter}
          allLabel={L.allChip}
          labelFor={labelFor}
          onChange={setActiveFilter}
        />
      </div>

      {/* Live count when filtered */}
      {activeFilter !== "all" && (
        <p className="mb-6 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/45">
          {filtered.length} {L.countLabel}
        </p>
      )}

      {/* Template grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((tpl) => (
          <TemplateCard
            key={tpl.id}
            template={tpl}
            sectorLabel={labelFor(tpl.sectorHint)}
            useDesignLabel={L.useDesign}
          />
        ))}
      </div>

      {/* Empty state — only if filter returns 0 (shouldn't happen with current catalog) */}
      {filtered.length === 0 && (
        <div className="panel mt-12 py-16 text-center">
          <p className="text-body text-ink/50">{L.countLabel} — 0</p>
        </div>
      )}
    </main>
  );
}
