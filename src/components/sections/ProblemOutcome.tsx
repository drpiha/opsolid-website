"use client";

import { motion } from "framer-motion";
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
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 -z-10 bg-slate-50/60">
        <div className="absolute top-10 left-[10%] w-80 h-80 bg-brand-500/[0.04] rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-[15%] w-72 h-72 bg-teal-500/[0.05] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/[0.03] rounded-full blur-[120px]" />
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

                {/* Animated gradient arrow divider */}
                <div className="flex items-center justify-center -my-3 relative z-10">
                  <motion.div
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-red-400 to-teal-500 shadow-md"
                    whileInView={{ rotate: [0, 0, 360], scale: [0.8, 1.1, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
                  >
                    <ArrowRight size={13} className="text-white" />
                  </motion.div>
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
