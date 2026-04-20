"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { Inbox, Bot, Layers } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

export function ProductsTeaser() {
  const { t } = useLocale();
  const p = t.products;
  const kutasia = p.items[0];

  if (!kutasia) return null;

  const features = [
    { icon: Inbox, label: "Unified Inbox", detail: "IG · WhatsApp · Email" },
    { icon: Bot, label: "AI Analysis", detail: "Sentiment · Intent · Signal" },
    { icon: Layers, label: "Sector Templates", detail: "15+ industries" },
  ];

  return (
    <section className="section hairline-t bg-paper">
      <div className="container-wide">
        {/* Editorial header */}
        <AnimatedSection className="max-w-3xl mb-10 lg:mb-14">
          <div className="mono-label mb-4">{p.hero.label}</div>
          <h2 className="font-serif text-ink text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.06] tracking-[-0.02em] text-balance">
            {p.hero.headline}
          </h2>
          <p className="mt-5 text-ink/70 text-body-lg leading-relaxed text-pretty">
            {p.hero.description}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <Link
            href={kutasia.href}
            className="group block border border-ink/10 bg-paper-warm rounded-2xl overflow-hidden hover:border-amber/60 hover:-translate-y-0.5 transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber focus-visible:outline-none"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
              {/* Left — content */}
              <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-between gap-8 border-b lg:border-b-0 lg:border-r border-ink/10">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <h3 className="font-serif text-ink text-[1.75rem] md:text-[2.25rem] leading-[1.05] tracking-[-0.02em]">
                      {kutasia.name}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-olive/50 bg-olive/15 px-2.5 py-0.5 font-mono text-[0.625rem] tracking-[0.12em] uppercase text-olive-700">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-olive-600"
                      />
                      {kutasia.status}
                    </span>
                  </div>
                  <p className="mono-label text-ink/60 mb-4">
                    {kutasia.tagline}
                  </p>
                  <p className="text-ink/75 text-body leading-relaxed max-w-lg text-pretty">
                    {kutasia.description}
                  </p>
                </div>

                <span
                  aria-hidden="true"
                  className="inline-flex items-center gap-2.5 text-ink group-hover:text-amber-700 transition-colors"
                >
                  <span className="text-sm underline underline-offset-8 decoration-ink/20 group-hover:decoration-amber-700">
                    Explore {kutasia.name}
                  </span>
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </div>

              {/* Right — feature list on ink surface */}
              <div className="relative bg-ink text-paper paper-grain p-8 md:p-10 lg:p-12 flex flex-col justify-center gap-4">
                {features.map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={feat.label}
                      className="flex items-center gap-4 border-b border-paper/10 pb-4 last:border-b-0 last:pb-0"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-paper/15 text-amber-400">
                        <Icon size={18} strokeWidth={1.5} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-serif text-paper text-base leading-tight">
                          {feat.label}
                        </div>
                        <div className="mono-label text-paper/50 mt-1">
                          {feat.detail}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
