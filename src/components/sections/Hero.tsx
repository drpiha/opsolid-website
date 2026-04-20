"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { useLocale } from "@/context/LocaleContext";
import { HeroCardMockup } from "@/components/sections/hero/HeroCardMockup";
import { Star, ArrowRight } from "lucide-react";

export function Hero() {
  const { t } = useLocale();
  const hero = t.home.hero;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-20"
    >
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* LEFT — text */}
          <div className="lg:col-span-7 animate-fade-in">
            {/* Rating pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-50 border border-neutral-200 px-3.5 py-1.5 shadow-soft">
              <span className="flex items-center gap-0.5 text-brand" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              <span className="text-xs font-semibold text-ink">
                {hero.ratingPill}
              </span>
            </div>

            {/* Display heading */}
            <h1
              id="hero-title"
              className="mt-6 md:mt-8 font-sans font-extrabold text-ink tracking-[-0.035em] leading-[0.98] text-balance text-[clamp(2.75rem,7vw,5.25rem)]"
            >
              {hero.title.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>

            {/* Body */}
            <p className="mt-6 md:mt-7 text-body-lg text-ink/60 max-w-[560px] leading-relaxed text-pretty">
              {hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={hero.primaryCtaHref || "/contact"}
                className="btn-primary text-[0.95rem]"
              >
                <span>{hero.primaryCtaLabel}</span>
                <ArrowRight
                  size={16}
                  strokeWidth={2.5}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
              <Link href={hero.secondaryCtaHref || "/solutions"} className="btn-ghost text-[0.95rem]">
                <span>{hero.secondaryCtaLabel}</span>
              </Link>
            </div>

            {/* Micro footnote */}
            <p className="mt-5 text-sm text-ink/50">{hero.footnote}</p>

            {/* Products nod */}
            <p className="mt-6 text-xs text-ink/45 max-w-md">
              {hero.consultingNote}{" "}
              <Link
                href="/products"
                className="underline underline-offset-4 decoration-ink/25 hover:decoration-brand hover:text-brand transition-colors"
              >
                See products →
              </Link>
            </p>
          </div>

          {/* RIGHT — SVG mockup */}
          <div className="lg:col-span-5 animate-rise">
            <HeroCardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
