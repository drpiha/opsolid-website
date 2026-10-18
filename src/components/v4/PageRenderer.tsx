import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { withLocale, type Locale } from "@/lib/i18n";
import { SITE_CONFIG, formatStand } from "@/lib/constants";
import type { Block, L3, PageDef, Shot } from "@/content/v4/types";
import { Reveal } from "@/components/v4/Reveal";
import { AgentDemo } from "@/components/v4/AgentDemo";
import { JsonLdGraph } from "@/components/v4/JsonLd";
import { soft } from "@/lib/soft-hyphen";

const HOME: Record<L3, string> = { de: "Start", en: "Home", tr: "Ana sayfa" };
const STAND: Record<L3, string> = { de: "Stand", en: "Updated", tr: "Güncelleme" };
const CRUMBS: Record<L3, string> = { de: "Brotkrümelnavigation", en: "Breadcrumb", tr: "Sayfa yolu" };

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Eyebrows are set in uppercase. Under lang="tr" the case mapping turns "i" into "İ" ("OPSOLİD"), so the brand
 * name is marked as German (its origin) and keeps its letterforms in every locale.
 */
function brandSafe(text: string): ReactNode {
  const parts = text.split(/(OpSolid)/);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    part === "OpSolid" ? (
      <span key={i} lang="de">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** Chapter counter ("02/07") in front of the eyebrow. Decorative: the heading outline already carries the order. */
function Eyebrow({ text, n, total }: { text?: string; n?: number; total?: number }) {
  const chap = n !== undefined && total !== undefined && total > 1;
  if (!text && !chap) return null;
  return (
    <span className={`v4-eyebrow${text ? "" : " is-bare"}`}>
      {chap && (
        <span className="v4-chap" aria-hidden="true">
          <b>{pad2(n)}</b>/{pad2(total)}
        </span>
      )}
      {text && <span>{brandSafe(text)}</span>}
    </span>
  );
}

/** Arrow glyph on primary buttons (aria-hidden, the label stays the accessible name). */
const Arr = () => (
  <span className="v4-btn-arr" aria-hidden="true">
    →
  </span>
);

/**
 * Price cell of a rate card: the amount set large, the qualifier ("ab", "from", TR suffix "'dan") small beside it.
 * Strings without an amount ("Auf Anfrage") render unchanged. Reads the same text as before; JSON-LD is unaffected.
 */
const AMOUNT = /(\d[\d.,]*\s?€|€\s?\d[\d.,]*)/;
function Price({ text }: { text: string }) {
  const m = AMOUNT.exec(text);
  if (!m) return <span className="pr-t">{text}</span>;
  const pre = text.slice(0, m.index).trim();
  const post = text.slice(m.index + m[0].length).trim();
  return (
    <>
      {pre && (
        <>
          <span className="pr-q">{pre}</span>{" "}
        </>
      )}
      <span className="pr-n">{m[0]}</span>
      {post && <span className="pr-s">{post}</span>}
    </>
  );
}

/** Column variant per block type: index (linked rows), ledger (plain rows), narrow (process), wide (tables, demo), essay (text). */
function variant(b: Block): string {
  switch (b.t) {
    case "rows":
      return b.items.some((it) => it.href) ? "is-index" : "is-ledger";
    case "steps":
      return "is-narrow";
    case "table":
    case "demo":
      return "is-wide";
    case "text":
      return "is-essay";
    default:
      return "";
  }
}

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
    <nav aria-label={CRUMBS[locale]}>
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

/** A real screenshot of our own work under the row text: plain HTML proof, also for poster and 3D-off visitors. */
function ShotFigure({ shot }: { shot: Shot }) {
  return (
    <figure className="v4-shot">
      {/* eslint-disable-next-line @next/next/no-img-element -- static webp at its intrinsic size, lazy below the fold */}
      <img src={shot.src} width={shot.w} height={shot.h} alt={shot.alt} loading="lazy" decoding="async" />
    </figure>
  );
}

function BlockBody({ b, locale }: { b: Block; locale: L3 }) {
  switch (b.t) {
    case "rows":
      return (
        <ul className="v4-rows v4-rows-n">
          {b.items.map((it, idx) => (
            <li key={it.h} className="v4-row" style={{ "--i": idx } as CSSProperties}>
              {it.href ? (
                <V4Link locale={locale} to={it.href} className="v4-row-in">
                  <h3 className="v4-row-h">
                    {it.h}
                    {it.tag && <span>{it.tag}</span>}
                    <span className="v4-row-go" aria-hidden="true">
                      →
                    </span>
                  </h3>
                  <p className="v4-row-p">{it.p}</p>
                  {it.shot && <ShotFigure shot={it.shot} />}
                </V4Link>
              ) : (
                <div className="v4-row-in">
                  <h3 className="v4-row-h">
                    {it.h}
                    {it.tag && <span>{it.tag}</span>}
                  </h3>
                  <p className="v4-row-p">{it.p}</p>
                  {it.shot && <ShotFigure shot={it.shot} />}
                </div>
              )}
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="v4-steps">
          {b.items.map((s, idx) => (
            <li key={s.h} className="v4-step" style={{ "--i": idx } as CSSProperties}>
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
                        {i === r.length - 1 ? <Price text={main} /> : main}
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
            <p key={i} className={i === 0 && !b.lede ? "v4-p is-lead" : "v4-p"}>
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

export function BlockSection({ b, locale, flow, n, total }: { b: Block; locale: L3; flow?: boolean; n?: number; total?: number }) {
  const v = variant(b);
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
        {/* The column itself reveals (one observer); its children stagger in CSS, so an opaque panel never shows empty. */}
        <Reveal className={`v4-col${v ? ` ${v}` : ""}`}>
          <Eyebrow text={b.eyebrow} n={n} total={total} />
          <h2 className="v4-h2" id={b.id ? `${b.id}-h` : undefined}>
            {soft(b.h)}
          </h2>
          {b.lede && <p className="v4-lede">{b.lede}</p>}
          <BlockBody b={b} locale={locale} />
          {b.cta && (
            <div className="v4-cta">
              <V4Link locale={locale} to={b.cta.href} className="v4-btn v4-btn-primary">
                {b.cta.label}
                <Arr />
              </V4Link>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function FaqSection({ faq, scene = "offset", n, total }: { faq: NonNullable<PageDef["faq"]>; scene?: string; n?: number; total?: number }) {
  // Stays a 46rem panel: Stage fits the object beside the next scene's column (this one) during every flow
  // block that precedes it, so a full-width FAQ would push the object off the page for the whole inner page.
  return (
    <section className="v4-sec is-faq" data-scene={scene} aria-labelledby="faq-h">
      <div className="v4-in">
        <Reveal className="v4-col is-wide">
          <Eyebrow n={n} total={total} />
          <h2 className="v4-h2" id="faq-h">
            {soft(faq.h)}
          </h2>
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
        <div className="v4-cta">
          <V4Link locale={locale} to={cta.primary.href} className="v4-btn v4-btn-primary v4-btn-lg">
            {cta.primary.label}
            <Arr />
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

export function Hero({ page, locale, trail, showStand = true, total }: { page: PageDef; locale: L3; trail?: { label: string; to?: string }[]; showStand?: boolean; total?: number }) {
  const h = page.hero;
  return (
    <section className="v4-sec is-hero" id="top" data-scene={h.scene} data-heat={h.heat?.join(",")}>
      <div className="v4-in">
        <div className="v4-col">
          {trail && trail.length > 0 && <Crumbs locale={locale} trail={trail} />}
          <Eyebrow text={h.eyebrow} n={1} total={total} />
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
              <Arr />
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
export function PageRenderer({ page, locale, trail, kind, children }: { page: PageDef; locale: L3; trail: { label: string; to?: string }[]; kind?: "WebPage" | "AboutPage" | "ProfilePage" | "CollectionPage" | "ContactPage"; children?: ReactNode }) {
  const crumbs = [
    { name: HOME[locale], path: `/${locale}` },
    ...trail.map((c, i) => ({ name: c.label, path: `/${locale}${i === trail.length - 1 ? (page.slug ? `/${page.slug}` : "") : c.to ?? ""}` })),
  ];
  // Chapters: hero = 01, then every block, then the FAQ. The CTA band is the finale and carries no number.
  const total = 1 + page.blocks.length + (page.faq ? 1 : 0);
  return (
    <div className="v4-page">
      <JsonLdGraph locale={locale} slug={page.slug} name={page.meta.title} description={page.meta.description} crumbs={crumbs} page={page} kind={kind} />
      <Hero page={page} locale={locale} trail={trail} total={total} />
      {page.blocks.map((b, i) => (
        <BlockSection key={b.id ?? `${b.t}-${i}`} b={b} locale={locale} n={i + 2} total={total} />
      ))}
      {children}
      {page.faq && <FaqSection faq={page.faq} n={page.blocks.length + 2} total={total} />}
      <CtaBand cta={page.cta} locale={locale} />
    </div>
  );
}

export { SITE_CONFIG };
