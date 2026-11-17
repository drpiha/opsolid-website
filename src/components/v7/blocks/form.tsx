import { Section } from "@/components/v7/Section";
import { h2, wrap } from "@/components/v7/ui";
import { Etikett } from "@/components/v7/werkstatt/Etikett";
import { HomeSection } from "@/components/v7/werkstatt/home/HomeSection";
import type { BlockProps } from "@/content/v7/types";
import { soft } from "@/lib/soft-hyphen";
import { FORM } from "@/content/v7/form";
import { ContactForm } from "./contact-form";

/**
 * The contact form. `variant: "home"` (the home page's closing section #kontakt, ink with the mat): the copy column
 * (Etikett, H2, lede, the mail alternative and "Was danach passiert", sticky from 961 px) beside the form card.
 * Phones: one column, the next-steps list hidden. Every other page keeps the standard section frame.
 */
export function FormBlock({ block, locale, num }: BlockProps<"form">) {
  if (block.variant === "home") {
    const a = block.aside;
    return (
      <HomeSection id={block.id} ground={block.ground} mat={block.mat} className="wk-contact">
        <div className={`${wrap} wk-contact-grid`}>
          <div className="wk-contact-copy">
            <Etikett solid>{block.label}</Etikett>
            <h2 id={`${block.id}-h`} className={h2}>
              {soft(block.h)}
            </h2>
            {block.lede && <p className="wk-contact-lede">{block.lede}</p>}
            {a && (
              <div className="wk-contact-alt">
                <Etikett>{a.mailLabel}</Etikett>
                <a className="wk-tlink" href={`mailto:${a.mail}`}>
                  {a.mail}
                </a>
              </div>
            )}
            {a?.next && (
              <div className="wk-contact-next">
                <Etikett as="p">{a.next.h}</Etikett>
                <ol>
                  {a.next.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
          <ContactForm block={block} locale={locale} t={FORM[locale]} />
        </div>
      </HomeSection>
    );
  }
  return (
    <Section id={block.id} num={num} label={block.label} note={block.note} h={block.h} lede={block.lede} cta={block.cta} ground={block.ground} mat={block.mat} locale={locale}>
      <ContactForm block={block} locale={locale} t={FORM[locale]} />
    </Section>
  );
}
