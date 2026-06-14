"use client";

// =============================================================================
// DentistVivid — v2 template (id=24, key="dentist-vivid").
//
// Sector: dental clinic — VIVID variant. Mood: bold teal/cyan gradient,
// energetic, modern. Inspired by kart_11_dis_hekimi_vivid.html.
//
// Locked design DNA (only colors respond to brand):
//   - Hero band with primary→accent diagonal gradient + decorative blob halos.
//   - Floating "card" (-64 px overlap) with portrait + rating badge.
//   - Big primary-gradient CTA at the top, then 3-up quick action row.
//   - Services as 2-col gradient-filled chips (no list of plain text).
//   - Stats band on dark navy panel with gradient-text numbers.
//   - Credential chips wrap.
//   - Hours strip with gradient icon column.
//   - Testimonial as gradient-filled card with serif quote glyph.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Star,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { resolveLabels } from "./shared/resolveLabels";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#0891b2";
const LOCKED_ACCENT = "#06b6d4";
const SURFACE = "#ffffff";
const PAGE = "#ecfeff";
const INK = "#0f172a";
const INK_SOFT = "#64748b";
const HAIRLINE = "#cffafe";

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

interface DnvCopy {
  online: string;
  bookCta: string;
  bookHint: string;
  call: string;
  email: string;
  ig: string;
  services: string;
  certifications: string;
  hours: string;
  testimonial: string;
  servicesLabel: string;
  reviewsLabel: string;
  saveContact: string;
  walletLabel: string;
  share: string;
  poweredBy: string;
  populari: string;
  contactHeading: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", DnvCopy> = {
  de: {
    online: "Online Termin",
    bookCta: "Schmerzfrei Termin buchen",
    bookHint: "24/7 via WhatsApp",
    call: "Anrufen",
    email: "E-Mail",
    ig: "Instagram",
    services: "Behandlungen",
    certifications: "Zertifikate",
    hours: "Praxisadresse",
    testimonial: "Stimmen",
    servicesLabel: "Behandlungen",
    reviewsLabel: "Bewertungen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    share: "Teilen",
    poweredBy: "Powered by",
    populari: "Beliebt",
    contactHeading: "Kontakt",
  },
  en: {
    online: "Online booking",
    bookCta: "Book a pain-free visit",
    bookHint: "24/7 via WhatsApp",
    call: "Call",
    email: "Email",
    ig: "Instagram",
    services: "Treatments",
    certifications: "Credentials",
    hours: "Practice address",
    testimonial: "Voices",
    servicesLabel: "Treatments",
    reviewsLabel: "Reviews",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    share: "Share",
    poweredBy: "Powered by",
    populari: "Popular",
    contactHeading: "Kontakt",
  },
  tr: {
    online: "Online Randevu",
    bookCta: "Ağrısız Randevu Al",
    bookHint: "7/24 WhatsApp ile",
    call: "Telefon",
    email: "E-posta",
    ig: "Instagram",
    services: "Hizmetler",
    certifications: "Sertifikalar",
    hours: "Klinik Adresi",
    testimonial: "Hasta Yorumu",
    servicesLabel: "Tedaviler",
    reviewsLabel: "Yorum",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    share: "Paylaş",
    poweredBy: "Powered by",
    populari: "Popüler",
    contactHeading: "Kontakt",
  },
  es: {

    online: "Reserva online",
    bookCta: "Reserva una visita sin dolor",
    bookHint: "24/7 por WhatsApp",
    call: "Llamar",
    email: "Correo",
    ig: "Instagram",
    services: "Tratamientos",
    certifications: "Credenciales",
    hours: "Dirección del despacho",
    testimonial: "Voces",
    servicesLabel: "Tratamientos",
    reviewsLabel: "Reseñas",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    share: "Compartir",
    poweredBy: "Desarrollado por",
    populari: "Popular",
    contactHeading: "Kontakt",

  },
  it: {

    online: "Prenotazione online",
    bookCta: "Prenota una visita senza dolore",
    bookHint: "24/7 via WhatsApp",
    call: "Chiama",
    email: "Email",
    ig: "Instagram",
    services: "Trattamenti",
    certifications: "Credenziali",
    hours: "Indirizzo dello studio",
    testimonial: "Voci",
    servicesLabel: "Trattamenti",
    reviewsLabel: "Recensioni",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    share: "Condividi",
    poweredBy: "Realizzato con",
    populari: "Popolari",
    contactHeading: "Kontakt",

  },
  fr: {

    online: "Réservation en ligne",
    bookCta: "Réserver une visite sans douleur",
    bookHint: "24/7 via WhatsApp",
    call: "Appeler",
    email: "E-mail",
    ig: "Instagram",
    services: "Soins",
    certifications: "Références",
    hours: "Adresse du cabinet",
    testimonial: "Témoignages",
    servicesLabel: "Soins",
    reviewsLabel: "Avis",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    share: "Partager",
    poweredBy: "Propulsé par",
    populari: "Populaires",
    contactHeading: "Kontakt",

  },
  ar: {

    online: "حجز إلكتروني",
    bookCta: "احجز زيارة بدون ألم",
    bookHint: "24/7 عبر واتساب",
    call: "اتصال",
    email: "البريد الإلكتروني",
    ig: "إنستغرام",
    services: "العلاجات",
    certifications: "المؤهلات",
    hours: "عنوان المكتب",
    testimonial: "أصوات",
    servicesLabel: "العلاجات",
    reviewsLabel: "التقييمات",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    share: "مشاركة",
    poweredBy: "مشغل بواسطة",
    populari: "شائع",
    contactHeading: "Kontakt",

  },
};

export function DentistVivid({
  slug,
  cardData,
  locale = "de",
  photoPath,
  logoPath,
  brandPrimaryHex,
  brandAccentHex,
  walletSlot,
}: TemplateProps) {
  const t = resolveLabels(COPY[locale] ?? COPY.de, cardData.labels);
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;
  const onPrimary = readableTextOn(primary);
  const photoUrl = resolveAssetUrl(photoPath);
  const logoUrl = resolveAssetUrl(logoPath);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];
  const credentials = cardData.faqs ?? [];
  const testimonials = cardData.testimonials ?? [];

  const heroGrad = `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`;

  return (
    <article
      data-template="dentist-vivid"
      className="dnv-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: SURFACE,
        color: INK,
        fontFamily: "'Poppins', system-ui, sans-serif",
      }}
    >
      <style jsx global>{`
        .dnv-card { line-height: 1.55; }
        .dnv-card a { color: inherit; }
      `}</style>

      {/* HERO */}
      <header
        className="relative overflow-hidden px-7 pb-24 pt-9"
        style={{ background: heroGrad, color: onPrimary }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-[260px] w-[260px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 65%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-12 h-[220px] w-[220px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 mb-6 flex items-center justify-between">
          <div className="text-[13px] font-extrabold uppercase tracking-[0.5px]">
            {cardData.company}
          </div>
          <span
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold backdrop-blur-md"
            style={{
              background: onPrimary === "#1a1a1a" ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.18)",
              border: `1px solid ${onPrimary === "#1a1a1a" ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.32)"}`,
            }}
          >
            <span
              className="block h-1.5 w-1.5 rounded-full"
              style={{ background: "#4ade80", boxShadow: "0 0 0 4px rgba(74,222,128,0.30)" }}
            />
            {t.online}
          </span>
        </div>
        <h1 className="relative z-10 text-[30px] font-extrabold leading-[1.1] tracking-[-0.7px]">
          {cardData.name}
        </h1>
        <div className="relative z-10 mt-2 text-[14px] font-medium opacity-90">
          {cardData.position} {cardData.title && `· ${cardData.title}`}
        </div>
      </header>

      {/* FLOATING CARD */}
      <section className="relative z-10 -mt-16 mx-[18px]">
        <div
          className="flex items-center gap-4 rounded-[24px] bg-white p-5"
          style={{ boxShadow: `0 20px 50px -20px ${primary}66` }}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              width={90}
              height={90}
              unoptimized
              className="h-[72px] w-[72px] flex-shrink-0 rounded-[22px] object-cover tpl-logo"
              style={{ border: "3px solid #fff", boxShadow: `0 4px 12px ${primary}33` }}
            />
          ) : photoUrl ? (
            <Image
              src={photoUrl}
              alt=""
              width={90}
              height={90}
              unoptimized
              className="h-[72px] w-[72px] flex-shrink-0 rounded-[22px] object-cover tpl-photo"
              style={{ border: "3px solid #fff", boxShadow: `0 4px 12px ${primary}33` }}
            />
          ) : (
            <div
              className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-[22px] text-white"
              style={{ background: heroGrad }}
            >
              <Sparkles size={26} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-[16px] font-bold leading-tight">{cardData.name}</div>
            {(cardData.position || cardData.title) && (
              <div className="mt-1 text-[12px]" style={{ color: INK_SOFT }}>
                {cardData.position || cardData.title}
              </div>
            )}
            {testimonials.length > 0 && (
              <span
                className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}
              >
                <Star size={10} fill="currentColor" strokeWidth={0} /> {testimonials.length}
              </span>
            )}
          </div>
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
              {t.bookCta}
              <span className="block text-[11px] font-medium opacity-85">{t.bookHint}</span>
            </span>
          </a>
        </section>
      )}

      {/* QUICK ACTIONS */}
      <section className="grid grid-cols-3 gap-2.5 px-[22px] pt-5">
        {phoneDigits && (
          <VividQA href={`tel:${phoneDigits}`} label={t.call} icon={<Phone size={18} strokeWidth={2.2} />} primary={primary} />
        )}
        {cardData.email && (
          <VividQA href={`mailto:${cardData.email}`} label={t.email} icon={<Mail size={18} strokeWidth={2.2} />} primary={primary} />
        )}
        {cardData.socials?.instagram ? (
          <VividQA
            href={cardData.socials.instagram}
            label={t.ig}
            icon={<MessageCircle size={18} strokeWidth={2.2} />}
            primary={primary}
            external
          />
        ) : waDigits ? (
          <VividQA
            href={`https://wa.me/${waDigits}`}
            label="WhatsApp"
            icon={<MessageCircle size={18} strokeWidth={2.2} />}
            primary={primary}
            external
          />
        ) : null}
      </section>

      {/* SERVICES */}
      {services.length > 0 && (
        <section className="px-[22px] py-7">
          <h3 className="mb-4 flex items-center gap-2 text-[16px] font-bold" style={{ color: INK }}>
            <span>{t.services}</span>
            <span
              className="rounded-md px-2 py-0.5 text-[11px] font-semibold tabular-nums"
              style={{ background: PAGE, color: primary }}
            >
              {String(services.length).padStart(2, "0")}
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {services.map((s, i) => (
              <ServiceLink
                key={`${s.title}-${i}`}
                href={s.href}
                className="relative overflow-hidden rounded-[18px] p-4 transition-all hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, ${PAGE} 0%, #f0fbfc 100%)`,
                  border: `1px solid ${HAIRLINE}`,
                }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-3 -top-3 h-12 w-12 rounded-full"
                  style={{ background: `radial-gradient(circle, ${primary}14 0%, transparent 70%)` }}
                />
                <div
                  className="relative z-10 mb-3 flex h-10 w-10 items-center justify-center rounded-[12px] text-white"
                  style={{ background: heroGrad }}
                >
                  <Sparkles size={18} strokeWidth={2.2} />
                </div>
                <div className="relative z-10 text-[13px] font-bold" style={{ color: INK }}>
                  {s.title}
                </div>
                {s.description && (
                  <div className="relative z-10 mt-0.5 text-[11px]" style={{ color: INK_SOFT }}>
                    {s.description}
                  </div>
                )}
                {s.priceLabel && (
                  <div className="relative z-10 mt-2 text-[12px] font-bold" style={{ color: primary }}>
                    {s.priceLabel}
                  </div>
                )}
              </ServiceLink>
            ))}
          </div>
        </section>
      )}

      {/* STATS — driven by real data */}
      {(() => {
        const statsItems = [
          ...(services.length ? [{ n: String(services.length), l: t.servicesLabel }] : []),
          ...(testimonials.length ? [{ n: String(testimonials.length), l: t.reviewsLabel }] : []),
        ];
        if (statsItems.length === 0) return null;
        return (
          <section
            className="mx-[22px] rounded-[22px] p-5 text-white"
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
              display: "grid",
              gridTemplateColumns: `repeat(${statsItems.length}, 1fr)`,
              gap: "0.5rem",
            }}
          >
            {statsItems.map((stat, i) => (
              <VividStat key={stat.l} n={stat.n} l={stat.l} primary={primary} accent={accent} last={i === statsItems.length - 1} />
            ))}
          </section>
        );
      })()}

      {/* CREDENTIAL CHIPS */}
      {credentials.length > 0 && (
        <section className="px-[22px] py-7">
          <h3 className="mb-4 text-[16px] font-bold" style={{ color: INK }}>
            {t.certifications}
          </h3>
          <div className="flex flex-wrap gap-2">
            {credentials.slice(0, 4).map((c, i) => (
              <span
                key={`${c.q}-${i}`}
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold"
                style={{
                  background: "#fff",
                  border: `1.5px solid ${HAIRLINE}`,
                  color: INK,
                }}
              >
                <CheckCircle2 size={14} strokeWidth={2.5} style={{ color: primary }} />
                {c.q}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ADDRESS STRIP */}
      {cardData.address && (
        <section className="px-[22px] pb-3">
          <div
            className="flex overflow-hidden rounded-[18px] bg-white"
            style={{ border: `1px solid ${HAIRLINE}` }}
          >
            <div
              className="flex w-[70px] items-center justify-center text-white"
              style={{ background: heroGrad }}
            >
              <Clock size={26} strokeWidth={2} />
            </div>
            <div className="flex-1 px-5 py-4">
              <div className="text-[11px] font-semibold" style={{ color: INK_SOFT }}>
                {t.hours}
              </div>
              <div className="mt-0.5 text-[14px] font-bold" style={{ color: INK }}>
                {cardData.address}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIAL */}
      {testimonials.length > 0 && (
        <section className="mx-[22px] mt-5">
          <article
            className="relative overflow-hidden rounded-[24px] p-6 text-white"
            style={{ background: heroGrad, color: onPrimary }}
          >
            <span
              aria-hidden
              className="absolute -top-2 right-5 select-none font-serif text-[100px] leading-none opacity-20"
            >
              &ldquo;
            </span>
            <div className="mb-3 text-[14px]" style={{ color: "#fbbf24", letterSpacing: "2px" }}>
              ★★★★★
            </div>
            <p className="text-[14px] font-medium leading-[1.6]">
              &ldquo;{testimonials[0].quote}&rdquo;
            </p>
            <div className="mt-3.5 text-[12px] font-semibold opacity-90">
              — {testimonials[0].author}
              {testimonials[0].role && `, ${testimonials[0].role}`}
            </div>
          </article>
        </section>
      )}

      {/* CONTACT */}
      <section className="px-[22px] py-7">
        <h3 className="mb-4 text-[16px] font-bold" style={{ color: INK }}>
          {t.contactHeading}
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
        style={{ background: `linear-gradient(180deg, transparent, ${PAGE})` }}
      >
        <div className="text-[13px] font-extrabold" style={{ color: primary }}>
          {cardData.website || cardData.company}
        </div>
        <div className="mt-1 text-[11px]" style={{ color: INK_SOFT }}>
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

function VividQA({
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
      className="flex flex-col items-center gap-1.5 rounded-[14px] px-1.5 py-3.5 text-center transition-all hover:-translate-y-0.5"
      style={{ background: "#f0fbfc", border: `1px solid ${HAIRLINE}`, color: INK }}
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-white"
        style={{ color: primary }}
      >
        {icon}
      </span>
      <span className="text-[11px] font-semibold">{label}</span>
    </a>
  );
}

function VividStat({
  n,
  l,
  primary,
  accent,
  last,
}: {
  n: string;
  l: string;
  primary: string;
  accent: string;
  last?: boolean;
}) {
  void primary;
  return (
    <div
      className="text-center"
      style={{ borderRight: last ? "none" : "1px solid rgba(255,255,255,0.10)" }}
    >
      <div
        className="text-[22px] font-extrabold"
        style={{
          background: `linear-gradient(135deg, ${accent}, #06d6a0)`,
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

export const dentistVividEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 24,
  key: "dentist-vivid",
  name: "Dentist — Vivid",
  industry: "Dental clinic / dentist (vivid gradient variant)",
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
  defaults: { brandPrimaryHex: LOCKED_PRIMARY, brandAccentHex: LOCKED_ACCENT },
  sampleSlug: "demo-dentist-vivid",
};

export const dentistVividSample: SampleData = {
  templateId: 24,
  slug: "demo-dentist-vivid",
  cardData: {
    name: "Dr. Burak Yılmaz",
    position: "Diş Hekimi · Implant Uzmanı",
    title: "Estetik & Cerrahi",
    company: "Estetik Diş Kliniği",
    phone: "+49 30 445 6789",
    whatsapp: "+49 170 445 6789",
    email: "burak@estetikdis.de",
    website: "estetikdis.de",
    address: "Kurfürstendamm 45, 10707 Berlin",
    bio: "Spezialist für ästhetische Zahnmedizin und Implantologie. Über 12 Jahre Erfahrung — vereinbaren Sie Ihr kostenloses Erstgespräch.",
    bookingUrl: "https://wa.me/491704456789?text=Termin",
    services: [
      { title: "Implant", description: "Tedavisi", priceLabel: "ab €1.200" },
      { title: "Zirkonyum", description: "Kaplama", priceLabel: "€680" },
      { title: "Beyazlatma", description: "Tek seansta", priceLabel: "€350" },
      { title: "Invisalign", description: "Şeffaf plak", priceLabel: "€3.900" },
    ],
    faqs: [
      { q: "ITI Implant Uzmanı", a: "Sertifikalı uzman" },
      { q: "Invisalign Provider", a: "Şeffaf plak ortodonti" },
      { q: "Smile Design Sert.", a: "Hollywood smile design" },
    ],
    testimonials: [
      {
        author: "Hande K.",
        role: "Memnun Hasta",
        quote: "Dr. Yılmaz sayesinde yıllardır çekimserlik duyduğum implant tedavisini yaptırdım. Ağrısız ve mükemmel sonuç.",
      },
    ],
    socials: { instagram: "https://instagram.com/estetikdis.berlin" },
    sectorKey: "clinic",
  },
  photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

