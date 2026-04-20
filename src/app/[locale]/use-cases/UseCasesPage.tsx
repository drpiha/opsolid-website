"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";
import { useCaseIcons } from "@/components/illustrations/UseCaseIcons";

export function UseCasesPage() {
  const { t } = useLocale();
  const s = t.useCases;

  // Bento pattern — first 2 cards span wider, rest are half-width
  const bentoSpan = (i: number) => {
    if (i === 0 || i === 1) return "lg:col-span-3";
    return "lg:col-span-3"; // all equal by default, but some feature wider below
  };

  return (
    <>
      {/* Hero — editorial two-column */}
      <section
        aria-labelledby="usecases-title"
        className="relative pt-32 md:pt-40 pb-12 md:pb-16 paper-grain overflow-hidden"
      >
        <div className="hairline-b">
          <div className="container-wide flex items-center justify-between py-3">
            <span className="mono-label text-ink/60">
              [ USE CASES · 05 ]   SCENARIOS
            </span>
            <span className="mono-label hidden md:inline text-ink/40">
              {new Date().getFullYear()}
            </span>
          </div>
        </div>

        <div className="container-wide relative z-10 pt-10 md:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-7 animate-fade-in">
              <div className="mono-label text-ink/60 mb-5">{s.hero.label}</div>
              <h1
                id="usecases-title"
                className="font-serif text-ink text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.04] tracking-[-0.025em] text-balance"
              >
                {s.hero.headline}
              </h1>
            </div>

            <div className="lg:col-span-5 lg:pt-6 animate-fade-in">
              <p className="text-ink/70 text-body-lg leading-relaxed text-pretty">
                {s.hero.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use case cards — bento */}
      <section className="hairline-t section-sm">
        <div className="container-wide">
          <AnimatedSection className="mb-10 md:mb-14 max-w-2xl">
            <div className="mono-label mb-5">[ 01 ] SCENARIOS</div>
            <h2 className="font-serif text-ink text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] tracking-[-0.02em] text-balance">
              Automation, applied to real operations
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-6 gap-5 md:gap-6">
            {s.items.map((item, i) => {
              const Icon = useCaseIcons[i];
              // First 2 cards are feature-sized (span 6 together = 3+3 wide), rest are half
              const span = bentoSpan(i);
              return (
                <StaggerItem key={i} className={span}>
                  <div className="hairline bg-paper-warm h-full p-6 sm:p-8 rounded-2xl transition duration-300 hover:border-ink/25 hover:-translate-y-0.5 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="shrink-0">
                        {Icon && <Icon />}
                      </div>
                      <span className="mono-label text-ink/40 pt-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="font-serif text-ink text-[1.375rem] md:text-[1.625rem] leading-[1.15] tracking-[-0.015em] mb-5 text-balance">
                      {item.title}
                    </h3>

                    <div className="space-y-4 flex-1">
                      <div>
                        <div className="mono-label text-ink/50 mb-1.5">
                          {s.labels.context}
                        </div>
                        <p className="text-sm text-ink/75 leading-relaxed text-pretty">
                          {item.context}
                        </p>
                      </div>

                      <div>
                        <div className="mono-label text-ink/50 mb-1.5">
                          {s.labels.problem}
                        </div>
                        <p className="text-sm text-ink/75 leading-relaxed text-pretty">
                          {item.problem}
                        </p>
                      </div>

                      <div>
                        <div className="mono-label text-ink/50 mb-1.5">
                          {s.labels.solution}
                        </div>
                        <p className="text-sm text-ink/75 leading-relaxed text-pretty">
                          {item.solution}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 hairline-t">
                      <div className="mono-label text-amber-700 mb-1.5">
                        {s.labels.outcome}
                      </div>
                      <p className="text-sm text-ink font-medium leading-relaxed text-pretty">
                        {item.outcome}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="hairline-t bg-ink text-paper paper-grain">
        <div className="container-wide section">
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
              <div className="lg:col-span-7">
                <div className="mono-label text-paper/60 mb-5">
                  [ NEXT ]   CONVERSATION
                </div>
                <h2 className="font-serif text-paper text-[clamp(2rem,5vw,3.75rem)] leading-[1.04] tracking-[-0.025em] text-balance">
                  {s.cta.headline}
                </h2>
                <p className="mt-5 max-w-xl text-paper/70 text-body-lg leading-relaxed text-pretty">
                  {s.cta.description}
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start gap-5 lg:items-end lg:justify-end">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2.5 bg-amber text-ink px-7 py-4 font-medium hairline hover:bg-paper transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
                >
                  <span>{s.cta.primaryCta}</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
