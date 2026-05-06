-- Phase 8.5: Smart Action Inbox

CREATE TABLE IF NOT EXISTS card_actions (
  id TEXT NOT NULL PRIMARY KEY,
  sender_card_id TEXT NOT NULL REFERENCES card_orders(id) ON DELETE CASCADE,
  receiver_card_id TEXT NOT NULL REFERENCES card_orders(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  message VARCHAR(1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_card_actions_receiver ON card_actions (receiver_card_id, status);
CREATE INDEX IF NOT EXISTS idx_card_actions_sender ON card_actions (sender_card_id);
