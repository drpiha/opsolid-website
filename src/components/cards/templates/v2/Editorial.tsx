"use client";

// =============================================================================
// Editorial — v2 template (id=11, key="editorial").  Cross-industry premium.
//
// Design DNA: layouts/v02_elegant.html — boutique hospitality / consultancy /
// wedding / luxury advisory. Steel-blue (#3a5a7c) → terracotta (#c4875a) warm-
// cool palette, Playfair Display + Source Sans 3, full-bleed hero with an
// initials seal as the SIGNATURE motif.
//
// Locked design choices (do not parameterise):
//   - Hero ~240 px full-bleed with steel→terracotta wash; user's photo behind.
//     Falls back to layered gradient + paper-grain texture (SVG noise overlay).
//   - Top-left initials seal — circular 44 × 44 px gradient (steel → terracotta),
//     serif initials in cream. Repeats as small accent in footer.
//   - Section rhythm:
//       Hero (seal + name in Playfair display + tagline + subtitle) →
//       About (long-form 2-paragraph bio, drop-cap on first paragraph) →
//       Services (3-4 offerings, serif name + body + terracotta "Inquire" link)
//       → Portfolio strip (gallery, optional) →
//       Testimonials (long-form, large quote glyph) → Contact + Booking →
//       Wallet/Exchange/SendMyInfo → Social → Footer.
//   - Typography: Playfair Display (h, 500/600/700) + Source Sans 3 (b, 400/500),
//     scoped via `.ed-card`.
//   - Drop-cap on the bio's first paragraph; long-form narrative tone.
//
// Variable per card: cardData, photoPath, logoPath, brandPrimaryHex (overrides
// steel-blue), brandAccentHex (overrides terracotta).
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Calendar,
  FileDown,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  Shield,
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
import { resolveLabels } from "./shared/resolveLabels";
import type { TemplateProps } from "./types";

// -----------------------------------------------------------------------------
// Locked palette.
// -----------------------------------------------------------------------------
const LOCKED_PRIMARY = "#3a5a7c"; // steel-blue
const LOCKED_ACCENT = "#c4875a"; // terracotta
const SURFACE = "#f5f7fa"; // cream surface
const CARD_BG = "#ffffff";
const TEXT_DARK = "#2c2c2c";
const TEXT_MID = "#5a5a5a";
const TEXT_LIGHT = "#8a8a8a";
const BORDER = "#dce4ec";

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

function splitParagraphs(text: string): string[] {
  const parts = text.split(/\n{2,}|\r\n\r\n/).map((s) => s.trim()).filter(Boolean);
  return parts.length > 0 ? parts : [text.trim()];
}

interface EdCopy {
  saveContact: string;
  callNow: string;
  whatsapp: string;
  email: string;
  book: string;
  about: string;
  services: string;
  servicesEyebrow: string;
  inquire: string;
  portfolio: string;
  voices: string;
  contact: string;
  contactEyebrow: string;
  social: string;
  brochure: string;
  walletLabel: string;
  impressum: string;
  privacy: string;
  poweredBy: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", EdCopy> = {
  de: {
    saveContact: "Speichern",
    callNow: "Anrufen",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    book: "Termin",
    about: "Über mich",
    services: "Leistungen",
    servicesEyebrow: "Atelier",
    inquire: "Anfragen",
    portfolio: "Portfolio",
    voices: "Stimmen",
    contact: "Kontakt",
    contactEyebrow: "Korrespondenz",
    social: "Social",
    brochure: "Mappe ansehen",
    walletLabel: "Auf Smartphone speichern",
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
    about: "About",
    services: "Services",
    servicesEyebrow: "Atelier",
    inquire: "Inquire",
    portfolio: "Portfolio",
    voices: "Voices",
    contact: "Contact",
    contactEyebrow: "Correspondence",
    social: "Social",
    brochure: "View brochure",
    walletLabel: "Add to wallet",
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
    about: "Hakkımda",
    services: "Hizmetler",
    servicesEyebrow: "Atölye",
    inquire: "Bilgi al",
    portfolio: "Portföy",
    voices: "Sesler",
    contact: "İletişim",
    contactEyebrow: "Yazışma",
    social: "Sosyal",
    brochure: "Mappeyi görüntüle",
    walletLabel: "Cüzdana ekle",
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
    about: "Acerca de",
    services: "Servicios",
    servicesEyebrow: "Atelier",
    inquire: "Consultar",
    portfolio: "Portafolio",
    voices: "Voces",
    contact: "Contacto",
    contactEyebrow: "Correspondencia",
    social: "Redes",
    brochure: "Ver folleto",
    walletLabel: "Añadir a la cartera",
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
    about: "Chi siamo",
    services: "Servizi",
    servicesEyebrow: "Atelier",
    inquire: "Richiedi",
    portfolio: "Portfolio",
    voices: "Voci",
    contact: "Contatto",
    contactEyebrow: "Corrispondenza",
    social: "Social",
    brochure: "Vedi brochure",
    walletLabel: "Aggiungi al wallet",
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
    about: "À propos",
    services: "Services",
    servicesEyebrow: "Atelier",
    inquire: "Demander",
    portfolio: "Portfolio",
    voices: "Témoignages",
    contact: "Contact",
    contactEyebrow: "Correspondance",
    social: "Réseaux",
    brochure: "Voir la brochure",
    walletLabel: "Ajouter au portefeuille",
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
    about: "حول",
    services: "الخدمات",
    servicesEyebrow: "أتيليه",
    inquire: "استفسر",
    portfolio: "المعرض",
    voices: "أصوات",
    contact: "اتصال",
    contactEyebrow: "المراسلات",
    social: "التواصل",
    brochure: "عرض الكتيب",
    walletLabel: "إضافة إلى المحفظة",
    impressum: "بيانات النشر",
    privacy: "الخصوصية",
    poweredBy: "مشغل بواسطة",
  
  },
};

export function Editorial({
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

  const services =
    (cardData.services ?? sector?.services)?.slice(0, 4);

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const subtitle = [cardData.position, cardData.title].filter(Boolean).join(" · ");

  return (
    <article
      data-template="editorial"
      className={`ed-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(40,55,70,0.32),0_8px_22px_-12px_rgba(40,55,70,0.18)] ring-1 ring-black/5`}
      style={
        {
          background: SURFACE,
          color: TEXT_DARK,
          ["--ed-primary" as string]: primary,
          ["--ed-accent" as string]: accent,
          ["--ed-accent-soft" as string]: `${accent}1A`,
          ["--font-editorial-display" as string]: "'Playfair Display', Georgia, serif",
          ["--font-editorial-body" as string]: "'Source Sans 3', system-ui, sans-serif",
          fontFamily: "var(--font-editorial-body), 'Source Sans 3', system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .ed-card {
          font-family:var(--tpl-font-body,  var(--font-editorial-body), "Source Sans 3", system-ui, sans-serif);
          line-height: 1.65;
        }
        .ed-card .ed-display,
        .ed-card h1.ed-display,
        .ed-card h2.ed-display,
        .ed-card h3.ed-display {
          font-family:var(--tpl-font-body,  var(--font-editorial-display), "Playfair Display", Georgia, serif);
          letter-spacing: 0.005em;
          font-feature-settings: "lnum";
        }
        .ed-card .ed-italic {
          font-family:var(--tpl-font-body,  var(--font-editorial-display), "Playfair Display", Georgia, serif);
          font-style: italic;
        }
        .ed-card .ed-mono {
          font-family:var(--tpl-font-body,  var(--font-editorial-body), "Source Sans 3", system-ui, sans-serif);
          letter-spacing: 0.32em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .ed-card .ed-dropcap::first-letter {
          font-family:var(--tpl-font-body,  var(--font-editorial-display), "Playfair Display", Georgia, serif);
          font-weight: 600;
          font-size: 3.4em;
          line-height: 0.85;
          float: left;
          margin: 0.18em 0.12em 0 0;
          color: var(--ed-primary);
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
      />

      <SealStrip
        company={cardData.company}
        address={cardData.address}
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
        translations={t}
      />

      {cardData.bio && (
        <AboutSection
          bio={cardData.bio}
          primary={primary}
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

      {cardData.gallery && cardData.gallery.length > 0 && (
        <PortfolioStrip
          items={cardData.gallery.slice(0, 6)}
          primary={primary}
          accent={accent}
          title={t.portfolio}
        />
      )}

      {cardData.testimonials && cardData.testimonials.length > 0 && (
        <Testimonials
          items={cardData.testimonials.slice(0, 3)}
          primary={primary}
          accent={accent}
          title={t.voices}
        />
      )}

      <ContactSection
        cardData={cardData}
        locale={locale}
        primary={primary}
        accent={accent}
        translations={t}
      />

      {cardData.brochureUrl && (
        <BrochureStrip
          url={cardData.brochureUrl}
          primary={primary}
          accent={accent}
          label={t.brochure}
        />
      )}

      <CTASection slug={slug} sourceQs={sourceQs} locale={locale} primary={primary} accent={accent} />

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="border-t border-[var(--ed-accent-soft)] px-6 py-5"
          labelClassName="ed-mono mb-3 text-[10px] text-[var(--ed-primary)]/65"
        >
          {walletSlot}
        </WalletDock>
      )}

      {cardData.socials && (
        <SocialSection
          socials={cardData.socials}
          primary={primary}
          accent={accent}
          title={t.social}
        />
      )}

      <Footer
        siteUrl={siteUrl}
        slug={slug}
        impressumUrl={cardData.impressumUrl}
        privacyUrl={cardData.privacyUrl}
        company={cardData.company}
        initials={initials}
        primary={primary}
        accent={accent}
        translations={t}
      />
    </article>
  );
}

// =============================================================================
// HERO — full-bleed photo, steel→terracotta overlay, initials seal top-left,
// Playfair display name + italic tagline.
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
}) {
  return (
    <header className="relative h-[240px] w-full overflow-hidden">
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
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 100% at 18% 12%, ${accent}33, transparent 55%), linear-gradient(160deg, ${primary} 0%, #2a4262 60%, #1c2c45 100%)`,
          }}
        />
      )}

      {/* Steel → terracotta wash */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(155deg, ${primary}D9 0%, ${primary}66 35%, ${accent}33 75%, ${accent}73 100%)`,
        }}
      />

      {/* Subtle paper-grain (SVG noise) */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0'/></filter><rect width='120' height='120' filter='url(%23n)' opacity='0.85'/></svg>",
          )}")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* Initials seal — SIGNATURE motif */}
      <div className="absolute left-5 top-5 z-10">
        <Seal
          initials={initials}
          logoUrl={logoUrl}
          primary={primary}
          accent={accent}
          size={44}
        />
      </div>

      {/* Sector / source pills */}
      <div className="absolute right-5 top-5 z-10 flex flex-col items-end gap-1.5">
        {sectorBadge && (
          <span className="ed-mono rounded-full bg-white/16 px-2.5 py-1 text-[9.5px] text-white backdrop-blur-md ring-1 ring-white/20">
            {sectorBadge}
          </span>
        )}
        {sourceLabel && (
          <span className="ed-mono rounded-full bg-black/35 px-2.5 py-1 text-[9.5px] text-white/85 backdrop-blur-md ring-1 ring-white/10">
            {sourceLabel}
          </span>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-6 pt-10">
        {company && (
          <div className="ed-mono mb-2 text-[10px] tracking-[0.32em] text-white/85">
            {company}
          </div>
        )}
        <h1 className="ed-display text-[28px] font-semibold leading-[1.1] text-white"
          style={{ textShadow: "0 1px 14px rgba(0,0,0,0.32)" }}
        >
          {name}
        </h1>
        {subtitle && (
          <p className="ed-italic mt-1 text-[14px] text-white/90">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}

// Initials seal — circular gradient with serif initials. Reused in footer.
function Seal({
  initials,
  logoUrl,
  primary,
  accent,
  size,
}: {
  initials: string;
  logoUrl?: string | null;
  primary: string;
  accent: string;
  size: number;
}) {
  return (
    <div
      className="flex items-center justify-center overflow-hidden rounded-full ring-1 ring-white/30"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
        boxShadow: `0 4px 14px -4px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.16)`,
      }}
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt=""
          width={size * 2}
          height={size * 2}
          className="h-[70%] w-[70%] object-contain tpl-logo"
          unoptimized
        />
      ) : (
        <span
          className="ed-display font-semibold"
          style={{
            color: "#fdf6e9",
            fontSize: Math.round(size * 0.4),
            letterSpacing: "0.02em",
            lineHeight: 1,
          }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}

// =============================================================================
// Seal strip — terracotta hairline, address centred in italic.
// =============================================================================

function SealStrip({
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
  return (
    <div
      className="flex items-center justify-center gap-3 px-6 py-3.5"
      style={{ background: CARD_BG, borderBottom: `1px solid ${BORDER}` }}
    >
      <span aria-hidden className="block h-px w-8" style={{ background: accent }} />
      <span
        className="ed-italic text-center text-[13.5px]"
        style={{ color: primary }}
      >
        {address ?? company ?? ""}
      </span>
      <span aria-hidden className="block h-px w-8" style={{ background: accent }} />
    </div>
  );
}

// =============================================================================
// Quick action pills.
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
  translations: EdCopy;
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
    <div className="flex flex-wrap justify-center gap-2 px-6 py-5"
      style={{ background: CARD_BG }}
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
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-medium transition-all hover:-translate-y-px"
            style={
              p.tone === "primary"
                ? {
                    background: primary,
                    color: "#fff",
                    boxShadow: `0 6px 18px -8px ${primary}A6`,
                  }
                : p.tone === "accent"
                  ? {
                      background: accent,
                      color: "#fff",
                      boxShadow: `0 6px 18px -8px ${accent}A6`,
                    }
                  : {
                      background: CARD_BG,
                      color: primary,
                      border: `1.5px solid ${primary}`,
                    }
            }
          >
            <p.Icon size={13} strokeWidth={2} />
            {p.label}
          </a>
        );
      })}
    </div>
  );
}

// =============================================================================
// Section frame — centred Playfair title with a terracotta short rule below.
// =============================================================================

function SectionFrame({
  title,
  primary,
  accent,
  background,
  children,
  pad = "px-6 py-8",
}: {
  title: string;
  primary: string;
  accent: string;
  background?: string;
  children: React.ReactNode;
  pad?: string;
}) {
  return (
    <section className={`relative ${pad}`} style={{ background: background ?? "transparent" }}>
      <div className="mb-6 text-center">
        <h2
          className="ed-display text-[22px] font-semibold leading-tight"
          style={{ color: primary }}
        >
          {title}
        </h2>
        <span
          aria-hidden
          className="mx-auto mt-2 block h-[2px] w-10 rounded-full"
          style={{ background: accent }}
        />
      </div>
      {children}
    </section>
  );
}

// =============================================================================
// About — two-paragraph long-form bio with a Playfair drop-cap on para 1.
// =============================================================================

function AboutSection({
  bio,
  primary,
  accent,
  title,
}: {
  bio: string;
  primary: string;
  accent: string;
  title: string;
}) {
  const paragraphs = splitParagraphs(bio);
  return (
    <SectionFrame title={title} primary={primary} accent={accent}>
      <div
        className="rounded-2xl p-7"
        style={{
          background: CARD_BG,
          boxShadow: "0 2px 16px rgba(40,55,70,0.07)",
        }}
      >
        <p
          className="ed-dropcap text-[14px] leading-[1.8] text-[#5a5a5a]"
          style={{ textAlign: "justify" }}
        >
          {paragraphs[0]}
        </p>
        {paragraphs.slice(1).map((p, i) => (
          <p
            key={i}
            className="mt-4 text-[14px] leading-[1.8] text-[#5a5a5a]"
            style={{ textAlign: "justify" }}
          >
            {p}
          </p>
        ))}
      </div>
    </SectionFrame>
  );
}

// =============================================================================
// Services — serif name + body + terracotta "Inquire" link with hairline rule.
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
  translations: EdCopy;
  waDigits: string;
}) {
  return (
    <SectionFrame title={translations.services} primary={primary} accent={accent}>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <article
            key={`${item.title}-${i}`}
            className="rounded-2xl p-6 transition-all hover:-translate-y-0.5"
            style={{
              background: CARD_BG,
              boxShadow: "0 2px 16px rgba(40,55,70,0.07)",
            }}
          >
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <h3
                className="ed-display text-[17px] font-semibold leading-snug"
                style={{ color: primary }}
              >
                {item.title}
              </h3>
              {item.priceLabel && (
                <span
                  className="ed-italic shrink-0 text-[13px]"
                  style={{ color: accent }}
                >
                  {item.priceLabel}
                </span>
              )}
            </div>
            {item.description && (
              <p className="mb-3 text-[13.5px] leading-[1.7] text-[#5a5a5a]">
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
              className="inline-flex items-center gap-1 text-[12px] font-medium tracking-wide transition-colors"
              style={{ color: accent }}
            >
              <span className="ed-mono text-[10px]">{translations.inquire}</span>
              <ArrowUpRight size={11} strokeWidth={2} />
            </a>
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}

// =============================================================================
// Portfolio strip — gallery thumbnails, masonry-ish.
// =============================================================================

function PortfolioStrip({
  items,
  primary,
  accent,
  title,
}: {
  items: Array<{ src: string; alt?: string }>;
  primary: string;
  accent: string;
  title: string;
}) {
  return (
    <SectionFrame title={title} primary={primary} accent={accent}>
      <div className="grid grid-cols-3 gap-1.5">
        {items.map((it, i) => {
          const src = resolveAssetUrl(it.src) ?? it.src;
          return (
            <div
              key={`${it.src}-${i}`}
              className="relative aspect-[4/5] overflow-hidden rounded-md"
              style={{ background: "#1a1a1a" }}
            >
              {/* Use raw img — gallery items may be storage paths, Next/Image needs sizes/loaders. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={it.alt ?? ""}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
    </SectionFrame>
  );
}

// =============================================================================
// Testimonials — long-form, large quote glyph.
// =============================================================================

function Testimonials({
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
    <SectionFrame title={title} primary={primary} accent={accent}>
      <div className="flex flex-col gap-3">
        {items.map((it, i) => (
          <figure
            key={`${it.author}-${i}`}
            className="relative overflow-hidden rounded-2xl p-7"
            style={{
              background: CARD_BG,
              boxShadow: "0 2px 16px rgba(40,55,70,0.07)",
            }}
          >
            <Quote
              aria-hidden
              size={48}
              strokeWidth={1.2}
              className="absolute -left-1 -top-1 opacity-15"
              style={{ color: accent }}
            />
            <blockquote
              className="ed-italic relative pl-2 text-[15px] leading-[1.7]"
              style={{ color: TEXT_DARK }}
            >
              &ldquo;{it.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-2">
              <span
                aria-hidden
                className="block h-px w-6"
                style={{ background: accent }}
              />
              <span
                className="ed-display text-[12px] font-semibold"
                style={{ color: primary }}
              >
                {it.author}
              </span>
              {it.role && (
                <span
                  className="text-[12px]"
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
// Contact — shared rows in tile variant, primary accent.
// =============================================================================

function ContactSection({
  cardData,
  locale,
  primary,
  accent,
  translations,
}: {
  cardData: TemplateProps["cardData"];
  locale: "de" | "en" | "tr" | "es" | "it" | "fr" | "ar";
  primary: string;
  accent: string;
  translations: EdCopy;
}) {
  return (
    <SectionFrame
      title={translations.contact}
      primary={primary}
      accent={accent}
      background={SURFACE}
    >
      <ContactRows
        cardData={cardData}
        locale={locale}
        accentHex={accent}
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
                background: CARD_BG,
                boxShadow: "0 2px 14px rgba(40,55,70,0.07)",
              }}
            >
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `${primary}10`,
                  color: primary,
                }}
              >
                <row.Icon size={15} strokeWidth={1.8} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span
                  className="ed-mono text-[10px]"
                  style={{ color: TEXT_LIGHT }}
                >
                  {row.label}
                </span>
                <span
                  className="ed-display truncate text-[13.5px] font-medium"
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
// Brochure strip — single CTA link.
// =============================================================================

function BrochureStrip({
  url,
  primary,
  accent,
  label,
}: {
  url: string;
  primary: string;
  accent: string;
  label: string;
}) {
  return (
    <section className="px-6 py-5" style={{ background: SURFACE }}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between gap-3 rounded-2xl px-5 py-4 transition-all hover:-translate-y-px"
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
          boxShadow: `0 14px 30px -14px ${primary}A6`,
        }}
      >
        <span className="flex items-center gap-3 text-white">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: "rgba(255,255,255,0.20)" }}
          >
            <FileDown size={15} strokeWidth={2} />
          </span>
          <span className="ed-display text-[14px] font-semibold">{label}</span>
        </span>
        <ArrowUpRight
          size={18}
          strokeWidth={2}
          className="text-white/85 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>
    </section>
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
  locale: "de" | "en" | "tr" | "es" | "it" | "fr" | "ar";
  primary: string;
  accent: string;
}) {
  return (
    <section className="px-6 pb-2 pt-1" style={{ background: SURFACE }}>
      <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={primary} locale={locale} />
      <ExchangeSlot slug={slug} primary={accent} locale={locale} />
    </section>
  );
}

// =============================================================================
// Social — pill variant, primary outline.
// =============================================================================

function SocialSection({
  socials,
  primary,
  accent,
  title,
}: {
  socials: NonNullable<TemplateProps["cardData"]["socials"]>;
  primary: string;
  accent: string;
  title: string;
}) {
  return (
    <SectionFrame title={title} primary={primary} accent={accent} background={SURFACE}>
      <SocialRow
        socials={socials}
        variant="pill"
        accentHex={accent}
        className="flex flex-wrap justify-center gap-2"
        itemClassName="!bg-white !border-[#dce4ec] hover:!border-[var(--ed-primary)]"
      />
    </SectionFrame>
  );
}

// =============================================================================
// Footer — initials seal motif repeated small, hairline credits.
// =============================================================================

function Footer({
  siteUrl,
  slug,
  impressumUrl,
  privacyUrl,
  company,
  initials,
  primary,
  accent,
  translations,
}: {
  siteUrl: string;
  slug: string;
  impressumUrl?: string;
  privacyUrl?: string;
  company?: string;
  initials: string;
  primary: string;
  accent: string;
  translations: EdCopy;
}) {
  return (
    <footer
      className="px-6 pb-7 pt-6"
      style={{
        background: CARD_BG,
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <div className="mb-4 flex flex-col items-center gap-2.5">
        <Seal initials={initials} primary={primary} accent={accent} size={28} />
        {company && (
          <p
            className="ed-italic text-center text-[13px]"
            style={{ color: TEXT_MID }}
          >
            {company}
          </p>
        )}
      </div>
      <div
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[10.5px]"
        style={{ color: TEXT_LIGHT }}
      >
        <FooterShare siteUrl={siteUrl} slug={slug} />
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
          className="ed-display font-semibold"
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
            // fall through
          }
        }
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        }
      }}
      className="transition-colors"
      style={{ color: TEXT_LIGHT }}
    >
      Share
    </button>
  );
}

// =============================================================================
// Registry entry + sample data.
// =============================================================================

import type { TemplateRegistryEntry, SampleData } from "./types";

export const editorialEntry: TemplateRegistryEntry = {
  id: 11,
  key: "editorial",
  name: "Editorial",
  industry: "Boutique hospitality / consultancy / luxury advisory",
  Component: Editorial,
  supports: {
    services: true,
    faqs: false,
    testimonials: true,
    gallery: true,
    video: false,
    brochure: true,
    socials: true,
    themeSwitch: true,
    photo: true,
    logo: true,
  },
  defaults: {
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-editorial",
};

// source: Unsplash (license: https://unsplash.com/license) — free for commercial use.
const EDITORIAL_SAMPLE_PHOTO =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80";

export const editorialSample: SampleData = {
  templateId: 11,
  slug: "demo-editorial",
  photoUrl: EDITORIAL_SAMPLE_PHOTO,
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
  cardData: {
    name: "Marlene Visconti",
    position: "Founder & Atelier Director",
    title: "Bespoke weddings & private events",
    company: "Atelier Visconti",
    email: "marlene@ateliervisconti.it",
    phone: "+39 031 555 0712",
    whatsapp: "+39 339 123 4567",
    website: "https://ateliervisconti.it",
    address: "Via Roma 24, 22021 Bellagio, Lake Como",
    bio: "For the past eleven years, Atelier Visconti has been planning weddings and private events on Lake Como, in the Italian Alps, and along the Amalfi coast. We are a small team — five planners and a remarkable network of vendors — working on no more than twelve weddings a season.\n\nOur weddings begin with a long conversation, often over wine, and end at three in the morning by the lake. In between, we handle the architecture: venue, calendar, vendors, contracts, food, music, flowers, the hundred quiet logistics that let a celebration feel inevitable. We take this work seriously and the rest of it lightly.",
    bookingUrl: "https://cal.com/ateliervisconti/discovery",
    brochureUrl: "https://ateliervisconti.it/lookbook-2026.pdf",
    sectorKey: "hospitality",
    socials: {
      instagram: "https://instagram.com/ateliervisconti",
      facebook: "https://facebook.com/ateliervisconti",
    },
    services: [
      {
        title: "The Intimate",
        description:
          "Weddings of up to 30 guests. Private villa or restaurant, single-day celebration, complete planning and on-day direction.",
        priceLabel: "from €18 000",
      },
      {
        title: "The Estate",
        description:
          "Weddings of 30–120 guests. Multi-day weekend, full planning, lodging coordination, three-event flow (welcome dinner, ceremony, brunch).",
        priceLabel: "from €42 000",
      },
      {
        title: "The Destination",
        description:
          "Weddings beyond Como — Amalfi, Capri, Tuscany, the Dolomites. Five-month lead time minimum. Travel and venue scouting included.",
        priceLabel: "Custom",
      },
    ],
    gallery: [
      { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=70", alt: "" },
      { src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=70", alt: "" },
      { src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=70", alt: "" },
      { src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=600&q=70", alt: "" },
      { src: "https://images.unsplash.com/photo-1525772764200-be829a350797?auto=format&fit=crop&w=600&q=70", alt: "" },
      { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=70", alt: "" },
    ],
    testimonials: [
      {
        author: "S. & J. Whitfield",
        role: "Wedding · September 2025 · Villa Balbianello",
        quote:
          "Marlene runs an atelier the way a great chef runs a kitchen — every detail composed, the guests entirely unaware of the architecture beneath them. We were guests at our own wedding.",
      },
      {
        author: "Caterina di Marco",
        role: "60th anniversary · Bellagio",
        quote:
          "We had been to a hundred weddings on this lake. We had never been to one that felt like this. Quiet, unhurried, somehow inevitable. That is the Visconti hand.",
      },
    ],
    impressumUrl: "https://ateliervisconti.it/impressum",
    privacyUrl: "https://ateliervisconti.it/privacy",
  },
};
