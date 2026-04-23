/**
 * Produces a URL-safe slug from a display name, appending a short random
 * suffix for uniqueness. Example: "Anna Fischer" -> "anna-fischer-x7k"
 */
export function buildSlug(name: string, seed?: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  const suffix =
    seed?.slice(-4) ??
    Math.random().toString(36).replace(/[^a-z0-9]/g, "").slice(-4);

  const core = base || "card";
  return `${core}-${suffix}`;
}
