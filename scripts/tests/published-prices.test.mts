import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

// The only prices opsolid.de may state (repo CLAUDE.md, "Published offers"): KI-Check 990 (fixed price), KI-Kompetenz
// 1.790 (+90), Copilot-Praxistag 2.900 (+150), KI-Agenten & Workflow-Automatisierung 5.900 (+290), all net.
// The OpSo NFC card's planned price (owner decision 2026-11-19, replaces decision 78): 29, only in the card studio
// page and only in its price block (the five-card price of 25 follows at launch), next to "not available to order yet" (legal check
// of 2026-11-19). A wrong amount in one shared component (the journal CTA said 490 € for months) is what this guards
// against.
// Owner decision 2026-11-06: the price answers also state the arithmetic per person at the included group
// size, 1.790 / 10 = 179 and 2.900 / 10 = 290 (290 is already the KI-Agenten surcharge).
const ALLOWED = new Set(["990", "1790", "90", "2900", "150", "5900", "290", "179"]);
const ROOTS = ["src/content/v7", "src/content/blog", "src/components/v7", "src/app/llms.txt"];
/** Amounts that one file alone may state. */
const ALLOWED_IN: Record<string, Set<string>> = { "src/content/v7/pages/opso-karte.ts": new Set(["29"]) };
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
        if (!ALLOWED.has(n) && !ALLOWED_IN[f]?.has(n)) bad.push(`${f}: ${m[0].trim()}`);
      }
    }
  }
  assert.deepEqual(bad, []);
});

test("the OpSo card's planned price stays in the studio's price block", () => {
  const src = readFileSync("src/content/v7/pages/opso-karte.ts", "utf8");
  // Per locale: the price value once, in the studio's price block; nowhere in titles, descriptions, FAQ answers or the hero copy.
  const amounts = [...src.matchAll(AMOUNT)].map((m) => normalize(m[1] ?? m[2]));
  assert.deepEqual(amounts.sort(), ["29", "29", "29"]);
  const outside = src.replace(/price: \{[^}]*\}/g, "");
  assert.equal([...outside.matchAll(AMOUNT)].length, 0, "a price outside the price block");
  assert.equal((src.match(/price: \{/g) ?? []).length, 3);
  for (const status of ["Noch nicht bestellbar", "Not available to order yet", "Henüz sipariş verilemiyor"]) {
    assert.ok(src.includes(`status: "${status}"`), `missing status ${status}`);
  }
  assert.ok(!/inkl\. MwSt|incl\. VAT|KDV dahil|zzgl\. USt/i.test(src), "no VAT wording until the VAT status is settled");
});
