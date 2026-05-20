"use client";

/**
 * HomeOutcomes — post-pillar enrichment section. Three anonymized
 * outcome vignettes that ground the abstract pillar promises in
 * concrete hours-saved numbers, followed by a trust strip and a
 * large editorial CTA.
 *
 * All copy is inline per-locale because each vignette is a hand-
 * picked phrasing tuned for emotional weight, not a generic content
 * record — pulling these into the v2 content file would add three
 * new keys with shallow translations and slow the iteration loop.
 */

import { useLocale } from "@/context/LocaleContext";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";

const COPY = {
  de: {
    eyebrow: "Ergebnisse",
    headline: "Was bei anderen passiert ist",
    cases: [
      {
        sector: "Anlagenbau",
        outcome: "11 h / Woche",
        body: "Angebotsfreigaben automatisiert; CRM und ERP sprechen jetzt miteinander statt über Excel.",
      },
      {
        sector: "E-Commerce",
        outcome: "Inbox Zero",
        body: "Kundenanfragen werden klassifiziert, beantwortet oder eskaliert — bevor ein Mensch sie sieht.",
      },
      {
        sector: "Produktion",
        outcome: "0 Doppelerfassung",
        body: "Wartungsbelege fließen einmal aus dem Shopfloor durchs System — Excel-Pflege fällt weg.",
      },
    ],
    trustEyebrow: "Vertrauensbasis",
    trustLine: "Datenschutz auf deutscher Infrastruktur. AVV nach DSGVO. Keine US-Cloud ohne explizite Freigabe.",
    finalEyebrow: "Kostenfreies Erstgespräch",
    finalHeadline: { pre: "30 Minuten Analyse — ", em: "anschließend", post: " eine schriftliche Bewertung" },
    finalLead: "Ein strukturiertes Gespräch zu Ihrem konkreten Anwendungsfall. Wir erfassen die Ausgangslage, prüfen die Automatisierungspotenziale und übermitteln im Anschluss eine schriftliche Einschätzung. Kostenfrei und unverbindlich.",
    finalCta: "Termin vereinbaren",
    finalCtaSecondary: "AI & Automation Check anfragen",
  },
  en: {
    eyebrow: "Outcomes",
    headline: "What happened for others",
    cases: [
      {
        sector: "Industrial mfg",
        outcome: "11 h / week",
        body: "Quote approvals automated; CRM and ERP now talk to each other instead of going through Excel.",
      },
      {
        sector: "E-commerce",
        outcome: "Inbox Zero",
        body: "Customer messages classified, answered or escalated — before a human ever reads them.",
      },
      {
        sector: "Manufacturing",
        outcome: "0 double-entry",
        body: "Maintenance tickets flow once from the shopfloor through the stack — no more Excel babysitting.",
      },
    ],
    trustEyebrow: "Trust basis",
    trustLine: "Data on German infrastructure. GDPR-compliant DPA. No US cloud without explicit sign-off.",
    finalEyebrow: "Complimentary discovery call",
    finalHeadline: { pre: "A 30-minute analysis ", em: "followed by", post: " a written assessment" },
    finalLead: "A structured conversation focused on your specific use case. We document the current state, evaluate the automation potential, and deliver a written assessment afterwards. Free of charge and without obligation.",
    finalCta: "Schedule a call",
    finalCtaSecondary: "Request the AI & Automation Check",
  },
  tr: {
    eyebrow: "Sonuçlar",
    headline: "Başkalarında ne oldu",
    cases: [
      {
        sector: "Endüstriyel üretim",
        outcome: "11 sa / hafta",
        body: "Teklif onayları otomatik; CRM ile ERP Excel üzerinden değil, doğrudan birbiriyle konuşuyor.",
      },
      {
        sector: "E-ticaret",
        outcome: "Inbox Zero",
        body: "Müşteri mesajları sınıflandırılıyor, yanıtlanıyor veya yükseltiliyor — bir insan görmeden önce.",
      },
      {
        sector: "Üretim",
        outcome: "0 çift kayıt",
        body: "Bakım talepleri tek seferde sahadan sisteme akıyor — Excel beslemesi tarihe karışıyor.",
      },
    ],
    trustEyebrow: "Güven zemini",
    trustLine: "Veriler Alman altyapısında. KVKK/DSGVO uyumlu sözleşme. Açık onay olmadan ABD bulutu kullanılmaz.",
    finalEyebrow: "Ücretsiz ön görüşme",
    finalHeadline: { pre: "30 dakikalık analiz, ", em: "ardından", post: " yazılı bir değerlendirme" },
    finalLead: "Somut kullanım örneğinize odaklanan yapılandırılmış bir görüşme. Mevcut durumu kayıt altına alır, otomasyon potansiyelini değerlendirir ve sonrasında yazılı bir değerlendirme iletiriz. Ücretsiz ve yükümlülüksüzdür.",
    finalCta: "Görüşme planla",
    finalCtaSecondary: "AI & Automation Check talep et",
  },
} as const;

export function HomeOutcomes() {
  const { locale } = useLocale();
  const lang: keyof typeof COPY =
    locale === "de" || locale === "en" || locale === "tr" ? locale : "en";
  const c = COPY[lang];

  return (
    <>
      <section className="v2-home-outcomes">
        <div className="wrap">
          <div className="v2-home-outcomes__head">
            <span className="v2-home-outcomes__eyebrow">{c.eyebrow}</span>
            <h2 className="v2-home-outcomes__headline">{c.headline}</h2>
          </div>

          <ul className="v2-home-outcomes__grid">
            {c.cases.map((vignette, i) => (
              <li key={i} className="v2-home-outcomes__card">
                <span className="v2-home-outcomes__card-sector">{vignette.sector}</span>
                <span className="v2-home-outcomes__card-outcome">{vignette.outcome}</span>
                <p className="v2-home-outcomes__card-body">{vignette.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="v2-home-trust">
        <div className="wrap v2-home-trust__inner">
          <span className="v2-home-trust__eyebrow">{c.trustEyebrow}</span>
          <p className="v2-home-trust__line">{c.trustLine}</p>
          <ul className="v2-home-trust__chips" aria-hidden="true">
            <li>DSGVO</li>
            <li>AVV</li>
            <li>DE-Hosting</li>
            <li>SOC 2 Sub-Processors</li>
            <li>Open-Source First</li>
          </ul>
        </div>
      </section>

      <section className="v2-home-final">
        <div className="wrap v2-home-final__inner">
          <span className="v2-home-final__eyebrow">{c.finalEyebrow}</span>
          <h2 className="v2-home-final__headline">
            {c.finalHeadline.pre}
            <em>{c.finalHeadline.em}</em>
            {c.finalHeadline.post}
          </h2>
          <p className="v2-home-final__lead">{c.finalLead}</p>
          <div className="v2-home-final__ctas">
            <Link href="/contact" className="v2-btn-primary" data-cursor="link">
              {c.finalCta}
            </Link>
            <Link
              href="/ai-automation-check"
              className="v2-btn-ghost"
              data-cursor="link"
            >
              {c.finalCtaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
