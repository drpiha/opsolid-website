"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";
import { getPostContent } from "@/content/blog";

interface BlogPostPageProps {
  slug: string;
}

export function BlogPostPage({ slug }: BlogPostPageProps) {
  const { t, locale } = useLocale();
  const blog = t.blog;

  const postMeta = blog.posts.find((p) => p.slug === slug);
  const postContent = getPostContent(slug, locale);

  if (!postMeta) return null;

  const categoryLabel =
    blog.categories[postMeta.category as keyof typeof blog.categories] || postMeta.category;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-12 md:pt-44 md:pb-16 gradient-hero-mesh overflow-hidden">
        <div className="absolute top-20 right-[20%] w-72 h-72 bg-brand-500/10 rounded-full blur-[100px]" />
        <div className="container-wide relative z-10">
          <AnimatedSection>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft size={14} />
              {blog.hero.label}
            </Link>
            <Badge variant="gradient" className="mb-4">
              {categoryLabel}
            </Badge>
            <h1 className="text-heading-lg md:text-display-sm lg:text-display font-bold text-white max-w-4xl">
              {postMeta.title}
            </h1>
            <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {postMeta.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {postMeta.readTime} {blog.minRead}
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 md:py-24">
        <div className="container-narrow">
          <AnimatedSection>
            <article
              className="prose prose-slate prose-lg max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-heading-sm prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-li:text-slate-600
                prose-strong:text-slate-900
                prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-brand-500 prose-blockquote:bg-brand-50/30 prose-blockquote:rounded-r-xl prose-blockquote:py-1
              "
              dangerouslySetInnerHTML={{ __html: postContent }}
            />
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <AnimatedSection>
            <div className="relative rounded-2xl gradient-cta px-8 py-16 md:px-20 md:py-20 text-center overflow-hidden">
              <div className="absolute top-8 right-12 w-64 h-64 bg-gradient-to-br from-brand-400/15 to-teal-400/10 rounded-full blur-2xl animate-float" />
              <div className="relative z-10 max-w-xl mx-auto">
                <h2 className="text-heading-lg md:text-display-sm font-bold text-white">
                  {blog.cta.headline}
                </h2>
                <p className="mt-4 text-body text-slate-300">
                  {blog.cta.description}
                </p>
                <Link href="/contact" className="mt-8 inline-block">
                  <Button
                    size="xl"
                    className="bg-white text-slate-900 hover:bg-slate-100 hover:shadow-glow"
                  >
                    {blog.cta.primaryCta}
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
