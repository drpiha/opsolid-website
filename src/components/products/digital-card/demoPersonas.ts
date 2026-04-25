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
};
