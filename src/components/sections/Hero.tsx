"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { KineticMechanism } from "@/components/sections/hero/KineticMechanism";
import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";

type BenefitIcon = "workflow" | "bolt" | "shield" | "spark" | "bot" | "plug";

/**
 * Homepage hero — consulting-positioned rewrite (2026-05).
 * Copy lives at `t.v2.home.hero.*`. The three benefit chips below the CTAs
 * carry the "weniger manuelle Arbeit · schnellere Prozesse · sichere
 * KI-Nutzung" promise; stats slot is reserved for honest figures we don't
 * have yet (no fake numbers).
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
            <Link href="/ai-automation-check" className="btn btn-ghost btn-lg">
              {h.ctaSecondary}
            </Link>
          </div>

          {h.benefits && h.benefits.length > 0 && (
            <div className="os-hero-benefits" role="list">
              {h.benefits.map((b, i) => (
                <div key={i} role="listitem" className="os-hero-benefit">
                  <span className="os-hero-benefit-icon" aria-hidden="true">
                    <Icon name={b.icon as BenefitIcon} size={18} />
                  </span>
                  <span className="os-hero-benefit-label">{b.label}</span>
                </div>
              ))}
            </div>
          )}

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
