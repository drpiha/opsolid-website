import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const deckDir = path.resolve(__dirname, "..", "public", "decks", "musteri-sunumu");
const srcHtml = path.join(deckDir, "index.html");
const tmpHtml = path.join(deckDir, ".pdf-build.html");

// Strip base64 data-URIs back to relative paths so Chrome can JPEG-compress
// them once instead of carrying the giant text blobs inside the PDF.
const imgMap = {
  "cover-bg.jpg": "assets/img/cover-bg.jpg",
  "sectors-bg.jpg": "assets/img/sectors-bg.jpg",
  "close-bg.jpg": "assets/img/close-bg.jpg",
};
let html = fs.readFileSync(srcHtml, "utf8");
html = html.replace(/url\('data:image\/jpeg;base64,[^']*'\)/g, (m) => {
  // We can't know which slot this is from the base64 alone, so leave alone.
  return m;
});
// Better: replace by slide order — match the inline style position.
const slots = ["cover-bg.jpg", "sectors-bg.jpg", "close-bg.jpg"];
let idx = 0;
html = html.replace(/--bg-image:url\('data:image\/jpeg;base64,[^']*'\)/g, () => {
  const file = slots[idx++] ?? slots[slots.length - 1];
  return `--bg-image:url('assets/img/${file}')`;
});
fs.writeFileSync(tmpHtml, html, "utf8");

const url = `file:///${tmpHtml.replace(/\\/g, "/")}?print-pdf`;
const out = path.join(deckDir, "opsolid-sunum-2.pdf");

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  console.log("Loading", url);
  await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 4000));
  console.log("Printing PDF to", out);
  await page.pdf({
    path: out,
    width: "1280px",
    height: "800px",
    printBackground: true,
    preferCSSPageSize: false,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  console.log("Done");
} finally {
  await browser.close();
  try { fs.unlinkSync(tmpHtml); } catch {}
}
