import assert from "node:assert/strict";
import test from "node:test";
import * as mod from "../../src/lib/contact-ack.ts";

// tsx exposes the CommonJS namespace here, as in the other .mts tests.
const m = ((mod as { default?: unknown }).default ?? mod) as typeof import("../../src/lib/contact-ack.ts");
const { ACK_MAX_PER_DAY, ACK_MAX_PER_HOUR, ACK_TEXT, ackKey, ackLocale, ackSignature, buildAck, createAckLimiter, sendTrainerAck } = m;
type AckMail = import("../../src/lib/contact-ack.ts").AckMail;
import * as constants from "../../src/lib/constants.ts";
const { SITE_CONFIG } = ((constants as { default?: unknown }).default ?? constants) as typeof import("../../src/lib/constants.ts");
import * as routes from "../../src/lib/v7-routes.ts";
const { absUrl } = ((routes as { default?: unknown }).default ?? routes) as typeof import("../../src/lib/v7-routes.ts");

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
    // The Content-ID of the embedded logo has the form of an address (RFC 2392); it is not one.
    const cid = `cid:${mail.inlineImages[0].cid}`;
    const all = `${mail.subject}\n${mail.text}\n${mail.html.replace(cid, "")}\n${mail.htmlWithoutInlineImages}`;
    assert.equal(/https?:|www\.|<a\s|mailto:|<script|<style|<link|url\(/i.test(all), false);
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
});

test("the approved wording is unchanged; it is only split into paragraphs", () => {
  const joined = (locale: "de" | "en" | "tr") => ACK_TEXT[locale].lines.join(" ");
  assert.equal(
    joined("de"),
    "Guten Tag, vielen Dank für Ihre Bewerbung. Sie ist bei uns eingegangen. Wir antworten innerhalb von sieben Tagen. Einsätze entstehen aus Kundenanfragen; wir melden uns, sobald eine Anfrage zu Ihrem Thema passt. Ihre Angaben verwenden wir nur für die Auswahl von Trainerinnen und Trainern und löschen sie auf Wunsch. Freundliche Grüße",
  );
  assert.equal(
    joined("en"),
    "Hello, thank you for your application. We have received it and will reply within seven days. Assignments come from client requests; we will contact you when a request fits your topic. We use your details only to select trainers and delete them on request. Kind regards,",
  );
  assert.equal(
    joined("tr"),
    "Merhaba, başvurunuz için teşekkür ederiz. Başvurunuz bize ulaştı; yedi gün içinde yanıt vereceğiz. Eğitim görevleri müşteri taleplerinden doğar; konunuza uygun bir talep olduğunda size döneriz. Bilgilerinizi yalnızca eğitmen seçimi için kullanır, talep üzerine sileriz. Saygılarımızla",
  );
  for (const locale of ["de", "en", "tr"] as const) assert.equal(ACK_TEXT[locale].headline.join(""), ACK_TEXT[locale].subject);
});

test("signature: the business block of automatic mails, the same in text and HTML", () => {
  const { street, postalCode, city } = SITE_CONFIG.address;
  for (const locale of ["de", "en", "tr"] as const) {
    const lines = ackSignature(locale);
    assert.equal(lines.length, 4);
    // Name, the Impressum postal address and our inbox: recommended practice for a sole trader and the
    // owner's decision, not a statutory duty.
    assert.equal(lines[0], "OpSolid, Inh. Hasan Dönmez");
    assert.ok(lines[1].startsWith(`${street} · ${postalCode} ${city}`), lines[1]);
    assert.equal(lines[2], "info@opsolid.de · opsolid.de");
    // The legal line names the public Impressum address of that language, without a scheme.
    assert.ok(lines[3].endsWith(absUrl("impressum", locale).replace(/^https:\/\//, "")), lines[3]);
    const mail = buildAck("a@b.co", `v7-contact-${locale}`);
    assert.ok(mail.text.endsWith(`\n\n${lines.join("\n")}`));
    for (const html of [mail.html, mail.htmlWithoutInlineImages]) for (const line of lines) assert.ok(html.includes(line), line);
  }
  assert.equal(ackSignature("de")[1], `${street} · ${postalCode} ${city}`);
});

test("designed HTML: a full document per language with the logo embedded, and a text-brand twin", () => {
  for (const locale of ["de", "en", "tr"] as const) {
    const mail = buildAck("a@b.co", `v7-contact-${locale}`);
    const { eyebrow, headline, lines } = ACK_TEXT[locale];
    for (const html of [mail.html, mail.htmlWithoutInlineImages]) {
      assert.ok(html.startsWith(`<!doctype html><html lang="${locale}">`));
      assert.ok(html.endsWith("</body></html>"));
      assert.ok(html.includes(eyebrow) && html.includes(headline[0]) && html.includes(`>${headline[1]}</em>`));
      for (const line of lines) assert.ok(html.includes(`>${line}</p>`), line);
    }
    // Exactly one image, and it is the embedded one: nothing is fetched when the mail is opened.
    assert.equal(mail.inlineImages.length, 1);
    const [logo] = mail.inlineImages;
    assert.deepEqual(mail.html.match(/<img\b[^>]*>/g)?.length, 1);
    assert.ok(mail.html.includes(`src="cid:${logo.cid}"`) && mail.html.includes('alt="OpSolid"'));
    assert.equal(/<img\b|cid:/.test(mail.htmlWithoutInlineImages), false);
    assert.ok(mail.htmlWithoutInlineImages.includes(">OPSOLID</div>"));
    const png = Buffer.from(logo.contentBase64, "base64");
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [378, 90]); // IHDR: 3x of the 126 x 30 shown
    assert.ok(png.length < 12_000);
    assert.equal(logo.contentType, "image/png");
  }
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
