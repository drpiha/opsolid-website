"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
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
  ArrowLeftRight,
  Users,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

const featureIconMap: Record<string, React.ReactNode> = {
  inbox: <Inbox size={22} />,
  bot: <Bot size={22} />,
  layers: <Layers size={22} />,
  lineChart: <LineChart size={22} />,
  shield: <Shield size={22} />,
  languages: <Languages size={22} />,
};

const sectorIconMap: Record<string, React.ReactNode> = {
  bed: <Bed size={18} />,
  scissors: <Scissors size={18} />,
  gem: <Gem size={18} />,
  utensils: <Utensils size={18} />,
  stethoscope: <Stethoscope size={18} />,
  calculator: <Calculator size={18} />,
  sparkles: <Sparkles size={18} />,
  video: <Video size={18} />,
  briefcase: <Briefcase size={18} />,
  shoppingBag: <ShoppingBag size={18} />,
  megaphone: <Megaphone size={18} />,
  graduationCap: <GraduationCap size={18} />,
  scale: <Scale size={18} />,
  lineChart: <LineChart size={18} />,
  package: <Package size={18} />,
};

const forWhoIconCycle = [
  <Building2 size={20} key="b" />,
  <Users size={20} key="u" />,
  <Briefcase size={20} key="br" />,
];

const featureAccents = [
  "from-brand-500 to-brand-600",
  "from-accent-500 to-accent-600",
  "from-teal-500 to-teal-600",
  "from-brand-500 to-teal-500",
  "from-accent-500 to-brand-500",
  "from-teal-500 to-cyan-500",
];

function ProductMockup() {
  return (
    <div className="relative w-full max-w-[540px] mx-auto">
      {/* Glow ring */}
      <div className="absolute -inset-6 bg-gradient-to-br from-brand-500/25 via-teal-500/15 to-accent-500/20 rounded-[2rem] blur-2xl" />

      <div className="relative rounded-2xl border border-white/15 bg-slate-900/70 backdrop-blur-xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-slate-950/60">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 text-[0.65rem] font-mono text-slate-500">kutasia.com/dashboard</span>
        </div>

        <div className="p-5 md:p-6 space-y-4">
          {/* KPI strip */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: "Messages", value: "247", trend: "+18%", color: "text-teal-300" },
              { label: "Avg Reply", value: "4m", trend: "-22%", color: "text-brand-300" },
              { label: "AI Signals", value: "12", trend: "New", color: "text-accent-300" },
            ].map((k, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i + 0.3, duration: 0.4 }}
                className="rounded-xl bg-white/5 border border-white/10 p-3"
              >
                <div className="text-[0.6rem] uppercase tracking-wider text-slate-400 font-medium">
                  {k.label}
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-white">{k.value}</span>
                  <span className={`text-[0.6rem] font-semibold ${k.color}`}>{k.trend}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chart preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="rounded-xl bg-white/5 border border-white/10 p-4"
          >
            <div className="text-[0.65rem] uppercase tracking-wider text-slate-400 font-medium mb-3">
              Sentiment · Last 7 days
            </div>
            <svg viewBox="0 0 240 60" className="w-full h-14">
              <defs>
                <linearGradient id="sentiment-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
                d="M0,42 Q30,38 45,32 T90,22 T135,28 T180,15 T225,18"
                stroke="#2dd4bf"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M0,42 Q30,38 45,32 T90,22 T135,28 T180,15 T225,18 L225,60 L0,60 Z"
                fill="url(#sentiment-fill)"
              />
            </svg>
          </motion.div>

          {/* Message rows */}
          <div className="space-y-2">
            {[
              { channel: "IG", color: "bg-accent-500/20 text-accent-300", from: "@artisan_hotel", msg: "Quick question about suite availability…", tag: "Booking", tagColor: "bg-teal-500/15 text-teal-300" },
              { channel: "WA", color: "bg-emerald-500/20 text-emerald-300", from: "+49 170 ••• 4421", msg: "Gibt es Termine diese Woche?", tag: "Urgent", tagColor: "bg-red-500/15 text-red-300" },
              { channel: "@", color: "bg-brand-500/20 text-brand-300", from: "info@anki-studio.de", msg: "Partnership proposal — 30min call?", tag: "Collab", tagColor: "bg-accent-500/15 text-accent-300" },
            ].map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + i * 0.12, duration: 0.4 }}
                className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5"
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-[0.65rem] font-bold ${m.color}`}>
                  {m.channel}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.7rem] font-medium text-white truncate">{m.from}</div>
                  <div className="text-[0.65rem] text-slate-400 truncate">{m.msg}</div>
                </div>
                <span className={`shrink-0 text-[0.55rem] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${m.tagColor}`}>
                  {m.tag}
                </span>
              </motion.div>
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
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28 gradient-hero-mesh">
        <div className="absolute top-24 left-[10%] w-80 h-80 bg-brand-500/15 rounded-full blur-[110px] animate-pulse-glow" />
        <div className="absolute bottom-10 right-[5%] w-96 h-96 bg-teal-500/12 rounded-full blur-[130px] animate-pulse-glow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/6 rounded-full blur-[150px]" />

        <div className="container-wide relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — text */}
            <AnimatedSection>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors mb-6"
              >
                <ArrowRight size={12} className="rotate-180" />
                {k.hero.eyebrow}
              </Link>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 text-white shadow-[0_8px_24px_-8px_rgba(20,184,166,0.6)]">
                  <Sparkles size={22} />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">{k.hero.label}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/15 px-2.5 py-0.5 text-[0.65rem] font-semibold text-teal-300 uppercase tracking-wider border border-teal-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
                  Live
                </span>
              </div>

              <h1 className="text-display-sm md:text-display font-bold text-white text-balance whitespace-pre-line">
                <span className="gradient-text-vibrant">{k.hero.headline.split("\n")[0]}</span>
                {"\n"}
                {k.hero.headline.split("\n").slice(1).join("\n")}
              </h1>
              <p className="mt-6 text-body-lg text-slate-300 max-w-xl leading-relaxed">
                {k.hero.subheadline}
              </p>

              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <a href={k.hero.primaryCtaHref} target="_blank" rel="noopener noreferrer">
                  <Button variant="gradient" size="xl">
                    {k.hero.primaryCta}
                    <ArrowUpRight size={18} />
                  </Button>
                </a>
                <Link href={k.hero.secondaryCtaHref}>
                  <Button size="xl" className="glass-dark text-white hover:bg-white/10 border-white/10">
                    {k.hero.secondaryCta}
                  </Button>
                </Link>
              </div>

              {/* Trust strip */}
              <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
                {k.trustStrip.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Check size={13} className="text-teal-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Right — mockup */}
            <AnimatedSection delay={0.2} className="hidden lg:block">
              <ProductMockup />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-wide">
          <AnimatedSection className="max-w-3xl mb-14 md:mb-16">
            <Badge variant="gradient" className="mb-4">{k.features.label}</Badge>
            <h2 className="text-heading md:text-display-sm font-bold text-slate-900 text-balance">
              {k.features.headline}
            </h2>
            <p className="mt-5 text-body-lg text-slate-500 leading-relaxed">
              {k.features.description}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {k.features.items.map((item, i) => {
              const accent = featureAccents[i % featureAccents.length];
              return (
                <AnimatedSection key={i} delay={i * 0.06}>
                  <div className="group relative h-full rounded-2xl border border-slate-100 bg-white p-7 md:p-8 transition-all duration-300 hover:border-slate-200 hover:shadow-[0_20px_50px_-20px_rgba(37,99,235,0.18)] hover:-translate-y-1 overflow-hidden">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white mb-5 shadow-[0_8px_20px_-8px_rgba(37,99,235,0.35)]`}>
                      {featureIconMap[item.icon]}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2.5">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50/60 to-white">
        <div className="container-wide">
          <AnimatedSection className="max-w-3xl mb-12 md:mb-14">
            <Badge variant="teal" className="mb-4">{k.sectors.label}</Badge>
            <h2 className="text-heading md:text-display-sm font-bold text-slate-900 text-balance">
              {k.sectors.headline}
            </h2>
            <p className="mt-5 text-body-lg text-slate-500 leading-relaxed">
              {k.sectors.description}
            </p>
          </AnimatedSection>

          <div className="flex flex-wrap gap-2.5 md:gap-3">
            {k.sectors.list.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, duration: 0.35 }}
                className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-700 hover:shadow-soft"
              >
                <span className="text-slate-400 group-hover:text-brand-600 transition-colors">
                  {sectorIconMap[s.icon] || <Package size={18} />}
                </span>
                {s.name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it helps (before / after) */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-wide">
          <AnimatedSection className="max-w-3xl mb-12 md:mb-14">
            <Badge variant="accent" className="mb-4">{k.howItHelps.label}</Badge>
            <h2 className="text-heading md:text-display-sm font-bold text-slate-900 text-balance">
              {k.howItHelps.headline}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
            {k.howItHelps.items.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/40 p-6 md:p-7">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div className="rounded-xl bg-red-50/40 border border-red-100/50 p-4">
                      <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-red-400/90 mb-1.5">
                        Before
                      </div>
                      <p className="text-sm text-slate-600 leading-snug">{item.before}</p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-teal-500 text-white shadow-soft">
                      <ArrowLeftRight size={15} />
                    </div>
                    <div className="rounded-xl bg-teal-50/40 border border-teal-100/60 p-4">
                      <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-teal-700 mb-1.5">
                        With Kutasia
                      </div>
                      <p className="text-sm text-slate-700 leading-snug font-medium">{item.after}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Built for */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-slate-50/60">
        <div className="container-wide">
          <AnimatedSection className="max-w-3xl mb-12 md:mb-14">
            <Badge variant="brand" className="mb-4">{k.forWho.label}</Badge>
            <h2 className="text-heading md:text-display-sm font-bold text-slate-900 text-balance">
              {k.forWho.headline}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {k.forWho.items.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-slate-100 bg-white p-7 md:p-8 transition-all hover:shadow-medium hover:-translate-y-0.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 mb-5">
                    {forWhoIconCycle[i % forWhoIconCycle.length]}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <AnimatedSection>
            <div className="relative rounded-2xl gradient-cta px-8 py-16 md:px-20 md:py-20 text-center overflow-hidden">
              <div className="absolute top-10 right-16 w-64 h-64 bg-gradient-to-br from-brand-400/18 to-teal-400/12 rounded-full blur-2xl animate-float" />
              <div className="absolute bottom-8 left-12 w-52 h-52 bg-gradient-to-br from-accent-400/15 to-brand-400/10 rounded-full blur-2xl animate-float-delayed" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-heading-lg md:text-display-sm font-bold text-white">
                  {k.cta.headline}
                </h2>
                <p className="mt-4 text-body text-slate-300 leading-relaxed">{k.cta.description}</p>
                <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a href={k.hero.primaryCtaHref} target="_blank" rel="noopener noreferrer">
                    <Button size="xl" className="bg-white text-slate-900 hover:bg-slate-100 hover:shadow-glow">
                      {k.cta.primaryCta}
                      <ArrowUpRight size={18} />
                    </Button>
                  </a>
                  <Link href={k.hero.secondaryCtaHref}>
                    <Button size="xl" className="glass-dark text-white hover:bg-white/10 border-white/10">
                      {k.cta.secondaryCta}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
