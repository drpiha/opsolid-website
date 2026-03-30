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
      {/* Subtle background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-50/[0.95]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/60" />
      </div>

      <div className="container-wide relative z-10">
        <SectionHeading label={s.label} headline={s.headline} />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {s.items.map((item, i) => {
            const accent = accentCycle[i % accentCycle.length];
            return (
              <StaggerItem key={i}>
                <Link href="/solutions" className="block h-full">
                  <div className="h-full rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-soft p-6 md:p-7 group transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accent.bg} ${accent.text} mb-4`}
                    >
                      {iconMap[item.icon]}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-brand-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
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
