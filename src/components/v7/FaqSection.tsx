import type { Faq } from "@/content/v7/types";
import type { L3 } from "@/lib/v7-routes";
import { FaqList } from "./Faq";
import { Section } from "./Section";

/** The visible FAQ section (also the only source of the FAQPage markup). Unnumbered, like the lab. */
export function FaqSection({ faq, locale }: { faq: Faq; locale: L3 }) {
  return (
    <Section id="faq" label={faq.label} h={faq.h} locale={locale}>
      <div className="mt-10 md:mt-14">
        <FaqList items={faq.items} />
      </div>
    </Section>
  );
}
