import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs, getPostContent } from "@/content/blog";
import { content as de } from "@/content/de";
import { content as en } from "@/content/en";
import { content as tr } from "@/content/tr";
import { SITE_CONFIG } from "@/lib/constants";
import { withLocale, type Locale } from "@/lib/i18n";
import { pickLocale } from "@/lib/seo-v4";
import { Crumbs, CtaBand } from "@/components/v4/PageRenderer";
import { JsonLdGraph } from "@/components/v4/JsonLd";
import { getPage } from "@/content/v4";
import type { L3 } from "@/content/v4/types";

interface Props {
  params: { slug: string; locale: string };
}

const BLOG = { de: de.blog, en: en.blog, tr: tr.blog };
const L: Record<L3, { notes: string; home: string; by: string; read: string; min: string; prev: string; next: string; cat: Record<string, string> }> = {
  de: { notes: "Notizen", home: "Start", by: "Von Hasan Dönmez", read: "Lesezeit", min: "Min.", prev: "Vorheriger Text", next: "Nächster Text", cat: { automation: "Automatisierung", integration: "Integration", ai: "KI", operations: "Betrieb" } },
  en: { notes: "Notes", home: "Home", by: "By Hasan Dönmez", read: "Reading time", min: "min", prev: "Previous", next: "Next", cat: { automation: "Automation", integration: "Integration", ai: "AI", operations: "Operations" } },
  tr: { notes: "Notlar", home: "Ana sayfa", by: "Hasan Dönmez", read: "Okuma süresi", min: "dk", prev: "Önceki", next: "Sonraki", cat: { automation: "Otomasyon", integration: "Entegrasyon", ai: "YZ", operations: "Operasyon" } },
};

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loc = pickLocale(params.locale);
  const post = BLOG[loc].posts.find((p) => p.slug === params.slug) ?? getPostBySlug(params.slug);
  if (!post) return {};
  const path = `/blog/${params.slug}`;
  const abs = (l: string) => `${SITE_CONFIG.url}/${l}${path}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: abs(loc), languages: { de: abs("de"), en: abs("en"), tr: abs("tr"), "x-default": abs("de") } },
    openGraph: { title: post.title, description: post.excerpt, type: "article", url: abs(loc), publishedTime: post.date, siteName: SITE_CONFIG.name },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

export default function Page({ params }: Props) {
  if (!getPostBySlug(params.slug)) notFound();
  const loc = pickLocale(params.locale);
  const t = L[loc];
  const posts = BLOG[loc].posts;
  const idx = posts.findIndex((p) => p.slug === params.slug);
  const post = posts[idx] ?? getPostBySlug(params.slug)!;
  const body = getPostContent(params.slug, loc);
  const prev = idx > 0 ? posts[idx - 1] : null;
  const next = idx >= 0 && idx < posts.length - 1 ? posts[idx + 1] : null;
  const url = `${SITE_CONFIG.url}/${loc}/blog/${params.slug}`;
  const date = new Intl.DateTimeFormat(loc === "de" ? "de-DE" : loc === "tr" ? "tr-TR" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(post.date + "T00:00:00Z"));
  const cta = getPage(loc, "home").cta;

  return (
    <div className="v4-page">
      <JsonLdGraph
        locale={loc}
        slug={`blog/${params.slug}`}
        name={post.title}
        description={post.excerpt}
        crumbs={[
          { name: t.home, path: `/${loc}` },
          { name: t.notes, path: `/${loc}/blog` },
          { name: post.title, path: `/${loc}/blog/${params.slug}` },
        ]}
        extra={[
          {
            "@type": "BlogPosting",
            "@id": `${url}#article`,
            mainEntityOfPage: { "@id": `${url}#webpage` },
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.date,
            inLanguage: loc,
            articleSection: post.category,
            author: { "@id": `${SITE_CONFIG.url}/#person` },
            publisher: { "@id": `${SITE_CONFIG.url}/#organization` },
          },
        ]}
      />
      <section className="v4-sec is-hero" data-scene="stack" data-dim="1" style={{ minHeight: 0 }}>
        <div className="v4-in">
          <div className="v4-col is-wide">
            <Crumbs locale={loc} trail={[{ label: t.notes, to: "/blog" }, { label: post.title }]} />
            <p className="v4-eyebrow">
              <time dateTime={post.date}>{date}</time> · {t.cat[post.category] ?? post.category} · {t.read} {post.readTime} {t.min}
            </p>
            <h1 className="v4-h1" style={{ fontSize: "clamp(2rem, 4.6vw, 3.8rem)" }}>
              {post.title}
            </h1>
            <p className="v4-lede">{post.excerpt}</p>
            <p className="v4-stand">{t.by}</p>
          </div>
        </div>
      </section>
      <section className="v4-sec is-flow" style={{ paddingTop: 0 }}>
        <div className="v4-in">
          <article className="v4-col is-wide v4-prose">
            {body ? <div dangerouslySetInnerHTML={{ __html: body }} /> : <p>{post.excerpt}</p>}
          </article>
        </div>
      </section>
      {(prev || next) && (
        <nav className="v4-sec is-flow" style={{ paddingTop: 0 }} aria-label={t.notes}>
          <div className="v4-in">
            <div className="v4-col is-wide v4-pn">
              {prev ? (
                <Link href={withLocale(`/blog/${prev.slug}`, loc as Locale)} className="v4-row-in">
                  <span className="v4-eyebrow">← {t.prev}</span>
                  <span className="v4-row-h">{prev.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={withLocale(`/blog/${next.slug}`, loc as Locale)} className="v4-row-in">
                  <span className="v4-eyebrow">{t.next} →</span>
                  <span className="v4-row-h">{next.title}</span>
                </Link>
              ) : (
                <span />
              )}
            </div>
          </div>
        </nav>
      )}
      <CtaBand cta={cta} locale={loc} />
    </div>
  );
}
