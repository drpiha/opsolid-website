"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Workflow,
  LayoutDashboard,
  GitBranch,
  Plug,
  Target,
  Package,
  MessageSquare,
  Bot,
  Check,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

const iconMap: Record<string, React.ReactNode> = {
  workflow: <Workflow size={24} />,
  layout: <LayoutDashboard size={24} />,
  gitBranch: <GitBranch size={24} />,
  plug: <Plug size={24} />,
  target: <Target size={24} />,
  package: <Package size={24} />,
  messageSquare: <MessageSquare size={24} />,
  bot: <Bot size={24} />,
};

const accentCycle = [
  "from-brand-500 to-brand-600",
  "from-accent-500 to-accent-600",
  "from-teal-500 to-teal-600",
  "from-brand-500 to-teal-500",
  "from-accent-500 to-brand-500",
  "from-teal-500 to-cyan-500",
  "from-brand-600 to-accent-500",
  "from-teal-600 to-brand-500",
];

export function SolutionsPage() {
  const { t } = useLocale();
  const s = t.solutions;

  return (
    <>
      {/* Hero - Dark gradient with split layout */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 gradient-hero-mesh overflow-hidden">
        <div className="absolute top-20 right-[20%] w-72 h-72 bg-brand-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-[15%] w-60 h-60 bg-teal-500/10 rounded-full blur-[100px]" />

        <div className="container-wide relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Text */}
            <AnimatedSection>
              <Badge variant="gradient" className="mb-4">{s.hero.label}</Badge>
              <h1 className="text-display-sm md:text-display font-bold text-white text-balance">
                {s.hero.headline}
              </h1>
              <p className="mt-5 text-body-lg text-slate-300 max-w-xl">
                {s.hero.description}
              </p>
            </AnimatedSection>

            {/* Right - Dashboard image */}
            <AnimatedSection delay={0.2}>
              <div className="relative hidden lg:block">
                <div className="absolute -inset-1 bg-gradient-to-br from-brand-400/20 via-accent-400/10 to-teal-400/20 rounded-2xl blur-sm" />
                <div className="relative h-[340px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <Image
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/30 to-transparent" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-wide space-y-20 md:space-y-28 pt-16 md:pt-20">
          {s.items.map((item, i) => {
            const accent = accentCycle[i % accentCycle.length];
            return (
              <AnimatedSection key={i}>
                <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-start`}>
                  <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white`}>
                        {iconMap[item.icon]}
                      </div>
                      <h2 className="text-heading-sm md:text-heading font-bold text-slate-900">
                        {item.title}
                      </h2>
                    </div>
                    <p className="text-body text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className={`space-y-4 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                    {/* Problems - red tint */}
                    <div className="rounded-xl bg-red-50/40 border border-red-100/40 p-5 md:p-6">
                      <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">
                        {s.problemsLabel}
                      </h3>
                      <ul className="space-y-2.5">
                        {item.problems.map((p, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <AlertCircle size={14} className="mt-0.5 shrink-0 text-red-300" />
                            <span className="text-sm text-slate-500">{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Outcomes - teal tint */}
                    <div className="rounded-xl bg-teal-50/40 border border-teal-100/50 p-5 md:p-6">
                      <h3 className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-3">
                        {s.outcomesLabel}
                      </h3>
                      <ul className="space-y-2.5">
                        {item.outcomes.map((o, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <Check size={14} className="mt-0.5 shrink-0 text-teal-600" />
                            <span className="text-sm text-slate-700">{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {i < s.items.length - 1 && (
                  <div className="mt-20 md:mt-28 border-t border-slate-100" />
                )}
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <AnimatedSection>
            <div className="relative rounded-2xl gradient-cta px-8 py-16 md:px-20 md:py-20 text-center overflow-hidden">
              <div className="absolute top-8 right-12 w-64 h-64 bg-gradient-to-br from-brand-400/15 to-teal-400/10 rounded-full blur-2xl animate-float" />
              <div className="absolute bottom-6 left-10 w-48 h-48 bg-gradient-to-br from-accent-400/12 to-brand-400/8 rounded-full blur-2xl animate-float-delayed" />

              <div className="relative z-10 max-w-xl mx-auto">
                <h2 className="text-heading-lg md:text-display-sm font-bold text-white">
                  {s.cta.headline}
                </h2>
                <p className="mt-4 text-body text-slate-300">{s.cta.description}</p>
                <Link href="/contact" className="mt-8 inline-block">
                  <Button size="xl" className="bg-white text-slate-900 hover:bg-slate-100 hover:shadow-glow">
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
