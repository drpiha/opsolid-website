// =============================================================================
// ONE-OFF CODEMOD — wire `resolveLabels` + export `COPY` across v2 templates.
//
// NOT wired into the build. Run once, commit the resulting diff. `npm run
// build` is the real gate: resolveLabels preserves each template's `XxxCopy`
// return type, so any mis-edit fails compilation.
//
// For every template file that contains the byte-identical sentinel
//   `  const t = COPY[locale] ?? COPY.de;`
// it performs three idempotent edits:
//   1. insert `import { resolveLabels } from "./shared/resolveLabels";`
//      immediately before the first `… from "./types";` import.
//   2. swap the sentinel for
//      `  const t = resolveLabels(COPY[locale] ?? COPY.de, cardData.labels);`
//   3. `const COPY` → `export const COPY` (so labelsRegistry.ts can read the
//      per-template copy table for the editor).
//
// Usage:  npx tsx scripts/codemod-resolve-labels.ts
// =============================================================================

import * as fs from "fs";
import * as path from "path";

const V2_DIR = path.join(__dirname, "..", "src", "components", "cards", "templates", "v2");

const SENTINEL = "  const t = COPY[locale] ?? COPY.de;";
const REPLACEMENT =
  "  const t = resolveLabels(COPY[locale] ?? COPY.de, cardData.labels);";
const IMPORT_LINE = 'import { resolveLabels } from "./shared/resolveLabels";';

let changed = 0;
let skipped = 0;
const problems: string[] = [];

for (const file of fs.readdirSync(V2_DIR).sort()) {
  if (!file.endsWith(".tsx")) continue;
  const full = path.join(V2_DIR, file);
  let src = fs.readFileSync(full, "utf8");
  if (!src.includes(SENTINEL)) continue;

  const before = src;

  // 1. import (idempotent)
  if (!src.includes(IMPORT_LINE)) {
    const lines = src.split("\n");
    const anchor = lines.findIndex((l) => /from "\.\/types";\s*$/.test(l));
    if (anchor === -1) {
      problems.push(`${file}: has sentinel but no './types' import anchor`);
      continue;
    }
    lines.splice(anchor, 0, IMPORT_LINE);
    src = lines.join("\n");
  }

  // 2. sentinel swap (only the first/only occurrence)
  src = src.replace(SENTINEL, REPLACEMENT);

  // 3. export the COPY table
  src = src.replace(/^const COPY/m, "export const COPY");

  if (src !== before) {
    fs.writeFileSync(full, src, "utf8");
    changed++;
  } else {
    skipped++;
  }
}

console.log(`codemod-resolve-labels: ${changed} changed, ${skipped} unchanged.`);
if (problems.length) {
  console.error("PROBLEMS:");
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}
