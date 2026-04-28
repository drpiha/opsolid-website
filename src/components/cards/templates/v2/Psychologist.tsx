"use client";

// =============================================================================
// Psychologist — v2 template (id=25, key="psychologist").
//
// Sector: psychologist / therapist / counsellor. Mood: calm, sage, editorial
// serif italic accents on warm cream surface. Inspired by kart_12_psikolog.html.
//
// Locked design DNA (only colors respond to brand):
//   - Tall hero (280 px) — soft photo desaturated, primary→ink gradient overlay,
//     italic serif quote pulled from bio at the bottom.
//   - Centered profile — circular avatar overlapping the hero (-52 px),
//     name in bold sans, italic serif welcome paragraph below.
//   - 3-up quick action row.
//   - Specialties as numbered cards with accent-colored left edge stripe.
//   - Format / pricing 3-up tile row (services).
//   - Stats band on accent-dark with serif italic numbers.
//   - Education card with circular accent avatars + line items.
//   - Testimonial centered with quote-mark glyph.
//   - Pill-shaped CTA in primary.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  Award,
  Heart,
  Mail,
  MessageCircle,
  Phone,
  Quote,
  Shield,
  Sparkles,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#3d5a80";
const LOCKED_ACCENT = "#98c1d9";
const SURFACE_CARD = "#fdfaf6";
const SURFACE_WARM = "#f8f0e6";
const INK = "#2d2638";
const INK_SOFT = "#786a82";
const HAIRLINE = "#e7ddd5";

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

interface PsCopy {
  practice: string;
  call: string;
  email: string;
  whatsapp: string;
  specialtiesEyebrow: string;
  specialtiesTitle: string;
  formatEyebrow: string;
  formatTitle: string;
  educationEyebrow: string;
  educationTitle: string;
  experience: string;
  sessions: string;
  formats: string;
  bookFirstSession: string;
  walletLabel: string;
  saveContact: string;
  share: string;
  poweredBy: string;
  voiceTagline: string;
}

const COPY: Record<"de" | "en" | "tr", PsCopy> = {
  de: {
    practice: "Online · Praxis",
    call: "Telefon",
    email: "E-Mail",
    whatsapp: "WhatsApp",
    specialtiesEyebrow: "Schwerpunkte",
    specialtiesTitle: "Worüber wir sprechen können",
    formatEyebrow: "Sitzungsformate",
    formatTitle: "Wählen Sie, was zu Ihnen passt",
    educationEyebrow: "Ausbildung",
    educationTitle: "Akademischer Werdegang",
    experience: "Jahre",
    sessions: "Sitzungen",
    formats: "Formate",
    bookFirstSession: "Erstgespräch anfragen",
    walletLabel: "Auf Smartphone speichern",
    saveContact: "Kontakt speichern",
    share: "Teilen",
    poweredBy: "Powered by",
    voiceTagline: "Mit Ihnen zu sein, um Sie zu verstehen.",
  },
  en: {
    practice: "Online · In-person",
    call: "Call",
    email: "Email",
    whatsapp: "WhatsApp",
    specialtiesEyebrow: "Focus areas",
    specialtiesTitle: "What we can work on together",
    formatEyebrow: "Session formats",
    formatTitle: "Choose what fits you",
    educationEyebrow: "Training",
    educationTitle: "My academic path",
    experience: "Years",
    sessions: "Sessions",
    formats: "Formats",
    bookFirstSession: "Request first session",
    walletLabel: "Add to wallet",
    saveContact: "Save contact",
    share: "Share",
    poweredBy: "Powered by",
    voiceTagline: "To be with you, to understand you.",
  },
  tr: {
    practice: "Online · Yüz Yüze",
    call: "Telefon",
    email: "E-posta",
    whatsapp: "WhatsApp",
    specialtiesEyebrow: "Çalışma Alanlarım",
    specialtiesTitle: "Birlikte çalışabileceğimiz konular",
    formatEyebrow: "Seans Formatı",
    formatTitle: "Size uygun olanı seçin",
    educationEyebrow: "Eğitim & Sertifika",
    educationTitle: "Akademik yolculuğum",
    experience: "Yıl",
    sessions: "Seans",
    formats: "Format",
    bookFirstSession: "İlk Görüşme Talep Et",
    walletLabel: "Cüzdana ekle",
    saveContact: "Kişiyi Kaydet",
    share: "Paylaş",
    poweredBy: "Powered by",
    voiceTagline: "Sizinle olmak, sizi anlamak için.",
  },
};

export function Psychologist({
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
  const onPrimary = readableTextOn(primary);
  const photoUrl = resolveAssetUrl(photoPath);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];
  const faqs = cardData.faqs ?? [];
  const testimonials = cardData.testimonials ?? [];

  // Specialties = first 5 faqs treated as focus areas; education = remainder.
  const specialties = faqs.slice(0, 5);
  const education = faqs.slice(5, 8);

  return (
    <article
      data-template="psychologist"
      className="ps-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: SURFACE_CARD,
        color: INK,
        fontFamily: "'Nunito', system-ui, sans-serif",
      }}
    >
      <style jsx global>{`
        .ps-card { line-height: 1.65; }
        .ps-card a { color: inherit; }
        .ps-editorial { font-family: 'Lora', Georgia, serif; font-style: italic; font-weight: 400; }
      `}</style>

      {/* HERO */}
      <header className="relative h-[280px] overflow-hidden">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt=""
            width={920}
            height={560}
            unoptimized
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "saturate(0.85) brightness(0.95)" }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${primary}99, ${accent}cc)`,
            }}
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${primary}0d 0%, ${primary}66 60%, ${INK}d9 100%)`,
          }}
        />
        <div className="absolute inset-x-0 bottom-0 px-8 pb-7 pt-7 text-white">
          <div
            className="mb-2 text-[11px] font-bold uppercase tracking-[2.5px]"
            style={{ color: accent }}
          >
            {cardData.company}
          </div>
          <div className="ps-editorial text-[24px] leading-[1.3]">
            &ldquo;{t.voiceTagline}&rdquo;
          </div>
        </div>
      </header>

      {/* PROFILE */}
      <section className="relative z-10 -mt-14 px-8 text-center">
        <div className="mx-auto inline-block">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt=""
              width={220}
              height={220}
              unoptimized
              className="mb-4 inline-block h-[110px] w-[110px] rounded-full object-cover"
              style={{ border: `6px solid ${SURFACE_CARD}`, boxShadow: "0 12px 30px rgba(45,38,56,0.18)" }}
            />
          ) : (
            <div
              className="mb-4 inline-flex h-[110px] w-[110px] items-center justify-center rounded-full text-white"
              style={{
                background: primary,
                border: `6px solid ${SURFACE_CARD}`,
                boxShadow: "0 12px 30px rgba(45,38,56,0.18)",
              }}
            >
              <Heart size={36} strokeWidth={1.6} />
            </div>
          )}
        </div>
        <h1 className="text-[22px] font-bold leading-tight tracking-[-0.3px]" style={{ color: INK }}>
          {cardData.name}
        </h1>
        <div className="mt-1 text-[13px]" style={{ color: INK_SOFT }}>
          {cardData.position} {cardData.title && `· ${cardData.title}`}
        </div>
        <span
          className="mt-2.5 inline-block rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-[0.6px]"
          style={{ background: `${accent}40`, color: primary }}
        >
          {t.practice}
        </span>
      </section>

      {/* WELCOME */}
      {cardData.bio && (
        <section className="px-8 pt-7 text-center">
          <div
            aria-hidden
            className="mx-auto mb-4 block h-px w-8"
            style={{ background: primary }}
          />
          <p className="ps-editorial text-[15px] leading-[1.7]" style={{ color: INK }}>
            {cardData.bio}
          </p>
        </section>
      )}

      {/* QUICK ACTIONS */}
      <section className="grid grid-cols-3 gap-2.5 px-8 pt-7">
        {phoneDigits && (
          <PsAction href={`tel:${phoneDigits}`} label={t.call} icon={<Phone size={18} strokeWidth={2.2} />} primary={primary} accent={accent} />
        )}
        {waDigits && (
          <PsAction
            href={`https://wa.me/${waDigits}`}
            label={t.whatsapp}
            icon={<MessageCircle size={18} strokeWidth={2.2} />}
            primary={primary}
            accent={accent}
            external
          />
        )}
        {cardData.email && (
          <PsAction href={`mailto:${cardData.email}`} label={t.email} icon={<Mail size={18} strokeWidth={2.2} />} primary={primary} accent={accent} />
        )}
      </section>

      {/* SPECIALTIES */}
      {specialties.length > 0 && (
        <PsSection eyebrow={t.specialtiesEyebrow} title={t.specialtiesTitle} primary={primary}>
          <div className="grid gap-3">
            {specialties.map((s, i) => (
              <article
                key={`${s.q}-${i}`}
                className="relative flex items-start gap-3.5 overflow-hidden rounded-[18px] bg-white p-5 transition-all hover:-translate-y-0.5"
                style={{ border: `1px solid ${HAIRLINE}` }}
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-[3px]"
                  style={{ background: primary, opacity: 0.5 }}
                />
                <span className="ps-editorial flex-shrink-0 text-[22px] leading-none" style={{ color: primary }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-bold leading-tight" style={{ color: INK }}>
                    {s.q}
                  </div>
                  <div className="mt-1 text-[12px] leading-[1.55]" style={{ color: INK_SOFT }}>
                    {s.a}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </PsSection>
      )}

      {/* FORMAT / PRICING */}
      {services.length > 0 && (
        <PsSection eyebrow={t.formatEyebrow} title={t.formatTitle} primary={primary}>
          <div className="grid grid-cols-3 gap-2.5">
            {services.slice(0, 3).map((s, i) => (
              <div
                key={`${s.title}-${i}`}
                className="rounded-[16px] p-4 text-center"
                style={{ background: SURFACE_WARM, border: `1px solid ${HAIRLINE}` }}
              >
                <div
                  className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ background: `${primary}1a`, color: primary }}
                  aria-hidden
                >
                  <Sparkles size={16} strokeWidth={2} />
                </div>
                <div className="text-[11.5px] font-bold" style={{ color: INK }}>
                  {s.title}
                </div>
                {s.priceLabel && (
                  <div className="mt-1 text-[14px] font-extrabold" style={{ color: primary }}>
                    {s.priceLabel}
                  </div>
                )}
              </div>
            ))}
          </div>
        </PsSection>
      )}

      {/* STATS */}
      <section
        className="grid grid-cols-3 gap-3 px-6 py-7 text-center"
        style={{ background: primary, color: onPrimary }}
      >
        <PsStat n="9" l={t.experience} accent={accent} onPrimary={onPrimary} />
        <PsStat n="800+" l={t.sessions} accent={accent} onPrimary={onPrimary} last />
        <PsStat n="2" l={t.formats} accent={accent} onPrimary={onPrimary} last />
      </section>

      {/* EDUCATION */}
      {education.length > 0 && (
        <PsSection eyebrow={t.educationEyebrow} title={t.educationTitle} primary={primary}>
          <div className="rounded-[18px] p-6" style={{ background: SURFACE_WARM }}>
            {education.map((e, i) => (
              <div
                key={`${e.q}-${i}`}
                className={`flex gap-3.5 py-3.5 ${i < education.length - 1 ? "border-b" : ""} ${i === 0 ? "pt-0" : ""} ${i === education.length - 1 ? "pb-0" : ""}`}
                style={{ borderColor: `${primary}26` }}
              >
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white"
                  style={{ background: primary }}
                  aria-hidden
                >
                  <Award size={16} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-bold" style={{ color: INK }}>
                    {e.q}
                  </div>
                  <div className="mt-0.5 text-[11.5px]" style={{ color: INK_SOFT }}>
                    {e.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PsSection>
      )}

      {/* TESTIMONIAL */}
      {testimonials.length > 0 && (
        <section className="px-8 pb-7 text-center">
          <Quote
            aria-hidden
            size={48}
            strokeWidth={1.4}
            className="mx-auto"
            style={{ color: primary, opacity: 0.3 }}
          />
          <p className="ps-editorial mt-3 text-[16px] leading-[1.65]" style={{ color: INK }}>
            &ldquo;{testimonials[0].quote}&rdquo;
          </p>
          <div
            className="mt-4 text-[11.5px] font-bold uppercase tracking-[1px]"
            style={{ color: primary }}
          >
            — {testimonials[0].author}
          </div>
        </section>
      )}

      {/* CTA */}
      {(cardData.bookingUrl || waDigits) && (
        <section className="px-8 pb-3">
          <a
            href={cardData.bookingUrl || `https://wa.me/${waDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2.5 rounded-full px-5 py-[18px] text-[14px] font-bold tracking-[0.5px] transition-all hover:-translate-y-0.5"
            style={{
              background: primary,
              color: onPrimary,
              boxShadow: `0 10px 30px ${primary}4d`,
            }}
          >
            <MessageCircle size={20} strokeWidth={2} />
            {t.bookFirstSession}
          </a>
        </section>
      )}

      {/* CONTACT */}
      <section className="px-8 py-7">
        <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={primary} />
      </section>

      {/* SOCIAL */}
      {cardData.socials && (
        <section className="px-8 pb-5">
          <SocialRow socials={cardData.socials} variant="pill" accentHex={primary} />
        </section>
      )}

      {/* WALLET */}
      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="mx-8 mb-4 rounded-3xl border bg-white px-5 py-4"
          labelClassName="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-center"
        >
          <div style={{ ["--card-primary" as string]: primary }}>{walletSlot}</div>
        </WalletDock>
      )}

      {/* SEND / EXCHANGE */}
      <section className="mx-8 mb-5 rounded-3xl bg-white p-5" style={{ border: `1px solid ${HAIRLINE}` }}>
        <SendMyInfoSlot slug={slug} sourceQs="" primary={primary} locale={locale} />
        <ExchangeSlot slug={slug} primary={primary} locale={locale} />
      </section>

      {/* FOOTER */}
      <footer
        className="border-t px-8 py-7 text-center"
        style={{ borderColor: HAIRLINE, background: SURFACE_WARM }}
      >
        <div className="ps-editorial text-[14px]" style={{ color: primary }}>
          {cardData.website || cardData.company}
        </div>
        <div className="mt-1.5 text-[10.5px] tracking-[1px]" style={{ color: INK_SOFT }}>
          {cardData.company} · © {new Date().getFullYear()}
        </div>
        <div
          className="mt-3 inline-flex items-center gap-1.5 text-[11px]"
          style={{ color: INK_SOFT }}
        >
          <Shield size={11} strokeWidth={1.6} />
          {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold"
            style={{ color: primary }}
          >
            OpSolid
          </a>
        </div>
      </footer>
    </article>
  );
}

function PsAction({
  href,
  label,
  icon,
  primary,
  accent,
  external,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  primary: string;
  accent: string;
  external?: boolean;
}) {
  void primary;
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" as const } : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex flex-col items-center gap-2 rounded-[16px] bg-white px-2 py-3.5 text-center transition-all hover:-translate-y-0.5"
      style={{ border: `1px solid ${HAIRLINE}`, color: INK }}
    >
      <span
        className="flex h-10 w-10 items-center justify-center rounded-full"
        style={{ background: `${accent}40`, color: primary }}
      >
        {icon}
      </span>
      <span className="text-[11.5px] font-bold">{label}</span>
    </a>
  );
}

function PsSection({
  eyebrow,
  title,
  primary,
  children,
}: {
  eyebrow: string;
  title: string;
  primary: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-8 py-8">
      <div className="mb-5 text-center">
        <div className="text-[10.5px] font-bold uppercase tracking-[2.5px]" style={{ color: primary }}>
          {eyebrow}
        </div>
        <h2 className="ps-editorial mt-1.5 text-[22px] leading-[1.3]" style={{ color: INK }}>
          {title}
        </h2>
        <div className="mx-auto mt-3 block h-px w-8" style={{ background: primary }} aria-hidden />
      </div>
      {children}
    </section>
  );
}

function PsStat({
  n,
  l,
  accent,
  onPrimary,
  last,
}: {
  n: string;
  l: string;
  accent: string;
  onPrimary: string;
  last?: boolean;
}) {
  return (
    <div style={{ borderRight: last ? "none" : "1px solid rgba(255,255,255,0.15)" }}>
      <div className="ps-editorial text-[26px]" style={{ color: accent }}>
        {n}
      </div>
      <div
        className="mt-1.5 text-[10.5px] uppercase tracking-[1.4px] opacity-85"
        style={{ color: onPrimary }}
      >
        {l}
      </div>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const psychologistEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 25,
  key: "psychologist",
  name: "Psychologist",
  industry: "Psychologist / therapist / counsellor",
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
    logo: false,
  },
  defaults: { brandPrimaryHex: LOCKED_PRIMARY, brandAccentHex: LOCKED_ACCENT },
  sampleSlug: "demo-psychologist",
};

export const psychologistSample: SampleData = {
  templateId: 25,
  slug: "demo-psychologist",
  cardData: {
    name: "Uzm. Psk. Aylin Kara",
    position: "Klinische Psychologin",
    title: "Psikoterapist · CBT · EMDR",
    company: "Sicherer Raum Psychologie",
    phone: "+49 30 211 3456",
    whatsapp: "+49 170 211 3456",
    email: "aylin@psycho-berlin.de",
    website: "psycho-berlin.de",
    address: "Rosenthaler Str. 40, 10178 Berlin",
    bio: "Ich biete einen Raum, in dem Sie ohne Bewertung gehört werden — und in dem wir gemeinsam einen Weg finden, der zu Ihrem Leben passt.",
    services: [
      { title: "Einzeltherapie", description: "60 min", priceLabel: "€120" },
      { title: "Paartherapie", description: "90 min", priceLabel: "€160" },
      { title: "Online-Beratung", description: "50 min", priceLabel: "€90" },
    ],
    faqs: [
      { q: "Depression & Anxiety", a: "Kognitive Verhaltenstherapie zur Behandlung von Stimmungs- und Angststörungen." },
      { q: "Beziehungsberatung", a: "Paar- und Familiendynamik, Kommunikation und Bindung." },
      { q: "Trauma & EMDR", a: "EMDR Level 2 zur Verarbeitung traumatischer Erfahrungen." },
      { q: "Persönlichkeitsthemen", a: "Längerfristige Psychotherapie für tiefere zwischenmenschliche Arbeit." },
      { q: "Karriereberatung", a: "Burnout, Karriereübergänge und beruflicher Stress." },
      { q: "Klinische Psychologie M.Sc.", a: "Istanbul Universität · 2014 – 2016" },
      { q: "EMDR Level 2 Training", a: "EMDR Europe Akkreditierung · 2019" },
      { q: "Kognitive Verhaltenstherapie", a: "CBT Zertifikatsprogramm · 2017" },
    ],
    testimonials: [
      { author: "Anonim Danışan", quote: "Aylin Hanım ile çalışmak hayatımı değiştirdi. Güvenli ve destekleyici bir ortam sunuyor." },
    ],
    socials: { instagram: "https://instagram.com/guvenlialan.psikoloji" },
    sectorKey: "clinic",
  },
  photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
