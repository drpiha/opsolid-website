"use client";

import { useState } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import Image from "next/image";
import { Clock, Calendar, ArrowRight } from "lucide-react";
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
        className="relative pt-32 md:pt-40 pb-10 md:pb-14 bg-white"
      >
        <div className="container-wide">
          <AnimatedSection className="max-w-3xl">
            <div className="eyebrow uppercase text-brand mb-4">{s.hero.label}</div>
            <h1
              id="blog-title"
              className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink text-balance"
            >
              {s.hero.headline}
            </h1>
            <p className="mt-6 md:mt-8 text-ink/70 text-body-lg leading-relaxed max-w-2xl text-pretty">
              {s.hero.description}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Category filter */}
      <section className="bg-white">
        <div className="container-wide py-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categoryKeys.map((key) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2",
                  activeCategory === key
                    ? "bg-ink text-white"
                    : "bg-neutral-100 text-ink/70 hover:bg-neutral-200 hover:text-ink"
                )}
              >
                {s.categories[key]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured + grid */}
      <section className="section-sm bg-neutral-50">
        <div className="container-wide">
          {/* Featured post — big 16:9 pop-card hero */}
          {featured && (
            <AnimatedSection className="mb-12 md:mb-16">
              <Link
                href={`/blog/${featured.slug}`}
                className="pop-card group block overflow-hidden p-0"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={resolveImage(featured.slug, featured.category)}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 1200px"
                    priority
                  />
                </div>
                <div className="p-6 md:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="trust-pill bg-brand/10 text-brand">
                      Featured
                    </span>
                    <span className="eyebrow uppercase text-ink/50">
                      {s.categories[
                        featured.category as keyof typeof s.categories
                      ] || featured.category}
                    </span>
                  </div>
                  <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-ink mb-4 text-balance group-hover:text-brand transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-ink/70 text-body leading-relaxed text-pretty line-clamp-3 max-w-3xl">
                    {featured.excerpt}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ink/50">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} aria-hidden="true" />
                      {featured.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} aria-hidden="true" />
                      {featured.readTime} {s.minRead}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-brand transition-colors">
                      <span>{s.readMore}</span>
                      <ArrowRight
                        size={14}
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          )}

          {/* 3-column grid */}
          {rest.length > 0 && (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {rest.map((post) => (
                <StaggerItem key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="pop-card group block h-full overflow-hidden p-0"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={resolveImage(post.slug, post.category)}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-6 md:p-7 flex flex-col">
                      <div className="eyebrow uppercase text-brand mb-3">
                        {s.categories[
                          post.category as keyof typeof s.categories
                        ] || post.category}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-ink tracking-[-0.015em] leading-snug mb-3 text-balance group-hover:text-brand transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-ink/70 leading-relaxed text-pretty line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="mt-5 flex items-center gap-4 text-xs text-ink/50">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} aria-hidden="true" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} aria-hidden="true" />
                          {post.readTime} {s.minRead}
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
      <section className="section-sm bg-white">
        <div className="container-wide">
          <AnimatedSection>
            <div className="pop-card p-10 md:p-14 text-center max-w-3xl mx-auto">
              <div className="eyebrow uppercase text-brand mb-4">Next step</div>
              <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink text-balance">
                {s.cta.headline}
              </h2>
              <p className="mt-5 max-w-xl mx-auto text-ink/70 text-body leading-relaxed text-pretty">
                {s.cta.description}
              </p>
              <div className="mt-8 flex justify-center">
                <Link href="/contact" className="btn-primary">
                  <span>{s.cta.primaryCta}</span>
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
