"use client";

// =============================================================================
// BeautySalonNoir — v2 template (id=29, key="beauty-salon-noir").
//
// Sector: beauty studio — NOIR variant. Mood: editorial dark, rose-gold + gold
// accents on near-black surface, italic Cormorant serif name. Inspired by
// kart_13_guzellik_noir.html.
//
// Locked design DNA (only colors respond to brand):
//   - Centered header on dark canvas: gold marker line · STUDIO NAME · gold marker;
//     Cormorant italic huge name with primary gradient on last name; pink neon
//     "Premium Beauty Bar" pill below.
//   - Avatar row: 64 px circle with gold/pink gradient ring; gold rating chip.
//   - Centered eyebrow + "The Menu" italic sub for sections.
//   - Numbered services list (italic numbers + serif name + gold price).
//   - Stats panel (4-up) on raised dark band with gold italic numbers.
//   - Centered editorial pulled quote.
//   - Magenta/dark pink gradient CTA + ghost outline 2nd CTA.
//   - Cormorant Garamond + Syne fonts.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { ArrowRight, Shield } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#ec4899";
const LOCKED_ACCENT = "#c8a964"; // gold
const BG = "#0a0508";
const CARD = "#130810";
const PANEL = "#1a0c14";
const INK = "#f4e7ed";
const INK_SOFT = "#a08594";
const HAIRLINE = "#2d1820";
const HAIRLINE_FIRM = "#3d222b";

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

interface BsnCopy {
  premiumBeautyBar: string;
  contact: string;
  contactSub: string;
  menu: string;
  menuSub: string;
  studioPhilosophy: string;
  studioPhilosophyQuote: string;
  bookAppointment: string;
  callStudio: string;
  saveContact: string;
  walletLabel: string;
  experience: string;
  treatments: string;
  followers: string;
  rating: string;
  studio: string;
  share: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr", BsnCopy> = {
  de: {
    premiumBeautyBar: "Premium Beauty Bar",
    contact: "Kontakt",
    contactSub: "Reach Out",
    menu: "Services",
    menuSub: "The Menu",
    studioPhilosophy: "Studio Philosophy",
    studioPhilosophyQuote: "Beauty is where the obvious ends and the extraordinary begins.",
    bookAppointment: "Termin sichern",
    callStudio: "Studio anrufen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    experience: "Jahre",
    treatments: "Behandl.",
    followers: "Follower",
    rating: "Rating",
    studio: "Studio",
    share: "Teilen",
    poweredBy: "Powered by",
  },
  en: {
    premiumBeautyBar: "Premium Beauty Bar",
    contact: "Contact",
    contactSub: "Reach Out",
    menu: "Services",
    menuSub: "The Menu",
    studioPhilosophy: "Studio Philosophy",
    studioPhilosophyQuote: "Beauty is where the obvious ends and the extraordinary begins.",
    bookAppointment: "Book appointment",
    callStudio: "Call studio",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    experience: "Years",
    treatments: "Treats.",
    followers: "Followers",
    rating: "Rating",
    studio: "Studio",
    share: "Share",
    poweredBy: "Powered by",
  },
  tr: {
    premiumBeautyBar: "Premium Beauty Bar",
    contact: "İletişim",
    contactSub: "Reach Out",
    menu: "Hizmetler",
    menuSub: "The Menu",
    studioPhilosophy: "Studio Philosophy",
    studioPhilosophyQuote: "Beauty is where the obvious ends and the extraordinary begins.",
    bookAppointment: "Randevu Al",
    callStudio: "Stüdyoyu Ara",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    experience: "Yıl",
    treatments: "İşlem",
    followers: "Followers",
    rating: "Rating",
    studio: "Studio",
    share: "Paylaş",
    poweredBy: "Powered by",
  },
};

export function BeautySalonNoir({
  slug,
  cardData,
  locale = "de",
  photoPath,
  brandPrimaryHex,
  brandAccentHex,
  walletSlot,
}: TemplateProps) {
  const t = COPY[locale] ?? COPY.de;
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;
  const photoUrl = resolveAssetUrl(photoPath);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];

  const nameParts = cardData.name.trim().split(/\s+/);
  const firstName = nameParts.slice(0, -1).join(" ") || cardData.name;
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  return (
    <article
      data-template="beauty-salon-noir"
      className="bsn-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: CARD,
        color: INK,
        fontFamily: "'Syne', system-ui, sans-serif",
      }}
    >
      <style jsx global>{`
        .bsn-card { line-height: 1.6; }
        .bsn-card a { color: inherit; }
        .bsn-editorial { font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic; }
      `}</style>

      {/* Decorative halos */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-[360px] w-[360px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${primary}33 0%, transparent 60%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-[200px] h-[280px] w-[280px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${accent}1f 0%, transparent 65%)`,
        }}
      />

      {/* HEADER */}
      <header
        className="relative z-10 px-8 pb-10 pt-14 text-center"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="mb-5 inline-flex items-center gap-2.5 text-[10.5px] font-bold uppercase tracking-[4px]"
          style={{ color: accent }}
        >
          <span aria-hidden className="block h-px w-6" style={{ background: accent }} />
          {cardData.company}
          <span aria-hidden className="block h-px w-6" style={{ background: accent }} />
        </div>
        <h1
          className="bsn-editorial text-[50px] font-normal leading-none tracking-[-1.2px]"
          style={{ color: INK }}
        >
          {firstName}{" "}
          {lastName && (
            <strong
              className="font-semibold"
              style={{
                background: `linear-gradient(135deg, ${primary} 0%, ${primary}99 100%)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {lastName}
            </strong>
          )}
        </h1>
        <div
          className="mt-4 text-[11px] font-semibold uppercase tracking-[2.5px]"
          style={{ color: INK_SOFT }}
        >
          {cardData.position} {cardData.title && `· ${cardData.title}`}
        </div>
        <span
          className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10.5px] font-bold uppercase tracking-[2px]"
          style={{
            background: `${primary}26`,
            border: `1px solid ${primary}`,
            color: primary,
            boxShadow: `0 0 24px ${primary}80`,
          }}
        >
          <span
            className="block h-1.5 w-1.5 rounded-full"
            style={{ background: primary, boxShadow: `0 0 8px ${primary}` }}
          />
          {t.premiumBeautyBar}
        </span>
      </header>

      {/* AVATAR ROW */}
      <div
        className="relative z-10 flex items-center gap-4 px-8 py-7"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div className="relative flex-shrink-0">
          <div
            aria-hidden
            className="absolute -inset-[3px] rounded-full"
            style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
          />
          <div
            className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full"
            style={{ border: `3px solid ${CARD}` }}
          >
            {photoUrl ? (
              <Image src={photoUrl} alt="" width={140} height={140} unoptimized className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[14px] font-bold" style={{ background: PANEL, color: primary }}>
                {cardData.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[9.5px] font-bold uppercase tracking-[2px]" style={{ color: INK_SOFT }}>
            {t.studio}
          </div>
          <div className="bsn-editorial mt-0.5 text-[18px]" style={{ color: INK }}>
            {cardData.address?.split(",").slice(-2)[0]?.trim() || cardData.company}
          </div>
        </div>
        <div className="text-right">
          <div className="bsn-editorial text-[22px]" style={{ color: accent }}>
            4.9
          </div>
          <div className="mt-px text-[9px] uppercase tracking-[1.5px]" style={{ color: INK_SOFT }}>
            42K Followers
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <BsnSection title={t.contact} subtitle={t.contactSub} accent={accent}>
        <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={primary} />
      </BsnSection>

      {/* SOCIAL */}
      {cardData.socials && (
        <div className="relative z-10 px-8 pt-6" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <SocialRow socials={cardData.socials} variant="pill" accentHex={primary} />
        </div>
      )}

      {/* MENU */}
      {services.length > 0 && (
        <BsnSection title={t.menu} subtitle={t.menuSub} accent={accent}>
          <div>
            {services.map((s, i) => (
              <div
                key={`${s.title}-${i}`}
                className={`grid grid-cols-[32px_1fr_auto] items-baseline gap-3.5 py-4 ${i < services.length - 1 ? "border-b" : ""}`}
                style={{ borderColor: HAIRLINE }}
              >
                <span className="bsn-editorial text-[18px]" style={{ color: primary }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="bsn-editorial text-[18px] font-semibold leading-tight" style={{ color: INK }}>
                  {s.title}
                  {s.description && (
                    <small
                      className="mt-1 block text-[10.5px] font-normal not-italic tracking-[0.6px]"
                      style={{ color: INK_SOFT, fontFamily: "'Syne', system-ui, sans-serif" }}
                    >
                      {s.description}
                    </small>
                  )}
                </span>
                {s.priceLabel && (
                  <span
                    className="text-[13px] font-bold tabular-nums tracking-[0.4px]"
                    style={{ color: accent, fontFamily: "'Syne', system-ui, sans-serif" }}
                  >
                    {s.priceLabel}
                  </span>
                )}
              </div>
            ))}
          </div>
        </BsnSection>
      )}

      {/* STATS */}
      <section
        className="relative z-10 grid grid-cols-4"
        style={{
          background: PANEL,
          borderTop: `1px solid ${HAIRLINE}`,
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        <BsnStat n="7" l={t.experience} accent={accent} />
        <BsnStat n="5K" l={t.treatments} accent={accent} />
        <BsnStat n="42K" l={t.followers} accent={accent} />
        <BsnStat n="4.9" l={t.rating} accent={accent} last />
      </section>

      {/* QUOTE */}
      <section
        className="relative z-10 px-8 py-11 text-center"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <span
          aria-hidden
          className="bsn-editorial mb-4 block text-[60px] leading-[0.4] not-italic"
          style={{ color: primary }}
        >
          &ldquo;
        </span>
        <p
          className="bsn-editorial text-[22px] leading-[1.4] tracking-[-0.3px]"
          style={{ color: INK }}
        >
          {t.studioPhilosophyQuote}
        </p>
        <div
          className="mt-5 text-[9.5px] font-bold uppercase tracking-[3px]"
          style={{ color: accent }}
        >
          — {t.studioPhilosophy}
        </div>
      </section>

      {/* CTA */}
      <div
        className="relative z-10 px-8 py-9"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        {(cardData.bookingUrl || waDigits) && (
          <a
            href={cardData.bookingUrl || `https://wa.me/${waDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between px-5 py-[18px] text-[12px] font-extrabold uppercase tracking-[2.5px] transition-all hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${primary} 0%, ${primary}cc 100%)`,
              color: readableTextOn(primary),
              boxShadow: `0 0 30px ${primary}59`,
            }}
          >
            <span>{t.bookAppointment}</span>
            <ArrowRight size={16} />
          </a>
        )}
        {phoneDigits && (
          <a
            href={`tel:${phoneDigits}`}
            className="mt-2.5 flex w-full items-center justify-between px-5 py-[18px] text-[12px] font-extrabold uppercase tracking-[2.5px] transition-colors"
            style={{
              background: "transparent",
              color: INK,
              border: `1px solid ${HAIRLINE_FIRM}`,
            }}
          >
            <span>{t.callStudio}</span>
            <ArrowRight size={16} />
          </a>
        )}
      </div>

      {/* WALLET / SEND / EXCHANGE */}
      {walletSlot && (
        <div
          className="relative z-10 px-8 py-6"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <WalletDock label={t.walletLabel}>
            <div style={{ ["--card-primary" as string]: primary }}>{walletSlot}</div>
          </WalletDock>
        </div>
      )}
      <div
        className="relative z-10 px-8 py-6"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={primary} locale={locale} />
        <ExchangeSlot slug={slug} primary={primary} locale={locale} />
      </div>

      {/* FOOTER */}
      <footer
        className="relative z-10 flex items-center justify-between px-8 py-7 text-[9.5px] font-bold uppercase tracking-[2px]"
        style={{ color: INK_SOFT }}
      >
        <span style={{ color: primary }}>© MMXXVI</span>
        <span>{cardData.company}</span>
      </footer>
      <div
        className="relative z-10 flex items-center justify-center gap-1.5 px-8 pb-7 text-[10.5px]"
        style={{ color: INK_SOFT, background: BG }}
      >
        <Shield size={11} strokeWidth={1.6} />
        {t.poweredBy}{" "}
        <a
          href="https://opsolid.de/products/digital-card"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold"
          style={{ color: accent }}
        >
          OpSolid
        </a>
      </div>
    </article>
  );
}

function BsnSection({
  title,
  subtitle,
  accent,
  children,
}: {
  title: string;
  subtitle: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="relative z-10 px-8 py-9"
      style={{ borderBottom: `1px solid ${HAIRLINE}` }}
    >
      <div className="mb-6 text-center">
        <div
          className="text-[10px] font-bold uppercase tracking-[3px]"
          style={{ color: accent }}
        >
          {title}
        </div>
        <h3
          className="bsn-editorial mt-1 text-[22px] tracking-[-0.3px]"
          style={{ color: INK }}
        >
          {subtitle}
        </h3>
      </div>
      {children}
    </section>
  );
}

function BsnStat({
  n,
  l,
  accent,
  last,
}: {
  n: string;
  l: string;
  accent: string;
  last?: boolean;
}) {
  return (
    <div
      className="px-1 py-7 text-center"
      style={{ borderRight: last ? "none" : `1px solid ${HAIRLINE}` }}
    >
      <div className="bsn-editorial text-[30px]" style={{ color: accent }}>
        {n}
      </div>
      <div
        className="mt-1.5 text-[9px] font-bold uppercase tracking-[1.8px]"
        style={{ color: INK_SOFT }}
      >
        {l}
      </div>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const beautySalonNoirEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 29,
  key: "beauty-salon-noir",
  name: "Beauty Salon — Noir",
  industry: "Beauty studio (editorial dark variant)",
  supports: {
    services: true,
    faqs: false,
    testimonials: true,
    gallery: false,
    video: false,
    brochure: false,
    socials: true,
    themeSwitch: false,
    photo: true,
    logo: false,
  },
  defaults: { brandPrimaryHex: LOCKED_PRIMARY, brandAccentHex: LOCKED_ACCENT },
  sampleSlug: "demo-beauty-salon-noir",
};

export const beautySalonNoirSample: SampleData = {
  templateId: 29,
  slug: "demo-beauty-salon-noir",
  cardData: {
    name: "Buse Arslan",
    position: "Beauty & Lash Artist",
    title: "Permanent Makeup",
    company: "Beauty by Buse",
    phone: "+49 30 558 4422",
    whatsapp: "+49 176 445 2345",
    email: "buse@beautybybuse.de",
    website: "beautybybuse.de",
    address: "Friedrichstr. 67, 10117 Berlin",
    bio: "7 yıl deneyim · 5.000+ memnun müşteri.",
    services: [
      { title: "Microblading", description: "Kalıcı kaş tasarımı", priceLabel: "€280" },
      { title: "Eyeliner", description: "Kalıcı makyaj", priceLabel: "€220" },
      { title: "Lash Lift & Tint", description: "Kirpik bakımı", priceLabel: "€65" },
      { title: "Hidrafacial", description: "Cilt protokolu", priceLabel: "€85" },
      { title: "Lazer Epilasyon", description: "Diode paketleri", priceLabel: "Paket" },
      { title: "Kaş Laminasyonu", description: "Brow lift", priceLabel: "€55" },
    ],
    testimonials: [
      { author: "Selin K.", quote: "Microblading sonucu inanılmaz doğal duruyor." },
    ],
    socials: {
      instagram: "https://instagram.com/beautybybuse",
      tiktok: "https://tiktok.com/@beautybybuse",
    },
    sectorKey: "salon",
  },
  photoUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
