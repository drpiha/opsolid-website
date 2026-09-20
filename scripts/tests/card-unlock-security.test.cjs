const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { NextResponse } = require('next/server');
const root = path.resolve(__dirname, '../..');
const secret = 'synthetic-only-card-unlock-secret-1234567890';
const base = { id: 'synthetic-card-id', slug: 'synthetic-card', status: 'PUBLISHED', visibility: 'public',
  cardData: { name: 'Protected synthetic identity', password: 'synthetic-password-hash' },
  editToken: 'synthetic-owner-capability', updatedAt: new Date('2026-01-01T00:00:00Z'), photoPath: null, locale: 'en' };
const reads = [
  ['src/app/api/cards/[slug]/vcard/route.ts', { slug: base.slug }],
  ['src/app/api/v1/cards/[id]/vcard/route.ts', { id: base.id }],
  ['src/app/api/v1/public/cards/[slug]/route.ts', { slug: base.slug }],
];

function harness(order = base, { cookie = '', env = { JWT_SECRET: secret, NODE_ENV: 'production' }, passwordMatches = true } = {}) {
  const modules = new Map(); let passwordChecks = 0;
  function load(relative) {
    if (modules.has(relative)) return modules.get(relative);
    const filename = path.join(root, relative); const module = { exports: {} };
    modules.set(relative, module.exports);
    const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    const mocks = {
      'next/server': { NextResponse },
      'next/headers': { headers: async () => new Headers({ cookie }), cookies: async () => ({ get: (name) => {
        const match = cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
        return match ? { value: match.slice(name.length + 1) } : undefined;
      } }) },
      'next/navigation': { notFound: () => { throw new Error('synthetic-not-found'); }, permanentRedirect: () => { throw new Error('synthetic-redirect'); } },
      '@/lib/prisma': { prisma: { cardOrder: { findUnique: async () => order, findFirst: async () => null }, cardView: { create: async () => ({}) } } },
      '@/lib/validation': { OrderStatus: { PUBLISHED: 'PUBLISHED' }, CardDataSchema: { safeParse: (data) => ({ success: true, data: { ...data } }) } },
      '@/lib/auth/password': { verifyPassword: async () => { passwordChecks++; return passwordMatches; } },
      '@/lib/auth/rate-limit': { clientIp: () => 'synthetic', hitWindow: () => ({ ok: true }) },
      '@/lib/api/v1/rate-limit': { rateLimit: () => ({ ok: true }) },
      '@/lib/api/v1/cors': { applyCors: (response) => response, corsPreflight: () => new Response(null, { status: 204 }) },
      '@/lib/api/v1/card-mapping': { CARD_API_SELECT: {}, toPublicApiCard: (row) => ({ name: row.cardData.name }) },
      '@/lib/storage': { absoluteAssetUrl: () => { throw new Error('No image fetch expected'); } },
      '@/lib/stripe': { getSiteUrl: () => 'https://example.test' },
      '@/lib/vcard': { buildVCard: ({ cardData }) => cardData.name, buildVCard3: ({ cardData }) => cardData.name, vcardFilename: () => 'synthetic.vcf' },
      '@/lib/vcard-public': { formatVCard: ({ cardData }) => cardData.name, vcardDownloadFilename: () => 'synthetic.vcf' },
      '@/components/cards/smart/SmartCardSource': { readSourceFromSearchParams: () => ({}), describeSource: () => '' },
      '@/components/cards/templates/v2/registry': { getTemplateEntry: () => { throw new Error('synthetic-after-access-gate'); } },
      '@/lib/auth/pro': { isPro: () => false },
      '@/content': { contents: {} },
    };
    const requireSafe = (id) => {
      if (id in mocks) return mocks[id];
      if (id.startsWith('node:')) return require(id);
      if (id === 'zod' || id === 'react/jsx-runtime') return require(id);
      if (id.startsWith('@/components/') || id.startsWith('@/context/')) return new Proxy({}, { get: (_, name) => Object.assign(() => null, { displayName: name }) });
      if (id.startsWith('@/lib/')) return load(`src/lib/${id.slice(6)}.ts`);
      if (id.startsWith('./')) return load(path.join(path.dirname(relative), `${id}.ts`));
      throw new Error(`Unstubbed dependency: ${id}`);
    };
    new vm.Script(compiled, { filename }).runInNewContext({ module, exports: module.exports, require: requireSafe,
      Response, Request, Headers, Buffer, URL, Date, process: { env }, console: { error() {}, warn() {} } });
    return module.exports;
  }
  return { load, passwordChecks: () => passwordChecks };
}

test('unlock signatures bind expiry, slug, password version and secret without exposing the hash', () => {
  const h = harness(); const lib = h.load('src/lib/cards/unlock-cookie.ts'); const now = 1_800_000_000;
  const value = lib.signUnlockCookie(base.slug, base.cardData.password, now);
  assert.equal(lib.verifyUnlockCookie(value, base.slug, base.cardData.password, now), true);
  assert.equal(lib.verifyUnlockCookie(value, 'different-card', base.cardData.password, now), false);
  assert.equal(lib.verifyUnlockCookie(value, base.slug, 'changed-password-hash', now), false);
  assert.equal(lib.verifyUnlockCookie(value, base.slug, base.cardData.password, now + 86_400), false);
  assert.equal(lib.verifyUnlockCookie(value, base.slug, base.cardData.password, now - 1), false);
  for (const forged of ['1', 'anything', value.replace('v1.', 'v2.'), value + 'x', value.replace(String(now + 86_400), String(now + 86_399))]) {
    assert.equal(lib.verifyUnlockCookie(forged, base.slug, base.cardData.password, now), false);
  }
  assert.doesNotMatch(value, /synthetic-password-hash/);
  const rotated = harness(base, { env: { JWT_SECRET: secret + 'changed' } }).load('src/lib/cards/unlock-cookie.ts');
  assert.equal(rotated.verifyUnlockCookie(value, base.slug, base.cardData.password, now), false);
  for (const env of [{}, { JWT_SECRET: 'short' }]) {
    const unavailable = harness(base, { env }).load('src/lib/cards/unlock-cookie.ts');
    assert.equal(unavailable.verifyUnlockCookie(value, base.slug, base.cardData.password, now), false);
    assert.throws(() => unavailable.signUnlockCookie(base.slug, base.cardData.password, now), /unavailable/);
  }
});

test('actual unlock issues an HttpOnly signed cookie only after password proof; private or wrong password issues none', async () => {
  const entry = 'src/app/api/cards/[slug]/unlock/route.ts';
  const request = () => new Request('https://example.test/unlock', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password: 'synthetic input' }) });
  const h = harness();
  const response = await h.load(entry).POST(request(), { params: { slug: base.slug } });
  assert.equal(response.status, 200); assert.equal(h.passwordChecks(), 1);
  const cookie = response.headers.get('set-cookie');
  assert.match(cookie, /HttpOnly/i); assert.match(cookie, /SameSite=lax/i); assert.match(cookie, /Secure/);
  assert.match(cookie, /Max-Age=86400/); assert.equal(response.headers.get('cache-control'), 'private, no-store');
  const lib = h.load('src/lib/cards/unlock-cookie.ts');
  assert.equal(lib.hasValidUnlockCookie(cookie.split(';')[0], base.slug, base.cardData.password), true);
  assert.equal(lib.hasValidUnlockCookie(`${cookie.split(';')[0]}; ${cookie.split(';')[0]}`, base.slug, base.cardData.password), false);
  for (const [order, options, expected] of [[base, { passwordMatches: false }, 401], [{ ...base, visibility: 'private' }, {}, 404], [{ ...base, status: 'DRAFT' }, {}, 404]]) {
    const h = harness(order, options); const denied = await h.load(entry).POST(request(), { params: { slug: base.slug } });
    assert.equal(denied.status, expected); assert.equal(denied.headers.get('set-cookie'), null);
    if (expected === 404) assert.equal(h.passwordChecks(), 0);
  }
});

for (const [entry, params] of reads) {
  test(`${entry} accepts valid unlock with no-store, rejects other-card or old-password proof, preserves ordinary public reads`, async () => {
    const lib = harness().load('src/lib/cards/unlock-cookie.ts');
    const valid = lib.signUnlockCookie(base.slug, base.cardData.password);
    for (const [value, expected] of [[valid, 200], [lib.signUnlockCookie('different-card', base.cardData.password), 401], [lib.signUnlockCookie(base.slug, 'old-password'), 401],
      [lib.signUnlockCookie(base.slug, base.cardData.password, Math.floor(Date.now() / 1000) - 86_400), 401]]) {
      const cookie = `${lib.unlockCookieName(base.slug)}=${value}`;
      const h = harness(base, { cookie });
      const response = await h.load(entry).GET(new Request('https://example.test/read', { headers: { cookie } }), { params });
      assert.equal(response.status, expected); assert.equal(response.headers.get('cache-control'), 'private, no-store');
      assert.doesNotMatch(await response.text(), /synthetic-password-hash/);
    }
    for (const visibility of ['public', 'unlisted']) {
      const h = harness({ ...base, visibility, cardData: { name: 'Ordinary synthetic card' } });
      const response = await h.load(entry).GET(new Request('https://example.test/read'), { params });
      assert.equal(response.status, 200); assert.match(await response.text(), /Ordinary synthetic card/);
    }
    const cookie = `${lib.unlockCookieName(base.slug)}=${valid}`;
    const privateResponse = await harness({ ...base, visibility: 'private' }, { cookie }).load(entry)
      .GET(new Request('https://example.test/read', { headers: { cookie } }), { params });
    assert.equal(privateResponse.status, 404);
    assert.doesNotMatch(await privateResponse.text(), /Protected synthetic identity/);
  });
}

test('both contact exports preserve the valid owner capability, but never bypass private visibility', async () => {
  for (const [entry, params] of reads.slice(0, 2)) {
    for (const [order, token, expected] of [[base, base.editToken, 200], [base, 'wrong', 401], [{ ...base, visibility: 'private' }, base.editToken, 404]]) {
      const response = await harness(order).load(entry).GET(new Request(`https://example.test/read?token=${token}`), { params });
      assert.equal(response.status, expected);
      if (expected === 200) assert.equal(response.headers.get('cache-control'), 'private, no-store');
    }
  }
});

test('actual public page keeps forged cookies locked and advances only with signed unlock or owner capability', async () => {
  const entry = 'src/app/c/[slug]/page.tsx';
  const lib = harness().load('src/lib/cards/unlock-cookie.ts');
  const value = lib.signUnlockCookie(base.slug, base.cardData.password);
  const props = { params: Promise.resolve({ slug: base.slug }), searchParams: Promise.resolve({}) };
  for (const cookie of ['', `${lib.unlockCookieName(base.slug)}=1`, `${lib.unlockCookieName(base.slug)}=anything`]) {
    const page = await harness(base, { cookie }).load(entry).default(props);
    assert.equal(page.type.displayName, 'LockScreen');
    assert.doesNotMatch(JSON.stringify(page.props), /Protected synthetic identity|synthetic-password-hash/);
  }
  for (const [cookie, searchParams] of [[`${lib.unlockCookieName(base.slug)}=${value}`, {}], ['', { owner: base.editToken }], [`card_owner_${base.id}=${base.editToken}`, {}]]) {
    await assert.rejects(() => harness(base, { cookie }).load(entry).default({ ...props, searchParams: Promise.resolve(searchParams) }), /synthetic-after-access-gate/);
  }
  await assert.rejects(() => harness({ ...base, visibility: 'private' }).load(entry).default(props), /synthetic-not-found/);
});
for (const [entry, params] of reads) {
  test(`${entry} refuses forged unlock cookies and conceals private or unpublished cards`, async () => {
    for (const [order, expected] of [[base, 401], [{ ...base, visibility: 'private' }, 404], [{ ...base, status: 'DRAFT' }, 404]]) {
      const cookie = `verso_unlock_${base.slug}=1`;
      const h = harness(order, { cookie });
      const response = await h.load(entry).GET(new Request('https://example.test/read', { headers: { cookie } }), { params });
      assert.equal(response.status, expected);
      assert.doesNotMatch(await response.text(), /Protected synthetic identity|synthetic-password-hash/);
    }
  });
}
