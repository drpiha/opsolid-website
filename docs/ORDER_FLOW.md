# Digital Card — Self-Serve Order Flow

This file documents the order flow that replaced the lead form on
`/products/digital-card`. It's what a customer goes through, and what you
need to keep running in production.

## Customer journey

1. Customer opens `/products/digital-card` and scrolls to **"Choose a design"**.
2. Every template is numbered (`#01` … `#05`). Customer clicks a card — page
   scrolls to the order form.
3. Customer fills in:
   - Contact: name, email, phone, optional **"Call me back"** checkbox.
   - Card content: the fields that end up on the public card (name, title,
     company, phone, email, website, address, bio, WhatsApp, social links).
   - Uploads: profile photo + logo (JPEG/PNG/SVG, max 2 MB each).
   - Brand colors: two hex values — the template picks them up live.
   - Billing mode: one-time purchase or yearly subscription.
4. Live preview on the right re-renders on every keystroke.
5. Submit → backend creates a `CardOrder` row (status `PENDING_PAYMENT`),
   creates a Stripe Checkout session, redirects to Stripe.
6. Customer pays on Stripe.
7. Stripe webhook (`/api/webhooks/stripe` → `checkout.session.completed`)
   marks the order `PUBLISHED`, generates a slug, triggers admin
   notifications (Telegram + CallMeBot WhatsApp + SMTP email — all already
   wired in `src/lib/notifications.ts`).
8. Customer lands on `/products/digital-card/thanks/{orderId}` showing the
   live URL + QR code.
9. Public page: `/c/{slug}` — always renders the chosen template with the
   saved card data.

## Admin

`/admin/orders?token=YOUR_ADMIN_TOKEN` (bearer-token via query string) shows
three tabs:

- **Call-me-back** — customers who ticked the checkbox and haven't been
  contacted yet. "Mark contacted" removes them from this list and writes
  an `OrderStatusHistory` audit row.
- **Active** — all `PUBLISHED` orders.
- **Pending** — orders still awaiting payment (`PENDING_PAYMENT` or `PAID`
  but not yet published — the latter is a transient state).

## Environment variables

See `.env.example`. The new additions are:

| Var | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection (Hostinger VPS) |
| `STRIPE_SECRET_KEY` | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Reserved for client-side Elements (not used yet) |
| `NEXT_PUBLIC_SITE_URL` | Base URL for Stripe redirects + card URLs |
| `ADMIN_TOKEN` | Long random string; used as `?token=…` on the admin page |

Existing variables (`SMTP_*`, `TELEGRAM_*`, `WHATSAPP_*`) are reused for
order notifications — no new notification wiring needed.

## Stripe setup (one-time)

1. Create a Stripe account (or use the existing one).
2. In the dashboard create **one product per template** with two prices:
   - One-time price (EUR).
   - Yearly recurring price (EUR).
3. Paste the Price IDs into `src/config/card-templates.ts`
   (`stripeOneTimePriceId` and `stripeYearlyPriceId`). Until you do, the
   backend uses inline `price_data` which still works — you just lose the
   nicer reporting grouping.
4. Add a webhook endpoint in the Stripe dashboard pointing at
   `https://opsolid.de/api/webhooks/stripe`, listening for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`.

## Database setup (Hostinger VPS)

The VPS already runs Postgres for Kutasia. Reuse the same instance with a
fresh database + user so the two projects are isolated.

```bash
ssh root@72.62.0.111
sudo -u postgres psql
-- inside psql:
CREATE USER opsolid_web WITH PASSWORD 'choose-a-strong-one';
CREATE DATABASE opsolid_web OWNER opsolid_web;
GRANT ALL PRIVILEGES ON DATABASE opsolid_web TO opsolid_web;
\q
```

Then on the VPS (or your dev machine with a tunnel):

```bash
export DATABASE_URL="postgresql://opsolid_web:PW@localhost:5432/opsolid_web?schema=public"
npx prisma migrate deploy   # or: npx prisma db push   (dev only)
npx prisma db seed          # seeds the 5 templates from the TS config
```

## Adding a template

1. Drop a PNG at `public/images/templates/card-06.png` (optional — the
   gallery also shows a live render).
2. Create `src/components/cards/templates/Template06.tsx` exporting a
   `Template06` component that renders `CardRenderProps`.
3. Register it in `src/components/cards/TemplateRenderer.tsx`.
4. Add an entry in `src/config/card-templates.ts` with the next id.
5. Re-run `npx prisma db seed`.
6. Build & ship.
