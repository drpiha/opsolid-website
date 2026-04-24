"use client";

import { useState, useEffect } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { usePathname } from "next/navigation";
import { Menu, X, Check } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Locale } from "@/content";

const LOCALE_LABELS: Record<Locale, string> = { en: "EN", de: "DE", tr: "TR" };
const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  tr: "Türkçe",
};

/**
 * Copper brand mark — small embossed square that matches the design system's
 * panel recipe: copper gradient fill + inset rim + dark inner face + soft bloom.
 */
function BrandMark({ size = 24 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="os-brand-mark"
    />
  );
}

export function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();

  useEffect(() => {
    setIsMobileOpen(false);
    setLangOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("menu-open", isMobileOpen);
    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isMobileOpen]);

  const navLabels: Record<string, string> = {
    "/solutions": t.nav.solutions,
    "/products": t.nav.products,
    "/use-cases": t.nav.useCases,
    "/blog": t.nav.blog,
    "/about": t.nav.about,
    "/contact": t.nav.contact,
  };

  return (
    <header className="os-header safe-top" role="banner">
      <div className="os-header-inner">
        {/* Brand */}
        <Link href="/" className="os-brand">
          <BrandMark size={24} />
          <span>{SITE_CONFIG.name}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="os-nav" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn("os-nav-link", active && "is-active")}
              >
                {navLabels[link.href] || link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster — lang + CTA + mobile toggle */}
        <div className="os-header-right">
          <div className="relative hidden md:block">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="os-lang-switch"
              aria-label="Change language"
              aria-expanded={langOpen}
            >
              {LOCALE_LABELS[locale]}
            </button>
            {langOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-3 min-w-[170px] panel overflow-hidden motion-safe:animate-fade-in"
              >
                {(Object.keys(LOCALE_LABELS) as Locale[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLocale(l);
                      setLangOpen(false);
                    }}
                    role="menuitem"
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-2.5 text-[13px] transition-colors",
                      locale === l
                        ? "text-ink-100 bg-white/[0.04] font-medium"
                        : "text-ink-300 hover:text-ink-100 hover:bg-white/[0.03]"
                    )}
                  >
                    <span>{LOCALE_NAMES[l]}</span>
                    {locale === l ? (
                      <Check size={14} className="text-copper-400" />
                    ) : (
                      <span className="text-[10px] font-medium tracking-[0.1em] text-ink-400 font-mono">
                        {LOCALE_LABELS[l]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className="btn btn-primary btn-sm hidden md:inline-flex"
          >
            {t.nav.cta}
          </Link>

          {/* Mobile: lang cycle + menu toggle */}
          <button
            onClick={() => {
              const next: Record<Locale, Locale> = { en: "de", de: "tr", tr: "en" };
              setLocale(next[locale]);
            }}
            className="os-lang-switch md:hidden"
            aria-label="Switch language"
          >
            {LOCALE_LABELS[locale]}
          </button>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="os-lang-switch md:hidden"
            style={{ padding: "6px 8px" }}
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X size={16} strokeWidth={2} /> : <Menu size={16} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-bg-0/95 backdrop-blur-xl md:hidden overflow-y-auto motion-safe:animate-fade-in"
          style={{ height: "100dvh" }}
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
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <li
                    key={link.href}
                    className="border-b border-line-soft last:border-b-0"
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between py-5 font-display text-[1.75rem] font-medium tracking-[-0.024em] transition-colors",
                        active
                          ? "text-copper-300"
                          : "text-ink-100 hover:text-copper-300"
                      )}
                    >
                      <span>{navLabels[link.href] || link.label}</span>
                      {active && (
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 rounded-full bg-copper-400"
                          style={{ boxShadow: "0 0 10px rgba(194,121,64,0.7)" }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-10">
              <Link href="/contact" className="btn btn-primary btn-lg w-full">
                {t.nav.cta}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
