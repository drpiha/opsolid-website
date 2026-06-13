"use client";

// =============================================================================
// ArchitectPure — v2 template (id=85, key="architect-pure").
//
// Sector: Architecture — PURE variant. Mood: Swiss-grid white paper, DM Sans
// body + Space Grotesk meta caps, architectural-drawing aesthetic. Inspired by
// kart_09_mimar_pure.html.
//
// Design DNA (different from Architect.tsx id=9, ArchitectNoir):
//   - Hairline header with firm caption + N/E coordinate stamp.
//   - Two-column profile band: huge ink h1 over warm subhead + 110px square
//     grayscale photo (no rounding).
//   - Meta-row table (Studio / Founded / Team) with mono caps + serif values.
//   - Numbered specialty list with project counts in warm caps.
//   - Awards list with year column + ink title + muted org line.
//   - 3-cell stat strip with hairline divider after each cell.
//   - Hairline contact table — pure typographic data.
// =============================================================================

import * as React from "react";
import Image from "next/image";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { resolveStats, resolveTagline, resolveLocation } from "./shared/profileExtras";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#ffffff";
const LOCKED_ACCENT = "#1a1a1a";
const SURFACE = "#f4f4f0";
const CARD = "#ffffff";
const INK = "#111111";
const INK_SOFT = "#2a2a2a";
const WARM = "#8b7355";
const MUTE = "#6b6b66";
const MUTE_2 = "#9d9d97";
const LINE = "#e2e2dc";
const LINE_SOFT = "#ececea";

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
  studioLabel: string;
  specsTitle: string;
  contactTitle: string;
  bookBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    studioLabel: "Studio",
    specsTitle: "Spezialgebiete",
    contactTitle: "Kontakt",
    bookBtn: "Termin reservieren",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    studioLabel: "Studio",
    specsTitle: "Specialties",
    contactTitle: "Contact",
    bookBtn: "Book appointment",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    studioLabel: "Stüdyo",
    specsTitle: "Uzmanlık Alanları",
    contactTitle: "İletişim",
    bookBtn: "Randevu Al",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
  es: {
    studioLabel: "Estudio",
    specsTitle: "Especialidades",
    contactTitle: "Contacto",
    bookBtn: "Reservar cita",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {
    studioLabel: "Studio",
    specsTitle: "Specialità",
    contactTitle: "Contatto",
    bookBtn: "Prenota un appuntamento",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {
    studioLabel: "Studio",
    specsTitle: "Spécialités",
    contactTitle: "Contact",
    bookBtn: "Prendre rendez-vous",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {
    studioLabel: "استوديو",
    specsTitle: "التخصصات",
    contactTitle: "اتصال",
    bookBtn: "حجز موعد",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

export function ArchitectPure({
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
  void accent;
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = (cardData.services ?? []).slice(0, 5);
  const stats = resolveStats(cardData.stats);
  const tagline = resolveTagline(cardData);
  const locationLabel = resolveLocation(cardData);
  // Meta row: location only (real data) — stats render in the stat strip.
  const metaRows = locationLabel
    ? [{ k: t.studioLabel, v: locationLabel }]
    : [];
  const nameParts = cardData.name.trim().split(/\s+/);
  const nameFirst = nameParts[0] ?? cardData.name;
  const nameLast = nameParts.slice(1).join(" ");

  return (
    <article
      data-template="architect-pure"
      className="architect-pure-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: INK_SOFT }}
    >
      <style jsx global>{`
        .architect-pure-card {
          font-family: var(--tpl-font-body, 'DM Sans', system-ui, sans-serif);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
          font-feature-settings: "ss01", "kern";
        }
        .architect-pure-card .mono {
          font-family: var(--tpl-font-display, 'Space Grotesk', 'JetBrains Mono', sans-serif);
        }
        .architect-pure-card a { color: inherit; }
      `}</style>

      {/* HEADER */}
      <header
        className="flex items-center justify-between px-7 py-5"
        style={{ borderBottom: `1px solid ${LINE}` }}
      >
        <div
          className="uppercase"
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "3px",
            color: INK,
          }}
        >
          {cardData.company || cardData.name}
        </div>
        {locationLabel && (
          <div
            className="mono uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "2px",
              color: MUTE,
            }}
          >
            {locationLabel}
          </div>
        )}
      </header>

      {/* PROFILE */}
      <section
        className="grid items-start gap-5 px-7 pb-8 pt-9"
        style={{
          borderBottom: `1px solid ${LINE}`,
          gridTemplateColumns: "1fr 110px",
        }}
      >
        <div className="pt-1 min-w-0">
          {tagline && (
            <div
              className="mono mb-3.5 uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "2.5px",
                color: WARM,
                fontWeight: 500,
              }}
            >
              {tagline}
            </div>
          )}
          <h1
            style={{
              fontSize: "clamp(40px, 12vw, 50px)",
              fontWeight: 500,
              color: INK,
              lineHeight: 0.95,
              letterSpacing: "-2px",
            }}
          >
            {nameFirst}
            {nameLast && (
              <>
                <br />
                {nameLast}
              </>
            )}
          </h1>
          {cardData.bio && (
            <p
              className="mt-3.5"
              style={{
                fontSize: 13,
                color: MUTE,
                fontWeight: 400,
                letterSpacing: "0.2px",
              }}
            >
              {cardData.bio}
            </p>
          )}
        </div>
        {photoUrl && (
          <div
            className="relative shrink-0"
            style={{ width: 110, height: 110 }}
          >
            <Image
              src={photoUrl}
              alt={cardData.name}
              fill
              unoptimized
              sizes="110px"
              className="object-cover tpl-photo"
              style={{ filter: "grayscale(1) contrast(1.05)" }}
            />
          </div>
        )}
      </section>

      {/* META TABLE — location + owner stats only (resolveStats); no
          fabricated founding year / team size. */}
      {metaRows.length > 0 && (
      <div className="bg-transparent">
        {metaRows.map((m, i, arr) => (
          <div
            key={m.k}
            className="grid items-baseline gap-4 px-7 py-3.5"
            style={{
              borderBottom:
                i < arr.length - 1 ? `1px solid ${LINE_SOFT}` : "none",
              gridTemplateColumns: "90px 1fr",
              fontSize: 13,
            }}
          >
            <div
              className="mono uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "1.8px",
                color: MUTE_2,
                fontWeight: 500,
              }}
            >
              {m.k}
            </div>
            <div style={{ color: INK, fontWeight: 500 }}>{m.v}</div>
          </div>
        ))}
      </div>
      )}

      {/* SPECIALTIES */}
      {services.length > 0 && (
        <section className="px-7 pt-9 pb-8">
          <SectHead num="01" title={t.specsTitle} />
          <ul
            className="mt-4"
            style={{ borderTop: `1px solid ${LINE}` }}
          >
            {services.map((svc, i) => (
              <ServiceLink
                key={`${svc.title}-${i}`}
                href={svc.href}
                className="grid items-center gap-3.5 py-3"
                style={{
                  borderBottom: `1px solid ${LINE_SOFT}`,
                  gridTemplateColumns: "18px 1fr auto",
                  fontSize: 13,
                  color: INK,
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: 10,
                    color: MUTE_2,
                    letterSpacing: "1px",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{svc.title}</span>
                {svc.priceLabel && (
                  <span
                    className="mono"
                    style={{
                      fontSize: 11,
                      color: WARM,
                      letterSpacing: "1px",
                    }}
                  >
                    {svc.priceLabel}
                  </span>
                )}
              </ServiceLink>
            ))}
          </ul>
        </section>
      )}


      {/* STATS — owner-entered numbers only (resolveStats). */}
      {stats && (
        <section
          className="grid gap-0 px-7 py-8"
          style={{
            borderTop: `1px solid ${LINE}`,
            borderBottom: `1px solid ${LINE}`,
            gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
          }}
        >
          {stats.map((s, i, arr) => (
            <div key={s.label} className="relative py-1">
              <div
                style={{
                  fontSize: 38,
                  fontWeight: 500,
                  color: INK,
                  letterSpacing: "-1.5px",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                className="mono mt-2 uppercase"
                style={{
                  fontSize: 10,
                  letterSpacing: "1.8px",
                  color: MUTE,
                }}
              >
                {s.label}
              </div>
              {i < arr.length - 1 && (
                <span
                  aria-hidden
                  className="absolute"
                  style={{
                    right: 16,
                    top: "12%",
                    width: 1,
                    height: "76%",
                    background: LINE,
                  }}
                />
              )}
            </div>
          ))}
        </section>
      )}

      {/* CONTACT */}
      <section className="px-7 pb-8 pt-9">
        <SectHead num="03" title={t.contactTitle} />
        <div
          className="mt-3.5"
          style={{
            ["--card-primary" as string]: WARM,
          } as React.CSSProperties}
        >
          <ContactRows
            cardData={cardData}
            locale={locale}
            variant="hairline"
            tone="light"
            accentHex={WARM}
          />
        </div>
        {cardData.socials && (
          <div className="mt-5">
            <SocialRow
              socials={cardData.socials}
              variant="pill"
              accentHex={WARM}
            />
          </div>
        )}
      </section>

      {/* CTA */}
      {(cardData.bookingUrl || waDigits) && (
        <section className="px-7 pb-2">
          <a
            href={
              cardData.bookingUrl ||
              `https://wa.me/${waDigits}?text=${encodeURIComponent(t.bookBtn)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-6 py-3.5 uppercase"
            style={{
              background: INK,
              color: "#fff",
              fontSize: 12,
              letterSpacing: "2.5px",
              fontWeight: 500,
            }}
          >
            {t.bookBtn}
          </a>
        </section>
      )}

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="mt-7 px-7 py-7"
        style={{
          background: CARD,
          borderTop: `1px solid ${LINE}`,
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={INK} locale={locale} />
        <ExchangeSlot slug={slug} primary={INK} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-7 py-6"
          labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-center"
        >
          <div
            style={{
              ["--card-primary" as string]: INK,
              color: INK,
            } as React.CSSProperties}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer
        className="flex items-center justify-between gap-4 px-7 py-7"
        style={{ borderTop: `1px solid ${LINE}` }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.3px",
            color: INK,
          }}
        >
          {cardData.company || cardData.name}
        </div>
        <div
          className="mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "1.5px",
            color: MUTE_2,
          }}
        >
          &copy; {new Date().getFullYear()}
        </div>
      </footer>
      <div
        className="mono px-7 pb-7 text-center uppercase"
        style={{ fontSize: 9, letterSpacing: "1.5px", color: MUTE_2 }}
      >
        {t.poweredBy}{" "}
        <a
          href="https://opsolid.de/products/digital-card"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: WARM }}
        >
          OpSolid
        </a>
      </div>
    </article>
  );
}

function SectHead({ num, title }: { num: string; title: string }) {
  return (
    <>
      <div
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: "2.5px",
          color: MUTE_2,
          marginBottom: 6,
        }}
      >
        — {num}
      </div>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: INK,
          letterSpacing: "-0.3px",
        }}
      >
        {title}
      </h2>
    </>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const architectPureEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 85,
  key: "architect-pure",
  name: "Architect — Pure",
  industry: "Architecture / Swiss-grid white paper",
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
  sampleSlug: "demo-architect-pure",
};

// photo: Unsplash, https://unsplash.com/photos/Q9y3LRuuxmg — Free, no attribution required.
export const architectPureSample: SampleData = {
  templateId: 85,
  slug: "demo-architect-pure",
  cardData: {
    name: "Mehmet Yıldız",
    position: "Principal Architect",
    title: "Architekt & Gründer",
    company: "YıldızArch Architekten Berlin",
    email: "mehmet@yildizarch.de",
    phone: "+49 30 445 6780",
    whatsapp: "+49 30 445 6780",
    website: "yildizarch.de",
    address: "Linienstraße 142, 10115 Berlin",
    bio: "Architekt mit Fokus auf nachhaltiges Bauen und minimalistische Raumkonzepte. 15+ Projekte realisiert.",
    bookingUrl: "https://cal.com/yildizarch/intro",
    impressumUrl: "https://yildizarch.de/impressum",
    privacyUrl: "https://yildizarch.de/datenschutz",
    sectorKey: "architecture",
    socials: {
      instagram: "https://instagram.com/yildizarch",
      linkedin: "https://linkedin.com/in/mehmetyildiz-arch",
    },
    services: [
      { title: "Neubauplanung", description: "Architektonische Gesamtplanung.", priceLabel: "ab €8.000" },
      { title: "Innenarchitektur", description: "Räume mit Charakter.", priceLabel: "ab €3.500" },
      { title: "Beratung", description: "Strategische Bauberatung.", priceLabel: "€200/h" },
      { title: "Sustainable Design", description: "DGNB-orientierte Konzepte." },
      { title: "Urban Renewal", description: "Stadtentwicklung & Quartier." },
    ],
    stats: [
      { value: "85+", label: "Realisiert" },
      { value: "14", label: "Jahre" },
      { value: "8", label: "Länder" },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
