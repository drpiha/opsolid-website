import type { Metadata } from "next";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo/alternates";
import { VoiceAgentPage } from "./VoiceAgentPage";

// No localized meta key exists under `v2.voiceAgent` (only hero/flow/spec), so
// the page's existing copy is preserved here and shared across locales while
// still emitting per-locale canonical + hreflang + the OG share image.
const META = {
  title: "Voice AI Agent · OpSolid",
  description:
    "24/7 phone answering, routing, and booking — built on Retell AI and Vapi with calendar sync.",
} as const;

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  return pageMetadata({
    locale,
    path: "/products/voice-agent",
    title: META.title,
    description: META.description,
  });
}

export default function Page() {
  return <VoiceAgentPage />;
}
