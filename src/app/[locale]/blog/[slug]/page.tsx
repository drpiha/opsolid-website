import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPost } from "@/components/v7/BlogPost";
import { BLOG } from "@/components/v7/BlogList";
import { postSubs } from "@/lib/blog-slugs";
import { pickLocale } from "@/lib/seo-v4";
import { v7Metadata } from "@/lib/seo-v7";
import { postUpdated } from "@/lib/v7-updated";

type Props = { params: { slug: string; locale: string } };

// Each locale lists its own slugs (the training posts have a German, an English and a Turkish slug).
export async function generateStaticParams({ params }: { params: { locale?: string } }) {
  return BLOG[pickLocale(params?.locale)].posts.map((p) => ({ slug: p.slug }));
}

function findPost(locale: string, slug: string) {
  return BLOG[pickLocale(locale)].posts.find((p) => p.slug === slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loc = pickLocale(params.locale);
  const post = findPost(loc, params.slug);
  if (!post) return {};
  // Long headings get a short seoTitle for the <title>; the visible H1 keeps the full title.
  const m = v7Metadata(loc, "blog", { title: post.seoTitle ?? post.title, description: post.excerpt }, { sub: postSubs(params.slug), ogType: "article" });
  const modifiedTime = postUpdated(post);
  return { ...m, openGraph: { ...m.openGraph, publishedTime: post.date, modifiedTime } as Metadata["openGraph"] };
}

export default function Page({ params }: Props) {
  // A slug of another locale's post never renders here: the middleware 301s it to this locale's slug first.
  if (!findPost(params.locale, params.slug)) notFound();
  return <BlogPost locale={pickLocale(params.locale)} slug={params.slug} />;
}
