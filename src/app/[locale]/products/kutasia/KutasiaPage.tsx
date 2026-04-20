"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import {
  ArrowUpRight,
  Inbox,
  Bot,
  Layers,
  LineChart,
  Shield,
  Languages,
  Bed,
  Scissors,
  Gem,
  Utensils,
  Stethoscope,
  Calculator,
  Sparkles,
  Video,
  Briefcase,
  ShoppingBag,
  Megaphone,
  GraduationCap,
  Scale,
  Package,
  Check,
  Users,
  Building2,
} from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

const featureIconMap: Record<string, React.ReactNode> = {
  inbox: <Inbox size={20} />,
  bot: <Bot size={20} />,
  layers: <Layers size={20} />,
  lineChart: <LineChart size={20} />,
  shield: <Shield size={20} />,
  languages: <Languages size={20} />,
};

const sectorIconMap: Record<string, React.ReactNode> = {
  bed: <Bed size={16} />,
  scissors: <Scissors size={16} />,
  gem: <Gem size={16} />,
  utensils: <Utensils size={16} />,
  stethoscope: <Stethoscope size={16} />,
  calculator: <Calculator size={16} />,
  sparkles: <Sparkles size={16} />,
  video: <Video size={16} />,
  briefcase: <Briefcase size={16} />,
  shoppingBag: <ShoppingBag size={16} />,
  megaphone: <Megaphone size={16} />,
  graduationCap: <GraduationCap size={16} />,
  scale: <Scale size={16} />,
  lineChart: <LineChart size={16} />,
  package: <Package size={16} />,
};

const forWhoIconCycle = [
  <Building2 size={20} key="b" />,
  <Users size={20} key="u" />,
  <Briefcase size={20} key="br" />,
];

/**
 * Editorial Kutasia schematic — hairline dashboard preview that
 * matches the warm-graphite aesthetic (hairline, no dark surface).
 */
function ProductSchematic() {
  return (
    <div className="relative w-full max-w-[520px] mx-auto">
      <div className="hairline bg-paper-warm rounded-2xl overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-5 py-3 hairline-b bg-paper">
          <span className="h-2 w-2 rounded-full bg-ink/20" />
          <span className="h-2 w-2 rounded-full bg-ink/20" />
          <span className="h-2 w-2 rounded-full bg-ink/20" />
          <span className="ml-3 mono-label text-ink/50">
            kutasia.com/dashboard
          </span>
        </div>

        <div className="p-5 md:p-6 space-y-4">
          {/* KPI strip */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: "Messages", value: "247", trend: "+18%" },
              { label: "Avg Reply", value: "4m", trend: "-22%" },
              { label: "AI Signals", value: "12", trend: "New" },
            ].map((k, i) => (
              <div
                key={i}
                className="hairline bg-paper rounded-xl p-3"
              >
                <div className="mono-label text-ink/50">{k.label}</div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-serif text-lg text-ink">{k.value}</span>
                  <span className="text-[0.65rem] font-medium text-amber-700">
                    {k.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart preview */}
          <div className="hairline bg-paper rounded-xl p-4">
            <div className="mono-label text-ink/50 mb-3">
              Sentiment · Last 7 days
            </div>
            <svg
              viewBox="0 0 240 60"
              className="w-full h-14"
              aria-hidden="true"
            >
              <path
                d="M0,42 Q30,38 45,32 T90,22 T135,28 T180,15 T225,18"
                stroke="#E8A252"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                className="animate-dash"
                strokeDasharray="300"
                strokeDashoffset="0"
              />
              <path
                d="M0,42 Q30,38 45,32 T90,22 T135,28 T180,15 T225,18"
                stroke="#15120F"
                strokeWidth="0.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.15"
              />
            </svg>
          </div>

          {/* Message rows */}
          <div className="space-y-2">
            {[
              {
                channel: "IG",
                from: "@artisan_hotel",
                msg: "Quick question about suite availability…",
                tag: "Booking",
              },
              {
                channel: "WA",
                from: "+49 170 ••• 4421",
                msg: "Gibt es Termine diese Woche?",
                tag: "Urgent",
              },
              {
                channel: "@",
                from: "info@anki-studio.de",
                msg: "Partnership proposal — 30min call?",
                tag: "Collab",
              },
            ].map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-3 hairline bg-paper rounded-xl px-3 py-2.5"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg hairline bg-paper-warm text-[0.6rem] font-mono text-ink">
                  {m.channel}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-ink truncate">
                    {m.from}
                  </div>
                  <div className="text-[0.7rem] text-ink/60 truncate">
                    {m.msg}
                  </div>
                </div>
                <span className="mono-label text-ink/60 shrink-0">{m.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function KutasiaPage() {
  const { t } = useLocale();
  const k = t.products.kutasia;

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="kutasia-title"
        className="relative pt-32 md:pt-40 pb-12 md:pb-16 paper-grain overflow-hidden"
      >
        <div className="hairline-b">
          <div className="container-wide flex items-center justify-between py-3">
            <span className="mono-label text-ink/60">
              [ PRODUCT · 08 ]   KUTASIA
            </span>
            <span className="mono-label hidden md:inline text-ink/40">
              LIVE
            </span>
          </div>
        </div>

        <div className="container-wide relative z-10 pt-8 md:pt-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left — text */}
            <div className="lg:col-span-7 animate-fade-in">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 mono-label text-ink/50 hover:text-ink transition-colors mb-5"
              >
                <span aria-hidden="true">←</span>
                <span>{k.hero.eyebrow}</span>
              </Link>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl hairline bg-paper-warm text-ink">
                  <Sparkles size={22} />
                </div>
                <span className="font-serif text-[2rem] text-ink tracking-tight">
                  {k.hero.label}
                </span>
              </div>

              <h1
                id="kutasia-title"
                className="font-serif text-ink text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.04] tracking-[-0.025em] text-balance whitespace-pre-line"
              >
                {k.hero.headline}
              </h1>

              <p className="mt-6 text-ink/70 text-body-lg leading-relaxed text-pretty max-w-xl">
                {k.hero.subheadline}
              </p>

              {/* Domain pill */}
              <a
                href={k.hero.primaryCtaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full hairline bg-paper-warm px-4 py-1.5 font-mono text-xs text-ink/70 hover:border-ink/25 hover:text-ink transition-colors"
              >
                <span>{k.hero.domain}</span>
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href={k.hero.primaryCtaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 bg-amber text-ink px-7 py-4 font-medium hairline hover:bg-amber-600 hover:text-paper transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
                >
                  <span>{k.hero.primaryCta}</span>
                  <ArrowUpRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
                <Link
                  href={k.hero.secondaryCtaHref}
                  className="group inline-flex items-center gap-2 text-ink underline underline-offset-8 decoration-ink/20 decoration-1 hover:decoration-ink transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber px-1"
                >
                  <span>{k.hero.secondaryCta}</span>
                </Link>
              </div>

              {/* Trust strip */}
              <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2">
                {k.trustStrip.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 mono-label text-ink/60"
                  >
                    <Check
                      size={12}
                      className="text-amber-700"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — schematic */}
            <AnimatedSection delay={0.2} className="hidden lg:block lg:col-span-5">
              <ProductSchematic />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features — bento */}
      <section className="hairline-t section-sm">
        <div className="container-wide">
          <AnimatedSection className="max-w-2xl mb-10 md:mb-14">
            <div className="mono-label mb-5">[ 01 ] {k.features.label}</div>
            <h2 className="font-serif text-ink text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] tracking-[-0.02em] text-balance">
              {k.features.headline}
            </h2>
            <p className="mt-5 text-ink/70 text-body-lg leading-relaxed text-pretty">
              {k.features.description}
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-6 gap-5 md:gap-6">
            {k.features.items.map((item, i) => {
              // Bento layout: 0 spans 3, 1 spans 3, 2 spans 2, 3 spans 2, 4 spans 2, 5 spans 3 (pattern varies)
              const spans = [
                "lg:col-span-3",
                "lg:col-span-3",
                "lg:col-span-2",
                "lg:col-span-2",
                "lg:col-span-2",
                "lg:col-span-6",
              ];
              return (
                <StaggerItem key={i} className={spans[i % spans.length]}>
                  <div className="hairline bg-paper-warm h-full p-6 sm:p-8 rounded-2xl transition duration-300 hover:border-ink/25 hover:-translate-y-0.5">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl hairline bg-paper text-ink">
                        {featureIconMap[item.icon]}
                      </span>
                      <span className="mono-label text-ink/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-serif text-ink text-[1.375rem] md:text-[1.5rem] leading-[1.2] tracking-[-0.015em] mb-3 text-balance">
                      {item.title}
                    </h3>
                    <p className="text-sm text-ink/70 leading-relaxed text-pretty">
                      {item.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Sectors */}
      <section className="hairline-t bg-paper-warm/40 section-sm">
        <div className="container-wide">
          <AnimatedSection className="max-w-2xl mb-10 md:mb-14">
            <div className="mono-label mb-5">[ 02 ] {k.sectors.label}</div>
            <h2 className="font-serif text-ink text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] tracking-[-0.02em] text-balance">
              {k.sectors.headline}
            </h2>
            <p className="mt-5 text-ink/70 text-body-lg leading-relaxed text-pretty">
              {k.sectors.description}
            </p>
          </AnimatedSection>

          <StaggerContainer className="flex flex-wrap gap-2.5 md:gap-3">
            {k.sectors.list.map((s, i) => (
              <StaggerItem key={i} stagger={0.02}>
                <div className="group inline-flex items-center gap-2 rounded-full hairline bg-paper-warm px-4 py-2.5 text-sm text-ink/80 transition-colors hover:border-ink/25 hover:bg-paper">
                  <span className="text-ink/50 group-hover:text-amber-700 transition-colors">
                    {sectorIconMap[s.icon] || <Package size={16} />}
                  </span>
                  {s.name}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How it helps — before / after */}
      <section className="hairline-t section-sm">
        <div className="container-wide">
          <AnimatedSection className="max-w-2xl mb-10 md:mb-14">
            <div className="mono-label mb-5">[ 03 ] {k.howItHelps.label}</div>
            <h2 className="font-serif text-ink text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] tracking-[-0.02em] text-balance">
              {k.howItHelps.headline}
            </h2>
          </AnimatedSection>

          <div className="border-t border-ink/10">
            {k.howItHelps.items.map((item, i) => (
              <AnimatedSection
                key={i}
                delay={0.04 * i}
                className="border-b border-ink/10 grid grid-cols-1 md:grid-cols-[auto_1fr_auto_1fr] items-stretch"
              >
                <div className="hidden md:flex items-center px-5 lg:px-8 py-6 border-r border-ink/10 bg-paper-warm">
                  <span className="mono-label text-ink/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-5 md:p-6 lg:p-7 bg-paper-warm/40 border-b md:border-b-0 md:border-r border-ink/10">
                  <div className="mono-label text-ink/50 mb-2">Before</div>
                  <p className="text-ink/60 text-body leading-relaxed line-through decoration-ink/25 text-pretty">
                    {item.before}
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center px-4 border-r border-ink/10 bg-paper-warm text-amber-700">
                  <span aria-hidden="true" className="text-xl">
                    →
                  </span>
                </div>
                <div className="p-5 md:p-6 lg:p-7 bg-paper">
                  <div className="mono-label text-amber-700 mb-2">
                    With Kutasia
                  </div>
                  <p className="text-ink text-body leading-relaxed text-pretty">
                    {item.after}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Built for */}
      <section className="hairline-t bg-paper-warm/40 section-sm">
        <div className="container-wide">
          <AnimatedSection className="max-w-2xl mb-10 md:mb-14">
            <div className="mono-label mb-5">[ 04 ] {k.forWho.label}</div>
            <h2 className="font-serif text-ink text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] tracking-[-0.02em] text-balance">
              {k.forWho.headline}
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {k.forWho.items.map((item, i) => (
              <StaggerItem key={i}>
                <div className="hairline bg-paper-warm h-full p-6 sm:p-8 rounded-2xl transition duration-300 hover:border-ink/25 hover:-translate-y-0.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl hairline bg-paper text-ink mb-5">
                    {forWhoIconCycle[i % forWhoIconCycle.length]}
                  </div>
                  <h3 className="font-serif text-ink text-[1.375rem] md:text-[1.5rem] leading-[1.2] tracking-[-0.015em] mb-3 text-balance">
                    {item.title}
                  </h3>
                  <p className="text-sm text-ink/70 leading-relaxed text-pretty">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA — ink block */}
      <section className="hairline-t bg-ink text-paper paper-grain">
        <div className="container-wide section">
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
              <div className="lg:col-span-7">
                <div className="mono-label text-paper/60 mb-5">
                  [ NEXT ]   EXPLORE
                </div>
                <h2 className="font-serif text-paper text-[clamp(2rem,5vw,3.75rem)] leading-[1.04] tracking-[-0.025em] text-balance">
                  {k.cta.headline}
                </h2>
                <p className="mt-5 max-w-xl text-paper/70 text-body-lg leading-relaxed text-pretty">
                  {k.cta.description}
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start gap-4 lg:items-end lg:justify-end">
                <a
                  href={k.hero.primaryCtaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 bg-amber text-ink px-7 py-4 font-medium hairline hover:bg-paper transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
                >
                  <span>{k.cta.primaryCta}</span>
                  <ArrowUpRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
                <Link
                  href={k.hero.secondaryCtaHref}
                  className="inline-flex items-center gap-2 text-paper underline underline-offset-8 decoration-paper/30 decoration-1 hover:decoration-paper transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber px-1"
                >
                  <span>{k.cta.secondaryCta}</span>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
