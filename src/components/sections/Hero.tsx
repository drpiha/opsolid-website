"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { useLocale } from "@/context/LocaleContext";
import { KineticMechanism } from "@/components/sections/hero/KineticMechanism";
import { ArrowRight } from "lucide-react";

/**
 * A title line may contain a single *word* (wrapped in asterisks) rendered in
 * Instrument Serif italic with a copper gradient — the v2 signature editorial
 * move. Lines without a marker render normally.
 */
function TitleLine({ line }: { line: string }) {
  const parts = line.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <span className="block">
      {parts.map((part, i) => {
        if (part.startsWith("*") && part.endsWith("*")) {
          return (
            <span key={i} className="editorial">
              {part.slice(1, -1)}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

export function Hero() {
  const { t } = useLocale();
  const hero = t.home.hero as {
    editorial?: {
      eyebrow?: string;
      title?: readonly string[];
      paragraph?: string;
      primaryCta?: string;
      secondaryCta?: string;
    };
    ratingPill?: string;
    title?: readonly string[];
    subtitle?: string;
    subheadline?: string;
    headline?: string;
    primaryCta?: string;
    secondaryCta?: string;
    primaryCtaLabel?: string;
    secondaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaHref?: string;
  };
  const editorial = hero.editorial;

  const eyebrow =
    editorial?.eyebrow ?? hero.ratingPill ?? "OPSOLID · AUTOMATION STUDIO";
  const titleLines: readonly string[] =
    editorial?.title && editorial.title.length > 0
      ? editorial.title
      : hero.title ?? [];
  const lead = editorial?.paragraph ?? hero.subtitle ?? hero.subheadline;
  const primaryLabel =
    editorial?.primaryCta ?? hero.primaryCtaLabel ?? hero.primaryCta;
  const secondaryLabel =
    editorial?.secondaryCta ?? hero.secondaryCtaLabel ?? hero.secondaryCta;

  return (
    <section className="os-hero" aria-labelledby="hero-title">
      <div className="os-hero-inner">
        {/* LEFT — editorial stack */}
        <div className="os-hero-text">
          <div className="os-hero-meta">
            <span className="meta meta-hot">{eyebrow}</span>
          </div>

          <h1 id="hero-title" className="os-hero-title text-balance">
            {titleLines.map((line, i) => (
              <TitleLine key={i} line={line} />
            ))}
          </h1>

          {lead && <p className="os-hero-lead text-pretty">{lead}</p>}

          <div className="os-hero-ctas">
            <Link
              href={hero.primaryCtaHref || "/contact"}
              className="btn btn-primary btn-lg"
            >
              <span>{primaryLabel}</span>
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <Link
              href={hero.secondaryCtaHref || "/solutions"}
              className="btn btn-ghost btn-lg"
            >
              {secondaryLabel}
            </Link>
          </div>

          <div className="os-hero-stats">
            <div>
              <div className="os-stat-num">
                <span className="metallic-copper">42</span>
              </div>
              <div className="os-stat-label">Workflows shipped</div>
            </div>
            <div>
              <div className="os-stat-num">
                <span className="metallic-copper">3.4M</span>
              </div>
              <div className="os-stat-label">Events / mo</div>
            </div>
            <div>
              <div className="os-stat-num">
                <span className="metallic-copper">EU · DE</span>
              </div>
              <div className="os-stat-label">Hosting · data</div>
            </div>
          </div>
        </div>

        {/* RIGHT — kinetic mechanism */}
        <div className="os-hero-mech">
          <KineticMechanism />
        </div>
      </div>
    </section>
  );
}
