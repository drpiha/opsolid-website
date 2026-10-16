import Link from "next/link";
import type { ReactNode } from "react";
import { withLocale, type Locale } from "@/lib/i18n";
import { SITE_CONFIG, formatStand } from "@/lib/constants";
import type { Block, L3, PageDef } from "@/content/v4/types";
import { Reveal } from "@/components/v4/Reveal";
import { AgentDemo } from "@/components/v4/AgentDemo";
import { JsonLdGraph } from "@/components/v4/JsonLd";

/**
 * Long German compounds ("Automatisierungspotenzial") do not fit a 36 rem column at heading size,
 * and browsers do not hyphenate them reliably. Insert a soft hyphen before a known stem when the word
 * is long, so the break lands on a morpheme boundary instead of mid-syllable. Invisible otherwise.
 */
const STEMS = /(automatisierung|potenzial|vereinbarung|verordnung|kompetenz|kommunikation|integration|unternehmen|dokumentation|schulung|beratung|steuerung|werkzeug|anbindung|plattform|einführung|sicherheit)/gi;
export function soft(text: string): string {
  return text.replace(/[A-Za-zÄÖÜäöüßÇçĞğİıŞş]{14,}/g, (word) =>
    word.replace(STEMS, (m, _g, offset: number) => (offset >= 4 ? "\u00AD" + m : m)),
  );
}

const HOME: Record<L3, string> = { de: "Start", en: "Home", tr: "Ana sayfa" };
const STAND: Record<L3, string> = { de: "Stand", en: "Updated", tr: "Güncelleme" };

export function href(locale: L3, path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return withLocale(path, locale as Locale);
}

export function V4Link({ locale, to, className, children }: { locale: L3; to: string; className?: string; children: ReactNode }) {
  const h = href(locale, to);
  if (/^(https?:|mailto:|tel:)/.test(h)) {
    const ext = h.startsWith("http");
    return (
      <a href={h} className={className} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return (
    <Link href={h} className={className}>
      {children}
    </Link>
  );
}

export function Crumbs({ locale, trail }: { locale: L3; trail: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="v4-crumbs">
        <li>
          <V4Link locale={locale} to="/">
            {HOME[locale]}
          </V4Link>
        </li>
        {trail.map((c, i) => (
          <li key={i} aria-current={i === trail.length - 1 ? "page" : undefined}>
            {c.to && i < trail.length - 1 ? (
              <V4Link locale={locale} to={c.to}>
                {c.label}
              </V4Link>
            ) : (
              c.label
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function BlockBody({ b, locale }: { b: Block; locale: L3 }) {
  switch (b.t) {
    case "rows":
      return (
        <ul className="v4-rows">
          {b.items.map((it) => (
            <li key={it.h} className="v4-row">
              {it.href ? (
                <V4Link locale={locale} to={it.href} className="v4-row-in">
                  <h3 className="v4-row-h">
                    {it.h}
                    {it.tag && <span>{it.tag}</span>}
                  </h3>
                  <p className="v4-row-p">{it.p}</p>
                </V4Link>
              ) : (
                <div className="v4-row-in">
                  <h3 className="v4-row-h">
                    {it.h}
                    {it.tag && <span>{it.tag}</span>}
                  </h3>
                  <p className="v4-row-p">{it.p}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="v4-steps">
          {b.items.map((s) => (
            <li key={s.h} className="v4-step">
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </li>
          ))}
        </ol>
      );
    case "tags":
      return (
        <ul className="v4-tags">
          {b.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="v4-table-wrap" tabIndex={0} role="region" aria-label={b.caption ?? b.h}>
          <table className="v4-table">
            {b.caption && <caption>{b.caption}</caption>}
            <thead>
              <tr>
                {b.cols.map((c, i) => (
                  <th key={c} scope="col" className={i === b.cols.length - 1 ? "pr" : undefined}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r) => (
                <tr key={r[0]}>
                  {r.map((cell, i) => {
                    const [main, sub] = cell.split("||");
                    return (
                      <td key={i} className={i === r.length - 1 ? "pr" : undefined}>
                        {main}
                        {sub && <small>{sub}</small>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {b.note && <p className="v4-note">{b.note}</p>}
        </div>
      );
    case "text":
      return (
        <>
          {b.paras.map((p, i) => (
            <p key={i} className="v4-p">
              {p}
            </p>
          ))}
        </>
      );
    case "spec":
      return (
        <dl className="v4-spec">
          {b.rows.map(([k, v]) => (
            <div key={k} style={{ display: "contents" }}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      );
    case "demo":
      return <AgentDemo chip={b.chip} play={b.play} again={b.again} note={b.note} sr={b.sr} script={b.script} />;
  }
}

export function BlockSection({ b, locale, flow }: { b: Block; locale: L3; flow?: boolean }) {
  const wide = b.t === "table" || b.t === "demo";
  const cls = ["v4-sec", b.scene ? "has-scene" : "", flow ?? !b.scene ? "is-flow" : ""].filter(Boolean).join(" ");
  return (
    <section
      id={b.id}
      className={cls}
      data-scene={b.scene}
      data-heat={b.heat?.join(",")}
      data-dim={b.dim ? "1" : undefined}
      aria-labelledby={b.id ? `${b.id}-h` : undefined}
    >
      <div className="v4-in">
        <div className={`v4-col${wide ? " is-wide" : ""}`}>
          {b.eyebrow && <span className="v4-eyebrow">{b.eyebrow}</span>}
          <Reveal>
            <h2 className="v4-h2" id={b.id ? `${b.id}-h` : undefined}>
              {soft(b.h)}
            </h2>
          </Reveal>
          {b.lede && (
            <Reveal>
              <p className="v4-lede">{b.lede}</p>
            </Reveal>
          )}
          <Reveal>
            <BlockBody b={b} locale={locale} />
            {b.cta && (
              <div className="v4-cta">
                <V4Link locale={locale} to={b.cta.href} className="v4-btn v4-btn-primary">
                  {b.cta.label}
                </V4Link>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ faq, scene = "offset" }: { faq: NonNullable<PageDef["faq"]>; scene?: string }) {
  return (
    <section className="v4-sec" data-scene={scene} aria-labelledby="faq-h">
      <div className="v4-in">
        <div className="v4-col is-wide">
          <Reveal>
            <h2 className="v4-h2" id="faq-h">
              {soft(faq.h)}
            </h2>
          </Reveal>
          <Reveal>
            <div className="v4-faq">
              {faq.items.map((i) => (
                <details key={i.q}>
                  <summary>{i.q}</summary>
                  <p>{i.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function CtaBand({ cta, locale }: { cta: PageDef["cta"]; locale: L3 }) {
  return (
    <section className="v4-band" data-scene="tight" aria-labelledby="cta-h">
      <div className="v4-band-in">
        <div>
          <h2 className="v4-h2" id="cta-h">
            {soft(cta.h)}
          </h2>
          <p>{cta.p}</p>
        </div>
        <div className="v4-cta" style={{ marginTop: 0 }}>
          <V4Link locale={locale} to={cta.primary.href} className="v4-btn v4-btn-primary v4-btn-lg">
            {cta.primary.label}
          </V4Link>
          {cta.secondary && (
            <V4Link locale={locale} to={cta.secondary.href} className="v4-btn v4-btn-ghost v4-btn-lg">
              {cta.secondary.label}
            </V4Link>
          )}
        </div>
      </div>
    </section>
  );
}

export function Hero({ page, locale, trail, showStand = true }: { page: PageDef; locale: L3; trail?: { label: string; to?: string }[]; showStand?: boolean }) {
  const h = page.hero;
  return (
    <section className="v4-sec is-hero" id="top" data-scene={h.scene} data-heat={h.heat?.join(",")}>
      <div className="v4-in">
        <div className="v4-col">
          {trail && trail.length > 0 && <Crumbs locale={locale} trail={trail} />}
          <span className="v4-eyebrow">{h.eyebrow}</span>
          <h1 className="v4-h1">
            {soft(h.h1[0])}
            <em>{soft(h.h1[1])}</em>
            {soft(h.h1[2])}
          </h1>
          <p className="v4-lede">{h.lede}</p>
          {h.spec && (
            <dl className="v4-spec">
              {h.spec.map(([k, v]) => (
                <div key={k} style={{ display: "contents" }}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="v4-cta">
            <V4Link locale={locale} to={h.primary.href} className="v4-btn v4-btn-primary v4-btn-lg">
              {h.primary.label}
            </V4Link>
            {h.secondary && (
              <V4Link locale={locale} to={h.secondary.href} className="v4-btn v4-btn-ghost v4-btn-lg">
                {h.secondary.label}
              </V4Link>
            )}
          </div>
          {showStand && (
            <p className="v4-stand">
              {STAND[locale]}: {formatStand(locale)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/** Generic page: hero + blocks + FAQ + CTA band + one JSON-LD graph. */
export function PageRenderer({ page, locale, trail, kind, children }: { page: PageDef; locale: L3; trail: { label: string; to?: string }[]; kind?: "WebPage" | "ProfilePage" | "CollectionPage" | "ContactPage"; children?: ReactNode }) {
  const crumbs = [
    { name: HOME[locale], path: `/${locale}` },
    ...trail.map((c, i) => ({ name: c.label, path: `/${locale}${i === trail.length - 1 ? (page.slug ? `/${page.slug}` : "") : c.to ?? ""}` })),
  ];
  return (
    <div className="v4-page">
      <JsonLdGraph locale={locale} slug={page.slug} name={page.meta.title} description={page.meta.description} crumbs={crumbs} page={page} kind={kind} />
      <Hero page={page} locale={locale} trail={trail} />
      {page.blocks.map((b, i) => (
        <BlockSection key={b.id ?? `${b.t}-${i}`} b={b} locale={locale} />
      ))}
      {children}
      {page.faq && <FaqSection faq={page.faq} />}
      <CtaBand cta={page.cta} locale={locale} />
    </div>
  );
}

export { SITE_CONFIG };
