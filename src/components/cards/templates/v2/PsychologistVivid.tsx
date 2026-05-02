"use client";

// =============================================================================
// PsychologistVivid â€” v2 template (id=27, key="psychologist-vivid").
//
// Sector: psychologist â€” VIVID variant. Mood: deep indigo/violet gradient,
// warm, modern. Inspired by kart_12_psikolog_vivid.html.
//
// Locked design DNA (only colors respond to brand):
//   - Centered hero: indigo/violet gradient with decorative blob halos +
//     pill ("New clients welcome") + bold sans name.
//   - Floating circular avatar (-64 px) framed in white.
//   - Big primary CTA right under (Request first session Â· free intro).
//   - 3-up quick action row (Phone/Email/Instagram).
//   - Session packages 3-up tiles: middle one featured (gradient-fill).
//   - Specialty pills (round pills with single-letter accent dots).
//   - Stats panel on dark gradient with gradient-text numbers.
//   - Testimonial gradient card with quote glyph.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  CalendarCheck,
  Heart,
  Mail,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#7c3aed";
const LOCKED_ACCENT = "#a78bfa";
const SURFACE = "#ffffff";
const PAGE = "#faf8ff";
const SOFT = "#ede9fe";
const INK = "#1a1825";
const INK_SOFT = "#6b6781";
const HAIRLINE = "#e9e4f5";

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

interface PsvCopy {
  newClients: string;
  bookFirst: string;
  bookHint: string;
  call: string;
  email: string;
  ig: string;
  packages: string;
  popular: string;
  specialties: string;
  experience: string;
  sessions: string;
  formats: string;
  saveContact: string;
  walletLabel: string;
  share: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr", PsvCopy> = {
  de: {
    newClients: "Neue Klient:innen willkommen",
    bookFirst: "ErstgesprÃ¤ch anfragen",
    bookHint: "Kostenloses Kennenlernen",
    call: "Telefon",
    email: "E-Mail",
    ig: "Instagram",
    packages: "Sitzungspakete",
    popular: "Beliebt",
    specialties: "Schwerpunkte",
    experience: "Jahre",
    sessions: "Sitzungen",
    formats: "Formate",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    share: "Teilen",
    poweredBy: "Powered by",
  },
  en: {
    newClients: "New clients welcome",
    bookFirst: "Request first session",
    bookHint: "Free intro call",
    call: "Phone",
    email: "Email",
    ig: "Instagram",
    packages: "Session packages",
    popular: "Popular",
    specialties: "Focus areas",
    experience: "Years",
    sessions: "Sessions",
    formats: "Formats",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    share: "Share",
    poweredBy: "Powered by",
  },
  tr: {
    newClients: "Yeni DanÄ±ÅŸanlara AÃ§Ä±ÄŸÄ±m",
    bookFirst: "Ä°lk GÃ¶rÃ¼ÅŸme Talep Et",
    bookHint: "Ãœcretsiz tanÄ±ÅŸma seansÄ±",
    call: "Telefon",
    email: "E-posta",
    ig: "Instagram",
    packages: "Seans Paketleri",
    popular: "PopÃ¼ler",
    specialties: "Ã‡alÄ±ÅŸma AlanlarÄ±",
    experience: "YÄ±l Deneyim",
    sessions: "Seans",
    formats: "Format",
    saveContact: "KiÅŸiyi Kaydet",
    walletLabel: "CÃ¼zdana ekle",
    share: "PaylaÅŸ",
    poweredBy: "Powered by",
  },
};

export function PsychologistVivid({
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
  const specialties = faqs.slice(0, 5);

  const heroGrad = `linear-gradient(135deg, ${primary}cc 0%, ${primary} 50%, ${accent} 100%)`;

  return (
    <article
      data-template="psychologist-vivid"
      className="psv-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: SURFACE,
        color: INK,
        fontFamily: "'Poppins', system-ui, sans-serif",
      }}
    >
      <style jsx global>{`
        .psv-card { line-height: 1.6; }
        .psv-card a { color: inherit; }
      `}</style>

      {/* HERO */}
      <header
        className="relative overflow-hidden px-7 pb-20 pt-9 text-center"
        style={{ background: heroGrad, color: onPrimary }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-[300px] w-[300px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 65%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-24 h-[320px] w-[320px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
          }}
        />
        <span
          className="relative z-10 mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[1px] backdrop-blur-md"
          style={{
            background: onPrimary === "#1a1a1a" ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.18)",
            border: `1px solid ${onPrimary === "#1a1a1a" ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.32)"}`,
          }}
        >
          <span
            className="block h-1.5 w-1.5 rounded-full"
            style={{ background: "#4ade80", boxShadow: "0 0 0 4px rgba(74,222,128,0.30)" }}
          />
          {t.newClients}
        </span>
        <h1 className="relative z-10 text-[28px] font-bold leading-[1.15] tracking-[-0.6px]">
          {cardData.name}
        </h1>
        <div className="relative z-10 mt-2 text-[13.5px] font-normal opacity-90">
          {cardData.position} {cardData.title && `Â· ${cardData.title}`}
        </div>
      </header>

      {/* AVATAR */}
      <section className="relative z-10 -mt-16 text-center">
        <div className="inline-block rounded-full bg-white p-1.5" style={{ boxShadow: `0 18px 40px ${primary}40` }}>
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt=""
              width={232}
              height={232}
              unoptimized
              className="block h-[116px] w-[116px] rounded-full object-cover tpl-photo"
            />
          ) : (
            <div
              className="flex h-[116px] w-[116px] items-center justify-center rounded-full text-white"
              style={{ background: heroGrad }}
            >
              <Heart size={36} strokeWidth={1.6} />
            </div>
          )}
        </div>
      </section>

      {/* MAIN CTA */}
      {(cardData.bookingUrl || waDigits) && (
        <section className="mx-[22px] mt-5">
          <a
            href={cardData.bookingUrl || `https://wa.me/${waDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2.5 rounded-[18px] px-5 py-[18px] text-[15px] font-bold transition-all hover:-translate-y-0.5"
            style={{
              background: heroGrad,
              color: onPrimary,
              boxShadow: `0 12px 30px -8px ${primary}66`,
            }}
          >
            <CalendarCheck size={22} strokeWidth={2.2} />
            <span className="text-left leading-tight">
              {t.bookFirst}
              <span className="block text-[11px] font-medium opacity-90">{t.bookHint}</span>
            </span>
          </a>
        </section>
      )}

      {/* QUICK ACTIONS */}
      <section className="grid grid-cols-3 gap-2.5 px-[22px] pt-5">
        {phoneDigits && (
          <PsvQA href={`tel:${phoneDigits}`} label={t.call} icon={<Phone size={18} strokeWidth={2.2} />} primary={primary} />
        )}
        {cardData.email && (
          <PsvQA href={`mailto:${cardData.email}`} label={t.email} icon={<Mail size={18} strokeWidth={2.2} />} primary={primary} />
        )}
        {cardData.socials?.instagram ? (
          <PsvQA
            href={cardData.socials.instagram}
            label={t.ig}
            icon={<MessageCircle size={18} strokeWidth={2.2} />}
            primary={primary}
            external
          />
        ) : waDigits ? (
          <PsvQA
            href={`https://wa.me/${waDigits}`}
            label="WhatsApp"
            icon={<MessageCircle size={18} strokeWidth={2.2} />}
            primary={primary}
            external
          />
        ) : null}
      </section>

      {/* PACKAGES */}
      {services.length > 0 && (
        <section className="px-[22px] py-7">
          <h3 className="mb-4 flex items-center gap-2 text-[16px] font-bold" style={{ color: INK }}>
            <span>{t.packages}</span>
            <span
              className="rounded-md px-2 py-0.5 text-[11px] font-semibold tabular-nums"
              style={{ background: SOFT, color: primary }}
            >
              {String(services.length).padStart(2, "0")}
            </span>
          </h3>
          <div className="grid grid-cols-3 gap-2.5">
            {services.slice(0, 3).map((s, i) => {
              const featured = i === 1;
              return (
                <article
                  key={`${s.title}-${i}`}
                  className="relative rounded-[18px] p-4 text-center transition-all hover:-translate-y-1"
                  style={
                    featured
                      ? {
                          background: heroGrad,
                          color: onPrimary,
                          border: `1.5px solid ${primary}`,
                        }
                      : { background: "#fff", border: `1.5px solid ${SOFT}`, color: INK }
                  }
                >
                  {featured && (
                    <span
                      className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.5px]"
                      style={{ background: "#fbbf24", color: "#1a1825" }}
                    >
                      {t.popular}
                    </span>
                  )}
                  <div
                    className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center"
                    aria-hidden
                  >
                    <Sparkles
                      size={20}
                      strokeWidth={2}
                      style={{ color: featured ? onPrimary : primary }}
                    />
                  </div>
                  <div
                    className="text-[11px] font-bold uppercase tracking-[0.6px]"
                    style={{ color: featured ? onPrimary : INK_SOFT, opacity: featured ? 0.9 : 1 }}
                  >
                    {s.title}
                  </div>
                  {s.priceLabel && (
                    <div
                      className="mt-1 text-[18px] font-extrabold tracking-[-0.4px]"
                      style={{ color: featured ? onPrimary : primary }}
                    >
                      {s.priceLabel}
                      {s.description && (
                        <small
                          className="block text-[9.5px] font-medium opacity-85"
                          style={{ color: featured ? onPrimary : INK_SOFT }}
                        >
                          {s.description}
                        </small>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* SPECIALTIES */}
      {specialties.length > 0 && (
        <section className="px-[22px] pb-7">
          <h3 className="mb-4 flex items-center gap-2 text-[16px] font-bold" style={{ color: INK }}>
            <span>{t.specialties}</span>
            <span
              className="rounded-md px-2 py-0.5 text-[11px] font-semibold tabular-nums"
              style={{ background: SOFT, color: primary }}
            >
              {String(specialties.length).padStart(2, "0")}
            </span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {specialties.map((s) => (
              <span
                key={s.q}
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold"
                style={{ background: SOFT, color: primary }}
              >
                <span
                  className="flex h-[18px] w-[18px] items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ background: primary }}
                  aria-hidden
                >
                  {s.q.charAt(0)}
                </span>
                {s.q}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* STATS */}
      <section
        className="mx-[22px] grid grid-cols-3 gap-2 rounded-[22px] p-6 text-white"
        style={{
          background: "linear-gradient(135deg, #1a1825 0%, #2d2638 100%)",
        }}
      >
        <PsvStat n="9" l={t.experience} accent={accent} last />
        <PsvStat n="800+" l={t.sessions} accent={accent} />
        <PsvStat n="2" l={t.formats} accent={accent} last />
      </section>

      {/* TESTIMONIAL */}
      {testimonials.length > 0 && (
        <section className="mx-[22px] mt-7">
          <article
            className="relative overflow-hidden rounded-[24px] p-6 text-white"
            style={{ background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`, color: onPrimary }}
          >
            <span
              aria-hidden
              className="absolute -top-2 right-5 select-none font-serif text-[100px] leading-none opacity-20"
            >
              &ldquo;
            </span>
            <div className="mb-3 text-[14px]" style={{ color: "#fbbf24", letterSpacing: "2px" }}>
              â˜…â˜…â˜…â˜…â˜…
            </div>
            <p className="text-[14.5px] font-medium leading-[1.6]">
              &ldquo;{testimonials[0].quote}&rdquo;
            </p>
            <div className="mt-3.5 text-[12px] font-semibold opacity-90">
              â€” {testimonials[0].author}
              {testimonials[0].role && `, ${testimonials[0].role}`}
            </div>
          </article>
        </section>
      )}

      {/* CONTACT */}
      <section className="px-[22px] py-7">
        <h3 className="mb-4 text-[16px] font-bold" style={{ color: INK }}>
          Kontakt
        </h3>
        <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={primary} />
      </section>

      {/* SOCIAL */}
      {cardData.socials && (
        <section className="px-[22px] pb-5">
          <SocialRow socials={cardData.socials} variant="pill" accentHex={primary} />
        </section>
      )}

      {/* WALLET */}
      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="mx-[22px] mb-4 rounded-3xl border bg-white px-5 py-4"
          labelClassName="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-center"
        >
          <div style={{ ["--card-primary" as string]: primary }}>{walletSlot}</div>
        </WalletDock>
      )}

      {/* SEND / EXCHANGE */}
      <section
        className="mx-[22px] mb-5 rounded-3xl bg-white p-5"
        style={{ border: `1px solid ${HAIRLINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={primary} locale={locale} />
        <ExchangeSlot slug={slug} primary={primary} locale={locale} />
      </section>

      {/* FOOTER */}
      <footer
        className="px-[22px] py-7 text-center"
        style={{ background: `linear-gradient(180deg, transparent, ${SOFT})` }}
      >
        <div className="text-[13px] font-extrabold" style={{ color: primary }}>
          {cardData.website || cardData.company}
        </div>
        <div className="mt-1 text-[11px]" style={{ color: INK_SOFT }}>
          {cardData.company} Â· Â© {new Date().getFullYear()}
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

function PsvQA({
  href,
  label,
  icon,
  primary,
  external,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  primary: string;
  external?: boolean;
}) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" as const } : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex flex-col items-center gap-2 rounded-[14px] px-1.5 py-3.5 text-center transition-all hover:-translate-y-0.5"
      style={{ background: PAGE, border: `1px solid ${SOFT}`, color: INK }}
    >
      <span
        className="flex h-[38px] w-[38px] items-center justify-center rounded-[12px] bg-white"
        style={{ color: primary }}
      >
        {icon}
      </span>
      <span className="text-[11px] font-semibold">{label}</span>
    </a>
  );
}

function PsvStat({
  n,
  l,
  accent,
  last,
}: {
  n: string;
  l: string;
  accent: string;
  last?: boolean;
}) {
  return (
    <div
      className="text-center"
      style={{ borderRight: last ? "none" : "1px solid rgba(255,255,255,0.10)" }}
    >
      <div
        className="text-[24px] font-extrabold"
        style={{
          background: `linear-gradient(135deg, ${accent}, #d8b4fe)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {n}
      </div>
      <div className="mt-1 text-[10px] opacity-70">{l}</div>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const psychologistVividEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 27,
  key: "psychologist-vivid",
  name: "Psychologist â€” Vivid",
  industry: "Psychologist / therapist (vivid gradient variant)",
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
  sampleSlug: "demo-psychologist-vivid",
};

export const psychologistVividSample: SampleData = {
  templateId: 27,
  slug: "demo-psychologist-vivid",
  cardData: {
    name: "Aylin Kara",
    position: "Klinische Psychologin",
    title: "Psikoterapist",
    company: "Sicherer Raum Psychologie",
    phone: "+49 30 211 3456",
    whatsapp: "+49 170 211 3456",
    email: "aylin@psycho-berlin.de",
    website: "psycho-berlin.de",
    address: "Rosenthaler Str. 40, 10178 Berlin",
    bio: "Ein geschÃ¼tzter Raum, in dem wir gemeinsam an dem arbeiten, was Ihr Leben zum Leuchten bringt.",
    bookingUrl: "https://wa.me/491702113456?text=ErstgesprÃ¤ch",
    services: [
      { title: "Einzeltherapie", description: "60 min", priceLabel: "â‚¬120" },
      { title: "Paartherapie", description: "90 min", priceLabel: "â‚¬160" },
      { title: "Online", description: "50 min", priceLabel: "â‚¬90" },
    ],
    faqs: [
      { q: "Depression", a: "Kurzzeit-CBT" },
      { q: "Beziehungen", a: "Paar/Familie" },
      { q: "Trauma", a: "EMDR Level 2" },
      { q: "PersÃ¶nlichkeit", a: "Langzeit" },
      { q: "Karriere", a: "Burnout" },
    ],
    testimonials: [
      { author: "Anonim DanÄ±ÅŸan", quote: "Aylin HanÄ±m ile Ã§alÄ±ÅŸmak hayatÄ±mÄ± deÄŸiÅŸtirdi. GÃ¼venli ve destekleyici bir ortam sunuyor." },
    ],
    socials: { instagram: "https://instagram.com/guvenlialan.psikoloji" },
    sectorKey: "clinic",
  },
  photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

