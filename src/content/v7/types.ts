/**
 * v7 marketing page model (relaunch 2026-10-29; design C "Werkstatt" since 2026-11-15, owner decision 81).
 *
 * One module per page, src/content/v7/pages/<key>.ts, exports `page: PageSet` with de, en and tr in
 * full key parity (same blocks, same item counts, same ids). German is the source; en/tr are
 * transcreations, not word-for-word translations. Every string is visible copy: never put a price,
 * number, client, quote or claim here that the build brief does not allow.
 */
import type { L3, PageKey } from "@/lib/v7-routes";
import type { HomeBench, HomeBlock } from "./types-home";
import type { CourseArt, HubBlock } from "./types-hub";
import type { ProdukteBlock, StudioText } from "./types-produkte";

export type { L3, PageKey };

/** Section ground (C "Werkstatt"): the surface a section sits on. V7Page alternates paper and sheet unless a block sets one. */
export type Ground = "paper" | "sheet" | "ink" | "bench" | "slate" | "char";

/** A status or price chip: "live" (available), "plan" (in preparation / planned), "note" (a neutral tag such as "Journal"). */
export type Chip = { kind: "live" | "plan" | "note"; text: string };

/**
 * A labelled raster picture from /public (renders, desk documents). `etikett` is the visible label every picture
 * carries (rule 6: "Render · Muster-Agenda"). `srcSet` and `mobile` feed a native <picture> (the image optimizer is
 * off); `priority` only for the one hero picture that is the LCP element.
 */
export type Picture = {
  src: string;
  w: number;
  h: number;
  alt: string;
  etikett: string;
  srcSet?: { src: string; w: number }[];
  sizes?: string;
  mobile?: { src: string; w: number; h: number };
  priority?: boolean;
};

/**
 * A link to a v7 page by key (localized automatically), or a raw mailto:/tel: href.
 * `query` adds search parameters, e.g. { anliegen: "ki-check" } to pre-select the contact form topic.
 */
export type Href =
  | { label: string; to: PageKey; hash?: string; sub?: string; query?: Record<string, string> }
  | { label: string; href: `mailto:${string}` | `tel:${string}` }
  /** External link (same tab, rel="noopener noreferrer"). */
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

export type SectionBase = {
  /** Anchor, unique per page, [a-z0-9-]. */
  id: string;
  /** Short label of the section (the Etikett over the H2, "Vorgehen"). */
  label: string;
  /** One short line under the label. */
  note?: string;
  /** The H2. */
  h: string;
  /** Answer-first lede under the H2: one or two plain sentences that answer the section's question. */
  lede?: string;
  cta?: Href;
  /** One step more space above: a dense section that follows another dense section. */
  airy?: boolean;
  /** Section ground; omitted: V7Page alternates paper and sheet from the first block. */
  ground?: Ground;
  /** The mat texture behind the section: true for the default mask, or a CSS mask image (a gradient). */
  mat?: boolean | string;
};

/** The block types every package shares. Page packages add their own unions (types-home, types-hub, types-produkte). */
export type CoreBlock =
  /** Situations / pain points: 3 to 6 short cards. */
  | (SectionBase & { t: "situations"; items: { h: string; p: string }[] })
  /** The signature process line: exactly 4 steps, each with its tangible result. */
  /** `etikett` names the step crops in one line; a step `crop` is a decorative cut-out of a labelled sample (alt ""). */
  | (SectionBase & { t: "process"; steps: { name: string; h: string; p: string; result: string; meta?: string; crop?: Img }[]; etikett?: string })
  /** Example scenarios, always labelled by `tag` ("Beispiel-Szenario"): before, after, the human step. */
  | (SectionBase & { t: "examples"; tag: string; items: { area: string; h: string; before: string; after: string; human: string; href?: Href }[] })
  /** Principles / commitments: 3 to 6 numbered items. */
  | (SectionBase & { t: "principles"; items: { h: string; p: string }[] })
  /** Offer ladder or rate cards. `price` only from the published list ("990 €", "ab 1.790 €"); omit it when unpublished. */
  | (SectionBase & {
      t: "offers";
      items: { name: string; price?: string; unit?: string; p: string; points: string[]; href?: Href; featured?: boolean }[];
      /** Terms line under the cards (price note). `note` stays the left-column line of the section. */
      footnote: string;
    })
  /** Hairline ledger of rows, optionally linked, optionally with a real screenshot of our own work. */
  | (SectionBase & { t: "rows"; items: { h: string; p: string; tag?: string; href?: Href; img?: Img }[] })
  /** Plain numbered steps. `variant: "run"` adds an art card per step (crop plus "Sie erhalten" text). */
  | (SectionBase & {
      t: "steps";
      variant?: "run";
      etikett?: string;
      /**
       * `art.crop`: a decorative crop of a labelled sample; `art.draw`: a crop drawn in SVG instead (design review R3):
       * "katalog" = the catalog cut on one course row (`lines`: column head, then the course name in up to two lines),
       * "angebot" = a sample offer sheet (`lines`: its title).
       */
      items: { h: string; p: string; art?: { crop?: Img; draw?: "katalog" | "angebot" | "termin" | "bescheinigung"; lines?: string[]; label: string; h: string; p: string } }[];
    })
  /** One task before and after (an example, labelled by `tag`). */
  | (SectionBase & { t: "compare"; tag?: string; before: { h: string; items: string[] }; after: { h: string; items: string[] } })
  /** A table (rate card, comparison). */
  /** `variant: "prices"` renders `list` instead of the table on phones. */
  | (SectionBase & {
      t: "table";
      caption: string;
      cols: string[];
      rows: string[][];
      footnote?: string;
      variant?: "prices";
      list?: { what: string; meta: string; price: string; unit: string }[];
    })
  /** Key-value list (scope, format, duration, group size). */
  | (SectionBase & { t: "spec"; rows: [string, string][]; footnote?: string })
  /** Plain paragraphs; legal sections close with their primary sources (EUR-Lex) and the date they were checked. */
  | (SectionBase & { t: "text"; paras: string[]; sources?: { items: { label: string; href: `https://${string}` }[]; asOf?: string } })
  /** A sample deliverable, visibly stamped as a sample (`mark`: "Muster"). */
  | (SectionBase & {
      t: "sample";
      mark: string;
      title: string;
      meta: string;
      /** Rated items as label + pill; may be empty when `sections` carries the excerpt. */
      rows: [string, string][];
      /** Report-style excerpt: headed groups of short lines (`ordered` numbers them). */
      sections?: { h: string; items: string[]; ordered?: boolean }[];
      foot: string;
    })
  /** Use cases by sector: tabs on wide screens, stacked on phones. Ideas are examples, labelled by `tag`. */
  | (SectionBase & { t: "sectors"; tag: string; items: { name: string; /** Short tab label; falls back to `name`. */ tab?: string; h: string; p: string; ideas: string[]; stays: string }[] })
  /**
   * Training catalogue as a hairline ledger (one row per course). "bookable" items carry a published price;
   * "planned" items never show a price. `format` is the spec line in a fixed order, tokens joined by " · "
   * (length and hours · people included and max; format and certificate live in the hero strip); the
   * first token is set in ink, `statusLabel` ("Termin auf Anfrage") closes the line. `price` is the team price
   * alone ("ab 1.790 €"), `unit` the mono line under it ("netto pro Team"), `arith` the per-person arithmetic at
   * the included group size as unwrapped lines, always worded as arithmetic ("Rechnerisch 179 € pro Person bei
   * 10 Personen"), never as a price of its own.
   */
  | (SectionBase & {
      t: "courses";
      /** "ledger": the C home ledger (track tag, duration bars, spec lines, planned row). */
      variant?: "ledger";
      items: {
        name: string;
        status: "bookable" | "planned";
        statusLabel: string;
        /** Optional in the ledger variant (planned rows carry only the name). */
        format?: string;
        p?: string;
        price?: string;
        unit?: string;
        arith?: string[];
        href?: Href;
        id?: string;
        tag?: string;
        bars?: 1 | 2 | 4;
        spec?: string[];
      }[];
      footnote?: string;
      /** The one quiet row of planned courses (rule 5): label, "geplant" chip and the "Interesse vormerken" link. */
      soon?: { id: string; label: string; chip: string; link: Href };
    })
  /** Our own work only, with real screenshots in a frame. */
  | (SectionBase & { t: "projects"; items: { name: string; status: string; p: string; points?: string[]; img: Img; frame: Frame; href?: Href }[] })
  /** Teaser for our own product (OpSo). No prices (decision 78). `compact`: one line without media (Kutasia). */
  | (SectionBase & {
      t: "product";
      name: string;
      status: string;
      p: string;
      points: string[];
      media?: Media;
      chip?: Chip;
      compact?: boolean;
      href?: Href;
    })
  /**
   * Gallery of real screens with captions. `sub`: a quiet second caption line (the card's colour theme).
   * `link`: the item opens its live original (OpSo example cards). Four items or fewer fill the row on desktop.
   */
  | (SectionBase & { t: "gallery"; frame: Frame; tag?: string; items: { img: Img; caption: string; sub?: string; link?: Href }[] })
  /** A full-width figure band (video or image). */
  | (SectionBase & { t: "media"; media: Media })
  /** About block: paragraphs and a fact list (place, way of working, languages). */
  | (SectionBase & { t: "about"; paras: string[]; facts: [string, string][]; link?: Href; links?: Href[]; picture?: Picture })
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
  | (SectionBase & {
      t: "form";
      topics: { value: string; label: string }[];
      intro?: string;
      /** "home": copy column with a mail aside and the "Was danach passiert" list next to the form. */
      variant?: "home";
      aside?: { mailLabel: string; mail: string; next?: { h: string; items: string[] } };
    })
  /**
   * The one break from the section template per page: a full-bleed ink band with the page's single most
   * important sentence in display type (our own statement, never a quote). Not numbered; `label` names the
   * band for screen readers; `note` is an optional short mono line under it, `cta` an optional link on the ink.
   */
  | { t: "statement"; id: string; label: string; text: string; note?: string; cta?: Href };

/** Every block a page can use. A package that adds a member to its own union registers it in its own registry. */
export type Block = CoreBlock | HomeBlock | HubBlock | ProdukteBlock;

export type BlockType = Block["t"];
export type BlockOf<T extends BlockType> = Extract<Block, { t: T }>;
/**
 * Props of every block component in src/components/v7/blocks/<t>.tsx. `num` is the section number ("01").
 * V7Page resolves the ground before rendering, so `block.ground` is set on every section block it passes.
 */
export type BlockProps<T extends BlockType> = { block: BlockOf<T>; locale: L3; num: string };

/** `aside`: one line next to the FAQ heading (for example a mail link sentence). */
export type Faq = { label: string; h: string; aside?: string; items: { q: string; a: string }[] };

/** The closing CTA band of a page. `pic`: a labelled picture fill behind the band. */
export type Cta = { label: string; h: string; p: string; primary: Href; secondary?: Href; pic?: Picture };

/**
 * The drawn object on the right of an inner page hero (design review R2: one page-specific piece per hero, none
 * repeated). Every kind is built from the existing Werkstatt components and carries its Etikett; its text is taken
 * from the live copy of that page (or a labelled sample). `ariaLabel` repeats the visible text: the piece is one
 * named image. `phone: false` hides a purely decorative piece below 960 px (the same text follows on the page).
 */
export type HeroObject = { etikett: string; ariaLabel: string; phone?: boolean } & (
  | { kind: "fragebogen"; title: string; sub: string; q: string; options: { text: string; on?: boolean }[] }
  | {
      kind: "report";
      title: string;
      meta: string;
      stamp: string;
      h: string;
      items: { b: string; more: string }[];
      manualH: string;
      manual: string;
      recH: string;
      rec: string;
    }
  | { kind: "vergleich"; title: string; sub: string; stamp: string; before: { h: string; items: string[] }; after: { h: string; items: string[] } }
  | { kind: "gespraech"; bar: [string, string]; lines: { who: string; agent: boolean; text: string }[]; foot?: string }
  | { kind: "liste"; title: string; sub: string; stamp: string; check?: boolean; items: { n?: string; text: string; note?: string }[] }
  | { kind: "zeitplan"; title: string; sub: string; stamp: string; art: Extract<CourseArt, { kind: "zeitplan" }> }
  | { kind: "bloecke"; title: string; sub: string; stamp: string; art: Extract<CourseArt, { kind: "bloecke" }> }
  | { kind: "way"; labels: [string, string, string, string]; base: string }
  /** The KI-Agenten course's four-node flow on a sheet, with one filled row (what happens at each node) under it. */
  | { kind: "flow"; title: string; sub: string; stamp: string; labels: [string, string, string, string]; row: [string, string, string, string] }
);

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
    /** Omitted on pages without a primary action (Produkte). */
    primary?: Href;
    secondary?: Href;
    /** "bench": the home hero with the drawn bench pieces (hero/HeroBench.tsx, data in `bench`). */
    art?: "bench";
    /** Hero ground: light (default, paper with the mat), ink, or charcoal (Produkte, decision 77). */
    tone?: "light" | "ink" | "char";
    /** Labelled picture in the right column (bleeds to the edge); takes precedence over `media`. */
    picture?: Picture;
    /** Jump pills to sections of the page. */
    jump?: { label: string; links: Href[] };
    /**
     * Index cells under the hero (Produkte: name, kind and status chip per product). A cell with `to` links to its
     * section; a cell without `to` is the product's only appearance on the page and carries the anchor `id`.
     */
    index?: { k: string; name: string; chip: Chip; to?: Href; id?: string }[];
    /** Mono line under the fact strip or the fact line (the price note); wins over the automatic SITE_STR.priceNote. */
    stripNote?: string;
    bench?: HomeBench;
    /** Mono fact line under the hero ("KI-Check 990 € netto · NDA vor der Analyse · Endet mit einer Handlungsempfehlung"). */
    facts?: string[];
    /**
     * Fact strip instead of the fact line: label over value, four columns on desktop and two by two on phones
     * (the offer's price, format, record and language on the training pages). Takes precedence over `facts`.
     */
    strip?: [string, string][];
    /** Right-hand figure. */
    media?: Media;
    /** The page's own drawn bench object in the right column (design review R2); takes precedence over `media`. */
    object?: HeroObject;
    /** The card studio as the hero (page `opsoKarte`): the live card is the hero object, the job ticket sits under the copy. */
    studio?: StudioText;
  };
  blocks: Block[];
  faq?: Faq;
  /** Blocks after the FAQ (the home contact form). */
  after?: Block[];
  /** The closing CTA band; omitted: no band (home closes with its form, Produkte with its last section). */
  cta?: Cta;
  /** Structured data beyond the defaults (Organization, WebPage, BreadcrumbList, FAQPage when visible). */
  schema?: {
    /** Service with offers; offers only for published prices. */
    service?: { name: string; serviceType: string; description: string; offers?: { name: string; price: number; from?: boolean }[] };
    /** Bookable courses only (planned ones are not marked up). */
    courses?: { name: string; description: string; price?: number; from?: boolean }[];
    /** Our own product (OpSo). */
    /** `installUrl`: a public store listing (https) or several (App Store, Google Play). */
    software?: { name: string; description: string; os: string[]; category: string; installUrl?: `https://${string}` | readonly `https://${string}`[] };
  };
};

export type PageSet = Record<L3, PageDef>;
