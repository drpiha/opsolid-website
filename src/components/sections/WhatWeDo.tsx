"use client";

import { Workflow, Plug, LayoutDashboard, Bot } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useLocale } from "@/context/LocaleContext";

const ICONS = [
  <Workflow key="w" size={22} strokeWidth={2} />,
  <Plug key="p" size={22} strokeWidth={2} />,
  <LayoutDashboard key="l" size={22} strokeWidth={2} />,
  <Bot key="b" size={22} strokeWidth={2} />,
];

export function WhatWeDo() {
  const { t } = useLocale();
  const s = t.home.whatWeDo;

  return (
    <section className="section bg-neutral-50">
      <div className="container-wide">
        <AnimatedSection>
          <SectionHeading
            label={s.label}
            headline={s.headline}
            description={s.description}
            align="center"
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {s.points.map((point, i) => (
            <AnimatedSection key={i} delay={0.05 * i}>
              <div className="pop-card h-full p-6 md:p-7 flex flex-col">
                <div className="w-11 h-11 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-4">
                  {ICONS[i % ICONS.length]}
                </div>
                <p className="text-body text-ink leading-relaxed text-pretty">
                  {point}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
