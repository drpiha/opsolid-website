// =============================================================================
// SPANISH CONTENT — M6 minimal locale
// =============================================================================
// This file ships partial translations for the highest-traffic surfaces
// (homepage hero, pricing, /products/digital-card hero, public viewer auth /
// onboarding strings). EVERYTHING else falls back to the English content
// file via a structural-merge proxy at module load — the user never sees a
// missing-key crash, just an English string for any key not yet localised.
//
// The proxy is built with an `as Content` cast so the whole 4845-line
// English keyset stays valid at the type level. To add another translated
// key, add it under `overrides` below; it gets deep-merged with `en` at
// import time. If you need a full content rewrite, drop a wholesale
// `export const content: Content = { … } as const` block in here and remove
// the proxy.
// =============================================================================

import { content as en } from "./en";
import type { Content } from "./en";

type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

// Deep-merge translation overrides on top of the English content tree.
// Arrays are replaced wholesale (not concat'd) — Spanish-language array
// items have to be the same length as English ones, since the rendering
// components index into them positionally.
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
    solutions: "Servicios",
    products: "Productos",
    useCases: "Casos de uso",
    about: "Acerca",
    contact: "Contacto",
    cta: "Reserva una llamada",
    blog: "Blog",
    faq: "Preguntas frecuentes",
  },
  home: {
    hero: {
      headline: "Automatización práctica\npara operaciones empresariales",
      subheadline:
        "OpSolid ayuda a las empresas a sustituir el trabajo manual y repetitivo por sistemas automatizados fiables — desde la automatización de flujos hasta procesos asistidos por IA.",
      primaryCta: "Reserva una llamada de descubrimiento",
      secondaryCta: "Ver servicios",
      title: [
        "Automatización que ejecuta",
        "sus operaciones —",
        "no al revés.",
      ],
      subtitle:
        "OpSolid diseña y construye sistemas prácticos de automatización e IA para operaciones reales — flujos, integraciones, herramientas internas y procesos asistidos por IA.",
      primaryCtaLabel: "Reservar llamada",
      secondaryCtaLabel: "Ver servicios",
      consultingNote:
        "También enviamos productos independientes — Kutasia, Verso (tarjeta digital), Digital Reception.",
    },
  },
  v2: {
    nav: {
      home: "Inicio",
      voiceAgent: "Agente de voz",
      digitalCard: "Verso",
      kutasia: "Kutasia",
      journal: "Blog",
      contact: "Contacto",
      cta: "Reservar llamada",
    },
  },
  // M7 — vCard "Save to contacts" button on the public card page.
  card: {
    vcard: {
      label: "Guardar en contactos",
    },
  },
};

export const content: Content = merge(en, overrides);
