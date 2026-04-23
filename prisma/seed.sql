-- =============================================================================
-- OpSolid Digital Card — template catalog seed (manual fallback).
--
-- Runs after `prisma db push` has created the card_templates table.
-- Invoke:  docker exec -i opsolid-db psql -U opsolid -d opsolid < prisma/seed.sql
-- Idempotent: ON CONFLICT DO UPDATE keeps prices + Stripe IDs in sync.
-- =============================================================================

INSERT INTO card_templates
  (id, slug, name, sector_hint, component_key, preview_path,
   one_time_cents, monthly_cents, yearly_cents,
   stripe_one_time_price_id, stripe_monthly_price_id, stripe_yearly_price_id,
   is_active, sort_order, created_at, updated_at)
VALUES
  (1, 'minimal-mono',   'Minimal Mono',    'general',   'Template01', '/images/templates/card-01.png', 7900, 500, 3900,
   'price_1TPLkX25H593hnObbB3cDjRZ', 'price_1TPLkX25H593hnObFsuYfkwG', 'price_1TPLkX25H593hnObhWn3obfm',
   true, 1, NOW(), NOW()),
  (2, 'warm-serif',     'Warm Serif',      'creator',   'Template02', '/images/templates/card-02.png', 9900, 600, 4900,
   'price_1TPLkY25H593hnObMOVYfp1B', 'price_1TPLkY25H593hnObd5Q7nkuA', 'price_1TPLkY25H593hnObrtlEaUmW',
   true, 2, NOW(), NOW()),
  (3, 'estate-brass',   'Estate Brass',    'realEstate','Template03', '/images/templates/card-03.png', 12900, 700, 5900,
   'price_1TPLkZ25H593hnObjnIT7vxk', 'price_1TPLkZ25H593hnObZUdrkDxI', 'price_1TPLkZ25H593hnOb6qOoofB1',
   true, 3, NOW(), NOW()),
  (4, 'atelier-clean',  'Atelier Clean',   'salon',     'Template04', '/images/templates/card-04.png', 9900, 600, 4900,
   'price_1TPLka25H593hnObJmK5wAeF', 'price_1TPLka25H593hnObfAyNuZ0d', 'price_1TPLka25H593hnObXq3wHwq0',
   true, 4, NOW(), NOW()),
  (5, 'restaurant-noir','Restaurant Noir', 'restaurant','Template05', '/images/templates/card-05.png', 9900, 600, 4900,
   'price_1TPLkb25H593hnObAB5WaiHB', 'price_1TPLkb25H593hnObuLNC7kEz', 'price_1TPLkb25H593hnOb6U92Tq4k',
   true, 5, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  sector_hint = EXCLUDED.sector_hint,
  component_key = EXCLUDED.component_key,
  preview_path = EXCLUDED.preview_path,
  one_time_cents = EXCLUDED.one_time_cents,
  monthly_cents = EXCLUDED.monthly_cents,
  yearly_cents = EXCLUDED.yearly_cents,
  stripe_one_time_price_id = EXCLUDED.stripe_one_time_price_id,
  stripe_monthly_price_id = EXCLUDED.stripe_monthly_price_id,
  stripe_yearly_price_id = EXCLUDED.stripe_yearly_price_id,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();
