"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { KineticMechanism } from "@/components/sections/hero/KineticMechanism";
import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";

/**
 * Homepage hero — industrial-luxury port of the Claude Design v2 mock.
 * Copy driven by `t.v2.home.hero.*` so EN / DE / TR all render correctly.
 * Stats tiles are honest data only (Frankfurt hosting, supported languages,
 * pre-market pilot window) — no invented figures.
 */
export function Hero() {
  const { t } = useLocale();
  const h = t.v2.home.hero;

  return (
    <section className="os-hero" aria-labelledby="hero-title">
      <div className="os-hero-inner">
        <div>
          {(h.metaChip || h.metaLabel) && (
            <div className="os-hero-meta">
              {h.metaChip && (
                <span className="chip chip-hot">
                  <span className="chip-dot chip-dot-live" /> {h.metaChip}
                </span>
              )}
              {h.metaLabel && <span className="meta">{h.metaLabel}</span>}
            </div>
          )}
          <h1 id="hero-title" className="os-hero-title">
            {h.title.pre}
            <span className="editorial">{h.title.italic}</span>
            {h.title.post}
          </h1>
          <p className="os-hero-lead">{h.lead}</p>
          <div className="os-hero-ctas">
            <Link href="/contact" className="btn btn-primary btn-lg">
              {h.ctaPrimary} <Icon name="arrow" size={18} />
            </Link>
            <Link href="/pricing" className="btn btn-ghost btn-lg">
              {h.ctaSecondary}
            </Link>
          </div>
          {h.stats.length > 0 && (
            <div className="os-hero-stats">
              {h.stats.map((stat, i) => (
                <div key={i}>
                  <div className="os-stat-num">
                    <span className="metallic-copper">{stat.value}</span>
                  </div>
                  <div className="os-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <KineticMechanism />
      </div>
    </section>
  );
}
