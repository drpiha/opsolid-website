#!/usr/bin/env node
/**
 * IndexNow submission for opsolid.de. Run it by hand AFTER a deploy:
 *
 *   node scripts/indexnow.mjs https://opsolid.de            # submit
 *   node scripts/indexnow.mjs https://opsolid.de --dry-run   # only print the URL list
 *
 * Reads <base>/sitemap.xml, collects every <loc> and POSTs the list to https://api.indexnow.org/indexnow.
 * The key file lives at public/<key>.txt (served at https://opsolid.de/<key>.txt) and holds the key.
 * Only URLs on the host of the base URL are sent (a dry run lists everything, so a local server can be checked).
 */
const KEY = "3a5c73ac5d652b6c5a6d39916f225c61";
const ENDPOINT = "https://api.indexnow.org/indexnow";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const baseArg = args.find((a) => !a.startsWith("--"));
if (!baseArg) {
  console.error("Usage: node scripts/indexnow.mjs <base-url> [--dry-run]");
  process.exit(2);
}
const base = new URL(baseArg);

const sitemapRes = await fetch(new URL("/sitemap.xml", base));
if (!sitemapRes.ok) {
  console.error(`Sitemap request failed: ${sitemapRes.status}`);
  process.exit(1);
}
const xml = await sitemapRes.text();
const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)]
  .map((m) => m[1].replace(/&amp;/g, "&"))
  .filter((u) => dryRun || new URL(u).host === base.host);
const unique = [...new Set(urls)];
if (unique.length === 0) {
  console.error("No URLs found in the sitemap.");
  process.exit(1);
}
console.log(`${unique.length} URLs from ${new URL("/sitemap.xml", base).href}`);
if (dryRun) {
  console.log(unique.join("\n"));
  process.exit(0);
}

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: base.host,
    key: KEY,
    keyLocation: `${base.origin}/${KEY}.txt`,
    urlList: unique,
  }),
});
console.log(`IndexNow answered ${res.status} ${res.statusText}`);
// 200 = accepted, 202 = accepted (key validation pending); anything else is an error.
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
