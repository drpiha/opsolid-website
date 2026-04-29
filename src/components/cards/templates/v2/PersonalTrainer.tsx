"use client";

// =============================================================================
// PersonalTrainer — v2 template (id=19, key="personal-trainer").
//
// Sector: personal trainer / coaching / fitness performance. Mood: bold,
// motivating, high-energy, dramatic. Sister to Athlete (id=10) but louder —
// where Athlete is editorial sport, this is locker-room aggression with a
// premium finish: dark canvas, brand-color radial glow, all-caps Bebas Neue
// display, dramatic stat slabs and a single screaming "BOOK SESSION" CTA.
//
// Locked design DNA (do not parameterise):
//   - Pure-black canvas with a corner-anchored brand-color glow (radial).
//   - Hero: 360 px crop with darkened photo, all-caps BebasNeue name in
//     huge weight, accent-color last-name underline. Tagline strip:
//     "GOALS · STRENGTH · DISCIPLINE" (localised) sits beneath in mono.
//   - Transformation stats slab — 3-up tiles (Years / Clients / Specialty),
//     derived from bio + position. Big accent numerals, mono labels.
//   - Single dominant accent CTA: "BOOK SESSION" rendered as a brand-accent
//     fill button at full width (44 px tall, sharp corners 12 px). Tactile.
//   - Programs as "TRAINING TIERS" — numbered 01 / 02 / 03 with accent
//     hairline + pricing pill.
//   - Color responsiveness: every accent, header, button background reads
//     from `brandPrimaryHex` (power red) and `brandAccentHex` (energy yellow).
//     `readableTextOn(...)` decides ink/cream text per fill.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Award,
  CheckCircle2,
  Dumbbell,
  Flame,
  Mail,
  MessageCircle,
  Phone,
  Quote,
  Shield,
  Target,
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
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

// -----------------------------------------------------------------------------
// Locked palette — power red + energy yellow on near-black. brandPrimaryHex /
// brandAccentHex override per card.
// -----------------------------------------------------------------------------
const LOCKED_PRIMARY = "#dc2626"; // power red
const LOCKED_ACCENT = "#fbbf24"; // energy yellow
const CANVAS = "#0a0a0a";
const PANEL = "#141414";
const PANEL_ALT = "#1c1c1c";
const BORDER = "#2a2a2a";
const INK_DIM = "#a3a3a3";
const INK_MID = "#d4d4d4";

// -----------------------------------------------------------------------------
// Contrast helper — required: text on colored backgrounds picks ink or cream.
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

function splitName(name: string): { first: string; last: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return {
    first: parts.slice(0, -1).join(" "),
    last: parts[parts.length - 1],
  };
}

interface PtCopy {
  bookSession: string;
  saveContact: string;
  whatsapp: string;
  call: string;
  email: string;
  tagline: string; // GOALS · STRENGTH · DISCIPLINE
  trainingTiers: string;
  trainingTiersEyebrow: string;
  philosophy: string;
  philosophyEyebrow: string;
  results: string;
  resultsEyebrow: string;
  contact: string;
  contactEyebrow: string;
  social: string;
  socialEyebrow: string;
  walletLabel: string;
  yearsExp: string;
  clients: string;
  specialty: string;
  certified: string;
  start: string;
  watchReel: string;
  impressum: string;
  privacy: string;
  poweredBy: string;
  trainHard: string;
}

const COPY: Record<"de" | "en" | "tr", PtCopy> = {
  de: {
    bookSession: "TERMIN BUCHEN",
    saveContact: "Kontakt speichern",
    whatsapp: "WhatsApp",
    call: "Anrufen",
    email: "E-Mail",
    tagline: "ZIELE · KRAFT · DISZIPLIN",
    trainingTiers: "Trainings-Pakete",
    trainingTiersEyebrow: "Pakete",
    philosophy: "Philosophie",
    philosophyEyebrow: "Coach",
    results: "Resultate",
    resultsEyebrow: "Stimmen",
    contact: "Kontakt",
    contactEyebrow: "Direkt",
    social: "Social",
    socialEyebrow: "Folge mir",
    walletLabel: "Auf Smartphone speichern",
    yearsExp: "Jahre",
    clients: "Klienten",
    specialty: "Fokus",
    certified: "Zertifiziert",
    start: "Starten",
    watchReel: "Reel",
    impressum: "Impressum",
    privacy: "Datenschutz",
    poweredBy: "Powered by",
    trainHard: "TRAIN HARD · STAY HUMBLE",
  },
  en: {
    bookSession: "BOOK SESSION",
    saveContact: "Save contact",
    whatsapp: "WhatsApp",
    call: "Call",
    email: "Email",
    tagline: "GOALS · STRENGTH · DISCIPLINE",
    trainingTiers: "Training Tiers",
    trainingTiersEyebrow: "Tiers",
    philosophy: "Philosophy",
    philosophyEyebrow: "Coach",
    results: "Results",
    resultsEyebrow: "Voices",
    contact: "Contact",
    contactEyebrow: "Direct",
    social: "Social",
    socialEyebrow: "Follow",
    walletLabel: "Add to wallet",
    yearsExp: "Years",
    clients: "Clients",
    specialty: "Focus",
    certified: "Certified",
    start: "Start",
    watchReel: "Reel",
    impressum: "Imprint",
    privacy: "Privacy",
    poweredBy: "Powered by",
    trainHard: "TRAIN HARD · STAY HUMBLE",
  },
  tr: {
    bookSession: "SEANS AL",
    saveContact: "Kişiye ekle",
    whatsapp: "WhatsApp",
    call: "Ara",
    email: "E-posta",
    tagline: "HEDEF · GÜÇ · DİSİPLİN",
    trainingTiers: "Antrenman Paketleri",
    trainingTiersEyebrow: "Paketler",
    philosophy: "Felsefe",
    philosophyEyebrow: "Koç",
    results: "Sonuçlar",
    resultsEyebrow: "Yorumlar",
    contact: "İletişim",
    contactEyebrow: "Direkt",
    social: "Sosyal",
    socialEyebrow: "Takip et",
    walletLabel: "Cüzdana ekle",
    yearsExp: "Yıl",
    clients: "Öğrenci",
    specialty: "Uzmanlık",
    certified: "Sertifika",
    start: "Başla",
    watchReel: "İzle",
    impressum: "Künye",
    privacy: "Gizlilik",
    poweredBy: "Powered by",
    trainHard: "ÇOK ÇALIŞ · MÜTEVAZI KAL",
  },
};

export function PersonalTrainer({
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
  const { first, last } = splitName(cardData.name);

  const tiers =
    cardData.services && cardData.services.length > 0
      ? cardData.services
      : sector?.services;

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const stats = buildStats(cardData, t);

  return (
    <article
      data-template="personal-trainer"
      className={`pt-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] text-[${INK_MID}] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.65),0_8px_22px_-12px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.04]`}
      style={
        {
          background: CANVAS,
          ["--pt-primary" as string]: primary,
          ["--pt-accent" as string]: accent,
          ["--pt-on-primary" as string]: onPrimary,
          ["--pt-on-accent" as string]: onAccent,
          ["--pt-primary-soft" as string]: `${primary}1F`,
          ["--pt-accent-soft" as string]: `${accent}1F`,
          ["--pt-primary-rim" as string]: `${primary}55`,
          ["--pt-accent-rim" as string]: `${accent}55`,
          ["--pt-panel" as string]: PANEL,
          ["--pt-panel-alt" as string]: PANEL_ALT,
          ["--pt-border" as string]: BORDER,
          ["--card-primary" as string]: primary,
          ["--card-accent" as string]: accent,
          ["--font-pt-display" as string]: "'Bebas Neue', Impact, sans-serif",
          ["--font-pt-body" as string]: "'Inter', system-ui, sans-serif",
          fontFamily: "var(--font-pt-body), system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .pt-card {
          font-family:var(--tpl-font-body,  var(--font-pt-body), "Inter", system-ui, sans-serif);
          line-height: 1.55;
          color: ${INK_MID};
        }
        .pt-card .pt-display {
          font-family: var(--font-pt-display), "Bebas Neue", "Oswald", Impact,
            sans-serif;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          font-weight: 400;
        }
        .pt-card .pt-mono {
          font-family:var(--tpl-font-body,  var(--font-pt-body), "Inter", system-ui, sans-serif);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-feature-settings: "tnum";
          font-weight: 700;
        }
      `}</style>

      <Hero
        photoUrl={photoUrl}
        logoUrl={logoUrl}
        initials={initials}
        first={first}
        last={last}
        company={cardData.company}
        primary={primary}
        accent={accent}
        onAccent={onAccent}
        sectorBadge={sector?.name}
        sourceLabel={sourceLabel}
        translations={t}
      />

      <TaglineStrip translations={t} accent={accent} />

      {stats.length > 0 && <StatsSlab stats={stats} accent={accent} onAccent={onAccent} />}

      <BookSessionCTA
        bookingUrl={cardData.bookingUrl}
        accent={accent}
        onAccent={onAccent}
        label={t.bookSession}
      />

      <QuickActions
        slug={slug}
        sourceQs={sourceQs}
        phoneDigits={phoneDigits}
        waDigits={waDigits}
        email={cardData.email}
        primary={primary}
        onPrimary={onPrimary}
        onAccent={onAccent}
        translations={t}
      />

      {tiers && tiers.length > 0 && (
        <TrainingTiers
          items={tiers.slice(0, 4)}
          primary={primary}
          accent={accent}
          onAccent={onAccent}
          translations={t}
          waDigits={waDigits}
        />
      )}

      {cardData.bio && (
        <PhilosophySection bio={cardData.bio} accent={accent} translations={t} />
      )}

      {cardData.testimonials && cardData.testimonials.length > 0 && (
        <ResultsSection items={cardData.testimonials} accent={accent} primary={primary} translations={t} />
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
          className="border-t border-[var(--pt-border)] px-7 py-5"
          labelClassName="pt-mono mb-3 text-[10px] font-bold text-center"
        >
          <div style={{ ["--card-primary" as string]: accent }}>{walletSlot}</div>
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
        primary={primary}
        accent={accent}
        translations={t}
      />
    </article>
  );
}

// =============================================================================
// HERO — full-bleed darkened photo with brand-color radial glow. Big BebasNeue
// name; last name underlined in accent. Logo + sector badge in top corners.
// =============================================================================

function Hero({
  photoUrl,
  logoUrl,
  initials,
  first,
  last,
  company,
  primary,
  accent,
  onAccent,
  sectorBadge,
  sourceLabel,
  translations,
}: {
  photoUrl: string | null;
  logoUrl: string | null;
  initials: string;
  first: string;
  last: string;
  company?: string;
  primary: string;
  accent: string;
  onAccent: string;
  sectorBadge?: string;
  sourceLabel?: string;
  translations: PtCopy;
}) {
  void translations;
  return (
    <header className="relative h-[360px] w-full overflow-hidden">
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt=""
          fill
          priority
          unoptimized
          sizes="(max-width: 460px) 100vw, 460px"
          className="object-cover tpl-photo"
          style={{
            filter: "saturate(1.05) contrast(1.12) brightness(0.45)",
            transform: "scale(1.05)",
          }}
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 100% at 80% 12%, ${primary}3F, transparent 55%), linear-gradient(165deg, ${CANVAS} 0%, #050505 100%)`,
          }}
        />
      )}

      {/* Brand-color corner glow — the signature flourish */}
      <div
        aria-hidden
        className="absolute -right-10 -top-10 h-72 w-72"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${primary}66 0%, ${primary}1A 35%, transparent 70%)`,
          filter: "blur(8px)",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-16 -left-16 h-72 w-72"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${accent}33 0%, transparent 60%)`,
          filter: "blur(10px)",
        }}
      />

      {/* Bottom-up vignette so name is always legible */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${CANVAS}F2 0%, ${CANVAS}99 35%, ${CANVAS}26 70%, transparent 100%)`,
        }}
      />

      {/* Heavy accent rule at the bottom edge — impactful */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-20 h-[3px]"
        style={{
          background: accent,
          boxShadow: `0 0 20px ${accent}99`,
        }}
      />

      {/* Logo + initials */}
      <div className="absolute left-5 top-5 z-10 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[8px]"
          style={{
            background: "rgba(0,0,0,0.65)",
            boxShadow: `inset 0 0 0 2px ${accent}`,
            backdropFilter: "blur(6px)",
          }}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              width={64}
              height={64}
              className="h-7 w-7 object-contain tpl-logo"
              unoptimized
            />
          ) : (
            <span
              className="pt-display text-[16px] leading-none"
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
            className="pt-mono rounded-sm px-2.5 py-1 text-[9px] backdrop-blur-md"
            style={{
              background: accent,
              color: onAccent,
              boxShadow: `0 4px 12px -4px ${accent}99`,
            }}
          >
            {sectorBadge}
          </span>
        )}
        {sourceLabel && (
          <span className="pt-mono rounded-sm bg-black/55 px-2.5 py-1 text-[9px] text-white/85 backdrop-blur-md ring-1 ring-white/10">
            {sourceLabel}
          </span>
        )}
      </div>

      {/* Hero text */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-10 pt-12">
        <span
          className="pt-mono mb-3 inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[9.5px]"
          style={{
            background: `${accent}1F`,
            color: accent,
            boxShadow: `inset 0 0 0 1px ${accent}66`,
          }}
        >
          <Flame size={10} strokeWidth={2.6} />
          {company || "PERSONAL TRAINER"}
        </span>

        <h1 className="pt-display text-white">
          <span
            className="block text-[54px] leading-[0.88]"
            style={{ textShadow: "0 2px 18px rgba(0,0,0,0.55)" }}
          >
            {first}
          </span>
          {last && (
            <span
              className="relative block text-[54px] leading-[0.88]"
              style={{
                color: accent,
                textShadow: `0 2px 22px ${accent}45`,
              }}
            >
              {last}
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 block h-[4px]"
                style={{
                  width: `${Math.min(last.length * 26, 220)}px`,
                  background: accent,
                  boxShadow: `0 0 14px ${accent}80`,
                }}
              />
            </span>
          )}
        </h1>
      </div>
    </header>
  );
}

// =============================================================================
// TaglineStrip — GOALS · STRENGTH · DISCIPLINE in mono uppercase.
// =============================================================================

function TaglineStrip({
  translations,
  accent,
}: {
  translations: PtCopy;
  accent: string;
}) {
  return (
    <div
      className="relative flex items-center justify-center gap-3 px-6 py-3.5"
      style={{ background: PANEL_ALT, borderBottom: `1px solid ${BORDER}` }}
    >
      <span
        aria-hidden
        className="block h-1.5 w-1.5 rounded-full"
        style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
      />
      <span
        className="pt-mono text-[10.5px] font-bold"
        style={{ color: "#e5e5e5" }}
      >
        {translations.tagline}
      </span>
      <span
        aria-hidden
        className="block h-1.5 w-1.5 rounded-full"
        style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
      />
    </div>
  );
}

// =============================================================================
// Stats slab — derive (years / clients / certification) from bio + position.
// 3-up tile row with huge accent numerals.
// =============================================================================

function buildStats(
  cardData: TemplateProps["cardData"],
  t: PtCopy,
): Array<{ value: string; label: string; Icon: LucideIcon }> {
  const stats: Array<{ value: string; label: string; Icon: LucideIcon }> = [];
  const bio = cardData.bio ?? "";

  const yearMatch = bio.match(/(\d{1,2})\s*(?:years|yrs|yıl|Jahre|Jahren)/i);
  if (yearMatch) {
    stats.push({ value: yearMatch[1], label: t.yearsExp, Icon: Award });
  }

  const clientMatch = bio.match(/(\d+\+?)\s*(?:clients|öğrenci|Klienten|Kunden|athletes)/i);
  if (clientMatch) {
    stats.push({ value: clientMatch[1], label: t.clients, Icon: Users });
  }

  const certMatch = bio.match(/\b(NASM|ACE|NSCA[- ]?CSCS|ISSA|EuropeActive|ACSM|FMS)\b/i);
  if (certMatch) {
    stats.push({ value: certMatch[1].toUpperCase(), label: t.certified, Icon: Trophy });
  }

  // Fallback: derive specialty from position if we have fewer than 3 stats.
  if (stats.length < 3 && cardData.position) {
    const word = cardData.position.split(/[\s/&,]+/)[0].toUpperCase().slice(0, 8);
    if (word && !stats.some((s) => s.value === word)) {
      stats.push({ value: word, label: t.specialty, Icon: Target });
    }
  }

  return stats.slice(0, 3);
}

function StatsSlab({
  stats,
  accent,
  onAccent,
}: {
  stats: Array<{ value: string; label: string; Icon: LucideIcon }>;
  accent: string;
  onAccent: string;
}) {
  void onAccent;
  return (
    <section className="px-5 pt-5">
      <div
        className="grid grid-cols-3 overflow-hidden rounded-[16px]"
        style={{
          background: PANEL,
          border: `1px solid ${BORDER}`,
        }}
      >
        {stats.map((s, i) => (
          <div
            key={`${s.label}-${i}`}
            className="relative flex flex-col items-center justify-center px-3 py-5 text-center"
            style={{
              borderRight: i < stats.length - 1 ? `1px solid ${BORDER}` : undefined,
            }}
          >
            <s.Icon size={14} strokeWidth={2.2} style={{ color: accent }} />
            <span
              className="pt-display mt-1.5 text-[28px] leading-none"
              style={{ color: accent, textShadow: `0 0 14px ${accent}55` }}
            >
              {s.value}
            </span>
            <span
              className="pt-mono mt-1.5 text-[8.5px]"
              style={{ color: INK_DIM }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// =============================================================================
// BookSessionCTA — single dominant accent button, brutalist.
// =============================================================================

function BookSessionCTA({
  bookingUrl,
  accent,
  onAccent,
  label,
}: {
  bookingUrl?: string;
  accent: string;
  onAccent: string;
  label: string;
}) {
  if (!bookingUrl) return null;
  return (
    <section className="px-5 pt-5">
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-[12px] px-6 py-[18px] transition-all hover:-translate-y-0.5 active:translate-y-0"
        style={{
          background: accent,
          color: onAccent,
          boxShadow: `0 14px 36px -14px ${accent}80, inset 0 -3px 0 rgba(0,0,0,0.18)`,
        }}
      >
        <Zap size={18} strokeWidth={2.6} />
        <span className="pt-display text-[20px] leading-none">{label}</span>
        <ArrowUpRight size={18} strokeWidth={2.6} />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-full w-1/3 -skew-x-12 transition-transform duration-700 group-hover:translate-x-[400%]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent)",
          }}
        />
      </a>
    </section>
  );
}

// =============================================================================
// Quick action pills — Save / WhatsApp / Call / Email. Dark surface.
// =============================================================================

function QuickActions({
  slug,
  sourceQs,
  phoneDigits,
  waDigits,
  email,
  primary,
  onPrimary,
  onAccent,
  translations,
}: {
  slug: string;
  sourceQs: string;
  phoneDigits: string;
  waDigits: string;
  email?: string;
  primary: string;
  onPrimary: string;
  onAccent: string;
  translations: PtCopy;
}) {
  void onAccent;
  type Pill = {
    label: string;
    href: string;
    Icon: LucideIcon;
    tone: "primary" | "wa" | "panel";
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
      label: translations.call,
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

  return (
    <div className="grid grid-cols-2 gap-2.5 px-5 pt-3">
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
            className="pt-display group flex items-center justify-center gap-2 rounded-[10px] px-4 py-3 text-[15px] tracking-wider transition-all hover:-translate-y-0.5 active:translate-y-0"
            style={
              p.tone === "primary"
                ? {
                    background: primary,
                    color: onPrimary,
                    boxShadow: `0 8px 22px -8px ${primary}80, inset 0 -2px 0 rgba(0,0,0,0.18)`,
                  }
                : p.tone === "wa"
                  ? {
                      background: "#25D366",
                      color: "#0a0a0a",
                      boxShadow:
                        "0 8px 22px -8px rgba(37,211,102,0.55), inset 0 -2px 0 rgba(0,0,0,0.18)",
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
// Section frame — brutalist eyebrow with accent slash.
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
      <div className="mb-4 flex items-center gap-2.5">
        <span
          aria-hidden
          className="block h-3 w-1"
          style={{ background: accent }}
        />
        <span
          className="pt-mono text-[10px]"
          style={{ color: accent }}
        >
          {eyebrow}
        </span>
      </div>
      <h2 className="pt-display mb-5 text-[26px] leading-none text-white">
        {heading}
      </h2>
      {children}
    </section>
  );
}

// =============================================================================
// Training tiers — numbered 01 / 02 / 03 with accent rule + price + CTA.
// =============================================================================

function TrainingTiers({
  items,
  primary,
  accent,
  onAccent,
  translations,
  waDigits,
}: {
  items: Array<{ title: string; description?: string; priceLabel?: string }>;
  primary: string;
  accent: string;
  onAccent: string;
  translations: PtCopy;
  waDigits: string;
}) {
  void primary;
  return (
    <SectionFrame
      eyebrow={translations.trainingTiersEyebrow}
      heading={translations.trainingTiers}
      accent={accent}
    >
      <div className="flex flex-col gap-3">
        {items.map((item, i) => {
          const num = String(i + 1).padStart(2, "0");
          return (
            <article
              key={`${item.title}-${i}`}
              className="group relative overflow-hidden rounded-[14px] transition-all hover:-translate-y-0.5"
              style={{
                background: PANEL,
                border: `1px solid ${BORDER}`,
              }}
            >
              <div
                aria-hidden
                className="absolute left-0 top-0 h-full w-[4px]"
                style={{
                  background: accent,
                  boxShadow: `0 0 12px ${accent}80`,
                }}
              />
              <div className="px-5 py-4 pl-6">
                <div className="mb-2 flex items-baseline gap-3">
                  <span
                    className="pt-display text-[14px] leading-none"
                    style={{ color: accent }}
                  >
                    {num}
                  </span>
                  <span
                    aria-hidden
                    className="block h-px flex-1"
                    style={{ background: BORDER }}
                  />
                  {item.priceLabel && (
                    <span
                      className="pt-mono rounded-sm px-2 py-1 text-[9px]"
                      style={{
                        background: `${accent}1F`,
                        color: accent,
                        boxShadow: `inset 0 0 0 1px ${accent}55`,
                      }}
                    >
                      {item.priceLabel}
                    </span>
                  )}
                </div>
                <h3 className="pt-display text-[20px] leading-tight text-white">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-2 text-[12.5px] leading-snug text-[color:var(--pt-ink-dim,#a3a3a3)]" style={{ color: INK_DIM }}>
                    {item.description}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px]"
                    style={{ color: INK_DIM }}
                  >
                    <Dumbbell size={11} strokeWidth={2.2} style={{ color: accent }} />
                    <span className="pt-mono">{translations.start}</span>
                  </span>
                  <a
                    href={
                      waDigits
                        ? `https://wa.me/${waDigits}?text=${encodeURIComponent(`Hi — ${item.title}?`)}`
                        : "#"
                    }
                    target={waDigits ? "_blank" : undefined}
                    rel={waDigits ? "noopener noreferrer" : undefined}
                    className="pt-display inline-flex items-center gap-1 rounded-sm px-3 py-1.5 text-[12px] tracking-wider transition-all hover:-translate-y-px"
                    style={{
                      background: accent,
                      color: onAccent,
                      boxShadow: `0 6px 14px -6px ${accent}80`,
                    }}
                  >
                    {translations.start}
                    <ArrowUpRight size={11} strokeWidth={2.6} />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </SectionFrame>
  );
}

// =============================================================================
// Philosophy — single paragraph bio in serif-free dramatic block.
// =============================================================================

function PhilosophySection({
  bio,
  accent,
  translations,
}: {
  bio: string;
  accent: string;
  translations: PtCopy;
}) {
  return (
    <SectionFrame
      eyebrow={translations.philosophyEyebrow}
      heading={translations.philosophy}
      accent={accent}
    >
      <div
        className="flex items-start gap-3 rounded-[14px] p-5"
        style={{
          background: `linear-gradient(160deg, ${accent}0F 0%, ${PANEL} 100%)`,
          border: `1px solid ${BORDER}`,
        }}
      >
        <CheckCircle2
          size={16}
          strokeWidth={2.4}
          className="mt-0.5 shrink-0"
          style={{ color: accent }}
        />
        <p className="text-[14px] leading-[1.7]" style={{ color: "#bbbbbb" }}>
          {bio}
        </p>
      </div>
    </SectionFrame>
  );
}

// =============================================================================
// Results — testimonial slabs with dramatic accent glow.
// =============================================================================

function ResultsSection({
  items,
  accent,
  primary,
  translations,
}: {
  items: Array<{ author: string; role?: string; quote: string }>;
  accent: string;
  primary: string;
  translations: PtCopy;
}) {
  void primary;
  return (
    <SectionFrame
      eyebrow={translations.resultsEyebrow}
      heading={translations.results}
      accent={accent}
    >
      <div className="grid gap-3">
        {items.slice(0, 3).map((item, i) => (
          <figure
            key={`${item.author}-${i}`}
            className="relative overflow-hidden rounded-[14px] p-5"
            style={{
              background: PANEL,
              border: `1px solid ${BORDER}`,
            }}
          >
            <Quote
              aria-hidden
              size={32}
              strokeWidth={1.6}
              className="absolute right-4 top-3 opacity-30"
              style={{ color: accent }}
            />
            <blockquote className="text-[13.5px] leading-snug text-[#d4d4d4]">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <figcaption className="pt-display mt-3 text-[14px] tracking-wide text-white">
              {item.author}
              {item.role && (
                <span
                  className="pt-mono ml-2 text-[9.5px] font-bold"
                  style={{ color: accent }}
                >
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
  translations: PtCopy;
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
              className="group flex items-center gap-3.5 rounded-[12px] px-4 py-3 transition-all hover:-translate-y-px"
              style={{
                background: PANEL_ALT,
                border: `1px solid ${BORDER}`,
              }}
            >
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px]"
                style={{
                  background: `${accent}1F`,
                  color: accent,
                  boxShadow: `inset 0 0 0 1px ${accent}55`,
                }}
              >
                <row.Icon size={14} strokeWidth={2.4} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span
                  className="pt-mono text-[9.5px]"
                  style={{ color: "#737373" }}
                >
                  {row.label}
                </span>
                <span className="truncate text-[13px] font-semibold text-white">
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
// CTA section — Wallet/Exchange/SendMyInfo wrappers (accent forced).
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
      <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={accent} locale={locale} />
      <ExchangeSlot slug={slug} primary={accent} locale={locale} />
    </section>
  );
}

// =============================================================================
// Social — dark tile variant.
// =============================================================================

function SocialSection({
  socials,
  accent,
  translations,
}: {
  socials: NonNullable<TemplateProps["cardData"]["socials"]>;
  accent: string;
  translations: PtCopy;
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
        itemClassName="!border-0 !bg-[#1c1c1c] hover:!bg-[#262626]"
      />
    </SectionFrame>
  );
}

// =============================================================================
// Footer — black band with accent rule + TRAIN HARD signature.
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
  translations: PtCopy;
}) {
  void primary;
  return (
    <footer
      className="relative px-6 pb-7 pt-7"
      style={{ background: "#050505" }}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />

      <p
        className="pt-mono mb-3 text-center text-[10px] font-bold"
        style={{ color: accent }}
      >
        {translations.trainHard}
      </p>

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
            className="pt-display tracking-wider transition-colors hover:text-white"
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
            // ignore
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
// Registry entry & sample
// =============================================================================

export const personalTrainerEntry: TemplateRegistryEntry = {
  id: 19,
  key: "personal-trainer",
  name: "Personal Trainer",
  industry: "Personal trainer / fitness coaching / strength conditioning",
  Component: PersonalTrainer,
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
  sampleSlug: "demo-personal-trainer",
};

// source: Unsplash (license: https://unsplash.com/license) — free for commercial use.
const PT_SAMPLE_PHOTO =
  "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=900&q=80";

// Sample persona — Davis Renner, S&C coach, IRON FORGE Berlin.
// Bio packed with year/client/cert markers so the stats slab fills.
export const personalTrainerSample: SampleData = {
  templateId: 19,
  slug: "demo-personal-trainer",
  cardData: {
    name: "Davis Renner",
    title: "Strength & Hypertrophy · Powerlifting Prep",
    position: "Head Coach",
    company: "IRON FORGE BERLIN",
    email: "davis@ironforge.berlin",
    phone: "+49 30 4404 8120",
    whatsapp: "+49 151 4404 8120",
    website: "https://ironforge.berlin",
    address: "Revaler Str. 99, 10245 Berlin, Germany",
    bio:
      "16 years coaching strength athletes and serious general-population clients. 480+ athletes trained, three national-level powerlifting champions, NSCA-CSCS certified. I do not promise hacks. I promise honest programming, hard sessions, and the body composition you actually paid for.",
    bookingUrl: "https://cal.com/ironforge/intake",
    impressumUrl: "https://ironforge.berlin/impressum",
    privacyUrl: "https://ironforge.berlin/datenschutz",
    sectorKey: "fitness",
    services: [
      {
        title: "1-on-1 In-Studio Coaching",
        description:
          "Twice-weekly hands-on sessions at the Friedrichshain studio. Bespoke 12-week blocks, technique work, recovery review.",
        priceLabel: "from 320 € / mo",
      },
      {
        title: "Powerlifting Meet Prep",
        description:
          "16-week peaking cycle into IPF or DSV competition. Includes attempt selection, weight-cut planning, day-of handling.",
        priceLabel: "from 540 € / block",
      },
      {
        title: "Online Programming",
        description:
          "Custom remote plans with weekly check-ins and video reviews. Worldwide. Strength + physique focus.",
        priceLabel: "from 145 € / mo",
      },
      {
        title: "Body Recomp 90",
        description:
          "90-day fat-loss + muscle retention protocol. Diet structure, training, and weekly accountability.",
        priceLabel: "from 690 € / 90d",
      },
    ],
    testimonials: [
      {
        author: "Lukas R.",
        role: "+38 kg total in 6 months",
        quote:
          "Davis is the only coach who actually held me to the program. The numbers are not lying anymore.",
      },
      {
        author: "Marta D.",
        role: "DSV national qualifier",
        quote:
          "First meet, first podium. Davis ran the cut, the warm-ups, and the attempts — I just lifted.",
      },
      {
        author: "Sophie K.",
        role: "Body recomp client",
        quote:
          "Lost 9 kg of fat, kept all my strength. No starvation, no shortcuts — just relentlessly consistent work.",
      },
    ],
    socials: {
      instagram: "https://instagram.com/ironforge.berlin",
      youtube: "https://youtube.com/@ironforgeberlin",
      tiktok: "https://tiktok.com/@ironforge.berlin",
    },
  },
  photoUrl: PT_SAMPLE_PHOTO,
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
