import { MetadataRoute } from "next";
import { content as en } from "@/content/en";
import { L3_LOCALES, PAGE_KEYS, absUrl, alternates } from "@/lib/v7-routes";
import { pageUpdated, postUpdated } from "@/lib/v7-updated";

/**
 * Sitemap of the v7 marketing site: every page key except the legal pages (impressum, privacy)
 * × de/en/tr, plus the blog posts. Public URLs only (localized slugs, the German home is
 * https://opsolid.de/), each with reciprocal hreflang alternates. Google ignores
 * priority/changefreq, so only a real lastModified is emitted: the page's last substantive change
 * (src/lib/v7-updated.ts), the same date as its WebPage.dateModified. Redirecting URLs never appear here.
 *
 * Blog posts: the same post slug exists in all three locales (key "blog", sub "/<slug>").
 */
const EXCLUDED = new Set(["impressum", "privacy"]);

const day = (iso: string) => new Date(iso + "T00:00:00Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const key of PAGE_KEYS) {
    if (EXCLUDED.has(key)) continue;
    const languages = alternates(key);
    const lastModified = day(pageUpdated(key));
    for (const loc of L3_LOCALES) {
      entries.push({ url: absUrl(key, loc), lastModified, alternates: { languages } });
    }
  }

  for (const post of en.blog.posts) {
    const sub = `/${post.slug}`;
    const languages = alternates("blog", sub);
    const lastModified = day(postUpdated(post.slug, post.date));
    for (const loc of L3_LOCALES) {
      entries.push({ url: absUrl("blog", loc, sub), lastModified, alternates: { languages } });
    }
  }

  return entries;
}
