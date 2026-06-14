"use client";

// =============================================================================
// TechStartup — tech startup / SaaS founder / AI builder (id=16, key="tech-startup").
//
// Design DNA: bold gradient hero (brandPrimary → brandAccent), large geometric
// sans (Space Grotesk), monospace meta labels (JetBrains Mono). Energetic,
// modern, founder-confident. Big "Building →" current-project line, stack
// tags row ("AI · SaaS · Berlin"), traction grid (services as metrics/
// products), giant "Let's build together" CTA. Photo + logo both supported.
//
// Locked design choices (do not parameterise):
//   - Gradient hero strip: linear-gradient(135deg, primary, accent).
//   - Photo (if any) sits as a 64×64 ring-bordered avatar; logo overlays the
//     bottom-left of the hero in a compact pill.
//   - Stack tags rendered as mono pills with primary-tinted backgrounds.
//   - "Building →" callout uses a hairline gradient frame.
//   - Traction/products grid is 2-col, each card with mono priceLabel as KPI.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Calendar,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Rocket,
  Shield,
  Sparkles,
  UserPlus,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { encodeSource, describeSource } from "@/components/cards/smart/SmartCardSource";
import { getSectorPreset } from "@/config/card-sectors";
import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { ServiceLink } from "./shared/ServiceLink";
import { resolveLabels } from "./shared/resolveLabels";
import type { TemplateProps, TemplateRegistryEntry, SampleData } from "./types";

// -----------------------------------------------------------------------------
// Default palette — electric purple → hot pink. Override-able via props.
// -----------------------------------------------------------------------------
const DEFAULT_PRIMARY = "#5b21b6"; // electric purple
const DEFAULT_ACCENT = "#ec4899"; // hot pink
const SURFACE_NIGHT = "#0b0a14"; // near-black with a violet shadow
const SURFACE_PANEL = "#15131f"; // raised dark panel
const INK_HIGH = "#f5f3ff";
const INK_MID = "rgba(245,243,255,0.72)";
const INK_LOW = "rgba(245,243,255,0.50)";
const INK_FAINT = "rgba(245,243,255,0.32)";

// -----------------------------------------------------------------------------
// Contrast helper — return a readable text colour for any hex background.
// -----------------------------------------------------------------------------
function readableTextOn(hex: string | null | undefined): string {
  if (!hex) return "#1a1a1a";
  const h = hex.replace("#", "");
  const r = parseInt(h.substr(0, 2), 16);
  const g = parseInt(h.substr(2, 2), 16);
  const b = parseInt(h.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#1a1a1a" : "#ffffff";
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
  if (parts.length === 0) return "•";
  if (parts.length === 1) return (parts[0][0] ?? "•").toUpperCase();
  return (
    (parts[0][0] ?? "").toUpperCase() + (parts[parts.length - 1][0] ?? "").toUpperCase()
  );
}

interface TsCopy {
  saveContact: string;
  callNow: string;
  whatsapp: string;
  email: string;
  book: string;
  building: string;
  shipping: string;
  about: string;
  contact: string;
  stack: string;
  social: string;
  walletLabel: string;
  buildCta: string;
  buildHint: string;
  letsBuild: string;
  traction: string;
  reachOut: string;
  impressum: string;
  privacy: string;
  poweredBy: string;
  shipped: string;
  open: string;
  liveBadge: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", TsCopy> = {
  de: {
    saveContact: "Speichern",
    callNow: "Anrufen",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    book: "Termin",
    building: "Wir bauen gerade",
    shipping: "Aktuell live",
    about: "Vision",
    contact: "Kontakt",
    stack: "Stack & Fokus",
    social: "Social",
    walletLabel: "Auf Smartphone speichern",
    buildCta: "Lass uns bauen",
    buildHint: "Pilot-Slots öffnen monatlich",
    letsBuild: "Lass uns gemeinsam bauen",
    traction: "Aktuelle Produkte",
    reachOut: "Schreib uns",
    impressum: "Impressum",
    privacy: "Datenschutz",
    poweredBy: "Powered by",
    shipped: "Live",
    open: "Öffnen",
    liveBadge: "Live · seit 2026",
  },
  en: {
    saveContact: "Save contact",
    callNow: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    book: "Book a call",
    building: "Currently building",
    shipping: "Now shipping",
    about: "Vision",
    contact: "Contact",
    stack: "Stack & focus",
    social: "Social",
    walletLabel: "Add to wallet",
    buildCta: "Let's build together",
    buildHint: "Pilot slots open monthly",
    letsBuild: "Let's build together",
    traction: "Live products",
    reachOut: "Reach out",
    impressum: "Imprint",
    privacy: "Privacy",
    poweredBy: "Powered by",
    shipped: "Live",
    open: "Open",
    liveBadge: "Live · since 2026",
  },
  tr: {
    saveContact: "Rehbere kaydet",
    callNow: "Ara",
    whatsapp: "WhatsApp",
    email: "E-posta",
    book: "Randevu al",
    building: "Şu an inşa ediyoruz",
    shipping: "Şu an canlı",
    about: "Vizyon",
    contact: "İletişim",
    stack: "Yığın & odak",
    social: "Sosyal",
    walletLabel: "Cüzdana ekle",
    buildCta: "Birlikte inşa edelim",
    buildHint: "Pilot kontenjan her ay açılır",
    letsBuild: "Birlikte inşa edelim",
    traction: "Canlı ürünler",
    reachOut: "Yaz bize",
    impressum: "Künye",
    privacy: "Gizlilik",
    poweredBy: "Powered by",
    shipped: "Canlı",
    open: "Aç",
    liveBadge: "Canlı · 2026'dan beri",
  },
  es: {

    saveContact: "Guardar contacto",
    callNow: "Llamar",
    whatsapp: "WhatsApp",
    email: "Correo",
    book: "Reservar una llamada",
    building: "Construyendo actualmente",
    shipping: "Enviando ahora",
    about: "Visión",
    contact: "Contacto",
    stack: "Stack y enfoque",
    social: "Redes",
    walletLabel: "Añadir a la cartera",
    buildCta: "Construyamos juntos",
    buildHint: "Plazas piloto cada mes",
    letsBuild: "Construyamos juntos",
    traction: "Productos en vivo",
    reachOut: "Contacta",
    impressum: "Aviso legal",
    privacy: "Privacidad",
    poweredBy: "Desarrollado por",
    shipped: "En vivo",
    open: "Abierto",
    liveBadge: "En vivo · desde 2026",
  
  },
  it: {

    saveContact: "Salva contatto",
    callNow: "Chiama",
    whatsapp: "WhatsApp",
    email: "Email",
    book: "Prenota una chiamata",
    building: "In costruzione",
    shipping: "Spedizioni in corso",
    about: "Visione",
    contact: "Contatto",
    stack: "Stack e focus",
    social: "Social",
    walletLabel: "Aggiungi al wallet",
    buildCta: "Costruiamo insieme",
    buildHint: "Posti pilota ogni mese",
    letsBuild: "Costruiamo insieme",
    traction: "Prodotti live",
    reachOut: "Contattaci",
    impressum: "Impressum",
    privacy: "Privacy",
    poweredBy: "Realizzato con",
    shipped: "Live",
    open: "Aperto",
    liveBadge: "Live · dal 2026",
  
  },
  fr: {

    saveContact: "Enregistrer le contact",
    callNow: "Appeler",
    whatsapp: "WhatsApp",
    email: "E-mail",
    book: "Réserver un appel",
    building: "En cours de construction",
    shipping: "Expédition en cours",
    about: "Vision",
    contact: "Contact",
    stack: "Stack et focus",
    social: "Réseaux",
    walletLabel: "Ajouter au portefeuille",
    buildCta: "Construisons ensemble",
    buildHint: "Places pilotes ouvertes chaque mois",
    letsBuild: "Construisons ensemble",
    traction: "Produits en direct",
    reachOut: "Nous contacter",
    impressum: "Mentions légales",
    privacy: "Confidentialité",
    poweredBy: "Propulsé par",
    shipped: "Live",
    open: "Ouvert",
    liveBadge: "Live · depuis 2026",
  
  },
  ar: {

    saveContact: "حفظ جهة الاتصال",
    callNow: "اتصال",
    whatsapp: "واتساب",
    email: "البريد الإلكتروني",
    book: "احجز مكالمة",
    building: "قيد البناء",
    shipping: "الشحن الآن",
    about: "الرؤية",
    contact: "اتصال",
    stack: "المنظومة والتركيز",
    social: "التواصل",
    walletLabel: "إضافة إلى المحفظة",
    buildCta: "لنبني معاً",
    buildHint: "أماكن تجريبية متاحة شهرياً",
    letsBuild: "لنبني معاً",
    traction: "منتجات حية",
    reachOut: "تواصل",
    impressum: "بيانات النشر",
    privacy: "الخصوصية",
    poweredBy: "مشغل بواسطة",
    shipped: "مباشر",
    open: "مفتوح",
    liveBadge: "مباشر · منذ 2026",
  
  },
};

export function TechStartup({
  slug,
  cardData,
  locale = "de",
  photoPath,
  logoPath,
  brandPrimaryHex,
  brandAccentHex,
  source,
  siteUrl,
  walletSlot,
}: TemplateProps) {
  const t = resolveLabels(COPY[locale] ?? COPY.de, cardData.labels);

  const sector = getSectorPreset(cardData.sectorKey);
  const primary = brandPrimaryHex || DEFAULT_PRIMARY;
  const accent = brandAccentHex || DEFAULT_ACCENT;

  const photoUrl = resolveAssetUrl(photoPath);
  const logoUrl = resolveAssetUrl(logoPath);
  const initials = getInitials(cardData.name);

  const products =
    cardData.services ?? sector?.services;

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  // Stack tags — derive from sector + tagline; fall back to a sensible generic.
  const stackTagsRaw: string[] = [];
  if (sector?.name) stackTagsRaw.push(sector.name);
  if (cardData.title) stackTagsRaw.push(cardData.title);
  if (cardData.address) {
    // Pull just the city — last comma-segment tends to be the country, second
    // to last the city. Fall back to first segment.
    const parts = cardData.address.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) stackTagsRaw.push(parts[parts.length - 2]);
    else if (parts.length === 1) stackTagsRaw.push(parts[0]);
  }
  const stackTags = stackTagsRaw.slice(0, 4);

  // "Building" line — first product title or a sensible fallback.
  const buildingNow = products && products.length > 0 ? products[0].title : null;

  return (
    <article
      data-template="tech-startup"
      className={`ts-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.7),0_8px_20px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/8`}
      style={
        {
          ["--ts-primary" as string]: primary,
          ["--ts-accent" as string]: accent,
          ["--ts-primary-soft" as string]: `${primary}26`,
          ["--ts-accent-soft" as string]: `${accent}26`,
          ["--card-primary" as string]: primary,
          ["--card-accent" as string]: accent,
          ["--font-tech-display" as string]: "'Space Grotesk', system-ui, sans-serif",
          ["--font-tech-mono" as string]: "'JetBrains Mono', 'Courier New', monospace",
          background: SURFACE_NIGHT,
          color: INK_HIGH,
          fontFamily: "var(--font-tech-display), system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .ts-card {
          font-family:var(--tpl-font-body,  var(--font-tech-display), "Space Grotesk", system-ui, sans-serif);
          line-height: 1.55;
        }
        .ts-card .ts-mono {
          font-family:var(--tpl-font-body,  var(--font-tech-mono), "JetBrains Mono", ui-monospace, monospace);
          letter-spacing: 0.02em;
          font-feature-settings: "tnum", "ss01";
        }
        .ts-card .ts-eyebrow {
          font-family:var(--tpl-font-body,  var(--font-tech-mono), "JetBrains Mono", ui-monospace, monospace);
          letter-spacing: 0.24em;
          text-transform: uppercase;
          font-weight: 600;
          font-feature-settings: "tnum";
        }
        .ts-card .ts-display {
          font-family:var(--tpl-font-body,  var(--font-tech-display), "Space Grotesk", system-ui, sans-serif);
          letter-spacing: -0.03em;
          font-weight: 700;
          line-height: 0.95;
        }
        @keyframes ts-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .ts-card .ts-pulse-dot {
          animation: ts-pulse 2.4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ts-card .ts-pulse-dot { animation: none; }
        }
      `}</style>

      <Hero
        photoUrl={photoUrl}
        logoUrl={logoUrl}
        initials={initials}
        company={cardData.company}
        name={cardData.name}
        title={cardData.position || cardData.title}
        primary={primary}
        accent={accent}
        sectorBadge={sector?.name}
        sourceLabel={sourceLabel}
        translations={t}
      />

      {buildingNow && (
        <BuildingNow
          line={buildingNow}
          primary={primary}
          accent={accent}
          translations={t}
        />
      )}

      {stackTags.length > 0 && (
        <StackTags items={stackTags} primary={primary} accent={accent} translations={t} />
      )}

      <QuickActionStrip
        slug={slug}
        sourceQs={sourceQs}
        phoneDigits={phoneDigits}
        waDigits={waDigits}
        email={cardData.email}
        bookingUrl={cardData.bookingUrl}
        primary={primary}
        accent={accent}
        translations={t}
      />

      {cardData.bio && (
        <Section title={t.about} accent={accent}>
          <p className="text-[14px] leading-[1.85]" style={{ color: INK_MID }}>
            {cardData.bio}
          </p>
        </Section>
      )}

      {products && products.length > 0 && (
        <ProductGrid items={products} primary={primary} accent={accent} title={t.traction} />
      )}

      <BuildTogetherCTA
        bookingUrl={cardData.bookingUrl}
        email={cardData.email}
        primary={primary}
        accent={accent}
        translations={t}
      />

      <Section title={t.contact} accent={accent}>
        <ContactRows
          cardData={cardData}
          locale={locale}
          variant="hairline"
          tone="dark"
          accentHex={accent}
          rowClassName="hover:text-[var(--ts-accent)]"
        />
      </Section>

      <CTASection
        slug={slug}
        sourceQs={sourceQs}
        locale={locale}
        primary={primary}
        accent={accent}
      />

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="border-t border-white/8 px-7 py-5"
          labelClassName="ts-eyebrow mb-3 text-[9.5px]"
        >
          {walletSlot}
        </WalletDock>
      )}

      {cardData.socials && (
        <Section title={t.social} accent={accent}>
          <SocialRow
            socials={cardData.socials}
            variant="icon"
            accentHex={accent}
            itemClassName="!border-white/12 !bg-white/[0.04] !text-white/80 hover:!border-[var(--ts-accent)] hover:!text-[var(--ts-accent)] hover:!bg-white/[0.06]"
          />
        </Section>
      )}

      <Footer
        siteUrl={siteUrl}
        slug={slug}
        impressumUrl={cardData.impressumUrl}
        privacyUrl={cardData.privacyUrl}
        primary={primary}
        accent={accent}
        translations={t}
      />
    </article>
  );
}

// =============================================================================
// HERO — gradient strip, founder avatar + logo pill, name + role.
// =============================================================================

function Hero({
  photoUrl,
  logoUrl,
  initials,
  company,
  name,
  title,
  primary,
  accent,
  sectorBadge,
  sourceLabel,
  translations,
}: {
  photoUrl: string | null;
  logoUrl: string | null;
  initials: string;
  company?: string;
  name: string;
  title?: string;
  primary: string;
  accent: string;
  sectorBadge?: string;
  sourceLabel?: string;
  translations: TsCopy;
}) {
  const onPrimary = readableTextOn(primary);

  return (
    <header
      className="relative overflow-hidden px-7 pb-8 pt-9"
      style={{
        background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
        color: onPrimary,
      }}
    >
      {/* Subtle grid pattern overlay for depth. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Soft radial glare top-right. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full"
        style={{
          background: `radial-gradient(closest-side, ${onPrimary === "#ffffff" ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.18)"}, transparent 70%)`,
        }}
      />

      <div className="relative">
        {/* Eyebrow row — sector / source / live badge. */}
        <div className="mb-7 flex flex-wrap items-center gap-2">
          <span
            className="ts-eyebrow inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px]"
            style={{
              background: onPrimary === "#ffffff" ? "rgba(0,0,0,0.28)" : "rgba(255,255,255,0.4)",
              color: onPrimary,
            }}
          >
            <span
              className="ts-pulse-dot block h-1.5 w-1.5 rounded-full"
              style={{ background: onPrimary }}
            />
            {translations.liveBadge}
          </span>
          {sectorBadge && (
            <span
              className="ts-eyebrow inline-block rounded-full px-2.5 py-1 text-[9px]"
              style={{
                background: onPrimary === "#ffffff" ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.10)",
                color: onPrimary,
                opacity: 0.92,
              }}
            >
              {sectorBadge}
            </span>
          )}
          {sourceLabel && (
            <span
              className="ts-eyebrow inline-block rounded-full px-2.5 py-1 text-[9px]"
              style={{
                background: onPrimary === "#ffffff" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)",
                color: onPrimary,
                opacity: 0.78,
              }}
            >
              {sourceLabel}
            </span>
          )}
        </div>

        {/* Avatar + identity row. */}
        <div className="flex items-start gap-4">
          {photoUrl ? (
            <div
              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-2"
              style={{
                background: SURFACE_PANEL,
                boxShadow: `0 0 0 4px ${onPrimary === "#ffffff" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)"}`,
              }}
            >
              <Image
                src={photoUrl}
                alt={name}
                width={128}
                height={128}
                unoptimized
                className="h-full w-full object-cover tpl-photo"
              />
            </div>
          ) : (
            <div
              className="ts-display flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-[1.15rem]"
              style={{
                background: onPrimary === "#ffffff" ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.14)",
                color: onPrimary,
                boxShadow: `0 0 0 4px ${onPrimary === "#ffffff" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
              }}
            >
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1 pt-0.5">
            <h1
              className="ts-display text-[1.85rem] sm:text-[2.05rem]"
              style={{ color: onPrimary }}
            >
              {name}
            </h1>
            {title && (
              <p
                className="mt-2 text-[13px] font-medium"
                style={{ color: onPrimary, opacity: 0.85 }}
              >
                {title}
              </p>
            )}
          </div>
        </div>

        {/* Bottom row — company logo pill (if any) + slash company name. */}
        {(company || logoUrl) && (
          <div className="mt-6 flex items-center gap-2.5">
            {logoUrl && (
              <div
                className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-md"
                style={{
                  background: onPrimary === "#ffffff" ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.85)",
                }}
              >
                <Image
                  src={logoUrl}
                  alt={company ? `${company} logo` : "Logo"}
                  width={48}
                  height={48}
                  unoptimized
                  className="h-5 w-5 object-contain tpl-logo"
                />
              </div>
            )}
            {company && (
              <span
                className="ts-mono inline-flex items-center gap-1.5 text-[11px] font-semibold"
                style={{ color: onPrimary, opacity: 0.92 }}
              >
                <span style={{ opacity: 0.55 }}>/</span> {company}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom hairline echo of accent. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${onPrimary === "#ffffff" ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.42)"}, transparent)`,
        }}
      />
    </header>
  );
}

// =============================================================================
// BuildingNow — current project / shipping line in a hairline gradient frame.
// =============================================================================

function BuildingNow({
  line,
  primary,
  accent,
  translations,
}: {
  line: string;
  primary: string;
  accent: string;
  translations: TsCopy;
}) {
  return (
    <section className="px-6 pt-7">
      <div
        className="relative flex items-center gap-3 rounded-2xl border px-4 py-3.5"
        style={{
          borderColor: `${accent}55`,
          background: `linear-gradient(135deg, ${primary}1A 0%, ${accent}14 100%)`,
        }}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${primary}, ${accent})`,
            color: readableTextOn(primary),
          }}
          aria-hidden
        >
          <Sparkles size={14} strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1">
          <span
            className="ts-eyebrow block text-[8.5px]"
            style={{ color: accent }}
          >
            {translations.building}
          </span>
          <p
            className="ts-mono mt-1 truncate text-[13px] font-semibold"
            style={{ color: INK_HIGH }}
          >
            {line}
          </p>
        </div>
        <span
          aria-hidden
          className="ts-pulse-dot block h-2 w-2 shrink-0 rounded-full"
          style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
        />
      </div>
    </section>
  );
}

// =============================================================================
// StackTags — mono pills rendered on a tiny eyebrow row.
// =============================================================================

function StackTags({
  items,
  primary,
  accent,
  translations,
}: {
  items: string[];
  primary: string;
  accent: string;
  translations: TsCopy;
}) {
  return (
    <section className="px-6 pt-5">
      <span
        className="ts-eyebrow mb-2 block text-[9px]"
        style={{ color: accent }}
      >
        {translations.stack}
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        {items.map((tag, i) => (
          <React.Fragment key={`${tag}-${i}`}>
            <span
              className="ts-mono inline-flex items-center rounded-md border px-2 py-1 text-[10.5px] font-medium"
              style={{
                borderColor: `${primary}40`,
                background: `${primary}1A`,
                color: INK_HIGH,
              }}
            >
              {tag}
            </span>
            {i < items.length - 1 && (
              <span
                className="ts-mono text-[10px] font-bold"
                style={{ color: accent, opacity: 0.6 }}
                aria-hidden
              >
                ·
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

// =============================================================================
// Quick action pills — neon-bordered on dark.
// =============================================================================

function QuickActionStrip({
  slug,
  sourceQs,
  phoneDigits,
  waDigits,
  email,
  bookingUrl,
  primary,
  accent,
  translations,
}: {
  slug: string;
  sourceQs: string;
  phoneDigits: string;
  waDigits: string;
  email?: string;
  bookingUrl?: string;
  primary: string;
  accent: string;
  translations: TsCopy;
}) {
  type Pill = {
    label: string;
    href: string;
    Icon: LucideIcon;
    tone: "primary" | "accent" | "neutral";
    download?: boolean;
    external?: boolean;
  };

  const pills: Pill[] = [
    {
      label: translations.saveContact,
      href: `/api/cards/${encodeURIComponent(slug)}/vcard${sourceQs}`,
      Icon: UserPlus,
      tone: "primary",
      download: true,
    },
  ];
  if (phoneDigits) {
    pills.push({
      label: translations.callNow,
      href: `tel:${phoneDigits}`,
      Icon: Phone,
      tone: "neutral",
    });
  }
  if (waDigits) {
    pills.push({
      label: translations.whatsapp,
      href: `https://wa.me/${waDigits}`,
      Icon: MessageCircle,
      tone: "neutral",
      external: true,
    });
  }
  if (email) {
    pills.push({
      label: translations.email,
      href: `mailto:${email}`,
      Icon: Mail,
      tone: "neutral",
    });
  }
  if (bookingUrl) {
    pills.push({
      label: translations.book,
      href: bookingUrl,
      Icon: Calendar,
      tone: "accent",
      external: true,
    });
  }

  return (
    <div className="grid grid-cols-2 gap-2 px-6 pb-2 pt-6 sm:grid-cols-3">
      {pills.map((p, i) => {
        const isPrimary = p.tone === "primary";
        const isAccent = p.tone === "accent";
        const ext = p.external
          ? { target: "_blank", rel: "noopener noreferrer" as const }
          : {};
        let bg = "rgba(255,255,255,0.04)";
        let border = "rgba(255,255,255,0.10)";
        let color = INK_HIGH;
        let shadow = "none";
        if (isPrimary) {
          bg = primary;
          border = primary;
          color = readableTextOn(primary);
          shadow = `0 8px 22px -10px ${primary}`;
        } else if (isAccent) {
          bg = accent;
          border = accent;
          color = readableTextOn(accent);
          shadow = `0 8px 22px -10px ${accent}`;
        }
        return (
          <a
            key={`${p.label}-${i}`}
            href={p.href}
            download={p.download}
            {...ext}
            className="ts-mono group relative flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-[11px] font-semibold transition-all hover:-translate-y-px"
            style={{
              background: bg,
              borderColor: border,
              color: color,
              boxShadow: shadow,
            }}
          >
            <p.Icon size={13} strokeWidth={2} />
            <span className="leading-none">{p.label}</span>
          </a>
        );
      })}
    </div>
  );
}

// =============================================================================
// Reusable Section frame.
// =============================================================================

function Section({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative px-6 py-7">
      <div className="mb-5 flex items-center gap-3">
        <span
          aria-hidden
          className="block h-px w-6"
          style={{ background: accent }}
        />
        <h2
          className="ts-eyebrow text-[10px]"
          style={{ color: accent }}
        >
          {title}
        </h2>
        <span
          aria-hidden
          className="block h-px flex-1"
          style={{
            background: `linear-gradient(90deg, ${accent}55 0%, transparent 100%)`,
          }}
        />
      </div>
      {children}
    </section>
  );
}

// =============================================================================
// ProductGrid — services rendered as live products / traction cards.
// =============================================================================

function ProductGrid({
  items,
  primary,
  accent,
  title,
}: {
  items: Array<{ title: string; description?: string; priceLabel?: string; href?: string | null }>;
  primary: string;
  accent: string;
  title: string;
}) {
  return (
    <Section title={title} accent={accent}>
      <div className="grid grid-cols-1 gap-2.5">
        {items.slice(0, 4).map((item, i) => (
          <ServiceLink
            key={`${item.title}-${i}`}
            href={item.href}
            className="group relative flex items-stretch gap-4 overflow-hidden rounded-xl border px-4 py-3.5 transition-all hover:-translate-y-px"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background: SURFACE_PANEL,
            }}
          >
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-[3px]"
              style={{
                background: `linear-gradient(180deg, ${primary}, ${accent})`,
              }}
            />
            <div className="min-w-0 flex-1 pl-1">
              <h3
                className="ts-display text-[14px] leading-tight"
                style={{ color: INK_HIGH }}
              >
                {item.title}
              </h3>
              {item.description && (
                <p
                  className="mt-1.5 line-clamp-2 text-[12px] leading-snug"
                  style={{ color: INK_MID }}
                >
                  {item.description}
                </p>
              )}
              {item.priceLabel && (
                <span
                  className="ts-mono mt-2 inline-flex items-center gap-1 text-[9.5px] font-semibold"
                  style={{ color: accent, letterSpacing: "0.06em" }}
                >
                  <Zap size={10} strokeWidth={2.2} />
                  {item.priceLabel}
                </span>
              )}
            </div>
            <div
              className="flex shrink-0 items-center"
              style={{ color: accent }}
              aria-hidden
            >
              <ArrowUpRight
                size={16}
                strokeWidth={1.8}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
          </ServiceLink>
        ))}
      </div>
    </Section>
  );
}

// =============================================================================
// BuildTogetherCTA — large primary call to action: gradient slab.
// =============================================================================

function BuildTogetherCTA({
  bookingUrl,
  email,
  primary,
  accent,
  translations,
}: {
  bookingUrl?: string;
  email?: string;
  primary: string;
  accent: string;
  translations: TsCopy;
}) {
  const href = bookingUrl ?? (email ? `mailto:${email}` : null);
  if (!href) return null;
  const external = bookingUrl ? true : false;
  const onAccent = readableTextOn(accent);

  return (
    <section className="px-6 py-6">
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="group relative flex items-stretch overflow-hidden rounded-2xl transition-all hover:-translate-y-px"
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
          boxShadow: `0 22px 50px -22px ${accent}, 0 6px 18px -10px ${primary}`,
          color: onAccent,
        }}
      >
        {/* Diagonal sheen. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.0) 35%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.0) 65%)",
          }}
        />
        <div className="relative flex-1 px-5 py-5">
          <span
            className="ts-eyebrow mb-1.5 block text-[8.5px]"
            style={{ color: onAccent, opacity: 0.78 }}
          >
            {translations.reachOut}
          </span>
          <span
            className="ts-display block text-[1.55rem] leading-tight"
            style={{ color: onAccent }}
          >
            {translations.letsBuild}
          </span>
          <span
            className="mt-1.5 block text-[11.5px]"
            style={{ color: onAccent, opacity: 0.85 }}
          >
            {translations.buildHint}
          </span>
        </div>
        <div
          className="relative flex w-14 shrink-0 items-center justify-center transition-transform group-hover:translate-x-0.5"
          style={{
            background: onAccent === "#ffffff" ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.30)",
          }}
        >
          <Rocket size={20} strokeWidth={1.8} style={{ color: onAccent }} />
        </div>
      </a>
    </section>
  );
}

// =============================================================================
// CTA section — Wallet/Exchange/SendMyInfo wrappers.
// =============================================================================

function CTASection({
  slug,
  sourceQs,
  locale,
  primary,
  accent,
}: {
  slug: string;
  sourceQs: string;
  locale: "de" | "en" | "tr" | "es" | "it" | "fr" | "ar";
  primary: string;
  accent: string;
}) {
  return (
    <section className="px-6 py-2">
      <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={accent} locale={locale} />
      <ExchangeSlot slug={slug} primary={primary} locale={locale} />
    </section>
  );
}

// =============================================================================
// Footer — dark band with neon-tinged share and brand line.
// =============================================================================

function Footer({
  siteUrl,
  slug,
  impressumUrl,
  privacyUrl,
  primary,
  accent,
  translations,
}: {
  siteUrl: string;
  slug: string;
  impressumUrl?: string;
  privacyUrl?: string;
  primary: string;
  accent: string;
  translations: TsCopy;
}) {
  return (
    <footer
      className="relative px-6 pb-7 pt-7"
      style={{ background: "#070611", color: INK_LOW }}
    >
      <div
        aria-hidden
        className="absolute inset-x-6 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${primary} 30%, ${accent} 70%, transparent 100%)`,
        }}
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10.5px]">
        <FooterShare siteUrl={siteUrl} slug={slug} />
        {impressumUrl && (
          <a
            href={impressumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            {translations.impressum}
          </a>
        )}
        {privacyUrl && (
          <a
            href={privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            {translations.privacy}
          </a>
        )}
        <span className="ml-auto inline-flex items-center gap-1.5">
          <Shield size={11} strokeWidth={1.8} />
          {translations.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="ts-eyebrow font-semibold transition-colors hover:text-white"
            style={{ color: accent }}
          >
            OpSolid
          </a>
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <MapPin size={11} strokeWidth={1.6} style={{ color: accent }} />
        <span className="ts-mono text-[9.5px]" style={{ color: INK_FAINT }}>
          {`opsolid.de/c/${slug}`}
        </span>
      </div>
    </footer>
  );
}

function FooterShare({ siteUrl, slug }: { siteUrl: string; slug: string }) {
  const url = `${siteUrl}/c/${slug}`;
  return (
    <button
      type="button"
      onClick={async () => {
        if (typeof navigator !== "undefined" && "share" in navigator) {
          try {
            await navigator.share({ url, title: "Smart Card" });
            return;
          } catch {
            // User cancelled.
          }
        }
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        }
      }}
      className="hover:text-white"
    >
      Share
    </button>
  );
}

// =============================================================================
// Registry entry + sample data.
// =============================================================================

export const techStartupEntry: TemplateRegistryEntry = {
  id: 16,
  key: "tech-startup",
  name: "Tech Startup",
  industry: "Tech startup / SaaS founder / AI builder",
  Component: TechStartup,
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
    logo: true,
  },
  defaults: {
    brandPrimaryHex: DEFAULT_PRIMARY,
    brandAccentHex: DEFAULT_ACCENT,
  },
  sampleSlug: "sample-tech-startup",
};

export const techStartupSample: SampleData = {
  templateId: 16,
  slug: "sample-tech-startup",
  brandPrimaryHex: DEFAULT_PRIMARY,
  brandAccentHex: DEFAULT_ACCENT,
  cardData: {
    name: "Lina Park",
    title: "Co-founder · CTO",
    position: "Co-founder · CTO",
    company: "Helix AI",
    email: "lina@helix.ai",
    phone: "+49 30 5588 7720",
    whatsapp: "+49 174 9921 4408",
    website: "https://helix.ai",
    address: "Helix AI GmbH, Schlesische Str. 27, 10997 Berlin, Germany",
    bio: "Helix is the AI workflow layer for B2B operations teams — connect your stack, describe what you want, and watch the runs land in Slack within the hour. We're a four-person team out of Berlin, ex-Stripe and ex-Plaid, building the tool we wished existed when we were on call.",
    bookingUrl: "https://cal.com/helix/intro",
    sectorKey: "consultant",
    services: [
      {
        title: "Helix Workflows v2.4",
        description:
          "Visual builder + LLM orchestration for ops teams. 240 integrations, SOC 2 Type II, on-prem option for regulated buyers.",
        priceLabel: "GA · Mar 2026",
      },
      {
        title: "Helix Agents (beta)",
        description:
          "Long-running autonomous workers for triage, lead enrichment and incident routing. Currently piloting with 18 design partners.",
        priceLabel: "BETA · 18 design partners",
      },
      {
        title: "Helix Connect",
        description:
          "OSS connector framework — write a connector once, ship to every workflow buyer in the ecosystem. 1.4k GitHub stars.",
        priceLabel: "OSS · 1.4k stars",
      },
      {
        title: "Helix Cloud (managed)",
        description:
          "EU-hosted managed deployment, region-pinned to Frankfurt. Single-tenant, BYOK encryption, 99.95% SLA.",
        priceLabel: "EU · 99.95% SLA",
      },
    ],
    socials: {
      linkedin: "https://linkedin.com/in/linapark",
      x: "https://x.com/linabuilds",
      github: "https://github.com/helix-ai",
    },
    impressumUrl: "https://helix.ai/imprint",
    privacyUrl: "https://helix.ai/privacy",
  },
};
