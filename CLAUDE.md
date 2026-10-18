# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (frontend + API routes) at localhost:3000
npm run build        # Production build — also runs TypeScript type checking and ESLint
npm run lint         # ESLint only
npm run audit:cards  # Template×CardData coverage gate — fails on any silently-dropped field
npm run predeploy    # audit:cards + build — run before every deploy
npx tsx --test scripts/tests/redirects.test.mts   # routing / redirect contract
```

Card-template invariant: every visual CardData field must render natively in a
template OR via UniversalBlocks (src/components/cards/UniversalBlocks.tsx),
gated by the audit-derived `*_NATIVE_KEYS` Sets in templates/v2/registry.ts.
`npm run audit:cards` enforces this — never hand-edit those Sets without
re-running it.

No separate backend process — Next.js API routes (`src/app/api/`) run within the same server.

`?debug` on a marketing URL exposes `window.__v4stage.bounds()` (projected screen box of the 3D object) for layout audits. It is inert without the query string. `npm run audit:stage` (needs a running server, `BASE=http://localhost:3000`) asserts per scene that the object never intersects text, buttons, tables or form controls at 1280/1440/1920/390 px; `npm run audit:headings` checks that no h1/h2 needs a mid-word break in de/en/tr. Run both after changing scenes, poses, column widths or heading copy.

## Architecture

**OpSolid** is a B2B website built with Next.js 14 App Router, TypeScript, and Tailwind CSS. Brand: "OpSolid" (sprechende KI-Agents, Websites und Automatisierung für kleine und mittlere Betriebe, Arnsberg, Germany). Positioning: an independent AI and automation practice for small and mid-sized businesses. **Voice (owner decision 2026-10-16): professional company voice** — OpSolid / "wir" / "we" / "biz", focused on what the work changes for the client's business. Team size is not a topic: never say or imply a one-person business ("allein", "Ein-Personen", "tek başıma", "solo") and never imply a large team. No fake metrics, no invented clients, testimonials, years of experience, certifications or partner badges, no employer references, no inflated claims. Proof is real work only: opsolid.de, OpSo (product in test phase) and Kutasia (a project in development, not a product yet).

The site has two kinds of surfaces:

- **Marketing routes** (`isV4Path` in `src/lib/v4.ts`): home, agents, websites, leistungen, ki-beratung, prozessautomatisierung, microsoft-365-automatisierung, interne-tools, ki-schulungen, ai-automation-check, ueber-uns, contact, blog, plus opso, impressum and privacy, which keep their own components under the v4 theme (impressum and privacy are server-rendered from `contents[locale]`, so the client never loads the content bundle there). Unknown `/de|en|tr/*` URLs render the localized v4 404 via `src/app/[locale]/[...rest]`. Dark graphite + copper art direction (v4), scroll-driven 3D stage, SSR text. Scoped to `html[data-v4]`, set server-side in the root layout from the `x-pathname` header.
- **App surfaces** (dashboard, onboarding, auth, discover, public cards `/c/*`, admin, voice, `products/*`): the older tri-theme system (light · hybrid · dark), the `src/content/{en,de,tr}.ts` bundle and `src/styles/legacy.css`.

### Localization System

Public locales are `de`, `en`, `tr`. **Language follows the visitor's COUNTRY, never the browser language** (owner decision, #34/#35): locale-less URLs (`/`, `/ki-beratung`, …) get a 307 by cookie (explicit choice) → upstream geo header (`x-vercel-ip-country`, `cf-ipcountry`, `x-country-code`, `x-geo-country`) → in-app `/api/geo` lookup over loopback (fail-open) → `ROUTING_DEFAULT_LOCALE` (`de`). TR → `tr`, DACH → `de`, everything else → `en` (`localeForCountry`). `Accept-Language` is not consulted, so a Turkish browser in Germany lands on `/de`. `/de`, `/en`, `/tr` never redirect; retired locale-less URLs 301 to `/de`; detection never writes a cookie (only an explicit language switch does). Logic in `src/lib/locale-routing.ts` (pure, unit-tested in `scripts/tests/redirects.test.mts`), wiring in `src/middleware.ts`; `?geodebug=1` reflects the decision in an `x-opsolid-geo` header. `DEFAULT_LOCALE` (`en`) is for app surfaces only.

**Marketing page text** lives in `src/content/v4/pages-{de,en,tr}.ts`, typed by `src/content/v4/types.ts` (`PageDef`: hero, blocks, faq, cta). All three files must define the same pages. A page route is `v4Meta` (metadata) + `v4Page` (render) from `src/components/v4/make-page.tsx`; do not hand-write layout per page. Voice: company voice (see Positioning), plain and concrete, answer-first ledes under every H2. Never invent prices, clients, numbers or testimonials; open points go in the PR body under "Needs owner confirmation".

**Published offers and prices** (owner decisions, 2026-10-18). These are the only prices the site may state; every price is net (plus VAT, businesses only, `PRICE_NOTE`), and JSON-LD offers list exactly these:

- Website-Abo: from 99 €/month or 990 €/year; setup from 490 €. Includes hosting, care, updates and 1 small change per month (done within 5 working days, no emergency service). Buying a website outright stays price on request.
- KI-Check (the single entry offer): from 490 €. There is no separate "Quick-Check".
- KI-Kompetenz Basis 1,490 €; Copilot-Praxistag from 2,400 €.
- KI-Agenten are phone and chat assistants. No video agents are offered; the 3D stage is decoration only.
- Booking goes through the contact form; no Cal.com or other third-party embed.

**Industry focus** (owner decision): services, hospitality, retail and practices (no health data). Not for businesses in SHK (heating, plumbing, sanitation), TGA (building services engineering), electrical trades, construction or wholesale. Never name an employer.

**App-surface text** (and impressum / privacy) lives in `src/content/en.ts` (type-defining source of truth), `de.ts`, `tr.ts`, combined in `src/content/index.ts`. The `Content` type is derived from `en.ts` using a `DeepString<T>` recursive type; DE and TR import it: `export const content: Content = { ... } as const`. When adding text there: add the key to `en.ts` first, then the same key to `de.ts` and `tr.ts`. All three must have identical structure or the build fails.

`src/context/LocaleContext.tsx` provides the locale only (`useLocaleBase()`). `useLocale()` returns `{ locale, setLocale, t }`, where `t` comes from `ContentContext`; the content bundle (~77 kB gz) is loaded by `ContentGate` only on app routes (`needsContentBundle` = not a v4 path). **Never call `useLocale()` / read `t` in marketing components**: use `useLocaleBase()`, or the page definitions. Doing so throws at runtime on marketing routes.

```tsx
const { locale, setLocale } = useLocaleBase(); // marketing components
const { t, locale } = useLocale();             // app / legal surfaces only
```

### Page Pattern

Marketing routes: `page.tsx` exports `generateMetadata = v4Meta(key)` and renders `v4Page(key)`; `src/lib/seo-v4.ts` builds canonical, hreflang (`de`, `en`, `tr`, `x-default` = `/de`) and Open Graph, and `components/v4/JsonLd.tsx` emits one `@graph` per page (breadcrumb must match the visible breadcrumb; FAQ schema only where the FAQ is visible; offers only for published prices). Title carries no manual "| OpSolid": the root template adds it once.

App routes: `page.tsx` (server, metadata) + `PageName.tsx` (client, `"use client"`, `useLocale()`).

### Key Configuration Files

- `src/lib/constants.ts` — Brand name, domain, email, address, `SITE_UPDATED_ISO` (drives the visible "Stand:" line and sitemap `lastModified`). Change brand identity here.
- `src/styles/opsolid-v4.css` — marketing tokens (`--v4-*`) and all marketing component styles.
- `src/styles/opsolid-tokens.css` + `tailwind.config.ts` — app-surface tokens and the Tailwind mapping.
- `public/llms.txt`, `src/app/robots.ts`, `src/app/sitemap.ts` — GEO/SEO surface; keep in step with the page list.
- `.env.example` — SMTP vars for contact form email delivery

### Contact Form API

`src/app/api/contact/route.ts` — POST endpoint with a per-client rate limit and honeypot. Validates input and sends via the mail provider in `src/lib/email/client.ts` (Brevo > Resend > SMTP). Without `CONTACT_TO_EMAIL` and one provider it answers 503 and the form shows its fallback text. `/api/auth/status` always answers 200 (anonymous or not) so marketing pages produce no 401 console error; `/api/auth/me` keeps its 401 contract.

### Component Organization

- `components/v4/` — marketing system: `PageRenderer` (blocks), `Stage` (3D), `AgentDemo`, `Reveal`, `ContactForm4`, `JsonLd`, `make-page`, `FxToggle`, `V4Sync`, `ContentGate`.
- `components/ui/` — Design system primitives (Button, Card, Badge, Input) using CVA (app surfaces)
- `components/shared/` — Reusable pieces (`LocaleLink`, `Icon`). There is no analytics and no consent banner: nothing on the site needs consent (only the user-chosen language cookie and the 3D-Effekte switch are stored). Adding any tracking needs a consent mechanism and a privacy-text update first.
- `components/layout/` — Header (language switcher, nav) and Footer (includes the "3D-Effekte" switch)
- `components/sections/` — `FaqAccordion`, `FinalCTA`, `PricingTable`, used only by the legacy OpSo order page under `products/digital-card`, whose entry URLs currently 301 to `/opso`. The pre-v4 marketing components (`components/v2`, the old section library, the single-agent product pages) were removed in 2026-10; their URLs 301 via `src/lib/redirects.ts`. Do not reintroduce them for marketing pages.
- `components/ClientProviders.tsx` — Wraps children with LocaleProvider (keeps layout.tsx as server component)

### Art direction (marketing routes, v4)

Industrial-luxury, dark only: graphite surfaces, warm oxidized copper as the single accent, hairline rules, drafting grid. Tokens in `src/styles/opsolid-v4.css`:

- `--v4-bg`/`--v4-bg2` graphite (`#12110F`), `--v4-ink`/`--v4-ink2`/`--v4-ink3` text ladder, `--v4-line`/`--v4-line2` hairlines.
- `--v4-cu` copper (`#C27940`), `--v4-cu-hi` for hover/focus, `--v4-on-cu` text on copper. Copper-ink `#8F4F1E` only for text on light surfaces (none on marketing).

Typography: **Archivo** (display and body; the width axis is used for headings: `font-stretch: 118%`, weight 800) and **IBM Plex Mono** (eyebrows, labels, meta). Archivo is self-hosted as one pre-instanced subset (`src/app/fonts/archivo-v4.woff2`: wght 400–800, wdth 100–118, latin plus Ğ ğ İ Ş ş), preloaded for all three locales. Components: `.v4-sec`, `.v4-col`, `.v4-btn(-primary|-ghost|-lg)`, `.v4-rows`, `.v4-steps`, `.v4-table`, `.v4-faq`, `.v4-band`.

Rules: no gradient mesh, no glassmorphism (header and overlays included), no `framer-motion` for page choreography (only the small `Reveal` observer), any future accept/reject choice carries identical visual weight, minimum 44 px touch targets.

App-surface tokens (unchanged): `bg-bg-{0..5}`, `text-ink-*`, `border-line-*`, `copper-{50..900}` (DEFAULT `#C27940`), `neutral-{50..950}`, `signal-ok|warn|err`; Geist / Inter / JetBrains Mono / Instrument Serif. `amber`, `paper*`, `olive`, `steel` are removed; Tailwind silently drops classes that reference them.

### 3D stage (three.js + GSAP ScrollTrigger)

One persistent object (seven plates, one per offering, plus an abstract voice-reactive agent form) re-forms as the visitor scrolls. Pages mark sections with `data-scene` (`stack`, `agents`, `websites`, `flow`, `steps`, `cards`, `offset`, `tight`) and `data-heat="0,1"` (plate indices to light up); the stage reads them, so content never depends on the stage. Allowed only with these guardrails:

1. **SSR text is the LCP.** Every word is real HTML; the stage is decoration. No text is rendered only in WebGL.
2. **Idle / intent load.** `three` and `gsap` are dynamic imports started on first user intent (pointer, scroll, touch, key) or after 8 s, never during first paint or hydration. Until then a static SVG poster is the first frame.
3. **Light mode on phones and touch** (width < 760 or coarse pointer): DPR ≤ 1.5, no environment map, no bloom, no edge lines, 30 fps. Desktop gets bloom, HDR copper edges, MSAA and a frame-time guard that drops bloom if frames stay slow.
4. **Poster for reduced motion and no WebGL**, and **the footer "3D-Effekte" switch** (`opsolid-fx=off`, `FX_EVENT`) stops the stage and loads nothing. There is no other quality control in production.
5. **The object never covers readable text.** On desktop it is fitted into the free column beside the measured text column of the scene in view (`Stage.tsx` `update()`); wide blocks (`.v4-col.is-wide`: tables, the agent demo) sit on an opaque panel. On phones the object is above the text and every `.v4-col` is an opaque panel. Verify at 1280, 1440, 1920 and 390 px (`?debug` bounds against text rectangles) after any change to scenes, poses or column widths.
6. **Agents are abstract.** No eyes, mouth, face or mascot. The voice demo is a scripted scenario labelled "Demo · Szenario, ohne Ton", with no audio and no provider; a live demo needs a provider and a data-protection review first.
7. **Real proof only.** Window planes on the Websites / Produkte scenes show real screenshots (`public/img/v4/shot-*.webp`) of opsolid.de, OpSo (demo profile) and Kutasia. Never another user's data.

Gate before merging a change to the stage or its CSS: `npm run lint`, `npx tsc --noEmit`, `npm run predeploy`, redirects test, axe on every page at 1440 and 390, Lighthouse mobile on home and one inner page (LCP ≤ 2.5 s, CLS ≤ 0.1), and screenshots of every page at 1440 and 390 checked for overlap and horizontal scroll.
