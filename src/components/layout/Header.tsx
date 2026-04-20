"use client";

import { useState, useEffect } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { usePathname } from "next/navigation";
import { Menu, X, Globe } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Locale } from "@/content";

const LOCALE_LABELS: Record<Locale, string> = { en: "EN", de: "DE", tr: "TR" };

/**
 * Editorial, warm-graphite hex logo.
 * Ink outer frame + amber inner cage. Tints via currentColor where needed;
 * specific stops stay as token hexes (`#15120F`, `#E8A252`) for crisp rendering.
 */
function HexLogo({ size = 32 }: { size?: number }) {
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
        stroke="#15120F"
        strokeWidth="1.75"
        fill="none"
      />
      <path
        d="M16 8L23 12V22L16 26L9 22V12L16 8Z"
        stroke="#E8A252"
        strokeWidth="1.5"
        fill="none"
      />
      <path d="M9 12L16 16L23 12" stroke="#E8A252" strokeWidth="1.25" fill="none" />
      <path d="M16 16V26" stroke="#E8A252" strokeWidth="1.25" fill="none" />
      <path
        d="M3.5 9.5L16 16L28.5 9.5"
        stroke="#15120F"
        strokeWidth="1.25"
        fill="none"
        opacity="0.4"
      />
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

  // Lock body scroll while the mobile menu overlay is open. Cleanup on close
  // and on unmount so the class cannot leak into other routes.
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
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-200 pt-safe",
        isScrolled
          ? "bg-paper/90 backdrop-blur-sm hairline-b"
          : "bg-transparent"
      )}
    >
      <div className="container-wide">
        <nav className="flex h-16 md:h-[4.5rem] items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="relative z-50 flex items-center gap-2.5 font-serif text-[1.375rem] leading-none text-ink tracking-[-0.01em]"
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
                    "relative px-3 py-2 text-[0.8125rem] font-medium transition-colors duration-200",
                    active
                      ? "text-ink"
                      : "text-ink/70 hover:text-ink"
                  )}
                >
                  {navLabels[link.href] || link.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute left-3 right-3 -bottom-0.5 h-[2px] bg-amber"
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
                className="mono-label flex items-center gap-1.5 px-2.5 py-1.5 text-ink/70 hover:text-ink transition-colors"
                aria-label="Change language"
                aria-expanded={langOpen}
              >
                <Globe size={13} strokeWidth={1.5} />
                {LOCALE_LABELS[locale]}
              </button>
              {langOpen && (
                <div
                  className="absolute right-0 top-full mt-2 bg-paper hairline overflow-hidden min-w-[120px] motion-safe:animate-fade-in"
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
                          "flex w-full items-center justify-between px-3 py-2 text-sm transition-colors",
                          locale === l
                            ? "text-ink bg-paper-warm"
                            : "text-ink/70 hover:text-ink hover:bg-paper-warm"
                        )}
                      >
                        <span>
                          {l === "en" ? "English" : l === "de" ? "Deutsch" : "Türkçe"}
                        </span>
                        <span className="mono-label text-ink/40">
                          {LOCALE_LABELS[l]}
                        </span>
                      </button>
                    ))}
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-amber text-ink hairline px-5 py-2 text-sm font-medium hover:bg-amber-600 hover:text-paper transition-colors"
            >
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
              className="mono-label flex items-center justify-center w-9 h-9 text-ink/70 hover:text-ink transition-colors"
              aria-label="Switch language"
            >
              {LOCALE_LABELS[locale]}
            </button>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="relative z-50 flex items-center justify-center w-9 h-9 text-ink hover:bg-paper-warm transition-colors"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-paper paper-grain md:hidden overflow-y-auto overscroll-contain motion-safe:animate-fade-in"
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
              <div className="mono-label text-ink/50 pb-4">MENU</div>
              <ul className="flex flex-col hairline-t">
                {NAV_LINKS.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <li key={link.href} className="hairline-b">
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center justify-between py-4 text-lg font-serif tracking-[-0.01em] transition-colors",
                          active
                            ? "text-ink"
                            : "text-ink/75 hover:text-ink"
                        )}
                      >
                        <span>{navLabels[link.href] || link.label}</span>
                        {active && (
                          <span
                            aria-hidden="true"
                            className="h-[2px] w-6 bg-amber"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8">
                <Link
                  href="/contact"
                  className="flex items-center justify-center w-full bg-amber text-ink hairline py-3.5 text-base font-medium hover:bg-amber-600 hover:text-paper transition-colors"
                >
                  {t.nav.cta}
                </Link>
              </div>
          </div>
        </div>
      )}
    </header>
  );
}
