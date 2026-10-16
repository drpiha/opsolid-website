# opsolid.de v4: implementation notes (2026-10-16)

Branch `claude/opsolid-v4`, draft PR #43. Not deployed.

## What changed

- **Art direction (marketing routes only):** graphite + copper, Archivo (display and body, width axis) + IBM Plex Mono (labels). Scoped to `html[data-v4]`. Dark only. App surfaces (dashboard, onboarding, card-preview, auth, public cards `/c/*`, admin, voice) keep the existing theme system and its stylesheet bundle.
- **3D stage:** one persistent object behind every marketing page, a stack of seven plates (one per offering) that re-forms per section with GSAP ScrollTrigger. Sections mark scenes with `data-scene` and `data-heat`. `src/components/v4/Stage.tsx`.
  - **Own column, never over text.** On desktop the object is fitted into the free column beside the measured text column of the scene in view (scale and position are derived from the column's right edge each frame). Wide blocks (tables, the agent demo, FAQ) sit on an opaque panel. On phones the object is above the text and every text column is an opaque panel. `?debug` exposes `window.__v4stage.bounds()` for automated overlap checks.
  - **Impact:** HDR copper edges with bloom (desktop), per-scene camera moves (dolly, crane, field of view), cubic easing between scenes, first frame placed directly at its target (no glide across text).
  - **Real proof on the window planes:** the Websites and Produkte scenes show real screenshots of opsolid.de, OpSo (card.opsolid.de, a demo profile) and Kutasia (kutasia.com, Turkish UI) as `public/img/v4/shot-*.webp` (24–30 kB each, fetched only on pages that have such a scene).
  - three.js and GSAP are dynamic imports, started on the first user intent (pointer, scroll, touch, key) or after 8 s. Until then the static poster (inline SVG) is the first frame.
  - No WebGL, `prefers-reduced-motion`, or the footer switch "3D-Effekte: Aus" keep the poster and load no 3D code. The footer switch is the only quality control in production (the Voll/Leicht/Poster bar existed only in the static prototype).
  - Phones and touch devices run a lighter mode (DPR up to 1.5, no reflections, no bloom, no edge lines, 30 fps). Desktop has a frame-time guard that drops bloom for good if frames stay slow.
- **Pages (DE, EN, TR, content in `src/content/v4/pages-*.ts`):** Start, Agents (new), Websites (new), Leistungen, KI-Beratung, Prozessautomatisierung, Microsoft 365, Interne Tools, KI-Schulungen, KI-Check, Über mich, Kontakt (form), Notizen (blog list and posts). OpSo, Impressum and Datenschutz keep their existing content under the new theme.
- **Header and mark:** the header is opaque at every scroll position (no content showing through behind the nav). The logo mark is now a single plate of the 3D stack (copper top, ink front and side) instead of three bars, so it can no longer be mistaken for the menu button.
- **Layout guards in the repo:** `npm run audit:stage` (Playwright, needs a running server, `BASE=...`) asserts per scene that the 3D object does not intersect any heading, paragraph, list item, table, link, button or form control at 1280, 1440, 1920 and 390 px (desktop: no exemption, phones: opaque panels exempt), plus horizontal scroll and console errors. `npm run audit:headings` checks that no h1/h2 needs a mid-word break in de/en/tr at 360–1920 px. Long German compounds get soft hyphens at known stems (`src/lib/soft-hyphen.ts`).
- **Scripted agent demo:** typed sample dialogue plus a wave, and an abstract voice-reactive form in 3D (particle sphere that swells with the same amplitude, glowing core, three rings; no face, eyes or mouth). Labelled "Demo · Szenario, ohne Ton", with the data-protection note. No audio, no microphone, no provider. A live voice demo needs a provider and a data-protection review first.
- **Voice (owner decision, 2026-10-16):** professional company voice (OpSolid / wir / we / biz), focused on what the work changes for the client's business. Team size is not a topic: all "allein", "Einzelpraxis", "one-person", "tek başıma" phrasing was removed, and no team size is implied. Experience is shown through real background (IT project management, digitalisation, process optimisation), the method and real work (opsolid.de, OpSo as a product in its test phase, Kutasia as a project in development, not a product). No invented numbers, clients, testimonials or certifications. The about page is now "Über OpSolid" (route `/ueber-mich` unchanged).

## SEO and GEO

- One `" | OpSolid"` suffix (root title template); manual suffixes removed.
- Self-canonical per locale, reciprocal hreflang (`de`, `en`, `tr`) and `x-default` = `/de` via `src/lib/seo-v4.ts`.
- Locale routing keeps the owner's July rule (#34/#35): **language follows COUNTRY, not the browser**. `/` and other locale-less URLs get a 307 by cookie (explicit choice), then an upstream geo header, then the in-app `/api/geo` lookup over loopback (fail-open, 2.5 s timeout), then `de` when the country is unknown (the July version answered `en` there). Unlike the July version, detection no longer persists the cookie on a confident geo redirect, so a bare `/` visit always re-detects. TR → `tr`, DACH → `de`, everything else → `en`. `Accept-Language` is never consulted: a Turkish browser in Germany lands on `/de`. The 307 carries `Vary: Cookie` and `Cache-Control: private, no-store`; detection writes no cookie (only an explicit language switch persists); `/de`, `/en`, `/tr` never redirect; locale-less retired URLs go to `/de/...` with a stable 301. `?geodebug=1` reflects the decision in `x-opsolid-geo`. The logic is in `src/lib/locale-routing.ts` and unit-tested (country TR/DE/AT/CH/US, unknown country, cookie beats country, Accept-Language ignored). `DEFAULT_LOCALE` stays `en` (app surfaces); `ROUTING_DEFAULT_LOCALE` is `de`.
- One JSON-LD `@graph` per page (`src/components/v4/JsonLd.tsx`): ProfessionalService, Person, WebSite, WebPage / ProfilePage / CollectionPage / ContactPage, BreadcrumbList (matches the visible breadcrumb), Service (offers only for the three published training prices), FAQPage (only where the FAQ is visible), BlogPosting.
- `robots.txt`: public site open to search and AI bots (list in `src/app/robots.ts`), private paths disallowed. `llms.txt` rewritten, no "we", linked from the footer. Sitemap has alternates and real `lastModified`.
- Visible "Stand: Oktober 2026" (from `SITE_UPDATED_ISO`), answer-first lede under every H2, one line "OpSolid ist nicht TopSolid" on Über mich and in the footer.

## Performance work

- The full content bundle (about 220 kB gz) no longer ships to marketing routes: `useLocale()` is split into locale-only (`useLocaleBase`) and content (`t`, via `ContentGate`).
- Legacy stylesheets (about 26 kB gz) load only for app, legal and card surfaces.
- Archivo latin is the only preloaded display font; latin-ext (ğ ş İ ı) loads on demand. Geist is no longer preloaded.
- Consent copy extracted into `src/content/consent-copy.ts`; accept and reject carry the same visual weight.
- `/api/auth/status` answers 200 for anonymous visitors, so there is no 401 console error on every page. `/api/auth/me` keeps its 401 contract.

## Needs owner confirmation

1. Websites: sale/rental terms and prices are not in the repo. The text says the terms are agreed in a conversation.
2. The sample dialogue in the agent demo is invented and labelled as a scripted run.
3. KI-Check (price on request, 30-day plan) and KI-Quick-Check (from 490 €, short report) overlap; may need merging.
4. Trainings: the KI-Quick-Check is run by OpSolid; KI-Kompetenz Basis by a freelance specialist trainer selected by OpSolid and named in advance. Please confirm. The Copilot day is now spelled "Copilot-Praxistag" (was "Copilot Praxis-Tag"), also in structured data.
5. Experience is stated only through facts from the earlier About page (practical background in IT project management, digitalisation and process optimisation). Real numbers (years, sectors, projects) can be added if the owner provides them. No photo yet.
6. Screenshots on the 3D planes: opsolid.de, OpSo (card.opsolid.de landing, fictional demo profiles), Kutasia (kutasia.com, Turkish UI, demo dashboard). OK to show publicly?
7. Legacy pages still reachable outside the v4 navigation: `/products` ("Neun Produkte", Kutasia with a price) and `/products/kutasia` describe Kutasia as a product. They are now `noindex` and out of the sitemap; recommended next step is a 301 to `/leistungen` (needs a change to `scripts/tests/redirects.test.mts`, which pins `/products/kutasia` as a working route). `/products/digital-card/gallery` says "go live in minutes" for OpSo.
8. The about route is still `/ueber-mich` ("about me") for link stability; a move to `/ueber-uns` with a 301 is a small follow-up if wanted.
9. Kept from earlier copy: the "500 Euro im Monat" platform comparison on Interne Tools; KVKK named for projects connected to Türkiye; TR buttons now in siz-form ("YZ kontrolü planlayın").

## Verification (sandbox, 2026-10-16)

- Clean install and gate: `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm run predeploy` (audit:cards + build), `npx tsx --test scripts/tests/redirects.test.mts` (3 of 3): all pass.
- Overlap audit (Playwright + `?debug` hook; for every scene section of every marketing page the projected object box is compared with the rectangle of every visible text element not on an opaque panel). Final build: the 13 pages that have a 3D stage at 1440 and 390 px, 6 pages at 1280 and at 1920 px, plus a mid-morph pass at 78 % section progress (1440 and 390, 8 pages) on the previous build. Earlier builds covered 13 pages at each of 1280, 1440 and 1920. No overlaps, no console errors, no horizontal scroll at 1440 or 390 on any page including OpSo, Impressum and Datenschutz (which have no 3D stage). The audit boxes are conservative axis-aligned boxes, so a few pixels of apparent edge contact at the right viewport edge are not real overlap.
- axe-core (WCAG 2.0/2.1/2.2 A and AA plus best practice), with the 3D stage running (full on desktop, light on mobile), 18 pages (`/de` pages, `/en`, `/tr`) at 1440 and 390 px: 0 violations.
- Lighthouse 12 mobile, devtools throttling (4x CPU, slow 4G), production build, software WebGL, final build. `/de`: performance 89 (85–89 over five runs), LCP 2.3 s (2.2–2.4 s, text, `p.v4-lede`), TBT 170 ms (170–260 ms), CLS 0.024. `/de/ki-schulungen`: 92, LCP 2.4 s, TBT 100 ms, CLS 0.027. `/de/agents`: 92, LCP 2.2 s, TBT 180 ms, CLS 0.022. Accessibility 100, best practices 100, SEO 100 on all. LCP is within 2.5 s and CLS within 0.1, but with little headroom on `/de` and `/de/ki-schulungen`; the earlier internal target "LCP under 2.0 s lab" is not reached under that throttling. Remaining weight: render-blocking CSS (tailwind about 23 kB gz, tokens, v4) and the preloaded display font (about 89 kB). Not done: purge unused tailwind utilities for marketing routes, subset the display font, inline critical CSS.
- JS at load (gzip): about 194 kB (Next reports 159 kB first-load for marketing routes), down from about 407 kB. The 3D chunks (three, bloom passes, GSAP ScrollTrigger) add about 210 kB gz after first intent; screenshots add about 79 kB, only on pages that have a Websites / Produkte scene.
- Limits: all WebGL runs here use software rendering (SwiftShader, a few frames per second), so frame rate, bloom cost and the frame-time guard are not measured, and no real GPU, phone or field data was available. Lighthouse in this sandbox does not interact with the page, so the 3D core (which starts on first intent or after 8 s) is largely outside the measured window; interactive cost of the 3D is therefore not in these numbers.

## CLAUDE.md

Updated in this PR: v4 art direction and tokens, Archivo + IBM Plex Mono, the content split (`useLocaleBase` vs `useLocale`), the 3D guardrails (SSR text as LCP, idle/intent load, light mode on phones, poster for reduced motion / no WebGL, footer switch, never over text, abstract agent, real proof only), no gradient mesh, no glassmorphism. Stale rules (Geist/Inter/Instrument Serif as the marketing fonts, the homepage sections list, the "deep blue / violet" tailwind note, the single `useLocale()` pattern) were replaced; "no gradient mesh, no glassmorphism, no framer-motion page choreography" is kept.

## Dead code candidates (not removed)

`src/app/[locale]/leistungen/LeistungenPage.tsx` and `src/app/[locale]/ai-automation-check/AIAutomationCheck.tsx` are not imported by anything any more (the routes render the v4 page definitions). `src/components/v2/*` and `src/components/sections/*` are still imported by `/about`, the `products/*` pages and `ProductStubPage`, so they stay. Left in place to keep this PR reviewable.
