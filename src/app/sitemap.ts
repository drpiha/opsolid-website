import { MetadataRoute } from "next";
import { SITE_UPDATED_ISO } from "@/lib/constants";
import { content as en } from "@/content/en";
import { L3_LOCALES, PAGE_KEYS, absUrl, alternates } from "@/lib/v7-routes";

/**
 * Sitemap of the v7 marketing site: every page key except the legal pages (impressum, privacy)
 * × de/en/tr, plus the blog posts. Public URLs only (localized slugs, the German home is
 * https://opsolid.de/), each with reciprocal hreflang alternates. Google ignores
 * priority/changefreq, so only a real lastModified is emitted. Redirecting URLs never appear here.
 *
 * Blog posts: the same post slug exists in all three locales (key "blog", sub "/<slug>").
 */
const EXCLUDED = new Set(["impressum", "privacy"]);

export default function sitemap(): MetadataRoute.Sitemap {
  const stamp = new Date(SITE_UPDATED_ISO + "T00:00:00Z");
  const entries: MetadataRoute.Sitemap = [];

  for (const key of PAGE_KEYS) {
    if (EXCLUDED.has(key)) continue;
    const languages = alternates(key);
    for (const loc of L3_LOCALES) {
      entries.push({ url: absUrl(key, loc), lastModified: stamp, alternates: { languages } });
    }
  }

  for (const post of en.blog.posts) {
    const sub = `/${post.slug}`;
    const languages = alternates("blog", sub);
    const modified = new Date(post.date + "T00:00:00Z");
    for (const loc of L3_LOCALES) {
      entries.push({ url: absUrl("blog", loc, sub), lastModified: modified, alternates: { languages } });
    }
  }

  return entries;
}
