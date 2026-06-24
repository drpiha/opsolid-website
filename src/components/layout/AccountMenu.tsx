"use client";

// =============================================================================
// AccountMenu — the desktop "account corner" of the marketing header.
//
// Auth-aware (state comes from the header's single useAuthState fetch):
//   - anon   → a "Sign in" link
//   - authed → a dropdown: My cards / Admin (admins only) / Sign out
//
// Keeps the product/marketing nav and the account/login surface visually
// separate, which is the whole point of the IA change: "OpSo Smart" is a
// product page; signing in / My cards is a personal-account corner.
// =============================================================================

import { useState, useRef, useEffect } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { useLocale } from "@/context/LocaleContext";
import type { AuthStatus, AuthUser } from "./useAuthState";

interface Props {
  status: AuthStatus;
  user: AuthUser | null;
  onLogout: () => void;
  loggingOut: boolean;
}

export function AccountMenu({ status, user, onLogout, loggingOut }: Props) {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const L = (de: string, en: string, tr: string) =>
    locale === "en" ? en : locale === "tr" ? tr : de;

  // Reserve the slot while resolving so the header doesn't shift when auth lands.
  if (status === "loading") {
    return (
      <span className="os-nav-link" style={{ opacity: 0 }} aria-hidden="true">
        ·
      </span>
    );
  }

  if (status === "anon") {
    return (
      <Link href="/login" className="os-nav-link">
        {L("Anmelden", "Sign in", "Giriş")}
      </Link>
    );
  }

  const label = user?.name?.trim() || L("Konto", "Account", "Hesabım");
  const isAdmin = user?.role === "ADMIN";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="os-nav-link inline-flex items-center gap-1.5"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="max-w-[140px] truncate">{label}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden="true"
          className="transition-transform"
          style={{ transform: open ? "rotate(180deg)" : undefined }}
        >
          <path
            d="M2 3.5 5 6.5 8 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-50 min-w-[190px] overflow-hidden rounded-xl border border-line bg-bg-1 py-1 shadow-lifted"
        >
          <Link
            href="/dashboard/cards"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-ink transition-colors hover:bg-bg-2"
          >
            {L("Meine Karten", "My cards", "Kartlarım")}
          </Link>
          {isAdmin && (
            <Link
              href="/dashboard/admin"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-ink transition-colors hover:bg-bg-2"
            >
              Admin
            </Link>
          )}
          <div className="my-1 border-t border-line" />
          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            disabled={loggingOut}
            className="block w-full px-4 py-2.5 text-left text-sm text-ink-300 transition-colors hover:bg-bg-2 hover:text-copper-500 disabled:opacity-50"
          >
            {loggingOut ? "…" : L("Abmelden", "Sign out", "Çıkış")}
          </button>
        </div>
      )}
    </div>
  );
}
