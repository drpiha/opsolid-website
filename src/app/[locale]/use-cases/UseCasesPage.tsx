"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { ArrowRight } from "lucide-react";
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

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="usecases-title"
        className="relative pt-32 md:pt-40 pb-12 md:pb-16 bg-white"
      >
        <div className="container-wide">
          <AnimatedSection className="max-w-3xl">
            <div className="eyebrow uppercase text-brand mb-4">{s.hero.label}</div>
            <h1
              id="usecases-title"
              className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink text-balance"
            >
              {s.hero.headline}
            </h1>
            <p className="mt-6 md:mt-8 text-ink/70 text-body-lg leading-relaxed max-w-2xl text-pretty">
              {s.hero.description}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Use case grid — 3-per-row pop cards */}
      <section className="section-sm bg-neutral-50">
        <div className="container-wide">
          <AnimatedSection className="mb-10 md:mb-14 max-w-2xl">
            <div className="eyebrow uppercase text-ink/50 mb-4">Scenarios</div>
            <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-ink text-balance">
              Automation, applied to real operations
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {s.items.map((item, i) => {
              const Icon = useCaseIcons[i];
              return (
                <StaggerItem key={i}>
                  <div className="pop-card h-full p-7 md:p-8 flex flex-col">
                    <div className="mb-5">{Icon && <Icon />}</div>

                    <h3 className="text-xl md:text-2xl font-bold text-ink tracking-[-0.02em] mb-4 text-balance">
                      {item.title}
                    </h3>

                    <div className="space-y-4 flex-1">
                      <div>
                        <div className="eyebrow uppercase text-ink/50 mb-1.5">
                          {s.labels.context}
                        </div>
                        <p className="text-sm text-ink/75 leading-relaxed text-pretty">
                          {item.context}
                        </p>
                      </div>

                      <div>
                        <div className="eyebrow uppercase text-ink/50 mb-1.5">
                          {s.labels.problem}
                        </div>
                        <p className="text-sm text-ink/75 leading-relaxed text-pretty">
                          {item.problem}
                        </p>
                      </div>

                      <div>
                        <div className="eyebrow uppercase text-ink/50 mb-1.5">
                          {s.labels.solution}
                        </div>
                        <p className="text-sm text-ink/75 leading-relaxed text-pretty">
                          {item.solution}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-neutral-200">
                      <div className="eyebrow uppercase text-brand mb-1.5">
                        {s.labels.outcome}
                      </div>
                      <p className="text-sm text-ink font-semibold leading-relaxed text-pretty">
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
      <section className="section-sm bg-white">
        <div className="container-wide">
          <AnimatedSection>
            <div className="pop-card p-10 md:p-14 text-center max-w-3xl mx-auto">
              <div className="eyebrow uppercase text-brand mb-4">Next step</div>
              <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink text-balance">
                {s.cta.headline}
              </h2>
              <p className="mt-5 max-w-xl mx-auto text-ink/70 text-body leading-relaxed text-pretty">
                {s.cta.description}
              </p>
              <div className="mt-8 flex justify-center">
                <Link href="/contact" className="btn-primary">
                  <span>{s.cta.primaryCta}</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
