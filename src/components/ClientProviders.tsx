"use client";

import { LocaleProvider } from "@/context/LocaleContext";
import { ThemeProvider } from "@/context/ThemeContext";
import type { Locale } from "@/lib/i18n";

export function ClientProviders({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  return (
    <ThemeProvider>
      <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>
    </ThemeProvider>
  );
}
