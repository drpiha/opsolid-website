"use client";

/**
 * V2ServiceHero — minimal reusable hero shell for service/content pages
 * that don't have their own bespoke composition (yet). Lands the page in
 * the Concrete Studio register with the right typography ramp and CTA
 * grammar; the page-specific composition can be layered in M2+ rounds.
 *
 * Props are flat strings so each page can pass its own locale-resolved
 * content without coupling to a particular content shape.
 */

import { LocaleLink as Link } from "@/components/shared/LocaleLink";

export type V2ServiceHeroProps = {
  eyebrow: string;
  headline: string;
  lead: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  /**
   * Optional variant. "editorial" swaps the display font to an italic
   * serif feel (currently Plus Jakarta italic at heavier weight; M9 may
   * upgrade to a real serif). "tight" caps the headline at ~14ch.
   */
  variant?: "default" | "editorial" | "tight";
};

export function V2ServiceHero({
  eyebrow,
  headline,
  lead,
  ctaPrimary,
  ctaSecondary,
  variant = "default",
}: V2ServiceHeroProps) {
  const headlineClass =
    "v2-svc-hero__headline" +
    (variant === "editorial" ? " v2-svc-hero__headline--editorial" : "") +
    (variant === "tight" ? " v2-svc-hero__headline--tight" : "");

  return (
    <section className="v2-svc-hero">
      <div className="wrap v2-svc-hero__inner">
        <span className="v2-svc-hero__eyebrow">{eyebrow}</span>
        <h1 className={headlineClass}>{headline}</h1>
        <p className="v2-svc-hero__lead">{lead}</p>
        {(ctaPrimary || ctaSecondary) && (
          <div className="v2-svc-hero__ctas">
            {ctaPrimary && (
              <Link
                href={ctaPrimary.href}
                className="v2-btn-primary"
                data-cursor="link"
              >
                {ctaPrimary.label}
              </Link>
            )}
            {ctaSecondary && (
              <Link
                href={ctaSecondary.href}
                className="v2-btn-ghost"
                data-cursor="link"
              >
                {ctaSecondary.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
