"use client";

/**
 * AboutV2 / UeberMichV2 — founder-portrait dominant composition for the
 * About page family. Per docs/redesign-prompt.md §2 About:
 *
 *   - Left 50%: large cropped portrait, edge-to-edge in its column,
 *     no border-radius.
 *   - Right 50%: founder name in display scale ("Hasan Dönmez" — the
 *     name IS the headline), role below at body scale, then three short
 *     paragraphs. No separate hero headline above.
 *   - Editorial pages should breathe — no motion past the initial
 *     load-in.
 *
 * The portrait file is expected at /public/founder.jpg with an AVIF/WebP
 * sibling. If the file is missing the column degrades gracefully to a
 * concrete-gray placeholder block (no layout shift).
 */

import { useLocale } from "@/context/LocaleContext";

const COPY = {
  de: {
    name: "Hasan Dönmez",
    role: "Gründer · OpSolid",
    paragraphs: [
      "OpSolid ist eine unabhängige Praxis für Automatisierung und KI im operativen Geschäft. Ich helfe mittelständischen Unternehmen, wiederkehrende Arbeit auf belastbare Systeme zu legen — ohne dass jemand jeden Morgen daran erinnern muss.",
      "Hintergrund: zehn Jahre Engineering, davon sieben mit eigener Verantwortung für Prozesse und Tooling in kleineren Operationen. Heute arbeite ich projektweise — keine Agentur, keine Pitches, keine 'wir'-Form.",
      "Ich nehme nur Mandate an, bei denen sich der Aufwand in Stunden zurückrechnen lässt.",
    ],
  },
  en: {
    name: "Hasan Dönmez",
    role: "Founder · OpSolid",
    paragraphs: [
      "OpSolid is an independent practice for automation and AI inside operating businesses. I help mid-sized companies move repetitive work onto durable systems — without anyone having to remember to start it.",
      "Background: ten years engineering, seven of those owning process and tooling at smaller operations. Today I work project-by-project — no agency, no pitches, no 'we'.",
      "I only take on engagements where the effort pays back in measurable hours.",
    ],
  },
  tr: {
    name: "Hasan Dönmez",
    role: "Kurucu · OpSolid",
    paragraphs: [
      "OpSolid, işleyen şirketlerin içinde otomasyon ve AI üzerine çalışan bağımsız bir atölye. Orta ölçekli şirketlerde tekrar eden işi sağlam sistemlere taşıyorum — kimsenin her sabah hatırlamasına gerek kalmadan.",
      "Geçmiş: on yıl mühendislik, yedi yılı küçük operasyonlarda süreç ve araç sorumluluğu. Bugün proje bazlı çalışıyorum — ajans değil, pitch yok, 'biz' yok.",
      "Sadece efor saatlerle geri ödenebilen işleri alıyorum.",
    ],
  },
} as const;

export function AboutV2() {
  const { locale } = useLocale();
  const lang: keyof typeof COPY =
    locale === "de" || locale === "en" || locale === "tr" ? locale : "en";
  const c = COPY[lang];

  return (
    <section className="v2-about-hero">
      <div className="v2-about-hero__inner">
        <div className="v2-about-hero__portrait">
          {/* Portrait commissioned in M5; until then a graphite-gradient
              placeholder fills the column without breaking layout. */}
          <picture>
            <source srcSet="/founder.avif" type="image/avif" />
            <source srcSet="/founder.webp" type="image/webp" />
            <img
              src="/founder.jpg"
              alt="Hasan Dönmez"
              loading="eager"
              decoding="async"
              className="v2-about-hero__img"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </picture>
          <span className="v2-about-hero__placeholder" aria-hidden="true" />
        </div>

        <div className="v2-about-hero__copy">
          <h1 className="v2-about-hero__name">{c.name}</h1>
          <p className="v2-about-hero__role">{c.role}</p>
          <div className="v2-about-hero__paragraphs">
            {c.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
