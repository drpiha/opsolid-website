"use client";

/**
 * HomeV2 (v3) — honest hero with the OpSo product video as proof that
 * OpSolid ships real products, then the practices grid, a "Built by
 * OpSolid" section and the use-case section.
 */

import { useLocale } from "@/context/LocaleContext";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { PillarGrid } from "./PillarGrid";
import { HomeOutcomes } from "./HomeOutcomes";
import { HeroVideo } from "./HeroVideo";
import { BuiltByOpSolid } from "./BuiltByOpSolid";

const COPY = {
  de: {
    eyebrow: "Software und KI im Alltag",
    headline: ["Software und KI,", "die im Alltag", "laufen"],
    lead: "OpSolid baut Automatisierung, interne Tools und KI-Lösungen für den Mittelstand und liefert mit OpSo ein eigenes Produkt, das heute schon im Einsatz ist.",
    ctaPrimary: "KI-Check buchen",
    ctaSecondary: "OpSo ansehen",
  },
  en: {
    eyebrow: "Software and AI in daily work",
    headline: ["Software and AI", "that run in", "daily work"],
    lead: "OpSolid builds automation, internal tools and AI solutions for small and mid-sized businesses, and ships OpSo as a real product of its own.",
    ctaPrimary: "Book an AI check",
    ctaSecondary: "See OpSo",
  },
  tr: {
    eyebrow: "Günlük işte yazılım ve YZ",
    headline: ["Günlük işte", "gerçekten çalışan", "yazılım ve YZ"],
    lead: "OpSolid, küçük ve orta ölçekli işletmeler için otomasyon, dahili araçlar ve YZ çözümleri kurar; OpSo ile gerçek bir ürün de sunar.",
    ctaPrimary: "YZ kontrolü ayarla",
    ctaSecondary: "OpSo'yu gör",
  },
} as const;

export function HomeV2() {
  const { locale } = useLocale();
  const hero = COPY[locale === "de" || locale === "tr" ? locale : "en"];
  const headline = hero.headline;

  return (
    <>
      <section className="v2-home-hero">
        <div className="wrap v2-home-hero__inner">
          <div className="v2-home-hero__copy">
            <span className="v2-home-hero__eyebrow">{hero.eyebrow}</span>

            <h1 className="v2-home-hero__headline">
              {headline.map((line, i) => (
                <span key={i}>
                  {i === headline.length - 1 ? <em>{line}</em> : line}
                </span>
              ))}
            </h1>

            <p className="v2-home-hero__lead">{hero.lead}</p>

            <div className="v2-home-hero__ctas">
              <Link href="/ai-automation-check" className="v2-btn-primary" data-cursor="link">
                {hero.ctaPrimary}
              </Link>
              <Link href="/opso" className="v2-btn-ghost" data-cursor="link">
                {hero.ctaSecondary}
              </Link>
            </div>
          </div>

          <HeroVideo />
        </div>
      </section>

      <BuiltByOpSolid />
      <PillarGrid />
      <HomeOutcomes />
    </>
  );
}
