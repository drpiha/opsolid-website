-- M5 — Premium tier (€7/mo / €60/yr).
--
-- Three additive concerns, all idempotent (`IF NOT EXISTS` everywhere) so the
-- migration is safe to re-apply.
--
--   1. UserSubscription — user-scoped Stripe subscription. Distinct from the
--      legacy order-scoped `subscriptions` table (which stays untouched and
--      keeps powering the per-card recurring orders from the marketing site).
--      One row per user (unique on user_id). Status mirrors Stripe values.
--
--   2. User.pro_since / User.stripe_customer_id — denormalised "is pro" check
--      (avoids joining UserSubscription on every card create) and cached
--      Stripe customer id (so checkout / portal calls don't have to look it
--      up by email each time). Both flipped by the Stripe webhook.
--
--   3. DomainRequest — Pro-only "request a custom domain" form. v1 emails
--      the maintainer + creates a row at status="pending"; manual provision
--      via the existing Traefik+ACME plan.
--
-- Apply on the VPS with:
--   docker exec opsolid-app npx prisma migrate deploy
--
-- Hasan applies this manually — do not auto-deploy.

-- ---------------------------------------------------------------------------
-- UserSubscription — user-scoped Pro subscription.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "user_subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "status" TEXT NOT NULL,
    "price_id" TEXT,
    "current_period_end" TIMESTAMP(3),
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_subscriptions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "user_subscriptions_user_id_key"
  ON "user_subscriptions"("user_id");

CREATE UNIQUE INDEX IF NOT EXISTS "user_subscriptions_stripe_subscription_id_key"
  ON "user_subscriptions"("stripe_subscription_id");

CREATE INDEX IF NOT EXISTS "user_subscriptions_stripe_customer_id_idx"
  ON "user_subscriptions"("stripe_customer_id");

CREATE INDEX IF NOT EXISTS "user_subscriptions_status_idx"
  ON "user_subscriptions"("status");

ALTER TABLE "user_subscriptions"
  ADD CONSTRAINT "user_subscriptions_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- User.pro_since + User.stripe_customer_id.
-- ---------------------------------------------------------------------------
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "pro_since" TIMESTAMP(3);

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "stripe_customer_id" TEXT;

CREATE INDEX IF NOT EXISTS "users_pro_since_idx" ON "users"("pro_since");

-- ---------------------------------------------------------------------------
-- DomainRequest — Pro custom-domain request (v1 manual provision).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "domain_requests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "card_order_id" TEXT,
    "domain" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "domain_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "domain_requests_user_id_idx" ON "domain_requests"("user_id");
CREATE INDEX IF NOT EXISTS "domain_requests_status_idx" ON "domain_requests"("status");

ALTER TABLE "domain_requests"
  ADD CONSTRAINT "domain_requests_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "domain_requests"
  ADD CONSTRAINT "domain_requests_card_order_id_fkey"
  FOREIGN KEY ("card_order_id") REFERENCES "card_orders"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
