import type { Metadata } from "next";
import { pickLocale } from "@/lib/seo-v4";
import { v7Metadata } from "@/lib/seo-v7";
import type { L3 } from "@/lib/v7-routes";
import { ImpressumPage } from "./ImpressumPage";

const META: Record<L3, { title: string; description: string }> = {
  de: { title: "Impressum", description: "Impressum von OpSolid: Anbieter, Anschrift, Kontakt und Umsatzsteuer-ID." },
  en: { title: "Legal notice", description: "OpSolid legal notice: provider, address, contact details and VAT ID." },
  tr: { title: "Yasal bildirim", description: "OpSolid yasal bildirimi: sağlayıcı, adres, iletişim ve KDV numarası." },
};

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return v7Metadata(params.locale, "impressum", META[pickLocale(params.locale)], { noindex: true });
}

export default function Page({ params }: { params: { locale: string } }) {
  return <ImpressumPage locale={pickLocale(params.locale)} />;
}
