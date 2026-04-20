"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
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
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

const iconMap: Record<string, React.ReactNode> = {
  workflow: <Workflow size={22} strokeWidth={1.75} />,
  layout: <LayoutDashboard size={22} strokeWidth={1.75} />,
  gitBranch: <GitBranch size={22} strokeWidth={1.75} />,
  plug: <Plug size={22} strokeWidth={1.75} />,
  target: <Target size={22} strokeWidth={1.75} />,
  package: <Package size={22} strokeWidth={1.75} />,
  messageSquare: <MessageSquare size={22} strokeWidth={1.75} />,
  bot: <Bot size={22} strokeWidth={1.75} />,
};

export function SolutionsPage() {
  const { t } = useLocale();
  const s = t.solutions;

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="solutions-title"
        className="relative pt-32 md:pt-40 pb-12 md:pb-16 bg-white"
      >
        <div className="container-wide">
          <AnimatedSection className="max-w-3xl">
            <div className="eyebrow uppercase text-brand mb-4">{s.hero.label}</div>
            <h1
              id="solutions-title"
              className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink text-balance"
            >
              {s.hero.headline}
            </h1>
            <p className="mt-6 md:mt-8 text-ink/70 text-body-lg leading-relaxed max-w-2xl text-pretty">
              {s.hero.description}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services — 3-col pop-card grid */}
      <section className="section-sm bg-neutral-50">
        <div className="container-wide">
          <AnimatedSection className="mb-10 md:mb-14 max-w-2xl">
            <div className="eyebrow uppercase text-ink/50 mb-4">Overview</div>
            <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-ink text-balance">
              What each focus area covers
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {s.items.map((item, i) => (
              <StaggerItem key={i}>
                <div className="pop-card h-full p-7 md:p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-ink mb-5">
                    {iconMap[item.icon]}
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

      {/* Deep dive — alternating rows */}
      <section className="section-sm bg-white">
        <div className="container-wide">
          <AnimatedSection className="mb-10 md:mb-14 max-w-2xl">
            <div className="eyebrow uppercase text-ink/50 mb-4">Detail</div>
            <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-ink text-balance">
              Problems addressed, outcomes targeted
            </h2>
          </AnimatedSection>

          <div className="space-y-12 md:space-y-16">
            {s.items.map((item, i) => (
              <AnimatedSection key={i}>
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start border-t border-neutral-200 pt-10 md:pt-12">
                  <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100 text-ink">
                        {iconMap[item.icon]}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-ink mb-4 text-balance">
                      {item.title}
                    </h3>
                    <p className="text-ink/70 text-body leading-relaxed text-pretty">
                      {item.description}
                    </p>
                  </div>

                  <div
                    className={`lg:col-span-7 grid sm:grid-cols-2 gap-4 md:gap-5 ${
                      i % 2 === 1 ? "lg:order-1" : ""
                    }`}
                  >
                    <div className="pop-card p-6">
                      <div className="eyebrow uppercase text-ink/50 mb-3">
                        {s.problemsLabel}
                      </div>
                      <ul className="space-y-2.5">
                        {item.problems.map((p, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <AlertCircle
                              size={14}
                              className="mt-1 shrink-0 text-ink/40"
                              aria-hidden="true"
                            />
                            <span className="text-sm text-ink/70 leading-relaxed">
                              {p}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pop-card p-6 bg-brand/5 border-brand/20">
                      <div className="eyebrow uppercase text-brand mb-3">
                        {s.outcomesLabel}
                      </div>
                      <ul className="space-y-2.5">
                        {item.outcomes.map((o, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <Check
                              size={14}
                              className="mt-1 shrink-0 text-brand"
                              aria-hidden="true"
                            />
                            <span className="text-sm text-ink/80 leading-relaxed">
                              {o}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
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
