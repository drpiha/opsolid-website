"use client";

import { ShieldCheck, MapPin, Scale, Lock } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

export function WhyUs() {
  const { t } = useLocale();
  const s = t.home.whyUs;

  const pillars = [
    {
      icon: <MapPin size={20} strokeWidth={2} />,
      label: "Hosted in Frankfurt",
    },
    {
      icon: <Scale size={20} strokeWidth={2} />,
      label: "GDPR-native",
    },
    {
      icon: <ShieldCheck size={20} strokeWidth={2} />,
      label: "ISO 27001",
    },
    {
      icon: <Lock size={20} strokeWidth={2} />,
      label: "No US subprocessors",
    },
  ];

  return (
    <section className="section bg-ink text-white">
      <div className="container-wide">
        <div className="relative rounded-3xl bg-ink-800 border border-white/10 p-8 md:p-14 overflow-hidden">
          {/* Ambient red glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-brand/20 blur-3xl"
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center">
            <AnimatedSection>
              <div className="eyebrow uppercase mb-4 text-brand-300">
                {s.label}
              </div>
              <h2 className="font-sans font-extrabold text-white text-[clamp(2rem,4.2vw,3rem)] leading-[1.05] tracking-[-0.03em] text-balance">
                {s.headline}
              </h2>
              <p className="mt-6 text-body-lg text-white/70 max-w-xl leading-relaxed text-pretty">
                {s.points[3]?.description ??
                  "Built in Germany, not marketed here. Your data, your laws, your company's pace."}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pillars.map((pillar, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5"
                  >
                    <span className="shrink-0 w-9 h-9 rounded-xl bg-brand/20 text-brand-300 flex items-center justify-center">
                      {pillar.icon}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {pillar.label}
                    </span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
