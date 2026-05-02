-- =============================================================================
-- Patch 011 — Faz 7.0a B0.1: User auth schema
--
-- Adds three new tables and one nullable FK on card_orders:
--   users              — auth identity (email + nullable passwordHash)
--   sessions           — server-side session records (tokenHash = sha256(token))
--   magic_link_tokens  — single-use email login tokens
--   card_orders.user_id — nullable FK → users.id, ON DELETE SET NULL
--
-- All changes additive. Existing card_orders rows keep working with NULL user_id.
-- A future "claim card" flow (B0.6) will let editToken-only cards be claimed
-- by a User account.
--
-- Idempotent: every CREATE / ALTER guarded by IF NOT EXISTS. Safe to re-run.
--
-- Rollback (down) — execute in reverse:
--   DROP INDEX  IF EXISTS "card_orders_user_id_idx";
--   ALTER TABLE "card_orders" DROP CONSTRAINT IF EXISTS "card_orders_user_id_fkey";
--   ALTER TABLE "card_orders" DROP COLUMN IF EXISTS "user_id";
--   DROP TABLE IF EXISTS "magic_link_tokens";
--   DROP TABLE IF EXISTS "sessions";
--   DROP TABLE IF EXISTS "users";
-- =============================================================================

-- users -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "users" (
  "id"                TEXT          NOT NULL,
  "email"             TEXT          NOT NULL,
  "email_verified_at" TIMESTAMP(3),
  "password_hash"     TEXT,
  "name"              TEXT,
  "locale"            TEXT          NOT NULL DEFAULT 'de',
  "created_at"        TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"        TIMESTAMP(3)  NOT NULL,

  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key"  ON "users" ("email");
CREATE        INDEX IF NOT EXISTS "users_email_idx"  ON "users" ("email");

-- sessions --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "sessions" (
  "id"          TEXT          NOT NULL,
  "user_id"     TEXT          NOT NULL,
  "token_hash"  TEXT          NOT NULL,
  "user_agent"  TEXT,
  "ip_hash"     TEXT,
  "expires_at"  TIMESTAMP(3)  NOT NULL,
  "revoked_at"  TIMESTAMP(3),
  "created_at"  TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "sessions_token_hash_key"  ON "sessions" ("token_hash");
CREATE        INDEX IF NOT EXISTS "sessions_user_id_idx"     ON "sessions" ("user_id");
CREATE        INDEX IF NOT EXISTS "sessions_expires_at_idx"  ON "sessions" ("expires_at");

DO $$ BEGIN
  ALTER TABLE "sessions"
    ADD CONSTRAINT "sessions_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- magic_link_tokens -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS "magic_link_tokens" (
  "id"          TEXT          NOT NULL,
  "user_id"     TEXT          NOT NULL,
  "token_hash"  TEXT          NOT NULL,
  "expires_at"  TIMESTAMP(3)  NOT NULL,
  "used_at"     TIMESTAMP(3),
  "created_at"  TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "magic_link_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "magic_link_tokens_token_hash_key" ON "magic_link_tokens" ("token_hash");
CREATE        INDEX IF NOT EXISTS "magic_link_tokens_user_id_idx"    ON "magic_link_tokens" ("user_id");
CREATE        INDEX IF NOT EXISTS "magic_link_tokens_expires_at_idx" ON "magic_link_tokens" ("expires_at");

DO $$ BEGIN
  ALTER TABLE "magic_link_tokens"
    ADD CONSTRAINT "magic_link_tokens_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- card_orders.user_id ---------------------------------------------------------
ALTER TABLE "card_orders"
  ADD COLUMN IF NOT EXISTS "user_id" TEXT;

CREATE INDEX IF NOT EXISTS "card_orders_user_id_idx" ON "card_orders" ("user_id");

DO $$ BEGIN
  ALTER TABLE "card_orders"
    ADD CONSTRAINT "card_orders_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
