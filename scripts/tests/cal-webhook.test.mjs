import assert from 'node:assert/strict';
import test from 'node:test';
import { createHmac } from 'node:crypto';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import { build } from 'esbuild';

const fixedNow = Date.parse('2026-09-11T12:00:00Z');
const secret = 'synthetic-only';
const bundled = await build({ entryPoints: ['src/app/api/webhooks/cal/route.ts'], bundle: true, platform: 'node', format: 'cjs', write: false,
  plugins: [{ name: 'no-provider', setup(b) { b.onResolve({ filter: /^@\/lib\/notifications$/ }, () => ({ path: 'notifications', namespace: 'test' })); b.onLoad({ filter: /.*/, namespace: 'test' }, () => ({ contents: 'export const notifyBooking = b => globalThis.testNotify(b);' })); } }], logLevel: 'silent' });
function harness({ configured = true, notify } = {}) {
  const calls = []; const logs = [];
  const timers = new Set();
  const module = { exports: {} };
  class Clock extends Date { static now() { return fixedNow; } }
  runInNewContext(bundled.outputFiles[0].text, { module, exports: module.exports, require: createRequire(import.meta.url),
    Buffer, TextDecoder, Response, Date: Clock, process: { env: { CALCOM_WEBHOOK_SECRET: configured ? secret : undefined } },
    setTimeout: callback => { timers.add(callback); return callback; }, clearTimeout: callback => timers.delete(callback),
    console: { log: (...v) => logs.push(v), warn: (...v) => logs.push(v), error: (...v) => logs.push(v) },
    testNotify: async b => { calls.push(b); if (notify) await notify(b); } });
  return { post: module.exports.POST, calls, logs, expire: () => [...timers].forEach(callback => callback()), timers };
}
const event = (patch = {}) => ({ triggerEvent: 'BOOKING_CREATED', createdAt: new Date(fixedNow).toISOString(),
  payload: { uid: 'synthetic-booking', title: 'Test booking', startTime: '2026-09-12T10:00:00Z', endTime: '2026-09-12T10:30:00Z', attendees: [{ name: 'Demo Person', email: 'demo@example.test' }] }, ...patch });
function request(value = event(), headers = {}) {
  const raw = typeof value === 'string' ? value : JSON.stringify(value);
  return new Request('https://opsolid.example/api/webhooks/cal', { method: 'POST', body: raw,
    headers: { 'content-type': 'application/json', 'x-cal-signature-256': createHmac('sha256', secret).update(raw).digest('hex'), ...headers } });
}
test('missing signing configuration fails closed without notifications or logs', async () => {
  const h = harness({ configured: false }); assert.equal((await h.post(request())).status, 503); assert.equal(h.calls.length, 0); assert.equal(h.logs.length, 0);
});
test('missing, malformed and forged signatures are rejected', async () => {
  const h = harness(); for (const signature of ['', 'invalid', '0'.repeat(64)]) assert.equal((await h.post(request(event(), { 'x-cal-signature-256': signature }))).status, 401);
  assert.equal(h.calls.length, 0);
});
test('malformed JSON, types, missing attendee and oversized body fail before side effects', async () => {
  const h = harness();
  for (const body of ['{', null, [], event({ payload: {} }), event({ payload: { ...event().payload, attendees: [] } })]) assert.equal((await h.post(request(body))).status, 400);
  assert.equal((await h.post(request(' '.repeat(65537)))).status, 413);
  assert.equal((await h.post(request(event(), { 'content-type': 'text/plain' }))).status, 415);
  assert.equal(h.calls.length, 0); assert.equal(h.logs.length, 0);
});
test('old and future signed events are rejected', async () => {
  const h = harness();
  for (const delta of [-300001, 60001]) assert.equal((await h.post(request(event({ createdAt: new Date(fixedNow + delta).toISOString() })))).status, 400);
  assert.equal(h.calls.length, 0);
});
test('valid signed event notifies once and replay returns duplicate', async () => {
  const h = harness(); assert.equal((await h.post(request())).status, 200);
  assert.equal((await (await h.post(request())).json()).duplicate, true);
  assert.equal(h.calls.length, 1); assert.equal(h.calls[0].status, 'created'); assert.equal(h.logs.length, 0);
});
test('equivalent signed JSON property ordering cannot bypass receipt identity', async () => {
  const h = harness(); await h.post(request()); const e = event();
  const reordered = { payload: e.payload, createdAt: e.createdAt, triggerEvent: e.triggerEvent };
  assert.equal((await (await h.post(request(reordered))).json()).duplicate, true); assert.equal(h.calls.length, 1);
});
test('concurrent delivery reserves before the notification awaits', async () => {
  let release; const pending = new Promise(resolve => { release = resolve; });
  const h = harness({ notify: () => pending }); const first = h.post(request());
  await new Promise(resolve => setImmediate(resolve));
  const duplicate = await h.post(request()); assert.equal(duplicate.status, 503);
  assert.equal((await duplicate.json()).duplicate, true); release(); await first; assert.equal(h.calls.length, 1);
});
test('uncertain delivery returns generic error and does not log or resend', async () => {
  const h = harness({ notify: async () => { throw new Error('synthetic private body'); } });
  const response = await h.post(request()); assert.equal(response.status, 503); assert.equal((await response.text()).includes('private'), false);
  const duplicate = await h.post(request()); assert.equal(duplicate.status, 503);
  assert.equal((await duplicate.json()).duplicate, true); assert.equal(h.calls.length, 1); assert.equal(h.logs.length, 0);
});
test('stalled bodies time out, cancel, and release the bounded admission slots', async () => {
  const h = harness(); let cancellations = 0;
  const pending = Array.from({ length: 4 }, () => h.post(new Request('https://opsolid.example/api/webhooks/cal', {
    method: 'POST', duplex: 'half', body: new ReadableStream({ cancel: () => { cancellations += 1; } }),
    headers: { 'content-type': 'application/json', 'x-cal-signature-256': '0'.repeat(64) },
  })));
  assert.equal((await h.post(request())).status, 503);
  h.expire(); assert.deepEqual((await Promise.all(pending)).map(r => r.status), [408, 408, 408, 408]);
  assert.equal(cancellations, 4); assert.equal(h.timers.size, 0);
  assert.equal((await h.post(request())).status, 200); assert.equal(h.calls.length, 1);
});
test('unknown signed event is ignored without a notification', async () => {
  const h = harness(); assert.equal((await (await h.post(request(event({ triggerEvent: 'MEETING_STARTED' })))).json()).ignored, true); assert.equal(h.calls.length, 0);
});
test('distinct legitimate cancellation remains independent of creation', async () => {
  const h = harness(); await h.post(request()); assert.equal((await h.post(request(event({ triggerEvent: 'BOOKING_CANCELLED' })))).status, 200);
  assert.equal(h.calls.length, 2); assert.equal(h.calls[1].status, 'cancelled');
});
