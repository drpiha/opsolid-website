"use client";

import { useEffect, useRef, useState } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";
import type { Locale } from "@/content";

type NavKey = "home" | "products" | "journal" | "contact";

type NavItem = {
  key: NavKey;
  href: string;
  match: RegExp;
  children?: Array<{ key: "voiceAgent" | "digitalCard" | "kutasia"; href: string; match: RegExp }>;
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
const LOCALE_CYCLE: Record<Locale, Locale> = {
  en: "de",
  de: "tr",
  tr: "es",
  es: "it",
  it: "fr",
  fr: "ar",
  ar: "en",
};

export function Header() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);
  const navLabels = t.v2.nav;
  // Top-level "Products" parent label — t.v2.nav has no generic `products`,
  // so we fall back to the root-level nav.products which exists in every locale.
  const productsLabel = t.nav.products;

  // Close menus on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsProductsOpen(false);
    setIsMobileProductsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("menu-open", isMobileOpen);
    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isMobileOpen]);

  // ESC closes mobile menu and desktop products dropdown
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

  // Click-outside closes desktop Products dropdown
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

  // Hide marketing chrome on customer self-service surfaces.
  if (pathname && /\/card\/edit\//.test(pathname)) return null;

  const productItems = NAV_ITEMS.find((n) => n.key === "products")!.children!;

  return (
    <header className="os-header safe-top" role="banner">
      <div className="os-header-inner">
        <Link href="/" className="os-brand">
          <span className="os-brand-mark" aria-hidden="true" />
          OpSolid
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
                {navLabels[n.key as "home" | "journal" | "contact"]}
              </Link>
            );
          })}
        </nav>

        <div className="os-header-right">
          <ThemeToggle />
          <button
            className="os-lang-switch"
            onClick={() => setLocale(LOCALE_CYCLE[locale])}
            aria-label={`Switch language (current: ${LOCALE_LABELS[locale]})`}
          >
            <span style={{ color: "var(--copper-300)", fontWeight: 600 }}>
              {LOCALE_LABELS[locale]}
            </span>
          </button>
          <Link
            href="/contact"
            className="btn btn-primary btn-sm hidden md:inline-flex"
            style={{ padding: "7px 14px" }}
          >
            {navLabels.cta}
          </Link>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
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
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMobileOpen(false);
          }}
        >
          <div className="os-mobile-menu-inner">
            <ul className="os-mobile-list">
              {NAV_ITEMS.map((n) => {
                const active = n.match.test(pathname || "");

                if (n.key === "products") {
                  return (
                    <li key={n.key} className="os-mobile-item">
                      <button
                        type="button"
                        onClick={() => setIsMobileProductsOpen((v) => !v)}
                        aria-expanded={isMobileProductsOpen}
                        className={cn("os-mobile-link", active && "is-active")}
                      >
                        <span>{productsLabel}</span>
                        <span
                          aria-hidden="true"
                          style={{
                            display: "inline-block",
                            transition: "transform 200ms",
                            transform: isMobileProductsOpen ? "rotate(180deg)" : "none",
                            fontSize: "1rem",
                          }}
                        >
                          ▾
                        </span>
                      </button>
                      {isMobileProductsOpen && (
                        <ul className="os-mobile-sublist">
                          {productItems.map((p) => {
                            const pActive = p.match.test(pathname || "");
                            return (
                              <li key={p.key}>
                                <Link
                                  href={p.href}
                                  onClick={() => setIsMobileOpen(false)}
                                  className={cn("os-mobile-sublink", pActive && "is-active")}
                                >
                                  {navLabels[p.key]}
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
                  <li key={n.key} className="os-mobile-item">
                    <Link
                      href={n.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn("os-mobile-link", active && "is-active")}
                    >
                      {navLabels[n.key as "home" | "journal" | "contact"]}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="os-mobile-footer">
              <ThemeToggle />
              <Link
                href="/contact"
                onClick={() => setIsMobileOpen(false)}
                className="btn btn-primary btn-lg os-mobile-cta"
              >
                {navLabels.cta}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
