"use client";

// =============================================================================
// DashboardChrome — sticky topbar for all /dashboard/* pages.
//
// Logout: POST /api/auth/logout then redirect to /{locale}.
// Locale switcher: replaces the /{locale} prefix in the current path.
// Mobile: email collapses into an avatar initial inside a dropdown.
// =============================================================================

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SITE_CONFIG } from "@/lib/constants";
import { LOCALES, type Locale } from "@/lib/i18n";

interface Props {
  userEmail: string;
  locale: string;
}

export function DashboardChrome({ userEmail, locale }: Props) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    } finally {
      router.push(`/${locale}`);
      router.refresh();
    }
  };

  const switchLocale = (next: Locale) => {
    const path = window.location.pathname;
    // Replace the leading /{locale} segment with the new one
    const rest = path.replace(/^\/[a-z]{2}(\/|$)/, "/");
    router.push(`/${next}${rest === "/" ? "" : rest}`);
    setMenuOpen(false);
  };

  const avatarInitial = userEmail.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg-1/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        {/* Wordmark + nav */}
        <div className="flex items-center gap-4">
          <a
            href={`/${locale}`}
            className="font-mono text-sm font-semibold uppercase tracking-[0.12em] text-copper-500"
            aria-label={`${SITE_CONFIG.name} — go to homepage`}
          >
            {SITE_CONFIG.name}
          </a>
          <a
            href={`/${locale}/dashboard/cards`}
            className="hidden sm:inline-flex items-center text-xs font-semibold text-ink transition-colors hover:text-copper-500"
          >
            {locale === "de"
              ? "Meine Karten"
              : locale === "tr"
                ? "Kartlarım"
                : "My Cards"}
          </a>
          <a
            href={`/${locale}/discover`}
            className="hidden sm:inline-flex items-center text-xs font-medium text-ink-400 transition-colors hover:text-ink"
          >
            {locale === "de" ? "Entdecken" : locale === "tr" ? "Keşfet" : "Discover"}
          </a>
          <a
            href={`/${locale}/dashboard/contacts`}
            className="hidden sm:inline-flex items-center text-xs font-medium text-ink-400 transition-colors hover:text-ink"
          >
            {locale === "de" ? "Kontakte" : locale === "tr" ? "Kişiler" : "Contacts"}
          </a>
          <a
            href={`/${locale}/dashboard/inbox`}
            className="hidden sm:inline-flex items-center text-xs font-medium text-ink-400 transition-colors hover:text-ink"
          >
            {locale === "de" ? "Posteingang" : locale === "tr" ? "Gelen Kutusu" : "Inbox"}
          </a>
          <a
            href={`/${locale}/dashboard/playbooks`}
            className="hidden md:inline-flex items-center text-xs font-medium text-ink-400 transition-colors hover:text-ink"
          >
            Playbooks
          </a>
          <a
            href={`/${locale}/dashboard/channels`}
            className="hidden md:inline-flex items-center text-xs font-medium text-ink-400 transition-colors hover:text-ink"
          >
            {locale === "de" ? "Kanäle" : locale === "tr" ? "Kanallar" : "Channels"}
          </a>
        </div>

        <div className="flex items-center gap-3">
          {/* Locale switcher — visible on all sizes */}
          <div
            role="group"
            aria-label="Language"
            className="hidden sm:inline-flex items-center gap-0.5 rounded-full border border-line bg-bg-2 p-0.5 text-[11px] font-mono uppercase tracking-wider"
          >
            {LOCALES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => switchLocale(code)}
                aria-current={code === locale ? "true" : undefined}
                className={[
                  "min-w-[36px] rounded-full px-2.5 py-1.5 transition-colors",
                  code === locale
                    ? "bg-ink text-bg-0 shadow-sm"
                    : "text-ink-400 hover:text-ink",
                ].join(" ")}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Email — hidden on mobile */}
          <span className="hidden md:block max-w-[200px] truncate text-sm text-ink-400 select-none">
            {userEmail}
          </span>

          {/* Logout button — hidden on mobile (in dropdown) */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            aria-label="Sign out"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-300 transition-colors hover:border-copper-500 hover:text-copper-500 disabled:opacity-50"
          >
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>

          {/* Avatar dropdown — mobile only */}
          <div ref={menuRef} className="relative sm:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Account menu"
              aria-expanded={menuOpen}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-copper-500/15 text-sm font-semibold text-copper-600 transition-colors hover:bg-copper-500/25"
            >
              {avatarInitial}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 w-52 rounded-2xl border border-line bg-bg-1 py-1 shadow-lifted">
                <div className="border-b border-line px-4 py-2.5">
                  <p className="truncate text-xs text-ink-400">{userEmail}</p>
                </div>

                {/* Mobile locale switcher */}
                <div className="border-b border-line px-4 py-2.5">
                  <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-ink-500">
                    Language
                  </p>
                  <div className="flex gap-1">
                    {LOCALES.map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => switchLocale(code)}
                        className={[
                          "flex-1 rounded-lg py-1.5 text-[11px] font-mono uppercase tracking-wider transition-colors",
                          code === locale
                            ? "bg-ink text-bg-0"
                            : "text-ink-400 hover:bg-bg-3 hover:text-ink",
                        ].join(" ")}
                      >
                        {code.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <a
                  href={`/${locale}/dashboard/cards`}
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-bg-2"
                >
                  {locale === "de"
                    ? "Meine Karten"
                    : locale === "tr"
                      ? "Kartlarım"
                      : "My Cards"}
                </a>
                <a
                  href={`/${locale}/dashboard/contacts`}
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-ink-400 transition-colors hover:bg-bg-2 hover:text-ink"
                >
                  {locale === "de" ? "Kontakte" : locale === "tr" ? "Kişiler" : "Contacts"}
                </a>
                <a
                  href={`/${locale}/dashboard/inbox`}
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-ink-400 transition-colors hover:bg-bg-2 hover:text-ink"
                >
                  {locale === "de" ? "Posteingang" : locale === "tr" ? "Gelen Kutusu" : "Inbox"}
                </a>
                <a
                  href={`/${locale}/dashboard/playbooks`}
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-ink-400 transition-colors hover:bg-bg-2 hover:text-ink"
                >
                  Playbooks
                </a>
                <a
                  href={`/${locale}/dashboard/channels`}
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-ink-400 transition-colors hover:bg-bg-2 hover:text-ink"
                >
                  {locale === "de" ? "Kanäle" : locale === "tr" ? "Kanallar" : "Channels"}
                </a>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-ink-300 transition-colors hover:bg-bg-2 hover:text-copper-500 disabled:opacity-50"
                >
                  {loggingOut ? "Signing out…" : "Sign out"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
