"use client";

// =============================================================================
// ClinicPure — v2 template (id=69, key="clinic-pure").
//
// Sector: Doctor / Clinic — PURE variant. Mood: ultra-minimal medical
// precision; cream/white surface, generous whitespace, italic Source Serif
// callouts, DM Sans body. Inspired by kart_05_doktor_pure.html.
//
// Design DNA (different from default Clinic.tsx):
//   - White card on cream page background.
//   - Top eyebrow (clinic · city) followed by mega 54px sans-light name with
//     italic-serif role. No big medallion.
//   - Profile band: small 96×96 grayscale square photo + clinic credentials.
//   - Italic-serif 17px bio paragraph.
//   - Stats row (16y · 2.4K+ · 98%) hairline-bordered.
//   - Two-column education + specialties list with hairline dividers.
//   - Hairline contact + hours table.
//   - Stacked CTA grid (filled + line variants).
// =============================================================================

import * as React from "react";
import { linkify } from "@/lib/linkify";
import Image from "next/image";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { resolveLabels } from "./shared/resolveLabels";
import { resolveStats } from "./shared/profileExtras";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#f8fffe";
const LOCKED_ACCENT = "#0d6e8a";
const PAGE = "#f0f8f7";
const SURFACE = "#ffffff";
const INK = "#0f172a";
const INK_SOFT = "#64748b";
const HAIRLINE = "#e2e8f0";
const HAIRLINE_2 = "#eef2ef";

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
  educationH: string;
  specialtiesH: string;
  contactH: string;
  servicesH: string;
  bookBtn: string;
  emailBtn: string;
  mapBtn: string;
  phoneKey: string;
  emailKey: string;
  webKey: string;
  addressKey: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    educationH: "Ausbildung",
    specialtiesH: "Schwerpunkte",
    contactH: "Kontakt",
    servicesH: "Leistungen",
    bookBtn: "Termin anfragen",
    emailBtn: "E-Mail",
    mapBtn: "Anfahrt",
    phoneKey: "Telefon",
    emailKey: "E-Mail",
    webKey: "Web",
    addressKey: "Adresse",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    educationH: "Education",
    specialtiesH: "Specialties",
    contactH: "Contact",
    servicesH: "Services",
    bookBtn: "Request appointment",
    emailBtn: "Email",
    mapBtn: "Directions",
    phoneKey: "Phone",
    emailKey: "Email",
    webKey: "Web",
    addressKey: "Address",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    educationH: "Eğitim",
    specialtiesH: "Uzmanlık",
    contactH: "İletişim",
    servicesH: "Hizmetler",
    bookBtn: "Randevu Al",
    emailBtn: "E-posta",
    mapBtn: "Konum",
    phoneKey: "Telefon",
    emailKey: "E-posta",
    webKey: "Web",
    addressKey: "Adres",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
  es: {

    educationH: "Formación",
    specialtiesH: "Especialidades",
    contactH: "Contacto",
    servicesH: "Servicios",
    bookBtn: "Solicitar cita",
    emailBtn: "Correo",
    mapBtn: "Cómo llegar",
    phoneKey: "Teléfono",
    emailKey: "Correo",
    webKey: "Web",
    addressKey: "Dirección",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    educationH: "Formazione",
    specialtiesH: "Specialità",
    contactH: "Contatto",
    servicesH: "Servizi",
    bookBtn: "Richiedi appuntamento",
    emailBtn: "Email",
    mapBtn: "Indicazioni",
    phoneKey: "Telefono",
    emailKey: "Email",
    webKey: "Web",
    addressKey: "Indirizzo",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    educationH: "Formation",
    specialtiesH: "Spécialités",
    contactH: "Contact",
    servicesH: "Services",
    bookBtn: "Demander un rendez-vous",
    emailBtn: "E-mail",
    mapBtn: "Itinéraire",
    phoneKey: "Téléphone",
    emailKey: "E-mail",
    webKey: "Web",
    addressKey: "Adresse",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    educationH: "التعليم",
    specialtiesH: "التخصصات",
    contactH: "اتصال",
    servicesH: "الخدمات",
    bookBtn: "طلب موعد",
    emailBtn: "البريد الإلكتروني",
    mapBtn: "الاتجاهات",
    phoneKey: "هاتف",
    emailKey: "البريد الإلكتروني",
    webKey: "ويب",
    addressKey: "العنوان",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

export function ClinicPure({
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
  const stats = resolveStats(cardData.stats);
  const cityFromAddress = cardData.address?.split(",").slice(-1)[0]?.trim();

  // Split name to allow first-word italic em
  const nameParts = cardData.name.trim().split(/\s+/);
  const titleMatch = cardData.name.match(/^(Dr\.?|Prof\.?|Dipl\.?|Mr\.?|Mrs\.?|Ms\.?|Av\.?)\s+/i);
  let prefix = "";
  let restName = cardData.name;
  if (titleMatch) {
    prefix = titleMatch[1];
    restName = cardData.name.slice(titleMatch[0].length);
  } else {
    prefix = "";
    restName = nameParts.join(" ");
  }

  return (
    <article
      data-template="clinic-pure"
      className="cpure-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: PAGE, color: INK }}
    >
      <style jsx global>{`
        .cpure-card {
          font-family: var(--tpl-font-body, 'DM Sans', 'Inter', system-ui, sans-serif);
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
        }
        .cpure-card .serif {
          font-family: var(--tpl-font-display, 'Source Serif 4', 'Source Serif Pro', Georgia, serif);
        }
        .cpure-card a { color: inherit; }
      `}</style>

      <div
        className="px-8 pt-10 pb-12"
        style={{ background: SURFACE }}
      >
        {/* TOP EYEBROW */}
        <div
          className="mb-5 flex items-center gap-3 text-[11px] font-medium uppercase"
          style={{ color: accent, letterSpacing: "2.5px" }}
        >
          <span>
            {cardData.company}
            {cityFromAddress ? ` · ${cityFromAddress}` : ""}
          </span>
          <span aria-hidden className="block h-px flex-1" style={{ background: HAIRLINE }} />
        </div>

        {/* MEGA NAME */}
        <h1
          className="mb-1.5 text-[54px] leading-[1.02]"
          style={{
            fontWeight: 300,
            letterSpacing: "-2px",
            color: INK,
          }}
        >
          {prefix && (
            <span style={{ fontWeight: 600, color: accent }}>
              {prefix}
            </span>
          )}
          {prefix && <br />}
          {restName}
        </h1>
        {(cardData.title || cardData.position) && (
          <p
            className="serif mb-6 text-[18px] italic"
            style={{ color: INK_SOFT, fontWeight: 400 }}
          >
            {cardData.title || cardData.position}
          </p>
        )}

        {/* PROFILE BAND */}
        <div
          className="mb-8 grid items-center gap-[18px] py-5"
          style={{
            gridTemplateColumns: "96px 1fr",
            borderTop: `1px solid ${HAIRLINE}`,
            borderBottom: `1px solid ${HAIRLINE}`,
          }}
        >
          <div
            className="overflow-hidden"
            style={{ width: 96, height: 96, background: PAGE, borderRadius: 6 }}
          >
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={cardData.name}
                width={96}
                height={96}
                unoptimized
                className="block h-full w-full object-cover tpl-photo"
                style={{ filter: "grayscale(0.35) contrast(1.05)" }}
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-[24px]"
                style={{ color: accent, fontWeight: 600 }}
              >
                {cardData.name
                  .replace(/^(Dr\.?|Prof\.?)\s+/i, "")
                  .split(" ")
                  .map((p) => p[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")}
              </div>
            )}
          </div>
          <div>
            {cardData.title && (
              <div
                className="mb-1.5 text-[11px] font-medium uppercase"
                style={{ color: INK_SOFT, letterSpacing: "1.5px" }}
              >
                {[cardData.title, cardData.position].filter(Boolean).join(" — ")}
              </div>
            )}
            {cardData.bio && (
              <div
                className="serif text-[14px] italic leading-[1.5]"
                style={{ color: INK }}
              >
                {cardData.bio.split(".")[0]}.
              </div>
            )}
          </div>
        </div>

        {/* BIO ITALIC */}
        {cardData.bio && (
          <p
            className="serif mb-8 px-1 text-[17px] italic leading-[1.65]"
            style={{ color: INK, fontWeight: 400 }}
          >
            {cardData.bio}
          </p>
        )}

        {/* STATS — owner-entered proof numbers (resolveStats); none ⇒ nothing */}
        {stats && (
          <div
            className="mb-8 py-5"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
              gap: 12,
              borderTop: `1px solid ${HAIRLINE}`,
              borderBottom: `1px solid ${HAIRLINE}`,
            }}
          >
            {stats.map((s, i) => (
              <PureStat
                key={`stat-${i}-${s.label.slice(0, 8)}`}
                num={s.value}
                label={s.label}
                accent={accent}
                locale={locale}
              />
            ))}
          </div>
        )}

        {/* SERVICES */}
        {services.length > 0 && (
          <div className="mb-8">
            <h3
              className="mb-3.5 pb-2 text-[10.5px] font-semibold uppercase"
              style={{
                color: accent,
                letterSpacing: "2.5px",
                borderBottom: `1px solid ${HAIRLINE}`,
              }}
            >
              {t.servicesH}
            </h3>
            <ul className="list-none">
              {services.map((svc, i) => (
                <ServiceLink
                  key={`${svc.title}-${i}`}
                  href={svc.href}
                  className="py-2.5 text-[13px] leading-[1.6]"
                  style={{
                    color: INK,
                    borderBottom:
                      i < services.length - 1 ? `1px solid ${HAIRLINE_2}` : "none",
                  }}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span>{svc.title}</span>
                    {svc.priceLabel && (
                      <span
                        className="serif italic"
                        style={{ color: accent, fontSize: 12 }}
                      >
                        {svc.priceLabel}
                      </span>
                    )}
                  </div>
                  {svc.description && (
                    <div
                      className="mt-0.5 text-[11px]"
                      style={{ color: INK_SOFT }}
                    >
                      {linkify(svc.description)}
                    </div>
                  )}
                </ServiceLink>
              ))}
            </ul>
          </div>
        )}

        {/* CONTACT */}
        <div className="mb-8">
          <h3
            className="mb-3.5 pb-2 text-[10.5px] font-semibold uppercase"
            style={{
              color: accent,
              letterSpacing: "2.5px",
              borderBottom: `1px solid ${HAIRLINE}`,
            }}
          >
            {t.contactH}
          </h3>
          <ContactRows
            cardData={cardData}
            locale={locale}
            variant="hairline"
            accentHex={accent}
          />
        </div>

        {/* CTA STACK */}
        <div className="flex flex-col gap-2.5 mb-8">
          {(cardData.bookingUrl || waDigits || phoneDigits) && (
            <a
              href={
                cardData.bookingUrl ||
                (waDigits
                  ? `https://wa.me/${waDigits}?text=${encodeURIComponent(t.bookBtn)}`
                  : `tel:${phoneDigits}`)
              }
              target={cardData.bookingUrl || waDigits ? "_blank" : undefined}
              rel={cardData.bookingUrl || waDigits ? "noopener noreferrer" : undefined}
              className="flex items-center justify-center px-[22px] py-[16px] text-[13px] font-medium"
              style={{
                background: INK,
                color: SURFACE,
                borderRadius: 4,
                letterSpacing: "1px",
              }}
            >
              {t.bookBtn}
            </a>
          )}
          <div className="grid grid-cols-2 gap-2.5">
            {cardData.email && (
              <a
                href={`mailto:${cardData.email}`}
                className="flex items-center justify-center px-[22px] py-[14px] text-[13px] font-medium"
                style={{
                  background: "transparent",
                  border: `1px solid ${HAIRLINE}`,
                  color: INK,
                  borderRadius: 4,
                  letterSpacing: "1px",
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
                className="flex items-center justify-center px-[22px] py-[14px] text-[13px] font-medium"
                style={{
                  background: "transparent",
                  border: `1px solid ${HAIRLINE}`,
                  color: INK,
                  borderRadius: 4,
                  letterSpacing: "1px",
                }}
              >
                {t.mapBtn}
              </a>
            )}
          </div>
        </div>

        {/* WALLET / SEND / EXCHANGE */}
        <section className="mb-6 pt-7" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
          <ExchangeSlot slug={slug} primary={accent} locale={locale} />
        </section>

        {walletSlot && (
          <WalletDock
            label={t.walletLabel}
            className="-mx-8 border-t px-8 py-6"
            labelClassName="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-center"
          >
            <div style={{ ["--card-primary" as string]: accent }}>{walletSlot}</div>
          </WalletDock>
        )}

        {cardData.socials && (
          <section
            className="-mx-8 px-8 pt-6 pb-2"
            style={{ borderTop: `1px solid ${HAIRLINE}` }}
          >
            <SocialRow socials={cardData.socials} variant="pill" accentHex={accent} />
          </section>
        )}

        {/* FOOTER */}
        <footer
          className="-mx-8 mt-6 px-8 pt-6 text-center"
          style={{ borderTop: `1px solid ${HAIRLINE_2}` }}
        >
          <div
            className="serif text-[12px] italic"
            style={{ color: INK_SOFT }}
          >
            © {new Date().getFullYear()} {cardData.company || cardData.name} · {t.poweredBy}{" "}
            <a
              href="https://opsolid.de/products/digital-card"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: accent, fontWeight: 600 }}
            >
              OpSolid
            </a>
          </div>
        </footer>
      </div>
    </article>
  );
}

function PureStat({
  num,
  label,
  accent,
  locale,
}: {
  num: string;
  label: string;
  accent: string;
  locale: "de" | "en" | "tr" | "es" | "it" | "fr" | "ar";
}) {
  void accent;
  void locale;
  return (
    <div className="text-center">
      <div
        className="mb-1.5 text-[32px] leading-none"
        style={{ fontWeight: 300, color: INK, letterSpacing: "-1px" }}
      >
        {num}
      </div>
      <div
        className="text-[10px] font-medium uppercase"
        style={{ color: INK_SOFT, letterSpacing: "1.5px" }}
      >
        {label}
      </div>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const clinicPureEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 69,
  key: "clinic-pure",
  name: "Clinic — Pure",
  industry: "Doctor / Private clinic",
  supports: {
    services: true,
    faqs: false,
    testimonials: false,
    gallery: false,
    video: false,
    brochure: false,
    socials: true,
    themeSwitch: false,
    photo: true,
    logo: false,
  },
  defaults: {
    brandPrimaryHex: "#f8fffe",
    brandAccentHex: "#0d6e8a",
  },
  sampleSlug: "demo-clinic-pure",
};

// photo: Unsplash, doctor portrait. Unsplash License — free, no attribution required.
export const clinicPureSample: SampleData = {
  templateId: 69,
  slug: "demo-clinic-pure",
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
        description: "Ganzheitlicher Check-up — Labor, EKG, Lifestyle.",
        priceLabel: "ab €80",
      },
      {
        title: "Reisemedizin",
        description: "Impfungen, Beratung & Notfallset.",
        priceLabel: "€120",
      },
      {
        title: "Online-Konsultation",
        description: "Videosprechstunde, Rezept-Service.",
        priceLabel: "€60",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#f8fffe",
  brandAccentHex: "#0d6e8a",
};

