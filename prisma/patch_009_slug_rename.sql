-- =============================================================================
-- Patch 009 — Phase 8: Slug Rename History
--
-- Adds `slug_history TEXT[]` so the public route can 308-redirect old slugs
-- to the current one when the owner renames their card. Indexed with GIN so
-- the lookup `WHERE slug_history @> ARRAY[<old>]` is O(log n).
--
-- Idempotent: ADD COLUMN + CREATE INDEX guarded by IF NOT EXISTS.
-- =============================================================================

ALTER TABLE "card_orders"
  ADD COLUMN IF NOT EXISTS "slug_history" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

CREATE INDEX IF NOT EXISTS "card_orders_slug_history_gin_idx"
  ON "card_orders" USING GIN ("slug_history");
