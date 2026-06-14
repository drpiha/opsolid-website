import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostPage } from "./BlogPostPage";
import { getPostBySlug, getAllSlugs } from "@/content/blog";
import { SITE_CONFIG } from "@/lib/constants";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";

interface Props {
  params: { slug: string; locale: string };
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  const path = `/blog/${params.slug}`;
  const canonical = `${SITE_CONFIG.url}/${locale}${path}`;

  return {
    title: post.title,
    description: post.excerpt,
    // Per-post canonical + hreflang. Without this each post inherited the
    // locale homepage canonical from the layout and was dropped from the index.
    alternates: {
      canonical,
      languages: {
        de: `${SITE_CONFIG.url}/de${path}`,
        en: `${SITE_CONFIG.url}/en${path}`,
        tr: `${SITE_CONFIG.url}/tr${path}`,
        "x-default": `${SITE_CONFIG.url}/de${path}`,
      },
    },
    openGraph: {
      title: `${post.title}`,
      description: post.excerpt,
      type: "article",
      url: canonical,
      publishedTime: post.date,
    },
  };
}

export default function Page({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  const url = `${SITE_CONFIG.url}/${locale}/blog/${params.slug}`;

  // BlogPosting structured data — gives Google/LLMs a named author (E-E-A-T)
  // and a citable article entity. Author = Hasan Dönmez (solo operator).
  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: locale,
    articleSection: post.category,
    author: {
      "@type": "Person",
      name: "Hasan Dönmez",
      url: `${SITE_CONFIG.url}/${locale}/ueber-mich`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/icons/icon-512.png`,
      },
    },
    image: `${SITE_CONFIG.url}/icons/icon-512.png`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }}
      />
      <BlogPostPage slug={params.slug} />
    </>
  );
}
