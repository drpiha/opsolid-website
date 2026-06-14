"use client";

// =============================================================================
// RealEstate — reference v2 template (id=1, key="real-estate").
//
// Design DNA: Projekt_4k/showcase/kart_01_emlak.html — luxury Bosphorus broker,
// deep-blue (#1a365d) → black gradient hero, warm-gold (#c8a951) accents,
// Montserrat display + Open Sans body. Re-implemented natively in React +
// Tailwind; nothing was literally ported.
//
// Locked design choices (do not parameterise):
//   - Full-bleed hero ~220px with deep-blue → black overlay; user's photo (or
//     gradient fallback) sits behind hero text.
//   - Gold (#c8a951) accent rule between sections; gold underline on key
//     headings; gold-bordered avatar frame.
//   - Top-left logo badge — locked at 44px square. Gold square + white
//     monogram fallback when `logoPath` is null.
//   - Section rhythm:
//       Hero → Profile strip → Featured listings/services → Bio strip →
//       Contact rows → CTAs → Wallet/Exchange/SendMyInfo → Social → Footer
//   - Typography: Montserrat (display, 700/800) + Open Sans (body, 400/600),
//     scoped via a CSS class on the article so global typography stays clean.
//   - Premium serif address line treatment under the hero (one of kart_01's
//     signatures).
//
// Variable per card: cardData content, photoPath, logoPath, brandPrimaryHex
// (overrides the deep-blue), brandAccentHex (overrides the gold).
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Building2,
  Calendar,
  FileDown,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  Shield,
  ShieldCheck,
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
import { ServiceLink } from "./shared/ServiceLink";
import { resolveLabels } from "./shared/resolveLabels";
import type { TemplateProps } from "./types";

// -----------------------------------------------------------------------------
// Locked palette. `brandPrimaryHex` / `brandAccentHex` override these per card;
// the structure (hero gradient, gold rule, gold underline) stays identical.
// -----------------------------------------------------------------------------
const LOCKED_PRIMARY = "#1a365d"; // deep blue
const LOCKED_ACCENT = "#c8a951"; // warm gold

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

interface ReCopy {
  saveContact: string;
  callNow: string;
  whatsapp: string;
  email: string;
  book: string;
  featuredListings: string;
  services: string;
  aboutMe: string;
  contact: string;
  voices: string;
  location: string;
  social: string;
  walletLabel: string;
  portfolioCta: string;
  impressum: string;
  privacy: string;
  poweredBy: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", ReCopy> = {
  de: {
    saveContact: "Speichern",
    callNow: "Anrufen",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    book: "Termin",
    featuredListings: "Ausgewählte Objekte",
    services: "Leistungen",
    aboutMe: "Über mich",
    contact: "Kontakt",
    voices: "Empfehlungen",
    location: "Standort",
    social: "Social",
    walletLabel: "Auf Smartphone speichern",
    portfolioCta: "Portfolio ansehen",
    impressum: "Impressum",
    privacy: "Datenschutz",
    poweredBy: "Powered by",
  },
  en: {
    saveContact: "Save contact",
    callNow: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    book: "Book",
    featuredListings: "Featured listings",
    services: "Services",
    aboutMe: "About",
    contact: "Contact",
    voices: "Testimonials",
    location: "Location",
    social: "Social",
    walletLabel: "Add to wallet",
    portfolioCta: "View portfolio",
    impressum: "Imprint",
    privacy: "Privacy",
    poweredBy: "Powered by",
  },
  tr: {
    saveContact: "Rehbere kaydet",
    callNow: "Ara",
    whatsapp: "WhatsApp",
    email: "E-posta",
    book: "Randevu",
    featuredListings: "Seçili Portföy",
    services: "Hizmetler",
    aboutMe: "Hakkımda",
    contact: "İletişim",
    voices: "Referanslar",
    location: "Konum",
    social: "Sosyal",
    walletLabel: "Cüzdana ekle",
    portfolioCta: "Portföyü gör",
    impressum: "Künye",
    privacy: "Gizlilik",
    poweredBy: "Powered by",
  },
  es: {

    saveContact: "Guardar contacto",
    callNow: "Llamar",
    whatsapp: "WhatsApp",
    email: "Correo",
    book: "Reservar",
    featuredListings: "Anuncios destacados",
    services: "Servicios",
    aboutMe: "Acerca de",
    contact: "Contacto",
    voices: "Testimonios",
    location: "Ubicación",
    social: "Redes",
    walletLabel: "Añadir a la cartera",
    portfolioCta: "Ver portafolio",
    impressum: "Aviso legal",
    privacy: "Privacidad",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    saveContact: "Salva contatto",
    callNow: "Chiama",
    whatsapp: "WhatsApp",
    email: "Email",
    book: "Prenota",
    featuredListings: "Annunci in evidenza",
    services: "Servizi",
    aboutMe: "Chi siamo",
    contact: "Contatto",
    voices: "Testimonianze",
    location: "Posizione",
    social: "Social",
    walletLabel: "Aggiungi al wallet",
    portfolioCta: "Vedi portfolio",
    impressum: "Impressum",
    privacy: "Privacy",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    saveContact: "Enregistrer le contact",
    callNow: "Appeler",
    whatsapp: "WhatsApp",
    email: "E-mail",
    book: "Réserver",
    featuredListings: "Annonces en vedette",
    services: "Services",
    aboutMe: "À propos",
    contact: "Contact",
    voices: "Témoignages",
    location: "Lieu",
    social: "Réseaux",
    walletLabel: "Ajouter au portefeuille",
    portfolioCta: "Voir le portfolio",
    impressum: "Mentions légales",
    privacy: "Confidentialité",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    saveContact: "حفظ جهة الاتصال",
    callNow: "اتصال",
    whatsapp: "واتساب",
    email: "البريد الإلكتروني",
    book: "احجز",
    featuredListings: "عروض مميزة",
    services: "الخدمات",
    aboutMe: "حول",
    contact: "اتصال",
    voices: "شهادات",
    location: "الموقع",
    social: "التواصل",
    walletLabel: "إضافة إلى المحفظة",
    portfolioCta: "عرض المعرض",
    impressum: "بيانات النشر",
    privacy: "الخصوصية",
    poweredBy: "مشغل بواسطة",
  
  },
};

export function RealEstate({
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
  const t = resolveLabels(COPY[locale] ?? COPY.de, cardData.labels);

  const sector = getSectorPreset(cardData.sectorKey);
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;

  const photoUrl = resolveAssetUrl(photoPath);
  const logoUrl = resolveAssetUrl(logoPath);
  const initials = getInitials(cardData.name);

  // Sector preset fills empty service / FAQ blocks, same pattern as SmartCard.
  const services =
    cardData.services ?? sector?.services;

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  // Title strip below the name — position then title then company, dot-separated.
  const titleParts = [cardData.position, cardData.title, cardData.company].filter(
    (s): s is string => Boolean(s),
  );

  // Featured listings — fallback uses gallery as a stand-in until services
  // grow listing-specific fields. Service items act as the structured listing
  // model in the meantime (title + description + priceLabel).
  const featuredItems = (services ?? []).slice(0, 3);

  return (
    <article
      data-template="real-estate"
      className={`re-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] bg-white text-[#1a202c] shadow-[0_30px_60px_-30px_rgba(15,23,42,0.35),0_8px_20px_-12px_rgba(15,23,42,0.18)] ring-1 ring-black/5`}
      style={
        {
          ["--re-primary" as string]: primary,
          ["--re-primary-soft" as string]: `${primary}15`,
          ["--re-primary-rim" as string]: `${primary}33`,
          ["--re-accent" as string]: accent,
          ["--re-accent-soft" as string]: `${accent}1A`,
          ["--font-realestate-display" as string]: "'Montserrat', system-ui, sans-serif",
          ["--font-realestate-body" as string]: "'Open Sans', system-ui, sans-serif",
          fontFamily: "var(--font-realestate-body), system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      {/* Scoped per-template typography — only inside `.re-card`. */}
      <style jsx global>{`
        .re-card {
          font-family:var(--tpl-font-body,  var(--font-realestate-body), "Open Sans", system-ui, sans-serif);
          font-feature-settings: "ss01", "cv11";
          line-height: 1.55;
        }
        .re-card .re-display,
        .re-card h1.re-display,
        .re-card h2.re-display,
        .re-card h3.re-display {
          font-family:var(--tpl-font-body,  var(--font-realestate-display), "Montserrat", system-ui, sans-serif);
          letter-spacing: -0.012em;
        }
        .re-card .re-mono {
          font-family:var(--tpl-font-body,  var(--font-realestate-display), "Montserrat", system-ui, sans-serif);
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .re-card .re-serif {
          font-family: var(--tpl-font-body, "Cormorant Garamond", "Georgia", "Times New Roman", serif);
          font-feature-settings: "lnum";
          letter-spacing: 0.005em;
        }
      `}</style>

      <Hero
        photoUrl={photoUrl}
        logoUrl={logoUrl}
        initials={initials}
        company={cardData.company}
        name={cardData.name}
        titleParts={titleParts}
        primary={primary}
        accent={accent}
        sectorBadge={sector?.name}
        sourceLabel={sourceLabel}
        address={cardData.address}
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
        translations={t}
      />

      {featuredItems.length > 0 && (
        <FeaturedListings items={featuredItems} accent={accent} primary={primary} title={t.featuredListings} />
      )}

      {cardData.bio && (
        <BioStrip
          bio={cardData.bio}
          accent={accent}
          primary={primary}
          title={t.aboutMe}
        />
      )}

      <Section title={t.contact} accent={accent} primary={primary}>
        <ContactRows
          cardData={cardData}
          locale={locale}
          variant="tile"
          accentHex={accent}
        />
      </Section>

      <CTASection
        slug={slug}
        sourceQs={sourceQs}
        locale={locale}
        primary={primary}
        accent={accent}
      />

      {cardData.testimonials && cardData.testimonials.length > 0 && (
        <Testimonials items={cardData.testimonials} accent={accent} primary={primary} title={t.voices} />
      )}

      {cardData.brochureUrl && (
        <BrochureStrip
          url={cardData.brochureUrl}
          accent={accent}
          primary={primary}
          label={t.portfolioCta}
        />
      )}

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="border-t border-[var(--re-accent-soft)] px-6 py-5"
          labelClassName="re-mono mb-3 text-[10px] text-[var(--re-primary)]/65"
        >
          {walletSlot}
        </WalletDock>
      )}

      {cardData.socials && (
        <Section title={t.social} accent={accent} primary={primary}>
          <SocialRow socials={cardData.socials} variant="icon" accentHex={primary} />
        </Section>
      )}

      <Footer
        siteUrl={siteUrl}
        slug={slug}
        impressumUrl={cardData.impressumUrl}
        privacyUrl={cardData.privacyUrl}
        primary={primary}
        accent={accent}
        translations={t}
      />
    </article>
  );
}

// =============================================================================
// HERO — full-bleed photo (or gradient fallback) with deep-blue overlay.
// Logo badge top-left (44px). Company eyebrow + tagline bottom-left in gold.
// =============================================================================

function Hero({
  photoUrl,
  logoUrl,
  initials,
  company,
  name,
  titleParts,
  primary,
  accent,
  sectorBadge,
  sourceLabel,
  address,
  translations,
}: {
  photoUrl: string | null;
  logoUrl: string | null;
  initials: string;
  company?: string;
  name: string;
  titleParts: string[];
  primary: string;
  accent: string;
  sectorBadge?: string;
  sourceLabel?: string;
  address?: string;
  translations: ReCopy;
}) {
  return (
    <header className="relative">
      {/* Hero image — 220px tall, full-bleed. */}
      <div className="relative h-[220px] w-full overflow-hidden">
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
              background: `radial-gradient(120% 110% at 18% 0%, ${accent}33, transparent 55%), linear-gradient(150deg, ${primary} 0%, #0a1224 100%)`,
            }}
          />
        )}

        {/* Deep-blue → black gradient overlay (signature kart_01 treatment). */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${primary}F0 0%, ${primary}99 38%, ${primary}26 78%, transparent 100%)`,
          }}
        />

        {/* Subtle film-grain (paper-grain feel without a separate asset). */}
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-overlay opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        {/* Logo badge — locked top-left, locked 44px. Gold square + monogram fallback. */}
        <div className="absolute left-4 top-4 z-10">
          <div
            className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[10px] shadow-[0_4px_14px_-4px_rgba(0,0,0,0.45)] ring-1 ring-white/30"
            style={{
              background: logoUrl ? "white" : accent,
            }}
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={company ? `${company} logo` : "Logo"}
                width={64}
                height={64}
                className="h-8 w-8 object-contain tpl-logo"
                unoptimized
              />
            ) : (
              <span
                className="re-display text-[15px] font-extrabold"
                style={{ color: "white", letterSpacing: "0.02em" }}
              >
                {initials}
              </span>
            )}
          </div>
        </div>

        {/* Source / sector pills top-right. */}
        <div className="absolute right-4 top-4 z-10 flex flex-col items-end gap-1.5">
          {sectorBadge && (
            <span
              className="re-mono rounded-full bg-white/12 px-2.5 py-1 text-[9px] font-semibold text-white backdrop-blur-md ring-1 ring-white/15"
            >
              {sectorBadge}
            </span>
          )}
          {sourceLabel && (
            <span
              className="re-mono rounded-full bg-black/40 px-2.5 py-1 text-[9px] font-semibold text-white/85 backdrop-blur-md ring-1 ring-white/10"
            >
              {sourceLabel}
            </span>
          )}
        </div>

        {/* Hero text — bottom-left. Gold company eyebrow + name. */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-5 pt-8">
          {company && (
            <div
              className="re-mono mb-1.5 text-[10px] font-semibold tracking-[0.24em]"
              style={{ color: accent }}
            >
              {company}
            </div>
          )}
          <h1
            className="re-display text-[1.85rem] font-extrabold leading-[1.05] text-white"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}
          >
            {name}
          </h1>
          {titleParts.length > 0 && (
            <p className="mt-1.5 max-w-[80%] text-[12.5px] leading-snug text-white/85">
              {titleParts.join(" · ")}
            </p>
          )}
        </div>

        {/* Gold rim along the hero bottom — the signature kart_01 thread. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-20 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accent} 30%, ${accent} 70%, transparent 100%)`,
          }}
        />
      </div>

      {/* Premium serif address line — kart_01 signature. Falls back to a
          tagline strip when no address is set so the line still anchors the
          hero. */}
      {address ? (
        <div
          className="relative flex items-center justify-center gap-3 px-6 py-3.5"
          style={{ background: "#fdfcf8" }}
        >
          <span
            aria-hidden
            className="block h-px w-6"
            style={{ background: accent }}
          />
          <span
            className="re-serif text-center text-[15px] italic text-[#3a4554]"
            style={{ letterSpacing: "0.01em" }}
          >
            {address}
          </span>
          <span
            aria-hidden
            className="block h-px w-6"
            style={{ background: accent }}
          />
        </div>
      ) : (
        <div
          className="relative flex items-center justify-center gap-3 px-6 py-3"
          style={{ background: "#fdfcf8" }}
        >
          <span
            aria-hidden
            className="block h-px w-6"
            style={{ background: accent }}
          />
          <span
            className="re-mono text-[10px] font-semibold"
            style={{ color: accent, letterSpacing: "0.32em" }}
          >
            {translations.aboutMe}
          </span>
          <span
            aria-hidden
            className="block h-px w-6"
            style={{ background: accent }}
          />
        </div>
      )}
    </header>
  );
}

// =============================================================================
// Quick action pills — Call / WhatsApp / Email / Book. Inline below the hero.
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
  translations: ReCopy;
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
      tone: "accent",
    });
  }
  if (bookingUrl) {
    pills.push({
      label: translations.book,
      href: bookingUrl,
      Icon: Calendar,
      tone: "neutral",
      external: true,
    });
  }

  return (
    <div className="grid grid-cols-2 gap-2 px-6 pb-2 pt-5 sm:grid-cols-3">
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
            className="group relative flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-[12.5px] font-semibold transition-all hover:-translate-y-px active:scale-[0.98]"
            style={
              isPrimary
                ? {
                    background: primary,
                    color: "white",
                    boxShadow: `0 6px 18px -8px ${primary}A6, inset 0 1px 0 rgba(255,255,255,0.18)`,
                  }
                : isAccent
                  ? {
                      background: accent,
                      color: "white",
                      boxShadow: `0 6px 18px -8px ${accent}A6, inset 0 1px 0 rgba(255,255,255,0.20)`,
                    }
                  : {
                      background: "#f7f8fa",
                      color: primary,
                      boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.08)",
                    }
            }
          >
            <p.Icon size={14} strokeWidth={2.4} />
            <span className="leading-none">{p.label}</span>
          </a>
        );
      })}
    </div>
  );
}

// =============================================================================
// Reusable section frame — gold rule + heading. Rhythm-defining primitive.
// =============================================================================

function Section({
  title,
  accent,
  primary,
  children,
  background,
}: {
  title: string;
  accent: string;
  primary: string;
  children: React.ReactNode;
  background?: string;
}) {
  return (
    <section
      className="relative px-6 py-7"
      style={{ background: background ?? "white" }}
    >
      {/* Gold accent rule — kart_01 signature. */}
      <div
        aria-hidden
        className="absolute left-6 top-7 h-[18px] w-[3px] rounded-sm"
        style={{ background: accent }}
      />
      <h2
        className="re-display mb-4 pl-3 text-[14px] font-bold tracking-tight"
        style={{ color: primary }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

// =============================================================================
// FeaturedListings — horizontal snap carousel of property cards.
// Reads from `services` (title / description / priceLabel) — same shape the
// order form already collects. Up to 3 shown by default.
// =============================================================================

function FeaturedListings({
  items,
  accent,
  primary,
  title,
}: {
  items: Array<{ title: string; description?: string; priceLabel?: string; href?: string | null }>;
  accent: string;
  primary: string;
  title: string;
}) {
  return (
    <section className="relative px-6 py-7">
      <div
        aria-hidden
        className="absolute left-6 top-7 h-[18px] w-[3px] rounded-sm"
        style={{ background: accent }}
      />
      <h2
        className="re-display mb-4 pl-3 text-[14px] font-bold tracking-tight"
        style={{ color: primary }}
      >
        {title}
      </h2>

      <div
        className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
      >
        {items.map((item, i) => (
          <ServiceLink
            key={`${item.title}-${i}`}
            href={item.href}
            className="relative w-[78%] shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.35),0_2px_8px_-4px_rgba(15,23,42,0.12)] ring-1 ring-black/5"
          >
            {/* Listing photo placeholder — gold-on-navy gradient with mock badge. */}
            <div
              className="relative h-[140px] w-full overflow-hidden"
              style={{
                background: `radial-gradient(120% 100% at 8% 0%, ${accent}26, transparent 55%), linear-gradient(140deg, ${primary} 0%, #0a1224 100%)`,
              }}
            >
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-overlay opacity-[0.20]"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)",
                  backgroundSize: "4px 4px",
                }}
              />
              {/* Status badge bottom-left. */}
              {item.priceLabel && (
                <span
                  className="re-mono absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[9.5px] font-semibold text-[#1a202c]"
                  style={{
                    background: accent,
                    boxShadow: "0 4px 12px -4px rgba(0,0,0,0.25)",
                    letterSpacing: "0.18em",
                  }}
                >
                  {item.priceLabel}
                </span>
              )}
              <Building2
                aria-hidden
                size={48}
                strokeWidth={1.2}
                className="absolute right-4 top-4 text-white/30"
              />
            </div>

            <div className="space-y-1.5 p-4">
              <h3
                className="re-display text-[14px] font-bold leading-snug"
                style={{ color: primary }}
              >
                {item.title}
              </h3>
              {item.description && (
                <p className="line-clamp-2 text-[12.5px] leading-snug text-[#475569]">
                  {item.description}
                </p>
              )}
              <div
                className="mt-2 flex items-center gap-1.5 text-[11.5px] font-semibold"
                style={{ color: accent }}
              >
                <span>Detay</span>
                <ArrowUpRight size={12} strokeWidth={2.4} />
              </div>
            </div>
          </ServiceLink>
        ))}
      </div>
    </section>
  );
}

// =============================================================================
// Bio strip — premium first-paragraph treatment with a gold hairline stamp.
// =============================================================================

function BioStrip({
  bio,
  accent,
  primary,
  title,
}: {
  bio: string;
  accent: string;
  primary: string;
  title: string;
}) {
  return (
    <section
      className="relative px-6 py-7"
      style={{
        background: `linear-gradient(180deg, #fdfcf8 0%, white 80%)`,
      }}
    >
      <div
        aria-hidden
        className="absolute left-6 top-7 h-[18px] w-[3px] rounded-sm"
        style={{ background: accent }}
      />
      <h2
        className="re-display mb-3 pl-3 text-[14px] font-bold tracking-tight"
        style={{ color: primary }}
      >
        {title}
      </h2>
      <p className="text-[13.5px] leading-[1.75] text-[#475569]">{bio}</p>

      {/* Hairline gold underline — anchors the section. */}
      <div className="mt-5 flex items-center gap-3">
        <span
          aria-hidden
          className="block h-px flex-1"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />
        <ShieldCheck size={12} strokeWidth={2} style={{ color: accent }} />
        <span
          aria-hidden
          className="block h-px flex-1"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />
      </div>
    </section>
  );
}

// =============================================================================
// CTA section — Wallet/Exchange/SendMyInfo wrappers. Accent-themed buttons.
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
  locale: "de" | "en" | "tr" | "es" | "it" | "fr" | "ar";
  primary: string;
  accent: string;
}) {
  return (
    <section className="px-6 pb-2 pt-1">
      <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={primary} locale={locale} />
      <ExchangeSlot slug={slug} primary={accent} locale={locale} />
    </section>
  );
}

// =============================================================================
// Testimonials — quoted card with star rating + signature.
// =============================================================================

function Testimonials({
  items,
  accent,
  primary,
  title,
}: {
  items: Array<{ author: string; role?: string; quote: string }>;
  accent: string;
  primary: string;
  title: string;
}) {
  return (
    <section className="relative px-6 py-7" style={{ background: "#f7f8fa" }}>
      <div
        aria-hidden
        className="absolute left-6 top-7 h-[18px] w-[3px] rounded-sm"
        style={{ background: accent }}
      />
      <h2
        className="re-display mb-4 pl-3 text-[14px] font-bold tracking-tight"
        style={{ color: primary }}
      >
        {title}
      </h2>

      <div className="grid gap-3">
        {items.slice(0, 3).map((item, i) => (
          <figure
            key={`${item.author}-${i}`}
            className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-[0_2px_10px_-4px_rgba(15,23,42,0.10)] ring-1 ring-black/5"
          >
            <Quote
              aria-hidden
              size={36}
              strokeWidth={1.4}
              className="absolute right-4 top-3 opacity-25"
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
                  size={12}
                  strokeWidth={2}
                  fill="currentColor"
                />
              ))}
            </div>
            <blockquote className="re-serif text-[14.5px] italic leading-snug text-[#1a202c]">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <figcaption
              className="re-display mt-3 text-[11.5px] font-semibold"
              style={{ color: primary }}
            >
              {item.author}
              {item.role && (
                <span
                  className="ml-2 font-normal text-[#64748b]"
                  style={{ letterSpacing: "0.02em" }}
                >
                  · {item.role}
                </span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

// =============================================================================
// Brochure strip — single-CTA portfolio link.
// =============================================================================

function BrochureStrip({
  url,
  accent,
  primary,
  label,
}: {
  url: string;
  accent: string;
  primary: string;
  label: string;
}) {
  return (
    <section className="px-6 py-5">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between gap-3 rounded-2xl px-5 py-4 transition-all hover:-translate-y-px"
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, #0a1224 100%)`,
          boxShadow: `0 14px 30px -14px ${primary}A6, inset 0 1px 0 rgba(255,255,255,0.10)`,
        }}
      >
        <span className="flex items-center gap-3 text-white">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: `${accent}26`, color: accent }}
          >
            <FileDown size={15} strokeWidth={2.2} />
          </span>
          <span className="re-display text-[13.5px] font-semibold tracking-tight">
            {label}
          </span>
        </span>
        <ArrowUpRight
          size={18}
          strokeWidth={2}
          className="text-white/70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>
    </section>
  );
}

// =============================================================================
// Footer — deep-blue band with gold name + share/legal links.
// =============================================================================

function Footer({
  siteUrl,
  slug,
  impressumUrl,
  privacyUrl,
  primary,
  accent,
  translations,
}: {
  siteUrl: string;
  slug: string;
  impressumUrl?: string;
  privacyUrl?: string;
  primary: string;
  accent: string;
  translations: ReCopy;
}) {
  return (
    <footer
      className="relative px-6 pb-6 pt-7 text-white"
      style={{
        background: `linear-gradient(180deg, ${primary} 0%, #0a1224 100%)`,
      }}
    >
      {/* Gold rule top edge. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accent} 30%, ${accent} 70%, transparent 100%)`,
        }}
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10.5px] text-white/65">
        <FooterShare siteUrl={siteUrl} slug={slug} />
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
          <Shield size={11} strokeWidth={2} />
          {translations.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="re-display font-semibold transition-colors hover:text-white"
            style={{ color: accent }}
          >
            OpSolid
          </a>
        </span>
      </div>

      {/* Gold-name signature. */}
      <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4">
        <MapPin size={12} strokeWidth={1.8} style={{ color: accent }} />
        <span className="re-mono text-[10px] text-white/55">
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
            // User cancelled — fall through to clipboard.
          }
        }
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        }
      }}
      className="hover:text-white"
    >
      Teilen
    </button>
  );
}
