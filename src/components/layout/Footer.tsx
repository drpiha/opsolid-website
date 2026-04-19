"use client";

import Link from "next/link";
import { SITE_CONFIG, FOOTER_LINKS } from "@/lib/constants";
import { useLocale } from "@/context/LocaleContext";

export function Footer() {
  const { t } = useLocale();
  const ft = t.footer;

  // Map hrefs to localized labels (same approach as Header)
  const linkLabels: Record<string, string> = {
    "/solutions": t.nav.solutions,
    "/products": t.nav.products,
    "/products/kutasia": "Kutasia",
    "/use-cases": t.nav.useCases,
    "/blog": t.nav.blog,
    "/faq": t.nav.faq,
    "/about": t.nav.about,
    "/contact": t.nav.contact,
    "/impressum": t.impressum.title,
    "/privacy": t.privacy.title,
  };

  return (
    <footer className="relative border-t border-white/10 bg-slate-900">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

      <div className="container-wide py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold text-white tracking-tight"
            >
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 flex-shrink-0">
                <path d="M16 2L28.5 9.5V24.5L16 30L3.5 24.5V9.5L16 2Z" stroke="#60a5fa" strokeWidth="2" fill="none" />
                <path d="M16 8L23 12V22L16 26L9 22V12L16 8Z" stroke="#14b8a6" strokeWidth="2" fill="none" />
                <path d="M9 12L16 16L23 12" stroke="#14b8a6" strokeWidth="1.5" fill="none" />
                <path d="M16 16V26" stroke="#14b8a6" strokeWidth="1.5" fill="none" />
                <path d="M3.5 9.5L16 16L28.5 9.5" stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.5" />
              </svg>
              {SITE_CONFIG.name}
            </Link>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-xs">
              {ft.description}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              {ft.company}
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-teal-400 transition-colors">
                    {linkLabels[link.href] || link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              {ft.services}
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-teal-400 transition-colors">
                    {linkLabels[link.href] || link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              {ft.products}
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.products.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-teal-400 transition-colors">
                    {linkLabels[link.href] || link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              {ft.resources}
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-teal-400 transition-colors">
                    {linkLabels[link.href] || link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              {ft.legal}
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-teal-400 transition-colors">
                    {linkLabels[link.href] || link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">{ft.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
