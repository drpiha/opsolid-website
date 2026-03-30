"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

export function WhatWeDo() {
  const { t } = useLocale();
  const s = t.home.whatWeDo;

  return (
    <section className="section-padding relative">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh -z-10" />

      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Content */}
          <AnimatedSection>
            <SectionHeading
              label={s.label}
              headline={s.headline}
              gradient
              align="left"
              className="mb-6"
            />
            <p className="text-body-lg text-slate-500 mb-10">
              {s.description}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {s.points.map((point, i) => (
                <li key={i} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-3.5 border border-white/40">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-teal-500">
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-slate-700 font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          {/* Right side - Image */}
          <AnimatedSection delay={0.2}>
            <div className="relative">
              {/* Gradient border glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-br from-brand-500/20 via-accent-500/10 to-teal-500/20 rounded-2xl blur-sm" />
              <div className="relative h-[400px] lg:h-[480px] rounded-2xl overflow-hidden shadow-medium">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/20 to-transparent" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
