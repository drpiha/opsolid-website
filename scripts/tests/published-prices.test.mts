import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

// The only prices opsolid.de may state (repo CLAUDE.md, "Published offers"): KI-Check ab 990, KI-Kompetenz
// 1.790 (+90), Copilot-Praxistag 2.900 (+150), KI-Agenten & Workflow-Automatisierung 5.900 (+290), all net,
// and the planned OpSo NFC card at 24,90 incl. VAT. A wrong amount in one shared component (the journal CTA
// said 490 € for months) is what this guards against.
const ALLOWED = new Set(["990", "1790", "90", "2900", "150", "5900", "290", "24.90"]);
const ROOTS = ["src/content/v7", "src/content/blog", "src/components/v7", "src/app/llms.txt"];
const AMOUNT = /€\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)|(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s?(?:€|EUR\b)/g;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? files(p) : /\.(ts|tsx)$/.test(p) ? [p] : [];
  });
}

// "1.790" / "1,790" → "1790"; "24,90" / "24.90" → "24.90"
function normalize(raw: string): string {
  const cents = raw.match(/^(\d+)[.,](\d{2})$/);
  return cents ? `${cents[1]}.${cents[2]}` : raw.replace(/[.,]/g, "");
}

test("marketing copy states only the published prices", () => {
  const bad: string[] = [];
  for (const root of ROOTS) {
    for (const f of files(root)) {
      const src = readFileSync(f, "utf8");
      for (const m of src.matchAll(AMOUNT)) {
        const n = normalize(m[1] ?? m[2]);
        if (!ALLOWED.has(n)) bad.push(`${f}: ${m[0].trim()}`);
      }
    }
  }
  assert.deepEqual(bad, []);
});
