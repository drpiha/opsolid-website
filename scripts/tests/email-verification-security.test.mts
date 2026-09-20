import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { build } from "esbuild";
const { authenticationIsCurrent, verifiedAuthenticationTime, verifyEmailOwnership } = createRequire(import.meta.url)("../../src/lib/auth/email-verification.ts");

const userId = "synthetic-owner";
const provedAt = new Date("2026-01-01T12:00:00.500Z");
const oldAt = new Date(provedAt.getTime() - 1);
const freshAt = new Date(provedAt.getTime() + 1);
const user = { id: userId, email: "owner@example.test", emailVerifiedAt: provedAt };

const bundles = new Map<string, Promise<string>>();
async function harness(entry: string, prisma: unknown, claims = { userId, authenticatedAt: oldAt.getTime() }, extras: Record<string, unknown> = {}) {
  let bundle = bundles.get(entry);
  if (!bundle) {
    bundle = build({ entryPoints: [entry], bundle: true, platform: "node", format: "cjs", write: false,
      external: ["next/server", "next/headers", "next/navigation", "react", "react/jsx-runtime"], logLevel: "silent",
      plugins: [{ name: "synthetic-auth-store", setup(b) {
        b.onResolve({ filter: /^@\/lib\/prisma$/ }, () => ({ path: "prisma", namespace: "mock" }));
        b.onResolve({ filter: /(?:^@\/lib\/auth\/jwt$|^\.\/jwt$)/ }, () => ({ path: "jwt", namespace: "mock" }));
        b.onResolve({ filter: /^@\/lib\/auth\/password$/ }, () => ({ path: "password", namespace: "mock" }));
        b.onResolve({ filter: /^@\/lib\/email\/client$/ }, () => ({ path: "email", namespace: "mock" }));
        b.onResolve({ filter: /^@\/lib\/marketing\/consent$/ }, () => ({ path: "marketing", namespace: "mock" }));
        b.onLoad({ filter: /.*/, namespace: "mock" }, (arg) => ({ contents: arg.path === "prisma"
          ? "export const prisma = globalThis.testPrisma;"
          : arg.path === "password" ? "export const verifyPassword = (...args) => globalThis.testVerifyPassword(...args); export const hashPassword = async () => 'synthetic';"
          : arg.path === "email" ? "export const sendEmail = (...args) => globalThis.testSendEmail(...args);"
          : arg.path === "marketing" ? "export const fireMarketingOptIn = async () => { throw new Error('Unexpected marketing side effect'); };"
          : "export const verifyAccessToken = async () => globalThis.testClaims; export const signAccessToken = async (id, at) => JSON.stringify({ id, at });" }));
      } }],
    }).then((r) => r.outputFiles[0].text);
    bundles.set(entry, bundle);
  }
  const module = { exports: {} as Record<string, (...args: any[]) => any> };
  runInNewContext(await bundle, { module, exports: module.exports, require: createRequire(import.meta.url),
    Buffer, TextEncoder, TextDecoder, URL, URLSearchParams, Request, Response, Headers, Date, setTimeout, clearTimeout,
    process: { env: { NODE_ENV: "test", NEXT_PUBLIC_SITE_URL: "https://opsolid.example", GOOGLE_CLIENT_ID: "synthetic-client", GOOGLE_CLIENT_SECRET: "synthetic-only" } },
    console: { log() {}, warn() {}, error() {} }, testPrisma: prisma, testClaims: claims, ...extras });
  return module.exports;
}

test("first proof clears preregistered password and revokes sessions; repeat proof preserves verified credentials", async () => {
  const record = { ...user, emailVerifiedAt: null as Date | null, passwordHash: "untrusted-preregistration" as string | null };
  let revocations = 0;
  const tx = { user: {
    updateMany: async ({ where, data }: any) => {
      assert.equal(where.emailVerifiedAt, null);
      if (record.emailVerifiedAt) return { count: 0 };
      Object.assign(record, data); return { count: 1 };
    },
    findUnique: async () => record,
  }, session: { updateMany: async ({ where }: any) => {
    assert.equal(where.userId, userId); assert.equal(where.revokedAt, null); revocations += 1; return { count: 2 };
  } } };
  await verifyEmailOwnership(tx as any, userId);
  assert.ok(record.emailVerifiedAt); assert.equal(record.passwordHash, null); assert.equal(revocations, 1);
  record.passwordHash = "trusted-password-created-after-proof";
  await verifyEmailOwnership(tx as any, userId);
  assert.equal(record.passwordHash, "trusted-password-created-after-proof"); assert.equal(revocations, 1);
});

test("timestamp boundary rejects pre-proof credentials including equal millisecond and legacy JWT second", () => {
  assert.equal(authenticationIsCurrent(oldAt, provedAt), false);
  assert.equal(authenticationIsCurrent(provedAt, provedAt), false);
  assert.equal(authenticationIsCurrent(Math.floor(provedAt.getTime() / 1000) * 1000, provedAt), false);
  assert.equal(authenticationIsCurrent(freshAt, provedAt), true);
  assert.equal(authenticationIsCurrent(oldAt, null), true);
  assert.equal(authenticationIsCurrent(NaN, null), false);
  assert.equal(authenticationIsCurrent(verifiedAuthenticationTime(new Date()), new Date(0)), true);
});

test("both actual bearer guards reject pre-proof JWT and accept current proof", async () => {
  for (const [entry, method] of [["src/lib/auth/require-user.ts", "requireUser"], ["src/lib/api/v1/bearer-only.ts", "requireBearerUser"]]) {
    const prisma = { user: { findUnique: async () => user } };
    const req = new Request("https://opsolid.example/api/cards/claimable", { headers: { authorization: "Bearer synthetic" } });
    const old = await harness(entry, prisma);
    await assert.rejects(() => old[method](req), /session_invalid/);
    const fresh = await harness(entry, prisma, { userId, authenticatedAt: freshAt.getTime() });
    assert.equal((await fresh[method](req)).id, userId);
  }
});

test("a session created late from old proof is denied by actual cookie and refresh paths", async () => {
  const record = { id: "session-old", userId, createdAt: oldAt, user, revokedAt: null, expiresAt: new Date(Date.now() + 60000), tokenHash: "" };
  const source = await harness("src/lib/auth/session.ts", { session: { findUnique: async () => record } });
  record.tokenHash = source.hashRefreshToken("synthetic");
  assert.equal(await source.getSessionUser("synthetic"), null);
  assert.equal(await source.rotateSession("synthetic"), null);
});

test("refresh racing verification retains original proof time and cannot mint an elevated credential", async () => {
  const initialUser = { ...user, emailVerifiedAt: null as Date | null };
  const record = { id: "session-old", userId, createdAt: oldAt, user: initialUser, revokedAt: null, expiresAt: new Date(Date.now() + 60000), tokenHash: "" };
  let created: any;
  const prisma = { session: { findUnique: async () => record }, $transaction: async (fn: any) => {
    // Simulate proof committing after the initial refresh read.
    initialUser.emailVerifiedAt = provedAt;
    return fn({ session: { updateMany: async () => ({ count: 1 }), create: async ({ data }: any) => { created = data; return { id: "session-new" }; } } });
  } };
  const source = await harness("src/lib/auth/session.ts", prisma);
  record.tokenHash = source.hashRefreshToken("synthetic");
  const rotated = await source.rotateSession("synthetic");
  assert.equal(created.createdAt.getTime(), oldAt.getTime());
  assert.equal(rotated.authenticatedAt.getTime(), oldAt.getTime());
  assert.equal(authenticationIsCurrent(rotated.authenticatedAt, provedAt), false);
});

test("claim endpoints deny an unverified email before any card query even with a forged body email", async () => {
  let cardCalls = 0;
  const prisma = { user: { findUnique: async () => ({ ...user, emailVerifiedAt: null }) }, cardOrder: {
    findUnique: async () => { cardCalls++; throw new Error("must not read"); },
    findMany: async () => { cardCalls++; throw new Error("must not read"); },
  } };
  const get = await harness("src/app/api/cards/claimable/route.ts", prisma);
  const post = await harness("src/app/api/account/cards/[id]/claim/route.ts", prisma);
  const headers = { authorization: "Bearer synthetic", "content-type": "application/json" };
  assert.equal((await get.GET(new Request("https://opsolid.example/api/cards/claimable", { headers }))).status, 403);
  assert.equal((await post.POST(new Request("https://opsolid.example/api/account/cards/card-1/claim", { method: "POST", headers, body: JSON.stringify({ email: user.email, emailVerifiedAt: new Date() }) }), { params: Promise.resolve({ id: "card-1" }) })).status, 403);
  assert.equal(cardCalls, 0);
});

test("actual claim route binds checked contact email and rejects a concurrent contact change", async () => {
  const card = { id: "card-1", userId: null, contactEmail: user.email, contactName: "Synthetic Owner", status: "active", slug: "synthetic" };
  let where: any;
  const prisma = { user: { findUnique: async () => user }, cardOrder: {
    findUnique: async (args: any) => args.select.contactEmail ? { ...card } : { userId: null },
    updateMany: async (args: any) => { where = args.where; card.contactEmail = "other@example.test"; return { count: 0 }; },
  } };
  const source = await harness("src/app/api/account/cards/[id]/claim/route.ts", prisma, { userId, authenticatedAt: freshAt.getTime() });
  const result = await source.POST(new Request("https://opsolid.example/api/account/cards/card-1/claim", { method: "POST", headers: { authorization: "Bearer synthetic" } }), { params: Promise.resolve({ id: card.id }) });
  assert.equal(where.contactEmail, user.email); assert.equal(where.userId, null); assert.equal(result.status, 403);
});

test("Google v1 rejects unverified provider email before identity/session mutations", async () => {
  let writes = 0;
  const source = await harness("src/app/api/v1/auth/google/route.ts", { user: { findUnique: async () => { writes++; throw new Error("must not query"); } } }, undefined,
    { fetch: async () => Response.json({ aud: "synthetic-client", email: user.email, email_verified: "false" }) });
  const result = await source.POST(new Request("https://opsolid.example/api/v1/auth/google", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ idToken: "synthetic-id-token" }) }));
  assert.equal(result.status, 403); assert.equal(writes, 0);
});

test("password login in flight before verification cannot elevate its newly written session or JWT", async () => {
  for (const entry of ["src/app/api/auth/login/route.ts", "src/app/api/v1/auth/login/route.ts"]) {
    const record = { ...user, emailVerifiedAt: null as Date | null, passwordHash: "synthetic-preregistration" as string | null };
    let sessionData: any;
    const source = await harness(entry, { user: { findUnique: async () => ({ ...record }) }, session: {
      create: async ({ data }: any) => { sessionData = data; return { id: "late-session" }; },
    } }, undefined, { testVerifyPassword: async () => {
      record.emailVerifiedAt = new Date(); record.passwordHash = null;
      return true; // Slow password verification began before the proof commit.
    } });
    const response = await source.POST(new Request("https://opsolid.example/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: user.email, password: "synthetic-only" }) }));
    assert.equal(response.status, 200);
    const token = JSON.parse((await response.json()).accessToken);
    assert.equal(authenticationIsCurrent(sessionData.createdAt, record.emailVerifiedAt), false);
    assert.equal(authenticationIsCurrent(new Date(token.at), record.emailVerifiedAt), false);
  }
});

test("unverified password snapshot stays pre-verification when proof timestamp predates its transaction commit", async () => {
  for (const entry of ["src/app/api/auth/login/route.ts", "src/app/api/v1/auth/login/route.ts"]) {
    // The verifier allocated this timestamp, but its transaction is still
    // uncommitted. Login observes the old password and unverified row later.
    const verificationAllocatedAt = new Date(Date.now() - 1000);
    const record = { ...user, emailVerifiedAt: null as Date | null, passwordHash: "synthetic-preregistration" as string | null };
    let sessionData: any;
    const source = await harness(entry, { user: { findUnique: async () => ({ ...record }) }, session: {
      create: async ({ data }: any) => { sessionData = data; return { id: "commit-window-session" }; },
    } }, undefined, { testVerifyPassword: async () => {
      // The first proof commits while this in-flight login checks its snapshot.
      record.emailVerifiedAt = verificationAllocatedAt; record.passwordHash = null;
      return true;
    } });
    const response = await source.POST(new Request("https://opsolid.example/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: user.email, password: "synthetic-only" }) }));
    assert.equal(response.status, 200);
    const token = JSON.parse((await response.json()).accessToken);
    assert.equal(sessionData.createdAt.getTime(), 0);
    assert.equal(new Date(token.at).getTime(), 0);
    assert.equal(authenticationIsCurrent(sessionData.createdAt, record.emailVerifiedAt), false);
    assert.equal(authenticationIsCurrent(new Date(token.at), record.emailVerifiedAt), false);
    assert.equal(authenticationIsCurrent(sessionData.createdAt, null), true);
  }
});

test("a previously verified owner's cookie session and normal rotation continue working", async () => {
  const record = { id: "trusted-session", userId, createdAt: freshAt, user, revokedAt: null, expiresAt: new Date(Date.now() + 60000), tokenHash: "" };
  let created: any;
  const prisma = { session: { findUnique: async () => record }, $transaction: async (fn: any) => fn({ session: {
    updateMany: async () => ({ count: 1 }), create: async ({ data }: any) => { created = data; return { id: "rotated" }; },
  } }) };
  const source = await harness("src/lib/auth/session.ts", prisma);
  record.tokenHash = source.hashRefreshToken("synthetic");
  assert.equal((await source.getSessionUser("synthetic")).id, userId);
  assert.equal((await source.rotateSession("synthetic")).authenticatedAt.getTime(), freshAt.getTime());
  assert.equal(created.createdAt.getTime(), freshAt.getTime());
});

test("valid Google proof upgrades atomically, clears old credentials, and mints current proof", async () => {
  const record = { ...user, emailVerifiedAt: null as Date | null, passwordHash: "untrusted" as string | null, image: null };
  let revoked = 0;
  let issued: any;
  const tx = { user: {
    updateMany: async ({ data }: any) => { Object.assign(record, data); return { count: 1 }; },
    findUnique: async () => ({ ...record }),
  }, session: { updateMany: async () => { revoked++; return { count: 1 }; } } };
  const prisma = { user: { findUnique: async () => ({ ...record }) }, $transaction: async (fn: any) => fn(tx), session: {
    create: async ({ data }: any) => { issued = data; return { id: "owner-session" }; },
  } };
  const source = await harness("src/app/api/v1/auth/google/route.ts", prisma, undefined,
    { fetch: async () => Response.json({ aud: "synthetic-client", email: user.email, email_verified: "true" }) });
  const response = await source.POST(new Request("https://opsolid.example/api/v1/auth/google", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ idToken: "synthetic-id-token" }) }));
  assert.equal(response.status, 200); assert.equal(record.passwordHash, null); assert.equal(revoked, 1);
  assert.equal(authenticationIsCurrent(issued.createdAt, record.emailVerifiedAt), true);
  assert.equal(authenticationIsCurrent(new Date(JSON.parse((await response.json()).accessToken).at), record.emailVerifiedAt), true);
});

test("actual magic-link consume invalidates preregistration credentials in the token transaction", async () => {
  const record = { ...user, emailVerifiedAt: null as Date | null, passwordHash: "untrusted" as string | null };
  let consumed = 0;
  let revoked = 0;
  const tx = { magicLinkToken: { updateMany: async () => { consumed++; return { count: 1 }; } }, user: {
    updateMany: async ({ data }: any) => { Object.assign(record, data); return { count: 1 }; }, findUnique: async () => record,
  }, session: { updateMany: async () => { revoked++; return { count: 1 }; } } };
  const source = await harness("src/lib/auth/magic-link.ts", { magicLinkToken: { findUnique: async () => ({ id: "synthetic-link", user: record, expiresAt: new Date(Date.now() + 60000), usedAt: null }) }, $transaction: async (fn: any) => fn(tx) });
  const result = await source.consumeMagicLink("synthetic-token");
  assert.equal(result.id, userId); assert.ok(result.emailVerifiedAt); assert.equal(record.passwordHash, null); assert.equal(consumed, 1); assert.equal(revoked, 1);
});

test("real JWT signing and verification preserve the original proof millisecond", async () => {
  const saved = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "synthetic-unit-test-secret-not-a-credential";
  try {
    const { signAccessToken, verifyAccessToken } = createRequire(import.meta.url)("../../src/lib/auth/jwt.ts");
    const token = await signAccessToken(userId, oldAt);
    const claims = await verifyAccessToken(token);
    assert.equal(claims.authenticatedAt, oldAt.getTime());
    assert.equal(authenticationIsCurrent(claims.authenticatedAt, provedAt), false);
  } finally {
    if (saved === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = saved;
  }
});

test("signup rejects password creation explicitly before database, mail or session side effects", async () => {
  let effects = 0;
  const source = await harness("src/app/api/auth/signup/route.ts", { user: { create: async () => { effects++; } } }, undefined,
    { testSendEmail: async () => { effects++; } });
  const response = await source.POST(new Request("https://opsolid.example/api/auth/signup", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: user.email, password: "synthetic-only" }) }));
  assert.equal(response.status, 422);
  assert.equal((await response.json()).error.code, "password_signup_disabled");
  assert.equal(effects, 0);
  assert.equal(response.headers.get("set-cookie"), null);
});

test("passwordless signup issues only an email proof and never a session or access token", async () => {
  let links = 0; let emails = 0;
  const source = await harness("src/app/api/auth/signup/route.ts", {
    user: { findUnique: async () => ({ ...user, emailVerifiedAt: null }) },
    magicLinkToken: { create: async () => { links++; return {}; } },
    session: { create: async () => { throw new Error("must not authenticate before proof"); } },
  }, undefined, { testSendEmail: async () => { emails++; } });
  const response = await source.POST(new Request("https://opsolid.example/api/auth/signup", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: user.email, locale: "en" }) }));
  const payload = await response.json();
  assert.equal(response.status, 202); assert.equal(payload.method, "magic_link");
  assert.equal(payload.accessToken, undefined); assert.equal(response.headers.get("set-cookie"), null);
  assert.equal(links, 1); assert.equal(emails, 1);
});
