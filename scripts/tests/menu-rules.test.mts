/**
 * Menu and footer rules (PLAN 7.3, lead override A). The Werkstatt header menus, the phone menu and the footer are
 * built from src/content/v7/menu.ts; these tests pin the site rules for that data in de, en and tr:
 * same structure and targets per locale, published prices only with "netto" and the price note, the KI-Check credit
 * next to its chip, the planned courses only in the Schulungen group and in order, Kutasia as one line without a
 * link out or a picture, and no banned wording. Run: npx tsx --test scripts/tests/menu-rules.test.mts
 */
import assert from "node:assert/strict";
import test from "node:test";
import * as menuMod from "../../src/content/v7/menu.ts";
import * as offersMod from "../../src/content/v7/offers.ts";
import * as siteMod from "../../src/content/v7/site.ts";
import * as routesMod from "../../src/lib/v7-routes.ts";

const pick = <T,>(m: any, key: string): T => (m[key] ? m : m.default) as T;
const M = pick<typeof import("../../src/content/v7/menu.ts")>(menuMod, "MENU");
const O = pick<typeof import("../../src/content/v7/offers.ts")>(offersMod, "OFFERS");
const S = pick<typeof import("../../src/content/v7/site.ts")>(siteMod, "SITE_STR");
const R = pick<typeof import("../../src/lib/v7-routes.ts")>(routesMod, "PAGE_KEYS");

type L3 = "de" | "en" | "tr";
const LOCALES: L3[] = ["de", "en", "tr"];
const PAGE_KEYS = new Set<string>(R.PAGE_KEYS as readonly string[]);

/** Every string anywhere inside a value (deep). */
function strings(v: unknown, out: string[] = []): string[] {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => strings(x, out));
  return out;
}

/** Every link target in a group or footer, in reading order (the "to" objects). */
function targets(v: unknown, out: unknown[] = []): unknown[] {
  if (Array.isArray(v)) v.forEach((x) => targets(x, out));
  else if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (typeof o.to === "string") out.push({ to: o.to, hash: o.hash, query: o.query, sub: o.sub ? "sub" : undefined });
    else if (typeof o.href === "string") out.push({ href: o.href });
    Object.values(o).forEach((x) => targets(x, out));
  }
  return out;
}

const shape = (groups: (typeof M.MENU)["de"]) =>
  groups.map((g) => ({
    key: g.key,
    hub: g.hub,
    line: g.line,
    cols: g.cols.map((c) => ({ style: c.style, n: c.items.length, after: !!c.after, note: !!c.note, thumbs: c.items.map((i) => !!i.thumb), chips: c.items.map((i) => i.chip?.kind) })),
    feature: g.feature.art.kind,
    priceNote: !!g.mobile.priceNote,
  }));

test("menu: four groups in the decided order with their hubs and door colours (decisions 71, 77)", () => {
  for (const l of LOCALES) {
    const g = M.MENU[l];
    assert.deepEqual(
      g.map((x) => [x.key, x.hub, x.line]),
      [
        ["schulungen", "schulungen", "schulungen"],
        ["beratung", "beratung", "beratung"],
        ["produkte", "produkte", "produkte"],
        ["unternehmen", "ueber", "unternehmen"],
      ],
      l,
    );
  }
});

test("menu and footer: same groups, columns, items and targets in de, en and tr", () => {
  for (const l of ["en", "tr"] as const) {
    assert.deepEqual(shape(M.MENU[l]), shape(M.MENU.de), `menu shape ${l}`);
    assert.deepEqual(targets(M.MENU[l]), targets(M.MENU.de), `menu targets ${l}`);
    assert.deepEqual(
      M.FOOTER[l].cols.map((c) => [c.id, c.links.length]),
      M.FOOTER.de.cols.map((c) => [c.id, c.links.length]),
      `footer shape ${l}`,
    );
    assert.deepEqual(targets(M.FOOTER[l]), targets(M.FOOTER.de), `footer targets ${l}`);
  }
  assert.deepEqual(
    M.FOOTER.de.cols.map((c) => c.id),
    ["schulungen", "beratung", "produkte", "unternehmen"],
  );
});

test("every page target is a known PageKey; mail is the only raw link", () => {
  for (const l of LOCALES) {
    for (const t of [...targets(M.MENU[l]), ...targets(M.FOOTER[l])] as Record<string, unknown>[]) {
      if ("to" in t) assert.ok(PAGE_KEYS.has(t.to as string), `${l}: unknown page key ${String(t.to)}`);
      else assert.match(String(t.href), /^mailto:info@opsolid\.de$/, `${l}: raw link ${String(t.href)}`);
    }
  }
});

test("prices: euro chips say net; training chips say per team and are never a fixed price", () => {
  const net: Record<L3, RegExp> = { de: /netto/, en: /\bnet\b/, tr: /\bnet\b|KDV hariç/ };
  const perTeam: Record<L3, RegExp> = { de: /pro Team/, en: /per team/, tr: /ekip başına/ };
  const fixed = /Festpreis|fixed price|sabit fiyat/i;
  for (const l of LOCALES) {
    const training = new Set(Object.values(O.OFFERS[l]).map((o) => o.chip));
    let seen = 0;
    for (const g of M.MENU[l]) {
      for (const c of g.cols) {
        for (const item of [...c.items, ...(c.after ? [c.after] : [])]) {
          const chip = item.chip?.text;
          if (!chip || !chip.includes("€")) continue;
          seen++;
          assert.match(chip, net[l], `${l}: "${chip}" lacks net`);
          if (training.has(chip)) {
            assert.equal(g.key, "schulungen", `${l}: training chip outside the Schulungen group`);
            assert.match(chip, perTeam[l], `${l}: "${chip}" lacks per team`);
            assert.doesNotMatch(chip, fixed, `${l}: training chip called a fixed price`);
          }
        }
      }
    }
    assert.equal(seen, 4, `${l}: three training chips and the KI-Check chip`);
  }
});

test("every group with a price carries the price note on desktop and in the phone menu", () => {
  for (const l of LOCALES) {
    const note = S.SITE_STR[l].priceNote;
    for (const g of M.MENU[l]) {
      const priced = strings(g.cols).some((s) => s.includes("€"));
      if (!priced) {
        assert.equal(g.mobile.priceNote, undefined, `${l}/${g.key}: price note without a price`);
        continue;
      }
      assert.ok(g.foot.note.includes(note), `${l}/${g.key}: foot note lacks the price note`);
      assert.ok(g.mobile.priceNote?.includes(note), `${l}/${g.key}: phone menu lacks the price note`);
    }
    // the closed phone-menu summaries show no price
    for (const g of M.MENU[l]) assert.ok(!g.mobile.summary.includes("€"), `${l}/${g.key}: price in a summary`);
  }
});

test("KI-Check: its chip travels with the 60-day credit in the same group", () => {
  for (const l of LOCALES) {
    const ck = O.CHECK[l];
    const groups = M.MENU[l].filter((g) => strings(g).some((s) => s.includes(ck.chip)));
    assert.deepEqual(
      groups.map((g) => g.key),
      ["beratung"],
      l,
    );
    const g = groups[0];
    assert.ok(g.feature.p.includes(ck.credit), `${l}: panel lacks the credit`);
    assert.ok(g.mobile.priceNote?.includes(ck.credit), `${l}: phone menu lacks the credit`);
  }
});

test("planned courses: only in the Schulungen group, all four, in their order (rule 5)", () => {
  for (const l of LOCALES) {
    const names = O.PLANNED[l];
    for (const g of M.MENU[l]) {
      const found = strings(g).filter((s) => (names as readonly string[]).includes(s));
      if (g.key === "schulungen") assert.deepEqual(found, [...names], `${l}: order`);
      else assert.deepEqual(found, [], `${l}/${g.key}: planned course outside Schulungen`);
    }
    for (const s of strings(M.FOOTER[l])) assert.ok(!(names as readonly string[]).includes(s), `${l}: planned course in the footer`);
    const col = M.MENU[l][0].cols.find((c) => c.items.some((i) => i.label === names[0]));
    assert.ok(col?.after?.to && "to" in col.after.to && col.after.to.query?.anliegen === "vormerken", `${l}: Interesse vormerken`);
    for (const i of col!.items) assert.ok(!i.desc && !i.chip, `${l}: a planned course with a description or chip`);
  }
});

test("Kutasia and the NFC card: status only, no price, no link out, Kutasia without a picture", () => {
  for (const l of LOCALES) {
    const items = M.MENU[l].flatMap((g) => g.cols.flatMap((c) => c.items));
    const kut = items.filter((i) => i.label === "Kutasia");
    assert.equal(kut.length, 1, l);
    const k = kut[0];
    assert.ok("to" in k.to && k.to.to === "produkte" && k.to.hash === "kutasia", `${l}: Kutasia target`);
    assert.ok(!("href" in k.to), `${l}: Kutasia has an href`);
    assert.equal(k.thumb, undefined, `${l}: Kutasia has a picture`);
    assert.equal(k.chip?.kind, "plan", l);
    assert.ok(!/€|\d/.test(k.desc ?? ""), `${l}: Kutasia line with a number`);
    const nfc = items.find((i) => "to" in i.to && i.to.hash === "nfc-karte");
    assert.ok(nfc && nfc.chip?.kind === "plan" && !strings(nfc).some((s) => s.includes("€")), `${l}: NFC card`);
  }
  for (const s of [...strings(M.MENU), ...strings(M.FOOTER)]) {
    assert.ok(!/kutasia\.com/i.test(s), `kutasia.com in "${s}"`);
    assert.ok(!/\bbuchen\b/i.test(s), `"buchen" in "${s}"`);
  }
});

test("no banned wording, place names or dashes anywhere in the menus and the footer", () => {
  const banned = [/Pilotphase/i, /Buchungslink/i, /Vorgespräch/i, /\bvor Ort\b/i, /Vor-Ort/i, /Inhouse/i, /Arnsberg/, /Sauerland/, /\bNRW\b/, /–/, /—/, /Plattform/i, /vermitt/i, /zertifiziert/i, /\bIHK\b/, /TÜV/, /Einzelunternehmen/i, /\bSHK\b/, /Großhandel/i];
  for (const s of [...strings(M.MENU), ...strings(M.FOOTER)]) {
    for (const re of banned) assert.doesNotMatch(s, re, `"${s}"`);
  }
});

test("active top item: every page key maps to its group, the home marks none", () => {
  assert.equal(M.PILLAR.home, undefined);
  for (const [k, g] of Object.entries(M.PILLAR)) {
    assert.ok(PAGE_KEYS.has(k), k);
    assert.ok(["schulungen", "beratung", "produkte", "unternehmen"].includes(g as string), `${k} -> ${g}`);
  }
  assert.equal(M.PILLAR.workflows, "schulungen");
  assert.equal(M.PILLAR.opso, "produkte");
  assert.equal(M.PILLAR.produkte, "produkte");
  assert.equal(M.PILLAR.trainer, "unternehmen");
});
