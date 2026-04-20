"use client";

import { useState } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { ChevronDown } from "lucide-react";
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
        className="relative pt-32 md:pt-40 pb-12 md:pb-16 paper-grain overflow-hidden"
      >
        <div className="hairline-b">
          <div className="container-wide flex items-center justify-between py-3">
            <span className="mono-label text-ink/60">
              [ FAQ · 06 ]   QUESTIONS
            </span>
            <span className="mono-label hidden md:inline text-ink/40">
              {new Date().getFullYear()}
            </span>
          </div>
        </div>

        <div className="container-narrow relative z-10 pt-10 md:pt-16 text-center">
          <div className="mono-label text-ink/60 mb-5">{s.hero.label}</div>
          <h1
            id="faq-title"
            className="font-serif text-ink text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.04] tracking-[-0.025em] text-balance"
          >
            {s.hero.headline}
          </h1>
          <p className="mt-6 text-ink/70 text-body-lg leading-relaxed text-pretty max-w-2xl mx-auto">
            {s.hero.description}
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="hairline-t">
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
      <section className="hairline-t section-sm">
        <div className="container-narrow">
          <div className="hairline-t">
            {filteredItems.map((item, i) => {
              const key = `${item.category}-${i}`;
              const isOpen = openItems[key];
              const index = String(i + 1).padStart(2, "0");
              return (
                <AnimatedSection key={key} delay={i * 0.04}>
                  <div className="hairline-b">
                    <button
                      onClick={() => toggle(key)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${key}`}
                      className="w-full flex items-start gap-5 md:gap-6 text-left py-6 md:py-7 group focus-visible:outline-none"
                    >
                      <span className="mono-label text-ink/50 pt-2 shrink-0 hidden sm:block">
                        Q · {index}
                      </span>
                      <h2 className="flex-1 font-serif text-ink text-[1.25rem] md:text-[1.5rem] leading-[1.2] tracking-[-0.015em] text-balance group-hover:text-ink/80 transition-colors">
                        {item.question}
                      </h2>
                      <ChevronDown
                        size={20}
                        aria-hidden="true"
                        className={cn(
                          "shrink-0 mt-1.5 text-amber transition-transform duration-300",
                          isOpen && "rotate-180"
                        )}
                      />
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
                        <div className="pb-6 md:pb-8 sm:pl-[4.25rem] pr-8">
                          <p className="text-ink/75 text-body leading-relaxed text-pretty">
                            {item.answer}
                          </p>
                          <div className="mt-4">
                            <span className="mono-label text-ink/50">
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
      <section className="hairline-t bg-ink text-paper paper-grain">
        <div className="container-wide section">
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
              <div className="lg:col-span-7">
                <div className="mono-label text-paper/60 mb-5">
                  [ NEXT ]   CONVERSATION
                </div>
                <h2 className="font-serif text-paper text-[clamp(2rem,5vw,3.75rem)] leading-[1.04] tracking-[-0.025em] text-balance">
                  {s.cta.headline}
                </h2>
                <p className="mt-5 max-w-xl text-paper/70 text-body-lg leading-relaxed text-pretty">
                  {s.cta.description}
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start gap-5 lg:items-end lg:justify-end">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2.5 bg-amber text-ink px-7 py-4 font-medium hairline hover:bg-paper transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
                >
                  <span>{s.cta.primaryCta}</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
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
        "rounded-full px-4 py-2 font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber",
        active
          ? "bg-ink text-paper"
          : "hairline bg-paper-warm text-ink/70 hover:border-ink/25 hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}
