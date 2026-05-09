-- Sprint F4 — Inbox messaging thread.
-- Adds the `messages` table (1-to-many with `card_connections` and `users`).
-- Hand-written to match the schema.prisma additions (model Message + inverse
-- relations on User and CardConnection). Run on the VPS with:
--   docker exec opsolid-app npx prisma migrate deploy
-- Hasan applies this manually — do not auto-deploy.

-- CreateTable: messages
CREATE TABLE "messages" (
  "id"               TEXT          NOT NULL,
  "connection_id"    TEXT          NOT NULL,
  "sender_user_id"   TEXT          NOT NULL,
  "body"             VARCHAR(2000) NOT NULL,
  "sent_at"          TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "read_at"          TIMESTAMP(3),

  CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "messages_connection_id_sent_at_idx"
  ON "messages"("connection_id", "sent_at");

CREATE INDEX "messages_sender_user_id_idx"
  ON "messages"("sender_user_id");

ALTER TABLE "messages"
  ADD CONSTRAINT "messages_connection_id_fkey"
  FOREIGN KEY ("connection_id") REFERENCES "card_connections"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "messages"
  ADD CONSTRAINT "messages_sender_user_id_fkey"
  FOREIGN KEY ("sender_user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
