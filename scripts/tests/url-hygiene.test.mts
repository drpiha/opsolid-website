import assert from "node:assert/strict";
import test from "node:test";
import * as mod from "../../src/lib/url-hygiene.ts";
const M: typeof import("../../src/lib/url-hygiene.ts") = (mod as any).canonicalPathname ? (mod as any) : (mod as any).default;

const LOCALES = new Set(["de", "en", "tr", "es", "it", "fr", "ar"]);
const isLocale = (s: string) => LOCALES.has(s);

test("repeated slashes collapse and an upper-case locale prefix is lower-cased", () => {
  assert.equal(M.canonicalPathname("/en//about", isLocale), "/en/about");
  assert.equal(M.canonicalPathname("//de///ki-beratung", isLocale), "/de/ki-beratung");
  assert.equal(M.canonicalPathname("/EN/about", isLocale), "/en/about");
  assert.equal(M.canonicalPathname("/De/ki-beratung", isLocale), "/de/ki-beratung");
  assert.equal(M.canonicalPathname("/DE//ki-beratung", isLocale), "/de/ki-beratung");
});

test("clean paths, deeper segments and non-locale prefixes are left alone", () => {
  for (const p of ["/", "/en", "/de/ki-beratung", "/tr/yapay-zeka-danismanligi", "/en/About", "/de/card/edit/AbC123"]) {
    assert.equal(M.canonicalPathname(p, isLocale), null, p);
  }
  // "/Leistungen" is not a locale: the retired-route logic handles it, not the hygiene step
  assert.equal(M.canonicalPathname("/Leistungen", isLocale), null);
});

test("app folders without an index page and unknown children are dead; real app routes are not", () => {
  for (const p of ["/c", "/c/test", "/card", "/card/edit", "/card/edit/x/y", "/events", "/marketing", "/marketing/x"]) {
    assert.equal(M.isDeadAppPath(p), true, p);
  }
  for (const p of ["/c/preview", "/card/new", "/card/edit/ord_1", "/card/manage/ord_1", "/events/some-fair", "/marketing/confirm", "/marketing/unsubscribe"]) {
    assert.equal(M.isDeadAppPath(p), false, p);
  }
  // marketing pages, other app folders and the root are never touched
  for (const p of ["/", "/ki-beratung", "/card-preview", "/opso", "/dashboard", "/discover", "/contact"]) {
    assert.equal(M.isDeadAppPath(p), false, p);
  }
});
