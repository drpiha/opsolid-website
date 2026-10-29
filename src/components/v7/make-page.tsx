import type { Metadata } from "next";
import type { PageSet } from "@/content/v7/types";
import { pickLocale } from "@/lib/seo-v4";
import { v7Metadata } from "@/lib/seo-v7";
import { V7Page } from "./V7Page";

type Params = { params: { locale?: string } };

/** generateMetadata for a v7 page route: `export const generateMetadata = v7Meta(page);` */
export function v7Meta(set: PageSet) {
  return function generateMetadata({ params }: Params): Metadata {
    const locale = pickLocale(params?.locale);
    const page = set[locale];
    return v7Metadata(locale, page.key, page.meta, { absoluteTitle: page.key === "home" });
  };
}

/** Default export of a v7 page route: `export default v7Page(page);` */
export function v7Page(set: PageSet) {
  return function V7RoutePage({ params }: Params) {
    const locale = pickLocale(params?.locale);
    return <V7Page page={set[locale]} locale={locale} />;
  };
}
