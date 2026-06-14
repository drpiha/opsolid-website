# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (frontend + API routes) at localhost:3000
npm run build        # Production build — also runs TypeScript type checking and ESLint
npm run lint         # ESLint only
npm run audit:cards  # Template×CardData coverage gate — fails on any silently-dropped field
npm run predeploy    # audit:cards + build — run before every deploy
```

Card-template invariant: every visual CardData field must render natively in a
template OR via UniversalBlocks (src/components/cards/UniversalBlocks.tsx),
gated by the audit-derived `*_NATIVE_KEYS` Sets in templates/v2/registry.ts.
`npm run audit:cards` enforces this — never hand-edit those Sets without
re-running it.

No separate backend process — Next.js API routes (`src/app/api/`) run within the same server.

## Architecture

**OpSolid** is a B2B company website built with Next.js 14 App Router, TypeScript, and Tailwind CSS. Brand: "OpSolid" (practical automation & AI systems for business operations, Germany-based). Positioning: independent automation practice — no fake metrics, no "we" team language, no employer references, no inflated claims.

### Two products in this repo

This repo hosts **two products** that share one Next.js app + Postgres database:

1. **OpSolid** — the B2B consulting marketing site (public, no login). Routes:
   `/`, `/leistungen` + service pages, `/ai-automation-check`, `/blog`,
   `/contact`, `/ueber-mich`, legal.
2. **OpSo Smart** — the digital business-card product (the account side).
   Surfaces: `/products/digital-card` (marketing), `/card/*` (create/edit),
   `/c/[slug]` (public card), `/dashboard/*` (owner area), and the Expo app
   under `mobile/` (also branded **OpSo Smart**).

**Accounts belong to OpSo Smart, not the consulting site.** Auth backend:
`/api/auth/*` (web — `opsolid_refresh` httpOnly cookie) and `/api/v1/auth/*`
(mobile — Bearer JWT). Both back the same `User` table, so **web and mobile
share one account.** Login methods: email/password, magic-link, and Google
OAuth (set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — see `.env.example`).

Login entry points live in the header / mobile menu / footer (`AccountMenu` in
`src/components/layout/Header.tsx`, driven by `src/context/AuthContext.tsx` →
`GET /api/auth/me`). Logged-out → "Log in" (`/login`); logged-in → avatar →
"My cards" (`/dashboard/cards`). Cards created anonymously via `/card/new`
(`userId=null`) are auto-claimed by email match on the dashboard
(`POST /api/account/cards/[id]/claim`).

**Hidden for now:** the dashboard's heavier "card-network / CRM" features —
**Inbox, Channels, Playbooks** — are intentionally removed from the dashboard
nav (`DashboardChrome.tsx`). The routes/code still exist; only the nav links are
hidden, to keep the account focused on cards. Re-enable by restoring the links.

Naming: the card product is **OpSo Smart** everywhere user-facing (web + mobile).
The legacy codename **"Verso"** still appears in mobile *internal* identifiers
(theme-token comments, asset filenames) — those are not user-facing.

### Localization System

All user-facing text lives in content files, not in components:

- `src/content/en.ts` — English (type-defining source of truth)
- `src/content/de.ts` — German
- `src/content/tr.ts` — Turkish
- `src/content/index.ts` — combines all locales

The `Content` type is derived from `en.ts` using a `DeepString<T>` recursive type that widens literal strings. DE and TR files import this type: `export const content: Content = { ... } as const`.

**When adding any new text:** add the key to `en.ts` first (this defines the type), then add the same key with translated values to `de.ts` and `tr.ts`. All three files must have identical structure or the build will fail.

Components access content via `useLocale()` hook from `src/context/LocaleContext.tsx`:
```tsx
const { t, locale, setLocale } = useLocale();
```

### Page Pattern

Each route follows a two-file pattern:
- `page.tsx` — Server component with metadata export (SEO)
- `PageName.tsx` — Client component with `"use client"` directive that uses `useLocale()`

### Key Configuration Files

- `src/lib/constants.ts` — Brand name, domain, email, navigation links. Change brand identity here.
- `tailwind.config.ts` — Brand colors under `colors.brand` (deep blue) and `colors.accent` (violet)
- `.env.example` — SMTP vars for contact form email delivery

### Contact Form API

`src/app/api/contact/route.ts` — POST endpoint. Validates input, logs to console, and sends email via nodemailer if SMTP env vars are set. Without SMTP config, submissions are console-logged only.

### Component Organization

- `components/ui/` — Design system primitives (Button, Card, Badge, Input) using CVA
- `components/sections/` — Homepage sections (Hero, SolutionsOverview, IntegrationGrid, etc.)
- `components/shared/` — Reusable pieces (SectionHeading, AnimatedSection — IntersectionObserver + CSS transitions, no Framer Motion)
- `components/layout/` — Header (with language switcher) and Footer
- `components/ClientProviders.tsx` — Wraps children with LocaleProvider (keeps layout.tsx as server component)

### Brand Colors

OpSolid v2 industrial-luxury tri-theme (light · hybrid · dark). Canonical CSS variables live in `src/styles/opsolid-tokens.css`; `tailwind.config.ts` maps them so utilities follow the active `[data-theme]`.
- `bg-bg-{0..5}` — theme-aware surface ladder (page → cards → raised panels)
- `text-ink` / `text-ink-{100..500}` — theme-aware text scale
- `border-line-soft|line|line-firm|line-hot` — theme-aware hairlines
- `copper-{50..900}` (DEFAULT `#C27940`) — primary accent (warm oxidized copper, not orange). Theme-independent.
- `brand-*` — legacy alias mapped to copper so old code keeps resolving.
- `neutral-{50..950}` — graphite scale, theme-independent. Use `bg-neutral-900` + `text-neutral-50` for "dark pill on light page" intent that must stay constant across themes.
- `signal-ok|warn|err` — semantic only, sparing use.

Legacy `amber`, `paper`, `paper-warm`, `paper-cool`, `olive`, `steel` tokens are removed — Tailwind silently drops classes that reference them. Use the table above instead.

Typography: Geist (display + h1/h2), Instrument Serif (`.editorial` italic callouts), Inter (body), JetBrains Mono (`.meta` / `.mono-label`). Utilities: `.panel`, `.btn`, `.btn-primary`, `.btn-ghost`, `.chip`, `.field`, `.metallic-copper`, `.grain`, `.wrap`, `.section`. No `framer-motion` for full-page choreography (only Embla + small AnimatedSection observers); no gradient-mesh; no glassmorphism.
