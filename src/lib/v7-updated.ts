import { SITE_UPDATED_ISO } from "@/lib/constants";
import type { PageKey } from "@/lib/v7-routes";

/**
 * Last substantive change per page (prices, offers, legal text, new answers), as YYYY-MM-DD. Feeds the
 * sitemap lastmod and WebPage.dateModified, so it must stay true: bump a page only when its substance
 * changes, not for titles or punctuation. Pages not listed fall back to SITE_UPDATED_ISO (the v7 relaunch).
 */
const PAGE_UPDATED: Partial<Record<PageKey, string>> = {
  // 2026-11-15: design C "Werkstatt" (owner decision 81). New pages Produkte (decision 72) and the KI-Agenten course
  // page (decision 73); the consulting page "KI-Assistenten" moved to /ki-beratung/ki-assistenten; OpSo without the
  // NFC card price (decision 78); contact reply "innerhalb von 2 Werktagen" (decision 79); Home and the Schulungen hub
  // rebuilt; the trainer page without "vermitteln"; KI-Check price note and credit under the hero facts; copilot and
  // prozess without "geprüft".
  // 2026-11-16 (design review R2): Produkte names Kutasia only in the hero index (no section); the KI-Agenten course page
  // has its own Ablauf and answers the price question for this course only.
  // 2026-11-16 (R3): KI-Kompetenz and Copilot spec groups with the price note and the live format sentence; the
  // KI-Check page uses the credit sentence verbatim and "Kennenlernen".
  produkte: "2026-11-16",
  workflows: "2026-11-16",
  // 2026-11-09: OpSo Android app public on Google Play (EU/EEA, Switzerland, UK), links and status updated; before that
  // 2026-11-07: iPhone app in the App Store; the status changed on the OpSo page and on Home, About and Projekte.
  opso: "2026-11-15",
  opsoKarte: "2026-11-19",
  // 2026-11-06 (evening): trainings lead. Home opens with the training ledger (team price, per-person arithmetic,
  // hours), the Schulungen hub names the organiser model and live-only delivery, the KI-Check is framed
  // "Erst analysieren, dann schulen" and its report ends with a training recommendation; the 60-day credit applies
  // to a training or a pilot. About and Contact follow the new order.
  // 2026-11-14: site clean-up (owner): no OpSo or own-work section on Home, the projects page retired (301 to About),
  // About and Contact lead with training, the hero says "live an Ihren Aufgaben" instead of "in Ihrem Teams".
  home: "2026-11-15",
  schulungen: "2026-11-15",
  check: "2026-11-16",
  beratung: "2026-11-15",
  ueber: "2026-11-15",
  kontakt: "2026-11-15",
  // 2026-11-06: per-person arithmetic in the price answers and the hours of a half day and a day
  kompetenz: "2026-11-16",
  copilot: "2026-11-16",
  // 2026-11-04: written, meeting-free KI-Check at a fixed 990 € (questionnaire, report, optional evening call)
  prozess: "2026-11-15",
  m365: "2026-11-04",
  agenten: "2026-11-15",
  anwendungen: "2026-11-04",
  // 2026-11-14: the first two training posts (cost, Art. 4) in the list, the six short posts of Feb-Mar 2026 retired and
  // the list framed around training; before that 2026-11-04: CTA KI-Check 990 € with the 60-day credit
  blog: "2026-11-14",
  // 2026-11-15: no "vermitteln" (rule 6); 2026-11-06: no trial session (seven-day reply, trainer pool, live demo, first assignment paid)
  trainer: "2026-11-15",
};

export function pageUpdated(key: PageKey): string {
  return PAGE_UPDATED[key] ?? SITE_UPDATED_ISO;
}

/** A journal post's last substantive revision: its `modified` date (set in the post list when the text changes), else the publish date. */
export function postUpdated(post: { date: string; modified?: string }): string {
  return post.modified ?? post.date;
}
