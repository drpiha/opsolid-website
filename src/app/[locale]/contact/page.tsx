import type { Metadata } from "next";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo/alternates";
import { ContactPage } from "./ContactPage";
import { ContactV2 } from "@/components/v2/contact/ContactV2";
import { V2Shell } from "@/components/v2/V2Shell";
import { isPreviewV2 } from "@/lib/preview";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  return pageMetadata({
    locale,
    path: "/contact",
    title: "Contact",
    description:
      "Get in touch with OpSolid. Book a free consultation to discuss how automation and operational systems can improve your business processes.",
    ogDescription:
      "Book a free consultation to discuss how automation and operational systems can improve your business.",
  });
}

export default function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  if (isPreviewV2(searchParams)) {
    return (
      <V2Shell>
        <ContactV2 />
        <ContactPage />
      </V2Shell>
    );
  }
  return <ContactPage />;
}
