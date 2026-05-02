"use client";

// =============================================================================
// ContentCreatorNoir â€” v2 template (id=38, key="content-creator-noir").
//
// Sector: Influencer / content creator â€” NOIR variant. Mood: dark editorial
// studio, REC-dot blink, Syne italic display, primary red highlight, gold
// secondary, gradient spotlight follower count. Inspired by
// kart_16_icerik_uretici_noir.html.
//
// Locked design DNA (only colors respond to brand):
//   - Hero "studio" panel: dark with red and gold radial halos, blinking REC
//     dot top-right; gold uppercase studio label; Syne 36 px bold name with
//     accent on lastname.
//   - Big "spotlight" raised panel: 64 px gradient-text follower count with
//     gold underline trim.
//   - Profile row: 64 px circle with gold thin ring and label/niche.
//   - Sections with uppercase tracking, gold underline accent.
//   - Platforms grid (3-up): minimal dark cards with hover gold tint.
//   - Service list dark.
//   - Big magenta-style CTA + ghost outline.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Mail,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#0f172a";
const LOCKED_ACCENT = "#f97316";
const CARD = "#111111";
const CARD_2 = "#181818";
const RED = "#ff2a2a";
const GOLD = "#c8a964";
const INK = "#f5f5f7";
const INK_SOFT = "rgba(245,245,247,0.55)";
const INK_LITE = "rgba(245,245,247,0.78)";
const HAIRLINE = "rgba(255,255,255,0.08)";
const HAIRLINE_FIRM = "rgba(255,255,255,0.16)";

function readableTextOn(hex: string | null | undefined): string {
  if (!hex) return "#1a1a1a";
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? "#1a1a1a" : "#ffffff";
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
  if (parts.length === 0) return "â€¢";
  return (parts[0][0] ?? "â€¢").toUpperCase() + (parts[parts.length - 1]?.[0] ?? "").toUpperCase();
}

interface CcnCopy {
  studioLabel: string;
  studioTagline: string;
  totalReach: string;
  contact: string;
  collab: string;
  platforms: string;
  about: string;
  bookingCta: string;
  bookingSub: string;
  callMe: string;
  saveContact: string;
  walletLabel: string;
  share: string;
  poweredBy: string;
  followers: string;
  niche: string;
  nicheValue: string;
}

const COPY: Record<"de" | "en" | "tr", CcnCopy> = {
  de: {
    studioLabel: "Tuna Â· Studio",
    studioTagline: "Cinematic storytelling for ambitious brands.",
    totalReach: "Gesamtreichweite",
    contact: "Kontakt",
    collab: "Collab",
    platforms: "Plattformen",
    about: "Ãœber",
    bookingCta: "Booking-Anfrage",
    bookingSub: "Antwort innerhalb 24h",
    callMe: "Direkt anrufen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    share: "Teilen",
    poweredBy: "Powered by",
    followers: "Follower",
    niche: "Niche",
    nicheValue: "Lifestyle Â· Travel Â· Premium",
  },
  en: {
    studioLabel: "Tuna Â· Studio",
    studioTagline: "Cinematic storytelling for ambitious brands.",
    totalReach: "Total reach",
    contact: "Contact",
    collab: "Collab",
    platforms: "Platforms",
    about: "About",
    bookingCta: "Booking request",
    bookingSub: "Response within 24h",
    callMe: "Call directly",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    share: "Share",
    poweredBy: "Powered by",
    followers: "Followers",
    niche: "Niche",
    nicheValue: "Lifestyle Â· Travel Â· Premium",
  },
  tr: {
    studioLabel: "Tuna Â· Studio",
    studioTagline: "Ä°ddialÄ± markalar iÃ§in sinematik storytelling.",
    totalReach: "Toplam EriÅŸim",
    contact: "Ä°letiÅŸim",
    collab: "Ä°ÅŸ BirliÄŸi",
    platforms: "Platformlar",
    about: "HakkÄ±mda",
    bookingCta: "Booking Talebi",
    bookingSub: "24 saat iÃ§inde yanÄ±t",
    callMe: "Direkt Ara",
    saveContact: "KiÅŸiyi Kaydet",
    walletLabel: "CÃ¼zdana ekle",
    share: "PaylaÅŸ",
    poweredBy: "Powered by",
    followers: "TakipÃ§i",
    niche: "Alan",
    nicheValue: "Lifestyle Â· Travel Â· Premium",
  },
};

export function ContentCreatorNoir({
  slug,
  cardData,
  locale = "de",
  photoPath,
  brandAccentHex,
  walletSlot,
}: TemplateProps) {
  const t = COPY[locale] ?? COPY.de;
  const accent = brandAccentHex || LOCKED_ACCENT;
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);
  const initials = getInitials(cardData.name);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];

  const nameParts = cardData.name.trim().split(/\s+/);
  const firstName = nameParts.slice(0, -1).join(" ") || cardData.name;
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  const year = new Date().getFullYear();

  return (
    <article
      data-template="content-creator-noir"
      className="ccn-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: CARD,
        color: INK,
        boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
      }}
    >
      <style jsx global>{`
        .ccn-card {
          font-family: var(--tpl-font-body, 'Inter', system-ui, sans-serif);
          line-height: 1.6;
        }
        .ccn-card .display { font-family: var(--tpl-font-display, 'Syne', 'Inter', sans-serif); }
        .ccn-card a { color: inherit; }
        @keyframes ccn-rec {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      {/* HERO â€” studio panel */}
      <header
        className="relative overflow-hidden px-7 pb-9 pt-12"
        style={{
          background: `radial-gradient(ellipse at top right, ${RED}33, transparent 60%), radial-gradient(ellipse at bottom left, ${GOLD}1a, transparent 60%)`,
        }}
      >
        {/* REC dot */}
        <div
          aria-hidden
          className="absolute right-7 top-7 h-3 w-3 rounded-full"
          style={{
            background: RED,
            boxShadow: `0 0 0 4px ${RED}40, 0 0 20px ${RED}99`,
            animation: "ccn-rec 1.4s ease-in-out infinite",
          }}
        />

        <div
          className="display mb-5 inline-block text-[11px] font-medium uppercase"
          style={{ color: GOLD, letterSpacing: "4px" }}
        >
          {t.studioLabel}
        </div>
        <h1
          className="display text-[36px] font-bold leading-[1.1] tracking-[-1px]"
          style={{ color: "#fff" }}
        >
          {firstName}{" "}
          <span style={{ color: accent, fontWeight: 800 }}>{lastName || ""}</span>
        </h1>
        <p
          className="display mt-3.5 text-[14px] italic leading-[1.6]"
          style={{ color: INK_LITE, fontWeight: 300 }}
        >
          {cardData.bio || t.studioTagline}
        </p>
      </header>

      {/* SPOTLIGHT â€” gradient text follower count */}
      <section className="px-7 pt-6">
        <div
          className="relative overflow-hidden rounded-3xl border px-6 py-7 text-center"
          style={{
            background: `linear-gradient(135deg, ${CARD_2} 0%, #0d0d0d 100%)`,
            borderColor: HAIRLINE_FIRM,
          }}
        >
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            }}
          />
          <div
            className="text-[10px] font-medium uppercase"
            style={{ color: GOLD, letterSpacing: "3px" }}
          >
            {t.totalReach}
          </div>
          <div
            className="display mt-3.5 text-[60px] font-extrabold leading-none tracking-[-2px]"
            style={{
              backgroundImage: `linear-gradient(135deg, #fff 0%, ${GOLD} 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            120K
          </div>
          <div
            className="mt-2 text-[12px] uppercase"
            style={{ color: INK_SOFT, letterSpacing: "1.5px" }}
          >
            Instagram Â· TikTok Â· YouTube
          </div>
        </div>
      </section>

      {/* PROFILE ROW */}
      <section className="flex items-center gap-4 px-7 pt-7">
        <div
          className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full"
          style={{ border: `1px solid ${GOLD}`, padding: 3 }}
        >
          <div className="h-full w-full overflow-hidden rounded-full">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt=""
                width={120}
                height={120}
                unoptimized
                className="h-full w-full object-cover tpl-photo"
              />
            ) : (
              <div
                className="display flex h-full w-full items-center justify-center text-[18px] font-bold"
                style={{ background: CARD_2, color: GOLD }}
              >
                {initials}
              </div>
            )}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="display text-[11px] font-medium uppercase"
            style={{ color: GOLD, letterSpacing: "2px" }}
          >
            {cardData.position?.split("Â·")[0]?.trim() || "Content Creator"}
          </div>
          <div
            className="mt-1 text-[13px]"
            style={{ color: INK_LITE }}
          >
            {t.nicheValue}
          </div>
        </div>
      </section>

      {/* PLATFORMS GRID */}
      <section className="px-7 pt-9">
        <NoirSectionTitle gold={GOLD}>{t.platforms}</NoirSectionTitle>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <NoirPlatform label="Instagram" count="120K" accent={accent} href={cardData.socials?.instagram} />
          <NoirPlatform label="TikTok" count="85K" accent={GOLD} href={cardData.socials?.tiktok} />
          <NoirPlatform label="YouTube" count="22K" accent={RED} href={cardData.socials?.youtube} />
        </div>
      </section>

      {/* COLLAB packages */}
      {services.length > 0 && (
        <section className="px-7 pt-9">
          <NoirSectionTitle gold={GOLD}>{t.collab}</NoirSectionTitle>
          <div className="mt-5">
            {services.slice(0, 5).map((svc, i, arr) => (
              <div
                key={`${svc.title}-${i}`}
                className="flex items-baseline justify-between py-3.5"
                style={{
                  borderBottom: i < arr.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                }}
              >
                <div className="min-w-0 flex-1 pr-3">
                  <div
                    className="display text-[14px] font-semibold"
                    style={{ color: "#fff" }}
                  >
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div className="mt-0.5 text-[11.5px]" style={{ color: INK_SOFT }}>
                      {svc.description}
                    </div>
                  )}
                </div>
                {svc.priceLabel && (
                  <span
                    className="display whitespace-nowrap text-[14px] font-bold"
                    style={{ color: GOLD }}
                  >
                    {svc.priceLabel}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="space-y-2.5 px-7 pt-9">
        {(cardData.bookingUrl || waDigits) && (
          <a
            href={cardData.bookingUrl || `https://wa.me/${waDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="display flex w-full items-center justify-between rounded-sm px-5 py-[16px] text-[13px] font-bold uppercase transition-opacity hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, ${accent} 0%, ${RED} 100%)`,
              color: "#fff",
              letterSpacing: "1.5px",
            }}
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles size={16} strokeWidth={2.4} />
              {t.bookingCta}
            </span>
            <ArrowUpRight size={15} strokeWidth={2.4} />
          </a>
        )}
        {phoneDigits && (
          <a
            href={`tel:${phoneDigits}`}
            className="display flex w-full items-center justify-between rounded-sm px-5 py-[16px] text-[13px] font-bold uppercase transition-colors"
            style={{
              background: "transparent",
              color: GOLD,
              border: `1px solid ${HAIRLINE_FIRM}`,
              letterSpacing: "1.5px",
            }}
          >
            <span className="inline-flex items-center gap-2">
              <Phone size={16} strokeWidth={2.4} />
              {t.callMe}
            </span>
            <ArrowUpRight size={15} strokeWidth={2.4} />
          </a>
        )}
        <p
          className="display text-center text-[10.5px] uppercase"
          style={{ color: INK_SOFT, letterSpacing: "2px" }}
        >
          {t.bookingSub}
        </p>
      </section>

      {/* QUICK CONTACT row */}
      <section className="grid grid-cols-3 gap-2 px-7 pt-9">
        {phoneDigits && (
          <NoirAction
            href={`tel:${phoneDigits}`}
            label="Call"
            Icon={Phone}
            gold={GOLD}
          />
        )}
        {waDigits && (
          <NoirAction
            href={`https://wa.me/${waDigits}`}
            external
            label="DM"
            Icon={MessageCircle}
            gold={GOLD}
          />
        )}
        {cardData.email && (
          <NoirAction
            href={`mailto:${cardData.email}`}
            label="Mail"
            Icon={Mail}
            gold={GOLD}
          />
        )}
      </section>

      {/* CONTACT */}
      <section className="px-7 pt-9">
        <NoirSectionTitle gold={GOLD}>{t.contact}</NoirSectionTitle>
        <div className="mt-5">
          <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={GOLD} />
        </div>
      </section>

      {/* SOCIAL ALL */}
      {cardData.socials && (
        <section className="px-7 pt-9">
          <SocialRow socials={cardData.socials} variant="pill" accentHex={GOLD} />
        </section>
      )}

      {/* WALLET / SEND / EXCHANGE */}
      {walletSlot && (
        <div className="px-7 pt-7">
          <WalletDock label={t.walletLabel}>
            <div style={{ ["--card-primary" as string]: GOLD }}>{walletSlot}</div>
          </WalletDock>
        </div>
      )}

      <div className="px-7 pt-6">
        <SendMyInfoSlot slug={slug} sourceQs="" primary={GOLD} locale={locale} />
        <ExchangeSlot slug={slug} primary={GOLD} locale={locale} />
      </div>

      {/* FOOTER */}
      <footer
        className="mt-9 border-t px-7 py-7 text-center"
        style={{ borderColor: HAIRLINE }}
      >
        <div
          className="display text-[12px] font-bold uppercase"
          style={{ color: GOLD, letterSpacing: "3px" }}
        >
          {cardData.name}
        </div>
        <div className="mt-2 text-[10.5px]" style={{ color: INK_SOFT }}>
          Â© {year} Â· {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="display font-semibold"
            style={{ color: GOLD }}
          >
            OpSolid
          </a>
        </div>
        <div
          className="mt-2 inline-flex items-center gap-1.5 text-[10.5px]"
          style={{ color: INK_SOFT }}
        >
          <Shield size={11} strokeWidth={1.6} />
          <span>{t.niche}: {t.nicheValue}</span>
        </div>
      </footer>
    </article>
  );
}

function NoirSectionTitle({
  children,
  gold,
}: {
  children: React.ReactNode;
  gold: string;
}) {
  return (
    <h2
      className="display flex items-center gap-3 text-[12px] font-semibold uppercase"
      style={{ color: "#fff", letterSpacing: "2.5px" }}
    >
      <span aria-hidden className="block h-px w-6" style={{ background: gold }} />
      {children}
      <span aria-hidden className="block h-px flex-1" style={{ background: HAIRLINE }} />
    </h2>
  );
}

function NoirPlatform({
  label,
  count,
  accent,
  href,
}: {
  label: string;
  count: string;
  accent: string;
  href?: string;
}) {
  const inner = (
    <>
      <div
        className="display text-[10px] font-medium uppercase"
        style={{ color: INK_SOFT, letterSpacing: "1.5px" }}
      >
        {label}
      </div>
      <div
        className="display mt-2 text-[20px] font-extrabold leading-none"
        style={{ color: "#fff" }}
      >
        {count}
      </div>
      <div
        className="mt-2 inline-block h-0.5 w-6 rounded-full"
        style={{ background: accent }}
      />
    </>
  );
  const className =
    "block rounded-2xl px-3 py-5 text-center transition-all hover:-translate-y-0.5";
  const style: React.CSSProperties = {
    background: CARD_2,
    border: `1px solid ${HAIRLINE}`,
  };
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {inner}
      </a>
    );
  }
  return (
    <div className={className} style={style}>
      {inner}
    </div>
  );
}

function NoirAction({
  href,
  label,
  Icon,
  gold,
  external,
}: {
  href: string;
  label: string;
  Icon: typeof Phone;
  gold: string;
  external?: boolean;
}) {
  const ext = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  return (
    <a
      href={href}
      {...ext}
      className="display flex items-center justify-center gap-1.5 rounded-sm px-2 py-3 text-[12px] font-medium uppercase transition-colors"
      style={{
        background: CARD_2,
        border: `1px solid ${HAIRLINE}`,
        color: INK,
        letterSpacing: "1.2px",
      }}
    >
      <Icon size={14} strokeWidth={2} style={{ color: gold }} />
      {label}
    </a>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const contentCreatorNoirEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 38,
  key: "content-creator-noir",
  name: "Content Creator â€” Noir",
  industry: "Influencer / content creator (noir editorial variant)",
  supports: {
    services: true,
    faqs: false,
    testimonials: false,
    gallery: false,
    video: false,
    brochure: false,
    socials: true,
    themeSwitch: false,
    photo: true,
    logo: false,
  },
  defaults: {
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-content-creator-noir",
};

export const contentCreatorNoirSample: SampleData = {
  templateId: 38,
  slug: "demo-content-creator-noir",
  cardData: {
    name: "Tuna YÄ±lmaz",
    position: "Content Creator Â· Premium",
    title: "Studio Â· 120K reach",
    company: "Tuna YÄ±lmaz Media",
    email: "tuna@tunayilmaz.de",
    phone: "+49 178 556 7890",
    whatsapp: "+49 178 556 7890",
    website: "tunayilmaz.de",
    address: "Berlin",
    bio: "Cinematic storytelling for ambitious brands. Lifestyle & Travel â€” premium production, brand-safe collaborations.",
    bookingUrl: "https://cal.com/tunayilmaz/booking",
    sectorKey: "creator",
    services: [
      { title: "Instagram Reel", description: "Premium production Â· 60s", priceLabel: "â‚¬650" },
      { title: "YouTube Integration", description: "60â€“90s in long-form", priceLabel: "â‚¬900" },
      { title: "Story Series", description: "5-Story take-over Â· 24h", priceLabel: "â‚¬350" },
      { title: "Long-Form Campaign", description: "Multi-platform Â· 4 weeks", priceLabel: "â‚¬2.800" },
    ],
    socials: {
      instagram: "https://instagram.com/tunayilmaz",
      tiktok: "https://tiktok.com/@tunayilmaz",
      youtube: "https://youtube.com/@tunayilmaz",
    },
  },
  photoUrl:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

