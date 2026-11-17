import type { BlockProps } from "@/content/v7/types";
import { MediaFigure } from "../MediaFigure";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

/** A full-width labelled figure (video or image) under the section head; the Etikett comes from MediaFigure. */
export function MediaBlock({ block: b, locale, num }: BlockProps<"media">) {
  return (
    <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale} wide>
      <Reveal>
        <MediaFigure media={b.media} locale={locale} />
      </Reveal>
    </Section>
  );
}
