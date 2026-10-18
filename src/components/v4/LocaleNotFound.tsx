"use client";

import { usePathname } from "next/navigation";
import { useLocaleBase } from "@/context/LocaleContext";
import { isV4Path } from "@/lib/v4";
import { NotFoundView } from "@/components/v4/NotFoundView";

/** [locale] 404: locale from the provider; outside v4 routes (app surfaces) it carries its own graphite tokens. */
export function LocaleNotFound() {
  const { locale } = useLocaleBase();
  const pathname = usePathname();
  const l = locale === "de" || locale === "tr" ? locale : "en";
  return <NotFoundView locale={l} standalone={!isV4Path(pathname)} />;
}
