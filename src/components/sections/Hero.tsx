"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { useLocale } from "@/context/LocaleContext";
import { HeroSchematic } from "@/components/sections/hero/HeroSchematic";

const TICKER_TOOLS = [
  "n8n",
  "Postgres",
  "Supabase",
  "WhatsApp Business",
  "Telegram",
  "Shopify",
  "HubSpot",
  "OpenAI",
  "Make",
  "Zapier",
  "Google Workspace",
  "Stripe",
];

export function Hero() {
  const { t } = useLocale();
  const hero = t.home.hero;
  const editorial = hero.editorial;

  // Join title array into a single string for screen readers in the <h1>.
  const flattenedTitle = editorial.title.join(" ");

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden pt-28 md:pt-36 lg:pt-40 paper-grain"
    >
      {/* Top hairline + eyebrow rail */}
      <div className="hairline-b">
        <div className="container-wide flex items-center justify-between py-3">
          <span className="mono-label text-ink/60">{editorial.eyebrow}</span>
          <span className="mono-label hidden md:inline text-ink/40">
            {new Date().getFullYear()}
          </span>
        </div>
      </div>

      <div className="container-wide relative z-10 pt-10 md:pt-16 lg:pt-20 pb-10 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* LEFT — editorial text column (60%) */}
          <div className="lg:col-span-7 animate-fade-in">
            {/* Title */}
            <h1
              id="hero-title"
              className="font-serif text-ink text-[clamp(2.5rem,6.5vw,5.25rem)] leading-[1.02] tracking-[-0.025em] text-balance"
            >
              <span className="sr-only">{flattenedTitle}</span>
              <span aria-hidden="true" className="block">
                {editorial.title.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </h1>

            {/* Paragraph */}
            <p className="mt-7 md:mt-9 max-w-xl text-ink/70 text-body-lg leading-relaxed text-pretty">
              {editorial.paragraph}
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2.5 bg-amber text-ink px-6 py-3.5 font-medium hairline hover:bg-amber-600 hover:text-paper transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
              >
                <span>{editorial.primaryCta}</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
              <Link
                href="/solutions"
                className="inline-flex items-center gap-2 text-ink underline underline-offset-8 decoration-ink/20 decoration-1 hover:decoration-ink transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
              >
                <span>{editorial.secondaryCta}</span>
              </Link>
            </div>

            {/* Meta row: role marker */}
            <div className="mt-10 md:mt-14 hidden sm:flex items-center gap-6">
              <span className="mono-label text-ink/50">01 · Studio</span>
              <span className="h-px w-10 bg-ink/15" aria-hidden="true" />
              <span className="mono-label text-ink/50">
                02 · Practical Automation
              </span>
            </div>
          </div>

          {/* RIGHT — schematic column (40%), lg+ only */}
          <div className="hidden lg:block lg:col-span-5 animate-fade-in">
            <HeroSchematic />
          </div>
        </div>
      </div>

      {/* Marquee ticker — trusted stack */}
      <div className="hairline-t hairline-b bg-paper-cool/40 max-w-full">
        <div
          className="relative overflow-hidden ticker-scroll max-w-full"
          role="presentation"
          aria-hidden="true"
        >
          <div className="group flex">
            <div className="flex shrink-0 animate-ticker group-hover:[animation-play-state:paused] whitespace-nowrap py-4">
              <TickerRow label={editorial.stackLabel} tools={TICKER_TOOLS} />
              <TickerRow label={editorial.stackLabel} tools={TICKER_TOOLS} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TickerRow({ label, tools }: { label: string; tools: string[] }) {
  return (
    <div className="flex items-center">
      <span className="mono-label text-ink/60 px-6">{label}</span>
      <span className="text-ink/25 pr-6" aria-hidden="true">
        ·
      </span>
      {tools.map((tool, i) => (
        <span key={i} className="flex items-center">
          <span className="text-ink/80 text-sm tracking-tight pr-6">
            {tool}
          </span>
          <span className="text-ink/25 pr-6" aria-hidden="true">
            ·
          </span>
        </span>
      ))}
    </div>
  );
}
