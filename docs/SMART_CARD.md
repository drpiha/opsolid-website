# OpSolid Smart Card — Deployment & Operations

Status as of branch `feature/smart-card-mvp` — Phases 1, 2, 3, 4 complete.

This is the operations doc for the new Smart Card surface. The product
docs (pricing, copy, marketing) live elsewhere.

## What ships in this branch

### Phase 1 — Core card
- New premium mobile-first layout at `/c/[slug]`, replacing the legacy
  `Template01..05` renderer.
- `SmartCard` supports: cover image, avatar, position/title/company/bio,
  CTA bar (Save / Call / WhatsApp / Email / Termin), custom buttons,
  contact rows, social pills, services, gallery, video embed, brochure,
  FAQ, testimonials, footer with Impressum / Datenschutz / share.
- vCard download (`/api/cards/[slug]/vcard`) now writes the visit source
  into the saved contact's NOTE field.
- Source tracking: `?src/?campaign/?event/?location` flow through to
  vCard NOTE, lead form, and `card_views.source` analytics column.

### Phase 2 — Lead capture
- "Bilgilerimi gönder" form on every card → POST `/api/cards/[slug]/lead`.
- Stores `CardLead` row, sends notification email to the card owner with
  reply-to set to the visitor.
- Admin (`/admin/orders/[id]?token=…`) shows a Leads panel + Views panel
  with last 50 page views.
- Founder seed: `prisma/seed.ts` publishes `card.opsolid.de/hasan` so the
  product has a live demo on day one. Idempotent — re-running updates in
  place, no duplicates.

### Phase 4 — Sector presets + Smart Exchange foundation
- `src/config/card-sectors.ts` — 10 sector starter packs (consultant,
  real-estate, salon, restaurant, clinic, lawyer, creator, sales-pro,
  corporate, event). Each fills empty service / CTA / FAQ blocks +
  suggests brand colors.
- `CardData.sectorKey` field. SmartCard renders a sector badge and falls
  back to the preset's services/buttons/FAQs for blocks the owner left
  empty. Owner-supplied content always wins.
- Admin `Sector preset` panel on `/admin/orders/[id]` with one-click
  apply (POST `/api/admin/cards/[id]/sector`).
- `CardConnection` table + migration `prisma/patch_004_card_connections.sql`
  for the future Smart Exchange flow (Phase 5 wires the UI).

### Phase 3 — Short links & QR
- New `CardLink` and `ScanEvent` tables (migration:
  `prisma/patch_003_card_links.sql`).
- Short-link gateway at `/l/[code]` (rewritten from
  `go.opsolid.de/[code]` by middleware). Records `ScanEvent` then
  307-redirects to `card.opsolid.de/<slug>` with source query params.
- Admin Links panel (`/admin/orders/[id]`): create labelled short links
  per channel (qr-main, instagram-bio, nfc-card, hannover-messe-2026 …),
  see scan counts, copy URL, download per-link QR PNG/SVG.
- `/api/qr/[slug]` now accepts `?code=…` so each short link gets its own
  QR encoding the short URL instead of the canonical card URL.

## Subdomain routing

Single Next.js container, three hostnames, all routed by Traefik to
port 3000. Middleware splits them on `host`:

| Host                       | Internal path     | Purpose                          |
|----------------------------|-------------------|----------------------------------|
| `opsolid.de/c/[slug]`      | `/c/[slug]`       | Internal canonical (also works)  |
| `card.opsolid.de/[slug]`   | rewrites to `/c/` | Public canonical for sharing     |
| `go.opsolid.de/[code]`     | rewrites to `/l/` | Short-link gateway with tracking |
| `opsolid.de/l/[code]`      | `/l/[code]`       | Internal alias                   |

Traefik labels are already in `docker-compose.yml`. DNS for both
`card.opsolid.de` and `go.opsolid.de` must point at the VPS for TLS to
issue.

## Environment variables

Add to `/opt/opsolid-website/.env` on the VPS:

```bash
# Required
DATABASE_URL=postgresql://opsolid:STRONG_PASSWORD@opsolid-db:5432/opsolid?schema=public
NEXT_PUBLIC_SITE_URL=https://opsolid.de
ADMIN_TOKEN=<long random string — used by /admin/orders/?token=…>

# Smart Card hosts (override only if using custom domains)
NEXT_PUBLIC_CARD_HOST=card.opsolid.de
NEXT_PUBLIC_SHORT_HOST=go.opsolid.de

# Email — already in place from contact form. Without these, lead
# notifications and customer order emails are warn-and-skip.
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=…@gmail.com
SMTP_PASS=…
CONTACT_TO_EMAIL=hello@opsolid.de
CONTACT_FROM_EMAIL=

# Storage — leave unset for local FS (volume-mounted), or configure Blob.
# STORAGE_DRIVER=blob
# BLOB_READ_WRITE_TOKEN=…

# Stripe — already in place from existing card-order flow.
STRIPE_SECRET_KEY=sk_…
STRIPE_WEBHOOK_SECRET=whsec_…
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_…
```

## First-time deploy of this branch

From a workstation with the SSH key configured:

```bash
git checkout feature/smart-card-mvp
git pull --ff-only

# 1. Ship the code
bash scripts/deploy.sh

# 2. Apply the Phase 3 schema migration (card_links, scan_events)
ssh root@srv1150632.hstgr.cloud \
  'docker exec -i opsolid-db psql -U opsolid opsolid' \
  < prisma/patch_003_card_links.sql

# 3. Apply the Phase 4 schema migration (card_connections)
ssh root@srv1150632.hstgr.cloud \
  'docker exec -i opsolid-db psql -U opsolid opsolid' \
  < prisma/patch_004_card_connections.sql

# 4. Seed the founder card + sync templates (idempotent)
ssh root@srv1150632.hstgr.cloud \
  'docker exec opsolid-app npx prisma db seed'
```

Verify:

```bash
# Card surface
curl -I https://card.opsolid.de/hasan        # → 200, includes Open Graph meta
curl    https://opsolid.de/c/hasan/vcard.vcf # → text/vcard
open    https://opsolid.de/c/hasan.png        # → 1200×630 OG image

# Admin
open  "https://opsolid.de/admin/orders?token=$ADMIN_TOKEN"
```

## How a card owner uses the system

1. Place an order via `/products/digital-card` (or admin manually creates it).
2. After payment + designer publishes → card lives at
   `card.opsolid.de/<slug>`.
3. From `/admin/orders/<id>?token=…` the owner / operator can:
   - See every lead submitted via the public form.
   - Create labelled short links per channel.
   - Download per-link QR codes (PNG for print, SVG for vector use).
4. NFC cards are programmed to write `https://go.opsolid.de/<code>` —
   the gateway records the scan, then opens the card.

## Rate limits & abuse

- Lead form: 5 submissions per `(slug, ip)` per 10 minutes (in-memory).
- Short-link gateway: no rate limit (a public URL must respond fast);
  scan-event writes are non-blocking.

## Troubleshooting

**`card.opsolid.de/hasan` returns 404**
- Check the seed ran: `docker exec opsolid-app npx prisma db seed`.
- Verify `card_orders.status = 'PUBLISHED'` and `slug = 'hasan'`.

**Short-link redirects but no scan event recorded**
- Check Postgres: `SELECT count(*) FROM scan_events;` — if 0, confirm the
  patch was applied (`\d scan_events` in psql).

**vCard saves with no source label**
- Source is captured only when the URL has `?src=…` (or campaign / event /
  location). Direct visits intentionally produce no label.

**OG image is broken in WhatsApp**
- WhatsApp picks the *first* og:image. Our metadata sends the 1200×630
  first then the 600×600 — most platforms preserve order, but some chat
  clients re-fetch and pick the larger. If WhatsApp shows a thin slice,
  check that `/c/[slug]/wa.png` is reachable and returns 200.
