"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";
import type { Locale } from "@/content";

type NavKey = "home" | "services" | "automationCheck" | "journal" | "contact";

type NavItem = {
  key: NavKey;
  href: string;
  match: RegExp;
};

const NAV_ITEMS: NavItem[] = [
  { key: "home", href: "/", match: /^\/(en|de|tr|es|it|fr|ar)?\/?$/ },
  // /leistungen full page is in a later milestone — for now jump to the
  // homepage services anchor so the link never 404s.
  { key: "services", href: "/#services", match: /\/leistungen/ },
  { key: "automationCheck", href: "/ai-automation-check", match: /\/ai-automation-check/ },
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
const VISIBLE_LOCALES: Locale[] = ["de", "en", "tr"];

export function Header() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navLabels = t.v2.nav;

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isMobileOpen) return;
    window.history.pushState({ opsolidMenu: true }, "");
    const onPop = () => setIsMobileOpen(false);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [isMobileOpen]);

  // Hide marketing chrome on customer self-service surfaces.
  if (pathname && /\/card\/edit\//.test(pathname)) return null;

  return (
    <header className="os-header" role="banner">
      <div className="os-header-inner">
        <Link href="/" className="os-brand" aria-label="OpSolid — home">
          <span className="os-brand-mark" aria-hidden="true" />
          <span className="os-brand-text">OpSolid</span>
        </Link>

        <nav className="os-nav" aria-label="Primary">
          {NAV_ITEMS.map((n) => {
            const active = n.match.test(pathname || "");
            return (
              <Link
                key={n.key}
                href={n.href}
                className={cn("os-nav-link", active && "is-active")}
              >
                {navLabels[n.key]}
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

          <Dialog.Root open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="os-mobile-toggle md:hidden"
                aria-label="Open menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="os-mobile-overlay" />
              <Dialog.Content
                className="os-mobile-menu"
                aria-describedby={undefined}
              >
                <div className="os-mobile-menu-bar">
                  <Dialog.Title className="os-mobile-menu-title">
                    <span className="os-brand-mark" aria-hidden="true" />
                    OpSolid
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="os-mobile-close"
                      aria-label="Close menu"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </Dialog.Close>
                </div>

                <nav className="os-mobile-menu-inner" aria-label="Site">
                  <ul className="os-mobile-list">
                    {NAV_ITEMS.map((n) => {
                      const active = n.match.test(pathname || "");
                      return (
                        <li key={n.key} className={cn("os-mobile-item", active && "is-active")}>
                          <Dialog.Close asChild>
                            <Link
                              href={n.href}
                              className={cn("os-mobile-link", active && "is-active")}
                            >
                              <span className="os-mobile-link-label">
                                {active && <span className="os-mobile-active-dot" aria-hidden="true" />}
                                {navLabels[n.key]}
                              </span>
                              <span aria-hidden="true" className="os-mobile-arrow">→</span>
                            </Link>
                          </Dialog.Close>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="os-mobile-cta-wrap">
                    <Dialog.Close asChild>
                      <Link
                        href="/contact"
                        className="btn btn-primary btn-lg os-mobile-cta"
                      >
                        {navLabels.cta}
                      </Link>
                    </Dialog.Close>
                  </div>

                  <div className="os-mobile-footer">
                    <div
                      className="os-mobile-locale-row"
                      role="radiogroup"
                      aria-label="Language"
                    >
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
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
