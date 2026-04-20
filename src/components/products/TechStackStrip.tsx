"use client";

import { AnimatedSection } from "@/components/shared/AnimatedSection";

interface TechStackStripProps {
  label: string;
  heading: string;
  items: readonly string[];
  className?: string;
}

/**
 * TechStackStrip — a horizontal row of text "chips" representing
 * the real vendors/tools the products are built on. Meant as a proof
 * block at the bottom of ProductsPage (and reusable elsewhere).
 */
export function TechStackStrip({
  label,
  heading,
  items,
  className = "",
}: TechStackStripProps) {
  return (
    <section
      className={`section-sm bg-white border-t border-neutral-100 ${className}`}
      aria-labelledby="tech-stack-heading"
    >
      <div className="container-wide">
        <AnimatedSection className="max-w-3xl mb-8 md:mb-10">
          <p className="eyebrow uppercase text-brand mb-3">{label}</p>
          <h2
            id="tech-stack-heading"
            className="text-heading font-extrabold tracking-[-0.02em] text-ink text-balance"
          >
            {heading}
          </h2>
        </AnimatedSection>

        <AnimatedSection>
          <ul className="flex flex-wrap gap-2.5 md:gap-3">
            {items.map((name, i) => (
              <li key={i}>
                <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-ink/80 shadow-sm hover:border-ink/30 transition-colors">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {name}
                </span>
              </li>
            ))}
          </ul>
        </AnimatedSection>
      </div>
    </section>
  );
}
