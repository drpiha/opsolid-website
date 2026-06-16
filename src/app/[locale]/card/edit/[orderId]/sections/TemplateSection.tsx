"use client";

// =============================================================================
// TemplateSection — visual template picker. Lets the card owner switch the
// design by SEEING each template (thumbnail), not just reading a name.
//
// Previously the template was locked, then a plain name dropdown. Owners
// couldn't decide visually. This shows a thumbnail grid grouped by sector;
// the live preview re-renders on pick and the choice persists on save.
// Thumbnails: /images/templates/card-NN.png (NN = id, zero-padded to 2).
// =============================================================================

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { plannedLineup, type PlannedSector } from "@/components/cards/templates/v2/registry";
import type { SectionToggle } from "./types";

interface TemplateSectionProps extends SectionToggle {
  templateId: number;
  setTemplateId: (id: number) => void;
}

// Same three clean, sector-neutral starter designs the /card/new flow shows
// (ids 92-94). Surfaced first so the editor reads as simply as create; the
// full 90+ catalog is one tap away behind "All designs".
const STARTER_DESIGNS = [
  { id: 93, labelKey: "designClassic" }, // Pure Swiss
  { id: 92, labelKey: "designModern" }, // Noir Luxury
  { id: 94, labelKey: "designVisual" }, // Vivid Bold
] as const;

const SECTOR_LABELS: Record<PlannedSector, string> = {
  "real-estate": "Immobilien · Real Estate",
  lawyer: "Recht · Legal",
  restaurant: "Restaurant · Café",
  creator: "Kreativ · Foto",
  clinic: "Praxis · Klinik",
  music: "Musik · DJ",
  salon: "Salon · Barber",
  retail: "Handel · E-Commerce",
  architecture: "Architektur",
  fitness: "Fitness · Sport",
  hospitality: "Hotel · Hospitality",
  consultant: "Beratung · Universal",
  tech: "Tech · Software",
  events: "Events",
  dentist: "Zahnarzt · Dentist",
  psychologist: "Psychologe",
  beauty: "Beauty",
  accounting: "Buchhaltung",
  software: "Software",
  "content-creator": "Content Creator",
  wellness: "Wellness",
  "event-planner": "Event Planner",
  auto: "Auto",
  interior: "Interior",
};

const thumb = (id: number) => `/images/templates/card-${String(id).padStart(2, "0")}.png`;

// Computed once at module scope — never recalculated on render.
const TEMPLATE_GROUPS = (() => {
  const order: PlannedSector[] = [];
  const bySector = new Map<PlannedSector, typeof plannedLineup[number][]>();
  for (const tpl of plannedLineup) {
    if (!bySector.has(tpl.sector)) {
      bySector.set(tpl.sector, []);
      order.push(tpl.sector);
    }
    bySector.get(tpl.sector)!.push(tpl);
  }
  return order.map((sector) => ({ sector, items: bySector.get(sector)! }));
})();

export default function TemplateSection({
  templateId,
  setTemplateId,
  openSections,
  toggleSection,
}: TemplateSectionProps) {
  const { t } = useLocale();
  const edit = t.products.digitalCard.edit as Record<string, string>;
  const q = t.card.quickCreate;
  const open = openSections.has("template");

  // Full catalog (the 90+ sector accordion) stays collapsed behind "All
  // designs" so the default editor view shows only the 3 starter designs.
  const [showAll, setShowAll] = useState(
    () => !STARTER_DESIGNS.some((d) => d.id === templateId),
  );

  // Per-sector collapse state — default to the active template's sector open.
  const [openGroups, setOpenGroups] = useState<Set<PlannedSector>>(() => {
    const a = plannedLineup.find((tpl) => tpl.id === templateId);
    return a ? new Set<PlannedSector>([a.sector]) : new Set<PlannedSector>();
  });

  // Search query for filtering sectors/templates.
  const [query, setQuery] = useState("");

  const current = plannedLineup.find((tpl) => tpl.id === templateId);

  const toggleGroup = (sector: PlannedSector) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(sector)) {
        next.delete(sector);
      } else {
        next.add(sector);
      }
      return next;
    });
  };

  // Determine which groups to show and which are forced-expanded by search/active template.
  const normalizedQuery = query.trim().toLowerCase();
  const isSearching = normalizedQuery.length >= 2;

  const visibleGroups = TEMPLATE_GROUPS.filter(({ sector, items }) => {
    if (!isSearching) return true;
    const labelMatch = (SECTOR_LABELS[sector] ?? sector)
      .toLowerCase()
      .includes(normalizedQuery);
    const itemMatch = items.some((t) =>
      t.name.toLowerCase().includes(normalizedQuery)
    );
    return labelMatch || itemMatch;
  });

  const isSectorExpanded = (sector: PlannedSector) => {
    if (isSearching) return true;
    return openGroups.has(sector);
  };

  return (
    <section id="section-template">
      <button
        type="button"
        onClick={() => toggleSection("template")}
        className="flex w-full items-center justify-between gap-3 mb-3 text-left"
        aria-expanded={open}
        aria-label={open ? edit.collapseSection : edit.expandSection}
      >
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-sm font-semibold text-ink">
            {edit.sectionTemplate ?? "Tasarım · Şablon"}
          </h2>
          {current && (
            <span className="truncate text-xs text-ink-200">· {current.name}</span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={[
            "text-ink-200 shrink-0 motion-safe:transition-transform motion-safe:duration-200",
            open ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        />
      </button>

      <div hidden={!open} className="space-y-4">
        <p className="text-xs text-ink-200">
          {edit.templateHint ??
            "Bir tasarıma dokun — önizleme anında değişir, kaydedince yayına alınır."}
        </p>

        {/* Starter designs — the three generic layouts, shown first so the
            editor's design step matches /card/new. */}
        <div className="grid grid-cols-3 gap-2.5">
          {STARTER_DESIGNS.map((d) => {
            const selected = d.id === templateId;
            const label = q[d.labelKey];
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setTemplateId(d.id)}
                aria-pressed={selected}
                className={[
                  "flex flex-col items-center gap-1.5 rounded-2xl border p-2 transition-colors",
                  selected
                    ? "border-copper ring-2 ring-copper/40"
                    : "border-line hover:border-copper/50",
                ].join(" ")}
              >
                <span className="relative block aspect-[3/5] w-full overflow-hidden rounded-xl bg-bg-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb(d.id)}
                    alt={label}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center px-2 text-center text-[11px] font-medium text-ink-300">
                    {label}
                  </span>
                  {selected && (
                    <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-copper text-white shadow">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-medium text-ink">{label}</span>
              </button>
            );
          })}
        </div>

        {/* All designs — reveals the full sector catalog (was the default). */}
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-line bg-bg-0 px-3 py-2 text-sm font-medium text-ink-200 hover:border-copper/40"
          aria-expanded={showAll}
        >
          <span>{edit.allDesigns ?? "Tüm tasarımlar"}</span>
          <ChevronDown
            size={16}
            className={[
              "text-ink-300 motion-safe:transition-transform motion-safe:duration-150",
              showAll ? "rotate-180" : "",
            ].join(" ")}
            aria-hidden="true"
          />
        </button>

        {showAll && (
          <div className="space-y-4">
            <p className="text-xs text-ink-300">
              {edit.allDesignsHint ?? "Tüm tasarımları sektöre göre incele."}
            </p>

            {/* Search input */}
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={edit.templateSearch ?? "Sektör veya şablon ara…"}
              className="field mb-1 w-full text-sm"
            />

            {visibleGroups.map(({ sector, items }) => {
          const expanded = isSectorExpanded(sector);
          return (
            <div key={sector}>
              {/* Sector heading row — acts as collapse toggle */}
              <button
                type="button"
                onClick={() => toggleGroup(sector)}
                className="flex w-full items-center justify-between gap-2 py-1 text-left"
                aria-expanded={expanded}
              >
                <p className="mono-label text-[10px] uppercase tracking-wider text-ink-200">
                  {SECTOR_LABELS[sector] ?? sector}
                  <span className="ml-1.5 text-[10px] text-ink-300 normal-case tracking-normal">
                    ({items.length})
                  </span>
                </p>
                <ChevronDown
                  size={14}
                  className={[
                    "text-ink-300 shrink-0 motion-safe:transition-transform motion-safe:duration-150",
                    expanded ? "rotate-180" : "",
                  ].join(" ")}
                  aria-hidden="true"
                />
              </button>

              {/* Template grid — renders only when expanded */}
              {expanded && (
                <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {items.map((tpl) => {
                    const selected = tpl.id === templateId;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setTemplateId(tpl.id)}
                        aria-pressed={selected}
                        className={[
                          "group relative overflow-hidden rounded-xl border bg-bg-0 text-left transition-all",
                          selected
                            ? "border-copper ring-2 ring-copper/40"
                            : "border-line hover:border-copper/50 hover:shadow-md",
                        ].join(" ")}
                      >
                        <div className="flex aspect-[16/10] w-full items-center justify-center bg-bg-2 p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={thumb(tpl.id)}
                            alt={tpl.name}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-contain"
                          />
                        </div>
                        {selected && (
                          <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-copper text-white shadow">
                            <Check size={12} strokeWidth={3} />
                          </span>
                        )}
                        <p className="truncate px-2 py-1.5 text-[11px] font-medium text-ink">
                          {tpl.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
