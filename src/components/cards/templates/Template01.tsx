"use client";

import type { CardRenderProps } from "../shared/CardPrimitives";
import { Avatar, ContactRows, SocialLinks } from "../shared/CardPrimitives";

/**
 * Template #01 — Minimal Mono.
 * Warm-graphite neutral palette. Left-aligned. Serif display name.
 */
export function Template01({
  cardData,
  photoPath,
  brandPrimaryHex,
}: CardRenderProps) {
  const accent = brandPrimaryHex ?? "#15120F";
  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[32px] bg-neutral-50 shadow-soft">
      <div className="px-7 pb-8 pt-10">
        <div className="flex items-end gap-4">
          <Avatar photoPath={photoPath} name={cardData.name} size={88} />
          <div className="mb-1">
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.25em] block"
              style={{ color: accent }}
            >
              OPSOLID · DIGITAL CARD
            </span>
          </div>
        </div>

        <h1 className="mt-6 font-display text-4xl leading-[1.05] text-ink">
          {cardData.name}
        </h1>
        {(cardData.title || cardData.company) && (
          <p className="mt-2 text-sm text-ink/70">
            {cardData.title}
            {cardData.title && cardData.company ? " · " : ""}
            {cardData.company}
          </p>
        )}
        {cardData.bio && (
          <p className="mt-4 text-sm leading-relaxed text-ink/70">
            {cardData.bio}
          </p>
        )}
      </div>

      <div className="border-t border-ink/10 bg-white/40 px-5 py-5">
        <ContactRows cardData={cardData} />
      </div>

      {cardData.socials && (
        <div className="border-t border-ink/10 px-7 py-5">
          <SocialLinks socials={cardData.socials} />
        </div>
      )}

      <div
        className="px-7 py-4 text-center text-[10px] font-medium uppercase tracking-widest"
        style={{ color: accent }}
      >
        opsolid.de · made in Frankfurt
      </div>
    </div>
  );
}
