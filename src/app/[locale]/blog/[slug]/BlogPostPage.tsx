"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";
import { getPostContent } from "@/content/blog";

interface BlogPostPageProps {
  slug: string;
}

export function BlogPostPage({ slug }: BlogPostPageProps) {
  const { t, locale } = useLocale();
  const blog = t.blog;

  const postIndex = blog.posts.findIndex((p) => p.slug === slug);
  const postMeta = blog.posts[postIndex];
  const postContent = getPostContent(slug, locale);

  if (!postMeta) return null;

  const prevPost = postIndex > 0 ? blog.posts[postIndex - 1] : null;
  const nextPost =
    postIndex < blog.posts.length - 1 ? blog.posts[postIndex + 1] : null;

  const categoryLabel =
    blog.categories[postMeta.category as keyof typeof blog.categories] ||
    postMeta.category;

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="post-title"
        className="relative pt-32 md:pt-40 pb-10 md:pb-14 bg-white"
      >
        <div className="container-prose">
          <AnimatedSection>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink/50 hover:text-ink transition-colors mb-8"
            >
              <ArrowLeft size={12} aria-hidden="true" />
              <span>{blog.hero.label}</span>
            </Link>
            <div className="eyebrow uppercase text-brand mb-4">{categoryLabel}</div>
            <h1
              id="post-title"
              className="text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink text-balance"
            >
              {postMeta.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-xs font-medium text-ink/55">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} aria-hidden="true" />
                {postMeta.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} aria-hidden="true" />
                {postMeta.readTime} {blog.minRead}
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Article body */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container-prose">
          <AnimatedSection>
            <article
              className="prose prose-lg max-w-none break-words text-pretty
                prose-headings:text-ink prose-headings:font-bold prose-headings:tracking-[-0.02em] prose-headings:text-balance
                prose-h2:text-[clamp(1.5rem,3vw,2.25rem)] prose-h2:leading-[1.1] prose-h2:mt-14 prose-h2:mb-5 prose-h2:font-extrabold
                prose-h3:text-[1.375rem] prose-h3:leading-[1.2] prose-h3:mt-10 prose-h3:mb-3
                prose-p:text-ink/80 prose-p:leading-[1.75] prose-p:text-pretty
                prose-li:text-ink/80 prose-li:leading-[1.7]
                prose-strong:text-ink prose-strong:font-semibold
                prose-a:text-brand prose-a:underline prose-a:underline-offset-4 prose-a:decoration-brand/40 hover:prose-a:decoration-brand
                prose-blockquote:border-l-4 prose-blockquote:border-brand prose-blockquote:bg-brand/5 prose-blockquote:rounded-r-2xl prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:font-semibold prose-blockquote:text-ink prose-blockquote:text-[1.125rem]
                prose-code:text-ink prose-code:bg-neutral-100 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.9em] prose-code:before:content-[''] prose-code:after:content-['']
                prose-pre:bg-ink prose-pre:text-white prose-pre:rounded-2xl prose-pre:border prose-pre:border-neutral-800
                prose-hr:border-neutral-200
              "
              dangerouslySetInnerHTML={{ __html: postContent }}
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Prev / Next */}
      {(prevPost || nextPost) && (
        <section className="section-sm bg-neutral-50">
          <div className="container-wide">
            <div className="eyebrow uppercase text-ink/50 mb-6">More reading</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="pop-card group block p-6 sm:p-8"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50 mb-3">
                    <ArrowLeft size={12} aria-hidden="true" />
                    <span>Previous</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-ink tracking-[-0.015em] leading-snug text-balance group-hover:text-brand transition-colors">
                    {prevPost.title}
                  </h3>
                </Link>
              ) : (
                <div />
              )}
              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="pop-card group block p-6 sm:p-8 md:text-right"
                >
                  <div className="flex md:justify-end items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50 mb-3">
                    <span>Next</span>
                    <ArrowRight size={12} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-ink tracking-[-0.015em] leading-snug text-balance group-hover:text-brand transition-colors">
                    {nextPost.title}
                  </h3>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-sm bg-white">
        <div className="container-wide">
          <AnimatedSection>
            <div className="pop-card p-10 md:p-14 text-center max-w-3xl mx-auto">
              <div className="eyebrow uppercase text-brand mb-4">Next step</div>
              <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink text-balance">
                {blog.cta.headline}
              </h2>
              <p className="mt-5 max-w-xl mx-auto text-ink/70 text-body leading-relaxed text-pretty">
                {blog.cta.description}
              </p>
              <div className="mt-8 flex justify-center">
                <Link href="/contact" className="btn-primary">
                  <span>{blog.cta.primaryCta}</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
