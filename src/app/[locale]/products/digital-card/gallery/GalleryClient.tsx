"use client";

// =============================================================================
// GalleryClient — browsable public gallery of all OpSo Smart digital-card
// designs. Reads cardTemplates (active entries) as the data source; thumbnails
// live at /images/templates/card-<id>.png with a graceful fallback tile when
// an image fails to load. Sector filter chips derive from the catalog's
// distinct sectorHint values; "All" resets to the full lineup.
//
// i18n: all labels (incl. sector names) come from t.v2.digitalCard.gallery so
// the strings stay translatable and pass the structural-parity build guard.
//
// Colour note: muted text/surfaces use the explicit ink-300/400 + bg/line
// token steps, NOT slash-opacity. The bg/ink/line tokens are bare CSS vars
// (no <alpha-value>), so `text-ink/40` would silently paint at full opacity.
// copper/NN is fine — copper is hex-backed.
// =============================================================================

import * as React from "react";
import { useLocale } from "@/context/LocaleContext";
import { LocaleLink } from "@/components/shared/LocaleLink";
import { cardTemplates } from "@/config/card-templates";
import type { CardTemplateDef } from "@/config/card-templates";

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
      className="flex h-full w-full flex-col items-center justify-center gap-3 bg-bg-2 px-5 text-center"
      style={{
        backgroundImage:
          "radial-gradient(110% 75% at 20% 10%, rgba(194,121,64,0.14), transparent 55%)",
      }}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full border border-copper/45 bg-copper/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-200">
        {sectorLabel}
      </span>
      <p className="max-w-[18ch] font-serif text-[17px] leading-snug text-ink-100">
        {name}
      </p>
      <span
        aria-hidden
        className="block h-px w-10"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(194,121,64,0.6), transparent)",
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
          className="absolute right-2.5 top-2.5 rounded-full border border-line bg-bg-0 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-400 backdrop-blur-sm"
        >
          #{String(template.id).padStart(2, "0")}
        </span>
      </div>

      {/* Card footer */}
      <div className="flex flex-col gap-3 p-4">
        {/* Sector chip + template name */}
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-ink-400">
            {sectorLabel}
          </span>
          <h3 className="truncate font-serif text-[15px] leading-snug text-ink">
            {template.name}
          </h3>
        </div>

        {/* CTA */}
        <LocaleLink
          href={`/card/new?template=${template.id}`}
          className="btn btn-ghost inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-line bg-bg-0 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-200 transition-colors hover:border-copper/50 hover:text-ink"
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
  filterAriaLabel,
  labelFor,
  onChange,
}: {
  sectors: SectorHint[];
  active: SectorHint | "all";
  allLabel: string;
  filterAriaLabel: string;
  labelFor: (s: SectorHint) => string;
  onChange: (s: SectorHint | "all") => void;
}) {
  const pillBase =
    "shrink-0 snap-start rounded-full px-4 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] transition-all duration-200";
  const pillActive =
    "border border-copper/55 bg-copper/15 text-ink shadow-[0_1px_0_rgba(194,121,64,0.3)_inset]";
  const pillIdle =
    "border border-line bg-bg-1 text-ink-300 hover:border-line-firm hover:text-ink-100";

  return (
    <div
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible md:px-0"
      role="group"
      aria-label={filterAriaLabel}
    >
      {/* All chip */}
      <button
        type="button"
        onClick={() => onChange("all")}
        aria-pressed={active === "all"}
        className={`${pillBase} ${active === "all" ? pillActive : pillIdle}`}
      >
        {allLabel}
      </button>

      {sectors.map((sec) => (
        <button
          key={sec}
          type="button"
          onClick={() => onChange(sec)}
          aria-pressed={active === sec}
          className={`${pillBase} ${active === sec ? pillActive : pillIdle}`}
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
  const { t } = useLocale();
  const g = t.v2.digitalCard.gallery;
  const [activeFilter, setActiveFilter] = React.useState<SectorHint | "all">(
    "all"
  );

  const filtered = React.useMemo(() => {
    if (activeFilter === "all") return ALL_TEMPLATES;
    return ALL_TEMPLATES.filter((t) => t.sectorHint === activeFilter);
  }, [activeFilter]);

  const labelFor = React.useCallback(
    (s: SectorHint) =>
      (g.sectors as Record<string, string>)[s] ?? s,
    [g]
  );

  return (
    <main className="wrap py-16 md:py-24">
      {/* Back link */}
      <LocaleLink
        href="/products/digital-card"
        className="mb-10 inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-400 transition-colors hover:text-copper"
        aria-label={g.backLink}
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
        {g.backLink}
      </LocaleLink>

      {/* Page heading */}
      <div className="mb-10 flex flex-col gap-2 md:mb-14">
        <span className="mono-label text-[11px] text-ink-400">
          {String(ALL_TEMPLATES.length).padStart(2, "0")} {g.countLabel}
        </span>
        <h1 className="font-serif text-h1 text-ink md:text-display">
          {g.heading}
        </h1>
        <p className="mt-1 max-w-xl text-body text-ink-300">{g.subheading}</p>
      </div>

      {/* Sector filter */}
      <div className="mb-8 md:mb-10">
        <SectorPills
          sectors={ALL_SECTORS}
          active={activeFilter}
          allLabel={g.allChip}
          filterAriaLabel={g.heading}
          labelFor={labelFor}
          onChange={setActiveFilter}
        />
      </div>

      {/* Live count when filtered */}
      {activeFilter !== "all" && (
        <p className="mb-6 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-400">
          {filtered.length} {g.countLabel}
        </p>
      )}

      {/* Template grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((tpl) => (
          <TemplateCard
            key={tpl.id}
            template={tpl}
            sectorLabel={labelFor(tpl.sectorHint)}
            useDesignLabel={g.useDesign}
          />
        ))}
      </div>

      {/* Empty state — only if filter returns 0 (shouldn't happen with current catalog) */}
      {filtered.length === 0 && (
        <div className="panel mt-12 py-16 text-center">
          <p className="text-body text-ink-400">{g.countLabel} — 0</p>
        </div>
      )}
    </main>
  );
}
