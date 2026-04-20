"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { Sparkles, IdCard, BellRing, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

const productIconMap: Record<string, React.ReactNode> = {
  sparkles: <Sparkles size={22} strokeWidth={1.75} />,
  idCard: <IdCard size={22} strokeWidth={1.75} />,
  bell: <BellRing size={22} strokeWidth={1.75} />,
};

export function ProductsPage() {
  const { t } = useLocale();
  const p = t.products;

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="products-hero-title"
        className="relative overflow-hidden pt-32 md:pt-40 pb-10 md:pb-14 bg-white"
      >
        <div className="container-wide">
          <AnimatedSection className="max-w-3xl">
            <div className="eyebrow uppercase text-brand mb-4">
              {p.hero.label}
            </div>
            <h1
              id="products-hero-title"
              className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink text-balance"
            >
              {p.hero.headline}
            </h1>
            <p className="mt-6 md:mt-8 text-ink/70 text-body-lg leading-relaxed max-w-2xl text-pretty">
              {p.hero.description}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Products grid */}
      <section className="section-sm bg-neutral-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {p.items.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.06}>
                <Link
                  href={item.href}
                  className="pop-card group block h-full p-7 md:p-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2"
                >
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-ink">
                      {productIconMap[item.icon] || (
                        <Sparkles size={22} strokeWidth={1.75} />
                      )}
                    </div>
                    <span className="trust-pill">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      {item.status}
                    </span>
                  </div>

                  <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-ink">
                    {item.name}
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-brand">
                    {item.tagline}
                  </p>

                  <p className="mt-5 text-ink/70 text-body leading-relaxed text-pretty">
                    {item.description}
                  </p>

                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink group-hover:text-brand transition-colors">
                    <span>Explore</span>
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
