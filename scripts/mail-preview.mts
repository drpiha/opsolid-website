// Preview of the automatic acknowledgement mail: writes .shots/mail/ack-<locale>[-text-brand].html and PNGs
// at a desktop and a phone width. The embedded logo (cid:) is shown through a data URI, as a mail client
// would show the embedded image.
// usage: node --import tsx scripts/mail-preview.mts
// Needs playwright-core and a Chromium headless shell, like scripts/site-capture.mjs (PLAYWRIGHT_CORE).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as mod from "../src/lib/contact-ack.ts";

// tsx exposes the CommonJS namespace here, as in the .mts tests.
const { buildAck } = ((mod as { default?: unknown }).default ?? mod) as typeof import("../src/lib/contact-ack.ts");

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, "..", ".shots", "mail");
fs.mkdirSync(out, { recursive: true });
const PW =
  process.env.PLAYWRIGHT_CORE ||
  path.join(process.env.HOME!, "Documents/Codex/Projects/Project_VERSO-opso-card/tools/opso-card/node_modules/playwright-core/index.mjs");
const { chromium } = await import(PW);
const cache = path.join(process.env.HOME!, "Library/Caches/ms-playwright");
const shell = fs.readdirSync(cache).filter((d) => d.startsWith("chromium_headless_shell-")).sort().pop()!;
const browser = await chromium.launch({ executablePath: path.join(cache, shell, "chrome-headless-shell-mac-arm64/chrome-headless-shell") });

for (const locale of ["de", "en", "tr"] as const) {
  const mail = buildAck("applicant@example.test", `v7-contact-${locale}`);
  const logo = mail.inlineImages[0];
  const variants = {
    [`ack-${locale}`]: mail.html.replace(`cid:${logo.cid}`, `data:${logo.contentType};base64,${logo.contentBase64}`),
    [`ack-${locale}-text-brand`]: mail.htmlWithoutInlineImages,
  };
  fs.writeFileSync(path.join(out, `ack-${locale}.txt`), `Subject: ${mail.subject}\n\n${mail.text}\n`);
  for (const [name, html] of Object.entries(variants)) {
    fs.writeFileSync(path.join(out, `${name}.html`), html);
    for (const [label, width, height] of [["desktop", 1280, 800], ["mobile", 390, 780]] as const) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
      await page.setContent(html, { waitUntil: "load" });
      await page.screenshot({ path: path.join(out, `${name}-${label}.png`), fullPage: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 0) console.log(`${name} ${label}: horizontal overflow ${overflow}px`);
      await page.close();
    }
  }
}
await browser.close();
console.log(`written to ${out}`);
