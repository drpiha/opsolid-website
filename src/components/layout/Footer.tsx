"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { usePathname } from "next/navigation";
import { useLocaleBase as useLocale } from "@/context/LocaleContext";
import { FxToggle } from "@/components/v4/FxToggle";
import { SITE_CONFIG, formatStand } from "@/lib/constants";
import { Logo } from "@/components/v4/Logo";

type L3 = { de: string; en: string; tr: string };
const L = (de: string, en: string, tr: string): L3 => ({ de, en, tr });

const COLS: { h: L3; items: { href: string; label: L3 }[] }[] = [
  {
    h: L("Angebote", "Offers", "Teklifler"),
    items: [
      { href: "/agents", label: L("Agents", "Agents", "Agent'lar") },
      { href: "/websites", label: L("Websites", "Websites", "Web siteleri") },
      { href: "/ai-automation-check", label: L("KI-Check", "AI check", "YZ kontrolü") },
      { href: "/ki-schulungen", label: L("KI-Schulungen", "AI training", "YZ eğitimleri") },
      { href: "/opso", label: L("OpSo", "OpSo", "OpSo") },
    ],
  },
  {
    h: L("Leistungen", "Services", "Hizmetler"),
    items: [
      { href: "/ki-beratung", label: L("KI-Beratung", "AI consulting", "YZ danışmanlığı") },
      { href: "/prozessautomatisierung", label: L("Prozessautomatisierung", "Process automation", "Süreç otomasyonu") },
      { href: "/microsoft-365-automatisierung", label: L("Microsoft 365", "Microsoft 365", "Microsoft 365") },
      { href: "/interne-tools", label: L("Interne Tools", "Internal tools", "Dahili araçlar") },
      { href: "/leistungen", label: L("Alle Leistungen", "All services", "Tüm hizmetler") },
    ],
  },
  {
    h: L("Unternehmen", "Company", "Kurumsal"),
    items: [
      { href: "/ueber-uns", label: L("Über OpSolid", "About", "Hakkımızda") },
      { href: "/blog", label: L("Notizen", "Notes", "Notlar") },
      { href: "/contact", label: L("Kontakt", "Contact", "İletişim") },
    ],
  },
  {
    h: L("Rechtliches", "Legal", "Yasal"),
    items: [
      { href: "/impressum", label: L("Impressum", "Imprint", "Künye") },
      { href: "/privacy", label: L("Datenschutz", "Privacy", "Gizlilik") },
    ],
  },
];

const TAGLINE = L(
  "KI-Agents, Websites und Prozessautomatisierung für Unternehmen. Sitz in Arnsberg; wir arbeiten auf Deutsch, Englisch und Türkisch.",
  "AI agents, websites and process automation for businesses. Based in Arnsberg, Germany; we work in German, English and Turkish.",
  "İşletmeler için YZ agent'ları, web siteleri ve süreç otomasyonu. Merkezimiz Arnsberg'de; Almanca, İngilizce ve Türkçe çalışıyoruz.",
);
const NOT_TOPSOLID = L(
  "OpSolid ist nicht TopSolid (CAD/CAM) und steht in keiner Verbindung dazu.",
  "OpSolid is not TopSolid (CAD/CAM) and has no connection to it.",
  "OpSolid, TopSolid (CAD/CAM) ile ilgili değildir ve onunla bağlantısı yoktur.",
);
const STAND = L("Stand", "Updated", "Güncelleme");

export function Footer() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const loc: keyof L3 = locale === "de" || locale === "tr" ? locale : "en";
  const year = new Date().getFullYear();

  if (pathname && /\/card\/edit\//.test(pathname)) return null;

  return (
    <footer className="v4-footer">
      <div className="v4-footer-in">
        <div className="v4-footer-top">
          {/* The official lockup drawn as a hairline outline: the footer is the sheet's signature, not a second logotype. */}
          <Logo className="v4-footer-logo" />
          <div className="v4-footer-brand">
            <p className="v4-footer-tag">{TAGLINE[loc]}</p>
            <p className="v4-footer-contact">
              <a className="v4-footer-mail" href={`mailto:${SITE_CONFIG.email}`}>
                {SITE_CONFIG.email}
              </a>
              <a className="v4-footer-tel" href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}>
                {SITE_CONFIG.phone}
              </a>
            </p>
          </div>
          <div className="v4-footer-cols">
            {COLS.map((c) => (
              <nav key={c.h.en} aria-label={c.h[loc]} className="v4-footer-col">
                <h2>{c.h[loc]}</h2>
                <ul>
                  {c.items.map((i) => (
                    <li key={i.href}>
                      <Link href={i.href}>{i.label[loc]}</Link>
                    </li>
                  ))}
                  {c.h.en === "Legal" && (
                    <li>
                      <a href="/llms.txt">llms.txt</a>
                    </li>
                  )}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        {/* Drafting title block (Schriftfeld): the same facts as before, one cell each. */}
        <div className="v4-footer-base">
          <span className="v4-tb">© {year} OpSolid</span>
          <span className="v4-tb">Arnsberg</span>
          <span className="v4-tb">
            {STAND[loc]}: {formatStand(locale)}
          </span>
          <span className="v4-tb is-fx">
            <FxToggle />
          </span>
        </div>
        <p className="v4-footer-note">{NOT_TOPSOLID[loc]}</p>
      </div>
    </footer>
  );
}
