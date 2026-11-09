import { SITE_UPDATED_ISO } from "@/lib/constants";
import type { PageKey } from "@/lib/v7-routes";

/**
 * Last substantive change per page (prices, offers, legal text, new answers), as YYYY-MM-DD. Feeds the
 * sitemap lastmod and WebPage.dateModified, so it must stay true: bump a page only when its substance
 * changes, not for titles or punctuation. Pages not listed fall back to SITE_UPDATED_ISO (the v7 relaunch).
 */
const PAGE_UPDATED: Partial<Record<PageKey, string>> = {
  // 2026-11-09: OpSo Android app public on Google Play (EU/EEA, Switzerland, UK), links and status updated; before that
  // 2026-11-07: iPhone app in the App Store; the status changed on the OpSo page and on Home, About and Projekte.
  opso: "2026-11-09",
  // 2026-11-06 (evening): trainings lead. Home opens with the training ledger (team price, per-person arithmetic,
  // hours), the Schulungen hub names the organiser model and live-only delivery, the KI-Check is framed
  // "Erst analysieren, dann schulen" and its report ends with a training recommendation; the 60-day credit applies
  // to a training or a pilot. About and Contact follow the new order.
  home: "2026-11-09",
  schulungen: "2026-11-06",
  check: "2026-11-06",
  beratung: "2026-11-06",
  ueber: "2026-11-09",
  kontakt: "2026-11-06",
  // 2026-11-06: per-person arithmetic in the price answers and the hours of a half day and a day
  kompetenz: "2026-11-06",
  copilot: "2026-11-06",
  // 2026-11-04: written, meeting-free KI-Check at a fixed 990 € (questionnaire, report, optional evening call)
  prozess: "2026-11-07",
  m365: "2026-11-04",
  agenten: "2026-11-04",
  anwendungen: "2026-11-04",
  projekte: "2026-11-09",
  blog: "2026-11-04", // CTA: KI-Check 990 € with the 60-day credit
  trainer: "2026-11-06", // no trial session: seven-day reply, trainer pool, conversation with a live demo, first assignment paid
};

export function pageUpdated(key: PageKey): string {
  return PAGE_UPDATED[key] ?? SITE_UPDATED_ISO;
}

/** A journal post's last substantive revision: its `modified` date (set in the post list when the text changes), else the publish date. */
export function postUpdated(post: { date: string; modified?: string }): string {
  return post.modified ?? post.date;
}
