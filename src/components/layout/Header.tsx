"use client";

import { useState, useEffect } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, Check } from "lucide-react";
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
 * Popl-style hex logo — clean ink outer frame with a red inner cage.
 * The brand red is used sparingly on the inner geometry to echo the CTA.
 */
function HexLogo({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <path
        d="M16 2L28.5 9.5V24.5L16 30L3.5 24.5V9.5L16 2Z"
        stroke="#0A0A0A"
        strokeWidth="1.75"
        fill="none"
      />
      <path
        d="M16 8L23 12V22L16 26L9 22V12L16 8Z"
        stroke="#E63946"
        strokeWidth="1.5"
        fill="none"
      />
      <path d="M9 12L16 16L23 12" stroke="#E63946" strokeWidth="1.25" fill="none" />
      <path d="M16 16V26" stroke="#E63946" strokeWidth="1.25" fill="none" />
    </svg>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setLangOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu overlay is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isMobileOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
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
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-200 safe-top",
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-neutral-200"
          : "bg-transparent"
      )}
    >
      <div className="container-wide">
        <nav className="flex h-16 md:h-[4.5rem] items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="relative z-50 flex items-center gap-2.5 text-[1.25rem] font-extrabold leading-none text-ink tracking-[-0.02em]"
          >
            <HexLogo size={30} />
            <span>{SITE_CONFIG.name}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors duration-200",
                    active ? "text-ink" : "text-ink/70 hover:text-ink"
                  )}
                >
                  {navLabels[link.href] || link.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full bg-brand"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop right: language + CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ink/70 hover:text-ink hover:bg-neutral-100 transition-colors"
                aria-label="Change language"
                aria-expanded={langOpen}
              >
                <Globe size={14} strokeWidth={2} />
                {LOCALE_LABELS[locale]}
              </button>
              {langOpen && (
                <div
                  className="absolute right-0 top-full mt-2 bg-white border border-neutral-200 rounded-2xl shadow-lifted overflow-hidden min-w-[160px] motion-safe:animate-fade-in"
                  role="menu"
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
                        "flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors",
                        locale === l
                          ? "text-ink bg-neutral-50 font-semibold"
                          : "text-ink/70 hover:text-ink hover:bg-neutral-50"
                      )}
                    >
                      <span>{LOCALE_NAMES[l]}</span>
                      {locale === l ? (
                        <Check size={14} className="text-brand" />
                      ) : (
                        <span className="text-xs font-semibold text-ink/40">
                          {LOCALE_LABELS[l]}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href="/contact" className="btn-primary text-sm">
              {t.nav.cta}
            </Link>
          </div>

          {/* Mobile: lang + menu */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => {
                const next: Record<Locale, Locale> = { en: "de", de: "tr", tr: "en" };
                setLocale(next[locale]);
              }}
              className="flex items-center justify-center w-10 h-10 rounded-full text-xs font-semibold text-ink/70 hover:text-ink hover:bg-neutral-100 transition-colors"
              aria-label="Switch language"
            >
              {LOCALE_LABELS[locale]}
            </button>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="relative z-50 flex items-center justify-center w-10 h-10 rounded-full text-ink hover:bg-neutral-100 transition-colors"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-white md:hidden overflow-y-auto overscroll-contain motion-safe:animate-fade-in"
          style={{ height: "100dvh" }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div
            className="flex flex-col min-h-full px-6"
            style={{
              paddingTop: "max(5rem, env(safe-area-inset-top))",
              paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
            }}
          >
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href} className="border-b border-neutral-200">
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between py-5 text-2xl font-bold tracking-[-0.02em] transition-colors",
                        active ? "text-ink" : "text-ink/75 hover:text-ink"
                      )}
                    >
                      <span>{navLabels[link.href] || link.label}</span>
                      {active && (
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 rounded-full bg-brand"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-10">
              <Link href="/contact" className="btn-primary w-full">
                {t.nav.cta}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
