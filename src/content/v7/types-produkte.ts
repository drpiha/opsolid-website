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

/**
 * Every string of the OpSo card studio, the hero of the `opsoKarte` page (`hero.studio`, hero/HeroStudio.tsx). The
 * client component gets one locale as a prop.
 */
export type StudioText = {
  stage: {
    /** Etikett over the preview while the sample person shows, and once the visitor's own details show. */
    sample: string;
    own: string;
    front: string;
    back: string;
    /** Accessible name of the face switch. */
    sides: string;
    /** Screen-reader description of the preview; {side} is replaced with `front` or `back`. */
    alt: string;
    /** The two card dimensions for the rulers ("85,6 mm", "54 mm"). */
    long: string;
    short: string;
    caption: string;
    unavailable: string;
    /** Etikett on the mat while the typed text does not fit the chosen layout (the card keeps the last version that fits). */
    tight: string;
  };
  docket: {
    /** Head of the job line; the layout name and the shown face follow ("Auftrag · Entwurf · Layout Onyx · Rückseite"). */
    title: string;
    name: string;
    title2: string;
    org: string;
    line1: string;
    line2: string;
    lineHint: string;
    linkNote: string;
    layout: string;
    layouts: Record<"onyx" | "linea" | "monolith", { name: string; note: string }>;
    tight: string;
    useOnyx: string;
    glyphs: string;
  };
  /** Sample person shown until the visitor types a name (fictional, German or English names only). */
  sample: { name: string; title: string; org: string; line: string };
  /** One price, with its status beside it at the same size (legal check of 2026-11-19). */
  price: { label: string; value: string; status: string; note: string };
  /** `consentLink`: the words of `consent` that link to the privacy page. */
  /**
   * "Vormerken" (double opt-in through the OpSo API). `consent` is the sentence the click agrees to; its wording per
   * language is archived in `docs/consent/` under the version id the OpSo API stores with each registration.
   */
  interest: {
    open: string;
    email: string;
    consent: string;
    consentLink: string;
    send: string;
    sending: string;
    sentState: string;
    sent: string;
    errors: { email: string; name: string; busy: string; down: string };
    trap: string;
  };
};
