import { constantTimeEquals } from "@/lib/constantTime";
import { hasValidUnlockCookie } from "./unlock-cookie";

type PublicCardAccessRecord = {
  status: string;
  visibility: string;
  slug?: string | null;
  cardData: unknown;
  editToken?: string | null;
};

export function cardPasswordHash(cardData: unknown): string | null {
  if (!cardData || typeof cardData !== "object" || !("password" in cardData)) return null;
  return typeof cardData.password === "string" && cardData.password.length > 0 ? cardData.password : null;
}

/** One read boundary for public HTML, contact exports and public JSON. */
export function publicCardContentAccess(order: PublicCardAccessRecord | null, proof: {
  cookieHeader?: string | null;
  ownerToken?: string | null;
} = {}): "allowed" | "not_found" | "password_required" {
  if (!order || order.status !== "PUBLISHED" || order.visibility === "private") return "not_found";
  const passwordHash = cardPasswordHash(order.cardData);
  if (!passwordHash) return "allowed";
  if (proof.ownerToken && order.editToken && constantTimeEquals(proof.ownerToken, order.editToken)) return "allowed";
  return order.slug && hasValidUnlockCookie(proof.cookieHeader, order.slug, passwordHash) ? "allowed" : "password_required";
}

export function publicCardContentCacheControl(cardData: unknown, publicPolicy: string): string {
  return cardPasswordHash(cardData) ? "private, no-store" : publicPolicy;
}
