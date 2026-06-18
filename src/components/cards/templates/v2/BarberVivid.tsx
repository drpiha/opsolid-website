"use client";

// =============================================================================
// BarberVivid — v2 template (id=78, key="barber-vivid").
//
// Sector: Barber / Men's grooming — VIVID variant. Mood: bold red/black urban
// barbershop, gradient hero + floating profile card + tile-based service grid.
// Inspired by kart_07_berber_vivid.html.
//
// Design DNA (different from Barber.tsx id=7, BarberNoir/Pure/Stone):
//   - 200 px gradient hero (deep navy → midnight) with circle ornaments + tag
//     pill + shop name.
//   - Floating profile card (-90 mt) with 88 px gradient ring avatar + role +
//     badge pill row.
//   - 3-tile quick stats (rounded white cards with red→orange gradient digits).
//   - Service grid 2-col with featured row spanning both columns + dark hero
//     gradient background.
//   - Big gradient CTA card with arrow + WhatsApp tagline.
//   - Testimonial card with orange left rail + huge gradient quote-mark.
//   - 2-col contact tile grid with coloured icon chips.
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
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#dc2626";
const LOCKED_ACCENT = "#1a1a1a";
const PAGE = "#f7f7fa";
const SURFACE = "#ffffff";
const RED = "#e94560";
const ORANGE = "#f5a623";
const DARK_1 = "#1a1a2e";
const DARK_2 = "#16213e";
const DARK_3 = "#0f3460";
const TEXT = "#1a1a2e";
const MUTED = "#6b7186";

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
  tagPill: string;
  yearsLabel: string;
  clientsLabel: string;
  followersLabel: string;
  servicesH: string;
  ctaH: string;
  ctaSub: string;
  contactH: string;
  bookBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    tagPill: "Premium Barber",
    yearsLabel: "Jahre",
    clientsLabel: "Kunden",
    followersLabel: "Follower",
    servicesH: "Leistungen",
    ctaH: "Schnelle Buchung",
    ctaSub: "WhatsApp-Termin in Sekunden",
    contactH: "Kontakt",
    bookBtn: "Termin reservieren",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    tagPill: "Premium Barber",
    yearsLabel: "Years",
    clientsLabel: "Clients",
    followersLabel: "Followers",
    servicesH: "Services",
    ctaH: "Instant Booking",
    ctaSub: "Reserve via WhatsApp in seconds",
    contactH: "Contact",
    bookBtn: "Book now",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    tagPill: "Premium Berber",
    yearsLabel: "Yıl",
    clientsLabel: "Müşteri",
    followersLabel: "Takipçi",
    servicesH: "Hizmetler",
    ctaH: "Anında Randevu",
    ctaSub: "WhatsApp ile saniyeler içinde rezervasyon",
    contactH: "İletişim",
    bookBtn: "Randevu Al",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
  es: {

    tagPill: "Barbería premium",
    yearsLabel: "Años",
    clientsLabel: "Clientes",
    followersLabel: "Seguidores",
    servicesH: "Servicios",
    ctaH: "Reserva instantánea",
    ctaSub: "Reserva por WhatsApp en segundos",
    contactH: "Contacto",
    bookBtn: "Reservar ahora",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    tagPill: "Barbiere premium",
    yearsLabel: "Anni",
    clientsLabel: "Clienti",
    followersLabel: "Follower",
    servicesH: "Servizi",
    ctaH: "Prenotazione immediata",
    ctaSub: "Prenota via WhatsApp in pochi secondi",
    contactH: "Contatto",
    bookBtn: "Prenota ora",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    tagPill: "Barbier premium",
    yearsLabel: "Années",
    clientsLabel: "Clients",
    followersLabel: "Abonnés",
    servicesH: "Services",
    ctaH: "Réservation instantanée",
    ctaSub: "Réservez par WhatsApp en quelques secondes",
    contactH: "Contact",
    bookBtn: "Réserver maintenant",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    tagPill: "حلاق فاخر",
    yearsLabel: "سنوات",
    clientsLabel: "العملاء",
    followersLabel: "متابعون",
    servicesH: "الخدمات",
    ctaH: "حجز فوري",
    ctaSub: "احجز عبر واتساب في ثوانٍ",
    contactH: "اتصال",
    bookBtn: "احجز الآن",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

export function BarberVivid({
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
  void accent;
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = (cardData.services ?? []).slice(0, 5);
  const cityFromAddress = cardData.address?.split(",").slice(-1)[0]?.trim();
  const nameFirst = cardData.name.trim().split(/\s+/)[0] ?? cardData.name;
  const heroGrad = `linear-gradient(135deg, ${DARK_1} 0%, ${DARK_2} 50%, ${DARK_3} 100%)`;
  const accentGrad = `linear-gradient(135deg, ${RED} 0%, ${ORANGE} 100%)`;

  return (
    <article
      data-template="barber-vivid"
      className="barber-vivid-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: PAGE, color: TEXT }}
    >
      <style jsx global>{`
        .barber-vivid-card {
          font-family: var(--tpl-font-body, 'Open Sans', system-ui, sans-serif);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .barber-vivid-card .display {
          font-family: var(--tpl-font-display, 'Poppins', 'Inter', system-ui, sans-serif);
        }
        .barber-vivid-card a { color: inherit; }
      `}</style>

      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: heroGrad, height: 200 }}
      >
        <span
          aria-hidden
          className="absolute"
          style={{
            top: -40,
            right: -40,
            width: 180,
            height: 180,
            border: `3px solid ${RED}33`,
            borderRadius: "50%",
          }}
        />
        <span
          aria-hidden
          className="absolute"
          style={{
            bottom: 30,
            left: -40,
            width: 90,
            height: 90,
            background: `radial-gradient(circle, ${ORANGE}26 0%, transparent 70%)`,
            borderRadius: "50%",
          }}
        />
        <div className="relative z-10 px-6 pt-6 text-white">
          <span
            className="display inline-block uppercase"
            style={{
              padding: "4px 10px",
              background: `${RED}d9`,
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "1.5px",
              marginBottom: 8,
              color: "#fff",
            }}
          >
            {t.tagPill}
            {cityFromAddress ? ` · ${cityFromAddress}` : ""}
          </span>
          <div
            className="display"
            style={{ fontSize: 14, fontWeight: 500, opacity: 0.95 }}
          >
            {cardData.company || cardData.name}
          </div>
        </div>
      </section>

      {/* FLOATING PROFILE CARD */}
      <section
        className="relative z-20 mx-4 grid items-center gap-[18px] rounded-3xl px-6 py-6"
        style={{
          background: SURFACE,
          marginTop: -90,
          gridTemplateColumns: "88px 1fr",
          boxShadow: `0 20px 60px -20px ${DARK_1}59`,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            padding: 3,
            background: accentGrad,
          }}
        >
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={cardData.name}
              width={82}
              height={82}
              unoptimized
              className="block h-full w-full rounded-full object-cover tpl-photo"
              style={{ border: `3px solid ${SURFACE}` }}
            />
          ) : (
            <div
              className="display flex h-full w-full items-center justify-center rounded-full"
              style={{
                background: SURFACE,
                color: RED,
                border: `3px solid ${SURFACE}`,
                fontSize: 32,
                fontWeight: 800,
              }}
            >
              {nameFirst[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div
            className="display truncate"
            style={{ fontSize: 22, fontWeight: 700, color: TEXT, lineHeight: 1.1, marginBottom: 4 }}
          >
            {cardData.name}
          </div>
          <div
            style={{ fontSize: 12.5, color: RED, fontWeight: 600, marginBottom: 8 }}
          >
            {cardData.title || cardData.position}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Pill text="15 Years" color={RED} bg={`${RED}1a`} />
            <Pill text="Premium" color={ORANGE} bg={`${ORANGE}1f`} />
            <Pill text="Studio" color={DARK_3} bg={`${DARK_3}1a`} />
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="mt-5 grid grid-cols-3 gap-2.5 px-4">
        {[
          { num: "15", label: t.yearsLabel },
          { num: "5K+", label: t.clientsLabel },
          { num: "32K", label: t.followersLabel },
        ].map((s, i) => (
          <div
            key={i}
            className="rounded-2xl px-3 py-4 text-center"
            style={{
              background: SURFACE,
              boxShadow: `0 4px 16px -4px ${DARK_1}14`,
            }}
          >
            <div
              className="display"
              style={{
                fontSize: 26,
                fontWeight: 800,
                background: accentGrad,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {s.num}
            </div>
            <div
              className="uppercase"
              style={{ fontSize: 10.5, fontWeight: 600, color: MUTED, letterSpacing: "0.5px" }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* SERVICES */}
      {services.length > 0 && (
        <section className="mt-6 px-4">
          <div className="mb-4 flex items-center gap-2.5 px-1">
            <span
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: RED,
                boxShadow: `0 0 0 4px ${RED}33`,
              }}
            />
            <h2 className="display" style={{ fontSize: 18, fontWeight: 700, color: TEXT }}>
              {t.servicesH}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {services.map((svc, i) => {
              const featured = i === services.length - 1 && services.length > 2;
              return (
                <ServiceLink
                  key={`${svc.title}-${i}`}
                  href={svc.href}
                  className="relative overflow-hidden rounded-2xl p-4"
                  style={{
                    background: featured ? heroGrad : SURFACE,
                    color: featured ? "#fff" : TEXT,
                    boxShadow: `0 4px 16px -4px ${DARK_1}14`,
                    gridColumn: featured ? "span 2" : "auto",
                  }}
                >
                  {featured && (
                    <span
                      aria-hidden
                      className="absolute"
                      style={{
                        top: -20,
                        right: -20,
                        width: 100,
                        height: 100,
                        background: `radial-gradient(circle, ${ORANGE}4d 0%, transparent 70%)`,
                        borderRadius: "50%",
                      }}
                    />
                  )}
                  <div
                    className="display relative z-10"
                    style={{
                      fontSize: featured ? 18 : 13.5,
                      fontWeight: 700,
                      color: featured ? "#fff" : TEXT,
                      marginBottom: 4,
                      lineHeight: 1.2,
                    }}
                  >
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div
                      className="relative z-10"
                      style={{
                        fontSize: featured ? 12 : 11,
                        color: featured ? "rgba(255,255,255,0.85)" : MUTED,
                        lineHeight: 1.4,
                        marginBottom: 8,
                      }}
                    >
                      {linkify(svc.description)}
                    </div>
                  )}
                  {svc.priceLabel && (
                    <div
                      className="display relative z-10"
                      style={{
                        fontSize: featured ? 24 : 16,
                        fontWeight: 800,
                        color: featured ? "transparent" : RED,
                        background: featured ? accentGrad : "transparent",
                        WebkitBackgroundClip: featured ? "text" : "border-box",
                        backgroundClip: featured ? "text" : "border-box",
                      }}
                    >
                      {svc.priceLabel}
                    </div>
                  )}
                </ServiceLink>
              );
            })}
          </div>
        </section>
      )}

      {/* BIG CTA */}
      {(cardData.bookingUrl || waDigits) && (
        <section
          className="relative mx-4 mt-6 overflow-hidden rounded-3xl px-6 py-7 text-center text-white"
          style={{
            background: accentGrad,
            boxShadow: `0 12px 32px -8px ${RED}66`,
          }}
        >
          <span
            aria-hidden
            className="absolute"
            style={{
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              border: "2px solid rgba(255,255,255,0.15)",
              borderRadius: "50%",
            }}
          />
          <h3
            className="display relative"
            style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}
          >
            {t.ctaH}
          </h3>
          <p className="relative" style={{ fontSize: 13, opacity: 0.9, marginBottom: 18 }}>
            {t.ctaSub}
          </p>
          <a
            href={
              cardData.bookingUrl ||
              `https://wa.me/${waDigits}?text=${encodeURIComponent(t.bookBtn)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="display relative inline-flex items-center gap-2 rounded-full px-7 py-3.5"
            style={{ background: "#fff", color: RED, fontSize: 13.5, fontWeight: 700 }}
          >
            {t.bookBtn}
            <span aria-hidden style={{ fontSize: 16 }}>
              →
            </span>
          </a>
        </section>
      )}

      {/* TESTIMONIAL */}
      {cardData.bio && (
        <section
          className="relative mx-4 mt-6 rounded-3xl px-6 py-7"
          style={{
            background: SURFACE,
            borderLeft: `4px solid ${ORANGE}`,
            boxShadow: `0 4px 16px -4px ${DARK_1}14`,
          }}
        >
          <span
            aria-hidden
            className="display absolute"
            style={{
              top: -12,
              left: 18,
              fontSize: 80,
              background: accentGrad,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1,
              fontWeight: 800,
            }}
          >
            “
          </span>
          <p
            style={{
              fontSize: 14.5,
              lineHeight: 1.6,
              color: TEXT,
              fontWeight: 500,
              marginBottom: 14,
            }}
          >
            {cardData.bio}
          </p>
          <cite
            className="display not-italic uppercase"
            style={{ fontSize: 11.5, fontWeight: 700, color: RED, letterSpacing: "0.5px" }}
          >
            — {cardData.name}
          </cite>
        </section>
      )}

      {/* CONTACT */}
      <section className="mt-6 px-4">
        <div className="mb-4 flex items-center gap-2.5 px-1">
          <span
            aria-hidden
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: RED,
              boxShadow: `0 0 0 4px ${RED}33`,
            }}
          />
          <h2 className="display" style={{ fontSize: 18, fontWeight: 700, color: TEXT }}>
            {t.contactH}
          </h2>
        </div>
        <div className="rounded-2xl px-5 py-2" style={{ background: SURFACE, boxShadow: `0 4px 16px -4px ${DARK_1}14` }}>
          <ContactRows
            cardData={cardData}
            locale={locale}
            variant="hairline"
            accentHex={RED}
          />
        </div>
        {cardData.socials && (
          <div className="mt-4">
            <SocialRow socials={cardData.socials} variant="tile" accentHex={RED} />
          </div>
        )}
      </section>

      {/* WALLET / SEND / EXCHANGE */}
      <section className="mt-6 px-4">
        <div
          className="rounded-2xl px-5 py-5"
          style={{ background: SURFACE, boxShadow: `0 4px 16px -4px ${DARK_1}14` }}
        >
          <SendMyInfoSlot slug={slug} sourceQs="" primary={RED} locale={locale} />
          <ExchangeSlot slug={slug} primary={RED} locale={locale} />
        </div>
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-4 py-6"
          labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-center"
        >
          <div
            style={{
              ["--card-primary" as string]: RED,
              color: TEXT,
            }}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer
        className="px-6 py-6 text-center"
        style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}
      >
        © {new Date().getFullYear()} {cardData.company || cardData.name}
        {cityFromAddress && ` · ${cityFromAddress}`}
        <div className="mt-2" style={{ color: MUTED }}>
          {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: RED, fontWeight: 600 }}
          >
            OpSolid
          </a>
        </div>
      </footer>
    </article>
  );
}

function Pill({
  text,
  color,
  bg,
}: {
  text: string;
  color: string;
  bg: string;
}) {
  return (
    <span
      className="display inline-flex items-center uppercase"
      style={{
        padding: "3px 8px",
        background: bg,
        color,
        borderRadius: 999,
        fontSize: 9.5,
        fontWeight: 700,
        letterSpacing: "0.5px",
      }}
    >
      {text}
    </span>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const barberVividEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 78,
  key: "barber-vivid",
  name: "Barber — Vivid",
  industry: "Barber / Modern urban barbershop",
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
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-barber-vivid",
};

// photo: Unsplash, https://unsplash.com/photos/jqe5lY4ROMQ — Free, no attribution required.
export const barberVividSample: SampleData = {
  templateId: 78,
  slug: "demo-barber-vivid",
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
      { title: "Premium Haarschnitt", description: "Beratung, Schnitt, Styling.", priceLabel: "€35" },
      { title: "Heißrasur", description: "Klassische Rasur mit heißem Tuch.", priceLabel: "€28" },
      { title: "Kombination", description: "Schnitt + Heißrasur in einem Termin.", priceLabel: "€55" },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

