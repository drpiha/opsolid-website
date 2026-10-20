export type L3 = "de" | "en" | "tr";
export type Link = { label: string; href: string };

/** A real screenshot of our own work (public/img/v4/shot-*.webp), shown in the HTML next to the row text. */
export type Shot = { src: string; w: number; h: number; alt: string };

/** A published price. All prices are net (plus VAT); `unit` marks recurring prices. */
export type Offer = { name: string; price: number; from?: boolean; unit?: "month" | "year" };

type BlockBase = {
  id?: string;
  eyebrow?: string;
  h: string;
  lede?: string;
  cta?: Link;
};

export type Block =
  | (BlockBase & { t: "rows"; items: { h: string; p: string; tag?: string; href?: string; shot?: Shot }[] })
  | (BlockBase & { t: "steps"; items: { h: string; p: string }[] })
  | (BlockBase & { t: "tags"; items: string[] })
  | (BlockBase & { t: "table"; caption?: string; cols: string[]; rows: string[][]; note?: string })
  | (BlockBase & { t: "text"; paras: string[] })
  | (BlockBase & { t: "spec"; rows: [string, string][] })
  | (BlockBase & { t: "demo"; note: string; play: string; again: string; chip: string; sr: string; script: { who: string; agent: boolean; text: string; ms: number }[] })
  /** Two columns side by side: how a task runs today and after the change. */
  | (BlockBase & { t: "compare"; before: { h: string; items: string[] }; after: { h: string; items: string[] } })
  /** One published offer as a dark card beside an optional screenshot. `amount` must be a published price. */
  | (BlockBase & { t: "offer"; label: string; amount: string; unit?: string; sub?: string; items: string[]; note: string; shot?: Shot });

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
    spec?: [string, string][];
  };
  blocks: Block[];
  faq?: Faq;
  cta: { h: string; p: string; primary: Link; secondary?: Link };
  /** Service schema + offers (only real, published prices). */
  service?: { type: string; offers?: Offer[] };
};

export type PageSet = Record<L3, PageDef>;
