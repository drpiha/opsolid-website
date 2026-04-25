-- Patch 002 — DBC Premium foundation (qr_style, video, concierge, layouts, blocks)
-- Adds the columns + tables introduced by the premium-card foundation that
-- the prisma schema references but the live DB on opsolid.de doesn't have.
-- Safe to re-run (IF NOT EXISTS guards everywhere).

ALTER TABLE card_orders
  ADD COLUMN IF NOT EXISTS qr_style       jsonb,
  ADD COLUMN IF NOT EXISTS video_url      text,
  ADD COLUMN IF NOT EXISTS concierge_addon boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS layout_key     text,
  ADD COLUMN IF NOT EXISTS theme_key      text,
  ADD COLUMN IF NOT EXISTS custom_blocks  jsonb;

CREATE TABLE IF NOT EXISTS card_views (
  id         text PRIMARY KEY,
  order_id   text NOT NULL REFERENCES card_orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
  source     text,
  ua         text,
  country    text,
  city       text,
  referer    text,
  created_at timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS card_views_order_id_created_at_idx
  ON card_views (order_id, created_at);

CREATE TABLE IF NOT EXISTS card_leads (
  id         text PRIMARY KEY,
  order_id   text NOT NULL REFERENCES card_orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
  name       text,
  email      text,
  phone      text,
  message    text,
  created_at timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS card_leads_order_id_created_at_idx
  ON card_leads (order_id, created_at);
