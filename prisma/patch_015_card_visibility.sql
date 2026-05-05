-- Phase 8.1: Card visibility and professional discovery fields
-- Safe to run on existing data: all defaults are non-breaking

ALTER TABLE card_orders
  ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'public',
  ADD COLUMN IF NOT EXISTS open_to_networking BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS accepting_clients BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS industry TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'DE',
  ADD COLUMN IF NOT EXISTS languages TEXT[] NOT NULL DEFAULT '{}';

-- Performance indexes for discovery queries
CREATE INDEX IF NOT EXISTS idx_card_order_visibility ON card_orders (visibility, status);
CREATE INDEX IF NOT EXISTS idx_card_order_networking ON card_orders (open_to_networking, status);
CREATE INDEX IF NOT EXISTS idx_card_order_industry ON card_orders (industry, status) WHERE industry IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_card_order_country ON card_orders (country, status);
