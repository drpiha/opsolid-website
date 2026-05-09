-- Sprint F2 — Events / Fairs feature.
-- Adds Event + EventAttendee tables. Hand-written to match the schema.prisma
-- additions (model Event + model EventAttendee). Run on the VPS with:
--   docker exec opsolid-app npx prisma migrate deploy
-- Hasan applies this manually — do not auto-deploy.

-- CreateTable: events
CREATE TABLE "events" (
  "id"          TEXT          NOT NULL,
  "slug"        TEXT          NOT NULL,
  "name"        TEXT          NOT NULL,
  "city"        TEXT          NOT NULL,
  "country"     TEXT,
  "venue"       TEXT,
  "start_at"    TIMESTAMP(3)  NOT NULL,
  "end_at"      TIMESTAMP(3)  NOT NULL,
  "description" TEXT,
  "cover_path"  TEXT,
  "is_active"   BOOLEAN       NOT NULL DEFAULT true,
  "created_at"  TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"  TIMESTAMP(3)  NOT NULL,

  CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateTable: event_attendees
CREATE TABLE "event_attendees" (
  "id"        TEXT          NOT NULL,
  "event_id"  TEXT          NOT NULL,
  "card_id"   TEXT          NOT NULL,
  "rsvp_at"   TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "event_attendees_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "event_attendees_event_id_card_id_key" ON "event_attendees"("event_id", "card_id");

ALTER TABLE "event_attendees"
  ADD CONSTRAINT "event_attendees_event_id_fkey"
  FOREIGN KEY ("event_id") REFERENCES "events"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "event_attendees"
  ADD CONSTRAINT "event_attendees_card_id_fkey"
  FOREIGN KEY ("card_id") REFERENCES "card_orders"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
