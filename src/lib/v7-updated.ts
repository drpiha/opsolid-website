import { SITE_UPDATED_ISO } from "@/lib/constants";
import type { PageKey } from "@/lib/v7-routes";

/**
 * Last substantive change per page (prices, offers, legal text, new answers), as YYYY-MM-DD. Feeds the
 * sitemap lastmod and WebPage.dateModified, so it must stay true: bump a page only when its substance
 * changes, not for titles or punctuation. Pages not listed fall back to SITE_UPDATED_ISO (the v7 relaunch).
 */
const PAGE_UPDATED: Partial<Record<PageKey, string>> = {
  kompetenz: "2026-11-02", // Art. 4 answer and EUR-Lex sources
  agenten: "2026-11-02", // FAQ: what an AI phone assistant is
  blog: "2026-11-02", // CTA price corrected to ab 990 € with the 60-day credit
};

/** Journal posts revised after publication (slug → date); every other post uses its publish date. */
const POST_UPDATED: Record<string, string> = {
  "eu-ai-act-august-2026-omnibus-compliance": "2026-11-02", // Official Journal facts, EUR-Lex sources
};

export function pageUpdated(key: PageKey): string {
  return PAGE_UPDATED[key] ?? SITE_UPDATED_ISO;
}

export function postUpdated(slug: string, published: string): string {
  return POST_UPDATED[slug] ?? published;
}
