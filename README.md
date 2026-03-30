# OpSolid — Business Website

Premium B2B website for OpSolid, an operational systems and automation company.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **UI Primitives:** Custom components with CVA (class-variance-authority)
- **Booking:** Cal.com embed (Google Calendar sync)
- **Notifications:** Telegram Bot + WhatsApp (CallMeBot) + Email (Nodemailer)

## Getting Started

## PUSH to VERCEL :
cd C:\Users\drhas\Documents\Coding\Project_Website\mayai-website; git add -A; git commit -m "update"; git push

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The dev server runs at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with Header + Footer
│   ├── page.tsx            # Homepage
│   ├── solutions/          # Solutions page
│   ├── use-cases/          # Use Cases page
│   ├── about/              # About page
│   ├── contact/            # Contact page (Cal.com booking embed)
│   ├── blog/               # Blog pages
│   ├── faq/                # FAQ page
│   ├── impressum/          # Legal notice (German law)
│   ├── privacy/            # Privacy policy
│   └── api/
│       ├── contact/        # Contact form POST endpoint
│       └── webhooks/cal/   # Cal.com webhook receiver (booking notifications)
├── components/
│   ├── layout/             # Header, Footer
│   ├── ui/                 # Button, Card, Badge, Input (design system)
│   ├── sections/           # Homepage sections (Hero, TrustStrip, etc.)
│   ├── shared/             # SectionHeading, AnimatedSection
│   └── icons/              # Tool logo SVGs
├── content/
│   ├── en.ts               # English content
│   ├── de.ts               # German content
│   └── tr.ts               # Turkish content
└── lib/
    ├── constants.ts        # Site config, nav links, footer links
    ├── notifications.ts    # Telegram + WhatsApp + Email notification module
    └── utils.ts            # cn() utility
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

### Adim 2: Tum Metinlerde Bul-Degistir (30 saniye)
VS Code'da `Ctrl + Shift + H` (Bul ve Degistir):
- **Ara:** `OpSolid`
- **Degistir:** `YeniIsim`
- **"Replace All"** tikla

Bu islem su dosyalari gunceller:
- `src/content/en.ts`, `de.ts`, `tr.ts` (tum icerik metinleri)
- `src/app/*/page.tsx` (SEO metadata)
- `src/lib/notifications.ts` (bildirim e-postalari)
- `src/app/api/contact/route.ts` (form e-postalari)

### Adim 3: Domain Degisikligi (opsiyonel)
Eger domain de degisiyorsa, ek olarak:
- `src/lib/constants.ts` → `url` ve `email` alanlarini guncelle
- `.env.example` → `CONTACT_TO_EMAIL` degerini guncelle
- `Ctrl + Shift + H` ile `opsolid.de` → `yenisite.de` degistir
- Vercel dashboard → Settings → Domains → yeni domain ekle
- DNS kayitlarini yeni domain icin ayarla

### Adim 4: Build ve Deploy
```bash
npm run build    # Hata olmadigini dogrula
git add -A && git commit -m "Rename brand to YeniIsim"
git push         # Vercel otomatik deploy eder
```

**Toplam sure: ~5 dakika.**

---

## Randevu / Booking Sistemi

Site ziyaretcileri "Gorusme Planlayin" butonuna tiklayarak dogrudan randevu alabilir.

### Nasil Calisiyor?

```
Ziyaretci "Gorusme Planlayin" tiklar
    → Cal.com popup acilir (sitenin dilinde)
    → Google Calendar'daki BOS saatler gosterilir
    → Ziyaretci saat secer + bilgilerini girer
    → Randevu kaydedilir
        → Google Calendar'a eklenir
        → Google Meet linki olusturulur
        → Cal.com webhook tetiklenir
            → Telegram mesaji gelir
            → WhatsApp mesaji gelir
            → E-posta gelir
```

### Gerekli Hesaplar ve Kurulum

#### 1. Cal.com (Booking Engine)
1. [cal.com/signup](https://cal.com/signup) adresinden hesap ac
2. Settings → Calendars → Google Calendar bagla
3. Event Types → "Discovery Call" olustur (30 dk, Google Meet)
4. Availability → Calisma saatlerini ayarla
5. Settings → Developer → Webhooks → yeni webhook ekle:
   - URL: `https://opsolid.de/api/webhooks/cal`
   - Secret: kendin belirle (not al!)
   - Events: `BOOKING_CREATED`, `BOOKING_CANCELLED`, `BOOKING_RESCHEDULED`

#### 2. Telegram Bot (Bildirim)
1. Telegram'da @BotFather'a `/newbot` gonder
2. Bot adi: orn. "OpSolid Booking Agent"
3. Bot token'i kopyala
4. Bot'a bir mesaj gonder, sonra tarayicida ac:
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. JSON'daki `chat.id` degerini not al

#### 3. WhatsApp CallMeBot (Bildirim)
1. +34 644 71 84 60 numarasina WhatsApp'tan gonder:
   `I allow callmebot to send me messages`
2. Gelen API key'i not al

### Environment Variables

Vercel dashboard → Settings → Environment Variables:

| Key | Aciklama | Ornek |
|-----|----------|-------|
| `NEXT_PUBLIC_CALCOM_USERNAME` | Cal.com kullanici adi | `hasandonmez` |
| `NEXT_PUBLIC_CALCOM_EVENT` | Event slug | `discovery-call` |
| `CALCOM_WEBHOOK_SECRET` | Webhook dogrulama sifresi | `my-secret-key` |
| `TELEGRAM_BOT_TOKEN` | BotFather'dan alinan token | `712345:AAHfiq...` |
| `TELEGRAM_CHAT_ID` | Telegram chat ID | `123456789` |
| `WHATSAPP_PHONE` | WhatsApp telefon numarasi | `4917631020654` |
| `WHATSAPP_CALLMEBOT_APIKEY` | CallMeBot API key | `1234567` |
| `SMTP_HOST` | SMTP sunucu | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP kullanici | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP sifre (App Password) | `xxxx xxxx xxxx xxxx` |
| `CONTACT_TO_EMAIL` | Form mesajlarinin gidecegi adres | `hello@opsolid.de` |

---

## Customization Guide

### Brand & Content

| What to change | Where |
|---|---|
| Company name, tagline, email | `src/lib/constants.ts` |
| All page copy and section text | `src/content/en.ts`, `de.ts`, `tr.ts` |
| Colors (primary, accent) | `tailwind.config.ts` → `colors.brand` and `colors.accent` |
| Logo mark | `src/components/layout/Header.tsx` and `Footer.tsx` |
| Typography / fonts | `tailwind.config.ts` → `fontFamily` |
| SEO metadata | `src/app/layout.tsx` (global) and each page's `metadata` export |

### Localization

The site supports 3 languages (EN, DE, TR) via client-side React Context:
- `src/content/en.ts` — English (type-defining source of truth)
- `src/content/de.ts` — German
- `src/content/tr.ts` — Turkish

To add a new language: duplicate `en.ts`, translate values, add to `src/content/index.ts`.

### Legal Pages

The Impressum and Privacy Policy pages are **placeholder templates**. They must be replaced with legally reviewed content before production use.

## Deployment (Vercel)

1. Push to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Next.js
4. Add environment variables (see table above)
5. Add custom domain: Settings → Domains → `opsolid.de`
6. Configure DNS at IONOS:
   - A Record: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`
7. Deploy

The site generates as fully static pages (SSG) for maximum performance.

## Design Decisions

- **No dark mode** — B2B websites rarely need it; keeps the brand consistent
- **Static generation** — All pages are pre-rendered for fastest possible load times
- **Content file approach** — All text lives in content files, making it trivial to update copy or add languages
- **Custom UI components** — Lightweight custom components with CVA for full control
- **Framer Motion** — Used sparingly for scroll-triggered reveals
- **Mobile-first responsive** — All layouts work at mobile, tablet, and desktop breakpoints
