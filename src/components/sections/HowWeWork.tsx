"use client";

import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useLocale } from "@/context/LocaleContext";

export function HowWeWork() {
  const { t } = useLocale();
  const s = t.home.howItWorks;

  return (
    <section className="section bg-white">
      <div className="container-wide">
        <AnimatedSection>
          <SectionHeading
            label={s.label}
            headline={s.headline}
            align="center"
          />
        </AnimatedSection>

        <div className="relative">
          {/* Desktop connector — thin dotted line between numbers */}
          <div
            className="hidden lg:block absolute left-0 right-0 top-[2.75rem] pointer-events-none"
            aria-hidden="true"
          >
            <div className="container-wide">
              <svg
                className="mx-auto w-[60%] h-[2px]"
                viewBox="0 0 100 2"
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="1"
                  x2="100"
                  y2="1"
                  stroke="#E5E5E5"
                  strokeWidth="1"
                  strokeDasharray="1 2"
                />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12 relative">
            {s.steps.map((step, i) => (
              <AnimatedSection
                key={i}
                delay={0.1 * i}
                className="flex flex-col items-center text-center"
              >
                {/* Large outlined number */}
                <div className="relative w-[5.5rem] h-[5.5rem] rounded-full bg-white border-2 border-brand flex items-center justify-center shadow-soft mb-6">
                  <span className="font-sans font-black text-brand text-[2.75rem] leading-none">
                    {i + 1}
                  </span>
                </div>

                <h3 className="text-heading font-bold text-ink mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-body text-ink/60 leading-relaxed max-w-xs text-pretty">
                  {step.description}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
