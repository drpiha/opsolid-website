"use client";

import type { CardRenderProps } from "../shared/CardPrimitives";
import { Avatar, ContactRows, SocialLinks } from "../shared/CardPrimitives";

/**
 * Template #05 — Restaurant Noir.
 * Dark moody hero, menu-style layout with dividers.
 */
export function Template05({
  cardData,
  photoPath,
  brandPrimaryHex,
}: CardRenderProps) {
  const primary = brandPrimaryHex ?? "#D4A24C";
  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[32px] bg-[#141211] text-white shadow-soft">
      <div className="px-7 pb-8 pt-10 text-center">
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.25em]"
          style={{ color: primary }}
        >
          · RESTAURANT ·
        </span>
        <h1 className="mt-5 font-display text-[2.75rem] leading-[1.05]">
          {cardData.name}
        </h1>
        {cardData.title && (
          <p className="mt-2 text-sm text-white/60">{cardData.title}</p>
        )}
        {cardData.company && (
          <p
            className="mt-4 text-xs font-medium uppercase tracking-[0.35em]"
            style={{ color: primary }}
          >
            {cardData.company}
          </p>
        )}
        <div className="mt-5 flex justify-center">
          <Avatar photoPath={photoPath} name={cardData.name} size={80} />
        </div>
        {cardData.bio && (
          <p className="mt-5 text-sm italic leading-relaxed text-white/70">
            {cardData.bio}
          </p>
        )}
      </div>

      <div className="border-t border-white/10 px-5 py-5">
        <ContactRows cardData={cardData} variant="dark" />
      </div>

      {cardData.socials && (
        <div className="border-t border-white/10 px-7 py-5">
          <div className="flex justify-center">
            <SocialLinks socials={cardData.socials} variant="dark" />
          </div>
        </div>
      )}

      <div
        className="border-t border-white/10 px-7 py-4 text-center text-[10px] font-medium uppercase tracking-widest"
        style={{ color: primary }}
      >
        opsolid.de · curated
      </div>
    </div>
  );
}
