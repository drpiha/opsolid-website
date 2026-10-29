import Link from "next/link";
import { LABEL, SITE_STR } from "@/content/v7/site";
import type { PageDef } from "@/content/v7/types";
import { href, type L3, type PageKey } from "@/lib/v7-routes";
import { wrap } from "./ui";

export type Crumb = { name: string; path: string; key?: PageKey };

/** The visible breadcrumb of an inner page; JsonLd emits the identical BreadcrumbList from the same data. */
export function crumbsFor(page: PageDef, locale: L3): Crumb[] {
  return [
    { name: LABEL[locale].home, path: href("home", locale), key: "home" },
    ...page.crumbs.map((k) => ({ name: LABEL[locale][k], path: href(k, locale), key: k })),
    { name: page.crumb, path: href(page.key, locale), key: page.key },
  ];
}

export function Breadcrumbs({ crumbs, locale }: { crumbs: Crumb[]; locale: L3 }) {
  return (
    <nav aria-label={SITE_STR[locale].breadcrumb} className={`${wrap} pt-3 md:pt-5`}>
      <ol className="f-mono flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] uppercase leading-[1.7] text-[#6B665F]">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-[#16191D]">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="inline-flex min-h-[44px] items-center underline decoration-[#B5623A]/40 underline-offset-4 hover:text-[#16191D] hover:decoration-[#8A4524]">
                  {c.name}
                </Link>
              )}
              {!last && (
                <span aria-hidden="true" className="text-[#B5623A]">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
