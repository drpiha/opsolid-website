"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
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
        className="relative pt-32 md:pt-40 pb-10 md:pb-14 paper-grain overflow-hidden"
      >
        <div className="hairline-b">
          <div className="container-wide flex items-center justify-between py-3">
            <span className="mono-label text-ink/60">
              [ JOURNAL · 09 ]   ARTICLE
            </span>
            <span className="mono-label hidden md:inline text-ink/40">
              {postMeta.date}
            </span>
          </div>
        </div>

        <div className="container-narrow relative z-10 pt-10 md:pt-14">
          <AnimatedSection>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 mono-label text-ink/50 hover:text-ink transition-colors mb-8"
            >
              <ArrowLeft size={12} aria-hidden="true" />
              <span>{blog.hero.label}</span>
            </Link>
            <div className="mono-label text-amber-700 mb-4">{categoryLabel}</div>
            <h1
              id="post-title"
              className="font-serif text-ink text-[clamp(2rem,4.8vw,3.75rem)] leading-[1.05] tracking-[-0.025em] text-balance"
            >
              {postMeta.title}
            </h1>
            <div className="mt-6 flex items-center gap-5 mono-label text-ink/50">
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
      <section className="hairline-t py-12 md:py-20">
        <div className="container-prose">
          <AnimatedSection>
            <article
              className="prose prose-lg max-w-none break-words text-pretty
                prose-headings:font-serif prose-headings:text-ink prose-headings:font-normal prose-headings:tracking-[-0.02em] prose-headings:text-balance
                prose-h2:text-[clamp(1.5rem,3vw,2.25rem)] prose-h2:leading-[1.1] prose-h2:mt-14 prose-h2:mb-5
                prose-h3:text-[1.375rem] prose-h3:leading-[1.2] prose-h3:mt-10 prose-h3:mb-3
                prose-p:text-ink/80 prose-p:leading-[1.75] prose-p:text-pretty
                prose-li:text-ink/80 prose-li:leading-[1.7]
                prose-strong:text-ink prose-strong:font-medium
                prose-a:text-ink prose-a:underline prose-a:underline-offset-4 prose-a:decoration-ink/30 hover:prose-a:decoration-ink
                prose-blockquote:border-l-2 prose-blockquote:border-amber prose-blockquote:bg-paper-warm prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:font-serif prose-blockquote:text-ink prose-blockquote:text-[1.125rem]
                prose-code:text-ink prose-code:bg-paper-warm prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.9em] prose-code:before:content-[''] prose-code:after:content-['']
                prose-pre:bg-ink prose-pre:text-paper prose-pre:rounded-xl prose-pre:border prose-pre:border-ink/10
                prose-hr:border-ink/10
                first:[&>p:first-of-type]:text-[1.125rem] first:[&>p:first-of-type]:first-letter:font-serif first:[&>p:first-of-type]:first-letter:text-[3.5rem] first:[&>p:first-of-type]:first-letter:leading-[0.9] first:[&>p:first-of-type]:first-letter:float-left first:[&>p:first-of-type]:first-letter:mr-3 first:[&>p:first-of-type]:first-letter:mt-1 first:[&>p:first-of-type]:first-letter:text-ink
              "
              dangerouslySetInnerHTML={{ __html: postContent }}
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Prev / Next */}
      {(prevPost || nextPost) && (
        <section className="hairline-t section-sm">
          <div className="container-wide">
            <div className="mono-label text-ink/50 mb-6">
              [ MORE ]   READING
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group block hairline bg-paper-warm rounded-2xl p-6 sm:p-8 transition duration-300 hover:border-ink/25 hover:-translate-y-0.5"
                >
                  <div className="mono-label text-ink/50 mb-3 flex items-center gap-2">
                    <span aria-hidden="true">←</span>
                    <span>PREVIOUS</span>
                  </div>
                  <h3 className="font-serif text-ink text-[1.25rem] md:text-[1.5rem] leading-[1.2] tracking-[-0.015em] text-balance group-hover:text-ink/80 transition-colors">
                    {prevPost.title}
                  </h3>
                </Link>
              ) : (
                <div />
              )}
              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group block hairline bg-paper-warm rounded-2xl p-6 sm:p-8 transition duration-300 hover:border-ink/25 hover:-translate-y-0.5 md:text-right"
                >
                  <div className="mono-label text-ink/50 mb-3 flex md:justify-end items-center gap-2">
                    <span>NEXT</span>
                    <span aria-hidden="true">→</span>
                  </div>
                  <h3 className="font-serif text-ink text-[1.25rem] md:text-[1.5rem] leading-[1.2] tracking-[-0.015em] text-balance group-hover:text-ink/80 transition-colors">
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
      <section className="hairline-t bg-ink text-paper paper-grain">
        <div className="container-wide section">
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
              <div className="lg:col-span-7">
                <div className="mono-label text-paper/60 mb-5">
                  [ NEXT ]   CONVERSATION
                </div>
                <h2 className="font-serif text-paper text-[clamp(2rem,5vw,3.75rem)] leading-[1.04] tracking-[-0.025em] text-balance">
                  {blog.cta.headline}
                </h2>
                <p className="mt-5 max-w-xl text-paper/70 text-body-lg leading-relaxed text-pretty">
                  {blog.cta.description}
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start gap-5 lg:items-end lg:justify-end">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2.5 bg-amber text-ink px-7 py-4 font-medium hairline hover:bg-paper transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
                >
                  <span>{blog.cta.primaryCta}</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
