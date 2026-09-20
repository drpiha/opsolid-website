const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '../..');
function harness(order) {
  let rendered = 0;
  function load(relative) {
    const filename = path.join(root, relative);
    const module = { exports: {} };
    const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    const allowed = {
      'next/og': { ImageResponse: class { constructor() { rendered++; return new Response('synthetic-render'); } } },
      '@/lib/prisma': { prisma: { cardOrder: { findUnique: async () => order } } },
      '@/lib/validation': { CardDataSchema: { safeParse: () => ({ success: true, data: order.cardData }) } },
      '@/lib/qr/styled-server': { renderQr: async () => ({ bytes: Buffer.from('synthetic') }) },
      '@/lib/storage': { absoluteAssetUrl: () => { throw new Error('No protected image may be loaded'); } },
      '@/lib/stripe': { getSiteUrl: () => 'https://example.test' },
      '@/lib/card-host': { publicCardUrlFor: () => 'https://example.test/c/synthetic', publicCardDisplayFor: () => 'example.test/c/synthetic' },
      'react/jsx-runtime': { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) },
    };
    const requireSafe = (id) => {
      if (id === '@/lib/card-share-visibility') return load('src/lib/card-share-visibility.ts');
      if (id in allowed) return allowed[id];
      throw new Error(`Unstubbed dependency: ${id}`);
    };
    new vm.Script(compiled, { filename }).runInNewContext({ module, exports: module.exports, require: requireSafe, Response, Buffer, URL, console });
    return module.exports;
  }
  return { load, renders: () => rendered };
}

for (const image of ['og.png', 'wa.png', 'story.png']) {
  test(`${image} conceals private, password-protected, missing and unpublished cards before rendering`, async () => {
    for (const order of [null, { status: 'DRAFT', visibility: 'public', cardData: {} },
      { status: 'PUBLISHED', visibility: 'private', cardData: {} },
      { status: 'PUBLISHED', visibility: 'public', cardData: { password: 'synthetic-hash', name: 'Do not expose' } },
    ]) {
      const h = harness(order);
      const route = h.load(`src/app/c/[slug]/${image}/route.tsx`);
      const response = await route.GET(new Request('https://example.test'), { params: { slug: 'synthetic' } });
      assert.equal(response.status, 404);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.equal(await response.text(), 'Not found');
      assert.equal(h.renders(), 0);
    }
  });
}

test('public and direct-link unlisted cards remain eligible without a password', () => {
  const { canPublishCardPreview } = harness(null).load('src/lib/card-share-visibility.ts');
  for (const visibility of ['public', 'unlisted']) {
    assert.equal(canPublishCardPreview({ status: 'PUBLISHED', visibility, cardData: { name: 'Demo', password: '' } }), true);
  }
});
