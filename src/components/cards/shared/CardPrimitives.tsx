"use client";

import Image from "next/image";
import { Phone, Mail, Globe, MapPin, MessageCircle } from "lucide-react";
import type { CardData } from "@/lib/validation";

export interface CardRenderProps {
  cardData: CardData;
  photoPath?: string | null;
  logoPath?: string | null;
  brandPrimaryHex?: string | null;
  brandAccentHex?: string | null;
}

// -----------------------------------------------------------------------------
// Social links row — renders only the provided platforms. Shared across templates.
// -----------------------------------------------------------------------------
export function SocialLinks({
  socials,
  variant = "light",
}: {
  socials: CardData["socials"];
  variant?: "light" | "dark";
}) {
  if (!socials) return null;
  const entries = (
    [
      ["LinkedIn", socials.linkedin ?? ""],
      ["Instagram", socials.instagram ?? ""],
      ["X", socials.x ?? ""],
      ["TikTok", socials.tiktok ?? ""],
      ["YouTube", socials.youtube ?? ""],
      ["GitHub", socials.github ?? ""],
      ["Facebook", socials.facebook ?? ""],
    ] as const
  ).filter(([, url]) => !!url);
  if (entries.length === 0) return null;

  const chipBase =
    variant === "dark"
      ? "border-white/20 bg-white/5 text-white hover:bg-white/10"
      : "border-ink/15 bg-white text-ink hover:bg-ink/5";

  return (
    <div className="flex flex-wrap gap-2">
      {entries.map(([label, url]) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${chipBase}`}
        >
          {label}
        </a>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Contact action rows — tel:, mailto:, https: with a consistent icon+label layout.
// -----------------------------------------------------------------------------
export function ContactRows({
  cardData,
  variant = "light",
}: {
  cardData: CardData;
  variant?: "light" | "dark";
}) {
  const base =
    variant === "dark"
      ? "border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08]"
      : "border-ink/10 bg-white text-ink hover:bg-ink/5";
  const sub = variant === "dark" ? "text-white/60" : "text-ink/60";

  const Row = ({
    icon,
    label,
    value,
    href,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    href: string;
  }) => (
    <a
      href={href}
      className={`flex items-center gap-4 rounded-2xl border px-4 py-3.5 transition-colors ${base}`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 text-ink">
        {icon}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${sub}`}>
          {label}
        </span>
        <span className="truncate text-sm font-medium">{value}</span>
      </span>
    </a>
  );

  return (
    <div className="grid gap-2">
      {cardData.phone && (
        <Row
          icon={<Phone size={16} strokeWidth={2} />}
          label="Telefon"
          value={cardData.phone}
          href={`tel:${cardData.phone.replace(/\s/g, "")}`}
        />
      )}
      {cardData.whatsapp && (
        <Row
          icon={<MessageCircle size={16} strokeWidth={2} />}
          label="WhatsApp"
          value={cardData.whatsapp}
          href={`https://wa.me/${cardData.whatsapp.replace(/[^0-9]/g, "")}`}
        />
      )}
      {cardData.email && (
        <Row
          icon={<Mail size={16} strokeWidth={2} />}
          label="E-Mail"
          value={cardData.email}
          href={`mailto:${cardData.email}`}
        />
      )}
      {cardData.website && (
        <Row
          icon={<Globe size={16} strokeWidth={2} />}
          label="Website"
          value={cardData.website.replace(/^https?:\/\//, "")}
          href={cardData.website}
        />
      )}
      {cardData.address && (
        <Row
          icon={<MapPin size={16} strokeWidth={2} />}
          label="Adresse"
          value={cardData.address}
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cardData.address)}`}
        />
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Avatar — circular photo or monogram fallback.
// -----------------------------------------------------------------------------
export function Avatar({
  photoPath,
  name,
  size = 96,
  className = "",
}: {
  photoPath?: string | null;
  name: string;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  if (photoPath) {
    return (
      <div
        className={`relative overflow-hidden rounded-full ring-4 ring-white ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={photoPath}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-ink/10 font-serif text-ink ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials || "•"}
    </div>
  );
}
