"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { ArrowRight, ArrowUpRight, Sparkles, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

const productIconMap: Record<string, React.ReactNode> = {
  sparkles: <Sparkles size={22} />,
};

export function ProductsPage() {
  const { t } = useLocale();
  const p = t.products;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24 gradient-hero-mesh">
        <div className="absolute top-24 left-[12%] w-72 h-72 bg-brand-500/12 rounded-full blur-[110px]" />
        <div className="absolute bottom-0 right-[10%] w-80 h-80 bg-teal-500/10 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-500/6 rounded-full blur-[140px]" />

        <div className="container-wide relative z-10">
          <AnimatedSection className="max-w-3xl">
            <Badge variant="gradient" className="mb-5">{p.hero.label}</Badge>
            <h1 className="text-display-sm md:text-display font-bold text-white text-balance">
              {p.hero.headline}
            </h1>
            <p className="mt-6 text-body-lg text-slate-300 leading-relaxed max-w-2xl">
              {p.hero.description}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-20 md:pb-28 pt-14 md:pt-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {p.items.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <Link
                  href={item.href}
                  className="group relative block h-full rounded-2xl border border-slate-200/70 bg-white p-8 md:p-10 transition-all duration-300 hover:border-brand-300 hover:shadow-[0_25px_60px_-20px_rgba(37,99,235,0.25)] hover:-translate-y-1 overflow-hidden"
                >
                  {/* Decorative gradient glow */}
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-brand-500/10 via-teal-500/8 to-accent-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-teal-500 text-white shadow-[0_8px_24px_-8px_rgba(20,184,166,0.5)]">
                          {productIconMap[item.icon] || <Sparkles size={22} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-2xl md:text-[1.7rem] font-bold text-slate-900 tracking-tight">
                              {item.name}
                            </h2>
                            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[0.65rem] font-semibold text-teal-700 uppercase tracking-wider">
                              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                              {item.status}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm text-slate-500 font-medium">
                            {item.tagline}
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight
                        size={20}
                        className="shrink-0 text-slate-300 group-hover:text-brand-600 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                      />
                    </div>

                    <p className="text-body text-slate-500 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-brand-600 group-hover:text-brand-700">
                      {item.name}
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}

            {/* Coming soon placeholder */}
            <AnimatedSection delay={p.items.length * 0.1}>
              <div className="relative h-full rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50/60 to-white p-8 md:p-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-brand-500/5 to-teal-500/5 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-6">
                    <Clock size={22} />
                  </div>
                  <Badge variant="default" className="mb-3">{p.comingSoonLabel}</Badge>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {p.comingSoonTitle}
                  </h3>
                  <p className="mt-3 text-body text-slate-500 leading-relaxed">
                    {p.comingSoonDescription}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
