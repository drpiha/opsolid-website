"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/v7/Logo";
import { LABEL, LANG_NAME, LANG_SHORT, NAV_KEYS, NAV_LABEL, SITE_STR } from "@/content/v7/site";
import { href, keyForPublicPath, L3_LOCALES, type L3, type PageKey } from "@/lib/v7-routes";
import { LangHint } from "./LangHint";
import { wrap } from "./ui";

/** Parent of a page in the primary navigation (the pillar a child page belongs to). */
const PILLAR: Partial<Record<PageKey, PageKey>> = {
  check: "beratung",
  prozess: "beratung",
  m365: "beratung",
  agenten: "beratung",
  anwendungen: "beratung",
  kompetenz: "schulungen",
  copilot: "schulungen",
  trainer: "schulungen",
};

// Explicit language choice cookie. Keep in step with COOKIE_NAME in src/context/LocaleContext.tsx and the middleware.
const COOKIE_NAME = "OPSOLID_LOCALE_V3";
const LEGACY_COOKIES = ["NEXT_LOCALE", "OPSOLID_LOCALE", "OPSOLID_LOCALE_V2"];
function rememberLocale(l: L3) {
  try {
    document.cookie = `${COOKIE_NAME}=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    for (const c of LEGACY_COOKIES) document.cookie = `${c}=; path=/; max-age=0; samesite=lax`;
  } catch {
    /* cookies unavailable */
  }
}

function Lang({ locale, current, sub, className = "" }: { locale: L3; current: L3; sub: { key: PageKey; sub: string } | null; className?: string }) {
  const t = SITE_STR[current];
  return (
    <div role="group" aria-label={t.langLabel} className={`flex items-center ${className}`}>
      {L3_LOCALES.map((l) => {
        const target = sub ? href(sub.key, l, { sub: sub.sub }) : href("home", l);
        const active = l === locale;
        return (
          <Link
            key={l}
            href={target}
            prefetch={false}
            hrefLang={l}
            lang={l}
            // The accessible name is the visible "DE"/"EN"/"TR" (WCAG 2.5.3 label in name); the full name is a tooltip.
            title={LANG_NAME[l]}
            aria-current={active ? "true" : undefined}
            onClick={() => rememberLocale(l)}
            className={`f-mono inline-flex min-h-[44px] min-w-[40px] items-center justify-center rounded-[10px] px-2 text-[12px] uppercase ${
              active ? "text-[#16191D] underline decoration-[#B5623A] decoration-2 underline-offset-[6px]" : "text-[#6B665F] hover:text-[#16191D]"
            }`}
          >
            {LANG_SHORT[l]}
          </Link>
        );
      })}
    </div>
  );
}

/**
 * v7 header. `publicPath` comes from the x-public-path request header (the URL the browser shows) and is
 * the hydration-safe starting value; once mounted, window.location is the source (usePathname differs
 * between server and client under the middleware rewrites).
 */
export function V7Header({ locale, publicPath, suggest }: { locale: L3; publicPath: string; suggest?: "en" | "tr" | "" }) {
  const pathname = usePathname();
  const [path, setPath] = useState(publicPath);
  const [open, setOpen] = useState(false);
  const dlg = useRef<HTMLDialogElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const t = SITE_STR[locale];

  useEffect(() => {
    setPath(window.location.pathname);
    setOpen(false);
  }, [pathname]);

  // The panel is a native modal dialog: showModal() traps focus, inerts the page and closes on Escape.
  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (open && !d.open) {
      if (typeof d.showModal === "function") d.showModal();
      else d.setAttribute("open", "");
      closeBtn.current?.focus();
    } else if (!open && d.open) {
      if (typeof d.close === "function") d.close();
      else d.removeAttribute("open");
    }
  }, [open]);

  const onClose = useCallback(() => {
    setOpen(false);
    const a = document.activeElement;
    if (!a || a === document.body || dlg.current?.contains(a)) btn.current?.focus();
  }, []);

  const here = keyForPublicPath(path);
  const pillar = here ? (PILLAR[here.key] ?? here.key) : null;
  const pageLocale = here?.locale ?? locale;
  const linkItems = NAV_KEYS.map((k) => ({
    key: k,
    label: NAV_LABEL[locale][k] ?? LABEL[locale][k],
    url: href(k, locale),
    active: pillar === k,
    current: here?.key === k && !here.sub,
  }));
  const cta = href("kontakt", locale);
  const lang = here ? { key: here.key, sub: here.sub } : null;

  return (
    <>
      <header className="v7 v7-header sticky top-0 z-50 border-b border-[#E3DCD1]">
        <div className={`${wrap} flex h-16 items-center justify-between gap-4 md:h-[72px]`}>
          <Link href={href("home", locale)} aria-label={t.homeAria} onClick={() => { if (locale === "de") rememberLocale("de"); }} className="flex min-h-[44px] shrink-0 items-center text-[#16191D] [&_svg]:h-[22px] [&_svg]:w-auto md:[&_svg]:h-[24px]">
            <Logo />
          </Link>

          <nav aria-label={t.mainNav} className="hidden items-center gap-6 lg:flex xl:gap-9">
            {linkItems.map((n) => (
              <Link
                key={n.key}
                href={n.url}
                aria-current={n.current ? "page" : undefined}
                className={`relative inline-flex min-h-[44px] items-center text-[15px] text-[#16191D] after:absolute after:bottom-2 after:left-0 after:h-px after:w-full after:origin-left after:bg-[#B5623A] after:transition-transform after:duration-200 hover:after:scale-x-100 ${
                  n.active ? "after:scale-x-100" : "after:scale-x-0"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 lg:gap-4">
            <Lang locale={pageLocale} current={locale} sub={lang} className="hidden lg:flex" />
            <Link
              href={cta}
              className="hidden min-h-[44px] items-center rounded-[14px] border border-[#16191D] px-5 text-[15px] font-medium text-[#16191D] transition-colors duration-150 hover:bg-[#16191D] hover:text-[#F6F2EC] lg:inline-flex"
            >
              {t.cta}
            </Link>
            <button
              ref={btn}
              type="button"
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-controls="v7-menu"
              onClick={() => setOpen(true)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-[14px] border border-[#E3DCD1] bg-white px-4 text-[15px] font-medium text-[#16191D] lg:hidden"
            >
              <span>{t.menuOpen}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 5h12M2 11h12" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>

        <dialog id="v7-menu" ref={dlg} className="v7-menu" aria-label={t.menuTitle} onClose={onClose}>
          <div className={`${wrap} flex h-16 shrink-0 items-center justify-between border-b border-[#E3DCD1]`}>
            <Link href={href("home", locale)} aria-label={t.homeAria} onClick={() => setOpen(false)} className="flex min-h-[44px] items-center text-[#16191D] [&_svg]:h-[22px] [&_svg]:w-auto">
              <Logo />
            </Link>
            <button
              ref={closeBtn}
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-[14px] border border-[#E3DCD1] bg-white px-4 text-[15px] font-medium text-[#16191D]"
            >
              <span>{t.menuClose}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
          <nav aria-label={t.mainNav} className={`${wrap} flex flex-1 flex-col py-4`}>
            <ul>
              {[...linkItems, { key: "kontakt" as PageKey, label: LABEL[locale].kontakt, url: href("kontakt", locale), active: pillar === "kontakt", current: here?.key === "kontakt" && !here.sub }].map((n) => (
                <li key={n.key}>
                  <Link
                    href={n.url}
                    onClick={() => setOpen(false)}
                    aria-current={n.current ? "page" : undefined}
                    className={`f-display flex min-h-[56px] items-center justify-between border-b border-[#E3DCD1] text-[26px] leading-none ${n.active ? "text-[#8A4524]" : ""}`}
                  >
                    {n.label}
                    <span aria-hidden="true" className="text-[#B5623A]">→</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              <Link
                href={cta}
                onClick={() => setOpen(false)}
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-[16px] bg-[#16191D] px-7 text-[16px] font-medium text-[#F6F2EC]"
              >
                {t.cta}
              </Link>
              <Lang locale={pageLocale} current={locale} sub={lang} className="mt-4 justify-center" />
            </div>
          </nav>
        </dialog>
      </header>
      {suggest && here?.key === "home" && here.locale === "de" && locale === "de" && !here.sub ? <LangHint suggest={suggest} /> : null}
    </>
  );
}
