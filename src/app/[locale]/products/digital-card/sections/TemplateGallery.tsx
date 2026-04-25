"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { cardTemplates, formatEuro } from "@/config/card-templates";
import { SmartCard } from "@/components/cards/smart/SmartCard";
import { Check } from "lucide-react";
import type { CardData } from "@/lib/validation";

const SAMPLE: Record<"de" | "en" | "tr", CardData> = {
  de: {
    name: "Anna Fischer",
    title: "Inhaberin",
    company: "Studio Nord",
    phone: "+49 160 1234567",
    email: "anna@studio-nord.de",
    website: "https://studio-nord.de",
    bio: "Design und Beratung seit 2018.",
  },
  en: {
    name: "Anna Fischer",
    title: "Founder",
    company: "Studio Nord",
    phone: "+49 160 1234567",
    email: "anna@studio-nord.de",
    website: "https://studio-nord.de",
    bio: "Design and consulting since 2018.",
  },
  tr: {
    name: "Anna Fischer",
    title: "Kurucu",
    company: "Studio Nord",
    phone: "+49 160 1234567",
    email: "anna@studio-nord.de",
    website: "https://studio-nord.de",
    bio: "2018'den beri tasarım ve danışmanlık.",
  },
};

// Distinct color samples per template — gives the gallery visual variety
// without requiring a separate set of design tokens per card variant.
const SAMPLE_COLORS: Record<number, { primary: string; accent: string }> = {
  1: { primary: "#C27940", accent: "#1F2530" },
  2: { primary: "#2D6A4F", accent: "#1B2B23" },
  3: { primary: "#1D3557", accent: "#E63946" },
  4: { primary: "#6B4226", accent: "#F0A500" },
  5: { primary: "#4A0E8F", accent: "#FF6B6B" },
  6: { primary: "#1B2A4A", accent: "#C9A84C" },   // Anwalt
  7: { primary: "#1A1A1A", accent: "#F5C518" },   // Fotografie
  8: { primary: "#1B6B7B", accent: "#B8E4ED" },   // Arzt
  9: { primary: "#0D0D0D", accent: "#00E5FF" },   // Fitness
  10: { primary: "#140B1E", accent: "#8B5CF6" },  // DJ
  11: { primary: "#2C2C2C", accent: "#D4A574" },  // Architektur
  12: { primary: "#3D1A40", accent: "#F9A8C9" },  // E-Commerce
  13: { primary: "#1A3A4A", accent: "#D4AF37" },  // Hotel
  14: { primary: "#2D1B33", accent: "#FFB6C1" },  // Event
  15: { primary: "#1C2B3A", accent: "#FF6B00" },  // Bau
  16: { primary: "#0C3547", accent: "#F97316" },  // Tourismus
  17: { primary: "#0F1728", accent: "#A8B8D0" },  // Corporate
  18: { primary: "#0D0926", accent: "#06B6D4" },  // Tech
  19: { primary: "#0A0A0A", accent: "#C8A951" },  // Barbier
  20: { primary: "#1A2F23", accent: "#7EBA78" },  // Coaching
};

const SECTOR_LABELS: Record<string, string> = {
  all: "Alle",
  general: "Allgemein",
  restaurant: "Restaurant",
  clinic: "Klinik",
  lawyer: "Kanzlei",
  realEstate: "Immobilien",
  salon: "Salon",
  creator: "Kreativ",
  fitness: "Fitness",
  corporate: "Unternehmen",
  tech: "Technologie",
  events: "Events",
  hospitality: "Hotel",
  consultant: "Beratung",
  architecture: "Architektur",
  construction: "Handwerk",
  retail: "Boutique",
  tourism: "Tourismus",
  music: "Musik",
};

// SmartCard renders at max-w-[440px] (cover height + content). We scale to
// fit a 240×400 thumbnail tile. 240 / 440 ≈ 0.545.
const PREVIEW_WIDTH = 240;
const PREVIEW_HEIGHT = 400;
const SMARTCARD_INTRINSIC = 440;
const SCALE = PREVIEW_WIDTH / SMARTCARD_INTRINSIC;

export function TemplateGallery({
  selectedId,
  onSelect,
}: {
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const { locale, t } = useLocale();
  const sample = SAMPLE[locale as "de" | "en" | "tr"] ?? SAMPLE.de;
  const labels = t.products.digitalCard.order?.gallery ?? {
    title: "Wählen Sie ein Design",
    subtitle: "Jedes Design ist nummeriert. Geben Sie die Nummer bei Rückruf an.",
    selectCta: "Dieses Design wählen",
    selected: "Ausgewählt",
    fromPrice: "ab",
  };

  const [sectorFilter, setSectorFilter] = useState("all");
  const visible =
    sectorFilter === "all"
      ? cardTemplates
      : cardTemplates.filter((tpl) => tpl.sectorHint === sectorFilter);

  return (
    <section id="templates" className="py-16 md:py-24">
      <div className="container-wide">
        <div className="mb-10 md:mb-14">
          <h2 className="font-display text-display-sm text-ink">{labels.title}</h2>
          <p className="mt-3 max-w-xl text-body text-ink/60">{labels.subtitle}</p>
        </div>

        <div className="mb-8 -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
          {Object.entries(SECTOR_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSectorFilter(key)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                sectorFilter === key
                  ? "bg-ink text-white shadow-soft"
                  : "bg-neutral-100 text-ink/60 hover:bg-neutral-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((tpl) => {
            const isSelected = selectedId === tpl.id;
            const colors = SAMPLE_COLORS[tpl.id] ?? SAMPLE_COLORS[1];
            return (
              <div
                key={tpl.id}
                className={`group relative rounded-3xl border bg-white p-5 transition-shadow ${
                  isSelected
                    ? "border-brand shadow-card"
                    : "border-neutral-200 hover:shadow-card"
                }`}
              >
                <div className="absolute -top-3 left-5 z-10 rounded-full bg-ink px-3 py-1 font-mono text-xs font-semibold text-white shadow-soft">
                  #{String(tpl.id).padStart(2, "0")}
                </div>

                {/* Scaled SmartCard preview — pointer-events-none so the
                    card chrome cannot be interacted with from inside the
                    gallery tile. The clipped wrapper limits the tile's
                    visual footprint. */}
                <div
                  className="pointer-events-none mx-auto mt-2 overflow-hidden rounded-2xl bg-bg-1"
                  style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
                  aria-hidden
                >
                  <div
                    className="origin-top-left"
                    style={{
                      width: SMARTCARD_INTRINSIC,
                      transform: `scale(${SCALE})`,
                    }}
                  >
                    <SmartCard
                      slug={`preview-${tpl.id}`}
                      cardData={sample}
                      brandPrimaryHex={colors.primary}
                      brandAccentHex={colors.accent}
                      siteUrl=""
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-end justify-between gap-3">
                  <div>
                    <h3 className="text-heading-sm text-ink">{tpl.name}</h3>
                    <p className="mt-1 text-xs text-ink/50">
                      {labels.fromPrice} {formatEuro(tpl.oneTimeCents)}
                      {tpl.yearlyCents
                        ? ` · ${formatEuro(tpl.yearlyCents)}/Jahr`
                        : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelect(tpl.id)}
                    className={`btn-primary text-sm ${
                      isSelected ? "" : "bg-ink hover:bg-ink/90"
                    }`}
                  >
                    {isSelected && (
                      <Check size={14} strokeWidth={3} className="mr-1" />
                    )}
                    <span>
                      {isSelected ? labels.selected : labels.selectCta}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
