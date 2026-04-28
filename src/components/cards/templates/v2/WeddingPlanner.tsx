"use client";

// =============================================================================
// WeddingPlanner — v2 template (id=21, key="wedding-planner").
//
// Sector: wedding planner / event coordinator / private celebrations.
// Tone: romantic, hand-lettered, soft pastels — cream/blush surface, Cormorant
// Garamond italic for the name, Dancing Script accents (sparingly), gold-leaf
// floral SVG corners, dusty-rose buttons. Distinct from Editorial (steel-blue
// boutique gravitas) — this leans softer, more intimate.
//
// Locked design choices (do not parameterise — only colours respond to brand):
//   - Cream / blush surface ladder (#fdf8f5 → #faf2eb → #fff).
//   - Decorative floral SVG corners (top-right hero, bottom-left footer).
//   - "Currently planning" status line under name with handwritten Dancing
//     Script accent beside upcoming wedding count.
//   - Services list: "Wedding · Reception · Coordination" rendered as
//     etched cards with brand-color price label.
//   - Instagram is the prominent social — gets pride of place.
//   - "Book consultation" CTA in brand primary, full bleed.
//   - Cormorant Garamond + Dancing Script (accent-only) per spec.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Calendar,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  Shield,
  Sparkles,
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
// Locked defaults — dusty rose + champagne. Override via brandPrimaryHex.
// -----------------------------------------------------------------------------
const LOCKED_PRIMARY = "#9d6b5e"; // dusty rose
const LOCKED_ACCENT = "#e8c4a0"; // champagne

// Fixed surface palette — the cream/blush ladder is part of the locked design,
// not brand-responsive.
const SURFACE_BASE = "#fdf8f5"; // outer cream
const SURFACE_PANEL = "#ffffff"; // raised panels
const SURFACE_TINT = "#faf2eb"; // soft blush
const TEXT_DARK = "#3d2e2a";
const TEXT_MID = "#7a6660";
const TEXT_LIGHT = "#a89890";
const HAIRLINE = "#e8d8d0";

// -----------------------------------------------------------------------------
// Contrast helper — picks readable text colour for a given hex background.
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

interface WpCopy {
  saveContact: string;
  callNow: string;
  whatsapp: string;
  email: string;
  book: string;
  bookConsultation: string;
  bookHint: string;
  about: string;
  services: string;
  servicesEyebrow: string;
  voices: string;
  contact: string;
  social: string;
  followOnInstagram: string;
  walletLabel: string;
  currentlyPlanning: string;
  upcomingWeddings: string;
  withLove: string;
  impressum: string;
  privacy: string;
  poweredBy: string;
  share: string;
  ourPromise: string;
}

const COPY: Record<"de" | "en" | "tr", WpCopy> = {
  de: {
    saveContact: "Speichern",
    callNow: "Anrufen",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    book: "Termin",
    bookConsultation: "Beratungsgespräch buchen",
    bookHint: "Ein erstes Kennenlernen — unverbindlich, oft bei einem Glas Wein.",
    about: "Über uns",
    services: "Unsere Leistungen",
    servicesEyebrow: "Atelier",
    voices: "Stimmen unserer Paare",
    contact: "Kontakt",
    social: "Folgen",
    followOnInstagram: "Auf Instagram folgen",
    walletLabel: "Auf Smartphone speichern",
    currentlyPlanning: "Derzeit in Planung",
    upcomingWeddings: "Hochzeiten in dieser Saison",
    withLove: "Mit Liebe gemacht",
    impressum: "Impressum",
    privacy: "Datenschutz",
    poweredBy: "Powered by",
    share: "Teilen",
    ourPromise: "Unser Versprechen",
  },
  en: {
    saveContact: "Save contact",
    callNow: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    book: "Book",
    bookConsultation: "Book a consultation",
    bookHint: "A first conversation — no commitment, often over a glass of wine.",
    about: "About",
    services: "Our services",
    servicesEyebrow: "Atelier",
    voices: "From our couples",
    contact: "Get in touch",
    social: "Follow",
    followOnInstagram: "Follow on Instagram",
    walletLabel: "Add to wallet",
    currentlyPlanning: "Currently planning",
    upcomingWeddings: "weddings this season",
    withLove: "Made with love",
    impressum: "Imprint",
    privacy: "Privacy",
    poweredBy: "Powered by",
    share: "Share",
    ourPromise: "Our promise",
  },
  tr: {
    saveContact: "Rehbere kaydet",
    callNow: "Ara",
    whatsapp: "WhatsApp",
    email: "E-posta",
    book: "Randevu",
    bookConsultation: "Tanışma görüşmesi planla",
    bookHint: "İlk sohbetimiz — bağlayıcı değil, çoğunlukla bir kadeh şarap eşliğinde.",
    about: "Hakkımızda",
    services: "Hizmetlerimiz",
    servicesEyebrow: "Atölye",
    voices: "Çiftlerimizden",
    contact: "İletişim",
    social: "Takip et",
    followOnInstagram: "Instagram'da takip et",
    walletLabel: "Cüzdana ekle",
    currentlyPlanning: "Planlanıyor",
    upcomingWeddings: "düğün bu sezon",
    withLove: "Sevgi ile yapıldı",
    impressum: "Künye",
    privacy: "Gizlilik",
    poweredBy: "Powered by",
    share: "Paylaş",
    ourPromise: "Sözümüz",
  },
};

export function WeddingPlanner({
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
      ? cardData.services.slice(0, 4)
      : sector?.services?.slice(0, 4);

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  // "Currently planning N weddings" — derive count from upcoming testimonials,
  // fall back to a tasteful default phrase when there's no count to show.
  const upcomingCount = (cardData.testimonials ?? []).length;

  const subtitle = [cardData.position, cardData.title].filter(Boolean).join(" · ");

  return (
    <article
      data-template="wedding-planner"
      className={`wp-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(157,107,94,0.32),0_8px_22px_-12px_rgba(157,107,94,0.18)] ring-1 ring-black/5`}
      style={
        {
          background: SURFACE_BASE,
          color: TEXT_DARK,
          ["--wp-primary" as string]: primary,
          ["--wp-accent" as string]: accent,
          ["--wp-on-primary" as string]: onPrimary,
          ["--wp-on-accent" as string]: onAccent,
          ["--wp-primary-soft" as string]: `${primary}1A`,
          ["--wp-accent-soft" as string]: `${accent}26`,
          ["--card-primary" as string]: primary,
          ["--card-accent" as string]: accent,
          ["--font-wp-display" as string]: "'Cormorant Garamond', Georgia, serif",
          ["--font-wp-script" as string]: "'Dancing Script', cursive",
          fontFamily: "var(--font-wp-display), 'Cormorant Garamond', Georgia, serif",
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .wp-card {
          font-family: var(--font-wp-display), "Cormorant Garamond", Georgia, serif;
          line-height: 1.65;
          color: ${TEXT_DARK};
        }
        .wp-card .wp-display {
          font-family: var(--font-wp-display), "Cormorant Garamond", Georgia, serif;
          letter-spacing: 0.005em;
          font-feature-settings: "lnum";
        }
        .wp-card .wp-italic {
          font-family: var(--font-wp-display), "Cormorant Garamond", Georgia, serif;
          font-style: italic;
          font-weight: 500;
        }
        .wp-card .wp-script {
          font-family: var(--font-wp-script), "Dancing Script", "Brush Script MT", cursive;
          font-weight: 600;
          letter-spacing: 0.005em;
        }
        .wp-card .wp-mono {
          font-family: var(--font-wp-display), "Cormorant Garamond", Georgia, serif;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          font-weight: 600;
          font-size: 10px;
        }
        .wp-card .wp-body {
          font-family: var(--font-wp-display), "Cormorant Garamond", Georgia, serif;
          font-weight: 400;
        }
      `}</style>

      <Hero
        photoUrl={photoUrl}
        logoUrl={logoUrl}
        initials={initials}
        company={cardData.company}
        name={cardData.name}
        subtitle={subtitle}
        primary={primary}
        accent={accent}
        sectorBadge={sector?.name}
        sourceLabel={sourceLabel}
        translations={t}
        upcomingCount={upcomingCount}
      />

      <DivinerStrip
        address={cardData.address}
        company={cardData.company}
        primary={primary}
        accent={accent}
      />

      <QuickActions
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

      {cardData.bio && (
        <AboutSection
          bio={cardData.bio}
          accent={accent}
          title={t.about}
        />
      )}

      {services && services.length > 0 && (
        <ServicesSection
          items={services}
          primary={primary}
          accent={accent}
          translations={t}
          waDigits={waDigits}
        />
      )}

      {cardData.testimonials && cardData.testimonials.length > 0 && (
        <Voices
          items={cardData.testimonials.slice(0, 3)}
          primary={primary}
          accent={accent}
          title={t.voices}
        />
      )}

      <BookConsultation
        bookingUrl={cardData.bookingUrl}
        email={cardData.email}
        primary={primary}
        accent={accent}
        onPrimary={onPrimary}
        translations={t}
      />

      <ContactSection
        cardData={cardData}
        locale={locale}
        primary={primary}
        accent={accent}
        translations={t}
      />

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
          className="border-t px-6 py-5"
          labelClassName="wp-mono mb-3"
        >
          {walletSlot}
        </WalletDock>
      )}

      {cardData.socials && (
        <SocialSection
          socials={cardData.socials}
          primary={primary}
          accent={accent}
          onPrimary={onPrimary}
          title={t.social}
          followLabel={t.followOnInstagram}
        />
      )}

      <Footer
        siteUrl={siteUrl}
        slug={slug}
        impressumUrl={cardData.impressumUrl}
        privacyUrl={cardData.privacyUrl}
        company={cardData.company}
        primary={primary}
        accent={accent}
        translations={t}
      />
    </article>
  );
}

// =============================================================================
// HERO — cream surface with floral SVG corner, photo in soft circle, italic
// serif name, "Currently planning N weddings" status line.
// =============================================================================

function Hero({
  photoUrl,
  logoUrl,
  initials,
  company,
  name,
  subtitle,
  primary,
  accent,
  sectorBadge,
  sourceLabel,
  translations,
  upcomingCount,
}: {
  photoUrl: string | null;
  logoUrl: string | null;
  initials: string;
  company?: string;
  name: string;
  subtitle: string;
  primary: string;
  accent: string;
  sectorBadge?: string;
  sourceLabel?: string;
  translations: WpCopy;
  upcomingCount: number;
}) {
  return (
    <header
      className="relative overflow-hidden px-6 pb-9 pt-12 text-center"
      style={{
        background: `linear-gradient(180deg, ${SURFACE_TINT} 0%, ${SURFACE_BASE} 100%)`,
      }}
    >
      {/* Floral SVG accent — top-right corner. */}
      <FloralCorner
        position="top-right"
        primary={primary}
        accent={accent}
      />
      {/* Mirrored floral accent — top-left, lower opacity. */}
      <FloralCorner
        position="top-left"
        primary={primary}
        accent={accent}
        muted
      />

      {/* Sector / source pills — discreet under the floral. */}
      {(sectorBadge || sourceLabel) && (
        <div className="relative z-10 mb-6 flex items-center justify-center gap-2">
          {sectorBadge && (
            <span
              className="wp-mono inline-block rounded-full px-2.5 py-1 text-[9px]"
              style={{
                color: primary,
                background: `${primary}10`,
                border: `1px solid ${primary}33`,
              }}
            >
              {sectorBadge}
            </span>
          )}
          {sourceLabel && (
            <span
              className="wp-mono inline-block rounded-full px-2.5 py-1 text-[9px]"
              style={{
                color: TEXT_LIGHT,
                background: SURFACE_PANEL,
                border: `1px solid ${HAIRLINE}`,
              }}
            >
              {sourceLabel}
            </span>
          )}
        </div>
      )}

      {/* Photo / logo / monogram circle — soft champagne ring. */}
      <div className="relative z-10 mx-auto mb-6">
        <div
          className="relative mx-auto h-[92px] w-[92px] rounded-full p-[2px]"
          style={{
            background: `conic-gradient(from 220deg at 50% 50%, ${accent} 0%, ${primary}66 50%, ${accent} 100%)`,
            boxShadow: `0 12px 30px -12px ${primary}66, 0 0 0 6px ${SURFACE_BASE}`,
          }}
        >
          <div
            className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full"
            style={{ background: SURFACE_PANEL }}
          >
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={name}
                fill
                unoptimized
                sizes="92px"
                className="object-cover tpl-photo"
              />
            ) : logoUrl ? (
              <Image
                src={logoUrl}
                alt={company ? `${company} logo` : name}
                width={140}
                height={140}
                className="h-[68%] w-[68%] object-contain tpl-logo"
                unoptimized
              />
            ) : (
              <span
                className="wp-display text-[28px] font-medium"
                style={{ color: primary }}
              >
                {initials}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Italic serif artist/atelier name. */}
      <h1
        className="wp-italic relative z-10 text-[2.6rem] font-medium leading-[1.05] sm:text-[2.9rem]"
        style={{ color: TEXT_DARK }}
      >
        {name}
      </h1>

      {company && (
        <p
          className="wp-mono relative z-10 mt-3 text-[10px]"
          style={{ color: primary }}
        >
          {company}
        </p>
      )}

      {subtitle && (
        <p
          className="wp-italic relative z-10 mt-2 text-[14px]"
          style={{ color: TEXT_MID }}
        >
          {subtitle}
        </p>
      )}

      {/* Decorative diamond rule — gold-leaf hairline + heart. */}
      <div className="relative z-10 mt-6 flex items-center justify-center gap-3">
        <span
          aria-hidden
          className="block h-px w-12"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />
        <Heart
          size={11}
          strokeWidth={1.6}
          fill={accent}
          style={{ color: accent }}
        />
        <span
          aria-hidden
          className="block h-px w-12"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />
      </div>

      {/* "Currently planning N weddings" — script + serif blend. */}
      {upcomingCount > 0 && (
        <p
          className="relative z-10 mt-4 inline-flex items-center justify-center gap-1.5 text-[13px]"
          style={{ color: TEXT_MID }}
        >
          <span className="wp-italic">{translations.currentlyPlanning}</span>
          <span
            className="wp-script text-[20px] leading-none"
            style={{ color: primary }}
          >
            {upcomingCount}
          </span>
          <span className="wp-italic">{translations.upcomingWeddings}</span>
        </p>
      )}
    </header>
  );
}

// Decorative floral SVG corner — three soft petals + tendril. Pure stroke art.
function FloralCorner({
  position,
  primary,
  accent,
  muted = false,
}: {
  position: "top-right" | "top-left" | "bottom-left";
  primary: string;
  accent: string;
  muted?: boolean;
}) {
  const opacity = muted ? 0.18 : 0.42;
  const isLeft = position.endsWith("left");
  const isBottom = position.startsWith("bottom");
  const transform = `${isLeft ? "scaleX(-1) " : ""}${isBottom ? "scaleY(-1) " : ""}`.trim();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        width: 120,
        height: 120,
        top: isBottom ? "auto" : 0,
        bottom: isBottom ? 0 : "auto",
        right: isLeft ? "auto" : 0,
        left: isLeft ? 0 : "auto",
        opacity,
        transform,
        transformOrigin: "center",
      }}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tendril — gentle curve from corner */}
        <path
          d="M120 12 C 95 22, 78 36, 64 60 C 56 72, 52 84, 50 100"
          stroke={primary}
          strokeWidth="0.9"
          strokeLinecap="round"
          fill="none"
        />
        {/* Petal cluster — three soft strokes */}
        <ellipse
          cx="92"
          cy="32"
          rx="11"
          ry="5"
          stroke={accent}
          strokeWidth="0.8"
          fill={`${accent}44`}
          transform="rotate(-22 92 32)"
        />
        <ellipse
          cx="100"
          cy="44"
          rx="9"
          ry="4"
          stroke={accent}
          strokeWidth="0.8"
          fill={`${accent}33`}
          transform="rotate(15 100 44)"
        />
        <ellipse
          cx="84"
          cy="46"
          rx="8"
          ry="4"
          stroke={accent}
          strokeWidth="0.8"
          fill={`${accent}33`}
          transform="rotate(-50 84 46)"
        />
        <circle cx="92" cy="38" r="2.4" fill={primary} opacity="0.6" />

        {/* Smaller bud cluster downstream */}
        <ellipse
          cx="68"
          cy="64"
          rx="6"
          ry="3"
          stroke={accent}
          strokeWidth="0.7"
          fill={`${accent}22`}
          transform="rotate(35 68 64)"
        />
        <circle cx="68" cy="64" r="1.4" fill={primary} opacity="0.5" />

        {/* Tiny leaves */}
        <path
          d="M76 52 Q 80 50, 82 54"
          stroke={primary}
          strokeWidth="0.7"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M58 78 Q 62 76, 64 80"
          stroke={primary}
          strokeWidth="0.7"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}

// =============================================================================
// Diviner strip — italic address line with decorative rule, on white panel.
// =============================================================================

function DivinerStrip({
  company,
  address,
  primary,
  accent,
}: {
  company?: string;
  address?: string;
  primary: string;
  accent: string;
}) {
  if (!address && !company) return null;
  return (
    <div
      className="relative flex items-center justify-center gap-3 px-6 py-4"
      style={{
        background: SURFACE_PANEL,
        borderTop: `1px solid ${HAIRLINE}`,
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <span
        aria-hidden
        className="block h-px w-8"
        style={{ background: accent }}
      />
      <span
        className="wp-italic text-center text-[13.5px]"
        style={{ color: primary }}
      >
        {address ?? company}
      </span>
      <span
        aria-hidden
        className="block h-px w-8"
        style={{ background: accent }}
      />
    </div>
  );
}

// =============================================================================
// Quick action pills — soft rounded, pastel accents.
// =============================================================================

function QuickActions({
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
  translations: WpCopy;
}) {
  type Pill = {
    label: string;
    href: string;
    Icon: LucideIcon;
    tone: "primary" | "accent" | "outline";
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
      tone: "outline",
    });
  }
  if (waDigits) {
    pills.push({
      label: translations.whatsapp,
      href: `https://wa.me/${waDigits}`,
      Icon: MessageCircle,
      tone: "outline",
      external: true,
    });
  }
  if (email) {
    pills.push({
      label: translations.email,
      href: `mailto:${email}`,
      Icon: Mail,
      tone: "accent",
    });
  }
  if (bookingUrl) {
    pills.push({
      label: translations.book,
      href: bookingUrl,
      Icon: Calendar,
      tone: "outline",
      external: true,
    });
  }

  return (
    <div
      className="flex flex-wrap justify-center gap-2 px-6 py-5"
      style={{ background: SURFACE_BASE }}
    >
      {pills.map((p, i) => {
        const ext = p.external
          ? { target: "_blank", rel: "noopener noreferrer" as const }
          : {};
        return (
          <a
            key={`${p.label}-${i}`}
            href={p.href}
            download={p.download}
            {...ext}
            className="wp-italic inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13.5px] font-medium transition-all hover:-translate-y-px"
            style={
              p.tone === "primary"
                ? {
                    background: primary,
                    color: onPrimary,
                    boxShadow: `0 8px 20px -10px ${primary}AA`,
                  }
                : p.tone === "accent"
                  ? {
                      background: accent,
                      color: onAccent,
                      boxShadow: `0 8px 20px -10px ${accent}AA`,
                    }
                  : {
                      background: SURFACE_PANEL,
                      color: primary,
                      border: `1px solid ${primary}55`,
                    }
            }
          >
            <p.Icon size={13} strokeWidth={1.8} />
            {p.label}
          </a>
        );
      })}
    </div>
  );
}

// =============================================================================
// Section frame — centred italic serif title with floral hairline below.
// =============================================================================

function SectionFrame({
  title,
  accent,
  background,
  eyebrow,
  children,
  pad = "px-6 py-9",
}: {
  title: string;
  accent: string;
  background?: string;
  eyebrow?: string;
  children: React.ReactNode;
  pad?: string;
}) {
  return (
    <section
      className={`relative ${pad}`}
      style={{ background: background ?? "transparent" }}
    >
      <div className="mb-6 text-center">
        {eyebrow && (
          <span
            className="wp-mono mb-2 block"
            style={{ color: accent }}
          >
            {eyebrow}
          </span>
        )}
        <h2
          className="wp-italic text-[24px] font-medium leading-tight"
          style={{ color: TEXT_DARK }}
        >
          {title}
        </h2>
        <span
          aria-hidden
          className="mx-auto mt-3 inline-flex items-center gap-2"
          style={{ color: accent }}
        >
          <span
            className="block h-px w-6"
            style={{ background: accent }}
          />
          <Sparkles size={9} strokeWidth={1.6} />
          <span
            className="block h-px w-6"
            style={{ background: accent }}
          />
        </span>
      </div>
      {children}
    </section>
  );
}

// =============================================================================
// About — single body paragraph, italic drop quote-mark, soft panel.
// =============================================================================

function AboutSection({
  bio,
  accent,
  title,
}: {
  bio: string;
  accent: string;
  title: string;
}) {
  return (
    <SectionFrame title={title} accent={accent}>
      <div
        className="relative rounded-2xl p-7"
        style={{
          background: SURFACE_PANEL,
          border: `1px solid ${HAIRLINE}`,
          boxShadow: "0 2px 18px rgba(157,107,94,0.06)",
        }}
      >
        <Quote
          aria-hidden
          size={28}
          strokeWidth={1}
          className="absolute -left-2 -top-3 rotate-180"
          style={{ color: accent, opacity: 0.6 }}
        />
        <p
          className="wp-body text-[15px] leading-[1.85]"
          style={{ color: TEXT_MID }}
        >
          {bio}
        </p>
      </div>
    </SectionFrame>
  );
}

// =============================================================================
// Services — etched cards: italic serif name + body + brand-color price.
// =============================================================================

function ServicesSection({
  items,
  primary,
  accent,
  translations,
  waDigits,
}: {
  items: Array<{ title: string; description?: string; priceLabel?: string }>;
  primary: string;
  accent: string;
  translations: WpCopy;
  waDigits: string;
}) {
  return (
    <SectionFrame
      title={translations.services}
      accent={accent}
      eyebrow={translations.servicesEyebrow}
      background={SURFACE_TINT}
    >
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <article
            key={`${item.title}-${i}`}
            className="rounded-2xl p-6 transition-all hover:-translate-y-0.5"
            style={{
              background: SURFACE_PANEL,
              border: `1px solid ${HAIRLINE}`,
              boxShadow: "0 2px 14px rgba(157,107,94,0.05)",
            }}
          >
            <div className="mb-2.5 flex items-baseline justify-between gap-3">
              <h3
                className="wp-italic text-[20px] font-medium leading-snug"
                style={{ color: TEXT_DARK }}
              >
                {item.title}
              </h3>
              {item.priceLabel && (
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium"
                  style={{
                    background: `${accent}33`,
                    color: primary,
                  }}
                >
                  {item.priceLabel}
                </span>
              )}
            </div>
            {item.description && (
              <p
                className="wp-body mb-3 text-[13.5px] leading-[1.75]"
                style={{ color: TEXT_MID }}
              >
                {item.description}
              </p>
            )}
            <a
              href={
                waDigits
                  ? `https://wa.me/${waDigits}?text=${encodeURIComponent(`Re: ${item.title}`)}`
                  : "#"
              }
              target={waDigits ? "_blank" : undefined}
              rel={waDigits ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-1 text-[12px] font-medium transition-colors"
              style={{ color: primary }}
            >
              <span className="wp-mono text-[10px]">
                {translations.book}
              </span>
              <ArrowUpRight size={11} strokeWidth={2} />
            </a>
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}

// =============================================================================
// Voices — testimonials in soft panels with large italic quote.
// =============================================================================

function Voices({
  items,
  primary,
  accent,
  title,
}: {
  items: Array<{ author: string; role?: string; quote: string }>;
  primary: string;
  accent: string;
  title: string;
}) {
  return (
    <SectionFrame title={title} accent={accent}>
      <div className="flex flex-col gap-3">
        {items.map((it, i) => (
          <figure
            key={`${it.author}-${i}`}
            className="relative overflow-hidden rounded-2xl p-7"
            style={{
              background: SURFACE_PANEL,
              border: `1px solid ${HAIRLINE}`,
              boxShadow: "0 2px 14px rgba(157,107,94,0.06)",
            }}
          >
            <span
              aria-hidden
              className="wp-script absolute -left-1 -top-3 text-[64px] leading-none"
              style={{ color: `${accent}55` }}
            >
              &ldquo;
            </span>
            <blockquote
              className="wp-italic relative pl-2 text-[15px] leading-[1.75]"
              style={{ color: TEXT_DARK }}
            >
              {it.quote}
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-2">
              <Heart
                size={9}
                strokeWidth={1.4}
                fill={accent}
                style={{ color: accent }}
              />
              <span
                className="wp-script text-[16px]"
                style={{ color: primary }}
              >
                {it.author}
              </span>
              {it.role && (
                <span
                  className="wp-italic text-[12px]"
                  style={{ color: TEXT_LIGHT }}
                >
                  · {it.role}
                </span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </SectionFrame>
  );
}

// =============================================================================
// BookConsultation — primary CTA strip in brand color.
// =============================================================================

function BookConsultation({
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
  translations: WpCopy;
}) {
  const href = bookingUrl ?? (email ? `mailto:${email}` : null);
  if (!href) return null;
  const external = bookingUrl ? true : false;

  return (
    <section className="px-6 py-7" style={{ background: SURFACE_BASE }}>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="group relative flex items-stretch overflow-hidden rounded-2xl transition-all hover:-translate-y-px"
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, ${primary}DD 100%)`,
          boxShadow: `0 18px 40px -18px ${primary}AA, 0 4px 14px -8px ${accent}66`,
        }}
      >
        <div className="flex-1 px-6 py-6">
          <span
            className="wp-mono mb-1.5 block text-[9px] opacity-80"
            style={{ color: onPrimary }}
          >
            {translations.book}
          </span>
          <span
            className="wp-italic block text-[1.55rem] leading-tight"
            style={{ color: onPrimary }}
          >
            {translations.bookConsultation}
          </span>
          <span
            className="wp-body mt-2 block text-[12.5px] leading-snug"
            style={{ color: onPrimary, opacity: 0.85 }}
          >
            {translations.bookHint}
          </span>
        </div>
        <div
          className="flex w-14 shrink-0 items-center justify-center transition-transform group-hover:translate-x-0.5"
          style={{ background: "rgba(255,255,255,0.16)" }}
        >
          <ArrowUpRight size={20} strokeWidth={1.8} style={{ color: onPrimary }} />
        </div>
      </a>
    </section>
  );
}

// =============================================================================
// Contact — soft tile rows with brand-tinted icon chip.
// =============================================================================

function ContactSection({
  cardData,
  locale,
  primary,
  accent,
  translations,
}: {
  cardData: TemplateProps["cardData"];
  locale: "de" | "en" | "tr";
  primary: string;
  accent: string;
  translations: WpCopy;
}) {
  return (
    <SectionFrame
      title={translations.contact}
      accent={accent}
      background={SURFACE_TINT}
    >
      <ContactRows
        cardData={cardData}
        locale={locale}
        accentHex={primary}
        renderRow={(row) => {
          const ext = row.external
            ? { target: "_blank", rel: "noopener noreferrer" as const }
            : {};
          return (
            <a
              href={row.href}
              {...ext}
              className="group flex items-center gap-3.5 rounded-2xl px-5 py-3.5 transition-all hover:-translate-y-px"
              style={{
                background: SURFACE_PANEL,
                border: `1px solid ${HAIRLINE}`,
                boxShadow: "0 2px 12px rgba(157,107,94,0.05)",
              }}
            >
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `${primary}14`,
                  color: primary,
                }}
              >
                <row.Icon size={15} strokeWidth={1.6} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span
                  className="wp-mono text-[10px]"
                  style={{ color: TEXT_LIGHT }}
                >
                  {row.label}
                </span>
                <span
                  className="wp-italic truncate text-[14px] font-medium"
                  style={{ color: TEXT_DARK }}
                >
                  {row.value}
                </span>
              </span>
            </a>
          );
        }}
      />
    </SectionFrame>
  );
}

// =============================================================================
// CTA — Wallet/Exchange/SendMyInfo wrappers.
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
    <section className="px-6 pb-2 pt-1" style={{ background: SURFACE_BASE }}>
      <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={primary} locale={locale} />
      <ExchangeSlot slug={slug} primary={accent} locale={locale} />
    </section>
  );
}

// =============================================================================
// Social — Instagram is featured prominently, others as soft pills.
// =============================================================================

function SocialSection({
  socials,
  primary,
  accent,
  onPrimary,
  title,
  followLabel,
}: {
  socials: NonNullable<TemplateProps["cardData"]["socials"]>;
  primary: string;
  accent: string;
  onPrimary: string;
  title: string;
  followLabel: string;
}) {
  const instagram = socials.instagram;

  return (
    <SectionFrame
      title={title}
      accent={accent}
      background={SURFACE_BASE}
    >
      {/* Featured Instagram CTA — always above the pill row when present. */}
      {instagram && (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="group mb-4 flex items-center justify-center gap-2.5 rounded-2xl px-5 py-3.5 transition-all hover:-translate-y-px"
          style={{
            background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
            boxShadow: `0 10px 28px -14px ${primary}AA`,
          }}
        >
          <InstagramFlourish size={16} color={onPrimary} />
          <span
            className="wp-italic text-[14.5px] font-medium"
            style={{ color: onPrimary }}
          >
            {followLabel}
          </span>
          <ArrowUpRight
            size={14}
            strokeWidth={2}
            style={{ color: onPrimary }}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      )}

      <SocialRow
        socials={socials}
        variant="pill"
        accentHex={primary}
        className="flex flex-wrap justify-center gap-2"
        itemClassName="!bg-white !border-[#e8d8d0] !text-[#7a6660] hover:!border-[var(--wp-primary)] hover:!text-[var(--wp-primary)]"
      />
    </SectionFrame>
  );
}

// Inline Instagram glyph — matches SocialRow's glyphs but renders larger here.
function InstagramFlourish({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// =============================================================================
// Footer — cream band with floral accent + script signature.
// =============================================================================

function Footer({
  siteUrl,
  slug,
  impressumUrl,
  privacyUrl,
  company,
  primary,
  accent,
  translations,
}: {
  siteUrl: string;
  slug: string;
  impressumUrl?: string;
  privacyUrl?: string;
  company?: string;
  primary: string;
  accent: string;
  translations: WpCopy;
}) {
  return (
    <footer
      className="relative px-6 pb-7 pt-8"
      style={{
        background: SURFACE_PANEL,
        borderTop: `1px solid ${HAIRLINE}`,
      }}
    >
      <FloralCorner
        position="bottom-left"
        primary={primary}
        accent={accent}
        muted
      />

      <div className="mb-4 flex flex-col items-center gap-2.5">
        <span
          className="wp-script text-center text-[22px]"
          style={{ color: primary }}
        >
          {translations.withLove}
        </span>
        {company && (
          <p
            className="wp-italic text-center text-[13px]"
            style={{ color: TEXT_MID }}
          >
            {company}
          </p>
        )}
      </div>

      <div
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px]"
        style={{ color: TEXT_LIGHT }}
      >
        <FooterShare siteUrl={siteUrl} slug={slug} label={translations.share} />
        {impressumUrl && (
          <>
            <span>·</span>
            <a
              href={impressumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--wp-primary)]"
            >
              {translations.impressum}
            </a>
          </>
        )}
        {privacyUrl && (
          <>
            <span>·</span>
            <a
              href={privacyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--wp-primary)]"
            >
              {translations.privacy}
            </a>
          </>
        )}
      </div>

      <div
        className="mt-3 flex items-center justify-center gap-1.5 text-[11px]"
        style={{ color: TEXT_LIGHT }}
      >
        <Shield size={10} strokeWidth={1.8} />
        {translations.poweredBy}{" "}
        <a
          href="https://opsolid.de/products/digital-card"
          target="_blank"
          rel="noopener noreferrer"
          className="wp-italic font-semibold"
          style={{ color: primary }}
        >
          OpSolid
        </a>
      </div>
      <div
        className="mt-2 flex items-center justify-center gap-1.5 text-[10px]"
        style={{ color: TEXT_LIGHT }}
      >
        <MapPin size={9} strokeWidth={1.6} />
        <span>{`opsolid.de/c/${slug}`}</span>
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
      className="transition-colors hover:text-[var(--wp-primary)]"
    >
      {label}
    </button>
  );
}

// =============================================================================
// Registry entry + sample data.
// =============================================================================

export const weddingPlannerEntry: TemplateRegistryEntry = {
  id: 21,
  key: "wedding-planner",
  name: "Wedding Planner",
  industry: "Wedding planner / event coordinator",
  Component: WeddingPlanner,
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
  sampleSlug: "demo-wedding-planner",
};

// source: Unsplash — https://unsplash.com/license (free for commercial use).
const WEDDING_PLANNER_SAMPLE_PHOTO =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80";

export const weddingPlannerSample: SampleData = {
  templateId: 21,
  slug: "demo-wedding-planner",
  photoUrl: WEDDING_PLANNER_SAMPLE_PHOTO,
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
  cardData: {
    name: "Elena Bellini",
    title: "Bespoke weddings & private celebrations",
    position: "Founder & Lead Planner",
    company: "Maison Fiorello",
    email: "elena@maisonfiorello.com",
    phone: "+39 0184 555 0218",
    whatsapp: "+39 339 778 4421",
    website: "https://maisonfiorello.com",
    address: "Via dei Fiori 12, Portofino, Italia",
    bio: "For the past nine years, Maison Fiorello has been planning weddings and intimate celebrations along the Italian Riviera, in Tuscany, and on Lake Como. We believe every wedding should feel inevitable — never staged, never rushed. We take on no more than fifteen weddings a season so each couple has our full hand from the first phone call to the last dance.",
    bookingUrl: "https://cal.com/maisonfiorello/discovery",
    sectorKey: "hospitality",
    services: [
      {
        title: "The Intimate Wedding",
        description:
          "Up to 30 guests. Private villa or vineyard, single-day celebration with full planning, day-of coordination, and our trusted vendor network.",
        priceLabel: "from €14 000",
      },
      {
        title: "The Full Celebration",
        description:
          "30–120 guests. Multi-day weekend with welcome dinner, ceremony, and brunch — lodging coordination and complete planning included.",
        priceLabel: "from €38 000",
      },
      {
        title: "Reception Coordination",
        description:
          "For couples who've planned the wedding themselves. We arrive two weeks before, run the rehearsal, and direct the day so you can simply be present.",
        priceLabel: "from €4 800",
      },
      {
        title: "Destination Celebrations",
        description:
          "Beyond Liguria — Amalfi, Capri, Tuscany, the Dolomites. Six-month lead time. Travel and full venue scouting included.",
        priceLabel: "Custom",
      },
    ],
    testimonials: [
      {
        author: "Sophie & James",
        role: "Sept 2025 · Villa Cimbrone, Ravello",
        quote:
          "Elena planned three days that felt like one long, beautiful exhale. We had nothing to worry about — and that, on a wedding day, is the rarest gift.",
      },
      {
        author: "Aylin & Marco",
        role: "Jun 2025 · Castello di Spaltenna",
        quote:
          "Every detail was held with such care. Maison Fiorello doesn't plan weddings, they compose them. We'll be back for our anniversary.",
      },
      {
        author: "Camille & Théo",
        role: "May 2025 · Lake Como",
        quote:
          "From the first call we knew. Elena listened more than she spoke and somehow our wedding became exactly what we'd imagined but couldn't articulate.",
      },
    ],
    socials: {
      instagram: "https://instagram.com/maisonfiorello",
      facebook: "https://facebook.com/maisonfiorello",
    },
    impressumUrl: "https://maisonfiorello.com/imprint",
    privacyUrl: "https://maisonfiorello.com/privacy",
  },
};
