"use client";

// =============================================================================
// YogaStudio — v2 template (id=18, key="yoga-studio").
//
// Sector: yoga / meditation / wellness studios. Mood: soft, breathable, calm,
// generous whitespace, sunrise warmth. Built around an inline lotus/sun SVG
// glyph and serif-led editorial typography (Cormorant Garamond display +
// Inter body). Subtle warm gradient surfaces with hairline rules and
// terracotta accents — premium, not pastel-flat.
//
// Locked design DNA (do not parameterise):
//   - Sunrise gradient header — primary -> accent diagonal, with a soft sun-
//     halo behind a centered lotus / sun-circle SVG glyph (44 px). When a
//     `logoPath` is provided it replaces the glyph cropped inside the same
//     halo. When a `photoPath` is provided, a 76 px circular portrait sits
//     below the glyph with a hairline accent ring.
//   - Italic serif name in Cormorant Garamond (italic 500), eyebrow studio
//     name above, instructor bio rendered in italic body serif inside a
//     translucent surface card.
//   - Schedule strip (next 3 classes) — derived from `services` field; if
//     each service has a `priceLabel` we treat it as the time/day cue. When
//     no services exist the strip falls back to a soft "Drop-in welcome" CTA.
//   - Generous 28-32 px section padding, hairline dividers, no harsh shadows.
//   - Color responsiveness: every accent, header, button background reads
//     from `brandPrimaryHex` / `brandAccentHex`. Defaults: terracotta +
//     sand. `readableTextOn(...)` chooses ink/cream text on colored fills.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  CalendarCheck,
  Clock,
  Flower2,
  HelpCircle,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Quote,
  Shield,
  Sparkles,
  Sun,
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
// Locked palette — terracotta + sand sunrise. brandPrimaryHex / brandAccentHex
// override per card; nothing here is hard-coded once the user picks a tone.
// -----------------------------------------------------------------------------
const LOCKED_PRIMARY = "#86523f"; // terracotta
const LOCKED_ACCENT = "#d4b896"; // warm sand
const SURFACE_PAGE = "#fbf6ef"; // warm off-white parchment
const INK = "#3d2f25";
const INK_SOFT = "#7a6a5b";
const HAIRLINE = "rgba(134,82,63,0.14)";

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

interface YoCopy {
  schedule: string;
  scheduleEyebrow: string;
  classes: string;
  bookSession: string;
  about: string;
  aboutEyebrow: string;
  contact: string;
  contactEyebrow: string;
  voices: string;
  voicesEyebrow: string;
  faqs: string;
  faqsEyebrow: string;
  social: string;
  socialEyebrow: string;
  walletLabel: string;
  bookCta: string;
  dropIn: string;
  dropInHint: string;
  call: string;
  email: string;
  directions: string;
  impressum: string;
  privacy: string;
  poweredBy: string;
  share: string;
  breathe: string;
  studio: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", YoCopy> = {
  de: {
    schedule: "Kommende Klassen",
    scheduleEyebrow: "Stundenplan",
    classes: "Klassen",
    bookSession: "Stunde buchen",
    about: "Über die Lehrerin",
    aboutEyebrow: "Lehrerin",
    contact: "Kontakt",
    contactEyebrow: "Direkt",
    voices: "Stimmen",
    voicesEyebrow: "Erfahrungen",
    faqs: "Häufige Fragen",
    faqsEyebrow: "Wissenswertes",
    social: "Folgen",
    socialEyebrow: "Sozial",
    walletLabel: "Auf Smartphone speichern",
    bookCta: "Online Stunde reservieren",
    dropIn: "Spontan vorbeikommen",
    dropInHint: "Erste Probestunde auf uns",
    call: "Anrufen",
    email: "E-Mail",
    directions: "Anfahrt",
    impressum: "Impressum",
    privacy: "Datenschutz",
    poweredBy: "Powered by",
    share: "Teilen",
    breathe: "Atme · Bewege dich · Sei",
    studio: "Studio",
  },
  en: {
    schedule: "Upcoming classes",
    scheduleEyebrow: "Schedule",
    classes: "Classes",
    bookSession: "Book a session",
    about: "About the teacher",
    aboutEyebrow: "Teacher",
    contact: "Contact",
    contactEyebrow: "Direct",
    voices: "Voices",
    voicesEyebrow: "Reflections",
    faqs: "Common questions",
    faqsEyebrow: "Good to know",
    social: "Follow",
    socialEyebrow: "Social",
    walletLabel: "Add to wallet",
    bookCta: "Reserve a class online",
    dropIn: "Drop-in welcome",
    dropInHint: "First class on the house",
    call: "Call",
    email: "Email",
    directions: "Directions",
    impressum: "Imprint",
    privacy: "Privacy",
    poweredBy: "Powered by",
    share: "Share",
    breathe: "Breathe · Move · Be",
    studio: "Studio",
  },
  tr: {
    schedule: "Yaklaşan Dersler",
    scheduleEyebrow: "Program",
    classes: "Dersler",
    bookSession: "Ders ayırt",
    about: "Eğitmen hakkında",
    aboutEyebrow: "Eğitmen",
    contact: "İletişim",
    contactEyebrow: "Direkt",
    voices: "Yorumlar",
    voicesEyebrow: "Deneyimler",
    faqs: "Sıkça Sorulanlar",
    faqsEyebrow: "Bilgi",
    social: "Takip et",
    socialEyebrow: "Sosyal",
    walletLabel: "Cüzdana ekle",
    bookCta: "Online ders rezervasyonu",
    dropIn: "Bugün uğra, dene",
    dropInHint: "İlk ders bizden",
    call: "Ara",
    email: "E-posta",
    directions: "Yol Tarifi",
    impressum: "Künye",
    privacy: "Gizlilik",
    poweredBy: "Powered by",
    share: "Paylaş",
    breathe: "Nefes Al · Hareket Et · Ol",
    studio: "Stüdyo",
  },
  es: {

    schedule: "Próximas clases",
    scheduleEyebrow: "Agenda",
    classes: "Clases",
    bookSession: "Reservar una sesión",
    about: "Sobre el maestro",
    aboutEyebrow: "Profesor",
    contact: "Contacto",
    contactEyebrow: "Directo",
    voices: "Voces",
    voicesEyebrow: "Reflexiones",
    faqs: "Preguntas frecuentes",
    faqsEyebrow: "Bueno saber",
    social: "Seguir",
    socialEyebrow: "Redes",
    walletLabel: "Añadir a la cartera",
    bookCta: "Reserva una clase online",
    dropIn: "Sin cita previa",
    dropInHint: "Primera clase invita la casa",
    call: "Llamar",
    email: "Correo",
    directions: "Cómo llegar",
    impressum: "Aviso legal",
    privacy: "Privacidad",
    poweredBy: "Desarrollado por",
    share: "Compartir",
    breathe: "Respira · Muévete · Sé",
    studio: "Estudio",
  
  },
  it: {

    schedule: "Prossime lezioni",
    scheduleEyebrow: "Agenda",
    classes: "Lezioni",
    bookSession: "Prenota una sessione",
    about: "Sull'insegnante",
    aboutEyebrow: "Insegnante",
    contact: "Contatto",
    contactEyebrow: "Diretto",
    voices: "Voci",
    voicesEyebrow: "Riflessioni",
    faqs: "Domande frequenti",
    faqsEyebrow: "Buono a sapersi",
    social: "Segui",
    socialEyebrow: "Social",
    walletLabel: "Aggiungi al wallet",
    bookCta: "Prenota una lezione online",
    dropIn: "Benvenuti senza prenotazione",
    dropInHint: "Prima lezione offerta",
    call: "Chiama",
    email: "Email",
    directions: "Indicazioni",
    impressum: "Impressum",
    privacy: "Privacy",
    poweredBy: "Realizzato con",
    share: "Condividi",
    breathe: "Respira · Muoviti · Sii",
    studio: "Studio",
  
  },
  fr: {

    schedule: "Cours à venir",
    scheduleEyebrow: "Agenda",
    classes: "Cours",
    bookSession: "Réserver une séance",
    about: "À propos du professeur",
    aboutEyebrow: "Professeur",
    contact: "Contact",
    contactEyebrow: "Direct",
    voices: "Témoignages",
    voicesEyebrow: "Réflexions",
    faqs: "Questions fréquentes",
    faqsEyebrow: "Bon à savoir",
    social: "Suivre",
    socialEyebrow: "Réseaux",
    walletLabel: "Ajouter au portefeuille",
    bookCta: "Réserver un cours en ligne",
    dropIn: "Sans rendez-vous bienvenue",
    dropInHint: "Premier cours offert",
    call: "Appeler",
    email: "E-mail",
    directions: "Itinéraire",
    impressum: "Mentions légales",
    privacy: "Confidentialité",
    poweredBy: "Propulsé par",
    share: "Partager",
    breathe: "Respire · Bouge · Sois",
    studio: "Studio",
  
  },
  ar: {

    schedule: "الحصص القادمة",
    scheduleEyebrow: "الجدول",
    classes: "الحصص",
    bookSession: "احجز جلسة",
    about: "عن المعلم",
    aboutEyebrow: "المعلم",
    contact: "اتصال",
    contactEyebrow: "مباشر",
    voices: "أصوات",
    voicesEyebrow: "تأملات",
    faqs: "الأسئلة الشائعة",
    faqsEyebrow: "من الجيد معرفة",
    social: "متابعة",
    socialEyebrow: "التواصل",
    walletLabel: "إضافة إلى المحفظة",
    bookCta: "احجز حصة عبر الإنترنت",
    dropIn: "بدون موعد مرحب بكم",
    dropInHint: "الحصة الأولى على حسابنا",
    call: "اتصال",
    email: "البريد الإلكتروني",
    directions: "الاتجاهات",
    impressum: "بيانات النشر",
    privacy: "الخصوصية",
    poweredBy: "مشغل بواسطة",
    share: "مشاركة",
    breathe: "تنفس · تحرك · كن",
    studio: "استوديو",
  
  },
};

export function YogaStudio({
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

  // Treat services as the upcoming class schedule. If empty, sector preset
  // services are used as a fallback so the strip is never blank.
  const classes =
    cardData.services ?? sector?.services;

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  return (
    <article
      data-template="yoga-studio"
      className={`yo-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(134,82,63,0.30),0_8px_20px_-12px_rgba(134,82,63,0.18)] ring-1 ring-[rgba(134,82,63,0.10)]`}
      style={
        {
          ["--yo-primary" as string]: primary,
          ["--yo-accent" as string]: accent,
          ["--yo-on-primary" as string]: onPrimary,
          ["--yo-on-accent" as string]: onAccent,
          ["--yo-primary-soft" as string]: `${primary}14`,
          ["--yo-accent-soft" as string]: `${accent}33`,
          ["--card-primary" as string]: primary,
          ["--card-accent" as string]: accent,
          ["--font-yoga-display" as string]: "'Cormorant Garamond', Georgia, serif",
          ["--font-yoga-body" as string]: "'Inter', system-ui, sans-serif",
          background: SURFACE_PAGE,
          color: INK,
          fontFamily: "var(--font-yoga-body), system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .yo-card {
          font-family:var(--tpl-font-body,  var(--font-yoga-body), "Inter", system-ui, sans-serif);
          line-height: 1.65;
          color: ${INK};
        }
        .yo-card .yo-display {
          font-family: var(--font-yoga-display), "Cormorant Garamond",
            "Cormorant", Georgia, serif;
          letter-spacing: -0.005em;
        }
        .yo-card .yo-display-italic {
          font-family: var(--font-yoga-display), "Cormorant Garamond",
            "Cormorant", Georgia, serif;
          font-style: italic;
        }
        .yo-card .yo-mono {
          font-family:var(--tpl-font-body,  var(--font-yoga-body), "Inter", system-ui, sans-serif);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-feature-settings: "tnum";
        }
        .yo-card a {
          color: inherit;
        }
      `}</style>

      <SunriseHeader
        photoUrl={photoUrl}
        logoUrl={logoUrl}
        studioName={cardData.company}
        primary={primary}
        accent={accent}
        onPrimary={onPrimary}
        sectorBadge={sector?.name}
        sourceLabel={sourceLabel}
        translations={t}
      />

      <NameBlock
        name={cardData.name}
        title={cardData.position || cardData.title}
        primary={primary}
      />

      {cardData.bookingUrl && (
        <PrimaryCTA
          bookingUrl={cardData.bookingUrl}
          primary={primary}
          accent={accent}
          onPrimary={onPrimary}
          label={t.bookCta}
        />
      )}

      {classes && classes.length > 0 && (
        <ScheduleSection
          items={classes.slice(0, 3)}
          primary={primary}
          accent={accent}
          onAccent={onAccent}
          translations={t}
        />
      )}

      {cardData.bio && (
        <BioSection bio={cardData.bio} primary={primary} accent={accent} translations={t} />
      )}

      {cardData.testimonials && cardData.testimonials.length > 0 && (
        <Testimonials items={cardData.testimonials} primary={primary} accent={accent} translations={t} />
      )}

      {cardData.faqs && cardData.faqs.length > 0 && (
        <FaqSection items={cardData.faqs} primary={primary} accent={accent} translations={t} />
      )}

      <ContactSection
        cardData={cardData}
        locale={locale}
        primary={primary}
        accent={accent}
        translations={t}
      />

      <DropInBanner accent={accent} onAccent={onAccent} translations={t} />

      <CTASection slug={slug} sourceQs={sourceQs} locale={locale} primary={primary} />

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="mx-5 mb-5 rounded-3xl border bg-white px-5 py-4"
          labelClassName="yo-mono mb-3 text-[10px] font-semibold text-center"
        >
          <div style={{ ["--card-primary" as string]: primary }}>{walletSlot}</div>
        </WalletDock>
      )}

      {cardData.socials && (
        <Section eyebrow={t.socialEyebrow} title={t.social} primary={primary} accent={accent}>
          <SocialRow
            socials={cardData.socials}
            variant="pill"
            accentHex={primary}
            itemClassName="!border-[rgba(134,82,63,0.18)] !bg-white hover:!border-[var(--yo-primary)] hover:!bg-[var(--yo-primary-soft)]"
          />
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
// SunriseHeader — primary→accent diagonal gradient. Inline sun/lotus glyph
// (or uploaded logo) sits in a soft halo. Optional portrait below the glyph.
// =============================================================================

function SunriseHeader({
  photoUrl,
  logoUrl,
  studioName,
  primary,
  accent,
  onPrimary,
  sectorBadge,
  sourceLabel,
  translations,
}: {
  photoUrl: string | null;
  logoUrl: string | null;
  studioName?: string;
  primary: string;
  accent: string;
  onPrimary: string;
  sectorBadge?: string;
  sourceLabel?: string;
  translations: YoCopy;
}) {
  return (
    <header
      className="relative overflow-hidden px-7 pb-10 pt-9 text-center"
      style={{
        background: `linear-gradient(140deg, ${primary} 0%, ${accent} 100%)`,
        color: onPrimary,
      }}
    >
      {/* Sun-halo radial behind the glyph */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-2 mx-auto h-[180px] w-[180px] rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${onPrimary === "#1a1a1a" ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.18)"} 0%, transparent 65%)`,
          filter: "blur(2px)",
        }}
      />
      {/* Decorative concentric rings — meditative */}
      <div
        aria-hidden
        className="absolute -right-12 -top-12 h-36 w-36 rounded-full"
        style={{
          border: `1.5px solid ${onPrimary === "#1a1a1a" ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.18)"}`,
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full"
        style={{
          border: `1px solid ${onPrimary === "#1a1a1a" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)"}`,
        }}
      />

      <div className="relative z-10 mb-2 flex items-center justify-center gap-2">
        {sectorBadge && (
          <span
            className="yo-mono inline-block rounded-full px-2.5 py-1 text-[8.5px] font-semibold backdrop-blur-md"
            style={{
              background: onPrimary === "#1a1a1a" ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.20)",
              color: onPrimary,
              boxShadow: onPrimary === "#1a1a1a"
                ? "inset 0 0 0 1px rgba(0,0,0,0.10)"
                : "inset 0 0 0 1px rgba(255,255,255,0.32)",
            }}
          >
            {sectorBadge}
          </span>
        )}
        {sourceLabel && (
          <span
            className="yo-mono inline-block rounded-full px-2.5 py-1 text-[8.5px] font-semibold backdrop-blur-md"
            style={{
              background: onPrimary === "#1a1a1a" ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.20)",
              color: onPrimary,
            }}
          >
            {sourceLabel}
          </span>
        )}
      </div>

      {/* Lotus / sun glyph in a soft halo. Replaced by uploaded logo when present. */}
      <div className="relative z-10 mx-auto mt-1 inline-flex">
        <div
          className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full"
          style={{
            background: onPrimary === "#1a1a1a" ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.22)",
            backdropFilter: "blur(8px)",
            boxShadow: onPrimary === "#1a1a1a"
              ? "inset 0 1px 0 rgba(255,255,255,0.65), 0 6px 18px -8px rgba(0,0,0,0.20)"
              : "inset 0 1px 0 rgba(255,255,255,0.45), 0 6px 18px -8px rgba(0,0,0,0.30)",
          }}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={studioName ? `${studioName} logo` : "Studio logo"}
              width={64}
              height={64}
              unoptimized
              className="h-9 w-9 rounded-full object-cover tpl-logo"
            />
          ) : (
            <LotusGlyph color={onPrimary} />
          )}
        </div>
      </div>

      {/* Optional teacher portrait — soft hairline ring in accent. */}
      {photoUrl && (
        <div className="relative z-10 mt-4 inline-flex">
          <div
            className="flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-full"
            style={{
              background: "white",
              border: `2px solid ${onPrimary === "#1a1a1a" ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.55)"}`,
              boxShadow: "0 6px 18px -8px rgba(0,0,0,0.30)",
            }}
          >
            <Image
              src={photoUrl}
              alt=""
              width={150}
              height={150}
              unoptimized
              className="h-full w-full object-cover tpl-photo"
            />
          </div>
        </div>
      )}

      {studioName && (
        <h2
          className="yo-display relative z-10 mt-5 text-[13px] font-semibold uppercase tracking-[0.32em]"
          style={{ color: onPrimary, opacity: 0.92 }}
        >
          {studioName}
        </h2>
      )}

      <p
        className="yo-display-italic relative z-10 mt-2 text-[14px] font-medium"
        style={{ color: onPrimary, opacity: 0.78 }}
      >
        {translations.breathe}
      </p>
    </header>
  );
}

// =============================================================================
// LotusGlyph — inline SVG: stylised lotus + radiant sun rays. Pure stroke,
// inherits color from parent so it adapts to readableTextOn(primary).
// =============================================================================

function LotusGlyph({ color }: { color: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Sun rays — eight short strokes radiating around the lotus */}
      <line x1="16" y1="2" x2="16" y2="5" opacity="0.55" />
      <line x1="26.5" y1="5.5" x2="24.5" y2="7.5" opacity="0.55" />
      <line x1="30" y1="16" x2="27" y2="16" opacity="0.55" />
      <line x1="2" y1="16" x2="5" y2="16" opacity="0.55" />
      <line x1="5.5" y1="5.5" x2="7.5" y2="7.5" opacity="0.55" />
      {/* Lotus — three petals + base */}
      <path d="M16 22 C 11 18, 8 14, 9 10 C 12 12, 14 14, 16 18 C 18 14, 20 12, 23 10 C 24 14, 21 18, 16 22 Z" />
      <path d="M16 22 C 13 19, 11 16, 11.5 13 C 13.5 14.5, 15 16, 16 19" opacity="0.55" />
      <path d="M16 22 C 19 19, 21 16, 20.5 13 C 18.5 14.5, 17 16, 16 19" opacity="0.55" />
      {/* Center seed */}
      <circle cx="16" cy="20" r="0.9" fill={color} stroke="none" />
    </svg>
  );
}

// =============================================================================
// NameBlock — italic serif name, position underneath in mono eyebrow.
// =============================================================================

function NameBlock({
  name,
  title,
  primary,
}: {
  name: string;
  title?: string;
  primary: string;
}) {
  return (
    <section
      className="relative -mt-6 mx-5 rounded-3xl bg-white px-7 pb-7 pt-7 text-center"
      style={{
        zIndex: 2,
        border: `1px solid ${HAIRLINE}`,
        boxShadow: "0 10px 28px -18px rgba(134,82,63,0.22)",
      }}
    >
      <h1
        className="yo-display-italic text-[30px] font-medium leading-[1.1]"
        style={{ color: INK }}
      >
        {name}
      </h1>
      {title && (
        <p
          className="yo-mono mt-3 text-[10px] font-semibold"
          style={{ color: primary }}
        >
          {title}
        </p>
      )}

      <div className="mt-5 flex items-center justify-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-semibold"
          style={{
            background: "var(--yo-primary-soft)",
            color: primary,
          }}
        >
          <Leaf size={10} strokeWidth={2.2} />
          Mindful
        </span>
        <span
          aria-hidden
          className="block h-1 w-1 rounded-full"
          style={{ background: "rgba(134,82,63,0.30)" }}
        />
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-semibold"
          style={{
            background: "var(--yo-primary-soft)",
            color: primary,
          }}
        >
          <Sparkles size={10} strokeWidth={2.2} />
          Certified
        </span>
      </div>
    </section>
  );
}

// =============================================================================
// PrimaryCTA — soft warm gradient button echoing the header.
// =============================================================================

function PrimaryCTA({
  bookingUrl,
  primary,
  accent,
  onPrimary,
  label,
}: {
  bookingUrl: string;
  primary: string;
  accent: string;
  onPrimary: string;
  label: string;
}) {
  return (
    <section className="px-5 pt-5">
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center gap-2.5 overflow-hidden rounded-[20px] px-6 py-[16px] text-[14px] font-semibold transition-all hover:-translate-y-0.5"
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
          color: onPrimary,
          boxShadow: `0 14px 30px -14px ${primary}80`,
        }}
      >
        <CalendarCheck size={16} strokeWidth={2.2} />
        <span>{label}</span>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-full w-1/3 -skew-x-12 transition-transform duration-700 group-hover:translate-x-[400%]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
          }}
        />
      </a>
    </section>
  );
}

// =============================================================================
// Section frame — italic eyebrow, serif title, hairline ribbon.
// =============================================================================

function Section({
  eyebrow,
  title,
  primary,
  accent,
  children,
}: {
  eyebrow: string;
  title: string;
  primary: string;
  accent: string;
  children: React.ReactNode;
}) {
  void accent;
  return (
    <section className="px-7 py-7">
      <div className="mb-1 flex items-center gap-2.5">
        <span
          aria-hidden
          className="block h-px w-6"
          style={{ background: primary, opacity: 0.55 }}
        />
        <span
          className="yo-mono text-[10px] font-semibold"
          style={{ color: primary }}
        >
          {eyebrow}
        </span>
      </div>
      <h2
        className="yo-display mb-5 text-[22px] font-medium leading-tight"
        style={{ color: INK }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

// =============================================================================
// ScheduleSection — next 3 classes. Each card: time/day badge + class name +
// teacher/level. Uses `priceLabel` as the time/day cue, `description` for the
// level note. Accent badges, hairline cards.
// =============================================================================

function ScheduleSection({
  items,
  primary,
  accent,
  onAccent,
  translations,
}: {
  items: Array<{ title: string; description?: string; priceLabel?: string }>;
  primary: string;
  accent: string;
  onAccent: string;
  translations: YoCopy;
}) {
  return (
    <Section
      eyebrow={translations.scheduleEyebrow}
      title={translations.schedule}
      primary={primary}
      accent={accent}
    >
      <div className="grid gap-3">
        {items.map((item, i) => (
          <article
            key={`${item.title}-${i}`}
            className="group flex items-start gap-4 rounded-2xl bg-white p-4 transition-all hover:-translate-y-px"
            style={{
              border: `1px solid ${HAIRLINE}`,
              boxShadow: "0 2px 10px -6px rgba(134,82,63,0.10)",
            }}
          >
            <div
              className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl"
              style={{
                background: `linear-gradient(140deg, ${accent} 0%, ${primary}66 100%)`,
                color: onAccent,
              }}
            >
              {item.priceLabel ? (
                <span className="yo-mono text-[8.5px] font-bold leading-tight">
                  {item.priceLabel.split(/[\s·]/).slice(0, 2).join(" ")}
                </span>
              ) : (
                <Clock size={16} strokeWidth={2} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className="yo-display text-[16px] font-semibold leading-snug"
                style={{ color: INK }}
              >
                {item.title}
              </h3>
              {item.description && (
                <p
                  className="mt-1 text-[12px] leading-snug"
                  style={{ color: INK_SOFT }}
                >
                  {item.description}
                </p>
              )}
            </div>
            <ArrowUpRight
              size={14}
              strokeWidth={2}
              className="ml-1 mt-1 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: primary }}
            />
          </article>
        ))}
      </div>
    </Section>
  );
}

// =============================================================================
// BioSection — italic serif bio inside a translucent surface card.
// =============================================================================

function BioSection({
  bio,
  primary,
  accent,
  translations,
}: {
  bio: string;
  primary: string;
  accent: string;
  translations: YoCopy;
}) {
  return (
    <Section eyebrow={translations.aboutEyebrow} title={translations.about} primary={primary} accent={accent}>
      <div
        className="relative rounded-3xl px-6 py-6"
        style={{
          background: `linear-gradient(160deg, ${accent}33 0%, ${primary}0d 100%)`,
          border: `1px solid ${HAIRLINE}`,
        }}
      >
        <Flower2
          aria-hidden
          size={22}
          strokeWidth={1.4}
          className="absolute right-4 top-4"
          style={{ color: primary, opacity: 0.45 }}
        />
        <p
          className="yo-display-italic text-[15.5px] leading-[1.75]"
          style={{ color: INK }}
        >
          &ldquo;{bio}&rdquo;
        </p>
      </div>
    </Section>
  );
}

// =============================================================================
// Testimonials — soft cream cards with serif quotes.
// =============================================================================

function Testimonials({
  items,
  primary,
  accent,
  translations,
}: {
  items: Array<{ author: string; role?: string; quote: string }>;
  primary: string;
  accent: string;
  translations: YoCopy;
}) {
  return (
    <Section eyebrow={translations.voicesEyebrow} title={translations.voices} primary={primary} accent={accent}>
      <div className="grid gap-3">
        {items.slice(0, 3).map((item, i) => (
          <figure
            key={`${item.author}-${i}`}
            className="relative rounded-2xl bg-white p-5"
            style={{
              border: `1px solid ${HAIRLINE}`,
              boxShadow: "0 2px 10px -6px rgba(134,82,63,0.10)",
            }}
          >
            <Quote
              aria-hidden
              size={26}
              strokeWidth={1.4}
              className="absolute right-4 top-3"
              style={{ color: primary, opacity: 0.18 }}
            />
            <blockquote
              className="yo-display-italic text-[14.5px] leading-snug"
              style={{ color: INK }}
            >
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <figcaption
              className="yo-mono mt-3 text-[10px] font-semibold"
              style={{ color: primary }}
            >
              — {item.author}
              {item.role && (
                <span
                  className="ml-2 font-normal"
                  style={{ color: INK_SOFT, letterSpacing: "0.12em" }}
                >
                  {item.role}
                </span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

// =============================================================================
// FaqSection — accordion with primary plus icon.
// =============================================================================

function FaqSection({
  items,
  primary,
  accent,
  translations,
}: {
  items: Array<{ q: string; a: string }>;
  primary: string;
  accent: string;
  translations: YoCopy;
}) {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <Section eyebrow={translations.faqsEyebrow} title={translations.faqs} primary={primary} accent={accent}>
      <div className="grid gap-2">
        {items.slice(0, 6).map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={`${f.q}-${i}`}
              className="overflow-hidden rounded-2xl bg-white"
              style={{ border: `1px solid ${HAIRLINE}` }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span
                  className="yo-display text-[15px] font-semibold leading-snug"
                  style={{ color: INK }}
                >
                  {f.q}
                </span>
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[14px] font-bold transition-transform"
                  style={{
                    background: "var(--yo-primary-soft)",
                    color: primary,
                    transform: isOpen ? "rotate(45deg)" : "rotate(0)",
                  }}
                >
                  <HelpCircle size={13} strokeWidth={2.2} />
                </span>
              </button>
              {isOpen && (
                <div
                  className="px-5 pb-4 text-[13px] leading-relaxed"
                  style={{ color: INK_SOFT }}
                >
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// =============================================================================
// ContactSection — uses shared rows with a warm hairline render.
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
  translations: YoCopy;
}) {
  type RowIcon = LucideIcon;
  void accent;
  const directionsHref = cardData.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cardData.address)}`
    : null;
  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";

  // Quick actions row — call / email / directions (compact warm pills).
  type Quick = { href: string; Icon: RowIcon; label: string; external?: boolean };
  const quicks: Quick[] = [];
  if (phoneDigits) {
    quicks.push({ href: `tel:${phoneDigits}`, Icon: Phone, label: translations.call });
  }
  if (cardData.email) {
    quicks.push({ href: `mailto:${cardData.email}`, Icon: Mail, label: translations.email });
  }
  if (directionsHref) {
    quicks.push({ href: directionsHref, Icon: MapPin, label: translations.directions, external: true });
  }

  return (
    <Section eyebrow={translations.contactEyebrow} title={translations.contact} primary={primary} accent={accent}>
      {quicks.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-2">
          {quicks.map((q) => {
            const ext = q.external ? { target: "_blank", rel: "noopener noreferrer" as const } : {};
            return (
              <a
                key={q.label}
                href={q.href}
                {...ext}
                className="group flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white px-2 py-3 text-center transition-all hover:-translate-y-0.5"
                style={{
                  border: `1px solid ${HAIRLINE}`,
                  boxShadow: "0 2px 8px -4px rgba(134,82,63,0.08)",
                }}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-xl"
                  style={{ background: "var(--yo-primary-soft)", color: primary }}
                >
                  <q.Icon size={14} strokeWidth={2} />
                </span>
                <span
                  className="yo-mono text-[9.5px] font-semibold"
                  style={{ color: primary }}
                >
                  {q.label}
                </span>
              </a>
            );
          })}
        </div>
      )}

      <ContactRows
        cardData={cardData}
        locale={locale}
        variant="hairline"
        accentHex={primary}
      />
    </Section>
  );
}

// =============================================================================
// DropInBanner — soft accent banner with the studio invitation.
// =============================================================================

function DropInBanner({
  accent,
  onAccent,
  translations,
}: {
  accent: string;
  onAccent: string;
  translations: YoCopy;
}) {
  return (
    <section className="px-5 pt-2">
      <div
        className="flex items-center gap-4 rounded-3xl px-5 py-4"
        style={{
          background: `linear-gradient(140deg, ${accent}55 0%, ${accent}22 100%)`,
          border: `1px solid ${accent}66`,
        }}
      >
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: accent, color: onAccent }}
          aria-hidden
        >
          <Sun size={18} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p
            className="yo-display text-[15px] font-semibold leading-tight"
            style={{ color: INK }}
          >
            {translations.dropIn}
          </p>
          <p
            className="yo-mono mt-1 text-[9.5px] font-semibold"
            style={{ color: INK_SOFT }}
          >
            {translations.dropInHint}
          </p>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// CTA section — Wallet/Exchange/SendMyInfo wrappers wrapped in soft surface.
// =============================================================================

function CTASection({
  slug,
  sourceQs,
  locale,
  primary,
}: {
  slug: string;
  sourceQs: string;
  locale: "de" | "en" | "tr" | "es" | "it" | "fr" | "ar";
  primary: string;
}) {
  return (
    <section className="mx-5 mt-5 rounded-3xl bg-white p-5"
      style={{ border: `1px solid ${HAIRLINE}`, boxShadow: "0 2px 12px -8px rgba(134,82,63,0.10)" }}
    >
      <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={primary} locale={locale} />
      <ExchangeSlot slug={slug} primary={primary} locale={locale} />
    </section>
  );
}

// =============================================================================
// Footer — warm parchment band, italic mark, hairline rule.
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
  translations: YoCopy;
}) {
  return (
    <footer
      className="relative px-7 pb-7 pt-7 text-center"
      style={{ background: SURFACE_PAGE, color: INK_SOFT }}
    >
      <div
        aria-hidden
        className="absolute inset-x-12 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accent}66 50%, transparent 100%)`,
        }}
      />
      <div
        className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full"
        style={{ background: "var(--yo-primary-soft)" }}
      >
        <LotusGlyph color={primary} />
      </div>
      <p
        className="yo-mono text-[10px] font-semibold"
        style={{ color: INK_SOFT }}
      >
        © {new Date().getFullYear()} · {translations.studio}
      </p>
      <div
        className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px]"
        style={{ color: INK_SOFT }}
      >
        <FooterShare siteUrl={siteUrl} slug={slug} label={translations.share} />
        {impressumUrl && (
          <a href={impressumUrl} target="_blank" rel="noopener noreferrer">
            {translations.impressum}
          </a>
        )}
        {privacyUrl && (
          <a href={privacyUrl} target="_blank" rel="noopener noreferrer">
            {translations.privacy}
          </a>
        )}
      </div>
      <div
        className="mt-3 inline-flex items-center gap-1.5 text-[11px]"
        style={{ color: INK_SOFT }}
      >
        <Shield size={11} strokeWidth={1.6} />
        {translations.poweredBy}{" "}
        <a
          href="https://opsolid.de/products/digital-card"
          target="_blank"
          rel="noopener noreferrer"
          className="yo-display font-semibold"
          style={{ color: primary }}
        >
          OpSolid
        </a>
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
            // ignore — user cancelled
          }
        }
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        }
      }}
    >
      {label}
    </button>
  );
}

// =============================================================================
// Registry entry & sample
// =============================================================================

export const yogaStudioEntry: TemplateRegistryEntry = {
  id: 18,
  key: "yoga-studio",
  name: "Yoga Studio",
  industry: "Yoga / meditation / wellness studio",
  Component: YogaStudio,
  supports: {
    services: true,
    faqs: true,
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
  sampleSlug: "demo-yoga-studio",
};

// Sample persona — Inga Solberg, founder of Sølv Yoga, Bergen.
// services treated as upcoming class slots; priceLabel = day/time.
export const yogaStudioSample: SampleData = {
  templateId: 18,
  slug: "demo-yoga-studio",
  cardData: {
    name: "Inga Solberg",
    title: "E-RYT 500 · Yin & Vinyasa",
    position: "Founder & lead teacher",
    company: "Sølv Yoga",
    email: "hei@solvyoga.no",
    phone: "+47 55 21 04 18",
    whatsapp: "+47 91 04 22 15",
    website: "https://solvyoga.no",
    address: "Strandgaten 14, 5013 Bergen, Norway",
    bio:
      "Sølv Yoga sits two streets from the harbour in Bergen — a quiet room with oak floors, candle light, and views over the rooftops. I teach slow, breath-led classes drawn from twelve years of practice in India, Berlin, and Norway. Beginners genuinely welcome. Mats and props provided.",
    bookingUrl: "https://cal.com/solvyoga/class",
    impressumUrl: "https://solvyoga.no/info",
    privacyUrl: "https://solvyoga.no/privacy",
    sectorKey: "wellness",
    services: [
      {
        title: "Slow Vinyasa flow",
        description: "Mixed levels · breath-led · 75 minutes",
        priceLabel: "Mon 18:30",
      },
      {
        title: "Yin & Restore",
        description: "All levels · candle light · 90 minutes",
        priceLabel: "Wed 20:00",
      },
      {
        title: "Saturday morning practice",
        description: "Open level · live cellist last Saturday of month",
        priceLabel: "Sat 09:00",
      },
    ],
    faqs: [
      {
        q: "I have never done yoga before — can I come?",
        a: "Absolutely. Most of our regulars walked in with no prior experience. The slow flow on Monday and the Saturday morning class are the gentlest places to start.",
      },
      {
        q: "Do I need to bring anything?",
        a: "Just yourself. Mats, blocks, bolsters, and blankets are all provided. There's a clean changing room and a tea bar after class.",
      },
      {
        q: "How do I book a drop-in?",
        a: "Reserve through the schedule above or send a WhatsApp the morning of class. Walk-ins are welcome when there's space.",
      },
      {
        q: "Do you offer private lessons?",
        a: "Yes — one-to-one and small group privates are available on weekday mornings. Get in touch for tailored programmes.",
      },
    ],
    testimonials: [
      {
        author: "Marianne H.",
        role: "Bergen · regular since 2022",
        quote:
          "Inga's room is the only place in this city where I genuinely stop thinking. The Wednesday Yin has rebuilt my back.",
      },
      {
        author: "Jonas K.",
        role: "First-timer, May",
        quote:
          "I was nervous walking in. Inga read the room, kept everything optional, and I left feeling lighter than I have in months.",
      },
    ],
    socials: {
      instagram: "https://instagram.com/solvyoga",
      facebook: "https://facebook.com/solvyoga",
    },
  },
  photoUrl: null,
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
