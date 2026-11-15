import { Fragment } from "react";
import type { Faq, Ground } from "@/content/v7/types";
import { soft } from "@/lib/soft-hyphen";
import type { L3 } from "@/lib/v7-routes";
import { FaqList } from "./Faq";
import { wrap } from "./ui";
import { Etikett } from "./werkstatt/Etikett";

const MAIL = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/;

/** Sets an e-mail address inside the aside line as a mailto link. */
function withMail(text: string) {
  return text.split(MAIL).map((part, i) =>
    MAIL.test(part) && i % 2 === 1 ? (
      <a key={i} href={`mailto:${part}`} className="wk-tlink">
        {part}
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/**
 * The visible FAQ section (also the only source of the FAQPage markup): a sticky side column with the Etikett, the
 * H2 and the optional `faq.aside` line (an address in it becomes a mail link), the questions on the right.
 * Unnumbered; the ground continues the page's alternation (V7Page).
 */
export function FaqSection({ faq, ground = "paper" }: { faq: Faq; locale: L3; ground?: Ground }) {
  return (
    <section id="faq" aria-labelledby="faq-h" data-ground={ground} className={`wk-sec wk-on-${ground}`}>
      <div className={`${wrap} wk-faq-grid`}>
        <div className="wk-faq-side">
          <Etikett solid>{faq.label}</Etikett>
          <h2 id="faq-h" className="wk-d2">
            {soft(faq.h)}
          </h2>
          {faq.aside && <p>{withMail(faq.aside)}</p>}
        </div>
        <FaqList items={faq.items} />
      </div>
    </section>
  );
}
