"use client";

import { useEffect, useState } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";
import type { Locale } from "@/content";

/**
 * Verbatim port of the Claude Design SiteHeader mock
 * (opsolid-design-system/project/ui_kits/website/components/Site.jsx).
 * Links mapped to the real Next.js routes; language switch wired to the
 * existing useLocale() context so EN · DE · TR actually cycle.
 */
const NAV_ITEMS: Array<{ key: "home" | "voiceAgent" | "digitalCard" | "kutasia" | "journal" | "contact"; href: string; match: RegExp }> = [
  { key: "home", href: "/", match: /^\/(en|de|tr)?\/?$/ },
  { key: "voiceAgent", href: "/products/voice-agent", match: /\/products\/voice-agent/ },
  { key: "digitalCard", href: "/products/digital-card", match: /\/products\/digital-card/ },
  { key: "kutasia", href: "/products/kutasia", match: /\/products\/kutasia/ },
  { key: "journal", href: "/blog", match: /\/blog/ },
  { key: "contact", href: "/contact", match: /\/contact/ },
];

const LOCALE_LABELS: Record<Locale, string> = { en: "EN", de: "DE", tr: "TR" };
const LOCALE_CYCLE: Record<Locale, Locale> = { en: "de", de: "tr", tr: "en" };

export function Header() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navLabels = t.v2.nav;

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("menu-open", isMobileOpen);
    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isMobileOpen]);

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
          <button
            className="os-lang-switch"
            onClick={() => setLocale(LOCALE_CYCLE[locale])}
            aria-label={`Switch language (current: ${LOCALE_LABELS[locale]})`}
          >
            {(["en", "de", "tr"] as Locale[]).map((l, i) => (
              <span
                key={l}
                style={{
                  color: l === locale ? "var(--copper-300)" : undefined,
                  fontWeight: l === locale ? 600 : undefined,
                }}
              >
                {i > 0 && " · "}
                {LOCALE_LABELS[l]}
              </span>
            ))}
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
            className="os-lang-switch md:hidden"
            style={{ padding: "6px 10px" }}
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? "✕" : "≡"}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden overflow-y-auto motion-safe:animate-fade-in"
          style={{
            height: "100dvh",
            background:
              "linear-gradient(180deg, rgba(11,14,19,0.96) 0%, rgba(7,9,12,0.98) 100%)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div
            className="flex flex-col min-h-full px-6"
            style={{
              paddingTop: "max(6rem, env(safe-area-inset-top))",
              paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
            }}
          >
            <ul className="flex flex-col">
              {NAV_ITEMS.map((n) => {
                const active = n.match.test(pathname || "");
                return (
                  <li
                    key={n.key}
                    style={{ borderBottom: "1px dashed var(--line)" }}
                    className="last:border-b-0"
                  >
                    <Link
                      href={n.href}
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.75rem",
                        fontWeight: 500,
                        letterSpacing: "-0.024em",
                        color: active ? "var(--copper-300)" : "var(--ink-100)",
                      }}
                      className="flex items-center justify-between py-5 transition-colors"
                    >
                      <span>{navLabels[n.key]}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-10">
              <Link
                href="/contact"
                className="btn btn-primary btn-lg w-full"
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
