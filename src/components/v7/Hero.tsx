import type { PageDef } from "@/content/v7/types";
import type { L3 } from "@/lib/v7-routes";
import { LinkTo } from "./LinkTo";
import { MediaFigure } from "./MediaFigure";
import { btnPrimary, linkDeep, wrap } from "./ui";

const arrow = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 8h11M9 3.5L13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

/**
 * Joins the three H1 parts with exactly one space between words, none before punctuation (. , : ; ! ? …)
 * and no doubled spaces, whatever spacing the content strings carry at their seams.
 */
export function h1Parts([pre, em, post]: [string, string, string]): [string, string, string] {
  const a = pre.trim();
  const b = em.trim();
  const c = post.trim();
  const before = a + (a && b ? " " : "");
  const gap = (before || b) && c && !/^[.,:;!?…]/.test(c) ? " " : "";
  return [before, b, gap + c];
}

/** Page hero: eyebrow with copper rule, H1 [pre, *emphasis*, post], lede, CTAs, fact line, optional figure. */
export function Hero({ hero, locale, home }: { hero: PageDef["hero"]; locale: L3; home?: boolean }) {
  const [pre, em, post] = h1Parts(hero.h1);
  // Only the figure column rises in. The eyebrow, H1, lede, CTAs and the fact line are visible on first paint
  // (no faint mono label in a screenshot, and the LCP candidates are never delayed).
  const rise = (ms: number) => ({ ["--d" as string]: `${ms}ms` });
  return (
    <section aria-labelledby="hero-h" className={`${wrap} pb-4 pt-10 md:pt-20`}>
      <div className="grid gap-x-8 gap-y-8 md:grid-cols-12 md:gap-y-14 lg:items-center">
        <div className={hero.media ? "md:col-span-8 lg:col-span-7" : "md:col-span-10"}>
          <p className="f-mono flex max-w-[64ch] items-start gap-3 text-[12px] uppercase leading-[1.6] text-[#8A4524] md:text-[13px]">
            <span aria-hidden="true" className="mt-[0.8em] h-px w-8 shrink-0 bg-[#B5623A]" />
            {hero.eyebrow}
          </p>
          <h1
            id="hero-h"
            className={`f-display mt-8 font-light leading-[1] tracking-[-0.025em] text-[#16191D] text-[clamp(2.75rem,12.5vw,3.4rem)] md:leading-[1.03] md:tracking-[-0.02em] ${
              home ? "md:text-[clamp(2.5rem,6.8vw,6.5rem)]" : "md:text-[clamp(2.25rem,5.4vw,5.25rem)]"
            }`}
          >
            {pre}
            {em && <em className="font-light italic text-[#B5623A]">{em}</em>}
            {post}
          </h1>
          <p className="v7-lede mt-9 max-w-[38rem] text-[18px] leading-[1.6] text-[#16191D] md:text-[20px]">
            {hero.lede}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            <LinkTo link={hero.primary} locale={locale} className={btnPrimary}>
              {hero.primary.label}
              {arrow}
            </LinkTo>
            {hero.secondary && (
              <LinkTo link={hero.secondary} locale={locale} className={linkDeep}>
                {hero.secondary.label}
                <span aria-hidden="true">→</span>
              </LinkTo>
            )}
          </div>
        </div>

        {hero.media && (
          <div className="v7-rise md:col-span-4 lg:col-span-5" style={rise(200)}>
            <MediaFigure media={hero.media} locale={locale} priority className="mx-auto max-w-[400px] md:max-w-none lg:ml-auto lg:max-w-[480px]" />
          </div>
        )}
      </div>

      {hero.facts && hero.facts.length > 0 && (
        <p className="f-mono mt-16 border-t border-[#E3DCD1] pt-5 text-[12px] leading-[1.9] text-[#6B665F] md:mt-24 md:text-[13px]">
          {hero.facts.map((f, i) => (
            <span key={f}>
              {i > 0 && <span className="mx-1.5 text-[#8A4524]">·</span>}
              {f}
            </span>
          ))}
        </p>
      )}
    </section>
  );
}
