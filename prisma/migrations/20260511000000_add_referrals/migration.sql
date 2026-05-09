-- M3 — Network growth loops.
--
-- Adds three concerns:
--
--   1. Referral mechanics (`Referral`).
--      Each user gets a single 6-character code on first card publish; this
--      table keeps the (referrerUserId, code, redemptions) tuple. The code is
--      surfaced via /api/v1/referrals/me and embedded in share-link CTAs as
--      `?ref=<code>` (or `?ref=<slug>` from the public viewer's "Create yours"
--      CTA, which the redeem route resolves to the slug owner's userId).
--
--   2. Bidirectional save bookkeeping on `SavedCard`.
--      Adds `referredByUserId` so we can attribute a new signup to the person
--      whose card or code drove it. Adds an idempotency-friendly index on
--      (referrerUserId, refereeUserId) inside `Referral.redemptions` we model
--      via a separate `ReferralRedemption` row to make the (referrer, referee)
--      pair unique without bloating Referral itself.
--
--   3. Share telemetry (`ShareEvent`).
--      Fire-and-forget log of every public-viewer share gesture (qr / link /
--      nfc / native_share). Owner sees an aggregate by channel for the last
--      30 days in Settings → "Sharing analytics".
--
-- Migration is hand-written (matches the events / messages migration style).
-- Apply on the VPS with:
--   docker exec opsolid-app npx prisma migrate deploy
--
-- Hasan applies this manually — do not auto-deploy.

-- ---------------------------------------------------------------------------
-- Referral — one row per user, lazily created on first card publish or first
-- API call to /api/v1/referrals/me. `code` is unique 6-char alphanumeric; the
-- redemption count is a denormalised total maintained by /redeem so the GET
-- /me endpoint is one row read.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "referrals" (
    "id" TEXT NOT NULL,
    "referrer_user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "redemptions" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "referrals_referrer_user_id_key"
  ON "referrals"("referrer_user_id");

CREATE UNIQUE INDEX IF NOT EXISTS "referrals_code_key"
  ON "referrals"("code");

ALTER TABLE "referrals"
  ADD CONSTRAINT "referrals_referrer_user_id_fkey"
  FOREIGN KEY ("referrer_user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- ReferralRedemption — one row per (referrer, referee) pair. Idempotency on
-- the unique constraint: if a referee tries to redeem twice, the second insert
-- conflicts and the route returns the existing row instead of double-counting.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "referral_redemptions" (
    "id" TEXT NOT NULL,
    "referral_id" TEXT NOT NULL,
    "referee_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referral_redemptions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "referral_redemptions_referral_id_referee_user_id_key"
  ON "referral_redemptions"("referral_id", "referee_user_id");

CREATE INDEX IF NOT EXISTS "referral_redemptions_referee_user_id_idx"
  ON "referral_redemptions"("referee_user_id");

ALTER TABLE "referral_redemptions"
  ADD CONSTRAINT "referral_redemptions_referral_id_fkey"
  FOREIGN KEY ("referral_id") REFERENCES "referrals"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "referral_redemptions"
  ADD CONSTRAINT "referral_redemptions_referee_user_id_fkey"
  FOREIGN KEY ("referee_user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- ShareEvent — public-viewer share telemetry.
-- channel: 'qr' | 'link' | 'nfc' | 'native_share'.
-- Fire-and-forget — the route never blocks a share gesture on insert failure.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "share_events" (
    "id" TEXT NOT NULL,
    "source_card_id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "share_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "share_events_source_card_id_created_at_idx"
  ON "share_events"("source_card_id", "created_at");

CREATE INDEX IF NOT EXISTS "share_events_created_at_idx"
  ON "share_events"("created_at");

ALTER TABLE "share_events"
  ADD CONSTRAINT "share_events_source_card_id_fkey"
  FOREIGN KEY ("source_card_id") REFERENCES "card_orders"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- SavedCard — bidirectional-save support.
-- The existing `status` column already accepts arbitrary strings; we just add
-- a new sentinel value `pending_mutual` in app code (no schema change needed
-- there). What we DO add is `referredByUserId` so the inbox can show "Mutual
-- save request from <referrer>" when one is the spawn of the other.
-- ---------------------------------------------------------------------------
ALTER TABLE "saved_cards"
  ADD COLUMN IF NOT EXISTS "referred_by_user_id" TEXT;

CREATE INDEX IF NOT EXISTS "saved_cards_status_idx"
  ON "saved_cards"("status");
