import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
const {
  claimUnownedLegacyCard,
  findClaimableLegacyCards,
  getVerifiedClaimEmail,
  legacyCardClaimDecision,
} = createRequire(import.meta.url)("../../src/lib/auth/card-claim.ts");
const { safeAuthNextPath } = createRequire(import.meta.url)("../../src/lib/auth/safe-next-path.ts");

const verifiedUser = {
  id: "user-rightful",
  email: " Owner@Example.com ",
  emailVerifiedAt: new Date("2026-01-01T00:00:00.000Z"),
};

test("unverified identity cannot discover or claim an email-matched card", () => {
  const user = { ...verifiedUser, emailVerifiedAt: null };
  assert.equal(getVerifiedClaimEmail(user), null);
  assert.equal(
    legacyCardClaimDecision(user, {
      userId: null,
      contactEmail: "owner@example.com",
    }),
    "unverified",
  );
});

test("verified rightful owner can claim and email comparison is normalized", () => {
  assert.equal(getVerifiedClaimEmail(verifiedUser), "owner@example.com");
  assert.equal(
    legacyCardClaimDecision(verifiedUser, {
      userId: null,
      contactEmail: " OWNER@example.com ",
    }),
    "claimable",
  );
});

test("nonmatching email and a card owned by another user both fail closed", () => {
  assert.equal(
    legacyCardClaimDecision(verifiedUser, {
      userId: null,
      contactEmail: "someone-else@example.com",
    }),
    "email_mismatch",
  );
  assert.equal(
    legacyCardClaimDecision(verifiedUser, {
      userId: "user-other",
      contactEmail: "owner@example.com",
    }),
    "owned_by_other",
  );
});

test("claim uses a null-owner compare-and-set and preserves a concurrent winner", async () => {
  let updateArgs: unknown;
  let reads = 0;
  const claimed = await claimUnownedLegacyCard(
    {
      cardOrder: {
        updateMany: async (args) => {
          updateArgs = args;
          return { count: 1 };
        },
        findUnique: async () => {
          reads += 1;
          return { userId: null };
        },
      },
    },
    "card-1",
    verifiedUser.id,
    "owner@example.com",
  );
  assert.equal(claimed, "claimed");
  assert.equal(reads, 0);
  assert.deepEqual(updateArgs, {
    where: { id: "card-1", userId: null, contactEmail: "owner@example.com" },
    data: { userId: verifiedUser.id },
  });

  const lostRace = await claimUnownedLegacyCard(
    {
      cardOrder: {
        updateMany: async () => ({ count: 0 }),
        findUnique: async () => ({ userId: "user-other" }),
      },
    },
    "card-1",
    verifiedUser.id,
    "owner@example.com",
  );
  assert.equal(lostRace, "unavailable");

  const idempotentWinner = await claimUnownedLegacyCard(
    {
      cardOrder: {
        updateMany: async () => ({ count: 0 }),
        findUnique: async () => ({ userId: verifiedUser.id }),
      },
    },
    "card-1",
    verifiedUser.id,
    "owner@example.com",
  );
  assert.equal(idempotentWinner, "owned");
});

test("legacy discovery executes a bounded parameterized trim/case query and excludes other owners", async () => {
  // Execute the portable SELECT in an isolated in-memory SQL engine. The
  // production adapter is Prisma/PostgreSQL; btrim is registered equivalently.
  const { DatabaseSync } = createRequire(import.meta.url)("node:sqlite");
  const db = new DatabaseSync(":memory:");
  db.function("btrim", (value: string) => value.replace(/^ +| +$/g, ""));
  db.exec("CREATE TABLE card_orders (id TEXT, slug TEXT, contact_name TEXT, status TEXT, created_at TEXT, user_id TEXT, contact_email TEXT)");
  const insert = db.prepare("INSERT INTO card_orders VALUES (?, ?, ?, ?, ?, ?, ?)");
  insert.run("rightful", "rightful", "Synthetic Owner", "PUBLISHED", "2026-01-01", null, "  OWNER@EXAMPLE.COM  ");
  insert.run("owned", "owned", "Other Owner", "PUBLISHED", "2026-01-01", "another-user", "owner@example.com");
  insert.run("unrelated", "unrelated", "Other Email", "PUBLISHED", "2026-01-01", null, "other@example.com");
  let calls = 0;
  const store = { $queryRaw: async (parts: TemplateStringsArray, ...values: unknown[]) => {
    calls++;
    assert.match(parts.join("?"), /LIMIT 100/);
    assert.equal(values.length, 1);
    return db.prepare(parts.join("?")).all(...values);
  } };
  try {
    const rows = await findClaimableLegacyCards(store, verifiedUser);
    assert.deepEqual(rows.map((row: any) => row.id), ["rightful"]);
    assert.deepEqual(Object.keys(rows[0]).sort(), ["contactName", "createdAt", "id", "slug", "status"]);
    assert.deepEqual(await findClaimableLegacyCards(store, { ...verifiedUser, emailVerifiedAt: null }), []);
    assert.equal(calls, 1);
    assert.deepEqual(await findClaimableLegacyCards(store, { ...verifiedUser, email: "' OR 1=1 --" }), []);
  } finally { db.close(); }
});

test("post-login navigation permits local paths and rejects executable or external variants", () => {
  const fallback = "/de/dashboard/cards";
  for (const value of [null, "javascript:alert(1)", "https://evil.example", "//evil.example", "/\\evil.example", "\\evil.example", "/%2fevil.example", "/%5cevil.example", "/%252fevil.example", "/%255cevil.example", "/%2525252fevil.example", "/ok/..//evil.example", "/ok\n", "/%0aevil", "/%250aevil", " /de/dashboard", "/%broken"]) {
    assert.equal(safeAuthNextPath(value, fallback), fallback, String(value));
  }
  for (const value of ["/en/dashboard/cards", "/de/dashboard/cards?tab=owned#card", "/tr/dashboard?return=https%3A%2F%2Fexample.test"]) {
    assert.equal(safeAuthNextPath(value, fallback), value);
  }
});
