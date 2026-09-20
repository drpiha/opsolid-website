const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { NextResponse } = require('next/server');

const root = path.resolve(__dirname, '../..');
const now = new Date();
function card(id, patch = {}) {
  return {
    id, slug: id, contactName: id, status: 'PUBLISHED', visibility: 'public',
    cardData: { name: id, title: 'Synthetic title', tags: ['design'] },
    photoPath: null, logoPath: null, languages: ['en'], templateId: 1,
    openToNetworking: true, acceptingClients: true, publishedAt: now,
    city: 'Berlin', country: 'DE', userId: null,
    customDomain: null, customDomainVerified: false,
    ...patch,
  };
}
function project(row, select) {
  if (!row || !select) return row;
  return Object.fromEntries(Object.entries(select).map(([key, rule]) => {
    const value = row[key];
    if (rule === true) return [key, value];
    return [key, Array.isArray(value)
      ? value.map((item) => project(item, rule.select))
      : project(value, rule.select)];
  }));
}
function harness({ order = null, rows = [], event = null } = {}) {
  const calls = { album: 0, apple: 0, google: 0, qr: 0, assets: 0, mapped: [], queries: [] };
  const matches = (row, where = {}) => (!where.status || row.status === where.status)
    && (!where.visibility || row.visibility === where.visibility)
    && (!where.id?.notIn || !where.id.notIn.includes(row.id));
  const prisma = {
    cardOrder: {
      findUnique: async (args) => project(order, args.select),
      findMany: async (args) => {
        calls.queries.push(args);
        if (typeof args.where?.userId === 'string') return [project(card('self', { city: 'Berlin' }), args.select)];
        return rows.filter((row) => matches(row, args.where)).map((row) => project(row, args.select));
      },
    },
    cardAlbumPhoto: {
      count: async () => { calls.album++; return 1; },
      findMany: async () => { calls.album++; return [{ id: 'photo-public', photoPath: '/synthetic/photo.png', caption: 'Public album', uploaderName: 'Demo', connectionId: null, connection: null, approvedAt: now }]; },
    },
    event: { findUnique: async (args) => project(event, args.select) },
    savedCard: { findMany: async () => [] },
    $transaction: async (operations) => Promise.all(operations),
    $queryRaw: async (parts, ...values) => {
      calls.queries.push({ sql: parts.join('?'), values });
      return rows.filter((row) => row.status === 'PUBLISHED' && row.visibility === 'public');
    },
  };
  class AuthError extends Error {}
  const allowed = {
    'next/server': { NextResponse },
    'node:crypto': require('node:crypto'),
    '@/lib/prisma': { prisma },
    '@/generated/prisma': { Prisma: { sql: (parts, ...values) => ({ parts, values }) } },
    '@/lib/validation': { OrderStatus: { PUBLISHED: 'PUBLISHED' }, CardDataSchema: { safeParse: (data) => ({ success: true, data }) }, AlbumUploadSchema: {} },
    '@/lib/storage': { putAsset: async () => { throw new Error('Unexpected write'); }, STORAGE_LIMITS: {}, absoluteAssetUrl: (asset) => { calls.assets++; return `https://example.test${asset}`; } },
    '@/lib/cardAssetUrl': { resolveAssetUrl: (value) => value },
    '@/lib/auth/edit-token': { requireEditToken: async () => { throw new Error('Unexpected owner action'); }, EditTokenError: class extends Error {} },
    '@/lib/email/templates/album-photo-pending': { renderAlbumPhotoPending: () => { throw new Error('Unexpected email'); } },
    '@/lib/email/send': { sendCustomerEmail: async () => { throw new Error('Unexpected email'); } },
    '@/lib/stripe': { getSiteUrl: () => 'https://example.test' },
    '@/lib/card-host': { publicCardUrlFor: (slug) => `https://example.test/c/${slug}` },
    '@/lib/qr/styled-server': { renderQr: async () => { calls.qr++; return { bytes: Buffer.from('synthetic-qr'), contentType: 'image/png' }; } },
    '@/lib/wallet/apple': { buildApplePass: async () => { calls.apple++; return Buffer.from('synthetic-pass'); } },
    '@/lib/wallet/google': { buildGoogleWalletJwt: async () => { calls.google++; return 'synthetic-wallet-jwt'; } },
    '@/lib/wallet/config': { WalletNotConfiguredError: class extends Error {} },
    '@/lib/discover/tags': { normalizeTagSlug: (tag) => tag },
    '@/lib/auth/rate-limit': { hitWindow: () => ({ ok: true }), clientIp: () => 'synthetic' },
    '@/lib/auth/require-user': { AuthError },
    '@/lib/api/v1/bearer-only': { requireBearerUser: async () => ({ id: 'requester' }) },
    '@/lib/api/v1/errors': { errorJson: (code, message, status) => NextResponse.json({ error: { code, message } }, { status }) },
    '@/lib/api/v1/cors': { applyCors: (response) => response, corsPreflight: () => new Response(null, { status: 204 }) },
    '@/lib/api/v1/rate-limit': { rateLimit: () => ({ ok: true }) },
    '@/lib/api/v1/card-mapping': {
      CARD_API_SELECT: { id: true, slug: true, status: true, visibility: true, cardData: true, contactName: true },
      toPublicApiCard: (row) => { calls.mapped.push(row.id); return { id: row.id, name: row.contactName }; },
    },
  };
  const cache = new Map();
  function load(relative) {
    if (cache.has(relative)) return cache.get(relative);
    const filename = path.join(root, relative);
    const module = { exports: {} };
    const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const requireSafe = (id) => {
      if (id === '@/lib/card-share-visibility') return load('src/lib/card-share-visibility.ts');
      if (id in allowed) return allowed[id];
      throw new Error(`Unstubbed dependency: ${id}`);
    };
    new vm.Script(compiled, { filename }).runInNewContext({ module, exports: module.exports, require: requireSafe,
      Response, Request, Buffer, URL, Date, console, process: { env: {} } });
    cache.set(relative, module.exports);
    return module.exports;
  }
  return { load, calls };
}

const protectedCards = [null,
  card('draft-marker', { status: 'DRAFT' }),
  card('private-marker', { visibility: 'private' }),
  card('password-marker', { cardData: { name: 'password-marker', password: 'synthetic-protection' } }),
];
const endpoints = [
  ['album', 'src/app/api/cards/[slug]/album/route.ts', 200],
  ['apple', 'src/app/api/cards/[slug]/wallet/apple/route.ts', 200],
  ['google', 'src/app/api/cards/[slug]/wallet/google/route.ts', 302],
  ['qr', 'src/app/api/qr/[slug]/route.ts', 200],
];
for (const [name, entry, publicStatus] of endpoints) {
  test(`${name}: missing, unpublished, private and password cards fail before data/render/signing`, async () => {
    for (const order of protectedCards) {
      const h = harness({ order });
      const response = await h.load(entry).GET(new Request('https://example.test/api/synthetic'), { params: { slug: 'synthetic' } });
      assert.equal(response.status, 404, `${name}: ${order?.id}`);
      assert.equal(response.headers.get('location'), null);
      assert.doesNotMatch(await response.text(), /private-marker|password-marker|draft-marker|synthetic-protection/);
      for (const field of ['album', 'apple', 'google', 'qr', 'assets']) assert.equal(h.calls[field], 0, field);
    }
  });
  test(`${name}: ordinary public cards retain the expected flow`, async () => {
    const h = harness({ order: card('public-demo') });
    const response = await h.load(entry).GET(new Request('https://example.test/api/synthetic'), { params: { slug: 'public-demo' } });
    assert.equal(response.status, publicStatus);
    assert.ok(h.calls[name] > 0);
  });
}

test('QR protected rows cannot escape through saved-art or AI-art redirect fast paths', async () => {
  for (const query of ['', '?ai=1', '?photo=1', '?logo=1']) {
    for (const visibility of ['private', 'public']) {
      const h = harness({ order: card('protected', { visibility,
        cardData: visibility === 'public' ? { password: 'synthetic' } : {},
        qrStyle: { savedUrl: 'https://example.test/private.png', ai: { generatedUrl: 'https://example.test/private-ai.png' } },
        photoPath: '/private-photo.png', logoPath: '/private-logo.png',
      }) });
      const response = await h.load('src/app/api/qr/[slug]/route.ts').GET(new Request(`https://example.test/api/qr/protected${query}`), { params: { slug: 'protected' } });
      assert.equal(response.status, 404); assert.equal(response.headers.get('location'), null);
      assert.equal(h.calls.qr, 0); assert.equal(h.calls.assets, 0);
    }
  }
});

const mixedRows = () => [card('public-demo'), ...protectedCards.filter(Boolean)];
for (const query of ['', '?q=synthetic']) {
  test(`discovery${query || ' normal'} removes password cards and keeps public results`, async () => {
    const h = harness({ rows: mixedRows() });
    const response = await h.load('src/app/api/discover/cards/route.ts').GET(new Request(`https://example.test/api/discover/cards${query}`));
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.deepEqual(body.items.map((row) => row.id), ['public-demo']);
    assert.doesNotMatch(JSON.stringify(body), /private-marker|password-marker|draft-marker/);
    const selection = h.calls.queries[0];
    if (query) assert.match(selection.sql, /co\.visibility\s*=\s*'public'/);
    else assert.equal(selection.where.visibility, 'public');
  });
}

test('suggestions exclude private/password cards and do not retain newly protected cards in cache', async () => {
  const rows = mixedRows();
  const h = harness({ rows });
  const route = h.load('src/app/api/v1/discover/suggestions/route.ts');
  const request = () => new Request('https://example.test/api/v1/discover/suggestions');
  const first = await route.GET(request());
  assert.equal(first.status, 200);
  assert.deepEqual((await first.json()).items.map((row) => row.id), ['public-demo']);
  rows[0].cardData.password = 'enabled-after-first-read';
  const second = await route.GET(request());
  assert.equal(second.status, 200);
  assert.deepEqual((await second.json()).items, []);
});

test('event roster maps only published non-private non-password card identities', async () => {
  const event = { id: 'event-1', slug: 'synthetic-event', name: 'Synthetic event', isActive: true,
    startAt: now, endAt: new Date(now.getTime() + 3600000), attendees: mixedRows().map((row) => ({ card: row })),
  };
  const h = harness({ event });
  const response = await h.load('src/app/api/v1/events/[slug]/route.ts').GET(new Request('https://example.test/api/v1/events/synthetic-event'), { params: { slug: 'synthetic-event' } });
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).attendees.map((row) => row.id), ['public-demo']);
  assert.deepEqual(h.calls.mapped, ['public-demo']);
});
