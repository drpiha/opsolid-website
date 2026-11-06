import assert from "node:assert/strict";
import test from "node:test";
import * as mod from "../../src/lib/contact-ack.ts";

// tsx exposes the CommonJS namespace here, as in the other .mts tests.
const m = ((mod as { default?: unknown }).default ?? mod) as typeof import("../../src/lib/contact-ack.ts");
const { ACK_MAX_PER_DAY, ACK_MAX_PER_HOUR, ACK_TEXT, ackKey, ackLocale, buildAck, createAckLimiter, sendTrainerAck } = m;
type AckMail = import("../../src/lib/contact-ack.ts").AckMail;
import * as constants from "../../src/lib/constants.ts";
const { SITE_CONFIG } = ((constants as { default?: unknown }).default ?? constants) as typeof import("../../src/lib/constants.ts");

// The acknowledgement for trainer applications: off by default, one mail per mailbox per 24 h, at most
// 20 a day and 5 an hour in all, nothing the applicant typed in the body, and a failure never throws.
const sink = () => {
  const mails: AckMail[] = [];
  return { mails, send: async (mail: AckMail) => (mails.push(mail), { ok: true }) };
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
const HOUR = 60 * 60_000;

test("on unless the flag says off", async () => {
  for (const [flag, sent] of [[undefined, true], ["", true], ["on", true], ["off", false], ["OFF", false], [" off ", false]] as const) {
    await withFlag(flag, async () => {
      const s = sink();
      assert.equal(await sendTrainerAck({ to: "a@example.org", source: "v7-contact-de" }, s.send, createAckLimiter()), sent, String(flag));
      assert.equal(s.mails.length, sent ? 1 : 0);
    });
  }
});

test("one mail per mailbox per 24 hours: case, +tags and Gmail dots share one key", async () => {
  assert.equal(ackKey(" Pat+cv@Example.org "), "pat@example.org");
  assert.equal(ackKey("p.a.t@googlemail.com"), "pat@gmail.com");
  assert.equal(ackKey("p.a.t@example.org"), "p.a.t@example.org");
  await withFlag("on", async () => {
    let t = 1_000_000;
    const limiter = createAckLimiter(() => t);
    const s = sink();
    assert.equal(await sendTrainerAck({ to: "Pat@Example.org" }, s.send, limiter), true);
    assert.equal(await sendTrainerAck({ to: "pat+1@example.org" }, s.send, limiter), false);
    assert.equal(await sendTrainerAck({ to: "other@example.org" }, s.send, limiter), true);
    assert.equal(s.mails.length, 2);
    t += 24 * HOUR + 1;
    assert.equal(await sendTrainerAck({ to: "pat@example.org" }, s.send, limiter), true);
    assert.equal(s.mails.length, 3);
  });
});

test("totals: at most 5 an hour and 20 in any 24 hours across all recipients", async () => {
  await withFlag("on", async () => {
    let t = 1_000_000;
    const limiter = createAckLimiter(() => t);
    const s = sink();
    let sent = 0;
    for (let i = 0; i < ACK_MAX_PER_HOUR + 3; i++) if (await sendTrainerAck({ to: `h${i}@example.org` }, s.send, limiter)) sent++;
    assert.equal(sent, ACK_MAX_PER_HOUR);
    for (let hour = 1; hour < 24; hour++) {
      t += HOUR;
      for (let i = 0; i < ACK_MAX_PER_HOUR; i++) if (await sendTrainerAck({ to: `d${hour}-${i}@example.org` }, s.send, limiter)) sent++;
    }
    assert.equal(sent, ACK_MAX_PER_DAY);
    assert.equal(s.mails.length, ACK_MAX_PER_DAY);
  });
});

test("body has the approved text only: our own address, no applicant text, no links, reply-to our inbox", () => {
  for (const source of ["v7-contact-de", "v7-contact-en", "v7-contact-tr", undefined]) {
    const mail = buildAck("applicant@example.org", source);
    const all = `${mail.subject}\n${mail.text}\n${mail.html}`;
    assert.equal(/https?:|www\.|<a\s|mailto:/i.test(all), false);
    assert.deepEqual([...new Set(all.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g))], ["info@opsolid.de"]);
    assert.equal(/applicant/i.test(all), false);
    assert.equal(mail.to, "applicant@example.org");
    assert.equal(mail.replyTo, "info@opsolid.de");
    assert.equal(mail.headers["Auto-Submitted"], "auto-generated");
  }
  assert.equal(ackLocale("v7-contact-tr"), "tr");
  assert.equal(ackLocale("v7-contact-de"), "de");
  assert.equal(ackLocale("v7-contact-en"), "en");
  assert.equal(ackLocale(undefined), "en");
  assert.match(buildAck("a@b.co", "v7-contact-de").text, /^Guten Tag,\n\nvielen Dank für Ihre Bewerbung\. Sie ist bei uns eingegangen\. Wir antworten innerhalb von sieben Tagen\./);
  assert.match(buildAck("a@b.co", "v7-contact-en").text, /^Hello, thank you for your application\. We have received it and will reply within seven days\./);
  assert.match(buildAck("a@b.co", "v7-contact-tr").text, /^Merhaba, başvurunuz için teşekkür ederiz\. Başvurunuz bize ulaştı; yedi gün içinde yanıt vereceğiz\./);
  assert.equal(buildAck("a@b.co", "v7-contact-tr").subject, "Başvurunuz bize ulaştı");
  // One signature in every language: name, the Impressum postal address and our inbox (recommended practice
  // for a sole trader and the owner's decision, not a statutory duty).
  const signature = `OpSolid, Inh. Hasan Dönmez, ${SITE_CONFIG.address.street}, ${SITE_CONFIG.address.postalCode} ${SITE_CONFIG.address.city}, info@opsolid.de`;
  for (const locale of ["de", "en", "tr"] as const) assert.equal(ACK_TEXT[locale].lines.at(-1), signature);
});

test("a failed send, a throwing send or a closed gate never throws and frees the mailbox", async () => {
  await withFlag("on", async () => {
    const limiter = createAckLimiter();
    assert.equal(await sendTrainerAck({ to: "a@example.org" }, async () => ({ ok: false }), limiter), false);
    assert.equal(await sendTrainerAck({ to: "a@example.org" }, async () => { throw new Error("boom"); }, limiter), false);
    const s = sink();
    assert.equal(await sendTrainerAck({ to: "a@example.org" }, s.send, limiter, () => false), false);
    assert.equal(s.mails.length, 0);
    assert.equal(await sendTrainerAck({ to: "a@example.org" }, s.send, limiter), true);
    assert.equal(s.mails.length, 1);
  });
});
