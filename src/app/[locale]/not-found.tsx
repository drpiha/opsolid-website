import type { Metadata } from "next";
import { headers } from "next/headers";
import { NotFound } from "@/components/v7/NotFound";
import { NOT_FOUND_TITLE } from "@/components/layout/NotFoundView";
import { pickLocale } from "@/lib/seo-v4";

// robots: null drops the root layout's "index, follow"; Next adds the single
// <meta name="robots" content="noindex"> to every 404 itself.
export const metadata: Metadata = { title: NOT_FOUND_TITLE, robots: null };

export default function LocaleNotFound() {
  // The URL the browser shows (middleware sets x-public-path); the first segment is the locale.
  const h = headers();
  const first = (h.get("x-public-path") ?? h.get("x-pathname") ?? "").split("?")[0].split("/").filter(Boolean)[0];
  return <NotFound locale={pickLocale(first)} />;
}
