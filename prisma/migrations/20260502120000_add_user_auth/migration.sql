-- Faz 7.0a B0.1 — User auth schema. See prisma/patch_011_add_user_auth.sql for
-- the human-readable copy. This file is for `prisma migrate deploy`.

-- CreateTable: users
CREATE TABLE "users" (
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

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE        INDEX "users_email_idx" ON "users"("email");

-- CreateTable: sessions
CREATE TABLE "sessions" (
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

CREATE UNIQUE INDEX "sessions_token_hash_key" ON "sessions"("token_hash");
CREATE        INDEX "sessions_user_id_idx"    ON "sessions"("user_id");
CREATE        INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

ALTER TABLE "sessions"
  ADD CONSTRAINT "sessions_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: magic_link_tokens
CREATE TABLE "magic_link_tokens" (
  "id"          TEXT          NOT NULL,
  "user_id"     TEXT          NOT NULL,
  "token_hash"  TEXT          NOT NULL,
  "expires_at"  TIMESTAMP(3)  NOT NULL,
  "used_at"     TIMESTAMP(3),
  "created_at"  TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "magic_link_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "magic_link_tokens_token_hash_key" ON "magic_link_tokens"("token_hash");
CREATE        INDEX "magic_link_tokens_user_id_idx"    ON "magic_link_tokens"("user_id");
CREATE        INDEX "magic_link_tokens_expires_at_idx" ON "magic_link_tokens"("expires_at");

ALTER TABLE "magic_link_tokens"
  ADD CONSTRAINT "magic_link_tokens_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: card_orders.user_id
ALTER TABLE "card_orders"
  ADD COLUMN "user_id" TEXT;

CREATE INDEX "card_orders_user_id_idx" ON "card_orders"("user_id");

ALTER TABLE "card_orders"
  ADD CONSTRAINT "card_orders_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
