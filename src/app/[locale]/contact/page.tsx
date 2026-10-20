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
  de: { form: "Nachricht schreiben", direct: "Direkter Kontakt", mail: "E-Mail", phone: "Telefon" },
  en: { form: "Write a message", direct: "Reach us directly", mail: "Email", phone: "Phone" },
  tr: { form: "Mesaj yazın", direct: "Doğrudan ulaşın", mail: "E-posta", phone: "Telefon" },
} as const;

export default function Page({ params }: Params) {
  const loc = pickLocale(params?.locale);
  const page = getPage(loc, "contact");
  const L = LABEL[loc];
  return (
    <PageRenderer page={page} locale={loc} trail={[{ label: page.crumb }]} kind="ContactPage">
      <section className="v4-sec is-contact" aria-labelledby="form-h">
        <div className="v4-in">
          <div className="v4-col is-form">
            <Reveal>
              <h2 className="v4-h2" id="form-h">
                {L.form}
              </h2>
              <ContactForm4 />
            </Reveal>
          </div>
          <div className="v4-col is-direct">
            <Reveal>
              <h2 className="v4-h3">
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
              </dl>
            </Reveal>
          </div>
        </div>
      </section>
    </PageRenderer>
  );
}
