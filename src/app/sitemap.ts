import { MetadataRoute } from "next";
import { SITE_CONFIG, SITE_UPDATED_ISO } from "@/lib/constants";
import { PUBLIC_LOCALES } from "@/lib/i18n";
import { content as en } from "@/content/en";

/** Public marketing paths. Google ignores priority/changefreq, so only real lastModified is emitted. */
const STATIC_PAGES: string[] = [
  "",
  "/agents",
  "/websites",
  "/leistungen",
  "/ai-automation-check",
  "/ki-beratung",
  "/prozessautomatisierung",
  "/microsoft-365-automatisierung",
  "/interne-tools",
  "/ki-schulungen",
  "/ueber-mich",
  "/contact",
  "/blog",
  "/opso",
  "/products/kutasia",
];

function buildLanguageMap(path: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const loc of PUBLIC_LOCALES) map[loc] = `${SITE_CONFIG.url}/${loc}${path}`;
  // x-default points at German — primary target market is DE-speaking SMEs.
  map["x-default"] = `${SITE_CONFIG.url}/de${path}`;
  return map;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const stamp = new Date(SITE_UPDATED_ISO + "T00:00:00Z");
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PAGES) {
    const languages = buildLanguageMap(path);
    for (const loc of PUBLIC_LOCALES) {
      entries.push({ url: `${SITE_CONFIG.url}/${loc}${path}`, lastModified: stamp, alternates: { languages } });
    }
  }

  for (const post of en.blog.posts) {
    const path = `/blog/${post.slug}`;
    const languages = buildLanguageMap(path);
    for (const loc of PUBLIC_LOCALES) {
      entries.push({ url: `${SITE_CONFIG.url}/${loc}${path}`, lastModified: new Date(post.date + "T00:00:00Z"), alternates: { languages } });
    }
  }

  return entries;
}
