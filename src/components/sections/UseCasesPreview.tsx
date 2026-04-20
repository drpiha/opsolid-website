"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

export function UseCasesPreview() {
  const { t } = useLocale();
  const s = t.home.useCases;

  return (
    <section className="section hairline-t bg-paper">
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

        {/* Use case cards — three columns, equal cells */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-ink/10">
          {s.items.map((item, i) => (
            <AnimatedSection
              key={i}
              delay={0.04 * i}
              className="border-r border-b border-ink/10"
            >
              <Link
                href="/use-cases"
                className="group block h-full p-6 md:p-7 bg-paper-warm hover:bg-paper transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber focus-visible:outline-none"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="mono-label text-ink/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex-1 h-px bg-ink/10 group-hover:bg-amber/50 transition-colors duration-300"
                  />
                </div>

                <h3 className="font-serif text-ink text-[1.25rem] leading-[1.25] tracking-[-0.015em]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-ink/70 text-sm leading-relaxed text-pretty">
                  {item.description}
                </p>

                <span
                  aria-hidden="true"
                  className="mt-5 inline-flex items-center gap-1.5 text-ink/60 group-hover:text-amber-700 transition-colors"
                >
                  <span className="mono-label">View</span>
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
