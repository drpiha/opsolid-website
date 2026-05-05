-- Phase 8.3: SavedCard — user bookmarks / contact list
-- Safe to apply on existing data. No column removals.

CREATE TABLE IF NOT EXISTS saved_cards (
  id TEXT NOT NULL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_order_id TEXT NOT NULL REFERENCES card_orders(id) ON DELETE CASCADE,
  notes TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  met_where TEXT,
  follow_up_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'new',
  starred BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT saved_cards_user_card_unique UNIQUE (user_id, card_order_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_cards_user_id ON saved_cards (user_id);
CREATE INDEX IF NOT EXISTS idx_saved_cards_starred ON saved_cards (user_id, starred) WHERE starred = true;
