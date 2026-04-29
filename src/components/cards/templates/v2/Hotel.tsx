"use client";

// =============================================================================
// Hotel — v2 template (id=15, key="hotel").
//
// Design DNA: a five-star boutique hotel's printed compendium card —
// Cormorant Garamond display + gold hairlines + breathing whitespace.
// Distinct from Editorial (id=11, which is a portrait-led editorial card)
// and Atelier (id=12, minimalist consultancy):
//
//   - Centred minimal hero. The owner's photo (a room, the lobby, the
//     facade) sits behind a parchment-cream overlay so the typography
//     dominates. Tall Cormorant display name in deep ink.
//   - Gold hairlines bracket the company name above and below the hero —
//     the SIGNATURE thread of the template, repeated in every divider.
//   - "Suites & rates" services list — gold leader rules, ink type,
//     italic descriptions. Reads like a lobby tariff sheet, not a menu.
//   - Concierge contact grid: copper hairlines, no icons inside the rows
//     (just label/value pairs in the manner of luxury stationery).
//   - "Book your stay" CTA fills the brand primary; text auto-flips
//     black/white via the contrast helper.
//   - Footer: gold seal repeated small, single-line credit row.
//
// Every accent and CTA derives from `brandPrimaryHex` (defaults to deep
// ink) and `brandAccentHex` (defaults to gold) — the customer can re-skin
// the card to any palette and contrast remains safe.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  BedDouble,
  Calendar,
  Compass,
  FileDown,
  KeyRound,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  Shield,
  Star,
} from "lucide-react";

import { encodeSource, describeSource } from "@/components/cards/smart/SmartCardSource";
import { getSectorPreset } from "@/config/card-sectors";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

// -----------------------------------------------------------------------------
// Locked palette — only `brandPrimaryHex` / `brandAccentHex` flex per card.
// -----------------------------------------------------------------------------
const LOCKED_PRIMARY = "#1f2937"; // deep ink
const LOCKED_ACCENT = "#b08d57"; // gold
const PAGE_BG = "#f7f4ee"; // parchment cream
const SURFACE = "#ffffff";
const TEXT_DARK = "#1c1c1c";
const TEXT_MID = "#4a4a4a";
const TEXT_LIGHT = "#8a8a8a";
const BORDER = "#e3dccd";

// -----------------------------------------------------------------------------
// Contrast helper — pick black/white text for a brand-coloured surface.
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
  if (parts.length === 0) return "·";
  if (parts.length === 1) return (parts[0][0] ?? "·").toUpperCase();
  return (
    (parts[0][0] ?? "").toUpperCase() + (parts[parts.length - 1][0] ?? "").toUpperCase()
  );
}

interface HoCopy {
  bookStay: string;
  callConcierge: string;
  whatsapp: string;
  email: string;
  directions: string;
  suitesEyebrow: string;
  suites: string;
  artOfStayEyebrow: string;
  artOfStay: string;
  guestsEyebrow: string;
  guests: string;
  conciergeEyebrow: string;
  concierge: string;
  galleryEyebrow: string;
  gallery: string;
  socialEyebrow: string;
  social: string;
  walletLabel: string;
  brochureCta: string;
  impressum: string;
  privacy: string;
  poweredBy: string;
  share: string;
  estd: string;
  reservations: string;
  saveContact: string;
  web: string;
  address: string;
}

const COPY: Record<"de" | "en" | "tr", HoCopy> = {
  de: {
    bookStay: "Aufenthalt buchen",
    callConcierge: "Concierge anrufen",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    directions: "Anfahrt",
    suitesEyebrow: "Räume & Tarife",
    suites: "Suiten",
    artOfStayEyebrow: "Hausgeschichte",
    artOfStay: "Das Haus",
    guestsEyebrow: "Stimmen unserer Gäste",
    guests: "Gästebuch",
    conciergeEyebrow: "Concierge",
    concierge: "Verbindung",
    galleryEyebrow: "Aus dem Hause",
    gallery: "Eindrücke",
    socialEyebrow: "Bleiben Sie verbunden",
    social: "Folgen",
    walletLabel: "Auf Smartphone speichern",
    brochureCta: "Hausprospekt (PDF)",
    impressum: "Impressum",
    privacy: "Datenschutz",
    poweredBy: "Powered by",
    share: "Teilen",
    estd: "gegr.",
    reservations: "Reservierung",
    saveContact: "Kontakt speichern",
    web: "Web",
    address: "Adresse",
  },
  en: {
    bookStay: "Book your stay",
    callConcierge: "Call concierge",
    whatsapp: "WhatsApp",
    email: "Email",
    directions: "Directions",
    suitesEyebrow: "Suites & rates",
    suites: "Suites",
    artOfStayEyebrow: "The house",
    artOfStay: "Our story",
    guestsEyebrow: "From our guests",
    guests: "Guestbook",
    conciergeEyebrow: "Concierge",
    concierge: "Correspondence",
    galleryEyebrow: "From the house",
    gallery: "Impressions",
    socialEyebrow: "Stay connected",
    social: "Follow",
    walletLabel: "Add to wallet",
    brochureCta: "House brochure (PDF)",
    impressum: "Imprint",
    privacy: "Privacy",
    poweredBy: "Powered by",
    share: "Share",
    estd: "est.",
    reservations: "Reservations",
    saveContact: "Save contact",
    web: "Web",
    address: "Address",
  },
  tr: {
    bookStay: "Konaklama planla",
    callConcierge: "Concierge'i ara",
    whatsapp: "WhatsApp",
    email: "E-posta",
    directions: "Yol tarifi",
    suitesEyebrow: "Süitler & ücretler",
    suites: "Süitler",
    artOfStayEyebrow: "Evimiz",
    artOfStay: "Hikayemiz",
    guestsEyebrow: "Misafirlerimizden",
    guests: "Misafir defteri",
    conciergeEyebrow: "Concierge",
    concierge: "Yazışma",
    galleryEyebrow: "Evimizden",
    gallery: "İzlenimler",
    socialEyebrow: "Bağlantıda kalın",
    social: "Takip et",
    walletLabel: "Cüzdana ekle",
    brochureCta: "Ev broşürü (PDF)",
    impressum: "Künye",
    privacy: "Gizlilik",
    poweredBy: "Powered by",
    share: "Paylaş",
    estd: "kuruluş",
    reservations: "Rezervasyon",
    saveContact: "Kişiyi kaydet",
    web: "Web",
    address: "Adres",
  },
};

// =============================================================================
// Template root
// =============================================================================

export function Hotel({
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
  const initials = getInitials(cardData.company ?? cardData.name);

  const services =
    cardData.services && cardData.services.length > 0
      ? cardData.services
      : sector?.services;

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  const subtitle = [cardData.position, cardData.title].filter(Boolean).join(" · ");

  return (
    <article
      data-template="hotel"
      className={`ho-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] shadow-[0_30px_70px_-30px_rgba(31,41,55,0.40),0_8px_22px_-12px_rgba(31,41,55,0.18)] ring-1 ring-[#e3dccd]`}
      style={
        {
          ["--ho-primary" as string]: primary,
          ["--ho-accent" as string]: accent,
          ["--ho-on-primary" as string]: onPrimary,
          ["--ho-on-accent" as string]: onAccent,
          ["--ho-page" as string]: PAGE_BG,
          ["--ho-surface" as string]: SURFACE,
          ["--ho-text" as string]: TEXT_DARK,
          ["--ho-text-mid" as string]: TEXT_MID,
          ["--ho-text-light" as string]: TEXT_LIGHT,
          ["--ho-border" as string]: BORDER,
          ["--font-hotel-display" as string]: "'Cormorant Garamond', Georgia, serif",
          ["--font-hotel-body" as string]: "'Inter', system-ui, sans-serif",
          background: PAGE_BG,
          color: TEXT_DARK,
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .ho-card {
          font-family:var(--tpl-font-body,  var(--font-hotel-body), "Inter", system-ui, sans-serif);
          line-height: 1.65;
        }
        .ho-card .ho-display {
          font-family:var(--tpl-font-body,  var(--font-hotel-display), "Cormorant Garamond", Georgia, serif);
          letter-spacing: 0.005em;
        }
        .ho-card .ho-italic {
          font-family:var(--tpl-font-body,  var(--font-hotel-display), "Cormorant Garamond", Georgia, serif);
          font-style: italic;
        }
        .ho-card .ho-eyebrow {
          font-family:var(--tpl-font-body,  var(--font-hotel-body), "Inter", system-ui, sans-serif);
          letter-spacing: 0.32em;
          text-transform: uppercase;
          font-weight: 500;
          font-size: 10px;
        }
        .ho-card .ho-leader {
          background-image: linear-gradient(90deg, currentColor 50%, transparent 50%);
          background-position: bottom;
          background-size: 6px 1px;
          background-repeat: repeat-x;
        }
      `}</style>

      <Hero
        photoUrl={photoUrl}
        logoUrl={logoUrl}
        initials={initials}
        company={cardData.company}
        primary={primary}
        accent={accent}
        onAccent={onAccent}
        sourceLabel={sourceLabel}
        translations={t}
      />

      <NameStrip
        name={cardData.name}
        company={cardData.company}
        subtitle={subtitle}
        primary={primary}
        accent={accent}
        translations={t}
      />

      <BookStayCTA
        bookingUrl={cardData.bookingUrl}
        primary={primary}
        accent={accent}
        onPrimary={onPrimary}
        label={t.bookStay}
      />

      <QuickActions
        cardData={cardData}
        primary={primary}
        accent={accent}
        translations={t}
      />

      {cardData.bio && (
        <Section
          title={t.artOfStay}
          eyebrow={t.artOfStayEyebrow}
          accent={accent}
          primary={primary}
          background={SURFACE}
        >
          <div
            className="rounded-2xl px-6 py-7"
            style={{
              background: PAGE_BG,
              border: `1px solid ${BORDER}`,
            }}
          >
            <p
              className="ho-display text-[16px] leading-[1.75]"
              style={{ color: "var(--ho-text-mid)", textAlign: "justify" }}
            >
              {cardData.bio}
            </p>
          </div>
        </Section>
      )}

      {services && services.length > 0 && (
        <Section
          title={t.suites}
          eyebrow={t.suitesEyebrow}
          accent={accent}
          primary={primary}
        >
          <ul className="grid gap-5">
            {services.slice(0, 6).map((item, i) => (
              <SuiteRow
                key={`${item.title}-${i}`}
                item={item}
                accent={accent}
                primary={primary}
              />
            ))}
          </ul>
        </Section>
      )}

      {cardData.gallery && cardData.gallery.length > 0 && (
        <Section
          title={t.gallery}
          eyebrow={t.galleryEyebrow}
          accent={accent}
          primary={primary}
          background={SURFACE}
        >
          <GalleryStrip items={cardData.gallery.slice(0, 6)} accent={accent} />
        </Section>
      )}

      {cardData.testimonials && cardData.testimonials.length > 0 && (
        <Section
          title={t.guests}
          eyebrow={t.guestsEyebrow}
          accent={accent}
          primary={primary}
        >
          <div className="grid gap-3">
            {cardData.testimonials.slice(0, 3).map((item, i) => (
              <TestimonialCard
                key={`${item.author}-${i}`}
                item={item}
                accent={accent}
                primary={primary}
              />
            ))}
          </div>
        </Section>
      )}

      <Section
        title={t.concierge}
        eyebrow={t.conciergeEyebrow}
        accent={accent}
        primary={primary}
        background={SURFACE}
      >
        <ConciergeRows cardData={cardData} accent={accent} primary={primary} translations={t} />

        {cardData.bookingUrl && (
          <a
            href={cardData.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[13.5px] font-semibold tracking-tight transition-all hover:-translate-y-px"
            style={{
              background: primary,
              color: onPrimary,
              boxShadow: `0 12px 26px -12px ${primary}AA`,
              letterSpacing: "0.03em",
            }}
          >
            <Calendar size={14} strokeWidth={2} />
            {t.bookStay}
          </a>
        )}
      </Section>

      <CTASection
        slug={slug}
        sourceQs={sourceQs}
        locale={locale}
        primary={primary}
        accent={accent}
        saveContactLabel={t.saveContact}
        onPrimary={onPrimary}
      />

      {cardData.brochureUrl && (
        <BrochureStrip
          url={cardData.brochureUrl}
          accent={accent}
          primary={primary}
          onAccent={onAccent}
          label={t.brochureCta}
        />
      )}

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="border-t px-7 py-5"
          labelClassName="ho-eyebrow mb-3"
        >
          <div style={{ ["--card-primary" as string]: primary }}>
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {cardData.socials && (
        <Section
          title={t.social}
          eyebrow={t.socialEyebrow}
          accent={accent}
          primary={primary}
        >
          <SocialRow
            socials={cardData.socials}
            variant="pill"
            accentHex={primary}
            itemClassName="border-[var(--ho-border)] bg-white text-[var(--ho-text)] hover:border-[color:var(--ho-accent)] hover:bg-white"
          />
        </Section>
      )}

      <Footer
        siteUrl={siteUrl}
        slug={slug}
        company={cardData.company}
        initials={initials}
        impressumUrl={cardData.impressumUrl}
        privacyUrl={cardData.privacyUrl}
        primary={primary}
        accent={accent}
        onAccent={onAccent}
        translations={t}
      />
    </article>
  );
}

// =============================================================================
// HERO — minimal centred. Photo behind, parchment overlay so the typography
// reads as the protagonist. Gold hairline brackets the company name.
// =============================================================================

function Hero({
  photoUrl,
  logoUrl,
  initials,
  company,
  primary,
  accent,
  onAccent,
  sourceLabel,
  translations,
}: {
  photoUrl: string | null;
  logoUrl: string | null;
  initials: string;
  company?: string;
  primary: string;
  accent: string;
  onAccent: string;
  sourceLabel?: string;
  translations: HoCopy;
}) {
  return (
    <header className="relative overflow-hidden">
      <div className="relative h-[260px] w-full">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt=""
            fill
            priority
            unoptimized
            sizes="(max-width: 460px) 100vw, 460px"
            className="object-cover tpl-photo"
          />
        ) : (
          <div
            aria-hidden
            className="h-full w-full"
            style={{
              background: `linear-gradient(160deg, ${primary} 0%, ${primary}E5 60%, ${accent}55 100%)`,
            }}
          >
            {/* Decorative arch silhouette — a hotel facade gesture */}
            <svg
              className="absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 opacity-12"
              viewBox="0 0 100 100"
              fill="none"
              stroke="white"
              strokeWidth="0.4"
            >
              <path d="M20 90 V 50 a 30 30 0 0 1 60 0 V 90" />
              <path d="M30 90 V 60 a 20 20 0 0 1 40 0 V 90" />
              <line x1="50" y1="20" x2="50" y2="90" />
            </svg>
          </div>
        )}

        {/* Parchment overlay — soft cream wash so type is legible. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(247,244,238,0.35) 0%, rgba(247,244,238,0.55) 50%, rgba(247,244,238,0.85) 100%)`,
          }}
        />

        {/* Centred hero content */}
        <div className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-7 text-center">
          {/* Optional logo seal — a small gold circle if no logo uploaded. */}
          <div className="mb-4 flex justify-center">
            <div
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full"
              style={{
                background: SURFACE,
                border: `1px solid ${accent}`,
                boxShadow: `0 6px 14px -6px rgba(0,0,0,0.18)`,
              }}
            >
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt=""
                  width={56}
                  height={56}
                  unoptimized
                  className="h-8 w-8 object-contain tpl-logo"
                />
              ) : (
                <span
                  className="ho-display text-[18px] font-semibold"
                  style={{ color: accent === "#ffffff" ? primary : accent, letterSpacing: "0.04em" }}
                >
                  {initials}
                </span>
              )}
            </div>
          </div>

          {/* Gold hairlines bracket the company name — signature thread. */}
          <div className="flex items-center justify-center gap-3">
            <span
              aria-hidden
              className="block h-px w-10"
              style={{ background: accent }}
            />
            <span
              className="ho-eyebrow"
              style={{ color: primary, opacity: 0.78 }}
            >
              {translations.estd}
            </span>
            <span
              aria-hidden
              className="block h-px w-10"
              style={{ background: accent }}
            />
          </div>

          <h1
            className="ho-display mt-3 text-[34px] font-medium leading-[1.05]"
            style={{ color: primary }}
          >
            {company ?? "Maison"}
          </h1>
        </div>

        {sourceLabel && (
          <span
            className="ho-eyebrow absolute right-5 top-5 z-10 rounded-full bg-white/80 px-3 py-1 backdrop-blur-md"
            style={{ color: primary }}
          >
            {sourceLabel}
          </span>
        )}
      </div>

      {/* Bottom hairline — gold rule */}
      <div
        aria-hidden
        className="h-px w-full"
        style={{ background: accent, opacity: 0.5 }}
      />
      {/* satisfy onAccent unused */}
      <span hidden style={{ color: onAccent }} />
    </header>
  );
}

// =============================================================================
// Name strip — owner's name + subtitle in italic Cormorant. Centred under hero.
// =============================================================================

function NameStrip({
  name,
  company,
  subtitle,
  primary,
  accent,
  translations,
}: {
  name: string;
  company?: string;
  subtitle: string;
  primary: string;
  accent: string;
  translations: HoCopy;
}) {
  void company;
  void translations;
  return (
    <section className="px-7 pb-1 pt-7 text-center">
      <div
        className="ho-eyebrow mb-2"
        style={{ color: accent }}
      >
        Maison & Direction
      </div>
      <h2
        className="ho-display text-[26px] font-medium leading-tight"
        style={{ color: primary }}
      >
        {name}
      </h2>
      {subtitle && (
        <p
          className="ho-italic mt-1 text-[15px]"
          style={{ color: "var(--ho-text-mid)" }}
        >
          {subtitle}
        </p>
      )}
    </section>
  );
}

// =============================================================================
// Book-stay CTA — sits prominently below the name. Brand primary fill.
// =============================================================================

function BookStayCTA({
  bookingUrl,
  primary,
  accent,
  onPrimary,
  label,
}: {
  bookingUrl?: string;
  primary: string;
  accent: string;
  onPrimary: string;
  label: string;
}) {
  if (!bookingUrl) return null;
  return (
    <div className="px-7 pb-2 pt-5">
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex w-full items-center justify-center gap-3 rounded-full px-7 py-4 text-[14px] font-semibold transition-all hover:-translate-y-px"
        style={{
          background: primary,
          color: onPrimary,
          boxShadow: `0 14px 32px -14px ${primary}AA`,
          letterSpacing: "0.04em",
        }}
      >
        <KeyRound size={14} strokeWidth={1.8} />
        <span className="ho-display text-[16px] font-medium">{label}</span>
        <span
          aria-hidden
          className="block h-px w-6 transition-all group-hover:w-10"
          style={{ background: accent }}
        />
      </a>
    </div>
  );
}

// =============================================================================
// Quick actions — secondary contact pills. Hairline outlines, not solid fills,
// so the brand-primary "Book your stay" CTA above stays the visual anchor.
// =============================================================================

function QuickActions({
  cardData,
  primary,
  accent,
  translations,
}: {
  cardData: TemplateProps["cardData"];
  primary: string;
  accent: string;
  translations: HoCopy;
}) {
  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  type Pill = {
    label: string;
    href: string;
    Icon: typeof Phone;
    external?: boolean;
  };
  const pills: Pill[] = [];
  if (phoneDigits) {
    pills.push({
      label: translations.callConcierge,
      href: `tel:${phoneDigits}`,
      Icon: Phone,
    });
  }
  if (waDigits) {
    pills.push({
      label: translations.whatsapp,
      href: `https://wa.me/${waDigits}`,
      Icon: MessageCircle,
      external: true,
    });
  }
  if (cardData.email) {
    pills.push({
      label: translations.email,
      href: `mailto:${cardData.email}`,
      Icon: Mail,
    });
  }
  if (cardData.address) {
    pills.push({
      label: translations.directions,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cardData.address)}`,
      Icon: Compass,
      external: true,
    });
  }

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-7 pb-2 pt-4">
      {pills.map((p, i) => {
        const ext = p.external
          ? { target: "_blank", rel: "noopener noreferrer" as const }
          : {};
        return (
          <a
            key={`${p.label}-${i}`}
            href={p.href}
            {...ext}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12.5px] font-medium transition-all hover:-translate-y-px"
            style={{
              color: primary,
              border: `1px solid ${accent}66`,
            }}
          >
            <p.Icon size={12} strokeWidth={1.8} style={{ color: accent }} />
            {p.label}
          </a>
        );
      })}
    </div>
  );
}

// =============================================================================
// Section — centred eyebrow (Inter mono) + Cormorant title + gold hairline.
// =============================================================================

function Section({
  title,
  eyebrow,
  accent,
  primary,
  children,
  background,
}: {
  title: string;
  eyebrow?: string;
  accent: string;
  primary: string;
  children: React.ReactNode;
  background?: string;
}) {
  return (
    <section
      className="px-7 py-9"
      style={{ background: background ?? PAGE_BG }}
    >
      <div className="mb-7 text-center">
        {eyebrow && (
          <div className="ho-eyebrow mb-2" style={{ color: accent }}>
            {eyebrow}
          </div>
        )}
        <h2
          className="ho-display text-[24px] font-medium leading-tight"
          style={{ color: primary }}
        >
          {title}
        </h2>
        <span
          aria-hidden
          className="mx-auto mt-3 block h-px w-12"
          style={{ background: accent }}
        />
      </div>
      {children}
    </section>
  );
}

// =============================================================================
// SuiteRow — like a printed tariff sheet. Italic description, gold leader
// rule, ink price.
// =============================================================================

function SuiteRow({
  item,
  accent,
  primary,
}: {
  item: { title: string; description?: string; priceLabel?: string };
  accent: string;
  primary: string;
}) {
  return (
    <li>
      <div className="flex items-baseline gap-3">
        <BedDouble
          size={13}
          strokeWidth={1.6}
          style={{ color: accent, marginTop: 2 }}
        />
        <h3
          className="ho-display flex-shrink-0 text-[18px] font-medium leading-tight"
          style={{ color: primary }}
        >
          {item.title}
        </h3>
        <span
          aria-hidden
          className="ho-leader mx-1 h-2 flex-1 self-end"
          style={{ color: accent, opacity: 0.5 }}
        />
        {item.priceLabel && (
          <span
            className="ho-display flex-shrink-0 text-[15px] font-semibold"
            style={{ color: primary }}
          >
            {item.priceLabel}
          </span>
        )}
      </div>
      {item.description && (
        <p
          className="ho-italic mt-1.5 pl-[26px] text-[13.5px] leading-snug"
          style={{ color: "var(--ho-text-mid)" }}
        >
          {item.description}
        </p>
      )}
    </li>
  );
}

// =============================================================================
// GalleryStrip — three-column atmosphere shots, soft gold hairlines.
// =============================================================================

function GalleryStrip({
  items,
  accent,
}: {
  items: Array<{ src: string; alt?: string }>;
  accent: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {items.map((it, i) => {
        const src = resolveAssetUrl(it.src) ?? it.src;
        return (
          <div
            key={`${it.src}-${i}`}
            className="relative aspect-[3/4] overflow-hidden rounded-sm"
            style={{ background: "#1a1a1a", border: `1px solid ${accent}33` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={it.alt ?? ""}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// TestimonialCard — printed-paper feel. Star row in gold, italic quote.
// =============================================================================

function TestimonialCard({
  item,
  accent,
  primary,
}: {
  item: { author: string; role?: string; quote: string };
  accent: string;
  primary: string;
}) {
  return (
    <figure
      className="relative overflow-hidden rounded-2xl bg-white p-6"
      style={{
        border: `1px solid ${BORDER}`,
        boxShadow: "0 2px 14px -6px rgba(31,41,55,0.10)",
      }}
    >
      <Quote
        aria-hidden
        size={36}
        strokeWidth={1.2}
        className="absolute right-4 top-3"
        style={{ color: accent, opacity: 0.18 }}
      />
      <div
        className="mb-2 flex items-center gap-0.5"
        style={{ color: accent }}
        aria-label="5 of 5 stars"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={11} strokeWidth={1.4} fill="currentColor" />
        ))}
      </div>
      <blockquote
        className="ho-italic text-[15px] leading-snug"
        style={{ color: TEXT_DARK }}
      >
        &ldquo;{item.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 flex items-baseline gap-2">
        <span
          aria-hidden
          className="block h-px w-5"
          style={{ background: accent }}
        />
        <span
          className="ho-display text-[13px] font-semibold"
          style={{ color: primary }}
        >
          {item.author}
        </span>
        {item.role && (
          <span
            className="ho-eyebrow"
            style={{ color: TEXT_LIGHT }}
          >
            {item.role}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

// =============================================================================
// ConciergeRows — luxury-stationery contact list. label/value pairs with
// copper hairlines and no icon-in-row clutter.
// =============================================================================

function ConciergeRows({
  cardData,
  accent,
  primary,
  translations,
}: {
  cardData: TemplateProps["cardData"];
  accent: string;
  primary: string;
  translations: HoCopy;
}) {
  type Row = {
    label: string;
    value: string;
    href: string;
    external: boolean;
  };
  const rows: Row[] = [];
  if (cardData.phone) {
    rows.push({
      label: translations.reservations,
      value: cardData.phone,
      href: `tel:${digitsOnly(cardData.phone)}`,
      external: false,
    });
  }
  if (cardData.email) {
    rows.push({
      label: translations.email,
      value: cardData.email,
      href: `mailto:${cardData.email}`,
      external: false,
    });
  }
  if (cardData.website) {
    rows.push({
      label: translations.web,
      value: cardData.website.replace(/^https?:\/\//, ""),
      href: cardData.website,
      external: true,
    });
  }
  if (cardData.address) {
    rows.push({
      label: translations.address,
      value: cardData.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cardData.address)}`,
      external: true,
    });
  }

  if (rows.length === 0) return null;

  return (
    <ul>
      {rows.map((r, i) => {
        const ext = r.external
          ? { target: "_blank", rel: "noopener noreferrer" as const }
          : {};
        return (
          <li
            key={`${r.label}-${i}`}
            className="border-t py-4 first:border-t-0 first:pt-0"
            style={{ borderColor: BORDER }}
          >
            <div
              className="ho-eyebrow mb-1"
              style={{ color: accent }}
            >
              {r.label}
            </div>
            <a
              href={r.href}
              {...ext}
              className="ho-display block text-[15.5px] font-medium transition-colors"
              style={{ color: primary }}
            >
              {r.value}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

// =============================================================================
// CTA section — Send-my-info + exchange wrappers. Dark-ink "Save contact"
// pill above for printed-card parity.
// =============================================================================

function CTASection({
  slug,
  sourceQs,
  locale,
  primary,
  accent,
  saveContactLabel,
  onPrimary,
}: {
  slug: string;
  sourceQs: string;
  locale: "de" | "en" | "tr";
  primary: string;
  accent: string;
  saveContactLabel: string;
  onPrimary: string;
}) {
  return (
    <section className="px-7 py-7" style={{ background: PAGE_BG }}>
      <a
        href={`/api/cards/${encodeURIComponent(slug)}/vcard${sourceQs}`}
        download
        className="ho-display group mb-4 flex w-full items-center justify-center gap-3 rounded-full px-5 py-3.5 text-[15px] font-medium transition-all hover:-translate-y-px"
        style={{
          background: primary,
          color: onPrimary,
          letterSpacing: "0.03em",
          boxShadow: `0 10px 24px -10px ${primary}99`,
        }}
      >
        {saveContactLabel}
      </a>
      <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={primary} locale={locale} />
      <ExchangeSlot slug={slug} primary={accent} locale={locale} />
    </section>
  );
}

// =============================================================================
// BrochureStrip — gold-bordered link, accent-coloured.
// =============================================================================

function BrochureStrip({
  url,
  accent,
  primary,
  onAccent,
  label,
}: {
  url: string;
  accent: string;
  primary: string;
  onAccent: string;
  label: string;
}) {
  void primary;
  return (
    <section className="px-7 py-5" style={{ background: SURFACE }}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between gap-3 rounded-full px-6 py-3.5 transition-all hover:-translate-y-px"
        style={{
          background: accent,
          color: onAccent,
          boxShadow: `0 10px 22px -10px ${accent}99`,
        }}
      >
        <span className="flex items-center gap-3">
          <FileDown size={15} strokeWidth={1.8} />
          <span
            className="ho-display text-[15px] font-medium"
            style={{ letterSpacing: "0.02em" }}
          >
            {label}
          </span>
        </span>
        <ArrowUpRight
          size={16}
          strokeWidth={1.8}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>
    </section>
  );
}

// =============================================================================
// Footer — minimal, parchment-on-ink, gold seal repeat.
// =============================================================================

function Footer({
  siteUrl,
  slug,
  company,
  initials,
  impressumUrl,
  privacyUrl,
  primary,
  accent,
  onAccent,
  translations,
}: {
  siteUrl: string;
  slug: string;
  company?: string;
  initials: string;
  impressumUrl?: string;
  privacyUrl?: string;
  primary: string;
  accent: string;
  onAccent: string;
  translations: HoCopy;
}) {
  return (
    <footer
      className="relative px-7 pb-8 pt-7"
      style={{
        background: SURFACE,
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <div className="mb-4 flex flex-col items-center gap-2.5">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full"
          style={{
            background: accent,
            color: onAccent,
          }}
        >
          <span
            className="ho-display text-[11px] font-semibold"
            style={{ letterSpacing: "0.04em" }}
          >
            {initials}
          </span>
        </div>
        {company && (
          <p
            className="ho-italic text-center text-[13px]"
            style={{ color: TEXT_MID }}
          >
            {company}
          </p>
        )}
        <div
          className="ho-eyebrow"
          style={{ color: TEXT_LIGHT }}
        >
          © {new Date().getFullYear()}
        </div>
      </div>

      <div
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[10.5px]"
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
              className="transition-colors"
              style={{ color: TEXT_LIGHT }}
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
              className="transition-colors"
              style={{ color: TEXT_LIGHT }}
            >
              {translations.privacy}
            </a>
          </>
        )}
      </div>

      <div
        className="mt-3 flex items-center justify-center gap-1.5 text-[10.5px]"
        style={{ color: TEXT_LIGHT }}
      >
        <Shield size={10} strokeWidth={1.8} />
        {translations.poweredBy}{" "}
        <a
          href="https://opsolid.de/products/digital-card"
          target="_blank"
          rel="noopener noreferrer"
          className="ho-display font-semibold"
          style={{ color: primary }}
        >
          OpSolid
        </a>
      </div>
      <div
        className="mt-2 flex items-center justify-center gap-1.5 text-[9.5px]"
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
            // ignore
          }
        }
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        }
      }}
      className="transition-colors"
      style={{ color: TEXT_LIGHT }}
    >
      {label}
    </button>
  );
}

// =============================================================================
// Registry entry & sample
// =============================================================================

export const hotelEntry: TemplateRegistryEntry = {
  id: 15,
  key: "hotel",
  name: "Hotel",
  industry: "Hotel / boutique hospitality",
  Component: Hotel,
  supports: {
    services: true,
    faqs: true,
    testimonials: true,
    gallery: true,
    video: false,
    brochure: true,
    socials: true,
    themeSwitch: false,
    photo: true,
    logo: true,
  },
  defaults: {
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-hotel",
};

// Sample persona — Maison Sereno, Lake Como.
// photo: Unsplash royalty-free — luxury hotel facade.
//   https://unsplash.com/photos/luxury-hotel (Unsplash License — free use).
// gallery: Unsplash hotel interiors under Unsplash License.
export const hotelSample: SampleData = {
  templateId: 15,
  slug: "demo-hotel",
  cardData: {
    name: "Sofia Marenghi",
    title: "Direzione Generale",
    position: "General Manager",
    company: "Maison Sereno",
    email: "concierge@maisonsereno.it",
    phone: "+39 031 950 230",
    whatsapp: "+39 339 950 2300",
    website: "https://maisonsereno.it",
    address: "Via del Lago 7, 22021 Bellagio, Lake Como, Italia",
    bio:
      "Maison Sereno opened its doors in the spring of 1923 as a private summer residence on the eastern shore of Lake Como. We are still a family — three generations now — and still small: nine rooms, one restaurant, a garden that drops gently to the water. Our guests come for the quiet, the lake light at five in the afternoon, and a kitchen that takes its time.",
    bookingUrl: "https://cal.com/maison-sereno/stay",
    brochureUrl: "https://maisonsereno.it/compendium-2026.pdf",
    impressumUrl: "https://maisonsereno.it/impressum",
    privacyUrl: "https://maisonsereno.it/privacy",
    sectorKey: "restaurant",
    services: [
      {
        title: "Camera Lago",
        description: "Lake-facing room, private balcony, king bed, breakfast included.",
        priceLabel: "from €420 / night",
      },
      {
        title: "Suite Giardino",
        description: "Garden suite with terrace, separate sitting room, fireplace.",
        priceLabel: "from €640 / night",
      },
      {
        title: "Suite Belvedere",
        description: "Top-floor suite, panoramic view, soaking tub, butler service.",
        priceLabel: "from €1 280 / night",
      },
      {
        title: "Villa Privata",
        description: "Three-bedroom villa adjacent to the main house. Weekly basis.",
        priceLabel: "from €18 000 / week",
      },
      {
        title: "Esperienza dei Sapori",
        description: "Tasting dinner at our restaurant — six courses, wine pairing.",
        priceLabel: "€185 per guest",
      },
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
        alt: "Suite Belvedere",
      },
      {
        src: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=600&q=80",
        alt: "Garden",
      },
      {
        src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
        alt: "Lobby",
      },
      {
        src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80",
        alt: "Suite Giardino",
      },
      {
        src: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
        alt: "Restaurant",
      },
      {
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
        alt: "Lake at dawn",
      },
    ],
    testimonials: [
      {
        author: "T. & L. Aldenburg",
        role: "Suite Belvedere · September 2025",
        quote:
          "Three nights at Maison Sereno reset our entire year. Sofia and her team know the difference between attentive and present, and they choose present every time.",
      },
      {
        author: "Elena di Marco",
        role: "Condé Nast Traveller",
        quote:
          "The most quietly assured hotel I have stayed in on Lake Como. Nothing performed, nothing forgotten.",
      },
    ],
    socials: {
      instagram: "https://instagram.com/maisonsereno",
      facebook: "https://facebook.com/maisonsereno",
    },
  },
  // photo: Unsplash — boutique hotel facade.
  //   https://images.unsplash.com/photo-1542314831-068cd1dbfeeb (Unsplash License).
  photoUrl:
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&q=80",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
