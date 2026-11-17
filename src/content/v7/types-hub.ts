/**
 * Schulungen hub block types (design C "Werkstatt", package P2). Every member is registered in
 * src/components/v7/blocks/registry-hub.ts (tsc fails otherwise).
 */
import type { Href, SectionBase } from "./types";

/**
 * The drawn piece on a catalog card (rule 6: every piece carries its Etikett):
 * - zeitplan: a sample timetable (plan bar with weighted tiles, three time marks, the six topics);
 * - bloecke: the six blocks of the day (`blockLabel` is the word before each number, "Block 1");
 * - workflow: a four-box workflow schema; `role: "ai"` gets the copper border, `"key"` the ink fill.
 */
export type CourseArt =
  | { kind: "zeitplan"; tiles: { n?: string; w: number; pause?: boolean }[]; ends: [string, string, string]; topics: string[]; ariaLabel: string; etikett: string }
  | { kind: "bloecke"; blockLabel: string; blocks: { b: string; small: string }[]; etikett: string }
  | { kind: "workflow"; steps: { b: string; small: string; role?: "ai" | "key" }[]; ariaLabel: string; etikett: string };

export type CatalogItem = {
  /** Anchor of the card (jump pills, menu): grundlagen, copilot, automatisierung. */
  id: string;
  /** Track tag, shown as a solid Etikett ("Grundlagen"). */
  tag: string;
  name: string;
  p: string;
  /** [duration, persons, extra person] from OFFERS. */
  facts: [string, string, string];
  /** Live status ("Termin auf Anfrage"), shown as a live chip. */
  status: string;
  /** Team price alone ("ab 1.790 €"); a leading "ab" / "from" is set small. */
  price: string;
  unit: string;
  /** Per-person arithmetic (KI-Kompetenz Basis and Copilot-Praxistag only, rule 1). */
  arith?: string;
  art: CourseArt;
  primary: Href;
  detail: Href;
};

export type HubBlock =
  | (SectionBase & {
      t: "catalog";
      items: CatalogItem[];
      footnote: string;
      /** Planned courses (rule 5): names only, "geplant" chip, "Interesse vormerken" link. */
      planned: { id: string; label: string; chip: string; link: Href; names: readonly [string, string, string, string] };
    })
  | (SectionBase & {
      t: "format";
      /** The solid Etikett over the H2 (the section has no split head). */
      etikett: string;
      ticks: { b: string; rest: string }[];
      session: {
        ariaLabel: string;
        /** [bold, rest, right]: "Live-Termin", "KI-Kompetenz Basis", "geschlossener Termin". */
        bar: [string, string, string];
        exercise: string;
        title: string;
        steps: { b: string; rest: string }[];
        promptLabel: string;
        prompt: string;
        trainer: string;
        /** Number of neutral participant tiles (numbered, no initials). */
        tiles: number;
        count: string;
        /** [question, answer] in the chat. */
        chat: [string, string];
        etikett: string;
      };
    });
