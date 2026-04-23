# OpSolid Website — Live Status

**Son güncelleme:** 2026-04-23 (üçüncü oturum — new-machine pull + smoke test)
**Aktif dal:** `main` (feat/complete-dbc artık merge edilmiş, main 3 commit önde)
**Kanonik canlı panel.** Her oturum başında okunur, sonunda güncellenir.

---

## 2026-04-23 üçüncü oturum — new-machine pull + smoke test

Yeni makineye geçiş sürecinin son adımı + canlı sistem doğrulama:

**Tamamlanan**
- ✅ `drpiha/opsolid-website` taze clone (mayai-website klasörü sync edildi), secrets `$HOME`'a yerleşti (SSH key için CRLF → LF fix gerekli oldu — install.sh'in Windows'ta ürettiği dosyalar CRLF'di, `sed -i 's/\r$//'` ile düzeltildi).
- ✅ `M2M_ADMIN_TOKEN` `.opsolid-deploy-secrets`'a eklendi (bundle'da yoktu, VPS ile aynı değer olduğu doğrulandı).
- ✅ Remote `bundle-one-time` branch'i silindi (`git push origin --delete`). Local'de zaten yoktu.
- ✅ SSH → VPS → `docker ps` geçer: `opsolid-app (Up 1h)`, `opsolid-db (healthy 7h)`, `kutasia-app (Up 1h)`, `kutasia-db (healthy 5d)`.
- ✅ `GET /api/health` → `{"ok":true,"dbOk":true}`.
- ✅ `GET /c/claude-test-eokd` → 200 (test kartı hâlâ yayında).
- ✅ `GET /api/m2m/orders` Bearer ile 200 + order listesi; Bearer'sız `{"error":"Unauthorized","reason":"no_header"}`.
- ✅ `GET /api/m2m/stats?range=all` Bearer ile `{total:1, published:1, revenue €39 subscription}` döner.
- ✅ `https://kutasia.com/admin/opsolid-orders` → 307 `/login` (SUPER_ADMIN guard çalışıyor); `/api/admin/opsolid-orders` → 401 (proxy çalışıyor).
- ✅ SMTP env tümü set (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`). Son 24h log'da email/SMTP hatası yok.
- ✅ `docker-compose.yml`'a `opsolid-app` için healthcheck eklendi (`wget /api/health` → `"ok":true`, 30s interval, 20s start_period). **Deploy bekliyor** — operator `docker compose up -d --build opsolid` ile aktive eder.

**Bulgu — Kutasia VPS drift (operator aksiyonu)**
- `/opt/kutasia` HEAD = `d8c0d49` (2026-04-20). GitHub `origin/master` = `8961d9e` (Track A commit'i, 2026-04-23). **VPS stale.**
- Admin integration dosyaları (`src/app/(admin)/admin/opsolid-orders/`, `src/app/api/admin/opsolid-orders/`, `src/lib/opsolid/client.ts`) VPS'te **untracked** — önceki oturum bunları VPS'e el ile yerleştirmiş + `docker compose up -d --build kutasia` ile canlıya almış. Sayfa çalışıyor ama git divergent.
- Ayrıca `admin-shell.tsx` + `env-check.ts` uncommitted modify; `docker-compose.yml` untracked (yeni: `/var/www/kutasia/uploads:/app/public/uploads` volume mount).
- VPS'te git HTTPS auth yok (`fatal: could not read Username for 'https://github.com'`). Operator PAT remote URL kurmalı veya `git@github.com:drpiha/guestsignal.git` için deploy key eklemeli.
- Önerilen düzeltme: operator DEV makinesinden `git clone https://github.com/drpiha/guestsignal.git` → VPS'in uncommitted dosyalarını `scp` ile getir → master ile diff'le → tek bir fix branch'e (örn. `hotfix/uploads-volume + env-check`) çıkar → push. Sonra VPS'te (değişiklikleri stash ya da temiz shadow working tree ile) `git pull origin master` → `docker compose up -d --build kutasia`. Karışık pull yerine temiz checkout tercih edilmeli.

**Operatör onayı bekleyen (bu oturum dokunmadı)**
- LIVE Stripe cutover (madde #4 — `scripts/setup-stripe.ts --live` + `.env` güncelle + restart; detay `deploy/hostinger/CUTOVER.md`).
- Sentry DSN aç (madde #3 — opsiyonel, boşken SDK no-op, üretim crash olmaz).
- `test-customer-email.ts` manuel smoke — VPS'te container içinde kod exec kısıtlı (policy); operator DEV makinesinden `SMTP_*` env'ini set edip `npx tsx scripts/test-customer-email.ts <address>` çalıştırabilir.
- Gerçek test siparişi (madde #6 — browser'dan `/tr/products/digital-card` → şablon seç → Stripe `4242…` → thanks → Kutasia admin'de "Publish" → e-posta kontrol).
- Kutasia VPS drift reconcile (yukarıdaki bulgu).

**Secrets rotation tavsiyesi**
Eski makineden yeni makineye geçiş için secret'lar `bundle-one-time` branch'inde GitHub'a 1 kez commit'lendi. Repo private olsa da:
- SSH key: VPS'te `/root/.ssh/authorized_keys` güncel kalabilir, ama fırsat buldukça yeni bir key oluşturup eskisini remove et.
- `STRIPE_WEBHOOK_SECRET` + `ADMIN_TOKEN` + `M2M_ADMIN_TOKEN` — dashboard'dan yenileme + `.env` update + container restart ile düşük maliyet. Yüksek aciliyet değil (private repo + branch silindi), ama best-practice olarak önümüzdeki haftada sıradan.

---

## Tek bakışta

| Ürün | Durum | Notlar |
|---|---|---|
| Marka sitesi (hero, use cases, solutions, blog) | ✅ Canlı (Next.js 14 SSG) | — |
| Kutasia ürün sayfası | ✅ Marketing + link | Tıklama Kutasia.com'a |
| **Dijital Kartvizit — self-serve sipariş akışı** | ✅ Kod uçtan-uca tamam, LIVE cutover bekliyor | Stripe TEST modundan LIVE'a geçilmesi operator aksiyonu |
| Diğer ürünler (voice, chatbot, booking…) | ✅ Marketing sayfaları | Self-serve akış ileride |

---

## 2026-04-23 ikinci oturum — 5 track paralel ajanla tamamlandı

Önceki oturum lead-form'dan Stripe checkout'a kadar götürmüştü (canlı, TEST modu).
Bu oturum handoff'taki 5 track'i paralel agent takımıyla bitirdi:

### Track C — "El yapımı tasarım" review aşaması ✅
- Yeni `AWAITING_DESIGN` status'u; webhook artık **auto-publish etmiyor**.
- Akış: `PENDING_PAYMENT → PAID → AWAITING_DESIGN → (admin "Publish" basar) → PUBLISHED`.
- `CardOrder.designNotes`, `editToken`, `paidAt`, `awaitingDesignAt`, `publishedAt` alanları eklendi.
- `POST /api/admin/orders/[id]/publish` endpoint'i (ADMIN_TOKEN gate) — slug generation buraya taşındı.
- `/admin/orders` yeni "Tasarımda" (In design) tab'ı aldı; detay sayfasında "Yayınla" aksiyonu.
- Thanks page artık 3 durumlu: ödeme onaylı / tasarımda / yayında (QR + URL sadece yayındayken).
- Notifications: `[TASARIM]` ve `[YAYIN]` subject prefix'leri.
- Commit `ee8e445`.

### Track A — Kutasia admin birleşimi ✅
- opsolid-website'e M2M read API'ları: `GET /api/m2m/orders`, `/api/m2m/orders/[id]`,
  `POST /api/m2m/orders/[id]/actions`. Constant-time `Bearer ${M2M_ADMIN_TOKEN}` doğrulaması.
- `src/lib/order-actions.ts` — mark-contacted / cancel / publish transition logic'i tek yerde;
  hem `/api/admin/*` (ADMIN_TOKEN, URL-gated) hem `/api/m2m/*` (bearer header) bunu kullanıyor.
- Kutasia tarafında (`guestsignal` repo'su) yeni `/admin/opsolid-orders` sayfası:
  - Sidebar nav entry "OpSolid Siparişleri" (IdCard icon)
  - 4 tab: Aranacaklar / Tasarımda / Yayında / Bekleyen + count badge'leri
  - Detail page: customer + card-content + subscription + history paneli,
    aksiyon butonları (mark-contacted, publish, cancel)
  - SUPER_ADMIN rol gate'i (Kutasia'nın mevcut pattern'i)
  - Env eksikse "OpSolid API yapılandırılmamış" friendly empty state
- Env var: `M2M_ADMIN_TOKEN` (opsolid) + `OPSOLID_ADMIN_API_URL/TOKEN` (Kutasia).
- `/admin/orders?token=...` opsolid.de'de canlı — Kutasia down ise fallback.
- Commit'ler: opsolid `2bd1642`, Kutasia `8961d9e`.

### Track B — Email pipeline (operator + customer) ✅
- Admin bildirimleri zaten vardı (Telegram + CallMeBot + SMTP). Yeni: müşteri emailleri.
- `src/lib/email/{send,shell}.ts` + 3 template (confirmation / revision-ready / cancellation) × 3 locale (en/de/tr).
- Shared email-client-safe shell: inline CSS, max-width 600px, editorial palette, footer + "unsubscribe reply STOP".
- Webhook (AWAITING_DESIGN transition) → confirmation email (48h SLA + edit link + reply-to operator).
- Publish endpoint → revision-ready email (public URL + inline QR PNG + edit link + cancel link).
- Subscription canceled branch → cancellation email.
- SMTP env'leri yoksa tüm pipeline no-op (crash etmez).
- `scripts/test-customer-email.ts` smoke-test — SMTP yoksa HTML'i stdout'a döker.
- `CONTACT_FROM_EMAIL` env'i eklendi (opsiyonel; yoksa SMTP_USER).
- Commit `2bd1642` (A ile birlikte).

### Track D — Müşteri self-service edit + OG + iptal ✅
- `editToken` her siparişte oluşturuluyor (Track C wired, Track D consumes).
- `/card/edit/[orderId]?t={token}` — müşteri: `cardData`, renkler, foto/logo düzenleyebiliyor. Contact bilgisi read-only (destek konusu).
- `requireEditToken()` helper — `crypto.timingSafeEqual`, bad/missing/null-token → 403, order yok → 404, durum yanlış → 409.
- `PATCH /api/card/edit/[orderId]?t=...` — Zod-validated, sadece izinli alanlar, `OrderStatusHistory` audit satırı (`actor: customer-self-edit`). `AWAITING_DESIGN`'da düzenleme → `designNotes`'a "customer edited" hint ekler.
- `POST /api/card/cancel/[orderId]?t=...` — Stripe `subscriptions.update(cancel_at_period_end: true)`; webhook CANCELLED transition'u zaten yapıyor.
- OG image: `/c/[slug].png` — `next/og ImageResponse`, 1200×630, brand renklerinde, QR dahil. PUBLISHED olmayan order → 404 (pre-publish veri sızdırmıyor).
- `<meta property="og:image">` + Twitter card = summary_large_image eklendi `/c/[slug]`'a.
- 3 locale yeni key'ler: `content.digitalCard.edit.*` + `content.digitalCard.cancel.*`.
- `scripts/backfill-edit-tokens.ts` — eski `editToken=NULL` satırlarını doldurur (idempotent).
- Commit `e51201f`.

### Track E — LIVE mode + observability ✅
- **Sentry** (`@sentry/nextjs` 8.47.0): `sentry.{client,server,edge}.config.ts` + `instrumentation.ts` + `withSentryConfig(...)` wrapped in `next.config.mjs`. DSN yoksa SDK no-op. Error captures tagged `area: stripe-webhook | customer-email | admin-notification | admin-action | m2m-action` — sessiz failure'lar artık sessiz değil.
- **Stats:** `GET /api/m2m/stats?range=7d|30d|all` (bearer gate) + `/admin/stats?token=...` (fallback view). Ortak `src/lib/stats.ts`. Payload: revenue (one-time + subscription), orders by status, conversion rate, ortalama paid→published cycle time, son 10 aktivite.
- **Backup:** `deploy/hostinger/backup.sh` — host cron'u çalıştırır, `docker exec opsolid-db pg_dump | gzip > /var/backups/opsolid/...`, 14 günden eski dump'ları siler, log'u `/var/log/opsolid-backup.log`. Cron entry: `deploy/hostinger/crontab.example` (günlük 03:00 UTC).
- **LIVE cutover:** `scripts/setup-stripe.ts --live <sk_live> --write` — 5 şablonun LIVE product + 3 fiyatını + webhook endpoint'ini oluşturur; `.env.live` block'unu stdout'a yazar. Step-by-step: `deploy/hostinger/CUTOVER.md`.
- **Dockerfile fix:** `effect` MODULE_NOT_FOUND crashı çözüldü — Prisma CLI artık runtime image'da yok. CMD: `node server.js`. DB bootstrap host tarafından `deploy/hostinger/db-bootstrap.sh` ile yapılıyor (`psql -v ON_ERROR_STOP=1` ile `init.sql` + `patch_001_design_review.sql` + `seed.sql`). Idempotent.
- **Health:** `GET /api/health` → `{ ok, commit, dbOk }` — uptime ping için.
- Commit `0eec253`.

---

## Schema değişiklikleri (2026-04-23 ikinci oturum)

`prisma/schema.prisma` + `prisma/init.sql` güncellendi. Mevcut canlı DB için
idempotent patch: **`prisma/patch_001_design_review.sql`**.

Canlı DB'ye uygulama:
```bash
ssh -i /c/Users/User/.ssh/id_ed25519_opsolid root@srv1150632.hstgr.cloud \
  "docker exec -i opsolid-db psql -U opsolid -d opsolid" \
  < prisma/patch_001_design_review.sql
```

Yeni alanlar (`card_orders`):
- `design_notes TEXT` — tasarımcı notları / customer self-edit hint
- `edit_token TEXT UNIQUE` — müşteri self-edit URL token'ı
- `paid_at, awaiting_design_at, published_at TIMESTAMP(3)` — lifecycle zaman damgaları

---

## Deploy checklist — yeni tracker'lar canlıya

- [x] `prisma/patch_001_design_review.sql` VPS DB'ye uygulandı (5 yeni kolon + unique index + backfill 1 satır).
- [x] `/opt/opsolid-website/.env` — SMTP_HOST=smtp.gmail.com, SMTP_PORT=465, SMTP_USER, SMTP_PASS, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL eklendi.
- [x] `/opt/opsolid-website/.env` — `M2M_ADMIN_TOKEN` (32 byte base64url) eklendi.
- [x] Kutasia `/opt/kutasia/.env` — `OPSOLID_ADMIN_API_URL=https://opsolid.de` + aynı `OPSOLID_ADMIN_API_TOKEN` eklendi.
- [ ] `/opt/opsolid-website/.env` — `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN` **(opsiyonel — boşken SDK no-op)**.
- [ ] VPS cron: `0 3 * * * /opt/opsolid-website/deploy/hostinger/backup.sh >> /var/log/opsolid-backup.log 2>&1` (operatör kurmalı).
- [x] `docker compose up -d --build opsolid` + `docker compose up -d --build kutasia` — ikisi de Ready.
- [x] Eski sipariş (order #1) için `edit_token` backfilled (`UPDATE card_orders SET edit_token = gen_random_uuid()::text WHERE edit_token IS NULL`).
- [ ] SMTP doğrulama: `npx tsx scripts/test-customer-email.ts operator@example.com` (operatör çalıştırmalı).
- [x] `curl -I https://opsolid.de/api/health` → `{"ok":true,"commit":"unknown","dbOk":true}`.
- [x] `curl -H "Authorization: Bearer <token>" https://opsolid.de/api/m2m/orders` → sipariş listesi. Bearer yoksa 401.
- [x] `https://opsolid.de/c/claude-test-eokd` → 200 (eski public card çalışıyor).
- [x] `https://kutasia.com/` → 200.
- [ ] Operatör: Kutasia admin'e giriş → `/admin/opsolid-orders` → sipariş listesi + detay + aksiyonlar doğrulanmalı.

---

## Yol haritası (sıradaki)

- [ ] Gerçek şablon tasarımları (kullanıcı — PNG + component)
- [ ] LIVE Stripe cutover (kullanıcı aksiyonu, cutover script + `CUTOVER.md` hazır)
- [ ] Sentry DSN aç (opsiyonel, no-op fallback var)
- [ ] Fiziksel kartvizit eklemesi (NFC kart + sevkiyat)
- [ ] Diğer ürünlerin self-serve akışa dönüştürülmesi (chatbot, voice, vb)
