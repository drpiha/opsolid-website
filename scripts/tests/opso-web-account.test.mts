import assert from "node:assert/strict";
import test from "node:test";
import { createCipheriv, createHmac, randomBytes, randomUUID } from "node:crypto";
import { createRequire } from "node:module";
const { createOpsoWebGateway, OPSO_API } = createRequire(import.meta.url)("../../src/lib/opso-web/gateway.ts");
const { anonymousSession, sealSession, openSession, sessionKey, csrfMatches, readSessionCookie, OPSO_COOKIE } = createRequire(import.meta.url)("../../src/lib/opso-web/session.ts");
const { appendedClientIp, canonicalClientIp, authClientIpHeaders } = createRequire(import.meta.url)("../../src/lib/opso-web/auth-ip-proof.ts");
const origin = "https://opsolid.de";
const user = { id: "user-a", email: "owner@example.com", name: "Alex", workspaceId: "workspace-a" };
const profile = { name: "Alex Example", role: "Consultant", company: "Example", email: "hello@example.com", phone: "", location: "Berlin" };
const privacy = { discoverable: false, indexable: false, showEmail: true, showPhone: false };
const card = { id: "card-a", workspaceId: user.workspaceId, ownerId: user.id, slug: "alex-example", status: "draft", visibility: "public", publishedVisibility: "public", updatedAt: "2026-09-17T10:00:00.000Z", draftRevision: 2, publishedRevision: 0, discoverable: false, indexable: false, templateId: "tpl-consultant", content: JSON.stringify({ ...profile, defaultLocale: "de", enabledLocales: ["de"], showEmail: true, showPhone: false, bio: "Keep this biography" }), passwordHash: "internal-field-must-not-leak" };
const draft = { id: card.id, expectedRevision: 2, cardLocale: "de", profile, privacy, visibility: "public" };
const terms = { accepted: false, version: "2026-08-20", documentUrl: "https://untrusted.example/redirect" };
type Call = { path: string; method: string; body: Record<string, unknown>; authorization: string | null };
function fixture(override?: (call: Call) => Response | Promise<Response> | undefined) {
  const key = randomBytes(32); const proofSecret = randomBytes(32); const access = randomUUID(); const refresh = randomUUID(); const calls: Call[] = [];
  const fetcher = async (input: string, init: RequestInit) => {
    assert.ok(input.startsWith(`${OPSO_API}/`)); assert.equal(init.redirect, "error");
    const headers = new Headers(init.headers); assert.equal(headers.has("x-forwarded-for"), false);
    if (input.startsWith(`${OPSO_API}/auth/`)) {
      assert.equal(headers.get("x-opso-bff-client-ip"), "203.0.113.19");
      const exact = createHmac("sha256", proofSecret).update(JSON.stringify(["opso-web-client-ip", 1, "opsolid-web", "verso-auth", "POST", `/api${input.slice(OPSO_API.length)}`, "203.0.113.19", headers.get("x-opso-bff-timestamp")])).digest("hex");
      assert.equal(headers.get("x-opso-bff-signature"), `v1=${exact}`);
    }
    else assert.equal(headers.has("x-opso-bff-signature"), false);
    const call = { path: input.slice(OPSO_API.length), method: init.method ?? "GET", body: init.body ? JSON.parse(String(init.body)) : {}, authorization: headers.get("authorization") }; calls.push(call);
    const custom = await override?.(call); if (custom) return custom;
    if (call.path === "/auth/passwordless/start") return Response.json({ ok: true });
    if (call.path === "/auth/passwordless/verify" || call.path === "/auth/passwordless/refresh") return Response.json({ access, refresh, user });
    if (call.path === "/auth/logout") return Response.json({ ok: true });
    if (call.path === "/cards") return Response.json({ items: [card] });
    if (call.path === "/templates") return Response.json({ items: [{ id: "tpl-consultant", name: "Consultant", canCreate: true, website: false }, { id: "tpl-profile", name: "Website", canCreate: true, website: true }] });
    if (call.path === "/safety/terms-acceptance") return Response.json({ ...terms, accepted: call.method === "POST" });
    if (call.path === "/users/me/onboarding") return Response.json({ ok: true, cardId: card.id, draftRevision: 2 });
    if (call.path.startsWith(`/cards/${card.id}/preview`)) return Response.json({ displayName: profile.name, email: profile.email, phone: "private", showEmail: true, showPhone: false, secret: "do-not-project" });
    if (call.path === `/cards/${card.id}/publish`) return Response.json({ ...card, status: "live", publishedRevision: 2 });
    if (call.path === `/cards/${card.id}`) return Response.json({ ...card, draftRevision: call.method === "PATCH" ? 3 : 2 });
    return Response.json({ error: "not_found" }, { status: 404 });
  };
  const handle = createOpsoWebGateway({ key, clientIpSecret: proofSecret, browserOrigin: origin, fetch: fetcher });
  let cookie = ""; let csrf = "";
  async function send(action: string, body?: unknown, options: { origin?: string; csrf?: string; cookie?: string; method?: string } = {}) {
    const response = await handle(new Request(`${origin}/api/opso/${action}`, { method: options.method ?? (body === undefined ? "GET" : "POST"), headers: { "x-forwarded-for": "203.0.113.19", cookie: options.cookie ?? cookie, origin: options.origin ?? origin, "content-type": "application/json", "x-opso-csrf": options.csrf ?? csrf }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) }), action);
    const setCookie = response.headers.get("set-cookie"); if (setCookie) cookie = setCookie.split(";")[0];
    const data = await response.json(); if (data.csrf) csrf = data.csrf;
    return { response, data, cookie, csrf };
  }
  async function login() { await send("session"); await send("start", { email: " Owner@Example.com " }); return send("verify", { code: String(Math.floor(100000 + Math.random() * 900000)) }); }
  function authCookie() { const session = { ...anonymousSession(Date.now()), auth: { access: randomUUID(), refresh: randomUUID(), user } }; return { csrf: session.csrf, cookie: `${OPSO_COOKIE}=${sealSession(session, key)}` }; }
  return { key, access, refresh, calls, send, login, authCookie, handle };
}

test("encrypted cookie is authenticated, secure, bounded and rejects malformed CSRF", () => {
  const key = randomBytes(32); const session = anonymousSession(Date.now()); const sealed = sealSession(session, key);
  assert.deepEqual(openSession(sealed, key, Date.now()), session);
  assert.equal(openSession(sealed, randomBytes(32), Date.now()), null);
  assert.equal(openSession(sealed.slice(0, -2) + "xx", key, Date.now()), null);
  assert.equal(openSession(sealed, key, session.expires), null);
  assert.equal(sessionKey(key.toString("base64"))?.length, 32); assert.equal(sessionKey("invalid"), null);
  assert.equal(csrfMatches("é".repeat(43), session.csrf), false);
});

test("OTP binds normalized challenged identity and exposes no upstream credentials", async () => {
  const f = fixture(); const result = await f.login();
  assert.equal(result.response.status, 200); assert.equal(result.data.user.email, user.email);
  assert.match(result.response.headers.get("set-cookie")!, /Secure; HttpOnly; SameSite=Strict/);
  const output = JSON.stringify(result.data) + result.cookie; assert.ok(!output.includes(f.access)); assert.ok(!output.includes(f.refresh));
  assert.deepEqual(f.calls.find((call) => call.path.endsWith("/start"))?.body, { email: user.email });
  assert.equal(f.calls.find((call) => call.path.endsWith("/verify"))?.body.email, user.email);
  const listing = await f.send("cards"); assert.equal(listing.data.items[0].profile.name, profile.name);
  assert.ok(!JSON.stringify(listing.data).includes("passwordHash")); assert.ok(!JSON.stringify(listing.data).includes("ownerId"));
});

test("wrong identity cannot establish a session", async () => {
  const f = fixture((call) => call.path.endsWith("/verify") ? Response.json({ access: randomUUID(), refresh: randomUUID(), user: { ...user, email: "other@example.com" } }) : undefined);
  const result = await f.login(); assert.equal(result.response.status, 502);
  assert.equal((await f.send("cards")).response.status, 401);
});

test("mutation needs exact same Origin and session-bound CSRF; no arbitrary action or user override", async () => {
  const f = fixture(); await f.send("session"); const before = f.calls.length;
  assert.equal((await f.send("start", { email: user.email }, { origin: "https://evil.example" })).response.status, 403);
  assert.equal((await f.send("start", { email: user.email }, { csrf: "bad" })).response.status, 403);
  assert.equal((await f.send("start", { email: user.email, workspaceId: "other" })).response.status, 400);
  assert.equal((await f.send("https://evil.example", {})).response.status, 404);
  assert.equal(f.calls.length, before);
});

test("wrong workspace from any owner response fails closed", async () => {
  const f = fixture((call) => call.path === "/cards" ? Response.json({ items: [{ ...card, workspaceId: "other-workspace" }] }) : undefined);
  await f.login(); const result = await f.send("cards"); assert.equal(result.response.status, 502); assert.equal(result.data.items, undefined);
});

test("one rotating refresh serves concurrent stale-cookie requests and retries only once", async () => {
  let initialAccess = ""; let refreshCount = 0;
  const f = fixture((call) => {
    if (call.path === "/auth/passwordless/refresh") { refreshCount++; return undefined; }
    if (call.path === "/cards" && call.authorization === initialAccess) return Response.json({}, { status: 401 });
    return undefined;
  });
  const session = f.authCookie(); initialAccess = `Bearer ${openSession(session.cookie.split("=")[1], f.key, Date.now())!.auth.access}`;
  const results = await Promise.all([f.send("cards", undefined, session), f.send("cards", undefined, session)]);
  assert.equal(refreshCount, 1); assert.ok(results.every((result) => result.response.status === 200));
});

test("refresh identity mismatch clears session; temporary outage preserves it", async () => {
  for (const status of [200, 503]) {
    const f = fixture((call) => call.path.endsWith("/refresh") ? status === 503 ? Response.json({}, { status }) : Response.json({ access: randomUUID(), refresh: randomUUID(), user: { ...user, workspaceId: "other" } }) : undefined);
    const result = await f.send("refresh", {}, f.authCookie());
    assert.equal(result.response.status, status === 200 ? 401 : 503);
    assert.equal(Boolean(result.response.headers.get("set-cookie")?.includes("Max-Age=0")), status === 200);
  }
});

test("logout revokes canonical session using server-held credentials and clears browser", async () => {
  const f = fixture(); await f.login(); const result = await f.send("logout", {});
  assert.equal(result.data.revoked, true); assert.match(result.response.headers.get("set-cookie")!, /Max-Age=0/);
  assert.deepEqual(f.calls.find((call) => call.path === "/auth/logout")?.body, { access: f.access, refresh: f.refresh });
});

test("create uses canonical onboarding and rejects browser identity/resume fields", async () => {
  const f = fixture(); await f.login(); const input = { cardLocale: "de", goal: "personal_brand", profile, privacy, templateId: "tpl-consultant", slug: card.slug };
  assert.equal((await f.send("create", { ...input, workspaceId: "other" })).response.status, 400);
  assert.equal((await f.send("create", { ...input, resumeCardId: card.id })).response.status, 400);
  assert.equal((await f.send("create", { ...input, templateId: "tpl-profile" })).response.status, 400);
  const result = await f.send("create", input); assert.equal(result.response.status, 200);
  assert.deepEqual(f.calls.find((call) => call.path === "/users/me/onboarding")?.body, input);
});

test("free-card limits and revision conflicts are preserved without retries or overwrite", async () => {
  const f = fixture((call) => call.path === "/users/me/onboarding" ? Response.json({ error: "card_limit", limit: 1, current: 1 }, { status: 409 }) : call.method === "PATCH" ? Response.json({ error: "draft_revision_conflict", actualRevision: 3 }, { status: 409 }) : undefined);
  await f.login(); const create = await f.send("create", { cardLocale: "de", goal: "personal_brand", profile, privacy, templateId: "tpl-consultant", slug: card.slug });
  assert.equal(create.response.status, 409); assert.equal(create.data.error, "card_limit");
  assert.equal(create.data.limit, 1); assert.equal(create.data.current, 1);
  const save = await f.send("save", draft); assert.equal(save.response.status, 409); assert.equal(save.data.error, "draft_revision_conflict");
  assert.equal(save.data.actualRevision, 3);
  const patches = f.calls.filter((call) => call.method === "PATCH"); assert.equal(patches.length, 1); assert.equal(patches[0].body.expectedRevision, 2);
  assert.equal((patches[0].body.content as Record<string, unknown>).bio, undefined);
});

test("preview projects only public profile values and never persists or publishes", async () => {
  const f = fixture(); await f.login(); const result = await f.send("preview", draft);
  assert.equal(result.data.preview.name, profile.name); assert.equal(result.data.preview.phone, ""); assert.equal(result.data.preview.secret, undefined);
  assert.equal(f.calls.filter((call) => call.method === "PATCH" || call.path.endsWith("/publish")).length, 0);
});

test("terms have a trusted URL and require explicit versioned acceptance before publish", async () => {
  const f = fixture((call) => call.path.endsWith("/publish") ? Response.json({ code: "terms_acceptance_required" }, { status: 403 }) : undefined);
  await f.login(); const current = await f.send("terms"); assert.equal(current.data.documentUrl, "https://card.opsolid.de/legal/ugc-terms-community-rules/2026-08-20.txt");
  assert.equal((await f.send("publish", { id: card.id, expectedRevision: 2 })).data.error, "terms_acceptance_required");
  assert.equal(f.calls.filter((call) => call.path.endsWith("terms-acceptance") && call.method === "POST").length, 0);
  assert.equal((await f.send("accept-terms", { version: terms.version, language: "de", accepted: false })).response.status, 400);
  assert.equal((await f.send("accept-terms", { version: terms.version, language: "de", accepted: true })).response.status, 200);
});

test("OTP request rate limit remains enforced even when upstream permits every request", async () => {
  const f = fixture(); await f.send("session");
  for (let i = 0; i < 5; i++) assert.equal((await f.send("start", { email: user.email })).response.status, 200);
  assert.equal((await f.send("start", { email: user.email })).response.status, 429);
  assert.equal(f.calls.filter((call) => call.path.endsWith("/start")).length, 5);
});

test("deep malformed, future and duplicate sessions cannot authenticate", () => {
  const key = randomBytes(32); const session = anonymousSession(Date.now());
  const rawSeal = (payload: unknown) => {
    const nonce = randomBytes(12); const cipher = createCipheriv("aes-256-gcm", key, nonce); cipher.setAAD(Buffer.from(`${OPSO_COOKIE}:v1`));
    const bytes = Buffer.concat([cipher.update(JSON.stringify(payload)), cipher.final()]); return Buffer.concat([nonce, cipher.getAuthTag(), bytes]).toString("base64url");
  };
  assert.equal(openSession(rawSeal({ ...session, auth: { access: {}, refresh: 1, user: { email: user.email } } }), key, Date.now()), null);
  assert.equal(openSession(rawSeal({ ...session, challenge: { email: "bad", expires: session.expires } }), key, Date.now()), null);
  assert.equal(openSession(rawSeal({ ...session, expires: Date.now() + 2 * 86400_000 }), key, Date.now()), null);
  assert.equal(openSession(rawSeal({ ...session, extra: true }), key, Date.now()), null);
  assert.throws(() => sealSession(session, randomBytes(16))); assert.equal(openSession(rawSeal(session), randomBytes(16), Date.now()), null);
  assert.equal(readSessionCookie(new Request(origin, { headers: { cookie: `${OPSO_COOKIE}=a; ${OPSO_COOKIE}=b` } })), null);
});

test("oversized auth response fails in a controlled way without storing a broken session", async () => {
  const f = fixture((call) => call.path.endsWith("/verify") ? Response.json({ access: "a".repeat(1800), refresh: "b".repeat(1800), user }) : undefined);
  const result = await f.login(); assert.equal(result.response.status, 502); assert.equal(result.data.error, "invalid_upstream_response");
  assert.equal((await f.send("cards")).response.status, 401);
});

test("session serialization failure returns a bounded error and clears the cookie", async () => {
  const handle = createOpsoWebGateway({ key: randomBytes(16), clientIpSecret: randomBytes(32), browserOrigin: origin, fetch: () => { throw new Error("must not reach upstream"); } });
  const result = await handle(new Request(`${origin}/api/opso/session`, { headers: { origin, "x-forwarded-for": "203.0.113.19" } }), "session");
  assert.equal(result.status, 500); assert.deepEqual(await result.json(), { error: "request_failed" });
  assert.match(result.headers.get("set-cookie")!, /Max-Age=0/);
});

test("missing Origin, GET mutation, oversized body and non-JSON input cannot reach upstream", async () => {
  const f = fixture(); const session = await f.send("session");
  const headers = { "x-forwarded-for": "203.0.113.19", cookie: session.cookie, "x-opso-csrf": session.csrf, "content-type": "application/json" };
  let result = await f.handle(new Request(`${origin}/api/opso/start`, { method: "POST", headers, body: JSON.stringify({ email: user.email }) }), "start"); assert.equal(result.status, 403);
  result = await f.handle(new Request(`${origin}/api/opso/start`, { headers }), "start"); assert.equal(result.status, 404);
  result = await f.handle(new Request(`${origin}/api/opso/start`, { method: "POST", headers: { ...headers, origin }, body: JSON.stringify({ email: "x".repeat(17_000) }) }), "start"); assert.equal(result.status, 413);
  result = await f.handle(new Request(`${origin}/api/opso/start`, { method: "POST", headers: { ...headers, origin, "content-type": "text/plain" }, body: "{}" }), "start"); assert.equal(result.status, 415);
  assert.equal(f.calls.length, 0);
});

test("a stalled request body times out even after delivering valid JSON", async () => {
  const f = fixture(); const session = await f.send("session");
  const request = new Request(`${origin}/api/opso/start`, { method: "POST", headers: { "x-forwarded-for": "203.0.113.19", cookie: session.cookie, "x-opso-csrf": session.csrf, "content-type": "application/json", origin }, body: new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode(JSON.stringify({ email: user.email }))); } }), duplex: "half" } as RequestInit);
  const result = await f.handle(request, "start"); assert.equal(result.status, 408); assert.equal(f.calls.length, 0);
});

test("malformed or oversized upstream owner responses fail closed", async () => {
  for (const row of [{ ...card, slug: "javascript:bad" }, { ...card, slug: "ab" }, { ...card, status: "unexpected" }, { ...card, draftRevision: -1 }, { ...card, publishedRevision: "0" }, { ...card, updatedAt: "nonsense" }]) {
    const f = fixture((call) => call.path === "/cards" ? Response.json({ items: [row] }) : undefined);
    await f.login(); assert.equal((await f.send("cards")).response.status, 502);
  }
  const f = fixture((call) => call.path === "/cards" ? Response.json({ items: [], excess: "x".repeat(2 * 1024 * 1024) }) : undefined);
  await f.login(); assert.equal((await f.send("cards")).response.status, 502);
});

test("live publish status creates a real share link, private snapshot does not", async () => {
  const f = fixture(); await f.login(); const published = await f.send("publish", { id: card.id, expectedRevision: 2 });
  assert.equal(published.data.card.status, "published"); assert.equal(published.data.card.url, `https://opso.cc/${card.slug}`);
  const privateFixture = fixture((call) => call.path === "/cards" ? Response.json({ items: [{ ...card, status: "live", publishedVisibility: "private" }] }) : undefined);
  await privateFixture.login(); assert.equal((await privateFixture.send("cards")).data.items[0].url, null);
});

test("readiness and terms errors retain bounded recovery details without arbitrary fields", async () => {
  const f = fixture((call) => call.path.endsWith("/publish") ? Response.json({ error: "page_blocks_not_ready", blocks: [{ id: "faq-a", kind: "faq", missing: "content", pageSlug: "help", password: "must-not-leak" }], trace: "must-not-leak" }, { status: 400 }) : undefined);
  await f.login(); const result = await f.send("publish", { id: card.id, expectedRevision: 2 });
  assert.deepEqual(result.data.blocks, [{ id: "faq-a", kind: "faq", missing: "content", pageSlug: "help" }]); assert.equal(result.data.trace, undefined);
  const t = fixture((call) => call.path.endsWith("/publish") ? Response.json({ code: "terms_acceptance_required", version: terms.version, documentUrl: "javascript:bad" }, { status: 403 }) : undefined);
  await t.login(); const current = await t.send("publish", { id: card.id, expectedRevision: 2 });
  assert.equal(current.data.version, terms.version); assert.match(current.data.documentUrl, /^https:\/\/card\.opsolid\.de\/legal\//);
});

test("upstream unauthorized retry is bounded and final rejection clears the cookie", async () => {
  const f = fixture((call) => call.path === "/cards" ? Response.json({}, { status: 401 }) : undefined);
  const result = await f.send("cards", undefined, f.authCookie());
  assert.equal(result.response.status, 401); assert.match(result.response.headers.get("set-cookie")!, /Max-Age=0/);
  assert.equal(f.calls.filter((call) => call.path === "/cards").length, 2); assert.equal(f.calls.filter((call) => call.path.endsWith("/refresh")).length, 1);
});

test("runtime route remains unavailable without explicit enablement and a valid encryption key", async () => {
  const previousEnabled = process.env.OPSO_WEB_ENABLED; const previousKey = process.env.OPSO_WEB_SESSION_KEY;
  const previousProofKey = process.env.OPSO_WEB_CLIENT_IP_SECRET; const previousProxy = process.env.OPSO_WEB_TRUSTED_PROXY;
  try {
    delete process.env.OPSO_WEB_ENABLED; delete process.env.OPSO_WEB_SESSION_KEY;
    const route = createRequire(import.meta.url)("../../src/app/api/opso/[action]/route.ts");
    let result = await route.GET(new Request(`${origin}/api/opso/session`), { params: { action: "session" } }); assert.equal(result.status, 503);
    process.env.OPSO_WEB_ENABLED = "true"; process.env.OPSO_WEB_SESSION_KEY = "invalid";
    result = await route.GET(new Request(`${origin}/api/opso/session`), { params: { action: "session" } }); assert.equal(result.status, 503);
    process.env.OPSO_WEB_SESSION_KEY = randomBytes(32).toString("base64"); process.env.OPSO_WEB_CLIENT_IP_SECRET = randomBytes(32).toString("base64"); delete process.env.OPSO_WEB_TRUSTED_PROXY;
    result = await route.GET(new Request(`${origin}/api/opso/session`), { params: { action: "session" } }); assert.equal(result.status, 503);
  } finally {
    if (previousEnabled === undefined) delete process.env.OPSO_WEB_ENABLED; else process.env.OPSO_WEB_ENABLED = previousEnabled;
    if (previousKey === undefined) delete process.env.OPSO_WEB_SESSION_KEY; else process.env.OPSO_WEB_SESSION_KEY = previousKey;
    if (previousProofKey === undefined) delete process.env.OPSO_WEB_CLIENT_IP_SECRET; else process.env.OPSO_WEB_CLIENT_IP_SECRET = previousProofKey;
    if (previousProxy === undefined) delete process.env.OPSO_WEB_TRUSTED_PROXY; else process.env.OPSO_WEB_TRUSTED_PROXY = previousProxy;
  }
});

test("DE EN TR account copy preserves exact key parity", () => {
  const { getOpsoAccountCopy } = createRequire(import.meta.url)("../../src/content/opso-account.ts");
  const keys = Object.keys(getOpsoAccountCopy("en")).sort();
  for (const locale of ["de", "tr"]) assert.deepEqual(Object.keys(getOpsoAccountCopy(locale)).sort(), keys);
});

test("BFF IP proof exactly binds issuer audience method path IP timestamp and is auth-only", () => {
  const key = randomBytes(32); const ip = "203.0.113.19"; const now = 1_789_632_000_000;
  const paths = ["/api/auth/passwordless/start", "/api/auth/passwordless/verify", "/api/auth/passwordless/refresh", "/api/auth/logout"];
  for (const path of paths) {
    const headers = authClientIpHeaders(key, ip, "POST", path, now);
    const timestamp = String(Math.floor(now / 1000));
    const expected = createHmac("sha256", key).update(JSON.stringify(["opso-web-client-ip", 1, "opsolid-web", "verso-auth", "POST", path, ip, timestamp])).digest("hex");
    assert.deepEqual(headers, { "x-opso-bff-client-ip": ip, "x-opso-bff-timestamp": timestamp, "x-opso-bff-signature": `v1=${expected}` });
  }
  for (const path of ["/api/cards", "/api/auth/google", "/api/auth/passwordless/start?x=1", "https://evil.example/api/auth/logout"]) assert.deepEqual(authClientIpHeaders(key, ip, "POST", path, now), {});
  assert.deepEqual(authClientIpHeaders(key, ip, "GET", paths[0], now), {});
  assert.throws(() => authClientIpHeaders(randomBytes(16), ip, "POST", paths[0], now));
});

test("only the bounded rightmost proxy-appended address is used, never a spoofed left/alternate header", () => {
  assert.equal(appendedClientIp(new Headers({ "x-forwarded-for": "attacker, 192.0.2.55, 203.0.113.19", "x-real-ip": "198.51.100.7", "cf-connecting-ip": "198.51.100.8" })), "203.0.113.19");
  assert.equal(appendedClientIp(new Headers({ "x-real-ip": "203.0.113.19" })), null);
  for (const raw of ["", "203.0.113.19,", "203.0.113.19:5000", "[2001:db8::1]", "fe80::1%eth0", Array(33).fill("203.0.113.19").join(","), "x".repeat(2049)]) assert.equal(appendedClientIp(new Headers({ "x-forwarded-for": raw })), null);
  assert.equal(canonicalClientIp(" 203.0.113.19"), null); assert.equal(canonicalClientIp("203.000.113.19"), null);
  assert.equal(canonicalClientIp("2001:0DB8:0:0:0:0:0:1"), "2001:db8::1");
  assert.equal(appendedClientIp(new Headers({ "x-forwarded-for": "203.0.113.19, 2001:0DB8:0:0:0:0:0:1" })), "2001:db8::1");
});

test("missing trusted ingress and reused encryption/proof keys fail closed before upstream", async () => {
  const f = fixture(); const response = await f.handle(new Request(`${origin}/api/opso/session`, { headers: { origin, "x-real-ip": "203.0.113.19" } }), "session");
  assert.equal(response.status, 503); assert.equal(f.calls.length, 0);
  const key = randomBytes(32); const handle = createOpsoWebGateway({ key, clientIpSecret: key, browserOrigin: origin, fetch: () => { throw new Error("must not reach upstream"); } });
  const disabled = await handle(new Request(`${origin}/api/opso/session`, { headers: { origin, "x-forwarded-for": "203.0.113.19" } }), "session"); assert.equal(disabled.status, 503);
});

test("caller-supplied BFF proof headers are discarded and overwritten by a fresh server proof", async () => {
  const f = fixture(); const session = f.authCookie();
  const response = await f.handle(new Request(`${origin}/api/opso/refresh`, { method: "POST", headers: { origin, cookie: session.cookie, "x-opso-csrf": session.csrf, "content-type": "application/json", "x-forwarded-for": "198.51.100.21, 203.0.113.19", "x-opso-bff-client-ip": "198.51.100.21", "x-opso-bff-timestamp": "1", "x-opso-bff-signature": "v1=forged" }, body: "{}" }), "refresh");
  assert.equal(response.status, 200); assert.equal(f.calls.filter((call) => call.path.endsWith("/refresh")).length, 1);
});
