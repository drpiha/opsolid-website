import assert from "node:assert/strict";
import test from "node:test";
import * as formMod from "../../src/content/v7/form.ts";
import * as feedbackMod from "../../src/lib/contact-feedback.ts";

// tsx exposes the CommonJS namespace here, as in the other .mts tests.
const { FORM } = ((formMod as { default?: unknown }).default ?? formMod) as typeof import("../../src/content/v7/form.ts");
const { MAX_WAIT_MINUTES, sendFailure } = ((feedbackMod as { default?: unknown }).default ??
  feedbackMod) as typeof import("../../src/lib/contact-feedback.ts");

test("429 names the wait in whole minutes, rounded up and capped at the window", () => {
  assert.deepEqual(sendFailure(429, "559"), { kind: "busy", minutes: 10 });
  assert.deepEqual(sendFailure(429, "61"), { kind: "busy", minutes: 2 });
  assert.deepEqual(sendFailure(429, "60"), { kind: "busy", minutes: 1 });
  assert.deepEqual(sendFailure(429, "10"), { kind: "busy", minutes: 1 });
  assert.deepEqual(sendFailure(429, "99999"), { kind: "busy", minutes: MAX_WAIT_MINUTES });
});

test("429 without a usable Retry-After falls back to the full window", () => {
  for (const h of [null, "", "soon", "-5", "0", "1.5", "Fri, 07 Nov 2026 18:00:00 GMT"]) {
    assert.deepEqual(sendFailure(429, h), { kind: "busy", minutes: MAX_WAIT_MINUTES }, String(h));
  }
});

test("content rejections and delivery failures get their own message", () => {
  for (const s of [400, 413, 415]) assert.deepEqual(sendFailure(s, null), { kind: "invalid" });
  for (const s of [null, 408, 500, 502, 503, 504]) assert.deepEqual(sendFailure(s, null), { kind: "down" });
});

test("every failure message offers the address and every busy message names the wait, in de/en/tr", () => {
  for (const [loc, t] of Object.entries(FORM)) {
    for (const k of ["failBusy", "failInvalid", "failDown"] as const) {
      assert.equal(t[k].split("{mail}").length, 2, `${loc} ${k}: exactly one {mail}`);
    }
    assert.ok(t.failBusy.includes("{wait}"), `${loc} failBusy: {wait}`);
    assert.ok(!t.failInvalid.includes("{wait}") && !t.failDown.includes("{wait}"), `${loc}: {wait} only in failBusy`);
    assert.ok(t.waitMinutes[1].includes("{n}") && !t.waitMinutes[0].includes("{n}"), `${loc} waitMinutes`);
    assert.ok(t.failH.trim().length > 0, `${loc} failH`);
  }
});

// The form resets only after a successful send, so every failure notice may (and does) say the typed values stay.
test("every failure notice says the typed values were kept, in de/en/tr", () => {
  const kept: Record<string, string> = {
    de: "Ihre Eingaben bleiben erhalten.",
    en: "Nothing you typed has been lost.",
    tr: "Girdiğiniz bilgiler korundu.",
  };
  for (const [loc, t] of Object.entries(FORM)) {
    for (const k of ["failBusy", "failInvalid", "failDown"] as const) assert.ok(t[k].includes(kept[loc]), `${loc} ${k}`);
  }
});
