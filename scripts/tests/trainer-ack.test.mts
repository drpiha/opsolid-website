import assert from "node:assert/strict";
import test from "node:test";
import * as mod from "../../src/lib/contact-ack.ts";

// tsx exposes the CommonJS namespace here, as in the other .mts tests.
const m = ((mod as { default?: unknown }).default ?? mod) as typeof import("../../src/lib/contact-ack.ts");
const { ACK_TEXT, ackLocale, buildAck, createAckLimiter, sendTrainerAck } = m;
type AckMail = import("../../src/lib/contact-ack.ts").AckMail;

// The acknowledgement for trainer applications: off by default, one mail per address per 24 h,
// nothing the applicant typed in the body, no links, and a failure never throws.
const sink = () => {
  const mails: AckMail[] = [];
  return { mails, send: async (m: AckMail) => (mails.push(m), { ok: true }) };
};
const withFlag = async (v: string | undefined, fn: () => Promise<void>) => {
  const old = process.env.CONTACT_TRAINER_ACK;
  if (v === undefined) delete process.env.CONTACT_TRAINER_ACK;
  else process.env.CONTACT_TRAINER_ACK = v;
  try {
    await fn();
  } finally {
    if (old === undefined) delete process.env.CONTACT_TRAINER_ACK;
    else process.env.CONTACT_TRAINER_ACK = old;
  }
};

test("flag off (default): nothing is sent", async () => {
  await withFlag(undefined, async () => {
    const s = sink();
    assert.equal(await sendTrainerAck({ to: "a@example.org", source: "v7-contact-de" }, s.send, createAckLimiter()), false);
    assert.equal(s.mails.length, 0);
  });
  await withFlag("off", async () => {
    const s = sink();
    await sendTrainerAck({ to: "a@example.org" }, s.send, createAckLimiter());
    assert.equal(s.mails.length, 0);
  });
});

test("flag on: one mail per address per 24 hours, case-insensitive, then again after a day", async () => {
  await withFlag("on", async () => {
    let t = 1_000_000;
    const limiter = createAckLimiter(() => t);
    const s = sink();
    assert.equal(await sendTrainerAck({ to: "Pat@Example.org", source: "v7-contact-en" }, s.send, limiter), true);
    assert.equal(await sendTrainerAck({ to: "pat@example.org", source: "v7-contact-en" }, s.send, limiter), false);
    assert.equal(await sendTrainerAck({ to: "other@example.org", source: "v7-contact-en" }, s.send, limiter), true);
    assert.equal(s.mails.length, 2);
    t += 24 * 60 * 60_000 + 1;
    assert.equal(await sendTrainerAck({ to: "pat@example.org", source: "v7-contact-en" }, s.send, limiter), true);
    assert.equal(s.mails.length, 3);
  });
});

test("body has the approved text only: no applicant text, no links, no reply-to", () => {
  for (const source of ["v7-contact-de", "v7-contact-en", "v7-contact-tr", undefined]) {
    const m = buildAck("applicant@example.org", source);
    const all = `${m.subject}\n${m.text}\n${m.html}`;
    assert.equal(/https?:|www\.|<a\s|mailto:/i.test(all), false);
    const addresses = new Set(all.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g));
    assert.deepEqual([...addresses], ["info@opsolid.de"], "the only address in the mail is our own");
    assert.equal(/applicant/i.test(all), false);
    assert.equal("replyTo" in m, false);
    assert.equal(m.to, "applicant@example.org");
  }
  assert.equal(ackLocale("v7-contact-tr"), "en");
  assert.equal(ackLocale("v7-contact-de"), "de");
  assert.match(buildAck("a@b.co", "v7-contact-de").text, /Wir antworten innerhalb von sieben Tagen\./);
  assert.match(buildAck("a@b.co", "v7-contact-tr").text, /will reply within seven days/);
  assert.equal(ACK_TEXT.de.lines.length, ACK_TEXT.en.lines.length);
});

test("a failed or throwing send never throws and frees the address for a retry", async () => {
  await withFlag("on", async () => {
    const limiter = createAckLimiter();
    assert.equal(await sendTrainerAck({ to: "a@example.org" }, async () => ({ ok: false }), limiter), false);
    assert.equal(await sendTrainerAck({ to: "a@example.org" }, async () => { throw new Error("boom"); }, limiter), false);
    const s = sink();
    assert.equal(await sendTrainerAck({ to: "a@example.org" }, s.send, limiter), true);
  });
});
