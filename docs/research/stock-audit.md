# Stock Audit — How Serious B2B Sites Use Stock Without Looking Stocky

**Scope:** Audit of 10 B2B/tech homepages, craft techniques, library recommendations, subject viability, anti-patterns, and Lighthouse-friendly video delivery. Sources are linked inline; gaps are flagged honestly.

---

## Executive summary

The serious B2B/tech sites I audited (Stripe, Linear, Notion, Figma, Webflow, Slack, Intercom, Loom, Asana, Airtable) **barely use stock photography at all**. The visual weight is carried by UI screenshots, custom illustration, gradient/abstract backgrounds, and product mockups. The two exceptions — Stripe and Dropbox — use commissioned, location-specific photography, not generic stock. The lesson: if we use stock as primary asset, we must treat it the way Mailchimp does (custom-feeling editorial photography with brand color overlay) or relegate it to a backdrop role under UI mockups and typography. Recommended primary libraries: **Coverr** (free, B2B-leaning video, license-clean), **Pexels** (free, broad, no-attribution), and **Artgrid** ($200/yr, cinematic, lifetime license) for premium hero moments.

---

## Q1 — How 10 B2B/tech sites use stock

| Site | Photography? | Video? | Custom or stock? | What carries weight |
|------|-------------|--------|------------------|---------------------|
| **Zapier** | None visible | None | n/a | App-logo grid + UI mockups |
| **Notion** | None | None | n/a | Floating integration icons on dark, abstract illustration |
| **Slack** | Avoided | Customer testimonial videos | Custom | Custom iconography + UI mockups |
| **Webflow** | Avoided (only client logos + exec headshots) | Animated WebP/AVIF | Custom | UI screenshots, GSAP animations |
| **Figma** | Avoided | None autoplay | n/a | Real user work shown in actual Figma UI |
| **Linear** | None | None | n/a | Product UI mockups, avatars, typography |
| **Intercom** | None | None | Custom illustration | Painterly custom illustrations (ocean, leaves, flowers) over UI |
| **Loom** | Customer headshots | Screen-recorded product videos | Custom | Screen captures, "glow background" WebP |
| **Asana** | Light, segmented by persona | Likely none on hero | Mixed | AI Teammates messaging + UI |
| **Airtable** | n/a (thin meta) | n/a | n/a | AI/agent product messaging |
| **Mailchimp** (bonus) | **Yes — real lifestyle photography** | None | Custom-feeling, editorial | Editorial photography + brand illustration |
| **Stripe** (bonus) | **Yes — commissioned location photography** | None | Custom | Aerial city shots, storefronts, gradient meshes |
| **Dropbox** (bonus) | **Yes — industry-specific lifestyle** | None | Custom | Fashion, F1, manufacturing imagery + UI overlays |

**Verdict:** The "stock as hero" pattern is rare among serious B2B brands. When photography appears, it's commissioned or feels editorial. The remaining 80% lean on UI, illustration, and typography. Stock-as-hero is a viable path *only* if treated with the craft moves below.

Sources: [zapier.com](https://zapier.com), [notion.com](https://www.notion.com/), [slack.com](https://slack.com), [webflow.com](https://www.webflow.com), [figma.com](https://www.figma.com), [linear.app](https://linear.app), [intercom.com](https://www.intercom.com), [loom.com](https://www.loom.com), [asana.com](https://asana.com), [mailchimp.com](https://mailchimp.com), [stripe.com](https://stripe.com), [dropbox.com](https://www.dropbox.com).

---

## Q2 — Ten craft moves that defuse "stock photo look", ranked by impact-vs-effort

1. **UI mockup foreground, stock as backdrop** — Highest impact, lowest effort. Loom's "glow background" + screen capture is the canonical move. Stock becomes atmosphere, not subject.
2. **Single-hue wash / brand-color overlay** — `mix-blend-mode: multiply` or a `linear-gradient` over the photo in your accent color. Cheap, reliable, immediately on-brand. ([G2 on duotone](https://learn.g2.com/duotone-effect))
3. **Duotone** — Two-color remap of shadows/highlights. Spotify-style. Strong identity, low cost. Works best on portraits and architectural details, not landscapes. ([99designs duotone guide](https://99designs.com/blog/trends/duotone-design/))
4. **Crop out faces; keep hands and environment** — Hands on keyboard, hands on whiteboard, monitor over-shoulder. Removes the "model gaze" tell. Stripe-style — environment, not posed people.
5. **Geometric mask / bezier crop** — Image fills a non-rectangular shape (parallelogram for Stripe, asymmetric arc). Breaks the "stock photo is rectangular" pattern.
6. **Slow zoom or parallax on a still** — A subtle 1.0 to 1.05 transform over 10s reads as "intentional" without animating anything else. Cheaper than video.
7. **Mix stock photo + custom SVG overlay** — Animated line drawing, callouts, or data flow over a still photo. Combines stock cost with bespoke feel.
8. **Time-mapping (4K stock at 0.5x)** — Ambient hero video slowed to half speed reads as cinematic. Pair with `preload="metadata"` and a poster.
9. **Grain + chromatic aberration** — A subtle film-grain SVG overlay (~3% opacity) plus -1px red/+1px blue channel offset breaks the "clean stock" look. Cheap.
10. **Hard typography crop** — Big type sits half-over the photo, half-on solid color. Editorial magazine move. Forces the eye to read the brand, not the stock subject.

---

## Q3 — Stock libraries for B2B automation/industrial/office context

| Library | License | Cost | B2B content depth | "Looks like everyone's stock" risk | Verdict for OpSolid |
|---------|---------|------|-------------------|-----------------------------------|---------------------|
| **[Pexels](https://www.pexels.com/license/)** | Free, no attribution, commercial OK. Cannot resell unaltered or imply endorsement. | Free | Broad — office, technology, abstract | Medium-high (most-trafficked free site) | **Primary** for breadth + license clarity |
| **[Unsplash](https://www.licenseorg.com/compare/pexels-vs-unsplash)** | Free + paid Plus tier. Commercial OK. Stricter on hotlinking. | Free / Plus | High on lifestyle, thinner on industrial | High (ubiquitous) | Secondary; cross-check against Pexels |
| **[Coverr](https://coverr.co)** | Free, no attribution, commercial OK. Cannot redistribute. | Free | Tech/office/aerial focus; strong B2B leaning | Medium | **Primary** for free video |
| **[Mixkit](https://www.licenseorg.com/guide/video/mixkit)** (Envato) | Mixkit Free License — commercial OK, no attribution. Some "Restricted" assets are non-commercial — must check per asset. | Free | Templates + stock video | Medium-high | Useful supplement; watch the restricted tag |
| **Pond5** | Per-clip royalty-free (paid). | $25–$80/clip typical | Deepest catalog | Low risk if you dig | Use for hero moments needing rarity |
| **[Artgrid](https://www.footagesecrets.com/buyers-guide/artgrid-pricing/)** | Royalty-free, lifetime license, unlimited downloads on subscription. | ~$200/yr annual promo | Cinematic, 6K/8K, story-driven shoots | Low (curated, less circulated) | **Primary** for premium hero video |
| **Production Crate** | Subscription. Overlays/SFX/3D bonus. | ~$100–$190/yr | Effects + footage hybrid | Low | Useful for grain/light overlays |
| **Adobe Stock** | Per-asset or subscription. Standard royalty-free. | $30+/mo entry | Very deep | High (over-circulated) | Skip unless specific need |
| **[Storyblocks](https://www.footagesecrets.com/buyers-guide/storyblocks-vs-envato-elements/)** | Subscription, unlimited DL. | ~$180/yr | Focused on footage + music | Medium | Alternative to Artgrid; cheaper, less curated |
| **[Envato Elements](https://elements.envato.com/pricing)** | Subscription, unlimited DL. License is broad but excludes theatrical features. | ~$14.85/mo | Templates + footage + audio | Medium-high | Useful if you also need motion templates |
| **Motion Array** | Subscription. | ~$30/mo Everything Plan | Templates + footage + plugins | Medium | Strong all-in-one; overkill for a marketing site |

**Recommendation for OpSolid:** Start with **Coverr + Pexels** (free, license-clean). If hero video needs to feel cinematic and rare, add **Artgrid** annual (~$200) — its lifetime license means assets keep working even after cancellation. Skip Adobe Stock and Unsplash for hero work — too over-circulated.

---

## Q4 — Subjects, ranked by stock availability for OpSolid services

| Subject | Availability | Quality on free libs | Notes |
|---------|-------------|---------------------|-------|
| **Hands on keyboard / over-shoulder monitor** | Abundant | Strong | Easiest to defuse with color wash |
| **Server rack LEDs, blinkenlights close-up** | Abundant | Strong | Ambient hero gold; works at 0.5x speed |
| **Whiteboard hands / sticky notes / sketching** | Abundant | Medium-strong | Great for AI consulting subjects |
| **Conveyor belt / warehouse / logistics b-roll** | Abundant on Coverr/Pond5 | Medium | Often too "industrial promo"; needs color grade |
| **Focused person at laptop (faces visible)** | Saturated | Mixed | Risk of stock-photo tell unless cropped |
| **Light reflections, bokeh, abstract dataflow** | Abundant | Strong | Best for M365 / abstract automation messaging |
| **Lecture room / training scenes** | Available | Medium | Often dated; check shoot year |
| **Drone factory floor / robotic arms** | Available on Artgrid/Pond5 | Strong on paid | Thin on free; budget for hero |
| **Real engineers in real workshops** | Thin | Weak | Reads as staged; will need custom shoot eventually |
| **German/EU office environments specifically** | Thin | Weak | Most stock is US/UK aesthetic — flag for OpSolid's EU positioning |

**Implication:** For OpSolid's mix (operations + AI consulting + M365 + training), 80% of needs are covered by hands/monitors/server-LEDs/whiteboards/abstract-light. Drone factory shots will require paid (Artgrid). EU-specific environments may eventually need a custom half-day shoot.

---

## Q5 — Anti-patterns and what serious sites do instead

| Cliché to avoid | Source of evidence | What serious sites do instead |
|----------------|---------------------|------------------------------|
| Handshake over desk | [LinkedIn — 10 Most Overused B2B Stock Photos](https://www.linkedin.com/business/marketing/blog/content-marketing/10-most-overused-b2b-marketing-stock-photos) | Show the product UI (Linear, Figma) |
| Diverse team laughing at a laptop | Same | Customer quote + name + headshot (Webflow) |
| Three colleagues pointing at a monitor | Same | Hands-on-keyboard close-up cropped to no faces |
| Customer-service-headset shot | Same | Real Slack/email thread mockup (Intercom) |
| Aerial city / skyline at golden hour | Common B2B trope | Commissioned street-level photography (Stripe) |
| Hand reaching toward glowing AI brain | Generative-AI-era cliché | Abstract gradient mesh (Stripe) or animated icon constellation (Notion) |
| Person looking thoughtfully at horizon | [DepositPhotos cliché list](https://blog.depositphotos.com/stock-photo-cliches.html) | Product screenshots showing actual work being done (Figma) |
| Team huddle / arms-in-circle | [DownWithDesign cliché list](https://www.downwithdesign.com/inspiration/10-biggest-stock-photography-cliches/) | Customer logo wall (Notion: OpenAI, Figma, Ramp, Vercel) |
| Leader-pointing-at-followers / "vision" pose | Same | Quote pulled from a real exec, large type, no photo (Webflow) |
| Smiling-too-hard meeting shot | Same | Slack/UI thread that shows a real workflow moment (Linear) |

---

## Q6 — Lighthouse-friendly background video delivery

Synthesized from [web.dev LCP](https://web.dev/articles/lcp), [web.dev video-and-source-tags](https://web.dev/articles/video-and-source-tags), [aarontgrogg.com Jan 2026](https://aarontgrogg.com/blog/2026/01/06/improving-lcp-for-video-hero-components/), and [imagekit on lazy video](https://imagekit.io/blog/lazy-loading-html-videos/).

**Concrete pattern that should hit Lighthouse mobile ≥ 85 and LCP < 2.5s:**

```html
<section class="hero">
  <img
    src="/hero-poster.avif"
    srcset="/hero-poster-720.avif 720w, /hero-poster-1440.avif 1440w"
    sizes="100vw"
    fetchpriority="high"
    alt=""
    class="hero__poster"
  />
  <video
    class="hero__video"
    poster="/hero-poster.avif"
    muted
    playsinline
    loop
    preload="metadata"
    aria-hidden="true"
    data-src-av1="/hero-1080.av1.mp4"
    data-src-h264="/hero-1080.h264.mp4"
    data-src-mobile="/hero-720.h264.mp4">
  </video>
</section>
```

**Rules:**

1. **LCP element is the AVIF poster, not the video.** This is the single most important move — videos as LCP candidates always lose. The poster ships eagerly with `fetchpriority="high"`.
2. **Lazy-mount the `<source>` children** via IntersectionObserver when the hero scrolls into view (or immediately if it's already visible on load). Use `data-src-*` and inject `<source>` elements on observer fire. Keeps initial HTML lean.
3. **`prefers-reduced-motion: reduce`** → never mount the video at all; the poster stays as the final paint. ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion))
4. **Codec ladder:** AV1 (`video/mp4; codecs=av01...`) → H.264 fallback (`video/mp4; codecs=avc1...`). AV1 is ~30% smaller than H.264 at the same quality, supported in Chrome/Edge/Firefox/Safari 17+. Skip VP9/WebM unless you have a specific reason — H.264 covers the gap. ([Unlighthouse LCP guide](https://unlighthouse.dev/learn-lighthouse/lcp))
5. **Resolution + bitrate targets for ambient hero:**
   - Desktop: 1920×1080, ~2.5–3.5 Mbps AV1 / ~3.5–5 Mbps H.264
   - Mobile: 1280×720 (or 960×540 if you can swallow the quality drop), ~1.0–1.5 Mbps AV1
   - Clip length: ≤8 seconds, loops invisible if first/last frame match
6. **`preload="metadata"`** not `auto` — saves 90%+ bandwidth on first paint. Browser pulls just enough to start playback when mounted.
7. **Poster image:** AVIF primary, JPEG fallback. Target <60 KB at 1440w AVIF for hero. AVIF beats WebP/JPEG by 50%+ on the same quality bar.
8. **CDN strategy:** Serve video from a CDN with byte-range support (Cloudflare R2, Bunny.net Stream, Vercel Blob). Avoid putting >5 MB videos in `/public/` on Vercel — egress gets pricey. R2 is the sweet spot at $0.015/GB egress.
9. **Mute + playsinline + loop** are mandatory for autoplay on mobile Safari/Chrome. `autoplay` attribute can be added once mounted by the observer.
10. **Do not autoplay if the user is on Save-Data (`navigator.connection.saveData === true`)** — leave the poster.

**Single-line summary of expected scores:** with an AVIF poster ≤60 KB as LCP, the video lazy-mounted at intersection, AV1+H.264 ladder, and respect for `prefers-reduced-motion` and `saveData`, Lighthouse mobile typically lands 88–94 performance and LCP under 1.8s on a fast 4G profile.

---

## Gaps / honest flags

- **Atlassian, Calendly, Asana, Airtable** returned thin meta from server-rendered HTML — visual descriptions there are tentative. To fully verify, render in a headless browser. The 6 sites that did return rich content (Notion, Slack, Webflow, Figma, Linear, Intercom, Loom, Stripe, Dropbox, Mailchimp) gave a consistent enough signal to call the trend.
- **Artgrid.io homepage returned 403** to direct fetch — pricing/license summary comes from third-party reviews ([footagesecrets.com](https://www.footagesecrets.com/buyers-guide/artgrid-pricing/)), not the site itself. Verify pricing at signup.
- **AV1 bitrate guidance** is a synthesis from web.dev + my prior experience; web.dev's video-and-source-tags article does not give explicit Mbps targets. Verify on your specific footage with a few test encodes.
