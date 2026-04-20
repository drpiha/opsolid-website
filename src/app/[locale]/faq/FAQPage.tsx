"use client";

import { useState } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { Plus, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

export function FAQPage() {
  const { t } = useLocale();
  const s = t.faq;
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState("all");

  const toggle = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const categoryKeys = Object.keys(s.categories) as Array<keyof typeof s.categories>;

  const filteredItems =
    activeCategory === "all"
      ? s.items
      : s.items.filter((item) => item.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="faq-title"
        className="relative pt-32 md:pt-40 pb-10 md:pb-14 bg-white"
      >
        <div className="container-narrow text-center">
          <div className="eyebrow uppercase text-brand mb-4">{s.hero.label}</div>
          <h1
            id="faq-title"
            className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink text-balance"
          >
            {s.hero.headline}
          </h1>
          <p className="mt-6 text-ink/70 text-body-lg leading-relaxed text-pretty max-w-2xl mx-auto">
            {s.hero.description}
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="bg-white">
        <div className="container-wide py-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <FilterChip
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
            >
              {s.allFilter}
            </FilterChip>
            {categoryKeys.map((key) => (
              <FilterChip
                key={key}
                active={activeCategory === key}
                onClick={() => setActiveCategory(key)}
              >
                {s.categories[key]}
              </FilterChip>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="section-sm bg-white">
        <div className="container-narrow">
          <div className="border-t border-neutral-200">
            {filteredItems.map((item, i) => {
              const key = `${item.category}-${i}`;
              const isOpen = openItems[key];
              return (
                <AnimatedSection key={key} delay={i * 0.04}>
                  <div className="border-b border-neutral-200">
                    <button
                      onClick={() => toggle(key)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${key}`}
                      className="w-full flex items-center gap-5 text-left py-6 md:py-7 group focus-visible:outline-none"
                    >
                      <h2 className="flex-1 text-lg md:text-xl font-semibold text-ink tracking-[-0.015em] leading-snug text-balance group-hover:text-brand transition-colors">
                        {item.question}
                      </h2>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "shrink-0 flex h-9 w-9 items-center justify-center rounded-full text-brand transition-transform duration-300",
                          isOpen ? "rotate-45 bg-brand/10" : "rotate-0"
                        )}
                      >
                        <Plus size={18} strokeWidth={2.25} />
                      </span>
                    </button>

                    <div
                      id={`faq-panel-${key}`}
                      role="region"
                      className={cn(
                        "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-6 md:pb-8 pr-12">
                          <p className="text-ink/75 text-body leading-relaxed text-pretty">
                            {item.answer}
                          </p>
                          <div className="mt-4">
                            <span className="trust-pill">
                              {s.categories[
                                item.category as keyof typeof s.categories
                              ] || item.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-neutral-50">
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

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2",
        active
          ? "bg-ink text-white"
          : "bg-neutral-100 text-ink/70 hover:bg-neutral-200 hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}
