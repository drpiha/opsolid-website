import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { LOCALES } from "@/lib/i18n";
import { content as en } from "@/content/en";

type PageDef = { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number };

const STATIC_PAGES: PageDef[] = [
  { path: "", changeFrequency: "monthly", priority: 1 },
  { path: "/solutions", changeFrequency: "monthly", priority: 0.9 },
  { path: "/products", changeFrequency: "monthly", priority: 0.9 },
  { path: "/products/kutasia", changeFrequency: "monthly", priority: 0.85 },
  { path: "/use-cases", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/impressum", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
];

const BLOG_SLUGS = en.blog.posts.map((p) => p.slug);

function buildLanguageMap(path: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const loc of LOCALES) map[loc] = `${SITE_CONFIG.url}/${loc}${path}`;
  map["x-default"] = `${SITE_CONFIG.url}/en${path}`;
  return map;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const page of STATIC_PAGES) {
    const languages = buildLanguageMap(page.path);
    for (const loc of LOCALES) {
      entries.push({
        url: `${SITE_CONFIG.url}/${loc}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages },
      });
    }
  }

  for (const slug of BLOG_SLUGS) {
    const path = `/blog/${slug}`;
    const languages = buildLanguageMap(path);
    for (const loc of LOCALES) {
      entries.push({
        url: `${SITE_CONFIG.url}/${loc}${path}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  return entries;
}
