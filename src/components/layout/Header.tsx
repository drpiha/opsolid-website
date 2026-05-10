"use client";

import { useEffect, useRef, useState } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";
import type { Locale } from "@/content";

type NavKey = "home" | "products" | "journal" | "contact";

type ProductChild = {
  key: "voiceAgent" | "digitalCard" | "kutasia";
  href: string;
  match: RegExp;
};

type NavItem = {
  key: NavKey;
  href: string;
  match: RegExp;
  children?: ProductChild[];
};

const NAV_ITEMS: NavItem[] = [
  { key: "home", href: "/", match: /^\/(en|de|tr|es|it|fr|ar)?\/?$/ },
  {
    key: "products",
    href: "/products/digital-card",
    match: /\/products(\/|$)/,
    children: [
      { key: "voiceAgent", href: "/products/voice-agent", match: /\/products\/voice-agent/ },
      { key: "digitalCard", href: "/products/digital-card", match: /\/products\/digital-card/ },
      { key: "kutasia", href: "/products/kutasia", match: /\/products\/kutasia/ },
    ],
  },
  { key: "journal", href: "/blog", match: /\/blog/ },
  { key: "contact", href: "/contact", match: /\/contact/ },
];

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  de: "DE",
  tr: "TR",
  es: "ES",
  it: "IT",
  fr: "FR",
  ar: "AR",
};
const VISIBLE_LOCALES: Locale[] = ["en", "de", "tr", "es", "it", "fr", "ar"];

const HISTORY_MARKER = "opsolid-mobile-menu";

export function Header() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);
  const navLabels = t.v2.nav;
  const productsLabel = t.nav.products;

  const closeMobile = () => {
    setIsMobileOpen(false);
    setIsMobileProductsOpen(false);
  };

  // Defer state updates so SPA navigation runs first, then the menu closes.
  // Synchronous setState on link click would unmount the menu mid-navigation
  // on some mobile browsers and the click would not register.
  const handleLinkTap = () => {
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => closeMobile());
    } else {
      closeMobile();
    }
  };

  useEffect(() => {
    closeMobile();
    setIsProductsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("menu-open", isMobileOpen);
    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isMobileOpen]);

  // Hardware/browser back button closes the open menu instead of leaving
  // the site. We push a sentinel state when opening; popstate (back) closes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isMobileOpen) return;

    window.history.pushState({ [HISTORY_MARKER]: true }, "");
    const onPop = () => {
      setIsMobileOpen(false);
      setIsMobileProductsOpen(false);
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      // If the menu is being closed by a button (not by back), unwind the
      // history entry we pushed so the user's back stack stays clean.
      if (typeof window !== "undefined") {
        const state = window.history.state as { [HISTORY_MARKER]?: boolean } | null;
        if (state && state[HISTORY_MARKER]) {
          window.history.back();
        }
      }
    };
  }, [isMobileOpen]);

  useEffect(() => {
    if (!isMobileOpen && !isProductsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileOpen(false);
        setIsProductsOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileOpen, isProductsOpen]);

  useEffect(() => {
    if (!isProductsOpen) return;
    const onClick = (e: MouseEvent) => {
      if (productsRef.current && !productsRef.current.contains(e.target as Node)) {
        setIsProductsOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [isProductsOpen]);

  if (pathname && /\/card\/edit\//.test(pathname)) return null;

  const productItems = NAV_ITEMS.find((n) => n.key === "products")!.children!;

  const labelFor = (key: NavKey): string => {
    if (key === "products") return productsLabel;
    return navLabels[key as "home" | "journal" | "contact"];
  };

  return (
    <header className="os-header safe-top" role="banner">
      <div className="os-header-inner">
        <Link href="/" className="os-brand" aria-label="OpSolid — home">
          <span className="os-brand-mark" aria-hidden="true" />
          <span className="os-brand-text">OpSolid</span>
        </Link>

        <nav className="os-nav" aria-label="Primary">
          {NAV_ITEMS.map((n) => {
            const active = n.match.test(pathname || "");

            if (n.key === "products") {
              return (
                <div key={n.key} ref={productsRef} style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={() => setIsProductsOpen((v) => !v)}
                    onMouseEnter={() => setIsProductsOpen(true)}
                    aria-haspopup="menu"
                    aria-expanded={isProductsOpen}
                    className={cn("os-nav-link", active && "is-active")}
                    style={{
                      background: "transparent",
                      border: 0,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {productsLabel}
                    <span aria-hidden="true" style={{ fontSize: 9, opacity: 0.7 }}>▾</span>
                  </button>
                  {isProductsOpen && (
                    <div
                      role="menu"
                      onMouseLeave={() => setIsProductsOpen(false)}
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        left: 0,
                        minWidth: 180,
                        padding: 6,
                        borderRadius: 12,
                        background: "var(--bg-2)",
                        border: "1px solid var(--line)",
                        boxShadow: "var(--depth-3)",
                        zIndex: 51,
                      }}
                    >
                      {productItems.map((p) => {
                        const pActive = p.match.test(pathname || "");
                        return (
                          <Link
                            key={p.key}
                            href={p.href}
                            role="menuitem"
                            onClick={() => setIsProductsOpen(false)}
                            className={cn("os-nav-link", pActive && "is-active")}
                            style={{ display: "block", padding: "8px 12px" }}
                          >
                            {navLabels[p.key]}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={n.key}
                href={n.href}
                className={cn("os-nav-link", active && "is-active")}
              >
                {labelFor(n.key)}
              </Link>
            );
          })}
        </nav>

        <div className="os-header-right">
          <div className="hidden md:inline-flex">
            <ThemeToggle />
          </div>
          <Link
            href="/contact"
            className="btn btn-primary btn-sm hidden md:inline-flex"
            style={{ padding: "7px 14px" }}
          >
            {navLabels.cta}
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileOpen((v) => !v)}
            className="os-mobile-toggle md:hidden"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav"
          >
            {isMobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div
          id="mobile-nav"
          className="os-mobile-menu md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="os-mobile-menu-bar">
            <span className="os-mobile-menu-title">
              <span className="os-brand-mark" aria-hidden="true" />
              OpSolid
            </span>
            <button
              type="button"
              className="os-mobile-close"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="os-mobile-menu-inner" aria-label="Site">
            <ul className="os-mobile-list">
              {NAV_ITEMS.map((n) => {
                const active = n.match.test(pathname || "");

                if (n.key === "products") {
                  const anyChildActive = productItems.some((p) => p.match.test(pathname || ""));
                  const expanded = isMobileProductsOpen || anyChildActive;
                  return (
                    <li key={n.key} className={cn("os-mobile-item", active && "is-active")}>
                      <button
                        type="button"
                        onClick={() => setIsMobileProductsOpen((v) => !v)}
                        aria-expanded={expanded}
                        className={cn("os-mobile-link", active && "is-active")}
                      >
                        <span className="os-mobile-link-label">
                          {active && <span className="os-mobile-active-dot" aria-hidden="true" />}
                          {productsLabel}
                        </span>
                        <span
                          aria-hidden="true"
                          className="os-mobile-chevron"
                          style={{
                            transform: expanded ? "rotate(180deg)" : "none",
                          }}
                        >
                          ▾
                        </span>
                      </button>
                      {expanded && (
                        <ul className="os-mobile-sublist">
                          {productItems.map((p) => {
                            const pActive = p.match.test(pathname || "");
                            return (
                              <li key={p.key}>
                                <Link
                                  href={p.href}
                                  onClick={handleLinkTap}
                                  className={cn("os-mobile-sublink", pActive && "is-active")}
                                >
                                  {pActive && (
                                    <span className="os-mobile-active-dot" aria-hidden="true" />
                                  )}
                                  <span>{navLabels[p.key]}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                }

                return (
                  <li key={n.key} className={cn("os-mobile-item", active && "is-active")}>
                    <Link
                      href={n.href}
                      onClick={handleLinkTap}
                      className={cn("os-mobile-link", active && "is-active")}
                    >
                      <span className="os-mobile-link-label">
                        {active && <span className="os-mobile-active-dot" aria-hidden="true" />}
                        {labelFor(n.key)}
                      </span>
                      <span aria-hidden="true" className="os-mobile-arrow">→</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="os-mobile-cta-wrap">
              <Link
                href="/contact"
                onClick={handleLinkTap}
                className="btn btn-primary btn-lg os-mobile-cta"
              >
                {navLabels.cta}
              </Link>
            </div>

            <div className="os-mobile-footer">
              <div className="os-mobile-locale-row" role="radiogroup" aria-label="Language">
                {VISIBLE_LOCALES.map((l) => (
                  <button
                    key={l}
                    type="button"
                    role="radio"
                    aria-checked={l === locale}
                    onClick={() => setLocale(l)}
                    className={cn("os-mobile-locale-chip", l === locale && "is-active")}
                  >
                    {LOCALE_LABELS[l]}
                  </button>
                ))}
              </div>
              <div className="os-mobile-theme-row">
                <ThemeToggle />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
