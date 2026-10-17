import type { SceneId } from "@/components/v4/scenes";

export type L3 = "de" | "en" | "tr";
export type Link = { label: string; href: string };

type BlockBase = {
  id?: string;
  eyebrow?: string;
  h: string;
  lede?: string;
  /** 3D scene the stage morphs to while this section is in view. */
  scene?: SceneId;
  /** Plate indices (0 Agents … 6 Schulungen) to light up in the scene. */
  heat?: number[];
  /** Dim the 3D object behind wide content. */
  dim?: boolean;
  cta?: Link;
};

export type Block =
  | (BlockBase & { t: "rows"; items: { h: string; p: string; tag?: string; href?: string }[] })
  | (BlockBase & { t: "steps"; items: { h: string; p: string }[] })
  | (BlockBase & { t: "tags"; items: string[] })
  | (BlockBase & { t: "table"; caption?: string; cols: string[]; rows: string[][]; note?: string })
  | (BlockBase & { t: "text"; paras: string[] })
  | (BlockBase & { t: "spec"; rows: [string, string][] })
  | (BlockBase & { t: "demo"; note: string; play: string; again: string; chip: string; sr: string; script: { who: string; agent: boolean; text: string; ms: number }[] });

export type Faq = { h: string; items: { q: string; a: string }[] };

export type PageDef = {
  slug: string; // route segment, "" for home
  meta: { title: string; description: string };
  crumb: string;
  hero: {
    eyebrow: string;
    h1: [string, string, string]; // pre, emphasised, post
    lede: string;
    primary: Link;
    secondary?: Link;
    scene: SceneId;
    heat?: number[];
    spec?: [string, string][];
  };
  blocks: Block[];
  faq?: Faq;
  cta: { h: string; p: string; primary: Link; secondary?: Link };
  /** Service schema + offers (only real, published prices). */
  service?: { type: string; offers?: { name: string; price: number; from?: boolean }[] };
};

export type PageSet = Record<L3, PageDef>;
