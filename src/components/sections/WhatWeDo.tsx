"use client";

import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

export function WhatWeDo() {
  const { t } = useLocale();
  const s = t.home.whatWeDo;

  return (
    <section className="section hairline-t bg-paper">
      <div className="container-wide">
        {/* Editorial two-column header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 lg:mb-16">
          <AnimatedSection className="lg:col-span-7">
            <div className="mono-label mb-4">{s.label}</div>
            <h2 className="font-serif text-ink text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.06] tracking-[-0.02em] text-balance">
              {s.headline}
            </h2>
          </AnimatedSection>

          <AnimatedSection
            delay={0.1}
            className="lg:col-span-5 lg:pt-2 flex items-start"
          >
            <p className="text-ink/70 text-body-lg leading-relaxed text-pretty">
              {s.description}
            </p>
          </AnimatedSection>
        </div>

        {/* Points grid — hairline cells */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-ink/10">
          {s.points.map((point, i) => (
            <AnimatedSection
              key={i}
              delay={0.05 + i * 0.05}
              className="border-r border-b border-ink/10 p-6 md:p-8 bg-paper-warm flex flex-col gap-3"
            >
              <div className="mono-label text-ink/50">
                {String(i + 1).padStart(2, "0")}
              </div>
              <p className="text-ink text-body leading-relaxed text-pretty">
                {point}
              </p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
