import { SITE_UPDATED_ISO } from "@/lib/constants";
import type { PageKey } from "@/lib/v7-routes";

/**
 * Last substantive change per page (prices, offers, legal text, new answers), as YYYY-MM-DD. Feeds the
 * sitemap lastmod and WebPage.dateModified, so it must stay true: bump a page only when its substance
 * changes, not for titles or punctuation. Pages not listed fall back to SITE_UPDATED_ISO (the v7 relaunch).
 */
const PAGE_UPDATED: Partial<Record<PageKey, string>> = {
  kompetenz: "2026-11-02", // Art. 4 answer and EUR-Lex sources
  // 2026-11-04: written, meeting-free KI-Check at a fixed 990 € (questionnaire, report, optional evening call)
  check: "2026-11-04",
  home: "2026-11-04",
  beratung: "2026-11-04",
  prozess: "2026-11-04",
  m365: "2026-11-04",
  agenten: "2026-11-04",
  anwendungen: "2026-11-04",
  schulungen: "2026-11-04",
  projekte: "2026-11-04",
  ueber: "2026-11-04",
  blog: "2026-11-04", // CTA: KI-Check 990 € with the 60-day credit
  trainer: "2026-11-04", // trainer pool step, paid trial before the first assignment, seven-day reply
  kontakt: "2026-11-04", // trainer application fields, seven-day reply for applications
};

export function pageUpdated(key: PageKey): string {
  return PAGE_UPDATED[key] ?? SITE_UPDATED_ISO;
}

/** A journal post's last substantive revision: its `modified` date (set in the post list when the text changes), else the publish date. */
export function postUpdated(post: { date: string; modified?: string }): string {
  return post.modified ?? post.date;
}
