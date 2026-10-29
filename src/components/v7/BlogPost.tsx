import Link from "next/link";
import { getPostContent, getReadMinutes } from "@/content/blog";
import { LABEL } from "@/content/v7/site";
import { SITE_CONFIG, SITE_UPDATED_ISO } from "@/lib/constants";
import { ogImage } from "@/lib/seo-v4";
import { absUrl, href, type L3 } from "@/lib/v7-routes";
import { BLOG, BLOG_T, fmtDate } from "./BlogList";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { CtaBand } from "./CtaBand";
import { JsonLdGraph, sharedNodes } from "./JsonLd";
import { Frame, PlainHero } from "./LegalPage";
import { LinkTo } from "./LinkTo";
import { MotionRoot } from "./MotionRoot";
import { Prose } from "./Prose";
import { linkDeep } from "./ui";

const ORG = `${SITE_CONFIG.url}/#organization`;
const PERSON = `${SITE_CONFIG.url}/#person`;

const L: Record<L3, { read: string; min: string; by: string; prev: string; next: string; nav: string; body: string }> = {
  de: { read: "Lesezeit", min: "Min.", by: "Von OpSolid", prev: "Vorheriger Beitrag", next: "Nächster Beitrag", nav: "Weitere Beiträge", body: "Beitrag" },
  en: { read: "Reading time", min: "min", by: "By OpSolid", prev: "Previous entry", next: "Next entry", nav: "More entries", body: "Entry" },
  tr: { read: "Okuma süresi", min: "dk", by: "Yazar: OpSolid", prev: "Önceki yazı", next: "Sonraki yazı", nav: "Diğer yazılar", body: "Yazı" },
};

/** BlogPosting + WebPage + BreadcrumbList, with the full organization and founder nodes the article points to. */
function BlogPostLd({ locale, slug, crumbs, post }: { locale: L3; slug: string; crumbs: Crumb[]; post: { title: string; excerpt: string; date: string; category: string } }) {
  const url = absUrl("blog", locale, `/${slug}`);
  const graph = [
    ...sharedNodes(locale),
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      mainEntityOfPage: { "@id": `${url}#webpage` },
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: post.date,
      inLanguage: locale,
      image: `${SITE_CONFIG.url}${ogImage(locale).url}`,
      articleSection: post.category,
      author: { "@id": PERSON },
      publisher: { "@id": ORG },
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: post.title,
      description: post.excerpt,
      inLanguage: locale,
      isPartOf: { "@id": `${SITE_CONFIG.url}/#website` },
      dateModified: SITE_UPDATED_ISO,
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${SITE_CONFIG.url}${c.path}` })),
    },
  ];
  return <JsonLdGraph nodes={graph} />;
}

/** One journal entry: breadcrumb, hero with date and reading time, prose body, neighbours, CTA band. */
export function BlogPost({ locale, slug }: { locale: L3; slug: string }) {
  const t = BLOG_T[locale];
  const l = L[locale];
  const posts = BLOG[locale].posts;
  const idx = posts.findIndex((p) => p.slug === slug);
  const post = posts[idx];
  const body = getPostContent(slug, locale);
  const prev = idx > 0 ? posts[idx - 1] : null;
  const next = idx >= 0 && idx < posts.length - 1 ? posts[idx + 1] : null;
  const crumbs: Crumb[] = [
    { name: LABEL[locale].home, path: href("home", locale), key: "home" },
    { name: LABEL[locale].blog, path: href("blog", locale), key: "blog" },
    { name: post.title, path: href("blog", locale, { sub: `/${slug}` }) },
  ];
  const mins = getReadMinutes(slug, locale);
  return (
    <MotionRoot>
      <div className="v7">
        <Breadcrumbs crumbs={crumbs} locale={locale} />
        <PlainHero
          small
          eyebrow={
            <>
              <time dateTime={post.date}>{fmtDate(post.date, locale)}</time> · {t.cat[post.category] ?? post.category} · {l.read} {mins} {l.min}
            </>
          }
          h1={post.title}
          lede={post.excerpt}
        >
          <p className="v7-rise f-mono mt-8 text-[12px] uppercase text-[#6B665F]" style={{ ["--d" as string]: "240ms" }}>
            {l.by}
          </p>
        </PlainHero>
        <div className="mt-16 md:mt-24">
          <Frame label={l.body}>
            <article>
              <Prose>{body ? <div dangerouslySetInnerHTML={{ __html: body }} /> : <p>{post.excerpt}</p>}</Prose>
            </article>
            <div className="mt-14">
              <LinkTo link={t.more} locale={locale} className={linkDeep}>
                {t.more.label}
                <span aria-hidden="true">→</span>
              </LinkTo>
            </div>
          </Frame>
        </div>
        {(prev || next) && (
          <nav aria-label={l.nav} className="mt-16 md:mt-24">
            <Frame label={l.nav}>
              <ul className="grid gap-x-8 border-t border-[#16191D] md:grid-cols-2">
                {[
                  { p: prev, label: `← ${l.prev}` },
                  { p: next, label: `${l.next} →` },
                ].map(({ p, label }, i) => (
                  <li key={i} className={`border-b border-[#E3DCD1] ${i === 1 ? "md:text-right" : ""}`}>
                    {p && (
                      <Link href={href("blog", locale, { sub: `/${p.slug}` })} className="block py-6">
                        <span className="f-mono text-[12px] uppercase text-[#8A4524]">{label}</span>
                        <span className="f-display mt-2 block text-[1.25rem] leading-[1.2]">{p.title}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </Frame>
          </nav>
        )}
        <CtaBand cta={t.cta} locale={locale} />
        <BlogPostLd locale={locale} slug={slug} crumbs={crumbs} post={post} />
      </div>
    </MotionRoot>
  );
}
