/**
 * Schulungen hub block types (design C "Werkstatt"). Initial shapes by the foundation; package P2 refines this file
 * and registers every member in src/components/v7/blocks/registry-hub.ts (tsc fails otherwise).
 */
import type { Href, SectionBase } from "./types";

/** The drawn piece on a catalog card: a sample timetable, the six blocks of the day, or a workflow schema. */
export type CourseArt =
  | { kind: "zeitplan"; tiles: { n?: string; w: number; pause?: boolean }[]; ends: [string, string, string]; topics: string[]; ariaLabel: string; etikett: string }
  | { kind: "bloecke"; blockLabel: string; blocks: { b: string; small: string }[]; etikett: string }
  | { kind: "workflow"; steps: { b: string; small: string; role?: "ai" | "key" }[]; ariaLabel: string; etikett: string };

export type HubBlock =
  | (SectionBase & {
      t: "catalog";
      items: {
        id: string;
        tag: string;
        name: string;
        p: string;
        facts: [string, string, string];
        status: string;
        price: string;
        unit: string;
        arith?: string;
        art: CourseArt;
        primary: Href;
        detail: Href;
      }[];
      footnote: string;
      /** Planned courses (rule 5): names only, "geplant" chip, "Interesse vormerken" link. */
      planned: { id: string; label: string; chip: string; link: Href; names: readonly [string, string, string, string] };
    })
  | (SectionBase & {
      t: "format";
      etikett: string;
      ticks: { b: string; rest: string }[];
      session: {
        ariaLabel: string;
        bar: [string, string];
        exercise: string;
        title: string;
        steps: { b: string; rest: string }[];
        promptLabel: string;
        prompt: string;
        trainer: string;
        tiles: number;
        count: string;
        chat: [string, string];
        etikett: string;
      };
    });
