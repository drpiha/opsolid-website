"use client";

// =============================================================================
// CreateYoursBanner — M3 viral loop hook (network growth).
//
// A sticky bottom bar shown on the public card page to UNAUTHENTICATED
// visitors. The CTA carries the source slug as `?ref=<slug>`; the redeem
// route resolves the slug to the owning user's id, so the visitor's first
// signup attributes back to the card owner as a referral.
//
// Visibility rules:
//   - Hidden when `isOwner` is true (owners get the OwnerToolbar).
//   - Hidden when the visitor already has a Verso session — we detect by
//     pinging /api/auth/me (the existing cookie-based endpoint). On any
//     non-200, we show the bar.
//   - Hidden when the visitor previously dismissed it on this device (a
//     localStorage flag, scoped per slug so dismissing one card doesn't
//     suppress every other card's banner).
//
// Layout: fixed at the bottom of the viewport, ~56pt tall, copper-tinted
// surface so it reads as "platform attribution" rather than an ad. Clicking
// the CTA opens `https://opsolid.de/auth/signup?ref=<slug>` in the same
// tab — the magic-link flow stashes the ref in a cookie until post-auth.
// =============================================================================

import { useEffect, useState } from "react";

interface Props {
  slug: string;
  locale?: "de" | "en" | "tr";
}

const LABELS: Record<
  "de" | "en" | "tr",
  { tagline: string; cta: string; dismiss: string }
> = {
  de: {
    tagline: "Beeindruckt? Erstelle deine eigene Karte.",
    cta: "Karte erstellen",
    dismiss: "Schließen",
  },
  en: {
    tagline: "Like this? Create your own.",
    cta: "Create your card",
    dismiss: "Dismiss",
  },
  tr: {
    tagline: "Beğendin mi? Kendi kartını oluştur.",
    cta: "Kart oluştur",
    dismiss: "Kapat",
  },
};

const STORAGE_PREFIX = "verso.createYoursDismissed.";

export function CreateYoursBanner({ slug, locale = "de" }: Props) {
  const [show, setShow] = useState(false);
  const labels = LABELS[locale];

  useEffect(() => {
    let cancelled = false;

    // Skip when the visitor already dismissed this card's banner.
    try {
      const dismissed = window.localStorage.getItem(STORAGE_PREFIX + slug);
      if (dismissed === "1") return;
    } catch {
      /* localStorage might be disabled — fall through to the auth check */
    }

    // Check session. /api/auth/me returns 200 when logged in (any 2xx),
    // 401 otherwise. On any other failure we err on the side of showing
    // the banner (a logged-out visitor gets the CTA; a logged-in one
    // gets it suppressed).
    void fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (cancelled) return;
        if (res.status === 200) {
          setShow(false);
        } else {
          setShow(true);
        }
      })
      .catch(() => {
        if (!cancelled) setShow(true);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!show) return null;

  function dismiss() {
    setShow(false);
    try {
      window.localStorage.setItem(STORAGE_PREFIX + slug, "1");
    } catch {
      /* ignore */
    }
  }

  // Locale-prefixed signup route — the (auth) group lives under [locale].
  // The shared SignupClient stashes the `ref` param so the post-auth handler
  // can call /api/v1/referrals/redeem on the user's behalf.
  const signupHref = `/${locale}/signup?ref=${encodeURIComponent(slug)}`;

  return (
    <div
      role="region"
      aria-label={labels.tagline}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg-1/95 backdrop-blur-sm"
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 8px)",
      }}
    >
      <div className="mx-auto flex max-w-[640px] items-center gap-3 px-4 py-3">
        <p className="flex-1 text-sm leading-tight text-ink-200">
          {labels.tagline}
        </p>
        <a
          href={signupHref}
          className="inline-flex items-center justify-center rounded-full bg-copper-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-copper-600"
        >
          {labels.cta}
        </a>
        <button
          type="button"
          onClick={dismiss}
          aria-label={labels.dismiss}
          className="rounded-full p-2 text-ink-400 transition hover:text-ink-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
