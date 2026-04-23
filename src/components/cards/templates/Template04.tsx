"use client";

import type { CardRenderProps } from "../shared/CardPrimitives";
import { Avatar, ContactRows, SocialLinks } from "../shared/CardPrimitives";

/**
 * Template #04 — Atelier Clean (salon / clinic / atelier).
 * Pale backdrop, circular photo centered, soft type.
 */
export function Template04({
  cardData,
  photoPath,
  brandPrimaryHex,
  brandAccentHex,
}: CardRenderProps) {
  const primary = brandPrimaryHex ?? "#7A6E5E";
  const accent = brandAccentHex ?? "#E8DFD1";
  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[32px] shadow-soft">
      <div
        className="px-7 pb-8 pt-10 text-center"
        style={{ background: accent }}
      >
        <div className="flex flex-col items-center">
          <Avatar photoPath={photoPath} name={cardData.name} size={104} />
          <h1 className="mt-6 font-display text-3xl leading-tight text-ink">
            {cardData.name}
          </h1>
          {(cardData.title || cardData.company) && (
            <p className="mt-2 text-sm text-ink/60">
              {cardData.title}
              {cardData.title && cardData.company ? " · " : ""}
              {cardData.company}
            </p>
          )}
          {cardData.bio && (
            <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-ink/70">
              {cardData.bio}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white px-5 py-6">
        <ContactRows cardData={cardData} />
      </div>

      {cardData.socials && (
        <div className="bg-white px-7 pb-7">
          <div className="flex justify-center">
            <SocialLinks socials={cardData.socials} />
          </div>
        </div>
      )}

      <div
        className="px-7 py-4 text-center text-[10px] font-medium uppercase tracking-widest"
        style={{ color: primary }}
      >
        opsolid.de · atelier
      </div>
    </div>
  );
}
