import type { Metadata } from "next";
import { BlogList, BLOG_T } from "@/components/v7/BlogList";
import { pickLocale } from "@/lib/seo-v4";
import { v7Metadata } from "@/lib/seo-v7";

type Params = { params: { locale?: string } };

export function generateMetadata({ params }: Params): Metadata {
  const loc = pickLocale(params?.locale);
  return v7Metadata(loc, "blog", { title: BLOG_T[loc].title, description: BLOG_T[loc].desc });
}

export default function Page({ params }: Params) {
  return <BlogList locale={pickLocale(params?.locale)} />;
}
