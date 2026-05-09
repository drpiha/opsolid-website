// =============================================================================
// ITALIAN CONTENT — M6 minimal locale
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
    solutions: "Servizi",
    products: "Prodotti",
    useCases: "Casi d'uso",
    about: "Chi siamo",
    contact: "Contatto",
    cta: "Prenota una call",
    blog: "Blog",
    faq: "FAQ",
  },
  home: {
    hero: {
      headline: "Automazione pratica\nper le operazioni aziendali",
      subheadline:
        "OpSolid aiuta le aziende a sostituire il lavoro manuale e ripetitivo con sistemi automatizzati affidabili — dall'automazione dei flussi ai processi assistiti dall'IA.",
      primaryCta: "Prenota una call di scoperta",
      secondaryCta: "Vedi i servizi",
      title: [
        "Automazione che gestisce",
        "le sue operazioni —",
        "non il contrario.",
      ],
      subtitle:
        "OpSolid progetta e costruisce sistemi pratici di automazione e IA per operazioni reali — flussi, integrazioni, strumenti interni e processi assistiti dall'IA.",
      primaryCtaLabel: "Prenota una call",
      secondaryCtaLabel: "Vedi i servizi",
      consultingNote:
        "Spediamo anche prodotti indipendenti — Kutasia, Verso (carta digitale), Digital Reception.",
    },
  },
  v2: {
    nav: {
      home: "Home",
      voiceAgent: "Agente vocale",
      digitalCard: "Verso",
      kutasia: "Kutasia",
      products: "Prodotti",
      pricing: "Prezzi",
      journal: "Blog",
      contact: "Contatto",
      cta: "Prenota call",
    },
  },
};

export const content: Content = merge(en, overrides);
