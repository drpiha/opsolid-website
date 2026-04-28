"use client";

// =============================================================================
// Barber — barber / men's grooming / classic salon (id=7, key="barber").
//
// Design DNA: Projekt_4k/showcase/kart_07_berber.html, dialed down from retro
// kitsch (full barber pole, animated chunk) to upscale Mayfair restraint. The
// pole survives only as a 4 px-tall gradient stripe at the very top, scrolling
// slowly (12s loop). Single elegant Oswald headline + clean Roboto body. Gold
// hairlines, cream text on ink-black. Saturday-cartoon → Savile Row.
//
// Locked design choices (do not parameterise):
//   - 4px striped accent at the very top of the article, animated diagonally.
//   - Top-left logo 44×44 on dark surface — gold/cream initials fallback.
//   - Optional small circular avatar (56 × 56) in the profile strip if photo
//     is provided — otherwise the strip is text-only.
//   - Oswald all-caps spaced for headings, Roboto for body.
//   - Gold (#c8a951) hairline rules between sections.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  Scissors,
  Shield,
  Star,
  UserPlus,
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
// Locked palette — Mayfair barber, not Coney Island.
// -----------------------------------------------------------------------------
const LOCKED_PRIMARY = "#0d0d0d"; // ink-black surface
const LOCKED_ACCENT = "#c8a951"; // restrained gold

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

interface BbCopy {
  saveContact: string;
  callNow: string;
  whatsapp: string;
  email: string;
  book: string;
  services: string;
  about: string;
  contact: string;
  voices: string;
  social: string;
  walletLabel: string;
  bookingCta: string;
  bookingHint: string;
  hours: string;
  impressum: string;
  privacy: string;
  poweredBy: string;
  est: string;
}

const COPY: Record<"de" | "en" | "tr", BbCopy> = {
  de: {
    saveContact: "Speichern",
    callNow: "Anrufen",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    book: "Termin",
    services: "Schnitt & Pflege",
    about: "Der Meister",
    contact: "Kontakt",
    voices: "Stimmen",
    social: "Social",
    walletLabel: "Auf Smartphone speichern",
    bookingCta: "Termin reservieren",
    bookingHint: "Mo–Sa nach Vereinbarung",
    hours: "Öffnungszeiten",
    impressum: "Impressum",
    privacy: "Datenschutz",
    poweredBy: "Powered by",
    est: "Gegründet",
  },
  en: {
    saveContact: "Save contact",
    callNow: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    book: "Book",
    services: "Cuts & grooming",
    about: "The master",
    contact: "Contact",
    voices: "Voices",
    social: "Social",
    walletLabel: "Add to wallet",
    bookingCta: "Reserve a chair",
    bookingHint: "Mon–Sat by appointment",
    hours: "Hours",
    impressum: "Imprint",
    privacy: "Privacy",
    poweredBy: "Powered by",
    est: "Established",
  },
  tr: {
    saveContact: "Rehbere kaydet",
    callNow: "Ara",
    whatsapp: "WhatsApp",
    email: "E-posta",
    book: "Randevu",
    services: "Kesim & bakım",
    about: "Usta",
    contact: "İletişim",
    voices: "Yorumlar",
    social: "Sosyal",
    walletLabel: "Cüzdana ekle",
    bookingCta: "Randevu al",
    bookingHint: "Pzt–Cmt randevu ile",
    hours: "Çalışma saatleri",
    impressum: "Künye",
    privacy: "Gizlilik",
    poweredBy: "Powered by",
    est: "Kuruluş",
  },
};

export function Barber({
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

  return (
    <article
      data-template="barber"
      className={`bb-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] text-[#f5f5f0] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.7),0_8px_20px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/5`}
      style={
        {
          ["--bb-primary" as string]: primary,
          ["--bb-accent" as string]: accent,
          ["--bb-accent-soft" as string]: `${accent}1A`,
          ["--card-primary" as string]: primary,
          ["--card-accent" as string]: accent,
          ["--font-barber-display" as string]: "'Oswald', Impact, sans-serif",
          ["--font-barber-body" as string]: "'Roboto', system-ui, sans-serif",
          background: "#0d0d0d",
          fontFamily: "var(--font-barber-body), system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .bb-card {
          font-family: var(--font-barber-body), "Roboto", system-ui, sans-serif;
          line-height: 1.65;
        }
        .bb-card .bb-display {
          font-family: var(--font-barber-display), "Oswald", "Impact", sans-serif;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .bb-card .bb-mono {
          font-family: var(--font-barber-display), "Oswald", system-ui, sans-serif;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          font-feature-settings: "tnum";
        }
        @keyframes bb-pole-pan {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 84.85px 0;
          }
        }
        .bb-card .bb-stripe {
          background: repeating-linear-gradient(
            135deg,
            #b32626 0px,
            #b32626 12px,
            #f5f0e6 12px,
            #f5f0e6 24px,
            #1a4d8f 24px,
            #1a4d8f 36px
          );
          background-size: 84.85px 4px;
          animation: bb-pole-pan 12s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .bb-card .bb-stripe {
            animation: none;
          }
        }
      `}</style>

      {/* Animated 4px stripe — the only retro signal that survived. */}
      <div className="bb-stripe h-[4px] w-full" aria-hidden />

      <Header
        logoUrl={logoUrl}
        initials={initials}
        company={cardData.company}
        accent={accent}
        sectorBadge={sector?.name}
        sourceLabel={sourceLabel}
        translations={t}
      />

      <ProfileStrip
        photoUrl={photoUrl}
        initials={initials}
        name={cardData.name}
        title={cardData.position || cardData.title}
        bio={cardData.bio}
        accent={accent}
      />

      <QuickActionStrip
        slug={slug}
        sourceQs={sourceQs}
        phoneDigits={phoneDigits}
        waDigits={waDigits}
        email={cardData.email}
        bookingUrl={cardData.bookingUrl}
        accent={accent}
        translations={t}
      />

      {services && services.length > 0 && (
        <PriceList items={services} accent={accent} title={t.services} />
      )}

      {cardData.testimonials && cardData.testimonials.length > 0 && (
        <Testimonials items={cardData.testimonials} accent={accent} title={t.voices} />
      )}

      <BookingStrip
        bookingUrl={cardData.bookingUrl}
        phoneDigits={phoneDigits}
        accent={accent}
        translations={t}
      />

      <Section title={t.contact} accent={accent}>
        <ContactRows
          cardData={cardData}
          locale={locale}
          variant="hairline"
          tone="dark"
          accentHex={accent}
          rowClassName="hover:text-[var(--bb-accent)]"
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
          labelClassName="bb-mono mb-3 text-[9.5px] text-[#f5f5f0]/45"
        >
          {walletSlot}
        </WalletDock>
      )}

      {cardData.socials && (
        <Section title={t.social} accent={accent}>
          <SocialRow
            socials={cardData.socials}
            variant="icon"
            accentHex={accent}
            itemClassName="!border-white/12 !bg-white/[0.04] !text-[#f5f5f0]/70 hover:!border-[var(--bb-accent)] hover:!text-[var(--bb-accent)] hover:!bg-white/[0.06]"
          />
        </Section>
      )}

      <Footer
        siteUrl={siteUrl}
        slug={slug}
        impressumUrl={cardData.impressumUrl}
        privacyUrl={cardData.privacyUrl}
        company={cardData.company}
        accent={accent}
        translations={t}
      />
    </article>
  );
}

// =============================================================================
// HEADER — top-left logo, shop name in Oswald, gold hairline below.
// =============================================================================

function Header({
  logoUrl,
  initials,
  company,
  accent,
  sectorBadge,
  sourceLabel,
  translations,
}: {
  logoUrl: string | null;
  initials: string;
  company?: string;
  accent: string;
  sectorBadge?: string;
  sourceLabel?: string;
  translations: BbCopy;
}) {
  return (
    <header className="relative px-7 pb-7 pt-9">
      {/* Subtle vignette — gives the dark a shape without flattening it. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 60%)",
        }}
      />

      <div className="relative flex items-start gap-4">
        {/* Logo — locked top-left, locked 44px. */}
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md"
          style={{
            background: logoUrl ? "white" : "rgba(255,255,255,0.04)",
            border: `1px solid ${accent}55`,
          }}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={company ? `${company} logo` : "Logo"}
              width={64}
              height={64}
              className="h-7 w-7 object-contain tpl-logo"
              unoptimized
            />
          ) : (
            <span
              className="bb-display text-[14px] font-semibold"
              style={{ color: accent, letterSpacing: "0.08em" }}
            >
              {initials}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <span
            className="bb-mono block text-[8.5px] font-semibold"
            style={{ color: accent, opacity: 0.85, letterSpacing: "0.42em" }}
          >
            {translations.est} · MMXXVI
          </span>
          <h1
            className="bb-display mt-1.5 text-[1.5rem] font-bold leading-tight"
            style={{ color: accent }}
          >
            {company || translations.about}
          </h1>
          <p
            className="bb-mono mt-1.5 text-[9px] text-[#f5f5f0]/55"
            style={{ letterSpacing: "0.36em" }}
          >
            Master Barber & Grooming Atelier
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {sectorBadge && (
            <span
              className="bb-mono inline-block rounded border px-2 py-1 text-[8.5px] font-semibold"
              style={{
                borderColor: `${accent}55`,
                color: accent,
                background: "rgba(200, 169, 81, 0.06)",
              }}
            >
              {sectorBadge}
            </span>
          )}
          {sourceLabel && (
            <span className="bb-mono inline-block rounded border border-white/10 bg-white/[0.03] px-2 py-1 text-[8.5px] text-[#f5f5f0]/50">
              {sourceLabel}
            </span>
          )}
        </div>
      </div>

      <div
        aria-hidden
        className="mt-7 h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accent}99 30%, ${accent}99 70%, transparent 100%)`,
        }}
      />
    </header>
  );
}

// =============================================================================
// PROFILE STRIP — optional avatar + master barber name + bio.
// =============================================================================

function ProfileStrip({
  photoUrl,
  initials,
  name,
  title,
  bio,
  accent,
}: {
  photoUrl: string | null;
  initials: string;
  name: string;
  title?: string;
  bio?: string;
  accent: string;
}) {
  return (
    <section className="flex items-start gap-5 px-7 py-6">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full"
        style={{
          border: `2px solid ${accent}`,
          background: photoUrl ? "transparent" : "rgba(200,169,81,0.06)",
        }}
      >
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            width={120}
            height={120}
            unoptimized
            className="h-full w-full object-cover tpl-photo"
          />
        ) : (
          <span
            className="bb-display text-[14px] font-semibold"
            style={{ color: accent }}
          >
            {initials}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h2
          className="bb-display text-[1.05rem] font-medium leading-tight"
          style={{ color: "#f5f5f0" }}
        >
          {name}
        </h2>
        {title && (
          <p
            className="bb-mono mt-1 text-[9px]"
            style={{ color: accent, letterSpacing: "0.30em" }}
          >
            {title}
          </p>
        )}
        {bio && (
          <p className="mt-3 text-[12.5px] leading-relaxed text-[#f5f5f0]/65">
            {bio}
          </p>
        )}
      </div>
    </section>
  );
}

// =============================================================================
// Quick action pills — gold-bordered ghost + primary on Book.
// =============================================================================

function QuickActionStrip({
  slug,
  sourceQs,
  phoneDigits,
  waDigits,
  email,
  bookingUrl,
  accent,
  translations,
}: {
  slug: string;
  sourceQs: string;
  phoneDigits: string;
  waDigits: string;
  email?: string;
  bookingUrl?: string;
  accent: string;
  translations: BbCopy;
}) {
  type Pill = {
    label: string;
    href: string;
    Icon: LucideIcon;
    tone: "gold" | "neutral";
    download?: boolean;
    external?: boolean;
  };

  const pills: Pill[] = [
    {
      label: translations.saveContact,
      href: `/api/cards/${encodeURIComponent(slug)}/vcard${sourceQs}`,
      Icon: UserPlus,
      tone: "gold",
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
      tone: "gold",
      external: true,
    });
  }

  return (
    <div className="grid grid-cols-2 gap-2 px-7 pb-2 sm:grid-cols-3">
      {pills.map((p, i) => {
        const isGold = p.tone === "gold";
        const ext = p.external
          ? { target: "_blank", rel: "noopener noreferrer" as const }
          : {};
        return (
          <a
            key={`${p.label}-${i}`}
            href={p.href}
            download={p.download}
            {...ext}
            className="bb-mono group relative flex items-center justify-center gap-2 rounded-md border px-3 py-3 text-[9.5px] font-semibold transition-all hover:-translate-y-px"
            style={
              isGold
                ? {
                    background: accent,
                    borderColor: accent,
                    color: "#0d0d0d",
                    boxShadow: `0 6px 16px -10px ${accent}A6`,
                  }
                : {
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.12)",
                    color: "rgba(245,245,240,0.78)",
                  }
            }
          >
            <p.Icon size={12} strokeWidth={2.2} />
            <span className="leading-none">{p.label}</span>
          </a>
        );
      })}
    </div>
  );
}

// =============================================================================
// Reusable section — Oswald all-caps title + gold underline.
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
    <section className="px-7 py-7">
      <div className="mb-5 flex items-center gap-3">
        <h2
          className="bb-display text-[15px] font-semibold"
          style={{ color: accent }}
        >
          {title}
        </h2>
        <span
          aria-hidden
          className="block h-px flex-1"
          style={{
            background: `linear-gradient(90deg, ${accent} 0%, transparent 100%)`,
          }}
        />
      </div>
      {children}
    </section>
  );
}

// =============================================================================
// PriceList — services as a price ledger. Mono numerals on dotted leaders.
// =============================================================================

function PriceList({
  items,
  accent,
  title,
}: {
  items: Array<{ title: string; description?: string; priceLabel?: string }>;
  accent: string;
  title: string;
}) {
  return (
    <section className="px-7 py-7">
      <div className="mb-5 flex items-center gap-3">
        <Scissors size={14} strokeWidth={1.6} style={{ color: accent }} />
        <h2
          className="bb-display text-[15px] font-semibold"
          style={{ color: accent }}
        >
          {title}
        </h2>
        <span
          aria-hidden
          className="block h-px flex-1"
          style={{
            background: `linear-gradient(90deg, ${accent} 0%, transparent 100%)`,
          }}
        />
      </div>

      <div
        className="overflow-hidden rounded-2xl border"
        style={{
          background: "rgba(255,255,255,0.025)",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <ul className="divide-y divide-white/8">
          {items.map((item, i) => (
            <li
              key={`${item.title}-${i}`}
              className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 px-4 py-3.5"
            >
              <h3
                className="bb-display text-[12.5px] font-medium leading-tight"
                style={{ color: "#f5f5f0", letterSpacing: "0.12em" }}
              >
                {item.title}
              </h3>
              {item.priceLabel && (
                <span
                  className="bb-mono shrink-0 self-start text-[11.5px] font-semibold tabular-nums"
                  style={{ color: accent, letterSpacing: "0.12em" }}
                >
                  {item.priceLabel}
                </span>
              )}
              {item.description && (
                <p className="col-span-2 text-[11.5px] leading-snug text-[#f5f5f0]/55">
                  {item.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// =============================================================================
// Testimonials — quoted figure with 5-star and author. Cream on ink-black.
// =============================================================================

function Testimonials({
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
      <div className="grid gap-3">
        {items.slice(0, 3).map((item, i) => (
          <figure
            key={`${item.author}-${i}`}
            className="relative overflow-hidden rounded-xl border p-4"
            style={{
              background: "rgba(255,255,255,0.025)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <Quote
              aria-hidden
              size={28}
              strokeWidth={1.4}
              className="absolute right-3 top-3 opacity-15"
              style={{ color: accent }}
            />
            <div
              className="mb-2 flex items-center gap-0.5"
              style={{ color: accent }}
              aria-label="5 of 5 stars"
            >
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={11}
                  strokeWidth={1.5}
                  fill="currentColor"
                />
              ))}
            </div>
            <blockquote
              className="text-[12.5px] italic leading-snug text-[#f5f5f0]/85"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <figcaption
              className="bb-mono mt-3 text-[9px] font-semibold"
              style={{ color: accent, letterSpacing: "0.32em" }}
            >
              — {item.author}
              {item.role && (
                <span className="ml-1.5 text-[#f5f5f0]/40">· {item.role}</span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

// =============================================================================
// BookingStrip — gold filled CTA + hint copy.
// =============================================================================

function BookingStrip({
  bookingUrl,
  phoneDigits,
  accent,
  translations,
}: {
  bookingUrl?: string;
  phoneDigits: string;
  accent: string;
  translations: BbCopy;
}) {
  const href = bookingUrl ?? (phoneDigits ? `tel:${phoneDigits}` : null);
  if (!href) return null;
  const external = bookingUrl ? true : false;

  return (
    <section className="px-7 py-6">
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="group relative flex items-stretch overflow-hidden rounded-2xl border transition-all hover:-translate-y-px"
        style={{
          background: accent,
          borderColor: accent,
          boxShadow: `0 18px 40px -22px ${accent}A6`,
        }}
      >
        <div className="flex-1 px-5 py-5 text-[#0d0d0d]">
          <span
            className="bb-mono mb-1.5 block text-[8.5px] font-semibold"
            style={{ letterSpacing: "0.42em", opacity: 0.7 }}
          >
            {translations.book}
          </span>
          <span className="bb-display block text-[1.4rem] font-semibold leading-tight">
            {translations.bookingCta}
          </span>
          <span className="mt-1.5 flex items-center gap-1.5 text-[11.5px] font-medium opacity-75">
            <Clock size={11} strokeWidth={1.8} />
            {translations.bookingHint}
          </span>
        </div>
        <div
          className="flex w-12 shrink-0 items-center justify-center transition-transform group-hover:translate-x-0.5"
          style={{ background: "rgba(13,13,13,0.18)" }}
        >
          <ArrowUpRight
            size={20}
            strokeWidth={1.8}
            style={{ color: "#0d0d0d" }}
          />
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
  void primary;
  return (
    <section className="px-7 py-2">
      <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={accent} locale={locale} />
      <ExchangeSlot slug={slug} primary={accent} locale={locale} />
    </section>
  );
}

// =============================================================================
// Footer — gold band signature.
// =============================================================================

function Footer({
  siteUrl,
  slug,
  impressumUrl,
  privacyUrl,
  company,
  accent,
  translations,
}: {
  siteUrl: string;
  slug: string;
  impressumUrl?: string;
  privacyUrl?: string;
  company?: string;
  accent: string;
  translations: BbCopy;
}) {
  return (
    <footer
      className="relative px-7 pb-7 pt-7 text-[#f5f5f0]/50"
      style={{ background: "#070707" }}
    >
      <div
        aria-hidden
        className="absolute inset-x-7 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accent}99 30%, ${accent}99 70%, transparent 100%)`,
        }}
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10.5px]">
        <FooterShare siteUrl={siteUrl} slug={slug} />
        {impressumUrl && (
          <a
            href={impressumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#f5f5f0]"
          >
            {translations.impressum}
          </a>
        )}
        {privacyUrl && (
          <a
            href={privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#f5f5f0]"
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
            className="bb-mono font-semibold transition-colors hover:text-[#f5f5f0]"
            style={{ color: accent, letterSpacing: "0.18em" }}
          >
            OpSolid
          </a>
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-white/8 pt-4">
        <MapPin size={11} strokeWidth={1.6} style={{ color: accent }} />
        <span className="bb-mono text-[9.5px] text-[#f5f5f0]/40">
          {company ? `${company} · ` : ""}
          {`opsolid.de/c/${slug}`}
        </span>
      </div>
    </footer>
  );
}

function FooterShare({ siteUrl, slug }: { siteUrl: string; slug: string }) {
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
            // User cancelled — fall through.
          }
        }
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        }
      }}
      className="hover:text-[#f5f5f0]"
    >
      Share
    </button>
  );
}

// =============================================================================
// Registry entry + sample data.
// =============================================================================

export const barberEntry: TemplateRegistryEntry = {
  id: 7,
  key: "barber",
  name: "Barber",
  industry: "Barber / men's grooming / classic salon",
  Component: Barber,
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
    logo: true,
  },
  defaults: {
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "sample-barber",
  nameRules: { transform: "uppercase", maxDisplayLength: 24 },
};

export const barberSample: SampleData = {
  templateId: 7,
  slug: "sample-barber",
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
  cardData: {
    name: "Edward Sterling",
    title: "Master Barber",
    position: "Founder & Master Barber",
    company: "House of Sterling",
    email: "edward@houseofsterling.co.uk",
    phone: "+44 20 7493 0044",
    whatsapp: "+44 7700 900142",
    website: "https://houseofsterling.co.uk",
    address: "27 Mount Street, Mayfair, London W1K 2RX",
    bio: "Twenty-two years behind the chair, eight at Truefitt & Hill before opening House of Sterling on Mount Street in 2018. Trained in classic British barbering, Italian shaving and the Japanese hot-towel discipline.",
    bookingUrl: "https://booksy.com/houseofsterling",
    sectorKey: "salon",
    services: [
      {
        title: "The Sterling Cut",
        description:
          "Consultation, scissor-over-comb cut, classic styling and a finishing pomade. Allow 45 minutes.",
        priceLabel: "£55",
      },
      {
        title: "Hot-towel shave",
        description:
          "Pre-shave oil, two-pass straight razor, restorative balm. The full ritual, 50 minutes.",
        priceLabel: "£75",
      },
      {
        title: "Beard sculpt & line-up",
        description:
          "Trim, shape and detail with hot towel and beard oil. 30 minutes.",
        priceLabel: "£45",
      },
      {
        title: "Father & son",
        description:
          "Two cuts in adjacent chairs. Boys 12 and under welcome any time.",
        priceLabel: "£85",
      },
      {
        title: "Grey blending",
        description:
          "Discreet, ammonia-free toning for men who want to refresh without colouring fully.",
        priceLabel: "£60",
      },
      {
        title: "Hair & scalp ritual",
        description:
          "Deep cleanse, scalp massage and conditioning treatment. 40 minutes.",
        priceLabel: "£50",
      },
      {
        title: "Wedding morning package",
        description:
          "Groom plus three at the shop or on location. Includes shave, cut and styling.",
        priceLabel: "£420",
      },
      {
        title: "Boy's first cut",
        description: "Children under eight, with a complimentary photograph for parents.",
        priceLabel: "£25",
      },
    ],
    testimonials: [
      {
        author: "Henry W.",
        role: "Belgravia",
        quote:
          "Edward has been my barber for six years. Calm hands, perfect line, and the only place in London I trust with a straight razor.",
      },
      {
        author: "Aleksander R.",
        role: "Knightsbridge",
        quote:
          "The shop feels like a club without the pretence. The hot-towel shave is genuinely meditative.",
      },
      {
        author: "James P.",
        role: "Mayfair",
        quote:
          "I came in three days before my wedding panicking. Walked out looking like the photograph my fiancée had pinned on our fridge.",
      },
    ],
    socials: {
      instagram: "https://instagram.com/houseofsterling",
      facebook: "https://facebook.com/houseofsterlinglondon",
    },
    impressumUrl: "https://houseofsterling.co.uk/legal",
    privacyUrl: "https://houseofsterling.co.uk/privacy",
  },
};
