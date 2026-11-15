/**
 * Home page block types (design C "Werkstatt"). Initial shapes by the foundation; package P1 refines this file
 * and registers every member in src/components/v7/blocks/registry-home.ts (tsc fails otherwise).
 */
import type { Chip, Href, Img, Picture, SectionBase } from "./types";

/** One door of the "Drei Wege" section: Schulungen (picture), Beratung (drawn Fragebogen), Produkte (app screen). */
export type Door = {
  tone: "schulungen" | "beratung" | "produkte";
  etikett: string;
  h: string;
  p?: string;
  chip: Chip;
  /** The KI-Check credit line next to its price chip. */
  credit?: string;
  link: Href;
  art:
    | { kind: "picture"; pic: Picture }
    | {
        kind: "fragebogen";
        title: string;
        sub: string;
        q: string;
        options: { text: string; on?: boolean }[];
        etikett: string;
        ariaLabel: string;
      }
    | { kind: "phone"; img: Img; etikett: string };
};

/** The two drawn pieces on the home hero bench: a sample exercise and a sample participation record. */
export type HomeBench = {
  ariaLabel: string;
  exercise: {
    etikett: string;
    ariaLabel: string;
    bar: [string, string];
    task: string;
    avatar: string;
    from: string;
    subject: string;
    mail: string;
    aiLabel: string;
    promptLabel: string;
    prompt: string;
    /** Draft text; `{ mark }` parts are the placeholders the team checks ("[Preis prüfen]"). */
    draft: (string | { mark: string })[];
    foot: { label: string; who: string }[];
  };
  certificate: {
    ariaLabel: string;
    stamp: string;
    title: string;
    name: string;
    line: string;
    rows: [string, string][];
    foot: string;
    etikett: string;
  };
};

export type HomeBlock =
  | (SectionBase & { t: "doors"; doors: [Door, Door, Door]; footnote: string })
  | (SectionBase & {
      t: "check";
      etikett: string;
      price: string;
      terms: [string, string];
      points: { b: string; rest: string }[];
      primary: Href;
      secondary?: Href;
      priceNote: string;
      report: {
        ariaLabel: string;
        title: string;
        meta: string;
        stamp: string;
        h: string;
        items: { b: string; more: string }[];
        manualH: string;
        manual: string;
        recH: string;
        rec: string;
        etikett: string;
      };
    })
  | (SectionBase & {
      t: "products";
      etikett: string;
      app: { name: string; chip: Chip; p: string; stores: Href[]; all: Href };
      stage: { render: Picture; phone: { img: Img; etikett: string } };
      line: { name: string; chip: Chip; p: string; to: Href }[];
    });
