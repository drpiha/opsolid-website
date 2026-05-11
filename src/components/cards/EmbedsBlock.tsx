// =============================================================================
// EmbedsBlock — M3 (Carrd amendment).
//
// Renders the curated embeds (`cardData.embeds`) as sandboxed iframes for the
// 5 whitelisted hosts only. Server validation guarantees `kind` ∈ the
// allowlist, but we re-derive the iframe `src` from the `url` here using the
// same kind→host mapping so a malicious card payload can't smuggle a script
// tag past the renderer.
//
// Critical security rules:
//   - Never use `<iframe srcdoc>` (would execute attacker-supplied HTML).
//   - Never trust `embed.url` directly; we derive a known-good `src` per kind.
//   - Always set `sandbox` to a minimal allowlist
//     (`allow-scripts allow-same-origin allow-presentation`).
//   - `referrerpolicy="no-referrer"` so the embed host can't see the visitor's
//     full URL (privacy hygiene).
// =============================================================================

import type { ReactElement } from "react";

type EmbedKind =
  | "youtube"
  | "vimeo"
  | "spotify"
  | "soundcloud"
  | "calendly";

// ---------------------------------------------------------------------------
// YouTube URL classifier helpers.
//
// `buildEmbedSrc` previously returned null for channel / playlist URLs
// (e.g. youtube.com/@channel, /c/, /user/, /playlist?list=…), which caused
// the iframe slot to be silently dropped. We now classify each YouTube URL
// into one of three buckets:
//   • "video"   — has a resolvable video ID → embed iframe (existing path)
//   • "channel" — channel / user / handle / playlist URL → link-card
//   • null      — unrecognised YouTube URL → skip
// ---------------------------------------------------------------------------
type YouTubeKind = "video" | "channel" | null;

function classifyYouTubeUrl(u: URL): YouTubeKind {
  const path = u.pathname;
  // video shortener: youtu.be/<id>
  if (u.hostname.includes("youtu.be")) return "video";
  // ?v= watch URL
  if (u.searchParams.has("v")) return "video";
  // /shorts/<id>
  if (path.startsWith("/shorts/")) return "video";
  // /embed/<id>  (already an embed URL)
  if (path.startsWith("/embed/")) return "video";
  // Channel / handle / user / custom channel URLs
  if (
    path.startsWith("/@") ||
    path.startsWith("/c/") ||
    path.startsWith("/channel/") ||
    path.startsWith("/user/")
  ) {
    return "channel";
  }
  // Playlist
  if (u.searchParams.has("list")) return "channel";
  return null;
}

interface EmbedItem {
  kind: EmbedKind;
  url: string;
}

interface Props {
  embeds: unknown;
  /** Card accent color for the section heading underline. */
  accentHex?: string;
  /** Localised section heading. */
  heading?: string;
}

const HOST_VALIDATORS: Record<EmbedKind, RegExp> = {
  youtube: /(?:^|\.)(youtube\.com|youtu\.be|youtube-nocookie\.com)$/i,
  vimeo: /(?:^|\.)(vimeo\.com|player\.vimeo\.com)$/i,
  spotify: /(?:^|\.)(spotify\.com|open\.spotify\.com)$/i,
  soundcloud: /(?:^|\.)(soundcloud\.com|w\.soundcloud\.com)$/i,
  calendly: /(?:^|\.)(calendly\.com)$/i,
};

function pickEmbeds(v: unknown): EmbedItem[] {
  if (!Array.isArray(v)) return [];
  const out: EmbedItem[] = [];
  for (const raw of v) {
    if (!raw || typeof raw !== "object") continue;
    const o = raw as Record<string, unknown>;
    const kind = o.kind as EmbedKind | undefined;
    const url = typeof o.url === "string" ? o.url : "";
    if (!url) continue;
    if (!kind || !HOST_VALIDATORS[kind]) continue;
    try {
      const host = new URL(url).hostname.toLowerCase();
      if (!HOST_VALIDATORS[kind].test(host)) continue;
    } catch {
      continue;
    }
    out.push({ kind, url });
    if (out.length >= 3) break;
  }
  return out;
}

/**
 * Map a (kind, url) pair to a canonical embed src. Returns null when the URL
 * shape doesn't resolve to a valid embed page (we don't render anything in
 * that case, instead of rendering an iframe to the home page of the host).
 *
 * For YouTube channel / playlist URLs this returns null intentionally —
 * those are rendered as link-cards by the EmbedsBlock render loop instead.
 */
function buildEmbedSrc(item: EmbedItem): string | null {
  try {
    const u = new URL(item.url);
    switch (item.kind) {
      case "youtube": {
        const ytKind = classifyYouTubeUrl(u);
        if (ytKind !== "video") return null; // channel → handled by link-card path
        let id: string | null = null;
        if (u.hostname.includes("youtu.be")) {
          id = u.pathname.replace(/^\//, "").split("/")[0] || null;
        } else if (u.searchParams.has("v")) {
          id = u.searchParams.get("v");
        } else if (u.pathname.startsWith("/shorts/")) {
          id = u.pathname.split("/shorts/")[1]?.split("/")[0] ?? null;
        } else if (u.pathname.startsWith("/embed/")) {
          id = u.pathname.split("/embed/")[1]?.split("/")[0] ?? null;
        }
        if (!id) return null;
        return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
      }
      case "vimeo": {
        let id: string | null = null;
        if (u.hostname === "player.vimeo.com") {
          // already an embed URL
          id = u.pathname.split("/video/")[1]?.split("/")[0] ?? null;
        } else {
          // vimeo.com/<id>
          id = u.pathname.replace(/^\//, "").split("/")[0] || null;
        }
        if (!id || !/^\d+$/.test(id)) return null;
        return `https://player.vimeo.com/video/${id}`;
      }
      case "spotify": {
        // open.spotify.com/<type>/<id> → open.spotify.com/embed/<type>/<id>
        const parts = u.pathname.replace(/^\//, "").split("/");
        if (parts.length < 2) return null;
        const [type, id] = parts;
        if (!/^[A-Za-z0-9]+$/.test(id)) return null;
        return `https://open.spotify.com/embed/${encodeURIComponent(type)}/${encodeURIComponent(id)}`;
      }
      case "soundcloud": {
        // soundcloud requires the oEmbed / w.soundcloud iframe; we use the
        // canonical w.soundcloud.com player which accepts the original URL.
        return `https://w.soundcloud.com/player/?url=${encodeURIComponent(item.url)}&color=%23C27940&auto_play=false`;
      }
      case "calendly": {
        // Calendly serves both the visitor page and the embed at the same URL.
        return item.url;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function EmbedsBlock({ embeds, accentHex, heading }: Props): ReactElement | null {
  const items = pickEmbeds(embeds);
  if (items.length === 0) return null;

  return (
    <section className="mt-6">
      {heading ? (
        <h2
          className="mb-3 text-xs font-semibold uppercase tracking-[0.6px] text-ink-300"
          style={accentHex ? { borderBottom: `1px solid ${accentHex}40`, paddingBottom: 6 } : undefined}
        >
          {heading}
        </h2>
      ) : null}
      <div className="flex flex-col gap-4">
        {items.map((it, i) => {
          const src = buildEmbedSrc(it);

          // YouTube channel / playlist: no iframe available — render a styled
          // link-card that opens the channel page in a new tab.
          if (!src && it.kind === "youtube") {
            let channelKind: YouTubeKind = null;
            try {
              channelKind = classifyYouTubeUrl(new URL(it.url));
            } catch {
              /* ignore malformed URL — already validated in pickEmbeds */
            }
            if (channelKind !== "channel") return null;

            // Derive a readable label from the URL path.
            let channelLabel = it.url;
            try {
              const u = new URL(it.url);
              const seg = u.pathname.replace(/^\//, "").split("?")[0];
              channelLabel = seg || u.hostname;
            } catch {
              /* keep full URL as fallback */
            }

            return (
              <a
                key={`${it.kind}-channel-${i}`}
                href={it.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 overflow-hidden rounded-xl border border-line bg-bg-1 px-4 py-4 transition hover:border-line-firm hover:bg-bg-2"
              >
                {/* YouTube logo mark */}
                <span
                  aria-hidden
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#FF0000]/10 text-[#FF0000]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink">
                    {channelLabel}
                  </span>
                  <span className="block text-xs text-ink-400">YouTube-Kanal öffnen</span>
                </span>
                <span aria-hidden className="text-ink-400">→</span>
              </a>
            );
          }

          if (!src) return null;

          // Keep aspect ratio sane: video embeds get 16/9, others taller.
          const aspect =
            it.kind === "youtube" || it.kind === "vimeo"
              ? "aspect-video"
              : it.kind === "calendly"
                ? "aspect-[3/4]"
                : "aspect-[4/3]";
          return (
            <div
              key={`${it.kind}-${i}-${src}`}
              className={`overflow-hidden rounded-xl border border-line bg-bg-1 ${aspect}`}
            >
              <iframe
                src={src}
                title={`${it.kind} embed`}
                loading="lazy"
                referrerPolicy="no-referrer"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-scripts allow-same-origin allow-presentation"
                className="h-full w-full"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
