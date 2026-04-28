"use client";

// =============================================================================
// AutoDealer — v2 template (id=46, key="auto-dealer").
//
// Sector: Premium pre-owned auto dealer — DEFAULT variant. Mood: dark
// charcoal/chrome, Rajdhani display, automotive premium. Inspired by
// kart_19_oto_galeri.html.
//
// Locked design DNA (only colors respond to brand):
//   - Hero: full-bleed photo with overlay gradient. Brand caplabel (gold,
//     5 px tracked), uppercase Rajdhani name, small tagline.
//   - Profile strip: thin gold ring around small avatar + uppercase name +
//     small gold caplabel role.
//   - 3 quick contact buttons in a single hairline-divided strip.
//   - Featured car card: image + price block, with 3-column spec row
//     (year · transmission · fuel) inside hairlines.
//   - Brand grid: 6 brand cells in a hairline mosaic.
//   - Services list with arrow chevrons.
//   - Stats bar (3 cells) on the darkest surface.
//   - CTA: gold chunky button with letter-spaced caps text.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  ChevronRight,
  Cog,
  Fuel,
  Gauge,
  Mail,
  MessageCircle,
  Phone,
  Shield,
  Wrench,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#1c1c1e"; // charcoal
const LOCKED_ACCENT = "#b8b8b8"; // chrome silver
const PAGE = "#080808";
const SURFACE = "#111111";
const SURFACE_2 = "#181818";
const SURFACE_3 = "#0c0c0c";
const TEXT = "#f5f5f7";
const TEXT_SOFT = "rgba(245,245,247,0.78)";
const TEXT_MUTED = "rgba(245,245,247,0.5)";
const HAIRLINE = "rgba(255,255,255,0.08)";
const HAIRLINE_2 = "rgba(255,255,255,0.16)";

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
  callBtn: string;
  whatsappBtn: string;
  emailBtn: string;
  featuredH: string;
  featuredBadge: string;
  yearLabel: string;
  transLabel: string;
  fuelLabel: string;
  priceLabel: string;
  brandsH: string;
  servicesH: string;
  statsH: string;
  yearsLabel: string;
  carsLabel: string;
  warrantyLabel: string;
  cta: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  contact: string;
  founderTitle: string;
}

const COPY: Record<"de" | "en" | "tr", Copy> = {
  de: {
    callBtn: "Anrufen",
    whatsappBtn: "Nachricht",
    emailBtn: "E-Mail",
    featuredH: "Bestseller",
    featuredBadge: "Top-Pick",
    yearLabel: "Baujahr",
    transLabel: "Getriebe",
    fuelLabel: "Kraftstoff",
    priceLabel: "Preis",
    brandsH: "Marken",
    servicesH: "Services",
    statsH: "In Zahlen",
    yearsLabel: "Jahre",
    carsLabel: "Fahrzeuge",
    warrantyLabel: "Garantie",
    cta: "Termin vereinbaren",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    contact: "Kontakt",
    founderTitle: "Founder · 15 Jahre Erfahrung",
  },
  en: {
    callBtn: "Call",
    whatsappBtn: "Message",
    emailBtn: "Email",
    featuredH: "Featured",
    featuredBadge: "Top Pick",
    yearLabel: "Year",
    transLabel: "Trans.",
    fuelLabel: "Fuel",
    priceLabel: "Price",
    brandsH: "Brands",
    servicesH: "Services",
    statsH: "By the numbers",
    yearsLabel: "Years",
    carsLabel: "Cars sold",
    warrantyLabel: "Warranty",
    cta: "Book a viewing",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    contact: "Contact",
    founderTitle: "Founder · 15 yrs experience",
  },
  tr: {
    callBtn: "Ara",
    whatsappBtn: "Mesaj",
    emailBtn: "Mail",
    featuredH: "Öne Çıkan",
    featuredBadge: "Top Pick",
    yearLabel: "Yıl",
    transLabel: "Vites",
    fuelLabel: "Yakıt",
    priceLabel: "Fiyat",
    brandsH: "Markalar",
    servicesH: "Hizmetler",
    statsH: "Rakamlarla",
    yearsLabel: "Yıl",
    carsLabel: "Araç",
    warrantyLabel: "Garanti",
    cta: "Test Sürüşü Al",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    contact: "İletişim",
    founderTitle: "Founder · 15 Yıl Tecrübe",
  },
};

const BRANDS = ["BMW", "Mercedes", "Audi", "Porsche", "VW", "Volvo"];

const SERVICES_FALLBACK: { Icon: typeof Wrench; label: string }[] = [
  { Icon: Shield, label: "Garantie 12 Mo." },
  { Icon: Wrench, label: "Inspektion" },
  { Icon: Cog, label: "Finanzierung" },
];

export function AutoDealer({
  slug,
  cardData,
  locale = "de",
  photoPath,
  brandPrimaryHex,
  brandAccentHex,
  walletSlot,
}: TemplateProps) {
  const t = COPY[locale] ?? COPY.de;
  const accent = brandAccentHex || LOCKED_ACCENT;
  void (brandPrimaryHex || LOCKED_PRIMARY);
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];
  const featured = services[0];
  const year = new Date().getFullYear();

  return (
    <article
      data-template="auto-dealer"
      className="ad-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: SURFACE,
        color: TEXT,
        boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
      }}
    >
      <style jsx global>{`
        .ad-card {
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 300;
          line-height: 1.6;
          background: ${PAGE};
        }
        .ad-card .display {
          font-family: 'Rajdhani', 'Inter', system-ui, sans-serif;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .ad-card a { color: inherit; }
      `}</style>

      <div style={{ background: SURFACE }}>
        {/* HERO */}
        <header className="relative h-[260px] overflow-hidden">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt=""
              fill
              sizes="460px"
              unoptimized
              priority
              className="object-cover"
              style={{ filter: "brightness(0.9) contrast(1.05)" }}
            />
          ) : (
            <div
              className="h-full w-full"
              style={{ background: SURFACE_2 }}
            />
          )}
          <div
            className="absolute inset-0 flex flex-col justify-end px-7 pb-10 pt-8"
            style={{
              background: `linear-gradient(180deg, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.6) 60%, ${SURFACE} 100%)`,
            }}
          >
            <span
              className="display inline-block text-[11px] font-bold uppercase"
              style={{ color: accent, letterSpacing: "5px" }}
            >
              {cardData.company || "Premium Auto"}
            </span>
            <h1
              className="display mt-2 text-[32px] font-bold uppercase leading-none"
              style={{ letterSpacing: "1px" }}
            >
              {cardData.name}
            </h1>
            <div className="mt-2.5 text-[12px]" style={{ color: TEXT_SOFT }}>
              {cardData.position || "Premium Auto Dealership"}
              {cardData.address ? ` — ${cardData.address.split(",").slice(-1)[0]?.trim()}` : ""}
            </div>
          </div>
        </header>

        {/* PROFILE STRIP */}
        <section
          className="flex items-center gap-4 px-7 py-6"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <div
            className="relative h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-full"
            style={{ border: `1px solid ${accent}`, padding: 2 }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-full">
              {photoUrl ? (
                <Image src={photoUrl} alt="" fill sizes="60px" unoptimized className="object-cover" />
              ) : (
                <div
                  className="display flex h-full w-full items-center justify-center text-[16px] font-bold"
                  style={{ color: accent, background: SURFACE_2 }}
                >
                  {cardData.name.slice(0, 1)}
                </div>
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="display text-[17px] font-semibold uppercase"
              style={{ letterSpacing: "1px" }}
            >
              {cardData.name}
            </div>
            <div
              className="mt-1 text-[11px] uppercase"
              style={{ color: accent, letterSpacing: "2px" }}
            >
              {t.founderTitle}
            </div>
          </div>
        </section>

        {/* QUICK */}
        <div
          className="flex"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          {phoneDigits && (
            <QuickAction
              href={`tel:${phoneDigits}`}
              Icon={Phone}
              label={t.callBtn}
              accent={accent}
              right
            />
          )}
          {waDigits && (
            <QuickAction
              href={`https://wa.me/${waDigits}`}
              external
              Icon={MessageCircle}
              label={t.whatsappBtn}
              accent={accent}
              right={!!cardData.email}
            />
          )}
          {cardData.email && (
            <QuickAction href={`mailto:${cardData.email}`} Icon={Mail} label={t.emailBtn} accent={accent} />
          )}
        </div>

        {/* FEATURED CAR */}
        {featured && (
          <section className="px-7 py-10">
            <SectionLabel accent={accent}>{t.featuredH}</SectionLabel>
            <div
              className="mt-6 overflow-hidden rounded-2xl"
              style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}
            >
              <div className="px-6 py-7">
                <span
                  className="display inline-block px-3 py-1 text-[10px] font-bold uppercase"
                  style={{
                    background: accent,
                    color: PAGE,
                    letterSpacing: "2px",
                  }}
                >
                  {t.featuredBadge}
                </span>
                <div
                  className="display mt-3 text-[20px] font-bold uppercase"
                  style={{ letterSpacing: "1px" }}
                >
                  {featured.title}
                </div>
                {featured.description && (
                  <div className="mt-1 text-[12px]" style={{ color: TEXT_MUTED }}>
                    {featured.description}
                  </div>
                )}
                <div
                  className="mt-5 grid grid-cols-3 gap-3 py-4"
                  style={{
                    borderTop: `1px solid ${HAIRLINE}`,
                    borderBottom: `1px solid ${HAIRLINE}`,
                  }}
                >
                  <CarSpec Icon={Gauge} label={t.yearLabel} value="2021" />
                  <CarSpec Icon={Cog} label={t.transLabel} value="Auto" />
                  <CarSpec Icon={Fuel} label={t.fuelLabel} value="Diesel" />
                </div>
                <div className="mt-5 flex items-baseline justify-between">
                  <span
                    className="text-[10px] uppercase"
                    style={{ color: TEXT_MUTED, letterSpacing: "2px" }}
                  >
                    {t.priceLabel}
                  </span>
                  <span
                    className="display text-[24px] font-bold"
                    style={{ color: accent }}
                  >
                    {featured.priceLabel || "—"}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* BRANDS GRID */}
        <section className="px-7 pb-2">
          <SectionLabel accent={accent}>{t.brandsH}</SectionLabel>
          <div
            className="mt-6 grid grid-cols-3"
            style={{
              borderTop: `1px solid ${HAIRLINE}`,
              borderLeft: `1px solid ${HAIRLINE}`,
            }}
          >
            {BRANDS.map((b) => (
              <div
                key={b}
                className="display py-5 text-center text-[13px] font-bold uppercase transition-colors hover:bg-[--hover]"
                style={{
                  color: TEXT_SOFT,
                  borderRight: `1px solid ${HAIRLINE}`,
                  borderBottom: `1px solid ${HAIRLINE}`,
                  letterSpacing: "2px",
                  ["--hover" as string]: `${accent}1a`,
                }}
              >
                {b}
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        <section className="px-7 pt-10">
          <SectionLabel accent={accent}>{t.servicesH}</SectionLabel>
          <div className="mt-5">
            {(services.length > 1 ? services.slice(1, 6) : SERVICES_FALLBACK.map((s) => ({
              title: s.label,
              description: undefined as string | undefined,
              priceLabel: undefined as string | undefined,
            }))).map((svc, i, arr) => (
              <div
                key={`${svc.title}-${i}`}
                className="flex items-center justify-between py-4"
                style={{
                  borderBottom: i < arr.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <Wrench size={16} style={{ color: accent }} strokeWidth={1.6} />
                  <span
                    className="display text-[14px] font-medium"
                    style={{ color: TEXT, letterSpacing: "0.5px" }}
                  >
                    {svc.title}
                  </span>
                </div>
                <ChevronRight size={14} style={{ color: TEXT_MUTED }} strokeWidth={1.6} />
              </div>
            ))}
          </div>
        </section>

        {/* STATS */}
        <section
          className="mt-10 grid grid-cols-3"
          style={{
            background: SURFACE_3,
            borderTop: `1px solid ${HAIRLINE}`,
            borderBottom: `1px solid ${HAIRLINE}`,
          }}
        >
          <StatCell num="15" label={t.yearsLabel} accent={accent} right />
          <StatCell num="800+" label={t.carsLabel} accent={accent} right />
          <StatCell num="12mo" label={t.warrantyLabel} accent={accent} />
        </section>

        {/* CONTACT */}
        <section className="px-7 py-10">
          <SectionLabel accent={accent}>{t.contact}</SectionLabel>
          <div className="mt-5">
            <ContactRows
              cardData={cardData}
              locale={locale}
              variant="hairline"
              accentHex={accent}
            />
          </div>
        </section>

        {/* CTA */}
        <section className="px-7 pb-10">
          <a
            href={
              cardData.bookingUrl ||
              (waDigits ? `https://wa.me/${waDigits}` : `mailto:${cardData.email ?? ""}`)
            }
            target="_blank"
            rel="noopener noreferrer"
            className="display flex w-full items-center justify-center gap-3 px-5 py-5 text-[13px] font-bold uppercase transition-all hover:opacity-90"
            style={{
              background: accent,
              color: PAGE,
              letterSpacing: "4px",
            }}
          >
            {t.cta}
            <ArrowUpRight size={16} strokeWidth={2.2} />
          </a>
        </section>

        {cardData.socials && (
          <section className="px-7 pb-10">
            <SocialRow socials={cardData.socials} variant="pill" accentHex={accent} />
          </section>
        )}

        {/* WALLET / SEND / EXCHANGE */}
        <section
          className="mx-7 mb-9 p-5"
          style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}
        >
          <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
          <ExchangeSlot slug={slug} primary={accent} locale={locale} />
        </section>

        {walletSlot && (
          <WalletDock
            label={t.walletLabel}
            className="mx-7 mb-9 p-5"
            labelClassName="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-center"
          >
            <div style={{ ["--card-primary" as string]: accent, background: SURFACE_2 }}>
              {walletSlot}
            </div>
          </WalletDock>
        )}

        {/* FOOTER */}
        <footer
          className="px-7 py-7 text-center"
          style={{ borderTop: `1px solid ${HAIRLINE}` }}
        >
          <div
            className="display text-[13px] font-bold uppercase"
            style={{ color: accent, letterSpacing: "4px" }}
          >
            {(cardData.company || cardData.name).toUpperCase()}
          </div>
          <div
            className="mt-1.5 text-[10px] uppercase"
            style={{ color: TEXT_MUTED, letterSpacing: "2px" }}
          >
            © {year} · {t.poweredBy}{" "}
            <a
              href="https://opsolid.de/products/digital-card"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold"
              style={{ color: accent }}
            >
              OpSolid
            </a>
          </div>
        </footer>
      </div>
    </article>
  );
}

function SectionLabel({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <div
      className="display flex items-center gap-3 text-[12px] font-bold uppercase"
      style={{ color: accent, letterSpacing: "4px" }}
    >
      {children}
      <span
        aria-hidden
        className="block h-px flex-1"
        style={{ background: HAIRLINE_2 }}
      />
    </div>
  );
}

function QuickAction({
  href,
  Icon,
  label,
  external,
  accent,
  right,
}: {
  href: string;
  Icon: typeof Phone;
  label: string;
  external?: boolean;
  accent: string;
  right?: boolean;
}) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" as const } : {};
  return (
    <a
      href={href}
      {...ext}
      className="display flex flex-1 items-center justify-center gap-2 px-4 py-5 text-[12px] font-semibold uppercase transition-colors hover:bg-[--hover]"
      style={{
        color: TEXT,
        borderRight: right ? `1px solid ${HAIRLINE}` : undefined,
        letterSpacing: "2px",
        ["--hover" as string]: `${accent}1a`,
      }}
    >
      <Icon size={16} strokeWidth={1.6} style={{ color: accent }} />
      {label}
    </a>
  );
}

function CarSpec({
  Icon,
  label,
  value,
}: {
  Icon: typeof Gauge;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center">
      <Icon size={14} strokeWidth={1.6} style={{ color: TEXT_MUTED, margin: "0 auto" }} />
      <div
        className="mt-1.5 text-[9px] uppercase"
        style={{ color: TEXT_MUTED, letterSpacing: "1.5px" }}
      >
        {label}
      </div>
      <div
        className="display mt-1 text-[14px] font-semibold"
        style={{ color: TEXT }}
      >
        {value}
      </div>
    </div>
  );
}

function StatCell({
  num,
  label,
  accent,
  right,
}: {
  num: string;
  label: string;
  accent: string;
  right?: boolean;
}) {
  return (
    <div
      className="py-7 text-center"
      style={{ borderRight: right ? `1px solid ${HAIRLINE}` : undefined }}
    >
      <div
        className="display text-[28px] font-bold leading-none"
        style={{ color: accent }}
      >
        {num}
      </div>
      <div
        className="mt-2 text-[9px] uppercase"
        style={{ color: TEXT_MUTED, letterSpacing: "2px" }}
      >
        {label}
      </div>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const autoDealerEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 46,
  key: "auto-dealer",
  name: "Auto Dealer",
  industry: "Premium auto dealer / showroom",
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
  sampleSlug: "demo-auto-dealer",
  nameRules: { transform: "uppercase" },
};

// photo: Unsplash, premium car. Unsplash License — free, no attribution required.
export const autoDealerSample: SampleData = {
  templateId: 46,
  slug: "demo-auto-dealer",
  cardData: {
    name: "Tarık Arslan",
    position: "Otomotiv Danışmanı",
    title: "Founder",
    company: "Arslan Automobile",
    email: "tarik@arslanautomobile.de",
    phone: "+49 30 882 3456",
    whatsapp: "+49 170 882 3456",
    website: "arslanautomobile.de",
    address: "Charlottenburg, Berlin",
    bio: "Ihr Spezialist für Premium-Gebrauchtwagen in Berlin. BMW, Mercedes, Audi — geprüft & garantiert.",
    bookingUrl: "https://cal.com/arslanautomobile/intro",
    sectorKey: "retail",
    services: [
      { title: "BMW 530i", description: "2021 · 48.000 km · Schwarz", priceLabel: "€38.900" },
      { title: "Mercedes E220d", description: "2020 · 62.000 km · Silber", priceLabel: "€42.500" },
      { title: "Audi A6 Avant", description: "2022 · 24.000 km · Grau", priceLabel: "€49.800" },
      { title: "Garantie 12 Monate", description: "Auf alle Premium-Modelle", priceLabel: undefined },
      { title: "Inzahlungnahme", description: "Faire Bewertung in 24 h", priceLabel: undefined },
      { title: "Finanzierung", description: "Ab 2,9 % effektiv", priceLabel: undefined },
    ],
    socials: {
      instagram: "https://instagram.com/arslanautomobile",
      facebook: "https://facebook.com/arslanautomobile",
    },
  },
  photoUrl:
    "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
