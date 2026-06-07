import { z } from "zod";

// -----------------------------------------------------------------------------
// Enums (mirror Prisma string columns)
// -----------------------------------------------------------------------------

export const OrderStatus = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PAID: "PAID",
  AWAITING_DESIGN: "AWAITING_DESIGN",
  PUBLISHED: "PUBLISHED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const BillingMode = {
  FREE: "FREE",
  ONE_TIME: "ONE_TIME",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
} as const;
export type BillingMode = (typeof BillingMode)[keyof typeof BillingMode];

export const SubscriptionStatus = {
  active: "active",
  past_due: "past_due",
  canceled: "canceled",
  unpaid: "unpaid",
  trialing: "trialing",
  incomplete: "incomplete",
  incomplete_expired: "incomplete_expired",
} as const;

// -----------------------------------------------------------------------------
// Primitive validators
// -----------------------------------------------------------------------------

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Farbe muss als #rrggbb Hex angegeben werden");

const phone = z
  .string()
  .trim()
  .min(5, "Telefonnummer zu kurz")
  .max(32, "Telefonnummer zu lang")
  .regex(/^[+0-9 ()\-\/.]+$/, "Ungültige Telefonnummer");

/**
 * Lenient URL:
 *  - accepts "studio-nord.de" and normalizes to "https://studio-nord.de"
 *  - rejects obvious garbage ("not a url", "foo bar")
 *  - strips surrounding whitespace
 *
 * Users don't type "https://" for social handles and company sites — failing
 * the submit over that is bad UX. We normalize instead and let the public
 * page render it as a real link.
 */
const url = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    // If it has a dot and no spaces, treat as a bare host and add https://.
    if (/^[^\s]+\.[^\s]{2,}$/.test(trimmed)) return `https://${trimmed}`;
    return trimmed; // let .url() reject the rest
  },
  z
    .string()
    .url("Ungültige URL — bitte eine gültige Adresse eingeben (z. B. studio-nord.de)")
    .max(500)
);

// -----------------------------------------------------------------------------
// Video URL — YouTube or Vimeo only. We embed via iframe; allowing arbitrary
// hosts would expose us to XSS / data-exfil via embedded malicious players.
// Accepts:
//   youtube.com/watch?v=…, youtu.be/…, youtube.com/shorts/…, youtube-nocookie.com/embed/…
//   vimeo.com/<id>, player.vimeo.com/video/<id>
// -----------------------------------------------------------------------------
const VIDEO_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "vimeo.com",
  "www.vimeo.com",
  "player.vimeo.com",
]);

export const videoUrl = z
  .string()
  .trim()
  .url("Bitte eine gültige Video-URL eingeben (YouTube oder Vimeo)")
  .max(500)
  .refine(
    (value) => {
      try {
        const host = new URL(value).hostname.toLowerCase();
        return VIDEO_HOSTS.has(host);
      } catch {
        return false;
      }
    },
    { message: "Nur YouTube oder Vimeo Videos sind erlaubt." }
  );

// -----------------------------------------------------------------------------
// Layout × Theme — premium template engine keys. Layouts are React components
// under src/components/cards/templates/layouts/. Themes are palette + typography
// presets under src/components/cards/templates/themes/. Both validated as
// non-empty strings here; the renderer falls back gracefully if unknown.
// (Open enum: 30+ HTML port + 15 hand-built layouts → too many for a literal
// union, and the renderer's allowlist is the real source of truth.)
// -----------------------------------------------------------------------------
const LAYOUT_KEY_RE = /^[A-Za-z][A-Za-z0-9_-]{0,63}$/;
const THEME_KEY_RE = /^[a-z][a-zA-Z0-9_-]{0,31}$/;

export const layoutKey = z
  .string()
  .regex(LAYOUT_KEY_RE, "Ungültiger Layout-Key")
  .max(64);

export const themeKey = z
  .string()
  .regex(THEME_KEY_RE, "Ungültiger Theme-Key")
  .max(32);

// -----------------------------------------------------------------------------
// QR styling — preset + colors + logo/photo + optional AI generation metadata.
// Persisted as JSON on CardOrder.qrStyle so we can re-render on demand.
// -----------------------------------------------------------------------------
const qrPreset = z.enum([
  "classic",
  "rounded",
  "dots",
  "diamond",
  "gradient",
  "monoNeon",
  "watercolor",
  "brandSync",
]);

const qrAiStyle = z.enum([
  "geometric",
  "liquid",
  "forest",
  "cyberpunk",
  "watercolor",
  "mosaic",
]);

export const QrStyleSchema = z
  .object({
    preset: qrPreset.default("classic"),
    primary: hexColor.optional(), // overrides brandPrimaryHex
    accent: hexColor.optional(), // overrides brandAccentHex
    withLogo: z.boolean().default(false),
    withPhoto: z.boolean().default(false),
    /** AI Art QR (Replicate) — only present after a successful generation. */
    ai: z
      .object({
        prompt: z.string().trim().min(3).max(300),
        style: qrAiStyle,
        generatedUrl: z.string().url().max(500),
        generatedAt: z.string().datetime().optional(),
      })
      .optional(),
  })
  .strict();
export type QrStyle = z.infer<typeof QrStyleSchema>;

// -----------------------------------------------------------------------------
// CustomBlocks — drag-drop block editor state for Bento/Accordion layouts.
// Each block has a stable id, a type from a known palette, free-form props,
// and a position on the canvas grid.
// -----------------------------------------------------------------------------
const blockType = z.enum([
  "Avatar",
  "Heading",
  "RichText",
  "Phone",
  "Email",
  "WhatsApp",
  "Website",
  "Address",
  "Map",
  "SocialRow",
  "VideoEmbed",
  "Gallery",
  "CTAButton",
  "Spotify",
  "CalendarBook",
]);

export const BlockSchema = z
  .object({
    id: z.string().min(1).max(64),
    type: blockType,
    props: z.record(z.string(), z.unknown()).default({}),
    position: z
      .object({
        x: z.number().int().min(0).max(11),
        y: z.number().int().min(0).max(99),
        w: z.number().int().min(1).max(12),
        h: z.number().int().min(1).max(12),
      })
      .optional(),
  })
  .strict();
export type CardBlock = z.infer<typeof BlockSchema>;

// -----------------------------------------------------------------------------
// Smart Card sub-schemas — services, gallery, FAQ, testimonials. All optional;
// a card with none of these renders the same as before (compact contact card).
// -----------------------------------------------------------------------------

const ServiceSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().max(400).optional(),
    /** Optional explicit price label (rendered as-is). e.g. "ab 49 €" */
    priceLabel: z.string().trim().max(60).optional(),
    /** Optional outbound link — makes the product/service card clickable (the
     *  "Buy"/"Kaufen" affordance opens this). https:// auto-prepended. */
    href: url.optional(),
  })
  .strict();
export type CardService = z.infer<typeof ServiceSchema>;

const GalleryItemSchema = z
  .object({
    src: z.string().trim().max(500), // Storage path, normalized at render time.
    alt: z.string().trim().max(160).optional(),
  })
  .strict();
export type CardGalleryItem = z.infer<typeof GalleryItemSchema>;

const FaqItemSchema = z
  .object({
    q: z.string().trim().min(1).max(240),
    a: z.string().trim().min(1).max(1200),
  })
  .strict();
export type CardFaqItem = z.infer<typeof FaqItemSchema>;

const TestimonialSchema = z
  .object({
    author: z.string().trim().min(1).max(120),
    role: z.string().trim().max(160).optional(),
    quote: z.string().trim().min(1).max(600),
  })
  .strict();
export type CardTestimonial = z.infer<typeof TestimonialSchema>;

// Custom CTA buttons rendered above the contact rows. `style` selects the
// visual treatment (primary = filled brand, secondary = outline, ghost = text).
const CustomButtonSchema = z
  .object({
    label: z.string().trim().min(1).max(48),
    href: url,
    style: z.enum(["primary", "secondary", "ghost"]).default("secondary"),
  })
  .strict();
export type CardCustomButton = z.infer<typeof CustomButtonSchema>;

// -----------------------------------------------------------------------------
// Phase 7.9 — Image position & zoom for the uploaded photo/logo.
// Stored as percentages so it renders identically across template frames.
// -----------------------------------------------------------------------------
export const ImagePositionSchema = z
  .object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
    scale: z.number().min(0.5).max(3),
    /** How the image fills its frame. "cover" crops to fill (default);
     *  "contain" shows the whole image (letterboxed). */
    fit: z.enum(["cover", "contain"]).optional(),
  })
  .strict();
export type ImagePosition = z.infer<typeof ImagePositionSchema>;

// -----------------------------------------------------------------------------
// Phase 7.9 — Custom sections the customer can add to their card.
// Phase 8 — multi-image: each section now carries an optional `media[]` array
// of up to 6 images. The legacy `mediaPath: string` field is preserved for
// backward compatibility — readers must call `readSectionMedia()` to merge
// both shapes. New writes go to `media[]`; `mediaPath` is no longer set.
// -----------------------------------------------------------------------------
const SectionMediaSchema = z
  .object({
    src: z.string().trim().max(500),
    alt: z.string().trim().max(160).optional(),
  })
  .strict();
export type SectionMedia = z.infer<typeof SectionMediaSchema>;

export const CustomSectionSchema = z
  .object({
    id: z.string().trim().min(1).max(40),
    title: z.string().trim().min(1).max(60),
    body: z.string().trim().min(1).max(800),
    /** @deprecated since Phase 8 — kept for backward compat with pre-Phase-8
     *  cards. New writes use `media[]` instead. Readers should always go
     *  through `readSectionMedia(section)` which merges both shapes. */
    mediaPath: z.string().trim().max(500).optional(),
    /** Phase 8 — up to 6 inline images per section, rendered as 1 spotlight
     *  (1 image), 2-col grid (2-3 images), or 3-col grid (4-6 images). */
    media: z.array(SectionMediaSchema).max(6).optional(),
  })
  .strict();
export type CustomSection = z.infer<typeof CustomSectionSchema>;

/**
 * Returns the unified list of images for a custom section, merging the
 * legacy `mediaPath` field into the new `media[]` array. Always use this
 * helper at render and edit sites — never read `media` or `mediaPath`
 * directly.
 *
 * Order of precedence:
 *  1. `media[]` if present and non-empty (new shape).
 *  2. `mediaPath` wrapped in a single-item list (legacy shape).
 *  3. Empty array.
 */
export function readSectionMedia(section: CustomSection): SectionMedia[] {
  if (section.media && section.media.length > 0) return section.media;
  if (section.mediaPath) return [{ src: section.mediaPath }];
  return [];
}

// -----------------------------------------------------------------------------
// Phase 7.9 — Typography preset. Overrides the template's display + body fonts
// when set to anything other than "default". Each preset maps to a Google Font
// pair declared in `src/lib/typographyPresets.ts`.
// -----------------------------------------------------------------------------
export const TYPOGRAPHY_PRESETS = [
  "default",
  "modern",
  "classic",
  "editorial",
  "bold",
] as const;
export const typographyPreset = z.enum(TYPOGRAPHY_PRESETS);
export type TypographyPreset = z.infer<typeof typographyPreset>;

// -----------------------------------------------------------------------------
// CardData — the JSON blob rendered on the public card page.
//
// Smart Card MVP fields (added 2026-04-25, all optional & backward compatible):
//   - position, coverImage, services[], gallery[], faqs[], testimonials[]
//   - customButtons[], bookingUrl, brochureUrl
//   - impressumUrl, privacyUrl (German market: legally required for businesses)
// -----------------------------------------------------------------------------

export const CardDataSchema = z.object({
  name: z.string().trim().min(1).max(120),
  title: z.string().trim().max(160).optional(),
  /** Job position (separate from `title` so we can render "Sales Manager"
   *  alongside a creative title like "Founder & Head of Growth"). */
  position: z.string().trim().max(160).optional(),
  company: z.string().trim().max(160).optional(),
  email: z.string().email().max(200).optional(),
  phone: phone.optional(),
  whatsapp: phone.optional(),
  website: url.optional(),
  address: z.string().trim().max(500).optional(),
  bio: z.string().trim().max(600).optional(),
  /** Cover/hero image rendered behind the avatar. Storage path or full URL. */
  coverImage: z.string().trim().max(500).optional(),
  /** Cal.com / Calendly / generic booking URL. Drives the "Randevu Al" CTA. */
  bookingUrl: url.optional(),
  /** Public PDF brochure / portfolio link. */
  brochureUrl: url.optional(),
  /** Impressum (German legal footer). Strongly recommended for DE business cards. */
  impressumUrl: url.optional(),
  /** Datenschutz / Privacy policy link. */
  privacyUrl: url.optional(),
  /** Optional embedded video — YouTube or Vimeo URL only. Rendered by the
   *  layout if `supportsVideo` and lazy-loaded (click-to-play poster). */
  videoUrl: videoUrl.optional(),
  /** Optional self-hosted short video (mp4/webm) uploaded by the owner and
   *  stored via the asset adapter. Rendered with native <video> controls.
   *  Size + duration are capped client-side (see VideoUploader). Stored as the
   *  asset path/URL returned by /api/uploads (kind="video"). */
  videoPath: z.string().trim().max(500).optional(),
  socials: z
    .object({
      linkedin: url.optional(),
      instagram: url.optional(),
      x: url.optional(),
      tiktok: url.optional(),
      youtube: url.optional(),
      github: url.optional(),
      facebook: url.optional(),
      xing: url.optional(),
    })
    .strict()
    .optional(),
  /** Up to 12 services / offerings rendered as a list. */
  services: z.array(ServiceSchema).max(12).optional(),
  /** Up to 24 manually uploaded gallery images. */
  gallery: z.array(GalleryItemSchema).max(24).optional(),
  /** Up to 12 FAQ items rendered as accordion. */
  faqs: z.array(FaqItemSchema).max(12).optional(),
  /** Up to 8 testimonials. */
  testimonials: z.array(TestimonialSchema).max(8).optional(),
  /** Up to 4 custom CTA buttons rendered above contact rows. */
  customButtons: z.array(CustomButtonSchema).max(4).optional(),
  /** Sector preset applied to this card (consultant, real-estate, …). The
   *  renderer uses this to show a small sector badge and fall back to the
   *  preset's defaults for any empty service/CTA/FAQ block. Plain string so
   *  new sectors don't require a schema migration; the renderer's allowlist
   *  in src/config/card-sectors.ts is the real source of truth. */
  sectorKey: z
    .string()
    .trim()
    .regex(/^[a-z][a-z0-9-]{1,31}$/i, "Ungültiger Sektor-Key")
    .optional(),
  designNotes: z.string().trim().max(800).optional(),
  /** Phase 7.9 — pan/zoom applied to the uploaded profile photo. */
  photoPosition: ImagePositionSchema.optional(),
  /** Phase 7.9 — pan/zoom applied to the uploaded logo. */
  logoPosition: ImagePositionSchema.optional(),
  /** Phase 7.9 — up to 6 free-form sections rendered at the bottom of the card. */
  customSections: z.array(CustomSectionSchema).max(6).optional(),
  /** Phase 7.9 — typography preset; overrides template fonts when non-default. */
  typographyPreset: typographyPreset.optional(),
  /** Faz 6.6 — owner-curated banner above the public card (seasonal greetings,
   *  out-of-office, "currently accepting clients"). Empty `text` means no banner.
   *
   *  LEGACY SHAPE: kept for back-compat with cards saved before Sprint 6 mobile
   *  introduced the 4-tone variant. New writes go to `statusBanner` below. */
  statusMessage: z
    .object({
      text: z.string().trim().max(200),
      tone: z.enum(["info", "warm", "celebration"]).default("info"),
    })
    .optional(),
  /** Sprint 6 (mobile) — new banner shape with `enabled` flag and 4 tones
   *  (info / success / warn / announce). The mobile edit form writes here.
   *  The web public viewer prefers this and falls back to `statusMessage`. */
  statusBanner: z
    .object({
      enabled: z.boolean().default(false),
      text: z.string().trim().max(200),
      tone: z
        .enum(["info", "success", "warn", "announce"])
        .default("info"),
    })
    .optional(),
  /** M2 — sector / topic tags. Curated kebab-case slugs (`tech`, `design`, …)
   *  plus the owner's free-form custom tags. Capped at 5 / card and 24
   *  characters / tag. Drives the Discover chip-strip filter and the people-
   *  you-may-know sector-overlap score. The slug is the network-stable
   *  identifier; display labels come from `tags.<slug>` in the locale files. */
  tags: z
    .array(
      z
        .string()
        .trim()
        .toLowerCase()
        .min(1)
        .max(24)
        .regex(/^[a-z][a-z0-9-]{0,23}$/, "Ungültiger Tag — nur kleinbuchstaben, ziffern und bindestriche"),
    )
    .max(5)
    .optional(),
  /** M3 — Curated embed whitelist (Carrd amendment).
   *  Up to 3 entries per card. `kind` enforces the host whitelist (youtube /
   *  vimeo / spotify / soundcloud / calendly) and `url` is validated on save
   *  to confirm the host matches the kind. Public viewer renders each entry
   *  as a tappable thumbnail on mobile (opens in expo-web-browser) and a
   *  sandboxed iframe on web (only the 5 whitelisted hosts ever resolve to
   *  iframes — never `<iframe srcdoc>` or arbitrary URLs). */
  embeds: z
    .array(
      z
        .object({
          kind: z.enum([
            "youtube",
            "vimeo",
            "spotify",
            "soundcloud",
            "calendly",
          ]),
          url: z.string().trim().url().max(500),
        })
        .strict(),
    )
    .max(3)
    .optional(),
  /** M1 — Form-builder-lite + ESP webhook integration (Carrd amendment).
   *  Owner-defined override of the public-card "Bana Ulaş / Get in touch"
   *  form. When `enabled === true` the public viewer renders these fields
   *  instead of the hard-coded shape, and the lead route forwards to the
   *  configured ESP / webhook in addition to its existing email + Telegram
   *  paths. When undefined or `enabled === false` the legacy hard-coded
   *  form + notification path is preserved (backward-compatible).
   *
   *  Field count capped at 5 (3 default rows + 2 owner-added max). ESP token
   *  fields are stored on the card row — the server forwards them to the
   *  ESP HTTP endpoint and never echoes them back on GET (see card-mapping). */
  contactForm: z
    .object({
      enabled: z.boolean().default(false),
      fields: z
        .array(
          z
            .object({
              key: z.enum(["name", "email", "message"]),
              label: z.string().trim().min(1).max(60),
              required: z.boolean().default(false),
            })
            .strict(),
        )
        .min(1)
        .max(5),
      submitLabel: z.string().trim().min(1).max(40),
      esps: z
        .object({
          mailchimp: z
            .object({
              listId: z.string().trim().min(1).max(80),
              audienceId: z.string().trim().min(1).max(80),
              apiKey: z.string().trim().min(1).max(120).optional(),
            })
            .strict()
            .optional(),
          mailerlite: z
            .object({
              groupId: z.string().trim().min(1).max(80),
              apiKey: z.string().trim().min(1).max(120).optional(),
            })
            .strict()
            .optional(),
          webhook: z
            .object({
              url: z.string().trim().url().max(500),
            })
            .strict()
            .optional(),
        })
        .strict()
        .optional(),
    })
    .strict()
    .optional(),
  /**
   * M5 — Password-protected card (Carrd amendment).
   * Owner-set argon2id hash of the visitor passphrase. When non-null and the
   * visitor isn't authenticated as the owner, the public viewer renders a
   * lock screen + POST /api/cards/[slug]/unlock sets a 24h cookie. The hash
   * format is owned by `src/lib/auth/password.ts` (argon2id) and is never
   * exposed on the public-API mapping (see `card-mapping.ts`).
   *
   * On the wire from the mobile edit form, the client sends a `password`
   * STRING (plain) which the server hashes inside the PATCH route before
   * persisting. To clear the password the client sends an empty string OR
   * sets the field to null. To leave unchanged, the client OMITS the field
   * entirely (so a typical PATCH never accidentally resets the password).
   */
  password: z.string().max(200).nullable().optional(),
  /**
   * M5 — Stripe-powered tip jar (Carrd amendment, Pro-only feature).
   * `stripePriceId`: a one-time Stripe Price the maintainer creates in the
   *   dashboard and copies into the field. v2 will let users connect their
   *   own Stripe accounts; v1 routes payments to the platform Stripe.
   * The field is mirrored on the public-API mapping but never touches the
   * Stripe secret key — only the price id, which is itself public.
   */
  tipJar: z
    .object({
      enabled: z.boolean().default(false),
      label: z.string().trim().max(60).default(""),
      stripePriceId: z.string().trim().min(0).max(120).nullable().optional(),
    })
    .strict()
    .optional(),
});
export type CardData = z.infer<typeof CardDataSchema>;

// -----------------------------------------------------------------------------
// OrderPayload — what the client POSTs to /api/orders
// -----------------------------------------------------------------------------

export const OrderPayloadSchema = z.object({
  templateId: z.number().int().positive(),
  billingMode: z.enum([
    BillingMode.FREE,
    BillingMode.ONE_TIME,
    BillingMode.MONTHLY,
    BillingMode.YEARLY,
  ]),
  locale: z.enum(["de", "en", "tr"]).default("de"),

  contactName: z.string().trim().min(1).max(120),
  contactEmail: z.string().email().max(200),
  contactPhone: phone,
  callMeBack: z.boolean().default(false),

  cardData: CardDataSchema,
  brandPrimaryHex: hexColor.optional(),
  brandAccentHex: hexColor.optional(),

  // Upload paths — set by /api/uploads first, then referenced here.
  // Now point at either /uploads/cards/... (local dev) or a Vercel Blob URL.
  photoPath: z.string().max(500).optional(),
  logoPath: z.string().max(500).optional(),

  // Premium foundation (added 2026-04-23):
  // ---------------------------------------------------------------------------
  /** Concierge add-on (+€20). When true, order is queued for designer review
   *  instead of auto-publishing. Webhook reads this flag. */
  conciergeAddon: z.boolean().default(false),

  /** Layout × Theme overrides. When set, the renderer uses these instead of
   *  the catalog template's defaults. Stored on CardOrder for self-serve
   *  customization without requiring a new template entry. */
  layoutKey: layoutKey.optional(),
  themeKey: themeKey.optional(),

  /** Drag-drop block editor state (only used by Bento/Accordion layouts). */
  customBlocks: z.array(BlockSchema).max(40).optional(),

  /** QR styling preferences — preset + colors + logo/photo, optional AI Art. */
  qrStyle: QrStyleSchema.optional(),

  /** Phase 8 — customer-chosen slug (without forced random suffix). When set,
   *  the server validates the format + uniqueness before allocating it; on
   *  collision the request is rejected with `slug_taken` so the form can
   *  prompt the user. When omitted, the server generates `name-xxxx` as
   *  before. Validation duplicates `validateManualSlug()` on the server side. */
  desiredSlug: z
    .string()
    .trim()
    .min(3, "Kart adresi en az 3 karakter olmalı")
    .max(40, "Kart adresi en fazla 40 karakter olabilir")
    .regex(
      /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/,
      "Sadece küçük harf, rakam ve tire (-) — başta/sonda tire olmaz",
    )
    .optional(),
});
export type OrderPayload = z.infer<typeof OrderPayloadSchema>;

// -----------------------------------------------------------------------------
// Admin action payloads
// -----------------------------------------------------------------------------

export const AdminMarkContactedSchema = z.object({
  orderId: z.string().min(1),
  note: z.string().max(500).optional(),
});

export const AdminStatusUpdateSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum([
    OrderStatus.PENDING_PAYMENT,
    OrderStatus.PAID,
    OrderStatus.AWAITING_DESIGN,
    OrderStatus.PUBLISHED,
    OrderStatus.CANCELLED,
    OrderStatus.REFUNDED,
  ]),
  note: z.string().max(500).optional(),
});

// -----------------------------------------------------------------------------
// Album photo schemas (Workstream E)
//
// Album = card-bound photo wall. Owner uploads land as APPROVED, visitor
// uploads land as PENDING and surface only after owner approval. caption is
// optional free text; connectionId optionally tags a photo to an existing
// CardConnection ("taken with that person").
// -----------------------------------------------------------------------------
export const AlbumPhotoStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);
export type AlbumPhotoStatus = z.infer<typeof AlbumPhotoStatusSchema>;

export const AlbumUploadSchema = z.object({
  caption: z.string().trim().max(500).optional(),
  uploaderName: z.string().trim().max(120).optional(),
});
export type AlbumUpload = z.infer<typeof AlbumUploadSchema>;

export const AlbumPatchSchema = z.object({
  status: AlbumPhotoStatusSchema.optional(),
  caption: z.string().trim().max(500).optional(),
  connectionId: z.string().nullable().optional(),
});
export type AlbumPatch = z.infer<typeof AlbumPatchSchema>;
