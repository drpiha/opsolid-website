# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (frontend + API routes) at localhost:3000
npm run build        # Production build — also runs TypeScript type checking and ESLint
npm run lint         # ESLint only
```

No separate backend process — Next.js API routes (`src/app/api/`) run within the same server.

## Architecture

**OpSolid** is a B2B company website built with Next.js 14 App Router, TypeScript, and Tailwind CSS. Brand: "OpSolid" (practical automation & AI systems for business operations, Germany-based). Positioning: independent automation practice — no fake metrics, no "we" team language, no employer references, no inflated claims.

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
