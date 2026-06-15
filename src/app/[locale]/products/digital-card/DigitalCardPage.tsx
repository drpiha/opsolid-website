"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";
import { FoilCard } from "@/components/products/digital-card/FoilCard";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PricingTable } from "@/components/sections/PricingTable";
import { OrderFormSection } from "./sections/OrderFormSection";
import { TemplateGallery } from "./sections/TemplateGallery";
import type { CardPricingMode } from "@/lib/billing/plan";

/**
 * Digital Card page — industrial-luxury v2 port of digital-card.html.
 * Sections: dc-hero (with FoilCard) → dc-templates (4 industry samples) →
 * how-it-works (3 steps) → order form (preserves existing Stripe flow) →
 * FinalCTA.
 *
 * The order form section extends the Claude Design mock so the pre-market
 * Stripe conversion path stays intact. Visually it wraps the existing
 * OrderFormSection so Stripe checkout logic is untouched; the surrounding
 * chrome uses v2 tokens.
 */
/** Serializable event payload resolved by the server component when the page
 *  is opened via `?event=<slug>` (fair / trade-show invite links). */
export interface OrderEventInfo {
  slug: string;
  name: string;
  city: string;
  country: string | null;
  venue: string | null;
  startAt: string;
  endAt: string;
}

const EVENT_SLUG_RE = /^[a-z0-9-]{3,80}$/;

export function DigitalCardPage({
  pricingMode = "all_free",
}: {
  pricingMode?: CardPricingMode;
}) {
  const { t } = useLocale();
  const d = t.v2.digitalCard;
  const search = useSearchParams();

  const initialTemplateId = (() => {
    const raw = search?.get("template");
    if (!raw) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  })();
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    initialTemplateId,
  );

  // Fair flow — `?event=<slug>` resolves the event client-side (this page is
  // statically prerendered, so server searchParams aren't available). Bad or
  // expired slugs silently degrade to the plain order page.
  const eventSlugRaw = search?.get("event")?.trim().toLowerCase() ?? null;
  const eventSlug =
    eventSlugRaw && EVENT_SLUG_RE.test(eventSlugRaw) ? eventSlugRaw : null;
  const [event, setEvent] = useState<OrderEventInfo | null>(null);
  useEffect(() => {
    if (!eventSlug) {
      setEvent(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/v1/events/${encodeURIComponent(eventSlug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { event?: OrderEventInfo } | null) => {
        if (!cancelled && json?.event?.slug) setEvent(json.event);
      })
      .catch(() => {
        /* directory is a bonus — never block ordering */
      });
    return () => {
      cancelled = true;
    };
  }, [eventSlug]);

  return (
    <>
      <section className="dc-hero" data-screen-label="Digital Card Hero">
        <div className="dc-hero-inner">
          <div>
            <div className="os-hero-meta">
              <span className="chip chip-hot">
                <span className="chip-dot chip-dot-live" /> {d.hero.metaChip}
              </span>
              <span className="meta">{d.hero.metaLabel}</span>
            </div>
            <h1 className="os-hero-title">
              {d.hero.title.pre}
              <span className="editorial">{d.hero.title.italic}</span>
              {d.hero.title.post}
            </h1>
            <p className="os-hero-lead">{d.hero.lead}</p>
            <div className="os-hero-ctas">
              <Link href="#order" className="btn btn-primary btn-lg">
                {d.hero.ctaPrimary} <Icon name="arrow" size={18} />
              </Link>
              <Link href="#templates" className="btn btn-ghost btn-lg">
                {d.hero.ctaSecondary}
              </Link>
            </div>
            <div className="va-features" style={{ marginTop: 36 }}>
              {d.hero.features.map((feat, i) => (
                <div key={i} className="va-feat">
                  <div className="va-feat-label">{feat.label}</div>
                  <div className="va-feat-value">{feat.value}</div>
                  <div className="va-feat-sub">{feat.sub}</div>
                </div>
              ))}
            </div>
          </div>
          <FoilCard />
        </div>
      </section>

      {/* all_free mode: there is nothing to price — hide the plan table. */}
      {pricingMode !== "all_free" && (
        <PricingTable
          productIds={["verso"]}
          showProductHeading={false}
          showProductLink={false}
        />
      )}

      <TemplateGallery
        selectedId={selectedTemplateId}
        onSelect={setSelectedTemplateId}
        paymentsEnabled={pricingMode !== "all_free"}
      />

      <section className="os-section" data-screen-label="How">
        <div className="wrap">
          <div className="os-process">
            <div className="os-process-intro">
              <span className="meta meta-hot">{d.howItWorks.eyebrow}</span>
              <h2>{d.howItWorks.headline}</h2>
              <p className="lead">{d.howItWorks.lead}</p>
            </div>
            <div className="os-process-steps">
              {d.howItWorks.steps.map((step, i) => (
                <div key={i} className="os-process-step">
                  <div className="os-process-step-num">{step.num}</div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="os-section" id="order" data-screen-label="Order">
        <div className="wrap">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-bg-2 px-4 py-2 text-sm text-ink-200">
            <span aria-hidden>📱</span>
            {t.card.mobileAppSoon}
          </p>
          <OrderFormSection
            selectedTemplateId={selectedTemplateId}
            onTemplateChange={setSelectedTemplateId}
            pricingMode={pricingMode}
            event={event}
          />
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
