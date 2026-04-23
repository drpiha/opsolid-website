# OpSolid Website — Live Status

**Son güncelleme:** 2026-04-23
**Aktif dal:** `main` (veya proje varsayılanı)
**Kanonik canlı panel.** Her oturum başında okunur, sonunda güncellenir.

---

## Tek bakışta

| Ürün | Durum | Notlar |
|---|---|---|
| Marka sitesi (hero, use cases, solutions, blog) | ✅ Canlı (Next.js 14 SSG) | — |
| Kutasia ürün sayfası | ✅ Marketing + link | Tıklama Kutasia.com'a |
| **Dijital Kartvizit — self-serve sipariş akışı** | ✅ Kod tamam (2026-04-23), deploy bekliyor | Stripe kurulumu + DB seed gerekli |
| Diğer ürünler (voice, chatbot, booking…) | ✅ Marketing sayfaları | Self-serve akış ileride |

---

## 2026-04-23 oturumu — neler yapıldı

Dijital Kartvizit ürününü lead-form'dan self-serve siparişe dönüştürüldü:

- **Prisma 6 + Postgres** şeması: `CardTemplate`, `CardOrder`, `Subscription`, `OrderStatusHistory`. `src/config/card-templates.ts` 5 şablonla seed.
- **5 şablon bileşeni** (`src/components/cards/templates/Template01..05.tsx`) + `TemplateRenderer` + `CardPrimitives` (avatar, contact rows, social chips).
- **`TemplateGallery`** — numaralı (#01..#05) grid, canlı mini önizleme, tıklama form'a scroll.
- **`OrderFormSection`** — iletişim (tel + "Beni ara" checkbox zorunlu) + kart içeriği + sosyal linkler + foto/logo upload + marka rengi + billing toggle (tek seferlik / yıllık), sağ tarafta canlı `TemplateRenderer` önizlemesi.
- **Stripe** — `src/lib/stripe.ts` checkout helper, `/api/orders` POST (Zod validate, sunucu tarafı fiyat), `/api/webhooks/stripe` (HMAC verify → PUBLISHED + slug + notifyOrderEvent).
- **Upload** — `/api/uploads` form-data, VPS lokal disk `public/uploads/cards/…`, 2 MB limit.
- **Public page** `/c/[slug]` — Prisma'dan sipariş çeker, `TemplateRenderer` ile render.
- **Thanks page** — `/products/digital-card/thanks/[orderId]`, QR kod (qrcode npm paketi).
- **Admin** — `/admin/orders?token=…`, Aranacaklar + Aktif + Beklemede sekmeleri, "Mark contacted" + "Cancel" aksiyonları, `/api/admin/orders/[id]` PATCH.
- **i18n** — tüm yeni anahtarlar 3 dilde (en/de/tr) `src/content/*.ts` içine eklendi.
- **Bildirim** — `src/lib/notifications.ts::notifyOrderEvent` eklendi (Telegram + CallMeBot WhatsApp + SMTP email), `callMeBack=true` siparişler `[ARA]`/`📞 [CALL-ME-BACK]` prefix ile.
- **Build** — `npm run build` temiz geçti; tüm route'lar `ƒ` (dinamik) veya `○/●` (statik) olarak yapılandı.

---

## Senin yapacağın — canlıya çıkmadan

### A. Gerçek şablon tasarımları

Şu an 5 şablon React kodu jenerik stiller kullanıyor (Minimal Mono, Warm Serif, Estate Brass, Atelier Clean, Restaurant Noir). Kendi gerçek tasarımlarını `src/components/cards/templates/Template0N.tsx` içine yerleştirmek için detay `docs/ORDER_FLOW.md` → "Adding a template".

### B. Stripe

1. Stripe dashboard → **Products** → her şablon için ürün + iki fiyat (one-time + yearly).
2. Price ID'leri `src/config/card-templates.ts` içindeki `stripeOneTimePriceId` / `stripeYearlyPriceId` alanlarına yapıştır.
3. **Webhooks** → `https://opsolid.de/api/webhooks/stripe` ekle, dinle: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`. Secret'i `STRIPE_WEBHOOK_SECRET`'e yaz.

### C. Hostinger Postgres

`docs/ORDER_FLOW.md` → "Database setup" blokundaki psql komutlarıyla
`opsolid_web` DB + user oluştur, sonra VPS'te:

```bash
cd /opt/opsolid-website  # veya deploy yaptığın klasör
export DATABASE_URL="postgresql://opsolid_web:PW@localhost:5432/opsolid_web?schema=public"
npx prisma migrate deploy
npx prisma db seed
```

### D. Env vars (production)

`.env.example`'daki tüm yeni değişkenleri doldur:
`DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL=https://opsolid.de`, `ADMIN_TOKEN` (uzun rastgele).

### E. Deploy

Repo'nun mevcut README'si Vercel deploy anlatıyor. Artık DB ve dosya
upload olduğu için Vercel **gerekirse** çalışır (Vercel Postgres + blob
storage), ama kullanıcı tercihi Hostinger VPS.

Hostinger deploy özeti (ileride `deploy/` klasörüne docker-compose
eklenebilir):

```bash
# VPS'te
git clone https://github.com/drpiha/opsolid-website.git /opt/opsolid-website
cd /opt/opsolid-website
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
# PM2 ile
pm2 start npm --name opsolid-web -- start
pm2 save
```

Nginx / caddy önce kurulmalı (Kutasia ile aynı VPS'te olabilir; ayrı
server block `opsolid.de` için).

---

## Yol haritası (sıradaki)

- [ ] Stripe gerçek ürün/fiyat oluşturma (kullanıcı)
- [ ] Gerçek şablon tasarımları (kullanıcı — PNG + component)
- [ ] VPS deploy (DB + app + nginx + SSL)
- [ ] İlk test sipariş (sandbox Stripe kart 4242 4242 4242 4242)
- [ ] Diğer ürünlerin self-serve akışa dönüştürülmesi (chatbot, voice, vb)
- [ ] İleride: fiziksel kartvizit eklemesi (NFC kart + sevkiyat)
