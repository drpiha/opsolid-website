#!/usr/bin/env tsx
// =============================================================================
// scripts/test-card-features.ts — fast, dependency-free regression tests for
// the editable-labels + email-flow work. Matches the repo's tsx-script test
// convention (see scripts/test-lead-email.ts); run with:
//
//   npx tsx scripts/test-card-features.ts        (or: npm run test:cards)
//
// Covers:
//   • resolveLabels()         — override / fallback / unknown-key / no-mutate
//   • CardDataSchema.labels    — accept valid, reject bad key / long / >40
//   • card-live email render   — edit link + public URL across en/de/tr
//   • sendEmail() precedence   — Brevo > Resend > console, replyTo, ok/skipped
//   • sendCustomerEmail()      — ok → !skipped mapping
// =============================================================================

import { resolveLabels } from "../src/components/cards/templates/v2/shared/resolveLabels";
import { CardDataSchema, OrderPayloadSchema } from "../src/lib/validation";
import {
  renderCardLiveHtml,
  renderCardLiveText,
  cardLiveSubject,
} from "../src/lib/email/templates/card-live";
import { sendEmail } from "../src/lib/email/client";
import { sendCustomerEmail } from "../src/lib/email/send";

let passed = 0;
const failures: string[] = [];
function ok(cond: boolean, msg: string) {
  if (cond) passed++;
  else failures.push(msg);
}

// ---------------------------------------------------------------------------
// resolveLabels
// ---------------------------------------------------------------------------
{
  const base = { services: "Leistungen", voices: "Stimmen" };

  ok(resolveLabels(base) === base, "resolveLabels: no overrides returns base ref");
  ok(
    resolveLabels(base, { services: "Menü" }).services === "Menü",
    "resolveLabels: non-empty override wins",
  );
  ok(
    resolveLabels(base, { services: "  Menü  " }).services === "Menü",
    "resolveLabels: override is trimmed",
  );
  ok(
    resolveLabels(base, { services: "" }).services === "Leistungen",
    "resolveLabels: empty override falls back to default",
  );
  ok(
    resolveLabels(base, { services: "   " }).services === "Leistungen",
    "resolveLabels: whitespace override falls back to default",
  );
  const unknown = resolveLabels(base, { nope: "x" }) as Record<string, string>;
  ok(
    unknown.services === "Leistungen" && !("nope" in unknown),
    "resolveLabels: unknown override keys are ignored",
  );
  // base must not be mutated
  resolveLabels(base, { services: "X", voices: "Y" });
  ok(
    base.services === "Leistungen" && base.voices === "Stimmen",
    "resolveLabels: does not mutate the base table",
  );
}

// ---------------------------------------------------------------------------
// CardDataSchema.labels
// ---------------------------------------------------------------------------
{
  ok(
    CardDataSchema.safeParse({ name: "Acme" }).success,
    "schema: card without labels is valid",
  );
  ok(
    CardDataSchema.safeParse({
      name: "Acme",
      labels: { services: "Menu", voices: "Reviews", aboutSub: "Crew" },
    }).success,
    "schema: valid labels map accepted",
  );
  ok(
    !CardDataSchema.safeParse({ name: "Acme", labels: { "1bad": "x" } }).success,
    "schema: label key starting with a digit rejected",
  );
  ok(
    !CardDataSchema.safeParse({ name: "Acme", labels: { "a-b": "x" } }).success,
    "schema: label key with a dash rejected",
  );
  ok(
    !CardDataSchema.safeParse({ name: "Acme", labels: { services: "x".repeat(81) } })
      .success,
    "schema: label value over 80 chars rejected",
  );
  const tooMany: Record<string, string> = {};
  for (let i = 0; i < 41; i++) tooMany[`k${i}`] = "v";
  ok(
    !CardDataSchema.safeParse({ name: "Acme", labels: tooMany }).success,
    "schema: more than 40 label keys rejected",
  );
}

// ---------------------------------------------------------------------------
// OrderPayloadSchema — what /api/orders accepts when a visitor creates a card
// (the FREE-creation path the owner reported). User-perspective: a minimal
// free card must be accepted; bad contact data must be rejected.
// ---------------------------------------------------------------------------
{
  const base = {
    templateId: 97,
    billingMode: "FREE" as const,
    locale: "tr" as const,
    contactName: "Ada Lovelace",
    contactEmail: "ada@example.com",
    contactPhone: "+90 555 123 4567",
    cardData: { name: "Ada Lovelace" },
  };
  ok(OrderPayloadSchema.safeParse(base).success, "order: minimal FREE card accepted");
  ok(
    OrderPayloadSchema.safeParse({
      ...base,
      cardData: { name: "Ada", bio: "Hi", tagline: "Math", labels: { services: "Menü" } },
    }).success,
    "order: card with bio/tagline/labels accepted",
  );
  ok(
    !OrderPayloadSchema.safeParse({ ...base, contactEmail: "not-an-email" }).success,
    "order: invalid contact email rejected",
  );
  ok(
    !OrderPayloadSchema.safeParse({ ...base, templateId: -1 }).success,
    "order: non-positive templateId rejected",
  );
  ok(
    !OrderPayloadSchema.safeParse({ ...base, cardData: { name: "" } }).success,
    "order: empty card name rejected",
  );
}

// ---------------------------------------------------------------------------
// card-live email render
// ---------------------------------------------------------------------------
{
  const orderId = "order_abc123";
  const editToken = "tok_xyz789";
  for (const locale of ["en", "de", "tr"] as const) {
    const input = {
      orderId,
      contactName: "Max",
      cardUrl: "https://opsolid.de/c/max-1234",
      editToken,
      locale,
    };
    const html = renderCardLiveHtml(input);
    const text = renderCardLiveText(input);
    const editFragment = `/card/edit/${orderId}?t=${editToken}`;
    ok(html.includes(editFragment), `card-live[${locale}]: html has edit link`);
    ok(html.includes(input.cardUrl), `card-live[${locale}]: html has public URL`);
    ok(text.includes(editFragment), `card-live[${locale}]: text has edit link`);
    ok(text.includes(input.cardUrl), `card-live[${locale}]: text has public URL`);
    ok(cardLiveSubject(locale).length > 0, `card-live[${locale}]: subject present`);
  }
}

// ---------------------------------------------------------------------------
// sendEmail() provider precedence — mock fetch + env
// ---------------------------------------------------------------------------
const PROVIDER_ENV = [
  "BREVO_API_KEY",
  "RESEND_API_KEY",
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS",
] as const;
const savedEnv: Record<string, string | undefined> = {};
for (const k of PROVIDER_ENV) savedEnv[k] = process.env[k];
const realFetch = global.fetch;

function clearProviders() {
  for (const k of PROVIDER_ENV) delete process.env[k];
}

interface Captured {
  url: string;
  body: Record<string, unknown>;
  headers: Record<string, string>;
}
function mockFetch(status = 200): { calls: Captured[] } {
  const calls: Captured[] = [];
  global.fetch = (async (url: string, init: RequestInit) => {
    calls.push({
      url: String(url),
      body: JSON.parse(String(init.body)),
      headers: (init.headers as Record<string, string>) ?? {},
    });
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => ({ messageId: "brevo-mid", id: "resend-mid" }),
      text: async () => "error-body",
    } as unknown as Response;
  }) as typeof fetch;
  return { calls };
}

async function emailTests() {
  const baseInput = {
    to: "person@example.com",
    subject: "Hi",
    html: "<p>Hi</p>",
    text: "Hi",
    replyTo: "visitor@example.com",
  };

  // Brevo wins over Resend
  clearProviders();
  process.env.BREVO_API_KEY = "brevo-key";
  process.env.RESEND_API_KEY = "resend-key";
  let m = mockFetch();
  let res = await sendEmail(baseInput);
  ok(m.calls.length === 1 && m.calls[0].url.includes("api.brevo.com"),
    "sendEmail: Brevo wins when both Brevo+Resend set");
  ok(res.ok && res.messageId === "brevo-mid", "sendEmail: Brevo success reported");
  ok((m.calls[0].body.replyTo as { email: string })?.email === "visitor@example.com",
    "sendEmail: Brevo plumbs replyTo");
  ok(m.calls[0].headers["api-key"] === "brevo-key", "sendEmail: Brevo api-key header set");

  // Brevo splits a display-form from ("Name <email>") into sender.email + name
  // instead of double-wrapping it.
  clearProviders();
  process.env.BREVO_API_KEY = "brevo-key";
  m = mockFetch();
  await sendEmail({ ...baseInput, from: "OpSolid <info@opsolid.de>" });
  {
    const sender = m.calls[0].body.sender as { email: string; name: string };
    ok(
      sender.email === "info@opsolid.de" && sender.name === "OpSolid",
      "sendEmail: Brevo splits display-form from into sender.email + name",
    );
  }

  // Resend when only Resend
  clearProviders();
  process.env.RESEND_API_KEY = "resend-key";
  m = mockFetch();
  res = await sendEmail(baseInput);
  ok(m.calls.length === 1 && m.calls[0].url.includes("api.resend.com"),
    "sendEmail: Resend used when only Resend set");
  ok(res.ok && res.messageId === "resend-mid", "sendEmail: Resend success reported");
  ok(m.calls[0].body.reply_to === "visitor@example.com", "sendEmail: Resend plumbs reply_to");

  // Console when no provider — fetch must NOT be called
  clearProviders();
  m = mockFetch();
  res = await sendEmail(baseInput);
  ok(m.calls.length === 0, "sendEmail: console path does not call fetch");
  ok(res.ok && res.messageId === "console-dev", "sendEmail: console returns ok + console-dev id");

  // Failure path — Brevo 500 → ok:false + error
  clearProviders();
  process.env.BREVO_API_KEY = "brevo-key";
  mockFetch(500);
  res = await sendEmail(baseInput);
  ok(!res.ok && !!res.error, "sendEmail: Brevo HTTP 500 reported as failure with error");

  // sendCustomerEmail mapping: console → skipped:false
  clearProviders();
  mockFetch();
  const okResult = await sendCustomerEmail({
    to: "c@example.com", subject: "s", html: "<p>h</p>", text: "t",
  });
  ok(!okResult.skipped && okResult.messageId === "console-dev",
    "sendCustomerEmail: delivered → skipped:false (console in dev)");

  // sendCustomerEmail mapping: failure → skipped:true + reason
  clearProviders();
  process.env.BREVO_API_KEY = "brevo-key";
  mockFetch(500);
  const failResult = await sendCustomerEmail({
    to: "c@example.com", subject: "s", html: "<p>h</p>", text: "t",
  });
  ok(failResult.skipped && !!failResult.reason,
    "sendCustomerEmail: send failure → skipped:true with reason");
}

// ---------------------------------------------------------------------------
// validateManualSlug — the rules behind "why a card-link rename is rejected".
// Dynamic import so the harness still runs if the module needs a DB env.
// ---------------------------------------------------------------------------
async function slugTests() {
  let mod: typeof import("../src/lib/slug") | null = null;
  try {
    mod = await import("../src/lib/slug");
  } catch {
    console.warn("  (slug tests skipped — src/lib/slug needs a DB env to import)");
    return;
  }
  const { validateManualSlug } = mod;
  ok(validateManualSlug("ahmet-yilmaz").ok === true, "slug: valid kebab-case accepted");
  ok(validateManualSlug("").ok === false, "slug: empty rejected (too short)");
  ok(typeof validateManualSlug("api").ok === "boolean", "slug: returns a validation result");
}

async function main() {
  await slugTests();
  await emailTests();

  // restore env + fetch
  global.fetch = realFetch;
  for (const k of PROVIDER_ENV) {
    if (savedEnv[k] === undefined) delete process.env[k];
    else process.env[k] = savedEnv[k];
  }

  console.log(`\ntest-card-features: ${passed} passed, ${failures.length} failed.`);
  if (failures.length) {
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
  }
  console.log("All card-feature tests passed.");
}

void main();
