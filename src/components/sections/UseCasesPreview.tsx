"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

export function UseCasesPreview() {
  const { t } = useLocale();
  const s = t.home.useCases;

  return (
    <section className="section-padding bg-slate-50/40">
      <div className="container-wide">
        <SectionHeading label={s.label} headline={s.headline} />

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {s.items.map((item, i) => (
            <StaggerItem key={i}>
              <Link
                href="/use-cases"
                className="group block h-full"
              >
                <div className="relative h-full rounded-xl gradient-border p-5 transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 overflow-hidden">
                  {/* Small gradient accent bar at top */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 via-accent-500 to-teal-500" />

                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-brand-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="mt-0.5 shrink-0 text-slate-200 group-hover:text-brand-500 transition-colors"
                    />
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
