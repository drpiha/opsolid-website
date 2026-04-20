"use client";

import {
  MessageCircle,
  Send,
  Workflow,
  ShoppingBag,
  Users,
  Database,
  Mail,
  Code,
  Cloud,
  HardDrive,
  Zap,
  Settings,
} from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

const iconMap: Record<string, React.ReactNode> = {
  messageCircle: <MessageCircle size={20} strokeWidth={1.5} />,
  send: <Send size={20} strokeWidth={1.5} />,
  workflow: <Workflow size={20} strokeWidth={1.5} />,
  shoppingBag: <ShoppingBag size={20} strokeWidth={1.5} />,
  users: <Users size={20} strokeWidth={1.5} />,
  database: <Database size={20} strokeWidth={1.5} />,
  mail: <Mail size={20} strokeWidth={1.5} />,
  code: <Code size={20} strokeWidth={1.5} />,
  cloud: <Cloud size={20} strokeWidth={1.5} />,
  hardDrive: <HardDrive size={20} strokeWidth={1.5} />,
  zap: <Zap size={20} strokeWidth={1.5} />,
  settings: <Settings size={20} strokeWidth={1.5} />,
};

export function IntegrationGrid() {
  const { t } = useLocale();
  const s = t.home.integrations;

  return (
    <section className="section-sm hairline-t bg-paper-warm">
      <div className="container-wide">
        {/* Editorial header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-10 lg:mb-14">
          <AnimatedSection className="lg:col-span-7">
            <div className="mono-label mb-4">{s.label}</div>
            <h2 className="font-serif text-ink text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.08] tracking-[-0.02em] text-balance">
              {s.headline}
            </h2>
          </AnimatedSection>
        </div>

        {/* Integration grid — hairline cells */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 border-t border-l border-ink/10">
          {s.items.map((item, i) => (
            <AnimatedSection
              key={i}
              delay={0.02 * i}
              className="border-r border-b border-ink/10 bg-paper-warm flex flex-col items-center justify-center gap-2 p-5 md:p-6 group hover:bg-paper transition-colors duration-300"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/10 bg-paper text-ink/80 group-hover:text-amber-700 group-hover:border-amber/40 transition-colors duration-300">
                {iconMap[item.icon] ?? <Code size={20} strokeWidth={1.5} />}
              </div>
              <span className="text-[0.7rem] sm:text-xs text-ink/70 text-center tracking-tight leading-tight">
                {item.name}
              </span>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
