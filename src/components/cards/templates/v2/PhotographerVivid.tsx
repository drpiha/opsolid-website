"use client";

// =============================================================================
// PhotographerVivid — v2 template (id=66, key="photographer-vivid").
//
// Sector: Creator / Photographer — VIVID variant. Mood: bold purpleâ†’indigo
// gradient, energetic social-media photographer, modern app feel.
// Inspired by kart_04_fotograf_vivid.html.
//
// Design DNA:
//   - Hero (220 px) with deep navy â†’ indigo â†’ violet gradient and
//     amber blob accents, status badge ("Available 2026") + city tag.
//   - Floating card — squircle photo + bold name + role + chips row.
//   - 3-up stat tiles (rounded card shadows).
//   - Service / package cards in a 2-col grid with numbered tiles.
//   - Big violetâ†’amber CTA + 3-up mini links.
//   - Quote / review card on indigo gradient with amber quote glyph.
//   - Social grid 4-up.
//   - Gradient share / QR panel.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { ArrowUpRight, Calendar, Download, MapPin, MessageCircle, Phone, Star } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#7c3aed";
const LOCKED_ACCENT = "#a78bfa";
const PAGE = "#f4f5fb";
const SURFACE = "#ffffff";
const NAVY = "#0f172a";
const NAVY_2 = "#312e81";
const AMBER = "#f59e0b";
const AMBER_DARK = "#b45309";
const TEXT = "#0f172a";
const TEXT_SOFT = "#64748b";
const TEXT_MUTED = "#94a3b8";
const BORDER = "#e2e8f0";

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

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "·";
  if (parts.length === 1) return (parts[0][0] ?? "·").toUpperCase();
  return (parts[0][0] ?? "").toUpperCase() + (parts[parts.length - 1][0] ?? "").toUpperCase();
}

interface Copy {
  badge: string;
  recsTitle: string;
  recsTitleAccent: string;
  recsSub: string;
  ctaBig: string;
  whatsappLabel: string;
  portfolioLabel: string;
  directionsLabel: string;
  shareTitle: string;
  shareSub: string;
  yearsLabel: string;
  shootsLabel: string;
  countriesLabel: string;
  reviewLabel: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    badge: "Verfügbar 2026",
    recsTitle: "Meine",
    recsTitleAccent: "Pakete",
    recsSub: "Auf jede Geschichte zugeschnitten — vom Porträt bis zur Hochzeit.",
    ctaBig: "Termin buchen",
    whatsappLabel: "WhatsApp",
    portfolioLabel: "Portfolio",
    directionsLabel: "Konum",
    shareTitle: "Folge mir",
    shareSub: "Neue Shootings zuerst auf Instagram.",
    yearsLabel: "Jahre",
    shootsLabel: "Shootings",
    countriesLabel: "Länder",
    reviewLabel: "Kunden-Review",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    badge: "Available 2026",
    recsTitle: "My",
    recsTitleAccent: "Packages",
    recsSub: "Tailored for every story — from portrait to wedding.",
    ctaBig: "Book a session",
    whatsappLabel: "WhatsApp",
    portfolioLabel: "Portfolio",
    directionsLabel: "Directions",
    shareTitle: "Follow me",
    shareSub: "New shoots first on Instagram.",
    yearsLabel: "Years",
    shootsLabel: "Shoots",
    countriesLabel: "Countries",
    reviewLabel: "Client review",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    badge: "2026 Müsait",
    recsTitle: "Çalışma",
    recsTitleAccent: "Paketleri",
    recsSub: "Her hikayeye özel — portreden düğüne.",
    ctaBig: "Randevu al",
    whatsappLabel: "WhatsApp",
    portfolioLabel: "Portföy",
    directionsLabel: "Konum",
    shareTitle: "Beni takip et",
    shareSub: "Yeni çekimleri önce Instagram'da.",
    yearsLabel: "Yıl",
    shootsLabel: "Çekim",
    countriesLabel: "Ülke",
    reviewLabel: "Müşteri Yorumu",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
  es: {

    badge: "Disponible 2026",
    recsTitle: "Mi",
    recsTitleAccent: "Paquetes",
    recsSub: "Tailored for every story — from portrait to wedding.",
    ctaBig: "Reservar una sesión",
    whatsappLabel: "WhatsApp",
    portfolioLabel: "Portafolio",
    directionsLabel: "Cómo llegar",
    shareTitle: "Sígueme",
    shareSub: "Nuevas sesiones primero en Instagram.",
    yearsLabel: "Años",
    shootsLabel: "Sesiones",
    countriesLabel: "Países",
    reviewLabel: "Reseña de cliente",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    badge: "Disponibile 2026",
    recsTitle: "Il mio",
    recsTitleAccent: "Pacchetti",
    recsSub: "Tailored for every story — from portrait to wedding.",
    ctaBig: "Prenota una sessione",
    whatsappLabel: "WhatsApp",
    portfolioLabel: "Portfolio",
    directionsLabel: "Indicazioni",
    shareTitle: "Seguimi",
    shareSub: "Nuovi servizi prima su Instagram.",
    yearsLabel: "Anni",
    shootsLabel: "Servizi fotografici",
    countriesLabel: "Paesi",
    reviewLabel: "Recensione cliente",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    badge: "Disponible 2026",
    recsTitle: "Mon",
    recsTitleAccent: "Forfaits",
    recsSub: "Tailored for every story — from portrait to wedding.",
    ctaBig: "Réserver une séance",
    whatsappLabel: "WhatsApp",
    portfolioLabel: "Portfolio",
    directionsLabel: "Itinéraire",
    shareTitle: "Me suivre",
    shareSub: "Nouvelles séances d'abord sur Instagram.",
    yearsLabel: "Années",
    shootsLabel: "Séances photo",
    countriesLabel: "Pays",
    reviewLabel: "Avis client",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    badge: "متاح 2026",
    recsTitle: "خاصتي",
    recsTitleAccent: "الباقات",
    recsSub: "Tailored for every story — from portrait to wedding.",
    ctaBig: "احجز جلسة",
    whatsappLabel: "واتساب",
    portfolioLabel: "المعرض",
    directionsLabel: "الاتجاهات",
    shareTitle: "تابعني",
    shareSub: "جلسات جديدة أولاً على إنستغرام.",
    yearsLabel: "سنوات",
    shootsLabel: "تصوير",
    countriesLabel: "الدول",
    reviewLabel: "تقييم العميل",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

const CHIP_COLORS = [
  { bg: "#ede9fe", fg: "#4338ca" },
  { bg: "#fef3c7", fg: "#92400e" },
  { bg: "#dcfce7", fg: "#166534" },
  { bg: "#ffe4e6", fg: "#be123c" },
];

export function PhotographerVivid({
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
  void readableTextOn;
  void TEXT_MUTED;

  const photoUrl = resolveAssetUrl(photoPath);
  const initials = getInitials(cardData.name);
  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = (cardData.services ?? []).slice(0, 4);
  const tagline = cardData.title || cardData.position || "";
  const city = cardData.address?.split(",").slice(-2)[0]?.trim() || "Berlin";

  const chips = ["Photographer", city, "Wedding", "Portrait"];

  return (
    <article
      data-template="photographer-vivid"
      className="phv-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: PAGE, color: TEXT }}
    >
      <style jsx global>{`
        .phv-card {
          font-family: var(--tpl-font-body, 'Nunito', 'Inter', system-ui, sans-serif);
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
        }
        .phv-card a { color: inherit; }
      `}</style>

      {/* HERO */}
      <section
        className="relative overflow-hidden px-6 pt-7"
        style={{
          height: 220,
          background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_2} 50%, ${primary} 100%)`,
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute right-[-60px] top-[-60px] block h-[200px] w-[200px] rounded-full"
          style={{ background: "rgba(245,158,11,0.18)" }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-[-80px] left-[-50px] block h-[220px] w-[220px] rounded-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <div
          className="relative z-10 flex items-center justify-between text-[12px] font-semibold"
          style={{ color: "rgba(255,255,255,0.92)", letterSpacing: "0.5px" }}
        >
          <span
            className="flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)" }}
          >
            <span
              aria-hidden
              className="block h-1.5 w-1.5 rounded-full"
              style={{ background: "#4ade80", boxShadow: "0 0 0 4px rgba(74,222,128,0.3)" }}
            />
            {t.badge}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={11} strokeWidth={2.4} />
            {city}
          </span>
        </div>
      </section>

      {/* FLOATING CARD */}
      <div
        className="relative z-10 mx-5 -mt-[100px] rounded-[24px] px-6 py-6"
        style={{
          background: SURFACE,
          boxShadow: `0 24px 60px -20px rgba(15, 23, 42, 0.45), 0 8px 24px -8px rgba(0,0,0,0.08)`,
        }}
      >
        <div className="grid items-center gap-4" style={{ gridTemplateColumns: "76px 1fr" }}>
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={cardData.name}
              width={76}
              height={76}
              unoptimized
              className="object-cover tpl-photo"
              style={{
                width: 76,
                height: 76,
                borderRadius: 18,
                border: `3px solid ${SURFACE}`,
                boxShadow: `0 4px 16px ${primary}4d`,
              }}
            />
          ) : (
            <div
              className="flex items-center justify-center text-[24px] font-extrabold text-white"
              style={{
                width: 76,
                height: 76,
                borderRadius: 18,
                background: `linear-gradient(135deg, ${primary} 0%, ${NAVY_2} 100%)`,
              }}
            >
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <h1
              className="text-[22px] leading-[1.05]"
              style={{ color: TEXT, letterSpacing: "-0.5px", fontWeight: 900 }}
            >
              {cardData.name}
            </h1>
            {tagline && (
              <div
                className="mt-1 text-[13px] font-semibold"
                style={{ color: primary }}
              >
                {tagline}
              </div>
            )}
            {cardData.position && (
              <div className="text-[12px] font-medium" style={{ color: TEXT_SOFT }}>
                {cardData.position}
              </div>
            )}
          </div>
        </div>

        {/* chip row */}
        <div className="mt-4 flex flex-wrap gap-1.5 border-t pt-4" style={{ borderColor: BORDER }}>
          {chips.map((label, i) => (
            <span
              key={`${label}-${i}`}
              className="rounded-full px-3 py-1.5 text-[11.5px] font-bold"
              style={{
                background: CHIP_COLORS[i % CHIP_COLORS.length].bg,
                color: CHIP_COLORS[i % CHIP_COLORS.length].fg,
                letterSpacing: "0.2px",
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="mx-5 mt-6 grid grid-cols-3 gap-2">
        <StatTile num="7" label={t.yearsLabel} accent={primary} />
        <StatTile num="280+" label={t.shootsLabel} accent={primary} />
        <StatTile num="15" label={t.countriesLabel} accent={primary} />
      </div>

      {/* SERVICES TITLE + CARDS */}
      <section className="px-6 pb-2 pt-7">
        <h2
          className="text-[22px] leading-tight"
          style={{ color: TEXT, letterSpacing: "-0.4px", fontWeight: 900 }}
        >
          {t.recsTitle} <span style={{ color: primary }}>{t.recsTitleAccent}</span>
        </h2>
        <p className="mt-1 text-[13px] font-medium" style={{ color: TEXT_SOFT }}>
          {t.recsSub}
        </p>
      </section>

      {services.length > 0 && (
        <section className="grid grid-cols-2 gap-2.5 px-6 pt-3">
          {services.map((svc, i) => (
            <div
              key={`${svc.title}-${i}`}
              className="relative overflow-hidden rounded-[18px] px-4 py-4"
              style={{
                background: SURFACE,
                boxShadow: `0 6px 20px -6px ${primary}24, 0 2px 6px rgba(0,0,0,0.04)`,
              }}
            >
              <div
                className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-[12px] text-[15px] font-extrabold text-white"
                style={{
                  background: `linear-gradient(135deg, ${primary} 0%, ${NAVY_2} 100%)`,
                  boxShadow: `0 4px 10px ${primary}4d`,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3
                className="text-[14px] leading-tight"
                style={{ color: TEXT, letterSpacing: "-0.2px", fontWeight: 800 }}
              >
                {svc.title}
              </h3>
              {svc.description && (
                <p
                  className="mt-1 text-[11.5px] font-medium leading-snug"
                  style={{ color: TEXT_SOFT }}
                >
                  {svc.description}
                </p>
              )}
              {svc.priceLabel && (
                <div
                  className="mt-2.5 text-[15px]"
                  style={{ color: primary, letterSpacing: "-0.2px", fontWeight: 900 }}
                >
                  {svc.priceLabel}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* SAVE CONTACT */}
      <section className="px-5 pb-0 pt-6">
        <a
          href={`/api/cards/${slug}/vcard`}
          className="mb-2.5 flex items-center justify-center gap-2 rounded-[16px] px-5 py-4 text-[15px] font-extrabold transition-all hover:-translate-y-0.5"
          style={{
            background: primary,
            color: "#fff",
            boxShadow: `0 10px 24px -6px ${primary}80`,
            letterSpacing: "0.3px",
          }}
        >
          <Download size={18} strokeWidth={2.4} />
          {t.saveContact}
        </a>
      </section>

      {/* BIG CTA */}
      <section className="px-5 pb-2 pt-3">
        {phoneDigits && (
          <a
            href={`tel:${phoneDigits}`}
            className="mb-2.5 flex items-center justify-center gap-2 rounded-[16px] px-5 py-4 text-[15px] font-extrabold transition-all hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${primary} 0%, ${AMBER} 100%)`,
              color: "#fff",
              boxShadow: `0 10px 24px -6px ${primary}80`,
              letterSpacing: "0.3px",
            }}
          >
            <Calendar size={18} strokeWidth={2.4} />
            {t.ctaBig}
            <ArrowUpRight size={16} strokeWidth={2.6} />
          </a>
        )}
        <div className="grid grid-cols-3 gap-2">
          {waDigits && (
            <MiniCTA href={`https://wa.me/${waDigits}`} label={t.whatsappLabel} external />
          )}
          {cardData.brochureUrl && (
            <MiniCTA href={cardData.brochureUrl} label={t.portfolioLabel} external />
          )}
          {cardData.address && (
            <MiniCTA
              href={`https://maps.google.com/?q=${encodeURIComponent(cardData.address)}`}
              label={t.directionsLabel}
              external
            />
          )}
        </div>
      </section>

      {/* QUOTE PANEL — gradient on indigo */}
      {cardData.bio && (
        <div
          className="relative mx-5 mt-6 overflow-hidden rounded-[20px] px-6 py-7 text-white"
          style={{
            background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_2} 100%)`,
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -top-2 left-3 leading-none"
            style={{
              fontSize: 110,
              fontWeight: 800,
              color: "rgba(245,158,11,0.22)",
              fontFamily: "Georgia, serif",
            }}
          >
            {"\""}
          </span>
          <p
            className="relative mb-4 text-[14.5px] font-semibold leading-[1.6]"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            {cardData.bio}
          </p>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold"
                style={{
                  background: `linear-gradient(135deg, ${AMBER} 0%, ${AMBER_DARK} 100%)`,
                  color: NAVY,
                }}
              >
                {initials}
              </div>
              <div>
                <div
                  className="text-[13px] font-bold"
                  style={{ color: AMBER }}
                >
                  {cardData.name}
                </div>
                <div
                  className="text-[11px]"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  {t.reviewLabel}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-0.5" style={{ color: AMBER }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={12} fill={AMBER} strokeWidth={0} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTACT */}
      <section className="px-6 pb-6 pt-6">
        <ContactRows cardData={cardData} locale={locale} variant="tile" accentHex={primary} />
      </section>

      {/* SOCIAL TILE GRID */}
      <div className="grid grid-cols-4 gap-2 px-5 pb-6">
        {phoneDigits && (
          <SocialTile href={`tel:${phoneDigits}`} icon={<Phone size={18} strokeWidth={2.4} />} label={t.whatsappLabel} />
        )}
        {cardData.email && (
          <SocialTile href={`mailto:${cardData.email}`} icon="@" label="Email" />
        )}
        {cardData.socials?.instagram && (
          <SocialTile href={cardData.socials.instagram} icon="IG" label="Instagram" external />
        )}
        {cardData.website && (
          <SocialTile
            href={`https://${cardData.website.replace(/^https?:\/\//, "")}`}
            icon="W"
            label="Web"
            external
          />
        )}
      </div>

      {/* SHARE GRADIENT */}
      <div
        className="relative mx-5 mb-6 overflow-hidden rounded-[20px] px-6 py-6 text-center text-white"
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, ${AMBER} 100%)`,
          boxShadow: `0 12px 30px -10px ${primary}80`,
        }}
      >
        <h3
          className="text-[18px]"
          style={{ letterSpacing: "-0.3px", fontWeight: 900 }}
        >
          {t.shareTitle}
        </h3>
        <p className="mt-1 text-[12.5px] font-medium" style={{ opacity: 0.92 }}>
          {t.shareSub}
        </p>
        <div className="mt-4">
          <SendMyInfoSlot slug={slug} sourceQs="" primary="#ffffff" locale={locale} />
        </div>
      </div>

      <section className="px-6 pb-7">
        <ExchangeSlot slug={slug} primary={primary} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="border-t px-6 py-6"
          labelClassName="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-center"
        >
          <div style={{ ["--card-primary" as string]: primary }}>{walletSlot}</div>
        </WalletDock>
      )}

      {cardData.socials && (
        <section className="px-6 py-6 border-t" style={{ borderColor: BORDER }}>
          <SocialRow socials={cardData.socials} variant="pill" accentHex={primary} />
        </section>
      )}

      {/* FOOTER */}
      <footer
        className="px-6 py-5 text-center text-[12px] font-semibold"
        style={{ color: TEXT_SOFT }}
      >
        {cardData.name} © {new Date().getFullYear()} · {city} ·{" "}
        <a
          href="https://opsolid.de/products/digital-card"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: primary, fontWeight: 800 }}
        >
          OpSolid
        </a>
      </footer>

      <span className="hidden">
        {accent}
        <MessageCircle size={1} />
      </span>
    </article>
  );
}

function StatTile({ num, label, accent }: { num: string; label: string; accent: string }) {
  return (
    <div
      className="rounded-[16px] px-3 py-4 text-center"
      style={{
        background: SURFACE,
        boxShadow: "0 4px 14px -6px rgba(15,23,42,0.12)",
      }}
    >
      <div
        className="text-[22px] leading-none"
        style={{ color: accent, letterSpacing: "-0.5px", fontWeight: 900 }}
      >
        {num}
      </div>
      <div
        className="mt-1.5 text-[10px] font-bold uppercase"
        style={{ color: TEXT_SOFT, letterSpacing: "1px" }}
      >
        {label}
      </div>
    </div>
  );
}

function MiniCTA({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" as const } : {};
  return (
    <a
      href={href}
      {...ext}
      className="rounded-[14px] px-2 py-3 text-center text-[12px] font-bold transition-all hover:-translate-y-0.5"
      style={{
        background: SURFACE,
        border: `2px solid ${BORDER}`,
        color: TEXT,
      }}
    >
      {label}
    </a>
  );
}

function SocialTile({
  href,
  icon,
  label,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  external?: boolean;
}) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" as const } : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex flex-col items-center justify-center rounded-[14px] px-2 py-3.5 text-center transition-all hover:-translate-y-0.5"
      style={{
        background: SURFACE,
        boxShadow: "0 4px 12px -4px rgba(15,23,42,0.12)",
      }}
    >
      <div
        className="mb-1 text-[18px] font-extrabold"
        style={{ color: TEXT }}
      >
        {icon}
      </div>
      <div
        className="text-[10px] font-bold"
        style={{ color: TEXT_SOFT, letterSpacing: "0.3px" }}
      >
        {label}
      </div>
    </a>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const photographerVividEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 66,
  key: "photographer-vivid",
  name: "Photographer — Vivid",
  industry: "Photographer / Social-media creator",
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
    logo: true,
  },
  defaults: {
    brandPrimaryHex: "#7c3aed",
    brandAccentHex: "#a78bfa",
  },
  sampleSlug: "demo-photographer-vivid",
};

export const photographerVividSample: SampleData = {
  templateId: 66,
  slug: "demo-photographer-vivid",
  cardData: {
    name: "Lena Schwarz",
    position: "Fotografin / Videografin",
    title: "Wedding · Portrait · Brand",
    company: "Lena Schwarz Studio",
    email: "lena@lenaschwarz.de",
    phone: "+49 176 889 0123",
    whatsapp: "+49 176 889 0123",
    website: "lenaschwarz.de",
    address: "Mariannenstraße 7, 10999 Berlin",
    bio: "Hochzeits- und Porträtfotografin aus Berlin. Natürliches Licht, echte Momente, zeitlose Bilder.",
    bookingUrl: "https://cal.com/lena-schwarz/intro",
    brochureUrl: "https://lenaschwarz.de/portfolio.pdf",
    impressumUrl: "https://lenaschwarz.de/impressum",
    privacyUrl: "https://lenaschwarz.de/datenschutz",
    sectorKey: "creator",
    socials: {
      instagram: "https://instagram.com/lena.schwarz.foto",
      youtube: "https://youtube.com/@lenaschwarz",
    },
    services: [
      {
        title: "Hochzeit",
        description: "ganzer tag · zwei fotografen",
        priceLabel: "ab â‚¬2.800",
      },
      {
        title: "Porträt",
        description: "studio oder natürliches licht",
        priceLabel: "â‚¬350 / 2h",
      },
      {
        title: "Produkt",
        description: "kampagnen · lookbooks",
        priceLabel: "ab â‚¬480",
      },
      {
        title: "Branding",
        description: "personal · creator content",
        priceLabel: "ab â‚¬680",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#7c3aed",
  brandAccentHex: "#a78bfa",
};

