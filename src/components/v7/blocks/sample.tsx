import type { BlockProps } from "@/content/v7/types";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

/** A sample deliverable, visibly stamped as a sample. */
export function SampleBlock({ block: b, locale, num }: BlockProps<"sample">) {
  // On phones the stamp sits in the flow above the title, so a longer stamp ("Beispiel, fiktiv") never squeezes it.
  const pad = b.mark.length > 8 ? "sm:pr-36 md:pr-44" : "sm:pr-24";
  const meta = b.meta.split(" · ");
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale}>
      <Reveal className="mt-10 md:mt-14">
        <div className="relative max-w-[720px] rounded-[18px] border border-wk-line bg-wk-sheet p-5 shadow-[0_1px_0_rgba(22,25,29,0.04),0_24px_44px_-28px_rgba(22,25,29,0.28)] md:p-8">
          <span className="f-mono mb-3 inline-block rotate-[-2deg] rounded-md border border-wk-copper-deep px-2 py-0.5 text-[12px] uppercase text-wk-copper-deep sm:absolute sm:right-5 sm:top-5 sm:mb-0 sm:rotate-[4deg] md:right-8 md:top-7">
            {b.mark}
          </span>
          <div className={`border-b border-wk-line pb-4 ${pad}`}>
            <h3 className="f-display text-[1.5rem] leading-[1.15] md:text-[1.875rem]">{b.title}</h3>
            <p className="f-mono mt-2 text-[12px] leading-[1.7] text-wk-muted">
              {meta.map((part, i) => (
                <span key={part}>
                  {i > 0 && (
                    <span aria-hidden="true" className="hidden sm:inline">
                      {" · "}
                    </span>
                  )}
                  <span className="block sm:inline">{part}</span>
                </span>
              ))}
            </p>
          </div>
          {b.rows.length > 0 && (
            <dl className="divide-y divide-wk-line text-[15px]">
              {b.rows.map(([k, v]) => (
                <div key={k} className="grid gap-x-6 gap-y-1 py-3.5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                  <dt className="text-wk-ink">{k}</dt>
                  <dd className="text-wk-muted sm:text-right">
                    <span className="rounded-full border border-wk-line px-2.5 py-0.5 text-[13px]">{v}</span>
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {b.sections && (
            // The report reads as one ruled document: a copper rule down the left, numbered sections.
            <div className="mt-6 border-l border-wk-copper pl-4 md:pl-6">
              {b.sections.map((s, i) => {
                const List = s.ordered ? "ol" : "ul";
                return (
                  <div key={s.h} className="border-b border-wk-line py-6 first:pt-1 last:border-b-0 last:pb-1">
                    <h4 className="f-mono text-[12px] tracking-[0.04em] text-wk-copper-deep">
                      <span className="mr-3">{String(i + 1).padStart(2, "0")}</span>
                      {s.h}
                    </h4>
                    <List className={`mt-3 space-y-2.5 text-[15px] leading-[1.6] text-wk-ink [text-wrap:wrap] ${s.ordered ? "list-decimal pl-5 marker:text-wk-copper-deep" : "list-none p-0"}`}>
                      {s.items.map((it) =>
                        s.ordered ? (
                          <li key={it} className="pl-1">
                            {it}
                          </li>
                        ) : (
                          <li key={it} className="flex gap-3">
                            <span aria-hidden="true" className="mt-[0.8em] h-px w-3 shrink-0 bg-wk-copper" />
                            <span>{it}</span>
                          </li>
                        ),
                      )}
                    </List>
                  </div>
                );
              })}
            </div>
          )}
          <p className={`${b.sections ? "mt-6" : "mt-4"} border-t border-wk-line pt-4 text-[14px] leading-[1.6] text-wk-muted`}>{b.foot}</p>
        </div>
      </Reveal>
    </Section>
  );
}
