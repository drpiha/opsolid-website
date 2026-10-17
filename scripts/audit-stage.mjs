#!/usr/bin/env node
/**
 * Layout guard for the v4 marketing routes. Needs a running server (`npm run start` or `npm run dev`).
 *
 *   node scripts/audit-stage.mjs                       # stage overlap guard, all pages, 1280/1440/1920/390
 *   node scripts/audit-stage.mjs --headings            # headline-fit guard only (no WebGL, fast), de/en/tr
 *   node scripts/audit-stage.mjs --mid                 # also sample every scene at 78 % progress (mid-morph)
 *   node scripts/audit-stage.mjs --pages home,agents --sizes 1440x900 --shots /tmp/shots
 *
 * Environment: BASE (default http://localhost:3000), PLAYWRIGHT_MODULE (path or package, default "playwright"),
 * CHROMIUM_PATH (default /opt/pw-browsers/chromium when present).
 *
 * Stage guard: for every section of the page (scene sections and the flow sections between them) the 3D object's projected screen box
 * (`window.__v4stage.bounds()`, only exposed with `?debug`) must not intersect the rectangle of any
 * visible heading, paragraph, list item, table, link, button or form control. On desktop there is no
 * exemption (an opaque panel does not excuse an intersection). On phones (< 760 px) text sits on opaque
 * panels and the object is above it, so elements with an opaque background ancestor are exempt.
 *
 * Headline guard: no h1/h2 may need a mid-word break (checked with `overflow-wrap: normal`, soft
 * hyphens still allowed), which is what produces "Prozessautomatisierun / g".
 *
 * Also fails on horizontal scroll and console errors. Exit code 1 on any failure.
 */
import fs from "node:fs";

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};

const BASE = (process.env.BASE || "http://localhost:3000").replace(/\/$/, "");
const HEADINGS_ONLY = flag("headings");
const MID = flag("mid");
const SHOTS = opt("shots", "");
const LOCALES = opt("locales", HEADINGS_ONLY ? "de,en,tr" : "de").split(",");
const SIZES = opt("sizes", HEADINGS_ONLY ? "360x740,390x844,768x1024,1280x720,1440x900,1920x1080" : "1280x720,1440x900,1920x1080,390x844")
  .split(",")
  .map((s) => s.split("x").map(Number));
const PATHS = {
  home: "",
  agents: "/agents",
  websites: "/websites",
  leistungen: "/leistungen",
  "ki-beratung": "/ki-beratung",
  prozess: "/prozessautomatisierung",
  m365: "/microsoft-365-automatisierung",
  interne: "/interne-tools",
  schulungen: "/ki-schulungen",
  check: "/ai-automation-check",
  about: "/ueber-mich",
  contact: "/contact",
  blog: "/blog",
};
const PAGES = opt("pages", Object.keys(PATHS).join(",")).split(",");

async function loadPlaywright() {
  const candidates = [process.env.PLAYWRIGHT_MODULE, "playwright", "/opt/node22/lib/node_modules/playwright/index.mjs"].filter(Boolean);
  for (const c of candidates) {
    try {
      return await import(c);
    } catch {
      /* try next */
    }
  }
  throw new Error("playwright not found; set PLAYWRIGHT_MODULE");
}

const pw = await loadPlaywright();
const chromium = pw.chromium ?? pw.default?.chromium;
const exe = process.env.CHROMIUM_PATH || (fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const browser = await chromium.launch({
  executablePath: exe,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--no-sandbox"],
});

const failures = [];
const fail = (msg) => {
  failures.push(msg);
  console.log("FAIL " + msg);
};

const TEXT_SELECTOR = "h1,h2,h3,p,li,dt,dd,summary,a,button,th,td,table,label,input,textarea,.v4-eyebrow";

for (const loc of LOCALES) {
  for (const [w, h] of SIZES) {
    const mobile = w < 760;
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: mobile, isMobile: mobile, deviceScaleFactor: 1 });
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem("opsolid.consent", JSON.stringify({ version: 1, analytics: false, timestamp: 1 }));
      } catch {
        /* storage unavailable */
      }
    });
    for (const pg of PAGES) {
      const label = `${loc}/${pg} @${w}x${h}`;
      const p = await ctx.newPage();
      const errs = [];
      p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
      p.on("console", (m) => {
        if (m.type() === "error") errs.push("console: " + m.text().slice(0, 140));
      });
      await p.goto(`${BASE}/${loc}${PATHS[pg]}?debug`, { waitUntil: "load" });

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

      if (!HEADINGS_ONLY) {
        await p.mouse.move(100, 100);
        await p.mouse.move(200, 200);
        // every section is sampled (scene sections and the plain flow sections between them)
        const scenes = await p.evaluate(() => document.querySelectorAll("[data-scene]").length);
        const sections = await p.evaluate(() => document.querySelectorAll("main section").length);
        const started = await p
          .waitForFunction(() => document.documentElement.dataset.stage, null, { timeout: 60000 })
          .then(() => true)
          .catch(() => false);
        if (scenes > 0 && !started) fail(`${label}: stage never started`);
        for (let i = 0; started && scenes > 0 && i < sections; i++) {
          await p.evaluate(
            ({ i, h, MID }) => {
              const el = document.querySelectorAll("main section")[i];
              const r = el.getBoundingClientRect();
              const y = window.scrollY + r.top + (MID ? r.height * 0.78 : Math.min(r.height * 0.2, 200)) - h * 0.5 + 40;
              window.scrollTo(0, Math.max(0, y));
            },
            { i, h, MID: false },
          );
          const passes = MID ? [false, true] : [false];
          for (const mid of passes) {
            if (mid) {
              await p.evaluate(
                ({ i, h }) => {
                  const el = document.querySelectorAll("main section")[i];
                  const r = el.getBoundingClientRect();
                  window.scrollTo(0, Math.max(0, window.scrollY + r.top + r.height * 0.78 - h * 0.5 + 40));
                },
                { i, h },
              );
            }
            const f0 = (await p.evaluate(() => window.__v4stage?.bounds()))?.frames ?? 0;
            let prev = null;
            let stable = 0;
            for (let t = 0; t < 120 && stable < 2; t++) {
              await p.waitForTimeout(400);
              const bd = await p.evaluate(() => window.__v4stage?.bounds());
              // at least 40 rendered frames since the scroll, then two identical reads
              const settled = bd && bd.frames - f0 >= 40 && prev && Math.abs(bd.l - prev.l) + Math.abs(bd.r - prev.r) + Math.abs(bd.t - prev.t) + Math.abs(bd.b - prev.b) < 4;
              stable = settled ? stable + 1 : 0;
              prev = bd;
            }
            const data = await p.evaluate(
              ({ sel, mobile }) => {
                const bd = window.__v4stage?.bounds();
                const rects = [];
                document.querySelectorAll(sel).forEach((e) => {
                  if (e.closest("header,footer,[role=dialog]")) return;
                  const r = e.getBoundingClientRect();
                  if (r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > innerHeight) return;
                  const cs = getComputedStyle(e);
                  if (cs.visibility === "hidden" || cs.opacity === "0") return;
                  let panel = false;
                  if (mobile) {
                    for (let a = e; a && a.tagName !== "MAIN"; a = a.parentElement) {
                      const m = getComputedStyle(a).backgroundColor.match(/rgba?\(([^)]+)\)/);
                      if (m) {
                        const parts = m[1].split(",").map(Number);
                        if ((parts.length > 3 ? parts[3] : 1) >= 0.99) {
                          panel = true;
                          break;
                        }
                      }
                    }
                  }
                  rects.push({ t: (e.textContent || e.tagName).trim().slice(0, 36), l: r.left, r: r.right, top: r.top, b: r.bottom, panel });
                });
                return { bd, rects };
              },
              { sel: "main " + TEXT_SELECTOR.split(",").join(",main "), mobile },
            );
            if (!data.bd) continue;
            const { l, r, t, b } = data.bd;
            for (const e of data.rects) {
              if (e.panel) continue;
              const ox = Math.min(r, e.r) - Math.max(l, e.l);
              const oy = Math.min(b, e.b) - Math.max(t, e.top);
              if (ox > 2 && oy > 2) fail(`${label} section ${i}${mid ? " (mid-morph)" : ""} ${data.bd.from}→${data.bd.to}: object overlaps "${e.t}" (${Math.round(ox)}x${Math.round(oy)} px)`);
            }
            if (SHOTS) {
              fs.mkdirSync(SHOTS, { recursive: true });
              await p.screenshot({ path: `${SHOTS}/${loc}_${pg}_${w}_${i}${mid ? "m" : ""}.png` });
            }
          }
        }
      }
      for (const e of errs) fail(`${label}: ${e}`);
      console.log(`ok   ${label}`);
      await p.close();
    }
    await ctx.close();
  }
}
await browser.close();
console.log(failures.length ? `\n${failures.length} failure(s)` : "\nall clear");
process.exit(failures.length ? 1 : 0);
