import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import { build } from 'esbuild';
import { createHmac } from 'node:crypto';

const plugins = [{ name: 'no-providers', setup(b) {
  b.onResolve({ filter: /^(@sentry\/nextjs|nodemailer)$/ }, args => ({ path: args.path, namespace: 'stub' }));
  b.onLoad({ filter: /.*/, namespace: 'stub' }, args => ({ contents: args.path === 'nodemailer'
    ? 'export default {createTransport:()=>({sendMail: mail => globalThis.testMail(mail)})};'
    : 'export const captureException=(...v)=>globalThis.testCapture(v);export const captureMessage=(...v)=>globalThis.testCapture(v);' }));
} }];
const settings = { bundle: true, platform: 'node', format: 'cjs', write: false, logLevel: 'silent', plugins };
const bundle = await build({ ...settings, entryPoints: ['src/lib/notifications.ts'] });
const routeBundle = await build({ ...settings, entryPoints: ['src/app/api/webhooks/cal/route.ts'] });
const info = { title: '<b>Demo</b>', name: '<img src=x onerror=alert(1)>', email: 'demo@example.test', startTime: '2026-09-11T12:00:00Z', endTime: '2026-09-11T12:30:00Z', status: 'created', notes: '<script>demo</script>' };
function harness(fail = false, destination = true, route = false, telegram = false) {
  const module = { exports: {} }; const mails = []; const logs = []; const captured = [];
  runInNewContext((route ? routeBundle : bundle).outputFiles[0].text, { module, exports: module.exports, require: createRequire(import.meta.url),
    Buffer, TextDecoder, Response, AbortSignal, setTimeout, clearTimeout,
    process: { env: { CALCOM_WEBHOOK_SECRET: 'synthetic-only', SMTP_HOST: 'synthetic.invalid', SMTP_USER: 'synthetic', SMTP_PASS: 'synthetic-only', ...(destination ? { CONTACT_TO_EMAIL: 'owner@example.test' } : {}), ...(telegram ? { TELEGRAM_BOT_TOKEN: 'synthetic-only', TELEGRAM_CHAT_ID: 'synthetic' } : {}) } },
    console: { log: (...v) => logs.push(v), warn: (...v) => logs.push(v), error: (...v) => logs.push(v) },
    fetch: async () => { if (telegram) return new Response('{}'); throw new Error('Network forbidden in test'); },
    testMail: async mail => { mails.push(mail); if (fail) throw new Error('synthetic private SMTP body'); return { accepted: ['owner@example.test'] }; },
    testCapture: value => captured.push(value),
  });
  return { send: module.exports.notifyBooking, post: module.exports.POST, mails, logs, captured };
}
test('booking SMTP template escapes person/title/notes and retains configured destination', async () => {
  const h = harness(); await h.send(info); assert.equal(h.mails.length, 1);
  assert.equal(h.mails[0].to, 'owner@example.test'); assert.equal(h.mails[0].replyTo, info.email);
  assert.equal(h.mails[0].html.includes('<img'), false); assert.equal(h.mails[0].html.includes('<script>'), false);
  assert.equal(h.mails[0].html.includes('&lt;img'), true); assert.equal(h.logs.length, 0);
});
test('provider errors export only finite booking channel diagnostics', async () => {
  const h = harness(true); await assert.rejects(h.send(info), /Booking notification delivery unavailable/); const diagnostics = JSON.stringify([h.logs, h.captured]);
  for (const prohibited of ['private', info.name, info.email, info.title]) assert.equal(diagnostics.includes(prohibited), false);
  assert.equal(h.logs.length, 1); assert.equal(h.captured.length, 1);
});
test('missing destination does not send to an unrelated default mailbox', async () => {
  const h = harness(false, false); await assert.rejects(h.send(info), /Booking notification delivery unavailable/); assert.equal(h.mails.length, 0);
});
test('a confirmed channel succeeds despite another channel failing', async () => {
  const h = harness(true, true, false, true); await h.send(info); assert.equal(h.mails.length, 1); assert.equal(h.captured.length, 1);
});
test('actual Cal route and notifier return503 when SMTP fails or no destination exists', async () => {
  const body = JSON.stringify({ triggerEvent: 'BOOKING_CREATED', createdAt: new Date().toISOString(), payload: { uid: 'synthetic', ...info, attendees: [{ name: 'Demo', email: info.email }] } });
  const request = () => new Request('https://opsolid.example/api/webhooks/cal', { method: 'POST', body, headers: { 'content-type': 'application/json', 'x-cal-signature-256': createHmac('sha256', 'synthetic-only').update(body).digest('hex') } });
  for (const [fail, destination] of [[true, true], [false, false]]) {
    const h = harness(fail, destination, true);
    assert.equal((await h.post(request())).status, 503); assert.equal((await h.post(request())).status, 503);
    assert.equal(h.mails.length, destination ? 1 : 0);
    assert.equal(JSON.stringify([h.logs, h.captured]).includes(info.email), false);
  }
  assert.equal((await harness(false, true, true).post(request())).status, 200);
});
