"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { MapPin } from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

export function AboutPage() {
  const { t } = useLocale();
  const s = t.about;

  return (
    <>
      {/* Hero — editorial two column */}
      <section
        aria-labelledby="about-title"
        className="relative pt-32 md:pt-40 pb-12 md:pb-16 paper-grain overflow-hidden"
      >
        <div className="hairline-b">
          <div className="container-wide flex items-center justify-between py-3">
            <span className="mono-label text-ink/60">
              [ ABOUT · 03 ]   STUDIO
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
                id="about-title"
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

      {/* Story — pullquote + paragraphs */}
      <section className="hairline-t section-sm">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <AnimatedSection className="lg:col-span-5">
              <div className="mono-label mb-5">[ 01 ] ORIGIN</div>
              <h2 className="font-serif text-ink text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] tracking-[-0.02em] text-balance">
                {s.story.headline}
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.15} className="lg:col-span-7">
              <div className="space-y-5">
                {s.story.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-ink/75 text-body leading-relaxed text-pretty"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values — bento */}
      <section className="hairline-t bg-paper-warm/40 section-sm">
        <div className="container-wide">
          <AnimatedSection className="max-w-2xl mb-10 md:mb-14">
            <div className="mono-label mb-5">[ 02 ] APPROACH</div>
            <h2 className="font-serif text-ink text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] tracking-[-0.02em] text-balance">
              {s.values.headline}
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-6 gap-5 md:gap-6">
            {s.values.items.map((value, i) => {
              // Bento layout: first value spans 4, next 3 values span 2 each
              const span =
                i === 0
                  ? "lg:col-span-4 lg:row-span-1"
                  : i === 1
                  ? "lg:col-span-2"
                  : i === 2
                  ? "lg:col-span-3"
                  : "lg:col-span-3";
              return (
                <StaggerItem
                  key={i}
                  className={span}
                >
                  <div className="hairline bg-paper-warm h-full p-6 sm:p-8 rounded-2xl transition duration-300 hover:border-ink/25 hover:-translate-y-0.5">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-amber"
                      />
                      <span className="mono-label text-ink/60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-serif text-ink text-[1.375rem] md:text-[1.5rem] leading-[1.2] tracking-[-0.015em] mb-3 text-balance">
                      {value.title}
                    </h3>
                    <p className="text-ink/70 text-sm leading-relaxed text-pretty">
                      {value.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Founder — portrait placeholder + bio */}
      <section className="hairline-t section-sm">
        <div className="container-wide">
          <AnimatedSection className="mb-10 md:mb-14 max-w-2xl">
            <div className="mono-label mb-5">[ 03 ] FOUNDER</div>
            <h2 className="font-serif text-ink text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] tracking-[-0.02em] text-balance">
              {s.founder.name}
            </h2>
            <p className="mt-3 text-ink/60 text-body">
              {s.founder.title}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Portrait frame */}
            <AnimatedSection className="lg:col-span-5">
              <div className="relative aspect-[4/5] hairline bg-paper-warm overflow-hidden">
                {/* Typographic portrait placeholder — intentional, no stock photo */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <span className="font-serif text-[clamp(6rem,14vw,10rem)] leading-[0.9] text-ink/90 tracking-[-0.04em]">
                    HD
                  </span>
                  <span className="mt-6 mono-label text-ink/50">
                    {s.founder.name}
                  </span>
                </div>
                {/* Hairline corners */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 h-3 w-3 border-l border-t border-ink/30" />
                  <div className="absolute top-4 right-4 h-3 w-3 border-r border-t border-ink/30" />
                  <div className="absolute bottom-4 left-4 h-3 w-3 border-l border-b border-ink/30" />
                  <div className="absolute bottom-4 right-4 h-3 w-3 border-r border-b border-ink/30" />
                </div>
              </div>
              <p className="mt-4 mono-label text-ink/50">
                PORTRAIT · STUDIO
              </p>
            </AnimatedSection>

            {/* Bio */}
            <AnimatedSection delay={0.15} className="lg:col-span-7">
              {(s.founder as { education?: string }).education && (
                <p className="mono-label text-ink/50 mb-4">
                  {(s.founder as { education?: string }).education}
                </p>
              )}

              <p className="text-ink/80 text-body-lg leading-relaxed text-pretty">
                {s.founder.description}
              </p>

              {(s.founder as { expertise?: string[] }).expertise &&
                ((s.founder as { expertise?: string[] }).expertise ?? []).length > 0 && (
                  <div className="mt-8">
                    <p className="mono-label text-ink/50 mb-3">
                      {(s.founder as { expertiseLabel?: string }).expertiseLabel}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {((s.founder as { expertise?: string[] }).expertise ?? []).map(
                        (skill, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center rounded-full hairline bg-paper-warm px-3 py-1 font-mono text-[0.6875rem] tracking-[0.14em] uppercase text-ink/70"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

              <div className="mt-8 flex items-center gap-2 text-sm text-ink/50">
                <MapPin size={14} aria-hidden="true" />
                <span>{s.founder.footnote}</span>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA — ink block */}
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
