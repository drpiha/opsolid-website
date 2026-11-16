/**
 * Builders for the inner-page hero objects (design review R2, `PageDef["hero"]["object"]`). Each builder takes its
 * text from a block of the page's own live copy (or another live piece of the site), so the drawn object can never
 * say more than the page does. `frag()` takes a part of a live sentence and fails the build if the sentence does
 * not contain it. Every aria label repeats the visible text of the piece, prefixed with its Etikett.
 */
import type { CourseArt } from "./types-hub";
import type { HomeBlock } from "./types-home";
import type { Block, HeroObject, L3, PageDef } from "./types";

type Of<T extends Block["t"]> = Extract<Block, { t: T }>;

/** The block of type `t` with id `id` on page `d`; throws at build time if it is missing. */
export function blockOf<T extends Block["t"]>(d: PageDef, t: T, id: string): Of<T> {
  const b = d.blocks.find((x) => x.t === t && x.id === id);
  if (!b) throw new Error(`hero object: no ${t} block #${id} on ${d.key}`);
  return b as Of<T>;
}

/** A part of a live sentence, verbatim; throws if `text` does not contain it. */
export function frag(text: string, part: string): string {
  if (!text.includes(part)) throw new Error(`hero object: "${part}" is not in the live copy "${text.slice(0, 60)}…"`);
  return part;
}

/** Joins visible parts into one aria label: "Etikett: part. part." (line breaks of drawn labels become spaces). */
export function aria(etikett: string, parts: string[]): string {
  const clean = parts.map((p) => p.replace(/-\n/g, "").replace(/\n/g, " ").trim().replace(/[.:]$/, "")).filter(Boolean);
  return `${etikett}: ${clean.map((p) => (/[?!]$/.test(p) ? p : `${p}.`)).join(" ")}`;
}

const TICKED: Record<L3, string> = { de: "angekreuzt", en: "ticked", tr: "işaretli" };

/** The sample questionnaire of the home Beratung door. */
export function fragebogen(home: PageDef, loc: L3): HeroObject {
  const doors = home.blocks.find((b) => b.t === "doors") as Extract<HomeBlock, { t: "doors" }> | undefined;
  const art = doors?.doors.find((d) => d.tone === "beratung")?.art;
  if (!art || art.kind !== "fragebogen") throw new Error("hero object: no questionnaire on the home Beratung door");
  return {
    kind: "fragebogen",
    etikett: art.etikett,
    title: art.title,
    sub: art.sub,
    q: art.q,
    options: art.options,
    ariaLabel: aria(art.etikett, [art.title, art.sub, art.q, ...art.options.map((o) => (o.on ? `${o.text} (${TICKED[loc]})` : o.text))]),
  };
}

/** The sample KI-Check report excerpt of the home check section ("Beispiel, fiktiv"). */
export function report(home: PageDef): HeroObject {
  const check = home.blocks.find((b) => b.t === "check") as Extract<HomeBlock, { t: "check" }> | undefined;
  if (!check) throw new Error("hero object: no check section on the home page");
  const r = check.report;
  return {
    kind: "report",
    etikett: r.etikett,
    ariaLabel: r.ariaLabel,
    title: r.title,
    meta: r.meta,
    stamp: r.stamp,
    h: r.h,
    items: r.items,
    manualH: r.manualH,
    manual: r.manual,
    recH: r.recH,
    rec: r.rec,
    phone: false,
  };
}

/** One sample workflow by hand and automated, from the page's compare block. */
export function vergleich(d: PageDef, id: string, etikett: string, stamp: string): HeroObject {
  const b = blockOf(d, "compare", id);
  const title = b.h;
  const sub = b.lede ?? "";
  return {
    kind: "vergleich",
    etikett,
    stamp,
    title,
    sub,
    before: b.before,
    after: b.after,
    ariaLabel: aria(etikett, [title, sub, b.before.h, ...b.before.items, b.after.h, ...b.after.items]),
    phone: false,
  };
}

/** The scripted sample conversation of the page's demo block. */
export function gespraech(d: PageDef, id: string, etikett: string): HeroObject {
  const b = blockOf(d, "demo", id);
  return {
    kind: "gespraech",
    etikett,
    bar: [b.label, b.chip],
    lines: b.script.map(({ who, agent, text }) => ({ who, agent, text })),
    foot: b.disclaimer,
    ariaLabel: aria(etikett, [b.chip, ...b.script.map((l) => `${l.who}: ${l.text}`), b.disclaimer]),
  };
}

/** A list sheet: numbered (`n`) or ticked (`check`) lines with an optional muted note. */
export function liste(
  etikett: string,
  head: { title: string; sub: string; stamp: string },
  items: { text: string; note?: string }[],
  opts: { check?: boolean; numbered?: boolean; phone?: boolean } = {},
): HeroObject {
  return {
    kind: "liste",
    etikett,
    ...head,
    check: opts.check,
    items: items.map((it, i) => ({ ...it, n: opts.numbered ? String(i + 1).padStart(2, "0") : undefined })),
    ariaLabel: aria(etikett, [head.title, head.sub, ...items.map((it) => (it.note ? `${it.text}: ${it.note}` : it.text))]),
    phone: opts.phone,
  };
}

/** The first sentence of a live text. */
export function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](?=\s|$)/);
  return m ? m[0] : text;
}

/**
 * The KI-Agenten course's four-node flow on a sheet (design review R3): the page's own flow labels, one filled row
 * under the nodes (each a verbatim part of the flow's live description, `media.alt`), the course name as the title and
 * a part of the lede as the sub line. The page keeps its `media` as data; the object takes precedence in the hero.
 */
export function ablauf(d: PageDef, stamp: string, sub: string, row: [string, string, string, string]): HeroObject {
  const m = d.hero.media;
  if (!m || m.kind !== "svg" || m.name !== "flow" || !m.labels || m.labels.length !== 4) throw new Error(`hero object: no four-node flow on ${d.key}`);
  const labels = m.labels as [string, string, string, string];
  const etikett = m.caption ?? "Schema";
  const title = d.hero.h1[0].replace(/:\s*$/, "");
  const cells = row.map((r) => frag(m.alt, r)) as [string, string, string, string];
  return {
    kind: "flow",
    etikett,
    title,
    sub: frag(d.hero.lede, sub),
    stamp,
    labels,
    row: cells,
    ariaLabel: aria(etikett, [title, sub, ...labels.map((l, i) => `${l}: ${cells[i]}`)]),
  };
}

/** A hub catalog piece (Zeitplan or six blocks) on a sheet of its own, under the course name and duration. */
export function kursBlatt(art: CourseArt, title: string, sub: string, stamp: string, etikett?: string): HeroObject {
  if (art.kind === "zeitplan") {
    const e = etikett ?? art.etikett;
    return { kind: "zeitplan", etikett: e, title, sub, stamp, art, ariaLabel: aria(e, [title, sub, art.ariaLabel, ...art.topics]) };
  }
  if (art.kind === "bloecke") {
    const e = etikett ?? art.etikett;
    return {
      kind: "bloecke",
      etikett: e,
      title,
      sub,
      stamp,
      art,
      ariaLabel: aria(e, [title, sub, ...art.blocks.map((b, i) => `${art.blockLabel} ${i + 1}: ${b.b}, ${b.small}`)]),
    };
  }
  throw new Error("hero object: only the Zeitplan and the six blocks are course sheets");
}
