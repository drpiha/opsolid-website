"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import {
  AgentDemoPreview,
  type AgentDemoVariant,
} from "@/components/products/AgentDemoPreview";
import { useLocale } from "@/context/LocaleContext";

const keyToVariant: Record<string, AgentDemoVariant> = {
  voice: "voice",
  chatbot: "chat",
  booking: "booking",
};

/**
 * 3 big product cards (Voice / Chatbot / Booking), each embedding the
 * matching AgentDemoPreview mockup. Each card links to the product page.
 */
export function AgentShowcase() {
  const { t } = useLocale();
  const s = t.home.agentShowcase;

  return (
    <section
      aria-labelledby="agent-showcase-heading"
      className="section bg-neutral-50"
    >
      <div className="container-wide">
        <AnimatedSection className="max-w-3xl mb-12 md:mb-16">
          <p className="eyebrow uppercase text-brand mb-3">{s.eyebrow}</p>
          <h2
            id="agent-showcase-heading"
            className="text-heading-lg md:text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.025em] text-ink leading-[1.05] text-balance"
          >
            {s.heading}
          </h2>
          <p className="mt-4 text-ink/65 text-body-lg leading-relaxed text-pretty">
            {s.paragraph}
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {s.items.map((item, i) => {
            const variant = keyToVariant[item.key] ?? "voice";
            return (
              <AnimatedSection key={item.key} delay={i * 0.08}>
                <Link
                  href={item.href}
                  className="pop-card group relative flex h-full flex-col overflow-hidden p-6 md:p-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                  aria-label={`Learn more about ${item.title}`}
                >
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink/60">
                      {item.badge}
                    </span>
                  </div>

                  <div className="mb-6 flex min-h-[280px] md:min-h-[320px] items-center justify-center">
                    <div className="scale-[0.85] md:scale-90 origin-center">
                      <AgentDemoPreview variant={variant} />
                    </div>
                  </div>

                  <div className="mt-auto">
                    <h3 className="text-xl md:text-2xl font-extrabold tracking-[-0.02em] text-ink leading-tight">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-ink/65 leading-relaxed text-pretty">
                      {item.body}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-brand transition-colors">
                      Learn more
                      <ArrowRight
                        size={14}
                        strokeWidth={2.5}
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
