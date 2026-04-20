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
} from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

const iconMap: Record<string, React.ReactNode> = {
  workflow: <Workflow size={18} strokeWidth={1.5} />,
  layout: <LayoutDashboard size={18} strokeWidth={1.5} />,
  gitBranch: <GitBranch size={18} strokeWidth={1.5} />,
  plug: <Plug size={18} strokeWidth={1.5} />,
  target: <Target size={18} strokeWidth={1.5} />,
  package: <Package size={18} strokeWidth={1.5} />,
  messageSquare: <MessageSquare size={18} strokeWidth={1.5} />,
  bot: <Bot size={18} strokeWidth={1.5} />,
};

/**
 * 8-cell asymmetric bento layout.
 * `lg:grid-cols-6` with manual col/row spans to produce variation.
 * Visual rhythm (left→right, top→bottom):
 *   [ A A A ][ B B B ]      row 1 — two wide
 *   [ C C ][ D D ][ E E ]  row 2 — three equal
 *   [ F F ][ G G G G ]     row 3 — one narrow + one wide
 *   [ H H H H H H ]          row 4 — one full-width
 * ...collapsed intelligently on smaller breakpoints.
 */
const spans = [
  "lg:col-span-3 lg:row-span-1",        // 0
  "lg:col-span-3 lg:row-span-1",        // 1
  "lg:col-span-2 lg:row-span-1",        // 2
  "lg:col-span-2 lg:row-span-1",        // 3
  "lg:col-span-2 lg:row-span-1",        // 4
  "lg:col-span-2 lg:row-span-1",        // 5
  "lg:col-span-4 lg:row-span-1",        // 6
  "lg:col-span-6 lg:row-span-1",        // 7
];

export function SolutionsOverview() {
  const { t } = useLocale();
  const s = t.home.solutions;

  return (
    <section className="section hairline-t bg-paper-cool/40">
      <div className="container-wide">
        {/* Editorial two-column header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 lg:mb-16">
          <AnimatedSection className="lg:col-span-7">
            <div className="mono-label mb-4">{s.label}</div>
            <h2 className="font-serif text-ink text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.06] tracking-[-0.02em] text-balance">
              {s.headline}
            </h2>
          </AnimatedSection>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-5">
          {s.items.map((item, i) => (
            <AnimatedSection
              key={i}
              delay={0.04 * i}
              className={spans[i % spans.length]}
            >
              <Link
                href="/solutions"
                className="group block h-full rounded-2xl border border-ink/10 bg-paper-warm p-6 md:p-7 transition duration-300 hover:border-amber/60 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber focus-visible:outline-none"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/10 bg-paper text-ink">
                    {iconMap[item.icon]}
                  </div>
                  <div className="mono-label text-ink/50">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <h3 className="font-serif text-ink text-[1.375rem] leading-[1.2] tracking-[-0.015em] group-hover:text-ink transition-colors">
                  {item.title}
                </h3>
                <p className="mt-3 text-ink/70 text-sm leading-relaxed text-pretty">
                  {item.description}
                </p>
                <span
                  aria-hidden="true"
                  className="mt-5 inline-flex items-center gap-1.5 text-ink/60 group-hover:text-amber-700 transition-colors text-sm"
                >
                  <span className="mono-label">Learn more</span>
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
