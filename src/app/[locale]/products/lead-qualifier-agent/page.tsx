import type { Metadata } from "next";
import { content as en } from "@/content/en";
import { content as de } from "@/content/de";
import { content as tr } from "@/content/tr";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo/alternates";
import { ProductStubPage } from "@/components/products/ProductStubPage";

const META = {
  en: en.v2.productPages.pages.leadQualifierAgent.meta,
  de: de.v2.productPages.pages.leadQualifierAgent.meta,
  tr: tr.v2.productPages.pages.leadQualifierAgent.meta,
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
    path: "/products/lead-qualifier-agent",
    title: m.title,
    description: m.description,
  });
}

export default function Page() {
  return <ProductStubPage pageId="leadQualifierAgent" pricingProductId="lead-qualifier-agent" />;
}
