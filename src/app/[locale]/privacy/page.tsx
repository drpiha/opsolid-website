import type { Metadata } from "next";
import { pickLocale } from "@/lib/seo-v4";
import { v7Metadata } from "@/lib/seo-v7";
import type { L3 } from "@/lib/v7-routes";
import { PrivacyPage } from "./PrivacyPage";

const META: Record<L3, { title: string; description: string }> = {
  de: { title: "Datenschutzerklärung", description: "Datenschutzerklärung von OpSolid nach DSGVO und KVKK: welche Daten wir verarbeiten, wofür und welche Rechte Sie haben." },
  en: { title: "Privacy policy", description: "OpSolid privacy policy under GDPR and KVKK: what data we process, why, and what rights you have." },
  tr: { title: "Gizlilik politikası", description: "GDPR ve KVKK kapsamında OpSolid gizlilik politikası: hangi verileri neden işlediğimiz ve haklarınız." },
};

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return v7Metadata(params.locale, "privacy", META[pickLocale(params.locale)], { noindex: true });
}

export default function Page({ params }: { params: { locale: string } }) {
  return <PrivacyPage locale={pickLocale(params.locale)} />;
}
