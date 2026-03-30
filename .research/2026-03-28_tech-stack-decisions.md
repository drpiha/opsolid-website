---
title: Solidra - Technology Stack Decisions
date: 2026-03-28
category: architecture
tags: [tech-stack, Next.js, nodemailer, localization, design-system]
project: solidra-website
---

## Araştırma Sorusu
Solidra B2B web sitesi için teknoloji seçimleri ve mimari kararlar.

## Bulgular

### Core Stack
- **Next.js 14** App Router — SSG ile tüm sayfalar statik pre-render
- **TypeScript** — strict type checking
- **Tailwind CSS** — custom brand color palette (brand-600: #1a5faa)
- **Framer Motion** — scroll-triggered reveal animasyonları
- **Lucide React** — tüm ikonlar

### Localization Yaklaşımı
**Karar:** Client-side React Context (i18n library yok)
- **Neden:** Next.js 14 App Router'da built-in i18n yok, kütüphane overhead'i gereksiz
- **Nasıl:** `LocaleProvider` → `useLocale()` hook → `contents[locale]`
- **3 dil:** EN (tip tanımlayıcı), DE, TR
- **Persistence:** localStorage
- **Type safety:** `DeepString<T>` recursive type ile string literal'ları genişletme

### Contact Form
**Karar:** nodemailer + SMTP (API route)
- **Neden:** Harici ücretli API yok, Vercel'de çalışır, SMTP olmadan da dev mode'da loglar
- **Alternatifler değerlendirildi:** Formspree (harici bağımlılık), mailto: (UX kötü), JSON file (Vercel'de çalışmaz)
- **Env vars:** SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL

### Font Loading
**Karar:** `next/font/google` (Inter)
- **Neden:** Google Fonts CDN @import → CLS sorununa neden oluyordu
- **Çözüm:** `Inter` next/font ile otomatik optimize, `--font-inter` CSS variable

### UI Components
**Karar:** Özel bileşenler + CVA (class-variance-authority)
- **Neden:** Full Shadcn UI gereksiz overhead, sadece 4 primitive yeterli
- **Bileşenler:** Button (4 variant), Card, Badge, Input/Textarea

### Page Pattern
**Karar:** İki dosyalı yapı (page.tsx + PageName.tsx)
- `page.tsx` → Server component, metadata export (SEO)
- `PageName.tsx` → Client component, "use client", useLocale() kullanır
- **Neden:** SEO metadata'yı server-side tutarken localization client-side çalışır

### SEO
- `sitemap.ts` — dinamik Next.js sitemap route
- `robots.txt` — public/ dizininde statik
- `icon.svg` — SVG favicon (App Router otomatik algılar)
- `not-found.tsx` — özel 404 sayfası

## Gelecek Kullanım İçin Notlar
- Yeni dil eklemek: `src/content/xx.ts` oluştur + `src/content/index.ts`'e ekle
- Brand rengi değiştirmek: `tailwind.config.ts` → `colors.brand`
- Analitik eklenirse: privacy sayfası güncellenmeli, cookie consent düşünülmeli

## İlgili Araştırmalar
- [2026-03-28_company-name-research.md](2026-03-28_company-name-research.md)
- [2026-03-28_website-audit.md](2026-03-28_website-audit.md)
