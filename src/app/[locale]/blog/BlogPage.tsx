"use client";

import { useState } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import Image from "next/image";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/AnimatedSection";
import { useLocale } from "@/context/LocaleContext";

const categoryGradients: Record<string, string> = {
  automation: "from-brand-500 via-brand-600 to-accent-600",
  integration: "from-teal-500 via-teal-600 to-brand-600",
  ai: "from-accent-500 via-accent-600 to-brand-600",
  operations: "from-teal-500 via-brand-500 to-accent-500",
};

/* Unsplash images mapped by slug for precise control */
const blogImages: Record<string, string> = {
  "why-n8n-is-the-future-of-workflow-automation":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
  "5-signs-your-business-needs-process-automation":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  "connecting-crm-erp-the-integration-playbook":
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
  "ai-chatbots-vs-rule-based-bots":
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
  "make-vs-zapier-vs-n8n-comparison":
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop",
  "whatsapp-business-automation-guide":
    "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&h=400&fit=crop",
};

/* Fallback images by category if slug not found */
const categoryImages: Record<string, string> = {
  automation:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
  operations:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  integration:
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
  ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
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

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-hero-mesh" />
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent-500/8 rounded-full blur-3xl" />
        </div>
        <div className="container-wide text-center">
          <AnimatedSection>
            <Badge variant="gradient" className="mb-4">{s.hero.label}</Badge>
            <h1 className="text-display-sm md:text-display font-bold text-white text-balance max-w-4xl mx-auto">
              {s.hero.headline}
            </h1>
            <p className="mt-5 text-body-lg text-slate-300 max-w-2xl mx-auto">
              {s.hero.description}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-slate-100">
        <div className="container-wide">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categoryKeys.map((key) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeCategory === key
                    ? "bg-brand-600 text-white shadow-glow-brand"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s.categories[key]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-padding">
        <div className="container-wide">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, i) => {
              const imageUrl =
                blogImages[post.slug] ||
                categoryImages[post.category] ||
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop";

              return (
                <StaggerItem key={i}>
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <article className="group rounded-2xl border border-slate-200/60 bg-white overflow-hidden hover:shadow-medium hover:border-slate-300 transition-all duration-300 h-full flex flex-col">
                      {/* Image Header with Unsplash photo */}
                      <div className="relative h-44 overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {/* Gradient overlay for contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                        {/* Subtle color tint matching category */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${
                            categoryGradients[post.category] || "from-brand-500 to-accent-600"
                          } opacity-20 mix-blend-multiply`}
                        />
                        <div className="absolute bottom-4 left-4">
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/20 text-white backdrop-blur-sm border border-white/10">
                            {s.categories[post.category as keyof typeof s.categories] || post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {post.readTime} {s.minRead}
                          </span>
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900 group-hover:text-brand-700 transition-colors mb-2 line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-sm text-slate-500 leading-relaxed flex-1 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:gap-2 transition-all">
                          {s.readMore} <ArrowRight size={14} />
                        </div>
                      </div>
                    </article>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <AnimatedSection>
            <div className="relative rounded-2xl gradient-cta px-8 py-16 md:px-20 md:py-20 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-400/10 rounded-full blur-3xl" />
              <div className="relative z-10 max-w-xl mx-auto">
                <h2 className="text-heading-lg md:text-display-sm font-bold text-white">
                  {s.cta.headline}
                </h2>
                <p className="mt-4 text-body text-slate-300">
                  {s.cta.description}
                </p>
                <Link href="/contact" className="mt-8 inline-block">
                  <Button size="xl" className="bg-white text-slate-900 hover:bg-slate-100">
                    {s.cta.primaryCta}
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
