import { getPage } from "@/content/v4";
import { PageRenderer } from "@/components/v4/PageRenderer";
import { ContactForm4 } from "@/components/v4/ContactForm4";
import { Reveal } from "@/components/v4/Reveal";
import { SITE_CONFIG } from "@/lib/constants";
import { pageMetadata, pickLocale } from "@/lib/seo-v4";
import type { Metadata } from "next";

type Params = { params: { locale?: string } };

export function generateMetadata({ params }: Params): Metadata {
  const loc = pickLocale(params?.locale);
  const p = getPage(loc, "contact");
  return pageMetadata(loc, p.slug, p.meta);
}

const LABEL = {
  de: { form: "Nachricht schreiben", direct: "Direkter Kontakt", mail: "E-Mail", phone: "Telefon", where: "Standort", note: "Arnsberg, Deutschland" },
  en: { form: "Write a message", direct: "Reach us directly", mail: "Email", phone: "Phone", where: "Location", note: "Arnsberg, Germany" },
  tr: { form: "Mesaj yazın", direct: "Doğrudan ulaşın", mail: "E-posta", phone: "Telefon", where: "Konum", note: "Arnsberg, Almanya" },
} as const;

export default function Page({ params }: Params) {
  const loc = pickLocale(params?.locale);
  const page = getPage(loc, "contact");
  const L = LABEL[loc];
  return (
    <PageRenderer page={page} locale={loc} trail={[{ label: page.crumb }]} kind="ContactPage">
      <section className="v4-sec is-flow" aria-labelledby="form-h" data-scene="tight" data-dim="1">
        <div className="v4-in" style={{ display: "grid", gap: "48px" }}>
          <div className="v4-col is-wide">
            <Reveal>
              <h2 className="v4-h2" id="form-h">
                {L.form}
              </h2>
              <ContactForm4 />
            </Reveal>
          </div>
          <div className="v4-col">
            <Reveal>
              <h2 className="v4-h2" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>
                {L.direct}
              </h2>
              <dl className="v4-spec">
                <dt>{L.mail}</dt>
                <dd>
                  <a className="v4-link" href={`mailto:${SITE_CONFIG.email}`}>
                    {SITE_CONFIG.email}
                  </a>
                </dd>
                <dt>{L.phone}</dt>
                <dd>
                  <a className="v4-link" href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}>
                    {SITE_CONFIG.phone}
                  </a>
                </dd>
                <dt>{L.where}</dt>
                <dd>{L.note}</dd>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>
    </PageRenderer>
  );
}
