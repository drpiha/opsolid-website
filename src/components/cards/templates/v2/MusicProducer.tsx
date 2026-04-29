"use client";

// =============================================================================
// MusicProducer — v2 template (id=20, key="music-producer").
//
// Sector: music producer / DJ / electronic artist (modern streaming era).
// Distinct from Studio (Berlin underground hairlines) — this is the streaming-
// first artist deck: large neon glow, animated equaliser bars, "LISTEN"
// marquee that drives traffic to Spotify / SoundCloud / YouTube. Pure-black
// surface, brand-color rim glow, geometric Space Grotesk display.
//
// Locked design choices (do not parameterise — only colours respond to brand):
//   - Pure-black hero with primary-color rim glow (radial bleed from top).
//   - Animated equaliser strip (12 bars) below name — staggered scaleY.
//   - LISTEN ON section is the hero CTA: Spotify / Apple Music / SoundCloud /
//     YouTube as 2-col tiles with glow border.
//   - Latest releases (services repurposed) — track-list with catalogue number
//     and BPM-style mono labels.
//   - Vinyl groove SVG accent in section dividers.
//   - Single font family: Space Grotesk (300/400/500/700) used for both
//     display + body, per spec — geometric, modern, electronic.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Calendar,
  Disc3,
  Mail,
  MessageCircle,
  Phone,
  Play,
  Shield,
  UserPlus,
  Volume2,
  type LucideIcon,
} from "lucide-react";

import { encodeSource, describeSource } from "@/components/cards/smart/SmartCardSource";
import { getSectorPreset } from "@/config/card-sectors";
import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { TemplateProps, TemplateRegistryEntry, SampleData } from "./types";

// -----------------------------------------------------------------------------
// Locked defaults — cyan / violet electric duo. Override via brandPrimaryHex.
// -----------------------------------------------------------------------------
const LOCKED_PRIMARY = "#06b6d4"; // cyan glow
const LOCKED_ACCENT = "#a855f7"; // violet

// -----------------------------------------------------------------------------
// Contrast helper — picks readable text colour for a given hex background.
// Used for any pill / button whose background uses brandPrimary or accent.
// -----------------------------------------------------------------------------
function readableTextOn(hex: string | null | undefined): string {
  if (!hex) return "#1a1a1a";
  const h = hex.replace("#", "");
  const r = parseInt(h.substr(0, 2), 16);
  const g = parseInt(h.substr(2, 2), 16);
  const b = parseInt(h.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#1a1a1a" : "#ffffff";
}

function resolveAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("data:") || path.startsWith("blob:")) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return `/${path}`;
}

function digitsOnly(value: string): string {
  return value.replace(/[^+0-9]/g, "");
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "•";
  if (parts.length === 1) return (parts[0][0] ?? "•").toUpperCase();
  return (
    (parts[0][0] ?? "").toUpperCase() + (parts[parts.length - 1][0] ?? "").toUpperCase()
  );
}

interface MpCopy {
  saveContact: string;
  callNow: string;
  whatsapp: string;
  email: string;
  book: string;
  listenOn: string;
  releases: string;
  about: string;
  contact: string;
  upcoming: string;
  social: string;
  walletLabel: string;
  bookingCta: string;
  bookingHint: string;
  impressum: string;
  privacy: string;
  poweredBy: string;
  listen: string;
  nowPlaying: string;
  share: string;
}

const COPY: Record<"de" | "en" | "tr", MpCopy> = {
  de: {
    saveContact: "Speichern",
    callNow: "Anrufen",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    book: "Booking",
    listenOn: "Anhören auf",
    releases: "Neueste Releases",
    about: "Über",
    contact: "Kontakt",
    upcoming: "Kommende Shows",
    social: "Social",
    walletLabel: "Auf Smartphone speichern",
    bookingCta: "Booking-Anfrage",
    bookingHint: "Für Clubs, Festivals & Private Bookings",
    impressum: "Impressum",
    privacy: "Datenschutz",
    poweredBy: "Powered by",
    listen: "Anhören",
    nowPlaying: "Jetzt im Stream",
    share: "Teilen",
  },
  en: {
    saveContact: "Save contact",
    callNow: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    book: "Booking",
    listenOn: "Listen on",
    releases: "Latest releases",
    about: "About",
    contact: "Contact",
    upcoming: "Upcoming shows",
    social: "Social",
    walletLabel: "Add to wallet",
    bookingCta: "Booking enquiry",
    bookingHint: "For clubs, festivals and private bookings",
    impressum: "Imprint",
    privacy: "Privacy",
    poweredBy: "Powered by",
    listen: "Listen",
    nowPlaying: "Now streaming",
    share: "Share",
  },
  tr: {
    saveContact: "Rehbere kaydet",
    callNow: "Ara",
    whatsapp: "WhatsApp",
    email: "E-posta",
    book: "Booking",
    listenOn: "Dinle",
    releases: "Yeni çıkanlar",
    about: "Hakkında",
    contact: "İletişim",
    upcoming: "Yaklaşan etkinlikler",
    social: "Sosyal",
    walletLabel: "Cüzdana ekle",
    bookingCta: "Booking talebi",
    bookingHint: "Kulüpler, festivaller ve özel etkinlikler",
    impressum: "Künye",
    privacy: "Gizlilik",
    poweredBy: "Powered by",
    listen: "Dinle",
    nowPlaying: "Şu an çalıyor",
    share: "Paylaş",
  },
};

// -----------------------------------------------------------------------------
// Streaming platform inference. We sniff customButtons for known hosts so the
// "Listen on" tiles render the right brand without extra schema.
// -----------------------------------------------------------------------------
type StreamPlatform = "spotify" | "apple" | "soundcloud" | "youtube" | "bandcamp" | "tidal" | "other";

function inferStreamPlatform(href: string): StreamPlatform {
  const u = href.toLowerCase();
  if (u.includes("spotify.")) return "spotify";
  if (u.includes("music.apple.") || u.includes("itunes.")) return "apple";
  if (u.includes("soundcloud.")) return "soundcloud";
  if (u.includes("youtube.") || u.includes("youtu.be")) return "youtube";
  if (u.includes("bandcamp.")) return "bandcamp";
  if (u.includes("tidal.")) return "tidal";
  return "other";
}

const PLATFORM_LABEL: Record<StreamPlatform, string> = {
  spotify: "Spotify",
  apple: "Apple Music",
  soundcloud: "SoundCloud",
  youtube: "YouTube",
  bandcamp: "Bandcamp",
  tidal: "Tidal",
  other: "Listen",
};

export function MusicProducer({
  slug,
  cardData,
  locale = "de",
  photoPath,
  logoPath,
  brandPrimaryHex,
  brandAccentHex,
  source,
  siteUrl,
  walletSlot,
}: TemplateProps) {
  const t = COPY[locale] ?? COPY.de;

  const sector = getSectorPreset(cardData.sectorKey);
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;
  const onPrimary = readableTextOn(primary);
  const onAccent = readableTextOn(accent);

  const photoUrl = resolveAssetUrl(photoPath);
  const logoUrl = resolveAssetUrl(logoPath);
  const initials = getInitials(cardData.name);

  const services =
    cardData.services && cardData.services.length > 0
      ? cardData.services
      : sector?.services;

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  // Releases — up to 5 services rendered as tracks.
  const releases = (services ?? []).slice(0, 5);

  // Streaming links from customButtons — top 4.
  const streamLinks = (cardData.customButtons ?? []).slice(0, 4).map((btn) => ({
    label: btn.label,
    href: btn.href,
    platform: inferStreamPlatform(btn.href),
  }));

  // Upcoming shows — repurpose testimonials (author=venue, role=date, quote=city).
  const shows = (cardData.testimonials ?? []).slice(0, 4);

  return (
    <article
      data-template="music-producer"
      className={`mp-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] bg-black text-white/85 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.85),0_8px_22px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/5`}
      style={
        {
          ["--mp-primary" as string]: primary,
          ["--mp-accent" as string]: accent,
          ["--mp-on-primary" as string]: onPrimary,
          ["--mp-on-accent" as string]: onAccent,
          ["--card-primary" as string]: primary,
          ["--card-accent" as string]: accent,
          ["--font-mp-display" as string]: "'Space Grotesk', system-ui, sans-serif",
          fontFamily: "var(--font-mp-display), 'Space Grotesk', system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .mp-card {
          font-family:var(--tpl-font-body,  var(--font-mp-display), "Space Grotesk", system-ui, sans-serif);
          line-height: 1.55;
          letter-spacing: -0.005em;
        }
        .mp-card .mp-display {
          font-family:var(--tpl-font-body,  var(--font-mp-display), "Space Grotesk", system-ui, sans-serif);
          font-weight: 700;
          letter-spacing: -0.035em;
          line-height: 0.92;
        }
        .mp-card .mp-mono {
          font-family:var(--tpl-font-body,  var(--font-mp-display), "Space Grotesk", system-ui, sans-serif);
          letter-spacing: 0.32em;
          text-transform: uppercase;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }
        @keyframes mp-eq-bar {
          0%, 100% { transform: scaleY(0.25); }
          50% { transform: scaleY(1); }
        }
        .mp-card .mp-eq-bar {
          transform-origin: 50% 100%;
          animation: mp-eq-bar 1.1s ease-in-out infinite;
        }
        @keyframes mp-glow-pulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.04); }
        }
        .mp-card .mp-glow-pulse {
          animation: mp-glow-pulse 3.6s ease-in-out infinite;
        }
        @keyframes mp-spin-slow {
          to { transform: rotate(360deg); }
        }
        .mp-card .mp-vinyl {
          animation: mp-spin-slow 14s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .mp-card .mp-eq-bar,
          .mp-card .mp-glow-pulse,
          .mp-card .mp-vinyl {
            animation: none;
          }
        }
      `}</style>

      <Hero
        photoUrl={photoUrl}
        logoUrl={logoUrl}
        initials={initials}
        company={cardData.company}
        name={cardData.name}
        title={cardData.position || cardData.title}
        primary={primary}
        accent={accent}
        sectorBadge={sector?.name}
        sourceLabel={sourceLabel}
        translations={t}
      />

      <QuickActionStrip
        slug={slug}
        sourceQs={sourceQs}
        phoneDigits={phoneDigits}
        waDigits={waDigits}
        email={cardData.email}
        bookingUrl={cardData.bookingUrl}
        primary={primary}
        accent={accent}
        onPrimary={onPrimary}
        onAccent={onAccent}
        translations={t}
      />

      {streamLinks.length > 0 && (
        <ListenOnSection
          items={streamLinks}
          primary={primary}
          accent={accent}
          translations={t}
        />
      )}

      {cardData.bio && (
        <Section title={t.about} accent={accent}>
          <p className="text-[14px] leading-[1.85] text-white/72">{cardData.bio}</p>
        </Section>
      )}

      {releases.length > 0 && (
        <ReleasesList
          items={releases}
          accent={accent}
          primary={primary}
          title={t.releases}
        />
      )}

      {shows.length > 0 && (
        <ShowsList items={shows} accent={accent} title={t.upcoming} />
      )}

      <BookingStrip
        bookingUrl={cardData.bookingUrl}
        email={cardData.email}
        primary={primary}
        accent={accent}
        onPrimary={onPrimary}
        translations={t}
      />

      <Section title={t.contact} accent={accent}>
        <ContactRows
          cardData={cardData}
          locale={locale}
          variant="hairline"
          tone="dark"
          accentHex={accent}
          rowClassName="hover:text-[var(--mp-accent)]"
        />
      </Section>

      <CTASection
        slug={slug}
        sourceQs={sourceQs}
        locale={locale}
        primary={primary}
        accent={accent}
      />

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="border-t border-white/8 px-6 py-5"
          labelClassName="mp-mono mb-3 text-[9.5px] text-white/45"
        >
          {walletSlot}
        </WalletDock>
      )}

      {cardData.socials && (
        <Section title={t.social} accent={accent}>
          <SocialRow
            socials={cardData.socials}
            variant="icon"
            accentHex={primary}
            itemClassName="!border-white/12 !bg-white/[0.04] !text-white/75 hover:!border-[var(--mp-primary)] hover:!text-[var(--mp-primary)] hover:!bg-white/[0.06]"
          />
        </Section>
      )}

      <Footer
        siteUrl={siteUrl}
        slug={slug}
        impressumUrl={cardData.impressumUrl}
        privacyUrl={cardData.privacyUrl}
        primary={primary}
        translations={t}
      />
    </article>
  );
}

// =============================================================================
// HERO — pure-black, brand-colour rim glow + photo/logo + animated equaliser.
// The artist name is the protagonist; everything else is in service of it.
// =============================================================================

function Hero({
  photoUrl,
  logoUrl,
  initials,
  company,
  name,
  title,
  primary,
  accent,
  sectorBadge,
  sourceLabel,
  translations,
}: {
  photoUrl: string | null;
  logoUrl: string | null;
  initials: string;
  company?: string;
  name: string;
  title?: string;
  primary: string;
  accent: string;
  sectorBadge?: string;
  sourceLabel?: string;
  translations: MpCopy;
}) {
  // 12 equaliser bars with staggered animation delays.
  const bars = React.useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        delay: (i % 6) * 0.13,
        height: 14 + (i % 4) * 6,
      })),
    [],
  );

  return (
    <header className="relative overflow-hidden bg-black">
      {/* Top rim glow — primary colour bleed from top-center. */}
      <div
        aria-hidden
        className="absolute inset-0 mp-glow-pulse"
        style={{
          background: `radial-gradient(120% 75% at 50% -10%, ${primary}55 0%, ${primary}22 25%, transparent 55%)`,
        }}
      />
      {/* Accent halo bottom-left for depth. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(60% 40% at 12% 100%, ${accent}33 0%, transparent 60%)`,
        }}
      />
      {/* Subtle scan-line texture for "vinyl" feel — pure CSS, no asset. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] mix-blend-screen"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <div className="relative px-7 pb-9 pt-11 text-center">
        {/* Eyebrow row */}
        <div className="mb-7 flex items-center justify-center gap-2">
          <span
            className="mp-mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px]"
            style={{
              borderColor: `${primary}55`,
              color: primary,
              background: `${primary}11`,
            }}
          >
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full mp-glow-pulse"
              style={{ background: primary, boxShadow: `0 0 8px ${primary}` }}
            />
            {translations.nowPlaying}
          </span>
          {sectorBadge && (
            <span className="mp-mono inline-block rounded-full border border-white/12 px-2.5 py-1 text-[9px] text-white/55">
              {sectorBadge}
            </span>
          )}
          {sourceLabel && (
            <span className="mp-mono inline-block rounded-full border border-white/8 px-2.5 py-1 text-[9px] text-white/45">
              {sourceLabel}
            </span>
          )}
        </div>

        {/* Photo / vinyl ring with logo centre — locked 84 × 84, brand-colour glow. */}
        <div className="relative z-10 mx-auto mb-6">
          <div
            className="relative mx-auto h-[88px] w-[88px] rounded-full p-[2px] mp-vinyl"
            style={{
              background: `conic-gradient(from 180deg at 50% 50%, ${primary}, ${accent}, ${primary})`,
              boxShadow: `0 0 40px ${primary}55, 0 0 16px ${accent}44`,
            }}
          >
            <div
              className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full"
              style={{ background: "#070707" }}
            >
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={name}
                  fill
                  unoptimized
                  sizes="88px"
                  className="object-cover tpl-photo"
                />
              ) : logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={company ? `${company} logo` : name}
                  width={120}
                  height={120}
                  className="h-[60%] w-[60%] object-contain tpl-logo"
                  unoptimized
                />
              ) : (
                <span
                  aria-hidden
                  className="mp-display text-[28px]"
                  style={{ color: primary, textShadow: `0 0 18px ${primary}88` }}
                >
                  {initials}
                </span>
              )}
              {/* Vinyl centre dot. */}
              <span
                aria-hidden
                className="absolute h-2.5 w-2.5 rounded-full"
                style={{
                  background: "#070707",
                  border: `1.5px solid ${primary}`,
                  boxShadow: `0 0 8px ${primary}`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Geometric display name. */}
        <h1
          className="mp-display relative z-10 text-[2.6rem] sm:text-[3rem]"
          style={{
            color: "#ffffff",
            textShadow: `0 2px 24px ${primary}66`,
          }}
        >
          {name}
        </h1>

        {company && (
          <p
            className="mp-mono relative z-10 mt-3 text-[10px]"
            style={{ color: primary }}
          >
            {company}
          </p>
        )}

        {title && (
          <p className="relative z-10 mt-2.5 text-[13px] font-medium text-white/70">
            {title}
          </p>
        )}

        {/* Animated equaliser strip — the "soul" of the design. */}
        <div
          aria-hidden
          className="relative z-10 mt-7 flex items-end justify-center gap-[3px] h-[28px]"
        >
          {bars.map((b, i) => (
            <span
              key={i}
              className="mp-eq-bar block w-[3px] rounded-full"
              style={{
                height: `${b.height}px`,
                background: `linear-gradient(180deg, ${primary} 0%, ${accent} 100%)`,
                boxShadow: `0 0 6px ${primary}66`,
                animationDelay: `${b.delay}s`,
              }}
            />
          ))}
        </div>

        <p
          className="mp-mono relative z-10 mt-4 text-[8.5px]"
          style={{ color: accent, opacity: 0.7, letterSpacing: "0.42em" }}
        >
          {translations.listenOn} · {translations.releases} · {translations.book}
        </p>
      </div>
    </header>
  );
}

// =============================================================================
// Quick action pills — neon-edge buttons. Two- or three-column grid.
// =============================================================================

function QuickActionStrip({
  slug,
  sourceQs,
  phoneDigits,
  waDigits,
  email,
  bookingUrl,
  primary,
  accent,
  onPrimary,
  onAccent,
  translations,
}: {
  slug: string;
  sourceQs: string;
  phoneDigits: string;
  waDigits: string;
  email?: string;
  bookingUrl?: string;
  primary: string;
  accent: string;
  onPrimary: string;
  onAccent: string;
  translations: MpCopy;
}) {
  type Pill = {
    label: string;
    href: string;
    Icon: LucideIcon;
    tone: "primary" | "accent" | "neutral";
    download?: boolean;
    external?: boolean;
  };

  const pills: Pill[] = [
    {
      label: translations.saveContact,
      href: `/api/cards/${encodeURIComponent(slug)}/vcard${sourceQs}`,
      Icon: UserPlus,
      tone: "primary",
      download: true,
    },
  ];
  if (phoneDigits) {
    pills.push({
      label: translations.callNow,
      href: `tel:${phoneDigits}`,
      Icon: Phone,
      tone: "neutral",
    });
  }
  if (waDigits) {
    pills.push({
      label: translations.whatsapp,
      href: `https://wa.me/${waDigits}`,
      Icon: MessageCircle,
      tone: "neutral",
      external: true,
    });
  }
  if (email) {
    pills.push({
      label: translations.email,
      href: `mailto:${email}`,
      Icon: Mail,
      tone: "neutral",
    });
  }
  if (bookingUrl) {
    pills.push({
      label: translations.book,
      href: bookingUrl,
      Icon: Calendar,
      tone: "accent",
      external: true,
    });
  }

  return (
    <div className="grid grid-cols-2 gap-2 px-6 pb-4 pt-6 sm:grid-cols-3">
      {pills.map((p, i) => {
        const isPrimary = p.tone === "primary";
        const isAccent = p.tone === "accent";
        const ext = p.external
          ? { target: "_blank", rel: "noopener noreferrer" as const }
          : {};
        return (
          <a
            key={`${p.label}-${i}`}
            href={p.href}
            download={p.download}
            {...ext}
            className="mp-mono group relative flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-[10.5px] font-semibold transition-all hover:-translate-y-px"
            style={
              isPrimary
                ? {
                    background: primary,
                    borderColor: primary,
                    color: onPrimary,
                    boxShadow: `0 8px 24px -10px ${primary}AA, 0 0 0 1px ${primary}33`,
                  }
                : isAccent
                  ? {
                      background: accent,
                      borderColor: accent,
                      color: onAccent,
                      boxShadow: `0 8px 24px -10px ${accent}AA, 0 0 0 1px ${accent}33`,
                    }
                  : {
                      background: "rgba(255,255,255,0.03)",
                      borderColor: "rgba(255,255,255,0.10)",
                      color: "rgba(255,255,255,0.78)",
                    }
            }
          >
            <p.Icon size={13} strokeWidth={2} />
            <span className="leading-none">{p.label}</span>
          </a>
        );
      })}
    </div>
  );
}

// =============================================================================
// Section frame — neon hairline rule + mono uppercase title.
// =============================================================================

function Section({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative px-6 py-7">
      <div className="mb-5 flex items-center gap-3">
        <span
          aria-hidden
          className="block h-px w-6"
          style={{ background: accent, boxShadow: `0 0 6px ${accent}88` }}
        />
        <h2
          className="mp-mono text-[10px] font-semibold"
          style={{ color: accent }}
        >
          {title}
        </h2>
        <span
          aria-hidden
          className="block h-px flex-1"
          style={{
            background: `linear-gradient(90deg, ${accent}55 0%, transparent 100%)`,
          }}
        />
      </div>
      {children}
    </section>
  );
}

// =============================================================================
// LISTEN ON — the headline CTA. 2-col tiles per platform with neon border.
// =============================================================================

function ListenOnSection({
  items,
  primary,
  accent,
  translations,
}: {
  items: Array<{ label: string; href: string; platform: StreamPlatform }>;
  primary: string;
  accent: string;
  translations: MpCopy;
}) {
  return (
    <section className="relative px-6 py-7">
      {/* Title row with bold underline. */}
      <div className="mb-5 flex items-baseline justify-between">
        <h2
          className="mp-display text-[1.5rem]"
          style={{ color: "#ffffff" }}
        >
          {translations.listenOn}
        </h2>
        <span
          className="mp-mono text-[9px]"
          style={{ color: primary, letterSpacing: "0.32em" }}
        >
          {translations.listen} →
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {items.map((it, i) => {
          const platformLabel = PLATFORM_LABEL[it.platform];
          const tint = i % 2 === 0 ? primary : accent;
          return (
            <a
              key={`${it.href}-${i}`}
              href={it.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col gap-2.5 overflow-hidden rounded-2xl border p-4 transition-all hover:-translate-y-px"
              style={{
                background: "rgba(255,255,255,0.025)",
                borderColor: `${tint}55`,
                boxShadow: `0 0 0 1px ${tint}11, 0 6px 18px -10px ${tint}77`,
              }}
            >
              {/* Glow strip top */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${tint}, transparent)`,
                }}
              />
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{
                  background: `${tint}1A`,
                  color: tint,
                  boxShadow: `inset 0 0 0 1px ${tint}33`,
                }}
              >
                <Play size={14} strokeWidth={2.2} fill={tint} />
              </div>
              <div>
                <div
                  className="mp-mono text-[8.5px] font-semibold"
                  style={{ color: tint, letterSpacing: "0.32em" }}
                >
                  {platformLabel}
                </div>
                <div className="mt-1 line-clamp-2 text-[12.5px] font-semibold leading-snug text-white/90">
                  {it.label}
                </div>
              </div>
              <ArrowUpRight
                aria-hidden
                size={13}
                strokeWidth={2}
                className="absolute right-3 top-3 text-white/30 transition-all group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}

// =============================================================================
// ReleasesList — services rendered as track releases. Catalogue + format.
// =============================================================================

function ReleasesList({
  items,
  accent,
  primary,
  title,
}: {
  items: Array<{ title: string; description?: string; priceLabel?: string }>;
  accent: string;
  primary: string;
  title: string;
}) {
  return (
    <Section title={title} accent={accent}>
      <ol className="space-y-2.5">
        {items.map((item, i) => (
          <li
            key={`${item.title}-${i}`}
            className="group relative flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3.5 transition-all hover:-translate-y-px hover:border-white/15 hover:bg-white/[0.04]"
          >
            <span
              className="mp-display flex w-8 shrink-0 items-center justify-start text-[1.4rem] tabular-nums"
              style={{ color: primary }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[13.5px] font-semibold leading-tight text-white">
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-white/55">
                  {item.description}
                </p>
              )}
              {item.priceLabel && (
                <span
                  className="mp-mono mt-2 inline-block text-[8.5px] font-semibold"
                  style={{ color: accent, letterSpacing: "0.32em" }}
                >
                  {item.priceLabel}
                </span>
              )}
            </div>
            <div
              aria-hidden
              className="flex shrink-0 items-center"
              style={{ color: accent }}
            >
              <Disc3
                size={16}
                strokeWidth={1.6}
                className="opacity-70 transition-all group-hover:opacity-100 group-hover:rotate-45"
              />
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

// =============================================================================
// ShowsList — venue list (replaces testimonials).
// =============================================================================

function ShowsList({
  items,
  accent,
  title,
}: {
  items: Array<{ author: string; role?: string; quote: string }>;
  accent: string;
  title: string;
}) {
  return (
    <Section title={title} accent={accent}>
      <ul className="divide-y divide-white/8 border-y border-white/8">
        {items.map((item, i) => (
          <li
            key={`${item.author}-${i}`}
            className="flex items-start justify-between gap-4 py-3.5"
          >
            <div className="min-w-0 flex-1">
              <h3 className="text-[13.5px] font-semibold leading-tight text-white">
                {item.author}
              </h3>
              {item.quote && (
                <p className="mt-1 line-clamp-2 text-[11.5px] leading-snug text-white/55">
                  {item.quote}
                </p>
              )}
            </div>
            {item.role && (
              <span
                className="mp-mono shrink-0 text-[8.5px] font-semibold pt-1"
                style={{ color: accent, letterSpacing: "0.30em" }}
              >
                {item.role}
              </span>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

// =============================================================================
// BookingStrip — primary CTA strip with full brand-colour glow.
// =============================================================================

function BookingStrip({
  bookingUrl,
  email,
  primary,
  accent,
  onPrimary,
  translations,
}: {
  bookingUrl?: string;
  email?: string;
  primary: string;
  accent: string;
  onPrimary: string;
  translations: MpCopy;
}) {
  const href = bookingUrl ?? (email ? `mailto:${email}` : null);
  if (!href) return null;
  const external = bookingUrl ? true : false;

  return (
    <section className="px-6 py-6">
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="group relative flex items-stretch overflow-hidden rounded-2xl transition-all hover:-translate-y-px"
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
          boxShadow: `0 18px 40px -18px ${primary}AA, 0 0 28px -10px ${accent}66`,
        }}
      >
        <div className="flex-1 px-5 py-5">
          <span
            className="mp-mono mb-1.5 block text-[8.5px] font-semibold opacity-80"
            style={{ color: onPrimary, letterSpacing: "0.34em" }}
          >
            {translations.book}
          </span>
          <span
            className="mp-display block text-[1.55rem]"
            style={{ color: onPrimary }}
          >
            {translations.bookingCta}
          </span>
          <span
            className="mt-1.5 block text-[11.5px] opacity-80"
            style={{ color: onPrimary }}
          >
            {translations.bookingHint}
          </span>
        </div>
        <div
          className="flex w-14 shrink-0 items-center justify-center transition-transform group-hover:translate-x-0.5"
          style={{ background: "rgba(0,0,0,0.18)" }}
        >
          <ArrowUpRight size={20} strokeWidth={2} style={{ color: onPrimary }} />
        </div>
      </a>
    </section>
  );
}

// =============================================================================
// CTA section — Wallet/Exchange/SendMyInfo wrappers.
// =============================================================================

function CTASection({
  slug,
  sourceQs,
  locale,
  primary,
  accent,
}: {
  slug: string;
  sourceQs: string;
  locale: "de" | "en" | "tr";
  primary: string;
  accent: string;
}) {
  return (
    <section className="px-6 py-2">
      <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={primary} locale={locale} />
      <ExchangeSlot slug={slug} primary={accent} locale={locale} />
    </section>
  );
}

// =============================================================================
// Footer — black band with neon signature.
// =============================================================================

function Footer({
  siteUrl,
  slug,
  impressumUrl,
  privacyUrl,
  primary,
  translations,
}: {
  siteUrl: string;
  slug: string;
  impressumUrl?: string;
  privacyUrl?: string;
  primary: string;
  translations: MpCopy;
}) {
  return (
    <footer
      className="relative px-6 pb-7 pt-7 text-white/55"
      style={{ background: "#050505" }}
    >
      <div
        aria-hidden
        className="absolute inset-x-6 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${primary}88 50%, transparent 100%)`,
          boxShadow: `0 0 8px ${primary}55`,
        }}
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10.5px]">
        <FooterShare siteUrl={siteUrl} slug={slug} label={translations.share} />
        {impressumUrl && (
          <a
            href={impressumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            {translations.impressum}
          </a>
        )}
        {privacyUrl && (
          <a
            href={privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            {translations.privacy}
          </a>
        )}
        <span className="ml-auto inline-flex items-center gap-1.5">
          <Shield size={11} strokeWidth={1.8} />
          {translations.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="mp-mono font-semibold transition-colors hover:text-white"
            style={{ color: primary, letterSpacing: "0.18em" }}
          >
            OpSolid
          </a>
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-white/8 pt-4">
        <Volume2 size={11} strokeWidth={1.6} style={{ color: primary }} />
        <span className="mp-mono text-[9.5px] text-white/40">
          {`opsolid.de/c/${slug}`}
        </span>
      </div>
    </footer>
  );
}

function FooterShare({
  siteUrl,
  slug,
  label,
}: {
  siteUrl: string;
  slug: string;
  label: string;
}) {
  const url = `${siteUrl}/c/${slug}`;
  return (
    <button
      type="button"
      onClick={async () => {
        if (typeof navigator !== "undefined" && "share" in navigator) {
          try {
            await navigator.share({ url, title: "Smart Card" });
            return;
          } catch {
            // user cancelled
          }
        }
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        }
      }}
      className="hover:text-white"
    >
      {label}
    </button>
  );
}

// =============================================================================
// Registry entry + sample data — orchestrator stitches these into registry.ts
// after all batches return.
// =============================================================================

export const musicProducerEntry: TemplateRegistryEntry = {
  id: 20,
  key: "music-producer",
  name: "Music Producer",
  industry: "Music producer / DJ / electronic artist",
  Component: MusicProducer,
  supports: {
    services: true,
    faqs: false,
    testimonials: true, // repurposed as upcoming shows
    gallery: false,
    video: true,
    brochure: false,
    socials: true,
    themeSwitch: false,
    photo: true,
    logo: true,
  },
  defaults: {
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-music-producer",
  nameRules: { transform: "uppercase", maxDisplayLength: 24 },
};

// source: Unsplash — https://unsplash.com/license (free for commercial use).
const MUSIC_PRODUCER_SAMPLE_PHOTO =
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80";

export const musicProducerSample: SampleData = {
  templateId: 20,
  slug: "demo-music-producer",
  photoUrl: MUSIC_PRODUCER_SAMPLE_PHOTO,
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
  cardData: {
    name: "NOVA RAYS",
    title: "Producer & Live Performer",
    position: "Synthwave · Electronic · Ambient",
    company: "Lumen Records",
    email: "hello@novarays.fm",
    phone: "+49 30 5577 1199",
    whatsapp: "+49 174 5544 7799",
    website: "https://novarays.fm",
    address: "Friedrichshain, 10245 Berlin",
    bio: "Berlin-based producer and live performer making cinematic electronic music at the edge of synthwave, ambient and modern classical. Eight years of releases, two world tours, and a small studio in Friedrichshain where most of it is made. Available for remixes, sync, and live booking through 2027.",
    bookingUrl: "https://cal.com/novarays/booking",
    sectorKey: "creator",
    services: [
      {
        title: "Aurora Drive — LP",
        description:
          "Full-length album, 11 tracks, mixed at Hansa Studios. Released April 2026 on Lumen Records.",
        priceLabel: "LMN-LP07 · LP / DIGITAL",
      },
      {
        title: "Halcyon (Remixes)",
        description:
          "Four-track remix EP featuring Bonobo, Recondite and Shigeto. Out March 2026.",
        priceLabel: "LMN-EP19 · 124 BPM",
      },
      {
        title: "Tideline",
        description:
          "Single + extended mix collaboration with Hania Rani. Modern classical meets electronic.",
        priceLabel: "LMN-S22 · 112 BPM",
      },
      {
        title: "Nightroom Sessions",
        description:
          "Live-recorded EP from a sold-out Funkhaus show, January 2026.",
        priceLabel: "LMN-EP15 · LIVE",
      },
    ],
    testimonials: [
      {
        author: "Berghain · Säule",
        role: "Berlin · 14 Jun 2026",
        quote: "Live AV set, late slot.",
      },
      {
        author: "Sónar Festival",
        role: "Barcelona · 19 Jun 2026",
        quote: "SonarComplex stage, full live show.",
      },
      {
        author: "Dekmantel",
        role: "Amsterdam · 02 Aug 2026",
        quote: "Boiler stage, sundown set.",
      },
      {
        author: "Funkhaus",
        role: "Berlin · 11 Oct 2026",
        quote: "Album release show with full ensemble.",
      },
    ],
    customButtons: [
      {
        label: "Aurora Drive — full LP",
        href: "https://open.spotify.com/artist/novarays",
        style: "secondary",
      },
      {
        label: "Latest mixes & demos",
        href: "https://soundcloud.com/novarays",
        style: "secondary",
      },
      {
        label: "Live at Funkhaus 2026",
        href: "https://youtube.com/@novarays",
        style: "secondary",
      },
      {
        label: "Apple Music — Essentials",
        href: "https://music.apple.com/artist/novarays",
        style: "secondary",
      },
    ],
    socials: {
      instagram: "https://instagram.com/novarays.fm",
      youtube: "https://youtube.com/@novarays",
      x: "https://x.com/novarays",
      tiktok: "https://tiktok.com/@novarays",
    },
    impressumUrl: "https://novarays.fm/imprint",
    privacyUrl: "https://novarays.fm/privacy",
  },
};
