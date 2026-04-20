"use client";

import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

export function ProblemOutcome() {
  const { t } = useLocale();
  const s = t.home.transformation;

  return (
    <section className="section hairline-t bg-paper-cool/40">
      <div className="container-wide">
        {/* Editorial header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 lg:mb-16">
          <AnimatedSection className="lg:col-span-7">
            <div className="mono-label mb-4">{s.label}</div>
            <h2 className="font-serif text-ink text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.06] tracking-[-0.02em] text-balance">
              {s.headline}
            </h2>
          </AnimatedSection>
        </div>

        {/* Before / After rows */}
        <div className="border-t border-ink/10">
          {s.items.map((item, i) => (
            <AnimatedSection
              key={i}
              delay={0.04 * i}
              className="border-b border-ink/10 grid grid-cols-1 md:grid-cols-[auto_1fr_auto_1fr] items-stretch"
            >
              {/* Index */}
              <div className="hidden md:flex items-center px-5 lg:px-8 py-6 border-r border-ink/10 bg-paper-warm">
                <span className="mono-label text-ink/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Before */}
              <div className="p-5 md:p-6 lg:p-7 bg-paper-warm/40 border-b md:border-b-0 md:border-r border-ink/10">
                <div className="mono-label text-ink/50 mb-2">Before</div>
                <p className="text-ink/60 text-body leading-relaxed line-through decoration-ink/25 text-pretty">
                  {item.before}
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center px-4 border-r border-ink/10 bg-paper-warm text-amber-700">
                <span aria-hidden="true" className="text-xl">
                  →
                </span>
              </div>

              {/* After */}
              <div className="p-5 md:p-6 lg:p-7 bg-paper">
                <div className="mono-label text-amber-700 mb-2">After</div>
                <p className="text-ink text-body leading-relaxed text-pretty">
                  {item.after}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
