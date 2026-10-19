import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOpsoContent } from "@/content/opso";
import { getOpsoAccountCopy } from "@/content/opso-account";
import { sessionKey } from "@/lib/opso-web/session";
import { getOpsoPhysicalCardContent } from "@/content/opso-physical-card";
import { OPSO_DEMO_PROFILES } from "@/content/opso-demo-assets";
import physicalNfcCard from "@/assets/opso/physical-nfc-black-concept.webp";
import { isLocale, PUBLIC_LOCALES } from "@/lib/i18n";
import { pageMetadata, pickLocale } from "@/lib/seo-v4";
import { Crumbs } from "@/components/v4/PageRenderer";
import { JsonLdGraph } from "@/components/v4/JsonLd";
import type { L3 } from "@/content/v4/types";
import styles from "./page.module.css";
import OpsoShowcase from "./OpsoShowcase";

type Props = { params: { locale: string } };
const sectionIds = ["overview", "layouts", "plans", "availability"];
export const dynamic = "force-dynamic";
const HOME: Record<L3, string> = { de: "Start", en: "Home", tr: "Ana sayfa" };

// Canonical, hreflang, og:locale and the v4 share card come from pageMetadata like every marketing page.
export function generateMetadata({ params }: Props): Metadata {
  if (!isLocale(params.locale)) notFound();
  const { meta } = getOpsoContent(params.locale);
  const isPublic = PUBLIC_LOCALES.includes(params.locale);
  return {
    ...pageMetadata(params.locale, "opso", meta),
    ...(!isPublic ? { robots: { index: false, follow: true } } : {}),
  };
}

export default function OpsoPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const c = getOpsoContent(params.locale);
  const physicalCard = getOpsoPhysicalCardContent(params.locale);
  const accountKey = sessionKey(process.env.OPSO_WEB_SESSION_KEY);
  const clientIpKey = sessionKey(process.env.OPSO_WEB_CLIENT_IP_SECRET);
  const accountEnabled = process.env.OPSO_WEB_ENABLED === "true" && process.env.OPSO_WEB_TRUSTED_PROXY === "traefik-one-hop" && accountKey && clientIpKey && !accountKey.equals(clientIpKey);
  const loc = pickLocale(params.locale);
  // OpSo is in its test phase: a page and breadcrumb node, no Product or Offer (the card price is a planned one).
  return (
    <article className={styles.page}>
      <JsonLdGraph locale={loc} slug="opso" name={c.meta.title} description={c.meta.description} crumbs={[{ name: HOME[loc], path: `/${loc}` }, { name: "OpSo", path: `/${loc}/opso` }]} />
      <div className="v4-in">
        <header className={styles.hero}>
          <div>
            <Crumbs locale={loc} trail={[{ label: "OpSo" }]} />
            <p className={styles.eyebrow}>OpSo <span>by OpSolid</span></p>
            <p className={styles.status}>{c.status}</p>
            <h1>{c.title}</h1>
            <p className={styles.intro}>{c.intro}</p>
            <div className={styles.actions}>
              <a className="v4-btn v4-btn-primary" href="#layouts">{c.explore}<span aria-hidden="true">↓</span></a>
              <a className="v4-btn v4-btn-ghost" href="#availability">{c.availabilityLink}</a>
              {accountEnabled && <Link className="v4-btn v4-btn-ghost" href={`/${params.locale === "de" || params.locale === "tr" ? params.locale : "en"}/opso/account`}>{getOpsoAccountCopy(params.locale === "de" || params.locale === "tr" ? params.locale : "en").signIn}</Link>}
            </div>
          </div>
          <figure className={styles.figure}>
            <div className={styles.heroCards}>
              {/* The intro text is the LCP; only the first card is fetched early, the second loads lazily. */}
              {[0, 2].map((index) => <a className={styles.heroPreview} href="#layouts" key={OPSO_DEMO_PROFILES[index].key}>
                <Image src={OPSO_DEMO_PROFILES[index].mobile} alt={`${c.illustration.alt}: ${c.families.items[index].title}`} priority={index === 0} />
              </a>)}
            </div>
            <figcaption>{c.illustration.caption}</figcaption>
          </figure>
        </header>

        <nav className={styles.sectionNav} aria-label={c.navLabel}>
          {c.nav.map((label, i) => <a key={label} href={`#${sectionIds[i]}`}>{label}<span aria-hidden="true">↗</span></a>)}
        </nav>

        <section className={styles.section} id="overview" aria-labelledby="overview-heading">
          <h2 id="overview-heading">{c.overview.title}</h2>
          <p className={styles.sectionIntro}>{c.overview.intro}</p>
          <div className={styles.grid}>
            {c.overview.items.map((item) => <div className={styles.feature} key={item.title}><h3>{item.title}</h3><p>{item.text}</p></div>)}
          </div>
        </section>

        <section className={styles.section} id="layouts" aria-labelledby="layouts-heading">
          <h2 id="layouts-heading">{c.families.title}</h2>
          <p className={styles.sectionIntro}>{c.families.intro}</p>
          <OpsoShowcase content={c.families} profiles={OPSO_DEMO_PROFILES} locale={params.locale === "de" ? "de" : "en"} />
          <div className={styles.sharing}><h3>{c.sharing.title}</h3><p>{c.sharing.text}</p></div>
        </section>

        <section className={styles.section} id="plans" aria-labelledby="plans-heading">
          <h2 id="plans-heading">{c.plans.title}</h2>
          <p className={styles.sectionIntro}>{c.plans.intro}</p>
          <div className={styles.grid}>
            {[["Free", "1"], ["Pro", "10"], ["Studio", "50"]].map(([name, count], i) => <div className={styles.plan} key={name}><div className={styles.planHeader}><h3>{name}</h3><span>{i === 0 ? c.plans.free : c.plans.soon}</span></div><strong className={styles.count}>{count}</strong><p>{c.plans.unit}</p><p className={styles.planStatus}>{i === 0 ? c.plans.included : c.plans.coming}</p></div>)}
          </div>
          <p className={styles.note}>{c.plans.note}</p>
        </section>

        <section className={styles.physicalCard} aria-labelledby="physical-card-heading">
          <figure className={styles.physicalCardVisual}>
            <Image src={physicalNfcCard} alt={physicalCard.imageAlt} />
            <figcaption>{physicalCard.conceptNote}</figcaption>
          </figure>
          <div className={styles.physicalCardCopy}>
            <p className={styles.physicalCardStatus}>{physicalCard.status}</p>
            <h2 id="physical-card-heading">{physicalCard.title}</h2>
            <p className={styles.physicalCardIntro}>{physicalCard.intro}</p>
            <ul className={styles.physicalCardPoints}>
              {physicalCard.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
            <div className={styles.physicalCardPrice}>
              <span>{physicalCard.priceLabel}</span>
              <strong>{physicalCard.price}</strong>
              <small>{physicalCard.priceDetail}</small>
            </div>
            <p className={styles.physicalCardNote}>{physicalCard.priceNote}</p>
            <Link className="v4-btn v4-btn-primary" href={`/${params.locale}/contact`}>
              {physicalCard.cta}<span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section className={styles.availability} id="availability" aria-labelledby="availability-heading">
          <p className={styles.status}>{c.status}</p>
          <h2 id="availability-heading">{c.availability.title}</h2>
          <p>{c.availability.text}</p>
          <Link className="v4-btn v4-btn-primary" href={`/${params.locale}/contact`}>{c.availability.contact}<span aria-hidden="true">↗</span></Link>
        </section>

        <section className={styles.section} aria-labelledby="faq-heading">
          <h2 id="faq-heading">{c.faq.title}</h2>
          <div className={styles.faq}>{c.faq.items.map((item) => <details key={item.title}><summary>{item.title}</summary><p>{item.text}</p></details>)}</div>
        </section>
      </div>
    </article>
  );
}
