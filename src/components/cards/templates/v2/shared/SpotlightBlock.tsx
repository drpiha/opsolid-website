// =============================================================================
// SpotlightBlock — Faz 9 "Şu an / Now" panel.
//
// A GENERAL, owner-curated attention area rendered high in the UniversalBlocks
// stack (right below the template's identity / profile block). It is the spot a
// card owner uses to share something momentary — a short paragraph and/or a
// single link — and it is deliberately styled to STAND OUT (accent-tinted
// surface, live pulsing dot, prominent CTA) so a visitor's eye lands on it and
// asks "what's here right now?".
//
// Server-safe (no "use client", no state) like AboutBlock/StatsBlock so it works
// untouched in both the public Server-Component page and the client editor
// preview. Reads cardData.spotlight and returns null unless it is enabled AND
// carries a body or a link — so legacy cards render exactly as before.
// =============================================================================

import { linkify } from "@/lib/linkify";
import type { CardSpotlight } from "@/lib/validation";
import type { BlockLocale } from "./universalHeadings";

interface Props {
  spotlight: CardSpotlight | undefined;
  /** Localized eyebrow label ("Şu an" / "Now" / "Aktuell"), owner-overridable. */
  heading: string;
  /** Brand accent — drives the panel tint, the live dot and the title rule. */
  accentHex?: string | null;
  /** Brand primary — drives the link CTA fill. Falls back to the accent. */
  primaryHex?: string | null;
  /** Surface tone of the surrounding template. */
  tone?: "light" | "dark";
  /** Card display language — drives the "updated X ago" freshness chip. */
  locale?: BlockLocale;
}

/** #RGB / #RRGGBB → "r, g, b" channel string for rgba() tints. Null on garbage. */
function rgbChannels(hex: string | null | undefined): string | null {
  if (!hex) return null;
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

/** Localized "updated X ago" — Intl.RelativeTimeFormat keeps plurals correct. */
function freshness(iso: string | undefined, locale: BlockLocale): string | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  const diff = Math.round((t - Date.now()) / 1000); // negative = past
  const abs = Math.abs(diff);
  try {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    if (abs < 60) return rtf.format(Math.round(diff), "second");
    if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
    if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
    if (abs < 2592000) return rtf.format(Math.round(diff / 86400), "day");
    return rtf.format(Math.round(diff / 2592000), "month");
  } catch {
    return null;
  }
}

/** Bare host of a URL for the default CTA label when none is provided. */
function hostLabel(rawUrl: string): string {
  try {
    return new URL(rawUrl).host.replace(/^www\./, "");
  } catch {
    return rawUrl;
  }
}

export function SpotlightBlock({
  spotlight,
  heading,
  accentHex,
  primaryHex,
  tone = "light",
  locale = "de",
}: Props) {
  if (!spotlight || spotlight.enabled === false) return null;

  const body = spotlight.body?.trim() || "";
  const linkUrl = spotlight.linkUrl?.trim() || "";
  if (!body && !linkUrl) return null;

  const isDark = tone === "dark";
  const accent = accentHex || "#C27940";
  const cta = primaryHex || accent;
  const accentRgb = rgbChannels(accent) ?? "194, 121, 64";
  const updated = freshness(spotlight.updatedAt, locale);
  const ctaLabel = spotlight.linkLabel?.trim() || (linkUrl ? hostLabel(linkUrl) : "");

  return (
    <section className={["px-7 py-6", isDark ? "" : ""].join(" ")}>
      <div
        className={[
          "relative overflow-hidden rounded-2xl px-5 py-4",
          isDark ? "ring-1 ring-white/15" : "ring-1",
        ].join(" ")}
        style={{
          background: isDark
            ? `rgba(${accentRgb}, 0.14)`
            : `rgba(${accentRgb}, 0.07)`,
          // Light surfaces get a colored hairline; dark uses the white ring above.
          ...(isDark ? {} : { boxShadow: `inset 0 0 0 1px rgba(${accentRgb}, 0.32)` }),
        }}
      >
        {/* Accent spine — the signature "look here" thread down the left edge. */}
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-1"
          style={{ background: accent }}
        />

        <header className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            {/* Live pulsing dot — reads as "current / right now". */}
            <span className="relative inline-flex h-2 w-2" aria-hidden>
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping"
                style={{ background: accent }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: accent }}
              />
            </span>
            <h3
              className="text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{
                color: accent,
                fontFamily:
                  "var(--tpl-font-display, var(--card-display-font, inherit))",
              }}
            >
              {heading}
            </h3>
          </span>
          {updated ? (
            <span
              className={[
                "shrink-0 text-[10px] tabular-nums",
                isDark ? "text-white/45" : "text-black/40",
              ].join(" ")}
            >
              {updated}
            </span>
          ) : null}
        </header>

        {body ? (
          <p
            className={[
              "mt-2.5 whitespace-pre-line text-[14px] leading-[1.6]",
              isDark ? "text-white/85" : "text-black/75",
            ].join(" ")}
            style={{
              fontFamily:
                "var(--tpl-font-body, var(--card-body-font, inherit))",
            }}
          >
            {linkify(body)}
          </p>
        ) : null}

        {linkUrl ? (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3.5 inline-flex max-w-full items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:opacity-90"
            style={{ background: cta }}
          >
            <span className="truncate">{ctaLabel}</span>
            <span aria-hidden className="text-[15px] leading-none">
              →
            </span>
          </a>
        ) : null}
      </div>
    </section>
  );
}
