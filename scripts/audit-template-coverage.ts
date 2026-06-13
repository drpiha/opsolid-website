// =============================================================================
// Template ↔ CardData coverage audit.
//
// Invariant this script enforces: every visual CardData field is either
//   (a) rendered NATIVELY by the template component, or
//   (b) rendered by a universal wrapper block (UniversalBlocks stack) that is
//       suppressed per-template via a `*_NATIVE_KEYS` Set in registry.ts.
// A field that is neither (a) nor (b) is a SILENT DROP: the owner can type
// data that never appears on their card. That class of bug caused the
// 2026-06 TestimonialsBlock revert — this script exists so it can't recur.
//
// Pure static analysis via the TypeScript compiler API. Never imports app
// modules (registry.ts pulls all 96 templates + next/* — fragile under tsx).
// Per template file the `export const *Entry` / `*Sample` subtrees are
// EXCLUDED from field-reference analysis (sample cardData would otherwise
// count as render evidence); `supports` + `key` are read from the entry.
// Whole-object passes to ./shared/* components (<ContactRows cardData={…}>)
// union that shared component's own field accesses (depth 1 — shared files
// are leaves).
//
// Usage:
//   npx tsx scripts/audit-template-coverage.ts          # human report
//   npx tsx scripts/audit-template-coverage.ts --json   # machine-readable
//   npx tsx scripts/audit-template-coverage.ts --check  # CI gate, exit 1 on
//                                                       # Set inconsistencies
//                                                       # or silent drops
// =============================================================================

import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";

const V2_DIR = path.join(__dirname, "..", "src", "components", "cards", "templates", "v2");
const SHARED_DIR = path.join(V2_DIR, "shared");
const REGISTRY = path.join(V2_DIR, "registry.ts");

// Visual CardData fields an owner can populate (mirror of CardDataSchema in
// src/lib/validation.ts — update together).
const VISUAL_FIELDS = [
  "name", "title", "position", "company", "email", "phone", "whatsapp",
  "website", "address", "bio", "coverImage", "bookingUrl", "brochureUrl",
  "impressumUrl", "privacyUrl", "videoUrl", "videoPath", "socials", "services",
  "gallery", "faqs", "testimonials", "customButtons", "customSections",
  "statusMessage", "statusBanner", "tags", "embeds", "contactForm", "tipJar",
  "stats",
] as const;
type VisualField = (typeof VISUAL_FIELDS)[number];

// Fields guaranteed visible by the UniversalBlocks stack rendered around
// <Template/> in /c/[slug]/page.tsx AND the editor preview — mirror of
// src/components/cards/UniversalBlocks.tsx; update together.
const WRAPPER_COVERED = new Set<string>([
  "customSections", "videoUrl", "videoPath", "gallery", "faqs", "embeds",
  "customButtons", "tipJar", "contactForm",
  "testimonials", // TestimonialsBlock (gated by TESTIMONIALS_NATIVE_KEYS)
  "brochureUrl",  // BrochureBlock (gated by BROCHURE_NATIVE_KEYS)
  "bio",          // AboutBlock (gated by BIO_NATIVE_KEYS)
  "stats",        // StatsBlock (gated by STATS_NATIVE_KEYS)
  // statusBanner/statusMessage render at page level outside the template.
  "statusBanner", "statusMessage",
]);

// Fields rendered by effectively every template via shared primitives
// (ContactRows / SocialRow / header) — silent-drop reporting skips these and
// instead surfaces them in the per-template matrix only.
const BASELINE_FIELDS = new Set<string>([
  "name", "title", "position", "company", "email", "phone", "whatsapp",
  "website", "address", "socials", "bookingUrl", "impressumUrl", "privacyUrl",
  "coverImage", "tags",
  // tagline/location render through resolveTagline/resolveLocation on the
  // templates that have a slot for them; no universal block, no silent-drop.
  "tagline", "location",
]);

// field → registry Set that suppresses its universal block.
const FIELD_TO_SET: Record<string, string> = {
  gallery: "GALLERY_NATIVE_KEYS",
  faqs: "FAQ_NATIVE_KEYS",
  logoPath: "LOGO_NATIVE_KEYS",
  testimonials: "TESTIMONIALS_NATIVE_KEYS",
  brochureUrl: "BROCHURE_NATIVE_KEYS",
  bio: "BIO_NATIVE_KEYS",
  stats: "STATS_NATIVE_KEYS",
};

// supports flag → field(s) that count as "renders it natively".
const SUPPORTS_TO_FIELDS: Record<string, string[]> = {
  services: ["services"],
  faqs: ["faqs"],
  testimonials: ["testimonials"],
  gallery: ["gallery"],
  video: ["videoUrl", "videoPath"],
  brochure: ["brochureUrl"],
  socials: ["socials"],
  logo: ["logoPath"],
};

interface FileAnalysis {
  /** field → first few line numbers where referenced */
  fields: Map<string, number[]>;
  /** list fields with CONTENT evidence (not just `.length` count chips) */
  contentFields: Set<string>;
  /** ./shared/X tag names the file passes whole cardData into */
  wholePassShared: Set<string>;
  /** identifier usages of the logoPath prop (outside types/bindings) */
  logoPathLines: number[];
}

// List fields where a bare `.length` read (review-count chip) is NOT display:
// Set membership requires the CONTENT to render (quote text, service rows…).
// Discovered 2026-06-10: 9 templates read testimonials only for a count badge
// (restaurant-noir/pure/stone, ecommerce-noir/pure/vivid, beauty-salon-noir,
// content-creator, photographer-pure) — suppressing the universal block there
// would silently drop the owner's quotes.
const LIST_FIELDS = new Set(["testimonials", "services", "gallery", "faqs", "stats"]);

interface EntryInfo {
  key: string;
  supports: Record<string, boolean>;
}

function parse(file: string): ts.SourceFile {
  return ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

/** True for top-level declarations to exclude from render-evidence analysis. */
function isExcludedDecl(node: ts.Node): boolean {
  if (!ts.isVariableStatement(node)) return false;
  for (const d of node.declarationList.declarations) {
    const name = ts.isIdentifier(d.name) ? d.name.text : "";
    const typeText = d.type?.getText() ?? "";
    if (/Entry$|Sample$/.test(name)) return true;
    if (/TemplateRegistryEntry|SampleData/.test(typeText)) return true;
  }
  return false;
}

function lineOf(sf: ts.SourceFile, node: ts.Node): number {
  return sf.getLineAndCharacterOfPosition(node.getStart()).line + 1;
}

/** Collect cardData field references + whole-object passes + logoPath usage. */
function analyzeFile(sf: ts.SourceFile): FileAnalysis {
  const fields = new Map<string, number[]>();
  const contentFields = new Set<string>();
  const wholePassShared = new Set<string>();
  const logoPathLines: number[] = [];
  const aliases = new Set<string>(["cardData"]);
  // alias variable name → list field it was initialized from
  const listAliases = new Map<string, string>();
  // map JSX tag name → it's a ./shared import
  const sharedTags = new Set<string>();

  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st) && ts.isStringLiteral(st.moduleSpecifier)) {
      if (st.moduleSpecifier.text.startsWith("./shared/")) {
        const named = st.importClause?.namedBindings;
        if (named && ts.isNamedImports(named)) {
          for (const el of named.elements) sharedTags.add(el.name.text);
        }
      }
    }
  }

  const record = (field: string, line: number) => {
    if (!fields.has(field)) fields.set(field, []);
    const arr = fields.get(field)!;
    if (arr.length < 5) arr.push(line);
  };

  /**
   * Given the expression node that IS the field value, walk up through
   * `?? []` / parens / `as` wrappers and classify the consumer:
   * "content" (element access, .map/.slice, JSX pass, call argument),
   * "neutral" (guards, `.length` count chips), or an alias assignment.
   */
  const classifyValueUse = (node: ts.Node): "content" | "neutral" | { alias: string } => {
    let cur: ts.Node = node;
    let parent = cur.parent;
    while (
      parent &&
      ((ts.isBinaryExpression(parent) &&
        (parent.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken ||
          parent.operatorToken.kind === ts.SyntaxKind.BarBarToken) &&
        parent.left === cur) ||
        ts.isParenthesizedExpression(parent) ||
        ts.isNonNullExpression(parent) ||
        ts.isAsExpression(parent))
    ) {
      cur = parent;
      parent = cur.parent;
    }
    if (!parent) return "neutral";
    if (ts.isPropertyAccessExpression(parent) && parent.expression === cur) {
      return parent.name.text === "length" ? "neutral" : "content";
    }
    if (ts.isElementAccessExpression(parent) && parent.expression === cur) return "content";
    if (ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) {
      return { alias: parent.name.text };
    }
    if (ts.isJsxExpression(parent) || ts.isJsxSpreadAttribute(parent)) return "content";
    if (ts.isCallExpression(parent) && parent.arguments.includes(cur as ts.Expression)) return "content";
    if (ts.isSpreadElement(parent) || ts.isArrayLiteralExpression(parent)) return "content";
    if (ts.isPropertyAssignment(parent) && parent.initializer === cur) return "content";
    return "neutral"; // guards: `x && …`, ternary conditions, if(x), !x
  };

  const classifyListUse = (field: string, node: ts.Node) => {
    if (!LIST_FIELDS.has(field)) return;
    const use = classifyValueUse(node);
    if (use === "content") contentFields.add(field);
    else if (typeof use === "object") listAliases.set(use.alias, field);
  };

  const isCardDataExpr = (expr: ts.Expression): boolean => {
    if (ts.isIdentifier(expr)) return aliases.has(expr.text);
    if (ts.isPropertyAccessExpression(expr)) return expr.name.text === "cardData";
    if (ts.isNonNullExpression(expr) || ts.isParenthesizedExpression(expr)) {
      return isCardDataExpr(expr.expression);
    }
    return false;
  };

  // Pass 1: collect simple aliases (`const d = cardData`).
  const collectAliases = (node: ts.Node) => {
    if (ts.isVariableDeclaration(node) && node.initializer && ts.isIdentifier(node.name)) {
      if (ts.isIdentifier(node.initializer) && node.initializer.text === "cardData") {
        aliases.add(node.name.text);
      }
    }
    ts.forEachChild(node, collectAliases);
  };

  const visit = (node: ts.Node) => {
    if (ts.isTypeNode(node)) return; // skip type positions entirely

    // cardData.<field> / alias.<field> / *.cardData.<field>
    if (ts.isPropertyAccessExpression(node) && isCardDataExpr(node.expression)) {
      record(node.name.text, lineOf(sf, node));
      classifyListUse(node.name.text, node);
    }
    // cardData["field"]
    if (
      ts.isElementAccessExpression(node) &&
      isCardDataExpr(node.expression) &&
      ts.isStringLiteral(node.argumentExpression)
    ) {
      record(node.argumentExpression.text, lineOf(sf, node));
      classifyListUse(node.argumentExpression.text, node);
    }
    // const { testimonials, bio: b } = cardData
    if (
      ts.isVariableDeclaration(node) &&
      node.initializer &&
      isCardDataExpr(node.initializer) &&
      ts.isObjectBindingPattern(node.name)
    ) {
      for (const el of node.name.elements) {
        const field = el.propertyName
          ? ts.isIdentifier(el.propertyName) ? el.propertyName.text : null
          : ts.isIdentifier(el.name) ? el.name.text : null;
        if (field) {
          record(field, lineOf(sf, el));
          // the binding name becomes a list alias (e.g. `const {faqs} = cardData`)
          if (LIST_FIELDS.has(field) && ts.isIdentifier(el.name)) {
            listAliases.set(el.name.text, field);
          }
        }
      }
    }
    // <SharedTag cardData={cardData} …> or <SharedTag {...cardData}>
    if (ts.isJsxAttribute(node) && node.name.getText() === "cardData") {
      const init = node.initializer;
      const passes =
        init && ts.isJsxExpression(init) && init.expression && isCardDataExpr(init.expression);
      if (passes) {
        const attrs = node.parent;
        const opening = attrs.parent;
        if (ts.isJsxOpeningElement(opening) || ts.isJsxSelfClosingElement(opening)) {
          const tag = opening.tagName.getText();
          if (sharedTags.has(tag)) wholePassShared.add(tag);
        }
      }
    }
    if (ts.isJsxSpreadAttribute(node) && isCardDataExpr(node.expression)) {
      const opening = node.parent.parent;
      if (ts.isJsxOpeningElement(opening) || ts.isJsxSelfClosingElement(opening)) {
        const tag = opening.tagName.getText();
        if (sharedTags.has(tag)) wholePassShared.add(tag);
      }
    }
    // logoPath prop usage (identifier reference outside bindings/types/attr names)
    if (
      ts.isIdentifier(node) &&
      node.text === "logoPath" &&
      !ts.isBindingElement(node.parent) &&
      !ts.isPropertySignature(node.parent) &&
      !ts.isParameter(node.parent) &&
      !(ts.isPropertyAssignment(node.parent) && node.parent.name === node) &&
      !(ts.isJsxAttribute(node.parent) && node.parent.name === node) &&
      !(ts.isPropertyAccessExpression(node.parent) && node.parent.name === node)
    ) {
      if (logoPathLines.length < 5) logoPathLines.push(lineOf(sf, node));
    }

    ts.forEachChild(node, visit);
  };

  // Pass B — alias usages: `const reviews = cardData.testimonials ?? []` then
  // `reviews[0].quote` (content) vs `reviews.length` (count chip, neutral).
  const visitAliasUses = (node: ts.Node) => {
    if (ts.isTypeNode(node)) return;
    if (
      ts.isIdentifier(node) &&
      listAliases.has(node.text) &&
      !ts.isBindingElement(node.parent) &&
      !(ts.isVariableDeclaration(node.parent) && node.parent.name === node) &&
      !(ts.isPropertyAccessExpression(node.parent) && node.parent.name === node) &&
      !(ts.isJsxAttribute(node.parent) && node.parent.name === node) &&
      !(ts.isPropertyAssignment(node.parent) && node.parent.name === node)
    ) {
      const use = classifyValueUse(node);
      if (use === "content") contentFields.add(listAliases.get(node.text)!);
      // re-alias chain: `const services = allServices` — propagate the field
      else if (typeof use === "object") listAliases.set(use.alias, listAliases.get(node.text)!);
    }
    ts.forEachChild(node, visitAliasUses);
  };

  for (const st of sf.statements) {
    if (isExcludedDecl(st)) continue;
    collectAliases(st);
  }
  for (const st of sf.statements) {
    if (isExcludedDecl(st)) continue;
    visit(st);
  }
  for (const st of sf.statements) {
    if (isExcludedDecl(st)) continue;
    visitAliasUses(st);
  }
  return { fields, contentFields, wholePassShared, logoPathLines };
}

/** Extract { key, supports } from an object literal that looks like an entry. */
function entryFromObject(obj: ts.ObjectLiteralExpression): EntryInfo | null {
  let key: string | null = null;
  const supports: Record<string, boolean> = {};
  for (const prop of obj.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const name = prop.name.getText().replace(/['"]/g, "");
    if (name === "key" && ts.isStringLiteral(prop.initializer)) key = prop.initializer.text;
    if (name === "supports" && ts.isObjectLiteralExpression(prop.initializer)) {
      for (const sp of prop.initializer.properties) {
        if (ts.isPropertyAssignment(sp)) {
          supports[sp.name.getText()] = sp.initializer.kind === ts.SyntaxKind.TrueKeyword;
        }
      }
    }
  }
  return key ? { key, supports } : null;
}

function extractEntry(sf: ts.SourceFile): EntryInfo | null {
  for (const st of sf.statements) {
    if (!ts.isVariableStatement(st)) continue;
    for (const d of st.declarationList.declarations) {
      const name = ts.isIdentifier(d.name) ? d.name.text : "";
      if (!/Entry$/.test(name)) continue;
      if (d.initializer && ts.isObjectLiteralExpression(d.initializer)) {
        return entryFromObject(d.initializer);
      }
    }
  }
  return null;
}

/** Parse registry.ts: NATIVE_KEYS sets + inline entries (RealEstate id=1). */
function parseRegistry(): { sets: Map<string, Set<string>>; inlineEntries: EntryInfo[] } {
  const sf = parse(REGISTRY);
  const sets = new Map<string, Set<string>>();
  const inlineEntries: EntryInfo[] = [];
  const walk = (node: ts.Node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && /_NATIVE_KEYS$/.test(node.name.text)) {
      const init = node.initializer;
      if (init && ts.isNewExpression(init) && init.arguments?.[0] && ts.isArrayLiteralExpression(init.arguments[0])) {
        const members = new Set<string>();
        for (const el of init.arguments[0].elements) {
          if (ts.isStringLiteral(el)) members.add(el.text);
        }
        sets.set(node.name.text, members);
      }
    }
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === "templateRegistry" &&
      node.initializer &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      for (const prop of node.initializer.properties) {
        if (ts.isPropertyAssignment(prop) && ts.isObjectLiteralExpression(prop.initializer)) {
          const entry = entryFromObject(prop.initializer);
          if (entry) inlineEntries.push(entry); // only fully-inline entries (spread entries yield no key)
        }
      }
    }
    ts.forEachChild(node, walk);
  };
  walk(sf);
  return { sets, inlineEntries };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const mode = process.argv.includes("--json") ? "json" : process.argv.includes("--check") ? "check" : "report";

// 1. Shared component field profiles (leaves — no recursion needed).
const sharedProfiles = new Map<string, Map<string, number[]>>();
for (const f of fs.readdirSync(SHARED_DIR)) {
  if (!f.endsWith(".tsx")) continue;
  const a = analyzeFile(parse(path.join(SHARED_DIR, f)));
  sharedProfiles.set(path.basename(f, ".tsx"), a.fields);
}

// 2. Registry sets + inline entries.
const { sets, inlineEntries } = parseRegistry();

// 3. Per-template analysis.
interface TemplateResult {
  file: string;
  key: string;
  supports: Record<string, boolean>;
  native: Map<string, number[]>; // field → evidence lines (incl. shared unions)
  content: Set<string>; // list fields whose CONTENT renders (not just counts)
  logoNative: boolean;
}
const results: TemplateResult[] = [];

/** "Renders natively" for gate purposes: list fields require content evidence. */
const isNative = (r: TemplateResult, field: string): boolean =>
  field === "logoPath" ? r.logoNative : LIST_FIELDS.has(field) ? r.content.has(field) : r.native.has(field);

for (const f of fs.readdirSync(V2_DIR).sort()) {
  if (!f.endsWith(".tsx")) continue;
  const full = path.join(V2_DIR, f);
  const sf = parse(full);
  const analysis = analyzeFile(sf);
  let entry = extractEntry(sf);
  if (!entry) {
    // RealEstate's entry lives inline in registry.ts.
    entry = inlineEntries.length === 1 && f === "RealEstate.tsx" ? inlineEntries[0] : entry;
  }
  if (!entry) {
    console.error(`WARN no entry found for ${f} — skipped`);
    continue;
  }
  const native = new Map(analysis.fields);
  for (const tag of Array.from(analysis.wholePassShared)) {
    const profile = sharedProfiles.get(tag);
    if (!profile) continue;
    for (const [field, lines] of Array.from(profile.entries())) {
      if (!native.has(field)) native.set(field, lines.map(() => -1)); // -1 = via shared
    }
  }
  results.push({
    file: f,
    key: entry.key,
    supports: entry.supports,
    native,
    content: analysis.contentFields,
    logoNative: analysis.logoPathLines.length > 0,
  });
}

// 4. Fixture assertions — if these fail the analyzer itself is broken.
const fixture = (cond: boolean, msg: string) => {
  if (!cond) {
    console.error(`FIXTURE FAILED: ${msg} — analyzer is broken, aborting.`);
    process.exit(2);
  }
};
const byKey = new Map(results.map((r) => [r.key, r]));
fixture(results.length >= 90, `expected ~96 templates, found ${results.length}`);
fixture(!!byKey.get("beauty-salon")?.content.has("testimonials"), "beauty-salon must render testimonials CONTENT natively");
fixture(byKey.get("maker")?.logoNative === false, "maker must NOT consume logoPath");
fixture(!!byKey.get("accounting")?.native.has("address"), "accounting must inherit address via ContactRows whole-pass");
// Count-chip-only templates: testimonials referenced but content never shown —
// these must NOT count as native (they'd silently drop the owner's quotes).
fixture(
  !!byKey.get("restaurant-pure")?.native.has("testimonials") &&
    !byKey.get("restaurant-pure")?.content.has("testimonials"),
  "restaurant-pure must classify testimonials as count-only (referenced, not content)",
);
fixture(
  !!byKey.get("legal-counsel-pure")?.content.has("testimonials"),
  "legal-counsel-pure must classify testimonials as content (quote+author render)",
);

// 5. Reports.
const errors: string[] = [];
const warnings: string[] = [];

// -----------------------------------------------------------------------------
// 5a. Fabricated-content rules (2026-06 purge — keep it purged).
// Real customer cards must never render invented persona data. Three rules,
// all scoped to RENDER code: SampleData/Entry declarations (isExcludedDecl)
// are skipped — rich personas are allowed in samples.
// -----------------------------------------------------------------------------

/** Literal fallbacks that are pure punctuation/separators/glyphs are fine
 *  (e.g. avatar-initial "?" when no name parts exist). */
const FALLBACK_ALLOWLIST = new Set(["", "—", "·", "•", "-", "–", " ", "/", "?"]);

/** Persona strings that must never appear in render code. */
const BANNED_STRINGS = [
  "Walker & Stein", "Beispielinhalt", "12 Personen", "MMXVIII", "MMXII",
  "Bib Gourmand",
];

/** Mojibake sequences — mirror of MOJIBAKE_MAP in fix-template-mojibake.ts
 *  (not imported: that script writes files at module load). Update together. */
const MOJIBAKE_SEQS = ["â‚¬", "â‚º", "â˜…", "â†’", "â˜˜", "âœ¦", "âœ¿", "â‹", "âœ‰", "â˜Ž", "âš¡"];

function containsCardDataAccess(node: ts.Node): boolean {
  if (
    ts.isPropertyAccessExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === "cardData"
  ) {
    return true;
  }
  let found = false;
  node.forEachChild((c) => {
    if (!found && containsCardDataAccess(c)) found = true;
  });
  return found;
}

for (const f of fs.readdirSync(V2_DIR).sort()) {
  if (!f.endsWith(".tsx")) continue;
  const full = path.join(V2_DIR, f);
  const sf = parse(full);

  const scan = (node: ts.Node) => {
    // Rule A — `cardData.x || "literal"` / `?? "literal"` fallbacks.
    if (
      ts.isBinaryExpression(node) &&
      (node.operatorToken.kind === ts.SyntaxKind.BarBarToken ||
        node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken) &&
      ts.isStringLiteral(node.right) &&
      !FALLBACK_ALLOWLIST.has(node.right.text) &&
      containsCardDataAccess(node.left)
    ) {
      errors.push(
        `${f}:${lineOf(sf, node)}: literal fallback for cardData field ` +
          `("${node.right.text}") — render real data or nothing`,
      );
    }
    // Rule A2 — `cardData.x || t.somethingFallback`: a persona claim parked in
    // the copy table so it dodges the string-literal rule. Same sin.
    if (
      ts.isBinaryExpression(node) &&
      (node.operatorToken.kind === ts.SyntaxKind.BarBarToken ||
        node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken) &&
      ts.isPropertyAccessExpression(node.right) &&
      /[Ff]allback$/.test(node.right.name.text) &&
      containsCardDataAccess(node.left)
    ) {
      errors.push(
        `${f}:${lineOf(sf, node)}: copy-table fallback for cardData field ` +
          `(${node.right.getText()}) — render real data or nothing`,
      );
    }
    // Rule B2 — fabricated "since" years: getFullYear() ± N in render code.
    if (
      ts.isBinaryExpression(node) &&
      (node.operatorToken.kind === ts.SyntaxKind.MinusToken ||
        node.operatorToken.kind === ts.SyntaxKind.PlusToken) &&
      node.left.getText().endsWith("getFullYear()") &&
      ts.isNumericLiteral(node.right)
    ) {
      errors.push(
        `${f}:${lineOf(sf, node)}: fabricated year (getFullYear() ${node.operatorToken.getText()} ${node.right.text})`,
      );
    }
    // Rule B1 — banned persona strings in render code.
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      for (const banned of BANNED_STRINGS) {
        if (node.text.includes(banned)) {
          errors.push(`${f}:${lineOf(sf, node)}: banned persona string "${banned}"`);
        }
      }
    }
    ts.forEachChild(node, scan);
  };

  for (const st of sf.statements) {
    if (isExcludedDecl(st)) continue;
    scan(st);
  }

  // Rule C — mojibake anywhere in the file (samples included: previews render them).
  const raw = fs.readFileSync(full, "utf8");
  for (const seq of MOJIBAKE_SEQS) {
    if (raw.includes(seq)) {
      errors.push(`${f}: mojibake sequence ${JSON.stringify(seq)} — run scripts/fix-template-mojibake.ts`);
    }
  }
}

for (const [field, setName] of Object.entries(FIELD_TO_SET)) {
  const set = sets.get(setName);
  const nativeKeys = results
    .filter((r) => isNative(r, field))
    .map((r) => r.key)
    .sort();
  if (!set) {
    warnings.push(
      `${setName} not defined in registry.ts yet (universal block pending). ` +
        `Native renderers (${nativeKeys.length}): ${nativeKeys.join(", ")}`,
    );
    continue;
  }
  for (const k of nativeKeys) {
    if (!set.has(k)) errors.push(`${k}: renders '${field}' natively but missing from ${setName} → DOUBLE RENDER`);
  }
  for (const k of Array.from(set)) {
    if (!nativeKeys.includes(k)) errors.push(`${k}: in ${setName} but no native '${field}' render → SILENT DROP`);
  }
}

// Silent drops: visual, owner-editable fields with no native render and no wrapper.
const dropMatrix = new Map<string, string[]>();
for (const r of results) {
  for (const field of VISUAL_FIELDS) {
    if (WRAPPER_COVERED.has(field) || BASELINE_FIELDS.has(field)) continue;
    if (!isNative(r, field)) {
      if (!dropMatrix.has(field)) dropMatrix.set(field, []);
      dropMatrix.get(field)!.push(r.key);
    }
  }
}
for (const [field, keys] of Array.from(dropMatrix.entries())) {
  errors.push(`SILENT DROP '${field}' (${keys.length} templates, no native render + no wrapper): ${keys.join(", ")}`);
}

// supports manifest drift (warning-level — drives order-form input visibility only).
for (const r of results) {
  for (const [flag, fields] of Object.entries(SUPPORTS_TO_FIELDS)) {
    const declared = r.supports[flag];
    if (declared === undefined) continue;
    const actual = fields.some((f) => isNative(r, flag === "logo" ? "logoPath" : f));
    if (declared !== actual) {
      warnings.push(`supports drift ${r.key}: supports.${flag}=${declared} but native render=${actual}`);
    }
  }
}

if (mode === "json") {
  const out = results.map((r) => ({
    file: r.file,
    key: r.key,
    supports: r.supports,
    logoNative: r.logoNative,
    contentFields: Array.from(r.content).sort(),
    fields: Object.fromEntries(Array.from(r.native.entries()).map(([f, lines]) => [f, lines])),
  }));
  console.log(JSON.stringify({ templates: out, errors, warnings }, null, 2));
} else {
  console.log(`Analyzed ${results.length} templates, ${sharedProfiles.size} shared components.\n`);
  for (const [field, setName] of Object.entries(FIELD_TO_SET)) {
    const count = results.filter((r) => isNative(r, field)).length;
    console.log(`${field.padEnd(14)} native in ${String(count).padStart(2)}/${results.length}  (gate: ${setName}${sets.has(setName) ? `, ${sets.get(setName)!.size} keys` : " — MISSING"})`);
  }
  console.log("");
  if (warnings.length) {
    console.log(`--- WARNINGS (${warnings.length}) ---`);
    for (const w of warnings) console.log("  ~ " + w);
  }
  if (errors.length) {
    console.log(`--- ERRORS (${errors.length}) ---`);
    for (const e of errors) console.log("  ✗ " + e);
  } else {
    console.log("No errors — every visual field is natively rendered or wrapper-covered, Sets consistent.");
  }
}

if (mode === "check" && errors.length) process.exit(1);
