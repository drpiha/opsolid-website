"use client";

/**
 * BlogV2 — masonry card grid in the Concrete Studio register.
 *
 * Per docs/redesign-prompt.md §2 Blog:
 *   - Newest article spans full width as a featured card (large cover,
 *     title, date, read-time).
 *   - Remaining articles in a 3-column grid below.
 *   - Cards stagger-fade on scroll entry. Hover halo reveals reading-time.
 *
 * Source data: the existing blog index (src/content/blog/index.ts).
 * This component just renders the cards in the new register; the blog
 * post pages themselves are unchanged in this milestone.
 */

import { useLocale } from "@/context/LocaleContext";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";

const COPY = {
  de: {
    eyebrow: "Wissen",
    headline: "Notizen aus der Praxis",
    lead: "Was wir aus konkreten Automatisierungsprojekten lernen — kurz, technisch, ohne Buzzwords.",
    readLabel: "Lesen",
  },
  en: {
    eyebrow: "Insights",
    headline: "Notes from the field",
    lead: "What we learn from real automation engagements — short, technical, no buzzwords.",
    readLabel: "Read",
  },
  tr: {
    eyebrow: "Notlar",
    headline: "Sahadan notlar",
    lead: "Gerçek otomasyon projelerinden öğrendiklerimiz — kısa, teknik, buzzword'süz.",
    readLabel: "Oku",
  },
} as const;

type PostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date?: string;
  readingTime?: string;
};

export function BlogV2() {
  const { locale, t } = useLocale();
  const lang: keyof typeof COPY =
    locale === "de" || locale === "en" || locale === "tr" ? locale : "en";
  const c = COPY[lang];
  const raw = (t as unknown as { blog?: { posts?: PostMeta[] } })?.blog?.posts ?? [];
  const posts = [...raw].sort((a, b) =>
    (b.date ?? "").localeCompare(a.date ?? ""),
  );

  if (posts.length === 0) {
    return (
      <section className="v2-blog-hero">
        <div className="wrap v2-blog-hero__head">
          <span className="v2-blog-hero__eyebrow">{c.eyebrow}</span>
          <h1 className="v2-blog-hero__headline">{c.headline}</h1>
          <p className="v2-blog-hero__lead">{c.lead}</p>
        </div>
      </section>
    );
  }

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <section className="v2-blog-hero">
      <div className="wrap v2-blog-hero__head">
        <span className="v2-blog-hero__eyebrow">{c.eyebrow}</span>
        <h1 className="v2-blog-hero__headline">{c.headline}</h1>
        <p className="v2-blog-hero__lead">{c.lead}</p>
      </div>

      <div className="wrap v2-blog-grid">
        <Link
          href={`/blog/${featured.slug}`}
          className="v2-blog-card v2-blog-card--featured"
          data-cursor="link"
        >
          <div className="v2-blog-card__cover" aria-hidden="true" />
          <div className="v2-blog-card__body">
            <span className="v2-blog-card__meta">
              {featured.date} · {featured.readingTime ?? "5 min"}
            </span>
            <h2 className="v2-blog-card__title">{featured.title}</h2>
            <p className="v2-blog-card__excerpt">{featured.excerpt}</p>
            <span className="v2-blog-card__cta">{c.readLabel} →</span>
          </div>
        </Link>

        <div className="v2-blog-grid__rest">
          {rest.map((p, i) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="v2-blog-card"
              data-cursor="link"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="v2-blog-card__cover" aria-hidden="true" />
              <div className="v2-blog-card__body">
                <span className="v2-blog-card__meta">
                  {p.date} · {p.readingTime ?? "5 min"}
                </span>
                <h3 className="v2-blog-card__title">{p.title}</h3>
                <p className="v2-blog-card__excerpt">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
