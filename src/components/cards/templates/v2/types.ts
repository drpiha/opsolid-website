// =============================================================================
// v2 Template System — shared type contracts.
//
// Every Phase 7 template implements the `TemplateProps` interface and is
// registered in `registry.ts` with a `TemplateRegistryEntry`. The order form,
// the public `/c/[slug]` page, and the dev gallery all consume the registry
// rather than wiring up SmartCard directly — that lookup is what makes the
// "12 distinct templates" line-up possible without per-template branching at
// every call-site.
//
// Locked at Phase 7.1: layout, logo position, photo treatment and type scale
// are baked into each template — only `cardData`, brand colours, and uploaded
// assets vary per card. `TemplateSupports` is the read side of that contract:
// the order form uses it to hide content-block inputs (FAQ, gallery, video…)
// for templates that don't render those sections, so customers never type
// content that won't show up.
// =============================================================================

import type * as React from "react";
import type { CardData } from "@/lib/validation";
import type { SmartCardSource } from "@/components/cards/smart/SmartCardSource";

/**
 * Props every v2 template component must accept. Mirrors `SmartCardProps` so
 * the SmartCard fallback still works for orders whose `templateId` isn't in
 * the v2 registry — same call-shape, different visual.
 */
export interface TemplateProps {
  slug: string;
  cardData: CardData;
  /** Card owner's locale — visitor-facing CTAs (Exchange, footer) localise on this. */
  locale?: "de" | "en" | "tr";
  /** Storage path or full URL of the owner's profile photo. */
  photoPath?: string | null;
  /** Storage path or full URL of the owner's logo / mark. */
  logoPath?: string | null;
  /** Per-card brand override — primary tone (CTA fills, accent rules, …). */
  brandPrimaryHex?: string | null;
  /** Per-card brand override — accent tone (rules, hairlines, badges). */
  brandAccentHex?: string | null;
  /** Visit-context (?src=…&campaign=…) captured at the page entry point. */
  source?: SmartCardSource;
  /** Site origin for absolute share / canonical URLs. */
  siteUrl: string;
  /**
   * Optional server-rendered slot for Apple/Google Wallet buttons. Producers
   * are server components (read non-public env vars), so the parent computes
   * the buttons and passes them in. Each template decides where this slot
   * renders — visually integrated, not a generic dock.
   */
  walletSlot?: React.ReactNode;
}

/**
 * What a template *renders*. The order form uses this to hide content-block
 * input groups whose data wouldn't appear on the chosen template.
 *
 * Keep this list aligned with the input groups in `OrderFormSection.tsx`.
 */
export interface TemplateSupports {
  services: boolean;
  faqs: boolean;
  testimonials: boolean;
  gallery: boolean;
  video: boolean;
  brochure: boolean;
  socials: boolean;
  /** Most templates lock the visual design; only a few expose the theme picker. */
  themeSwitch: boolean;
  /** Template renders a hero/portrait photo. */
  photo: boolean;
  /** Template renders a logo mark. */
  logo: boolean;
}

/**
 * How a template renders the card owner's name. Used by the order form to
 * show a live preview chip so the customer sees exactly how their name will
 * appear before submitting.
 *
 * `transform: "uppercase"` — template CSS upper-cases the name (barber, dev…).
 * `transform: "none"` — template renders the name as-typed (default).
 * `maxDisplayLength` — soft warning threshold; the form shows a hint above this.
 */
export interface TemplateNameRules {
  transform?: "uppercase" | "none";
  /** CSS font-family string used for the preview chip. */
  displayFont?: string;
  /** Soft character limit — name renders but may wrap or scale. */
  maxDisplayLength?: number;
}

/**
 * Single source of truth for a template. The registry is `Record<number, …>`
 * keyed by `CardOrder.templateId` — same number the customer sees in the UI
 * and the same number stored in Stripe metadata.
 */
export interface TemplateRegistryEntry {
  /** Numeric id, matches `CardOrder.templateId` and the catalog entry. */
  id: number;
  /** Stable slug used in URLs and config keys ("real-estate", "lawyer", …). */
  key: string;
  /** Display name in the gallery / order form ("Real Estate"). */
  name: string;
  /** Human-readable industry label ("Real estate agent / broker"). */
  industry: string;
  /** The component to render. Receives the full `TemplateProps`. */
  Component: React.ComponentType<TemplateProps>;
  /** Which content blocks this template actually renders (input visibility). */
  supports: TemplateSupports;
  /** Default brand colours when the customer hasn't overridden them. */
  defaults: {
    brandPrimaryHex: string;
    brandAccentHex: string;
  };
  /** Dev-only slug used by `/dev/template-gallery` to render this template. */
  sampleSlug: string;
  /** Optional name rendering rules — drives the live preview chip in the order form. */
  nameRules?: TemplateNameRules;
}

/**
 * Curated demo persona for one template. The dev gallery, the order-form
 * carousel previews, and the Puppeteer thumbnail script all read the same
 * sample data, so what a customer sees as a thumbnail is exactly what the
 * template renders at production fidelity.
 *
 * `cardData` is the same shape an order persists — anything the schema
 * accepts is fair game. `photoUrl` / `logoUrl` accept absolute URLs (Unsplash,
 * etc. — must include a `// source:` license comment in the sample file).
 */
export interface SampleData {
  /** Matches the registry entry's `id`. Single source of truth. */
  templateId: number;
  /** Same `slug` value the dev gallery uses to address this sample. */
  slug: string;
  cardData: CardData;
  photoUrl?: string | null;
  logoUrl?: string | null;
  brandPrimaryHex?: string;
  brandAccentHex?: string;
}
