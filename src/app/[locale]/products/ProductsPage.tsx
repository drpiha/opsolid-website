"use client";

import { useMemo, useState } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import {
  Sparkles,
  IdCard,
  BellRing,
  ArrowRight,
  Phone,
  MessageCircle,
  MessagesSquare,
  CalendarClock,
  Mail,
  UserCheck,
} from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { IPhoneMockup } from "@/components/shared/mockups";
import { INDUSTRY_DEMOS } from "@/components/products/DemoGallery";
import { TechStackStrip } from "@/components/products/TechStackStrip";
import { useLocale } from "@/context/LocaleContext";

const productIconMap: Record<string, React.ReactNode> = {
  sparkles: <Sparkles size={22} strokeWidth={1.75} />,
  idCard: <IdCard size={22} strokeWidth={1.75} />,
  bell: <BellRing size={22} strokeWidth={1.75} />,
  phone: <Phone size={22} strokeWidth={1.75} />,
  messageCircle: <MessageCircle size={22} strokeWidth={1.75} />,
  messagesSquare: <MessagesSquare size={22} strokeWidth={1.75} />,
  calendarClock: <CalendarClock size={22} strokeWidth={1.75} />,
  mail: <Mail size={22} strokeWidth={1.75} />,
  userCheck: <UserCheck size={22} strokeWidth={1.75} />,
};

type CategoryFilter = "all" | "Customer-facing" | "Internal Ops" | "Communication";

const INFRASTRUCTURE_CHIPS = [
  "Retell AI",
  "Vapi",
  "Cal.com",
  "Meta Business",
  "n8n",
  "Supabase",
];

export function ProductsPage() {
  const { t } = useLocale();
  const p = t.products;
  const [filter, setFilter] = useState<CategoryFilter>("all");

  const filteredItems = useMemo(
    () =>
      filter === "all"
        ? p.items
        : p.items.filter((item) => item.category === filter),
    [filter, p.items]
  );

  const categoryTabs: { id: CategoryFilter; label: string }[] = [
    { id: "all", label: p.categories.all },
    { id: "Customer-facing", label: p.categories.customerFacing },
    { id: "Internal Ops", label: p.categories.internalOps },
    { id: "Communication", label: p.categories.communication },
  ];

  return (
    <>
      {/* ================================================================ */}
      {/*  Hero                                                             */}
      {/* ================================================================ */}
      <section
        aria-labelledby="products-hero-title"
        className="relative overflow-hidden pt-32 md:pt-40 pb-14 md:pb-20 bg-white"
      >
        <div className="container-wide">
          <AnimatedSection className="max-w-3xl">
            <p className="eyebrow uppercase text-brand mb-4">{p.hero.label}</p>
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

          {/* Infrastructure mini chips — Dallmer-esque plain row */}
          <AnimatedSection delay={0.1} className="mt-10">
            <ul className="flex flex-wrap items-center gap-2">
              {INFRASTRUCTURE_CHIPS.map((chip, i) => (
                <li key={i}>
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink/60">
                    {chip}
                  </span>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  Category filter tabs                                             */}
      {/* ================================================================ */}
      <section className="bg-white border-y border-neutral-100 sticky top-[64px] z-30 backdrop-blur-sm bg-white/90">
        <div className="container-wide py-4">
          <div
            role="tablist"
            aria-label="Filter products"
            className="flex flex-wrap items-center gap-2"
          >
            {categoryTabs.map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(tab.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-ink text-white shadow-sm"
                      : "bg-neutral-100 text-ink/70 hover:bg-neutral-200"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  Products grid                                                    */}
      {/* ================================================================ */}
      <section className="section-sm bg-neutral-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredItems.map((item, i) => {
              const stackChips = item.stack
                .split("·")
                .map((s) => s.trim())
                .filter(Boolean);
              return (
                <AnimatedSection key={item.href} delay={i * 0.04}>
                  <Link
                    href={item.href}
                    className="pop-card group block h-full p-6 md:p-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2"
                  >
                    {/* Device-frame-style icon thumbnail */}
                    <div className="mb-5 flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-ink to-ink-800 text-white">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                          {productIconMap[item.icon] || (
                            <Sparkles size={22} strokeWidth={1.75} />
                          )}
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/60">
                          Preview
                        </span>
                      </div>
                    </div>

                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg md:text-xl font-extrabold tracking-[-0.02em] text-ink leading-tight">
                          {item.name}
                        </h2>
                        <p className="mt-1 text-xs font-semibold text-brand">
                          {item.tagline}
                        </p>
                      </div>
                      <span className="trust-pill shrink-0 text-[10px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        {item.status}
                      </span>
                    </div>

                    <p className="text-ink/65 text-sm leading-relaxed text-pretty">
                      {item.description}
                    </p>

                    {/* Stack chips */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {stackChips.slice(0, 4).map((chip, j) => (
                        <span
                          key={j}
                          className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-ink/60"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>

                    {/* Starting price + Explore */}
                    <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-neutral-100">
                      <span className="text-[11px] font-semibold text-ink/70">
                        {item.startingPrice}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-brand transition-colors">
                        Explore
                        <ArrowRight
                          size={14}
                          aria-hidden="true"
                          className="transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="mt-10 text-center text-ink/50">
              No products in this category yet.
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/*  10 Industry Templates Ready                                      */}
      {/* ================================================================ */}
      <section className="section-sm bg-white" aria-labelledby="templates-strip-heading">
        <div className="container-wide">
          <AnimatedSection className="max-w-3xl mb-10 md:mb-14">
            <p className="eyebrow uppercase text-brand mb-3">
              {p.templatesStrip.label}
            </p>
            <h2
              id="templates-strip-heading"
              className="text-heading-lg font-extrabold tracking-[-0.02em] text-ink text-balance"
            >
              {p.templatesStrip.heading}
            </h2>
            <p className="mt-4 text-ink/65 text-body leading-relaxed">
              {p.templatesStrip.paragraph}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {INDUSTRY_DEMOS.map((demo, i) => (
              <AnimatedSection key={demo.id} delay={i * 0.03}>
                <Link
                  href="/products/digital-card"
                  className="group block"
                  aria-label={`Customize ${demo.industry} template`}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 p-3 md:p-4 transition-shadow duration-300 group-hover:shadow-lg border border-neutral-200/60">
                    <div className="pointer-events-none transition-transform duration-500 group-hover:scale-[1.03]">
                      <IPhoneMockup
                        src={demo.src}
                        title={`${demo.industry} template`}
                        loading={i < 5 ? "eager" : "lazy"}
                        scale="sm"
                      />
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-xs font-bold text-ink truncate">
                      {demo.industry}
                    </p>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="mt-10 text-center">
            <Link
              href={p.templatesStrip.ctaHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-600 transition-colors"
            >
              {p.templatesStrip.cta}
              <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  Tech stack strip                                                 */}
      {/* ================================================================ */}
      <TechStackStrip
        label={p.techStack.label}
        heading={p.techStack.heading}
        items={p.techStack.items}
      />
    </>
  );
}
