"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

export function CTASection() {
  const { t } = useLocale();
  const s = t.home.finalCta;

  return (
    <section className="section bg-ink text-white relative overflow-hidden">
      {/* Ambient red glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[70rem] h-[40rem] rounded-full bg-brand/25 blur-3xl"
      />

      <div className="container-wide relative">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center">
            <div className="eyebrow uppercase text-brand-300 mb-5">
              {s.eyebrow}
            </div>
            <h2 className="font-sans font-extrabold text-white text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.04] tracking-[-0.035em] text-balance">
              {s.headline}
            </h2>
            <p className="mt-6 text-body-lg text-white/70 max-w-xl mx-auto leading-relaxed text-pretty">
              {s.description}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href={s.primaryCtaHref} className="btn-primary">
                <span>{s.primaryCtaLabel}</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <Link
                href={s.secondaryCtaHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 text-white font-semibold px-6 py-3.5 hover:bg-white hover:text-ink transition-colors"
              >
                <span>{s.secondaryCtaLabel}</span>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
