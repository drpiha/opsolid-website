/**
 * Site rules over the marketing copy (PLAN 7.3, package I). Scans every string the marketing pages can render:
 * string literals, template-literal text and JSX text (not comments) in src/content/v7/**, src/components/v7/**,
 * src/content/blog/** and src/app/llms.txt/route.ts. Whole-word patterns, so "prüft" in a drawn sample does not
 * count as "geprüft". The rendered-HTML rules audit is the second net; this test catches a banned word at the source.
 * Run: npx tsx --test scripts/tests/site-rules.test.mts
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import test from "node:test";
import ts from "typescript";
import * as offersMod from "../../src/content/v7/offers.ts";
import * as pagesMod from "../../src/content/v7/pages/index.ts";
import * as deMod from "../../src/content/de.ts";
import * as enMod from "../../src/content/en.ts";
import * as trMod from "../../src/content/tr.ts";

const O = ((offersMod as any).PLANNED ? offersMod : (offersMod as any).default) as typeof import("../../src/content/v7/offers.ts");

const ROOT = process.cwd();
const ROOTS = ["src/content/v7", "src/components/v7", "src/content/blog", "src/app/llms.txt/route.ts"];

function files(p: string): string[] {
  if (!statSync(p).isDirectory()) return /\.(ts|tsx)$/.test(p) ? [p] : [];
  return readdirSync(p).flatMap((name) => files(join(p, name)));
}

type Str = { file: string; line: number; text: string };

/** Every piece of copy in a file: string literals, template-literal heads/middles/tails and JSX text. */
function copyOf(file: string): Str[] {
  const src = readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const out: Str[] = [];
  const rel = relative(ROOT, file).split(sep).join("/");
  const add = (node: ts.Node, text: string) => {
    if (!text.trim()) return;
    out.push({ file: rel, line: sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1, text });
  };
  const visit = (node: ts.Node) => {
    // import paths and module specifiers are not copy
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) add(node, node.text);
    else if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) add(node, node.text);
    else if (ts.isJsxText(node)) add(node, node.getText(sf));
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

const ALL: Str[] = ROOTS.flatMap((r) => files(join(ROOT, r))).flatMap(copyOf);

/** Unicode-aware whole-word pattern (letters and digits around the match end the word). */
const word = (w: string, flags = "u") => new RegExp(`(?<![\\p{L}\\p{N}])${w}(?![\\p{L}\\p{N}])`, flags);

/** Matches as "file:line  …context…"; `allow` sees the whole string (a negation may sit anywhere in the sentence). */
function hits(re: RegExp, allow: (s: Str) => boolean = () => false): string[] {
  const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  const out: string[] = [];
  for (const s of ALL) {
    if (allow(s)) continue;
    for (const m of s.text.matchAll(g)) {
      const at = m.index ?? 0;
      const line = s.line + (s.text.slice(0, at).match(/\n/g)?.length ?? 0);
      out.push(`${s.file}:${line}  …${s.text.slice(Math.max(0, at - 50), at + m[0].length + 50).replace(/\s+/g, " ")}…`);
    }
  }
  return out;
}

test("the scan sees the marketing copy", () => {
  assert.ok(ALL.length > 2000, `only ${ALL.length} strings found`);
  assert.ok(ALL.some((s) => s.file.endsWith("llms.txt/route.ts")));
  assert.ok(ALL.some((s) => s.file.startsWith("src/content/blog/")));
});

test("rule 2: no on-site training wording (DE, EN, TR)", () => {
  const re = [word("vor Ort", "iu"), word("Vor-Ort", "iu"), word("Inhouse", "iu"), word("In-house", "iu"), word("on-site", "iu"), word("onsite", "iu"), word("on site", "iu"), /yerinde (?:eğitim|oturum|ziyaret|ya da|veya)/iu, /şirketinize gel/iu, word("şirketinizde", "iu")];
  assert.deepEqual(re.flatMap((r) => hits(r)), []);
});

test("rule 6: no broker, platform, seal or obligation wording", () => {
  const banned = [
    "Pilotphase", "pilot phase", "Vermittlung", "vermitteln", "vermittelt", "Plattform", "platform", "zertifiziert",
    "certified", "anerkannt", "accredited", "geprüft", "IHK", "TÜV", "Schulungspflicht", "Zertifikatspflicht",
    "Bußgeld", "Revolution", "Gamechanger", "magisch", "alles aus einer Hand", "All-in-one", "rechtssicher",
  ];
  assert.deepEqual(banned.flatMap((w) => hits(word(w, "iu"))), []);
});

test("rule 6: 'Zertifikat' only in the negation (no certificate of an authority, chamber or association)", () => {
  const re = word("Zertifikat\\p{L}*", "iu");
  // allowed: the FAQ question itself ("Bekommen wir ein Zertifikat?") and sentences that deny a certificate
  const negation = /kein(?:e|en)? Zertifikat|Zertifikat\p{L}* (?:ist |wird )?nicht|nicht .*Zertifikat|Zertifikat\p{L}* .*nicht (?:vor|nötig|vorgeschrieben)/iu;
  assert.deepEqual(hits(re, (s) => negation.test(s.text) || /^[^.!]*Zertifikat\p{L}*\?$/u.test(s.text.trim())), []);
});

test("rule 3: no legal form or team-size wording", () => {
  const banned = ["Einzelunternehmen", "Expertenteam", "Ein-Personen", "Einzelkämpfer", "one-person", "solo", "tek başıma", "şahıs şirketi"];
  assert.deepEqual(banned.flatMap((w) => hits(word(w, "iu"))), []);
});

test("rule 4: example industries only Dienstleistung, Gastronomie & Hotellerie, Handel, Praxen", () => {
  const banned = ["SHK", "Heizung\\p{L}*", "Sanitär\\p{L}*", "Haustechnik", "TGA", "Elektro", "Elektriker\\p{L}*", "Bau", "Baugewerbe", "Großhandel\\p{L}*", "Handwerk\\p{L}*", "HVAC", "plumbing", "wholesale", "construction", "tradespeople", "craft business\\p{L}*"];
  assert.deepEqual(banned.flatMap((w) => hits(word(w, "u"))), []);
});

test("rule 3: Arnsberg, Sauerland and NRW only in the footer contact, About, Contact, legal pages, JSON-LD and llms.txt", () => {
  const allowed = new Set([
    "src/content/v7/site.ts",
    "src/content/v7/pages/ueber.ts",
    "src/content/v7/pages/kontakt.ts",
    "src/components/v7/JsonLd.tsx",
    "src/components/v7/LegalPage.tsx",
    "src/app/llms.txt/route.ts",
  ]);
  const re = [word("Arnsberg"), word("Sauerland"), word("NRW"), word("Nordrhein-Westfalen")];
  assert.deepEqual(re.flatMap((r) => hits(r, (s) => allowed.has(s.file))), []);
});

test("rule 6: the legal name only in JSON-LD (Impressum and privacy texts live outside the scanned folders)", () => {
  const re = /Hasan|Dönmez|D&ouml;nmez|Inh\./u;
  assert.deepEqual(hits(re, (s) => s.file === "src/components/v7/JsonLd.tsx"), []);
});

test("rule 6: no Person markup", () => {
  const jsonLd = readFileSync(join(ROOT, "src/components/v7/JsonLd.tsx"), "utf8");
  assert.doesNotMatch(jsonLd, /["']@type["']\s*:\s*["']Person["']|["']Person["']/);
});

test("rule 1: Kutasia never links out", () => {
  assert.deepEqual(hits(/kutasia\.(com|de|ai|app)/i), []);
});

test("rule 1: trainings are never a 'Festpreis' / fixed price (only the KI-Check and the pilot are)", () => {
  // Checked: every string on a training page or in the journal, and every string anywhere that names a training
  // price. There, a fixed-price word must name the KI-Check or the pilot within the 140 characters before it.
  const trainingFiles = /pages\/(kompetenz|copilot|workflows|schulungen|trainer)\.ts$|^src\/content\/blog\//;
  const trainingPrice = /1\.790|1,790|2\.900|2,900|5\.900|5,900/;
  const fixed = /Festpreis\p{L}*|Festbetrag|fixed price|fixed amount|fixed-price|sabit fiyat\p{L}*|sabit bir tutar/giu;
  const owner = /KI-Check|AI check|YZ Kontrol|Pilot|pilot/u;
  const bad: string[] = [];
  for (const s of ALL.filter((x) => trainingFiles.test(x.file) || trainingPrice.test(x.text))) {
    for (const m of s.text.matchAll(fixed)) {
      const at = m.index ?? 0;
      if (owner.test(s.text.slice(Math.max(0, at - 140), at + m[0].length + 20))) continue;
      bad.push(`${s.file}:${s.line}  …${s.text.slice(Math.max(0, at - 60), at + 40).replace(/\s+/g, " ")}…`);
    }
  }
  assert.deepEqual(bad, []);
});

test("rule 1: the NFC card shows no price", () => {
  assert.deepEqual(hits(/24[.,]90/), []);
});

test("rule 5: the four planned courses appear only in offers, menu, home, the hub and the form topic", () => {
  const names = (["de", "en", "tr"] as const).flatMap((l) => [...O.PLANNED[l]]);
  assert.equal(names.length, 12);
  const allowed = new Set(["src/content/v7/offers.ts", "src/content/v7/menu.ts", "src/content/v7/pages/home.ts", "src/content/v7/pages/schulungen.ts"]);
  assert.deepEqual(names.flatMap((n) => hits(word(n), (s) => allowed.has(s.file))), []);
});

test("rule 5: NIS2 and GEO courses are not shown", () => {
  assert.deepEqual([word("NIS2", "iu"), word("NIS-2", "iu"), word("GEO-Schulung", "iu")].flatMap((r) => hits(r)), []);
});

test("rule 6: no en or em dashes in copy (hyphens only)", () => {
  assert.deepEqual(hits(/[–—]/), []);
});

// Owner decision 2026-11-17 ("ücretler görünmese iyi olur"): search snippets name no price. Page titles, meta
// descriptions (also Open Graph and Twitter, which reuse them) and the journal excerpts (a post's meta description)
// carry no amount; the prices stay on the pages, in the price notes and in the Service/Course offers JSON-LD.
test("search snippets name no price (titles, meta descriptions, journal excerpts)", () => {
  const pick = (m: any, k: string) => m[k] ?? m.default?.[k];
  const AMOUNT = /€|\bEUR\b|\bEuro\b/;
  const bad: string[] = [];
  for (const ps of pick(pagesMod, "PAGE_SETS") as any[])
    for (const l of ["de", "en", "tr"]) {
      const m = ps[l]?.meta;
      if (m && AMOUNT.test(m.title + " " + m.description)) bad.push(`${ps[l].key ?? "?"} ${l}`);
    }
  for (const [l, mod] of [["de", deMod], ["en", enMod], ["tr", trMod]] as const)
    for (const post of pick(mod, "content").blog.posts) if (AMOUNT.test(post.excerpt + " " + (post.seoTitle ?? post.title))) bad.push(`blog ${l} ${post.slug}`);
  assert.deepEqual(bad, []);
});
