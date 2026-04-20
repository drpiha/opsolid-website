"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { ArrowRight, Check } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useLocale } from "@/context/LocaleContext";

export function ProductsTeaser() {
  const { t } = useLocale();
  const s = t.home.pricingPreview;

  return (
    <section className="section bg-neutral-50">
      <div className="container-wide">
        <AnimatedSection>
          <SectionHeading
            label={s.label}
            headline={s.headline}
            description={s.description}
            align="center"
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
          {s.cards.map((card, i) => {
            const isBrand = card.tone === "brand";
            return (
              <AnimatedSection key={i} delay={0.1 * i}>
                <div
                  className={`relative h-full rounded-3xl p-7 md:p-9 flex flex-col gap-6 transition-all duration-300 ${
                    isBrand
                      ? "bg-white border-2 border-brand shadow-lifted"
                      : "bg-ink text-white border border-white/10 shadow-card"
                  }`}
                >
                  <div>
                    <div
                      className={`eyebrow uppercase ${
                        isBrand ? "text-brand" : "text-white/60"
                      }`}
                    >
                      {card.title}
                    </div>
                    <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                      <span
                        className={`font-sans font-extrabold text-[clamp(2.25rem,4.5vw,3rem)] leading-none tracking-[-0.03em] ${
                          isBrand ? "text-ink" : "text-white"
                        }`}
                      >
                        {card.priceLabel}
                      </span>
                      <span
                        className={`text-sm ${
                          isBrand ? "text-ink/55" : "text-white/55"
                        }`}
                      >
                        {card.priceCadence}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 flex-1">
                    {card.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                            isBrand
                              ? "bg-brand/15 text-brand"
                              : "bg-white/10 text-white"
                          }`}
                          aria-hidden="true"
                        >
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span
                          className={`text-sm leading-relaxed text-pretty ${
                            isBrand ? "text-ink/80" : "text-white/80"
                          }`}
                        >
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={card.ctaHref}
                    className={
                      isBrand
                        ? "btn-primary w-full"
                        : "group inline-flex items-center justify-center gap-2 w-full rounded-full bg-white text-ink font-semibold px-6 py-3.5 hover:bg-brand hover:text-white transition-colors"
                    }
                  >
                    <span>{card.ctaLabel}</span>
                    <ArrowRight
                      size={16}
                      strokeWidth={2.5}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
