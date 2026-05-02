"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent } from "@/lib/consent";
import { useLocale } from "@/context/LocaleContext";

export function ConsentBanner() {
  const { t } = useLocale();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (getConsent() === null) setShow(true);
  }, []);

  if (!show) return null;

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
        <a href="/datenschutz" className="underline hover:text-ink">
          {t.consent.privacyLink}
        </a>
      </p>
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          onClick={reject}
          type="button"
          className="btn-ghost min-h-[44px]"
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
