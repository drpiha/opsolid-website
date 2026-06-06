// =============================================================================
// FRENCH CONTENT — M6 minimal locale
// =============================================================================
// See es.ts for the proxy/fallback rationale; this file follows the same
// pattern. Translated keys override English; everything else falls back to
// `en.ts`. Add high-traffic translations under `overrides`.
// =============================================================================

import { content as en } from "./en";
import type { Content } from "./en";

type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

function merge<T>(base: T, override: DeepPartial<T>): T {
  if (override === undefined || override === null) return base;
  if (Array.isArray(base) || Array.isArray(override)) {
    return (override ?? base) as T;
  }
  if (typeof base !== "object" || base === null) return (override as T) ?? base;
  const out: Record<string, unknown> = { ...(base as object) };
  for (const k of Object.keys(override as object) as (keyof T)[]) {
    out[k as string] = merge(
      (base as Record<string, unknown>)[k as string],
      (override as Record<string, unknown>)[k as string],
    );
  }
  return out as T;
}

const overrides: DeepPartial<Content> = {
  nav: {
    solutions: "Services",
    products: "Produits",
    useCases: "Cas d'usage",
    about: "À propos",
    contact: "Contact",
    cta: "Réserver un appel",
    blog: "Blog",
    faq: "FAQ",
  },
  home: {
    hero: {
      headline: "Automatisation pratique\npour les opérations métier",
      subheadline:
        "OpSolid aide les entreprises à remplacer le travail manuel et répétitif par des systèmes automatisés fiables — automatisation de flux, intégrations et processus assistés par l'IA.",
      primaryCta: "Réserver un appel de découverte",
      secondaryCta: "Voir les services",
      title: [
        "Une automatisation qui pilote",
        "vos opérations —",
        "et non l'inverse.",
      ],
      subtitle:
        "OpSolid conçoit et construit des systèmes pratiques d'automatisation et d'IA pour les opérations réelles — flux, intégrations, outils internes et processus assistés par l'IA.",
      primaryCtaLabel: "Réserver un appel",
      secondaryCtaLabel: "Voir les services",
      consultingNote:
        "Nous livrons aussi des produits autonomes — Kutasia, OpSo Smart (carte numérique), Digital Reception.",
    },
  },
  v2: {
    nav: {
      home: "Accueil",
      services: "Services",
      automationCheck: "AI Automation Check",
      journal: "Blog",
      contact: "Contact",
      cta: "Réserver un appel",
    },
  },
  // M7 — vCard "Save to contacts" button on the public card page.
  card: {
    vcard: {
      label: "Enregistrer dans les contacts",
    },
  },
};

export const content: Content = merge(en, overrides);
