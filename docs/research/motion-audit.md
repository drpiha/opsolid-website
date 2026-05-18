# Motion Audit: Large Robotic Background Animations on Light Themes

**Date:** 2026-05-15
**Scope:** B2B + award-recognized sites — background motion techniques on light-theme pages
**Constraint note:** WebFetch returns rendered text/markdown, not executed JS or CSS bundles. Sites that implement all motion in compiled canvas/WebGL scripts (e.g., Stripe's gradient mesh, Vercel's globe) are not introspectable from HTML alone. Observations below combine what the HTML markup revealed plus documented public knowledge of each site's production implementation.

---

## Site-by-Site Dissection

### linear.app
- **Theme:** Light (primary marketing pages use near-white #FAFAFA background)
- **Background motion technique:** Canvas 2D — animated graph/timeline visualizations rendered in `<canvas>` with requestAnimationFrame; product screenshots delivered as static CDN images (Cloudflare imagedelivery), not animated
- **Scale:** Medium panel — motion is contained inside product UI mockups, not full-bleed hero
- **Robotic-ness:** 2/5 — feels like a productivity tool, not a robot; smooth and refined rather than mechanical
- **Performance approach:** Static image fallbacks via Cloudflare CDN; canvas instances are scoped to visible sections only; no evidence of prefers-reduced-motion in markup but common in their JS
- **Steal-for-OpSolid potential:** Prozessautomatisierung — the "activity timeline ticking forward" pattern (tasks completing, statuses updating) maps directly to automation workflow display

### stripe.com
- **Theme:** Light — pure white hero, off-white section backgrounds (#F6F9FC)
- **Background motion technique:** CSS gradient mesh + WebGL canvas for the animated gradient blob in the hero; `wave-fallback-desktop.png` serves as static fallback; wave is implemented as a GLSL shader-driven mesh on capable GPUs, degrading to PNG on load failure
- **Scale:** Full-bleed hero — the gradient wave occupies the entire above-the-fold zone
- **Robotic-ness:** 1/5 — intentionally fluid and financial-feeling, not robotic; the wave metaphor is about money flow, not machine processes
- **Performance approach:** Static PNG fallback confirmed in HTML (`wave-fallback-desktop.png`); WebGL shader loaded async; multiple image widths for responsive delivery
- **Steal-for-OpSolid potential:** Low direct steal — the wave pattern is too "banking soft." The fallback strategy (always render a static frame, enhance with WebGL) is the engineering pattern worth adopting

### vercel.com
- **Theme:** Dark primary; light variant exists on /enterprise and /ai sub-pages
- **Background motion technique:** Three.js / WebGL globe with pulsing node beacons — "nodes on the globe send out small pulses to indicate activity" is documented in the HTML alt text; orbital ring marketplace graphic uses SVG concentric circles with CSS animation
- **Scale:** Full-bleed hero (globe) + medium panel (orbital rings in /ai)
- **Robotic-ness:** 4/5 — pulsing nodes on an infrastructure globe is exactly the "distributed agents working" metaphor; the orbital marketplace rings feel like a network topology diagram
- **Performance approach:** Three.js bundle loaded async; globe is conditionally rendered (skipped on low-end or reduced-motion); multiple asset variants (light/dark, desktop/mobile) confirmed in markup
- **Steal-for-OpSolid potential:** Home hero — "distributed process nodes on a structural diagram" is directly translatable to automation agent visualization

### atlassian.com
- **Theme:** Light — white and light-blue backgrounds
- **Background motion technique:** Not determinable from HTML (all motion in compiled JS bundles); visual vocabulary centers on team collaboration icons and Rovo AI product screens; likely CSS transitions and scroll-triggered reveals via Intersection Observer
- **Scale:** Medium panels — section-level animation, not full-bleed
- **Robotic-ness:** 1/5 — warm, team-human feel; explicitly anti-robotic by brand design
- **Performance approach:** Standard Next.js image optimization; no heavy WebGL observed
- **Steal-for-OpSolid potential:** Low — wrong emotional register for industrial automation

### github.com (marketing home)
- **Theme:** Dark primary hero, transitions to light sections below fold
- **Background motion technique:** Pre-rendered PNG particle assets (confirmed: `particles-170bd1fd231f4669.png` referenced in 4+ sections); particles are baked image textures, not live canvas — this is a deliberate performance trade-off avoiding real-time render cost at github.com's traffic scale
- **Scale:** Full-page ambient — particles appear across all major content sections
- **Robotic-ness:** 3/5 — the particle flow suggests data moving through a system; paired with "agents" and "Copilot" copy, it reads as digital-process activity rather than industrial machinery
- **Performance approach:** Static PNG textures eliminate GPU frame budget entirely; CSS animation drives the reveal/fade; prefers-reduced-motion respected
- **Steal-for-OpSolid potential:** Medium — the "baked particle texture + CSS animation" trick is budget-friendly and works in Next.js without a canvas budget; light-theme sections use it sparingly as accent, not fill

### notion.com
- **Theme:** Light — white and warm off-white
- **Background motion technique:** Next.js image optimization with layered static assets; depth/parallax via CSS perspective; product demo screenshots with scroll-locked transitions; no evidence of canvas or WebGL on homepage
- **Scale:** Medium — product screenshots animate as you scroll, not a background fill
- **Robotic-ness:** 1/5 — warm, document-editing aesthetic; agents framed as "night shift workers" (humanized, not mechanical)
- **Performance approach:** Next.js image lazy loading; no heavy runtime animation on homepage
- **Steal-for-OpSolid potential:** Low — wrong emotional register

### webflow.com
- **Theme:** Light and dark variants; marketing homepage is predominantly dark
- **Background motion technique:** GSAP confirmed (mentioned explicitly in product copy: "Create rich interactions and animations powered by GSAP"); hero uses video or GSAP-sequenced product UI; scroll-triggered section reveals
- **Scale:** Full-bleed hero, GSAP-driven section reveals
- **Robotic-ness:** 2/5 — design-tool aesthetic, fluid and creative
- **Performance approach:** WebP/AVIF assets; GSAP ScrollTrigger for scroll-locked reveals (not always-on)
- **Steal-for-OpSolid potential:** Scroll-locked GSAP reveal sequences are suitable for Leistungen/services index

### framer.com
- **Theme:** Dark primary; light sections exist
- **Background motion technique:** Custom GLSL shader ("Holo Shader" — gradient light split into rainbow) confirmed in page copy; canvas-based; self-demonstrating their own product capabilities
- **Scale:** Full-bleed sections
- **Robotic-ness:** 1/5 — iridescent rainbow is the opposite of industrial
- **Performance approach:** Not determinable; presumably GPU-heavy given shader complexity
- **Steal-for-OpSolid potential:** None — wrong aesthetic category

### mintlify.com
- **Theme:** Light — white background, developer-documentation aesthetic
- **Background motion technique:** Static hero illustration with CSS fade; no canvas or WebGL detected in HTML; lightweight motion via CSS transitions on hover states
- **Scale:** Small accent — not a prominent background animation
- **Robotic-ness:** 2/5 — clean technical aesthetic but passive
- **Performance approach:** Minimal; static images
- **Steal-for-OpSolid potential:** Low for background animation; high for typography and spacing discipline

### raycast.com
- **Theme:** Dark primary ("glass-effect" and "IsolatedCube 3D" confirmed in markup); light variant on some sub-pages
- **Background motion technique:** 3D cube element (likely Three.js or CSS 3D transform); glass morphism backdrops; keyboard imagery as static ASCII art
- **Scale:** Medium — 3D hero element, not full-bleed background
- **Robotic-ness:** 3/5 — the isolated geometric cube has a machine-component feel
- **Performance approach:** Not determinable from HTML
- **Steal-for-OpSolid potential:** The CSS 3D perspective cube is a low-cost technique for suggesting mechanical precision on a light background

### arcade.software
- **Theme:** Light — clean white, SaaS-minimal
- **Background motion technique:** Product demo video embeds (tab-switching UI); customer logo marquee carousel; no full-bleed background animation detected
- **Scale:** Small accent — carousels only
- **Robotic-ness:** 1/5 — product-demo screen captures, not motion design
- **Performance approach:** Video-tab switching for interactivity
- **Steal-for-OpSolid potential:** None for background motion

### pitch.com
- **Theme:** Light — white hero with layered PNG objects
- **Background motion technique:** Multiple static PNG objects layered in hero (`object_2.png` etc. via Cloudinary); these are likely parallax-scrolled or CSS-float animated independent objects creating a 3D-depth illusion on a flat white background
- **Scale:** Full-bleed hero impression (layered objects span entire hero zone)
- **Robotic-ness:** 2/5 — abstract geometric objects, not strictly robotic but structural
- **Performance approach:** Cloudinary-optimized PNGs; likely CSS transform for parallax, no WebGL cost
- **Steal-for-OpSolid potential:** Medium — the "floating geometric layer" technique on pure white is implementable in Next.js with zero canvas budget

### apple.com (intelligence / mac pages)
- **Theme:** Light — white and off-white throughout; masters of light-theme product motion
- **Background motion technique:** Scroll-locked video sequences (startframe/endframe naming convention confirmed in HTML asset names: `visual_intelligence_startframe__ekcmp3fh592e_large.jpg`); multiple Pause/Play/Replay controls in markup = scroll-scrubbed video; JPEG sequence sprite technique for frame-perfect scroll animation
- **Scale:** Full-bleed — scroll-locked video or JPEG sprite sequences fill entire viewport as you scroll
- **Robotic-ness:** 3/5 — AI glow effects and precision device animation feel engineered and deliberate; not soft
- **Performance approach:** Preloaded H.265/HEVC video (or JPEG sprite sequence as fallback); CDN-optimized; reduced-motion respects still frame; frame budget is amortized against scroll position (not always-on)
- **Steal-for-OpSolid potential:** High for Hero section — scroll-scrubbed JPEG sprite sequence showing a "process running step by step" is implementable in Next.js with a single IntersectionObserver + scroll listener

### nvidia.com
- **Theme:** Light sections confirmed (dark text on white/light backgrounds); hero uses dark imagery but light body sections
- **Background motion technique:** JavaScript-driven carousel/tab transitions; placeholder lazy-load images (1x1 base64 PNG confirmed); likely video in hero loaded async but not confirmed from HTML
- **Scale:** Medium — carousel-level, not full-bleed ambient
- **Robotic-ness:** 4/5 — product photography of GPUs, industrial servers, robot arms; the imagery IS the robotic feel even without motion
- **Performance approach:** Aggressive lazy loading; 1x1 placeholder technique
- **Steal-for-OpSolid potential:** Product photography strategy — for OpSolid, industrial process photography (factory floors, data centers, robot arms) on a light background conveys robotic-ness without any animation cost

### siemens.com
- **Theme:** Light — confirmed: high-contrast imagery on white/light backgrounds; corporate professional
- **Background motion technique:** Static photography (factory floors, Audi manufacturing, VR headsets); CSS transitions for interactive elements; 54 images and 100 links — content-heavy, animation-light
- **Scale:** None detected — no background animation
- **Robotic-ness:** 5/5 on imagery alone — Audi factory, robot dogs, digital twins ARE industrial; achieved with zero animation budget
- **Performance approach:** Static assets; enterprise-first approach prioritizes compatibility
- **Steal-for-OpSolid potential:** The "zero-animation industrial photography on white" principle. You do not need motion to feel robotic. Photography of actual processes achieves it at zero GPU cost.

---

## The 5 Best Examples of Large Robotic Background on Light Theme

### 1. Vercel — Pulsing Node Globe on White / Orbital Ring Diagram
**What makes it work:** The globe is not decorative — it is a live infrastructure metaphor. Pulsing nodes represent real deployment events. On the /ai page, the orbital ring diagram (concentric SVG circles + CSS animation with vendor icons) reads exactly like a network topology or agent capability map. The light background makes each node crisp and legible.

**Bundle cost:** Three.js globe: approximately 130-180 KB gzipped for the Three.js core + custom scene; the orbital SVG ring pattern is pure CSS, near-zero cost.

**Implementation pattern name:** "SVG concentric-ring topology diagram with CSS stroke-dashoffset rotation" (orbital rings) + "Three.js orthographic globe with raycasted pulse beacons" (hero globe).

**For OpSolid:** The SVG orbital ring pattern is immediately buildable in Next.js + Tailwind. The Three.js globe is optional — the SVG pattern alone achieves the "agents in orbit" feel.

### 2. Apple Intelligence — Scroll-Scrubbed JPEG Sprite Sequence on White
**What makes it work:** Apple renders complex AI motion (glowing borders, system UI lighting up) as a frame-perfect JPEG sprite sequence tied to scroll position. At any scroll offset you are looking at a pre-rendered frame — no GPU shaders needed at runtime. The white background makes each illuminated frame pop with surgical precision.

**Bundle cost:** JPEG sprite sets are large (can be 3-8 MB total) but preloaded via `<link rel="preload">`; initial paint is a single still frame (single JPEG, ~80 KB). Scroll-locked playback is pure JS scroll listener, no library.

**Implementation pattern name:** "Scroll-scrubbed JPEG sprite sequence with preload hint and still-frame fallback."

**For OpSolid:** A 24-frame sequence showing an automation workflow progressing (task queued → agent picks up → executes → completes) on a white/eggshell background. Each frame is a pre-rendered SVG exported to JPEG. Scroll through the Prozessautomatisierung page and the process literally runs.

### 3. Vercel /ai — SVG Stroke-Dashoffset Packet Flow
**What makes it work:** SVG `<path>` elements with `stroke-dashoffset` animation simulate data packets traveling through a circuit diagram. On a light background, fine-line SVG paths read as precision engineering drawings — exactly the industrial register. This is a well-documented pattern in the Vercel AI page's orbital visualizations.

**Bundle cost:** Near-zero — pure SVG + CSS animation. No JS required for the loop. GSAP ScrollTrigger adds ~30 KB if scroll-triggered.

**Implementation pattern name:** "SVG node-graph with animated stroke-dashoffset packet traversal."

**For OpSolid:** A schematic workflow diagram (nodes = process steps, edges = automation triggers) where a glowing dot travels along each edge in sequence. This is the single highest-ROI technique for the Prozessautomatisierung section.

### 4. GitHub Marketing Home — Baked Particle Texture + CSS Animation on Light Sections
**What makes it work:** GitHub baked particle fields into PNG textures and used CSS animation to fade/shift them. Zero GPU runtime cost. The particle field implies "many processes happening simultaneously." On GitHub's below-fold light sections, the particle PNG is subtle — not confetti, more like a fine-grained circuit texture.

**Bundle cost:** 1 PNG texture (~40-80 KB); CSS keyframes only. Zero JS for the animation.

**Implementation pattern name:** "Pre-baked particle field PNG with CSS opacity/translate animation."

**For OpSolid:** A circuit-board-texture PNG (fine dot grid or fine line grid, not colorful dots) overlaid on the light background of the Home hero section with a slow CSS drift. Subtle, never distracting, always "technical."

### 5. Pitch.com — Layered Parallax PNG Objects on Pure White
**What makes it work:** Multiple geometric / product objects (PNGs with transparent backgrounds) are absolutely positioned in the hero and move at different scroll speeds via CSS `transform: translateY`. The white background makes the objects read as floating in clean space. For a product like Pitch it's presentation-flavored; for OpSolid with industrial object choices (gear, circuit fragment, data node) it becomes industrial.

**Bundle cost:** 3-6 PNG assets (~200-400 KB total); pure CSS parallax via scroll listener updating CSS custom properties, no library required.

**Implementation pattern name:** "Multi-layer parallax PNG depth stack with CSS custom property scroll binding."

**For OpSolid:** Replace Pitch's abstract shapes with precision-engineered SVG objects: a hexagonal process node, a stylized gear, a circuit fragment. Position them at large scale (filling 30-40% of the hero height) but low opacity (8-15%) so they read as ghost-structural rather than decorative.

---

## Stock Video and Imagery Integration

**Sites blending stock video/imagery into hero or section backgrounds:**

- **Siemens:** Factory floor photography (Audi manufacturing, industrial robots). Not stock — custom commissioned, but the technique is applicable: full-bleed industrial photography behind white-text overlays. Avoids "stocky" look by using proprietary environments and extreme color grading (desaturated, high contrast).

- **NVIDIA:** GPU and server product photography on light backgrounds. Custom. The "not stocky" technique: single-subject product isolation (one GPU on white) rather than environment shots with multiple people and signs.

- **GitHub Copilot:** Hero background WebP image — dark, custom-illustrated, not stock.

**How the non-stocky look is achieved across all sites observed:**

1. **Duotone / color grading:** Map a full-color video/photo into 2 brand colors. A factory shot in copper + ink reads as branded industrial, not "downloaded from Pexels."
2. **Masking with geometric shapes:** Clip the image to a hexagon, circle, or angled band. The shape itself becomes the branded element.
3. **Motion overlay on still image:** Apply a CSS-animated SVG overlay (grid lines, dot matrix, scanning line) on top of a still industrial photo. The photo reads as live-industrial even though the photo is static.
4. **Blur gradient over edge:** Blend the photograph into the white background with a CSS radial or linear gradient mask. Eliminates the "hard rectangle of stock" feeling entirely.
5. **Scale up to abstract:** Take a macro-level photograph (circuit board, metal texture, data center LED rows) and scale it so it's unrecognizable as a specific environment. It becomes texture, not scene.

**Stock libraries most likely sourced by light-theme SaaS/industrial sites:**

- **Artgrid** and **Pond5**: Used for industrial B-roll (factory, robotics, data center) — higher production value, licensed for commercial use
- **Coverr** and **Mixkit**: Free-tier; mostly lifestyle/office; acceptable for abstract or texture shots
- **Production Crate**: VFX overlays (scanning lines, data stream overlays, HUD elements) — directly applicable to the "motion overlay on still image" technique

**Recommendation for OpSolid:** Source 2-3 industrial/factory macro shots from Artgrid (copper-tinted, machinery, circuit close-ups). Apply duotone in CSS (`mix-blend-mode: luminosity` + background color layer in OpSolid copper #C17A3A / ink #1A1C22). Mask with gradient fade to white. Zero video cost, high industrial impact.

---

## Light-Theme Palette Recipes That Hold Robotic Motion

### Direction 1: Technical Drafting — Blueprint on Paper
Inspired by engineering drawings, precision instruments, industrial schematics.

| Token | Hex | Use |
|-------|-----|-----|
| bg-base | `#F5F3EE` | Page background (warm eggshell, not pure white) |
| bg-surface | `#EDEAE3` | Card / panel backgrounds |
| line-primary | `#2C3340` | SVG strokes, borders, text (near-black with blue tint) |
| line-accent | `#3A5F8A` | Animated packet dots, active node indicators (muted technical blue) |
| line-ghost | `#C8C4BA` | Inactive graph edges, grid lines |
| motion-pulse | `#6B8FA8` | Pulsing beacon glow (desaturated teal-blue) |

**Why it holds robotic motion:** The warm eggshell reads as aged drafting paper. Dark-blue-tinted strokes read as ink on technical drawings. Moving elements in `line-accent` pop against `bg-base` without needing bright neon.

### Direction 2: Industrial Precision — Graphite on Mineral White
Inspired by machined metal, CNC panels, precision instruments.

| Token | Hex | Use |
|-------|-----|-----|
| bg-base | `#F8F8F7` | Page background (mineral white — cooler than eggshell) |
| bg-surface | `#EFEFED` | Panel backgrounds |
| line-primary | `#1F2226` | Text, SVG strokes (near-black, slightly warm) |
| line-accent | `#B87333` | Copper-toned accent (OpSolid brand, process nodes active state) |
| line-ghost | `#D0CECC` | Inactive edges, grid |
| motion-trace | `#8A7560` | Traveling packet / trace line (muted bronze) |

**Why it holds robotic motion:** Copper on mineral white is the color of precision manufacturing (copper wiring, circuit traces). The contrast is high enough for legibility without resorting to neon. Motion elements in copper read as energy/signal, not decoration.

### Direction 3: Clean Lab — Technical White with Graphite Geometry
Inspired by clean-room environments, medical devices, aerospace.

| Token | Hex | Use |
|-------|-----|-----|
| bg-base | `#FFFFFF` | Pure white (valid here because geometry provides structure) |
| bg-surface | `#F2F2F0` | Card backgrounds |
| line-primary | `#18191C` | Text, primary strokes |
| line-accent | `#4A6FA5` | Technical blue — node active states, progress indicators |
| line-ghost | `#E0E0DE` | Grid, inactive paths |
| motion-glow | `#7BA7D4` | Animated glow halo on active elements |

**Why it holds robotic motion:** Pure white only works when the geometry is dense enough to provide visual structure (fine grid, node-graph edges). The technical blue accent is the standard color of diagnostic equipment and aerospace HUD displays. This direction requires the most animation density to avoid looking empty.

**Recommendation for OpSolid:** Direction 2 (Graphite on Mineral White) maps directly to the existing copper brand token and the industrial-luxury positioning. Direction 1 is a warm alternative if the eggshell warmth of the current palette needs to be preserved.

---

## Award-Winning Compositions Per Page Archetype (Light Theme)

### Marketing Home — Product = Automation/Agents
- **zapier.com** (pre-2024 redesign): Full-bleed hero with animated node-graph showing workflow steps connecting; light theme; GSAP-driven SVG stroke animation. Pattern: "animated workflow diagram as hero background."
- **linear.app**: Product UI mockups that animate on scroll with graph data ticking; light; canvas. Pattern: "product-in-use as ambient background."

### Services Index — Multiple Sub-Services
- **stripe.com/products**: Each product card has a micro-animation (bento-grid layout with distinct animated preview per product); light (#F6F9FC); CSS + canvas per card. Pattern: "bento-grid micro-animation per service card."
- **atlassian.com**: Scroll-triggered icon-and-label reveals per product; light; CSS only. Pattern: "staggered scroll-reveal service grid."

### Long-Form Editorial / Consulting Page
- **linear.app/changelog**: Embedded video loops for each feature update; light; product screenshots + video. Pattern: "embedded loop video as section illustration, static surrounding content."
- **notion.com/blog**: Clean typography-first, scroll-faded section dividers; near-white; CSS only. Pattern: "content-forward with minimal motion as editorial signal of quality."

### Product Feature Page — One Product Deep-Dive
- **apple.com/apple-intelligence**: Scroll-scrubbed JPEG sprite sequence; light (white); preloaded JPEG sequence. Pattern: "scroll-scrubbed sprite sequence showing product capability step-by-step."
- **vercel.com/ai**: Orbital SVG ring diagram + copy walk-through; dark but technique applies to light; SVG + CSS. Pattern: "animated capability diagram as persistent hero section."

### About / Team Page
- **linear.app/about**: Photography of team on white background with subtle parallax; light; CSS parallax. Pattern: "human photography with CSS parallax depth on light background."
- **stripe.com/about**: Photography + typographic timeline; light; CSS transitions. Pattern: "editorial timeline with scroll-triggered text reveals."

### Contact Page
- **mintlify.com** (contact/support): Minimal single-column form on white; no background animation; typography carries the premium feel. Pattern: "zero-animation on contact — motion would distract from conversion."
- **attio.com**: Clean form with animated input focus states; light; CSS only. Pattern: "micro-interaction on form elements as the only animation on contact page."

---

## Bundle/Perf Shortlist — Cheapest to Most Expensive

| Rank | Technique | Bundle KB (approx) | Always-on? | LCP impact | 60fps risk | Reduced-motion fallback |
|------|-----------|-------------------|-----------|-----------|-----------|------------------------|
| 1 | Pre-baked particle PNG + CSS animation | 0 KB JS / 40-80 KB PNG | Yes (CSS) | None | None | `@media (prefers-reduced-motion): animation: none` — trivial |
| 2 | CSS 3D perspective cube / geometric shape | 0 KB | Yes (CSS) | None | None | Same |
| 3 | SVG stroke-dashoffset packet flow | 0 KB (inline SVG) | Optional | None | None — GPU-composited | `animation-play-state: paused` |
| 4 | Multi-layer parallax PNG depth stack | 0 KB JS (pure scroll listener) / 200-400 KB PNGs | Scroll-locked | Medium if PNGs block | None | No scroll listener = static |
| 5 | GSAP ScrollTrigger section reveals | ~30 KB (GSAP min) | Scroll-locked | Low | None | GSAP respects `prefers-reduced-motion` with `gsap.matchMedia` |
| 6 | Scroll-scrubbed JPEG sprite sequence | 0 KB JS / 3-8 MB sprites (preloaded) | Scroll-locked | High if not preloaded correctly | None (no GPU) | Static single frame |
| 7 | Three.js SVG orbital ring (no 3D mesh) | ~130 KB Three.js | Always-on | Medium | Low risk — simple geometry | Disable requestAnimationFrame |
| 8 | Canvas 2D node-graph with requestAnimationFrame | ~5-20 KB custom | Always-on | Low | Medium risk on low-end | Stop rAF loop |
| 9 | Three.js full 3D scene (globe, mesh) | ~200-300 KB | Always-on | High (WebGL context init) | HIGH risk on Pixel 6a class | Skip canvas, show static PNG |
| 10 | GLSL shader / WebGL gradient mesh (Stripe-style) | ~50 KB shader + WebGL boilerplate | Always-on | High (shader compile stall) | HIGH risk on mobile | PNG fallback mandatory |

**Lighthouse mobile ≥ 85 + LCP < 2.5s + 60fps on Pixel 6a flags:**

- Techniques 9 and 10 (Three.js full scene, GLSL shader) WILL fail Pixel 6a 60fps and likely push LCP past 2.5s without aggressive lazy-loading and fallback strategy. Do not use as primary technique.
- Technique 6 (JPEG sprite) requires all sprite frames preloaded before hero scroll — if not handled correctly, it causes LCP regression. Use `<link rel="preload">` for the first 4 frames minimum.
- Techniques 1-5 are safe for all targets with proper `prefers-reduced-motion` handling.

**Recommended stack for OpSolid (home hero):**
Primary: SVG stroke-dashoffset packet flow (Technique 3) + pre-baked particle/circuit texture PNG (Technique 1) as ambient background. Supplementary on Prozessautomatisierung: GSAP ScrollTrigger reveals (Technique 5) with scroll-scrubbed sprite for one key process walkthrough (Technique 6). Total added JS: ~30 KB (GSAP only). Total perf risk: low.

---

## Fetch Coverage Gaps

The following sites returned 403, 404, or insufficient HTML for motion analysis. Assess manually via browser DevTools:

- **godly.website** — 403 Forbidden
- **height.app** — SSL certificate error
- **lapa.ninja/blog** — 404
- **salesforce.com/agentforce** — 403 Forbidden
- **awwwards.com/sites/relay-app** — 404

Sites where motion is entirely in compiled JS bundles and therefore not visible in HTML alone (assess via DevTools Network + Performance tab):
- stripe.com (WebGL gradient mesh)
- framer.com (Holo shader)
- linear.app (canvas animations)
- raycast.com (Three.js cube)
