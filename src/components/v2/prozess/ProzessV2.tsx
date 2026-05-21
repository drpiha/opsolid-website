"use client";

/**
 * ProzessV2 — full-bleed image hero with layered premium overlay.
 *
 * Replaces the previous BPMN/particle-flow hero (M3 v1) with a high-res
 * factory-floor photograph and a multi-layer overlay stack so the
 * composition reads as a magazine cover rather than a stock wallpaper.
 *
 * Layer stack (back → front):
 *   1. Hero image (Next/Image fill, priority, sizes 100vw)
 *   2. Directional gradient (left/bottom dark → right/top transparent)
 *      — anchors the headline column.
 *   3. Theme-tint gradient — bleeds the active theme's bg color in from
 *      the bottom so the hero seats cleanly into the next section across
 *      light / hybrid / dark.
 *   4. Copper radial accent (top-left corner) — brand warmth, low alpha.
 *   5. Grain texture (.grain utility) — analog premium feel.
 *   6. Edge vignette — soft inner shadow to anchor the composition.
 *   7. Foreground content (eyebrow + headline + lead + CTAs), left-aligned.
 *
 * Text stays white-on-dark across all three themes; only overlay tint
 * and the seam to the next section adjust per theme via CSS vars.
 */

import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";
import { getV2Content } from "@/content/v2";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import {
  V2WhatWeDo,
  V2UseCases,
  V2Process,
  V2FinalCta,
} from "@/components/v2/services/ServiceSections";
import { FaqAccordion } from "@/components/sections/FaqAccordion";

export function ProzessV2() {
  const { locale, t } = useLocale();
  const c = getV2Content(locale);
  const data = c.prozess;
  const svc = t.v2.services.prozessautomatisierung;
  const shared = t.v2.services.shared;

  return (
    <main>
      <section className="v2-prozess-hero" aria-label={data.headline}>
        {/* Layer 1: full-bleed photograph */}
        <div className="v2-prozess-hero__media" aria-hidden="true">
          <Image
            src="/images/sections/prozessautomatisierung-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={85}
            className="v2-prozess-hero__img"
          />
        </div>

        {/* Layer 2-6: premium overlay stack */}
        <div className="v2-prozess-hero__scrim" aria-hidden="true" />
        <div className="v2-prozess-hero__seam" aria-hidden="true" />
        <div className="v2-prozess-hero__copper" aria-hidden="true" />
        <div className="v2-prozess-hero__grain" aria-hidden="true" />
        <div className="v2-prozess-hero__vignette" aria-hidden="true" />

        {/* Layer 7: foreground content */}
        <div className="v2-prozess-hero__inner">
          <span className="v2-prozess-hero__eyebrow">{data.eyebrow}</span>
          <h1 className="v2-prozess-hero__headline">{data.headline}</h1>
          <p className="v2-prozess-hero__lead">{data.lead}</p>
          <div className="v2-prozess-hero__cta-row">
            <Link href="/contact" className="v2-btn-primary" data-cursor="link">
              {data.ctaPrimary}
            </Link>
            <Link href="/leistungen" className="v2-btn-ghost v2-btn-ghost--on-image" data-cursor="link">
              {data.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <V2WhatWeDo
        eyebrow={shared.whatWeDoEyebrow}
        headline={svc.whatWeDo.headline}
        bullets={svc.whatWeDo.bullets}
      />

      <V2UseCases
        eyebrow={shared.useCasesEyebrow}
        headline={svc.useCases.headline}
        items={svc.useCases.items}
      />

      <V2Process
        eyebrow={shared.processEyebrow}
        headline={svc.process.headline}
        steps={svc.process.steps}
      />

      <FaqAccordion
        eyebrow={shared.faqEyebrow}
        headline={svc.faq.headline}
        items={svc.faq.items}
        id={`${svc.slug}-faq`}
      />

      <V2FinalCta
        eyebrow={shared.finalCtaEyebrow}
        title={svc.finalCta.title}
        lead={svc.finalCta.lead}
        ctaPrimary={svc.finalCta.ctaPrimary}
        ctaSecondary={svc.finalCta.ctaSecondary}
      />
    </main>
  );
}
