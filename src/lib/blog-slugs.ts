import { SLUG, type L3 } from "./v7-routes";

/**
 * Journal posts whose public slug differs per locale (German slug for the German version, and so on), one row
 * per post. The English slug is the post's id: its article body in src/content/blog is keyed by it. Posts not
 * listed here (the seven posts published before 2026-11-14) use the same slug in all three locales.
 * Pure and dependency-free, so the middleware (edge) and the client header can use it.
 */
export const LOCALIZED_POSTS: ReadonlyArray<Readonly<Record<L3, string>>> = [
  { de: "was-kostet-eine-ki-schulung", en: "what-does-ai-training-cost", tr: "yapay-zeka-egitimi-ne-kadar-tutar" },
  { de: "ki-schulung-pflicht-ai-act-artikel-4", en: "is-ai-training-mandatory-ai-act-article-4", tr: "yapay-zeka-egitimi-zorunlu-mu-ai-act-madde-4" },
];

function row(slug: string): Readonly<Record<L3, string>> | undefined {
  return LOCALIZED_POSTS.find((r) => r.de === slug || r.en === slug || r.tr === slug);
}

/** The slug of the same post in `locale` (any locale's slug in, that locale's slug out); unknown slugs pass through. */
export function postSlugIn(slug: string, locale: L3): string {
  return row(slug)?.[locale] ?? slug;
}

/** The `sub` path of one post per locale ("/was-kostet-eine-ki-schulung" for de), for hreflang and the sitemap. */
export function postSubs(slug: string): Record<L3, string> {
  return { de: `/${postSlugIn(slug, "de")}`, en: `/${postSlugIn(slug, "en")}`, tr: `/${postSlugIn(slug, "tr")}` };
}

/** A blog `sub` path ("/was-kostet-eine-ki-schulung") as the same post in another locale; other paths pass through. */
export function postSubIn(sub: string, locale: L3): string {
  const m = /^\/([^/]+)$/.exec(sub);
  return m ? `/${postSlugIn(m[1], locale)}` : sub;
}

/**
 * Middleware: a locale-stripped path to a post under another locale's slug (/en + "/blog/was-kostet-eine-ki-schulung")
 * → this locale's own post path ("/blog/what-does-ai-training-cost") for a 301. Null for everything else.
 */
export function foreignPostTarget(locale: L3, rest: string): string | null {
  const base = SLUG.blog[locale];
  const m = new RegExp(`^${base}/([^/]+)/?$`).exec(rest.split("?")[0].split("#")[0]);
  if (!m) return null;
  const own = postSlugIn(m[1], locale);
  return own === m[1] ? null : `${base}/${own}`;
}
