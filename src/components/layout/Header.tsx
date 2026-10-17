"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { usePathname } from "next/navigation";
import { useLocaleBase as useLocale } from "@/context/LocaleContext";
import { useAuthState } from "@/components/layout/useAuthState";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { cn } from "@/lib/utils";
import { isV4Path } from "@/lib/v4";
import type { Locale } from "@/content";
import { Logo } from "@/components/v4/Logo";

type L3 = { de: string; en: string; tr: string };
type NavItem = { key: string; href: string; match: RegExp; label: L3 };

// v4 primary navigation. The service pages (Prozessautomatisierung,
// Microsoft 365, Interne Tools, KI-Beratung) sit under "Leistungen".
const NAV_ITEMS: NavItem[] = [
  { key: "agents", href: "/agents", match: /\/agents(\/|$)/, label: { de: "Agents", en: "Agents", tr: "Agent'lar" } },
  { key: "websites", href: "/websites", match: /\/websites(\/|$)/, label: { de: "Websites", en: "Websites", tr: "Web siteleri" } },
  {
    key: "services",
    href: "/leistungen",
    match: /\/(leistungen|ki-beratung|prozessautomatisierung|microsoft-365-automatisierung|interne-tools)(\/|$)/,
    label: { de: "Leistungen", en: "Services", tr: "Hizmetler" },
  },
  { key: "check", href: "/ai-automation-check", match: /\/ai-automation-check/, label: { de: "KI-Check", en: "AI check", tr: "YZ kontrolü" } },
  { key: "training", href: "/ki-schulungen", match: /\/ki-schulungen/, label: { de: "KI-Schulungen", en: "AI training", tr: "YZ eğitimleri" } },
  { key: "opso", href: "/opso", match: /\/opso(\/|$)/, label: { de: "OpSo", en: "OpSo", tr: "OpSo" } },
  { key: "about", href: "/ueber-uns", match: /\/ueber-uns/, label: { de: "Über OpSolid", en: "About", tr: "Hakkımızda" } },
];

const CTA: L3 = { de: "KI-Check starten", en: "Start the AI Check", tr: "YZ kontrolüyle başlayın" };
const CONTACT: L3 = { de: "Kontakt", en: "Contact", tr: "İletişim" };
const MENU: L3 = { de: "Menü", en: "Menu", tr: "Menü" };
const CLOSE: L3 = { de: "Menü schließen", en: "Close menu", tr: "Menüyü kapat" };

const LOCALE_LABELS: Record<Locale, string> = { en: "EN", de: "DE", tr: "TR", es: "ES", it: "IT", fr: "FR", ar: "AR" };
const VISIBLE_LOCALES: Locale[] = ["de", "en", "tr"];

export function Header() {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc: keyof L3 = locale === "de" || locale === "tr" ? locale : "en";
  const v4 = isV4Path(pathname);

  const auth = useAuthState();
  const [loggingOut, setLoggingOut] = useState(false);
  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    } finally {
      window.location.href = `/${locale}`;
    }
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    window.history.pushState({ opsolidMenu: true }, "");
    const onPop = () => setOpen(false);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [open]);

  if (pathname && /\/card\/edit\//.test(pathname)) return null;
  const isOpsoPage = /\/opso\/?$/.test(pathname || "");

  return (
    <header className={cn("v4-header", scrolled && "is-scrolled", !v4 && "is-app")} role="banner">
      <div className="v4-header-in">
        <Link href="/" className="v4-brand" aria-label="OpSolid">
          <Logo />
        </Link>

        <nav className="v4-nav" aria-label="Primary">
          {NAV_ITEMS.map((n) => {
            const active = n.match.test(pathname || "");
            return (
              <Link key={n.key} href={n.href} className={cn("v4-nav-link", active && "is-active")} aria-current={active ? "page" : undefined}>
                {n.label[loc]}
              </Link>
            );
          })}
        </nav>

        <div className="v4-header-right">
          <div className="v4-lang" role="radiogroup" aria-label="Language">
            {VISIBLE_LOCALES.map((l) => (
              <button
                key={l}
                type="button"
                role="radio"
                aria-checked={l === locale}
                lang={l}
                onClick={() => setLocale(l)}
                className={cn("v4-lang-chip", l === locale && "is-active")}
              >
                {LOCALE_LABELS[l]}
              </button>
            ))}
          </div>
          {!isOpsoPage && auth.status === "authed" && (
            <div className="v4-account">
              <AccountMenu status={auth.status} user={auth.user} onLogout={logout} loggingOut={loggingOut} />
            </div>
          )}
          <Link href="/contact" className="v4-btn v4-btn-primary v4-header-cta">
            {CTA[loc]}
            <span className="v4-btn-arr" aria-hidden="true">
              →
            </span>
          </Link>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button type="button" className="v4-menu-btn" aria-label={MENU[loc]}>
                <span className="v4-menu-label">{MENU[loc]}</span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 8H21M3 16H21" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                </svg>
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="v4-sheet-overlay" />
              <Dialog.Content className="v4-sheet" aria-describedby={undefined}>
                <div className="v4-sheet-bar">
                  <Dialog.Title className="v4-sheet-title">
                    <Logo label="OpSolid" />
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button type="button" className="v4-menu-btn" aria-label={CLOSE[loc]}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                      </svg>
                    </button>
                  </Dialog.Close>
                </div>
                <nav className="v4-sheet-nav" aria-label="Site">
                  <ul>
                    {NAV_ITEMS.map((n) => {
                      const active = n.match.test(pathname || "");
                      return (
                        <li key={n.key}>
                          <Dialog.Close asChild>
                            <Link href={n.href} className={cn("v4-sheet-link", active && "is-active")} aria-current={active ? "page" : undefined}>
                              <span>{n.label[loc]}</span>
                              <span aria-hidden="true">→</span>
                            </Link>
                          </Dialog.Close>
                        </li>
                      );
                    })}
                    <li>
                      <Dialog.Close asChild>
                        <Link href="/contact" className="v4-sheet-link">
                          <span>{CONTACT[loc]}</span>
                          <span aria-hidden="true">→</span>
                        </Link>
                      </Dialog.Close>
                    </li>
                    {!isOpsoPage && auth.status === "authed" && (
                      <li>
                        <button type="button" onClick={logout} disabled={loggingOut} className="v4-sheet-link v4-sheet-plain">
                          <span>{loggingOut ? "…" : loc === "de" ? "Abmelden" : loc === "tr" ? "Çıkış" : "Sign out"}</span>
                        </button>
                      </li>
                    )}
                  </ul>
                  <div className="v4-sheet-foot">
                    <Dialog.Close asChild>
                      <Link href="/ai-automation-check" className="v4-btn v4-btn-primary v4-btn-lg">
                        {CTA[loc]}
                        <span className="v4-btn-arr" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    </Dialog.Close>
                    <div className="v4-lang v4-lang-sheet" role="radiogroup" aria-label="Language">
                      {VISIBLE_LOCALES.map((l) => (
                        <button
                          key={l}
                          type="button"
                          role="radio"
                          aria-checked={l === locale}
                          lang={l}
                          onClick={() => setLocale(l)}
                          className={cn("v4-lang-chip", l === locale && "is-active")}
                        >
                          {LOCALE_LABELS[l]}
                        </button>
                      ))}
                    </div>
                  </div>
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
