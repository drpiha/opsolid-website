"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LANG_NAME, LANG_SHORT, SITE_STR } from "@/content/v7/site";
import { postSubIn } from "@/lib/blog-slugs";
import { href, keyForPublicPath, L3_LOCALES, type L3 } from "@/lib/v7-routes";
import { rememberLocale } from "./locale-cookie";

/**
 * Language switch (DE / EN / TR) as real links to the same page in each locale. `publicPath` (x-public-path) is
 * the hydration-safe start; after mount and on every client navigation window.location is the source, because
 * usePathname() shows the internal path under the middleware rewrites. A journal post switches to its own slug
 * in the other locale. A click stores the explicit choice in the language cookie.
 */
export function LangLinks({ locale, publicPath, className }: { locale: L3; publicPath: string; className?: string }) {
  const pathname = usePathname();
  const [path, setPath] = useState(publicPath);
  useEffect(() => setPath(window.location.pathname), [pathname]);

  const here = keyForPublicPath(path);
  const pageLocale = here?.locale ?? locale;
  return (
    <div role="group" aria-label={SITE_STR[locale].langLabel} className={className}>
      {L3_LOCALES.map((l) => {
        const target = here ? href(here.key, l, { sub: here.key === "blog" ? postSubIn(here.sub, l) : here.sub }) : href("home", l);
        return (
          <a
            key={l}
            href={target}
            hrefLang={l}
            lang={l}
            // The accessible name is the visible "DE"/"EN"/"TR" (WCAG 2.5.3 label in name); the full name is a tooltip.
            title={LANG_NAME[l]}
            aria-current={l === pageLocale ? "true" : undefined}
            onClick={() => rememberLocale(l)}
          >
            {LANG_SHORT[l]}
          </a>
        );
      })}
    </div>
  );
}
