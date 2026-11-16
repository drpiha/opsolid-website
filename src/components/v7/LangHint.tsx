"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HINT } from "@/content/v7/site";
import { href, keyForPublicPath } from "@/lib/v7-routes";
import { wrap } from "./ui";

const KEY = "opsolid-lang-hint";

/**
 * Small dismissible line on the German home only: "This page is also available in English / Türkçe".
 * Shown when the middleware passes x-opsolid-suggest (en | tr). Never a redirect. The dismissal lives in
 * sessionStorage (per-visitor convenience); the line renders without it. The header lives in the persistent
 * locale layout, so the hint hides itself after a client navigation away from the German home.
 */
export function LangHint({ suggest }: { suggest: "en" | "tr" }) {
  const pathname = usePathname();
  const [gone, setGone] = useState(false);
  const [away, setAway] = useState(false);
  useEffect(() => {
    const here = keyForPublicPath(window.location.pathname);
    setAway(!(here?.key === "home" && here.locale === "de" && !here.sub));
  }, [pathname]);
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(KEY) === "1") setGone(true);
    } catch {
      /* storage unavailable */
    }
  }, []);
  if (gone || away) return null;
  const t = HINT[suggest];
  const close = () => {
    setGone(true);
    try {
      window.sessionStorage.setItem(KEY, "1");
    } catch {
      /* storage unavailable */
    }
  };
  return (
    <div className="wk-langhint" lang={t.lang} data-nosnippet>
      <div className={`${wrap} wk-langhint-row`}>
        <p>
          {t.text}{" "}
          <a href={href("home", suggest)} hrefLang={t.lang}>
            {t.link}
          </a>
        </p>
        <button type="button" onClick={close} aria-label={t.dismiss}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
