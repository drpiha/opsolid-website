import type { BlockProps } from "@/content/v7/types";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

/** One task before and after (an example, labelled by `tag`). */
export function CompareBlock({ block: b, locale, num }: BlockProps<"compare">) {
  const col = (side: "before" | "after") => {
    const c = b[side];
    const after = side === "after";
    return (
      <Reveal delay={after ? 0.1 : 0} className={`rounded-[24px] border p-6 md:p-8 ${after ? "border-wk-copper/50 bg-wk-sheet" : "border-wk-line bg-wk-paper-2/60"}`}>
        <h3 className={`f-mono text-[12px] font-normal ${after ? "text-wk-copper-deep" : "text-wk-muted"}`}>{c.h}</h3>
        <ul className="mt-5 space-y-3">
          {c.items.map((it) => (
            <li key={it} className="flex gap-3 text-wk-ink">
              <span aria-hidden="true" className={`mt-[0.7em] h-px w-4 shrink-0 ${after ? "bg-wk-copper" : "bg-wk-muted"}`} />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    );
  };
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale}>
      {b.tag && (
        <p className="f-mono mt-6 inline-block rounded-full border border-wk-copper/50 px-3 py-1 text-[12px] text-wk-copper-deep">{b.tag}</p>
      )}
      <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2">
        {col("before")}
        {col("after")}
      </div>
    </Section>
  );
}
