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
import { OPSO_SCREENS } from "@/content/opso";
import { Crumbs } from "@/components/v4/PageRenderer";
import { JsonLdGraph } from "@/components/v4/JsonLd";
import type { L3 } from "@/content/v4/types";
import styles from "./page.module.css";
import OpsoShowcase from "./OpsoShowcase";

type Props = { params: { locale: string } };
const sectionIds = ["flow", "features", "screens", "availability"];
export const dynamic = "force-dynamic";
const HOME: Record<L3, string> = { de: "Start", en: "Home", tr: "Ana sayfa" };

// Canonical, hreflang, og:locale and the v4 share card come from pageMetadata like every marketing page.
export function generateMetadata({ params }: Props): Metadata {
  if (!isLocale(params.locale)) notFound();
  const { meta } = getOpsoContent(params.locale);
  const isPublic = PUBLIC_LOCALES.includes(params.locale);
  const loc = pickLocale(params.locale);
  const base = pageMetadata(params.locale, "opso", meta);
  const ogUrl = `/img/opso/og-${loc}.png`;
  const ogAlt = `OpSo: ${meta.title}`;
  return {
    ...base,
    openGraph: { ...base.openGraph, images: [{ url: ogUrl, width: 1024, height: 500, alt: ogAlt }] },
    twitter: { ...base.twitter, images: [ogUrl] },
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
  const shot = (i: number) => `/img/opso/${loc}/${OPSO_SCREENS[i]}.webp`;
  // OpSo is in its test phase: a page and breadcrumb node, no Product, Offer or rating (nothing is sold, no public store listing).
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
              <a className="v4-btn v4-btn-primary" href="#features">{c.explore}<span aria-hidden="true">↓</span></a>
              <a className="v4-btn v4-btn-ghost" href="#availability">{c.availabilityLink}</a>
              {accountEnabled && <Link className="v4-btn v4-btn-ghost" href={`/${loc}/opso/account`}>{getOpsoAccountCopy(loc).signIn}</Link>}
            </div>
          </div>
          <div className={styles.heroPhones}>
            {/* The headline is the LCP; only the first phone is fetched early. */}
            <Image className={styles.phoneBack} src={shot(1)} alt={c.heroAlt[1]} width={540} height={960} sizes="(max-width: 1000px) 45vw, 22vw" />
            <Image className={styles.phoneFront} src={shot(5)} alt={c.heroAlt[0]} width={540} height={960} sizes="(max-width: 1000px) 55vw, 26vw" />
          </div>
        </header>

        <nav className={styles.sectionNav} aria-label={c.navLabel}>
          {c.nav.map((label, i) => <a key={label} href={`#${sectionIds[i]}`}>{label}<span aria-hidden="true">↗</span></a>)}
        </nav>

        <section className={styles.section} id="flow" aria-labelledby="flow-heading">
          <h2 id="flow-heading">{c.flow.title}</h2>
          <p className={styles.sectionIntro}>{c.flow.intro}</p>
          <ol className={styles.steps}>
            {c.flow.steps.map((step, i) => <li className={styles.step} key={step.title}><span className={styles.stepNo} aria-hidden="true">0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}
          </ol>
        </section>

        <section className={styles.section} id="features" aria-labelledby="features-heading">
          <h2 id="features-heading">{c.features.title}</h2>
          <p className={styles.sectionIntro}>{c.features.intro}</p>
          <ul className={styles.ledger}>
            {c.features.items.map((item) => <li key={item.title}><h3>{item.title}</h3><p>{item.text}</p></li>)}
          </ul>
          <div className={styles.audience}>
            <h3>{c.audience.title}</h3>
            <p>{c.audience.intro}</p>
            <ul>{c.audience.items.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className={styles.note}>{c.audience.note}</p>
          </div>
        </section>

        <section className={styles.section} id="screens" aria-labelledby="screens-heading">
          <h2 id="screens-heading">{c.screens.title}</h2>
          <p className={styles.sectionIntro}>{c.screens.intro}</p>
          <ul className={styles.strip} role="list" aria-label={c.screens.label} tabIndex={0}>
            {OPSO_SCREENS.map((name, i) => <li key={name}><Image src={shot(i)} alt={c.screens.alts[i]} width={540} height={960} sizes="(max-width: 700px) 70vw, 260px" loading="lazy" /></li>)}
          </ul>
          <p className={styles.note}>{c.screens.note}</p>
        </section>

        <section className={styles.section} id="layouts" aria-labelledby="layouts-heading">
          <h2 id="layouts-heading">{c.families.title}</h2>
          <p className={styles.sectionIntro}>{c.families.intro}</p>
          <OpsoShowcase content={c.families} profiles={OPSO_DEMO_PROFILES} locale={params.locale === "de" ? "de" : "en"} />
          <div className={styles.sharing}><h3>{c.sharing.title}</h3><p>{c.sharing.text}</p></div>
        </section>

        <section className={styles.price} aria-labelledby="price-heading">
          <h2 id="price-heading">{c.price.title}</h2>
          <div>
            <p>{c.price.text}</p>
            <ul>{c.price.points.map((point) => <li key={point}>{point}</li>)}</ul>
          </div>
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
          <h2 id="availability-heading">{c.availability.title}</h2>
          <p>{c.availability.text}</p>
          <div className={styles.platforms}>
            {[c.availability.android, c.availability.ios].map((item, i) => <div className={styles.platform} key={item.title}><span className={i === 0 ? styles.dotOn : styles.dotSoon} aria-hidden="true" /><h3>{item.title}</h3><p>{item.text}</p></div>)}
          </div>
          <Link className="v4-btn v4-btn-primary" href={`/${loc}/contact`}>{c.availability.contact}<span aria-hidden="true">↗</span></Link>
          <p className={styles.note}>{c.availability.note}</p>
        </section>

        <section className={styles.section} aria-labelledby="faq-heading">
          <h2 id="faq-heading">{c.faq.title}</h2>
          <div className={styles.faq}>{c.faq.items.map((item) => <details key={item.title}><summary>{item.title}</summary><p>{item.text}</p></details>)}</div>
        </section>
      </div>
    </article>
  );
}
