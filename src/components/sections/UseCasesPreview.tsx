"use client";

import { Rocket, TrendingUp, Megaphone, UserCheck } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useLocale } from "@/context/LocaleContext";

const ICON_MAP: Record<string, React.ReactNode> = {
  founder: <Rocket size={22} strokeWidth={2} />,
  sales: <TrendingUp size={22} strokeWidth={2} />,
  agency: <Megaphone size={22} strokeWidth={2} />,
  freelancer: <UserCheck size={22} strokeWidth={2} />,
};

export function UseCasesPreview() {
  const { t } = useLocale();
  const s = t.home.whoUses;

  return (
    <section className="section bg-white">
      <div className="container-wide">
        <AnimatedSection>
          <SectionHeading
            label={s.label}
            headline={s.headline}
            align="center"
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {s.items.map((item, i) => (
            <AnimatedSection key={i} delay={0.05 * i}>
              <div className="pop-card h-full p-6 md:p-7 flex flex-col">
                <div className="w-11 h-11 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mb-5">
                  {ICON_MAP[item.icon] ?? <Rocket size={22} strokeWidth={2} />}
                </div>
                <h3 className="text-heading-sm font-bold text-ink mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-body-sm text-ink/60 leading-relaxed text-pretty">
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
