import type { Metadata } from "next";
import { content as en } from "@/content/en";
import { content as de } from "@/content/de";
import { content as tr } from "@/content/tr";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo/alternates";
import { getCardPricingMode } from "@/lib/billing/plan";
import { DigitalCardPage } from "./DigitalCardPage";

const META = {
  en: en.products.digitalCard.meta,
  de: de.products.digitalCard.meta,
  tr: tr.products.digitalCard.meta,
} as const;

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  const m = META[locale as "en" | "de" | "tr"] ?? META.en;
  return pageMetadata({
    locale,
    path: "/products/digital-card",
    title: m.title,
    description: m.description,
  });
}

export default function Page() {
  // Pricing mode resolved server-side so the client form never reads env
  // directly; under all_free the paid billing tiles disappear and checkout
  // is never offered. The optional ?event=<slug> fair param is handled
  // client-side (like ?template=) so this page stays statically prerendered.
  return <DigitalCardPage pricingMode={getCardPricingMode()} />;
}
