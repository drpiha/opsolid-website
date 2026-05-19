"use client";

/**
 * ContactV2 — minimal Concrete Studio contact composition.
 *
 * Per docs/redesign-prompt.md §2 Contact:
 *   - Headline takes ~80vh ("Sprechen wir." / "Talk to us." / "Görüşelim.").
 *   - Below: a single email address in mono, plus one trust line.
 *   - The emptiness is the confidence signal.
 *   - Form lives further down (existing ContactForm component, unchanged).
 *
 * The form deliberately keeps the existing v1 styling for now — the visual
 * register of the form fields will be promoted in M9 when v2 becomes the
 * default and the legacy `.field` class can be retired.
 */

import { useLocale } from "@/context/LocaleContext";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";

const COPY = {
  de: {
    eyebrow: "Kontakt",
    headline: "Sprechen wir",
    trust: "Antwort innerhalb von 24 Stunden",
    formIntro: "Oder schreiben Sie kurz, woran Sie arbeiten —",
    formIntroAccent: "wir melden uns",
  },
  en: {
    eyebrow: "Contact",
    headline: "Talk to us",
    trust: "Response within 24 hours",
    formIntro: "Or write a few lines about what you're working on —",
    formIntroAccent: "we'll get back",
  },
  tr: {
    eyebrow: "İletişim",
    headline: "Görüşelim",
    trust: "24 saat içinde yanıt",
    formIntro: "Veya neyle uğraştığınızı birkaç satırla yazın —",
    formIntroAccent: "size döneriz",
  },
} as const;

export function ContactV2() {
  const { locale, t } = useLocale();
  const lang: keyof typeof COPY =
    locale === "de" || locale === "en" || locale === "tr" ? locale : "en";
  const c = COPY[lang];
  const email =
    (t as unknown as { brand?: { email?: string } })?.brand?.email ??
    "info@opsolid.de";

  return (
    <section className="v2-contact-hero">
      <div className="wrap v2-contact-hero__inner">
        <span className="v2-contact-hero__eyebrow">{c.eyebrow}</span>
        <h1 className="v2-contact-hero__headline">{c.headline}</h1>

        <div className="v2-contact-hero__detail">
          <a
            href={`mailto:${email}`}
            className="v2-contact-hero__email"
            data-cursor="link"
          >
            {email}
          </a>
          <span className="v2-contact-hero__trust">{c.trust}</span>
        </div>

        <p className="v2-contact-hero__or">
          {c.formIntro}{" "}
          <Link href="#contact-form" className="v2-contact-hero__or-link">
            {c.formIntroAccent}
          </Link>
        </p>
      </div>
    </section>
  );
}
