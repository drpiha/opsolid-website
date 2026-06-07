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

import { ChevronDown, Check } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { plannedLineup, type PlannedSector } from "@/components/cards/templates/v2/registry";
import type { SectionToggle } from "./types";

interface TemplateSectionProps extends SectionToggle {
  templateId: number;
  setTemplateId: (id: number) => void;
}

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

function groupBySector() {
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
}

export default function TemplateSection({
  templateId,
  setTemplateId,
  openSections,
  toggleSection,
}: TemplateSectionProps) {
  const { t } = useLocale();
  const edit = t.products.digitalCard.edit as Record<string, string>;
  const groups = groupBySector();
  const current = plannedLineup.find((tpl) => tpl.id === templateId);
  const open = openSections.has("template");

  return (
    <section id="section-template">
      <button
        type="button"
        onClick={() => toggleSection("template")}
        className="flex w-full items-center justify-between gap-3 mt-8 mb-3 text-left"
        aria-expanded={open}
        aria-label={open ? edit.collapseSection : edit.expandSection}
      >
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="font-serif text-lg text-ink">
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

        {groups.map(({ sector, items }) => (
          <div key={sector} className="space-y-2">
            <p className="mono-label text-[10px] uppercase tracking-wider text-ink-200">
              {SECTOR_LABELS[sector] ?? sector}
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
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
                        : "border-line hover:border-copper/50",
                    ].join(" ")}
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden bg-bg-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumb(tpl.id)}
                        alt={tpl.name}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition-transform group-hover:scale-[1.03]"
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
          </div>
        ))}
      </div>
    </section>
  );
}
