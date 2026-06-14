"use client";

// =============================================================================
// ClinicNoir — v2 template (id=68, key="clinic-noir").
//
// Sector: Doctor / Clinic — NOIR variant. Mood: dark midnight blue surface
// with cool silver/teal accents — premium private practice (Privatpraxis).
// Inspired by kart_05_doktor_noir.html.
//
// Design DNA (different from default Clinic.tsx):
//   - Pitch-dark midnight-blue surface with a sky-teal vertical pinstripe.
//   - Compact eyebrow header (M.D. caps + clinic name) — no big photo card.
//   - Profile block: 128px circular gold-teal gradient ring portrait.
//   - Name in serif italic with teal "Dr." prefix; credential chips below.
//   - Numbered (01..05) practice areas with teal left-rule cards.
//   - Clinic info card with dashed separators + glowing top hairline.
//   - Pull quote on darker panel with oversized teal quote glyph.
//   - Two-up CTA grid (mail/map) under primary book CTA.
//   - Footer: caps tracker on near-black band.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { Calendar, Mail, MessageCircle, Phone } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { resolveLabels } from "./shared/resolveLabels";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#0a1628";
const LOCKED_ACCENT = "#4fc3f7";
const SURFACE = "#080c10";
const SURFACE_2 = "#0f1318";
const SURFACE_3 = "#151c25";
const GOLD = "#c8a964";
const TEXT = "#e8ecf0";
const TEXT_SOFT = "rgba(232,236,240,0.72)";
const TEXT_MUTED = "rgba(232,236,240,0.45)";
const HAIRLINE = "rgba(79,195,247,0.18)";

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

interface Copy {
  metaLabel: string;
  practiceEyebrow: string;
  practiceH: string;
  clinicEyebrow: string;
  clinicH: string;
  contactEyebrow: string;
  contactH: string;
  bookBtn: string;
  callBtn: string;
  emailBtn: string;
  mapBtn: string;
  whatsappBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  addressKey: string;
  phoneKey: string;
  emailKey: string;
  webKey: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    metaLabel: "M.D. — Privatpraxis · Berlin",
    practiceEyebrow: "Praxisgebiete",
    practiceH: "Schwerpunkte",
    clinicEyebrow: "Praxis",
    clinicH: "Über die Praxis",
    contactEyebrow: "Kontakt",
    contactH: "Termin & Erreichbarkeit",
    bookBtn: "Termin anfragen",
    callBtn: "Anrufen",
    emailBtn: "E-Mail",
    mapBtn: "Anfahrt",
    whatsappBtn: "WhatsApp",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    addressKey: "Adresse",
    phoneKey: "Telefon",
    emailKey: "E-Mail",
    webKey: "Web",
  },
  en: {
    metaLabel: "M.D. — Private Practice · Berlin",
    practiceEyebrow: "Practice",
    practiceH: "Specialties",
    clinicEyebrow: "Clinic",
    clinicH: "About the practice",
    contactEyebrow: "Contact",
    contactH: "Bookings & contact",
    bookBtn: "Request appointment",
    callBtn: "Call",
    emailBtn: "Email",
    mapBtn: "Map",
    whatsappBtn: "WhatsApp",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    addressKey: "Address",
    phoneKey: "Phone",
    emailKey: "Email",
    webKey: "Web",
  },
  tr: {
    metaLabel: "M.D. — Özel Muayenehane · Berlin",
    practiceEyebrow: "Uzmanlık",
    practiceH: "Çalışma Alanları",
    clinicEyebrow: "Klinik",
    clinicH: "Muayenehane Hakkında",
    contactEyebrow: "İletişim",
    contactH: "Randevu & İletişim",
    bookBtn: "Randevu Al",
    callBtn: "Ara",
    emailBtn: "E-posta",
    mapBtn: "Harita",
    whatsappBtn: "WhatsApp",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    addressKey: "Adres",
    phoneKey: "Telefon",
    emailKey: "E-posta",
    webKey: "Web",
  },
  es: {

    metaLabel: "M.D. — Private Practice · Berlin",
    practiceEyebrow: "Despacho",
    practiceH: "Especialidades",
    clinicEyebrow: "Clínica",
    clinicH: "Sobre el despacho",
    contactEyebrow: "Contacto",
    contactH: "Reservas y contacto",
    bookBtn: "Solicitar cita",
    callBtn: "Llamar",
    emailBtn: "Correo",
    mapBtn: "Mapa",
    whatsappBtn: "WhatsApp",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
    addressKey: "Dirección",
    phoneKey: "Teléfono",
    emailKey: "Correo",
    webKey: "Web",
  
  },
  it: {

    metaLabel: "M.D. — Private Practice · Berlin",
    practiceEyebrow: "Studio",
    practiceH: "Specialità",
    clinicEyebrow: "Clinica",
    clinicH: "Sullo studio",
    contactEyebrow: "Contatto",
    contactH: "Prenotazioni e contatti",
    bookBtn: "Richiedi appuntamento",
    callBtn: "Chiama",
    emailBtn: "Email",
    mapBtn: "Mappa",
    whatsappBtn: "WhatsApp",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
    addressKey: "Indirizzo",
    phoneKey: "Telefono",
    emailKey: "Email",
    webKey: "Web",
  
  },
  fr: {

    metaLabel: "M.D. — Private Practice · Berlin",
    practiceEyebrow: "Cabinet",
    practiceH: "Spécialités",
    clinicEyebrow: "Clinique",
    clinicH: "À propos du cabinet",
    contactEyebrow: "Contact",
    contactH: "Réservations et contact",
    bookBtn: "Demander un rendez-vous",
    callBtn: "Appeler",
    emailBtn: "E-mail",
    mapBtn: "Carte",
    whatsappBtn: "WhatsApp",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
    addressKey: "Adresse",
    phoneKey: "Téléphone",
    emailKey: "E-mail",
    webKey: "Web",
  
  },
  ar: {

    metaLabel: "M.D. — Private Practice · Berlin",
    practiceEyebrow: "ممارسة",
    practiceH: "التخصصات",
    clinicEyebrow: "عيادة",
    clinicH: "عن المكتب",
    contactEyebrow: "اتصال",
    contactH: "الحجوزات والاتصال",
    bookBtn: "طلب موعد",
    callBtn: "اتصال",
    emailBtn: "البريد الإلكتروني",
    mapBtn: "الخريطة",
    whatsappBtn: "واتساب",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
    addressKey: "العنوان",
    phoneKey: "هاتف",
    emailKey: "البريد الإلكتروني",
    webKey: "ويب",
  
  },
};

export function ClinicNoir({
  slug,
  cardData,
  locale = "de",
  photoPath,
  brandPrimaryHex,
  brandAccentHex,
  walletSlot,
}: TemplateProps) {
  const t = resolveLabels(COPY[locale] ?? COPY.de, cardData.labels);
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;
  void primary;
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);
  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = (cardData.services ?? []).slice(0, 5);
  const testimonial = cardData.testimonials?.[0];

  let prefix = "";
  let restName = cardData.name;
  const titleMatch = cardData.name.match(/^(Dr\.?|Prof\.?|Dipl\.?|Mr\.?|Mrs\.?|Ms\.?|Av\.?)\s+/i);
  if (titleMatch) {
    prefix = titleMatch[1];
    restName = cardData.name.slice(titleMatch[0].length);
  }

  const credentials: string[] = [];
  if (cardData.title) credentials.push(cardData.title);
  if (cardData.position) credentials.push(cardData.position);

  const cityFromAddress = cardData.address?.split(",").slice(-1)[0]?.trim();

  return (
    <article
      data-template="clinic-noir"
      className="cnoir-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: TEXT }}
    >
      <style jsx global>{`
        .cnoir-card {
          font-family: var(--tpl-font-body, 'Inter', system-ui, sans-serif);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        .cnoir-card .serif {
          font-family: var(--tpl-font-display, 'Playfair Display', 'Cormorant Garamond', Georgia, serif);
        }
        .cnoir-card a { color: inherit; }
      `}</style>

      {/* HEADER — eyebrow only */}
      <header
        className="relative px-7 py-9"
        style={{
          background: SURFACE_2,
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        <span
          aria-hidden
          className="absolute left-0 top-6 bottom-6 w-[3px]"
          style={{
            background: `linear-gradient(180deg, ${accent} 0%, ${GOLD} 100%)`,
          }}
        />
        <div
          className="mb-3 text-[10.5px] font-medium uppercase"
          style={{ color: GOLD, letterSpacing: "3px" }}
        >
          {t.metaLabel}
        </div>
        {cardData.company && (
          <div
            className="serif text-[14px] font-light uppercase"
            style={{ color: TEXT_MUTED, letterSpacing: "1.5px" }}
          >
            {cardData.company}
          </div>
        )}
      </header>

      {/* PROFILE — circular gradient ring portrait */}
      <section
        className="px-7 py-9 text-center"
        style={{ background: SURFACE_2 }}
      >
        {photoUrl ? (
          <div
            className="mx-auto mb-5"
            style={{
              width: 128,
              height: 128,
              padding: 3,
              borderRadius: "9999px",
              background: `linear-gradient(135deg, ${accent} 0%, ${GOLD} 100%)`,
              boxShadow: `0 0 40px ${accent}33`,
            }}
          >
            <Image
              src={photoUrl}
              alt={cardData.name}
              width={122}
              height={122}
              unoptimized
              className="h-full w-full rounded-full object-cover tpl-photo"
              style={{
                border: `3px solid ${SURFACE_2}`,
                filter: "saturate(0.85) contrast(1.05)",
              }}
            />
          </div>
        ) : (
          <div
            className="serif mx-auto mb-5 flex items-center justify-center rounded-full text-[34px]"
            style={{
              width: 128,
              height: 128,
              background: `linear-gradient(135deg, ${accent}30 0%, ${GOLD}30 100%)`,
              border: `2px solid ${accent}`,
              color: accent,
            }}
          >
            +
          </div>
        )}
        <h1
          className="serif mb-1.5 text-[30px] leading-[1.15]"
          style={{ color: TEXT, letterSpacing: "0.5px", fontWeight: 400 }}
        >
          {prefix && (
            <em
              className="not-italic font-light italic"
              style={{ color: GOLD, fontStyle: "italic", fontWeight: 300, marginRight: 6 }}
            >
              {prefix}
            </em>
          )}
          {restName}
        </h1>
        {(cardData.title || cardData.position) && (
          <div
            className="mb-4 text-[12px] font-normal uppercase"
            style={{ color: accent, letterSpacing: "2.5px" }}
          >
            {cardData.title || cardData.position}
          </div>
        )}
        {credentials.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {credentials.slice(0, 4).map((c, i) => (
              <span
                key={`${c}-${i}`}
                className="inline-flex items-center px-3 py-[5px] text-[10.5px] font-medium uppercase"
                style={{
                  border: `1px solid ${i % 2 === 0 ? HAIRLINE : "rgba(200,169,100,0.35)"}`,
                  background:
                    i % 2 === 0
                      ? `${accent}10`
                      : "rgba(200,169,100,0.08)",
                  color: i % 2 === 0 ? TEXT : GOLD,
                  borderRadius: "999px",
                  letterSpacing: "1.5px",
                }}
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* QUICK CONTACT TILES */}
      <section
        className="grid grid-cols-3 gap-2.5 px-7 py-6"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        {phoneDigits && (
          <NoirAction
            href={`tel:${phoneDigits}`}
            Icon={Phone}
            label={t.callBtn}
            accent={accent}
          />
        )}
        {waDigits && (
          <NoirAction
            href={`https://wa.me/${waDigits}`}
            Icon={MessageCircle}
            label={t.whatsappBtn}
            accent={accent}
            external
          />
        )}
        {cardData.email && (
          <NoirAction
            href={`mailto:${cardData.email}`}
            Icon={Mail}
            label={t.emailBtn}
            accent={accent}
          />
        )}
      </section>

      {/* PRACTICE AREAS — numbered list */}
      {services.length > 0 && (
        <section
          className="px-7 pb-9 pt-7"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <NoirEyebrow accent={GOLD}>{t.practiceEyebrow}</NoirEyebrow>
          <h2
            className="serif mb-5 text-[22px]"
            style={{ color: TEXT, letterSpacing: "0.3px", fontWeight: 400 }}
          >
            {t.practiceH}
          </h2>
          <div className="flex flex-col gap-2.5">
            {services.map((svc, i) => (
              <ServiceLink
                key={`${svc.title}-${i}`}
                href={svc.href}
                className="flex items-start px-4 py-3.5"
                style={{
                  background: SURFACE_3,
                  borderLeft: `2px solid ${accent}`,
                  borderTopRightRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              >
                <span
                  className="serif mr-3.5 min-w-[28px] text-[13px] font-light"
                  style={{ color: GOLD, letterSpacing: "1px" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div
                    className="text-[13.5px] leading-snug"
                    style={{ color: TEXT, fontWeight: 400 }}
                  >
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div
                      className="mt-1 text-[12px]"
                      style={{ color: TEXT_MUTED }}
                    >
                      {svc.description}
                    </div>
                  )}
                  {svc.priceLabel && (
                    <div
                      className="mt-1.5 text-[10.5px] font-semibold uppercase"
                      style={{ color: accent, letterSpacing: "1.5px" }}
                    >
                      {svc.priceLabel}
                    </div>
                  )}
                </div>
              </ServiceLink>
            ))}
          </div>
        </section>
      )}

      {/* CLINIC INFO CARD */}
      <section
        className="px-7 pb-9 pt-7"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <NoirEyebrow accent={GOLD}>{t.clinicEyebrow}</NoirEyebrow>
        <h2
          className="serif mb-5 text-[22px]"
          style={{ color: TEXT, letterSpacing: "0.3px", fontWeight: 400 }}
        >
          {t.clinicH}
        </h2>
        <div
          className="relative px-6 py-5"
          style={{
            background: SURFACE_3,
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 10,
          }}
        >
          <span
            aria-hidden
            className="absolute left-6 right-6 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            }}
          />
          <ClinicLine label={t.addressKey} value={cardData.address || cityFromAddress || ""} />
          {cardData.phone && (
            <ClinicLine
              label={t.phoneKey}
              value={cardData.phone}
              href={`tel:${digitsOnly(cardData.phone)}`}
              accent={accent}
            />
          )}
          {cardData.email && (
            <ClinicLine
              label={t.emailKey}
              value={cardData.email}
              href={`mailto:${cardData.email}`}
              accent={accent}
            />
          )}
          {cardData.website && (
            <ClinicLine
              label={t.webKey}
              value={cardData.website}
              href={
                cardData.website.startsWith("http")
                  ? cardData.website
                  : `https://${cardData.website}`
              }
              accent={accent}
              external
            />
          )}
        </div>
        {cardData.bio && (
          <p
            className="mt-5 text-[13.5px] leading-[1.7]"
            style={{ color: TEXT_SOFT }}
          >
            {cardData.bio}
          </p>
        )}
      </section>

      {/* PULL QUOTE */}
      {testimonial && (
        <section
          className="px-7 py-12 text-center"
          style={{
            background: SURFACE_3,
            borderBottom: `1px solid ${HAIRLINE}`,
          }}
        >
          <span
            aria-hidden
            className="serif block leading-[0.5]"
            style={{ color: accent, opacity: 0.45, fontSize: "64px", marginBottom: 6 }}
          >
            {"“"}
          </span>
          <p
            className="serif mx-auto mb-5 max-w-[360px] text-[16.5px] italic leading-[1.65]"
            style={{ color: TEXT, letterSpacing: "-0.1px", fontWeight: 300 }}
          >
            {testimonial.quote}
          </p>
          <div
            className="inline-flex items-center gap-3 text-[10.5px] font-medium uppercase"
            style={{ color: GOLD, letterSpacing: "2px" }}
          >
            <span aria-hidden className="block h-px w-5" style={{ background: GOLD, opacity: 0.6 }} />
            <span>
              {testimonial.author}
              {testimonial.role ? ` · ${testimonial.role}` : ""}
            </span>
            <span aria-hidden className="block h-px w-5" style={{ background: GOLD, opacity: 0.6 }} />
          </div>
        </section>
      )}

      {/* CTA STACK */}
      <section className="px-7 pt-9 pb-2">
        {(cardData.bookingUrl || waDigits) && (
          <a
            href={
              cardData.bookingUrl ||
              `https://wa.me/${waDigits}?text=${encodeURIComponent(t.bookBtn)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 rounded-lg px-6 py-[18px] text-[12.5px] font-medium uppercase"
            style={{
              background: `linear-gradient(135deg, ${accent} 0%, ${GOLD}cc 100%)`,
              color: SURFACE,
              letterSpacing: "2px",
              boxShadow: `0 4px 24px ${accent}4d`,
            }}
          >
            <Calendar size={16} strokeWidth={1.8} />
            {t.bookBtn}
          </a>
        )}
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {cardData.email && (
            <a
              href={`mailto:${cardData.email}`}
              className="flex items-center justify-center rounded-lg px-4 py-[14px] text-[12px] font-medium uppercase"
              style={{
                border: `1px solid ${HAIRLINE}`,
                background: "transparent",
                color: TEXT,
                letterSpacing: "1.8px",
              }}
            >
              {t.emailBtn}
            </a>
          )}
          {cardData.address && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(cardData.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-lg px-4 py-[14px] text-[12px] font-medium uppercase"
              style={{
                border: `1px solid ${HAIRLINE}`,
                background: "transparent",
                color: TEXT,
                letterSpacing: "1.8px",
              }}
            >
              {t.mapBtn}
            </a>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section
        className="px-7 pb-9 pt-9"
        style={{ borderTop: `1px solid ${HAIRLINE}`, marginTop: 32 }}
      >
        <NoirEyebrow accent={GOLD}>{t.contactEyebrow}</NoirEyebrow>
        <h2
          className="serif mb-5 text-[22px]"
          style={{ color: TEXT, letterSpacing: "0.3px", fontWeight: 400 }}
        >
          {t.contactH}
        </h2>
        <ContactRows
          cardData={cardData}
          locale={locale}
          variant="hairline"
          accentHex={accent}
        />
      </section>

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="px-7 py-7"
        style={{ background: SURFACE_3, borderTop: `1px solid ${HAIRLINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
        <ExchangeSlot slug={slug} primary={accent} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="border-t px-7 py-6"
          labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-center"
        >
          <div
            style={{
              ["--card-primary" as string]: accent,
              color: TEXT,
              borderColor: HAIRLINE,
            }}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {cardData.socials && (
        <section
          className="px-7 py-6"
          style={{ borderTop: `1px solid ${HAIRLINE}` }}
        >
          <SocialRow socials={cardData.socials} variant="icon" accentHex={accent} />
        </section>
      )}

      {/* FOOTER */}
      <footer
        className="px-7 py-6 text-center text-[10px] uppercase"
        style={{
          background: "#05080b",
          color: TEXT_MUTED,
          letterSpacing: "2.5px",
          borderTop: `1px solid ${HAIRLINE}`,
        }}
      >
        <span style={{ color: GOLD }}>
          {cardData.company || cardData.name}
        </span>
        {" · "}© {new Date().getFullYear()} · {t.poweredBy}{" "}
        <a
          href="https://opsolid.de/products/digital-card"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold"
          style={{ color: accent }}
        >
          OpSolid
        </a>
      </footer>
    </article>
  );
}

function NoirEyebrow({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <div
      className="mb-3 flex items-center gap-3 text-[10px] font-medium uppercase"
      style={{ color: accent, letterSpacing: "3.5px" }}
    >
      <span aria-hidden className="block h-px w-6" style={{ background: accent }} />
      <span>{children}</span>
    </div>
  );
}

function NoirAction({
  href,
  label,
  Icon,
  accent,
  external,
}: {
  href: string;
  label: string;
  Icon: typeof Phone;
  accent: string;
  external?: boolean;
}) {
  const ext = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex items-center justify-center gap-2 rounded-md border px-3 py-3 text-[11px] font-medium uppercase transition-colors"
      style={{
        background: SURFACE_2,
        borderColor: HAIRLINE,
        color: accent,
        letterSpacing: "1.5px",
      }}
    >
      <Icon size={13} strokeWidth={1.7} />
      {label}
    </a>
  );
}

function ClinicLine({
  label,
  value,
  href,
  accent,
  external,
}: {
  label: string;
  value: string;
  href?: string;
  accent?: string;
  external?: boolean;
}) {
  if (!value) return null;
  const ext = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  return (
    <div
      className="flex items-start justify-between gap-3.5 py-2.5"
      style={{ borderBottom: `1px dashed ${HAIRLINE}` }}
    >
      <span
        className="flex-shrink-0 text-[10px] font-medium uppercase"
        style={{ color: TEXT_MUTED, letterSpacing: "2px" }}
      >
        {label}
      </span>
      <span
        className="text-right text-[12.5px] leading-[1.5]"
        style={{ color: TEXT }}
      >
        {href ? (
          <a
            href={href}
            {...ext}
            style={{
              color: TEXT,
              borderBottom: `1px solid ${accent ? accent + "44" : HAIRLINE}`,
            }}
          >
            {value}
          </a>
        ) : (
          value
        )}
      </span>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const clinicNoirEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 68,
  key: "clinic-noir",
  name: "Clinic — Noir",
  industry: "Doctor / Private clinic",
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
    logo: false,
  },
  defaults: {
    brandPrimaryHex: "#0a1628",
    brandAccentHex: "#4fc3f7",
  },
  sampleSlug: "demo-clinic-noir",
};

// photo: Unsplash, doctor portrait. Unsplash License — free, no attribution required.
export const clinicNoirSample: SampleData = {
  templateId: 68,
  slug: "demo-clinic-noir",
  cardData: {
    name: "Dr. Ayşe Demir",
    position: "Fachärztin",
    title: "Allgemeinmedizin & Präventivmedizin",
    company: "Praxis am Ku'damm",
    email: "ayse@praxis-demir.de",
    phone: "+49 30 334 5678",
    whatsapp: "+49 170 334 5678",
    website: "praxis-demir.de",
    address: "Kurfürstendamm 188, 10707 Berlin",
    bio: "Fachärztin für Allgemeinmedizin & Präventivmedizin. Individuell, ganzheitlich, digital erreichbar.",
    bookingUrl: "https://cal.com/praxis-demir/intro",
    brochureUrl: "https://praxis-demir.de/profil.pdf",
    impressumUrl: "https://praxis-demir.de/impressum",
    privacyUrl: "https://praxis-demir.de/datenschutz",
    sectorKey: "clinic",
    socials: {
      linkedin: "https://linkedin.com/in/ayse-demir-md",
      instagram: "https://instagram.com/praxis.demir",
    },
    services: [
      {
        title: "Vorsorgeuntersuchung",
        description: "Ganzheitlicher Check-up — Labor, EKG, Lifestyle-Beratung.",
        priceLabel: "ab €80",
      },
      {
        title: "Reisemedizin",
        description: "Impfungen, Beratung & Notfallset für individuelle Reisen.",
        priceLabel: "€120",
      },
      {
        title: "Online-Konsultation",
        description: "Videosprechstunde, Rezept-Service, sichere Plattform.",
        priceLabel: "€60",
      },
    ],
    testimonials: [
      {
        author: "Mehmet K.",
        role: "Patient — Vorsorge",
        quote:
          "Sehr aufmerksam, nimmt sich Zeit und erklärt alles verständlich. Genau die Praxis, die ich gesucht habe.",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#0a1628",
  brandAccentHex: "#4fc3f7",
};

