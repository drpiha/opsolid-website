-- =============================================================================
-- Patch 006 — Phase 6: Custom Domain + CRM Webhook
--
-- Adds per-card custom domain support (customer points CNAME at our server)
-- and an outbound webhook table so customers can pipe lead.created /
-- connection.created events into their own CRM.
--
-- Idempotent: every CREATE / ALTER guarded by IF NOT EXISTS.
-- =============================================================================

-- Custom domain columns on card_orders ---------------------------------------
ALTER TABLE "card_orders"
  ADD COLUMN IF NOT EXISTS "custom_domain" TEXT,
  ADD COLUMN IF NOT EXISTS "custom_domain_verified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "custom_domain_verified_at" TIMESTAMP(3);

-- Partial unique index — multiple NULLs allowed, but a configured domain is
-- unique across the whole table.
CREATE UNIQUE INDEX IF NOT EXISTS "card_orders_custom_domain_unique"
  ON "card_orders" ("custom_domain")
  WHERE "custom_domain" IS NOT NULL;

-- Webhook subscriptions ------------------------------------------------------
CREATE TABLE IF NOT EXISTS "card_webhooks" (
  "id"         TEXT PRIMARY KEY,
  "order_id"   TEXT NOT NULL REFERENCES "card_orders"("id") ON DELETE CASCADE,
  "url"        TEXT NOT NULL,
  "secret"     TEXT NOT NULL,
  "events"     TEXT[] NOT NULL DEFAULT ARRAY['lead.created','connection.created'],
  "active"     BOOLEAN NOT NULL DEFAULT true,
  "last_delivery_at"     TIMESTAMP(3),
  "last_delivery_status" INT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "card_webhooks_order_active_idx"
  ON "card_webhooks" ("order_id", "active");
