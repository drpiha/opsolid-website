// =============================================================================
// SocialRow — the 8 social platforms supported by `cardData.socials`.
//
// Confirmed against the schema (src/lib/validation.ts → CardDataSchema.socials):
//   linkedin, instagram, x, tiktok, youtube, github, facebook, xing.
//
// Brand icons are inline SVG paths because the lucide-react version pinned in
// this project (1.7.0) doesn't ship social-brand glyphs — and we don't want
// to take on a second icon dependency for eight glyphs.
//
// Variants:
//   - "pill"  : default — capsule with platform label, used by Atelier / Editorial.
//   - "icon"  : icon-only round chip, used by RealEstate / Photographer.
//   - "tile"  : square tile with iconography, used by Studio / Athlete.
//
// Templates can pass `className` to fine-tune wrapper spacing without forking
// the implementation.
// =============================================================================

"use client";

import * as React from "react";
import type { CardData } from "@/lib/validation";

type SocialKey = keyof NonNullable<CardData["socials"]>;

type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
};

// --- Inline SVGs. Each glyph is the simplest stroke-based mark recognisable
//     for the brand. Drawn at viewBox 24 — match other lucide sizing. ---

const LinkedinIcon = ({ size = 16, strokeWidth = 1.8, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...rest}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 16, strokeWidth = 1.8, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...rest}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const XIcon = ({ size = 16, strokeWidth = 1.8, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...rest}
  >
    <path d="M18 4 6 20" />
    <path d="m6 4 12 16" />
  </svg>
);

const YoutubeIcon = ({ size = 16, strokeWidth = 1.8, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...rest}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33Z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const TiktokIcon = ({ size = 16, strokeWidth = 1.8, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...rest}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const GithubIcon = ({ size = 16, strokeWidth = 1.8, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...rest}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const FacebookIcon = ({ size = 16, strokeWidth = 1.8, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...rest}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z" />
  </svg>
);

const XingIcon = ({ size = 16, strokeWidth = 1.8, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...rest}
  >
    <path d="m4 7 4 5-5 7" />
    <path d="m11 4 9 16" />
  </svg>
);

interface SocialDef {
  key: SocialKey;
  label: string;
  Icon: React.FC<IconProps>;
}

// Order is intentional — most-used first so a card with three socials reads
// "LinkedIn / Instagram / X" rather than alphabetically scattered.
const SOCIAL_DEFS: SocialDef[] = [
  { key: "linkedin", label: "LinkedIn", Icon: LinkedinIcon },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "x", label: "X", Icon: XIcon },
  { key: "youtube", label: "YouTube", Icon: YoutubeIcon },
  { key: "tiktok", label: "TikTok", Icon: TiktokIcon },
  { key: "github", label: "GitHub", Icon: GithubIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "xing", label: "Xing", Icon: XingIcon },
];

export type SocialRowVariant = "pill" | "icon" | "tile";

export interface SocialRowProps {
  socials: NonNullable<CardData["socials"]>;
  variant?: SocialRowVariant;
  /** Hex applied to icon-tint and active border. Defaults to ink. */
  accentHex?: string;
  /** Extra classes on each social link. */
  itemClassName?: string;
  /** Outer wrapper classes. */
  className?: string;
}

export function SocialRow({
  socials,
  variant = "pill",
  accentHex,
  itemClassName,
  className,
}: SocialRowProps) {
  const items = SOCIAL_DEFS.filter((def) => {
    const v = (socials as Record<string, string | undefined>)[def.key];
    return typeof v === "string" && v.length > 0;
  });
  if (items.length === 0) return null;

  if (variant === "icon") {
    return (
      <div className={className ?? "flex flex-wrap gap-2"}>
        {items.map(({ key, label, Icon }) => {
          const href = (socials as Record<string, string>)[key];
          return (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-line bg-bg-2 text-ink transition-all hover:-translate-y-px hover:border-line-firm hover:bg-bg-3 ${itemClassName ?? ""}`}
              style={accentHex ? { color: accentHex } : undefined}
            >
              <Icon size={15} strokeWidth={1.8} />
            </a>
          );
        })}
      </div>
    );
  }

  if (variant === "tile") {
    return (
      <div className={className ?? "grid grid-cols-4 gap-2"}>
        {items.map(({ key, label, Icon }) => {
          const href = (socials as Record<string, string>)[key];
          return (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={`group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border border-line bg-bg-2 text-ink transition-all hover:-translate-y-0.5 hover:border-line-firm hover:bg-bg-3 ${itemClassName ?? ""}`}
            >
              <Icon
                size={18}
                strokeWidth={1.8}
                style={accentHex ? { color: accentHex } : undefined}
              />
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-400 group-hover:text-ink">
                {label}
              </span>
            </a>
          );
        })}
      </div>
    );
  }

  // pill
  return (
    <div className={className ?? "flex flex-wrap gap-2"}>
      {items.map(({ key, label, Icon }) => {
        const href = (socials as Record<string, string>)[key];
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-full border border-line bg-bg-2 px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-line-firm hover:bg-bg-3 ${itemClassName ?? ""}`}
          >
            <Icon
              size={13}
              strokeWidth={2}
              style={accentHex ? { color: accentHex } : undefined}
            />
            {label}
          </a>
        );
      })}
    </div>
  );
}
