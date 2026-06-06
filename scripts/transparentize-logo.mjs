import { createCanvas, loadImage } from "@napi-rs/canvas";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const sources = [
  { in: "public/icons/logo with name dark.png", out: "public/icons/logo-with-name-transparent.png", targetH: 96 },
  { in: "public/icons/logo dark.png", out: "public/icons/logo-icon-transparent.png", targetH: 96 },
];

for (const src of sources) {
  const img = await loadImage(path.join(root, src.in));
  // Scale down so final asset is small (footer = ~32px on screen; render at 96px for retina).
  const scale = src.targetH / img.height;
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const cv = createCanvas(w, h);
  const ctx = cv.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);
  const id = ctx.getImageData(0, 0, w, h);
  const d = id.data;
  // For each pixel: alpha = brightness (so near-black = transparent, copper = opaque).
  // Use max(R,G,B) as luminance proxy; preserve color, just kill black background.
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    const lum = Math.max(r, g, b);
    if (lum < 20) {
      d[i + 3] = 0;
    } else if (lum < 60) {
      // soft edge: scale alpha
      d[i + 3] = Math.round(((lum - 20) / 40) * 255);
    }
    // else: leave alpha = 255 (opaque copper)
  }
  ctx.putImageData(id, 0, 0);
  const buf = await cv.encode("png");
  fs.writeFileSync(path.join(root, src.out), buf);
  console.log(`${src.out}  ${w}x${h}  ${(buf.length / 1024).toFixed(1)} KB`);
}
