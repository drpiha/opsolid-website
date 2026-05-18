# OpSolid Marketing Site — Redesign Execution Prompt (v2)

> **How to use this file.** Paste the text below the divider into a fresh Claude
> Code session inside `C:\Users\drhas\Documents\Coding\Project_Website`. It is
> self-contained — every constraint, every decision pending, every milestone,
> every reference URL, every rejection rule. Evidence behind every claim lives
> in `mayai-website/docs/research/{industry,motion,voice,stock,award}-audit.md`.
>
> Supersedes the previous `pattern-board.md` and earlier draft of this prompt.

---

# OpSolid — Marketing Site Redesign (Round 1 of Implementation)

You are leading a high-craft redesign of opsolid.de, the marketing site of an
independent automation and AI consulting practice based in Germany. The repo
is at `C:\Users\drhas\Documents\Coding\Project_Website\mayai-website` —
Next.js 14 App Router, `[locale]` segment for DE/EN/TR, Tailwind, deployed to
opsolid.de via Docker → VPS at `/opt/opsolid-website` (`git push origin main`
triggers the build). GitHub: https://github.com/drpiha/opsolid-website.

The audience is SMB owners and operations leads in DACH (Germany, Austria,
Switzerland). The tone target is **serious automation studio**: confident,
technical, calm. The site must NOT feel AI-generated, must NOT use gradient
blobs, must NOT use glassmorphism, must NOT default to a dark theme.

Five evidence audits were run before this prompt was written. They live in
`docs/research/*.md` — **read them before making any design decision**. The
authority hierarchy is: this prompt > the five audits > anything else.
Existing tokens in `tailwind.config.ts` and `src/styles/opsolid-tokens.css`
are NOT preserved — the visual system is being rebuilt from a fresh palette
and font pairing based on evidence, not history.

## What is in scope

All marketing routes under `/[locale]/...` listed below. URLs are stable
(SEO). Visual rebuild + per-page composition + motion system + voice.

- `/[locale]` (home)
- `/[locale]/leistungen`
- `/[locale]/ki-beratung`
- `/[locale]/prozessautomatisierung`
- `/[locale]/microsoft-365-automatisierung`
- `/[locale]/interne-tools`
- `/[locale]/ki-schulungen`
- `/[locale]/products` (index + each product subpage)
- `/[locale]/about` & `/[locale]/ueber-mich`
- `/[locale]/contact`
- `/[locale]/ai-automation-check`
- `/[locale]/blog`

## What is out of scope

- `/[locale]/pricing` — **REMOVED from the IA**. Do not redesign it; remove its
  nav entry; redirect to `/contact` with a 308. We do not advertise prices.
- Database schema, auth, voice agent module, digital-card editor logic.
- Anything under `voice/`, `admin/`, `dashboard/`.
- Legal pages content (Datenschutz / Impressum / AGB) — visual only, no copy.
- The digital-card product flow (`/products/digital-card`, `/c/[slug]`) keeps
  its **own** brand identity ("Verso by OpSolid" — Aegean turquoise `#1AA6B7`,
  Concept-3 Folded Corner icon). It is not skinned in the new OpSolid palette.

---

## 1. Visual system (rebuild from fresh evidence)

### 1.1 Theme: LIGHT-default

Audit verified across 15 real competitor sites (Zapier, Make, Tines, Celonis,
SAP, Personio, Bosch, Hetzner, Workato, Boomi, plus Stripe, Linear, Vercel,
Apple, Notion). **12 of 15 are light-default.** Dark-default is a developer
register (n8n, tray.ai, UiPath) and is the wrong neighborhood for DACH SMB
trust. Light is the category norm, not a contrarian choice. We do NOT ship a
dark mode in this round.

### 1.2 Palette — three directions; recommended pick: B

Pick one of the three options below before any code. Source: motion-audit and
award-audit. All three pass WCAG AA on the listed combinations.

**Direction A — "Engineered Linen"** (safest, institutional)

| Token | Hex | Use |
|---|---|---|
| `bg-base` | `#F5F3EE` | Page background — warm off-white, paper-adjacent |
| `bg-surface` | `#EDEAE3` | Cards, panels |
| `ink-1` | `#1C1917` | Body text, primary strokes |
| `ink-2` | `#3F3D38` | Secondary text |
| `accent-primary` | `#2563EB` | Calibrated institutional blue — CTAs, active nodes |
| `accent-soft` | `#DBEAFE` | Halo around active elements |
| `line-ghost` | `#C8C4BA` | Inactive grid lines, hairlines |
| `motion-trace` | `#3A5F8A` | Animated packet, traveling glyph |

Reads as: Stripe / Celonis / Personio. Reference site: Stripe.

**Direction B — "Concrete Studio"** (RECOMMENDED — distinct, intelligent)

| Token | Hex | Use |
|---|---|---|
| `bg-base` | `#F0EFED` | True concrete gray — no warm or cool cast |
| `bg-surface` | `#E5E4E1` | Cards, panels |
| `ink-1` | `#111827` | Body text, primary strokes |
| `ink-2` | `#374151` | Secondary text |
| `accent-primary` | `#0F766E` | Deep teal — rare in DACH B2B automation |
| `accent-soft` | `#CCFBF1` | Halo around active elements |
| `line-ghost` | `#D1D5DB` | Inactive grid, hairlines |
| `motion-trace` | `#14B8A6` | Animated packet, traveling glyph |

Reads as: Atoll Digital 2025 / Tines (without the dark) / quietly confident.
The teal is genuinely uncommon in DACH automation — most competitors run
institutional blue or copper. **This is the recommended pick** because it
differentiates without being eccentric. Contrast ratio teal-on-concrete:
5.2:1 (passes AA).

**Direction C — "Warm Machine"** (warmest, friendliest)

| Token | Hex | Use |
|---|---|---|
| `bg-base` | `#FAFAF8` | Near-white with faintest warm undertone |
| `bg-surface` | `#F1F0EC` | Cards, panels |
| `ink-1` | `#18181B` | Zinc-900, neutral |
| `ink-2` | `#3F3F46` | Secondary |
| `accent-primary` | `#D97706` | Amber/gold — warm mechanical |
| `accent-soft` | `#FEF3C7` | Halo |
| `line-ghost` | `#E4E4E7` | Grid |
| `motion-trace` | `#F59E0B` | Packet |

Reads as: Fourmula AI / restrained Mailchimp. Warmer than B; slightly more
"agency than enterprise". Backup if B feels too cool for the founder.

### 1.3 Typography — two pairings; recommended pick: Pairing 2

Reject the current Geist + Inter + Instrument Serif + JetBrains Mono stack —
fresh thinking per user instruction.

**Pairing 1 — "Precise Authority"** (premium budget)

- Display / H1–H2: **Söhne** (Klim Type Foundry) — Light, Regular, Semibold.
- Body: **IBM Plex Sans** — Regular, Medium.
- Mono (data labels, code, eyebrow): **IBM Plex Mono**.

Used by: Stripe (Söhne), Celonis-tier institutional. Söhne is licensed
(Klim.co.nz) — single-domain web fee. IBM Plex is open-source.

**Pairing 2 — "Technical Warmth"** (RECOMMENDED, distinct, budget-friendly)

- Display / H1–H2: **TWK Lausanne** (Weltkern) — Medium, Bold.
- Body: **Plus Jakarta Sans** (Google Fonts, free) — Regular, Medium.
- Mono: **Berkeley Mono** (paid, ~$75 lifetime) OR **Fira Code** (free).

Used by: Ramp (TWK Lausanne throughout), Deel, Atoll Digital. TWK Lausanne
is the defining premium grotesque of 2023–2026 fintech/SaaS — distinct from
the Inter/Geist monoculture. Plus Jakarta Sans is warmer than Inter at body
size. Total typography budget: low. **Recommended.**

Both pairings: `font-display: optional` on body, `swap` on display. WCAG AA at
16px / 1.6 line-height on Direction B backgrounds.

### 1.4 Grid + spacing

- 12-column desktop, 6-column tablet, 4-column mobile.
- Gutter ramp: 16 / 24 / 32 / 48 / 64 / 96 px (Tailwind-style spacing scale).
- Maximum content width: 1320px (desktop). Editorial pages cap body at 65ch.
- Each page is allowed to break the grid in **exactly one** hero section.
  That deliberate break is part of the page's identity (see §2).

### 1.5 Iconography

- One outline icon family for the whole site. **Recommended: Lucide-react**
  (already installed in repo, stroke-width 1.5px, set across all sizes).
- No filled glyphs. No 3D isometric. No "AI sparkle" / glow brain icons.

---

## 2. Per-page art direction (12 distinct compositions)

Source: award-audit Task 5. The principle is **Art-Directed Page Staging** —
one token set, multiple compositional registers. Each page is assigned a
distinct compositional role (brand manifesto, product proof, trust gallery,
data credibility, editorial content hub, etc.) and its hero is built to serve
that role, not to repeat the previous page's hero.

Each entry below specifies: composition, motion idea, reference site, visual
asset source. **All 12 must remain compositionally distinct from each other.**

### Home — `/[locale]`
- **Composition:** Full-width split. Left column: 3-line headline stack in
  TWK Lausanne display ("**Prozesse automatisieren. Zeit zurückgewinnen.**").
  Right column: single real screenshot of an actual workflow tool (Power
  Automate or Make canvas) in a sharp drop-shadow card.
- **Motion:** As user scrolls, the dashboard screenshot tiles downward to
  reveal a second interface (stacked-card parallax, 2 cards — not infinite).
  Behind everything: low-opacity SVG node-graph with stroke-dashoffset
  packets traveling slowly along edges (`motion-trace` color). The graph is
  large but quiet — 35% opacity, 12 nodes, packets every ~6s.
- **Reference:** Stripe `/payments` (UI as hero) + Vercel `/ai` SVG
  topology (background lattice).
- **Asset:** UI screenshot (Power Automate / n8n canvas) + custom inline SVG
  (no library).

### Leistungen — `/[locale]/leistungen`
- **Composition:** Horizontal service rail. Five service cards in a single
  scrollable row spanning full viewport width. Each card: 2-word label, index
  number (01–05), monochrome Lucide icon on a light gray tile. Below the rail:
  one brief manifesto paragraph.
- **Motion:** Rail auto-advances one card every 4s, user can drag, cards
  scale 1.02 on hover. GSAP ScrollTrigger pins the rail and converts vertical
  scroll into horizontal translation through the cards on desktop only;
  mobile degrades to vertical stack.
- **Reference:** Linear `/features` card grid + Outfit (Awwwards May 11).
- **Asset:** Custom geometric icons (line-weight, 1.5px stroke).

### KI-Beratung — `/[locale]/ki-beratung`
- **Composition:** Two-column asymmetric. Left 35%: overline label
  "**KI-Beratung**" (mono, uppercase, eyebrow size), then a single large
  question in TWK Lausanne display ("**Welche Prozesse kann Ihre KI
  übernehmen?**"). Right 65%: a real-looking conversation transcript or
  output log rendered as a terminal block — Berkeley Mono / Fira Code,
  timestamped lines, syntax-highlighted.
- **Motion:** Terminal lines type in sequentially on page load (60ms per
  character, stops at 8 lines). After completion, the cursor blinks.
- **Reference:** Vercel `/ai` (developer-register as evidence).
- **Asset:** Generated UI (no external asset).

### Prozessautomatisierung — `/[locale]/prozessautomatisierung`
- **Composition:** Full-bleed background of a real BPMN-style process
  diagram (light gray on off-white, not colorful) filling the viewport at
  low contrast. Overlaid: bold dark headline in TWK Lausanne Bold, tight
  tracking. One sentence. One CTA. The diagram is **texture**, not content.
- **Motion:** Diagram pans right at 20px/s on infinite loop (CSS `translate`
  animation, GPU-only). Stops on hover. Below the fold: a scroll-scrubbed
  JPEG sprite sequence (24 frames preloaded, first 6 with
  `<link rel="preload">`) showing the same workflow constructing itself
  (Trigger → Decision → Action → Outcome) as the user scrolls.
- **Reference:** Celonis solution pages (diagram as evidence layer) +
  Apple `/apple-intelligence` (scroll-scrubbed sprite sequence).
- **Asset:** Custom SVG diagram + 24 generated JPEG frames.

### Microsoft 365 Automatisierung — `/[locale]/microsoft-365-automatisierung`
- **Composition:** Logo-trust hero. Right side: the four official M365
  product icons (Outlook, Excel, Teams, OneDrive/SharePoint) arranged in a
  2x2 grid in their own brand colors. Left side: bold claim + a short
  benefit list (3 items, tight typography, no icons). Below the fold: a
  real screenshot of a Power Automate flow that touches all four.
- **Motion:** The four M365 icons pulse in sequence (opacity 60% → 100% →
  60%, 800ms per icon, staggered) — reads as "the system is alive". Hover
  on one product reveals a thin `motion-trace` line connecting it to the
  Power Automate screenshot below.
- **Reference:** Vercel `/enterprise` (logo-trust hero) + Cursor.com
  (cross-mockup data lines).
- **Asset:** Official Microsoft icon kit + UI screenshot.

### Interne Tools — `/[locale]/interne-tools`
- **Composition:** Before/after split panel. Left panel: a crude Excel-style
  spreadsheet mock (deliberately low-fi, gray-and-white). Right panel: a
  polished custom-tool UI showing the same data, cleanly. Vertical divider
  with a small "→" glyph at center. Headline sits above both panels.
- **Motion:** On load, panels slide in from opposite edges over 600ms.
  Divider draws in last. On hover of right panel, a subtle wireframe overlay
  appears showing the underlying component grid.
- **Reference:** Ironclad demo-clip in hero (adapted to a static split for
  performance) + Cursor crossfade pattern.
- **Asset:** Two UI screenshots (custom tool mock + spreadsheet mock).

### KI-Schulungen — `/[locale]/ki-schulungen`
- **Composition:** Full-bleed editorial photograph of a real training
  session — people at a whiteboard, candid, not staged. Headline floats over
  the image in white reverse type, large scale, **serif display** (the one
  page where a serif appears — marks it as editorial, human, not technical).
  Below the fold: chapter-style index pinned left, content scrolls right.
- **Motion:** Ken Burns pan on the hero image (zoom 100% → 103% over 8s).
  Stops once user begins scrolling. Below the fold: scroll-tracked chapter
  index updates the active chapter via IntersectionObserver.
- **Reference:** Atoll Digital case study + Stripe Press chapter index.
- **Asset:** Stock photo (workshop / training, candid — Pexels or Coverr,
  no laughing-team clichés). Apply scanning-line CSS overlay at 2% opacity
  to defuse the stock-photo feel.

### Products Index — `/[locale]/products`
- **Composition:** Tight headline + three product tiles. Each tile is
  color-coded with a muted accent (different per product — e.g. Verso uses
  its turquoise `#1AA6B7`, others borrow from Direction-B variations).
  Card contains product name, one-line description, small UI thumbnail.
- **Motion:** Cards stagger-reveal on scroll entry (100ms delay per card,
  slide up 24px). On hover, each card plays its OWN signature motion preview
  in the thumbnail area — different motion per product.
- **Reference:** Happly (mood-coded product grid).
- **Asset:** UI screenshot thumbnails (real product interfaces).

### Product subpages — `/[locale]/products/<slug>`
- Each product gets a **unique** hero composition. No template. The Verso
  digital-card subpage keeps the Aegean-turquoise palette and Concept-3
  folded-corner icon — it does NOT use the new OpSolid palette.
- One product page may earn a richer motion budget (3D card flip, e.g.) but
  only behind a dynamic import + `prefers-reduced-motion` gate. No r3f
  unless that page is the one that earns it.

### About + Über-mich — `/[locale]/about` & `/[locale]/ueber-mich`
- **Composition:** Founder-portrait dominant. Left 50%: large cropped
  portrait, edge-to-edge in its column, no border-radius. Right 50%: founder
  name in display scale ("**Hasan Dönmez**" — name IS the headline), role
  below at body scale, then three short paragraphs. No separate hero
  headline above.
- **Motion:** Portrait opacity 90% → 100% over 600ms on enter. Right
  column text slides from 32px right over 400ms. Then nothing. Editorial
  pages should breathe.
- **Reference:** Mercury `/personal` + Stripe `/about`.
- **Asset:** Real professional portrait of Hasan (commission if not on hand).

### Contact — `/[locale]/contact`
- **Composition:** Minimal. Headline takes 80vh ("**Sprechen wir.**" /
  "Talk to us." / "Görüşelim."). Below it: a single email address in mono at
  32px, plus one line ("**Antwort innerhalb 24 Stunden.**"). The form lives
  further down. **The emptiness is the confidence signal.**
- **Motion:** The email address has a subtle CSS cursor blink after it.
  Nothing else moves. On focus of any form field below, a `motion-trace`
  underline draws across the field over 240ms.
- **Reference:** Linear `/method` (zero decoration earned).
- **Asset:** None.

### AI-Automation-Check — `/[locale]/ai-automation-check`
- **Composition:** The quiz IS the hero. A horizontal progress bar at the
  top ("Schritt 1 von 6"). Below it: a single large question, two or three
  answer tiles. No separate hero section exists. Results screen has a small
  custom radar/bar chart.
- **Motion:** Question tiles slide in from the right on each selection
  (Framer Motion shared-layout). Progress bar fills smoothly. Final
  results: chart bars draw in via `stroke-dashoffset`.
- **Reference:** Stripe `/atlas` (form input as hero).
- **Asset:** Generated visuals.

### Blog — `/[locale]/blog`
- **Composition:** Masonry card grid, three columns. The newest article
  spans full width as a featured card (large cover image, title, date,
  read-time). Remaining articles in 3-column grid below. No separate hero
  headline above the featured.
- **Motion:** Cards stagger-fade on scroll entry (150ms per card, opacity
  0 → 1). Hover on a card: magnetic cursor halo reveals reading-time
  preview text in a small overlay.
- **Reference:** Stripe `/press` + basement.studio cursor.
- **Asset:** Stock cover images per article (16:9, Coverr/Pexels, apply
  duotone in Direction-B teal+ink).

---

## 3. Background motion system (the "lively robotic" requirement)

The user explicitly wants **large, robotic, lively background motion**.
Audit-verified production-safe techniques, ranked cheapest to most expensive
(see `docs/research/motion-audit.md` for full table):

1. **SVG stroke-dashoffset packet traversal** — 0 KB JS, native `<animateMotion>`,
   live-schematic feel. Use on **Home hero ambient layer** + Prozessautomatisierung
   below-fold workflow.
2. **Pre-baked circuit texture PNG + CSS animation** — 0 JS, 40-80 KB PNG.
   Use as ambient layer on Leistungen + Microsoft 365 + Interne Tools (8-10%
   opacity, slow `translate` keyframe, 60s loop).
3. **SVG concentric ring topology** (Vercel `/ai` pattern) — near-zero
   bundle. Optional ambient on Home if SVG packet flow alone feels thin.
4. **Scroll-scrubbed JPEG sprite sequence** (Apple Intelligence pattern) —
   0 KB JS, 3-8 MB preloaded sprites. **Use on Prozessautomatisierung
   workflow-construction sequence only.** Preload first 6 frames with
   `<link rel="preload" as="image">`.
5. **GSAP ScrollTrigger reveals** — ~30 KB. Use for Leistungen horizontal
   rail pin + section reveals across all pages.

**REJECTED** by performance budget (Pixel 6a fails 60fps, LCP > 2.5s):
- Three.js full 3D mesh
- WebGL gradient mesh (Stripe's signature) — too risky for our budget
- @react-three/fiber unless one product subpage genuinely earns it
- Lottie heavyweight animations (Rive is lighter; allow if a specific case)

**Production stack budget:** GSAP+ScrollTrigger (~30KB gz) + lenis (~5KB gz)
+ inline SVGs + a couple of PNG textures. Total motion-related JS additional:
under 50KB gz. Goal: Lighthouse mobile ≥ 85, LCP < 2.5s, 60fps M1 Air and
Pixel 6a class.

---

## 4. Stock asset policy (the "use stock video and imagery" instruction)

Resolution of the conflict between the user's "add stock" instruction and the
industry audit's finding that serious B2B sites avoid stock illustration:

### Allowed
- **Stock VIDEO** as ambient background (server-rack LEDs, hands-on-keyboard,
  conveyor belts, circuit-board macro, abstract dataflow) — **only when
  treated with at least one defuse technique** (see below).
- **Stock PHOTO** as editorial content (KI-Schulungen workshop scene, blog
  cover images, About context shots) — same defuse rule.
- **UI screenshots** of real automation tools (Power Automate, Make, n8n)
  are the preferred asset class for product hero compositions.

### Banned
- Stock **illustration** packs (Storyset, unDraw, generic isometric "team at
  laptop"). Reads as bootstrap-SaaS, not DACH-enterprise.
- Stock photo clichés: diverse-team-laughing-at-laptop, handshake-over-desk,
  golden-hour-skyline, hand-reaching-toward-AI-brain, customer-service-with-
  headset, three-colleagues-pointing-at-monitor, leader-pointing-at-followers.
  See `docs/research/stock-audit.md` anti-pattern table for full list.

### Defuse techniques (apply at least one to every stock asset)
- **Duotone** — map the photo to Direction-B `accent-primary` + `ink-1`.
- **Color wash** — `mix-blend-mode: multiply` with brand color overlay.
- **Geometric mask** — `clip-path: polygon(...)` for hexagonal or angled crop.
- **Scanning-line overlay** — repeating CSS `linear-gradient` at 2-3% opacity
  reads as "live screen output", not "stock photo".
- **Blur-to-white gradient mask** — `mask-image: linear-gradient(...)` so the
  photo bleeds into the page background; no hard rectangle.
- **Macro scale-up** — circuit-board / metal-surface / copper-wire-coil
  shots at extreme macro read as abstract texture.

### Libraries (license-clean for commercial DACH use)
- **Coverr** (free, no attribution, B2B-leaning video) — primary for free video.
- **Pexels** (free, no attribution, commercial OK) — primary for free photo.
- **Artgrid** (~$200/yr promo, lifetime license per asset) — **add this
  subscription for any cinematic hero video moment** (factory floor, robotic
  arm). Higher production quality than free libraries.
- **Production Crate** — for HUD/scanning-line overlay companion assets.

Skip Adobe Stock and Unsplash for hero work — over-circulated.

### Stock video delivery pattern (Lighthouse-safe)

```html
<section class="hero">
  <img src="/hero-poster.avif"
       srcset="/hero-poster-720.avif 720w, /hero-poster-1440.avif 1440w"
       sizes="100vw"
       fetchpriority="high"
       alt=""
       class="hero__poster" />
  <video class="hero__video"
         poster="/hero-poster.avif"
         muted playsinline loop
         preload="metadata"
         aria-hidden="true"
         data-src-av1="/hero-1080.av1.mp4"
         data-src-h264="/hero-1080.h264.mp4"
         data-src-mobile="/hero-720.h264.mp4">
  </video>
</section>
```

Rules:
- LCP element is the AVIF poster (~60KB), NOT the video.
- IntersectionObserver lazy-mounts `<source>` children when hero is in view.
- `prefers-reduced-motion: reduce` → never mount the video. Poster stays.
- `navigator.connection.saveData === true` → never mount.
- AV1 primary, H.264 fallback. Skip VP9/WebM unless reason.
- Desktop 1920×1080 @ 2.5-3.5 Mbps AV1. Mobile 1280×720 @ 1.0-1.5 Mbps.
- Clips ≤ 8s, loop seam invisible (first/last frame match).
- CDN: Cloudflare R2 or Bunny.net Stream. Avoid putting >5MB video in
  `/public/` (Vercel egress gets pricey).

Expected Lighthouse mobile: 88-94 with this pattern.

---

## 5. Voice & tone (the "not artificial" requirement)

Source: `docs/research/voice-audit.md`. The target register is **A —
institutional / process-confident** (the DACH register).

### The voice in one paragraph

Write as the operations engineer who happens to be the founder, talking to
other operators. Address them as what they are — a 40-person manufacturer,
an agency, a logistics shop — not as "businesses" or "teams". Default to
short certain claims. Avoid questions in headlines (except the
KI-Beratung hero, which uses one deliberately). Numbers beat adjectives.

### Sentence length

60% short (3–8 words), 30% medium (9–15), 10% long (only for a specific
reason). Never two long sentences in a row.

### Verbs we use

build · ship · wire · connect · automate · run · operate · fit · fix ·
replace · route · hand off · retire · cut · free up · watch · measure

### Verbs we reject

unlock · supercharge · revolutionize · transform · empower · leverage ·
harness · ignite · light up · elevate · accelerate (when not literal) ·
embrace

### Adjectives we reject

cutting-edge · next-gen · game-changing · best-in-class · world-class ·
intelligent (as a standalone modifier) · seamless · robust · scalable (when
not specified) · AI-first · AI-native · AI-powered

### Phrase banlist (verbatim — never ship these)

- "Unlock the power of..."
- "Supercharge your workflow"
- "Built different"
- "AI-native" / "AI-First"
- "The future of work" / "The future of X"
- "Welcome to the era of..."
- "Revolutionize", "Game-changing", "Cutting-edge"
- "Next-generation"
- "Light up your AI..." (Workato)
- "The intelligent workflow [anything]" (Tines AI-stink)
- German Anglicism: "Game-Changer", "boosten", "KI-nativ", "Powern Sie..."

### CTA grammar by locale

| Tone | EN | DE | TR |
|---|---|---|---|
| Primary | Talk to us | Sprechen wir | Görüşelim |
| Secondary | See how it fits | Wie es passt | Nasıl uyduğunu görün |
| Reading | Read the case | Den Fall lesen | Vakayı okuyun |

Reject: "Get started free", "Start your journey", "Jetzt durchstarten",
"Hayalinizdeki sistemi kurun".

### Heading rule (enforced)

**No period at the end of any heading in any locale. Ever.**

### Register by locale

- **German:** formal **Sie** is the default. Never mix Sie/Du within a page.
  Noun-phrase headlines preferred. Avoid Anglicisms.
- **Turkish:** formal **siz** with -iniz endings. CTAs prefer institutional
  ("Görüşelim", "Bizi arayın", "Toplantı planlayın"), not consumer-SaaS
  ("Hemen başlayın").
- **English:** confident-technical. Imperatives are fine. Avoid US
  marketing register.

### The shipping test

Read the line aloud. If a 45-year-old operations manager would say it in a
meeting without smirking, ship it. If it sounds like a deck slide, rewrite.

---

## 6. Tech stack additions

Already in repo: Next.js 14 App Router, Tailwind 3.4, Framer Motion 11,
Embla Carousel, react-hook-form, Zod.

**Add in M1 (foundation milestone):**
- `gsap` + `gsap/ScrollTrigger` — scroll-locked sequences (~30KB gz)
- `lenis` — desktop smooth scroll (~5KB gz)
- Replace existing font setup with Pairing 2 (TWK Lausanne + Plus Jakarta
  Sans + Berkeley Mono/Fira Code). Use `next/font/local` for licensed
  faces, `next/font/google` for Plus Jakarta and Fira Code.
- Rebuild `src/styles/opsolid-tokens.css` with the chosen palette direction.
  Drop the legacy copper/ink/bg-{0..5}/line/neutral tokens. Add new tokens
  matching §1.2. The Verso turquoise stays in a separate scope.

**Do NOT add unless one product subpage genuinely earns it:**
- `@react-three/fiber` + `drei` — only behind dynamic import +
  reduced-motion gate.
- Lottie / Rive — only if a specific case demands character motion.

**Page transitions:** View Transitions API (Next 14 App Router supports it
stably) with Framer Motion `AnimatePresence` as fallback for shared-layout.

**Custom cursor:** desktop only, `pointer: fine` + reduced-motion check, 24px
circle with `mix-blend-mode: difference`, lerp(0.15), magnetic on
`[data-cursor=link]` and primary buttons. Never mounts on touch.

---

## 7. Engineering non-negotiables

- `npm run build` MUST be green before every push to main. Build runs
  TypeScript + ESLint.
- Work directly on `main` branch — no feature branches (per existing memory).
- Every commit followed by `git push origin main` (per existing memory).
- **Lighthouse mobile Performance ≥ 85 · CLS < 0.05 · LCP < 2.5s.**
- **60fps on M1 Air and Pixel 6a class** for every motion component.
- **`prefers-reduced-motion: reduce` fallback is MANDATORY on every motion
  component:** particles unmount, GSAP pin/scrub disabled, lenis disabled,
  cursor disabled, kinetic type renders static, sprite sequences show
  frame 0 only, video never mounts. Crossfades (≤180ms, opacity only) stay.
- **No dark mode in this round.** Honor `prefers-color-scheme` only after
  light-default is shipped.
- **Locale parity DE/EN/TR enforced.** Every key in `src/content/en.ts` must
  exist in `de.ts` and `tr.ts`. TypeScript will fail the build otherwise.
- **Tokens, never raw hex** in components. Always reference Tailwind tokens.
- **GPU props only in scrub tweens:** `transform`, `opacity`, `filter`.
  Never `top`/`left`/`width`/`height`.
- **Mobile pin policy:** `pin: true` is forbidden at viewport widths
  < 768px. Degrade to scrub-only or vertical stack.
- **No CSS-in-JS.** Tailwind only. Inline styles only for JS-driven motion
  values (transforms updated from `mousemove` / scroll).
- OG images regenerated per page using the
  `src/app/c/[slug]/og.png/route.tsx` pattern.

---

## 8. Round 0 — decisions to lock before any code

Open this prompt with the user. Ask the six questions below. Wait. Write the
answers to `docs/research/decisions.md` so they survive a context
compaction.

1. **Palette direction** — A (Engineered Linen, institutional blue), **B
   (Concrete Studio, deep teal — RECOMMENDED)**, or C (Warm Machine, amber)?
2. **Font pairing** — Pairing 1 (Söhne + IBM Plex, licensed) or **Pairing 2
   (TWK Lausanne + Plus Jakarta Sans, recommended)**?
3. **Motion-stack additions** — confirm GSAP + ScrollTrigger + lenis. Defer
   r3f to one specific product page only.
4. **Stock asset budget** — free-only (Coverr + Pexels) or add Artgrid
   annual (~$200) for cinematic hero moments? Cleaner if Artgrid is
   approved.
5. **Page transitions** — View Transitions API as default, Framer Motion
   fallback. Confirm.
6. **Favicon mark** — the in-site logo mark is the canonical source. Confirm
   the file path (current `src/app/icon.svg` and the header logo component).
   I will generate 16 / 32 / 180 / 512 + maskable + apple-touch + manifest
   from it in M1.

Do NOT begin Milestone 1 until all six are answered.

---

## 9. Milestone plan (one PR each, behind `?preview=v2`)

Every page-family PR ships behind a `?preview=v2` query gate so live traffic
stays on v1 until each page passes review. The gate lives in each page
component:

```tsx
const isV2 = searchParams.preview === "v2";
return isV2 ? <PageV2 /> : <PageV1 />;
```

### M1 — Foundation
- Install: `gsap`, `gsap/ScrollTrigger`, `lenis`. Wire fonts (Pairing 2 by
  default). Build new token CSS from chosen palette.
- Add `LenisProvider`, `CustomCursor`, `PageTransition` wrapper.
- Add `?preview=v2` query gate utility (`lib/preview.ts`).
- Generate favicon set (16/32/180/512 + maskable + apple-touch) to
  `public/icons/`. Wire via `app/layout.tsx` metadata.
- Remove `/pricing` from nav. Add 308 redirect `/[locale]/pricing` →
  `/[locale]/contact`.
- **Acceptance:** `npm run build` green. Lighthouse mobile ≥ 85 unchanged or
  better. No visual regression except the new favicon + custom cursor
  (desktop only).

### M2 — Home + Leistungen
These two pages set the visual grammar. Ship together.
- Home: split UI-screenshot + ambient SVG packet-graph + parallax card
  stack.
- Leistungen: horizontal service rail with GSAP pin (desktop), vertical
  stack (mobile).
- Both behind `?preview=v2`.
- **Acceptance:** Lighthouse mobile ≥ 85, CLS < 0.05, LCP < 2.5s on each
  preview URL. 60fps capture on M1 Air + Pixel 6a class.

### M3 — KI-Beratung + Prozessautomatisierung
Most distinctive hero devices (terminal typewriter + scroll-scrubbed sprite
sequence). Highest motion-risk pages — build and tune carefully.
- Both behind `?preview=v2`.
- **Acceptance:** sprite preload working (first 6 frames), reduced-motion
  fallback shows frame 0. Terminal typewriter completes < 5s.

### M4 — Microsoft 365 + Interne Tools
Mockup pair.
- M365: M365 logo lockup + pulse + Power Automate screenshot.
- Interne Tools: before/after split panel.
- Both behind `?preview=v2`.

### M5 — KI-Schulungen + About + Über-mich
Editorial pair (the only serif moments).
- KI-Schulungen: full-bleed Ken-Burns photo + serif headline reverse + sticky
  chapter index.
- About / Über-mich: founder portrait dominant.
- All behind `?preview=v2`.

### M6 — Contact + AI-Automation-Check
- Contact: 80vh empty headline + email + form below.
- AI-Automation-Check: quiz IS the hero.
- Both behind `?preview=v2`.

### M7 — Products index + product subpages
- Products index: 3 mood-coded tiles.
- Each product subpage gets its own composition (no template).
- Verso digital-card subpage KEEPS its turquoise palette and Concept-3
  identity — NOT skinned in OpSolid colors.
- All behind `?preview=v2`.

### M8 — Blog + cleanup
- Blog masonry grid.
- Once all M2–M7 are signed off, **remove the `?preview=v2` gate** and
  promote v2 to default. Single PR.
- Regenerate OG images per page using existing OG infra pattern.

---

## 10. Per-milestone delivery checklist

Before requesting sign-off on any milestone, post:

1. Lighthouse mobile before/after screenshots (v1 vs `?preview=v2`).
2. 10-second screen capture on slow-3G throttling.
3. 10-second capture with `prefers-reduced-motion: reduce` forced.
4. Frame-rate trace (Chrome Performance) of the hero motion. Note the
   hardware tier.
5. One sentence on what's still rough and what's deferred to the next
   milestone.

**If any of the four budgets fails, do NOT request sign-off. Iterate first.**

---

## 11. Coordination (when to spawn a swarm)

Per the project's existing CLAUDE.md SendMessage-first pattern.

- **Solo for M1 (foundation).** Too much glue code, too little parallelism.
- **Maker + Critic + Verifier loop for every page milestone (M2 onward):**
  - **Maker** (subagent_type `frontend-agent`, `name: "maker"`) — builds the
    page composition end-to-end.
  - **Critic** (subagent_type `tech-lead` or `ux-maker`, `name: "critic"`)
    — reviews against this prompt's per-page spec; rejects if the page reads
    templated, if motion is decorative not meaningful, if any banned phrase
    appears in copy, if the page is compositionally a repeat of another
    page.
  - **Verifier** (subagent_type `apptest` or `production-validator`,
    `name: "verifier"`) — Lighthouse, reduced-motion check, theme parity,
    locale parity, build green.
  - Spawn all three in ONE message with `run_in_background: true`, named,
    coordinated via SendMessage. Kick the pipeline with one SendMessage to
    `maker`.
  - **The Critic must not approve easily.** Easy approval is failure (see
    `feedback_agent_team_critic` memory).

---

## 12. Where canon lives

- **This prompt** (the canon): `mayai-website/docs/redesign-prompt.md`.
- **Evidence behind every claim:**
  `mayai-website/docs/research/industry-audit.md`
  `mayai-website/docs/research/motion-audit.md`
  `mayai-website/docs/research/voice-audit.md`
  `mayai-website/docs/research/stock-audit.md`
  `mayai-website/docs/research/award-audit.md`
- **Round 0 decisions** (you create after sign-off):
  `mayai-website/docs/research/decisions.md`.
- **Tokens:** `mayai-website/src/styles/opsolid-tokens.css` (rebuild) and
  `mayai-website/tailwind.config.ts` (rebuild colors + fonts blocks).
- **Locale strings:** `mayai-website/src/content/{en,de,tr}.ts`.
- **OG template pattern:** `mayai-website/src/app/c/[slug]/og.png/route.tsx`.
- **Layout shell:** `mayai-website/src/app/layout.tsx`.
- **Project rules:** `mayai-website/CLAUDE.md`.
- **Persistent memory:**
  `C:\Users\drhas\.claude\projects\C--Users-drhas-Documents-Coding-Project-Website\memory\MEMORY.md`
  — relevant entries: `feedback_build_workflow`, `feedback_branch_workflow`,
  `feedback_post_update_push`, `feedback_design_quality`,
  `project_verso_brand` (Verso keeps its own palette),
  `feedback_agent_team_critic`, `project_opsolid_vps_deploy`.

---

## 13. Your first action

1. Read all five audit files in `docs/research/` end-to-end.
2. Read §0–§7 of this prompt.
3. Ask the user the six sign-off questions in §8. Wait.
4. Write the answers to `docs/research/decisions.md`.
5. Begin Milestone 1.

Do not skip Round 0. Do not start coding without locked answers.
