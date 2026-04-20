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
} from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

const iconMap: Record<string, React.ReactNode> = {
  workflow: <Workflow size={20} />,
  layout: <LayoutDashboard size={20} />,
  gitBranch: <GitBranch size={20} />,
  plug: <Plug size={20} />,
  target: <Target size={20} />,
  package: <Package size={20} />,
  messageSquare: <MessageSquare size={20} />,
  bot: <Bot size={20} />,
};

export function SolutionsPage() {
  const { t } = useLocale();
  const s = t.solutions;

  // Bento span pattern for items grid
  const bentoSpans = [
    "lg:col-span-4", // feature / first
    "lg:col-span-2",
    "lg:col-span-2",
    "lg:col-span-2",
    "lg:col-span-3",
    "lg:col-span-3",
    "lg:col-span-3",
    "lg:col-span-3",
  ];

  return (
    <>
      {/* Hero — typographic two-column */}
      <section
        aria-labelledby="solutions-title"
        className="relative pt-32 md:pt-40 pb-12 md:pb-16 paper-grain overflow-hidden"
      >
        <div className="hairline-b">
          <div className="container-wide flex items-center justify-between py-3">
            <span className="mono-label text-ink/60">
              [ SERVICES · 04 ]   FOCUS AREAS
            </span>
            <span className="mono-label hidden md:inline text-ink/40">
              {new Date().getFullYear()}
            </span>
          </div>
        </div>

        <div className="container-wide relative z-10 pt-10 md:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-7 animate-fade-in">
              <div className="mono-label text-ink/60 mb-5">{s.hero.label}</div>
              <h1
                id="solutions-title"
                className="font-serif text-ink text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.04] tracking-[-0.025em] text-balance"
              >
                {s.hero.headline}
              </h1>
            </div>

            <div className="lg:col-span-5 lg:pt-6 animate-fade-in">
              <p className="text-ink/70 text-body-lg leading-relaxed text-pretty">
                {s.hero.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services bento overview */}
      <section className="hairline-t section-sm">
        <div className="container-wide">
          <AnimatedSection className="mb-10 md:mb-14 max-w-2xl">
            <div className="mono-label mb-5">[ 01 ] OVERVIEW</div>
            <h2 className="font-serif text-ink text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] tracking-[-0.02em] text-balance">
              What each focus area covers
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-6 gap-5 md:gap-6">
            {s.items.map((item, i) => {
              const span = bentoSpans[i % bentoSpans.length];
              const isFeatured = i === 0;
              return (
                <StaggerItem key={i} className={span}>
                  <div className="hairline bg-paper-warm h-full p-6 sm:p-8 rounded-2xl transition duration-300 hover:border-ink/25 hover:-translate-y-0.5">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="mono-label text-ink/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px w-6 bg-ink/15" />
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg hairline bg-paper text-ink">
                        {iconMap[item.icon]}
                      </span>
                    </div>
                    <h3
                      className={`font-serif text-ink leading-[1.15] tracking-[-0.015em] mb-3 text-balance ${
                        isFeatured
                          ? "text-[1.75rem] md:text-[2rem]"
                          : "text-[1.375rem] md:text-[1.5rem]"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-ink/70 text-sm leading-relaxed text-pretty">
                      {item.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Deep dive — alternating rows */}
      <section className="hairline-t bg-paper-warm/40 section-sm">
        <div className="container-wide">
          <AnimatedSection className="mb-10 md:mb-14 max-w-2xl">
            <div className="mono-label mb-5">[ 02 ] DETAIL</div>
            <h2 className="font-serif text-ink text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] tracking-[-0.02em] text-balance">
              Problems addressed, outcomes targeted
            </h2>
          </AnimatedSection>

          <div className="space-y-12 md:space-y-16">
            {s.items.map((item, i) => (
              <AnimatedSection key={i}>
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start hairline-t pt-10 md:pt-12">
                  <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="mono-label text-ink/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px w-10 bg-ink/15" />
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg hairline bg-paper text-ink">
                        {iconMap[item.icon]}
                      </span>
                    </div>
                    <h3 className="font-serif text-ink text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] tracking-[-0.02em] mb-4 text-balance">
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
                    <div className="hairline bg-paper-warm p-6 rounded-2xl">
                      <div className="mono-label text-ink/50 mb-3">
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

                    <div className="hairline bg-paper p-6 rounded-2xl">
                      <div className="mono-label text-amber-700 mb-3">
                        {s.outcomesLabel}
                      </div>
                      <ul className="space-y-2.5">
                        {item.outcomes.map((o, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <Check
                              size={14}
                              className="mt-1 shrink-0 text-amber-700"
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
