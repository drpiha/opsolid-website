"use client";

import type { CardRenderProps } from "../shared/CardPrimitives";
import { Avatar, ContactRows, SocialLinks } from "../shared/CardPrimitives";

/**
 * Template #03 — Estate Brass (real estate / property).
 * Dark ink hero with brass accents, photo on right, crest at top.
 */
export function Template03({
  cardData,
  photoPath,
  brandPrimaryHex,
}: CardRenderProps) {
  const brass = brandPrimaryHex ?? "#C9A96A";
  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[32px] bg-ink text-white shadow-soft">
      <div className="px-7 pb-8 pt-10">
        <div className="flex items-center justify-between">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.25em]"
            style={{ color: brass }}
          >
            ESTATE · EXCLUSIVE
          </span>
          <Avatar
            photoPath={photoPath}
            name={cardData.name}
            size={72}
            className="ring-2 ring-white/10"
          />
        </div>

        <h1 className="mt-8 font-display text-[2.75rem] leading-[1] text-white">
          {cardData.name}
        </h1>
        {cardData.title && (
          <p
            className="mt-2 text-sm font-medium uppercase tracking-wider"
            style={{ color: brass }}
          >
            {cardData.title}
          </p>
        )}
        {cardData.company && (
          <p className="mt-1 text-sm text-white/70">{cardData.company}</p>
        )}
        {cardData.bio && (
          <p className="mt-5 text-sm leading-relaxed text-white/70">
            {cardData.bio}
          </p>
        )}
      </div>

      <div className="border-t border-white/10 px-5 py-5">
        <ContactRows cardData={cardData} variant="dark" />
      </div>

      {cardData.socials && (
        <div className="border-t border-white/10 px-7 py-5">
          <SocialLinks socials={cardData.socials} variant="dark" />
        </div>
      )}

      <div
        className="px-7 py-4 text-center text-[10px] font-medium uppercase tracking-widest"
        style={{ color: brass }}
      >
        opsolid.de · hosted in Frankfurt
      </div>
    </div>
  );
}
