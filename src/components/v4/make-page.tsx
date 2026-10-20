import type { Metadata } from "next";
import { getPage, type PageKey } from "@/content/v4";
import { PageRenderer } from "@/components/v4/PageRenderer";
import { pageMetadata, pickLocale } from "@/lib/seo-v4";

type Params = { params: { locale?: string } };

const SERVICE_KEYS: PageKey[] = ["kiBeratung", "prozess", "m365", "interneTools", "schulungen", "agents", "websites"];
const SERVICES_LABEL = { de: "Leistungen", en: "Services", tr: "Hizmetler" } as const;

export function v4Meta(key: PageKey) {
  return function generateMetadata({ params }: Params): Metadata {
    const loc = pickLocale(params?.locale);
    const page = getPage(loc, key);
    return pageMetadata(loc, page.slug, page.meta, { absoluteTitle: key === "home" });
  };
}

export function v4Page(key: PageKey) {
  return function V4RoutePage({ params }: Params) {
    const loc = pickLocale(params?.locale);
    const page = getPage(loc, key);
    const trail =
      key === "home"
        ? []
        : SERVICE_KEYS.includes(key) && key !== "agents" && key !== "websites"
          ? [{ label: SERVICES_LABEL[loc], to: "/leistungen" }, { label: page.crumb }]
          : [{ label: page.crumb }];
    const kind = key === "about" ? "AboutPage" : key === "leistungen" ? "CollectionPage" : undefined;
    return <PageRenderer page={page} locale={loc} trail={trail} kind={kind} home={key === "home"} />;
  };
}
