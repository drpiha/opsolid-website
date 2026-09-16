const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { NextResponse } = require('next/server');
const { Prisma } = require('../../src/generated/prisma');
const root = path.resolve(__dirname, '../..');

const rows = [
  { id: 'hidden-first', password: 'synthetic-protection' },
  { id: 'public-missing' },
  { id: 'hidden-middle', password: 'synthetic-protection' },
  { id: 'public-null', password: null },
  { id: 'public-empty', password: '' },
  { id: 'hidden-next', password: 'synthetic-protection' },
  { id: 'public-next' },
  { id: 'public-last', password: '' },
].map((entry, index) => ({ id: entry.id, slug: entry.id, contactName: `Design ${entry.id}`,
  status: 'PUBLISHED', visibility: 'public', photoPath: null, languages: ['en'], templateId: 1,
  openToNetworking: true, acceptingClients: true, publishedAt: new Date(Date.UTC(2026, 0, 10 - index)),
  cardData: { name: `Design ${entry.id}`, tags: ['design'], ...('password' in entry ? { password: entry.password } : {}) },
}));

function matches(row, where) {
  if (where.AND && !where.AND.every((part) => matches(row, part))) return false;
  if (where.OR && !where.OR.some((part) => matches(row, part))) return false;
  for (const key of ['status', 'visibility']) if (where[key] && row[key] !== where[key]) return false;
  if (where.cardData) {
    const filter = where.cardData; const value = row.cardData[filter.path[0]];
    if (filter.equals === Prisma.AnyNull && value !== undefined && value !== null) return false;
    if (filter.equals !== undefined && filter.equals !== Prisma.AnyNull && value !== filter.equals) return false;
    if (filter.array_contains && !filter.array_contains.every((tag) => value?.includes(tag))) return false;
  }
  return true;
}

function harness() {
  const queries = []; let seenCursor;
  const page = (eligible, take, cursor) => {
    // A real DB filters before TAKE. The cursor remains a position in the ordered full set.
    const cursorIndex = cursor ? rows.findIndex((row) => row.id === cursor) : -1;
    return eligible.filter((row) => rows.indexOf(row) > cursorIndex).slice(0, take);
  };
  const prisma = { cardOrder: {
    findUnique: async ({ where }) => { seenCursor = where.id; return rows.find((row) => row.id === where.id) ?? null; },
    findMany: async (args) => {
      queries.push(args);
      return page(rows.filter((row) => matches(row, args.where)), args.take, args.cursor?.id);
    },
  }, $queryRaw: async (parts, ...values) => {
    const sql = parts.join('?'); queries.push({ sql, values });
    const guarded = /COALESCE\(co\.card_data\s*->>\s*'password',\s*''\)\s*=\s*''/.test(sql);
    const eligible = guarded ? rows.filter((row) => !row.cardData.password) : rows;
    return page(eligible, values.at(-1), seenCursor);
  } };
  const module = { exports: {} }; const filename = path.join(root, 'src/app/api/discover/cards/route.ts');
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const mocks = {
    'next/server': { NextResponse }, '@/generated/prisma': { Prisma }, '@/lib/prisma': { prisma },
    '@/lib/card-share-visibility': { canPublishCardPreview: (row) => row.status === 'PUBLISHED' && row.visibility !== 'private' && !row.cardData.password },
    '@/lib/validation': { OrderStatus: { PUBLISHED: 'PUBLISHED' } },
    '@/lib/discover/tags': { normalizeTagSlug: (tag) => tag },
    '@/lib/auth/rate-limit': { hitWindow: () => ({ ok: true }), clientIp: () => 'synthetic' },
  };
  new vm.Script(compiled, { filename }).runInNewContext({ module, exports: module.exports, URL, require: (name) => {
    if (!(name in mocks)) throw new Error(`Unexpected dependency ${name}`); return mocks[name];
  } });
  return { GET: module.exports.GET, queries };
}

for (const query of ['', '&q=design', '&tags=design&tags=consulting']) {
  test(`discovery filters protected rows before pagination (${query || 'no search'})`, async () => {
    const h = harness();
    const first = await (await h.GET(new Request(`https://example.test/api/discover/cards?limit=3${query}`))).json();
    assert.deepEqual(first.items.map((item) => item.id), ['public-missing', 'public-null', 'public-empty']);
    assert.equal(first.nextCursor, 'public-empty');
    const second = await (await h.GET(new Request(`https://example.test/api/discover/cards?limit=3${query}&cursor=${first.nextCursor}`))).json();
    assert.deepEqual(second.items.map((item) => item.id), ['public-next', 'public-last']);
    assert.equal(second.nextCursor, null);
    if (query.includes('q=')) {
      assert.ok(h.queries[0].sql.indexOf("COALESCE(co.card_data->>'password', '') = ''") < h.queries[0].sql.indexOf('LIMIT'));
    } else {
      assert.equal(h.queries[0].where.AND[0].OR[0].cardData.equals, Prisma.AnyNull);
      if (query.includes('tags=')) assert.equal(h.queries[0].where.OR.length, 2);
    }
  });
}
