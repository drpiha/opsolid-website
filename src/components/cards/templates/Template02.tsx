"use client";

import type { CardRenderProps } from "../shared/CardPrimitives";
import { Avatar, ContactRows, SocialLinks } from "../shared/CardPrimitives";

/**
 * Template #02 — Warm Serif (creator / editorial).
 * Centered layout, oversized serif name, amber accent line.
 */
export function Template02({
  cardData,
  photoPath,
  brandPrimaryHex,
  brandAccentHex,
}: CardRenderProps) {
  const primary = brandPrimaryHex ?? "#E8A252"; // amber
  const accent = brandAccentHex ?? "#B8C48A"; // olive
  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[32px] bg-neutral-50 shadow-soft">
      <div
        className="h-20"
        style={{ background: `linear-gradient(180deg, ${primary}22, transparent)` }}
      />
      <div className="-mt-10 flex flex-col items-center px-7">
        <Avatar photoPath={photoPath} name={cardData.name} size={96} />
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.25em] mt-5"
          style={{ color: primary }}
        >
          CREATOR CARD
        </span>
        <h1 className="mt-2 text-center font-display text-[2.75rem] leading-[1] text-ink">
          {cardData.name}
        </h1>
        {(cardData.title || cardData.company) && (
          <p className="mt-3 text-center text-sm text-ink/60">
            {cardData.title}
            {cardData.title && cardData.company ? " — " : ""}
            {cardData.company}
          </p>
        )}
        <div
          className="mt-5 h-[2px] w-10"
          style={{ backgroundColor: accent }}
        />
        {cardData.bio && (
          <p className="mt-5 text-center text-sm italic leading-relaxed text-ink/70">
            “{cardData.bio}”
          </p>
        )}
      </div>

      <div className="mt-6 px-5">
        <ContactRows cardData={cardData} />
      </div>

      {cardData.socials && (
        <div className="mt-5 flex justify-center px-7 pb-7">
          <SocialLinks socials={cardData.socials} />
        </div>
      )}

      <div
        className="px-7 py-4 text-center text-[10px] font-medium uppercase tracking-widest"
        style={{ color: primary }}
      >
        opsolid.de · hand-designed
      </div>
    </div>
  );
}
