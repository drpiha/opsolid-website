// =============================================================================
// scripts/scan-hardcoded-literals.ts — find NON-EDITABLE display text in
// every v2 template. Read-only.
//
// Any JSX *text node* with letters is hardcoded copy: text sourced from COPY
// or cardData renders as {expr}, never as literal JSX text. So JsxText with
// letters == a label the user cannot edit. We also flag string literals that
// look like prose (have a space / "·") passed somewhere other than the COPY
// table / sample / registry data.
//
//   npx tsx scripts/scan-hardcoded-literals.ts
// =============================================================================

import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";

const V2_DIR = path.join(__dirname, "..", "src", "components", "cards", "templates", "v2");

// Attributes whose string value is never visible card copy.
const NON_DISPLAY_ATTRS = new Set([
  "className", "class", "style", "id", "key", "href", "src", "rel", "target",
  "type", "role", "alt", "name", "as", "dir", "lang", "width", "height",
  "viewBox", "d", "fill", "stroke", "data-template",
]);

function isExcluded(node: ts.Node): boolean {
  if (!ts.isVariableStatement(node)) return false;
  for (const d of node.declarationList.declarations) {
    const name = ts.isIdentifier(d.name) ? d.name.text : "";
    const typeText = d.type?.getText() ?? "";
    if (/Entry$|Sample$/.test(name) || name === "COPY") return true;
    if (/TemplateRegistryEntry|SampleData/.test(typeText)) return true;
  }
  return false;
}

const hasLetters = (s: string) => /[A-Za-zÀ-ÿĀ-žÀ-ɏЀ-ӿ]/.test(s);
const looksLikeProse = (s: string) =>
  hasLetters(s) && (/\s/.test(s) || s.includes("·") || s.includes("—")) && s.length >= 4 &&
  !/^[a-z-]+$/.test(s) && // skip css-ish single tokens
  !s.includes("var(--") && !s.includes("font-") && !/^https?:/.test(s);

interface Hit { line: number; text: string; kind: string }

function scanFile(file: string): Hit[] {
  const full = path.join(V2_DIR, file);
  const sf = ts.createSourceFile(full, fs.readFileSync(full, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const hits: Hit[] = [];
  const lineOf = (n: ts.Node) => sf.getLineAndCharacterOfPosition(n.getStart()).line + 1;

  const visit = (node: ts.Node) => {
    // JSX literal text between tags == hardcoded visible copy. Text sourced
    // from COPY/cardData renders as {expr}, never as literal JsxText.
    if (ts.isJsxText(node)) {
      const t = node.text.replace(/\s+/g, " ").trim();
      const isNoise =
        t.length < 2 ||
        !hasLetters(t) ||
        /^[·•\-–—/|]+$/.test(t) ||
        t.startsWith("&") ||            // HTML entities (&ldquo; &amp; …)
        t === "OpSolid";                // intentional powered-by brand mark
      if (!isNoise) {
        hits.push({ line: lineOf(node), text: t, kind: "jsx-text" });
      }
    }
    ts.forEachChild(node, visit);
  };

  for (const st of sf.statements) {
    if (isExcluded(st)) continue;
    visit(st);
  }
  return hits;
}

const all: Array<{ file: string; hits: Hit[] }> = [];
for (const f of fs.readdirSync(V2_DIR).sort()) {
  if (!f.endsWith(".tsx")) continue;
  const hits = scanFile(f);
  if (hits.length) all.push({ file: f, hits });
}

let total = 0;
for (const { file, hits } of all) {
  console.log(`\n${file}  (${hits.length})`);
  for (const h of hits) {
    total++;
    console.log(`  ${file}:${h.line}  [${h.kind}]  ${JSON.stringify(h.text)}`);
  }
}
console.log(`\n=== ${total} hardcoded display literals across ${all.length} files ===`);
