"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useLocaleBase as useLocale } from "@/context/LocaleContext";
import { useAuthState } from "@/components/layout/useAuthState";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { isV4Path } from "@/lib/v4";
import { stripLocaleFromPath, withLocale } from "@/lib/i18n";
import { Logo } from "@/components/v7/Logo";
import { V7Header } from "@/components/v7/Header";
import { href as pageHref, type L3 as V7Locale } from "@/lib/v7-routes";
import { LABEL, NAV_KEYS, NAV_LABEL } from "@/content/v7/site";

type L3 = { de: string; en: string; tr: string };

/** Class join for the header: v4 classes never conflict, so tailwind-merge (cn) stays out of the marketing bundle. */
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

// App surfaces show the same primary navigation as the v7 marketing header (public, localized URLs), so
// nothing here links to a retired page.
const navItems = (l: V7Locale) => NAV_KEYS.map((k) => ({ key: k, href: pageHref(k, l), label: NAV_LABEL[l][k] ?? LABEL[l][k] }));

// One CTA, one target on desktop and in the mobile sheet: the KI-Check, the entry offer.
const CTA: L3 = { de: "KI-Check anfragen", en: "Request an AI check", tr: "YZ Kontrolü isteyin" };
const CONTACT: L3 = { de: "Kontakt", en: "Contact", tr: "İletişim" };
const MENU: L3 = { de: "Menü", en: "Menu", tr: "Menü" };
const CLOSE: L3 = { de: "Menü schließen", en: "Close menu", tr: "Menüyü kapat" };
const NAV_ARIA: L3 = { de: "Hauptnavigation", en: "Main", tr: "Ana menü" };
const LANG_LABEL: L3 = { de: "Sprache", en: "Language", tr: "Dil" };

const VISIBLE_LOCALES: (keyof L3)[] = ["de", "en", "tr"];
const LOCALE_LABELS: L3 = { de: "DE", en: "EN", tr: "TR" };
// Accessible names keep the visible abbreviation (label in name) and add the language's own name.
const LOCALE_NAMES: L3 = { de: "Deutsch (DE)", en: "English (EN)", tr: "Türkçe (TR)" };

/**
 * Language switch as real links (crawlable alternates, Tab/Enter like any link). A plain click goes through
 * setLocale, which stores the explicit choice in the cookie and navigates; modified clicks (new tab) keep the
 * browser default.
 */
function LangLinks({ pathname, current, onPick }: { pathname: string; current: string; onPick: (l: keyof L3) => void }) {
  const rest = stripLocaleFromPath(pathname || "/");
  const pick = (e: MouseEvent<HTMLAnchorElement>, l: keyof L3) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onPick(l);
  };
  return (
    <>
      {VISIBLE_LOCALES.map((l) => (
        <NextLink
          key={l}
          href={withLocale(rest, l)}
          prefetch={false}
          hrefLang={l}
          lang={l}
          aria-label={LOCALE_NAMES[l]}
          aria-current={l === current ? "true" : undefined}
          onClick={(e) => pick(e, l)}
          className={cx("v4-lang-chip", l === current && "is-active")}
        >
          {LOCALE_LABELS[l]}
        </NextLink>
      ))}
    </>
  );
}

function AppHeader() {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
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

  // Mobile sheet: a native modal <dialog>. showModal() traps focus, makes the page behind it inert and closes
  // on Escape (and on the Android back gesture), so opening the menu adds no history entry.
  useEffect(() => {
    const d = sheetRef.current;
    if (!d) return;
    if (open && !d.open) {
      if (typeof d.showModal === "function") d.showModal();
      else d.setAttribute("open", "");
      closeRef.current?.focus();
    } else if (!open && d.open) {
      if (typeof d.close === "function") d.close();
      else d.removeAttribute("open");
    }
  }, [open]);

  const close = () => setOpen(false);
  // Fires for every close (Escape, close button, a link, a route change). Focus goes back to the menu button
  // unless the browser already restored it elsewhere.
  const onSheetClose = () => {
    setOpen(false);
    const a = document.activeElement;
    if (!a || a === document.body || sheetRef.current?.contains(a)) menuRef.current?.focus();
  };

  if (pathname && /\/card\/edit\//.test(pathname)) return null;
  const isOpsoPage = /\/opso\/?$/.test(pathname || "");
  const NAV_ITEMS = navItems(loc);
  const CTA_HREF = `${pageHref("kontakt", loc)}?anliegen=ki-check`;

  return (
    <header className={cx("v4-header", scrolled && "is-scrolled", !v4 && "is-app")} role="banner">
      <div className="v4-header-in">
        <NextLink href={pageHref("home", loc)} className="v4-brand" aria-label="OpSolid">
          <Logo />
        </NextLink>

        <nav className="v4-nav" aria-label={NAV_ARIA[loc]}>
          {NAV_ITEMS.map((n) => (
            <NextLink key={n.key} href={n.href} className="v4-nav-link">
              {n.label}
            </NextLink>
          ))}
        </nav>

        <div className="v4-header-right">
          <nav className="v4-lang" aria-label={LANG_LABEL[loc]}>
            <LangLinks pathname={pathname || "/"} current={locale} onPick={setLocale} />
          </nav>
          {!isOpsoPage && auth.status === "authed" && (
            <div className="v4-account">
              <AccountMenu status={auth.status} user={auth.user} onLogout={logout} loggingOut={loggingOut} />
            </div>
          )}
          <NextLink href={CTA_HREF} className="v4-btn v4-btn-primary v4-header-cta">
            {CTA[loc]}
            <span className="v4-btn-arr" aria-hidden="true">
              →
            </span>
          </NextLink>

          <button
            ref={menuRef}
            type="button"
            className="v4-menu-btn"
            aria-label={MENU[loc]}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="v4-sheet"
            onClick={() => setOpen(true)}
          >
            <span className="v4-menu-label">{MENU[loc]}</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 8H21M3 16H21" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
            </svg>
          </button>

          <dialog id="v4-sheet" ref={sheetRef} className="v4-sheet" aria-label={MENU[loc]} onClose={onSheetClose}>
            <div className="v4-sheet-bar">
              <div className="v4-sheet-title">
                <Logo label="OpSolid" />
              </div>
              <button ref={closeRef} type="button" className="v4-menu-btn" aria-label={CLOSE[loc]} onClick={close}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                </svg>
              </button>
            </div>
            <nav className="v4-sheet-nav" aria-label={NAV_ARIA[loc]}>
              <ul>
                {NAV_ITEMS.map((n) => (
                  <li key={n.key}>
                    <NextLink href={n.href} onClick={close} className="v4-sheet-link">
                      <span>{n.label}</span>
                      <span aria-hidden="true">→</span>
                    </NextLink>
                  </li>
                ))}
                <li>
                  <NextLink href={pageHref("kontakt", loc)} onClick={close} className="v4-sheet-link">
                    <span>{CONTACT[loc]}</span>
                    <span aria-hidden="true">→</span>
                  </NextLink>
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
                <NextLink href={CTA_HREF} onClick={close} className="v4-btn v4-btn-primary v4-btn-lg">
                  {CTA[loc]}
                  <span className="v4-btn-arr" aria-hidden="true">
                    →
                  </span>
                </NextLink>
                <div className="v4-lang v4-lang-sheet" role="group" aria-label={LANG_LABEL[loc]}>
                  <LangLinks pathname={pathname || "/"} current={locale} onPick={setLocale} />
                </div>
              </div>
            </nav>
          </dialog>
        </div>
      </div>
    </header>
  );
}

/**
 * Marketing paths (isV4Path) render the v7 header; app surfaces keep theirs. The decision follows the client
 * pathname so a soft navigation between the two kinds swaps the header. `publicPath` and `suggest` come from
 * the request headers x-public-path / x-opsolid-suggest (set by the middleware) via the locale layout.
 */
export function Header({ publicPath = "/", suggest = "" }: { publicPath?: string; suggest?: "en" | "tr" | "" }) {
  const pathname = usePathname();
  const { locale } = useLocale();
  if (isV4Path(pathname)) {
    const l: V7Locale = locale === "de" || locale === "tr" ? locale : "en";
    return <V7Header locale={l} publicPath={publicPath} suggest={suggest} />;
  }
  return <AppHeader />;
}
