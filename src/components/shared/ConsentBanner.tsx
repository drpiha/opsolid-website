"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getConsent, setConsent } from "@/lib/consent";
import { useLocaleBase } from "@/context/LocaleContext";
import { CONSENT_COPY } from "@/content/consent-copy";

export function ConsentBanner() {
  const { locale } = useLocaleBase();
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  // The banner is mounted in the root layout, outside the [locale] provider,
  // so the context falls back to English. The URL's first segment is the
  // visitor's language: use it, otherwise /de pages show an English banner.
  const segment = pathname?.split("/")[1] ?? "";
  const pathLocale = Object.prototype.hasOwnProperty.call(CONSENT_COPY, segment) ? segment : null;
  const copy = CONSENT_COPY[pathLocale ?? locale] ?? CONSENT_COPY.en;
  const privacyLocale = pathLocale ?? locale;

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
        {copy.title}
      </h2>
      <p className="mt-2 text-sm text-ink/70">{copy.body}</p>
      <p className="mt-2 text-xs text-ink/50">
        <a href={`/${privacyLocale}/privacy`} className="underline hover:text-ink">
          {copy.privacyLink}
        </a>
      </p>
      {/*
        TDDDG § 25 + DSGVO equal-prominence requirement: reject and accept
        must have visually equivalent weight. Both buttons share the same
        shape, height, padding and type size; only the colour tone differs
        (neutral vs primary). Do not regress to `btn-ghost` for reject —
        German DPAs treat low-contrast reject buttons as a dark pattern.
      */}
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          onClick={reject}
          type="button"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-neutral-900 px-5 text-sm font-medium text-neutral-50 transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
        >
          {copy.reject}
        </button>
        <button
          onClick={accept}
          type="button"
          className="btn-primary inline-flex min-h-[44px] items-center justify-center rounded-full px-5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
        >
          {copy.accept}
        </button>
      </div>
    </div>
  );
}
