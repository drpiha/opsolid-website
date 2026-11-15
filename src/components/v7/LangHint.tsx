"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HINT } from "@/content/v7/site";
import { href } from "@/lib/v7-routes";
import { wrap } from "./ui";

const KEY = "opsolid-lang-hint";

/**
 * Small dismissible line on the German home only: "This page is also available in English / Türkçe".
 * Shown when the middleware passes x-opsolid-suggest (en | tr). Never a redirect. The dismissal lives in
 * sessionStorage (per-visitor convenience); the line renders without it.
 */
export function LangHint({ suggest }: { suggest: "en" | "tr" }) {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(KEY) === "1") setGone(true);
    } catch {
      /* storage unavailable */
    }
  }, []);
  if (gone) return null;
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
          <Link href={href("home", suggest)} hrefLang={t.lang}>
            {t.link}
          </Link>
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
