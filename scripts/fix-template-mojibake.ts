// =============================================================================
// fix-template-mojibake — one-off codemod repairing UTF-8 mojibake in the v2
// card templates (sample data / copy tables shipped with cp1252-mangled
// currency symbols and glyphs).
//
// Run:    npx tsx scripts/fix-template-mojibake.ts          (writes files)
//         npx tsx scripts/fix-template-mojibake.ts --dry    (report only)
//
// DELIBERATELY an explicit sequence map, NOT a blanket latin1↔utf8 re-decode:
// legitimate Turkish circumflex words ("mekânlar") contain "â" and must
// survive. The same map is enforced as a build gate by
// scripts/audit-template-coverage.ts — keep both in sync.
// =============================================================================

import * as fs from "fs";
import * as path from "path";

/** Broken sequence → intended glyph. */
export const MOJIBAKE_MAP: ReadonlyArray<readonly [string, string]> = [
  ["â‚¬", "€"],
  ["â‚º", "₺"],
  ["â˜…", "★"],
  ["â†’", "→"],
  ["â˜˜", "☘"],
  ["âœ¦", "✦"],
  ["âœ¿", "✿"],
  ["â‹", "❋"],
  ["âœ‰", "✉"],
  ["â˜Ž", "☎"],
  ["âš¡", "⚡"],
];

const V2_DIR = path.join(__dirname, "..", "src", "components", "cards", "templates", "v2");
const dry = process.argv.includes("--dry");

function tsxFiles(dir: string): string[] {
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...tsxFiles(p));
    else if (e.name.endsWith(".tsx") || e.name.endsWith(".ts")) out.push(p);
  }
  return out;
}

let totalFiles = 0;
let totalRepls = 0;

for (const file of tsxFiles(V2_DIR)) {
  const src = fs.readFileSync(file, "utf8");
  let out = src;
  let count = 0;
  for (const [bad, good] of MOJIBAKE_MAP) {
    const parts = out.split(bad);
    count += parts.length - 1;
    out = parts.join(good);
  }
  if (count > 0) {
    totalFiles++;
    totalRepls += count;
    console.log(`${path.relative(V2_DIR, file)}: ${count} replacement(s)`);
    if (!dry) fs.writeFileSync(file, out, "utf8");
  }
}

console.log(`\n${dry ? "[dry-run] " : ""}${totalRepls} replacement(s) in ${totalFiles} file(s).`);

// Post-pass sanity: report any remaining "â" followed by a non-letter — those
// are likely mojibake sequences missing from the map (legit Turkish "â" is
// always followed by a lowercase letter: mekân, kâr…).
let suspicious = 0;
for (const file of tsxFiles(V2_DIR)) {
  const src = fs.readFileSync(file, "utf8");
  const re = /â(?![a-zçğıöşü])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    suspicious++;
    const line = src.slice(0, m.index).split("\n").length;
    console.warn(`SUSPICIOUS ${path.relative(V2_DIR, file)}:${line} → "${src.slice(m.index, m.index + 6)}"`);
  }
}
if (suspicious === 0) console.log("No suspicious 'â' sequences remain.");
else process.exitCode = 1;
