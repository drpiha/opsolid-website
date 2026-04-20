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
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useLocale } from "@/context/LocaleContext";

const iconMap: Record<string, React.ReactNode> = {
  messageCircle: <MessageCircle size={22} strokeWidth={2} />,
  send: <Send size={22} strokeWidth={2} />,
  workflow: <Workflow size={22} strokeWidth={2} />,
  shoppingBag: <ShoppingBag size={22} strokeWidth={2} />,
  users: <Users size={22} strokeWidth={2} />,
  database: <Database size={22} strokeWidth={2} />,
  mail: <Mail size={22} strokeWidth={2} />,
  code: <Code size={22} strokeWidth={2} />,
  cloud: <Cloud size={22} strokeWidth={2} />,
  hardDrive: <HardDrive size={22} strokeWidth={2} />,
  zap: <Zap size={22} strokeWidth={2} />,
  settings: <Settings size={22} strokeWidth={2} />,
};

export function IntegrationGrid() {
  const { t } = useLocale();
  const s = t.home.integrations;

  return (
    <section className="section-sm bg-white border-t border-neutral-200">
      <div className="container-wide">
        <AnimatedSection>
          <SectionHeading
            label={s.label}
            headline={s.headline}
            align="center"
          />
        </AnimatedSection>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {s.items.map((item, i) => (
            <AnimatedSection key={i} delay={0.02 * i}>
              <div className="h-full rounded-2xl bg-neutral-50 border border-neutral-200 hover:bg-white hover:shadow-card transition-all duration-300 p-5 md:p-6 flex flex-col items-center justify-center gap-3 group">
                <div className="w-11 h-11 rounded-xl bg-white border border-neutral-200 text-ink/70 group-hover:text-brand group-hover:border-brand/30 flex items-center justify-center transition-colors duration-300">
                  {iconMap[item.icon] ?? <Code size={22} strokeWidth={2} />}
                </div>
                <span className="text-xs md:text-sm font-semibold text-ink/70 text-center tracking-tight leading-tight">
                  {item.name}
                </span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
