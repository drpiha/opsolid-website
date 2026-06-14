"use client";

// =============================================================================
// Studio — DJ / music producer / electronic artist (id=6, key="studio").
//
// Design DNA: Projekt_4k/showcase/kart_06_dj.html, refined down from retail-
// loud club poster to Berlin underground premium label rebrand. Saturated red
// (#ef4444) and orange (#f97316) traded for desaturated `#a72a2a` and warm
// muted `#c46834`. The animated waveform is the soul of this design — kept,
// but reduced to a 1px hairline pattern (30% opacity) and slowed to 8s.
//
// Locked design choices (do not parameterise):
//   - Pure-black hero. No photo. Animated SVG waveform behind name.
//   - Logo centered behind waveform, locked 40 × 40.
//   - Bebas Neue used SPARINGLY for big calls (single-word headlines only).
//   - Section rhythm:
//       Hero → About → Tracks (services as releases) → Mixes (link grid) →
//       Booking CTA + Contact → Wallet/Exchange/SendMyInfo → Social → Footer.
//   - Mono uppercase eyebrows everywhere (Inter, 9.5px, 0.32em tracking).
//   - Hairline copper rules — never blocks, never neon.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Calendar,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  Radio,
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
import type { TemplateProps, TemplateRegistryEntry, SampleData } from "./types";

// -----------------------------------------------------------------------------
// Refined palette — premium Berlin label, not club poster.
// -----------------------------------------------------------------------------
const LOCKED_PRIMARY = "#a72a2a"; // desaturated red
const LOCKED_ACCENT = "#c46834"; // warm muted orange

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

interface StCopy {
  saveContact: string;
  callNow: string;
  whatsapp: string;
  email: string;
  book: string;
  releases: string;
  mixes: string;
  about: string;
  contact: string;
  residencies: string;
  social: string;
  walletLabel: string;
  bookingCta: string;
  bookingHint: string;
  impressum: string;
  privacy: string;
  poweredBy: string;
  listen: string;
  shareLabel: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", StCopy> = {
  de: {
    saveContact: "Speichern",
    callNow: "Anrufen",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    book: "Booking",
    releases: "Veröffentlichungen",
    mixes: "Mixes & Sets",
    about: "Über",
    contact: "Kontakt",
    residencies: "Aktuelle Residenzen",
    social: "Social",
    walletLabel: "Auf Smartphone speichern",
    bookingCta: "Booking-Anfrage",
    bookingHint: "Für Clubs, Festivals & Private Bookings",
    impressum: "Impressum",
    privacy: "Datenschutz",
    poweredBy: "Powered by",
    listen: "Anhören",
    shareLabel: "Share",
  },
  en: {
    saveContact: "Save contact",
    callNow: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    book: "Booking",
    releases: "Releases",
    mixes: "Mixes & sets",
    about: "About",
    contact: "Contact",
    residencies: "Recent residencies",
    social: "Social",
    walletLabel: "Add to wallet",
    bookingCta: "Booking enquiry",
    bookingHint: "For clubs, festivals and private bookings",
    impressum: "Imprint",
    privacy: "Privacy",
    poweredBy: "Powered by",
    listen: "Listen",
    shareLabel: "Share",
  },
  tr: {
    saveContact: "Rehbere kaydet",
    callNow: "Ara",
    whatsapp: "WhatsApp",
    email: "E-posta",
    book: "Booking",
    releases: "Yayınlar",
    mixes: "Mixler & setler",
    about: "Hakkında",
    contact: "İletişim",
    residencies: "Aktif rezidanslar",
    social: "Sosyal",
    walletLabel: "Cüzdana ekle",
    bookingCta: "Booking talebi",
    bookingHint: "Kulüpler, festivaller ve özel etkinlikler",
    impressum: "Künye",
    privacy: "Gizlilik",
    poweredBy: "Powered by",
    listen: "Dinle",
    shareLabel: "Share",
  },
  es: {

    saveContact: "Guardar contacto",
    callNow: "Llamar",
    whatsapp: "WhatsApp",
    email: "Correo",
    book: "Reserva",
    releases: "Lanzamientos",
    mixes: "Mezclas y sets",
    about: "Acerca de",
    contact: "Contacto",
    residencies: "Residencias recientes",
    social: "Redes",
    walletLabel: "Añadir a la cartera",
    bookingCta: "Solicitud de reserva",
    bookingHint: "Para clubs, festivales y reservas privadas",
    impressum: "Aviso legal",
    privacy: "Privacidad",
    poweredBy: "Desarrollado por",
    listen: "Escuchar",
    shareLabel: "Share",

  },
  it: {

    saveContact: "Salva contatto",
    callNow: "Chiama",
    whatsapp: "WhatsApp",
    email: "Email",
    book: "Prenotazione",
    releases: "Uscite",
    mixes: "Mix e set",
    about: "Chi siamo",
    contact: "Contatto",
    residencies: "Residenze recenti",
    social: "Social",
    walletLabel: "Aggiungi al wallet",
    bookingCta: "Richiesta di prenotazione",
    bookingHint: "Per club, festival e prenotazioni private",
    impressum: "Impressum",
    privacy: "Privacy",
    poweredBy: "Realizzato con",
    listen: "Ascolta",
    shareLabel: "Share",

  },
  fr: {

    saveContact: "Enregistrer le contact",
    callNow: "Appeler",
    whatsapp: "WhatsApp",
    email: "E-mail",
    book: "Réservation",
    releases: "Sorties",
    mixes: "Mixes et sets",
    about: "À propos",
    contact: "Contact",
    residencies: "Résidences récentes",
    social: "Réseaux",
    walletLabel: "Ajouter au portefeuille",
    bookingCta: "Demande de réservation",
    bookingHint: "Pour clubs, festivals et réservations privées",
    impressum: "Mentions légales",
    privacy: "Confidentialité",
    poweredBy: "Propulsé par",
    listen: "Écouter",
    shareLabel: "Share",

  },
  ar: {

    saveContact: "حفظ جهة الاتصال",
    callNow: "اتصال",
    whatsapp: "واتساب",
    email: "البريد الإلكتروني",
    book: "الحجز",
    releases: "الإصدارات",
    mixes: "مكسات وعروض",
    about: "حول",
    contact: "اتصال",
    residencies: "إقامات حديثة",
    social: "التواصل",
    walletLabel: "إضافة إلى المحفظة",
    bookingCta: "استفسار الحجز",
    bookingHint: "للنوادي والمهرجانات والحجوزات الخاصة",
    impressum: "بيانات النشر",
    privacy: "الخصوصية",
    poweredBy: "مشغل بواسطة",
    listen: "استمع",
    shareLabel: "Share",

  },
};

export function Studio({
  slug,
  cardData,
  locale = "de",
  logoPath,
  brandPrimaryHex,
  brandAccentHex,
  source,
  siteUrl,
  walletSlot,
}: TemplateProps) {
  // Studio is photo-less by design — `photoPath` intentionally not consumed.
  const t = resolveLabels(COPY[locale] ?? COPY.de, cardData.labels);

  const sector = getSectorPreset(cardData.sectorKey);
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;

  const logoUrl = resolveAssetUrl(logoPath);
  const initials = getInitials(cardData.name);

  const services =
    cardData.services ?? sector?.services;

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  // Tracks: up to 5 release-style cards.
  const tracks = (services ?? []).slice(0, 5);

  // Mixes: derive from gallery captions if any are URLs, else from custom buttons.
  // Falls back to nothing — no fake demo links injected at runtime.
  const mixes = (cardData.customButtons ?? []).slice(0, 4);

  // "Recent residencies" — replace testimonials role: a venue list.
  const residencies = (cardData.testimonials ?? []).slice(0, 4);

  return (
    <article
      data-template="studio"
      className={`st-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] bg-black text-white/85 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.7),0_8px_20px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/5`}
      style={
        {
          ["--st-primary" as string]: primary,
          ["--st-primary-rim" as string]: `${primary}33`,
          ["--st-accent" as string]: accent,
          ["--st-accent-soft" as string]: `${accent}1A`,
          ["--card-primary" as string]: primary,
          ["--card-accent" as string]: accent,
          ["--font-studio-display" as string]: "'Bebas Neue', Impact, sans-serif",
          ["--font-studio-body" as string]: "'Space Grotesk', system-ui, sans-serif",
          ["--font-studio-mono" as string]: "'Inter', system-ui, sans-serif",
          fontFamily: "var(--font-studio-body), system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .st-card {
          font-family:var(--tpl-font-body,  var(--font-studio-body), "Space Grotesk", system-ui, sans-serif);
          line-height: 1.65;
        }
        .st-card .st-display {
          font-family:var(--tpl-font-body,  var(--font-studio-display), "Bebas Neue", "Impact", sans-serif);
          letter-spacing: 0.06em;
          line-height: 0.95;
        }
        .st-card .st-mono {
          font-family:var(--tpl-font-body,  var(--font-studio-mono), "Inter", system-ui, sans-serif);
          letter-spacing: 0.32em;
          text-transform: uppercase;
          font-feature-settings: "tnum";
        }
        @keyframes st-wave-pan {
          0% {
            transform: translateX(-3%);
          }
          50% {
            transform: translateX(3%);
          }
          100% {
            transform: translateX(-3%);
          }
        }
        .st-card .st-wave-shift {
          animation: st-wave-pan 8s ease-in-out infinite;
        }
        @keyframes st-wave-bar {
          0%,
          100% {
            transform: scaleY(0.55);
          }
          50% {
            transform: scaleY(1);
          }
        }
        .st-card .st-bar {
          transform-origin: 50% 100%;
          animation: st-wave-bar 1.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .st-card .st-wave-shift,
          .st-card .st-bar {
            animation: none;
          }
        }
      `}</style>

      <Hero
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
        translations={t}
      />

      {cardData.bio && (
        <Section title={t.about} accent={accent}>
          <p className="text-[14px] leading-[1.85] text-white/90">{cardData.bio}</p>
        </Section>
      )}

      {tracks.length > 0 && (
        <TrackList items={tracks} accent={accent} primary={primary} title={t.releases} />
      )}

      {mixes.length > 0 && (
        <MixGrid items={mixes} accent={accent} title={t.mixes} listenLabel={t.listen} />
      )}

      {residencies.length > 0 && (
        <ResidencyList items={residencies} accent={accent} title={t.residencies} />
      )}

      <BookingStrip
        bookingUrl={cardData.bookingUrl}
        email={cardData.email}
        primary={primary}
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
          rowClassName="hover:text-[var(--st-accent)]"
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
          labelClassName="st-mono mb-3 text-[9.5px] text-white/45"
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
            itemClassName="!border-white/12 !bg-white/[0.04] !text-white/75 hover:!border-[var(--st-accent)] hover:!text-[var(--st-accent)] hover:!bg-white/[0.06]"
          />
        </Section>
      )}

      <Footer
        siteUrl={siteUrl}
        slug={slug}
        impressumUrl={cardData.impressumUrl}
        privacyUrl={cardData.privacyUrl}
        accent={accent}
        translations={t}
      />
    </article>
  );
}

// =============================================================================
// HERO — pure-black surface with subtle hairline waveform behind a centered
// monogram. Bebas Neue artist name is the only large element. Slow 8s pan.
// =============================================================================

function Hero({
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
  logoUrl: string | null;
  initials: string;
  company?: string;
  name: string;
  title?: string;
  primary: string;
  accent: string;
  sectorBadge?: string;
  sourceLabel?: string;
  translations: StCopy;
}) {
  // Pre-built waveform bars — 22 bars at varied heights. Each animates with a
  // staggered delay (set inline) to avoid 22 separate keyframe class names.
  const bars = React.useMemo(
    () =>
      [
        14, 32, 22, 44, 18, 36, 26, 48, 20, 38, 30, 42, 16, 40, 24, 46, 28, 34, 18,
        50, 22, 36,
      ].map((h, i) => ({ h, delay: (i % 8) * 0.18 })),
    [],
  );

  return (
    <header className="relative overflow-hidden bg-black">
      {/* Faint copper rim + pure-black surface. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.04), transparent 60%)",
        }}
      />

      <div className="relative px-8 pb-9 pt-12 text-center">
        {/* Eyebrow row — sector / source pills. */}
        <div className="mb-7 flex items-center justify-center gap-2">
          {sectorBadge && (
            <span className="st-mono inline-block rounded-full border border-white/12 px-2.5 py-1 text-[9px] text-white/55">
              {sectorBadge}
            </span>
          )}
          {sourceLabel && (
            <span className="st-mono inline-block rounded-full border border-white/8 px-2.5 py-1 text-[9px] text-white/45">
              {sourceLabel}
            </span>
          )}
        </div>

        {/* Logo / monogram — centered, locked 40 × 40, sitting in front of waveform. */}
        <div className="relative z-10 mx-auto mb-5 flex h-10 w-10 items-center justify-center overflow-hidden rounded-md">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={company ? `${company} logo` : "Logo"}
              width={64}
              height={64}
              className="h-10 w-10 object-contain tpl-logo"
              unoptimized
            />
          ) : (
            <span
              aria-hidden
              className="st-mono flex h-10 w-10 items-center justify-center rounded-md text-[10px] font-semibold tracking-[0.18em] text-white/85"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${accent}55`,
                color: accent,
              }}
            >
              {initials}
            </span>
          )}
        </div>

        {/* Subtle hairline waveform behind name — the soul of this design. */}
        <div
          aria-hidden
          className="st-wave-shift pointer-events-none absolute inset-x-0 top-[58%] z-0 flex -translate-y-1/2 items-end justify-center gap-[5px] opacity-30"
        >
          {bars.map((b, i) => (
            <span
              key={i}
              className="st-bar block w-[2px] rounded-[1px]"
              style={{
                height: `${b.h}px`,
                background: `linear-gradient(180deg, ${primary} 0%, ${accent} 100%)`,
                animationDelay: `${b.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Bebas Neue artist name. */}
        <h1
          className="st-display relative z-10 text-[3.2rem] font-normal text-white sm:text-[3.6rem]"
          style={{ textShadow: "0 2px 18px rgba(0,0,0,0.5)" }}
        >
          {name}
        </h1>

        {company && (
          <p
            className="st-mono relative z-10 mt-2 text-[10px] font-semibold"
            style={{ color: accent }}
          >
            {company}
          </p>
        )}

        {title && (
          <p className="relative z-10 mt-3 text-[12.5px] font-medium text-white/65">
            {title}
          </p>
        )}

        {/* Hairline accent rule below the hero — copper, not neon. */}
        <div className="relative z-10 mt-7 flex items-center justify-center gap-3">
          <span
            aria-hidden
            className="block h-px w-12"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            }}
          />
          <Radio size={11} strokeWidth={1.6} style={{ color: accent }} />
          <span
            aria-hidden
            className="block h-px w-12"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            }}
          />
        </div>

        <p
          className="st-mono relative z-10 mt-3 text-[8.5px]"
          style={{ color: accent, opacity: 0.65, letterSpacing: "0.42em" }}
        >
          {translations.about} · {translations.releases} · {translations.contact}
        </p>
      </div>
    </header>
  );
}

// =============================================================================
// Quick action pills — mono labels, hairline borders. Two-row grid.
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
  translations: StCopy;
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
      tone: "accent",
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
      tone: "primary",
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
            className="st-mono group relative flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-[10.5px] font-semibold transition-all hover:-translate-y-px"
            style={
              isAccent
                ? {
                    background: accent,
                    borderColor: accent,
                    color: "#0a0a0a",
                    boxShadow: `0 6px 18px -10px ${accent}A6`,
                  }
                : isPrimary
                  ? {
                      background: primary,
                      borderColor: primary,
                      color: "white",
                      boxShadow: `0 6px 18px -10px ${primary}A6`,
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
// Reusable section frame — copper hairline rule + mono uppercase title.
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
          style={{ background: accent }}
        />
        <h2
          className="st-mono text-[10px] font-semibold"
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
// TrackList — services rendered as track releases. Year + label + BPM key.
// =============================================================================

function TrackList({
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
      <ol className="space-y-3">
        {items.map((item, i) => (
          <li
            key={`${item.title}-${i}`}
            className="group relative flex items-stretch gap-4 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3.5 transition-all hover:-translate-y-px hover:border-white/15 hover:bg-white/[0.04]"
          >
            <span
              className="st-display flex w-7 shrink-0 items-center justify-start text-[1.5rem] tabular-nums"
              style={{ color: accent }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[14px] font-semibold leading-tight text-white">
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-white/75">
                  {item.description}
                </p>
              )}
              {item.priceLabel && (
                <span
                  className="st-mono mt-2 inline-block text-[8.5px] font-semibold"
                  style={{ color: primary, letterSpacing: "0.34em" }}
                >
                  {item.priceLabel}
                </span>
              )}
            </div>
            <div
              className="flex shrink-0 items-center"
              aria-hidden
              style={{ color: accent }}
            >
              <Headphones size={14} strokeWidth={1.6} />
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

// =============================================================================
// MixGrid — 2-col grid of mix links. Mono uppercase labels, hairline borders.
// =============================================================================

function MixGrid({
  items,
  accent,
  title,
  listenLabel,
}: {
  items: Array<{ label: string; href: string; style?: string }>;
  accent: string;
  title: string;
  listenLabel: string;
}) {
  return (
    <Section title={title} accent={accent}>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item, i) => (
          <a
            key={`${item.label}-${i}`}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-2 rounded-xl border border-white/8 bg-white/[0.02] p-4 transition-all hover:-translate-y-px hover:border-white/18 hover:bg-white/[0.05]"
          >
            <Play
              size={13}
              strokeWidth={1.8}
              style={{ color: accent }}
              className="opacity-80"
            />
            <span className="text-[12.5px] font-semibold leading-snug text-white/85">
              {item.label}
            </span>
            <span
              className="st-mono text-[8.5px] font-semibold"
              style={{ color: accent, letterSpacing: "0.32em" }}
            >
              {listenLabel} →
            </span>
          </a>
        ))}
      </div>
    </Section>
  );
}

// =============================================================================
// ResidencyList — venue list (replaces testimonials). Uses testimonial.author
// as venue, role as city, quote as residency description.
// =============================================================================

function ResidencyList({
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
                className="st-mono shrink-0 text-[8.5px] font-semibold pt-1"
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
// BookingStrip — primary CTA strip, the booking funnel hook.
// =============================================================================

function BookingStrip({
  bookingUrl,
  email,
  primary,
  accent,
  translations,
}: {
  bookingUrl?: string;
  email?: string;
  primary: string;
  accent: string;
  translations: StCopy;
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
        className="group relative flex items-stretch overflow-hidden rounded-2xl border transition-all hover:-translate-y-px"
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, #1a0606 120%)`,
          borderColor: `${accent}55`,
          boxShadow: `0 18px 40px -22px ${primary}A6`,
        }}
      >
        <div className="flex-1 px-5 py-5">
          <span
            className="st-mono mb-1.5 block text-[8.5px] font-semibold"
            style={{ color: accent, letterSpacing: "0.34em" }}
          >
            {translations.book}
          </span>
          <span className="st-display block text-[1.6rem] text-white">
            {translations.bookingCta}
          </span>
          <span className="mt-1.5 block text-[11.5px] text-white/65">
            {translations.bookingHint}
          </span>
        </div>
        <div
          className="flex w-14 shrink-0 items-center justify-center transition-transform group-hover:translate-x-0.5"
          style={{ background: `${accent}26` }}
        >
          <ArrowUpRight
            size={20}
            strokeWidth={1.8}
            style={{ color: accent }}
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
  locale: "de" | "en" | "tr" | "es" | "it" | "fr" | "ar";
  primary: string;
  accent: string;
}) {
  return (
    <section className="px-6 py-2">
      <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={accent} locale={locale} />
      <ExchangeSlot slug={slug} primary={primary} locale={locale} />
    </section>
  );
}

// =============================================================================
// Footer — black band with copper signature.
// =============================================================================

function Footer({
  siteUrl,
  slug,
  impressumUrl,
  privacyUrl,
  accent,
  translations,
}: {
  siteUrl: string;
  slug: string;
  impressumUrl?: string;
  privacyUrl?: string;
  accent: string;
  translations: StCopy;
}) {
  return (
    <footer
      className="relative px-6 pb-7 pt-7 text-white/55"
      style={{ background: "#070707" }}
    >
      <div
        aria-hidden
        className="absolute inset-x-6 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accent}55 50%, transparent 100%)`,
        }}
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10.5px]">
        <FooterShare siteUrl={siteUrl} slug={slug} shareLabel={translations.shareLabel} />
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
            className="st-mono font-semibold transition-colors hover:text-white"
            style={{ color: accent, letterSpacing: "0.18em" }}
          >
            OpSolid
          </a>
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-white/8 pt-4">
        <MapPin size={11} strokeWidth={1.6} style={{ color: accent }} />
        <span className="st-mono text-[9.5px] text-white/40">
          {`opsolid.de/c/${slug}`}
        </span>
      </div>
    </footer>
  );
}

function FooterShare({ siteUrl, slug, shareLabel }: { siteUrl: string; slug: string; shareLabel: string }) {
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
      className="hover:text-white"
    >
      {shareLabel}
    </button>
  );
}

// =============================================================================
// Registry entry + sample data — exported so registry/sample wiring can pick
// these up by name. Orchestrator stitches them into registry.ts and
// card-template-samples.ts after all batches return.
// =============================================================================

export const studioEntry: TemplateRegistryEntry = {
  id: 6,
  key: "studio",
  name: "Studio",
  industry: "DJ / music producer / electronic artist",
  Component: Studio,
  supports: {
    services: true,
    faqs: false,
    testimonials: true, // repurposed as residencies
    gallery: false,
    video: false,
    brochure: false,
    socials: true,
    themeSwitch: false,
    photo: false,
    logo: true,
  },
  defaults: {
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "sample-studio",
  nameRules: { transform: "uppercase", maxDisplayLength: 24 },
};

export const studioSample: SampleData = {
  templateId: 6,
  slug: "sample-studio",
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
  cardData: {
    name: "AION",
    title: "DJ & Producer",
    position: "Resident · Innervisions",
    company: "Innervisions Records",
    email: "booking@aion-music.com",
    phone: "+49 30 8830 4422",
    whatsapp: "+49 173 9982 4421",
    website: "https://aion-music.com",
    address: "Karl-Marx-Allee 73, 10243 Berlin",
    bio: "Berlin-based DJ and producer working at the seam between deep house, organic techno and ambient minimalism. Released on Innervisions, Permanent Vacation and Afterlife since 2019. Resident at Watergate, frequent guest at Berghain Säule and Robert Johnson, Frankfurt.",
    bookingUrl: "https://cal.com/aion/booking",
    sectorKey: "creator",
    services: [
      {
        title: "Vega — EP",
        description:
          "Four-track release on Innervisions, March 2026. 122 BPM, deep house. Vinyl + digital.",
        priceLabel: "INV-2026 · 122 BPM",
      },
      {
        title: "Halcyon Drift",
        description:
          "Permanent Vacation, October 2025. Organic techno collaboration with Roman Flügel. 124 BPM.",
        priceLabel: "PV-178 · 124 BPM",
      },
      {
        title: "Northern Lines",
        description:
          "Solo full-length on Afterlife, July 2025. 9 tracks, recorded at Riverside Studios Berlin.",
        priceLabel: "AL-LP14 · ALBUM",
      },
      {
        title: "Tideway",
        description:
          "Single + remix package, Maeve, March 2025. Original at 121 BPM, remix by Dixon.",
        priceLabel: "MAEVE-094 · 121 BPM",
      },
    ],
    testimonials: [
      {
        author: "Watergate",
        role: "Berlin · 2024-2026",
        quote: "Resident every second Friday, main floor.",
      },
      {
        author: "Robert Johnson",
        role: "Frankfurt · 2025-",
        quote: "Quarterly extended set, Saturday late slot.",
      },
      {
        author: "Hör Berlin",
        role: "Recurring",
        quote: "Streamed sets every six weeks since November 2024.",
      },
    ],
    customButtons: [
      {
        label: "Boiler Room — Berlin 2025",
        href: "https://boilerroom.tv/recording/aion-berlin",
        style: "secondary",
      },
      {
        label: "Cercle — Lac Léman",
        href: "https://cercle.io/aion",
        style: "secondary",
      },
      {
        label: "Resident Advisor RA.964",
        href: "https://ra.co/podcast/964",
        style: "secondary",
      },
      {
        label: "Hör Berlin — March set",
        href: "https://hor.berlin/aion-march-2026",
        style: "secondary",
      },
    ],
    socials: {
      instagram: "https://instagram.com/aion.berlin",
      youtube: "https://youtube.com/@aionmusic",
      x: "https://x.com/aion_music",
    },
    impressumUrl: "https://aion-music.com/imprint",
    privacyUrl: "https://aion-music.com/privacy",
  },
};
