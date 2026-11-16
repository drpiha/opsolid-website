/**
 * The app-surface stylesheet (src/app/globals.css) loads only on app surfaces since 2026-11-15: the root layout loads
 * the marketing sheet (src/styles/marketing.css) instead. This pins the split: every app folder under src/app/[locale]
 * (and the app folders outside it) has a layout that imports globals.css, no marketing route does, and the marketing
 * Tailwind config scans every marketing route folder.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = path.resolve(import.meta.dirname, "../..");
const APP = path.join(ROOT, "src/app");
const read = (p: string) => fs.readFileSync(p, "utf8");
const IMPORT = /import\s+["']@\/app\/globals\.css["']/;

// src/lib/v4.ts APP_FIRST_SEGMENTS; login, signup and magic-link live in the (auth) group.
const v4 = read(path.join(ROOT, "src/lib/v4.ts"));
const appSet = v4.match(/APP_FIRST_SEGMENTS = new Set\(\[([\s\S]*?)\]\)/)?.[1] ?? "";
const APP_SEGMENTS = [...appSet.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const AUTH = new Set(["login", "signup", "magic-link"]);

test("the root layout loads the marketing sheet, not the app sheet", () => {
  const root = read(path.join(APP, "layout.tsx"));
  assert.ok(!/import\s+["']\.\/globals\.css["']/.test(root) && !IMPORT.test(root), "root layout imports globals.css");
  assert.ok(/import\s+["']\.\.\/styles\/marketing\.css["']/.test(root), "root layout lacks marketing.css");
});

test("both Tailwind sheets name their config, so neither borrows the other's context", () => {
  // Without @config the app sheet picked up the marketing content set when both were processed at once (build of
  // 2026-11-15: the app utilities shrank from 154 kB to 30 kB).
  assert.ok(/@config\s+["']\.\.\/\.\.\/tailwind\.config\.ts["']/.test(read(path.join(APP, "globals.css"))), "globals.css lacks @config");
  assert.ok(/@config\s+["']\.\.\/\.\.\/tailwind\.marketing\.config\.ts["']/.test(read(path.join(ROOT, "src/styles/marketing.css"))), "marketing.css lacks @config");
});

test("every app folder under [locale] has a layout that imports globals.css", () => {
  assert.ok(APP_SEGMENTS.length >= 10, "APP_FIRST_SEGMENTS not found");
  for (const seg of APP_SEGMENTS) {
    const dir = AUTH.has(seg) ? "(auth)" : seg;
    const layout = path.join(APP, "[locale]", dir, "layout.tsx");
    assert.ok(fs.existsSync(layout), `${dir} has no layout.tsx`);
    assert.ok(IMPORT.test(read(layout)), `${dir}/layout.tsx does not import globals.css`);
  }
});

test("the app folders outside [locale] import globals.css too", () => {
  for (const dir of ["admin", "c", "dev", "voice"]) {
    assert.ok(IMPORT.test(read(path.join(APP, dir, "layout.tsx"))), `${dir}/layout.tsx does not import globals.css`);
  }
});

test("no marketing route imports globals.css, and the marketing Tailwind config scans each of them", () => {
  const cfg = read(path.join(ROOT, "tailwind.marketing.config.ts"));
  const folders = fs
    .readdirSync(path.join(APP, "[locale]"), { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("(") && !APP_SEGMENTS.includes(d.name))
    .map((d) => d.name);
  assert.ok(folders.includes("ki-schulungen") && folders.includes("produkte"), "marketing folders not found");
  const walk = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));
  for (const f of folders) {
    assert.ok(cfg.includes(`"${f}"`), `tailwind.marketing.config.ts does not scan ${f}`);
    for (const file of walk(path.join(APP, "[locale]", f)).filter((p) => /\.tsx?$/.test(p))) {
      assert.ok(!IMPORT.test(read(file)), `${path.relative(ROOT, file)} imports globals.css`);
    }
  }
});
