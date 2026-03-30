import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostPage } from "./BlogPostPage";
import { getPostBySlug, getAllSlugs } from "@/content/blog";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | OpSolid`,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default function Page({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return <BlogPostPage slug={params.slug} />;
}
