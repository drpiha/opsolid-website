import Link from "next/link";
import { content as de } from "@/content/de";
import { content as en } from "@/content/en";
import { content as tr } from "@/content/tr";
import { getReadMinutes } from "@/content/blog";
import { LABEL } from "@/content/v7/site";
import type { Cta, Href } from "@/content/v7/types";
import { soft } from "@/lib/soft-hyphen";
import { href, type L3 } from "@/lib/v7-routes";
import type { Crumb } from "./Breadcrumbs";
import { CtaBand } from "./CtaBand";
import { JsonLdGraph, sharedNodes, webPageNodes } from "./JsonLd";
import { Frame, PlainHero } from "./LegalPage";
import { LinkTo } from "./LinkTo";
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
    /** CTA under posts outside the "training" category (the list page itself ends with the training CTA). */
    cta: Cta;
    /** Posts in the "training" category, and the list page, end with a link to the training hub and the training CTA. */
    training: { more: Href; cta: Cta };
  }
> = {
  de: {
    eyebrow: "Journal",
    h1: ["KI im Unternehmen:", "Schulung und Regeln"],
    lede: "Kurze Texte zu KI-Schulungen, zur KI-Verordnung und dazu, was im Arbeitsalltag zählt.",
    title: "Journal: KI-Schulung und KI-Regeln im Unternehmen",
    desc: "Das OpSolid Journal: kurze Texte zu KI-Schulungen, ihren Kosten und der KI-Verordnung (Art. 4). Was Unternehmen wissen sollten, bevor sie ihr Team schulen.",
    frame: "Beiträge",
    frameNote: "Neueste zuerst.",
    read: "Lesen",
    min: "Min.",
    more: { label: "Zu den KI-Schulungen", to: "schulungen" },
    cat: { automation: "Automatisierung", integration: "Integration", ai: "KI", operations: "Betrieb", training: "Schulung" },
    cta: {
      label: "KI-Check",
      h: "Welcher Ablauf kostet Sie heute die meiste Zeit?",
      p: "Im Kennenlernen klären wir, ob ein KI-Check sinnvoll ist, kostenlos und unverbindlich. Der KI-Check kostet 990 € netto, Festpreis. Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir ihn voll an. Alle Preise netto zzgl. USt., nur für Unternehmen.",
      primary: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
      secondary: { label: "Den KI-Check ansehen", to: "check" },
    },
    training: {
      more: { label: "Zu den KI-Schulungen", to: "schulungen" },
      cta: {
        label: "Schulung anfragen",
        h: "Welches Team soll sicherer mit KI arbeiten?",
        p: "Schreiben Sie uns kurz zu Team, Aufgaben und Sprache. Wir empfehlen die passende Schulung und nennen den Preis pro Team.",
        primary: { label: "Schulung anfragen", to: "kontakt", query: { anliegen: "schulung" } },
        secondary: { label: "Erst analysieren: zum KI-Check", to: "check" },
      },
    },
  },
  en: {
    eyebrow: "Journal",
    h1: ["AI at work:", "training and rules"],
    lede: "Short texts on AI training, the EU AI Act and what matters in daily work.",
    title: "Journal: AI training and AI rules at work",
    desc: "The OpSolid journal: short texts on AI training, what it costs and the EU AI Act (Article 4). What companies should know before they train their team.",
    frame: "Entries",
    frameNote: "Newest first.",
    read: "Read",
    min: "min",
    more: { label: "To AI training", to: "schulungen" },
    cat: { automation: "Automation", integration: "Integration", ai: "AI", operations: "Operations", training: "Training" },
    cta: {
      label: "AI check",
      h: "Which workflow costs you the most time today?",
      p: "In a free intro, without obligation, we clarify whether an AI check makes sense. The AI check costs €990 net, fixed price. Credited in full against a follow-up order within 60 days. All prices are net of VAT and for businesses only.",
      primary: { label: "Request an AI check", to: "kontakt", query: { anliegen: "ki-check" } },
      secondary: { label: "See the AI check", to: "check" },
    },
    training: {
      more: { label: "To AI training", to: "schulungen" },
      cta: {
        label: "Request training",
        h: "Which team should work with AI more safely?",
        p: "Tell us briefly about your team, tasks and language. We recommend the right course and name the price per team.",
        primary: { label: "Request training", to: "kontakt", query: { anliegen: "schulung" } },
        secondary: { label: "Analyse first: to the AI check", to: "check" },
      },
    },
  },
  tr: {
    eyebrow: "Notlar",
    h1: ["İş yerinde YZ:", "eğitim ve kurallar"],
    lede: "YZ eğitimleri, AB Yapay Zekâ Tüzüğü ve günlük işte nelerin önemli olduğu üzerine kısa yazılar.",
    title: "Notlar: iş yerinde YZ eğitimi ve kuralları",
    desc: "OpSolid notları: YZ eğitimleri, maliyetleri ve AB Yapay Zekâ Tüzüğü (Madde 4) üzerine kısa yazılar. Şirketlerin ekibini eğitmeden önce bilmesi gerekenler.",
    frame: "Yazılar",
    frameNote: "En yeni üstte.",
    read: "Oku",
    min: "dk",
    more: { label: "YZ eğitimlerine", to: "schulungen" },
    cat: { automation: "Otomasyon", integration: "Entegrasyon", ai: "YZ", operations: "İşletme", training: "Eğitim" },
    cta: {
      label: "YZ Kontrolü",
      h: "Bugün en çok zamanınızı hangi iş akışı alıyor?",
      p: "Ücretsiz ve bağlayıcı olmayan tanışmada bir YZ Kontrolünün anlamlı olup olmadığını netleştiririz. YZ Kontrolünün ücreti 990 € (net, sabit fiyat). 60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir. Tüm fiyatlar KDV hariçtir; yalnızca şirketler içindir.",
      primary: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
      secondary: { label: "YZ Kontrolünü görün", to: "check" },
    },
    training: {
      more: { label: "YZ eğitimlerine", to: "schulungen" },
      cta: {
        label: "Eğitim talep edin",
        h: "Hangi ekip YZ ile daha güvenle çalışmalı?",
        p: "Ekibiniz, görevleriniz ve dil hakkında kısaca yazın. Size uygun eğitimi önerir ve ekip başına fiyatı bildiririz.",
        primary: { label: "Eğitim talep edin", to: "kontakt", query: { anliegen: "schulung" } },
        secondary: { label: "Önce analiz: YZ Kontrolü'ne gidin", to: "check" },
      },
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
    <div className="v7">
      <PlainHero eyebrow={t.eyebrow} h1={`${t.h1[0]} ${t.h1[1]}`} lede={t.lede} crumbs={crumbs} locale={locale} />
      <section id="beitraege" aria-label={t.frame} className="wk-sec">
        <Frame label={t.frame} note={t.frameNote}>
          <ul>
            {posts.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 0.04} className="relative grid gap-x-8 gap-y-3 border-b border-wk-line-2 py-8 transition-colors hover:bg-[color-mix(in_srgb,var(--wk-copper)_6%,transparent)] md:grid-cols-[11rem_minmax(0,1fr)] md:py-10">
                <p className="f-mono text-[13px] leading-[1.6] text-wk-muted">
                  <time dateTime={p.date}>{fmtDate(p.date, locale)}</time>
                  <span className="mt-1 block text-wk-copper-deep">
                    {t.cat[p.category] ?? p.category} · {getReadMinutes(p.slug, locale)} {t.min}
                  </span>
                </p>
                <div className="min-w-0">
                  <h2 className="wk-h3 md:text-[1.875rem]">
                    <Link href={href("blog", locale, { sub: `/${p.slug}` })} className="after:absolute after:inset-0 after:content-['']">
                      {soft(p.title)}
                    </Link>
                  </h2>
                  <p className="mt-3 max-w-[60ch] text-wk-muted">{p.excerpt}</p>
                  <p aria-hidden="true" className="mt-3 text-[16px] font-semibold text-wk-copper-deep">
                    {t.read} →
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
          <div className="mt-10">
            <LinkTo link={t.more} locale={locale} className={`${linkDeep} v7-link`}>
              {t.more.label}
              <span aria-hidden="true">→</span>
            </LinkTo>
          </div>
        </Frame>
      </section>
      <CtaBand cta={t.training.cta} locale={locale} />
      <JsonLdGraph nodes={[...sharedNodes(locale), ...webPageNodes({ key: "blog", locale, name: t.title, description: t.desc, crumbs })]} />
    </div>
  );
}
