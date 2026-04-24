"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { useLocale } from "@/context/LocaleContext";
import { cardTemplates, formatEuro } from "@/config/card-templates";
import { TemplateRenderer } from "@/components/cards/TemplateRenderer";
import type { CardData } from "@/lib/validation";

// Sample data matches TemplateGallery so both surfaces tell the same story.
const SAMPLE: Record<"de" | "en" | "tr", CardData> = {
  de: {
    name: "Anna Fischer",
    title: "Inhaberin",
    company: "Studio Nord",
    phone: "+49 160 1234567",
    whatsapp: "+49 160 1234567",
    email: "anna@studio-nord.de",
    website: "https://studio-nord.de",
    bio: "Design und Beratung seit 2018.",
    socials: {
      linkedin: "https://linkedin.com/in/anna-fischer",
      instagram: "https://instagram.com/studio.nord",
    },
  },
  en: {
    name: "Anna Fischer",
    title: "Founder",
    company: "Studio Nord",
    phone: "+49 160 1234567",
    whatsapp: "+49 160 1234567",
    email: "anna@studio-nord.de",
    website: "https://studio-nord.de",
    bio: "Design and consulting since 2018.",
    socials: {
      linkedin: "https://linkedin.com/in/anna-fischer",
      instagram: "https://instagram.com/studio.nord",
    },
  },
  tr: {
    name: "Anna Fischer",
    title: "Kurucu",
    company: "Studio Nord",
    phone: "+49 160 1234567",
    whatsapp: "+49 160 1234567",
    email: "anna@studio-nord.de",
    website: "https://studio-nord.de",
    bio: "2018'den beri tasarım ve danışmanlık.",
    socials: {
      linkedin: "https://linkedin.com/in/anna-fischer",
      instagram: "https://instagram.com/studio.nord",
    },
  },
};

const SWIPE_THRESHOLD_PX = 48;

export function CardPreviewClient() {
  const { locale, t } = useLocale();
  const sample = SAMPLE[locale as "de" | "en" | "tr"] ?? SAMPLE.de;
  const labels = t.products.digitalCard.preview;

  const templates = useMemo(
    () => cardTemplates.filter((tpl) => tpl.isActive),
    [],
  );
  const total = templates.length;

  const [index, setIndex] = useState(0);
  const current = templates[index] ?? templates[0];

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      const wrapped = ((next % total) + total) % total;
      setIndex(wrapped);
    },
    [total],
  );
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    touchDeltaX.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const x = e.touches[0]?.clientX ?? touchStartX.current;
    touchDeltaX.current = x - touchStartX.current;
  };
  const onTouchEnd = () => {
    const delta = touchDeltaX.current;
    touchStartX.current = null;
    touchDeltaX.current = 0;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    if (delta < 0) goNext();
    else goPrev();
  };

  const priceLine = useMemo(() => {
    const one = formatEuro(current.oneTimeCents);
    const yearly = current.yearlyCents ? formatEuro(current.yearlyCents) : null;
    const monthly = current.monthlyCents
      ? formatEuro(current.monthlyCents)
      : null;
    const parts: string[] = [];
    if (yearly) parts.push(`${yearly} ${labels.priceYearly}`);
    if (monthly) parts.push(`${monthly} ${labels.priceMonthly}`);
    parts.push(`${one} ${labels.priceOneTime}`);
    return parts.join(" · ");
  }, [current, labels]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-50 py-12 sm:py-20">
      <div className="container-wide">
        <header className="mb-8 flex flex-col items-start gap-3 text-left sm:mb-12 sm:items-center sm:text-center">
          <span className="rounded-full border border-ink/10 bg-white px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/70">
            {labels.eyebrow}
          </span>
          <h1 className="font-display text-3xl leading-tight text-ink sm:text-display-sm md:text-display-md">
            {labels.title}
          </h1>
          <p className="max-w-xl text-body text-ink/60">{labels.subtitle}</p>
        </header>

        <div
          className="relative mx-auto w-full max-w-5xl select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          role="region"
          aria-roledescription="carousel"
          aria-label={labels.title}
        >
          <button
            type="button"
            onClick={goPrev}
            aria-label={labels.prev}
            className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white/90 p-3 text-ink shadow-soft backdrop-blur transition hover:bg-white hover:shadow-card md:flex"
          >
            <ArrowLeft size={20} strokeWidth={2.25} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label={labels.next}
            className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white/90 p-3 text-ink shadow-soft backdrop-blur transition hover:bg-white hover:shadow-card md:flex"
          >
            <ArrowRight size={20} strokeWidth={2.25} />
          </button>

          <div
            className="mx-auto flex max-w-md flex-col items-center gap-6 rounded-[36px] border border-ink/10 bg-white/60 p-5 shadow-card backdrop-blur-sm sm:p-8"
            key={current.id}
          >
            <div className="flex w-full items-center justify-between">
              <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs font-semibold text-white">
                #{String(current.id).padStart(2, "0")}
              </span>
              <span className="font-mono text-xs text-ink/50">
                {labels.counter
                  .replace("{{current}}", String(index + 1))
                  .replace("{{total}}", String(total))}
              </span>
            </div>

            <div className="w-full">
              <TemplateRenderer
                componentKey={current.componentKey}
                cardData={sample}
              />
            </div>

            <div className="w-full space-y-1 text-center">
              <h2 className="font-display text-heading-md text-ink">
                {current.name}
              </h2>
              <p className="text-xs text-ink/50">{priceLine}</p>
            </div>

            <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/products/digital-card?template=${current.id}#order`}
                className="btn-primary w-full justify-center text-center sm:w-auto"
              >
                {labels.orderCta}
              </Link>
              <Link
                href="/products/digital-card#templates"
                className="inline-flex w-full items-center justify-center rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-medium text-ink transition hover:border-ink/30 hover:bg-ink/5 sm:w-auto"
              >
                {labels.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 md:hidden">
            <button
              type="button"
              onClick={goPrev}
              aria-label={labels.prev}
              className="inline-flex items-center justify-center rounded-full border border-ink/10 bg-white p-3 text-ink shadow-soft"
            >
              <ArrowLeft size={18} strokeWidth={2.25} />
            </button>
            <span className="font-mono text-xs text-ink/60">
              {labels.hintSwipe}
            </span>
            <button
              type="button"
              onClick={goNext}
              aria-label={labels.next}
              className="inline-flex items-center justify-center rounded-full border border-ink/10 bg-white p-3 text-ink shadow-soft"
            >
              <ArrowRight size={18} strokeWidth={2.25} />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {templates.map((tpl, i) => {
              const active = i === index;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`${tpl.name} (#${String(tpl.id).padStart(2, "0")})`}
                  aria-current={active ? "true" : undefined}
                  className={`h-2.5 rounded-full transition-all ${
                    active
                      ? "w-8 bg-ink"
                      : "w-2.5 bg-ink/20 hover:bg-ink/40"
                  }`}
                />
              );
            })}
          </div>

          <p className="mt-4 hidden text-center text-xs text-ink/50 md:block">
            {labels.hintArrows}
          </p>
        </div>

        <div className="mx-auto mt-12 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
          {templates.map((tpl, i) => {
            const active = i === index;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => goTo(i)}
                className={`group flex items-center gap-2 rounded-2xl border p-3 text-left transition sm:flex-col sm:items-stretch sm:text-center ${
                  active
                    ? "border-ink bg-white shadow-card"
                    : "border-neutral-200 bg-white/70 hover:border-ink/40 hover:bg-white"
                }`}
              >
                <span className="rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] font-semibold text-white">
                  #{String(tpl.id).padStart(2, "0")}
                </span>
                <span className="flex-1 truncate text-xs font-medium text-ink sm:text-sm">
                  {tpl.name}
                </span>
                {active && (
                  <Check
                    size={14}
                    strokeWidth={3}
                    className="text-ink sm:mx-auto"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
