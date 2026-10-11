import assert from "node:assert/strict";
import test from "node:test";
import * as mod from "../../src/lib/redirects.ts";
const getRetiredRedirectTarget: (p: string) => string | null = (mod as any).getRetiredRedirectTarget ?? (mod as any).default.getRetiredRedirectTarget;

const SOLD_OUT = ["voice-agent", "whatsapp-agent", "chatbot-agent", "email-agent", "booking-agent", "lead-qualifier-agent", "custom-automation"];

test("retired product pages 301 to /ki-beratung (exact)", () => {
  for (const s of SOLD_OUT) {
    assert.equal(getRetiredRedirectTarget(`/products/${s}`), "/ki-beratung");
    assert.equal(getRetiredRedirectTarget(`/products/${s}/`), "/ki-beratung");
    assert.equal(getRetiredRedirectTarget(`/products/${s}/anything`), null);
  }
});

test("legacy card entry points go to /opso, exact only", () => {
  for (const p of ["/card/new", "/signup", "/products/digital-card"]) {
    assert.equal(getRetiredRedirectTarget(p), "/opso");
  }
});

test("working routes are never redirected", () => {
  for (const p of [
    "/card/edit/abc", "/card/manage/abc", "/card/new/step", "/products/digital-card/thanks",
    "/products/kutasia", "/c/slug", "/login", "/dashboard/cards", "/opso", "/ki-schulungen",
  ]) {
    assert.equal(getRetiredRedirectTarget(p), null, p);
  }
});
