/**
 * One source for the published training offers, the planned courses and the KI-Check per locale (design C port,
 * PLAN section 3.2). Every value is a live string from home.ts, schulungen.ts, check.ts and the FAQ answers; the
 * numbers are the only published prices (repo CLAUDE.md, "Published offers"): net, per team, companies only.
 *
 * - Trainings use "ab" prices "pro Team" and are never called "Festpreis". `arith` is arithmetic, never a price of
 *   its own, and only for KI-Kompetenz Basis and the Copilot-Praxistag (none for KI-Agenten, rule 1).
 * - `chip` is `price + " " + unit` of that locale. Show the price note (SITE_STR.priceNote) next to every price group.
 * - PLANNED: the four planned courses in their fixed order (rule 5). Names only: no duration, price, date or page.
 */
import type { L3 } from "@/lib/v7-routes";

export type CourseKey = "kompetenz" | "copilot" | "workflows";

export type Offer = {
  name: string;
  short: string;
  price: string;
  unit: string;
  chip: string;
  duration: string;
  persons: string;
  extra: string;
  arith?: string;
};

export const OFFERS: Record<L3, Record<CourseKey, Offer>> = {
  de: {
    kompetenz: {
      name: "KI-Kompetenz Basis",
      short: "KI-Kompetenz Basis",
      price: "ab 1.790 €",
      unit: "netto pro Team",
      chip: "ab 1.790 € netto pro Team",
      duration: "Halber Tag · 3,5 Stunden",
      persons: "10 Personen inklusive, bis 15",
      extra: "Jede weitere Person 90 €",
      arith: "Rechnerisch 179 € pro Person bei 10 Personen",
    },
    copilot: {
      name: "Copilot-Praxistag",
      short: "Copilot-Praxistag",
      price: "ab 2.900 €",
      unit: "netto pro Team",
      chip: "ab 2.900 € netto pro Team",
      duration: "1 Tag · 6 Stunden",
      persons: "10 Personen inklusive, bis 12",
      extra: "Jede weitere Person 150 €",
      arith: "Rechnerisch 290 € pro Person bei 10 Personen",
    },
    workflows: {
      name: "KI-Agenten & Workflow-Automatisierung",
      short: "KI-Agenten & Workflows",
      price: "ab 5.900 €",
      unit: "netto pro Team",
      chip: "ab 5.900 € netto pro Team",
      duration: "2 Tage",
      persons: "8 Personen inklusive, bis 10",
      extra: "Jede weitere Person 290 €",
    },
  },
  en: {
    kompetenz: {
      name: "AI literacy basics",
      short: "AI literacy basics",
      price: "from €1,790",
      unit: "net per team",
      chip: "from €1,790 net per team",
      duration: "Half day · 3.5 hours",
      persons: "10 people included, up to 15",
      extra: "Each additional person €90",
      arith: "Works out at €179 per person with 10 people",
    },
    copilot: {
      name: "Copilot workshop",
      short: "Copilot workshop",
      price: "from €2,900",
      unit: "net per team",
      chip: "from €2,900 net per team",
      duration: "1 day · 6 hours",
      persons: "10 people included, up to 12",
      extra: "Each additional person €150",
      arith: "Works out at €290 per person with 10 people",
    },
    workflows: {
      name: "AI agents & workflow automation",
      short: "AI agents & workflows",
      price: "from €5,900",
      unit: "net per team",
      chip: "from €5,900 net per team",
      duration: "2 days",
      persons: "8 people included, up to 10",
      extra: "Each additional person €290",
    },
  },
  tr: {
    kompetenz: {
      name: "YZ Yetkinliği Temel",
      short: "YZ Yetkinliği Temel",
      price: "1.790 €'dan",
      unit: "itibaren · net, ekip başına",
      chip: "1.790 €'dan itibaren · net, ekip başına",
      duration: "Yarım gün · 3,5 saat",
      persons: "10 kişi dahil, en fazla 15",
      extra: "Her ek kişi 90 €",
      arith: "Hesaben 10 kişide kişi başı 179 €",
    },
    copilot: {
      name: "Copilot Uygulama Günü",
      short: "Copilot Uygulama Günü",
      price: "2.900 €'dan",
      unit: "itibaren · net, ekip başına",
      chip: "2.900 €'dan itibaren · net, ekip başına",
      duration: "1 gün · 6 saat",
      persons: "10 kişi dahil, en fazla 12",
      extra: "Her ek kişi 150 €",
      arith: "Hesaben 10 kişide kişi başı 290 €",
    },
    workflows: {
      name: "YZ Ajanları ve İş Akışı Otomasyonu",
      short: "YZ Ajanları ve İş Akışları",
      price: "5.900 €'dan",
      unit: "itibaren · net, ekip başına",
      chip: "5.900 €'dan itibaren · net, ekip başına",
      duration: "2 gün",
      persons: "8 kişi dahil, en fazla 10",
      extra: "Her ek kişi 290 €",
    },
  },
};

/** The four planned courses, in this order and only these (rule 5, decision 74). Shown with "geplant" only. */
export const PLANNED: Record<L3, readonly [string, string, string, string]> = {
  de: ["KI im Arbeitsalltag", "KI-Leitlinie für Führungskräfte", "Automatisierung ohne Programmieren", "KI im Kundenservice und Vertrieb"],
  en: ["AI in everyday work", "AI policy for managers", "Automation without programming", "AI in customer service and sales"],
  tr: ["Günlük işte YZ", "Yöneticiler için YZ yönergesi", "Programlamadan otomasyon", "Müşteri hizmetleri ve satışta YZ"],
};

/** The KI-Check: the one fixed price. Wherever the chip appears, the credit line appears in the same group. */
export const CHECK: Record<L3, { name: string; chip: string; credit: string }> = {
  de: {
    name: "KI-Check",
    chip: "990 € netto, Festpreis",
    credit: "Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir ihn voll an.",
  },
  en: {
    name: "AI check",
    chip: "€990 net, fixed price",
    credit: "Credited in full against a follow-up order within 60 days.",
  },
  tr: {
    name: "YZ Kontrolü",
    chip: "990 € (net, sabit fiyat)",
    credit: "60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir.",
  },
};
