"use client";

import { ReactNode } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Check, ChevronDown, ArrowRight, Sparkles } from "lucide-react";

/* ------------------------------------------------------------------------ */
/*  Content type                                                             */
/* ------------------------------------------------------------------------ */

export interface ProductPageContent {
  hero: {
    eyebrow: string;
    title: readonly string[];
    paragraph: string;
    primaryCta: string;
    secondaryCta: string;
    tags: string;
    startingPrice: string;
  };
  features: {
    label: string;
    heading: string;
    items: readonly {
      label: string;
      body: string;
    }[];
  };
  howItWorks: {
    label: string;
    heading: string;
    steps: readonly {
      step: string;
      title: string;
      body: string;
    }[];
  };
  stack: {
    label: string;
    heading: string;
    items: readonly {
      name: string;
      role: string;
    }[];
  };
  pricing: {
    label: string;
    heading: string;
    tiers: readonly {
      name: string;
      price: string;
      billing: string;
      features: readonly string[];
      cta: string;
      featured?: string;
    }[];
  };
  faq: {
    label: string;
    heading: string;
    items: readonly {
      q: string;
      a: string;
    }[];
  };
  cta: {
    heading: string;
    paragraph: string;
    primaryCta: string;
    secondaryCta: string;
  };
}

interface ProductPageLayoutProps {
  content: ProductPageContent;
  heroMockup: ReactNode;
  liveDemo?: ReactNode;
}

/* ------------------------------------------------------------------------ */
/*  Component                                                                */
/* ------------------------------------------------------------------------ */

export function ProductPageLayout({
  content,
  heroMockup,
  liveDemo,
}: ProductPageLayoutProps) {
  const tags = content.hero.tags.split("·").map((t) => t.trim()).filter(Boolean);

  return (
    <>
      {/* ================================================================ */}
      {/*  Hero                                                             */}
      {/* ================================================================ */}
      <section
        aria-labelledby="product-hero-title"
        className="relative overflow-hidden pt-32 md:pt-40 pb-12 md:pb-20 bg-white"
      >
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
            {/* Text */}
            <AnimatedSection>
              <p className="eyebrow uppercase text-brand mb-5 font-mono">
                {content.hero.eyebrow}
              </p>
              <h1
                id="product-hero-title"
                className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink text-balance"
              >
                {content.hero.title.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="mt-6 md:mt-8 text-ink/70 text-body-lg leading-relaxed max-w-xl text-pretty">
                {content.hero.paragraph}
              </p>

              {/* Tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-ink/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Starting price chip */}
              <div className="mt-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-4 py-1.5 text-sm font-semibold text-brand">
                  <Sparkles size={14} strokeWidth={2.5} />
                  {content.hero.startingPrice}
                </span>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary">
                  {content.hero.primaryCta}
                </Link>
                <a href="#how-it-works" className="btn-ghost">
                  {content.hero.secondaryCta}
                </a>
              </div>
            </AnimatedSection>

            {/* Mockup */}
            <AnimatedSection delay={0.15} className="flex justify-center lg:justify-end">
              {heroMockup}
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  Features                                                         */}
      {/* ================================================================ */}
      <section className="section-sm bg-neutral-50" aria-labelledby="features-heading">
        <div className="container-wide">
          <AnimatedSection className="max-w-3xl mb-10 md:mb-14">
            <p className="eyebrow uppercase text-brand mb-3">
              {content.features.label}
            </p>
            <h2
              id="features-heading"
              className="text-heading-lg font-extrabold tracking-[-0.02em] text-ink text-balance"
            >
              {content.features.heading}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {content.features.items.map((feat, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <div className="pop-card h-full p-6 md:p-7">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-brand">
                    {feat.label}
                  </p>
                  <p className="mt-3 text-ink text-body leading-relaxed text-pretty">
                    {feat.body}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  How it works                                                     */}
      {/* ================================================================ */}
      <section
        id="how-it-works"
        className="section-sm bg-white"
        aria-labelledby="how-heading"
      >
        <div className="container-wide">
          <AnimatedSection className="max-w-3xl mb-10 md:mb-14">
            <p className="eyebrow uppercase text-brand mb-3">
              {content.howItWorks.label}
            </p>
            <h2
              id="how-heading"
              className="text-heading-lg font-extrabold tracking-[-0.02em] text-ink text-balance"
            >
              {content.howItWorks.heading}
            </h2>
          </AnimatedSection>

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {content.howItWorks.steps.map((step, i) => (
              <AnimatedSection key={i} delay={i * 0.06}>
                <li className="rounded-3xl bg-neutral-50 p-6 md:p-7 h-full border border-neutral-100 list-none">
                  <p className="text-4xl font-extrabold tracking-tight text-brand leading-none">
                    {step.step}
                  </p>
                  <h3 className="mt-4 text-base font-bold text-ink leading-snug">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink/65 leading-relaxed text-pretty">
                    {step.body}
                  </p>
                </li>
              </AnimatedSection>
            ))}
          </ol>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  Tech stack transparency                                          */}
      {/* ================================================================ */}
      <section
        className="section-sm bg-neutral-50"
        aria-labelledby="stack-heading"
      >
        <div className="container-wide">
          <AnimatedSection className="max-w-3xl mb-8 md:mb-10">
            <p className="eyebrow uppercase text-brand mb-3">
              {content.stack.label}
            </p>
            <h2
              id="stack-heading"
              className="text-heading-lg font-extrabold tracking-[-0.02em] text-ink text-balance"
            >
              {content.stack.heading}
            </h2>
          </AnimatedSection>

          <AnimatedSection>
            <div className="flex flex-wrap gap-3">
              {content.stack.items.map((tool, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-5 py-3 shadow-sm"
                >
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <div>
                    <p className="text-sm font-bold text-ink leading-none">
                      {tool.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-ink/55">{tool.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  Live demo (optional)                                             */}
      {/* ================================================================ */}
      {liveDemo && (
        <section
          className="section-sm bg-gradient-to-b from-white to-neutral-50"
          aria-labelledby="live-demo-heading"
        >
          <div className="container-wide">
            <AnimatedSection className="max-w-3xl mb-10 md:mb-12 mx-auto text-center">
              <p className="eyebrow uppercase text-brand mb-3">SEE IT LIVE</p>
              <h2
                id="live-demo-heading"
                className="text-heading-lg font-extrabold tracking-[-0.02em] text-ink text-balance"
              >
                A working preview — no slide deck.
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.1} className="flex justify-center">
              {liveDemo}
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/*  Pricing                                                          */}
      {/* ================================================================ */}
      <section className="section-sm bg-white" aria-labelledby="pricing-heading">
        <div className="container-wide">
          <AnimatedSection className="max-w-3xl mb-10 md:mb-14">
            <p className="eyebrow uppercase text-brand mb-3">
              {content.pricing.label}
            </p>
            <h2
              id="pricing-heading"
              className="text-heading-lg font-extrabold tracking-[-0.02em] text-ink text-balance"
            >
              {content.pricing.heading}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {content.pricing.tiers.map((tier, i) => {
              const isFeatured = tier.featured === "true";
              return (
                <AnimatedSection key={i} delay={i * 0.08}>
                  <div
                    className={`relative h-full rounded-3xl p-7 md:p-8 flex flex-col ${
                      isFeatured
                        ? "border-2 border-brand bg-white shadow-[0_20px_60px_-15px_rgba(230,57,70,0.25)]"
                        : "border border-neutral-200 bg-white"
                    }`}
                  >
                    {isFeatured && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        Popular
                      </span>
                    )}

                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wider text-ink/60">
                        {tier.name}
                      </p>
                      <p className="mt-3 text-4xl font-extrabold tracking-tight text-ink">
                        {tier.price}
                      </p>
                      <p className="mt-1 text-xs text-ink/55">{tier.billing}</p>
                    </div>

                    <ul className="mt-6 space-y-3 flex-1">
                      {tier.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded-full ${
                              isFeatured
                                ? "bg-brand/15 text-brand"
                                : "bg-neutral-100 text-ink"
                            }`}
                            aria-hidden="true"
                          >
                            <Check size={12} strokeWidth={3} />
                          </span>
                          <span className="text-sm text-ink/80 leading-relaxed text-pretty">
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/contact"
                      className={`mt-7 ${isFeatured ? "btn-primary" : "btn-ghost"} w-full`}
                    >
                      {tier.cta}
                    </Link>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  FAQ                                                              */}
      {/* ================================================================ */}
      <section className="section-sm bg-neutral-50" aria-labelledby="faq-heading">
        <div className="container-wide max-w-4xl">
          <AnimatedSection className="mb-10 md:mb-12">
            <p className="eyebrow uppercase text-brand mb-3">
              {content.faq.label}
            </p>
            <h2
              id="faq-heading"
              className="text-heading-lg font-extrabold tracking-[-0.02em] text-ink text-balance"
            >
              {content.faq.heading}
            </h2>
          </AnimatedSection>

          <div className="space-y-3">
            {content.faq.items.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.04}>
                <details className="group rounded-2xl border border-neutral-200 bg-white p-5 md:p-6 transition-colors [&[open]]:border-ink/20">
                  <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                    <h3 className="text-base md:text-lg font-bold text-ink text-balance leading-snug">
                      {item.q}
                    </h3>
                    <ChevronDown
                      size={20}
                      strokeWidth={2}
                      className="mt-0.5 shrink-0 text-ink/50 transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-3 text-sm md:text-base text-ink/70 leading-relaxed text-pretty">
                    {item.a}
                  </p>
                </details>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  Final CTA                                                        */}
      {/* ================================================================ */}
      <section className="bg-ink text-white">
        <div className="container-wide py-20 md:py-28">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white text-balance">
              {content.cta.heading}
            </h2>
            <p className="mt-5 md:mt-6 text-lg text-white/70 leading-relaxed text-pretty">
              {content.cta.paragraph}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-primary">
                {content.cta.primaryCta}
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-semibold text-white hover:bg-white/10 transition-colors"
              >
                {content.cta.secondaryCta}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
