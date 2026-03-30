"use client";

import { motion } from "framer-motion";
import { Search, PenTool, Code2, TrendingUp } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";
import { processStepIcons } from "@/components/illustrations/ProcessStepIcons";

const stepIcons = [
  {
    icon: Search,
    gradient: "from-brand-500 to-brand-700",
    glow: "shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)]",
    bgLight: "bg-brand-50",
  },
  {
    icon: PenTool,
    gradient: "from-accent-500 to-accent-700",
    glow: "shadow-[0_0_20px_-5px_rgba(139,92,246,0.4)]",
    bgLight: "bg-accent-50",
  },
  {
    icon: Code2,
    gradient: "from-teal-500 to-teal-700",
    glow: "shadow-[0_0_20px_-5px_rgba(20,184,166,0.4)]",
    bgLight: "bg-teal-50",
  },
  {
    icon: TrendingUp,
    gradient: "from-cyan-400 to-brand-600",
    glow: "shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)]",
    bgLight: "bg-cyan-50",
  },
];

export function HowWeWork() {
  const { t } = useLocale();
  const s = t.home.howWeWork;

  return (
    <section className="section-padding">
      <div className="container-wide">
        <SectionHeading label={s.label} headline={s.headline} />

        {/* Desktop: horizontal timeline */}
        <StaggerContainer className="hidden lg:block max-w-5xl mx-auto">
          {/* Gradient connecting line */}
          <div className="relative">
            <div className="absolute top-8 left-[calc(12.5%-0.5rem)] right-[calc(12.5%-0.5rem)] h-0.5 bg-gradient-to-r from-brand-500 via-accent-500 to-teal-500 rounded-full" />
          </div>

          <div className="grid grid-cols-4 gap-10 relative">
            {s.steps.map((step, i) => {
              const visual = stepIcons[i] || stepIcons[0];
              const Icon = visual.icon;

              return (
                <StaggerItem key={i}>
                  <div className="text-center">
                    {/* Icon with gradient background */}
                    <motion.div
                      className="relative mx-auto mb-5"
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Glow ring behind the icon */}
                      <div
                        className={`absolute inset-0 w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${visual.gradient} opacity-20 blur-md`}
                      />
                      {/* Main icon container */}
                      <div
                        className={`relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${visual.gradient} ${visual.glow}`}
                      >
                        <Icon size={26} className="text-white" strokeWidth={1.8} />
                      </div>
                      {/* Step number badge */}
                      <div className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-slate-100 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-600">
                          {step.step}
                        </span>
                      </div>
                    </motion.div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                      {step.description}
                    </p>
                    {/* Step illustration */}
                    {processStepIcons[i] && (() => {
                      const StepIllustration = processStepIcons[i];
                      return <StepIllustration className="mt-4" />;
                    })()}
                  </div>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerContainer>

        {/* Mobile/Tablet: vertical timeline */}
        <StaggerContainer className="lg:hidden max-w-xl mx-auto">
          <div className="relative pl-16">
            {/* Vertical gradient line */}
            <div className="absolute left-[1.4375rem] top-5 bottom-5 w-0.5 bg-gradient-to-b from-brand-500 via-accent-500 to-teal-500 rounded-full" />

            <div className="space-y-12">
              {s.steps.map((step, i) => {
                const visual = stepIcons[i] || stepIcons[0];
                const Icon = visual.icon;

                return (
                  <StaggerItem key={i}>
                    <div className="relative">
                      {/* Icon with gradient background */}
                      <div className="absolute -left-16 top-0">
                        <div className="relative">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${visual.gradient} ${visual.glow}`}
                          >
                            <Icon size={20} className="text-white" strokeWidth={1.8} />
                          </div>
                          {/* Step number badge */}
                          <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-slate-100 shadow-sm">
                            <span className="text-[9px] font-bold text-slate-600">
                              {step.step}
                            </span>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </StaggerItem>
                );
              })}
            </div>
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
