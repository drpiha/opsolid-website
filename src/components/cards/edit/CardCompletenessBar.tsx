"use client";

// =============================================================================
// CardCompletenessBar — WS-3. A compact, LIVE completeness indicator pinned to
// the top of the editor. Pure client-side: it reads the in-memory CardData
// (plus the photo/logo paths, which live outside cardData) and recomputes on
// every keystroke — no DB fetch, no stale score. Each missing item has a "Go"
// button that opens + scrolls to the right section via onNavigate.
//
// Replaces the old CardStrengthPanel, whose engine read dead v1 field names
// (socialLinks / sections / ctaButtons / locales / vcardEnabled) and only
// fetched once on mount.
// =============================================================================

import { useMemo } from "react";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import type { CardData } from "@/lib/validation";
import { useLocale } from "@/context/LocaleContext";

interface Props {
  cardData: CardData;
  photoPath: string | null;
  logoPath: string | null;
  /** Opens + scrolls to a section. targetSection matches handleNavigateToSection
   *  ("brand" | "content" | "contact" | "publish"). All basic fields live in
   *  the person-brand section, so every item points there. */
  onNavigate: (targetSection: string) => void;
}

export function CardCompletenessBar({
  cardData,
  photoPath,
  logoPath,
  onNavigate,
}: Props) {
  const { t } = useLocale();
  const e = t.products.digitalCard.edit;

  const checks = useMemo(() => {
    const socials = cardData.socials ?? {};
    const hasSocial = Object.values(socials).some(
      (v) => typeof v === "string" && v.trim().length > 0,
    );
    const hasContact = [
      cardData.phone,
      cardData.email,
      cardData.whatsapp,
      cardData.website,
    ].some((v) => typeof v === "string" && v.trim().length > 0);

    return [
      { key: "name", label: e.completenessName, done: !!cardData.name?.trim() },
      { key: "jobTitle", label: e.completenessJobTitle, done: !!cardData.title?.trim() },
      { key: "company", label: e.completenessCompany, done: !!cardData.company?.trim() },
      { key: "photo", label: e.completenessPhoto, done: !!photoPath },
      { key: "logo", label: e.completenessLogo, done: !!logoPath },
      { key: "contact", label: e.completenessContact, done: hasContact },
      { key: "social", label: e.completenessSocial, done: hasSocial },
      { key: "bio", label: e.completenessBio, done: !!cardData.bio?.trim() },
    ];
  }, [cardData, photoPath, logoPath, e]);

  const done = checks.filter((x) => x.done).length;
  const total = checks.length;
  const pct = total === 0 ? 100 : Math.round((done / total) * 100);
  const missing = checks.filter((x) => !x.done);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink">{e.completenessTitle}</p>
        <span className="shrink-0 text-xs font-semibold text-copper-700">
          {pct}% ·{" "}
          {e.completenessSummary
            .replace("{done}", String(done))
            .replace("{total}", String(total))}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-copper-500 motion-safe:transition-[width] motion-safe:duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {missing.length === 0 ? (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-200">
          <CheckCircle2 size={14} className="shrink-0 text-copper-600" />
          {e.completenessAllDone}
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {missing.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => onNavigate("brand")}
              aria-label={`${m.label} — ${e.completenessGoto}`}
              className="group inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-ink-200 transition-colors hover:border-copper/50 hover:text-ink"
            >
              <Circle size={9} strokeWidth={2.5} className="shrink-0 text-ink-400" />
              {m.label}
              <ArrowRight
                size={11}
                aria-hidden="true"
                className="text-copper-600 opacity-60 group-hover:opacity-100"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
