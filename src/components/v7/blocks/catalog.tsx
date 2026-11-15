import type { BlockProps } from "@/content/v7/types";
import { Section } from "../Section";

/** Stub from the foundation: the section frame with label, heading and lede. Package P2 builds the hub course catalog. */
export function CatalogBlock({ block: b, locale, num }: BlockProps<"catalog">) {
  return <Section id={b.id} num={num} label={b.label} note={b.note} h={b.h} lede={b.lede} cta={b.cta} ground={b.ground} mat={b.mat} locale={locale} />;
}
