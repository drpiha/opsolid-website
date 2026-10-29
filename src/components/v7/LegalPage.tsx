import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { MotionRoot } from "./MotionRoot";
import { Prose } from "./Prose";
import { wrap } from "./ui";

const rise = (ms: number) => ({ ["--d" as string]: `${ms}ms` });

/** Short page hero without buttons or figure: eyebrow with copper rule, H1 and an optional lede. Used by the journal, legal pages and the 404. */
export function PlainHero({
  eyebrow,
  h1,
  lede,
  small,
  id = "hero-h",
  children,
}: {
  eyebrow: ReactNode;
  h1: ReactNode;
  lede?: string;
  small?: boolean;
  id?: string;
  children?: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={`${wrap} pb-4 pt-10 md:pt-20`}>
      <div className="grid gap-x-8 md:grid-cols-12">
        <div className="md:col-span-10">
          <p className="v7-rise f-mono flex max-w-[64ch] items-start gap-3 text-[12px] uppercase leading-[1.6] text-[#8A4524] md:text-[13px]" style={rise(0)}>
            <span aria-hidden="true" className="mt-[0.8em] h-px w-8 shrink-0 bg-[#B5623A]" />
            <span>{eyebrow}</span>
          </p>
          <h1
            id={id}
            className={`v7-rise f-display mt-8 font-light leading-[1.05] tracking-[-0.02em] text-[#16191D] ${
              small ? "text-[clamp(2rem,4.4vw,3.75rem)]" : "text-[clamp(2.25rem,5.4vw,5.25rem)]"
            }`}
            style={rise(80)}
          >
            {h1}
          </h1>
          {lede && (
            <p className="v7-rise mt-9 max-w-[38rem] text-[18px] leading-[1.6] text-[#16191D] md:text-[20px]" style={rise(160)}>
              {lede}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}

/** Content frame in the v7 section language: top hairline with a copper tick, mono label on the left, content on the right. */
export function Frame({ label, note, children, className = "" }: { label: string; note?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`${wrap} ${className}`}>
      <div className="relative grid gap-x-8 gap-y-8 border-t border-[#E3DCD1] pt-6 md:grid-cols-12">
        <span aria-hidden="true" className="absolute -top-px left-0 h-px w-14 bg-[#B5623A]" />
        <div className="md:col-span-3">
          <p className="f-mono text-[12px] uppercase leading-[1.7] text-[#6B665F]">{label}</p>
          {note && <div className="mt-3 hidden max-w-[24ch] text-[14px] leading-[1.5] text-[#6B665F] md:block">{note}</div>}
        </div>
        <div className="min-w-0 md:col-span-9">{children}</div>
      </div>
    </div>
  );
}

/** Notice box on legal pages (the existing hint text, unchanged). */
export function Notice({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="note" aria-label={label} className="mb-12 max-w-[68ch] rounded-[16px] border border-[#E3DCD1] bg-white px-5 py-4 text-[15px] leading-[1.6] text-[#16191D]">
      <p className="f-mono mb-2 text-[12px] uppercase text-[#8A4524]">{label}</p>
      <p>{children}</p>
    </div>
  );
}

/** Legal prose: the headings are smaller than in journal posts. */
export const LEGAL_PROSE =
  "[&_h2]:!mt-12 [&_h2]:!text-[1.375rem] md:[&_h2]:!text-[1.625rem] [&_h3]:!mt-7 [&_h3]:!text-[1.125rem] md:[&_h3]:!text-[1.25rem] [&_section+section]:mt-14 [&_section+section]:border-t [&_section+section]:border-[#E3DCD1] [&_section+section]:pt-2 [&_p]:break-words";

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
        <Breadcrumbs crumbs={crumbs} locale={_locale} />
        <PlainHero eyebrow={eyebrow} h1={title} lede={subtitle} small />
        <div className="mt-16 md:mt-24">
          <Frame label={frameLabel}>
            <Notice label={noticeLabel}>{notice}</Notice>
            <Prose className={LEGAL_PROSE}>{children}</Prose>
            {stand && <p className="f-mono mt-14 border-t border-[#E3DCD1] pt-5 text-[12px] uppercase text-[#6B665F]">{stand}</p>}
          </Frame>
        </div>
      </div>
    </MotionRoot>
  );
}
