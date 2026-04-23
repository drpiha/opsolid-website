import { z } from "zod";

// -----------------------------------------------------------------------------
// Enums (mirror Prisma string columns)
// -----------------------------------------------------------------------------

export const OrderStatus = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PAID: "PAID",
  PUBLISHED: "PUBLISHED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const BillingMode = {
  ONE_TIME: "ONE_TIME",
  SUBSCRIPTION: "SUBSCRIPTION",
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

const url = z.string().url("Ungültige URL").max(500);

// -----------------------------------------------------------------------------
// CardData — the JSON blob rendered on the public card page
// -----------------------------------------------------------------------------

export const CardDataSchema = z.object({
  name: z.string().trim().min(1).max(120),
  title: z.string().trim().max(160).optional(),
  company: z.string().trim().max(160).optional(),
  email: z.string().email().max(200).optional(),
  phone: phone.optional(),
  whatsapp: phone.optional(),
  website: url.optional(),
  address: z.string().trim().max(500).optional(),
  bio: z.string().trim().max(600).optional(),
  socials: z
    .object({
      linkedin: url.optional(),
      instagram: url.optional(),
      x: url.optional(),
      tiktok: url.optional(),
      youtube: url.optional(),
      github: url.optional(),
      facebook: url.optional(),
    })
    .strict()
    .optional(),
  designNotes: z.string().trim().max(800).optional(),
});
export type CardData = z.infer<typeof CardDataSchema>;

// -----------------------------------------------------------------------------
// OrderPayload — what the client POSTs to /api/orders
// -----------------------------------------------------------------------------

export const OrderPayloadSchema = z.object({
  templateId: z.number().int().positive(),
  billingMode: z.enum([BillingMode.ONE_TIME, BillingMode.SUBSCRIPTION]),
  locale: z.enum(["de", "en", "tr"]).default("de"),

  contactName: z.string().trim().min(1).max(120),
  contactEmail: z.string().email().max(200),
  contactPhone: phone,
  callMeBack: z.boolean().default(false),

  cardData: CardDataSchema,
  brandPrimaryHex: hexColor.optional(),
  brandAccentHex: hexColor.optional(),

  // Upload paths — set by /api/uploads first, then referenced here.
  photoPath: z.string().max(500).optional(),
  logoPath: z.string().max(500).optional(),
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
    OrderStatus.PUBLISHED,
    OrderStatus.CANCELLED,
    OrderStatus.REFUNDED,
  ]),
  note: z.string().max(500).optional(),
});
