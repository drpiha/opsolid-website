import { LABEL, SITE_STR } from "@/content/v7/site";
import type { PageDef } from "@/content/v7/types";
import { href, type L3, type PageKey } from "@/lib/v7-routes";

export type Crumb = { name: string; path: string; key?: PageKey };

/** The visible breadcrumb of an inner page; JsonLd emits the identical BreadcrumbList from the same data. */
export function crumbsFor(page: PageDef, locale: L3): Crumb[] {
  return [
    { name: LABEL[locale].home, path: href("home", locale), key: "home" },
    ...page.crumbs.map((k) => ({ name: LABEL[locale][k], path: href(k, locale), key: k })),
    { name: page.crumb, path: href(page.key, locale), key: page.key },
  ];
}

/**
 * C crumbs: mono 13 px, "/" separators drawn by CSS (.wk-crumbs in sections.css), 44 px link targets. Rendered
 * inside the hero copy column (HeroStandard, PlainHero), so they carry no wrap of their own.
 */
export function Breadcrumbs({ crumbs, locale, className }: { crumbs: Crumb[]; locale: L3; className?: string }) {
  return (
    <nav aria-label={SITE_STR[locale].breadcrumb} className={className}>
      <ol className="wk-crumbs">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.path}>
              {last ? <span aria-current="page">{c.name}</span> : <a href={c.path}>{c.name}</a>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
