/**
 * Shared v7 strings: navigation, footer, breadcrumb labels, media labels, language hint.
 * German is the source; en/tr are idiomatic equivalents in full key parity.
 */
import { SITE_UPDATED_ISO } from "@/lib/constants";
import type { L3, PageKey } from "@/lib/v7-routes";

/** Primary navigation order (desktop and mobile panel). */
export const NAV_KEYS: PageKey[] = ["beratung", "schulungen", "opso", "projekte", "ueber", "blog"];

/** Footer columns (headings per locale live in SITE_STR.footer). */
export const FOOTER_COLS: { id: "beratung" | "schulungen" | "opsolid" | "legal"; keys: PageKey[] }[] = [
  { id: "beratung", keys: ["beratung", "check", "prozess", "m365", "agenten", "anwendungen"] },
  { id: "schulungen", keys: ["schulungen", "kompetenz", "copilot", "trainer"] },
  { id: "opsolid", keys: ["projekte", "ueber", "blog", "kontakt", "opso"] },
  { id: "legal", keys: ["impressum", "privacy"] },
];

/** Full page label (breadcrumbs and footer). */
export const LABEL: Record<L3, Record<PageKey, string>> = {
  de: {
    home: "Start",
    beratung: "KI-Beratung",
    check: "KI-Check",
    prozess: "Prozessautomatisierung",
    m365: "Microsoft 365",
    agenten: "KI-Assistenten",
    anwendungen: "Anwendungsfälle",
    schulungen: "KI-Schulungen",
    kompetenz: "KI-Kompetenz",
    copilot: "Copilot-Praxistag",
    trainer: "Trainer werden",
    opso: "OpSo",
    projekte: "Projekte",
    ueber: "Über uns",
    kontakt: "Kontakt",
    blog: "Journal",
    impressum: "Impressum",
    privacy: "Datenschutz",
  },
  en: {
    home: "Home",
    beratung: "AI consulting",
    check: "AI check",
    prozess: "Process automation",
    m365: "Microsoft 365",
    agenten: "AI assistants",
    anwendungen: "Use cases",
    schulungen: "AI training",
    kompetenz: "AI literacy",
    copilot: "Copilot workshop",
    trainer: "Become a trainer",
    opso: "OpSo",
    projekte: "Projects",
    ueber: "About us",
    kontakt: "Contact",
    blog: "Journal",
    impressum: "Legal notice",
    privacy: "Privacy",
  },
  tr: {
    home: "Ana sayfa",
    beratung: "YZ danışmanlığı",
    check: "YZ Kontrolü",
    prozess: "Süreç otomasyonu",
    m365: "Microsoft 365",
    agenten: "YZ asistanları",
    anwendungen: "Kullanım örnekleri",
    schulungen: "YZ eğitimleri",
    kompetenz: "YZ Yetkinliği",
    copilot: "Copilot Uygulama Günü",
    trainer: "Eğitmen olun",
    opso: "OpSo",
    projekte: "Projeler",
    ueber: "Hakkımızda",
    kontakt: "İletişim",
    blog: "Notlar",
    impressum: "Yasal bildirim",
    privacy: "Gizlilik",
  },
};

/** Short label for the primary navigation. */
export const NAV_LABEL: Record<L3, Partial<Record<PageKey, string>>> = {
  de: { beratung: "Beratung", schulungen: "Schulungen", opso: "OpSo", projekte: "Projekte", ueber: "Über uns", blog: "Journal" },
  en: { beratung: "Consulting", schulungen: "Training", opso: "OpSo", projekte: "Projects", ueber: "About", blog: "Journal" },
  tr: { beratung: "Danışmanlık", schulungen: "Eğitimler", opso: "OpSo", projekte: "Projeler", ueber: "Hakkımızda", blog: "Notlar" },
};

export type SiteStrings = {
  skip: string;
  mainNav: string;
  footerNav: string;
  menuOpen: string;
  menuClose: string;
  menuTitle: string;
  homeAria: string;
  cta: string;
  langLabel: string;
  breadcrumb: string;
  figure: string;
  aiLabel: string;
  videoPause: string;
  videoPlay: string;
  sampleLabel: string;
  tagline: string;
  priceNote: string;
  topsolid: string;
  placeLine: string;
  stand: string;
  footer: Record<"beratung" | "schulungen" | "opsolid" | "legal", string>;
  fx: { label: string; on: string; off: string; sys: string };
  contactLabel: string;
};

export const SITE_STR: Record<L3, SiteStrings> = {
  de: {
    skip: "Zum Inhalt springen",
    mainNav: "Hauptnavigation",
    footerNav: "Fußzeile",
    menuOpen: "Menü",
    menuClose: "Schließen",
    menuTitle: "Navigation",
    homeAria: "OpSolid, zur Startseite",
    cta: "KI-Check anfragen",
    langLabel: "Sprache",
    breadcrumb: "Brotkrumen-Navigation",
    figure: "Abb.",
    aiLabel: "KI-generiert",
    videoPause: "Video pausieren",
    videoPlay: "Video abspielen",
    sampleLabel: "Muster",
    tagline: "KI-Automatisierung für Unternehmen. Erst der Prozess, dann die KI.",
    priceNote: "Alle Preise netto zzgl. USt., nur für Unternehmen.",
    topsolid: "OpSolid ist nicht TopSolid (CAD/CAM) und steht in keiner Verbindung dazu.",
    placeLine: "OpSolid · Arnsberg (NRW) · Deutsch, Englisch, Türkisch",
    stand: "Stand",
    footer: { beratung: "Beratung", schulungen: "Schulungen", opsolid: "OpSolid", legal: "Rechtliches" },
    fx: { label: "Hintergrundvideo", on: "An", off: "Aus", sys: "Aus (Systemeinstellung: weniger Bewegung)" },
    contactLabel: "Kontakt",
  },
  en: {
    skip: "Skip to content",
    mainNav: "Main navigation",
    footerNav: "Footer",
    menuOpen: "Menu",
    menuClose: "Close",
    menuTitle: "Navigation",
    homeAria: "OpSolid, back to the home page",
    cta: "Request an AI check",
    langLabel: "Language",
    breadcrumb: "Breadcrumb",
    figure: "Fig.",
    aiLabel: "AI-generated",
    videoPause: "Pause video",
    videoPlay: "Play video",
    sampleLabel: "Sample",
    tagline: "AI automation for businesses. The process first, then the AI.",
    priceNote: "All prices are net of VAT and for businesses only.",
    topsolid: "OpSolid is not TopSolid (CAD/CAM) and has no connection to it.",
    placeLine: "OpSolid · Arnsberg (NRW), Germany · German, English, Turkish",
    stand: "Updated",
    footer: { beratung: "Consulting", schulungen: "Training", opsolid: "OpSolid", legal: "Legal" },
    fx: { label: "Background video", on: "On", off: "Off", sys: "Off (system setting: reduced motion)" },
    contactLabel: "Contact",
  },
  tr: {
    skip: "İçeriğe geç",
    mainNav: "Ana menü",
    footerNav: "Alt bilgi",
    menuOpen: "Menü",
    menuClose: "Kapat",
    menuTitle: "Gezinti",
    homeAria: "OpSolid, ana sayfaya dön",
    cta: "YZ Kontrolü talep edin",
    langLabel: "Dil",
    breadcrumb: "Gezinti yolu",
    figure: "Şek.",
    aiLabel: "Yapay zeka ile üretildi",
    videoPause: "Videoyu duraklat",
    videoPlay: "Videoyu oynat",
    sampleLabel: "Örnek",
    tagline: "Şirketler için yapay zeka otomasyonu. Önce süreç, sonra yapay zeka.",
    priceNote: "Tüm fiyatlar KDV hariçtir; yalnızca şirketler içindir.",
    topsolid: "OpSolid, TopSolid (CAD/CAM) ile ilgili değildir ve onunla bağlantısı yoktur.",
    placeLine: "OpSolid · Arnsberg (NRW), Almanya · Almanca, İngilizce, Türkçe",
    stand: "Güncelleme",
    footer: { beratung: "Danışmanlık", schulungen: "Eğitimler", opsolid: "OpSolid", legal: "Yasal" },
    fx: { label: "Arka plan videosu", on: "Açık", off: "Kapalı", sys: "Kapalı (sistem ayarı: az hareket)" },
    contactLabel: "İletişim",
  },
};

export const LANG_NAME: Record<L3, string> = { de: "Deutsch", en: "English", tr: "Türkçe" };
export const LANG_SHORT: Record<L3, string> = { de: "DE", en: "EN", tr: "TR" };

/** "29. Oktober 2026" / "29 October 2026" / "29 Ekim 2026" from SITE_UPDATED_ISO. */
export function standDate(locale: L3): string {
  const d = new Date(SITE_UPDATED_ISO + "T00:00:00Z");
  const tag = locale === "de" ? "de-DE" : locale === "tr" ? "tr-TR" : "en-GB";
  return new Intl.DateTimeFormat(tag, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(d);
}

/** Language hint on the German home (shown in the suggested language; never a redirect). */
export const HINT: Record<"en" | "tr", { text: string; link: string; dismiss: string; lang: string }> = {
  en: { text: "This page is also available in English.", link: "Switch to English", dismiss: "Dismiss", lang: "en" },
  tr: { text: "Bu sayfa Türkçe de mevcut.", link: "Türkçe'ye geç", dismiss: "Kapat", lang: "tr" },
};
