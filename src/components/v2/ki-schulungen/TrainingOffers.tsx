"use client";

/**
 * KI-Schulungen v3: exactly three fixed offers. Copy is inline per locale
 * (DE/EN/TR kept side by side). No certificate claims, no client names.
 */

import { useLocale } from "@/context/LocaleContext";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";

type Offer = {
  name: string;
  format: string;
  price: string;
  body: string;
  note?: string;
  cta: string;
  href: string;
};

const COPY = {
  de: {
    eyebrow: "KI-Schulungen",
    headline: "Drei feste Angebote, klar bepreist",
    lead: "Kein Baukasten, keine Abo-Modelle. Sie wählen das Format, das zu Ihrem Team passt.",
    offers: [
      {
        name: "KI-Quick-Check",
        format: "90 Minuten remote, mit schriftlichem Bericht",
        price: "ab 490 €",
        body: "Wir schauen gemeinsam, wo KI in Ihrem Alltag sinnvoll ist und wo nicht. Sie erhalten die Ergebnisse als kurzen schriftlichen Bericht.",
        note: "Die ersten 3 Piloten sind kostenlos, im Austausch gegen ehrliches Feedback.",
        cta: "Quick-Check buchen",
        href: "/ai-automation-check",
      },
      {
        name: "KI-Kompetenz Basis",
        format: "Halber Tag, bis zu 15 Personen",
        price: "1.490 €",
        body: "Grundlagen für den sicheren Umgang mit KI im Arbeitsalltag. Durchgeführt von einem geprüften freiberuflichen Trainer. Unterstützt Ihre Maßnahmen zur KI-Kompetenz nach Art. 4 der EU-KI-Verordnung.",
        cta: "Anfrage senden",
        href: "/contact",
      },
      {
        name: "Copilot Praxis-Tag",
        format: "1 Tag, bis zu 12 Personen",
        price: "ab 2.400 €",
        body: "Praktische Arbeit mit Microsoft 365 Copilot an Ihren eigenen Aufgaben. Für Firmen, die bereits Copilot-Lizenzen haben.",
        cta: "Anfrage senden",
        href: "/contact",
      },
    ] as Offer[],
  },
  en: {
    eyebrow: "AI training",
    headline: "Three fixed offers, clearly priced",
    lead: "No building blocks, no subscriptions. You pick the format that fits your team.",
    offers: [
      {
        name: "AI Quick Check",
        format: "90-minute remote session with a written report",
        price: "from €490",
        body: "Together we look at where AI makes sense in your daily work and where it does not. You get the results as a short written report.",
        note: "The first 3 pilots are free, in exchange for honest feedback.",
        cta: "Book the Quick Check",
        href: "/ai-automation-check",
      },
      {
        name: "AI Literacy Basics",
        format: "Half day, up to 15 people",
        price: "€1,490",
        body: "Fundamentals for using AI safely at work. Delivered by a vetted freelance trainer. Supports your measures for AI literacy under Art. 4 of the EU AI Act.",
        cta: "Send an inquiry",
        href: "/contact",
      },
      {
        name: "Copilot Practice Day",
        format: "1 day, up to 12 people",
        price: "from €2,400",
        body: "Hands-on work with Microsoft 365 Copilot on your own tasks. For companies that already hold Copilot licenses.",
        cta: "Send an inquiry",
        href: "/contact",
      },
    ] as Offer[],
  },
  tr: {
    eyebrow: "YZ eğitimleri",
    headline: "Net fiyatlı üç sabit teklif",
    lead: "Modüler paket yok, abonelik yok. Ekibinize uyan formatı seçersiniz.",
    offers: [
      {
        name: "YZ Hızlı Kontrol",
        format: "90 dakika uzaktan, yazılı raporla",
        price: "490 €'dan",
        body: "Günlük işinizde YZ'nin nerede anlamlı olduğunu, nerede olmadığını birlikte inceleriz. Sonuçları kısa bir yazılı rapor olarak alırsınız.",
        note: "İlk 3 pilot, dürüst geri bildirim karşılığında ücretsizdir.",
        cta: "Hızlı kontrolü ayarla",
        href: "/ai-automation-check",
      },
      {
        name: "YZ Yetkinliği Temel",
        format: "Yarım gün, en fazla 15 kişi",
        price: "1.490 €",
        body: "İş yerinde YZ'yi güvenle kullanmanın temelleri. Seçilmiş bir serbest eğitmen tarafından verilir. AB Yapay Zeka Tüzüğü md. 4 kapsamındaki YZ yetkinliği önlemlerinizi destekler.",
        cta: "Talep gönder",
        href: "/contact",
      },
      {
        name: "Copilot Uygulama Günü",
        format: "1 gün, en fazla 12 kişi",
        price: "2.400 €'dan",
        body: "Microsoft 365 Copilot ile kendi görevlerinizde uygulamalı çalışma. Zaten Copilot lisansı olan şirketler için.",
        cta: "Talep gönder",
        href: "/contact",
      },
    ] as Offer[],
  },
} as const;

export function TrainingOffers() {
  const { locale } = useLocale();
  const c = COPY[locale === "de" || locale === "tr" ? locale : "en"];

  return (
    <main>
      <section className="os-section">
        <div className="wrap">
          <div className="os-section-head">
            <span className="meta meta-hot">{c.eyebrow}</span>
            {/* Tailwind preflight resets bare headings to body size; reuse the page-hero style. */}
            <h1 className="v2-svc-hero__headline" style={{ margin: "12px 0 20px" }}>{c.headline}</h1>
            <p className="lead">{c.lead}</p>
          </div>
          <div className="v2-built__grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {c.offers.map((o) => (
              <article key={o.name} className="v2-built__card">
                <span className="v2-home-hero__chip">{o.format}</span>
                <h2 style={{ fontSize: "1.5rem", margin: 0 }}>{o.name}</h2>
                <p style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>{o.price}</p>
                <p>{o.body}</p>
                {o.note && <p><strong>{o.note}</strong></p>}
                <div className="v2-built__links">
                  <Link href={o.href} className="v2-btn-primary">{o.cta}</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
