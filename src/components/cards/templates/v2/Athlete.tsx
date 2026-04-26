"use client";

// =============================================================================
// Athlete — v2 template (id=10, key="athlete").
//
// Design DNA: Projekt_4k/showcase/kart_10_fitness.html — bold athletic coach,
// full-bleed darkened hero (380px), electric-lime accent on near-black panels,
// Outfit display + Inter body. Re-implemented natively in React + Tailwind.
//
// Locked design choices (do not parameterise):
//   - Full-bleed darkened hero ~380 px with the athlete photo desaturated and
//     scaled 1.05; falls back to a textured #0a0a0a → primary gradient.
//   - Logo embedded in hero overlay top-left, 36×36 square with subtle 1.5px
//     lime stroke. Initials fallback uses lime mono on dark.
//   - Section rhythm:
//       Hero (eyebrow + display name in Outfit 800/900 + tagline) →
//       Stats strip (3-up badges) → Quick CTAs → Programs (services, lime
//       hover) → About → Video reel → Testimonials → Contact rows →
//       CTA (Wallet/Exchange/SendMyInfo) → Social → Footer.
//   - Typography: Outfit (display, 700/800/900) + Inter (body, 400/500),
//     scoped via `.ath-card`.
//   - Hover states feel kinetic: 2px translate-y on cards, lime glow.
//
// Variable per card: cardData, photoPath, logoPath, brandPrimaryHex (overrides
// near-black), brandAccentHex (overrides electric-lime).
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { Outfit, Inter } from "next/font/google";
import {
  ArrowUpRight,
  Award,
  Calendar,
  CheckCircle2,
  Dumbbell,
  Mail,
  MessageCircle,
  Phone,
  PlayCircle,
  Quote,
  Shield,
  Trophy,
  UserPlus,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { encodeSource, describeSource } from "@/components/cards/smart/SmartCardSource";
import { getSectorPreset } from "@/config/card-sectors";
import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { TemplateProps } from "./types";

// -----------------------------------------------------------------------------
// Per-template fonts. Scoped via `.ath-card` so global typography stays clean.
// -----------------------------------------------------------------------------
const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-athlete-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-athlete-body",
  display: "swap",
});

// -----------------------------------------------------------------------------
// Locked palette. brandPrimaryHex / brandAccentHex override these per card.
// -----------------------------------------------------------------------------
const LOCKED_PRIMARY = "#0a0a0a"; // near-black
const LOCKED_ACCENT = "#a3e635"; // electric lime
const PANEL = "#111111";
const PANEL_ALT = "#1a1a1a";
const BORDER = "#2a2a2a";

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

function splitName(name: string): { first: string; last: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return {
    first: parts.slice(0, -1).join(" "),
    last: parts[parts.length - 1],
  };
}

interface AthCopy {
  saveContact: string;
  callNow: string;
  whatsapp: string;
  email: string;
  book: string;
  programs: string;
  programsEyebrow: string;
  about: string;
  aboutEyebrow: string;
  reel: string;
  reelEyebrow: string;
  voices: string;
  voicesEyebrow: string;
  contact: string;
  contactEyebrow: string;
  social: string;
  socialEyebrow: string;
  walletLabel: string;
  startProgram: string;
  watch: string;
  impressum: string;
  privacy: string;
  poweredBy: string;
  certified: string;
  yearsExp: string;
  clients: string;
}

const COPY: Record<"de" | "en" | "tr", AthCopy> = {
  de: {
    saveContact: "Speichern",
    callNow: "Anrufen",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    book: "Termin",
    programs: "Programme",
    programsEyebrow: "Training",
    about: "Über mich",
    aboutEyebrow: "Coach",
    reel: "Trainings-Reel",
    reelEyebrow: "Motivation",
    voices: "Stimmen",
    voicesEyebrow: "Resultate",
    contact: "Kontakt",
    contactEyebrow: "Direkt",
    social: "Social",
    socialEyebrow: "Folge mir",
    walletLabel: "Auf Smartphone speichern",
    startProgram: "Starten",
    watch: "Abspielen",
    impressum: "Impressum",
    privacy: "Datenschutz",
    poweredBy: "Powered by",
    certified: "Zertifiziert",
    yearsExp: "Jahre",
    clients: "Klienten",
  },
  en: {
    saveContact: "Save contact",
    callNow: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    book: "Book",
    programs: "Programs",
    programsEyebrow: "Training",
    about: "About",
    aboutEyebrow: "Coach",
    reel: "Training Reel",
    reelEyebrow: "Motion",
    voices: "Voices",
    voicesEyebrow: "Results",
    contact: "Contact",
    contactEyebrow: "Direct",
    social: "Social",
    socialEyebrow: "Follow",
    walletLabel: "Add to wallet",
    startProgram: "Start",
    watch: "Play",
    impressum: "Imprint",
    privacy: "Privacy",
    poweredBy: "Powered by",
    certified: "Certified",
    yearsExp: "yrs",
    clients: "clients",
  },
  tr: {
    saveContact: "Kaydet",
    callNow: "Ara",
    whatsapp: "WhatsApp",
    email: "E-posta",
    book: "Randevu",
    programs: "Programlar",
    programsEyebrow: "Antrenman",
    about: "Hakkımda",
    aboutEyebrow: "Koç",
    reel: "Antrenman Görüntüleri",
    reelEyebrow: "Motivasyon",
    voices: "Sesler",
    voicesEyebrow: "Sonuçlar",
    contact: "İletişim",
    contactEyebrow: "Direkt",
    social: "Sosyal",
    socialEyebrow: "Takip et",
    walletLabel: "Cüzdana ekle",
    startProgram: "Başla",
    watch: "Oynat",
    impressum: "Künye",
    privacy: "Gizlilik",
    poweredBy: "Powered by",
    certified: "Sertifikalı",
    yearsExp: "yıl",
    clients: "öğrenci",
  },
};

export function Athlete({
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
  const { first, last } = splitName(cardData.name);

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

  const titleStrip = [cardData.position, cardData.title, cardData.company]
    .filter((s): s is string => Boolean(s))
    .join(" · ");

  // Stats — derived from sector preset + bio fallback. Templates render up to 3.
  const stats = buildStats(cardData, t);

  return (
    <article
      data-template="athlete"
      className={`${outfit.variable} ${inter.variable} ath-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] text-[#d4d4d4] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.55),0_8px_22px_-12px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.04]`}
      style={
        {
          background: PANEL,
          ["--ath-primary" as string]: primary,
          ["--ath-accent" as string]: accent,
          ["--ath-accent-soft" as string]: `${accent}1A`,
          ["--ath-accent-rim" as string]: `${accent}33`,
          ["--ath-panel" as string]: PANEL,
          ["--ath-panel-alt" as string]: PANEL_ALT,
          ["--ath-border" as string]: BORDER,
          fontFamily: "var(--font-athlete-body), system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .ath-card {
          font-family: var(--font-athlete-body), "Inter", system-ui, sans-serif;
          line-height: 1.55;
          color: #d4d4d4;
        }
        .ath-card .ath-display {
          font-family: var(--font-athlete-display), "Outfit", system-ui, sans-serif;
          letter-spacing: -0.02em;
        }
        .ath-card .ath-mono {
          font-family: var(--font-athlete-display), "Outfit", system-ui, sans-serif;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
      `}</style>

      <Hero
        photoUrl={photoUrl}
        logoUrl={logoUrl}
        initials={initials}
        first={first}
        last={last}
        titleStrip={titleStrip}
        primary={primary}
        accent={accent}
        sectorBadge={sector?.name}
        sourceLabel={sourceLabel}
        coachLabel={cardData.position || cardData.title || (locale === "en" ? "Coach" : locale === "tr" ? "Antrenör" : "Coach")}
      />

      {stats.length > 0 && <StatsStrip stats={stats} accent={accent} />}

      <QuickActions
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
        <Programs
          items={services.slice(0, 4)}
          accent={accent}
          translations={t}
          waDigits={waDigits}
        />
      )}

      {cardData.bio && (
        <AboutSection bio={cardData.bio} accent={accent} translations={t} />
      )}

      {cardData.videoUrl && (
        <ReelSection url={cardData.videoUrl} accent={accent} translations={t} />
      )}

      {cardData.testimonials && cardData.testimonials.length > 0 && (
        <Testimonials
          items={cardData.testimonials}
          accent={accent}
          translations={t}
        />
      )}

      <ContactSection
        cardData={cardData}
        locale={locale}
        accent={accent}
        translations={t}
      />

      <CTASection slug={slug} sourceQs={sourceQs} locale={locale} accent={accent} />

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="border-t border-[var(--ath-border)] px-6 py-5"
          labelClassName="ath-mono mb-3 text-[10px] font-semibold text-[#737373]"
        >
          {walletSlot}
        </WalletDock>
      )}

      {cardData.socials && (
        <SocialSection socials={cardData.socials} accent={accent} translations={t} />
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
// HERO — full-bleed darkened photo, lime-stroke logo top-left, big athletic
// name (Outfit 900) + last name in lime accent. Tagline below.
// =============================================================================

function Hero({
  photoUrl,
  logoUrl,
  initials,
  first,
  last,
  titleStrip,
  primary,
  accent,
  sectorBadge,
  sourceLabel,
  coachLabel,
}: {
  photoUrl: string | null;
  logoUrl: string | null;
  initials: string;
  first: string;
  last: string;
  titleStrip: string;
  primary: string;
  accent: string;
  sectorBadge?: string;
  sourceLabel?: string;
  coachLabel: string;
}) {
  return (
    <header className="relative h-[380px] w-full overflow-hidden">
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt=""
          fill
          priority
          unoptimized
          sizes="(max-width: 460px) 100vw, 460px"
          className="object-cover"
          style={{
            filter: "saturate(0.78) contrast(1.08) brightness(0.55)",
            transform: "scale(1.05)",
          }}
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 100% at 18% 12%, ${accent}1F, transparent 55%), linear-gradient(165deg, ${primary} 0%, #050505 100%)`,
          }}
        />
      )}

      {/* Lime-tinted vignette overlay */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${primary}F2 0%, ${primary}A6 38%, ${primary}26 70%, transparent 100%)`,
        }}
      />

      {/* Subtle film-grain */}
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-overlay opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.20) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      {/* Lime hairline at the bottom edge — kinetic signature */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-20 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent} 25%, ${accent} 75%, transparent)`,
          boxShadow: `0 0 14px ${accent}80`,
        }}
      />

      {/* Logo + sector pill */}
      <div className="absolute left-5 top-5 z-10 flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[10px]"
          style={{
            background: logoUrl ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.65)",
            boxShadow: `inset 0 0 0 1.5px ${accent}, 0 6px 18px -8px rgba(0,0,0,0.6)`,
            backdropFilter: "blur(6px)",
          }}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              width={64}
              height={64}
              className="h-7 w-7 object-contain"
              unoptimized
            />
          ) : (
            <span
              className="ath-display text-[13px] font-extrabold tracking-tight"
              style={{ color: accent }}
            >
              {initials}
            </span>
          )}
        </div>
      </div>

      <div className="absolute right-5 top-5 z-10 flex flex-col items-end gap-1.5">
        {sectorBadge && (
          <span
            className="ath-mono rounded-full px-2.5 py-1 text-[9px] font-bold backdrop-blur-md"
            style={{
              background: "rgba(0,0,0,0.45)",
              color: accent,
              boxShadow: `inset 0 0 0 1px ${accent}33`,
            }}
          >
            {sectorBadge}
          </span>
        )}
        {sourceLabel && (
          <span
            className="ath-mono rounded-full bg-black/55 px-2.5 py-1 text-[9px] font-semibold text-white/85 backdrop-blur-md ring-1 ring-white/10"
          >
            {sourceLabel}
          </span>
        )}
      </div>

      {/* Hero text */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-8 pt-10">
        <span
          className="ath-mono mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9.5px] font-bold"
          style={{
            background: `${accent}14`,
            color: accent,
            boxShadow: `inset 0 0 0 1px ${accent}40`,
          }}
        >
          <Zap size={10} strokeWidth={2.6} />
          {coachLabel}
        </span>

        <h1 className="ath-display text-white">
          <span
            className="block text-[40px] font-extrabold uppercase leading-[0.95]"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.45)" }}
          >
            {first || ""}
          </span>
          {last && (
            <span
              className="block text-[40px] font-black uppercase leading-[0.95]"
              style={{
                color: accent,
                textShadow: `0 2px 18px ${accent}40`,
              }}
            >
              {last}
            </span>
          )}
        </h1>

        {titleStrip && (
          <p className="mt-3 max-w-[85%] text-[13px] font-medium leading-snug text-white/75">
            {titleStrip}
          </p>
        )}
      </div>
    </header>
  );
}

// =============================================================================
// Stats strip — 3-up numeric badges. Lime-on-dark contrast.
// =============================================================================

function buildStats(
  cardData: TemplateProps["cardData"],
  t: AthCopy,
): Array<{ value: string; label: string; Icon: LucideIcon }> {
  // Heuristic: pull plausible "stats" from existing fields. Order form doesn't
  // have a structured stats schema — we render 3 derived stats so the strip is
  // never empty. Customers populate via bio / position / company.
  const stats: Array<{ value: string; label: string; Icon: LucideIcon }> = [];
  // Years experience — heuristic: scan bio for "X years"/"X yrs"/"X yıl"/"X Jahre"
  const bio = cardData.bio ?? "";
  const yearMatch = bio.match(/(\d{1,2})\s*(?:years|yrs|yıl|Jahre)/i);
  if (yearMatch) {
    stats.push({
      value: yearMatch[1],
      label: t.yearsExp,
      Icon: Award,
    });
  }
  // Clients — scan for "X clients"/"X öğrenci"/"X Klienten"
  const clientMatch = bio.match(/(\d+\+?)\s*(?:clients|öğrenci|Klienten|Kunden)/i);
  if (clientMatch) {
    stats.push({
      value: clientMatch[1],
      label: t.clients,
      Icon: Users,
    });
  }
  // Certified — if bio mentions a known cert keyword
  const certMatch = bio.match(/\b(NASM|ACE|NSCA[- ]?CSCS|ISSA|EuropeActive|ACSM)\b/i);
  if (certMatch) {
    stats.push({
      value: certMatch[1].toUpperCase(),
      label: t.certified,
      Icon: Trophy,
    });
  }
  return stats.slice(0, 3);
}

function StatsStrip({
  stats,
  accent,
}: {
  stats: Array<{ value: string; label: string; Icon: LucideIcon }>;
  accent: string;
}) {
  return (
    <div className="relative px-6 pt-6">
      <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {stats.map((s, i) => (
          <div
            key={`${s.label}-${i}`}
            className="flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] font-semibold"
            style={{
              background: PANEL_ALT,
              borderColor: BORDER,
              color: "#d4d4d4",
            }}
          >
            <s.Icon size={13} strokeWidth={2.2} style={{ color: accent }} />
            <span className="ath-display font-extrabold" style={{ color: accent }}>
              {s.value}
            </span>
            <span className="text-[#a3a3a3]">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Quick action pills — Save / Call / WhatsApp / Email / Book.
// Lime primary; dark panels for the rest.
// =============================================================================

function QuickActions({
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
  translations: AthCopy;
}) {
  type Pill = {
    label: string;
    href: string;
    Icon: LucideIcon;
    tone: "lime" | "wa" | "panel";
    download?: boolean;
    external?: boolean;
  };

  const pills: Pill[] = [
    {
      label: translations.saveContact,
      href: `/api/cards/${encodeURIComponent(slug)}/vcard${sourceQs}`,
      Icon: UserPlus,
      tone: "lime",
      download: true,
    },
  ];
  if (waDigits) {
    pills.push({
      label: translations.whatsapp,
      href: `https://wa.me/${waDigits}`,
      Icon: MessageCircle,
      tone: "wa",
      external: true,
    });
  }
  if (phoneDigits) {
    pills.push({
      label: translations.callNow,
      href: `tel:${phoneDigits}`,
      Icon: Phone,
      tone: "panel",
    });
  }
  if (email) {
    pills.push({
      label: translations.email,
      href: `mailto:${email}`,
      Icon: Mail,
      tone: "panel",
    });
  }
  if (bookingUrl) {
    pills.push({
      label: translations.book,
      href: bookingUrl,
      Icon: Calendar,
      tone: "panel",
      external: true,
    });
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 px-6 pb-2 pt-5">
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
            className="ath-display group flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-[13px] font-bold transition-all hover:-translate-y-0.5 active:translate-y-0"
            style={
              p.tone === "lime"
                ? {
                    background: accent,
                    color: "#0a0a0a",
                    boxShadow: `0 8px 22px -8px ${accent}80, inset 0 1px 0 rgba(255,255,255,0.25)`,
                  }
                : p.tone === "wa"
                  ? {
                      background: "#25D366",
                      color: "#fff",
                      boxShadow:
                        "0 8px 22px -8px rgba(37,211,102,0.55), inset 0 1px 0 rgba(255,255,255,0.20)",
                    }
                  : {
                      background: PANEL_ALT,
                      color: "#e5e5e5",
                      boxShadow: `inset 0 0 0 1px ${BORDER}`,
                    }
            }
          >
            <p.Icon size={14} strokeWidth={2.6} />
            <span className="leading-none">{p.label}</span>
          </a>
        );
      })}
    </div>
  );
}

// =============================================================================
// Section frame — eyebrow label + display heading. Lime accent dot.
// =============================================================================

function SectionFrame({
  eyebrow,
  heading,
  accent,
  children,
  pad = "px-6 py-7",
}: {
  eyebrow: string;
  heading: string;
  accent: string;
  children: React.ReactNode;
  pad?: string;
}) {
  return (
    <section className={`relative ${pad}`}>
      <div className="mb-5 flex items-center gap-2.5">
        <span
          aria-hidden
          className="block h-1.5 w-1.5 rounded-full"
          style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
        />
        <span
          className="ath-mono text-[10px] font-bold"
          style={{ color: accent }}
        >
          {eyebrow}
        </span>
      </div>
      <h2 className="ath-display mb-5 text-[24px] font-extrabold leading-tight text-white">
        {heading}
      </h2>
      {children}
    </section>
  );
}

// =============================================================================
// Programs — services rendered as program cards: name + features + price.
// =============================================================================

function Programs({
  items,
  accent,
  translations,
  waDigits,
}: {
  items: Array<{ title: string; description?: string; priceLabel?: string }>;
  accent: string;
  translations: AthCopy;
  waDigits: string;
}) {
  return (
    <SectionFrame
      eyebrow={translations.programsEyebrow}
      heading={translations.programs}
      accent={accent}
    >
      <div className="flex flex-col gap-3.5">
        {items.map((item, i) => (
          <article
            key={`${item.title}-${i}`}
            className="group overflow-hidden rounded-2xl border transition-all hover:-translate-y-0.5"
            style={{
              background: PANEL_ALT,
              borderColor: BORDER,
            }}
          >
            <div
              aria-hidden
              className="h-[3px] w-full"
              style={{
                background: `linear-gradient(90deg, ${accent}, ${accent}40)`,
              }}
            />
            <div className="p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{
                    background: `${accent}14`,
                    color: accent,
                    boxShadow: `inset 0 0 0 1px ${accent}33`,
                  }}
                >
                  <Dumbbell size={15} strokeWidth={2.4} />
                </span>
                <h3 className="ath-display text-[17px] font-bold leading-tight text-white">
                  {item.title}
                </h3>
              </div>
              {item.description && (
                <p className="mb-4 text-[13px] leading-relaxed text-[#a3a3a3]">
                  {item.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                {item.priceLabel ? (
                  <div
                    className="ath-display text-[20px] font-extrabold leading-none text-white"
                  >
                    {item.priceLabel}
                  </div>
                ) : (
                  <div />
                )}
                <a
                  href={
                    waDigits
                      ? `https://wa.me/${waDigits}?text=${encodeURIComponent(
                          `Hi — ${item.title}?`,
                        )}`
                      : "#"
                  }
                  target={waDigits ? "_blank" : undefined}
                  rel={waDigits ? "noopener noreferrer" : undefined}
                  className="ath-display inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-bold transition-all hover:-translate-y-px"
                  style={{
                    background: accent,
                    color: "#0a0a0a",
                    boxShadow: `0 6px 16px -6px ${accent}80`,
                  }}
                >
                  {translations.startProgram}
                  <ArrowUpRight size={12} strokeWidth={2.6} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}

// =============================================================================
// About — single-paragraph bio. Lime check-rule above.
// =============================================================================

function AboutSection({
  bio,
  accent,
  translations,
}: {
  bio: string;
  accent: string;
  translations: AthCopy;
}) {
  return (
    <SectionFrame
      eyebrow={translations.aboutEyebrow}
      heading={translations.about}
      accent={accent}
    >
      <div className="flex items-start gap-3 rounded-2xl border p-5"
        style={{ background: PANEL_ALT, borderColor: BORDER }}
      >
        <CheckCircle2
          size={16}
          strokeWidth={2.2}
          className="mt-0.5 shrink-0"
          style={{ color: accent }}
        />
        <p className="text-[13.5px] leading-[1.7] text-[#bbb]">{bio}</p>
      </div>
    </SectionFrame>
  );
}

// =============================================================================
// Reel — embedded training video.
// =============================================================================

function ReelSection({
  url,
  accent,
  translations,
}: {
  url: string;
  accent: string;
  translations: AthCopy;
}) {
  const embed = toEmbedUrl(url);
  return (
    <SectionFrame
      eyebrow={translations.reelEyebrow}
      heading={translations.reel}
      accent={accent}
    >
      <div
        className="relative aspect-video w-full overflow-hidden rounded-2xl border"
        style={{ background: "#000", borderColor: BORDER }}
      >
        {embed ? (
          <iframe
            src={embed}
            title="Training reel"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            style={{ border: 0 }}
          />
        ) : (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full w-full items-center justify-center"
          >
            <PlayCircle
              size={56}
              strokeWidth={1.5}
              className="transition-transform group-hover:scale-110"
              style={{ color: accent }}
            />
          </a>
        )}
      </div>
    </SectionFrame>
  );
}

function toEmbedUrl(raw: string): string | null {
  try {
    const u = new URL(raw);
    const host = u.hostname.toLowerCase();
    if (host.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}?rel=0`;
      const m = u.pathname.match(/\/(?:embed|shorts)\/([\w-]+)/);
      if (m) return `https://www.youtube.com/embed/${m[1]}?rel=0`;
    }
    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "");
      if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
    }
    if (host.includes("vimeo.com")) {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return null;
  } catch {
    return null;
  }
}

// =============================================================================
// Testimonials — quote cards.
// =============================================================================

function Testimonials({
  items,
  accent,
  translations,
}: {
  items: Array<{ author: string; role?: string; quote: string }>;
  accent: string;
  translations: AthCopy;
}) {
  return (
    <SectionFrame
      eyebrow={translations.voicesEyebrow}
      heading={translations.voices}
      accent={accent}
    >
      <div className="grid gap-3">
        {items.slice(0, 3).map((item, i) => (
          <figure
            key={`${item.author}-${i}`}
            className="relative overflow-hidden rounded-2xl border p-5"
            style={{ background: PANEL_ALT, borderColor: BORDER }}
          >
            <Quote
              aria-hidden
              size={32}
              strokeWidth={1.6}
              className="absolute right-4 top-3 opacity-25"
              style={{ color: accent }}
            />
            <blockquote className="text-[13.5px] leading-snug text-[#d4d4d4]">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <figcaption className="ath-display mt-3 text-[12px] font-bold text-white">
              {item.author}
              {item.role && (
                <span className="ml-2 font-medium text-[#737373]">
                  · {item.role}
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
// Contact — using shared rows, dark variant via custom render.
// =============================================================================

function ContactSection({
  cardData,
  locale,
  accent,
  translations,
}: {
  cardData: TemplateProps["cardData"];
  locale: "de" | "en" | "tr";
  accent: string;
  translations: AthCopy;
}) {
  return (
    <SectionFrame
      eyebrow={translations.contactEyebrow}
      heading={translations.contact}
      accent={accent}
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
              className="group flex items-center gap-3.5 rounded-xl border px-4 py-3 transition-all hover:-translate-y-px"
              style={{
                background: PANEL_ALT,
                borderColor: BORDER,
              }}
            >
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: `${accent}14`,
                  color: accent,
                  boxShadow: `inset 0 0 0 1px ${accent}33`,
                }}
              >
                <row.Icon size={14} strokeWidth={2.2} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span
                  className="ath-mono text-[9.5px] font-bold"
                  style={{ color: "#737373" }}
                >
                  {row.label}
                </span>
                <span className="truncate text-[13px] font-medium text-white">
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
  accent,
}: {
  slug: string;
  sourceQs: string;
  locale: "de" | "en" | "tr";
  accent: string;
}) {
  return (
    <section className="px-6 pb-2 pt-1">
      <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={accent} />
      <ExchangeSlot slug={slug} primary={accent} locale={locale} />
    </section>
  );
}

// =============================================================================
// Social — tile variant, dark.
// =============================================================================

function SocialSection({
  socials,
  accent,
  translations,
}: {
  socials: NonNullable<TemplateProps["cardData"]["socials"]>;
  accent: string;
  translations: AthCopy;
}) {
  return (
    <SectionFrame
      eyebrow={translations.socialEyebrow}
      heading={translations.social}
      accent={accent}
    >
      <SocialRow
        socials={socials}
        variant="icon"
        accentHex={accent}
        className="flex flex-wrap gap-2.5"
        itemClassName="!border-0 !bg-[#1a1a1a] hover:!bg-[#222]"
      />
    </SectionFrame>
  );
}

// =============================================================================
// Footer — minimal dark band, lime hairline top.
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
  translations: AthCopy;
}) {
  return (
    <footer
      className="relative px-6 pb-7 pt-7"
      style={{ background: "#050505" }}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10.5px] text-[#737373]">
        <FooterShare siteUrl={siteUrl} slug={slug} />
        {impressumUrl && (
          <a
            href={impressumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            {translations.impressum}
          </a>
        )}
        {privacyUrl && (
          <a
            href={privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
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
            className="ath-display font-bold transition-colors hover:text-white"
            style={{ color: accent }}
          >
            OpSolid
          </a>
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
            // fall through
          }
        }
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        }
      }}
      className="transition-colors hover:text-white"
    >
      Share
    </button>
  );
}

// =============================================================================
// Registry entry + sample data.
// =============================================================================

import type { TemplateRegistryEntry, SampleData } from "./types";

export const athleteEntry: TemplateRegistryEntry = {
  id: 10,
  key: "athlete",
  name: "Athlete",
  industry: "Personal trainer / fitness coach / sports performance",
  Component: Athlete,
  supports: {
    services: true,
    faqs: true,
    testimonials: true,
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
  sampleSlug: "demo-athlete",
};

// source: Unsplash (license: https://unsplash.com/license) — free for commercial use.
const ATHLETE_SAMPLE_PHOTO =
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80";

export const athleteSample: SampleData = {
  templateId: 10,
  slug: "demo-athlete",
  photoUrl: ATHLETE_SAMPLE_PHOTO,
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
  cardData: {
    name: "Maren Forsberg",
    position: "Strength & Conditioning Coach",
    title: "S&C / Mobility / Sport-Specific",
    company: "Forge Stockholm",
    email: "maren@forgestockholm.se",
    phone: "+46 70 123 45 67",
    whatsapp: "+46 70 123 45 67",
    website: "https://forgestockholm.se",
    address: "Vasagatan 10, 111 20 Stockholm",
    bio: "I coach athletes and ambitious amateurs in strength, conditioning, and movement quality. 14 years experience, 320+ clients trained, NSCA-CSCS certified. First session is on the house — let's talk.",
    bookingUrl: "https://cal.com/marenforsberg/intro",
    videoUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    sectorKey: "fitness",
    socials: {
      instagram: "https://instagram.com/forgestockholm",
      youtube: "https://youtube.com/@forgestockholm",
      tiktok: "https://tiktok.com/@forgestockholm",
    },
    services: [
      {
        title: "1-on-1 coaching",
        description:
          "Bespoke strength + conditioning. 12-week blocks, weekly sessions in-studio, ongoing programming via app.",
        priceLabel: "from 1 850 SEK / mo",
      },
      {
        title: "Group strength",
        description:
          "Small-group barbell sessions, 4 per cohort. Tuesday + Thursday evenings, 60 minutes.",
        priceLabel: "from 950 SEK / mo",
      },
      {
        title: "Online programs",
        description:
          "Custom remote plans. Weekly check-ins, video reviews, full app access. Globally available.",
        priceLabel: "from 690 SEK / mo",
      },
      {
        title: "Sport-specific blocks",
        description:
          "Targeted prep for skiing, climbing, running, or contact sports. 6–10 week off-season cycles.",
        priceLabel: "Custom",
      },
    ],
    testimonials: [
      {
        author: "Anders V.",
        role: "Skier, +14 kg lean",
        quote:
          "Maren rebuilt my off-season. Strongest I've ever felt going into a comp block.",
      },
      {
        author: "Lina P.",
        role: "Marathon, sub-3:15",
        quote:
          "First time I've done strength work that actually carried over to running. No injuries this season.",
      },
    ],
    impressumUrl: "https://forgestockholm.se/impressum",
    privacyUrl: "https://forgestockholm.se/privacy",
  },
};
