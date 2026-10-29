import type { BlockProps } from "@/content/v7/types";
import { MediaFigure } from "../MediaFigure";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

/** A full-width figure band (video or image) under the section heading. */
export function MediaBlock({ block: b, locale, num }: BlockProps<"media">) {
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} locale={locale} wide>
      <Reveal className="mt-10 md:mt-14">
        <MediaFigure media={b.media} locale={locale} />
      </Reveal>
    </Section>
  );
}
