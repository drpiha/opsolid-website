import type { ReactNode } from "react";
import { contents } from "@/content";
import type { L3 } from "@/content/v4/types";
import { SITE_CONFIG } from "@/lib/constants";
import styles from "./legal.module.css";

// Server-rendered from the content data: no client content bundle on this route.
const LABELS: Record<L3, { legal: string; notice: string; owner: string; email: string; phone: string; phoneTr: string }> = {
  de: { legal: "Rechtliches", notice: "Hinweis", owner: "Inhaber, Einzelunternehmen", email: "E-Mail", phone: "Tel.", phoneTr: "Tel. (TR)" },
  en: { legal: "Legal", notice: "Notice", owner: "owner, sole proprietorship", email: "Email", phone: "Phone", phoneTr: "Phone (TR)" },
  tr: { legal: "Yasal", notice: "Not", owner: "sahibi, şahıs işletmesi", email: "E-posta", phone: "Tel.", phoneTr: "Tel. (TR)" },
};

export function ImpressumPage({ locale }: { locale: L3 }) {
  const s = contents[locale].impressum;
  const sec = s.sections;
  const L = LABELS[locale];

  const items: Array<{ heading: string; body: ReactNode }> = [
    {
      heading: sec.according,
      body: (
        <p>
          OpSolid
          <br />
          Hasan D&ouml;nmez ({L.owner})
          <br />
          {SITE_CONFIG.address.street}
          <br />
          {SITE_CONFIG.address.postalCode} {SITE_CONFIG.address.city}
          <br />
          {SITE_CONFIG.address.country}
        </p>
      ),
    },
    {
      heading: sec.contact,
      body: (
        <p>
          {L.email}:{" "}
          <a href={`mailto:${SITE_CONFIG.email}`} className="v4-link">
            {SITE_CONFIG.email}
          </a>
          <br />
          {L.phone}:{" "}
          <a href="tel:+4917631020654" className="v4-link">
            +49 176 31020654
          </a>
          <br />
          {L.phoneTr}:{" "}
          <a href="tel:+905335717885" className="v4-link">
            +90 533 571 78 85
          </a>
        </p>
      ),
    },
    { heading: sec.register, body: <p>{sec.registerText}</p> },
    { heading: sec.vatId, body: <p>{sec.vatIdText}</p> },
    {
      heading: sec.responsibleContent,
      body: (
        <p>
          Hasan D&ouml;nmez
          <br />
          {SITE_CONFIG.address.street}, {SITE_CONFIG.address.postalCode} {SITE_CONFIG.address.city}
        </p>
      ),
    },
    { heading: sec.disputeResolution, body: <p>{sec.disputeResolutionText}</p> },
    { heading: sec.liabilityContent, body: <p>{sec.liabilityContentText}</p> },
    { heading: sec.liabilityLinks, body: <p>{sec.liabilityLinksText}</p> },
  ];

  return (
    <div className="v4-page">
      <section className="v4-sec is-flow" aria-labelledby="impressum-title" style={{ paddingTop: "clamp(112px, 16vh, 168px)" }}>
        <div className="v4-in">
          <div className="v4-col is-wide">
            <p className="v4-eyebrow">{L.legal}</p>
            <h1 id="impressum-title" className="v4-h1" style={{ fontSize: "clamp(2rem, 4.6vw, 3.8rem)" }}>
              {s.title}
            </h1>
            <div className={styles.notice} role="note" aria-label={L.notice}>
              <p className="v4-eyebrow">{L.notice}</p>
              <p>{s.notice}</p>
            </div>

            <ol className={`v4-rows v4-rows-n ${styles.list}`}>
              {items.map((item) => (
                <li key={item.heading} className="v4-row">
                  <div className="v4-row-in">
                    <h2 className="v4-row-h">{item.heading}</h2>
                    <div className={styles.body}>{item.body}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
