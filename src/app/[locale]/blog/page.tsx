import type { Metadata } from "next";
import Link from "next/link";
import { content as de } from "@/content/de";
import { content as en } from "@/content/en";
import { content as tr } from "@/content/tr";
import { withLocale, type Locale } from "@/lib/i18n";
import { pageMetadata, pickLocale } from "@/lib/seo-v4";
import { Crumbs, CtaBand } from "@/components/v4/PageRenderer";
import { JsonLdGraph } from "@/components/v4/JsonLd";
import { soft } from "@/lib/soft-hyphen";
import { Reveal } from "@/components/v4/Reveal";
import { getPage } from "@/content/v4";
import { getReadMinutes } from "@/content/blog";
import type { L3 } from "@/content/v4/types";

type Params = { params: { locale?: string } };

const T: Record<L3, { crumb: string; eyebrow: string; h1: [string, string, string]; lede: string; read: string; min: string; title: string; desc: string; cat: Record<string, string> }> = {
  de: {
    crumb: "Notizen",
    eyebrow: "Notizen aus der Praxis",
    h1: ["Kurz, technisch, ", "ohne Buzzwords", "."],
    lede: "Kurze Texte darüber, was in Automatisierungs- und KI-Projekten funktioniert und worauf es im laufenden Betrieb ankommt.",
    read: "Lesen",
    min: "Min.",
    title: "Notizen aus der Praxis: Automatisierung und KI",
    desc: "Kurze, praxisnahe Texte von OpSolid zu Automatisierung, Integration, KI und Betrieb: was in Projekten funktioniert und worauf Unternehmen achten sollten.",
    cat: { automation: "Automatisierung", integration: "Integration", ai: "KI", operations: "Betrieb" },
  },
  en: {
    crumb: "Notes",
    eyebrow: "Notes from the field",
    h1: ["Short, technical, ", "no buzzwords", "."],
    lede: "Short texts on what works in automation and AI projects and what matters once a system is in daily use.",
    read: "Read",
    min: "min",
    title: "Notes from the field: automation and AI",
    desc: "Short, practical notes from OpSolid on automation, integration, AI and operations: what works in real projects and what businesses should look out for.",
    cat: { automation: "Automation", integration: "Integration", ai: "AI", operations: "Operations" },
  },
  tr: {
    crumb: "Notlar",
    eyebrow: "Sahadan notlar",
    h1: ["Kısa, teknik, ", "abartısız", "."],
    lede: "Otomasyon ve YZ projelerinde neyin işe yaradığını ve sistemler günlük kullanıma girdiğinde nelerin önemli olduğunu anlatan kısa yazılar.",
    read: "Oku",
    min: "dk",
    title: "Sahadan notlar: otomasyon ve YZ",
    desc: "OpSolid'den otomasyon, entegrasyon, YZ ve operasyon üzerine kısa, pratik yazılar: projelerde neyin işe yaradığı ve nelere dikkat edilmesi gerektiği.",
    cat: { automation: "Otomasyon", integration: "Entegrasyon", ai: "YZ", operations: "Operasyon" },
  },
};

const BLOG = { de: de.blog, en: en.blog, tr: tr.blog };

export function generateMetadata({ params }: Params): Metadata {
  const loc = pickLocale(params?.locale);
  return pageMetadata(loc, "blog", { title: T[loc].title, description: T[loc].desc });
}

export default function Page({ params }: Params) {
  const loc = pickLocale(params?.locale);
  const t = T[loc];
  const posts = [...BLOG[loc].posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const date = (d: string) => new Intl.DateTimeFormat(loc === "de" ? "de-DE" : loc === "tr" ? "tr-TR" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(d + "T00:00:00Z"));
  const cta = getPage(loc, "home").cta;
  return (
    <div className="v4-page">
      <JsonLdGraph
        locale={loc}
        slug="blog"
        name={t.title}
        description={t.desc}
        kind="CollectionPage"
        crumbs={[
          { name: loc === "de" ? "Start" : loc === "tr" ? "Ana sayfa" : "Home", path: `/${loc}` },
          { name: t.crumb, path: `/${loc}/blog` },
        ]}
      />
      <section className="v4-sec is-hero" data-scene="stack" data-dim="1">
        <div className="v4-in">
          <div className="v4-col">
            <Crumbs locale={loc} trail={[{ label: t.crumb }]} />
            <span className="v4-eyebrow">{t.eyebrow}</span>
            <h1 className="v4-h1">
              {soft(t.h1[0])}
              <em>{soft(t.h1[1])}</em>
              {soft(t.h1[2])}
            </h1>
            <p className="v4-lede">{t.lede}</p>
          </div>
        </div>
      </section>
      <section className="v4-sec is-flow" aria-label={t.eyebrow}>
        <div className="v4-in">
          <div className="v4-col is-wide">
            <ul className="v4-rows" style={{ marginTop: 0 }}>
              {posts.map((p) => (
                <li key={p.slug} className="v4-row">
                  <Reveal>
                    <Link href={withLocale(`/blog/${p.slug}`, loc as Locale)} className="v4-row-in">
                      <p className="v4-eyebrow" style={{ margin: "0 0 8px" }}>
                        <time dateTime={p.date}>{date(p.date)}</time> · {t.cat[p.category] ?? p.category} · {getReadMinutes(p.slug, loc)} {t.min}
                      </p>
                      <h2 className="v4-row-h" style={{ fontSize: "1.35rem" }}>
                        {soft(p.title)}
                        <span aria-hidden="true">{t.read} →</span>
                      </h2>
                      <p className="v4-row-p">{p.excerpt}</p>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <CtaBand cta={cta} locale={loc} />
    </div>
  );
}
