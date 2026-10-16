"use client";

import { useMemo } from "react";
import "@/styles/legacy.css";
import { contents } from "@/content";
import { ContentContext } from "@/context/ContentContext";
import { useLocaleBase } from "@/context/LocaleContext";

/**
 * Supplies `useLocale().t` (the full localized content bundle) to subtrees
 * that need it: app surfaces, legal pages, public cards. The v4 marketing
 * routes do not mount this, so they do not ship the bundle.
 */
export function ContentProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useLocaleBase();
  const t = useMemo(() => contents[locale], [locale]);
  return <ContentContext.Provider value={t}>{children}</ContentContext.Provider>;
}
