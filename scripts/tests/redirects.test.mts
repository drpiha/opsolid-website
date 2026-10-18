import assert from "node:assert/strict";
import test from "node:test";
import * as mod from "../../src/lib/redirects.ts";
const getRetiredRedirectTarget: (p: string) => string | null = (mod as any).getRetiredRedirectTarget ?? (mod as any).default.getRetiredRedirectTarget;

const AGENT_PAGES = ["voice-agent", "whatsapp-agent", "chatbot-agent", "email-agent", "booking-agent", "lead-qualifier-agent", "chatbot", "lead-qualifier", "digital-reception"];

test("removed single-agent product pages 301 to /agents, automation to /prozessautomatisierung", () => {
  for (const s of AGENT_PAGES) {
    assert.equal(getRetiredRedirectTarget(`/products/${s}`), "/agents");
    assert.equal(getRetiredRedirectTarget(`/products/${s}/`), "/agents");
    // the route folders are gone, so deeper links land there too
    assert.equal(getRetiredRedirectTarget(`/products/${s}/demo`), "/agents");
  }
  assert.equal(getRetiredRedirectTarget("/products/custom-automation"), "/prozessautomatisierung");
  // prefix matching must not catch a sibling slug
  assert.equal(getRetiredRedirectTarget("/products/voice-agents"), null);
});

test("legacy card entry points go to /opso, exact only", () => {
  for (const p of ["/card/new", "/signup", "/products/digital-card"]) {
    assert.equal(getRetiredRedirectTarget(p), "/opso");
  }
});

test("about page and legacy product hub land on the current pages", () => {
  assert.equal(getRetiredRedirectTarget("/ueber-mich"), "/ueber-uns");
  assert.equal(getRetiredRedirectTarget("/about"), "/ueber-uns");
  assert.equal(getRetiredRedirectTarget("/products"), "/leistungen");
  assert.equal(getRetiredRedirectTarget("/products/"), "/leistungen");
  assert.equal(getRetiredRedirectTarget("/products/kutasia"), "/websites");
  assert.equal(getRetiredRedirectTarget("/solutions"), "/leistungen");
  // the OpSo flow under /products/digital-card/* keeps working
  assert.equal(getRetiredRedirectTarget("/products/digital-card/thanks"), null);
  assert.equal(getRetiredRedirectTarget("/products/digital-card/gallery"), null);
});

test("working routes are never redirected", () => {
  for (const p of [
    "/card/edit/abc", "/card/manage/abc", "/card/new/step", "/products/digital-card/thanks",
    "/c/slug", "/login", "/dashboard/cards", "/opso", "/ki-schulungen", "/ueber-uns", "/websites", "/agents",
  ]) {
    assert.equal(getRetiredRedirectTarget(p), null, p);
  }
});

// --- locale routing for locale-less URLs: language follows COUNTRY, never Accept-Language ---
import * as routing from "../../src/lib/locale-routing.ts";
const resolveLocale: typeof import("../../src/lib/locale-routing.ts").resolveLocale =
  (routing as any).resolveLocale ?? (routing as any).default.resolveLocale;

function inputs(opts: { headers?: Record<string, string>; cookie?: string; lookup?: Record<string, string | null>; calls?: string[] }) {
  const headers = Object.fromEntries(Object.entries(opts.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v]));
  return {
    cookie: opts.cookie,
    header: (name: string) => headers[name.toLowerCase()] ?? null,
    lookupCountry: async (ip: string) => {
      opts.calls?.push(ip);
      return opts.lookup?.[ip] ?? null;
    },
  };
}

test("upstream geo header: TR → tr, DACH → de, other countries → en", async () => {
  const cases: Array<[string, string]> = [["TR", "tr"], ["DE", "de"], ["AT", "de"], ["CH", "de"], ["LI", "de"], ["US", "en"], ["FR", "en"], ["GB", "en"]];
  for (const [country, expected] of cases) {
    const r = await resolveLocale(inputs({ headers: { "x-vercel-ip-country": country } }));
    assert.equal(r.locale, expected, country);
    assert.equal(r.source, "geo-header");
  }
  assert.equal((await resolveLocale(inputs({ headers: { "cf-ipcountry": "tr" } }))).locale, "tr");
  assert.equal((await resolveLocale(inputs({ headers: { "x-country-code": "AT" } }))).locale, "de");
});

test("in-app lookup (over the client IP) is used when no geo header is present", async () => {
  const calls: string[] = [];
  const lookup = { "1.1.1.1": "TR", "2.2.2.2": "DE", "3.3.3.3": "US" };
  const tr = await resolveLocale(inputs({ headers: { "x-forwarded-for": "1.1.1.1, 10.0.0.1" }, lookup, calls }));
  assert.deepEqual([tr.locale, tr.source, tr.country], ["tr", "geo-ip", "TR"]);
  const de = await resolveLocale(inputs({ headers: { "x-real-ip": "2.2.2.2" }, lookup, calls }));
  assert.equal(de.locale, "de");
  const us = await resolveLocale(inputs({ headers: { "x-forwarded-for": "3.3.3.3" }, lookup, calls }));
  assert.equal(us.locale, "en");
  assert.deepEqual(calls, ["1.1.1.1", "2.2.2.2", "3.3.3.3"]);
});

test("country unknown (no header, no IP, lookup miss or failure, bogus header) → de", async () => {
  assert.equal((await resolveLocale(inputs({}))).locale, "de");
  assert.equal((await resolveLocale(inputs({ headers: { "x-forwarded-for": "9.9.9.9" }, lookup: { "9.9.9.9": null } }))).locale, "de");
  const failing = { cookie: undefined, header: (n: string) => (n === "x-forwarded-for" ? "9.9.9.9" : null), lookupCountry: async () => { throw new Error("geo down"); } };
  assert.equal((await resolveLocale(failing as never)).locale, "de");
  for (const bogus of ["XX", "T1", "", "Germany", "D"]) {
    const r = await resolveLocale(inputs({ headers: { "cf-ipcountry": bogus } }));
    assert.equal(r.locale, "de", bogus);
    assert.equal(r.source, "default");
  }
});

test("the explicit cookie beats the country", async () => {
  assert.equal((await resolveLocale(inputs({ cookie: "en", headers: { "x-vercel-ip-country": "DE" } }))).locale, "en");
  assert.equal((await resolveLocale(inputs({ cookie: "tr", headers: { "x-vercel-ip-country": "US" } }))).locale, "tr");
  assert.equal((await resolveLocale(inputs({ cookie: "de", headers: { "x-vercel-ip-country": "TR" } }))).source, "cookie");
  // an unknown cookie value is ignored
  assert.equal((await resolveLocale(inputs({ cookie: "xx", headers: { "x-vercel-ip-country": "TR" } }))).locale, "tr");
});

test("Accept-Language is never consulted: Turkish browser in Germany → de, Turkish browser with no country → de", async () => {
  const headers = { "accept-language": "tr-TR,tr;q=0.9,en;q=0.5", "x-vercel-ip-country": "DE" };
  assert.equal((await resolveLocale(inputs({ headers }))).locale, "de");
  assert.equal((await resolveLocale(inputs({ headers: { "accept-language": "tr-TR,tr;q=0.9" } }))).locale, "de");
  assert.equal((await resolveLocale(inputs({ headers: { "accept-language": "en-US", "x-vercel-ip-country": "TR" } }))).locale, "tr");
});

test("geo lookup timeout, network error, non-200 or bad payload → country unknown → de", async () => {
  const lookupCountryViaApi: typeof import("../../src/lib/locale-routing.ts").lookupCountryViaApi =
    (routing as any).lookupCountryViaApi ?? (routing as any).default.lookupCountryViaApi;
  // A lookup that never answers on its own: only the abort signal ends it.
  const hanging = (_url: string, init: { signal: AbortSignal }) =>
    new Promise<Response>((_resolve, reject) => init.signal.addEventListener("abort", () => reject(new Error("aborted"))));
  // AbortSignal.timeout uses an unref'd timer; keep the loop alive the way a running server does.
  const keepAlive = setTimeout(() => {}, 5000);
  const started = Date.now();
  const r = await resolveLocale({
    cookie: undefined,
    header: (n: string) => (n === "x-forwarded-for" ? "5.6.7.8" : null),
    lookupCountry: (ip: string) => lookupCountryViaApi(`http://127.0.0.1:3000/api/geo?ip=${ip}`, 50, hanging),
  });
  assert.equal(r.locale, "de");
  assert.equal(r.source, "default");
  assert.ok(Date.now() - started < 1000, "timeout must cut the lookup short");
  // other failure modes
  const json = (status: number, body: unknown) => async () => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
  assert.equal(await lookupCountryViaApi("u", 50, json(500, { country: "TR" })), null);
  assert.equal(await lookupCountryViaApi("u", 50, json(200, { country: "Turkey" })), null);
  assert.equal(await lookupCountryViaApi("u", 50, async () => { throw new Error("ECONNREFUSED"); }), null);
  assert.equal(await lookupCountryViaApi("u", 50, async () => new Response("not json", { status: 200 })), null);
  // and the happy path normalises the code
  assert.equal(await lookupCountryViaApi("u", 50, json(200, { country: "tr" })), "TR");
  clearTimeout(keepAlive);
});
