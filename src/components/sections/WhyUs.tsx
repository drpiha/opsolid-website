"use client";

import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

export function WhyUs() {
  const { t } = useLocale();
  const s = t.home.whyUs;

  return (
    <section className="section bg-ink text-paper paper-grain relative">
      <div className="container-wide relative z-10">
        {/* Editorial two-column header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 lg:mb-16">
          <AnimatedSection className="lg:col-span-7">
            <div className="mono-label text-paper/60 mb-4">{s.label}</div>
            <h2 className="font-serif text-paper text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.06] tracking-[-0.02em] text-balance">
              {s.headline}
            </h2>
          </AnimatedSection>
        </div>

        {/* Reasons — hairline grid on ink */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-paper/10 max-w-5xl">
          {s.points.map((point, i) => (
            <AnimatedSection
              key={i}
              delay={0.05 + i * 0.06}
              className="border-r border-b border-paper/10 p-6 md:p-8 flex flex-col gap-3 group"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-amber"
                />
                <span className="mono-label text-paper/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-serif text-paper text-[1.375rem] leading-[1.2] tracking-[-0.015em]">
                {point.title}
              </h3>
              <p className="text-paper/70 text-sm leading-relaxed text-pretty">
                {point.description}
              </p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
