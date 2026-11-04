import type { BlockProps } from "@/content/v7/types";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

/** A sample deliverable, visibly stamped as a sample. */
export function SampleBlock({ block: b, locale, num }: BlockProps<"sample">) {
  // On phones the stamp sits in the flow above the title, so a longer stamp ("Beispiel, fiktiv") never squeezes it.
  const pad = b.mark.length > 8 ? "sm:pr-36 md:pr-44" : "sm:pr-24";
  const meta = b.meta.split(" · ");
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} locale={locale}>
      <Reveal className="mt-10 md:mt-14">
        <div className="relative max-w-[720px] rounded-[18px] border border-[#E3DCD1] bg-white p-5 shadow-[0_1px_0_rgba(22,25,29,0.04),0_24px_44px_-28px_rgba(22,25,29,0.28)] md:p-8">
          <span className="f-mono mb-3 inline-block rotate-[-2deg] rounded-md border border-[#8A4524] px-2 py-0.5 text-[12px] uppercase text-[#8A4524] sm:absolute sm:right-5 sm:top-5 sm:mb-0 sm:rotate-[4deg] md:right-8 md:top-7">
            {b.mark}
          </span>
          <div className={`border-b border-[#E3DCD1] pb-4 ${pad}`}>
            <h3 className="f-display text-[1.5rem] leading-[1.15] md:text-[1.875rem]">{b.title}</h3>
            <p className="f-mono mt-2 text-[12px] uppercase leading-[1.7] text-[#6B665F]">
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
            <dl className="divide-y divide-[#E3DCD1] text-[15px]">
              {b.rows.map(([k, v]) => (
                <div key={k} className="grid gap-x-6 gap-y-1 py-3.5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                  <dt className="text-[#16191D]">{k}</dt>
                  <dd className="text-[#6B665F] sm:text-right">
                    <span className="rounded-full border border-[#E3DCD1] px-2.5 py-0.5 text-[13px]">{v}</span>
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {b.sections && (
            // The report reads as one ruled document: a copper rule down the left, numbered sections.
            <div className="mt-6 border-l border-[#B5623A] pl-4 md:pl-6">
              {b.sections.map((s, i) => {
                const List = s.ordered ? "ol" : "ul";
                return (
                  <div key={s.h} className="border-b border-[#E3DCD1] py-6 first:pt-1 last:border-b-0 last:pb-1">
                    <h4 className="f-mono text-[12px] uppercase tracking-[0.04em] text-[#8A4524]">
                      <span className="mr-3">{String(i + 1).padStart(2, "0")}</span>
                      {s.h}
                    </h4>
                    <List className={`mt-3 space-y-2.5 text-[15px] leading-[1.6] text-[#16191D] ${s.ordered ? "list-decimal pl-5 marker:text-[#8A4524]" : "list-none p-0"}`}>
                      {s.items.map((it) =>
                        s.ordered ? (
                          <li key={it} className="pl-1">
                            {it}
                          </li>
                        ) : (
                          <li key={it} className="flex gap-3">
                            <span aria-hidden="true" className="mt-[0.8em] h-px w-3 shrink-0 bg-[#B5623A]" />
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
          <p className={`${b.sections ? "mt-6" : "mt-4"} border-t border-[#E3DCD1] pt-4 text-[14px] leading-[1.6] text-[#6B665F]`}>{b.foot}</p>
        </div>
      </Reveal>
    </Section>
  );
}
