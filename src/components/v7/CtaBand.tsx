import type { PageDef } from "@/content/v7/types";
import type { L3 } from "@/lib/v7-routes";
import { LinkTo } from "./LinkTo";
import { Reveal } from "./Reveal";
import { btnOnInk, wrap } from "./ui";

const arrow = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 8h11M9 3.5L13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

/** The one dark ink panel of a page. The last word of the headline is set in light copper italic. */
export function CtaBand({ cta, locale }: { cta: PageDef["cta"]; locale: L3 }) {
  const words = cta.h.trim().split(/\s+/);
  const last = words.pop() ?? "";
  return (
    <div id="cta" className="on-ink mt-24 scroll-mt-16 bg-[#16191D] text-[#F6F2EC] md:mt-40">
      <section aria-labelledby="cta-h" className={`${wrap} py-20 md:py-36`}>
        <Reveal>
          <p className="f-mono flex items-center gap-3 text-[12px] uppercase text-[#E3B79C]">
            <span aria-hidden="true" className="h-px w-8 bg-[#B5623A]" />
            {cta.label}
          </p>
          <h2 id="cta-h" className="f-display mt-8 max-w-[18ch] text-balance text-[clamp(2.25rem,5.6vw,5rem)] leading-[1.05] tracking-[-0.015em]">
            {words.join(" ")} <em className="italic text-[#D98C65]">{last}</em>
          </h2>
          <p className="mt-8 max-w-[52ch] text-[17px] leading-[1.6] text-[#C9C2B8]">{cta.p}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
            <LinkTo link={cta.primary} locale={locale} className={btnOnInk}>
              {cta.primary.label}
              {arrow}
            </LinkTo>
            {cta.secondary && (
              <LinkTo
                link={cta.secondary}
                locale={locale}
                className="inline-flex min-h-[44px] items-center text-[16px] text-[#F6F2EC] underline decoration-[#B5623A] underline-offset-[6px] hover:decoration-[#E3B79C]"
              >
                {cta.secondary.label}
              </LinkTo>
            )}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
