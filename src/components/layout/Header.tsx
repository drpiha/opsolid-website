"use client";

import { useState, useEffect } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/context/LocaleContext";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Locale } from "@/content";

const LOCALE_LABELS: Record<Locale, string> = { en: "EN", de: "DE", tr: "TR" };

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/92 backdrop-blur-xl border-b border-slate-100/80 shadow-soft"
          : "bg-transparent"
      )}
    >
      <div className="container-wide">
        <nav className="flex h-16 md:h-[4.5rem] items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="relative z-50 flex items-center gap-2.5 text-xl font-bold text-slate-900 tracking-tight"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0">
              <path d="M16 2L28.5 9.5V24.5L16 30L3.5 24.5V9.5L16 2Z" stroke="#2563eb" strokeWidth="2" fill="none" />
              <path d="M16 8L23 12V22L16 26L9 22V12L16 8Z" stroke="#14b8a6" strokeWidth="2" fill="none" />
              <path d="M9 12L16 16L23 12" stroke="#14b8a6" strokeWidth="1.5" fill="none" />
              <path d="M16 16V26" stroke="#14b8a6" strokeWidth="1.5" fill="none" />
              <path d="M3.5 9.5L16 16L28.5 9.5" stroke="#2563eb" strokeWidth="1.5" fill="none" opacity="0.5" />
            </svg>
            {SITE_CONFIG.name}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-[0.8125rem] font-medium rounded-lg transition-colors duration-200",
                  pathname === link.href
                    ? "text-brand-700 bg-brand-50"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {navLabels[link.href] || link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right: language + CTA */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-50 transition-colors"
                aria-label="Change language"
              >
                <Globe size={14} />
                {LOCALE_LABELS[locale]}
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 bg-white border border-slate-100 rounded-xl shadow-medium overflow-hidden min-w-[100px]"
                  >
                    {(Object.keys(LOCALE_LABELS) as Locale[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setLocale(l);
                          setLangOpen(false);
                        }}
                        className={cn(
                          "block w-full text-left px-4 py-2 text-sm transition-colors",
                          locale === l
                            ? "text-brand-700 bg-brand-50 font-medium"
                            : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        {l === "en" ? "English" : l === "de" ? "Deutsch" : "Türkçe"}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/contact">
              <Button size="sm">{t.nav.cta}</Button>
            </Link>
          </div>

          {/* Mobile: lang + menu */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => {
                const next: Record<Locale, Locale> = { en: "de", de: "tr", tr: "en" };
                setLocale(next[locale]);
              }}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors text-xs font-medium"
              aria-label="Switch language"
            >
              {LOCALE_LABELS[locale]}
            </button>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="relative z-50 flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            >
              {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-1 px-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "w-full text-center py-3.5 text-lg font-medium rounded-xl transition-colors",
                    pathname === link.href
                      ? "text-brand-700 bg-brand-50"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {navLabels[link.href] || link.label}
                </Link>
              ))}
              <div className="mt-6 w-full max-w-xs">
                <Link href="/contact" className="block">
                  <Button size="lg" className="w-full">
                    {t.nav.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
