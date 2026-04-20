"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
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
  inbox: <Inbox size={22} strokeWidth={1.75} />,
  bot: <Bot size={22} strokeWidth={1.75} />,
  layers: <Layers size={22} strokeWidth={1.75} />,
  lineChart: <LineChart size={22} strokeWidth={1.75} />,
  shield: <Shield size={22} strokeWidth={1.75} />,
  languages: <Languages size={22} strokeWidth={1.75} />,
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
  <Building2 size={22} key="b" strokeWidth={1.75} />,
  <Users size={22} key="u" strokeWidth={1.75} />,
  <Briefcase size={22} key="br" strokeWidth={1.75} />,
];

/**
 * Popl-style Kutasia product preview — a crisp dashboard mock with
 * white surface, neutral border, and the brand red used sparingly on
 * the trend line and accent stats.
 */
function ProductSchematic() {
  return (
    <div className="relative w-full max-w-[520px] mx-auto">
      <div className="pop-card overflow-hidden p-0 shadow-lifted">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-neutral-200 bg-neutral-50">
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
          <span className="ml-3 text-xs font-medium text-ink/50">
            kutasia.com/dashboard
          </span>
        </div>

        <div className="p-5 md:p-6 space-y-4 bg-white">
          {/* KPI strip */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: "Messages", value: "247", trend: "+18%" },
              { label: "Avg Reply", value: "4m", trend: "-22%" },
              { label: "AI Signals", value: "12", trend: "New" },
            ].map((k, i) => (
              <div
                key={i}
                className="rounded-xl border border-neutral-200 bg-white p-3"
              >
                <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink/50">
                  {k.label}
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-ink tracking-tight">
                    {k.value}
                  </span>
                  <span className="text-[0.65rem] font-semibold text-brand">
                    {k.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart preview */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink/50 mb-3">
              Sentiment · Last 7 days
            </div>
            <svg
              viewBox="0 0 240 60"
              className="w-full h-14"
              aria-hidden="true"
            >
              <path
                d="M0,42 Q30,38 45,32 T90,22 T135,28 T180,15 T225,18"
                stroke="#E63946"
                strokeWidth="1.75"
                fill="none"
                strokeLinecap="round"
                className="animate-dash"
                strokeDasharray="300"
                strokeDashoffset="0"
              />
              <path
                d="M0,42 Q30,38 45,32 T90,22 T135,28 T180,15 T225,18"
                stroke="#0A0A0A"
                strokeWidth="0.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.12"
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
                className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-2.5"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-[0.6rem] font-bold text-ink">
                  {m.channel}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-ink truncate">
                    {m.from}
                  </div>
                  <div className="text-[0.7rem] text-ink/60 truncate">
                    {m.msg}
                  </div>
                </div>
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink/60 shrink-0">
                  {m.tag}
                </span>
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
        className="relative pt-32 md:pt-40 pb-12 md:pb-16 bg-white"
      >
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left — text */}
            <div className="lg:col-span-7 animate-fade-in">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink/50 hover:text-ink transition-colors mb-6"
              >
                <ArrowLeft size={12} aria-hidden="true" />
                <span>{k.hero.eyebrow}</span>
              </Link>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                  <Sparkles size={22} strokeWidth={1.75} />
                </div>
                <span className="text-2xl font-extrabold text-ink tracking-[-0.025em]">
                  {k.hero.label}
                </span>
                <span className="trust-pill bg-green-50 text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Live
                </span>
              </div>

              <h1
                id="kutasia-title"
                className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink text-balance whitespace-pre-line"
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
                className="mt-6 trust-pill hover:bg-neutral-200 transition-colors"
              >
                <span>{k.hero.domain}</span>
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href={k.hero.primaryCtaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <span>{k.hero.primaryCta}</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
                <Link
                  href={k.hero.secondaryCtaHref}
                  className="btn-ghost"
                >
                  <span>{k.hero.secondaryCta}</span>
                </Link>
              </div>

              {/* Trust strip */}
              <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2">
                {k.trustStrip.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-xs font-medium text-ink/60"
                  >
                    <Check size={13} className="text-brand" aria-hidden="true" />
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

      {/* Features — 3-col pop cards */}
      <section className="section-sm bg-neutral-50">
        <div className="container-wide">
          <AnimatedSection className="max-w-2xl mb-10 md:mb-14">
            <div className="eyebrow uppercase text-brand mb-4">{k.features.label}</div>
            <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-ink text-balance">
              {k.features.headline}
            </h2>
            <p className="mt-5 text-ink/70 text-body-lg leading-relaxed text-pretty">
              {k.features.description}
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {k.features.items.map((item, i) => (
              <StaggerItem key={i}>
                <div className="pop-card h-full p-7 md:p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-ink mb-5">
                    {featureIconMap[item.icon]}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-ink tracking-[-0.02em] mb-3 text-balance">
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

      {/* Sectors */}
      <section className="section-sm bg-white">
        <div className="container-wide">
          <AnimatedSection className="max-w-2xl mb-10 md:mb-14">
            <div className="eyebrow uppercase text-ink/50 mb-4">{k.sectors.label}</div>
            <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-ink text-balance">
              {k.sectors.headline}
            </h2>
            <p className="mt-5 text-ink/70 text-body-lg leading-relaxed text-pretty">
              {k.sectors.description}
            </p>
          </AnimatedSection>

          <StaggerContainer className="flex flex-wrap gap-2.5 md:gap-3">
            {k.sectors.list.map((s, i) => (
              <StaggerItem key={i} stagger={0.02}>
                <div className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:border-ink/30 hover:bg-neutral-50">
                  <span className="text-ink/50 group-hover:text-brand transition-colors">
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
      <section className="section-sm bg-neutral-50">
        <div className="container-wide">
          <AnimatedSection className="max-w-2xl mb-10 md:mb-14">
            <div className="eyebrow uppercase text-ink/50 mb-4">{k.howItHelps.label}</div>
            <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-ink text-balance">
              {k.howItHelps.headline}
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {k.howItHelps.items.map((item, i) => (
              <AnimatedSection key={i} delay={0.04 * i}>
                <div className="pop-card grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch gap-0 overflow-hidden p-0">
                  <div className="p-6 md:p-7 bg-neutral-50 border-b md:border-b-0 md:border-r border-neutral-200">
                    <div className="eyebrow uppercase text-ink/50 mb-2">Before</div>
                    <p className="text-ink/60 text-body leading-relaxed line-through decoration-ink/25 text-pretty">
                      {item.before}
                    </p>
                  </div>
                  <div className="hidden md:flex items-center justify-center px-4 text-brand bg-white">
                    <ArrowRight size={20} strokeWidth={2} aria-hidden="true" />
                  </div>
                  <div className="p-6 md:p-7 bg-white">
                    <div className="eyebrow uppercase text-brand mb-2">
                      With Kutasia
                    </div>
                    <p className="text-ink text-body leading-relaxed text-pretty">
                      {item.after}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Built for */}
      <section className="section-sm bg-white">
        <div className="container-wide">
          <AnimatedSection className="max-w-2xl mb-10 md:mb-14">
            <div className="eyebrow uppercase text-ink/50 mb-4">{k.forWho.label}</div>
            <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-ink text-balance">
              {k.forWho.headline}
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {k.forWho.items.map((item, i) => (
              <StaggerItem key={i}>
                <div className="pop-card h-full p-7 md:p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-ink mb-5">
                    {forWhoIconCycle[i % forWhoIconCycle.length]}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-ink tracking-[-0.02em] mb-3 text-balance">
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

      {/* CTA */}
      <section className="section-sm bg-neutral-50">
        <div className="container-wide">
          <AnimatedSection>
            <div className="pop-card p-10 md:p-14 text-center max-w-3xl mx-auto">
              <div className="eyebrow uppercase text-brand mb-4">Next step</div>
              <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink text-balance">
                {k.cta.headline}
              </h2>
              <p className="mt-5 max-w-xl mx-auto text-ink/70 text-body leading-relaxed text-pretty">
                {k.cta.description}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={k.hero.primaryCtaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <span>{k.cta.primaryCta}</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
                <Link href={k.hero.secondaryCtaHref} className="btn-ghost">
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
