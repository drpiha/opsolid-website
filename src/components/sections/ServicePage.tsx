"use client";

import Image from "next/image";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import type { Content } from "@/content/en";

type ServiceKey =
  | "kiBeratung"
  | "prozessautomatisierung"
  | "microsoft365"
  | "interneTools"
  | "kiSchulungen";

type ServiceContent = Content["v2"]["services"][ServiceKey];

/**
 * Per-service hero artwork. Hand-picked Unsplash photography that fits the
 * "panel + grain + copper" brand formula — warm-toned, editorial, no
 * clichéd glowing-AI-brain stock. The hero CSS tints each one with a copper
 * radial so it sits inside the palette regardless of source.
 */
const HERO_IMAGE: Record<ServiceKey, { src: string; alt: string }> = {
  kiBeratung: {
    src: "/images/sections/ki-beratung.jpg",
    alt: "Two people sketching diagrams on paper at a warm wooden desk with laptops open — collaborative AI use-case analysis.",
  },
  prozessautomatisierung: {
    src: "/images/sections/prozessautomatisierung.jpg",
    alt: "Engineers working over a technical blueprint with a precision-engineered part — process design and automation.",
  },
  microsoft365: {
    src: "/images/sections/microsoft-365.jpg",
    alt: "Hands typing on a laptop keyboard in warm daylight — everyday office work made faster with Microsoft 365 automation.",
  },
  interneTools: {
    src: "/images/sections/interne-tools.jpg",
    alt: "Engineer working with a complex hardware test rig and a laptop — building a small focused tool that fits.",
  },
  kiSchulungen: {
    src: "/images/sections/ki-schulungen.jpg",
    alt: "Open notebook with the word 'Notes' written in fountain pen, copper-coloured pen and reading glasses on a wooden desk — practical learning.",
  },
};

/**
 * Shared template for a single service detail page.
 * Sections: Hero · What we do · Use cases · Tools · Process · FAQ · Final CTA.
 * Pulls the service-specific block from `t.v2.services[serviceKey]` and the
 * eyebrows from `t.v2.services.shared`.
 */
export function ServicePage({ serviceKey }: { serviceKey: ServiceKey }) {
  const { t } = useLocale();
  const shared = t.v2.services.shared;
  const s = t.v2.services[serviceKey] as ServiceContent;
  const hero = HERO_IMAGE[serviceKey];

  return (
    <main>
      {/* ----- Hero ----- */}
      <section className="os-service-hero">
        <div className="wrap">
          <Link href="/leistungen" className="os-service-back-link">
            ← {shared.backToServices}
          </Link>
          <div className="os-hero-with-image">
            <div>
              <div className="os-hero-meta">
                {s.hero.metaChip && (
                  <span className="chip chip-hot">
                    <span className="chip-dot chip-dot-live" /> {s.hero.metaChip}
                  </span>
                )}
                {s.hero.metaLabel && <span className="meta">{s.hero.metaLabel}</span>}
              </div>
              <h1>
                {s.hero.title.pre}
                <span className="editorial">{s.hero.title.italic}</span>
                {s.hero.title.post}
              </h1>
              <p className="lead">{s.hero.lead}</p>
              <div className="os-aac-hero-ctas">
                <Link href="/contact" className="btn btn-primary btn-lg">
                  {s.hero.ctaPrimary} <Icon name="arrow" size={18} />
                </Link>
                <Link href="/ai-automation-check" className="btn btn-ghost btn-lg">
                  {s.hero.ctaSecondary}
                </Link>
              </div>
            </div>
            <div className="os-hero-image-frame">
              <Image
                src={hero.src}
                alt={hero.alt}
                width={1200}
                height={960}
                priority
                sizes="(max-width: 960px) 100vw, 50vw"
              />
              {s.hero.metaChip && <span className="os-hero-image-tag">{s.hero.metaChip}</span>}
            </div>
          </div>
        </div>
      </section>

      {/* ----- What we do ----- */}
      <section className="os-section">
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{shared.whatWeDoEyebrow}</span>
            <h2>{s.whatWeDo.headline}</h2>
          </div>
          <ul className="os-service-bullets">
            {s.whatWeDo.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----- Use cases ----- */}
      <section className="os-section os-services-section">
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{shared.useCasesEyebrow}</span>
            <h2>{s.useCases.headline}</h2>
          </div>
          <ul className="os-service-usecases">
            {s.useCases.items.map((item, i) => (
              <li key={i}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----- Tools ----- */}
      <section className="os-section">
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{shared.toolsEyebrow}</span>
            <h2>{s.tools.headline}</h2>
          </div>
          <ul className="os-tools-grid">
            {s.tools.items.map((tool, i) => (
              <li key={i}>{tool}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----- Process ----- */}
      <section className="os-section os-target-section">
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{shared.processEyebrow}</span>
            <h2>{s.process.headline}</h2>
          </div>
          <div className="os-services-grid">
            {s.process.steps.map((step, i) => (
              <article key={i} className="os-service-card panel">
                <span className="os-usecase-num meta">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ----- FAQ ----- */}
      <FaqAccordion
        eyebrow={shared.faqEyebrow}
        headline={s.faq.headline}
        items={s.faq.items}
        id={`${s.slug}-faq`}
      />

      {/* ----- Final CTA ----- */}
      <section className="os-final-cta">
        <div className="wrap">
          <span
            className="meta meta-hot"
            style={{ marginBottom: 20, display: "inline-block" }}
          >
            {shared.finalCtaEyebrow}
          </span>
          <h2>
            {s.finalCta.title.pre}
            <span className="editorial">{s.finalCta.title.italic}</span>
            {s.finalCta.title.post}
          </h2>
          <p className="lead" style={{ marginLeft: "auto", marginRight: "auto" }}>
            {s.finalCta.lead}
          </p>
          <div className="os-hero-ctas">
            <Link href="/contact" className="btn btn-primary btn-lg">
              {s.finalCta.ctaPrimary} <Icon name="arrow" size={18} />
            </Link>
            <Link href="/ai-automation-check" className="btn btn-ghost btn-lg">
              {s.finalCta.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
