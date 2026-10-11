"use client";

/** Products OpSolid ships itself. No client names, no numbers. */

import { useLocale } from "@/context/LocaleContext";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";

const COPY = {
  de: {
    eyebrow: "Gebaut von OpSolid",
    headline: "Eigene Produkte, die wirklich laufen",
    opso: {
      name: "OpSo",
      tag: "Produkt",
      body: "Digitale Visitenkarte mit NFC und QR: ein Link, immer aktuell, ohne App für den Empfänger.",
      cta: "OpSo ansehen",
      ext: "card.opsolid.de",
    },
    kutasia: {
      name: "Kutasia",
      tag: "Live-Demo",
      body: "Eine laufende Demo, die zeigt, wie wir Systeme für den Alltag bauen.",
      cta: "Kutasia öffnen",
    },
  },
  en: {
    eyebrow: "Built by OpSolid",
    headline: "Our own products, running for real",
    opso: {
      name: "OpSo",
      tag: "Product",
      body: "A digital business card with NFC and QR: one link, always current, no app needed for the recipient.",
      cta: "See OpSo",
      ext: "card.opsolid.de",
    },
    kutasia: {
      name: "Kutasia",
      tag: "Live demo",
      body: "A running demo that shows how we build systems for everyday use.",
      cta: "Open Kutasia",
    },
  },
  tr: {
    eyebrow: "OpSolid tarafından",
    headline: "Gerçekten çalışan kendi ürünlerimiz",
    opso: {
      name: "OpSo",
      tag: "Ürün",
      body: "NFC ve QR ile dijital kartvizit: tek bağlantı, her zaman güncel, alıcı için uygulama gerekmez.",
      cta: "OpSo'yu gör",
      ext: "card.opsolid.de",
    },
    kutasia: {
      name: "Kutasia",
      tag: "Canlı demo",
      body: "Günlük kullanım için sistemleri nasıl kurduğumuzu gösteren çalışan bir demo.",
      cta: "Kutasia'yı aç",
    },
  },
} as const;

export function BuiltByOpSolid() {
  const { locale } = useLocale();
  const c = COPY[locale === "de" || locale === "tr" ? locale : "en"];

  return (
    <section className="wrap v2-built">
      <span className="v2-home-hero__eyebrow">{c.eyebrow}</span>
      <h2 className="v2-built__headline">{c.headline}</h2>
      <div className="v2-built__grid">
        <article className="v2-built__card">
          <span className="v2-home-hero__chip">{c.opso.tag}</span>
          <h3>{c.opso.name}</h3>
          <p>{c.opso.body}</p>
          <div className="v2-built__links">
            <Link href="/opso" className="v2-btn-primary">{c.opso.cta}</Link>
            <a href="https://card.opsolid.de" className="v2-btn-ghost" target="_blank" rel="noopener noreferrer">
              {c.opso.ext}
            </a>
          </div>
        </article>
        <article className="v2-built__card">
          <span className="v2-home-hero__chip">{c.kutasia.tag}</span>
          <h3>{c.kutasia.name}</h3>
          <p>{c.kutasia.body}</p>
          <div className="v2-built__links">
            <a href="https://kutasia.com" className="v2-btn-primary" target="_blank" rel="noopener noreferrer">
              {c.kutasia.cta}
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
