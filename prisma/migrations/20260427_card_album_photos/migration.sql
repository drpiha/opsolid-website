-- =============================================================================
-- Migration 20260427_card_album_photos — Album feature (Workstream E)
--
-- Adds card_album_photos table: each row is one photo contributed to a
-- card's album. Owner uploads land as APPROVED, visitor uploads as PENDING
-- and require the owner to approve via the dashboard moderation queue.
--
-- connection_id is a soft FK to card_connections — when set, the photo is
-- tagged as "with that person" (mini-CRM linkage). SET NULL on delete so
-- removing a connection doesn't destroy the photo evidence.
--
-- uploader_ip_hash stores sha256(ip + IP_HASH_SALT) truncated to 32 chars —
-- enough entropy for abuse detection without ever persisting raw IPs.
-- =============================================================================

CREATE TABLE "card_album_photos" (
    "id" TEXT NOT NULL,
    "card_order_id" TEXT NOT NULL,
    "uploader_type" TEXT NOT NULL,
    "uploader_name" TEXT,
    "uploader_ip_hash" TEXT,
    "photo_path" TEXT NOT NULL,
    "caption" TEXT,
    "connection_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_at" TIMESTAMP(3),

    CONSTRAINT "card_album_photos_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "card_album_photos_card_order_id_status_idx" ON "card_album_photos"("card_order_id", "status");
CREATE INDEX "card_album_photos_connection_id_idx" ON "card_album_photos"("connection_id");

ALTER TABLE "card_album_photos" ADD CONSTRAINT "card_album_photos_card_order_id_fkey" FOREIGN KEY ("card_order_id") REFERENCES "card_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "card_album_photos" ADD CONSTRAINT "card_album_photos_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "card_connections"("id") ON DELETE SET NULL ON UPDATE CASCADE;
