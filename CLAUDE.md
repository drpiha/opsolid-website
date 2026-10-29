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

Gates for marketing changes (v7): `npx tsc --noEmit -p .`, `npx next lint --dir src`, `npx tsx --test scripts/tests/redirects.test.mts scripts/tests/v7-routes.test.mts`, and the capture script `node scripts/site-capture.mjs <run> <paths…>` (needs `PLAYWRIGHT_CORE`, see the script header; writes `.shots/<run>/` with JPGs and `report.json`: HTTP status, console errors, horizontal overflow, axe violations; all must be clean at 1440 and 390 px). `npm run audit:headings` checks that no h1/h2 needs a mid-word break in de/en/tr. `npm run audit:stage` belongs to the retired v4 hero scene and no longer applies.

## Architecture

**OpSolid** is a B2B website built with Next.js 14 App Router, TypeScript and Tailwind CSS. Brand: "OpSolid" (Arnsberg, Germany).

**Positioning (relaunch v7, 2026-10-29).** OpSolid is AI automation consulting for companies (KI-Automatisierung / KI-Beratung). Consulting leads; the site must never read as "we do everything". Phone/chat assistants, process automation, Microsoft 365 and documents are what the consulting delivers, not product lines. Three pillars: **KI-Beratung** (check, process automation incl. internal tools, Microsoft 365, KI-Assistenten, use cases), **KI-Schulungen** (online, German and English; freelance trainer network still being built), **OpSo** (our own product, in test phase). Industries: Dienstleistung, Gastronomie & Hotellerie, Handel, Praxen (ohne Gesundheitsdaten). Never name SHK, TGA, Elektro, Bau or Großhandel, never any employer.

**Voice.** Professional company voice: OpSolid / "wir" / "we"; formal "Sie" in DE, "siz" in TR, plain professional EN. Team size is not a topic: never imply a one-person business ("allein", "Ein-Personen", "tek başıma", "solo") and never a large team ("unser Expertenteam"). The OpSo page keeps its owner-approved "du" voice. No hype words (Revolution, Gamechanger, magisch, autonom, "bis zu X %"), no "alles aus einer Hand", "All-in-one", "100 % DSGVO-konform", "rechtssicher", "zertifiziert". Short, concrete sentences, answer-first ledes under every H2.

**Honesty.** No invented clients, logos, testimonials, ratings, counters, statistics, percentages, time savings, certifications, partner badges, awards or team members; no "trusted by", no fake chats. Example scenarios are labelled ("Beispiel-Szenario", "Muster"). Proof is our own work only: opsolid.de, OpSo (product in test phase) and Kutasia (a project in development, not a product). Trainers: no names, photos or "our trainers" claims; the trainer page is a recruiting page. Funding: only "Wir prüfen mit Ihnen, welche Förderung zu Ihrem Vorhaben passt." AI Act Art. 4: only the safe wording (companies take measures for their staff's AI literacy; no certificate required; we issue our own Teilnahmebescheinigung); never "Schulungspflicht", "Zertifikatspflicht" or fine amounts. Location (Arnsberg, Sauerland, NRW), working languages and the founder (Hasan Dönmez, LinkedIn) appear only on About, Contact, footer and JSON-LD, never in a hero or marketing section. Open points go in the PR body under "Needs owner confirmation".

**Published offers and prices** (owner decisions). The only prices the site may state, always net (plus VAT, businesses only: "Alle Preise netto zzgl. USt., nur für Unternehmen."), also the only JSON-LD offers:

- KI-Check ab 490 € (the single entry offer; no "Quick-Check", no free pilot checks).
- KI-Kompetenz Basis 1.490 € (half day, up to 15 people, per team); Copilot-Praxistag ab 2.400 € (1 day, up to 12 people).
- Ladder: Kennenlernen (free) → KI-Check → **Pilot zum Festpreis** (price fixed in writing before the start; no number on the site) → Betrieb und Ausbau (monthly by agreement; no number).
- **Website-Abo is not offered** (owner decision 2026-10-27: customer websites only after the OpSo web editor exists). `/websites` 301s to `/projekte`; no Website-Abo price or offer anywhere, JSON-LD included.
- Booking goes through the contact form; no Cal.com or other third-party embed.

The site has two kinds of surfaces:

- **Marketing routes** (`isV4Path` in `src/lib/v4.ts`; the name is historical): home, beratung (check, prozess, m365, agenten, anwendungen), schulungen (kompetenz, copilot, trainer), opso, projekte, ueber, kontakt, blog (nav label "Journal"), impressum, privacy. Unknown `/de|en|tr/*` URLs render the localized 404 via `src/app/[locale]/[...rest]`. Scoped to `html[data-v4]`, set server-side in the root layout from the `x-pathname` header (flag name stays; it is internal).
- **App surfaces** (dashboard, onboarding, auth, discover, public cards `/c/*`, admin, voice, `products/*`): the older tri-theme system (light · hybrid · dark), the `src/content/{en,de,tr}.ts` bundle, `src/styles/legacy.css`, the app Header/Footer in `src/components/layout/` (which still use the `v4-*` classes of `src/styles/opsolid-v4.css`).

### Localization and routes

Public locales are `de`, `en`, `tr`. **Language follows the visitor's COUNTRY, never the browser language** (owner decision, #34/#35): locale-less **non-root** URLs (`/ki-beratung`, …) get a 307 by cookie (explicit choice) → upstream geo header (`x-vercel-ip-country`, `cf-ipcountry`, `x-country-code`, `x-geo-country`) → in-app `/api/geo` lookup over loopback (fail-open) → `ROUTING_DEFAULT_LOCALE` (`de`). TR → `tr`, DACH → `de`, everything else → `en` (`localeForCountry`). `Accept-Language` is not consulted. Detection never writes a cookie (only an explicit language switch does). Logic in `src/lib/locale-routing.ts` (pure, unit-tested), wiring in `src/middleware.ts`; `?geodebug=1` reflects the decision in an `x-opsolid-geo` header. `DEFAULT_LOCALE` (`en`) is for app surfaces only.

**Routes contract: `src/lib/v7-routes.ts`.** Page keys (`home, beratung, check, prozess, m365, agenten, anwendungen, schulungen, kompetenz, copilot, trainer, opso, projekte, ueber, kontakt, blog, impressum, privacy`), `ROUTE` (German folder under `src/app/[locale]`) and `SLUG` (public slug per locale; EN and TR are localized, e.g. `/en/ai-automation-consulting/ai-check`, `/tr/yapay-zeka-danismanligi/yz-kontrolu`). Helpers: `href(key, locale, {hash, sub})`, `absUrl`, `alternates`, `publicToInternal`, `foreignSlugTarget`, `internalToPublic`, `keyForPublicPath`. Rules:

- The German home is served at `/` (200, `WebSite` markup). `/de` answers 308 to `/`. `/en` and `/tr` stay.
- An explicit language cookie (en/tr) gives a 307 from `/`; no geo redirect at `/`. Instead the middleware passes `x-opsolid-suggest` (`en`|`tr`) and the German home shows a dismissible language hint (never a redirect).
- The middleware rewrites a public EN/TR slug to its `ROUTE` folder and sets `x-public-path` (the URL the browser shows) next to `x-pathname` (internal). A path that belongs to another locale gets a 301 to the right slug.
- Retired URLs (old v4 pages, `/websites`, …) 301 in **one hop** to the public slug of the request locale (`src/lib/redirects.ts`); no chains, no loops. `www.opsolid.de` 301s to the apex.
- All internal marketing links use `href()` / an `Href` with `to`; never hand-write `/de/...`. Changing a slug needs a 301 and a test in `scripts/tests/`.

### Marketing page model (v7)

- **Types:** `src/content/v7/types.ts` — `PageDef`, the `Block` union (`t` = situations, process, examples, principles, offers, rows, steps, compare, table, spec, text, sample, sectors, courses, projects, product, gallery, media, about, demo, form), `BlockProps<T>`, `Media`, `Href`.
- **Content:** one module per page, `src/content/v7/pages/<key>.ts`, `export const page: PageSet = { de, en, tr }` with identical blocks, item counts and ids. German is the source; EN and TR are transcreations. Shared strings (nav, footer, breadcrumb labels) in `src/content/v7/site.ts`, contact-form labels in `form.ts`.
- **Components:** `src/components/v7/` (shell: `Header`, `Footer`, `Hero`, `Section`, `Breadcrumbs`, `CtaBand`, `Faq`, `LangHint`, `NotFound`, `Logo`; motion: `MotionRoot`, `Reveal`, `ProcessLine`; media: `MediaFigure`, `VideoFigure`, `figures/`, `frames/`; `JsonLd`; `make-page.tsx`). One file per block type in `components/v7/blocks/<t>.tsx`, exporting `<Pascal>Block(props: BlockProps<"<t>">)`. Server components by default; client only for interaction or motion.
- **Route pattern:** `src/app/[locale]/<ROUTE>/page.tsx`: `export const generateMetadata = v7Meta(page); export default v7Page(page);`. Do not hand-write layout per page. SEO via `src/lib/seo-v7.ts` (`v7Metadata`: canonical, hreflang `de`/`en`/`tr`/`x-default`, Open Graph); JSON-LD is one `@graph` per page (`ProfessionalService` `#organization`, `WebSite` on home only, `WebPage`, `BreadcrumbList` equal to the visible breadcrumb, `FAQPage` only for a visible FAQ, `Service` offers only for published prices, `Course` for the two bookable trainings, `SoftwareApplication` for OpSo without offers). Titles ≤ ~60 characters without the brand (root template adds " | OpSolid"; home uses an absolute title), descriptions 140–160. `src/lib/seo-v4.ts` still holds `pickLocale`, OG constants and `ogImage` (name is historical).
- Sitemap = every key except impressum and privacy × 3 locales plus blog posts; `public/llms.txt`, `src/app/robots.ts`, `src/app/sitemap.ts`, `scripts/indexnow.mjs` stay in step with the page list.

### Art direction (marketing routes, direction A "Klarheit")

Chosen by the owner on 2026-10-29. Editorial, calm, precise; the clarity comes from the type. Tokens and base styles in `src/styles/opsolid-v7.css`, scoped to `html[data-v4]`:

- porcelain `#F6F2EC` (page), paper `#FFFFFF` (raised surfaces), ink `#16191D` (text, primary buttons, the one dark CTA band, footer), stone `#6B665F` (secondary text), line `#E3DCD1` (hairlines).
- copper `#B5623A` for lines, ticks, figures and the italic H1 emphasis at display size only; copper-deep `#8A4524` for copper text, links and focus rings on porcelain; on ink the focus ring is `#E8B99E`. Every text colour must pass AA.
- Type: **Fraunces** (display, variable opsz + SOFT, weight 300, `"SOFT" 50`, italic for emphasis), **Inter** (body, 17 px phones / 18 px desktop, line height 1.6), **Geist Mono** (labels, eyebrows, captions; uppercase, 11–13 px). Fraunces and Inter via `next/font/google` (latin + latin-ext for Turkish letters), Geist Mono from the `geist` package. `text-wrap: balance` on headings, `pretty` on paragraphs.
- Layout: sections separated by a hairline with a 56 px copper tick; left column (3/12) holds the mono "01 Label", content takes 9/12; H2 36 px phones / 56 px desktop with an answer-first lede. Buttons: primary ink on porcelain, hover copper-deep, radius 16 px, min height 52 px; secondary is a copper-deep underlined link. Minimum 44 px touch targets.
- **Motion:** `framer-motion` is allowed for light choreography (reveal: opacity plus 16 px rise over 500 ms, once; the hero figure draws once; the process line draws on scroll). Wrap marketing pages in `<MotionConfig reducedMotion="user">` (`MotionRoot`). Hydration-safe: keep `initial` constant and set the duration to 0 under reduced motion; never `initial={reduce ? false : …}`. No parallax stacks, scroll-jacking, cursor effects, gradient mesh, glassmorphism or heavy canvas backgrounds.
- Accessibility (WCAG 2.2 AA): one h1 per page and correct heading order, visible focus, working skip link, every video pausable.

### Media and video

`MediaFigure` (with `VideoFigure`) is the one video slot. Rules:

1. Poster first: the `<picture>` poster is the first frame. Video sources are set only after `load` plus an idle callback, `preload="none"`, `muted playsInline loop`; portrait files for phones in portrait, landscape elsewhere, WebM before MP4. Reserve the aspect ratio (no layout shift).
2. A visible 44 px pause/play button (`aria-pressed`); the video also pauses off screen (IntersectionObserver) and in hidden tabs.
3. `prefers-reduced-motion` and the footer "Hintergrundvideo" switch (`opsolid-fx=off`, `FX_EVENT`, `src/components/v7/fx.ts`, UI in `components/layout/FxToggle.tsx`) keep the poster and fetch no video.
4. Captions read "Abb. x.y", the text, and "KI-generiert" (EN "AI-generated", TR "Yapay zekâ ile üretildi") when the media is AI-made (`ai`).
5. No text, people, faces, logos or claims inside videos; they are decoration. Agents are abstract.
6. Self-hosted only: images and video come from `/public`, fonts via `next/font`; no remote images, scripts, iframes, embeds or analytics at run time. Screenshots use `next/image` and the browser/phone frames in `components/v7/frames` (vendored Magic UI, MIT). Real proof only; never another user's data.
7. The voice demo block is a scripted scenario labelled as such, with no audio and no provider.

### Gates before merging marketing changes

`npx tsc --noEmit -p .`, `npx next lint --dir src`, `npx tsx --test scripts/tests/redirects.test.mts scripts/tests/v7-routes.test.mts`, `npm run audit:cards` (via `predeploy`), and the capture script on every changed page: report.json must show 200, 0 console errors, 0 overflow, 0 axe violations at 1440 and 390; look at the JPGs for overlap. Lighthouse mobile on home and one inner page (LCP ≤ 2.5 s, CLS ≤ 0.1). Do not run `next build`/`next dev` against a dev server that is already running.

### App-surface text and legacy

App-surface text (and the legal pages' shared bundle) lives in `src/content/en.ts` (type-defining source of truth), `de.ts`, `tr.ts`, combined in `src/content/index.ts`; `Content` is derived from `en.ts` with `DeepString<T>`. Add a key to `en.ts` first, then `de.ts` and `tr.ts`; all three must match or the build fails. `src/context/LocaleContext.tsx` provides the locale (`useLocaleBase()`); `useLocale()` returns `{ locale, setLocale, t }` with `t` from `ContentContext`, loaded by `components/layout/ContentGate.tsx` only on app routes (`needsContentBundle` = not a marketing path). **Never call `useLocale()` / read `t` in marketing components**: use `useLocaleBase()` or the page definitions. `components/layout/V4Sync.tsx` keeps `<html data-v4 / data-theme>` in step on client navigation.

```tsx
const { locale, setLocale } = useLocaleBase(); // marketing components
const { t, locale } = useLocale();             // app / legal surfaces only
```

App routes: `page.tsx` (server, metadata) + `PageName.tsx` (client, `"use client"`, `useLocale()`).

### Key configuration files

- `src/lib/constants.ts` — brand, domain, email, address, `SITE_UPDATED_ISO` (visible "Stand:" line, sitemap `lastModified`), `SITE_CONFIG` tagline/description (consulting-first).
- `src/styles/opsolid-v7.css` — marketing tokens and base. `src/styles/opsolid-v4.css` — legacy `v4-*` classes, kept only for the app Header/Footer, `components/layout/NotFoundView` (root 404) and the Logo lockup; do not use in marketing code.
- `src/styles/opsolid-tokens.css` + `tailwind.config.ts` — app-surface tokens: `bg-bg-{0..5}`, `text-ink-*`, `border-line-*`, `copper-{50..900}`, `neutral-{50..950}`, `signal-ok|warn|err`; Geist / Inter / JetBrains Mono / Instrument Serif. `amber`, `paper*`, `olive`, `steel` are removed.
- `public/llms.txt`, `src/app/robots.ts`, `src/app/sitemap.ts` — GEO/SEO surface.
- `.env.example` — SMTP vars for contact form email delivery.

### Contact form API

`src/app/api/contact/route.ts` — POST endpoint with a per-client rate limit and honeypot. Validates input and sends via the mail provider in `src/lib/email/client.ts` (Brevo > Resend > SMTP). Without `CONTACT_TO_EMAIL` and one provider it answers 503 and the form shows its fallback text. `/api/auth/status` always answers 200 so marketing pages produce no 401 console error; `/api/auth/me` keeps its 401 contract. The v7 form is `components/v7/blocks/contact-form.tsx`; `scripts/contact-route-guard.test.cjs` still exercises the retired `components/v4/ContactForm4.tsx` (follow-up: port the test to the v7 form, then delete it).

### Other component folders

- `components/ui/` — design-system primitives (Button, Card, Badge, Input) using CVA (app surfaces).
- `components/shared/` — `LocaleLink`, `Icon`. No analytics and no consent banner: nothing on the site needs consent (only the user-chosen language cookie and the "Hintergrundvideo" switch are stored). Adding any tracking needs a consent mechanism and a privacy-text update first.
- `components/layout/` — app Header/Footer; on marketing paths they delegate to the v7 Header/Footer. Also `ContentGate`, `V4Sync`, `FxToggle`, `NotFoundView`.
- `components/sections/` — `FaqAccordion`, `FinalCTA`, `PricingTable`, used only by the legacy OpSo order page under `products/digital-card`. The v2/v4 marketing components, `HeroScene`, `scene.ts`, `PageRenderer` and the old OpSo showcase were removed (2026-10); their URLs 301 via `src/lib/redirects.ts`. Do not reintroduce them.
