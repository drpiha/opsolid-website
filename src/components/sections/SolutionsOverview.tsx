"use client";

import {
  Workflow,
  Plug,
  LayoutDashboard,
  Bot,
  MessageSquare,
  Shield,
  Nfc,
  Wallet,
  LineChart,
  RefreshCw,
  Users,
  ServerCog,
} from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useLocale } from "@/context/LocaleContext";

const iconMap: Record<string, React.ReactNode> = {
  workflow: <Workflow size={22} strokeWidth={2} />,
  plug: <Plug size={22} strokeWidth={2} />,
  layout: <LayoutDashboard size={22} strokeWidth={2} />,
  bot: <Bot size={22} strokeWidth={2} />,
  messageSquare: <MessageSquare size={22} strokeWidth={2} />,
  shield: <Shield size={22} strokeWidth={2} />,
  nfc: <Nfc size={22} strokeWidth={2} />,
  wallet: <Wallet size={22} strokeWidth={2} />,
  chart: <LineChart size={22} strokeWidth={2} />,
  sync: <RefreshCw size={22} strokeWidth={2} />,
  team: <Users size={22} strokeWidth={2} />,
  hosting: <ServerCog size={22} strokeWidth={2} />,
};

export function SolutionsOverview() {
  const { t } = useLocale();
  const s = t.home.featureGrid;

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="section bg-white"
    >
      <div className="container-wide">
        <AnimatedSection>
          <SectionHeading
            label={s.label}
            headline={s.headline}
            description={s.description}
            align="center"
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {s.items.map((item, i) => (
            <AnimatedSection
              key={i}
              delay={0.05 * i}
              className="h-full"
            >
              <div className="pop-card h-full p-6 md:p-8 flex flex-col">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-5">
                  {iconMap[item.icon]}
                </div>
                <h3 className="text-heading font-bold text-ink mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-body text-ink/60 leading-relaxed text-pretty">
                  {item.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
