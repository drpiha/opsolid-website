"use client";

import { Star } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useLocale } from "@/context/LocaleContext";

export function ProblemOutcome() {
  const { t } = useLocale();
  const s = t.home.testimonials;

  return (
    <section className="section bg-neutral-50">
      <div className="container-wide">
        <AnimatedSection>
          <SectionHeading
            label={s.label}
            headline={s.headline}
            align="center"
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {s.items.map((item, i) => (
            <AnimatedSection key={i} delay={0.08 * i}>
              <figure className="pop-card h-full p-6 md:p-7 flex flex-col gap-5">
                {/* Stars */}
                <div
                  className="flex items-center gap-0.5 text-brand"
                  aria-label="5 out of 5 stars"
                >
                  {[0, 1, 2, 3, 4].map((j) => (
                    <Star key={j} size={16} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-ink text-body leading-relaxed text-pretty flex-1">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                {/* Avatar + credentials */}
                <figcaption className="flex items-center gap-3 pt-4 border-t border-neutral-200">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand to-brand-700 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {item.name
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0] ?? "")
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink truncate">
                      {item.name}
                    </div>
                    <div className="text-xs text-ink/55 truncate">
                      {item.role} · {item.company}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
