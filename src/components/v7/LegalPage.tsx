import type { ReactNode } from "react";
import type { L3 } from "@/lib/v7-routes";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { MotionRoot } from "./MotionRoot";
import { Prose } from "./Prose";
import { wrap } from "./ui";
import { Etikett } from "./werkstatt/Etikett";

/**
 * Short page hero without buttons or figure (design C page hero on paper with the mat): breadcrumbs, the eyebrow as a
 * solid Etikett, H1 and an optional lede. Used by the journal, the legal pages and the 404.
 */
export function PlainHero({
  eyebrow,
  h1,
  lede,
  small,
  id = "hero-h",
  crumbs,
  locale,
  children,
}: {
  eyebrow: ReactNode;
  h1: ReactNode;
  lede?: string;
  small?: boolean;
  id?: string;
  /** Breadcrumbs inside the copy column (inner pages); `locale` names their nav. */
  crumbs?: Crumb[];
  locale?: L3;
  children?: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={`wk-page-hero wk-mat is-light is-text is-plain${small ? " is-small" : ""}`}>
      <div className={`${wrap} wk-page-hero-grid`}>
        <div className="wk-page-hero-copy">
          {crumbs && locale && <Breadcrumbs crumbs={crumbs} locale={locale} />}
          <Etikett solid as="p">
            {eyebrow}
          </Etikett>
          <h1 id={id} className="wk-d1">
            {h1}
          </h1>
          {lede && <p className="wk-lede">{lede}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

/**
 * Content frame of the long-form pages (journal, legal): the mono label as an Etikett in a narrow left column over a
 * 2 px top rule, the content on the right at its own measure. Kept as a two-column frame on purpose: these pages
 * read as documents, and the label column carries their running head.
 */
export function Frame({ label, note, children, className = "" }: { label: string; note?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`${wrap} ${className}`}>
      <div className="wk-frame">
        <div className="wk-frame-head">
          <Etikett solid as="p">
            {label}
          </Etikett>
          {note && <div className="wk-sec-note mt-3 hidden md:block">{note}</div>}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

/** Notice box on legal pages (the existing hint text, unchanged). */
export function Notice({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="note" aria-label={label} className="mb-12 max-w-[68ch] rounded-[10px] border border-wk-line bg-wk-sheet px-5 py-4 text-[15px] leading-[1.6]">
      <Etikett as="p" className="mb-2">
        {label}
      </Etikett>
      <p>{children}</p>
    </div>
  );
}

/** Legal prose: the headings are smaller than in journal posts. */
export const LEGAL_PROSE =
  "[&_h2]:!mt-12 [&_h2]:!text-[1.375rem] md:[&_h2]:!text-[1.625rem] [&_h3]:!mt-7 [&_h3]:!text-[1.125rem] md:[&_h3]:!text-[1.25rem] [&_section+section]:mt-14 [&_section+section]:border-t [&_section+section]:border-wk-line-2 [&_section+section]:pt-2 [&_p]:break-words";

/** Layout of Impressum and Datenschutz: breadcrumb, small hero, legal prose, "Stand" line. */
export function LegalLayout({
  crumbs,
  locale: _locale,
  eyebrow,
  title,
  subtitle,
  noticeLabel,
  notice,
  frameLabel,
  stand,
  children,
}: {
  crumbs: Crumb[];
  locale: "de" | "en" | "tr";
  eyebrow: string;
  title: string;
  subtitle?: string;
  noticeLabel: string;
  notice: string;
  frameLabel: string;
  stand?: string;
  children: ReactNode;
}) {
  return (
    <MotionRoot>
      <div className="v7 pb-24 md:pb-40">
        <PlainHero eyebrow={eyebrow} h1={title} lede={subtitle} small crumbs={crumbs} locale={_locale} />
        <div className="mt-12 md:mt-20">
          <Frame label={frameLabel}>
            <Notice label={noticeLabel}>{notice}</Notice>
            <Prose className={LEGAL_PROSE}>{children}</Prose>
            {stand && <p className="f-mono mt-14 border-t border-wk-line-2 pt-5 text-[13px] text-wk-muted">{stand}</p>}
          </Frame>
        </div>
      </div>
    </MotionRoot>
  );
}
