"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

export function CTASection() {
  const { t } = useLocale();
  const s = t.home.cta;

  return (
    <section className="hairline-t bg-ink text-paper paper-grain">
      <div className="container-wide section">
        <AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-7">
              <div className="mono-label text-paper/60 mb-5">
                Ready when you are
              </div>
              <h2 className="font-serif text-paper text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.02] tracking-[-0.025em] text-balance">
                {s.headline}
              </h2>
              <p className="mt-6 max-w-xl text-paper/70 text-body-lg leading-relaxed text-pretty">
                {s.description}
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start gap-5 lg:items-end lg:justify-end">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2.5 bg-amber text-ink px-7 py-4 font-medium hairline hover:bg-paper transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
              >
                <span>{s.primaryCta}</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
              <span className="mono-label text-paper/50">
                hasan.doenmez@opsolid.de
              </span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
