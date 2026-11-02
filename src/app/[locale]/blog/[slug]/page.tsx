import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPost } from "@/components/v7/BlogPost";
import { BLOG } from "@/components/v7/BlogList";
import { getAllSlugs, getPostBySlug } from "@/content/blog";
import { pickLocale } from "@/lib/seo-v4";
import { v7Metadata } from "@/lib/seo-v7";
import { postUpdated } from "@/lib/v7-updated";

type Props = { params: { slug: string; locale: string } };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loc = pickLocale(params.locale);
  const post = BLOG[loc].posts.find((p) => p.slug === params.slug) ?? getPostBySlug(params.slug);
  if (!post) return {};
  // Long headings get a short seoTitle for the <title>; the visible H1 keeps the full title.
  const m = v7Metadata(loc, "blog", { title: post.seoTitle ?? post.title, description: post.excerpt }, { sub: `/${params.slug}`, ogType: "article" });
  const modifiedTime = postUpdated(params.slug, post.date);
  return { ...m, openGraph: { ...m.openGraph, publishedTime: post.date, modifiedTime } as Metadata["openGraph"] };
}

export default function Page({ params }: Props) {
  if (!getPostBySlug(params.slug)) notFound();
  return <BlogPost locale={pickLocale(params.locale)} slug={params.slug} />;
}
