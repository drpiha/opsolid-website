/**
 * Produkte page block types (design C "Werkstatt"). Initial shapes by the foundation; package P3 refines this file
 * and registers every member in src/components/v7/blocks/registry-produkte.ts (tsc fails otherwise).
 */
import type { Chip, Href, Img, SectionBase } from "./types";

export type ProdukteBlock =
  | (SectionBase & {
      t: "app";
      etikett: string;
      chip: Chip;
      free: string;
      stores: { link: Href; shown: string }[];
      note: string;
      more: Href;
      phones: { img: Img; caption: string }[];
      phonesEtikett: string;
    })
  | (SectionBase & {
      t: "why";
      cards: { tone: "ink" | "slate"; etikett: string; h: string; chip: Chip; credit?: string; link: Href }[];
      footnote: string;
    });
