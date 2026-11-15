import type { Picture } from "@/content/v7/types";
import { Etikett } from "./Etikett";
import { WkPicture } from "./WkPicture";

/**
 * A picture with its Etikett under it (rule 6: every render, sample or screen says what it is). `bleed` lets the
 * picture run out of the wrap to that viewport edge (the section must clip; the hero does). `tone` only switches
 * the caption colour where the figure sits on a dark ground without a .wk-on-ink ancestor.
 */
export function LabelledFigure({
  pic,
  tone = "light",
  bleed,
  className,
  sizes,
}: {
  pic: Picture;
  tone?: "light" | "dark";
  bleed?: "left" | "right";
  className?: string;
  sizes?: string;
}) {
  return (
    <figure className={`wk-figure${bleed ? ` is-bleed-${bleed}` : ""}${tone === "dark" ? " is-dark" : ""}${className ? ` ${className}` : ""}`}>
      <WkPicture pic={pic} sizes={sizes} />
      <Etikett as="figcaption">{pic.etikett}</Etikett>
    </figure>
  );
}
