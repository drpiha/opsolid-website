/**
 * v7 marketing page model (relaunch 2026-10-29, direction A "Klarheit").
 *
 * One module per page, src/content/v7/pages/<key>.ts, exports `page: PageSet` with de, en and tr in
 * full key parity (same blocks, same item counts, same ids). German is the source; en/tr are
 * transcreations, not word-for-word translations. Every string is visible copy: never put a price,
 * number, client, quote or claim here that the build brief does not allow.
 */
import type { L3, PageKey } from "@/lib/v7-routes";

export type { L3, PageKey };

/**
 * A link to a v7 page by key (localized automatically), or a raw mailto:/tel: href.
 * `query` adds search parameters, e.g. { anliegen: "ki-check" } to pre-select the contact form topic.
 */
export type Href =
  | { label: string; to: PageKey; hash?: string; sub?: string; query?: Record<string, string> }
  | { label: string; href: `mailto:${string}` | `tel:${string}` }
  /** External link (same tab, rel="noopener noreferrer"), e.g. the founder's LinkedIn on the About page. */
  | { label: string; href: `https://${string}` };

/** A same-origin image in /public with its intrinsic size. */
export type Img = { src: string; w: number; h: number; alt: string };

export type Frame = "none" | "browser" | "phone";

/**
 * A figure. `fig` is the editorial figure number shown in the caption ("Abb. 1.1"). `ai: true` adds the
 * visible "KI-generiert" label to the caption (always set it for AI-generated images and videos).
 * Videos are decoration: no text, people, logos or claims in them.
 */
export type Media =
  /** `labels`: the four stage names drawn under the figure, per page (default: the consulting flow). */
  | { kind: "svg"; name: "squares" | "flow"; alt: string; caption?: string; fig?: string; labels?: [string, string, string, string] }
  | { kind: "image"; img: Img; frame?: Frame; caption?: string; fig?: string; ai?: boolean }
  | {
      kind: "video";
      poster: Img;
      posterPortrait?: Img;
      mp4: string;
      webm?: string;
      mp4Portrait?: string;
      webmPortrait?: string;
      alt: string;
      caption?: string;
      fig?: string;
      ai: boolean;
    };

type SectionBase = {
  /** Anchor, unique per page, [a-z0-9-]. */
  id: string;
  /** Mono label in the left column ("Vorgehen"). The renderer numbers sections 01, 02, … */
  label: string;
  /** One short line under the label. */
  note?: string;
  /** The H2. */
  h: string;
  /** Answer-first lede under the H2: one or two plain sentences that answer the section's question. */
  lede?: string;
  cta?: Href;
};

export type Block =
  /** Situations / pain points: 3 to 6 short cards. */
  | (SectionBase & { t: "situations"; items: { h: string; p: string }[] })
  /** The signature process line: exactly 4 steps, each with its tangible result. */
  | (SectionBase & { t: "process"; steps: { name: string; h: string; p: string; result: string; meta?: string }[] })
  /** Example scenarios, always labelled by `tag` ("Beispiel-Szenario"): before, after, the human step. */
  | (SectionBase & { t: "examples"; tag: string; items: { area: string; h: string; before: string; after: string; human: string; href?: Href }[] })
  /** Principles / commitments: 3 to 6 numbered items. */
  | (SectionBase & { t: "principles"; items: { h: string; p: string }[] })
  /** Offer ladder or rate cards. `price` only from the published list ("ab 490 €"); omit it when unpublished. */
  | (SectionBase & {
      t: "offers";
      items: { name: string; price?: string; unit?: string; p: string; points: string[]; href?: Href; featured?: boolean }[];
      /** Terms line under the cards (price note). `note` stays the left-column line of the section. */
      footnote: string;
    })
  /** Hairline ledger of rows, optionally linked, optionally with a real screenshot of our own work. */
  | (SectionBase & { t: "rows"; items: { h: string; p: string; tag?: string; href?: Href; img?: Img }[] })
  /** Plain numbered steps. */
  | (SectionBase & { t: "steps"; items: { h: string; p: string }[] })
  /** One task before and after (an example, labelled by `tag`). */
  | (SectionBase & { t: "compare"; tag?: string; before: { h: string; items: string[] }; after: { h: string; items: string[] } })
  /** A table (rate card, comparison). */
  | (SectionBase & { t: "table"; caption: string; cols: string[]; rows: string[][]; footnote?: string })
  /** Key-value list (scope, format, duration, group size). */
  | (SectionBase & { t: "spec"; rows: [string, string][]; footnote?: string })
  /** Plain paragraphs. */
  | (SectionBase & { t: "text"; paras: string[] })
  /** A sample deliverable, visibly stamped as a sample (`mark`: "Muster"). */
  | (SectionBase & { t: "sample"; mark: string; title: string; meta: string; rows: [string, string][]; foot: string })
  /** Use cases by sector: tabs on wide screens, stacked on phones. Ideas are examples, labelled by `tag`. */
  | (SectionBase & { t: "sectors"; tag: string; items: { name: string; /** Short tab label; falls back to `name`. */ tab?: string; h: string; p: string; ideas: string[]; stays: string }[] })
  /** Training catalogue. "bookable" items carry a published price; "planned" items never show a price. */
  | (SectionBase & {
      t: "courses";
      items: { name: string; status: "bookable" | "planned"; statusLabel: string; format: string; p: string; price?: string; href?: Href }[];
      footnote?: string;
    })
  /** Our own work only, with real screenshots in a frame. */
  | (SectionBase & { t: "projects"; items: { name: string; status: string; p: string; points?: string[]; img: Img; frame: Frame; href?: Href }[] })
  /** Teaser for our own product (OpSo). */
  | (SectionBase & {
      t: "product";
      name: string;
      status: string;
      p: string;
      points: string[];
      /** A labelled price line (e.g. a planned price), shown apart from the points. */
      price?: { label: string; value: string };
      media: Media;
      href?: Href;
    })
  /** Gallery of real screens with captions. */
  | (SectionBase & { t: "gallery"; frame: Frame; tag?: string; items: { img: Img; caption: string }[] })
  /** A full-width figure band (video or image). */
  | (SectionBase & { t: "media"; media: Media })
  /** About block: paragraphs and a fact list (place, languages, founder). */
  | (SectionBase & { t: "about"; paras: string[]; facts: [string, string][]; link?: Href })
  /** Scripted assistant demo without audio, visibly labelled (`chip`, `disclaimer`). */
  | (SectionBase & {
      t: "demo";
      chip: string;
      /** The "this is scripted, not live" line under the player. */
      disclaimer: string;
      play: string;
      again: string;
      sr: string;
      script: { who: string; agent: boolean; text: string; ms: number }[];
    })
  /** The contact form (POST /api/contact). Field labels live in src/content/v7/form.ts. */
  | (SectionBase & { t: "form"; topics: { value: string; label: string }[]; intro?: string })
  /**
   * The one break from the section template per page: a full-bleed ink band with the page's single most
   * important sentence in display type (our own statement, never a quote). Not numbered; `label` names the
   * band for screen readers; `note` is an optional short mono line under it.
   */
  | { t: "statement"; id: string; label: string; text: string; note?: string };

export type BlockType = Block["t"];
export type BlockOf<T extends BlockType> = Extract<Block, { t: T }>;
/** Props of every block component in src/components/v7/blocks/<t>.tsx. `num` is the section number ("01"). */
export type BlockProps<T extends BlockType> = { block: BlockOf<T>; locale: L3; num: string };

export type Faq = { label: string; h: string; items: { q: string; a: string }[] };

export type PageDef = {
  key: PageKey;
  /** Title without the brand (the root template adds " | OpSolid"); home pages: the full title, brand first. */
  meta: { title: string; description: string };
  /** Parent pages for the visible breadcrumb (and BreadcrumbList), home excluded; [] on top-level pages. */
  crumbs: PageKey[];
  /** This page's own breadcrumb label. */
  crumb: string;
  hero: {
    eyebrow: string;
    /** [pre, emphasised, post]: the middle part is set in italic copper. Use "" for unused parts. */
    h1: [string, string, string];
    lede: string;
    primary: Href;
    secondary?: Href;
    /** Mono fact line under the hero ("Ab 490 € netto · NDA vor dem Gespräch · Bericht auch ohne Empfehlung"). */
    facts?: string[];
    /** Right-hand figure. */
    media?: Media;
  };
  blocks: Block[];
  faq?: Faq;
  cta: { label: string; h: string; p: string; primary: Href; secondary?: Href };
  /** Structured data beyond the defaults (Organization, WebPage, BreadcrumbList, FAQPage when visible). */
  schema?: {
    /** Service with offers; offers only for published prices. */
    service?: { name: string; serviceType: string; description: string; offers?: { name: string; price: number; from?: boolean }[] };
    /** Bookable courses only (planned ones are not marked up). */
    courses?: { name: string; description: string; price?: number; from?: boolean }[];
    /** Our own product (OpSo). */
    software?: { name: string; description: string; os: string[]; category: string };
  };
};

export type PageSet = Record<L3, PageDef>;
