"use client";

import Image from "next/image";
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
      {/* Background Unsplash image with dark overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/92 via-slate-900/88 to-slate-900/95" />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/30 to-transparent" />
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
