#!/usr/bin/env node
/**
 * Layout guard for the marketing routes. Needs a running server (`npm run start` or `npm run dev`).
 *
 *   node scripts/audit-stage.mjs                       # hero-scene guard, all pages, 1280/1440/1920/390
 *   node scripts/audit-stage.mjs --headings            # headline-fit guard only (fast), de/en/tr
 *   node scripts/audit-stage.mjs --pages home,agenten --sizes 1440x900 --shots /tmp/shots
 *
 * Pages are named by their current public German slug (PATHS); each locale opens that page's own public slug
 * through href() of src/lib/v7-routes.ts, so --headings really covers the EN and TR pages. The script re-runs itself
 * under `node --import tsx` when plain node cannot load the TypeScript route table.
 *
 * Environment: BASE (default http://localhost:3000), CHROMIUM_PATH (default: the first existing of
 * /opt/pw-browsers/chromium, the macOS Google Chrome app, /usr/bin/chromium, /usr/bin/google-chrome).
 *
 * Scene guard: the hero tap layer (components/v4/HeroScene, `window.__v5scene`, only exposed with `?debug`)
 * is tapped on a 6×5 grid across the hero. After every tap the open card must lie inside the hero and the
 * viewport and must not intersect any text, link or button of the hero copy, nor the scene's control bar.
 * The control bar itself must not intersect the copy. The poster image must have loaded.
 *
 * Headline guard: no h1/h2 may need a mid-word break (checked with `overflow-wrap: normal`, soft
 * hyphens still allowed), which is what produces "Prozessautomatisierun / g".
 *
 * Also fails on horizontal scroll and console errors. Exit code 1 on any failure.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);

// The route table is TypeScript with "@/..." imports: load it through tsx (re-run once under `node --import tsx`).
let R;
try {
  const mod = await import("../src/lib/v7-routes.ts");
  R = mod.PAGE_KEYS ? mod : mod.default;
} catch (err) {
  if (process.env.AUDIT_STAGE_TSX) throw err;
  const run = spawnSync(process.execPath, ["--import", "tsx", fileURLToPath(import.meta.url), ...args], {
    stdio: "inherit",
    env: { ...process.env, AUDIT_STAGE_TSX: "1" },
  });
  process.exit(run.status ?? 1);
}

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer-core");

const flag = (n) => args.includes(`--${n}`);
const opt = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};

const BASE = (process.env.BASE || "http://localhost:3000").replace(/\/$/, "");
const HEADINGS_ONLY = flag("headings");
const SHOTS = opt("shots", "");
const LOCALES = opt("locales", HEADINGS_ONLY ? "de,en,tr" : "de").split(",");
const SIZES = opt("sizes", HEADINGS_ONLY ? "360x740,390x844,768x1024,1280x720,1440x900,1920x1080" : "1280x720,1440x900,1920x1080,390x844")
  .split(",")
  .map((s) => s.split("x").map(Number));
// Current public German slugs (decision 73: the consulting page lives at /ki-beratung/ki-assistenten).
const PATHS = {
  home: "",
  schulungen: "/ki-schulungen",
  workflows: "/ki-schulungen/ki-agenten",
  kompetenz: "/ki-schulungen/ki-kompetenz",
  copilot: "/ki-schulungen/copilot-praxistag",
  beratung: "/ki-beratung",
  check: "/ki-beratung/ki-check",
  agenten: "/ki-beratung/ki-assistenten",
  produkte: "/produkte",
  opso: "/opso",
  about: "/ueber-uns",
  contact: "/contact",
  blog: "/blog",
};
const PAGES = opt("pages", Object.keys(PATHS).join(",")).split(",");
/** The public path of a PATHS entry in one locale ("/" for the German home, "/en/ai-training/ai-agents", …). */
function pathFor(pg, loc) {
  if (!(pg in PATHS)) throw new Error(`unknown page "${pg}"; known: ${Object.keys(PATHS).join(", ")}`);
  const hit = R.keyForPublicPath(`/de${PATHS[pg]}`);
  if (!hit) throw new Error(`${pg}: "${PATHS[pg]}" is not a public German slug`);
  return R.href(hit.key, loc);
}

const exe =
  process.env.CHROMIUM_PATH ||
  ["/opt/pw-browsers/chromium", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/chromium", "/usr/bin/google-chrome"].find((p) => fs.existsSync(p));
if (!exe) throw new Error("no Chromium found; set CHROMIUM_PATH");
const browser = await puppeteer.launch({ executablePath: exe, headless: true, args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"] });

const failures = [];
const fail = (msg) => {
  failures.push(msg);
  console.log("FAIL " + msg);
};
const COPY_SELECTOR = ".v4-hero-copy :is(h1,p,a,button,dt,dd,li,.v4-eyebrow)";

for (const loc of LOCALES) {
  for (const [w, h] of SIZES) {
    const mobile = w < 760;
    for (const pg of PAGES) {
      const label = `${loc}/${pg} @${w}x${h}`;
      const p = await browser.newPage();
      await p.setViewport({ width: w, height: h, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
      const errs = [];
      p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
      p.on("console", (m) => {
        if (m.type() === "error") errs.push("console: " + m.text().slice(0, 140));
      });
      await p.goto(`${BASE}${pathFor(pg, loc)}?debug`, { waitUntil: "load", timeout: 90000 });

      // headline fit: no h1/h2 may need a mid-word break
      const tight = await p.evaluate(() =>
        [...document.querySelectorAll("main h1, main h2")]
          .filter((el) => el.getBoundingClientRect().width > 0)
          .filter((el) => {
            const keep = [el.style.overflowWrap, el.style.wordBreak, el.style.hyphens];
            el.style.overflowWrap = "normal";
            el.style.wordBreak = "normal";
            el.style.hyphens = "manual";
            const over = el.scrollWidth > el.clientWidth + 1;
            [el.style.overflowWrap, el.style.wordBreak, el.style.hyphens] = keep;
            return over;
          })
          .map((el) => (el.textContent || "").replace(/­/g, "").trim().slice(0, 60)),
      );
      for (const t of tight) fail(`${label}: heading needs a mid-word break: "${t}"`);
      if (await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) fail(`${label}: horizontal scroll`);

      const hasHero = await p.evaluate(() => !!document.querySelector(".v4-hero"));
      if (!HEADINGS_ONLY && hasHero) {
        const ready = await p
          .waitForFunction(() => window.__v5scene && document.querySelector(".v4-scene-media img")?.complete, { timeout: 30000 })
          .then(() => true)
          .catch(() => false);
        if (!ready) fail(`${label}: scene hook or poster not ready`);
        const poster = await p.evaluate(() => document.querySelector(".v4-scene-media img")?.naturalWidth ?? 0);
        if (!poster) fail(`${label}: poster image did not load`);
        const bar = await p.evaluate((sel) => {
          const hit = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
          const copy = [...document.querySelectorAll(sel)].map((e) => e.getBoundingClientRect()).filter((r) => r.width > 2 && r.height > 2);
          const ctrl = [...document.querySelectorAll(".v4-scene-bar .v4-scene-hint span:last-child, .v4-scene-bar button")].map((e) => e.getBoundingClientRect());
          return ctrl.some((c) => copy.some((r) => hit(c, r)));
        }, COPY_SELECTOR);
        if (bar) fail(`${label}: scene control bar overlaps the hero copy`);
        for (let gy = 0; ready && gy < 5; gy++) {
          for (let gx = 0; gx < 6; gx++) {
            const fx = 0.06 + gx * 0.176;
            const fy = 0.1 + gy * 0.2;
            const res = await p.evaluate(
              async ({ fx, fy, sel }) => {
                window.__v5scene.clear();
                await new Promise((r) => requestAnimationFrame(() => r()));
                window.__v5scene.tap(fx, fy);
                await new Promise((r) => setTimeout(r, 520));
                const card = document.querySelector(".v4-scene-card.is-current");
                if (!card) return { err: "no card opened" };
                const c = card.getBoundingClientRect();
                const hero = document.querySelector(".v4-hero").getBoundingClientRect();
                const hit = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2;
                const over = [...document.querySelectorAll(sel)]
                  .map((e) => ({ t: (e.textContent || e.tagName).trim().slice(0, 30), r: e.getBoundingClientRect() }))
                  .filter((e) => e.r.width > 2 && e.r.height > 2 && hit(c, e.r))
                  .map((e) => e.t);
                const ctrl = [...document.querySelectorAll(".v4-scene-bar button")].some((b) => hit(c, b.getBoundingClientRect()));
                const out = c.left < hero.left - 1 || c.right > hero.right + 1 || c.top < hero.top - 1 || c.bottom > hero.bottom + 1 || c.right > innerWidth;
                return { over, ctrl, out };
              },
              { fx, fy, sel: COPY_SELECTOR },
            );
            const at = `tap ${Math.round(fx * 100)}%/${Math.round(fy * 100)}%`;
            if (res.err) fail(`${label} ${at}: ${res.err}`);
            if (res.over?.length) fail(`${label} ${at}: card covers "${res.over[0]}"`);
            if (res.ctrl) fail(`${label} ${at}: card covers the scene controls`);
            if (res.out) fail(`${label} ${at}: card leaves the hero`);
          }
        }
        if (SHOTS) {
          fs.mkdirSync(SHOTS, { recursive: true });
          await p.screenshot({ path: `${SHOTS}/${loc}_${pg}_${w}.png` });
        }
      }
      for (const e of errs) fail(`${label}: ${e}`);
      console.log(`ok   ${label}`);
      await p.close();
    }
  }
}
await browser.close();
console.log(failures.length ? `\n${failures.length} failure(s)` : "\nall clear");
process.exit(failures.length ? 1 : 0);
