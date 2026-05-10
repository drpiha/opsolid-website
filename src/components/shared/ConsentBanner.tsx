"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getConsent, setConsent } from "@/lib/consent";
import { useLocale } from "@/context/LocaleContext";

export function ConsentBanner() {
  const { t, locale } = useLocale();
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  // Suppress on chrome-less render targets that are screenshot or
  // embedded in mobile WebView previews. The banner has no UX value
  // there and would otherwise bake into generated PNG previews.
  const isPreviewRoute =
    pathname?.startsWith("/dev/template-preview/") ||
    pathname?.startsWith("/preview/template/");

  useEffect(() => {
    if (isPreviewRoute) return;
    if (getConsent() === null) setShow(true);
  }, [isPreviewRoute]);

  if (isPreviewRoute || !show) return null;

  const accept = () => {
    setConsent(true);
    setShow(false);
  };
  const reject = () => {
    setConsent(false);
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="consent-title"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl border border-line bg-bg-0/95 p-5 shadow-2xl backdrop-blur-md sm:inset-x-auto sm:right-3"
      style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      <h2 id="consent-title" className="font-serif text-base text-ink">
        {t.consent.title}
      </h2>
      <p className="mt-2 text-sm text-ink/70">{t.consent.body}</p>
      <p className="mt-2 text-xs text-ink/50">
        <a href={`/${locale}/privacy`} className="underline hover:text-ink">
          {t.consent.privacyLink}
        </a>
      </p>
      {/*
        TDDDG § 25 + DSGVO equal-prominence requirement: reject and accept
        must have visually equivalent weight. Both buttons are solid-filled
        with the same height and padding; only the colour tone differs
        (neutral vs primary). Do not regress to `btn-ghost` for reject —
        German DPAs treat low-contrast reject buttons as a dark pattern.
      */}
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          onClick={reject}
          type="button"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-neutral-900 px-5 text-sm font-medium text-neutral-50 transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
        >
          {t.consent.reject}
        </button>
        <button
          onClick={accept}
          type="button"
          className="btn-primary min-h-[44px]"
        >
          {t.consent.accept}
        </button>
      </div>
    </div>
  );
}
