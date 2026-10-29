import type { ReactNode } from "react";
import { contents } from "@/content";
import { LegalLayout } from "@/components/v7/LegalPage";
import { LABEL } from "@/content/v7/site";
import { href } from "@/lib/v7-routes";
import type { L3 } from "@/lib/v7-routes";
import { SITE_CONFIG } from "@/lib/constants";

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
          <a href={`mailto:${SITE_CONFIG.email}`} >
            {SITE_CONFIG.email}
          </a>
          <br />
          {L.phone}:{" "}
          <a href="tel:+4917631020654" >
            +49 176 31020654
          </a>
          <br />
          {L.phoneTr}:{" "}
          <a href="tel:+905335717885" >
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
    { heading: sec.copyright, body: <p>{sec.copyrightText}</p> },
    { heading: sec.trademark, body: <p>{sec.trademarkText}</p> },
    { heading: sec.product, body: <p>{sec.productText}</p> },
  ];

  return (
    <LegalLayout
      locale={locale}
      crumbs={[
        { name: LABEL[locale].home, path: href("home", locale), key: "home" },
        { name: LABEL[locale].impressum, path: href("impressum", locale), key: "impressum" },
      ]}
      eyebrow={L.legal}
      title={s.title}
      noticeLabel={L.notice}
      notice={s.notice}
      frameLabel={L.legal}
    >
      {items.map((item) => (
        <section key={item.heading}>
          <h2>{item.heading}</h2>
          {item.body}
        </section>
      ))}
    </LegalLayout>
  );
}
