"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { cardTemplates, formatEuro, type CardTemplateDef } from "@/config/card-templates";
import { Check, ImageOff } from "lucide-react";

// Distinct color samples per template — drives the gradient placeholder when
// the static thumbnail under /images/templates/card-XX.png is missing. We keep
// the full table here (rather than reading from card-sectors.ts) so designers
// can tune the placeholder without touching the live render colors.
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

export function TemplateGallery({
  selectedId,
  onSelect,
}: {
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const { t } = useLocale();
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
                className={`group relative rounded-3xl border bg-white p-5 transition-all duration-300 ${
                  isSelected
                    ? "scale-[1.015] border-copper/60 shadow-card ring-2 ring-copper/40"
                    : "border-neutral-200 hover:-translate-y-0.5 hover:shadow-card"
                }`}
              >
                <div className="absolute -top-3 left-5 z-10 rounded-full bg-ink px-3 py-1 font-mono text-xs font-semibold text-white shadow-soft">
                  #{String(tpl.id).padStart(2, "0")}
                </div>

                <ThumbnailWithFallback template={tpl} colors={colors} />

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

// -----------------------------------------------------------------------------
// ThumbnailWithFallback — renders the static preview at /images/templates/...
// and gracefully degrades to a branded gradient placeholder when the file is
// missing (most thumbnails are placeholder until the design pass ships).
//
// The placeholder is intentionally premium: layered radial gradients keyed off
// the template's hex colors, an embossed initial mark, and a subtle "no preview
// yet" hint with a vignette ring. This way an unfinished gallery still looks
// intentional rather than broken.
// -----------------------------------------------------------------------------

function ThumbnailWithFallback({
  template,
  colors,
}: {
  template: CardTemplateDef;
  colors: { primary: string; accent: string };
}) {
  const [errored, setErrored] = useState(false);

  return (
    <div className="relative mx-auto mt-2 aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-neutral-200/80 shadow-[0_18px_36px_-22px_rgba(15,15,15,0.35)]">
      {!errored ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={template.previewPath}
          alt={template.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <ThumbnailPlaceholder
          name={template.name}
          id={template.id}
          colors={colors}
        />
      )}

      {/* Top-edge gloss — gives every tile a slight three-dimensional pickup
          regardless of whether the image or the placeholder is showing. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}

function ThumbnailPlaceholder({
  name,
  id,
  colors,
}: {
  name: string;
  id: number;
  colors: { primary: string; accent: string };
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || `#${id}`;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      style={{
        background: `
          radial-gradient(120% 70% at 18% 12%, ${hexA(colors.accent, 0.42)}, transparent 55%),
          radial-gradient(120% 90% at 100% 100%, ${hexA(colors.primary, 0.55)}, transparent 60%),
          linear-gradient(155deg, ${colors.primary} 0%, ${darken(colors.primary)} 65%, #0a0a0a 100%)
        `,
      }}
    >
      {/* Subtle inner ring — adds depth without competing with the type. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-xl"
        style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}
      />

      {/* Initial mark — embossed, monospace for cleanliness. */}
      <div
        className="font-mono text-5xl font-light tracking-[0.04em] text-white/95"
        style={{
          textShadow: "0 2px 12px rgba(0,0,0,0.45)",
        }}
      >
        {initials}
      </div>

      <div
        className="mt-3 h-px w-12"
        style={{ background: hexA(colors.accent, 0.6) }}
      />

      <p className="mt-3 max-w-[18ch] font-display text-sm leading-snug text-white/85">
        {name}
      </p>

      <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 backdrop-blur">
        <ImageOff size={11} strokeWidth={2} />
        Vorschau folgt
      </span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Tiny color helpers — kept inline so the gallery file stays self-contained.
// The placeholder is the only consumer; promoting these to a shared util would
// be premature.
// -----------------------------------------------------------------------------

function hexA(hex: string, alpha: number): string {
  const m = /^#?([a-f0-9]{6})$/i.exec(hex);
  if (!m) return `rgba(20,20,20,${alpha})`;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function darken(hex: string): string {
  const m = /^#?([a-f0-9]{6})$/i.exec(hex);
  if (!m) return "#0a0a0a";
  const n = parseInt(m[1], 16);
  const r = Math.max(0, Math.round(((n >> 16) & 0xff) * 0.55));
  const g = Math.max(0, Math.round(((n >> 8) & 0xff) * 0.55));
  const b = Math.max(0, Math.round((n & 0xff) * 0.55));
  return `rgb(${r}, ${g}, ${b})`;
}
