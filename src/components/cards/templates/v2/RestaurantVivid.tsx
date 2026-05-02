"use client";

// =============================================================================
// RestaurantVivid â€” v2 template (id=62, key="restaurant-vivid").
//
// Sector: Restaurant â€” VIVID variant. Mood: bold red/orange, appetite-driven
// energy, modern food-app feel. Inspired by kart_03_restoran_vivid.html.
//
// Design DNA:
//   - Hero with redâ†’orange gradient (240 px), rounded corner blobs, status
//     badge ("Open Â· Tue â€“ Sun") and city pin.
//   - Floating card on top of hero â€” squircle photo + bold name + role +
//     chef line + 4 colourful chips (sector / city / price / award).
//   - "Recommendations" section â€” 2-column rounded menu cards with leading
//     letter tile, price chip and orange/red shadow.
//   - Quote / review panel with oversized red quotation mark.
//   - Big gradient CTA + 3-up mini CTA row (WhatsApp / Menu / Directions).
//   - Hours card â€” dashed rows, red accent times.
//   - Social grid (4 columns, large icon tiles).
//   - QR-style red gradient share panel.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { ArrowUpRight, Calendar, MapPin, MessageCircle, Phone } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#c0392b";
const LOCKED_ACCENT = "#e74c3c";
const PAGE = "#fff7f2";
const SURFACE = "#ffffff";
const ACCENT_2 = "#f97316";
const ACCENT_DARK = "#7f1d1d";
const TEXT = "#1c0f0a";
const TEXT_SOFT = "#76554a";
const TEXT_MUTED = "#a0867a";
const BORDER = "#f3d9c8";

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
  const parts = name.replace(/^(Chef|Sef)\s+/i, "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Â·";
  if (parts.length === 1) return (parts[0][0] ?? "Â·").toUpperCase();
  return (parts[0][0] ?? "").toUpperCase() + (parts[parts.length - 1][0] ?? "").toUpperCase();
}

interface Copy {
  badgeOpen: string;
  recsTitle: string;
  recsTitleAccent: string;
  recsSub: string;
  ctaBig: string;
  hoursTitle: string;
  hoursMain: string;
  hoursWeekend: string;
  hoursClosed: string;
  hoursMainTime: string;
  hoursWeekendTime: string;
  hoursClosedTime: string;
  whatsappLabel: string;
  menuLabel: string;
  directionsLabel: string;
  shareTitle: string;
  shareSub: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr", Copy> = {
  de: {
    badgeOpen: "GeÃ¶ffnet Â· 12:00 â€“ 23:00",
    recsTitle: "Saisonale",
    recsTitleAccent: "Empfehlungen",
    recsSub: "Handverlesene Zutaten, Signature-Teller des KÃ¼chenchefs.",
    ctaBig: "Tisch reservieren",
    hoursTitle: "Ã–ffnungszeiten",
    hoursMain: "Di â€“ Sa",
    hoursWeekend: "Sonntag",
    hoursClosed: "Montag",
    hoursMainTime: "12:00 â€“ 23:00",
    hoursWeekendTime: "11:00 â€“ 17:00",
    hoursClosedTime: "Geschlossen",
    whatsappLabel: "WhatsApp",
    menuLabel: "MenÃ¼",
    directionsLabel: "Konum",
    shareTitle: "Folge uns",
    shareSub: "Erfahre als Erstes von neuen MenÃ¼s.",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    badgeOpen: "Open Â· 12:00 â€“ 23:00",
    recsTitle: "Seasonal",
    recsTitleAccent: "Picks",
    recsSub: "Hand-picked ingredients, chef's signature plates.",
    ctaBig: "Reserve a table",
    hoursTitle: "Opening Hours",
    hoursMain: "Tue â€“ Sat",
    hoursWeekend: "Sunday",
    hoursClosed: "Monday",
    hoursMainTime: "12:00 â€“ 23:00",
    hoursWeekendTime: "11:00 â€“ 17:00",
    hoursClosedTime: "Closed",
    whatsappLabel: "WhatsApp",
    menuLabel: "Menu",
    directionsLabel: "Directions",
    shareTitle: "Follow us",
    shareSub: "Be first to know about new menus.",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    badgeOpen: "AÃ§Ä±k Â· 12:00 â€“ 23:00",
    recsTitle: "Sezonun",
    recsTitleAccent: "Ã–nerileri",
    recsSub: "El seÃ§imi taze malzeme, ÅŸef imzasÄ± tabaklar.",
    ctaBig: "Rezervasyon Yap",
    hoursTitle: "Ã‡alÄ±ÅŸma Saatleri",
    hoursMain: "SalÄ± â€“ Cumartesi",
    hoursWeekend: "Pazar",
    hoursClosed: "Pazartesi",
    hoursMainTime: "12:00 â€“ 23:00",
    hoursWeekendTime: "11:00 â€“ 17:00",
    hoursClosedTime: "KapalÄ±",
    whatsappLabel: "WhatsApp",
    menuLabel: "MenÃ¼",
    directionsLabel: "Konum",
    shareTitle: "Bizi Takip Et",
    shareSub: "Yeni menÃ¼lerden ilk sen haberdar ol.",
    saveContact: "KiÅŸiyi Kaydet",
    walletLabel: "CÃ¼zdana ekle",
    poweredBy: "Powered by",
  },
};

const CHIP_COLORS = [
  { bg: "#fee2e2", fg: "#991b1b" },
  { bg: "#ffedd5", fg: "#9a3412" },
  { bg: "#fef3c7", fg: "#92400e" },
  { bg: "#dcfce7", fg: "#166534" },
];

export function RestaurantVivid({
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

  const photoUrl = resolveAssetUrl(photoPath);
  const initials = getInitials(cardData.name);
  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = (cardData.services ?? []).slice(0, 4);
  const restaurantName = cardData.company || cardData.name;
  const tagline = cardData.title || cardData.position || "";
  const city = cardData.address?.split(",").slice(-2)[0]?.trim() || "Berlin";

  const chips = [
    "Restaurant",
    city,
    "$$$",
    "Bib Gourmand",
  ];

  return (
    <article
      data-template="restaurant-vivid"
      className="rsv-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: PAGE, color: TEXT }}
    >
      <style jsx global>{`
        .rsv-card {
          font-family: var(--tpl-font-body, 'Nunito', 'Inter', system-ui, sans-serif);
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
        }
        .rsv-card a { color: inherit; }
      `}</style>

      {/* HERO */}
      <section
        className="relative overflow-hidden px-6 pt-7"
        style={{
          height: 220,
          background: `linear-gradient(135deg, ${ACCENT_DARK} 0%, ${primary} 50%, ${ACCENT_2} 100%)`,
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute right-[-60px] top-[-60px] block h-[200px] w-[200px] rounded-full"
          style={{ background: "rgba(255,255,255,0.12)" }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-[-80px] left-[-50px] block h-[220px] w-[220px] rounded-full"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
        <div className="relative z-10 flex items-center justify-between text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.9)", letterSpacing: "0.5px" }}>
          <span
            className="flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)" }}
          >
            <span
              aria-hidden
              className="block h-1.5 w-1.5 rounded-full"
              style={{ background: "#4ade80", boxShadow: "0 0 0 4px rgba(74,222,128,0.3)" }}
            />
            {t.badgeOpen}
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
          boxShadow: `0 24px 60px -20px ${ACCENT_DARK}59, 0 8px 24px -8px rgba(0,0,0,0.08)`,
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
                boxShadow: `0 4px 16px ${primary}40`,
              }}
            />
          ) : (
            <div
              className="flex items-center justify-center text-[24px] font-extrabold"
              style={{
                width: 76,
                height: 76,
                borderRadius: 18,
                background: `linear-gradient(135deg, ${ACCENT_2} 0%, ${primary} 100%)`,
                color: "#fff",
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
              {restaurantName}
            </h1>
            {tagline && (
              <div
                className="mt-1 text-[13px] font-semibold"
                style={{ color: primary }}
              >
                {tagline}
              </div>
            )}
            <div
              className="text-[12px] font-medium"
              style={{ color: TEXT_SOFT }}
            >
              {cardData.name}
            </div>
          </div>
        </div>

        {/* Chip row */}
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

      {/* SECTION TITLE */}
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

      {/* MENU CARDS 2-COL */}
      {services.length > 0 && (
        <section className="grid grid-cols-2 gap-2.5 px-6 pt-3">
          {services.map((svc, i) => {
            const letter = svc.title.slice(0, 1).toUpperCase();
            return (
              <div
                key={`${svc.title}-${i}`}
                className="relative overflow-hidden rounded-[18px] px-4 py-4"
                style={{
                  background: SURFACE,
                  boxShadow: `0 6px 20px -6px ${primary}1f, 0 2px 6px rgba(0,0,0,0.04)`,
                }}
              >
                <div
                  className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-[12px] text-[16px] font-extrabold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${ACCENT_2}, ${primary})`,
                    boxShadow: `0 4px 10px ${primary}4d`,
                  }}
                >
                  {letter}
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
                    className="mt-2.5 text-[16px]"
                    style={{ color: primary, letterSpacing: "-0.3px", fontWeight: 900 }}
                  >
                    {svc.priceLabel}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* QUOTE PANEL */}
      {cardData.bio && (
        <div
          className="relative mx-5 mt-7 overflow-hidden rounded-[20px] px-6 py-6"
          style={{
            background: `linear-gradient(135deg, #fff7ed 0%, #fff1f2 100%)`,
            border: `2px solid ${ACCENT_2}`,
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -top-2 left-4 leading-none"
            style={{
              fontSize: 78,
              color: primary,
              fontFamily: 'Georgia, serif',
              fontWeight: 900,
            }}
          >
            {"\""}
          </span>
          <p
            className="text-[14.5px] font-semibold leading-[1.55]"
            style={{ color: TEXT, paddingTop: 6 }}
          >
            {cardData.bio}
          </p>
          <div
            className="mt-3 flex items-center justify-between text-[12px]"
          >
            <span style={{ color: TEXT_SOFT, fontWeight: 700 }}>
              <strong style={{ color: primary, fontWeight: 800 }}>{cardData.name}</strong>
            </span>
            <span style={{ color: ACCENT_2, fontSize: 14, letterSpacing: "1px" }}>
              â˜…â˜…â˜…â˜…â˜…
            </span>
          </div>
        </div>
      )}

      {/* BIG CTA + 3-UP MINI ROW */}
      <section className="px-5 pb-6 pt-6">
        {phoneDigits && (
          <a
            href={`tel:${phoneDigits}`}
            className="mb-2.5 flex items-center justify-center gap-2 rounded-[16px] px-5 py-4 text-[15px] font-extrabold transition-all hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${primary} 0%, ${ACCENT_2} 100%)`,
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
            <MiniCTA
              href={`https://wa.me/${waDigits}`}
              label={t.whatsappLabel}
              external
            />
          )}
          {cardData.brochureUrl && (
            <MiniCTA href={cardData.brochureUrl} label={t.menuLabel} external />
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

      {/* HOURS CARD */}
      <div
        className="mx-5 mb-6 overflow-hidden rounded-[18px] px-5 py-5"
        style={{
          background: SURFACE,
          boxShadow: `0 6px 20px -8px ${primary}26`,
        }}
      >
        <h3
          className="mb-3 text-[15px] font-extrabold"
          style={{ color: TEXT, letterSpacing: "-0.2px" }}
        >
          {t.hoursTitle}
        </h3>
        <HourLine day={t.hoursMain} time={t.hoursMainTime} accent={primary} />
        <HourLine day={t.hoursWeekend} time={t.hoursWeekendTime} accent={primary} />
        <HourLine day={t.hoursClosed} time={t.hoursClosedTime} accent={primary} closed />
      </div>

      {/* CONTACT */}
      <section className="px-6 pb-6">
        <ContactRows cardData={cardData} locale={locale} variant="tile" accentHex={primary} />
      </section>

      {/* SOCIAL GRID */}
      <div className="grid grid-cols-4 gap-2 px-5 pb-6">
        <SocialTile href={phoneDigits ? `tel:${phoneDigits}` : "#"} icon={<Phone size={18} strokeWidth={2.2} />} label={t.whatsappLabel} />
        <SocialTile
          href={cardData.email ? `mailto:${cardData.email}` : "#"}
          icon="@"
          label="Email"
        />
        {cardData.socials?.instagram && (
          <SocialTile
            href={cardData.socials.instagram}
            icon="IG"
            label="Instagram"
            external
          />
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

      {/* QR-style share panel */}
      <div
        className="relative mx-5 mb-6 overflow-hidden rounded-[20px] px-6 py-6 text-center text-white"
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, ${ACCENT_2} 100%)`,
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

      {/* EXCHANGE */}
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
        {restaurantName} Â© {new Date().getFullYear()} Â· {city} Â·{" "}
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
        {TEXT_MUTED}
        <MessageCircle size={1} />
      </span>
    </article>
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

function HourLine({
  day,
  time,
  accent,
  closed,
}: {
  day: string;
  time: string;
  accent: string;
  closed?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between py-2 text-[13px] font-semibold"
      style={{ borderBottom: `1px dashed ${BORDER}` }}
    >
      <span style={{ color: TEXT }}>{day}</span>
      <span
        style={{
          color: closed ? TEXT_MUTED : accent,
          fontWeight: 800,
        }}
      >
        {time}
      </span>
    </div>
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
        boxShadow: "0 4px 12px -4px rgba(0,0,0,0.08)",
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

export const restaurantVividEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 62,
  key: "restaurant-vivid",
  name: "Restaurant â€” Vivid",
  industry: "Restaurant / Casual dining",
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
    brandPrimaryHex: "#c0392b",
    brandAccentHex: "#e74c3c",
  },
  sampleSlug: "demo-restaurant-vivid",
};

export const restaurantVividSample: SampleData = {
  templateId: 62,
  slug: "demo-restaurant-vivid",
  cardData: {
    name: "Marco Bianchi",
    position: "KÃ¼chenchef & Inhaber",
    title: "Italian Â· Trattoria",
    company: "Trattoria Bianchi",
    email: "marco@trattoriabianchi.de",
    phone: "+49 30 776 5432",
    whatsapp: "+49 30 776 5432",
    website: "trattoriabianchi.de",
    address: "SchÃ¶neberger Ufer 14, 10785 Berlin",
    bio: "Authentische italienische KÃ¼che seit 2012. Saisonale Produkte, hausgemachte Pasta, warme AtmosphÃ¤re.",
    bookingUrl: "https://cal.com/trattoria-bianchi/table",
    brochureUrl: "https://trattoriabianchi.de/menu.pdf",
    impressumUrl: "https://trattoriabianchi.de/impressum",
    privacyUrl: "https://trattoriabianchi.de/datenschutz",
    sectorKey: "restaurant",
    socials: {
      instagram: "https://instagram.com/trattoriabianchi",
      facebook: "https://facebook.com/trattoriabianchi.de",
    },
    services: [
      {
        title: "Pasta al Tartufo",
        description: "trÃ¼ffel Â· parmigiano Â· tagliatelle",
        priceLabel: "â‚¬24",
      },
      {
        title: "Tagliata di Manzo",
        description: "rinderfilet Â· rucola Â· balsamico",
        priceLabel: "â‚¬32",
      },
      {
        title: "TiramisÃ¹",
        description: "mascarpone Â· espresso Â· marsala",
        priceLabel: "â‚¬9",
      },
      {
        title: "Vino della Casa",
        description: "Chianti Classico Â· 0,75 L",
        priceLabel: "â‚¬28",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#c0392b",
  brandAccentHex: "#e74c3c",
};

