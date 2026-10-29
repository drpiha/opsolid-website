import { Section } from "@/components/v7/Section";
import type { BlockProps } from "@/content/v7/types";
import { ContactForm } from "./contact-form";

export function FormBlock({ block, locale, num }: BlockProps<"form">) {
  return (
    <Section id={block.id} num={num} label={block.label} note={block.note} h={block.h} lede={block.lede} cta={block.cta} locale={locale}>
      <ContactForm block={block} locale={locale} />
    </Section>
  );
}
