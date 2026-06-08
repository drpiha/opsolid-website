"use client";

// =============================================================================
// BarberPure — v2 template (id=77, key="barber-pure").
//
// Sector: Barber / Men's grooming — PURE variant. Mood: Japanese barbershop
// precision, near-white surface, tightly tracked DM Sans display + Source
// Serif italic accents. Inspired by kart_07_berber_pure.html.
//
// Design DNA (different from Barber.tsx id=7, BarberNoir/Vivid/Stone):
//   - Eyebrow with gold dot + flex hairline rule.
//   - Display name: light DM Sans 58px clamp with semibold "second" word.
//   - Square 96px grayscale photo + serif-italic credentials line.
//   - Italic Source-Serif bio block.
//   - Stats: extra-light 32px digits with mono-uppercase labels.
//   - Service menu row: name + italic descriptor / right-aligned price; featured
//     row reads as a warm cream pill.
//   - Hours table with gold dot prefix on "today" row.
//   - Contact list: 90px label column over hairline rules.
//   - CTA stack: ink-fill primary + ghost row + outline website btn.
// =============================================================================

import * as React from "react";
import Image from "next/image";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#f5f0e8";
const LOCKED_ACCENT = "#1a1a1a";
const PAGE = "#f4f4f2";
const SURFACE = "#ffffff";
const SURFACE_2 = "#faf9f6";
const INK = "#111111";
const MUTED = "#666666";
const LINE = "#e5e5e3";
const HAIRLINE = "#eeeeec";
const GOLD = "#c8a500";

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
  eyebrow: string;
  taglineFallback: string;
  yearsLabel: string;
  clientsLabel: string;
  followersLabel: string;
  menuH: string;
  hoursH: string;
  contactH: string;
  ctaH: string;
  bookBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    eyebrow: "Premium Barbershop",
    taglineFallback: "Master Barber & Stylist",
    yearsLabel: "Jahre",
    clientsLabel: "Kunden",
    followersLabel: "Follower",
    menuH: "Service Menü",
    hoursH: "Öffnungszeiten",
    contactH: "Kontakt",
    ctaH: "Termin buchen",
    bookBtn: "Termin reservieren",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    eyebrow: "Premium Barbershop",
    taglineFallback: "Master Barber & Stylist",
    yearsLabel: "Years",
    clientsLabel: "Clients",
    followersLabel: "Followers",
    menuH: "Service Menu",
    hoursH: "Hours",
    contactH: "Contact",
    ctaH: "Book appointment",
    bookBtn: "Book appointment",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    eyebrow: "Premium Berber",
    taglineFallback: "Master Berber & Stylist",
    yearsLabel: "Yıl",
    clientsLabel: "Müşteri",
    followersLabel: "Takipçi",
    menuH: "Hizmet Menüsü",
    hoursH: "Çalışma Saatleri",
    contactH: "İletişim",
    ctaH: "Randevu",
    bookBtn: "Randevu Al",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
  es: {

    eyebrow: "Barbería premium",
    taglineFallback: "Maestro barbero y estilista",
    yearsLabel: "Años",
    clientsLabel: "Clientes",
    followersLabel: "Seguidores",
    menuH: "Carta de servicios",
    hoursH: "Horario",
    contactH: "Contacto",
    ctaH: "Reservar cita",
    bookBtn: "Reservar cita",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    eyebrow: "Barbershop premium",
    taglineFallback: "Master Barber e Stylist",
    yearsLabel: "Anni",
    clientsLabel: "Clienti",
    followersLabel: "Follower",
    menuH: "Menù dei servizi",
    hoursH: "Orari",
    contactH: "Contatto",
    ctaH: "Prenota un appuntamento",
    bookBtn: "Prenota un appuntamento",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    eyebrow: "Barbershop premium",
    taglineFallback: "Maître barbier et styliste",
    yearsLabel: "Années",
    clientsLabel: "Clients",
    followersLabel: "Abonnés",
    menuH: "Carte des services",
    hoursH: "Horaires",
    contactH: "Contact",
    ctaH: "Prendre rendez-vous",
    bookBtn: "Prendre rendez-vous",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    eyebrow: "صالون حلاقة فاخر",
    taglineFallback: "حلاق رئيسي ومصفف",
    yearsLabel: "سنوات",
    clientsLabel: "العملاء",
    followersLabel: "متابعون",
    menuH: "قائمة الخدمات",
    hoursH: "ساعات العمل",
    contactH: "اتصال",
    ctaH: "حجز موعد",
    bookBtn: "حجز موعد",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

export function BarberPure({
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
  void primary;
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = (cardData.services ?? []).slice(0, 5);
  const cityFromAddress = cardData.address?.split(",").slice(-1)[0]?.trim();
  const nameParts = cardData.name.trim().split(/\s+/);
  const nameFirst = nameParts[0] ?? cardData.name;
  const nameLast = nameParts.slice(1).join(" ");

  return (
    <article
      data-template="barber-pure"
      className="barber-pure-card relative mx-auto w-full max-w-[460px]"
      style={{ background: SURFACE, color: INK }}
    >
      <style jsx global>{`
        .barber-pure-card {
          font-family: var(--tpl-font-body, 'DM Sans', 'Inter', system-ui, sans-serif);
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
        }
        .barber-pure-card .serif {
          font-family: var(--tpl-font-display, 'Source Serif Pro', 'Source Serif 4', 'Cormorant Garamond', serif);
        }
        .barber-pure-card a { color: inherit; }
      `}</style>

      <div className="px-8 pt-10 pb-12">
        {/* EYEBROW */}
        <div
          className="mb-5 flex items-center gap-3"
          style={{ fontSize: 11, fontWeight: 500, letterSpacing: "2.5px", color: INK }}
        >
          <span
            aria-hidden
            style={{ width: 6, height: 6, borderRadius: "50%", background: accent === "#1a1a1a" ? GOLD : accent }}
          />
          <span className="uppercase">
            {t.eyebrow}
            {cityFromAddress ? ` · ${cityFromAddress}` : ""}
          </span>
          <span aria-hidden className="flex-1" style={{ height: 1, background: LINE }} />
        </div>

        {/* DISPLAY NAME */}
        <h1
          style={{
            fontWeight: 300,
            fontSize: "clamp(44px, 12vw, 58px)",
            lineHeight: 0.95,
            letterSpacing: "-2.5px",
            color: INK,
            marginBottom: 8,
          }}
        >
          {nameFirst}
          {nameLast && (
            <>
              <br />
              <span style={{ fontWeight: 600 }}>{nameLast}</span>
            </>
          )}
        </h1>
        <p
          className="serif italic"
          style={{ fontSize: 18, color: MUTED, marginBottom: 32 }}
        >
          {cardData.title || cardData.position || t.taglineFallback}
        </p>

        {/* PROFILE BAND */}
        <div
          className="mb-8 grid items-center gap-[18px] py-5"
          style={{
            borderTop: `1px solid ${LINE}`,
            borderBottom: `1px solid ${LINE}`,
            gridTemplateColumns: "96px 1fr",
          }}
        >
          <div style={{ width: 96, height: 96, overflow: "hidden", background: PAGE }}>
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={cardData.name}
                width={96}
                height={96}
                unoptimized
                className="block h-full w-full object-cover tpl-photo"
                style={{ filter: "grayscale(0.5) contrast(1.05)" }}
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center"
                style={{ background: PAGE, color: INK, fontSize: 36, fontWeight: 600 }}
              >
                {nameFirst[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div
              className="uppercase mb-1.5"
              style={{ fontSize: 11, fontWeight: 500, letterSpacing: "1.5px", color: MUTED }}
            >
              {cardData.position || cardData.title || t.taglineFallback}
            </div>
            <div
              className="serif italic"
              style={{ fontSize: 14, color: INK, lineHeight: 1.5 }}
            >
              {cardData.company || cardData.bio?.split(".")[0] || ""}
            </div>
          </div>
        </div>

        {/* BIO */}
        {cardData.bio && (
          <p
            className="serif italic mb-9"
            style={{ fontSize: 17, lineHeight: 1.65, color: INK }}
          >
            {cardData.bio}
          </p>
        )}

        {/* STATS */}
        <div
          className="mb-9 grid grid-cols-3 gap-3 py-5"
          style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}
        >
          {[
            { num: "15", label: t.yearsLabel, suffix: "" },
            { num: "5K", label: t.clientsLabel, suffix: "+" },
            { num: "32", label: t.followersLabel, suffix: "K" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div
                style={{
                  fontWeight: 300,
                  fontSize: 32,
                  letterSpacing: "-1px",
                  color: INK,
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {s.num}
                <span style={{ fontSize: 14, color: MUTED }}>{s.suffix}</span>
              </div>
              <div
                className="uppercase"
                style={{ fontSize: 10, fontWeight: 500, letterSpacing: "1.5px", color: MUTED }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* MENU */}
        {services.length > 0 && (
          <div className="mb-9">
            <h3
              className="uppercase mb-3.5 pb-2"
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: "2.5px",
                color: INK,
                borderBottom: `1px solid ${LINE}`,
              }}
            >
              {t.menuH}
            </h3>
            {services.map((svc, i) => {
              const featured = i === services.length - 1 && services.length > 2;
              return (
                <ServiceLink
                  key={`${svc.title}-${i}`}
                  href={svc.href}
                  className="grid items-baseline gap-3"
                  style={{
                    gridTemplateColumns: "1fr auto",
                    padding: featured ? "14px 12px" : "12px 0",
                    background: featured ? SURFACE_2 : "transparent",
                    border: featured ? `1px solid ${LINE}` : "none",
                    borderRadius: featured ? 4 : 0,
                    margin: featured ? "0 -12px" : "0",
                    borderBottom: featured
                      ? `1px solid ${LINE}`
                      : i < services.length - 1
                      ? `1px solid ${HAIRLINE}`
                      : "none",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: featured ? 600 : 500,
                        color: INK,
                        lineHeight: 1.35,
                      }}
                    >
                      {svc.title}
                    </div>
                    {svc.description && (
                      <div
                        className="serif italic mt-0.5"
                        style={{ fontSize: 12, color: MUTED }}
                      >
                        {svc.description}
                      </div>
                    )}
                  </div>
                  {svc.priceLabel && (
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: featured ? GOLD : INK,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {svc.priceLabel}
                    </div>
                  )}
                </ServiceLink>
              );
            })}
          </div>
        )}

        {/* CONTACT */}
        <div className="mb-9">
          <h3
            className="uppercase mb-3.5 pb-2"
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "2.5px",
              color: INK,
              borderBottom: `1px solid ${LINE}`,
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

        {/* CTA */}
        <div className="mb-9 flex flex-col gap-2.5">
          {(cardData.bookingUrl || waDigits) && (
            <a
              href={
                cardData.bookingUrl ||
                `https://wa.me/${waDigits}?text=${encodeURIComponent(t.bookBtn)}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-6 py-4"
              style={{
                background: INK,
                color: SURFACE,
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "1px",
                borderRadius: 4,
              }}
            >
              {t.bookBtn}
            </a>
          )}
          {cardData.email && (
            <a
              href={`mailto:${cardData.email}`}
              className="flex items-center justify-center px-6 py-4"
              style={{
                background: "transparent",
                color: INK,
                border: `1px solid ${LINE}`,
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "1px",
                borderRadius: 4,
              }}
            >
              {cardData.email}
            </a>
          )}
        </div>

        {cardData.socials && (
          <div className="mb-9">
            <SocialRow socials={cardData.socials} variant="tile" accentHex={accent} />
          </div>
        )}

        {/* WALLET / SEND / EXCHANGE */}
        <div className="mb-2 pt-7" style={{ borderTop: `1px solid ${LINE}` }}>
          <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
          <ExchangeSlot slug={slug} primary={accent} locale={locale} />
        </div>

        {walletSlot && (
          <WalletDock
            label={t.walletLabel}
            className="py-4"
            labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-center"
          >
            <div
              style={{
                ["--card-primary" as string]: accent,
                color: INK,
              }}
            >
              {walletSlot}
            </div>
          </WalletDock>
        )}

        {/* FOOTER */}
        <footer
          className="serif italic pt-6 text-center"
          style={{ fontSize: 12, color: MUTED, borderTop: `1px solid ${HAIRLINE}` }}
        >
          © {new Date().getFullYear()} {cardData.company || cardData.name}
          <div className="mt-2" style={{ color: MUTED }}>
            {t.poweredBy}{" "}
            <a
              href="https://opsolid.de/products/digital-card"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: INK }}
            >
              OpSolid
            </a>
          </div>
        </footer>
      </div>
    </article>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const barberPureEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 77,
  key: "barber-pure",
  name: "Barber — Pure",
  industry: "Barber / Japanese-precision barbershop",
  supports: {
    services: true,
    faqs: false,
    testimonials: false,
    gallery: false,
    video: false,
    brochure: true,
    socials: true,
    themeSwitch: false,
    photo: true,
    logo: false,
  },
  defaults: {
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-barber-pure",
};

// photo: Unsplash, https://unsplash.com/photos/jqe5lY4ROMQ — Free, no attribution required.
export const barberPureSample: SampleData = {
  templateId: 77,
  slug: "demo-barber-pure",
  cardData: {
    name: "Tarkan Arslan",
    position: "Master Barber & Inhaber",
    title: "Master Barber & Inhaber",
    company: "TA Barbershop Berlin",
    email: "tarkan@tabarbershop.de",
    phone: "+49 176 223 4568",
    whatsapp: "+49 176 223 4568",
    website: "tabarbershop.de",
    address: "Friedrichstraße 88, 10117 Berlin",
    bio: "Master Barber seit 15 Jahren. Klassischer Herrenschnitt, Heißrasur, Premium Fades. Termine online.",
    bookingUrl: "https://cal.com/tabarbershop/booking",
    impressumUrl: "https://tabarbershop.de/impressum",
    privacyUrl: "https://tabarbershop.de/datenschutz",
    sectorKey: "salon",
    socials: {
      instagram: "https://instagram.com/ta.barbershop",
    },
    services: [
      { title: "Premium Haarschnitt", description: "Beratung, Schnitt, Styling.", priceLabel: "â‚¬35" },
      { title: "Heißrasur", description: "Klassische Rasur mit heißem Tuch.", priceLabel: "â‚¬28" },
      { title: "Kombination", description: "Schnitt + Heißrasur in einem Termin.", priceLabel: "â‚¬55" },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

