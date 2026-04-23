"use client";

import { useLocale } from "@/context/LocaleContext";
import { cardTemplates, formatEuro } from "@/config/card-templates";
import { TemplateRenderer } from "@/components/cards/TemplateRenderer";
import { Check } from "lucide-react";

const SAMPLE = {
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
} as const;

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

  return (
    <section id="templates" className="py-16 md:py-24">
      <div className="container-wide">
        <div className="mb-10 md:mb-14">
          <h2 className="font-display text-display-sm text-ink">{labels.title}</h2>
          <p className="mt-3 max-w-xl text-body text-ink/60">{labels.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cardTemplates.map((t) => {
            const isSelected = selectedId === t.id;
            return (
              <div
                key={t.id}
                className={`group relative rounded-3xl border bg-white p-5 transition-shadow ${
                  isSelected
                    ? "border-brand shadow-card"
                    : "border-neutral-200 hover:shadow-card"
                }`}
              >
                <div className="absolute -top-3 left-5 z-10 rounded-full bg-ink px-3 py-1 font-mono text-xs font-semibold text-white shadow-soft">
                  #{String(t.id).padStart(2, "0")}
                </div>

                <div className="pointer-events-none mx-auto mt-2 max-w-[320px] scale-[0.88] origin-top transition-transform group-hover:scale-[0.92]">
                  <TemplateRenderer
                    componentKey={t.componentKey}
                    cardData={sample}
                  />
                </div>

                <div className="mt-6 flex items-end justify-between gap-3">
                  <div>
                    <h3 className="text-heading-sm text-ink">{t.name}</h3>
                    <p className="mt-1 text-xs text-ink/50">
                      {labels.fromPrice} {formatEuro(t.oneTimeCents)}
                      {t.yearlyCents
                        ? ` · ${formatEuro(t.yearlyCents)}/Jahr`
                        : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelect(t.id)}
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
