"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { MapPin, ArrowRight } from "lucide-react";
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
      {/* Hero */}
      <section
        aria-labelledby="about-title"
        className="relative pt-32 md:pt-40 pb-12 md:pb-16 bg-white"
      >
        <div className="container-wide">
          <AnimatedSection className="max-w-3xl">
            <div className="eyebrow uppercase text-brand mb-4">{s.hero.label}</div>
            <h1
              id="about-title"
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

      {/* Story */}
      <section className="section-sm bg-neutral-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <AnimatedSection className="lg:col-span-5">
              <div className="eyebrow uppercase text-ink/50 mb-4">Origin</div>
              <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-ink text-balance">
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

      {/* Values — 3-col pop cards */}
      <section className="section-sm bg-white">
        <div className="container-wide">
          <AnimatedSection className="max-w-2xl mb-10 md:mb-14">
            <div className="eyebrow uppercase text-ink/50 mb-4">Approach</div>
            <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-ink text-balance">
              {s.values.headline}
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {s.values.items.map((value, i) => (
              <StaggerItem key={i}>
                <div className="pop-card h-full p-7 md:p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand text-xs font-bold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-ink tracking-[-0.02em] mb-3 text-balance">
                    {value.title}
                  </h3>
                  <p className="text-sm text-ink/70 leading-relaxed text-pretty">
                    {value.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Founder */}
      <section className="section-sm bg-neutral-50">
        <div className="container-wide">
          <AnimatedSection className="mb-10 md:mb-14 max-w-2xl">
            <div className="eyebrow uppercase text-ink/50 mb-4">Founder</div>
            <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-ink text-balance">
              {s.founder.name}
            </h2>
            <p className="mt-3 text-ink/60 text-body">{s.founder.title}</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Portrait placeholder — typographic square */}
            <AnimatedSection className="lg:col-span-5">
              <div className="pop-card relative aspect-square overflow-hidden p-0">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-neutral-100 to-white">
                  <span className="text-[clamp(6rem,14vw,10rem)] font-black leading-[0.9] text-ink tracking-[-0.05em]">
                    HD
                  </span>
                  <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink/50">
                    {s.founder.name}
                  </span>
                </div>
              </div>
            </AnimatedSection>

            {/* Bio */}
            <AnimatedSection delay={0.15} className="lg:col-span-7">
              {(s.founder as { education?: string }).education && (
                <p className="eyebrow uppercase text-ink/50 mb-4">
                  {(s.founder as { education?: string }).education}
                </p>
              )}

              <p className="text-ink/80 text-body-lg leading-relaxed text-pretty">
                {s.founder.description}
              </p>

              {(s.founder as { expertise?: string[] }).expertise &&
                ((s.founder as { expertise?: string[] }).expertise ?? []).length > 0 && (
                  <div className="mt-8">
                    <p className="eyebrow uppercase text-ink/50 mb-3">
                      {(s.founder as { expertiseLabel?: string }).expertiseLabel}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {((s.founder as { expertise?: string[] }).expertise ?? []).map(
                        (skill, i) => (
                          <span key={i} className="trust-pill">
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
