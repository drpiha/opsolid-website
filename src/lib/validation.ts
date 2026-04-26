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
  })
  .strict();
export type ImagePosition = z.infer<typeof ImagePositionSchema>;

// -----------------------------------------------------------------------------
// Phase 7.9 — Custom sections the customer can add to their card.
// Templates render these at the bottom of the card. Title is required, body
// is required, optional photo path renders as a small image alongside the body.
// -----------------------------------------------------------------------------
export const CustomSectionSchema = z
  .object({
    id: z.string().trim().min(1).max(40),
    title: z.string().trim().min(1).max(60),
    body: z.string().trim().min(1).max(800),
    mediaPath: z.string().trim().max(500).optional(),
  })
  .strict();
export type CustomSection = z.infer<typeof CustomSectionSchema>;

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
});
export type CardData = z.infer<typeof CardDataSchema>;

// -----------------------------------------------------------------------------
// OrderPayload — what the client POSTs to /api/orders
// -----------------------------------------------------------------------------

export const OrderPayloadSchema = z.object({
  templateId: z.number().int().positive(),
  billingMode: z.enum([
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
