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
} from "@/components/cards/templates/v2/registry";
import { LogoBlock } from "@/components/cards/templates/v2/shared/LogoBlock";
import { CustomSectionsBlock } from "@/components/cards/templates/v2/shared/CustomSectionsBlock";
import { VideoBlock } from "@/components/cards/templates/v2/shared/VideoBlock";
import { GalleryBlock } from "@/components/cards/templates/v2/shared/GalleryBlock";
import { EmbedsBlock } from "@/components/cards/EmbedsBlock";
import { CustomButtonsBlock } from "@/components/cards/CustomButtonsBlock";
import { TipJarBlock } from "@/components/cards/TipJarBlock";
import { FaqBlock } from "@/components/cards/FaqBlock";
import { ContactFormBlock } from "@/components/cards/ContactFormBlock";

/** Templates that embed videoUrl natively — universal embed suppressed. */
const VIDEO_EMBED_NATIVE = new Set<string>(["athlete", "photographer"]);

type BlockLocale = "en" | "de" | "tr";

const HEADINGS: Record<BlockLocale, { gallery: string; embeds: string; faq: string; contact: string }> = {
  de: { gallery: "Galerie", embeds: "Eingebettet", faq: "Häufige Fragen", contact: "Kontakt" },
  tr: { gallery: "Galeri", embeds: "Öne çıkan", faq: "Sık Sorulan Sorular", contact: "İletişim" },
  en: { gallery: "Gallery", embeds: "Featured", faq: "FAQ", contact: "Get in touch" },
};

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
  const h = HEADINGS[locale] ?? HEADINGS.en;
  const isPublic = mode === "public";

  return (
    <>
      {/* Universal brand strip — logo above any template without a native one. */}
      <LogoBlock
        logoPath={logoPath}
        tone={tone}
        suppress={suppressed(LOGO_NATIVE_KEYS)}
      />
      {children}
      <CustomSectionsBlock
        sections={data.customSections}
        accentHex={accentHex ?? undefined}
        tone={tone}
      />
      {/* Universal video — self-hosted clip + YouTube/Vimeo embed; the embed is
          suppressed where templates render videoUrl natively. */}
      <VideoBlock
        videoUrl={data.videoUrl}
        videoPath={data.videoPath}
        tone={tone}
        heading="Video"
        suppressEmbed={suppressed(VIDEO_EMBED_NATIVE)}
      />
      {!suppressed(GALLERY_NATIVE_KEYS) && (
        <GalleryBlock gallery={data.gallery} tone={tone} heading={h.gallery} />
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
    </>
  );
}
