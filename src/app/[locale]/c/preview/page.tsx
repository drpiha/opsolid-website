// =============================================================================
// /[locale]/c/preview — public preview page reading the card payload from the
// URL hash. Used by the "Önizleme linki" button in the order form so customers
// can share their unfinished card without paying.
//
// SECURITY: hash data lives ONLY client-side (the server never sees URL hashes
// per HTTP spec), so no DB write happens here. Anyone with the link can render
// the card; nothing is published.
// =============================================================================

import type { Metadata } from "next";
import { PreviewClient } from "./PreviewClient";

export const metadata: Metadata = {
  title: "Önizleme · OpSolid Smart Card",
  description: "Bir OpSolid kart önizlemesi.",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PreviewPage({ params }: PageProps) {
  const { locale } = await params;
  return <PreviewClient pageLocale={locale} />;
}
