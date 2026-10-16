"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { FxToggle } from "@/components/v4/FxToggle";
import { SITE_CONFIG, formatStand } from "@/lib/constants";

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
    h: L("Praxis", "Practice", "Pratik"),
    items: [
      { href: "/ueber-mich", label: L("Über mich", "About", "Hakkımda") },
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
  "Unabhängige Praxis für KI-Agents, Websites und Automatisierung in Arnsberg.",
  "Independent practice for AI agents, websites and automation, based in Arnsberg.",
  "Arnsberg'de bağımsız bir pratik: YZ agent'ları, web siteleri ve otomasyon.",
);
const NOT_TOPSOLID = L(
  "OpSolid ist nicht TopSolid (CAD/CAM) und steht in keiner Verbindung dazu.",
  "OpSolid is not TopSolid (CAD/CAM) and has no connection to it.",
  "OpSolid, TopSolid (CAD/CAM) ile ilgili değildir.",
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
          <div className="v4-footer-brand">
            <p className="v4-footer-word" aria-hidden="true">
              OpSolid
            </p>
            <p className="v4-footer-tag">{TAGLINE[loc]}</p>
            <p className="v4-footer-contact">
              <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
              <span>{SITE_CONFIG.phone}</span>
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
        <div className="v4-footer-base">
          <span>
            © {year} OpSolid · Arnsberg · {STAND[loc]}: {formatStand(locale)}
          </span>
          <span>{NOT_TOPSOLID[loc]}</span>
          <FxToggle />
        </div>
      </div>
    </footer>
  );
}
