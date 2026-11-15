/**
 * Produkte (key "produkte", /produkte, EN /our-products, TR /urunler; owner decision 72, 2026-11-15): our own
 * products and where they stand. OpSo is live; the OpSo NFC card is "in Vorbereitung" with no price anywhere
 * (decision 78); Kutasia is "in Entwicklung" and "noch nicht erhältlich" (no price, no link, no picture, no
 * "Pilotphase"). Company voice ("Sie" or neutral); the OpSo page keeps its own "du".
 *
 * Foundation stub: hero plus one text block, valid in de/en/tr. Package P3 builds the full page (PLAN 6.4).
 */
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "produkte",
  meta: {
    title: "Produkte: OpSo, OpSo NFC-Karte und Kutasia",
    description:
      "OpSo ist die digitale Visitenkarte von OpSolid, kostenlos für iPhone und Android. Die OpSo NFC-Karte ist in Vorbereitung, Kutasia in Entwicklung.",
  },
  crumbs: [],
  crumb: "Produkte",
  hero: {
    eyebrow: "Eigene Produkte",
    h1: ["Was wir selbst ", "bauen", " und betreiben"],
    lede: "Drei eigene Produkte und ihr Stand: OpSo ist live, die OpSo NFC-Karte in Vorbereitung, Kutasia in Entwicklung.",
    tone: "ink",
  },
  blocks: [
    {
      t: "text",
      id: "opso",
      label: "OpSo",
      h: "OpSo",
      lede: "Die digitale Visitenkarte mit Kontaktliste und Follow-up: Karte per QR-Code, NFC oder Link teilen, notieren, wo man sich getroffen hat, und rechtzeitig nachfassen.",
      paras: ["Kostenlos für iPhone und Android.", "Empfänger brauchen keine App. Heute kostenlos, ohne Werbung."],
      cta: { label: "Verfügbarkeit und alle Funktionen", to: "opso" },
    },
  ],
};

const en: PageDef = {
  key: "produkte",
  meta: {
    title: "Products: OpSo, OpSo NFC card and Kutasia",
    description:
      "OpSo is the digital business card from OpSolid, free for iPhone and Android. The OpSo NFC card is in preparation, and Kutasia is in development.",
  },
  crumbs: [],
  crumb: "Products",
  hero: {
    eyebrow: "Our own products",
    h1: ["What we ", "build", " and run ourselves"],
    lede: "Three products of our own and where they stand: OpSo is live, the OpSo NFC card is in preparation, Kutasia is in development.",
    tone: "ink",
  },
  blocks: [
    {
      t: "text",
      id: "opso",
      label: "OpSo",
      h: "OpSo",
      lede: "The digital business card with a contact list and follow-up: share a card by QR code, NFC or link, note where you met, and follow up in time.",
      paras: ["Free for iPhone and Android.", "Recipients need no app. Free today, no ads."],
      cta: { label: "Availability and all features", to: "opso" },
    },
  ],
};

const tr: PageDef = {
  key: "produkte",
  meta: {
    title: "Ürünler: OpSo, OpSo NFC kartı ve Kutasia",
    description:
      "OpSo, OpSolid'in dijital kartvizitidir ve iPhone ile Android için ücretsizdir. OpSo NFC kartı hazırlanıyor, Kutasia ise geliştirme aşamasındadır.",
  },
  crumbs: [],
  crumb: "Ürünler",
  hero: {
    eyebrow: "Kendi ürünlerimiz",
    h1: ["Kendimiz ", "geliştirip", " işlettiklerimiz"],
    lede: "Kendi üç ürünümüz ve durumları: OpSo yayında, OpSo NFC kartı hazırlanıyor, Kutasia geliştiriliyor.",
    tone: "ink",
  },
  blocks: [
    {
      t: "text",
      id: "opso",
      label: "OpSo",
      h: "OpSo",
      lede: "Kişi listesi ve takip özelliği olan dijital kartvizit: kartı karekod, NFC ya da bağlantıyla paylaşın, nerede tanıştığınızı not edin ve zamanında takip edin.",
      paras: ["iPhone ve Android için ücretsiz.", "Karşı tarafın uygulaması gerekmez. Bugün ücretsiz, reklamsız."],
      cta: { label: "Durum ve tüm özellikler", to: "opso" },
    },
  ],
};

export const page: PageSet = { de, en, tr };
