"use client";

import Link from "next/link";
import { ArrowRight, Building2, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";
import { AutomationFlow } from "@/components/illustrations/AutomationFlow";
import { useCaseIcons } from "@/components/illustrations/UseCaseIcons";

export function UseCasesPage() {
  const { t } = useLocale();
  const s = t.useCases;

  return (
    <>
      {/* Hero - Dark gradient */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 gradient-hero-mesh overflow-hidden">
        <div className="absolute top-20 right-[20%] w-72 h-72 bg-brand-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-[15%] w-60 h-60 bg-teal-500/10 rounded-full blur-[100px]" />

        <div className="container-wide text-center relative z-10">
          <AnimatedSection>
            <Badge variant="gradient" className="mb-4">{s.hero.label}</Badge>
            <h1 className="text-display-sm md:text-display font-bold text-white text-balance max-w-3xl mx-auto">
              {s.hero.headline}
            </h1>
            <p className="mt-5 text-body-lg text-slate-300 max-w-2xl mx-auto">
              {s.hero.description}
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="mt-10 max-w-2xl mx-auto">
              <AutomationFlow />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Use Cases */}
      <section className="pb-24 md:pb-32 pt-16 md:pt-20">
        <div className="container-wide">
          <StaggerContainer className="space-y-6">
            {s.items.map((item, i) => {
              const Icon = useCaseIcons[i];
              return (
              <StaggerItem key={i}>
                <div className="rounded-xl gradient-border overflow-hidden transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5">
                  {/* Header with gradient accent */}
                  <div className="relative border-b border-slate-100/80 bg-white/90 backdrop-blur-sm px-6 py-4 md:px-8 md:py-5">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 via-accent-500 to-teal-500" />
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="shrink-0" />}
                      <h2 className="text-base md:text-lg font-semibold text-slate-900">
                        {item.title}
                      </h2>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100/80 bg-white/80 backdrop-blur-sm">
                    <div className="p-5 md:p-6">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Building2 size={12} className="text-slate-300" />
                        <span className="text-[0.65rem] font-semibold text-slate-400 uppercase tracking-wider">
                          {s.labels.context}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.context}</p>
                    </div>

                    <div className="p-5 md:p-6">
                      <div className="flex items-center gap-1.5 mb-2">
                        <AlertTriangle size={12} className="text-red-400" />
                        <span className="text-[0.65rem] font-semibold text-red-400 uppercase tracking-wider">
                          {s.labels.problem}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.problem}</p>
                    </div>

                    <div className="p-5 md:p-6">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Lightbulb size={12} className="text-brand-500" />
                        <span className="text-[0.65rem] font-semibold text-brand-500 uppercase tracking-wider">
                          {s.labels.solution}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.solution}</p>
                    </div>

                    <div className="p-5 md:p-6 bg-teal-50/30">
                      <div className="flex items-center gap-1.5 mb-2">
                        <TrendingUp size={12} className="text-teal-600" />
                        <span className="text-[0.65rem] font-semibold text-teal-700 uppercase tracking-wider">
                          {s.labels.outcome}
                        </span>
                      </div>
                      <p className="text-sm text-teal-800 leading-relaxed font-medium">{item.outcome}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
              );
            })}
          </StaggerContainer>
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
