"use client";

import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

export function WhyUs() {
  const { t } = useLocale();
  const s = t.home.whyUs;

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Dark gradient mesh background */}
      <div className="absolute inset-0 -z-10 bg-slate-900">
        <div className="absolute top-10 left-[15%] w-96 h-96 bg-brand-500/[0.08] rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-[10%] w-80 h-80 bg-accent-500/[0.06] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/[0.04] rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/70" />
      </div>

      <div className="container-wide relative z-10">
        <SectionHeading
          label={s.label}
          headline={s.headline}
          className="[&_p]:text-slate-300 [&_h2]:text-white"
        />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {s.points.map((point, i) => (
            <StaggerItem key={i}>
              <div className="relative rounded-xl bg-white/[0.07] backdrop-blur-md border border-white/10 p-6 md:p-7 pl-8 md:pl-9 transition-all duration-300 hover:bg-white/[0.12] hover:-translate-y-0.5 overflow-hidden">
                {/* 2px gradient left border */}
                <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gradient-to-b from-brand-400 via-accent-400 to-teal-400 rounded-full" />
                <h3 className="text-base font-semibold text-white">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {point.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
