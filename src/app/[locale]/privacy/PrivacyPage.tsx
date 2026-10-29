import { contents } from "@/content";
import { LegalLayout } from "@/components/v7/LegalPage";
import { LABEL } from "@/content/v7/site";
import { href } from "@/lib/v7-routes";
import type { L3 } from "@/lib/v7-routes";
import { SITE_CONFIG } from "@/lib/constants";

// Server-rendered from the content data: no client content bundle on this route.
const LABELS: Record<L3, { eyebrow: string; notice: string; owner: string; email: string }> = {
  de: { eyebrow: "Rechtliches · Datenschutz", notice: "Hinweis", owner: "Inhaber, Einzelunternehmen", email: "E-Mail" },
  en: { eyebrow: "Legal · Privacy", notice: "Notice", owner: "owner, sole proprietorship", email: "Email" },
  tr: { eyebrow: "Yasal · Gizlilik", notice: "Not", owner: "sahibi, şahıs işletmesi", email: "E-posta" },
};

type Section = { title: string; content?: string; isResponsible?: string; subsections?: Array<{ title: string; content: string }> };

export function PrivacyPage({ locale }: { locale: L3 }) {
  const s = contents[locale].privacy;
  const L = LABELS[locale];
  // "Datenschutzerklärung" does not fit a phone column at heading size: break it at the compound seam.
  const title = s.title.replace("Datenschutzerklärung", "Datenschutz­erklärung");

  return (
    <LegalLayout
      locale={locale}
      crumbs={[
        { name: LABEL[locale].home, path: href("home", locale), key: "home" },
        { name: LABEL[locale].privacy, path: href("privacy", locale), key: "privacy" },
      ]}
      eyebrow={L.eyebrow}
      title={title}
      subtitle={s.subtitle}
      noticeLabel={L.notice}
      notice={s.notice}
      frameLabel={L.eyebrow}
      stand={s.lastUpdated}
    >
      {(s.sections as ReadonlyArray<Section>).map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          {section.isResponsible ? (
            <>
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
                <br />
                {L.email}: <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
              </p>
              {section.content ? <p>{section.content}</p> : null}
            </>
          ) : (
            <>
              {section.content ? <p>{section.content}</p> : null}
              {section.subsections?.map((sub) => (
                <div key={sub.title}>
                  <h3>{sub.title}</h3>
                  <p>{sub.content}</p>
                </div>
              ))}
            </>
          )}
        </section>
      ))}
    </LegalLayout>
  );
}
