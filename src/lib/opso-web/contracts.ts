import { z } from "zod";

export const opsoLocale = z.enum(["de", "en", "tr"]);
export type OpsoLocale = z.infer<typeof opsoLocale>;
const shortText = (length: number) => z.string().trim().max(length);
export const opsoProfile = z.object({
  name: shortText(120).min(1), role: shortText(120), company: shortText(160),
  email: z.union([z.literal(""), z.string().trim().email().max(254)]),
  phone: shortText(40), location: shortText(160),
}).strict();
export type OpsoProfile = z.infer<typeof opsoProfile>;
export const opsoPrivacy = z.object({
  discoverable: z.boolean(), indexable: z.boolean(), showEmail: z.boolean(), showPhone: z.boolean(),
}).strict();
export type OpsoPrivacy = z.infer<typeof opsoPrivacy>;
export const opsoNewCard = z.object({
  goal: z.enum(["personal_brand", "sales", "event", "company"]),
  cardLocale: opsoLocale, profile: opsoProfile, privacy: opsoPrivacy,
  templateId: shortText(128).min(1), slug: z.string().trim().toLowerCase().regex(/^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/),
}).strict();
export const opsoDraft = z.object({
  id: z.string().regex(/^[A-Za-z0-9_-]{1,128}$/),
  expectedRevision: z.number().int().min(0), profile: opsoProfile,
  cardLocale: opsoLocale, privacy: opsoPrivacy,
  visibility: z.enum(["public", "unlisted", "private", "event_only"]),
}).strict();
export type OpsoDraft = z.infer<typeof opsoDraft>;
export type OpsoCard = {
  id: string; slug: string; status: string; visibility: string;
  draftRevision: number; publishedRevision: number; url: string | null;
  profile: OpsoProfile; cardLocale: OpsoLocale; privacy: OpsoPrivacy;
  templateId: string | null; updatedAt: string | null;
};
export type OpsoTemplate = { id: string; name: string; description: string; canCreate: boolean; website: boolean; accent: string };
export type OpsoTerms = { accepted: boolean; version: string; documentUrl: string };
export type OpsoIdentity = { id: string; email: string; name: string | null; workspaceId: string };

export function objectValue(value: unknown): Record<string, unknown> {
  if (typeof value === "string") { try { value = JSON.parse(value); } catch { return {}; } }
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
