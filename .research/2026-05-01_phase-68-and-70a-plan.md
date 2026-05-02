# Faz 6.8 + Faz 7.0a Paralel Hat Planı

**Tarih:** 2026-05-01
**Faz 6.7 durumu:** ✅ Tamamlandı (16 görev + apptest 8 fix + 4 manuel blokaj fix dahil son `Analytics beforeSend` RSC hatası).
**Yaklaşım:** Hat A (Faz 6.8 web stabilizasyon) ve Hat B (Faz 7.0a auth altyapısı) **paralel**. Hat C (mobil app MVP) Hat B'nin yarısı bittiğinde başlar.

---

## Bağlam

Faz 6.7 sonunda canlıdaki kart sayfaları `<Analytics beforeSend={fn}>` server-component-to-client-component fonksiyon serialize hatasıyla 500/404 dönüyordu. Apptest agent C5 fix'i sırasında `ConditionalAnalytics` (zaten hazır client wrapper) yerine layout.tsx'e doğrudan `<Analytics beforeSend>` koymuştu. Bu son patch ile (`src/app/layout.tsx` `ConditionalAnalytics` mount'u) kapatıldı.

**Ders:** Apptest agent'ları acceptance check yaparken layout-level RSC sınırlarını gözden kaçırabiliyor. Bundan sonra kritik path'lerde (root layout, public render path) **dev server + canlı slug ile end-to-end runtime test** kabul kriteri haline gelmeli.

**Hedef:**
- **Faz 6.8** — Faz 6.7'nin bilinçli ertelenmiş kuyruğunu kapat + canlı doğrulama (1-2 hafta)
- **Faz 7.0a** — Mobil app MVP'sinin ön-koşulu olan auth + self-onboarding altyapısı (3 hafta)
- **Faz 7.0b (Hat C)** — Expo monorepo + RN MVP, Hat B'nin auth altyapısı tamamlandığında başlar (4-5 hafta)

---

## Hat A — Faz 6.8 Web Stabilizasyon

**Süre:** 1-2 hafta
**Hedef:** Kalan Faz 6.7 kuyruğunu kapat, canlı doğrulama matrisini geçirt, güvenlik orta-öncelik kalıntılarını temizle.

| # | Görev | Dosyalar | Agent | Model | Skill | Accept Criteria |
|---|---|---|---|---|---|---|
| **A8.1** | **A5 takip — 54 v2 template'e `tpl-photo` / `tpl-logo` class** | `src/components/cards/templates/v2/{AccountingNoir, AccountingPure, ArchitectStone, ArchitectVivid, AutoDealer*, Barber{Noir,Pure,Stone,Vivid}, BeautySalon{Noir,Pure}, Clinic{Noir,Pure,Stone,Vivid}, ContentCreator*, DentistPure, DentistVivid, DJNoir, DJPure, Ecommerce*, EventPlanner*, Fitness{Stone,Vivid}, InteriorDesign{Noir,Vivid}, LayoutSplitScreen, LayoutVividBold, LegalCounsel*, Photographer{Pure,Vivid}, Psychologist{Pure,Vivid}, RealEstate*, Restaurant{Pure,Vivid}, SoftwareDev*, WellnessTeacher{Pure,Vivid}}.tsx` (54 dosya, mekanik) | **frontend-agent** | Haiku 4.5 | code-review | Her template'te avatar `<Image>` `tpl-photo` class içerir; logo `<Image>` (varsa) `tpl-logo` class içerir. Gallery class'ı eklenmemiş (gallery için pan/zoom yok). Build temiz. |
| **A8.2** | **B7 derinleştirme — section component split** | `CardEditClient.tsx` (~2400 satır) → `sections/PersonBrandSection.tsx` + `ContactSection.tsx` + `ContentSection.tsx` + `PublishSection.tsx` (her biri ~500-600 satır) | **ux-maker** + **frontend-agent** | Opus 4.7 (refactor mimari) → Sonnet 4.6 (uygulama) | simplify | CardEditClient ana dosyası ~600 satıra iner. Her section bağımsız test edilebilir. State CardEditClient'ta kalır, prop drill ile geçer (Zustand sonradan eklenebilir). isDirty + handleRevert + StickySaveBar etkilenmez. |
| **A8.3** | **PII retention cron** (gap G13) | Yeni `prisma/migrations/.../add_retention_indexes.sql` + `src/lib/retention.ts` + `vercel.json` cron veya `scripts/anonymize-pii.ts` | **schema-migrator** + **backend-agent** | Sonnet 4.6 | security-review | CardLead, CardView, ScanEvent, ConnectionEvent için 13 ay sonra IP hash + UA + referer fields anonymize. Email/phone hash'lenir veya silinir. Dry-run flag + log. KVKK md.7 + GDPR Art.5(e) uyumlu. |
| **A8.4** | **CSP enforce mode** | `next.config.mjs` — `Content-Security-Policy-Report-Only` → `Content-Security-Policy` | **security-code-auditor** | Opus 4.7 | security-review | 1 hafta canlı gözlem (Sentry / Vercel Analytics CSP report endpoint'i ile ihlal tespiti) sonrası enforce. Hiçbir 3rd-party iframe veya script kırılmadığı doğrulanır. |
| **A8.5** | **A2 canlı doğrulama — Sentry breadcrumb dashboard** | Sentry instrumentation (mevcut), yeni dashboard query | **bug-hunter** | Sonnet 4.6 | code-review | Production'da `tap-to-focus.applied` breadcrumb'larının frequency'sini gözle (kaç kullanıcı tetikledi, hangi platform, hangi browser). Hasan iPhone'da test ederse — 1 ziyaret yeterli. |
| **A8.6** | **Apptest cross-device matrix v2** (post-fix doğrulama) | E2E Playwright test pack | **apptest** | Sonnet 4.6 | test-generator | Faz 6.7'nin tüm 16 görevi + Faz 6.8 yenileri için tekrar regression. **Bu kez canlı slug ile dev server + curl + Playwright zorunlu**. RSC sınırları (Server Component'e fonksiyon prop'u) için lint kuralı önerisi. |
| **A8.7** | **uploads/route.ts revert sonrası — kapsamlı yeniden tasarım** | `src/app/api/uploads/route.ts`, `src/lib/storage.ts` | **security-code-auditor** + **backend-agent** | Opus 4.7 | security-review | C1+C2 fonksiyonları **kullanıcı talebine uygun** revert edildi. Yeni tasarım: guest mode + auth mode ayrı route'lar, sharp re-encode opsiyonel (build size endişesi), file-type sadece magic byte. Kullanıcı onayı ile eklenir. |

**A8.7 NOT:** Bu görev **kullanıcı kararına bağlı**. Şu anki revert edilmiş `uploads/route.ts` SVG'yi hala whitelist'te bırakıyor — XSS açığı açık. Kullanıcı "tek seferde yeniden ele al" derse aktive edilir.

---

## Hat B — Faz 7.0a Auth + Self-Onboarding

**Süre:** 3 hafta
**Hedef:** Mobil app MVP'sinin ön-koşulu olan kullanıcı hesap sistemi + dashboard + JWT API. Aynı zamanda gap raporu E5 (self-onboarding) ve E10 (lead capture form-builder + double opt-in)'in temeli.

| # | Görev | Dosyalar | Agent | Model | Skill | Accept Criteria |
|---|---|---|---|---|---|---|
| **B0.1** | **Prisma `User` modeli + relations** | `prisma/schema.prisma` (yeni `User`, `Session`, `MagicLinkToken` tabloları), `prisma/migrations/.../add_user_auth.sql` | **schema-migrator** | Opus 4.7 (mimari) | security-review | User: id, email (unique, indexed), emailVerifiedAt, passwordHash (nullable for magic-link only), createdAt. Session: id, userId, token (hash), userAgent, ip, expiresAt. MagicLinkToken: token, userId, expiresAt, usedAt. CardOrder.userId optional foreign key (mevcut kartlar etkilenmez). |
| **B0.2** | **Auth backend — magic-link + JWT refresh** | Yeni `src/lib/auth/{password.ts, session.ts, magic-link.ts, jwt.ts}` + `src/app/api/auth/{signup, login, logout, magic-link, refresh, me}/route.ts` | **backend-agent** | Opus 4.7 (mimari) | security-review | Argon2id password hashing. Magic-link: 15dk TTL, single-use. Access token: JWT 15dk; refresh token: rotation, 30g, httpOnly cookie. `requireUser()` server helper. Rate limit: signup 5/saat/IP, login 10/saat/IP. |
| **B0.3** | **Email gönderim altyapısı** | `src/lib/email/{client.ts, templates/{magic-link, welcome, password-reset}.tsx}` | **backend-agent** | Sonnet 4.6 | content-writer | React Email + Resend (veya mevcut SMTP). DE/EN/TR çoklu dil. Test mode'da mailpit/console fallback. |
| **B0.4** | **Signup + login UI** | Yeni `src/app/[locale]/(auth)/{signup, login, magic-link, verify}/page.tsx` ve `*Client.tsx` | **frontend-agent** | Sonnet 4.6 | frontend-design | Premium hissi: split-screen (sol marketing + sağ form), magic-link primary CTA + "or password" secondary. Form validation (Zod + react-hook-form). DE/EN/TR locale. ARIA + keyboard nav. |
| **B0.5** | **Dashboard — `/dashboard/cards`** | Yeni `src/app/[locale]/dashboard/cards/page.tsx` + `*Client.tsx` + `src/components/dashboard/CardListItem.tsx` | **frontend-agent** | Sonnet 4.6 | frontend-design | Kullanıcının tüm kartları liste/grid. Her satırda: thumbnail (48×48), kart adı, status badge, view count, edit + share + delete. Yeni kart yarat butonu. Empty state. |
| **B0.6** | **Mevcut admin manual provisioning'i dashboard'a göç** | `src/app/admin/orders/*` → kullanıcı self-edit; admin sadece super-user için | **backend-agent** + **schema-migrator** | Sonnet 4.6 | code-review | Mevcut `editToken` URL pattern'i deprecate edilmez (eski linkler ölmesin), ama yeni kartlar `userId` ilişkisi ile dashboard'tan yönetilir. Migration: `editToken`'lı eski kartlar için "claim card" akışı (email = card.contact.email match). |
| **B0.7** | **Self-onboarding flow — signup → kart oluştur → publish** | `src/app/[locale]/onboarding/page.tsx` + 3-step wizard | **ux-maker** + **frontend-agent** | Opus 4.7 (UX flow) → Sonnet 4.6 (uygulama) | frontend-design | Step 1: industry seç (90+ template) → preset content auto-fill. Step 2: kişisel bilgiler (name, title, photo, brand color). Step 3: preview + publish + Stripe checkout. Toplam <60 saniye. |
| **B0.8** | **Mobile API JWT-uyumlu** | `src/app/api/v1/{auth, cards, leads}/route.ts` (yeni public API namespace) | **backend-agent** | Opus 4.7 (REST tasarım) | security-review | RESTful, OpenAPI spec. JWT bearer auth. Mobile app + 3rd party kullanıcı için ortak. CORS sıkı (allowlist). Rate limit per-user (Redis önerilir, in-memory fallback). |

---

## Hat C — Faz 7.0b Mobile App MVP (Hat B'nin yarısı bittiğinde başlar)

**Süre:** 4-5 hafta
**Stack:**
- **Expo SDK 51+** (React Native New Architecture)
- **Monorepo:** pnpm workspace + Turborepo (basit + caching)
- **Auth:** Hat B'nin JWT (refresh token + biometric unlock — `expo-local-authentication`)
- **Push:** Expo Push API (Apple Developer hesabı sonra alınacak; **Google Play hesabı `drhasanhd@gmail.com`'da hazır**)
- **Camera/scanner:** `expo-camera` + Google Cloud Vision (tesseract OCR yetersiz)
- **NFC:** `react-native-nfc-manager` (Android önce, iOS Apple Wallet write API'sı sınırlı)

| # | Görev | Süre | Agent |
|---|---|---|---|
| **C7.1** | Monorepo migration (apps/web + apps/mobile + packages/shared-types, shared-ui, api-client) | 3 gün | tech-lead (Opus) |
| **C7.2** | Expo init + ESLint + TS strict + native build local doğrulama (Android, iOS simülatör) | 2 gün | frontend-agent (Sonnet) |
| **C7.3** | Auth ekranı + JWT integration + biometric unlock | 4 gün | frontend-agent (Sonnet) |
| **C7.4** | Kart listesi + kart detay (web'in `SmartCard` component'ini RN port veya ortak monorepo'dan) | 1 hafta | frontend-agent + tech-lead |
| **C7.5** | Kart edit (form, photo upload, brand color) | 1 hafta | frontend-agent |
| **C7.6** | vCard save (native iOS Contacts API + Android Contacts permission) | 3 gün | backend-agent (native module) |
| **C7.7** | Push notifications (connection.created, weekly digest) — Google Play first | 3 gün | backend-agent |
| **C7.8** | Internal Track release — Play Store, drhasanhd@gmail.com developer hesabı | 2 gün | release-lead |

**Sonra (Faz 7.1, +3-4 hafta):**
- AI scanner (foto kart → vCard)
- NFC write (Android önce)
- iOS Live Activity (Apple Developer hesabı geldiğinde)
- Apple Watch companion
- Android home widget

---

## Sıralama & Bağımlılıklar

```
Hafta 1:    [A8.1 A8.2 A8.3 A8.5]    [B0.1 B0.2 B0.3]
Hafta 2:    [A8.4 A8.6]               [B0.4 B0.5 B0.6]
Hafta 3:    A8.7 (kullanıcı kararı)   [B0.7 B0.8]
Hafta 4-5:                            ─────────────────  [C7.1 C7.2 C7.3]
Hafta 6-7:                                              [C7.4 C7.5 C7.6 C7.7 C7.8]
Hafta 8+:   Faz 7.1 — AI scanner, NFC, widgets
```

**Kritik bağımlılıklar:**
- **B0.2 → C7.3**: JWT auth tamamlanmadan mobile login imkânsız
- **B0.5 → C7.4**: Dashboard API endpoint'leri (kart listesi) mobile'da reuse edilir
- **A8.2 → C7.5**: Section split web'de tamamlanırsa mobile edit form'u ortak component'lerden besleyebilir
- **A8.6 → B0.7**: Mevcut admin akışı dashboard'a göçmeden yeni signup'lar dashboard'tan kart yaratamaz

---

## Karar Verilmiş

1. **Auth modeli:** Magic-link **primary** (premium, passwordless), password **secondary** (geri durum)
2. **Monorepo:** pnpm workspace + Turborepo (caching ROI)
3. **App store:** **Google Play öncelik** (drhasanhd@gmail.com hesap hazır), Apple Developer **sonra** (kullanıcı talebine göre)
4. **Hat sırası:** A + B paralel başla; C, B'nin yarısı bittiğinde
5. **Apptest**: Bundan sonra her batch sonu **canlı slug + dev server runtime test** acceptance kriterine eklenir

---

## İlk Batch — Hafta 1 paralel başlangıç

Compact sonrası ilk dispatch:

**Batch A1.1 (web stabilizasyon, 4 paralel):**
- A8.1 — 54 template `tpl-photo` class (frontend-agent, Haiku)
- A8.3 — PII retention cron (schema-migrator + backend-agent, Sonnet)
- A8.5 — Sentry tap-to-focus dashboard query (bug-hunter, Sonnet)
- A8.6 — Apptest cross-device matrix v2 (apptest, Sonnet)

**Batch B1.1 (auth altyapısı, 3 paralel):**
- B0.1 — Prisma User schema (schema-migrator, Opus)
- B0.2 — Auth backend (backend-agent, Opus)
- B0.3 — Email altyapısı (backend-agent, Sonnet)

**Toplam 7 paralel agent** — büyük dispatch, ama dosya bölgeleri çakışmasız (A8 mevcut runtime, B0 yeni dosya/migration). 30-90 dakika beklenen tamamlanma.

---

## Faz 6.7 Final Bilanço (referans)

| Kategori | Görevler | Durum |
|---|---|---|
| Hasan canlı şikayetleri | A1, A2, A3, A4+A6, A5 | ✅ + A2 canlı doğrulama bekliyor |
| Premium UX lift | B1, B2, B3, B4, B5, B6, B7 | ✅ |
| P0 güvenlik | C3+C4, C5 | ✅ |
| Manuel blokaj fix | statusMessage schema, guest upload regression, voice layout searchParams, **Analytics beforeSend RSC** | ✅ |
| Apptest patch | 8 bug (3 P0 + 5 P1) | ✅ |
| Bilinçli scope dışı | C1+C2 (kullanıcı revert), 54 template TODO | A8.1, A8.7'de |

**Build durumu:** tsc 0 hata, lint 0 uyarı, build exit 0.
**Bilinen production sorun:** Analytics RSC fix sonrası kart sayfaları kurtarıldı; Hasan canlı doğrulayacak.
