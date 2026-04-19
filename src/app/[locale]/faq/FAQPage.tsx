"use client";

import { useState } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-hero-mesh" />
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-accent-500/8 rounded-full blur-3xl" />
        </div>
        <div className="container-wide text-center">
          <AnimatedSection>
            <Badge variant="gradient" className="mb-4">{s.hero.label}</Badge>
            <h1 className="text-display-sm md:text-display font-bold text-white text-balance max-w-3xl mx-auto">
              {s.hero.headline}
            </h1>
            <p className="mt-5 text-body-lg text-slate-300 max-w-2xl mx-auto">
              {s.hero.description}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-slate-100">
        <div className="container-wide">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                activeCategory === "all"
                  ? "bg-brand-600 text-white shadow-glow-brand"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s.allFilter}
            </button>
            {categoryKeys.map((key) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeCategory === key
                    ? "bg-brand-600 text-white shadow-glow-brand"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s.categories[key]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="space-y-3">
            {filteredItems.map((item, i) => {
              const key = `${item.category}-${i}`;
              const isOpen = openItems[key];
              return (
                <AnimatedSection key={key} delay={i * 0.05}>
                  <div
                    className={cn(
                      "rounded-xl border overflow-hidden transition-all duration-300",
                      isOpen
                        ? "border-brand-200 shadow-glow-brand bg-white"
                        : "border-slate-200/60 bg-white hover:border-slate-300"
                    )}
                  >
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                    >
                      <span className="text-sm md:text-base font-semibold text-slate-900 pr-4">
                        {item.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0"
                      >
                        <ChevronDown
                          size={18}
                          className={cn(
                            "transition-colors",
                            isOpen ? "text-brand-500" : "text-slate-400"
                          )}
                        />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 md:px-6 pb-5 md:pb-6 border-t border-slate-100">
                            <p className="pt-4 text-sm md:text-base text-slate-500 leading-relaxed">
                              {item.answer}
                            </p>
                            <div className="mt-3">
                              <Badge variant="default" className="text-[10px]">
                                {s.categories[item.category as keyof typeof s.categories] || item.category}
                              </Badge>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <AnimatedSection>
            <div className="relative rounded-2xl gradient-cta px-8 py-16 md:px-20 md:py-20 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-accent-400/8 rounded-full blur-3xl" />
              <div className="relative z-10 max-w-xl mx-auto">
                <h2 className="text-heading-lg md:text-display-sm font-bold text-white">
                  {s.cta.headline}
                </h2>
                <p className="mt-4 text-body text-slate-300">
                  {s.cta.description}
                </p>
                <Link href="/contact" className="mt-8 inline-block">
                  <Button size="xl" className="bg-white text-slate-900 hover:bg-slate-100">
                    {s.cta.primaryCta}
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
