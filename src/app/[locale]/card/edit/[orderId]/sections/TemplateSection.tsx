"use client";

// =============================================================================
// TemplateSection — lets the card owner switch the design template.
//
// Previously the template was locked after purchase. Owners ended up stuck on
// a design that did not fit their trade (e.g. a doctor on the artisan "Maker"
// shop template, showing un-editable "Atölyeden" shop sections). This section
// exposes the full v2 line-up grouped by sector so the owner can re-pick any
// time; the live preview re-renders instantly and the choice persists on save.
// =============================================================================

import { ChevronDown } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { plannedLineup, type PlannedSector } from "@/components/cards/templates/v2/registry";
import type { SectionToggle } from "./types";

interface TemplateSectionProps extends SectionToggle {
  templateId: number;
  setTemplateId: (id: number) => void;
}

// Human-readable group labels per sector. Kept short; the template names
// themselves carry the design intent.
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

// Preserve the sector order as it first appears in the planned line-up so the
// most common trades (real-estate, clinic, restaurant…) surface near the top.
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

  return (
    <section id="section-template">
      <button
        type="button"
        onClick={() => toggleSection("template")}
        className="flex w-full items-center justify-between gap-3 mt-8 mb-3 text-left"
        aria-expanded={openSections.has("template")}
        aria-label={
          openSections.has("template")
            ? edit.collapseSection
            : edit.expandSection
        }
      >
        <h2 className="font-serif text-lg text-ink">
          {edit.sectionTemplate ?? "Tasarım · Şablon"}
        </h2>
        <ChevronDown
          size={18}
          className={[
            "text-ink-300 shrink-0 motion-safe:transition-transform motion-safe:duration-200",
            openSections.has("template") ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        />
      </button>
      <div hidden={!openSections.has("template")} className="space-y-3">
        <p className="text-xs text-ink-300">
          {edit.templateHint ??
            "Kartının tasarımını dilediğin zaman değiştir — değişiklik anında önizlemede görünür, kaydedince yayına alınır."}
        </p>
        <label className="block">
          <span className="sr-only">{edit.templateLabel ?? "Şablon"}</span>
          <select
            className="field w-full"
            value={templateId}
            onChange={(e) => setTemplateId(Number(e.target.value))}
          >
            {groups.map(({ sector, items }) => (
              <optgroup key={sector} label={SECTOR_LABELS[sector] ?? sector}>
                {items.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        {current && (
          <p className="text-xs text-ink-300">
            {(edit.templateCurrent ?? "Seçili tasarım: {name}").replace(
              "{name}",
              current.name,
            )}
          </p>
        )}
      </div>
    </section>
  );
}
