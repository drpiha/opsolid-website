import Link from "next/link";
import { content as de } from "@/content/de";
import { content as en } from "@/content/en";
import { content as tr } from "@/content/tr";
import { getReadMinutes } from "@/content/blog";
import { LABEL } from "@/content/v7/site";
import type { Href, PageDef } from "@/content/v7/types";
import { href, type L3 } from "@/lib/v7-routes";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { CtaBand } from "./CtaBand";
import { JsonLdGraph, sharedNodes, webPageNodes } from "./JsonLd";
import { Frame, PlainHero } from "./LegalPage";
import { LinkTo } from "./LinkTo";
import { MotionRoot } from "./MotionRoot";
import { Reveal } from "./Reveal";
import { linkDeep } from "./ui";

export const BLOG = { de: de.blog, en: en.blog, tr: tr.blog };

export const BLOG_T: Record<
  L3,
  {
    eyebrow: string;
    h1: [string, string];
    lede: string;
    title: string;
    desc: string;
    frame: string;
    frameNote: string;
    read: string;
    min: string;
    more: Href;
    cat: Record<string, string>;
    cta: PageDef["cta"];
  }
> = {
  de: {
    eyebrow: "Journal",
    h1: ["Automatisierung und KI", "in der Praxis"],
    lede: "Kurze Texte dazu, was im Alltag funktioniert und im laufenden Betrieb zählt.",
    title: "Journal: Automatisierung und KI in der Praxis",
    desc: "Das OpSolid Journal: kurze Texte zu KI-Automatisierung, Integration und Betrieb. Was im Alltag funktioniert und worauf Unternehmen achten sollten.",
    frame: "Beiträge",
    frameNote: "Neueste zuerst.",
    read: "Lesen",
    min: "Min.",
    more: { label: "Zur KI-Beratung", to: "beratung" },
    cat: { automation: "Automatisierung", integration: "Integration", ai: "KI", operations: "Betrieb" },
    cta: {
      label: "KI-Check",
      h: "Welcher Ablauf kostet Sie heute die meiste Zeit?",
      p: "Im Kennenlernen klären wir, ob ein KI-Check sinnvoll ist, kostenlos und unverbindlich. Der KI-Check kostet ab 490 € netto.",
      primary: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
      secondary: { label: "Den KI-Check ansehen", to: "check" },
    },
  },
  en: {
    eyebrow: "Journal",
    h1: ["Automation and AI", "in practice"],
    lede: "Short texts on what works in daily business and what matters once a system is in use.",
    title: "Journal: automation and AI in practice",
    desc: "The OpSolid journal: short texts on AI automation, integration and operations. What works in daily business and what companies should look out for.",
    frame: "Entries",
    frameNote: "Newest first.",
    read: "Read",
    min: "min",
    more: { label: "To AI consulting", to: "beratung" },
    cat: { automation: "Automation", integration: "Integration", ai: "AI", operations: "Operations" },
    cta: {
      label: "AI check",
      h: "Which workflow costs you the most time today?",
      p: "In an introductory call, free and without obligation, we clarify whether an AI check makes sense. The AI check starts at €490 net.",
      primary: { label: "Request an AI check", to: "kontakt", query: { anliegen: "ki-check" } },
      secondary: { label: "See the AI check", to: "check" },
    },
  },
  tr: {
    eyebrow: "Notlar",
    h1: ["Uygulamada otomasyon ve YZ:", "sahadan notlar"],
    lede: "Günlük işte neyin işe yaradığını ve sistem kullanıma girdikten sonra nelerin önemli olduğunu anlatan kısa yazılar.",
    title: "Notlar: uygulamada otomasyon ve YZ",
    desc: "OpSolid notları: YZ otomasyonu, entegrasyon ve işletme üzerine kısa yazılar. Günlük işte neyin işe yaradığı ve şirketlerin nelere dikkat etmesi gerektiği.",
    frame: "Yazılar",
    frameNote: "En yeni üstte.",
    read: "Oku",
    min: "dk",
    more: { label: "Yapay zeka danışmanlığına", to: "beratung" },
    cat: { automation: "Otomasyon", integration: "Entegrasyon", ai: "YZ", operations: "İşletme" },
    cta: {
      label: "YZ Kontrolü",
      h: "Bugün en çok zamanınızı hangi iş akışı alıyor?",
      p: "Ücretsiz ve bağlayıcı olmayan tanışma görüşmesinde bir YZ Kontrolünün anlamlı olup olmadığını netleştiririz. YZ Kontrolü 490 €'dan başlar (net).",
      primary: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
      secondary: { label: "YZ Kontrolünü görün", to: "check" },
    },
  },
};

export function fmtDate(d: string, locale: L3): string {
  const tag = locale === "de" ? "de-DE" : locale === "tr" ? "tr-TR" : "en-GB";
  return new Intl.DateTimeFormat(tag, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(d + "T00:00:00Z"));
}

/** Journal list: hairline ledger of posts, newest first. Server component; posts come from the content bundles on the server only. */
export function BlogList({ locale }: { locale: L3 }) {
  const t = BLOG_T[locale];
  const posts = [...BLOG[locale].posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const crumbs: Crumb[] = [
    { name: LABEL[locale].home, path: href("home", locale), key: "home" },
    { name: LABEL[locale].blog, path: href("blog", locale), key: "blog" },
  ];
  return (
    <MotionRoot>
      <div className="v7">
        <Breadcrumbs crumbs={crumbs} locale={locale} />
        <PlainHero eyebrow={t.eyebrow} h1={<>{t.h1[0]} <em className="font-light italic text-[#B5623A]">{t.h1[1]}</em></>} lede={t.lede} />
        <section id="beitraege" aria-label={t.frame} className="mt-20 scroll-mt-20 md:mt-32">
          <Frame label={t.frame} note={t.frameNote}>
            <ul className="border-t border-[#16191D]">
              {posts.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={i * 0.04} className="relative grid gap-x-8 gap-y-3 border-b border-[#E3DCD1] py-8 md:grid-cols-9 md:py-10">
                  <p className="f-mono text-[12px] uppercase leading-[1.7] text-[#6B665F] md:col-span-3">
                    <time dateTime={p.date}>{fmtDate(p.date, locale)}</time>
                    <span className="mt-1 block text-[#8A4524]">
                      {t.cat[p.category] ?? p.category} <span className="text-[#B5623A]">·</span> {getReadMinutes(p.slug, locale)} {t.min}
                    </span>
                  </p>
                  <div className="md:col-span-6">
                    <h2 className="f-display text-[1.5rem] leading-[1.15] md:text-[1.875rem]">
                      <Link href={href("blog", locale, { sub: `/${p.slug}` })} className="after:absolute after:inset-0 after:content-['']">
                        {p.title}
                      </Link>
                    </h2>
                    <p className="mt-3 text-[#16191D]">{p.excerpt}</p>
                    <p aria-hidden="true" className="mt-3 text-[16px] font-medium text-[#8A4524]">
                      {t.read} →
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
            <div className="mt-10">
              <LinkTo link={t.more} locale={locale} className={linkDeep}>
                {t.more.label}
                <span aria-hidden="true">→</span>
              </LinkTo>
            </div>
          </Frame>
        </section>
        <CtaBand cta={t.cta} locale={locale} />
        <JsonLdGraph nodes={[...sharedNodes(locale), ...webPageNodes({ key: "blog", locale, name: t.title, description: t.desc, crumbs })]} />
      </div>
    </MotionRoot>
  );
}
