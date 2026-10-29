import assert from "node:assert/strict";
import test from "node:test";
import * as mod from "../../src/lib/v7-routes.ts";
import * as v4mod from "../../src/lib/v4.ts";

const R: typeof import("../../src/lib/v7-routes.ts") = (mod as any).PAGE_KEYS ? (mod as any) : (mod as any).default;
const V4: typeof import("../../src/lib/v4.ts") = (v4mod as any).isV4Path ? (v4mod as any) : (v4mod as any).default;

test("href: German home is the domain root, other homes carry the locale", () => {
  assert.equal(R.href("home", "de"), "/");
  assert.equal(R.href("home", "en"), "/en");
  assert.equal(R.href("home", "tr"), "/tr");
  assert.equal(R.href("beratung", "de"), "/de/ki-beratung");
  assert.equal(R.href("beratung", "en"), "/en/ai-automation-consulting");
  assert.equal(R.href("schulungen", "tr"), "/tr/yapay-zeka-egitimleri");
  assert.equal(R.href("ueber", "en"), "/en/about");
  assert.equal(R.href("prozess", "de", { hash: "interne-tools" }), "/de/ki-beratung/prozessautomatisierung#interne-tools");
  assert.equal(R.href("blog", "en", { sub: "/my-post" }), "/en/blog/my-post");
  assert.equal(R.href("home", "de", { sub: "/x" }), "/de/x");
});

test("absUrl and alternates use public URLs, x-default is German", () => {
  assert.equal(R.absUrl("home", "de"), "https://opsolid.de/");
  assert.equal(R.absUrl("home", "en"), "https://opsolid.de/en");
  assert.equal(R.absUrl("check", "tr"), "https://opsolid.de/tr/yapay-zeka-danismanligi/yz-kontrolu");
  const alt = R.alternates("copilot");
  assert.deepEqual(alt, {
    de: "https://opsolid.de/de/ki-schulungen/copilot-praxistag",
    en: "https://opsolid.de/en/ai-training/copilot-workshop",
    tr: "https://opsolid.de/tr/yapay-zeka-egitimleri/copilot-uygulama-gunu",
    "x-default": "https://opsolid.de/de/ki-schulungen/copilot-praxistag",
  });
  assert.equal(R.alternates("home")["x-default"], "https://opsolid.de/");
  assert.equal(R.alternates("blog", "/post").tr, "https://opsolid.de/tr/blog/post");
});

test("slugs are unique per locale and the German slug is the route folder", () => {
  for (const l of R.L3_LOCALES) {
    const slugs = R.PAGE_KEYS.map((k) => R.SLUG[k][l]);
    assert.equal(new Set(slugs).size, slugs.length, `duplicate slug in ${l}`);
  }
  for (const k of R.PAGE_KEYS) assert.equal(R.SLUG[k].de, R.ROUTE[k], k);
});

test("publicToInternal: EN/TR slugs rewrite to the German route folder, own folders pass", () => {
  assert.equal(R.publicToInternal("en", "/ai-automation-consulting"), "/ki-beratung");
  assert.equal(R.publicToInternal("en", "/ai-automation-consulting/"), "/ki-beratung");
  assert.equal(R.publicToInternal("tr", "/yapay-zeka-danismanligi/yz-kontrolu"), "/ki-beratung/ki-check");
  assert.equal(R.publicToInternal("en", "/about"), "/ueber-uns");
  assert.equal(R.publicToInternal("tr", "/iletisim"), "/contact");
  assert.equal(R.publicToInternal("en", "/projects"), "/projekte");
  // same slug in every locale → no rewrite
  assert.equal(R.publicToInternal("en", "/opso"), null);
  assert.equal(R.publicToInternal("en", "/blog"), null);
  assert.equal(R.publicToInternal("en", "/contact"), null);
  assert.equal(R.publicToInternal("de", "/ki-beratung"), null);
  // children of identical slugs and unknown paths pass through
  assert.equal(R.publicToInternal("en", "/blog/post"), null);
  assert.equal(R.publicToInternal("en", "/opso/account"), null);
  assert.equal(R.publicToInternal("en", "/dashboard"), null);
  assert.equal(R.publicToInternal("en", "/"), null);
});

test("foreignSlugTarget: another locale's slug or the German folder 301s to the own slug", () => {
  assert.equal(R.foreignSlugTarget("en", "/ki-beratung"), "/ai-automation-consulting");
  assert.equal(R.foreignSlugTarget("tr", "/ai-training"), "/yapay-zeka-egitimleri");
  assert.equal(R.foreignSlugTarget("de", "/about"), "/ueber-uns");
  assert.equal(R.foreignSlugTarget("tr", "/contact"), "/iletisim");
  assert.equal(R.foreignSlugTarget("de", "/iletisim"), "/contact");
  assert.equal(R.foreignSlugTarget("en", "/ueber-uns"), "/about");
  assert.equal(R.foreignSlugTarget("en", "/ki-beratung/ki-check/"), "/ai-automation-consulting/ai-check");
  // own slugs, shared slugs, unknown paths and the home do not redirect
  assert.equal(R.foreignSlugTarget("en", "/ai-automation-consulting"), null);
  assert.equal(R.foreignSlugTarget("en", "/about"), null);
  assert.equal(R.foreignSlugTarget("en", "/opso"), null);
  assert.equal(R.foreignSlugTarget("en", "/blog"), null);
  assert.equal(R.foreignSlugTarget("en", "/dashboard"), null);
  assert.equal(R.foreignSlugTarget("en", "/ki-beratung/unknown"), null);
  assert.equal(R.foreignSlugTarget("en", "/"), null);
});

test("every rewrite/redirect pair is stable: foreign → own slug → internal route", () => {
  for (const key of R.PAGE_KEYS) {
    for (const l of R.L3_LOCALES) {
      const own = R.SLUG[key][l];
      assert.equal(R.foreignSlugTarget(l, own), null, `${key}/${l} own slug must not redirect`);
      const internal = R.publicToInternal(l, own);
      if (own !== R.ROUTE[key]) assert.equal(internal, R.ROUTE[key] || "/", `${key}/${l}`);
      for (const other of R.L3_LOCALES) {
        const foreign = R.SLUG[key][other];
        if (foreign === own || foreign === "") continue;
        // a foreign slug may legitimately equal another page's own slug only if unique per locale (checked above)
        const target = R.foreignSlugTarget(l, foreign);
        if (target !== null) assert.equal(target, own || "/", `${key}: ${other}→${l}`);
      }
    }
  }
});

test("internalToPublic: internal German paths become the locale's public path", () => {
  assert.equal(R.internalToPublic("en", "/ki-beratung"), "/ai-automation-consulting");
  assert.equal(R.internalToPublic("tr", "/ueber-uns"), "/hakkimizda");
  assert.equal(R.internalToPublic("de", "/projekte"), "/projekte");
  assert.equal(R.internalToPublic("en", "/ki-beratung/prozessautomatisierung#interne-tools"), "/ai-automation-consulting/process-automation#interne-tools");
  assert.equal(R.internalToPublic("en", "/"), "/");
  assert.equal(R.internalToPublic("en", "/something-else"), "/something-else");
});

test("withLocalePrefix: redirect target paths", () => {
  assert.equal(R.withLocalePrefix("de", ""), "/");
  assert.equal(R.withLocalePrefix("de", "/"), "/");
  assert.equal(R.withLocalePrefix("en", "/"), "/en");
  assert.equal(R.withLocalePrefix("tr", "/iletisim"), "/tr/iletisim");
  assert.equal(R.withLocalePrefix("de", "/ki-beratung/"), "/de/ki-beratung");
});

test("keyForPublicPath: the page behind the browser path, children keep their sub path", () => {
  assert.deepEqual(R.keyForPublicPath("/"), { key: "home", locale: "de", sub: "" });
  assert.deepEqual(R.keyForPublicPath("/en"), { key: "home", locale: "en", sub: "" });
  assert.deepEqual(R.keyForPublicPath("/tr/"), { key: "home", locale: "tr", sub: "" });
  assert.deepEqual(R.keyForPublicPath("/en/ai-training"), { key: "schulungen", locale: "en", sub: "" });
  assert.deepEqual(R.keyForPublicPath("/en/ai-training/ai-literacy"), { key: "kompetenz", locale: "en", sub: "" });
  assert.deepEqual(R.keyForPublicPath("/tr/blog/some-post"), { key: "blog", locale: "tr", sub: "/some-post" });
  assert.deepEqual(R.keyForPublicPath("/de/ki-beratung/ki-check"), { key: "check", locale: "de", sub: "" });
  assert.deepEqual(R.keyForPublicPath("/en/about?x=1"), { key: "ueber", locale: "en", sub: "" });
  assert.equal(R.keyForPublicPath("/en/dashboard"), null);
  assert.equal(R.keyForPublicPath("/fr/ki-beratung"), null);
  // a German slug under another locale is not that locale's page
  assert.equal(R.keyForPublicPath("/en/ki-beratung"), null);
});

test("isV4Path knows every public marketing first segment and still excludes app surfaces", () => {
  const marketing = [
    "/", "/de", "/en", "/de/ki-beratung", "/en/ai-automation-consulting/ai-check", "/tr/yapay-zeka-danismanligi",
    "/en/ai-training", "/tr/yapay-zeka-egitimleri", "/en/projects", "/tr/projeler", "/en/about", "/tr/hakkimizda",
    "/tr/iletisim", "/de/projekte", "/de/ueber-uns", "/en/contact", "/en/blog/x", "/de/impressum", "/en/opso",
    "/en/no-such-page",
  ];
  for (const p of marketing) assert.equal(V4.isV4Path(p), true, p);
  for (const p of ["/de/dashboard", "/en/login", "/tr/onboarding", "/en/card/edit/x", "/de/discover", "/en/products/digital-card/thanks", "/es/dashboard"]) {
    assert.equal(V4.isV4Path(p), false, p);
  }
  // every public page path of every locale is a marketing path
  for (const k of R.PAGE_KEYS) for (const l of R.L3_LOCALES) assert.equal(V4.isV4Path(R.href(k, l)), true, `${k}/${l}`);
});

test("every opsolid.de page URL in llms.txt is a current public URL", async () => {
  const { readFileSync } = await import("node:fs");
  const txt = readFileSync(new URL("../../public/llms.txt", import.meta.url), "utf8");
  const valid = new Set<string>();
  for (const k of R.PAGE_KEYS) for (const l of R.L3_LOCALES) valid.add(R.absUrl(k, l));
  const urls = (txt.match(/https:\/\/opsolid\.de[^\s)\]>,]*/g) ?? []).map((u) => u.replace(/[.;]+$/, ""));
  const pageUrls = urls.map((u) => (u === "https://opsolid.de" ? "https://opsolid.de/" : u)).filter((u) => !/\.(txt|xml|png|jpg|svg|ico)$/.test(u) && !/\/blog\/./.test(u));
  assert.ok(pageUrls.length > 10);
  for (const u of pageUrls) assert.ok(valid.has(u), `llms.txt links a URL that is not a public page: ${u}`);
});
