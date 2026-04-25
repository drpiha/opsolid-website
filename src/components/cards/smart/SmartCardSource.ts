// =============================================================================
// SmartCardSource — visit-context query params (src, campaign, event, location).
//
// Captured once on the public card page from the URL, then propagated to:
//   - vCard NOTE field (so the saved contact remembers where it came from)
//   - lead form hidden inputs
//   - card-view analytics record (server-side, see /c/[slug]/page.tsx)
//
// Whitelist-validated to keep arbitrary user-controlled strings out of the
// vCard NOTE field. Anything outside the allowed character set is dropped.
// =============================================================================

export interface SmartCardSource {
  src?: string;
  campaign?: string;
  medium?: string;
  event?: string;
  location?: string;
  link?: string;
}

const ALLOWED = /^[A-Za-z0-9._\- ]{1,80}$/;

function clean(value: string | string[] | undefined): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed || !ALLOWED.test(trimmed)) return undefined;
  return trimmed;
}

export function readSourceFromSearchParams(
  raw: URLSearchParams | Record<string, string | string[] | undefined>,
): SmartCardSource {
  const get = (key: string) =>
    raw instanceof URLSearchParams ? raw.get(key) ?? undefined : raw[key];
  return {
    src: clean(get("src")),
    campaign: clean(get("campaign")),
    medium: clean(get("medium")),
    event: clean(get("event")),
    location: clean(get("location")),
    link: clean(get("link")),
  };
}

/** Pretty source label for UI / vCard NOTE — first non-empty, falls back to src. */
export function describeSource(s: SmartCardSource): string | undefined {
  if (s.event) return s.location ? `${s.event} — ${s.location}` : s.event;
  if (s.campaign) return s.campaign;
  if (s.src) return s.src;
  if (s.medium) return s.medium;
  return undefined;
}

/** Encode the source back to a query string for download links / forms. */
export function encodeSource(s: SmartCardSource): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(s)) {
    if (typeof value === "string" && value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
