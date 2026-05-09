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
 */
function buildEmbedSrc(item: EmbedItem): string | null {
  try {
    const u = new URL(item.url);
    switch (item.kind) {
      case "youtube": {
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
