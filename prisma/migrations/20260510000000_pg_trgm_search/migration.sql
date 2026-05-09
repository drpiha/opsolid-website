-- M2 — Discover at scale, deliverable 1: pg_trgm full-text search.
--
-- Adds the pg_trgm extension and six GIN trigram indexes on the JSONB string
-- accessors that the discover ?q= search hits. With these in place, the
-- existing ILIKE 'foo%' / ILIKE '%foo%' predicates become index-backed
-- (~10ms at 50k rows, vs ~500ms full sequential scan).
--
-- This migration is hand-written because Prisma's @@index annotation does not
-- support `gin_trgm_ops` operator classes — Prisma would emit a btree index on
-- the raw expression, which is useless for ILIKE substring queries.
--
-- CONCURRENTLY would be ideal but Prisma migrations always run inside a
-- transaction; CREATE INDEX CONCURRENTLY cannot run inside a transaction
-- block. At the current dataset size (16 demo cards on prod, growing to a
-- few hundred over the next quarter) the brief lock during plain CREATE
-- INDEX is acceptable.
--
-- Apply on the VPS with:
--   docker exec opsolid-app npx prisma migrate deploy
--
-- Hasan applies this manually — do not auto-deploy.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- One composite trigram index per searchable column. The expression
-- (card_data->>'<key>') yields TEXT, which gin_trgm_ops indexes for
-- substring + similarity queries.
CREATE INDEX IF NOT EXISTS card_orders_card_data_name_trgm
  ON card_orders USING gin ((card_data->>'name') gin_trgm_ops);

CREATE INDEX IF NOT EXISTS card_orders_card_data_company_trgm
  ON card_orders USING gin ((card_data->>'company') gin_trgm_ops);

CREATE INDEX IF NOT EXISTS card_orders_card_data_title_trgm
  ON card_orders USING gin ((card_data->>'title') gin_trgm_ops);

CREATE INDEX IF NOT EXISTS card_orders_card_data_industry_trgm
  ON card_orders USING gin ((card_data->>'industry') gin_trgm_ops);

CREATE INDEX IF NOT EXISTS card_orders_card_data_city_trgm
  ON card_orders USING gin ((card_data->>'city') gin_trgm_ops);

CREATE INDEX IF NOT EXISTS card_orders_card_data_bio_trgm
  ON card_orders USING gin ((card_data->>'bio') gin_trgm_ops);
