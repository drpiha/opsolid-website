import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { PUBLIC_LOCALES } from "@/lib/i18n";
import { content as en } from "@/content/en";

type PageDef = { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number };

const STATIC_PAGES: PageDef[] = [
  // Consulting positioning — primary funnel
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/leistungen", changeFrequency: "weekly", priority: 0.9 },
  { path: "/ai-automation-check", changeFrequency: "weekly", priority: 0.95 },

  // Sub-services (under /leistungen, but flat URLs)
  { path: "/ki-beratung", changeFrequency: "monthly", priority: 0.8 },
  { path: "/prozessautomatisierung", changeFrequency: "monthly", priority: 0.8 },
  { path: "/microsoft-365-automatisierung", changeFrequency: "monthly", priority: 0.8 },
  { path: "/interne-tools", changeFrequency: "monthly", priority: 0.8 },
  { path: "/ki-schulungen", changeFrequency: "monthly", priority: 0.8 },

  { path: "/ueber-mich", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },

  // Legacy product pages — still reachable but de-prioritised in the
  // consulting positioning. Kept in the sitemap so Google does not drop
  // existing indexed URLs abruptly; will be folded into case studies later.
  { path: "/products/voice-agent", changeFrequency: "monthly", priority: 0.55 },
  { path: "/products/digital-card", changeFrequency: "monthly", priority: 0.55 },
  { path: "/products/kutasia", changeFrequency: "monthly", priority: 0.5 },

  // Legal
  { path: "/impressum", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
];

const BLOG_SLUGS = en.blog.posts.map((p) => p.slug);

function buildLanguageMap(path: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const loc of PUBLIC_LOCALES) map[loc] = `${SITE_CONFIG.url}/${loc}${path}`;
  // x-default points at German — primary target market is DE-speaking SMEs.
  map["x-default"] = `${SITE_CONFIG.url}/de${path}`;
  return map;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const page of STATIC_PAGES) {
    const languages = buildLanguageMap(page.path);
    for (const loc of PUBLIC_LOCALES) {
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
    for (const loc of PUBLIC_LOCALES) {
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
