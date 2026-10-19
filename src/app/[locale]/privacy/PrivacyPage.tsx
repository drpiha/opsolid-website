import { contents } from "@/content";
import type { L3 } from "@/content/v4/types";
import { SITE_CONFIG } from "@/lib/constants";
import styles from "../impressum/legal.module.css";

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
    <div className="v4-page">
      <section className="v4-sec is-flow" aria-labelledby="privacy-title" style={{ paddingTop: "clamp(112px, 16vh, 168px)" }}>
        <div className="v4-in">
          <div className="v4-col is-wide">
            <p className="v4-eyebrow">{L.eyebrow}</p>
            <h1 id="privacy-title" className="v4-h1" style={{ fontSize: "clamp(2rem, 4.6vw, 3.8rem)" }}>
              {title}
            </h1>
            <p className={styles.sub}>{s.subtitle}</p>
            <div className={styles.notice} role="note" aria-label={L.notice}>
              <p className="v4-eyebrow">{L.notice}</p>
              <p>{s.notice}</p>
            </div>

            <div className={`v4-prose ${styles.doc}`}>
              {(s.sections as ReadonlyArray<Section>).map((section) => (
                <section key={section.title}>
                  <h2>{section.title}</h2>
                  {section.isResponsible ? (
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
            </div>

            <p className="v4-stand">{s.lastUpdated}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
