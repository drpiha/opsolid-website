import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { PUBLIC_LOCALES } from "@/lib/i18n";
import { content as en } from "@/content/en";

type PageDef = { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number };

const STATIC_PAGES: PageDef[] = [
  // Top-level
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/products", changeFrequency: "weekly", priority: 0.95 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.95 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },

  // Product pages — flagships
  { path: "/products/voice-agent", changeFrequency: "monthly", priority: 0.9 },
  { path: "/products/digital-card", changeFrequency: "monthly", priority: 0.9 },
  { path: "/products/kutasia", changeFrequency: "monthly", priority: 0.85 },

  // Product pages — agents & services
  { path: "/products/chatbot-agent", changeFrequency: "monthly", priority: 0.85 },
  { path: "/products/whatsapp-agent", changeFrequency: "monthly", priority: 0.85 },
  { path: "/products/booking-agent", changeFrequency: "monthly", priority: 0.85 },
  { path: "/products/email-agent", changeFrequency: "monthly", priority: 0.85 },
  { path: "/products/lead-qualifier-agent", changeFrequency: "monthly", priority: 0.85 },
  { path: "/products/custom-automation", changeFrequency: "monthly", priority: 0.85 },

  // Legal
  { path: "/impressum", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
];

const BLOG_SLUGS = en.blog.posts.map((p) => p.slug);

function buildLanguageMap(path: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const loc of PUBLIC_LOCALES) map[loc] = `${SITE_CONFIG.url}/${loc}${path}`;
  map["x-default"] = `${SITE_CONFIG.url}/en${path}`;
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
