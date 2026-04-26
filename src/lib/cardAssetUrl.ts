// =============================================================================
// Shared asset-url resolver for v2 templates.
//
// Accepts: absolute URLs (http/https), origin-relative paths (/foo.png),
// data URLs (data:image/...), blob URLs (blob:http://...), and relative paths.
//
// Phase 7.8 fix: previously each template duplicated this helper and rejected
// data: / blob: protocols, prefixing them with `/` and breaking the live
// preview when the order form passed an instant FileReader preview.
// =============================================================================

export function resolveAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("data:")) return path;
  if (path.startsWith("blob:")) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return `/${path}`;
}
