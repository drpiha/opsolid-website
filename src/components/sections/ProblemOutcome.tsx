"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

export function ProblemOutcome() {
  const { t } = useLocale();
  const s = t.home.transformation;

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Subtle AI/abstract background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-white/[0.96]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/50" />
      </div>

      <div className="container-wide relative z-10">
        <SectionHeading label={s.label} headline={s.headline} gradient />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {s.items.map((item, i) => (
            <StaggerItem key={i}>
              <div className="rounded-xl overflow-hidden border border-slate-100/80">
                {/* Before - red tint */}
                <div className="bg-red-50/60 px-5 py-4">
                  <div className="text-sm text-red-400 line-through decoration-red-300/60">
                    {item.before}
                  </div>
                </div>

                {/* Gradient arrow divider */}
                <div className="flex items-center justify-center -my-3 relative z-10">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-red-400 to-teal-500 shadow-sm">
                    <ArrowRight size={12} className="text-white" />
                  </div>
                </div>

                {/* After - teal tint */}
                <div className="bg-teal-50/60 px-5 py-4">
                  <span className="text-sm font-medium text-teal-800">
                    {item.after}
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
