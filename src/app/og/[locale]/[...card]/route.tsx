import { BLOG, BLOG_T } from "@/components/v7/BlogList";
import { pageSet } from "@/content/v7/pages";
import type { PageDef } from "@/content/v7/types";
import { LABEL } from "@/content/v7/site";
import { renderPageCard } from "@/lib/og-card";
import { OG_TAGLINE } from "@/lib/seo-v4";
import { isL3, type L3, type PageKey } from "@/lib/v7-routes";

/**
 * Share card per marketing page and journal post: /og/<locale>/<key>.png and /og/<locale>/blog/<slug>.png
 * (the ".png" keeps the path out of the locale middleware). seo-v7.ts names it as og:image and twitter:image.
 * The card shows the page's own headline, so a shared link previews the page it opens.
 */
export const runtime = "nodejs";
// Same pre-render workaround as src/app/[locale]/opengraph-image.tsx.
export const dynamic = "force-dynamic";

/**
 * The hero headline as the card title. Parts that the hero sets on their own line (a part ending a sentence,
 * "Erst der Prozess." + "Dann die KI") keep their line break; parts with their own spacing join as written.
 */
function headline(h1: PageDef["hero"]["h1"]): string {
  return h1.reduce((s, p) => (s && p && !/\s$/.test(s) && !/^\s/.test(p) ? `${s}${/[.?!]$/.test(s) ? "\n" : " "}${p}` : s + p), "").trim();
}

function card(locale: L3, parts: string[]): { label: string; title: string } | null {
  const [key, slug, ...rest] = parts;
  if (rest.length || slug === "") return null;
  if (key === "blog") {
    if (slug === undefined) return { label: LABEL[locale].blog, title: BLOG_T[locale].h1.join(" ") };
    const post = BLOG[locale].posts.find((p) => p.slug === slug);
    return post ? { label: LABEL[locale].blog, title: post.title } : null;
  }
  const set = slug === undefined ? pageSet(key as PageKey) : undefined;
  if (!set) return null;
  const page = set[locale];
  return { label: page.key === "home" ? OG_TAGLINE[locale] : LABEL[locale][page.key], title: headline(page.hero.h1) };
}

export async function GET(_req: Request, { params }: { params: { locale: string; card: string[] } }) {
  const last = params.card.at(-1) ?? "";
  const c = isL3(params.locale) && last.endsWith(".png") ? card(params.locale, [...params.card.slice(0, -1), last.slice(0, -4)]) : null;
  if (!c) return new Response("Not found", { status: 404 });
  return renderPageCard({ locale: params.locale as L3, ...c });
}
