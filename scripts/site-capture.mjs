// Screenshots + checks for marketing pages on a local server (default BASE http://127.0.0.1:3108).
// usage: node scripts/site-capture.mjs <run-name> <path> [<path> ...]
//   e.g. node scripts/site-capture.mjs home / /en /tr
// Writes .shots/<run-name>/<page>-{desktop,mobile}-{hero,full}.jpg, <page>-desktop-reduced-hero.jpg
// and report.json (HTTP status, console/page errors, horizontal overflow, axe WCAG A/AA violations).
// Flags: --no-full (hero shots only), --no-axe.
// Needs playwright-core and a Chromium headless shell, which this repo does not install: set PLAYWRIGHT_CORE to
// a playwright-core index.mjs (the default is the owner's opso-card tool checkout).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "..");
const PW =
  process.env.PLAYWRIGHT_CORE ||
  path.join(process.env.HOME, "Documents/Codex/Projects/Project_VERSO-opso-card/tools/opso-card/node_modules/playwright-core/index.mjs");
const { chromium } = await import(PW);

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const [run, ...paths] = args.filter((a) => !a.startsWith("--"));
if (!/^[a-z0-9-]+$/.test(run || "") || paths.length === 0 || paths.some((p) => !p.startsWith("/"))) {
  console.error("usage: node scripts/site-capture.mjs <run-name> </path> [</path> ...] [--no-full] [--no-axe]");
  process.exit(2);
}
const base = process.env.BASE || "http://127.0.0.1:3108";
if (!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(base)) { console.error("BASE must be a loopback URL"); process.exit(2); }
const out = path.join(repo, ".shots", run);
fs.mkdirSync(out, { recursive: true });
const axeSrc = flags.has("--no-axe") ? null : fs.readFileSync(path.join(repo, "node_modules/axe-core/axe.min.js"), "utf8");

const cache = path.join(process.env.HOME, "Library/Caches/ms-playwright");
const shell = fs.readdirSync(cache).filter((d) => d.startsWith("chromium_headless_shell-")).sort().pop();
const browser = await chromium.launch({
  executablePath: path.join(cache, shell, "chrome-headless-shell-mac-arm64/chrome-headless-shell"),
  args: ["--use-gl=angle", "--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist", "--autoplay-policy=no-user-gesture-required"],
});

const report = [];
const name = (p) => (p === "/" ? "root" : p.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "_"));

async function open(viewport, scale, reducedMotion, p, entry) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: scale, reducedMotion });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") entry.errors.push(`console: ${m.text().slice(0, 300)}`); });
  page.on("pageerror", (e) => entry.errors.push(`pageerror: ${e.message.slice(0, 300)}`));
  const res = await page.goto(base + p, { waitUntil: "networkidle", timeout: 180000 });
  entry.status = entry.status ?? res?.status();
  entry.finalUrl = entry.finalUrl ?? page.url().replace(base, "");
  await page.waitForTimeout(1800);
  return { ctx, page };
}

async function walk(page, viewport) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += Math.round(viewport.height * 0.6)) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(220);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);
}

for (const p of paths) {
  const n = name(p);
  const entry = { path: p, errors: [], overflow: {}, axe: null };
  for (const [mode, viewport, scale] of [["desktop", { width: 1440, height: 900 }, 1], ["mobile", { width: 390, height: 844 }, 2]]) {
    let { ctx, page } = await open(viewport, scale, "no-preference", p, entry);
    await page.screenshot({ path: path.join(out, `${n}-${mode}-hero.jpg`), type: "jpeg", quality: 84 });
    if (!flags.has("--no-full")) {
      await ctx.close();
      ({ ctx, page } = await open(viewport, 1, "no-preference", p, entry));
      await walk(page, viewport);
      entry.overflow[mode] = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      await page.screenshot({ path: path.join(out, `${n}-${mode}-full.jpg`), type: "jpeg", quality: 74, fullPage: true });
    } else {
      entry.overflow[mode] = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    }
    if (mode === "desktop" && axeSrc) {
      await page.addScriptTag({ content: axeSrc });
      entry.axe = await page.evaluate(async () => {
        // eslint-disable-next-line no-undef
        const r = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } });
        return r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, sample: v.nodes[0]?.target?.join(" ") }));
      });
    }
    await ctx.close();
  }
  const { ctx, page } = await open({ width: 1440, height: 900 }, 1, "reduce", p, entry);
  await page.screenshot({ path: path.join(out, `${n}-desktop-reduced-hero.jpg`), type: "jpeg", quality: 80 });
  await ctx.close();
  report.push(entry);
  const problems = entry.errors.length + (entry.axe?.length ?? 0) + Object.values(entry.overflow).filter((v) => v > 1).length;
  console.log(`${p} → ${entry.status} ${entry.finalUrl}  errors:${entry.errors.length} axe:${entry.axe?.length ?? "-"} overflow:${JSON.stringify(entry.overflow)}${problems ? "  ← check" : ""}`);
}

await browser.close();
fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2));
console.log(`report → ${path.relative(repo, path.join(out, "report.json"))}`);
