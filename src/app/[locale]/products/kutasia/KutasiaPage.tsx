"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";
import { BreathingSilhouette } from "@/components/products/kutasia/BreathingSilhouette";
import { FinalCTA } from "@/components/sections/FinalCTA";

/**
 * Kutasia page — industrial-luxury v2 port of kutasia.html.
 * Sections: kt-hero (with BreathingSilhouette) → kt-rooms (6 hero
 * automations) → FinalCTA.
 *
 * Post-pivot (Faz J): Kutasia is now part of OpSolid itself — the unified
 * AI workspace under /dashboard/inbox. The primary CTA funnels into the
 * dashboard (login-walled), the secondary anchors to #rooms.
 */
export function KutasiaPage() {
  const { t } = useLocale();
  const k = t.v2.kutasia;

  return (
    <>
      <section className="kt-hero" data-screen-label="Kutasia Hero">
        <div className="kt-hero-inner">
          <div>
            <div className="os-hero-meta">
              <span className="chip chip-hot">
                <span className="chip-dot chip-dot-live" /> {k.hero.metaChip}
              </span>
              <span className="meta">{k.hero.metaLabel}</span>
            </div>
            <h1 className="os-hero-title">
              {k.hero.title.pre}
              <span className="editorial">{k.hero.title.italic}</span>
              {k.hero.title.post}
            </h1>
            <p className="os-hero-lead">{k.hero.lead}</p>
            <div className="os-hero-ctas">
              <Link href="/dashboard/inbox" className="btn btn-primary btn-lg">
                {k.hero.ctaPrimary} <Icon name="arrow" size={18} />
              </Link>
              <Link href="#rooms" className="btn btn-ghost btn-lg">
                {k.hero.ctaSecondary}
              </Link>
            </div>
          </div>
          <BreathingSilhouette />
        </div>
      </section>

      <section className="os-section" id="rooms" data-screen-label="Rooms">
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{k.rooms.eyebrow}</span>
            <h2>{k.rooms.headline}</h2>
            <p className="lead">{k.rooms.lead}</p>
          </div>
          <div className="kt-rooms">
            {k.rooms.items.map((room, i) => (
              <div key={i} className="kt-room">
                <div className="kt-room-n">{room.n}</div>
                <div className="kt-room-h">{room.h}</div>
                <div className="kt-room-b">{room.b}</div>
                <div className="kt-room-list">
                  {room.rows.map((r, j) => (
                    <div key={j} className="kt-room-item">
                      <span>{r.label}</span>
                      <em>{r.value}</em>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
