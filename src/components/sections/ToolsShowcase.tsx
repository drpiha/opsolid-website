"use client";

import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

const LOGOS = [
  "n8n",
  "Make",
  "Zapier",
  "Shopify",
  "HubSpot",
  "Salesforce",
  "Pipedrive",
  "WhatsApp",
  "Telegram",
  "Postgres",
  "OpenAI",
  "Google Workspace",
  "Stripe",
  "Notion",
];

export function ToolsShowcase() {
  const { t } = useLocale();
  const label = t.home.integrations.headline;

  return (
    <section
      aria-label="Platform integrations"
      className="py-12 md:py-14 bg-white border-t border-neutral-200 overflow-hidden"
    >
      <div className="container-wide">
        <AnimatedSection>
          <p className="eyebrow uppercase text-ink/50 text-center mb-6">
            {label}
          </p>
        </AnimatedSection>
      </div>

      <div
        className="relative mx-auto max-w-[1400px] overflow-hidden"
        role="presentation"
        aria-hidden="true"
      >
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="flex">
          <div className="flex shrink-0 animate-ticker">
            <LogoRow />
            <LogoRow />
          </div>
        </div>
      </div>
    </section>
  );
}

function LogoRow() {
  return (
    <div className="flex items-center shrink-0">
      {LOGOS.map((name, i) => (
        <div
          key={i}
          className="flex items-center justify-center px-8 md:px-10 shrink-0"
        >
          <span className="text-lg md:text-xl font-bold tracking-tight text-ink/40 hover:text-ink transition-colors whitespace-nowrap grayscale hover:grayscale-0">
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}
