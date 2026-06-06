// =============================================================================
// ARABIC CONTENT — M6 minimal locale (RTL)
// =============================================================================
// See es.ts for the proxy/fallback rationale; this file follows the same
// pattern. Translated keys override English; everything else falls back to
// `en.ts`. The page-level `dir="rtl"` attribute is set in the locale-aware
// `<html>` tag (see app/[locale]/layout.tsx — handled there once Arabic is
// added to the LOCALES list).
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
    solutions: "الخدمات",
    products: "المنتجات",
    useCases: "حالات الاستخدام",
    about: "حول",
    contact: "اتصل بنا",
    cta: "احجز مكالمة استكشافية",
    blog: "المدونة",
    faq: "الأسئلة الشائعة",
  },
  home: {
    hero: {
      headline: "أتمتة عملية\nلعمليات الأعمال",
      subheadline:
        "تساعد OpSolid الشركات على استبدال العمل اليدوي المتكرر بأنظمة آلية موثوقة — من أتمتة سير العمل وتكامل الأنظمة إلى العمليات المدعومة بالذكاء الاصطناعي.",
      primaryCta: "احجز مكالمة استكشافية",
      secondaryCta: "اطلع على الخدمات",
      title: [
        "أتمتة تدير",
        "عملياتك —",
        "وليس العكس.",
      ],
      subtitle:
        "تصمم OpSolid وتبني أنظمة عملية للأتمتة والذكاء الاصطناعي للعمليات الحقيقية — سير العمل، التكامل، الأدوات الداخلية، والعمليات المدعومة بالذكاء الاصطناعي.",
      primaryCtaLabel: "احجز مكالمة",
      secondaryCtaLabel: "اطلع على الخدمات",
      consultingNote:
        "نطلق أيضاً منتجات مستقلة — Kutasia و OpSo Smart (البطاقة الرقمية) و Digital Reception.",
    },
  },
  v2: {
    nav: {
      home: "الرئيسية",
      services: "الخدمات",
      automationCheck: "AI Automation Check",
      journal: "المدونة",
      contact: "اتصل بنا",
      cta: "احجز مكالمة",
    },
  },
  // M7 — vCard "Save to contacts" button on the public card page.
  card: {
    vcard: {
      label: "حفظ في جهات الاتصال",
    },
  },
};

export const content: Content = merge(en, overrides);
