"use client";

import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

export function HowWeWork() {
  const { t } = useLocale();
  const s = t.home.howWeWork;

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
            <p className="text-ink/70 text-body leading-relaxed text-pretty">
              A four-step engagement: discover, design, build, improve.
              Each step ends with a concrete artifact you can review.
            </p>
          </AnimatedSection>
        </div>

        {/* Process steps — hairline grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-ink/10">
          {s.steps.map((step, i) => (
            <AnimatedSection
              key={i}
              delay={0.05 + i * 0.08}
              className="relative border-r border-b border-ink/10 p-6 md:p-8 bg-paper-warm flex flex-col gap-4 group"
            >
              {/* Step number — large serif numeral */}
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-[3rem] leading-none text-ink/15 group-hover:text-amber/60 transition-colors duration-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mono-label text-ink/50">{step.step}</span>
              </div>

              <h3 className="font-serif text-ink text-[1.375rem] leading-[1.2] tracking-[-0.015em]">
                {step.title}
              </h3>
              <p className="text-ink/70 text-sm leading-relaxed text-pretty">
                {step.description}
              </p>

              {/* Amber indicator line on hover */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 h-px w-0 bg-amber transition-[width] duration-500 group-hover:w-full"
              />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
