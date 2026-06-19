// =============================================================================
// UniversalBlocks — the single source of truth for the wrapper-block stack
// rendered around <Template/>.
//
// Consumed by BOTH the public card page (src/app/c/[slug]/page.tsx) and the
// editor live preview (EditPreview in CardEditClient.tsx). Before this
// component existed the two call-sites duplicated the stack and drifted —
// the editor preview was missing FAQ/CustomButtons entirely, which is the
// exact divergence class that caused the 2026-06 TestimonialsBlock revert.
//
// NO "use client" here: the public page is a Server Component and imports
// this directly; the individual blocks carry their own client boundaries.
// Per-template suppression Sets stay in registry.ts (server-safe module) —
// see the comment on LOGO_NATIVE_KEYS for why they must not live in a
// client module.
//
// `mode`:
//   • "public"  — full stack (TipJar, ContactForm, Embeds incl. iframes).
//   • "preview" — display-only blocks; interactive/Stripe/iframe blocks are
//     skipped so the editor pane stays light and side-effect-free.
//
// The coverage audit (scripts/audit-template-coverage.ts) mirrors this stack
// in its WRAPPER_COVERED list — update both together.
// =============================================================================

import type * as React from "react";
import type { CardData } from "@/lib/validation";
import {
  LOGO_NATIVE_KEYS,
  FAQ_NATIVE_KEYS,
  GALLERY_NATIVE_KEYS,
  TESTIMONIALS_NATIVE_KEYS,
  BROCHURE_NATIVE_KEYS,
  BIO_NATIVE_KEYS,
  STATS_NATIVE_KEYS,
  SPOTLIGHT_NATIVE_KEYS,
} from "@/components/cards/templates/v2/registry";
import { resolveLabels } from "@/components/cards/templates/v2/shared/resolveLabels";
import {
  UNIVERSAL_HEADINGS,
  type BlockLocale,
} from "@/components/cards/templates/v2/shared/universalHeadings";
import { StatsBlock } from "@/components/cards/templates/v2/shared/StatsBlock";
import { LogoBlock } from "@/components/cards/templates/v2/shared/LogoBlock";
import { SpotlightBlock } from "@/components/cards/templates/v2/shared/SpotlightBlock";
import { CustomSectionsBlock } from "@/components/cards/templates/v2/shared/CustomSectionsBlock";
import { VideoBlock } from "@/components/cards/templates/v2/shared/VideoBlock";
import { GalleryBlock } from "@/components/cards/templates/v2/shared/GalleryBlock";
import { EmbedsBlock } from "@/components/cards/EmbedsBlock";
import { CustomButtonsBlock } from "@/components/cards/CustomButtonsBlock";
import { TipJarBlock } from "@/components/cards/TipJarBlock";
import { FaqBlock } from "@/components/cards/FaqBlock";
import { ContactFormBlock } from "@/components/cards/ContactFormBlock";
import { TestimonialsBlock } from "@/components/cards/TestimonialsBlock";
import { BrochureBlock } from "@/components/cards/BrochureBlock";
import { AboutBlock } from "@/components/cards/AboutBlock";

/** Templates that embed videoUrl natively — universal embed suppressed. */
const VIDEO_EMBED_NATIVE = new Set<string>(["athlete", "photographer"]);

const HEADINGS = UNIVERSAL_HEADINGS;

interface UniversalBlocksProps {
  mode: "public" | "preview";
  /** Card data driving the blocks (the un-overridden parse in public mode). */
  data: CardData;
  /** Registry key of the rendered template; null → SmartCard fallback, which
   *  renders everything natively, so all gated blocks are suppressed. */
  entryKey: string | null;
  logoPath: string | null;
  tone: "dark" | "light";
  primaryHex?: string | null;
  accentHex?: string | null;
  locale?: BlockLocale;
  /** Public mode only — TipJar + ContactForm post against this slug. */
  slug?: string;
  ownerIsPro?: boolean;
  /** The rendered <Template/> itself. */
  children: React.ReactNode;
}

export function UniversalBlocks({
  mode,
  data,
  entryKey,
  logoPath,
  tone,
  primaryHex,
  accentHex,
  locale = "de",
  slug,
  ownerIsPro = false,
  children,
}: UniversalBlocksProps) {
  const suppressed = (set: Set<string>) => !entryKey || set.has(entryKey);
  // Owner label overrides win over the per-locale defaults for the wrapper-
  // block headings the visitor sees most on cross-sector / blank cards
  // (gallery, faq, contact, testimonials, brochure, about, embeds).
  const h = resolveLabels(HEADINGS[locale] ?? HEADINGS.en, data.labels);
  const isPublic = mode === "public";

  // Universal video — self-hosted clip + YouTube/Vimeo embed; the embed is
  // suppressed where templates render videoUrl natively. The owner picks where
  // the block sits via cardData.videoPlacement (top / default / bottom); it is
  // rendered exactly once at the chosen position.
  const placement = data.videoPlacement ?? "default";
  const videoBlock = (
    <VideoBlock
      videoUrl={data.videoUrl}
      videoPath={data.videoPath}
      tone={tone}
      heading="Video"
      locale={locale}
      suppressEmbed={suppressed(VIDEO_EMBED_NATIVE)}
    />
  );

  // Spotlight placement — owner picks where the "Şu an / Now" panel sits.
  // "belowPhoto" defers to the template's native under-hero slot where one
  // exists (SPOTLIGHT_NATIVE_KEYS render it themselves); on templates without
  // a native slot it falls back to "top". "top"/"bottom" always route here.
  const spotPlace = data.spotlight?.placement ?? "belowPhoto";
  const spotNative = entryKey ? SPOTLIGHT_NATIVE_KEYS.has(entryKey) : false;
  const spotlightBlock = (
    <SpotlightBlock
      spotlight={data.spotlight}
      heading={h.spotlight}
      accentHex={accentHex}
      primaryHex={primaryHex}
      tone={tone}
      locale={locale}
    />
  );
  const spotlightAtTop = spotPlace === "top" || (spotPlace === "belowPhoto" && !spotNative);
  const spotlightAtBottom = spotPlace === "bottom";

  return (
    <>
      {/* Universal brand strip — logo above any template without a native one. */}
      <LogoBlock
        logoPath={logoPath}
        tone={tone}
        suppress={suppressed(LOGO_NATIVE_KEYS)}
      />
      {placement === "top" && videoBlock}
      {/* "Şu an / Now" spotlight at the top (above the card) — chosen via
          spotlight.placement, or the belowPhoto fallback on templates without a
          native slot. */}
      {spotlightAtTop && spotlightBlock}
      {children}
      {/* …or pinned to the bottom, after the whole card. */}
      {spotlightAtBottom && spotlightBlock}
      {/* Universal bio — 22 templates don't render cardData.bio natively. */}
      {!suppressed(BIO_NATIVE_KEYS) && (
        <AboutBlock bio={data.bio} accentHex={accentHex} heading={h.about} />
      )}
      {/* Universal proof stats — owner-entered numbers only; templates with a
          bespoke stat section (STATS_NATIVE_KEYS) render them natively. */}
      {!suppressed(STATS_NATIVE_KEYS) && (
        <StatsBlock stats={data.stats} tone={tone} accentHex={accentHex} />
      )}
      <CustomSectionsBlock
        sections={data.customSections}
        accentHex={accentHex ?? undefined}
        tone={tone}
      />
      {placement === "default" && videoBlock}
      {!suppressed(GALLERY_NATIVE_KEYS) && (
        <GalleryBlock gallery={data.gallery} tone={tone} heading={h.gallery} />
      )}
      {/* Universal testimonials — suppressed on the 44 templates that render
          quote content natively (audit-derived Set; count-chips don't count). */}
      {!suppressed(TESTIMONIALS_NATIVE_KEYS) && (
        <TestimonialsBlock
          testimonials={data.testimonials}
          accentHex={accentHex}
          heading={h.testimonials}
        />
      )}
      {isPublic && (
        <EmbedsBlock
          embeds={data.embeds}
          accentHex={accentHex ?? undefined}
          locale={locale}
          heading={h.embeds}
        />
      )}
      <CustomButtonsBlock
        buttons={data.customButtons}
        primaryHex={primaryHex}
        accentHex={accentHex}
      />
      {/* Universal brochure link — 81 templates have no native affordance. */}
      {!suppressed(BROCHURE_NATIVE_KEYS) && (
        <BrochureBlock
          brochureUrl={data.brochureUrl}
          accentHex={accentHex}
          label={h.brochure}
        />
      )}
      {isPublic && slug && (
        <TipJarBlock
          slug={slug}
          tipJar={data.tipJar}
          ownerIsPro={ownerIsPro}
          primaryHex={primaryHex}
        />
      )}
      {!suppressed(FAQ_NATIVE_KEYS) && (
        <FaqBlock faqs={data.faqs} accentHex={accentHex} heading={h.faq} />
      )}
      {isPublic && slug && (
        <ContactFormBlock
          slug={slug}
          contactForm={data.contactForm}
          primaryHex={primaryHex}
          accentHex={accentHex}
          locale={locale}
          heading={h.contact}
        />
      )}
      {placement === "bottom" && videoBlock}
    </>
  );
}
