/**
 * generate-favicons.ts — render the OpSolid brand mark at the favicon sizes
 * the site needs. The mark is the same one the header paints purely in CSS
 * (`.os-brand-mark` in src/styles/opsolid-site.css): a copper-gradient
 * rounded square with a dark inset square and a subtle top-left highlight.
 *
 * Run: `npx tsx scripts/generate-favicons.ts`
 *
 * Outputs:
 *   public/icons/favicon-16.png
 *   public/icons/favicon-32.png
 *   public/icons/apple-touch-icon-180.png
 *   public/icons/icon-512.png
 *   public/icons/icon-512-maskable.png
 *   public/site.webmanifest
 *   src/app/icon.svg                (canonical vector master)
 *
 * Re-run any time the in-site mark changes.
 */

import { createCanvas, type SKRSContext2D } from "@napi-rs/canvas";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const PROJECT_ROOT = resolve(__dirname, "..");
const PUBLIC_ICONS = resolve(PROJECT_ROOT, "public/icons");
const PUBLIC_DIR = resolve(PROJECT_ROOT, "public");
const APP_DIR = resolve(PROJECT_ROOT, "src/app");

// --- Mark parameters (mirror .os-brand-mark CSS) -------------------------
const COPPER_STOPS: [number, string][] = [
  [0.0, "#E9B989"],
  [0.42, "#C27940"],
  [1.0, "#7E4A24"],
];
const INNER_FILL = "#1A0E04";
const HIGHLIGHT = "rgba(255,255,255,0.55)";

function roundedRect(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/**
 * Paint the mark inside the rectangle (x, y, size).
 * The "maskable" flavor keeps the mark inside a 20% safe area and fills
 * the rest with the dominant copper so launchers can crop without
 * cutting the mark.
 */
function paintMark(
  ctx: SKRSContext2D,
  size: number,
  options: { maskable?: boolean } = {}
) {
  const { maskable = false } = options;

  if (maskable) {
    // Solid copper background fills the safe-area buffer.
    ctx.fillStyle = "#C27940";
    ctx.fillRect(0, 0, size, size);
  }

  const safeInset = maskable ? size * 0.16 : 0;
  const drawX = safeInset;
  const drawY = safeInset;
  const drawSize = size - safeInset * 2;

  // 1. Outer copper-gradient rounded square.
  const radius = drawSize * 0.25;
  ctx.save();
  roundedRect(ctx, drawX, drawY, drawSize, drawSize, radius);
  ctx.clip();
  const grad = ctx.createLinearGradient(
    drawX,
    drawY,
    drawX + drawSize,
    drawY + drawSize
  );
  for (const [stop, color] of COPPER_STOPS) grad.addColorStop(stop, color);
  ctx.fillStyle = grad;
  ctx.fillRect(drawX, drawY, drawSize, drawSize);

  // 2. Inset rim — bright top edge, dark bottom edge (subtle on small sizes).
  const rimWidth = Math.max(1, Math.round(drawSize * 0.012));
  ctx.fillStyle = "rgba(255,245,225,0.55)";
  ctx.fillRect(drawX, drawY, drawSize, rimWidth);
  ctx.fillStyle = "rgba(0,0,0,0.30)";
  ctx.fillRect(drawX, drawY + drawSize - rimWidth, drawSize, rimWidth);
  ctx.restore();

  // 3. Inner dark square. CSS uses `inset: 6px` on a 24px mark → 25% inset.
  const innerInset = drawSize * 0.25;
  const innerSize = drawSize * 0.5;
  const innerX = drawX + innerInset;
  const innerY = drawY + innerInset;
  const innerRadius = drawSize * 0.085;

  ctx.save();
  roundedRect(ctx, innerX, innerY, innerSize, innerSize, innerRadius);
  ctx.clip();
  ctx.fillStyle = INNER_FILL;
  ctx.fillRect(innerX, innerY, innerSize, innerSize);

  // Radial highlight at 35% / 30% inside the inner square.
  const hx = innerX + innerSize * 0.35;
  const hy = innerY + innerSize * 0.3;
  const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, innerSize * 0.55);
  hg.addColorStop(0, HIGHLIGHT);
  hg.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = hg;
  ctx.fillRect(innerX, innerY, innerSize, innerSize);

  // Hairline border on the inner square — gives the mark its "screen" feel.
  ctx.lineWidth = Math.max(1, Math.round(drawSize * 0.008));
  ctx.strokeStyle = "rgba(0,0,0,0.4)";
  ctx.stroke();
  ctx.restore();
}

function renderPng(
  size: number,
  outputPath: string,
  options: { maskable?: boolean } = {}
) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  paintMark(ctx, size, options);
  const buffer = canvas.toBuffer("image/png");
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, buffer);
  return outputPath;
}

// --- SVG master ----------------------------------------------------------
function renderSvgMaster() {
  // Single 32-unit viewBox so the SVG matches .os-brand-mark proportions.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" role="img" aria-label="OpSolid">
  <defs>
    <linearGradient id="copper" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#E9B989"/>
      <stop offset="42%" stop-color="#C27940"/>
      <stop offset="100%" stop-color="#7E4A24"/>
    </linearGradient>
    <radialGradient id="hl" cx="35%" cy="30%" r="55%">
      <stop offset="0%" stop-color="white" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="32" height="32" rx="8" fill="url(#copper)"/>
  <rect x="0" y="0" width="32" height="0.4" fill="rgba(255,245,225,0.55)"/>
  <rect x="0" y="31.6" width="32" height="0.4" fill="rgba(0,0,0,0.30)"/>
  <g>
    <rect x="8" y="8" width="16" height="16" rx="2.7" fill="#1A0E04" stroke="rgba(0,0,0,0.4)" stroke-width="0.25"/>
    <rect x="8" y="8" width="16" height="16" rx="2.7" fill="url(#hl)"/>
  </g>
</svg>
`;
  const path = resolve(APP_DIR, "icon.svg");
  writeFileSync(path, svg);
  return path;
}

// --- Web manifest --------------------------------------------------------
function writeWebManifest() {
  const manifest = {
    name: "OpSolid",
    short_name: "OpSolid",
    description:
      "Independent automation and AI consulting practice for German SMBs.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0E13",
    theme_color: "#C27940",
    icons: [
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/apple-touch-icon-180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
  const path = resolve(PUBLIC_DIR, "site.webmanifest");
  writeFileSync(path, JSON.stringify(manifest, null, 2) + "\n");
  return path;
}

// --- Driver --------------------------------------------------------------
function main() {
  mkdirSync(PUBLIC_ICONS, { recursive: true });

  const outputs = [
    renderPng(16, resolve(PUBLIC_ICONS, "favicon-16.png")),
    renderPng(32, resolve(PUBLIC_ICONS, "favicon-32.png")),
    renderPng(180, resolve(PUBLIC_ICONS, "apple-touch-icon-180.png")),
    renderPng(512, resolve(PUBLIC_ICONS, "icon-512.png")),
    renderPng(512, resolve(PUBLIC_ICONS, "icon-512-maskable.png"), {
      maskable: true,
    }),
    renderSvgMaster(),
    writeWebManifest(),
  ];

  for (const o of outputs) console.log("  wrote", o);
  console.log("\nFavicons regenerated. Wire-up lives in src/app/layout.tsx.");
}

main();
