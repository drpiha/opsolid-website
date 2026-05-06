-- Phase 8.4: Card feedback mode

ALTER TABLE card_orders
  ADD COLUMN IF NOT EXISTS feedback_enabled BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS card_feedback (
  id TEXT NOT NULL PRIMARY KEY,
  card_order_id TEXT NOT NULL REFERENCES card_orders(id) ON DELETE CASCADE,
  giver_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ratings JSONB NOT NULL DEFAULT '{}',
  comment VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  pii_redacted_at TIMESTAMPTZ,
  CONSTRAINT card_feedback_giver_card_unique UNIQUE (giver_id, card_order_id)
);

CREATE INDEX IF NOT EXISTS idx_card_feedback_card_order_id ON card_feedback (card_order_id);
CREATE INDEX IF NOT EXISTS idx_card_feedback_giver_id ON card_feedback (giver_id);
