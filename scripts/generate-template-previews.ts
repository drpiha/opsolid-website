// =============================================================================
// Template preview generator (Phase 7.5 → Sprint F1).
//
// Renders every v2 template at /dev/template-preview/<slug> via a running
// Next dev server, screenshots a 540x960 viewport, and writes the PNG to
// public/images/templates/card-XX.png where XX is the zero-padded templateId.
// Those PNGs are then served as `og:image` on /c/[slug]/page.tsx for any
// order whose templateId matches, AND consumed by the mobile app's template
// picker so users see real renders, not wireframes.
//
// USAGE
//   1. In one terminal:    npm run dev
//   2. In another:         npm run gen:template-previews
//
// (Back-compat alias: `npm run generate-thumbnails` runs the same script.)
//
// This script does NOT start a dev server — it expects one already running
// on $BASE_URL (default http://localhost:3000). If the server isn't up, all
// captures will fail with a connect ECONNREFUSED error.
//
// DEPS
//   - puppeteer-core (already in devDependencies). We use a dynamic import
//     so this file type-checks even if the dep is removed in the future.
//     If you swap to the full `puppeteer` package (bundled Chromium), the
//     dynamic import handles either name with the same surface area.
//   - A locally-installed Chrome / Chromium / Edge that puppeteer-core can
//     drive. Set CHROME_PATH to the absolute executable path if the script
//     can't find one in the standard install locations on your platform.
//
// EXIT CODES
//   0  — at least one preview captured
//   1  — every capture failed (or fatal pre-flight error)
// =============================================================================

import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { cardTemplates } from "../src/config/card-templates";
import { cardTemplateSamples } from "../src/config/card-template-samples";

// ---------------------------------------------------------------------------
// Sample list — derived at runtime from the catalog so we never drift again.
// `tsx` resolves the `@/`-alias paths inside `card-template-samples.ts` via
// the project tsconfig, so importing here works as long as the script is run
// through `tsx` (see `gen:template-previews` script in package.json).
// ---------------------------------------------------------------------------

interface SampleRef {
  id: number;
  slug: string;
}

const SAMPLES: readonly SampleRef[] = cardTemplates
  .filter((t) => t.isActive && cardTemplateSamples[t.id])
  .map((t) => ({ id: t.id, slug: cardTemplateSamples[t.id].slug }));

// Surface mismatches (active templates without sample data, or vice versa)
// to stderr so a CI run flags real catalog gaps instead of silently writing
// fewer PNGs than expected.
{
  const missingSamples = cardTemplates
    .filter((t) => t.isActive && !cardTemplateSamples[t.id])
    .map((t) => t.id);
  if (missingSamples.length > 0) {
    console.error(
      `[warn] ${missingSamples.length} active templates have no sample data: ${missingSamples.join(", ")}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const VIEWPORT = { width: 540, height: 960, deviceScaleFactor: 2 };
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_DIR = join(REPO_ROOT, "public", "images", "templates");
const BASE_URL = (process.env.BASE_URL ?? "http://localhost:3000").replace(
  /\/+$/,
  "",
);
const PAGE_NAVIGATION_TIMEOUT_MS = 45_000;
// 4-way page concurrency keeps wall time under ~90s for 96 captures while
// staying well below the dev server's typical max concurrent compile load.
const CONCURRENCY = Number(process.env.PREVIEW_CONCURRENCY ?? 4);

// ---------------------------------------------------------------------------
// Chrome executable detection
// ---------------------------------------------------------------------------

/**
 * Resolve a Chrome / Chromium / Edge executable. Honours `CHROME_PATH`,
 * otherwise probes the standard install locations on Windows, macOS and
 * Linux. Returns the first existing path or `null` if nothing is found.
 *
 * `puppeteer-core` doesn't bundle Chromium — we MUST hand it an executable.
 */
function findChromeExecutable(): string | null {
  const fromEnv = process.env.CHROME_PATH;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;

  const platform = process.platform;
  const candidates: string[] = [];

  if (platform === "win32") {
    const programFiles = process.env["ProgramFiles"] ?? "C:\\Program Files";
    const programFilesX86 =
      process.env["ProgramFiles(x86)"] ?? "C:\\Program Files (x86)";
    const localAppData =
      process.env["LOCALAPPDATA"] ??
      join(
        process.env["USERPROFILE"] ?? "C:\\Users\\Default",
        "AppData",
        "Local",
      );
    candidates.push(
      join(programFiles, "Google", "Chrome", "Application", "chrome.exe"),
      join(programFilesX86, "Google", "Chrome", "Application", "chrome.exe"),
      join(localAppData, "Google", "Chrome", "Application", "chrome.exe"),
      join(programFiles, "Microsoft", "Edge", "Application", "msedge.exe"),
      join(programFilesX86, "Microsoft", "Edge", "Application", "msedge.exe"),
      join(programFiles, "Chromium", "Application", "chrome.exe"),
    );
  } else if (platform === "darwin") {
    candidates.push(
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    );
  } else {
    candidates.push(
      "/usr/bin/google-chrome",
      "/usr/bin/google-chrome-stable",
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
      "/snap/bin/chromium",
      "/usr/bin/microsoft-edge",
    );
  }

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface FailureRecord {
  id: number;
  slug: string;
  error: string;
}

async function main() {
  // 1. Ensure the output directory exists.
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // 2. Resolve a Chrome we can drive. puppeteer-core is unconfigured by
  //    default — without an executablePath it throws a confusing error.
  const executablePath = findChromeExecutable();
  if (!executablePath) {
    console.error(
      "[fatal] Could not find a Chrome / Chromium / Edge executable.",
    );
    console.error(
      "        Set CHROME_PATH to the absolute path of chrome.exe / google-chrome.",
    );
    process.exit(1);
  }
  console.log(`Using Chrome at: ${executablePath}`);
  console.log(`Base URL:        ${BASE_URL}`);
  console.log(`Output dir:      ${OUTPUT_DIR}`);

  // 3. Dynamic import of puppeteer-core so this file type-checks even if
  //    the dep is missing or renamed. The fallback to `puppeteer` (bundled
  //    Chromium) is also dynamic so TS doesn't try to statically resolve
  //    the module — the fallback path is only taken at runtime.
  //    NOTE: if neither is installed, run `npm install --save-dev puppeteer-core`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let puppeteer: any;
  try {
    puppeteer = await import("puppeteer-core");
  } catch {
    try {
      // String-based specifier dodges TS module resolution — `puppeteer`
      // (the bundled-Chromium package) is intentionally not in deps.
      const fallbackName = "puppeteer";
      puppeteer = await import(/* @vite-ignore */ /* webpackIgnore: true */ fallbackName);
    } catch (err) {
      console.error(
        "[fatal] Neither `puppeteer-core` nor `puppeteer` is installed.",
      );
      console.error("        Run: npm install --save-dev puppeteer-core");
      console.error(`        Underlying error: ${(err as Error).message}`);
      process.exit(1);
    }
  }

  // 4. Launch headless Chrome.
  const browser = await puppeteer.default.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const successes: SampleRef[] = [];
  const failures: FailureRecord[] = [];
  const total = SAMPLES.length;
  let completed = 0;

  // Lightweight semaphore via a worker pool — no extra dep. Each worker
  // pulls the next sample off `queue` and runs a single capture; when the
  // queue drains, the worker resolves. Errors per-capture are logged and
  // never rethrown so one broken sample can't take down the whole run.
  const queue = SAMPLES.slice();

  async function captureOne(ref: SampleRef): Promise<void> {
    const { id, slug } = ref;
    const filename = `card-${String(id).padStart(2, "0")}.png`;
    const outputPath = join(OUTPUT_DIR, filename);
    const route = `${BASE_URL}/dev/template-preview/${slug}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const page: any = await browser.newPage();
    try {
      await page.setViewport(VIEWPORT);

      // `networkidle0` waits for in-flight requests to settle. Combined
      // with `document.fonts.ready` below, this gives next/font enough
      // headroom to swap in real glyphs before we capture.
      await page.goto(route, {
        waitUntil: "networkidle0",
        timeout: PAGE_NAVIGATION_TIMEOUT_MS,
      });

      await page.evaluate(async () => {
        if (typeof document !== "undefined" && document.fonts?.ready) {
          await document.fonts.ready;
        }
      });
      await new Promise((r) => setTimeout(r, 250));

      await page.screenshot({
        path: outputPath,
        type: "png",
        clip: {
          x: 0,
          y: 0,
          width: VIEWPORT.width,
          height: VIEWPORT.height,
        },
      });

      successes.push({ id, slug });
      completed += 1;
      console.log(`[${completed}/${total}] ${slug} -> ${filename} ok`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      failures.push({ id, slug, error: message });
      completed += 1;
      // Log to stderr so CI can grep for failures without losing the
      // per-capture detail; we deliberately don't rethrow.
      console.error(
        `[${completed}/${total}] ${slug} -> ${filename} FAILED: ${message}`,
      );
    } finally {
      await page.close().catch(() => {
        /* page may already be closed */
      });
    }
  }

  async function worker(): Promise<void> {
    while (true) {
      const next = queue.shift();
      if (!next) return;
      await captureOne(next);
    }
  }

  try {
    const workerCount = Math.max(1, Math.min(CONCURRENCY, total));
    console.log(`Capturing ${total} previews with concurrency=${workerCount}.`);
    const workers = Array.from({ length: workerCount }, () => worker());
    await Promise.all(workers);
  } finally {
    await browser.close().catch(() => {
      /* browser may already be closed */
    });
  }

  // Summary.
  console.log("");
  console.log("=== SUMMARY ===");
  console.log(
    `Total: ${successes.length} ok, ${failures.length} failed, ${
      successes.length + failures.length
    } attempted.`,
  );
  if (failures.length > 0) {
    console.log("Failed:");
    console.table(failures);
  }

  process.exit(successes.length === 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
