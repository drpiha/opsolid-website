"use client";

import Link from "next/link";
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
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
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

// Rotating accent colors: brand, accent, teal
const accentCycle = [
  { bg: "from-brand-500 to-brand-600", text: "text-white" },
  { bg: "from-accent-500 to-accent-600", text: "text-white" },
  { bg: "from-teal-500 to-teal-600", text: "text-white" },
  { bg: "from-brand-500 to-teal-500", text: "text-white" },
  { bg: "from-accent-500 to-brand-500", text: "text-white" },
  { bg: "from-teal-500 to-cyan-500", text: "text-white" },
  { bg: "from-brand-600 to-accent-500", text: "text-white" },
  { bg: "from-teal-600 to-brand-500", text: "text-white" },
];

export function SolutionsOverview() {
  const { t } = useLocale();
  const s = t.home.solutions;

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 -z-10 bg-slate-50/80">
        <div className="absolute top-0 left-[20%] w-96 h-96 bg-brand-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[10%] w-80 h-80 bg-accent-500/[0.04] rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-[30%] w-64 h-64 bg-teal-500/[0.03] rounded-full blur-[80px]" />
      </div>

      <div className="container-wide relative z-10">
        <SectionHeading label={s.label} headline={s.headline} />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {s.items.map((item, i) => {
            const accent = accentCycle[i % accentCycle.length];
            return (
              <StaggerItem key={i}>
                <Link href="/solutions" className="block h-full">
                  <div className="h-full rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-soft p-6 md:p-7 group transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 relative overflow-hidden">
                    {/* Decorative SVG pattern */}
                    <svg className="absolute top-0 right-0 w-24 h-24 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity" viewBox="0 0 80 80" fill="none">
                      <circle cx="60" cy="20" r="30" stroke="currentColor" strokeWidth="0.5" />
                      <circle cx="60" cy="20" r="18" stroke="currentColor" strokeWidth="0.5" />
                      <circle cx="60" cy="20" r="6" fill="currentColor" opacity="0.3" />
                      <line x1="30" y1="20" x2="54" y2="20" stroke="currentColor" strokeWidth="0.5" />
                      <line x1="60" y1="50" x2="60" y2="26" stroke="currentColor" strokeWidth="0.5" />
                    </svg>
                    <div
                      className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accent.bg} ${accent.text} mb-4`}
                    >
                      {iconMap[item.icon]}
                    </div>
                    <h3 className="relative z-10 text-sm font-semibold text-slate-900 group-hover:text-brand-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="relative z-10 mt-1.5 text-xs text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
