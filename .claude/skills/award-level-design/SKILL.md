---
name: award-level-design
description: Award-level design bar for Hasan's products (OpSo, Kutasia, opsolid.de, SiteFlow demos, decks, NFC cards, store screenshots, video loops). Use before building, restyling or reviewing any user-facing interface or visual - a website, landing page, app screen, dashboard, deck, social or store image. Gives the concept-first process, the anti-generic checklist, typography/grid/colour/motion craft rules, the performance and accessibility floor, and the review rubric. Use it instead of a default "clean SaaS" look.
---

# Award-level design

The owner wants work that could win an Awwwards Site of the Day or an FWA, not work that looks AI-made. Clean is the floor, not the goal. Every page needs an idea.

## 1. Process (do not skip steps)
1. **Concept first.** One sentence that only fits this product, plus one signature element (an object, a material, a light, a motion, a typographic gesture). Example shape: "OpSo: a black card catching copper light; every section turns the card a little further."
2. **References, not copies.** 6–10 references (Awwwards SOTD/Developer, FWA, CSS Design Awards, Godly, Apple Design Awards for apps, editorial print). Write the principle you take from each. Never reproduce a layout, illustration or copy.
3. **System before pages.** Tokens for type scale, grid, spacing rhythm, colour, radius, shadow/light, motion durations and easings. Put them in code as CSS variables or a theme file.
4. **One slice, then review.** Build the hero plus one section (or one app screen) at full quality, screenshot at 390 and 1440 px, get a `design-director` review, fix, then extend.
5. **QA gates** (section 6) before anything goes to the owner.

Technique skills (user level, pinned, vetted): `frontend-design` for aesthetic direction, `ui-ux-pro-max` for palette, type-pairing and UX-rule search, `gsap-core` / `gsap-scrolltrigger` / `gsap-timeline` / `gsap-react` / `gsap-performance` for motion. They help you build; this skill sets the bar and wins any conflict.

## 2. Generic-AI tells (any one of these needs a reason or it goes)
- Centered hero with a gradient blob and a headline like "Unlock / Elevate / Revolutionize your X with AI".
- Three icon cards in a row as the second section; uniform `rounded-2xl shadow-lg` cards everywhere.
- Purple/indigo-to-blue gradients, neon-on-black for no reason, glassmorphism with nothing behind the glass.
- One sans family (Inter/system) at three sizes; no typographic contrast; centred everything.
- Tilted floating dashboard mock-ups; stock photos of smiling teams; emoji or icon-library soup.
- "Trusted by" logo walls, testimonial carousels or counters that are not real.
- Every block fades up 20 px on scroll with the same timing; parallax for its own sake.
- Even spacing everywhere, no rhythm, no tension, no hierarchy.
- Filler copy: "seamless", "next-generation", "powerful", "all-in-one", "built for the future".

## 3. Craft rules
**Typography**
- Two families at most: a characterful display face (e.g. a variable serif or grotesk with optical sizes) and a quiet text face. Use real weights and optical sizes, not faux bold.
- Display sizes large and tight: line-height 0.9–1.05, tracking −1 to −3 %; body 16–18 px, line-height 1.5–1.65, measure 60–75 characters.
- A modular scale (e.g. 1.25 or 1.333) with deliberate jumps; hierarchy by size and weight, not by colour alone.
- Load only the weights and subsets a page uses (`font-display: swap`, preload only the hero face). Fonts must stay under about 150 KiB per page.

**Layout and grid**
- A real grid (12 columns desktop, 4–6 mobile) and break it on purpose: asymmetry, overlap, full-bleed moments, generous negative space.
- Spacing rhythm from a base unit (4 or 8 px) with a few large steps for drama; sections differ in density.
- Mobile is designed, not collapsed: own composition at 360–430 px, thumb-reachable actions.

**Colour and light**
- A restrained base (neutrals with temperature) plus one signature accent tied to the brand (OpSolid: light and copper; OpSo: black and copper). Accent is rare, so it means something.
- Contrast AA at least (4.5:1 text, 3:1 large text and UI). Dark mode only if it is designed too.

**Imagery**
- Own images: product renders, 3D, real photography, art-directed AI images in one consistent style. Never stock that pretends to be the product or the team.
- Sharp assets (2x, up to 1920 px wide for heroes), modern formats (AVIF/WebP), explicit sizes to avoid layout shift.

**Motion**
- Motion explains: reveal structure, connect states, guide the eye. One scroll engine per site.
- Tokens: micro 120–200 ms, UI 200–350 ms, scene 400–800 ms; easings like `cubic-bezier(0.22, 1, 0.36, 1)` out and `cubic-bezier(0.65, 0, 0.35, 1)` in-out; stagger 30–60 ms.
- Scroll stories get holds (the user can stop and read), stay short (about 60 vh per chapter), and never trap the keyboard.
- `prefers-reduced-motion`: content complete and static, no essential information in motion.
- Micro-interactions on every interactive element: hover, focus, press, loading, success, error.

**Copy**
- Specific, short, concrete nouns and verbs; the product's real facts only. Headlines without a final period. OpSolid copy uses hyphens, not em dashes.

## 4. Product notes
- **OpSo:** black + copper card, light as the motif; card pages must load fast on fair Wi-Fi; QR always with a raw link.
- **Kutasia:** calm, trustworthy inbox for small businesses; dense but readable from 360 px; status colours accessible; no generic admin-template look.
- **opsolid.de:** "Klarheit" direction (v7, PR #54); light, copper, one hero object; consulting first.
- **SiteFlow demos:** each salon's own colours and real facts; the demo is OpSolid's first impression.

## 5. Floors (failing one = REWORK, however good it looks)
- WCAG 2.2 AA: contrast, visible focus, full keyboard path, labels match visible text, heading order.
- Core Web Vitals on a mid phone, 4G: LCP < 2.5 s, CLS < 0.1, INP < 200 ms. JS and font budgets checked.
- Works at 360, 390, 768, 1280, 1440 px; no horizontal scroll; tap targets ≥ 44 px.
- Honest content: no invented customers, logos, reviews or numbers. Sample names German or English.

## 6. QA gates before showing the owner
1. Screenshots at 390 and 1440 px (plus 360 for dense UIs), with reduced motion on once.
2. Lighthouse or a performance trace on a production build, and an axe check (tools in `~/.claude/products/SKILL-LEDGER.md`).
3. `design-director` verdict PASS.
4. Send the screenshots to the owner right away.

## 7. Review rubric (1–10 each)
Concept and originality · Art direction and imagery · Typography · Layout and rhythm · Motion and interaction · Craft and detail · Content honesty and clarity · Accessibility · Performance.
PASS = average ≥ 8 and nothing below 7. Name the single change that would raise the score most.
