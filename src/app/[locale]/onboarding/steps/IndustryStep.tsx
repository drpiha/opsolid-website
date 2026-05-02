"use client";

// =============================================================================
// IndustryStep — Faz 7.0a B0.7
//
// Visual industry picker. Each tile = an icon + label + 1-line preset
// description. Selecting a tile picks both the industry AND its canonical
// template (the first/base template in that group, e.g. id=9 "Architect" for
// the architecture row).
//
// "Surprise me" = uniformly random pick across all tiles.
// =============================================================================

import { useMemo } from "react";
import {
  Building2,
  Scale,
  Utensils,
  Camera,
  Stethoscope,
  Music,
  Scissors,
  ShoppingBag,
  Compass,
  Dumbbell,
  Hotel,
  Briefcase,
  Cpu,
  Calendar,
  Smile,
  HeartPulse,
  Sparkles,
  Calculator,
  Code,
  Mic,
  Flower2,
  PartyPopper,
  Car,
  Sofa,
} from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import type { OnboardingState } from "../OnboardingClient";

interface Props {
  value: OnboardingState;
  onChange: (patch: Partial<OnboardingState>) => void;
  onNext: () => void;
}

interface IndustryTile {
  key: string;
  /** Translation key under t.onboarding.industry.categories */
  i18nKey: keyof IndustryCategories;
  /** Canonical templateId for this industry — matches v2/registry.ts */
  templateId: number;
  Icon: React.ComponentType<{ size?: number | string; className?: string }>;
  /** Default brand primary hex applied if user doesn't pick a color later */
  defaultBrandHex: string;
}

// Mirrors the categories shape declared in src/content/en.ts.
interface IndustryCategories {
  architecture: string;
  legal: string;
  restaurant: string;
  photography: string;
  clinic: string;
  music: string;
  barber: string;
  retail: string;
  realEstate: string;
  fitness: string;
  hospitality: string;
  consulting: string;
  tech: string;
  events: string;
  dentist: string;
  psychologist: string;
  beauty: string;
  accounting: string;
  software: string;
  contentCreator: string;
  wellness: string;
  eventPlanner: string;
  auto: string;
  interior: string;
}

// Curated lineup — one canonical template per sector, cross-referenced with
// templateRegistry ids in src/components/cards/templates/v2/registry.ts.
const INDUSTRIES: readonly IndustryTile[] = [
  { key: "architecture", i18nKey: "architecture", templateId: 9, Icon: Compass, defaultBrandHex: "#1f2937" },
  { key: "legal", i18nKey: "legal", templateId: 2, Icon: Scale, defaultBrandHex: "#1e3a8a" },
  { key: "restaurant", i18nKey: "restaurant", templateId: 14, Icon: Utensils, defaultBrandHex: "#7c2d12" },
  { key: "photography", i18nKey: "photography", templateId: 4, Icon: Camera, defaultBrandHex: "#0f172a" },
  { key: "clinic", i18nKey: "clinic", templateId: 5, Icon: Stethoscope, defaultBrandHex: "#0e7490" },
  { key: "music", i18nKey: "music", templateId: 6, Icon: Music, defaultBrandHex: "#312e81" },
  { key: "barber", i18nKey: "barber", templateId: 7, Icon: Scissors, defaultBrandHex: "#111827" },
  { key: "retail", i18nKey: "retail", templateId: 8, Icon: ShoppingBag, defaultBrandHex: "#854d0e" },
  { key: "realEstate", i18nKey: "realEstate", templateId: 1, Icon: Building2, defaultBrandHex: "#1a365d" },
  { key: "fitness", i18nKey: "fitness", templateId: 10, Icon: Dumbbell, defaultBrandHex: "#991b1b" },
  { key: "hospitality", i18nKey: "hospitality", templateId: 15, Icon: Hotel, defaultBrandHex: "#78350f" },
  { key: "consulting", i18nKey: "consulting", templateId: 13, Icon: Briefcase, defaultBrandHex: "#1f2937" },
  { key: "tech", i18nKey: "tech", templateId: 16, Icon: Cpu, defaultBrandHex: "#0f172a" },
  { key: "events", i18nKey: "events", templateId: 21, Icon: Calendar, defaultBrandHex: "#831843" },
  { key: "dentist", i18nKey: "dentist", templateId: 22, Icon: Smile, defaultBrandHex: "#0e7490" },
  { key: "psychologist", i18nKey: "psychologist", templateId: 25, Icon: HeartPulse, defaultBrandHex: "#3730a3" },
  { key: "beauty", i18nKey: "beauty", templateId: 28, Icon: Sparkles, defaultBrandHex: "#9d174d" },
  { key: "accounting", i18nKey: "accounting", templateId: 31, Icon: Calculator, defaultBrandHex: "#1e3a8a" },
  { key: "software", i18nKey: "software", templateId: 34, Icon: Code, defaultBrandHex: "#1e293b" },
  { key: "contentCreator", i18nKey: "contentCreator", templateId: 37, Icon: Mic, defaultBrandHex: "#7c3aed" },
  { key: "wellness", i18nKey: "wellness", templateId: 40, Icon: Flower2, defaultBrandHex: "#15803d" },
  { key: "eventPlanner", i18nKey: "eventPlanner", templateId: 43, Icon: PartyPopper, defaultBrandHex: "#9d174d" },
  { key: "auto", i18nKey: "auto", templateId: 46, Icon: Car, defaultBrandHex: "#1e293b" },
  { key: "interior", i18nKey: "interior", templateId: 49, Icon: Sofa, defaultBrandHex: "#78350f" },
];

export function IndustryStep({ value, onChange, onNext }: Props) {
  const { t } = useLocale();

  const tiles = useMemo(() => INDUSTRIES, []);

  const handlePick = (tile: IndustryTile) => {
    onChange({
      industryKey: tile.key,
      templateId: tile.templateId,
      brandPrimaryHex: value.brandPrimaryHex ?? tile.defaultBrandHex,
    });
    // Defer so the state commit lands before the parent flips the step.
    setTimeout(onNext, 60);
  };

  const handleSurprise = () => {
    const pick = tiles[Math.floor(Math.random() * tiles.length)];
    handlePick(pick);
  };

  return (
    <section className="mx-auto max-w-[1080px]">
      <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t.onboarding.industry.title}
          </h1>
          <p className="mt-2 max-w-[42ch] text-sm text-ink-300 sm:text-base">
            {t.onboarding.industry.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSurprise}
          className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-bg-1 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-copper hover:text-copper sm:self-auto"
        >
          <Sparkles size={14} />
          {t.onboarding.industry.surpriseMe}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {tiles.map((tile) => {
          const Icon = tile.Icon;
          const label = t.onboarding.industry.categories[tile.i18nKey];
          const description = t.onboarding.industry.descriptions[tile.i18nKey];
          const selected = value.industryKey === tile.key;
          return (
            <button
              key={tile.key}
              type="button"
              onClick={() => handlePick(tile)}
              className={[
                "group relative flex h-full flex-col items-start gap-3 overflow-hidden rounded-2xl border p-5 text-left transition-all",
                "hover:-translate-y-0.5 hover:border-copper hover:shadow-[0_18px_40px_-22px_rgba(194,121,64,0.4)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper/40",
                selected
                  ? "border-copper bg-copper-50/40"
                  : "border-line bg-bg-1",
              ].join(" ")}
              aria-pressed={selected}
            >
              <span
                className={[
                  "flex h-11 w-11 items-center justify-center rounded-xl border transition-colors",
                  selected
                    ? "border-copper bg-copper text-white"
                    : "border-line bg-bg-0 text-ink group-hover:border-copper-300 group-hover:text-copper",
                ].join(" ")}
                style={{ backgroundColor: selected ? tile.defaultBrandHex : undefined }}
              >
                <Icon size={20} />
              </span>
              <div className="space-y-1">
                <div className="font-display text-base font-semibold leading-tight text-ink">
                  {label}
                </div>
                <p className="text-xs leading-snug text-ink-300">
                  {description}
                </p>
              </div>
              <div
                aria-hidden
                className={[
                  "pointer-events-none absolute inset-x-5 bottom-3 h-px transition-colors",
                  selected ? "bg-copper" : "bg-transparent group-hover:bg-line",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
