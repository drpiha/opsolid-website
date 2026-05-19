"use client";

/**
 * KiSchulungenV2 — editorial register.
 *
 * Per docs/redesign-prompt.md §2 KI-Schulungen:
 *   - Full-bleed editorial photograph of a real training session.
 *     Headline floats over the image in white reverse type, serif
 *     display register.
 *   - Below: chapter-style index pinned left, content scrolls right.
 *
 * Stock image rule: apply scanning-line CSS overlay at 2% opacity to
 * defuse the stock-photo feel (per §4 stock policy).
 *
 * In this milestone we ship the hero composition only — the chapter
 * index + scrolling chapter content can layer in M8 once the curated
 * Pexels/Coverr photo is selected.
 */

import { useLocale } from "@/context/LocaleContext";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";

const COPY = {
  de: {
    eyebrow: "KI-Schulungen",
    headline: "Schulungen für Menschen, die das System bedienen werden",
    lead: "Praxis-Workshops auf Deutsch, Englisch und Türkisch — kein abstraktes KI-Theater, sondern die Werkzeuge, mit denen Ihr Team morgen früh schneller arbeitet.",
    ctaPrimary: "Sprechen wir",
    ctaSecondary: "Schulungsformate",
  },
  en: {
    eyebrow: "AI training",
    headline: "Training for the people who will actually use the system",
    lead: "Hands-on workshops in English, German and Turkish — not abstract AI theatre, the actual tools your team will use tomorrow morning.",
    ctaPrimary: "Talk to us",
    ctaSecondary: "Training formats",
  },
  tr: {
    eyebrow: "AI eğitimleri",
    headline: "Sistemi gerçekten kullanacak insanlar için eğitim",
    lead: "Türkçe, Almanca ve İngilizce uygulamalı atölyeler — soyut AI tiyatrosu değil, ekibinizin yarın sabah kullanacağı araçlar.",
    ctaPrimary: "Görüşelim",
    ctaSecondary: "Eğitim formatları",
  },
} as const;

export function KiSchulungenV2() {
  const { locale } = useLocale();
  const lang: keyof typeof COPY =
    locale === "de" || locale === "en" || locale === "tr" ? locale : "en";
  const c = COPY[lang];

  return (
    <section className="v2-schul-hero">
      {/* Photographic backdrop — uses CSS-only fallback gradient until the
          curated Pexels/Coverr image is committed to /public/training.jpg.
          Scanning-line overlay at 2% defuses the stock-photo feel. */}
      <div className="v2-schul-hero__photo" aria-hidden="true">
        <div className="v2-schul-hero__photo-scan" />
      </div>

      <div className="wrap v2-schul-hero__inner">
        <span className="v2-schul-hero__eyebrow">{c.eyebrow}</span>
        <h1 className="v2-schul-hero__headline">{c.headline}</h1>
        <p className="v2-schul-hero__lead">{c.lead}</p>
        <div className="v2-schul-hero__ctas">
          <Link href="/contact" className="v2-btn-primary" data-cursor="link">
            {c.ctaPrimary}
          </Link>
          <Link href="/leistungen" className="v2-btn-ghost" data-cursor="link">
            {c.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
