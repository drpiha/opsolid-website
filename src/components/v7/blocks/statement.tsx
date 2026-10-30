import type { BlockProps } from "@/content/v7/types";
import { Reveal } from "../Reveal";
import { wrap } from "../ui";

/**
 * The one break from the section template: a full-bleed ink band carrying the page's key sentence in
 * display type. Not numbered, not a quote (no marks, no attribution). A copper hairline and a faint
 * nested-squares outline (the brand mark, decoration only) are its only ornaments. A final full stop is
 * dropped so it sets like a headline.
 */
export function StatementBlock({ block }: BlockProps<"statement">) {
  const text = block.text.trim().replace(/\.$/, "");
  return (
    <section id={block.id} aria-label={block.label} className="on-ink relative mt-28 overflow-hidden bg-[#16191D] text-[#F6F2EC] md:mt-40">
      <svg
        aria-hidden="true"
        viewBox="0 0 320 320"
        className="pointer-events-none absolute -bottom-24 -right-20 hidden w-[520px] text-[#B5623A] md:block lg:-right-10 lg:w-[600px]"
        fill="none"
        stroke="currentColor"
      >
        <rect x="1" y="1" width="318" height="318" rx="84" strokeOpacity="0.28" />
        <rect x="31" y="31" width="258" height="258" rx="62" strokeOpacity="0.22" />
        <rect x="61" y="61" width="198" height="198" rx="42" strokeOpacity="0.16" />
        <rect x="91" y="91" width="138" height="138" rx="24" strokeOpacity="0.1" />
      </svg>
      <div className={`${wrap} relative py-20 md:py-36`}>
        <span aria-hidden="true" className="block h-px w-14 bg-[#B5623A]" />
        <Reveal>
          <p className="f-display mt-10 max-w-[19ch] text-balance text-[clamp(2.125rem,9vw,2.75rem)] font-light leading-[1.06] tracking-[-0.018em] md:mt-14 md:max-w-[17ch] md:text-[clamp(3.5rem,5.6vw,5rem)] md:leading-[1.03]">
            {text}
          </p>
          {block.note && <p className="f-mono mt-10 max-w-[56ch] text-[12px] uppercase leading-[1.8] text-[#C9C2B8] md:mt-14">{block.note}</p>}
        </Reveal>
      </div>
    </section>
  );
}
