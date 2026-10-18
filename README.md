# OpSolid — Business Website

Website and app surfaces for OpSolid: speaking AI agents, websites and
automation for small and mid-sized businesses (Arnsberg, Germany).
Contributor rules (voice, honesty, art direction, 3D-stage guardrails) are in
[`CLAUDE.md`](./CLAUDE.md); read it before changing marketing pages.

## Tech Stack

- **Framework:** Next.js 14 (App Router), API routes in the same server
- **Language:** TypeScript
- **Styling:** `src/styles/opsolid-v4.css` (marketing, v4) and Tailwind CSS
  with `src/styles/legacy.css` (app surfaces)
- **3D stage (marketing):** three.js + GSAP ScrollTrigger, loaded on first
  user intent; static SVG poster before that
- **Animations (app surfaces):** Framer Motion; marketing uses only the small
  `Reveal` observer
- **Icons:** Lucide React
- **UI primitives (app surfaces):** custom components with CVA
- **Data:** PostgreSQL via Prisma
- **Email:** Brevo, Resend or SMTP (Nodemailer), see `src/lib/email/client.ts`
- **Notifications:** Telegram Bot + WhatsApp (CallMeBot) + email

## Getting Started

```bash
npm install          # install dependencies
npm run dev          # dev server at http://localhost:3000
npm run build        # production build (type check, ESLint, source-map gate)
npm start            # serve the production build
```

Checks before a pull request (see `CLAUDE.md` for the full gate):

```bash
npm run lint
npx tsc --noEmit
npm run predeploy                                   # audit:cards + build
npx tsx --test scripts/tests/redirects.test.mts     # routing / redirect contract
```

## Project Structure

```
src/
├── middleware.ts                # locale routing (country, not browser language), redirects
├── app/
│   ├── layout.tsx               # root layout; sets html[data-v4] on marketing routes
│   ├── [locale]/                # de | en | tr
│   │   ├── page.tsx             # home (v4)
│   │   ├── agents/ websites/ leistungen/ ki-beratung/ prozessautomatisierung/
│   │   │   microsoft-365-automatisierung/ interne-tools/ ki-schulungen/
│   │   │   ai-automation-check/ ueber-uns/ contact/ blog/
│   │   │                        # marketing pages: v4Meta + v4Page from components/v4/make-page
│   │   ├── opso/                # OpSo product page (own components, v4 theme)
│   │   ├── impressum/ privacy/  # legal pages (content bundle)
│   │   └── (auth)/ dashboard/ onboarding/ discover/ card/ c/ products/ events/ …
│   │                            # app surfaces (tri-theme, content bundle)
│   ├── admin/ voice/ c/ l/      # admin, voice agent console, public cards, short links
│   └── api/                     # contact, geo, health, auth, cards, orders, webhooks/{cal,stripe}, …
├── components/
│   ├── v4/                      # marketing system: PageRenderer, Stage, AgentDemo, Reveal,
│   │                            # ContactForm4, JsonLd, make-page, FxToggle, V4Sync, ContentGate
│   ├── layout/                  # Header (language switch, nav), Footer ("3D-Effekte" switch)
│   ├── shared/                  # LocaleLink, Icon
│   ├── sections/                # FaqAccordion, FinalCTA, PricingTable (OpSo order flow only)
│   ├── ui/                      # Button, Card, Badge, Input (CVA, app surfaces)
│   ├── cards/ dashboard/ products/ voice/
├── content/
│   ├── v4/pages-{de,en,tr}.ts   # marketing page text (typed by v4/types.ts)
│   ├── en.ts de.ts tr.ts        # app-surface + legal text (en.ts defines the type)
│   └── blog/                    # blog posts
├── lib/
│   ├── constants.ts             # brand name, domain, email, address, SITE_UPDATED_ISO
│   ├── locale-routing.ts        # pure locale decision (unit-tested)
│   ├── redirects.ts             # retired URLs -> 301
│   ├── seo-v4.ts v4.ts          # canonical/hreflang/OG; marketing route list
│   ├── email/ notifications.ts  # mail providers; Telegram/WhatsApp/email notifications
│   └── …
└── styles/                      # opsolid-v4.css (marketing), legacy.css + imports (app)
```

---

## Firma Adini / Marka Degistirme (Name Change Guide)

Gelecekte firma adini degistirmek istersen (orn. "OpSolid" -> "YeniIsim"):

### Adim 1: Ana Config (1 dosya)
`src/lib/constants.ts` dosyasini ac ve su alanlari degistir:
```ts
name: "YeniIsim",          // Firma adi
url: "https://yenisite.de", // Domain
email: "hello@yenisite.de", // E-posta
```

### Adim 2: Tum Metinlerde Bul-Degistir
VS Code'da `Ctrl + Shift + H` (Bul ve Degistir):
- **Ara:** `OpSolid`
- **Degistir:** `YeniIsim`
- **"Replace All"** tikla

Bu islem su dosyalari gunceller:
- `src/content/v4/pages-de.ts`, `pages-en.ts`, `pages-tr.ts` (pazarlama sayfalari)
- `src/content/en.ts`, `de.ts`, `tr.ts` (uygulama ve yasal metinler)
- `src/lib/notifications.ts`, `src/lib/email/` (bildirim e-postalari)
- `src/app/api/contact/route.ts` (form e-postalari)
- `public/llms.txt`

Sonucu tek tek kontrol et: metinler `CLAUDE.md`'deki ses ve durustluk kurallarina uymali.

### Adim 3: Domain Degisikligi (opsiyonel)
Eger domain de degisiyorsa, ek olarak:
- `src/lib/constants.ts` → `url` ve `email` alanlarini guncelle
- `.env.example` → `CONTACT_TO_EMAIL` degerini guncelle
- `Ctrl + Shift + H` ile `opsolid.de` → `yenisite.de` degistir
- Canli ortamdaki `NEXT_PUBLIC_SITE_URL`: VPS'teki `.env` elle degistirilmez (bkz. "Deployment");
  canli ortam degiskeni degisikligi ayri incelenen bir ops degisikligidir
- DNS kayitlarini yeni domaini Hostinger VPS'e (Traefik) yonlendirecek sekilde ayarla

### Adim 4: Dogrulama ve Yayin
```bash
npm run predeploy   # audit:cards + build, hata olmadigini dogrula
# PR ac -> main'e merge
```
`main`'e merge yalnizca dogrulama calistirir, **otomatik deploy yoktur**. Yayin icin
asagidaki "Deployment" bolumundeki incelenmis yolu izle.

---

## Booking notifications (Cal.com webhook)

The site does not embed a booking widget; contact goes through the v4 contact
form (`/api/contact`). Bookings made on Cal.com itself can still notify the
owner through the webhook receiver:

```
Booking on Cal.com
    → Cal.com webhook → https://opsolid.de/api/webhooks/cal (HMAC-checked)
        → Telegram message
        → WhatsApp message (CallMeBot)
        → Email
```

Without `CALCOM_WEBHOOK_SECRET` the webhook answers 503.

### Accounts

#### 1. Cal.com webhook
Settings → Developer → Webhooks → add webhook:
- URL: `https://opsolid.de/api/webhooks/cal`
- Secret: choose one and keep it (`CALCOM_WEBHOOK_SECRET`)
- Events: `BOOKING_CREATED`, `BOOKING_CANCELLED`, `BOOKING_RESCHEDULED`

#### 2. Telegram Bot
1. Telegram'da @BotFather'a `/newbot` gonder
2. Bot adi: orn. "OpSolid Booking Agent"
3. Bot token'i kopyala
4. Bot'a bir mesaj gonder, sonra tarayicida ac:
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. JSON'daki `chat.id` degerini not al

#### 3. WhatsApp CallMeBot
1. +34 644 71 84 60 numarasina WhatsApp'tan gonder:
   `I allow callmebot to send me messages`
2. Gelen API key'i not al

### Environment Variables

The full list with comments is in `.env.example`. The keys for contact and
booking notifications:

| Key | Aciklama | Ornek |
|-----|----------|-------|
| `CALCOM_WEBHOOK_SECRET` | Webhook dogrulama sifresi | `my-secret-key` |
| `TELEGRAM_BOT_TOKEN` | BotFather'dan alinan token | `712345:AAHfiq...` |
| `TELEGRAM_CHAT_ID` | Telegram chat ID | `123456789` |
| `WHATSAPP_PHONE` | WhatsApp telefon numarasi | `4917631020654` |
| `WHATSAPP_CALLMEBOT_APIKEY` | CallMeBot API key | `1234567` |
| `BREVO_API_KEY` / `RESEND_API_KEY` | E-posta saglayicisi (biri yeterli) | |
| `SMTP_HOST` | SMTP sunucu (saglayici yoksa) | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP kullanici | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP sifre (App Password) | `xxxx xxxx xxxx xxxx` |
| `CONTACT_TO_EMAIL` | Form mesajlarinin gidecegi adres | `hello@opsolid.de` |

Without `CONTACT_TO_EMAIL` and one mail provider, `POST /api/contact` answers
503 and the message is not delivered.

On the production VPS these values live in the running container's
environment. Do not edit `/opt/opsolid-website/.env` by hand (see
"Deployment"); a runtime env change is its own reviewed ops change.

---

## Customization Guide

| What to change | Where |
|---|---|
| Company name, domain, email, address, "Stand:" date | `src/lib/constants.ts` |
| Marketing page text (hero, blocks, FAQ, CTA) | `src/content/v4/pages-{de,en,tr}.ts` |
| App-surface and legal text | `src/content/en.ts` (type source), `de.ts`, `tr.ts` |
| Marketing colors, type, components | `src/styles/opsolid-v4.css` (`--v4-*` tokens) |
| App-surface colors and fonts | `src/styles/opsolid-tokens.css` + `tailwind.config.ts` |
| SEO metadata | `src/lib/seo-v4.ts` (marketing), each app route's `metadata` |
| GEO/SEO surface | `public/llms.txt`, `src/app/robots.ts`, `src/app/sitemap.ts` |

### Localization

Public locales are `de`, `en`, `tr`. Language follows the visitor's country,
not the browser language: logic in `src/lib/locale-routing.ts`, wiring in
`src/middleware.ts`. All three marketing page files must define the same
pages; `en.ts`, `de.ts` and `tr.ts` must keep an identical structure or the
build fails. Details in `CLAUDE.md` ("Localization System").

### Legal Pages

Impressum and privacy text is in the content bundle (`src/content/{en,de,tr}.ts`)
and rendered by `src/app/[locale]/impressum` and `src/app/[locale]/privacy`.
Changes to legal text need the owner's review.

## Deployment

The site is **self-hosted on a Hostinger VPS** (Docker Compose + Traefik +
PostgreSQL). It is **not** deployed to Vercel.

**Merging to `main` does not deploy.** `.github/workflows/deploy.yml` is
"Verify web source (production disabled)": on pull requests and `main` pushes
it only validates (locked install, Prisma generate, `audit:cards`, lint,
typecheck, contract tests, production build and source-map gate). It has no
SSH, no secrets and no deploy step. There is no rebuild on the VPS:
`scripts/deploy.sh` is retired and exits with an error, and
`docker compose up -d --build` / `git pull` in `/opt/opsolid-website` must not
be used.

A release is three separate steps:

1. **Image.** After the exact `main` push passes "Verify web source", the
   repository owner dispatches `build-runtime-image.yml` on `main` with the
   full 40-character `main` SHA as `commit`. It builds the committed
   Dockerfile on a hosted runner and keeps the image only as a three-day
   artifact (`opsolid-image-<commit>-<run-id>-<attempt>`: `image.tar.gz`,
   `metadata.json`, `SHA256SUMS`). No registry push, no VPS access.
   Details: [`docs/ops/hosted-runtime-image.md`](./docs/ops/hosted-runtime-image.md).
2. **Private receive** (separately reviewed): authenticate the exact owner run
   and artifact, verify every hash, `docker load`, then re-check image ID,
   platform and OCI revision on the VPS.
3. **App-only cutover** (separately reviewed), as root on the VPS with
   `scripts/ops/opsolid-app-cutover.py`:
   - `--mode prepare-existing --expected <private expected-identity file>
     --candidate-image <loaded image> --commit <sha> --current-state <current
     packet dir> --current-manifest-sha256 <hash>` writes a new private
     forward/rollback packet. It keeps the complete live environment and
     database connection and changes only the image and `GIT_COMMIT`.
   - `--mode apply --state <packet>` is a dry run; the same command with
     `--execute` switches only the `opsolid` app container after an
     independent release GO. A failed forward step rolls back automatically;
     `--mode rollback --state <packet> [--execute]` returns to the previous
     image.

The cutover never builds, pulls, syncs source, runs migrations or
`db-bootstrap.sh`, or changes roles and permissions. A release that needs a
schema change needs its own reviewed database step first.

**Keep `/opt/opsolid-website/docker-compose.yml` and `.env` byte-identical.**
The cutover script compares them with the originals recorded in the current
packet and refuses to continue if either differs; editing them, or rebuilding
from them, breaks the release and rollback chain.

**For this release use only `--mode prepare-existing`.** The original
`--mode prepare` depends on the candidate runtime smoke test, which is stale
(it still expects `/signup` to answer 200); see the follow-up in
[`deploy/hostinger/README.md`](./deploy/hostinger/README.md#release-and-follow-ups).
The post-cutover proof checks only `/api/health` and the database identity,
so run the public page checks listed there by hand after `apply --execute`.

- **First-time setup and VPS layout:** `deploy/hostinger/README.md`
- **Env vars:** `.env.example` (reference only; see above for production)
- **DNS:** point `opsolid.de` / `www` / `card` / `go` A records at the VPS IP
  (Traefik terminates TLS via ACME). No Vercel DNS records.
