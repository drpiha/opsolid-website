"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { Sparkles, IdCard, Clock } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

const productIconMap: Record<string, React.ReactNode> = {
  sparkles: <Sparkles size={18} strokeWidth={1.25} />,
  idCard: <IdCard size={18} strokeWidth={1.25} />,
};

export function ProductsPage() {
  const { t } = useLocale();
  const p = t.products;

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="products-hero-title"
        className="relative overflow-hidden pt-28 md:pt-36 lg:pt-40 paper-grain"
      >
        <div className="hairline-b">
          <div className="container-wide flex items-center justify-between py-3">
            <span className="mono-label text-ink/60">
              [ OPSOLID · {p.hero.label.toUpperCase()} ]
            </span>
            <span className="mono-label hidden md:inline text-ink/40">
              {new Date().getFullYear()}
            </span>
          </div>
        </div>

        <div className="container-wide relative z-10 pt-12 md:pt-16 pb-10 md:pb-16">
          <AnimatedSection className="max-w-3xl">
            <h1
              id="products-hero-title"
              className="font-serif text-ink text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.025em] text-balance"
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
      <section className="section hairline-t bg-paper">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            {p.items.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.06}>
                <Link
                  href={item.href}
                  className="group block h-full rounded-2xl border border-ink/10 bg-paper-warm p-7 md:p-9 transition duration-300 hover:border-amber/60 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber focus-visible:outline-none"
                >
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/10 bg-paper text-ink">
                        {productIconMap[item.icon] || (
                          <Sparkles size={18} strokeWidth={1.25} />
                        )}
                      </div>
                      <div className="mono-label text-ink/50">
                        {String(i + 1).padStart(2, "0")} / PRODUCT
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 mono-label text-ink/60 hairline rounded-full px-2.5 py-1 bg-paper">
                      <span className="h-1.5 w-1.5 rounded-full bg-olive-600" />
                      {item.status}
                    </span>
                  </div>

                  <h2 className="font-serif text-ink text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.08] tracking-[-0.02em]">
                    {item.name}
                  </h2>
                  <p className="mt-2 mono-label text-ink/55">{item.tagline}</p>

                  <p className="mt-6 text-ink/75 text-body leading-relaxed text-pretty max-w-prose">
                    {item.description}
                  </p>

                  <span
                    aria-hidden="true"
                    className="mt-8 inline-flex items-center gap-2 text-ink/70 group-hover:text-amber-700 transition-colors text-sm"
                  >
                    <span className="mono-label">Explore</span>
                    <span className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </Link>
              </AnimatedSection>
            ))}

            {/* Coming soon placeholder */}
            <AnimatedSection delay={p.items.length * 0.06}>
              <div className="relative h-full rounded-2xl border border-dashed border-ink/15 bg-paper-cool/30 p-7 md:p-9">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/10 bg-paper text-ink/50">
                      <Clock size={18} strokeWidth={1.25} />
                    </div>
                    <div className="mono-label text-ink/45">
                      {String(p.items.length + 1).padStart(2, "0")} / NEXT
                    </div>
                  </div>
                  <span className="mono-label text-ink/45 hairline rounded-full px-2.5 py-1 bg-paper">
                    {p.comingSoonLabel}
                  </span>
                </div>

                <h3 className="font-serif text-ink/85 text-[clamp(1.5rem,2.5vw,2rem)] leading-[1.1] tracking-[-0.02em]">
                  {p.comingSoonTitle}
                </h3>
                <p className="mt-5 text-ink/65 text-body leading-relaxed text-pretty max-w-prose">
                  {p.comingSoonDescription}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
