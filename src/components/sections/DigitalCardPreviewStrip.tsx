"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { IPhoneMockup } from "@/components/shared/mockups";
import { INDUSTRY_DEMOS } from "@/components/products/DemoGallery";
import { useLocale } from "@/context/LocaleContext";

/**
 * Horizontal scroll carousel of 10 industry business card templates,
 * each shown inside a small iPhone mockup. On desktop, wraps to a grid
 * of 5; on mobile, snap-scroll horizontally.
 */
export function DigitalCardPreviewStrip() {
  const { t } = useLocale();
  const s = t.home.cardStrip;

  return (
    <section
      aria-labelledby="card-strip-heading"
      className="section-sm bg-white overflow-hidden"
    >
      <div className="container-wide">
        <AnimatedSection className="max-w-3xl mb-10 md:mb-12">
          <p className="eyebrow uppercase text-brand mb-3">{s.eyebrow}</p>
          <h2
            id="card-strip-heading"
            className="text-heading-lg font-extrabold tracking-[-0.02em] text-ink text-balance"
          >
            {s.heading}
          </h2>
          <p className="mt-4 text-ink/65 text-body leading-relaxed text-pretty">
            {s.paragraph}
          </p>
        </AnimatedSection>
      </div>

      {/* Full-bleed horizontal scroll */}
      <div className="relative">
        <div
          className="flex gap-5 md:gap-6 overflow-x-auto px-5 sm:px-6 lg:px-8 pb-6 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "thin" }}
        >
          {INDUSTRY_DEMOS.map((demo, i) => (
            <AnimatedSection
              key={demo.id}
              delay={i * 0.03}
              className="shrink-0 snap-start w-[180px] sm:w-[200px] md:w-[220px]"
            >
              <Link
                href="/products/digital-card"
                className="group block"
                aria-label={`Preview ${demo.industry} template`}
              >
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 p-3 md:p-4 transition-shadow duration-300 group-hover:shadow-lg border border-neutral-200/60">
                  <div className="pointer-events-none transition-transform duration-500 group-hover:scale-[1.03]">
                    <IPhoneMockup
                      src={demo.src}
                      title={`${demo.industry} template`}
                      loading={i < 3 ? "eager" : "lazy"}
                      scale="sm"
                    />
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-xs font-bold text-ink">{demo.industry}</p>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>

      <div className="container-wide">
        <AnimatedSection className="mt-4 md:mt-6 text-center">
          <Link
            href={s.ctaHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-600 transition-colors"
          >
            {s.ctaLabel}
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
