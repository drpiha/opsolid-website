import type { Locale } from "@/lib/i18n";

export interface DemoPersona {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  /**
   * Slug used for the demo URL on the back of the card.
   * Keep stable per locale so the example URL feels real.
   */
  slug: string;
}

export const demoPersonas: Record<Locale, DemoPersona> = {
  tr: {
    name: "Mehmet Yılmaz",
    role: "Operations Lead",
    email: "mehmet@ornek.com.tr",
    phone: "+90 212 555 · 1234",
    location: "İstanbul · TR",
    slug: "mehmet",
  },
  de: {
    name: "Lena Schäfer",
    role: "Partner · Legal Operations",
    email: "lena@example.de",
    phone: "+49 40 1234 · 5678",
    location: "Hamburg · DE",
    slug: "lena",
  },
  en: {
    name: "Alex Morgan",
    role: "Director of Operations",
    email: "alex@example.com",
    phone: "+44 20 7946 · 0521",
    location: "Berlin · EU",
    slug: "alex",
  },
  // M6 — additional locales reuse the existing personas for the demo card
  // shown on the marketing site. A native-name pass per locale would be a
  // marketing polish, not a launch blocker.
  es: {
    name: "Sofía García",
    role: "Directora de Operaciones",
    email: "sofia@ejemplo.es",
    phone: "+34 91 555 · 1234",
    location: "Madrid · ES",
    slug: "sofia",
  },
  it: {
    name: "Marco Bianchi",
    role: "Responsabile Operazioni",
    email: "marco@esempio.it",
    phone: "+39 02 5555 · 1234",
    location: "Milano · IT",
    slug: "marco",
  },
  fr: {
    name: "Camille Dubois",
    role: "Directrice des opérations",
    email: "camille@exemple.fr",
    phone: "+33 1 5555 · 1234",
    location: "Paris · FR",
    slug: "camille",
  },
  ar: {
    name: "ليلى الحسيني",
    role: "مديرة العمليات",
    email: "leila@mithal.ae",
    phone: "+971 4 555 · 1234",
    location: "دبي · AE",
    slug: "leila",
  },
};
