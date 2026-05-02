# OpSolid DBC — Rekabet & Eksik Analizi (Müşteri Gözüyle)

**Tarih:** 2026-05-01
**Kapsam:** Piyasa lideri 11 dijital kartvizit sağlayıcısının ekran/özellik/fiyat haritası, OpSolid'in canlı ürün denetimi (UX + güvenlik + entegrasyon).
**Kaynak:** 3 paralel araştırma agent çıktısı (rakip taraması, UX kritiği, güvenlik+entegrasyon denetimi). Tüm iddialar dosya:satır veya rakip URL ile destekli.

---

## TL;DR

Pazar üç katmanda toplanmış: **freemium app** (HiHello, Blinq, Wave), **NFC-hardware-first** (V1CE, Mobilo, dot.cards, Tapni), **enterprise/QR** (Uniqode, Popl). OpSolid'in mevcut konumu: **template kalitesinde sektör lideri, ekosistem olarak yarım**. Bilet ücreti olan 5 özellik kapatılmadan satış yapılamaz: NFC fiziksel kart, AI scanner, native CRM sync, team/multi-seat, self-onboarding. Avantajımız EU-resident hosting + 90+ industry preset + Wallet-first deploy + DE legal stack — bu dörtlü iyi paketlenirse Almanca SMB pazarında **Tapni'ye karşı bile** ayırt edici. Ürünün canlı tarafında 2 WCAG ihlali, 1 stored-XSS açığı, 1 SSRF riski ve sessiz Wallet null'ı acil. 30 gün için 12 maddelik somut action list aşağıda.

---

## 1) Bizdeki 5 Güçlü Özellik (Kanıtlı)

| # | Özellik | Kanıt | Stratejik değer |
|---|---|---|---|
| 1 | **90+ industry-themed template + sektörel preset** | `src/components/cards/templates/v2/` (Architect, Barber, Clinic, Restaurant + Noir/Pure/Vivid/Stone varyantları) | Rakiplerde "industry preset" yok — Blinq/HiHello'da sadece custom color/font, içerik boş. "Doktor için 30 saniyede yayın" hikâyesi için killer angle. |
| 2 | **Slug rename + 308 redirect zinciri** | `src/app/c/[slug]/page.tsx:60-68` `findRenamedSlug` + `permanentRedirect` | WhatsApp'taki eski link ölmüyor. Premium müşteri davranışı. |
| 3 | **Owner toolbar timing-safe auth** | `src/app/c/[slug]/page.tsx:283-289` `constantTimeEquals` | Doğru güvenlik kararı. (Ama token URL query'de, bu sorun aşağıda — B5.) |
| 4 | **Share yüzey genişliği** | `ShareDrawer.tsx:116-185` — QR + WhatsApp deep link + vCard + e-posta imza HTML snippet'i | Email signature snippet rakiplerde nadir; B2B segment için değerli. |
| 5 | **Webhook + ScanEvent/ConnectionEvent/CardView telemetri** | `prisma/schema.prisma:185+`, `patch_006_phase_6.sql` | Ham log seviyesinde sales-ops için programmable. Rakipler webhook'ı paywall'lıyor (Blinq Enterprise). |

---

## 2) Net Eksiklerimiz — Rakipte Var, Bizde Yok

| # | Eksik | Pazar standardı (kanıt URL) | Etki | Öncelik |
|---|---|---|---|---|
| E1 | **NFC fiziksel kart** | dot.cards $30 (no-sub), V1CE $50–$370, Mobilo $9.50, Tapni shop | "Kart + uygulama" bundle'ı temel beklenti — yoksa pazara giremezsin | **KRİTİK** |
| E2 | **AI kart/badge scanner (foto → vCard)** | HiHello, Blinq, Popl, Tapni hepsinde signature feature | Toplantıdaki kâğıt kartı yakalama — pazar zaten standardlaştırdı | **KRİTİK** |
| E3 | **Native CRM sync (HubSpot/Salesforce/Pipedrive)** | Popl 30+, Blinq 20+; bizde sadece generic webhook | Sales team direct sync bekliyor; webhook setup çok teknik | **YÜKSEK** |
| E4 | **Team/multi-seat + brand lock + SSO/SCIM** | Mobilo Teams, Blinq Business, HiHello Enterprise | Kurumsal satış kapısı; manual admin provision = scale edemez | **YÜKSEK** |
| E5 | **Self-onboarding (signup → kart → publish 5 dk)** | Tüm rakiplerde standart | Manual provision = büyüme imkânsız | **YÜKSEK** |
| E6 | **Apple/Google Wallet certs** | Code hazır (`src/lib/wallet/apple.ts`); WWDR + Pass Type ID + Google Issuer ID alınmamış | Müşteri sipariş aşamasında özelliği görüyor olabilir, kartında yok → güven kaybı | **YÜKSEK** |
| E7 | **PWA / mobile app** | `public/manifest.webmanifest` yok (Glob doğruladı), service worker yok | Add-to-Home-Screen, offline scan; iOS widget HiHello'nun differentiator'ı | ORTA |
| E8 | **AI bio writer + AI follow-up email** | Beaconstac, Popl native; voice tarafında OpenAI altyapımız zaten var ama DBC'de kullanılmıyor | Düşük maliyet, yüksek müşteri algı kazancı | ORTA |
| E9 | **Heatmap + click attribution + weekly digest email** | Beaconstac/Uniqode: hangi blok tıklandı, UTM funnel, pazartesi raporu | Mevcut row-level eventlerin üzerine ince katman; ROI hikâyesi için kritik | ORTA |
| E10 | **Lead capture form-on-card + double opt-in + consent log** | HiHello custom field + opt-in; bizde checkbox var ama timestamp/IP/policy version snapshot yok | GDPR Art.7 zorunlu; conversion için de form-builder gerekli | ORTA |

---

## 3) Müşteri Gözüyle 7 Eleştiri (Kart Açıldığında Yaşanan)

> "Yeni doktor kartını açtım, premium gözüküyor — ama..."

**M1 — "Save Contact" butonu sıkıştırılmış ve gömülü.**
`SmartCard.tsx:441` — CTA grid `grid-cols-3`; 5 aksiyon olunca Speichern/Anrufen/WhatsApp/Mail/Termin eşit boyutta. Birincil aksiyon ikincil aksiyonlar arasında kayboluyor. 11px font + 36pt touch target → **WCAG 44pt ihlali**. HiHello/Blinq bunu tam genişlikte 52pt yüksekliğinde tek butonda sunuyor.

**M2 — iOS'ta vCard native contact dialog'u açmıyor, dosya indiriyor.**
`SmartCard.tsx:408` — `download` attribute'u + `/api/cards/[slug]/vcard`. iPhone Safari `download` gördüğünde native sheet'i bypass edip .vcf dosyası indiriyor. Müşteri "neden direkt eklemiyor?" diyor. **Çözüm 30 dakika:** `download` kaldır, `Content-Disposition: inline` + `Content-Type: text/vcard`.

**M3 — Studio (DJ) template'inde telefon numarası okunmuyor.**
`Studio.tsx:644` — `text-white/72` + `bg-black` ≈ **3.6:1 kontrast**, WCAG AA için 4.5:1 gerekli. Bu bug `PHASE_7_8_PLAN.md` A4'te belgelenmiş ama düzeltilmemiş. Sistematik: tüm dark template'lerde `text-white/60..72` kullanımı tarama dışı.

**M4 — Renk değiştirdim, önizleme aynı kaldı.**
`PHASE_7_8_PLAN.md` A3'te belgelenmiş. Color input `onChange` mi `onBlur` mu tetikleniyor — kesin onay gerekli. Müşteri "değişti mi değişmedi mi?" anlamıyor → güven kaybı.

**M5 — Wallet butonları sessizce yok oluyor.**
`WalletButtons.tsx:28` — `if (!apple && !google) return null`. Cert yok → null. Müşteri sipariş sayfasında özelliği görüyor olabilir, kartında yok, hiçbir mesaj yok. **En kötü silent failure paterni.** Üç seçenek: (a) Hide tamamen, (b) Owner-only "yakında" teaser, (c) Cert al ve aç.

**M6 — Kart Almanca, ziyaretçi İngilizce konuşuyor.**
`page.tsx:224-226` — Locale tamamen `order.locale`'den geliyor, ziyaretçi değiştiremiyor. `PHASE_7_8_PLAN.md` B3'te şikayet aynen duruyor. AB içi seyahat eden sales/consultant için conversion killer. **Çözüm:** `?lang=en` query + küçük 3-bayrak toggle.

**M7 — Generic 404 + Türkçe error mesajı.**
`app/c/[slug]/` altında özel `not-found.tsx` yok; yanlış slug → site geneli 404'e düşüyor. `error.tsx:38` "Bu kart şu an açılamıyor" hardcode Türkçe — Almanca kart sahibinin ziyaretçisi anlamıyor. `ShareButton.tsx:29` `aria-label="Kartı paylaş"` da sabit Türkçe — screen reader regresyonu.

---

## 4) Güvenlik Açıkları — Acil Sırasıyla

### 🔴 Kritik (1 hafta)

| ID | Açık | Konum | Risk | Çözüm |
|----|------|-------|------|-------|
| **G1** | **Stored XSS — SVG upload** | `src/lib/storage.ts:60-66` `image/svg+xml` whitelist'te | Kart sahibi `<svg onload=...>` yükler → tüm ziyaretçi sessions hijack | SVG'yi MIME whitelist'inden çıkar; sharp ile PNG/JPEG re-encode |
| **G2** | **Magic-byte doğrulaması yok + EXIF strip yok** | `src/app/api/uploads/route.ts:26-31` sadece `file.type` (browser-supplied) | Polyglot dosya, MIME confusion, GPS sızıntısı (GDPR Art.5) | `sharp(buffer).rotate().toFormat('webp')` + `file-type` paketi |
| **G3** | **`/api/uploads` auth + rate-limit yok** | `src/app/api/uploads/route.ts:18` | Sınırsız Vercel Blob yazma, depolama maliyeti, **CSAM yasal sorumluluk** | IP başına 10/dak limit + edit-token bağlama |
| **G4** | **SSRF — webhook URL'ye internal network erişimi** | `src/lib/webhook.ts:108`, `src/app/api/admin/cards/[id]/webhooks/route.ts:32` | `http://169.254.169.254/...` (AWS metadata), `http://10.x` POST | URL kayıtta DNS resolve + RFC1918/loopback reddet |
| **G5** | **Custom domain resolver DoS** | `src/middleware.ts:113-145` | Saldırgan keyfi `Host:` header'ı flood → Vercel/runtime maliyeti | Process-level negative-cache + IP rate limit |

### 🟡 Orta (1 ay)

| ID | Açık | Çözüm |
|----|------|-------|
| **G6** | **CSP yok** (`next.config.mjs` headers tanımsız) | `default-src 'self'; img-src 'self' data: blob:; frame-src youtube-nocookie.com player.vimeo.com` |
| **G7** | **HSTS, X-Frame-Options yok** — clickjacking açık | `X-Frame-Options: SAMEORIGIN` + `Strict-Transport-Security` |
| **G8** | **Iframe sandbox yok** (`SmartCard.tsx:691-697`, `Athlete.tsx:956`) | `sandbox="allow-scripts allow-same-origin allow-presentation"` + `referrerPolicy` |
| **G9** | **Owner toolbar token URL query'de** → Referer/access log/CardView DB sızıntısı | `/dashboard/cards/[editToken]` ayrı route veya cookie set-and-redirect |
| **G10** | **In-memory rate limit, multi-instance bypass** (`/api/cards/.../lead`, `/exchange`, `/slug-available`) | Upstash Redis + `@upstash/ratelimit` |
| **G11** | **Admin token query string'de + brute-force koruması yok** (`src/app/api/admin/orders/[id]/route.ts:9-15`) | Authorization header + `crypto.timingSafeEqual` + 5/dak fail2ban |
| **G12** | **IP hash zayıf/varsayılan salt** (`src/app/api/orders/slug-available/route.ts:28` `?? "opsolid"`) | Salt env zorunlu; aylık rotasyon |
| **G13** | **PII retention politikası yok** (CardLead, CardView, ScanEvent) | 13 ay sonra anonymize cron — KVKK md.7 + GDPR Art.5(e) |
| **G14** | **Voice tenant token plaintext DB'de** (`prisma/schema.prisma:464-466`) | Argon2 hash + prefix index |
| **G15** | **Vercel Analytics consent olmadan yükleniyor** (`src/app/layout.tsx:125`) | TTDSG §25 — opt-in CMP (Cookiebot/Klaro), Almanya'da 50K€'a kadar ceza riski |

---

## 5) Differentiator — Onlardan İyi Olmak İçin 6 Hamle

> Bu 6 hamle, bilet ücreti olan E1–E5'in **üzerine** koyulan stratejik kazanç. Tek başlarına satılabilir hikâyeler.

**D1 — "GDPR-resident in Germany" rozeti + DPA + Datenschutz/Impressum yerleşik.**
Tapni Belgrad, Wave/Blinq/HiHello US-merkezli. Sub-processor şeffaflığı + Hetzner Frankfurt + Almanca legal stack (Impressum + Datenschutz + AGB + Erklärung zur Barrierefreiheit) Almanca SMB pazarında **alıcı kararını tek başına kapatabilir**. Pricing sayfasına rozet + sub-processor listesi yayınla. **Maliyet: 1 hafta legal + design.**

**D2 — 90+ industry preset → "60 saniyede yayında" onboarding.**
Self-onboarding (E5) tarafında diğerlerinden **hızlı** olmanın yolu: meslek seç → preset content + örnek bio + sektörel sosyal alanlar otomatik dolu → 3 alan düzelt → publish. HiHello/Blinq boş canvas veriyor; bu segmentasyona kart sahibi 10 dakika harcıyor. **Maliyet: 2 hafta + content yazımı.**

**D3 — Multilingual public view (DE/EN/TR ziyaretçi switch).**
Hiçbir rakipte yok. AB içi seyahat eden danışman, Türk diasporasının doktoru, Alman emlakçısının İngiliz alıcısı için conversion killer. URL'de `?lang=` + 3-bayrak toggle. **Maliyet: 3 gün.**

**D4 — Wallet-first deploy + Apple Watch + iOS Live Activity.**
Wallet certs alındıktan sonra (E6), kart sahibinin paylaşım flow'u: "Apple Wallet'a ekle → Watch'ta da var → AirDrop'la 1 dokunuş paylaşım". HiHello'nun Dynamic Island widget'ına paralel ürün, ama Wallet pass üzerinden — daha ucuz developer maliyeti. **Maliyet: 3 hafta + Apple Developer onayları.**

**D5 — Webhook-first + public API + ScanEvent ham log erişimi.**
Rakipler webhook'u paywall'lıyor; bizde tüm tier'larda açık. Üstüne **public REST API** (kart oluştur/güncelle/list, lead pull) + Postman collection + 3 dilli developer docs. Sales-ops, no-code (Make/n8n) ve startup tech ekipleri için differentiator. **Maliyet: 2 hafta dokümantasyon + 3 endpoint hardening.**

**D6 — Status banner + booking + brochure üçlüsü = "active state" kart.**
"Şu an müsait/dolu", "yeni klient kabul ediyorum/kapalı", "yıllık tatil" gibi status banner DBC'lerde rakipte yok. Otomasyon + consulting + freelance pazarına özel. Booking URL ve Brochure PDF ile birlikte paketlenirse **"living card" pozisyonlaması** mümkün. **Maliyet: zaten teknik olarak var; sadece marketing + örnek kart.**

---

## 6) İlk 30 Günde Uygulanabilir Action List (Önceliklendirilmiş)

### 🔴 Hafta 1 — Acil ve düşük efor (toplam ~20 saat)

1. **G1: SVG MIME whitelist'inden çıkar + sharp ile re-encode** (4 saat) — stored XSS kapatır.
2. **G3: `/api/uploads` rate limit + auth bağlama** (3 saat) — depolama abuse durdurur.
3. **G4: Webhook URL'lerine RFC1918/loopback reddi** (2 saat) — SSRF kapatır.
4. **M2: iOS vCard friction fix** (`download` attr kaldır, `Content-Disposition: inline`) (30 dk) — temel feature düzelir.
5. **M3: Studio + diğer dark template'lerin contrast'ı `text-white/90`** (1 saat) — WCAG AA.
6. **M5: Wallet null → tamamen gizle** (15 dk, owner-only teaser opsiyonel) — sessiz failure'ı durdur.
7. **M7: ShareButton + error.tsx locale bağlama** (1 saat) — accessibility regresyonu kapanır.
8. **M1: SmartCard CTA'ları yeniden yapılandır — Save tam genişlik 52pt** (3 saat) — vCard conversion artar.
9. **G15: Vercel Analytics consent gating (Cookiebot veya Klaro)** (4 saat) — TTDSG ceza riski kapanır.
10. **Gallery lazy-load** (`loading="lazy"`) (5 dk) — mobil hız.

### 🟡 Hafta 2-3 — Strateji belirleyici

11. **E6: Apple Wallet WWDR + Pass Type ID + Google Wallet Issuer ID başvurusu** (1 hafta süre, 3 saat çalışma) — paralel başlatılmalı; Apple onayı 1-2 hafta.
12. **D3: Multilingual public view `?lang=` toggle** (3 gün) — anlık differentiator.
13. **G6 + G7 + G8: CSP + HSTS + iframe sandbox + headers paketi** (1 gün) — `next.config.mjs` `headers()`.
14. **G9: Owner mode'u cookie set-and-redirect veya `/dashboard/cards/[editToken]`'e taşı** (1 gün) — token sızıntısı kapanır.
15. **G10: Upstash Redis + `@upstash/ratelimit`** (1 gün) — multi-instance hazır.

### 🟢 Hafta 4 — Büyük yatırımların başlangıcı

16. **E5 self-onboarding tasarım + Stripe Checkout + email verification akış** (kick-off) — 6 hafta çalışma; Hafta 4'te tasarım onayı.
17. **E2 AI scanner MVP** (`tesseract.js` veya Google Cloud Vision; mobile cam → OCR → CardData prefill) — 2 hafta çalışma.
18. **E3 HubSpot OAuth + Contacts API push** (ilk CRM connector) — 1 hafta çalışma.
19. **E1 NFC kart ürün stratejisi karar toplantısı** — SKU + tedarikçi + Stripe + shipping address; karar verilmezse pazara giriş ertelenir.

---

## Risk & Belirsizlik Notları

- **NFC ürün lojistiği** OpSolid mevcut yapısına en uzak parça; tedarikçi seçimi (Mobilo white-label? PVC + custom NDEF?) ayrı bir araştırma gerektirir.
- **Apple Wallet onayı** 1-4 hafta öngörülemez; D4 stratejisi bu onaya bağlı.
- **BFSG (28.06.2025)** yürürlüğe giriyor — sipariş akışı `OrderFormSection` axe-core taraması Q2 2025'te şart; aksi halde Almanya'da uyarı/cezası riski.
- **Linq pazardan çekiliyor (2025 sunset)** — onların müşterileri Wave/Blinq/HiHello'ya migrate ediliyor; OpSolid bu trafiği kapma fırsatını kaçırmamalı (içerik pazarlama + migration tool).

---

## Kaynaklar (Rakip)

[HiHello](https://www.hihello.com/pricing) · [HiHello Card Scanner](https://www.hihello.com/features/business-card-scanner) · [Mobilo](https://mobilocard.com/pricing) · [Popl](https://popl.co/pages/pricing) · [Blinq](https://blinq.me/pricing) · [V1CE](https://v1ce.co/pricing) · [Uniqode](https://www.uniqode.com/pricing) · [Wave Connect](https://wavecnct.com/pricing) · [Tapni](https://tapni.com/pages/pricing) · [dot.cards review](https://www.allthewallets.com/dot-card-review/) · [Switchit on G2](https://www.g2.com/products/switchit/reviews) · [Linq sunset note](https://wavecnct.com/blogs/best-linq-alternative)

## Kanıt Dosyaları (OpSolid)

`src/components/cards/templates/v2/` · `src/components/cards/smart/SmartCard.tsx` · `src/app/c/[slug]/page.tsx` · `src/app/api/uploads/route.ts` · `src/lib/storage.ts` · `src/lib/webhook.ts` · `src/lib/wallet/apple.ts` · `src/lib/validation.ts` · `src/middleware.ts` · `next.config.mjs` · `prisma/schema.prisma` · `PHASE_7_8_PLAN.md`
