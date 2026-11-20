import assert from "node:assert/strict";
import { test } from "node:test";

import * as studioMod from "../../src/lib/opso-web/card-studio.ts";

type Mod = typeof import("../../src/lib/opso-web/card-studio.ts");
const mod = ((studioMod as unknown as { default?: Mod }).default ?? studioMod) as Mod;
const { smallJson, limiter } = mod;

const post = (body: BodyInit, headers: Record<string, string> = {}) =>
  new Request("https://opsolid.de/api/opso/card-preview", { method: "POST", body, headers, duplex: "half" } as RequestInit);

test("smallJson reads a small JSON body", async () => {
  assert.deepEqual(await smallJson(post(JSON.stringify({ name: "Clara Weber" }))), { name: "Clara Weber" });
});

test("smallJson refuses what is not JSON and an empty body", async () => {
  assert.equal(await smallJson(post("not json")), null);
  assert.equal(await smallJson(post("")), null);
});

test("smallJson refuses a declared length over the limit without reading", async () => {
  let pulled = 0;
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      pulled++;
      controller.enqueue(new TextEncoder().encode("x".repeat(1024)));
    },
  });
  assert.equal(await smallJson(post(body, { "content-length": "5000000" }), 4096), null);
  assert.ok(pulled <= 1, "the stream was not drained");
});

test("smallJson stops reading a stream that grows past the limit", async () => {
  let sent = 0;
  let cancelled = false;
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      sent += 1024;
      controller.enqueue(new TextEncoder().encode("x".repeat(1024)));
    },
    cancel() {
      cancelled = true;
    },
  });
  assert.equal(await smallJson(post(body), 4096), null);
  assert.ok(sent <= 16 * 1024, `read ${sent} bytes of an endless body`);
  assert.equal(cancelled, true);
});

test("smallJson counts bytes, not characters", async () => {
  const text = JSON.stringify({ name: "ü".repeat(60) });
  assert.equal(await smallJson(post(text), 100), null);
  assert.deepEqual(await smallJson(post(text), 200), { name: "ü".repeat(60) });
});

test("the limiter allows max calls per window and client, then refuses until the window ends", () => {
  const limited = limiter(3, 1000);
  assert.deepEqual([limited("a", 0), limited("a", 1), limited("a", 2), limited("a", 3)], [false, false, false, true]);
  assert.equal(limited("b", 3), false, "another client has its own count");
  assert.equal(limited("a", 1001), false, "a new window starts");
});
