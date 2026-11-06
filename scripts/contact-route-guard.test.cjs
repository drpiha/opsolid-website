// No provider, DNS, HTTP, SMTP or Sentry traffic: execute the actual TypeScript
// modules with an allowlisted CommonJS loader and synthetic dependencies/env.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { NextRequest } = require('next/server');

const root = path.resolve(__dirname, '..');
const valid = { name: 'Demo Visitor', email: 'visitor@example.test', message: 'Synthetic inquiry' };
const smtpEnv = { CONTACT_TO_EMAIL: 'inbox@example.test', SMTP_HOST: 'smtp.example.test', SMTP_USER: 'sender@example.test', SMTP_PASS: 'synthetic-only' };

function harness({ env = smtpEnv, delivery = async () => ({ ok: true }), realEmail = false, smtpSend, smtpSetup, httpResponse, httpError, fakeTimers = false, componentState = [], locale } = {}) {
  const deliveries = [], logs = [], sentry = [], transports = [], requests = [];
  const cache = new Map();
  const clock = { now: 1_000_000 };
  const timers = new Map();
  const timerDurations = new Map();
  let timerId = 0;
  let stateIndex = 0;
  const states = [];
  class FixedDate extends Date {
    constructor(...args) { super(...(args.length ? args : [clock.now])); }
    static now() { return clock.now; }
  }
  function load(relative) {
    if (cache.has(relative)) return cache.get(relative);
    const filename = path.join(root, relative);
    const source = fs.readFileSync(filename, 'utf8');
    const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    const module = { exports: {} };
    cache.set(relative, module.exports);
    const safeRequire = (id) => {
      if (id === '@/lib/email/client') return realEmail ? load('src/lib/email/client.ts') : {
        hasEmailProvider: () => Boolean(env.BREVO_API_KEY || env.RESEND_API_KEY || (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS)),
        sendEmail: async (input) => { deliveries.push(input); return delivery(input); },
      };
      if (id === '@/lib/email/shell') return load('src/lib/email/shell.ts');
      if (id === '@/lib/contact-guard') return load('src/lib/contact-guard.ts');
      if (id === '@/lib/contact-ack') return load('src/lib/contact-ack.ts');
      if (id === '@/lib/constants') return load('src/lib/constants.ts');
      if (id === 'react') return { useState(initial) {
        const index = stateIndex++;
        states[index] = componentState[index] === undefined ? initial : componentState[index];
        return [states[index], (value) => { states[index] = value; }];
      } };
      if (id === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
      if (id === '@/context/LocaleContext') return { useLocale: () => ({ t: locale }), useLocaleBase: () => ({ locale: 'de', setLocale() {} }) };
      if (id === '@/components/shared/Icon') return { Icon: 'icon' };
      if (id === '@/components/shared/LocaleLink') return { LocaleLink: 'a' };
      if (id === './ContactChannels') return { ContactChannels: 'contact-channels' };
      if (id === '@sentry/nextjs') return { captureException: (...args) => sentry.push(args) };
      if (id === 'nodemailer') return { __esModule: true, default: { createTransport: (options) => {
        if (smtpSetup) smtpSetup();
        transports.push(options);
        return { sendMail: async (input) => { deliveries.push(input); return smtpSend ? smtpSend(input) : { messageId: 'synthetic-message' }; } };
      } } };
      if (['next/server', 'zod', 'node:crypto', 'node:net'].includes(id)) return require(id);
      throw new Error(`Unexpected module dependency: ${id}`);
    };
    const context = vm.createContext({ module, exports: module.exports, require: safeRequire,
      process: { env: { NODE_ENV: 'production', ...env } }, Date: FixedDate,
      TextDecoder, TextEncoder, Uint8Array, AbortController, ReadableStream,
      FormData: class { constructor(form) { this.fields = form.fields; } get(key) { return this.fields[key] ?? null; } },
      setTimeout: fakeTimers ? (fn, ms) => { timers.set(++timerId, fn); timerDurations.set(timerId, ms); return timerId; } : setTimeout,
      clearTimeout: fakeTimers ? (id) => { timers.delete(id); timerDurations.delete(id); } : clearTimeout, Buffer,
      console: Object.fromEntries(['log', 'warn', 'error'].map((level) => [level, (...args) => logs.push([level, ...args])])),
      fetch: async (url, options) => { requests.push({ url, options }); if (httpError) throw httpError; if (httpResponse) return httpResponse(); throw new Error('Unstubbed network attempt'); },
    });
    new vm.Script(compiled, { filename }).runInContext(context);
    return module.exports;
  }
  const route = () => load('src/app/api/contact/route.ts');
  async function post(body = valid, { headers, raw, stream } = {}) {
    const request = new NextRequest('https://example.test/api/contact', {
      method: 'POST', headers: { 'content-type': 'application/json', ...headers },
      body: stream || (raw !== undefined ? raw : JSON.stringify(body)), ...(stream ? { duplex: 'half' } : {}),
    });
    return route().POST(request);
  }
  return { post, load, deliveries, logs, sentry, transports, requests, clock, timers, timerDurations, states };
}

test('valid legacy contact payload delivers exactly once, escapes HTML and keeps Reply-To', async () => {
  const h = harness();
  const response = await h.post({ ...valid, name: '  Demo <Visitor>  ', company: 'A & B', source: 'digital-card-custom', teamSize: '2 – 10', message: '<script>synthetic</script>\nsecond line' });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
  assert.equal(h.deliveries.length, 1);
  assert.equal(h.deliveries[0].replyTo, valid.email);
  assert.match(h.deliveries[0].html, /&lt;script&gt;/);
  assert.doesNotMatch(h.deliveries[0].html, /<script>/);
  assert.match(h.deliveries[0].text, /Team size: 2 – 10/);
  assert.equal(h.logs.length, 0);
});

test('rejects invalid JSON shapes, field types, missing fields and header controls without delivery', async () => {
  const cases = [null, [], 'payload', { ...valid, name: {} }, { ...valid, message: [] }, { ...valid, company: true }, { ...valid, name: '   ' }, { ...valid, email: 'invalid' }, { ...valid, name: 'Name\r\nBcc: injected' }, { ...valid, company: 'Co\nHeader' }, { ...valid, source: 'a'.repeat(65) }, { ...valid, teamSize: {} }, { ...valid, topics: ['a'.repeat(65)] }, { ...valid, phone: {} }, { ...valid, name: 'n'.repeat(121) }, { ...valid, message: 'm'.repeat(10001) }];
  for (const body of cases) {
    const h = harness();
    assert.equal((await h.post(body)).status, 400);
    assert.equal(h.deliveries.length, 0);
    assert.equal(h.logs.length, 0);
  }
});

test('malformed JSON, non-JSON content type and oversized body fail before sending', async () => {
  for (const [options, status] of [[{ raw: '{' }, 400], [{ headers: { 'content-type': 'text/plain' } }, 415], [{ raw: ' '.repeat(65537) }, 413], [{ headers: { 'content-length': '65537' } }, 413]]) {
    const h = harness();
    assert.equal((await h.post(valid, options)).status, status);
    assert.equal(h.deliveries.length, 0);
    assert.equal(h.logs.length, 0);
  }
});

test('honeypot is generically accepted without any delivery even when provider is absent', async () => {
  for (const env of [{}, smtpEnv]) {
    const h = harness({ env });
    const response = await h.post({ website: 'https://bot.example.test' });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true });
    assert.equal(h.deliveries.length, 0);
    // One line with the field name only: no value, no sender.
    assert.equal(JSON.stringify(h.logs), JSON.stringify([['warn', '[contact] honeypot hit', { field: 'website' }]]));
  }
});

test('the v7 trap field hp_blank works like the website trap, logs once per window and lets a blank trap through', async () => {
  const h = harness();
  for (let i = 0; i < 3; i++) {
    const response = await h.post({ ...valid, hp_blank: 'filled by a bot' });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true });
  }
  assert.equal(h.deliveries.length, 0);
  assert.equal(JSON.stringify(h.logs), JSON.stringify([['warn', '[contact] honeypot hit', { field: 'hp_blank' }]]));
  assert.equal((await h.post({ ...valid, hp_blank: '  ', website: '' })).status, 200);
  assert.equal(h.deliveries.length, 1);
});

test('missing destination, missing provider and partial SMTP configuration return503', async () => {
  for (const env of [{}, { CONTACT_TO_EMAIL: 'inbox@example.test' }, { SMTP_HOST: 'smtp.example.test', SMTP_USER: 'sender@example.test', SMTP_PASS: 'synthetic' }, { CONTACT_TO_EMAIL: 'inbox@example.test', SMTP_HOST: 'smtp.example.test', SMTP_USER: 'sender@example.test' }]) {
    const h = harness({ env });
    assert.equal((await h.post()).status, 503);
    assert.equal(h.deliveries.length, 0);
    assert.equal(h.logs.length, 0);
  }
});

test('failed or thrown delivery produces only a generic503 response and no raw logs', async () => {
  for (const delivery of [async () => ({ ok: false, error: 'PRIVATE_PROVIDER_BODY' }), async () => { throw new Error('PRIVATE_PROVIDER_BODY'); }]) {
    const h = harness({ delivery });
    const response = await h.post();
    assert.equal(response.status, 503);
    assert.doesNotMatch(await response.text(), /PRIVATE_PROVIDER_BODY/);
    assert.equal(h.deliveries.length, 1);
    assert.equal(h.logs.length, 0);
  }
});

test('real email client without any provider fails without logging message contents', async () => {
  const h = harness({ env: {}, realEmail: true });
  const result = await h.load('src/lib/email/client.ts').sendEmail({ to: 'recipient@example.test', subject: 'PRIVATE_SUBJECT', text: 'PRIVATE_BODY', html: 'PRIVATE_BODY' });
  assert.equal(result.ok, false);
  assert.equal(result.error, 'provider_unavailable');
  assert.doesNotMatch(JSON.stringify(h.logs), /PRIVATE_|recipient@example/);
  assert.equal(h.requests.length + h.transports.length + h.sentry.length, 0);
});

test('actual route and actual email client preserve configured SMTP dispatch with a stub transport', async () => {
  const h = harness({ realEmail: true });
  assert.equal((await h.post()).status, 200);
  assert.equal(h.transports.length, 1);
  assert.equal(h.deliveries.length, 1);
  assert.equal(h.deliveries[0].replyTo, valid.email);
  assert.equal(h.requests.length, 0);
});

test('SMTP failure logs/capture/results contain only finite diagnostics', async () => {
  const h = harness({ realEmail: true, smtpSend: async () => { throw new Error('PRIVATE_BODY recipient@example.test'); } });
  assert.equal((await h.post()).status, 503);
  assert.equal(h.sentry.length, 1);
  const diagnostics = JSON.stringify([h.logs, h.sentry.map(([error, context]) => [error.message, context])]);
  assert.doesNotMatch(diagnostics, /PRIVATE_|recipient@example|visitor@example/);
  assert.match(diagnostics, /smtp/);
});

test('HTTP provider failure never reads/exports provider response bodies', async () => {
  for (const key of ['BREVO_API_KEY', 'RESEND_API_KEY']) {
    let bodyReads = 0;
    let cancelled = 0;
    const h = harness({ realEmail: true, env: { CONTACT_TO_EMAIL: 'inbox@example.test', [key]: 'synthetic-only' }, httpResponse: () => ({ ok: false, status: 401, body: { cancel: async () => { cancelled++; } }, text: async () => { bodyReads++; return 'PRIVATE_PROVIDER_BODY'; } }) });
    assert.equal((await h.post()).status, 503);
    assert.equal(bodyReads, 0);
    assert.equal(cancelled, 1);
    assert.equal(h.requests.length, 1);
    assert.equal(h.sentry.length, 1);
    assert.doesNotMatch(JSON.stringify([h.logs, h.sentry]), /PRIVATE_|visitor@example|inbox@example/);
  }
});

test('global quota counts malformed/bot submissions and spoofed forwarding headers cannot bypass it', async () => {
  const h = harness();
  for (let i = 0; i < 30; i++) {
    assert.equal((await h.post({ website: 'bot' }, { headers: { 'x-forwarded-for': `192.0.2.${i}`, 'x-real-ip': `198.51.100.${i}` } })).status, 200);
  }
  const blocked = await h.post(valid, { headers: { 'x-forwarded-for': '203.0.113.1' } });
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers.get('retry-after'), '600');
  assert.equal(h.deliveries.length, 0);
  h.clock.now += 600_000;
  assert.equal((await h.post()).status, 200);
  assert.equal(h.deliveries.length, 1);
});

test('rate-limited requests do not consume request bodies', async () => {
  const h = harness();
  for (let i = 0; i < 30; i++) await h.post(null);
  const response = await h.post(valid, { headers: { 'content-type': 'text/plain' } });
  assert.equal(response.status, 429);
  assert.equal(h.deliveries.length, 0);
});

test('actual route limits concurrent sends and releases permits after failure', async () => {
  const waits = [];
  const h = harness({ delivery: () => new Promise((resolve) => waits.push(resolve)) });
  const active = Array.from({ length: 4 }, () => h.post());
  // A finite microtask drain lets the four synthetic request streams reach send.
  for (let i = 0; i < 30 && waits.length < 4; i++) await Promise.resolve();
  assert.equal(waits.length, 4);
  const blocked = await h.post();
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers.get('retry-after'), '10');
  waits.forEach((resolve) => resolve({ ok: false }));
  assert.deepEqual((await Promise.all(active)).map((response) => response.status), [503, 503, 503, 503]);
  assert.equal((await h.post(null)).status, 400);
  assert.equal(h.deliveries.length, 4);
});

test('limiter release is idempotent and a new time window cannot evade active request cap', () => {
  const h = harness();
  const limiter = h.load('src/lib/contact-guard.ts').createContactLimiter(() => h.clock.now);
  const permits = Array.from({ length: 4 }, () => limiter.acquire());
  assert.ok(permits.every((permit) => permit.allowed));
  h.clock.now += 600_000;
  assert.equal(limiter.acquire().allowed, false);
  permits[0].release();
  permits[0].release();
  assert.equal(limiter.acquire().allowed, true);
  assert.equal(limiter.acquire().allowed, false);
});

test('streamed byte cap cannot be bypassed with a false Content-Length', async () => {
  let cancelled = false;
  const h = harness();
  let chunks = 0;
  const stream = new ReadableStream({
    pull(controller) { chunks++; controller.enqueue(new Uint8Array(32769)); },
    cancel() { cancelled = true; },
  });
  const response = await h.post(valid, { stream, headers: { 'content-length': '1' } });
  assert.equal(response.status, 413);
  assert.equal(cancelled, true);
  assert.ok(chunks <= 4);
  assert.equal(h.deliveries.length, 0);
});

test('malformed UTF-8 and interrupted body streams fail without delivery', async () => {
  for (const stream of [
    new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array([0xff])); controller.close(); } }),
    new ReadableStream({ start(controller) { controller.error(new Error('PRIVATE_STREAM_DETAIL')); } }),
  ]) {
    const h = harness();
    const response = await h.post(valid, { stream });
    assert.equal(response.status, 400);
    assert.doesNotMatch(await response.text(), /PRIVATE_/);
    assert.equal(h.deliveries.length + h.logs.length, 0);
  }
});

test('slow body times out deterministically, cancels its stream and releases capacity', async () => {
  let cancelled = false;
  const h = harness({ fakeTimers: true });
  const active = h.post(valid, { stream: new ReadableStream({ cancel() { cancelled = true; } }) });
  assert.equal(h.timers.size, 1);
  for (const callback of h.timers.values()) callback();
  assert.equal((await active).status, 408);
  assert.equal(h.timers.size, 0);
  assert.equal(cancelled, true);
  assert.equal((await h.post()).status, 200);
});

test('all three existing payload shapes and blank honeypots remain supported', async () => {
  for (const payload of [
    { ...valid, company: '', phone: '+49 123 456', topics: ['automation'], website: '' },
    { name: 'Journal subscriber', email: valid.email, message: 'Subscribe to the journal.', topics: ['journal-subscribe'], website: '' },
    { ...valid, source: 'digital-card-custom', teamSize: '2 – 10', company: 'Demo', website: '  ' },
  ]) {
    const h = harness();
    assert.equal((await h.post(payload)).status, 200);
    assert.equal(h.deliveries.length, 1);
  }
});

test('Brevo and Resend network exceptions produce finite errors without raw contents', async () => {
  for (const key of ['BREVO_API_KEY', 'RESEND_API_KEY']) {
    const h = harness({ realEmail: true, env: { CONTACT_TO_EMAIL: 'inbox@example.test', [key]: 'synthetic-only' }, httpError: new Error('PRIVATE_EXCEPTION sender@example.test') });
    assert.equal((await h.post()).status, 503);
    assert.doesNotMatch(JSON.stringify([h.logs, h.sentry]), /PRIVATE_|sender@example|visitor@example|inbox@example/);
    assert.equal(h.requests.length, 1);
  }
});

test('SMTP setup exceptions are sanitized by the shared client itself', async () => {
  const h = harness({ realEmail: true, smtpSetup: () => { throw new Error('PRIVATE_SMTP_SETUP'); } });
  const result = await h.load('src/lib/email/client.ts').sendEmail({ to: 'recipient@example.test', subject: 'PRIVATE_SUBJECT', text: 'PRIVATE_BODY', html: 'PRIVATE_BODY' });
  assert.equal(result.ok, false);
  assert.equal(result.error, 'smtp_transport_failed');
  assert.doesNotMatch(JSON.stringify([h.logs, h.sentry]), /PRIVATE_|recipient@example/);
});

function descendants(node) {
  if (!node || typeof node !== 'object') return [];
  if (Array.isArray(node)) return node.flatMap(descendants);
  return [node, ...descendants(node.props?.children)];
}

test('actual form components (v4 contact form, OpSo custom request) submit their honeypot, with no UI-copy replacement', async () => {
  const customCopy = { options: [], channels: { labels: {} }, form: { teamSizeOptions: [] } };
  const cases = [
    ['src/components/v4/ContactForm4.tsx', 'ContactForm4', [], undefined],
    ['src/components/products/digital-card/CustomRequestSection.tsx', 'CustomRequestSection', ['Demo Visitor', 'visitor@example.test', '', '', '', 'Synthetic inquiry', true], { v2: { digitalCard: { customRequest: customCopy } } }],
  ];
  for (const [file, component, componentState, locale] of cases) {
    const h = harness({ componentState, locale, httpResponse: () => ({ ok: true }) });
    const nodes = descendants(h.load(file)[component]());
    const form = nodes.find((node) => node.type === 'form');
    const trap = nodes.find((node) => node.type === 'input' && node.props.name === 'website');
    assert.ok(form && trap);
    assert.equal(trap.props.tabIndex, -1);
    assert.equal(trap.props.autoComplete, 'off');
    // The trap's wrapper is removed from view and from assistive technology: `hidden`, or aria-hidden off-screen.
    const wrapper = nodes.find((node) => node.props?.children === trap || (Array.isArray(node.props?.children) && node.props.children.includes(trap)));
    assert.ok(wrapper.props.hidden === true || (wrapper.props['aria-hidden'] === 'true' && wrapper.props.style?.position === 'absolute'));
    let resets = 0;
    const event = { preventDefault() {}, currentTarget: { fields: { ...valid, website: 'https://bot.example.test' }, reset() { resets++; } } };
    const pending = form.props.onSubmit(event);
    // React clears currentTarget after the synchronous event callback.
    event.currentTarget = null;
    await pending;
    assert.equal(h.requests.length, 1);
    assert.equal(JSON.parse(h.requests[0].options.body).website, 'https://bot.example.test');
    if (component === 'ContactForm4') {
      assert.equal(resets, 1);
      assert.equal(h.states[1], 'ok');
    }
  }
});

test('actual main contact form (v4) retains entered fields and shows its error state on503', async () => {
  const h = harness({ httpResponse: () => ({ ok: false, status: 503 }) });
  const form = descendants(h.load('src/components/v4/ContactForm4.tsx').ContactForm4()).find((node) => node.type === 'form');
  let resets = 0;
  await form.props.onSubmit({ preventDefault() {}, currentTarget: { fields: valid, reset() { resets++; } } });
  assert.equal(resets, 0);
  assert.equal(h.states[1], 'err');
  assert.equal(h.requests.length, 1);
  assert.equal(JSON.parse(h.requests[0].options.body).email, valid.email);
});

test('successful HTTP headers cannot escape the total deadline while their JSON body stalls', async () => {
  for (const key of ['BREVO_API_KEY', 'RESEND_API_KEY']) {
    let bodyStarted = 0;
    let cancelled = 0;
    const h = harness({ realEmail: true, fakeTimers: true, env: { CONTACT_TO_EMAIL: 'inbox@example.test', [key]: 'synthetic-only' }, httpResponse: () => ({ ok: true, status: 202, body: { cancel: async () => { cancelled++; } }, json: () => { bodyStarted++; return new Promise(() => {}); } }) });
    const active = Array.from({ length: 4 }, () => h.post());
    for (let i = 0; i < 60 && bodyStarted < 4; i++) await Promise.resolve();
    assert.equal(bodyStarted, 4);
    assert.equal(h.timers.size, 4, 'the four provider deadlines must remain active through JSON consumption');
    assert.ok([...h.timerDurations.values()].every((ms) => ms === 10_000));
    assert.equal((await h.post()).status, 429);
    for (const callback of [...h.timers.values()]) callback();
    assert.deepEqual((await Promise.all(active)).map((response) => response.status), [503, 503, 503, 503]);
    assert.equal(h.timers.size, 0);
    assert.equal(cancelled, 4);
    assert.ok(h.requests.every(({ options }) => options.signal.aborted));
    assert.equal((await h.post(null)).status, 400, 'timed-out sends must release all active route permits');
    assert.doesNotMatch(JSON.stringify(h.logs), /visitor@example|inbox@example/);
  }
});

test('normal HTTP responses retain provider message IDs and clear their deadlines', async () => {
  for (const [key, data] of [['BREVO_API_KEY', { messageId: 'synthetic-brevo-id' }], ['RESEND_API_KEY', { id: 'synthetic-resend-id' }]]) {
    const h = harness({ realEmail: true, fakeTimers: true, env: { [key]: 'synthetic-only' }, httpResponse: () => ({ ok: true, status: 200, json: async () => data }) });
    const result = await h.load('src/lib/email/client.ts').sendEmail({ to: 'recipient@example.test', subject: 'Synthetic', html: 'Synthetic', text: 'Synthetic' });
    assert.equal(result.ok, true);
    assert.equal(result.messageId, data.messageId || data.id);
    assert.equal(h.timers.size, 0);
  }
});

test('SMTP uses finite DNS, connection, greeting and idle-socket timeouts', async () => {
  const h = harness({ realEmail: true });
  assert.equal((await h.post()).status, 200);
  const options = h.transports[0];
  for (const key of ['dnsTimeout', 'connectionTimeout', 'greetingTimeout', 'socketTimeout']) {
    assert.ok(Number.isFinite(options[key]) && options[key] > 0 && options[key] <= 30_000, `${key} must be explicitly finite`);
  }
  assert.equal(options.port, 587);
  assert.equal(options.secure, false);
});

test('a transport returning headers after timeout cannot begin a late body read', async () => {
  let deliverHeaders;
  let bodyReads = 0;
  let cancelled = 0;
  const h = harness({ realEmail: true, fakeTimers: true, env: { CONTACT_TO_EMAIL: 'inbox@example.test', BREVO_API_KEY: 'synthetic-only' }, httpResponse: () => new Promise((resolve) => { deliverHeaders = resolve; }) });
  const pending = h.post();
  for (let i = 0; i < 60 && !deliverHeaders; i++) await Promise.resolve();
  assert.equal(typeof deliverHeaders, 'function');
  for (const callback of [...h.timers.values()]) callback();
  assert.equal((await pending).status, 503);
  deliverHeaders({ ok: true, body: { cancel: async () => { cancelled++; } }, json: async () => { bodyReads++; return {}; } });
  for (let i = 0; i < 12; i++) await Promise.resolve();
  assert.equal(bodyReads, 0);
  assert.equal(cancelled, 1);
  assert.equal(h.timers.size, 0);
});

// Trainer applications (PR #59 follow-up): the route wiring around src/lib/contact-ack.ts.
const trainerBody = {
  name: 'Demo Trainer', email: 'applicant@example.test', message: 'Synthetic profile', source: 'v7-contact-en',
  topics: ['Becoming a trainer'],
  trainer: { topics: ['copilot', 'grundlagen'], languages: 'DE, EN', region: 'DE, CET', link: 'https://example.test/profile', consent: true },
};
const ackEnv = { ...smtpEnv, CONTACT_TRAINER_ACK: 'on' };
const settle = async () => { for (let i = 0; i < 5; i++) await new Promise((resolve) => setImmediate(resolve)); };

test('trainer application with the flag off: one tagged owner mail with all fields, no acknowledgement', async () => {
  const h = harness({ env: { ...smtpEnv, CONTACT_TRAINER_ACK: 'off' } });
  const response = await h.post(trainerBody);
  await settle();
  assert.equal(response.status, 200);
  assert.equal(h.deliveries.length, 1);
  const owner = h.deliveries[0];
  assert.equal(owner.to, 'inbox@example.test');
  assert.match(owner.subject, /^\[Trainer\] Application from Demo Trainer/);
  for (const line of ['Trainer application:', 'Topics: Microsoft 365 Copilot, KI-Kompetenz, Datenschutz und Regeln', 'Languages: DE, EN', 'Country and time zone: DE, CET', 'Profile or work sample: https://example.test/profile', 'Fee expectation: Not provided', 'Privacy notice read: yes']) {
    assert.ok(owner.text.includes(line), line);
  }
});

test('trainer application with the flag on: owner mail first, then one fixed acknowledgement, once per mailbox', async () => {
  const h = harness({ env: ackEnv });
  assert.equal((await h.post(trainerBody)).status, 200);
  await settle();
  assert.equal(h.deliveries.length, 2);
  const [owner, ack] = h.deliveries;
  assert.equal(owner.to, 'inbox@example.test');
  assert.equal(ack.to, 'applicant@example.test');
  assert.equal(ack.replyTo, 'info@opsolid.de');
  assert.equal(ack.headers['Auto-Submitted'], 'auto-generated');
  assert.doesNotMatch(`${ack.subject}${ack.text}${ack.html}`, /Demo Trainer|Synthetic profile|example\.test/);
  assert.equal((await h.post({ ...trainerBody, email: 'Applicant+2@example.test' })).status, 200);
  await settle();
  assert.equal(h.deliveries.length, 3, 'second application from the same mailbox: owner mail only');
});

test('trainer application without the flag: the acknowledgement is on by default', async () => {
  const h = harness();
  assert.equal((await h.post(trainerBody)).status, 200);
  await settle();
  assert.equal(h.deliveries.length, 2);
  assert.equal(h.deliveries[1].to, 'applicant@example.test');
});

test('a plain inquiry never triggers the acknowledgement, even with the flag on', async () => {
  const h = harness({ env: ackEnv });
  assert.equal((await h.post()).status, 200);
  await settle();
  assert.equal(h.deliveries.length, 1);
  assert.match(h.deliveries[0].subject, /^New inquiry from/);
});

test('honeypot, failed owner mail and invalid trainer fields send no acknowledgement', async () => {
  let h = harness({ env: ackEnv });
  assert.equal((await h.post({ ...trainerBody, website: 'bot' })).status, 200);
  await settle();
  assert.equal(h.deliveries.length, 0);

  h = harness({ env: ackEnv, delivery: async () => ({ ok: false }) });
  assert.equal((await h.post(trainerBody)).status, 503);
  await settle();
  assert.equal(h.deliveries.length, 1, 'only the failed owner mail was attempted');

  for (const trainer of [{ ...trainerBody.trainer, consent: false }, { ...trainerBody.trainer, link: 'javascript:alert(1)' }, { ...trainerBody.trainer, topics: [] }, { ...trainerBody.trainer, topics: ['other'] }, { ...trainerBody.trainer, languages: ' ' }]) {
    h = harness({ env: ackEnv });
    assert.equal((await h.post({ ...trainerBody, trainer })).status, 400);
    await settle();
    assert.equal(h.deliveries.length, 0);
  }
});

test('a failing acknowledgement never changes the answer to the visitor', async () => {
  let calls = 0;
  const h = harness({ env: ackEnv, delivery: async () => (++calls === 1 ? { ok: true } : { ok: false }) });
  assert.equal((await h.post(trainerBody)).status, 200);
  await settle();
  assert.equal(h.deliveries.length, 2);
  assert.equal(h.logs.length, 0);
});

test('inquiry subjects carry a tag per known topic key, unknown keys are ignored', async () => {
  const h = harness();
  assert.equal((await h.post({ ...valid, kinds: ['ki-check', 'schulung', 'unknown-key'] })).status, 200);
  assert.match(h.deliveries[0].subject, /^\[KI-Check \+ Schulung\] New inquiry from Demo Visitor/);
  const plain = harness();
  assert.equal((await plain.post(valid)).status, 200);
  assert.match(plain.deliveries[0].subject, /^New inquiry from Demo Visitor/);
  const bad = harness();
  assert.equal((await bad.post({ ...valid, kinds: ['x\nBcc: y'] })).status, 400);
  assert.equal(bad.deliveries.length, 0);
});

test('a 300-character link typed without a scheme still passes after the form adds https://', async () => {
  const typed = `${'a'.repeat(297)}.de`; // the field's maxLength, typed without a scheme
  const link = `https://${typed}`; // what the form sends
  assert.equal(typed.length, 300);
  assert.equal(link.length, 308);
  const h = harness();
  assert.equal((await h.post({ ...trainerBody, trainer: { ...trainerBody.trainer, link } })).status, 200);
  assert.equal((await harness().post({ ...trainerBody, trainer: { ...trainerBody.trainer, link: `${link}x` } })).status, 400);
});
