import { Section } from "@/components/v7/Section";
import type { BlockProps } from "@/content/v7/types";
import { SectorTabs } from "./sectors-tabs";

export function SectorsBlock({ block, locale, num }: BlockProps<"sectors">) {
  return (
    <Section id={block.id} num={num} label={block.label} note={block.note} h={block.h} lede={block.lede} cta={block.cta} locale={locale}>
      <SectorTabs block={block} locale={locale} />
    </Section>
  );
}
