import { Section } from "@/components/v7/Section";
import type { BlockProps } from "@/content/v7/types";
import { DemoPlayer } from "./demo-player";

export function DemoBlock({ block, locale, num }: BlockProps<"demo">) {
  return (
    <Section id={block.id} num={num} label={block.label} note={block.note} h={block.h} lede={block.lede} cta={block.cta} locale={locale}>
      <DemoPlayer block={block} />
    </Section>
  );
}
