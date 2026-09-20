/** Share crawlers never have permission to unlock private/password cards. */
export function canPublishCardPreview(order: {
  status: string;
  visibility: string;
  cardData: unknown;
} | null): boolean {
  if (!order || order.status !== "PUBLISHED" || order.visibility === "private") return false;
  const data = order.cardData;
  return !(data && typeof data === "object" && "password" in data
    && typeof data.password === "string" && data.password.length > 0);
}
