/**
 * Shared v7 strings: navigation, footer, breadcrumb labels, media labels, language hint.
 * German is the source; en/tr are idiomatic equivalents in full key parity.
 */
import { SITE_UPDATED_ISO } from "@/lib/constants";
import type { L3, PageKey } from "@/lib/v7-routes";

/**
 * Top items of the primary navigation (owner decision 71): Schulungen, Beratung, Produkte, Unternehmen. The
 * marketing header builds its four mega menus from src/content/v7/menu.ts; the app header (components/layout)
 * still reads these keys and labels. "ueber" is the hub of the Unternehmen group.
 */
export const NAV_KEYS: PageKey[] = ["schulungen", "beratung", "produkte", "ueber"];

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
    workflows: "KI-Agenten & Workflows",
    trainer: "Trainerpool",
    produkte: "Produkte",
    opso: "OpSo",
    opsoKarte: "NFC-Karte",
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
    workflows: "AI agents & workflows",
    trainer: "Trainer pool",
    produkte: "Products",
    opso: "OpSo",
    opsoKarte: "NFC card",
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
    workflows: "YZ Ajanları ve İş Akışları",
    trainer: "Eğitmen havuzu",
    produkte: "Ürünler",
    opso: "OpSo",
    opsoKarte: "NFC kart",
    ueber: "Hakkımızda",
    kontakt: "İletişim",
    blog: "Notlar",
    impressum: "Yasal bildirim",
    privacy: "Gizlilik",
  },
};

/** Short label for the primary navigation. */
export const NAV_LABEL: Record<L3, Partial<Record<PageKey, string>>> = {
  de: { schulungen: "Schulungen", beratung: "Beratung", produkte: "Produkte", ueber: "Unternehmen" },
  en: { schulungen: "Training", beratung: "Consulting", produkte: "Products", ueber: "Company" },
  tr: { schulungen: "Eğitimler", beratung: "Danışmanlık", produkte: "Ürünler", ueber: "Kurumsal" },
};

export type SiteStrings = {
  skip: string;
  mainNav: string;
  footerNav: string;
  menuOpen: string;
  menuClose: string;
  /** Accessible name of a top item's chevron button; "{label}" is replaced by the item label. */
  chev: string;
  /** Accessible name of the phone menu (a second nav landmark). */
  mnavAria: string;
  /** Link to the footer navigation, shown instead of the menu button when JavaScript is off (phones). */
  noJsMenu: string;
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
  placeLine: string;
  stand: string;
  footer: Record<"schulungen" | "beratung" | "produkte" | "unternehmen" | "legal", string>;
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
    chev: "Untermenü {label}",
    mnavAria: "Navigation für kleine Bildschirme",
    noJsMenu: "Menü",
    homeAria: "OpSolid, zur Startseite",
    cta: "Schulung anfragen",
    langLabel: "Sprache",
    breadcrumb: "Brotkrumen-Navigation",
    figure: "Abb.",
    aiLabel: "KI-generiert",
    videoPause: "Video pausieren",
    videoPlay: "Video abspielen",
    sampleLabel: "Muster",
    tagline: "KI-Schulungen und KI-Beratung für Unternehmen. Erst analysieren, dann schulen.",
    priceNote: "Alle Preise netto zzgl. USt., nur für Unternehmen.",
    placeLine: "OpSolid · Arnsberg (NRW) · Deutsch, Englisch, Türkisch",
    stand: "Stand",
    footer: { schulungen: "Schulungen", beratung: "Beratung", produkte: "Produkte", unternehmen: "Unternehmen", legal: "Rechtliches" },
    fx: { label: "Hintergrundvideo", on: "An", off: "Aus", sys: "Aus (Systemeinstellung: weniger Bewegung)" },
    contactLabel: "Kontakt",
  },
  en: {
    skip: "Skip to content",
    mainNav: "Main navigation",
    footerNav: "Footer",
    menuOpen: "Menu",
    menuClose: "Close",
    chev: "Submenu {label}",
    mnavAria: "Navigation for small screens",
    noJsMenu: "Menu",
    homeAria: "OpSolid, back to the home page",
    cta: "Request training",
    langLabel: "Language",
    breadcrumb: "Breadcrumb",
    figure: "Fig.",
    aiLabel: "AI-generated",
    videoPause: "Pause video",
    videoPlay: "Play video",
    sampleLabel: "Sample",
    tagline: "AI training and AI consulting for businesses. Analyse first, then train.",
    priceNote: "All prices are net of VAT and for businesses only.",
    placeLine: "OpSolid · Arnsberg (NRW), Germany · German, English, Turkish",
    stand: "Updated",
    footer: { schulungen: "Training", beratung: "Consulting", produkte: "Products", unternehmen: "Company", legal: "Legal" },
    fx: { label: "Background video", on: "On", off: "Off", sys: "Off (system setting: reduced motion)" },
    contactLabel: "Contact",
  },
  tr: {
    skip: "İçeriğe geç",
    mainNav: "Ana menü",
    footerNav: "Alt bilgi",
    menuOpen: "Menü",
    menuClose: "Kapat",
    chev: "{label} alt menüsü",
    mnavAria: "Küçük ekranlar için gezinti",
    noJsMenu: "Menü",
    homeAria: "OpSolid, ana sayfaya dön",
    cta: "Eğitim talep edin",
    langLabel: "Dil",
    breadcrumb: "Gezinti yolu",
    figure: "Şek.",
    aiLabel: "Yapay zeka ile üretildi",
    videoPause: "Videoyu duraklat",
    videoPlay: "Videoyu oynat",
    sampleLabel: "Örnek",
    tagline: "Şirketler için YZ eğitimleri ve YZ danışmanlığı. Önce analiz, sonra eğitim.",
    priceNote: "Tüm fiyatlar KDV hariçtir; yalnızca şirketler içindir.",
    placeLine: "OpSolid · Arnsberg (NRW), Almanya · Almanca, İngilizce, Türkçe",
    stand: "Güncelleme",
    footer: { schulungen: "Eğitimler", beratung: "Danışmanlık", produkte: "Ürünler", unternehmen: "Kurumsal", legal: "Yasal" },
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
