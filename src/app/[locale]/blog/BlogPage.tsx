"use client";

import { useState } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import Image from "next/image";
import { Clock, Calendar } from "lucide-react";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

/* Unsplash images mapped by slug for precise control */
const blogImages: Record<string, string> = {
  "why-n8n-is-the-future-of-workflow-automation":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop",
  "5-signs-your-business-needs-process-automation":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=675&fit=crop",
  "connecting-crm-erp-the-integration-playbook":
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=675&fit=crop",
  "ai-chatbots-vs-rule-based-bots":
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=675&fit=crop",
  "make-vs-zapier-vs-n8n-comparison":
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=675&fit=crop",
  "whatsapp-business-automation-guide":
    "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=1200&h=675&fit=crop",
};

/* Fallback images by category */
const categoryImages: Record<string, string> = {
  automation:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop",
  operations:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=675&fit=crop",
  integration:
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=675&fit=crop",
  ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=675&fit=crop",
};

export function BlogPage() {
  const { t } = useLocale();
  const s = t.blog;
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPosts =
    activeCategory === "all"
      ? s.posts
      : s.posts.filter((post) => post.category === activeCategory);

  const categoryKeys = Object.keys(s.categories) as Array<keyof typeof s.categories>;

  const [featured, ...rest] = filteredPosts;

  const resolveImage = (slug: string, category: string) =>
    blogImages[slug] ||
    categoryImages[category] ||
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop";

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="blog-title"
        className="relative pt-32 md:pt-40 pb-12 md:pb-16 paper-grain overflow-hidden"
      >
        <div className="hairline-b">
          <div className="container-wide flex items-center justify-between py-3">
            <span className="mono-label text-ink/60">
              [ JOURNAL · 09 ]   WRITING
            </span>
            <span className="mono-label hidden md:inline text-ink/40">
              {new Date().getFullYear()}
            </span>
          </div>
        </div>

        <div className="container-wide relative z-10 pt-10 md:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-7 animate-fade-in">
              <div className="mono-label text-ink/60 mb-5">{s.hero.label}</div>
              <h1
                id="blog-title"
                className="font-serif text-ink text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.04] tracking-[-0.025em] text-balance"
              >
                {s.hero.headline}
              </h1>
            </div>

            <div className="lg:col-span-5 lg:pt-6 animate-fade-in">
              <p className="text-ink/70 text-body-lg leading-relaxed text-pretty">
                {s.hero.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="hairline-t">
        <div className="container-wide py-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categoryKeys.map((key) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={cn(
                  "rounded-full px-4 py-2 font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber",
                  activeCategory === key
                    ? "bg-ink text-paper"
                    : "hairline bg-paper-warm text-ink/70 hover:border-ink/25 hover:text-ink"
                )}
              >
                {s.categories[key]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured + grid */}
      <section className="hairline-t section-sm">
        <div className="container-wide">
          {/* Featured post */}
          {featured && (
            <AnimatedSection className="mb-12 md:mb-16">
              <Link
                href={`/blog/${featured.slug}`}
                className="group block hairline bg-paper-warm rounded-2xl overflow-hidden transition duration-300 hover:border-ink/25"
              >
                <div className="grid lg:grid-cols-12">
                  <div className="lg:col-span-7 relative aspect-[16/9] overflow-hidden hairline-b lg:hairline-b-0 lg:border-r lg:border-ink/10">
                    <Image
                      src={resolveImage(featured.slug, featured.category)}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority
                    />
                  </div>
                  <div className="lg:col-span-5 p-6 md:p-10 flex flex-col">
                    <div className="mono-label text-amber-700 mb-4">
                      FEATURED · 01
                    </div>
                    <div className="flex items-center gap-4 text-xs text-ink/50 mb-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} aria-hidden="true" />
                        {featured.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} aria-hidden="true" />
                        {featured.readTime} {s.minRead}
                      </span>
                      <span className="mono-label text-ink/50">
                        {s.categories[
                          featured.category as keyof typeof s.categories
                        ] || featured.category}
                      </span>
                    </div>
                    <h2 className="font-serif text-ink text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] tracking-[-0.02em] mb-4 text-balance group-hover:text-ink/80 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-ink/70 text-body leading-relaxed text-pretty line-clamp-4 flex-1">
                      {featured.excerpt}
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink underline underline-offset-8 decoration-ink/20 decoration-1 group-hover:decoration-ink">
                      <span>{s.readMore}</span>
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          )}

          {/* Remaining posts */}
          {rest.length > 0 && (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {rest.map((post, i) => (
                <StaggerItem key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block h-full hairline bg-paper-warm rounded-2xl overflow-hidden transition duration-300 hover:border-ink/25 hover:-translate-y-0.5"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden hairline-b">
                      <Image
                        src={resolveImage(post.slug, post.category)}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <div className="p-6 md:p-8 flex flex-col">
                      <div className="mono-label text-ink/50 mb-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span>
                          {String(i + 2).padStart(2, "0")}
                        </span>
                        <span>{post.date}</span>
                        <span>
                          {post.readTime} {s.minRead}
                        </span>
                        <span className="text-amber-700">
                          {s.categories[
                            post.category as keyof typeof s.categories
                          ] || post.category}
                        </span>
                      </div>
                      <h3 className="font-serif text-ink text-[1.375rem] md:text-[1.625rem] leading-[1.15] tracking-[-0.015em] mb-3 text-balance group-hover:text-ink/80 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-ink/70 leading-relaxed text-pretty line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink underline underline-offset-8 decoration-ink/20 decoration-1 group-hover:decoration-ink">
                        <span>{s.readMore}</span>
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-200 group-hover:translate-x-0.5"
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

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
                  {s.cta.headline}
                </h2>
                <p className="mt-5 max-w-xl text-paper/70 text-body-lg leading-relaxed text-pretty">
                  {s.cta.description}
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start gap-5 lg:items-end lg:justify-end">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2.5 bg-amber text-ink px-7 py-4 font-medium hairline hover:bg-paper transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
                >
                  <span>{s.cta.primaryCta}</span>
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
