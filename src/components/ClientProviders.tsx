"use client";

import { LocaleProvider } from "@/context/LocaleContext";
import type { Locale } from "@/lib/i18n";

export function ClientProviders({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  return <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>;
}
