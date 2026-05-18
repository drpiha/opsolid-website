"use client";

/**
 * V2 service-page section primitives. Pulled in by every service detail
 * page (KI-Beratung, Prozessautomatisierung, etc.) so the visual register
 * stays consistent below the hero — eyebrow + display headline + structured
 * content block with verdigris accent.
 *
 * Each section is content-agnostic: pass in eyebrow + headline + the
 * payload (bullets / items / steps). Per-service hero stays in its own
 * component. The "Tools" section from V1 is intentionally not included —
 * we lead with outcomes, not tool names.
 */

import { useEffect, useRef, useState } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";

/* -------------------- Eyebrow + headline pair -------------------- */

export function V2SectionHead({
  eyebrow,
  headline,
}: {
  eyebrow: string;
  headline: string;
}) {
  return (
    <div className="v2-svc-head">
      <span className="v2-svc-head__eyebrow">{eyebrow}</span>
      <h2 className="v2-svc-head__headline">{headline}</h2>
    </div>
  );
}

/* -------------------- What we do (bullet list) -------------------- */

export function V2WhatWeDo({
  eyebrow,
  headline,
  bullets,
}: {
  eyebrow: string;
  headline: string;
  bullets: readonly string[];
}) {
  return (
    <section className="v2-svc-section v2-svc-whatwedo">
      <div className="wrap">
        <V2SectionHead eyebrow={eyebrow} headline={headline} />
        <ul className="v2-svc-bullets">
          {bullets.map((b, i) => (
            <li key={i} className="v2-svc-bullet">
              <span className="v2-svc-bullet__mark" aria-hidden="true" />
              <span className="v2-svc-bullet__text">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------- Use cases (card grid) -------------------- */

export function V2UseCases({
  eyebrow,
  headline,
  items,
}: {
  eyebrow: string;
  headline: string;
  items: ReadonlyArray<{ title: string; body: string }>;
}) {
  return (
    <section className="v2-svc-section v2-svc-usecases">
      <div className="wrap">
        <V2SectionHead eyebrow={eyebrow} headline={headline} />
        <ul className="v2-svc-usecase-grid">
          {items.map((item, i) => (
            <li key={i} className="v2-svc-usecase">
              <span className="v2-svc-usecase__num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="v2-svc-usecase__title">{item.title}</h3>
              <p className="v2-svc-usecase__body">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------- Process steps (numbered, progressive reveal) -------------------- */

export function V2Process({
  eyebrow,
  headline,
  steps,
}: {
  eyebrow: string;
  headline: string;
  steps: ReadonlyArray<{ num: string; title: string; body: string }>;
}) {
  // Reveal step cards in sequence when the section scrolls into view. Uses
  // IntersectionObserver once — after firing, the cards stay visible.
  const sectionRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setRevealed(true);
      return;
    }
    const node = sectionRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="v2-svc-section v2-svc-process" ref={sectionRef}>
      <div className="wrap">
        <V2SectionHead eyebrow={eyebrow} headline={headline} />
        <ol className="v2-svc-process-grid">
          {steps.map((step, i) => (
            <li
              key={i}
              className={"v2-svc-step" + (revealed ? " is-visible" : "")}
              style={{ ["--i" as string]: i }}
            >
              <span className="v2-svc-step__num">{step.num}</span>
              <div className="v2-svc-step__connector" aria-hidden="true" />
              <h3 className="v2-svc-step__title">{step.title}</h3>
              <p className="v2-svc-step__body">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* -------------------- Final CTA band -------------------- */

export function V2FinalCta({
  eyebrow,
  title,
  lead,
  ctaPrimary,
  ctaSecondary,
  primaryHref = "/contact",
  secondaryHref = "/ai-automation-check",
}: {
  eyebrow: string;
  title: { pre: string; italic: string; post: string };
  lead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  primaryHref?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="v2-svc-section v2-svc-finalcta">
      <div className="wrap v2-svc-finalcta__inner">
        <span className="v2-svc-finalcta__eyebrow">{eyebrow}</span>
        <h2 className="v2-svc-finalcta__title">
          {title.pre}
          <em className="v2-svc-finalcta__title-em">{title.italic}</em>
          {title.post}
        </h2>
        <p className="v2-svc-finalcta__lead">{lead}</p>
        <div className="v2-svc-finalcta__ctas">
          <Link href={primaryHref} className="btn btn-primary btn-lg" data-cursor="link">
            {ctaPrimary}
          </Link>
          <Link href={secondaryHref} className="v2-home-hero__cta-secondary" data-cursor="link">
            {ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
