import Link from "next/link";
import type { CSSProperties } from "react";
import type { L3 } from "@/content/v4/types";

/**
 * The 404 in the v4 language, one locale at a time. Rendered by
 * src/app/[locale]/not-found.tsx (inside the site header and footer) and by
 * src/app/not-found.tsx (locale-less misses, German). No content bundle.
 */
const COPY: Record<L3, { eyebrow: string; h1: [string, string, string]; lede: string; home: string; contact: string; more: string; links: [string, string][] }> = {
  de: {
    eyebrow: "Fehler 404",
    h1: ["Diese Seite ", "gibt es nicht", "."],
    lede: "Die gesuchte Seite existiert nicht oder wurde verschoben. Auf der Startseite finden Sie alle Leistungen von OpSolid.",
    home: "Zur Startseite",
    contact: "Kontakt",
    more: "Weitere Seiten",
    links: [["/agents", "Agents"], ["/websites", "Websites"], ["/leistungen", "Leistungen"], ["/ai-automation-check", "KI-Check"]],
  },
  en: {
    eyebrow: "Error 404",
    h1: ["This page ", "does not exist", "."],
    lede: "The page you are looking for does not exist or has been moved. The home page lists everything OpSolid offers.",
    home: "Back to home",
    contact: "Contact",
    more: "More pages",
    links: [["/agents", "Agents"], ["/websites", "Websites"], ["/leistungen", "Services"], ["/ai-automation-check", "AI check"]],
  },
  tr: {
    eyebrow: "Hata 404",
    h1: ["Bu sayfa ", "mevcut değil", "."],
    lede: "Aradığınız sayfa mevcut değil veya taşınmış olabilir. Ana sayfada OpSolid'in tüm hizmetlerini bulabilirsiniz.",
    home: "Ana sayfaya dön",
    contact: "İletişim",
    more: "Diğer sayfalar",
    links: [["/agents", "Agent'lar"], ["/websites", "Web siteleri"], ["/leistungen", "Hizmetler"], ["/ai-automation-check", "YZ kontrolü"]],
  },
};

/** Trilingual tab title for the 404 metadata (the template adds " | OpSolid"). */
export const NOT_FOUND_TITLE = "Seite nicht gefunden · Page not found · Sayfa bulunamadı";

// Outside html[data-v4] (app surfaces, the root 404) the --v4-* tokens map to
// the light legacy ladder, so a standalone 404 carries the graphite set itself.
const STANDALONE: CSSProperties = {
  ["--v4-bg" as string]: "#12110f",
  ["--v4-bg2" as string]: "#1a1816",
  ["--v4-ink" as string]: "#ece6da",
  ["--v4-ink2" as string]: "#b9b2a4",
  ["--v4-ink3" as string]: "#8a8378",
  ["--v4-line" as string]: "#2f2c27",
  ["--v4-line2" as string]: "#46423b",
  ["--v4-cu" as string]: "#c27940",
  ["--v4-cu-hi" as string]: "#e0a070",
  ["--v4-on-cu" as string]: "#12110f",
  background: "#12110f",
  color: "#b9b2a4",
};

// A flow section, not .is-hero: the phone hero reserves 44vh for the 3D object,
// which a 404 does not stage. The inline padding clears the fixed header.
const SECTION: CSSProperties = { minHeight: "78vh", paddingTop: "clamp(112px, 18vh, 200px)", paddingBottom: "clamp(56px, 10vh, 120px)" };

export function NotFoundView({ locale, standalone = false }: { locale: L3; standalone?: boolean }) {
  const c = COPY[locale];
  return (
    <section className="v4-sec is-flow" lang={locale} style={standalone ? { ...SECTION, ...STANDALONE } : SECTION}>
      <div className="v4-in">
        <div className="v4-col">
          <span className="v4-eyebrow">
            <span>{c.eyebrow}</span>
          </span>
          <h1 className="v4-h1">
            {c.h1[0]}
            <em>{c.h1[1]}</em>
            {c.h1[2]}
          </h1>
          <p className="v4-lede">{c.lede}</p>
          <div className="v4-cta">
            <Link href={`/${locale}`} className="v4-btn v4-btn-primary v4-btn-lg">
              {c.home}
              <span className="v4-btn-arr" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href={`/${locale}/contact`} className="v4-btn v4-btn-ghost v4-btn-lg">
              {c.contact}
            </Link>
          </div>
          <nav aria-label={c.more}>
            <ul className="v4-rows">
              {c.links.map(([to, label]) => (
                <li key={to} className="v4-row">
                  <Link href={`/${locale}${to}`} className="v4-row-in">
                    <span className="v4-row-h">
                      {label}
                      <span className="v4-row-go" aria-hidden="true">
                        →
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
