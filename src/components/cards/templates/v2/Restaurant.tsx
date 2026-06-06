"use client";

// =============================================================================
// Restaurant — v2 template (id=14, key="restaurant").
//
// Design DNA: warm, appetite-inviting, hand-crafted trattoria/bistro feel —
// distinct from KitchenAtelier (id=3, which is a chef-patron portfolio with
// olive/terracotta + tasting menu). This template leans toward a working
// neighbourhood restaurant or café:
//
//   - Full-bleed hero photo of the room/dish (220 px) with a subtle warm
//     amber overlay so any uploaded photo reads cohesive.
//   - "Today's special" / hours bar in the brand primary colour, sits
//     immediately under the hero — appetite-cue at the top of the card.
//   - Centred Playfair display name with a circular logo seal, optional
//     subtitle ("Trattoria · Aperto dal 1987").
//   - Quick-action pills (Reservation / WhatsApp / Directions) coloured
//     by the brand.
//   - Menu grid (services) with hand-drawn dotted leaders between dish
//     name and price — every restaurant menu in the world uses this.
//   - Opening hours table — derived from `cardData.faqs` if a question
//     mentions "hours/Öffnungszeiten/saatler", otherwise from a sensible
//     default block. Hairlines in brand-accent.
//   - Dish gallery (2-up), testimonials with star row, contact card with
//     map link, prominent "Book a table" CTA.
//
// All accents/headings/CTAs derive from `brandPrimaryHex` / `brandAccentHex`
// — passing a different colour fully re-skins the card. Text on coloured
// surfaces uses the `readableTextOn()` contrast helper.
//
// Variable per card: cardData, photoPath, logoPath, brandPrimaryHex (warm
// burgundy default), brandAccentHex (cream default).
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  CalendarHeart,
  ChefHat,
  Clock,
  FileDown,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  Star,
  Utensils,
} from "lucide-react";

import { encodeSource, describeSource } from "@/components/cards/smart/SmartCardSource";
import { getSectorPreset } from "@/config/card-sectors";
import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

// -----------------------------------------------------------------------------
// Locked palette — only the brand hexes flex per card.
// -----------------------------------------------------------------------------
const LOCKED_PRIMARY = "#7a2e1e"; // warm burgundy
const LOCKED_ACCENT = "#d4a574"; // cream / wheat
const PAGE_BG = "#fbf6ee"; // warm off-white parchment
const SURFACE = "#ffffff";
const TEXT_DARK = "#231a12";
const TEXT_MID = "#5a4a38";
const TEXT_LIGHT = "#9a8870";
const BORDER = "#ecdfc8";

// -----------------------------------------------------------------------------
// Contrast helper — pick black/white text for a brand-coloured surface.
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
  if (parts.length === 0) return "·";
  if (parts.length === 1) return (parts[0][0] ?? "·").toUpperCase();
  return (
    (parts[0][0] ?? "").toUpperCase() + (parts[parts.length - 1][0] ?? "").toUpperCase()
  );
}

// -----------------------------------------------------------------------------
// Hours extraction — many restaurant cards put opening hours in `cardData.faqs`.
// We surface them as a small dedicated table when we can find a matching FAQ;
// otherwise we render a pleasant fallback "Open today" line.
// -----------------------------------------------------------------------------
function findHoursAnswer(
  faqs: TemplateProps["cardData"]["faqs"],
): string | null {
  if (!faqs) return null;
  const re = /(hours|opening|öffnungszeiten|saatler|saatleri|aç(ı|i)k|orari|horaires)/i;
  for (const f of faqs) {
    if (re.test(f.q) || re.test(f.a ?? "")) return f.a;
  }
  return null;
}

// -----------------------------------------------------------------------------
// Localised copy.
// -----------------------------------------------------------------------------
interface RsCopy {
  reserve: string;
  callNow: string;
  whatsapp: string;
  directions: string;
  email: string;
  todaysMenu: string;
  todaysMenuEyebrow: string;
  fromTheKitchen: string;
  fromTheKitchenEyebrow: string;
  guests: string;
  guestsEyebrow: string;
  hours: string;
  hoursEyebrow: string;
  contact: string;
  contactEyebrow: string;
  bookTable: string;
  social: string;
  socialEyebrow: string;
  walletLabel: string;
  brochureCta: string;
  about: string;
  aboutEyebrow: string;
  impressum: string;
  privacy: string;
  poweredBy: string;
  share: string;
  openToday: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", RsCopy> = {
  de: {
    reserve: "Reservieren",
    callNow: "Anrufen",
    whatsapp: "WhatsApp",
    directions: "Anfahrt",
    email: "E-Mail",
    todaysMenu: "Aus der Küche",
    todaysMenuEyebrow: "Heute auf der Karte",
    fromTheKitchen: "Bilder",
    fromTheKitchenEyebrow: "Aus dem Haus",
    guests: "Gäste sagen",
    guestsEyebrow: "Stimmen",
    hours: "Öffnungszeiten",
    hoursEyebrow: "Wir sind da",
    contact: "Kontakt",
    contactEyebrow: "So erreichen Sie uns",
    bookTable: "Tisch reservieren",
    social: "Folgen",
    socialEyebrow: "Bleiben wir in Kontakt",
    walletLabel: "Auf Smartphone speichern",
    brochureCta: "Vollständige Karte (PDF)",
    about: "Über uns",
    aboutEyebrow: "Hinter der Theke",
    impressum: "Impressum",
    privacy: "Datenschutz",
    poweredBy: "Powered by",
    share: "Teilen",
    openToday: "Heute geöffnet",
  },
  en: {
    reserve: "Reserve",
    callNow: "Call",
    whatsapp: "WhatsApp",
    directions: "Directions",
    email: "Email",
    todaysMenu: "From the Kitchen",
    todaysMenuEyebrow: "On the menu",
    fromTheKitchen: "Gallery",
    fromTheKitchenEyebrow: "From the dining room",
    guests: "Guests say",
    guestsEyebrow: "Voices",
    hours: "Opening hours",
    hoursEyebrow: "We're open",
    contact: "Find us",
    contactEyebrow: "How to reach us",
    bookTable: "Book a table",
    social: "Follow",
    socialEyebrow: "Stay in touch",
    walletLabel: "Add to wallet",
    brochureCta: "Full menu (PDF)",
    about: "About",
    aboutEyebrow: "Behind the counter",
    impressum: "Imprint",
    privacy: "Privacy",
    poweredBy: "Powered by",
    share: "Share",
    openToday: "Open today",
  },
  tr: {
    reserve: "Rezervasyon",
    callNow: "Ara",
    whatsapp: "WhatsApp",
    directions: "Yol tarifi",
    email: "E-posta",
    todaysMenu: "Mutfaktan",
    todaysMenuEyebrow: "Bugün menüde",
    fromTheKitchen: "Galeri",
    fromTheKitchenEyebrow: "Mekanımızdan",
    guests: "Misafirler",
    guestsEyebrow: "Sesler",
    hours: "Çalışma saatleri",
    hoursEyebrow: "Buradayız",
    contact: "Bizi bulun",
    contactEyebrow: "Bize ulaşın",
    bookTable: "Masa rezerve et",
    social: "Takip et",
    socialEyebrow: "İletişimde kalalım",
    walletLabel: "Cüzdana ekle",
    brochureCta: "Tam menü (PDF)",
    about: "Hakkımızda",
    aboutEyebrow: "Tezgâhın arkasında",
    impressum: "Künye",
    privacy: "Gizlilik",
    poweredBy: "Powered by",
    share: "Paylaş",
    openToday: "Bugün açığız",
  },
  es: {

    reserve: "Reservar",
    callNow: "Llamar",
    whatsapp: "WhatsApp",
    directions: "Cómo llegar",
    email: "Correo",
    todaysMenu: "Desde la cocina",
    todaysMenuEyebrow: "En la carta",
    fromTheKitchen: "Galería",
    fromTheKitchenEyebrow: "Desde el comedor",
    guests: "Nuestros huéspedes dicen",
    guestsEyebrow: "Voces",
    hours: "Horario de apertura",
    hoursEyebrow: "Estamos abiertos",
    contact: "Encuéntranos",
    contactEyebrow: "Cómo contactarnos",
    bookTable: "Reservar mesa",
    social: "Seguir",
    socialEyebrow: "Mantente en contacto",
    walletLabel: "Añadir a la cartera",
    brochureCta: "Carta completa (PDF)",
    about: "Acerca de",
    aboutEyebrow: "Detrás del mostrador",
    impressum: "Aviso legal",
    privacy: "Privacidad",
    poweredBy: "Desarrollado por",
    share: "Compartir",
    openToday: "Abierto hoy",
  
  },
  it: {

    reserve: "Prenota",
    callNow: "Chiama",
    whatsapp: "WhatsApp",
    directions: "Indicazioni",
    email: "Email",
    todaysMenu: "Dalla cucina",
    todaysMenuEyebrow: "Nel menù",
    fromTheKitchen: "Galleria",
    fromTheKitchenEyebrow: "Dalla sala",
    guests: "I nostri ospiti dicono",
    guestsEyebrow: "Voci",
    hours: "Orari di apertura",
    hoursEyebrow: "Siamo aperti",
    contact: "Dove siamo",
    contactEyebrow: "Come raggiungerci",
    bookTable: "Prenota un tavolo",
    social: "Segui",
    socialEyebrow: "Resta in contatto",
    walletLabel: "Aggiungi al wallet",
    brochureCta: "Menù completo (PDF)",
    about: "Chi siamo",
    aboutEyebrow: "Dietro il bancone",
    impressum: "Impressum",
    privacy: "Privacy",
    poweredBy: "Realizzato con",
    share: "Condividi",
    openToday: "Aperto oggi",
  
  },
  fr: {

    reserve: "Réserver",
    callNow: "Appeler",
    whatsapp: "WhatsApp",
    directions: "Itinéraire",
    email: "E-mail",
    todaysMenu: "Depuis la cuisine",
    todaysMenuEyebrow: "Au menu",
    fromTheKitchen: "Galerie",
    fromTheKitchenEyebrow: "Depuis la salle",
    guests: "Nos hôtes témoignent",
    guestsEyebrow: "Témoignages",
    hours: "Horaires d'ouverture",
    hoursEyebrow: "Nous sommes ouverts",
    contact: "Nous trouver",
    contactEyebrow: "Comment nous joindre",
    bookTable: "Réserver une table",
    social: "Suivre",
    socialEyebrow: "Restez en contact",
    walletLabel: "Ajouter au portefeuille",
    brochureCta: "Menu complet (PDF)",
    about: "À propos",
    aboutEyebrow: "Derrière le comptoir",
    impressum: "Mentions légales",
    privacy: "Confidentialité",
    poweredBy: "Propulsé par",
    share: "Partager",
    openToday: "Ouvert aujourd'hui",
  
  },
  ar: {

    reserve: "احجز",
    callNow: "اتصال",
    whatsapp: "واتساب",
    directions: "الاتجاهات",
    email: "البريد الإلكتروني",
    todaysMenu: "من المطبخ",
    todaysMenuEyebrow: "على القائمة",
    fromTheKitchen: "المعرض",
    fromTheKitchenEyebrow: "من الصالة",
    guests: "ماذا يقول الضيوف",
    guestsEyebrow: "أصوات",
    hours: "ساعات الافتتاح",
    hoursEyebrow: "نحن مفتوحون",
    contact: "اعثر علينا",
    contactEyebrow: "كيف تصل إلينا",
    bookTable: "احجز طاولة",
    social: "متابعة",
    socialEyebrow: "ابقَ على تواصل",
    walletLabel: "إضافة إلى المحفظة",
    brochureCta: "القائمة الكاملة (PDF)",
    about: "حول",
    aboutEyebrow: "خلف المنضدة",
    impressum: "بيانات النشر",
    privacy: "الخصوصية",
    poweredBy: "مشغل بواسطة",
    share: "مشاركة",
    openToday: "مفتوح اليوم",
  
  },
};

// =============================================================================
// Template root
// =============================================================================

export function Restaurant({
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
  const t = COPY[locale] ?? COPY.de;

  const sector = getSectorPreset(cardData.sectorKey);
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;
  const onPrimary = readableTextOn(primary);
  const onAccent = readableTextOn(accent);

  const photoUrl = resolveAssetUrl(photoPath);
  const logoUrl = resolveAssetUrl(logoPath);
  const initials = getInitials(cardData.company ?? cardData.name);

  const services =
    cardData.services ?? sector?.services;

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  const subtitle = [cardData.position, cardData.title].filter(Boolean).join(" · ");
  const hoursAnswer = findHoursAnswer(cardData.faqs);

  return (
    <article
      data-template="restaurant"
      className={`rs-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] shadow-[0_30px_70px_-30px_rgba(60,30,15,0.45),0_8px_22px_-12px_rgba(60,30,15,0.18)] ring-1 ring-[#ecdfc8]`}
      style={
        {
          ["--rs-primary" as string]: primary,
          ["--rs-accent" as string]: accent,
          ["--rs-on-primary" as string]: onPrimary,
          ["--rs-on-accent" as string]: onAccent,
          ["--rs-page" as string]: PAGE_BG,
          ["--rs-surface" as string]: SURFACE,
          ["--rs-text" as string]: TEXT_DARK,
          ["--rs-text-mid" as string]: TEXT_MID,
          ["--rs-text-light" as string]: TEXT_LIGHT,
          ["--rs-border" as string]: BORDER,
          ["--font-restaurant-display" as string]: "'Playfair Display', Georgia, serif",
          ["--font-restaurant-body" as string]: "'Inter', system-ui, sans-serif",
          background: PAGE_BG,
          color: TEXT_DARK,
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .rs-card {
          font-family:var(--tpl-font-body,  var(--font-restaurant-body), "Inter", system-ui, sans-serif);
          line-height: 1.65;
        }
        .rs-card .rs-display {
          font-family:var(--tpl-font-body,  var(--font-restaurant-display), "Playfair Display", Georgia, serif);
          letter-spacing: 0.005em;
        }
        .rs-card .rs-italic {
          font-family:var(--tpl-font-body,  var(--font-restaurant-display), "Playfair Display", Georgia, serif);
          font-style: italic;
        }
        .rs-card .rs-eyebrow {
          font-family:var(--tpl-font-body,  var(--font-restaurant-display), "Playfair Display", Georgia, serif);
          font-style: italic;
          letter-spacing: 0.04em;
        }
        .rs-card .rs-leader {
          /* Hand-drawn dotted leader for menu rows */
          background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
          background-position: bottom;
          background-size: 6px 2px;
          background-repeat: repeat-x;
        }
      `}</style>

      <Hero
        photoUrl={photoUrl}
        company={cardData.company}
        primary={primary}
        accent={accent}
        onPrimary={onPrimary}
        sourceLabel={sourceLabel}
      />

      <SealOverlay
        logoUrl={logoUrl}
        initials={initials}
        primary={primary}
        accent={accent}
      />

      <NameStrip
        name={cardData.name}
        company={cardData.company}
        subtitle={subtitle}
        primary={primary}
        accent={accent}
      />

      <SpecialBar
        primary={primary}
        accent={accent}
        onPrimary={onPrimary}
        message={hoursAnswer ? hoursAnswer.split(/[\n.]/)[0] : t.openToday}
        cta={t.bookTable}
        bookingUrl={cardData.bookingUrl}
      />

      <QuickActions
        cardData={cardData}
        primary={primary}
        accent={accent}
        onPrimary={onPrimary}
        onAccent={onAccent}
        translations={t}
      />

      {cardData.bio && (
        <Section
          title={t.about}
          eyebrow={t.aboutEyebrow}
          accent={accent}
          primary={primary}
        >
          <p
            className="text-[14px] leading-[1.85]"
            style={{ color: "var(--rs-text-mid)" }}
          >
            <span
              className="rs-display float-left mr-2 mt-1 text-[42px] font-bold leading-[0.85]"
              style={{ color: primary }}
            >
              {cardData.bio.charAt(0)}
            </span>
            {cardData.bio.slice(1)}
          </p>
        </Section>
      )}

      {services && services.length > 0 && (
        <Section
          title={t.todaysMenu}
          eyebrow={t.todaysMenuEyebrow}
          accent={accent}
          primary={primary}
          background={SURFACE}
        >
          <ul className="grid gap-4">
            {services.slice(0, 8).map((item, i) => (
              <MenuRow
                key={`${item.title}-${i}`}
                item={item}
                accent={accent}
                primary={primary}
              />
            ))}
          </ul>
        </Section>
      )}

      {hoursAnswer && (
        <Section
          title={t.hours}
          eyebrow={t.hoursEyebrow}
          accent={accent}
          primary={primary}
        >
          <HoursTable raw={hoursAnswer} accent={accent} primary={primary} />
        </Section>
      )}

      {cardData.gallery && cardData.gallery.length > 0 && (
        <Section
          title={t.fromTheKitchen}
          eyebrow={t.fromTheKitchenEyebrow}
          accent={accent}
          primary={primary}
        >
          <DishGrid items={cardData.gallery.slice(0, 4)} primary={primary} />
        </Section>
      )}

      {cardData.testimonials && cardData.testimonials.length > 0 && (
        <Section
          title={t.guests}
          eyebrow={t.guestsEyebrow}
          accent={accent}
          primary={primary}
          background={SURFACE}
        >
          <div className="grid gap-3">
            {cardData.testimonials.slice(0, 3).map((item, i) => (
              <TestimonialCard
                key={`${item.author}-${i}`}
                item={item}
                accent={accent}
                primary={primary}
              />
            ))}
          </div>
        </Section>
      )}

      <Section
        title={t.contact}
        eyebrow={t.contactEyebrow}
        accent={accent}
        primary={primary}
      >
        <ContactRows
          cardData={cardData}
          locale={locale}
          variant="hairline"
          accentHex={primary}
          renderRow={(row) => (
            <a
              href={row.href}
              {...(row.external
                ? { target: "_blank", rel: "noopener noreferrer" as const }
                : {})}
              className="flex items-center gap-4 border-b border-dashed py-3.5 last:border-b-0"
              style={{ borderColor: "var(--rs-border)" }}
            >
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `${primary}10`,
                  color: primary,
                  border: `1px solid ${primary}25`,
                }}
              >
                <row.Icon size={14} strokeWidth={1.7} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span
                  className="rs-eyebrow text-[10.5px]"
                  style={{ color: accent }}
                >
                  {row.label}
                </span>
                <span
                  className="truncate text-[13.5px] font-medium"
                  style={{ color: "var(--rs-text)" }}
                >
                  {row.value}
                </span>
              </span>
            </a>
          )}
        />

        {cardData.bookingUrl && (
          <a
            href={cardData.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[14px] font-semibold tracking-tight transition-all hover:-translate-y-px"
            style={{
              background: primary,
              color: onPrimary,
              boxShadow: `0 10px 22px -10px ${primary}99`,
            }}
          >
            <CalendarHeart size={15} strokeWidth={2} />
            {t.bookTable}
          </a>
        )}
      </Section>

      <CTASection
        slug={slug}
        sourceQs={sourceQs}
        locale={locale}
        primary={primary}
        accent={accent}
      />

      {cardData.brochureUrl && (
        <BrochureStrip
          url={cardData.brochureUrl}
          accent={accent}
          primary={primary}
          label={t.brochureCta}
        />
      )}

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="border-t px-7 py-5"
          labelClassName="rs-eyebrow mb-3 text-[11px]"
        >
          <div style={{ ["--card-primary" as string]: primary }}>
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {cardData.socials && (
        <Section
          title={t.social}
          eyebrow={t.socialEyebrow}
          accent={accent}
          primary={primary}
          background={SURFACE}
        >
          <SocialRow
            socials={cardData.socials}
            variant="pill"
            accentHex={primary}
            itemClassName="border-[var(--rs-border)] bg-[var(--rs-page)] text-[var(--rs-text)] hover:border-[color:var(--rs-primary)] hover:bg-white"
          />
        </Section>
      )}

      <Footer
        siteUrl={siteUrl}
        slug={slug}
        company={cardData.company}
        impressumUrl={cardData.impressumUrl}
        privacyUrl={cardData.privacyUrl}
        primary={primary}
        accent={accent}
        onPrimary={onPrimary}
        translations={t}
      />
    </article>
  );
}

// =============================================================================
// Subcomponents
// =============================================================================

function Hero({
  photoUrl,
  company,
  primary,
  accent,
  onPrimary,
  sourceLabel,
}: {
  photoUrl: string | null;
  company?: string;
  primary: string;
  accent: string;
  onPrimary: string;
  sourceLabel?: string;
}) {
  void onPrimary;
  return (
    <header className="relative">
      <div className="relative h-[220px] w-full overflow-hidden">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt=""
            fill
            priority
            unoptimized
            sizes="(max-width: 460px) 100vw, 460px"
            className="object-cover tpl-photo"
          />
        ) : (
          <div
            aria-hidden
            className="h-full w-full"
            style={{
              background: `linear-gradient(135deg, ${primary} 0%, ${primary}DD 50%, ${accent} 100%)`,
            }}
          >
            {/* Decorative cutlery silhouette as fallback */}
            <svg
              className="absolute -right-8 top-4 h-[200px] w-[200px] opacity-15"
              viewBox="0 0 100 100"
              fill="none"
              stroke="white"
              strokeWidth="0.6"
            >
              <path d="M30 8 V 92 M22 8 v 30 a8 8 0 0 0 16 0 V 8" />
              <path d="M70 8 c -4 0 -8 4 -8 12 v 22 a 4 4 0 0 0 4 4 h 4 V 92 h 4 V 8 z" />
            </svg>
            <svg
              className="absolute -left-8 bottom-4 h-[140px] w-[140px] opacity-15"
              viewBox="0 0 100 100"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            >
              <circle cx="50" cy="50" r="35" />
              <circle cx="50" cy="50" r="22" />
              <path d="M30 50 Q 50 30 70 50 Q 50 70 30 50" />
            </svg>
          </div>
        )}

        {/* Warm wash — uses brand primary toward the bottom for cohesion. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.10) 45%, ${primary}CC 100%)`,
          }}
        />

        {/* Hero text */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-7 pb-8 pt-12">
          <div
            className="rs-italic text-[12.5px]"
            style={{
              color: "rgba(255,255,255,0.92)",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            Cucina · Calore · Casa
          </div>
          <h1
            className="rs-display mt-1.5 text-[34px] font-bold leading-[1.05] text-white"
            style={{ textShadow: "0 2px 14px rgba(0,0,0,0.5)" }}
          >
            {company ?? "Trattoria"}
          </h1>
        </div>

        {sourceLabel && (
          <span className="rs-eyebrow absolute right-6 top-5 z-10 rounded-full bg-black/35 px-3 py-1 text-[10.5px] text-white/95 backdrop-blur-md">
            {sourceLabel}
          </span>
        )}
      </div>
    </header>
  );
}

function SealOverlay({
  logoUrl,
  initials,
  primary,
  accent,
}: {
  logoUrl: string | null;
  initials: string;
  primary: string;
  accent: string;
}) {
  const onAccent = readableTextOn(accent);
  return (
    <div className="relative -mt-8 flex justify-center" style={{ zIndex: 5 }}>
      <div
        className="relative flex h-[64px] w-[64px] items-center justify-center rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${accent} 0%, ${accent}E0 70%, ${accent}CC 100%)`,
          boxShadow: `0 8px 18px -8px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18), 0 0 0 4px ${PAGE_BG}`,
        }}
      >
        <span
          aria-hidden
          className="absolute inset-1.5 rounded-full"
          style={{ border: `1px solid ${primary}33` }}
        />
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt=""
            width={64}
            height={64}
            unoptimized
            className="relative z-10 h-9 w-9 rounded-full object-contain tpl-logo"
          />
        ) : (
          <span
            className="rs-display relative z-10 text-[18px] font-bold"
            style={{ color: onAccent === "#ffffff" ? primary : onAccent, letterSpacing: "0.04em" }}
          >
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}

function NameStrip({
  name,
  company,
  subtitle,
  primary,
  accent,
}: {
  name: string;
  company?: string;
  subtitle: string;
  primary: string;
  accent: string;
}) {
  void company;
  return (
    <section className="px-7 pb-2 pt-4 text-center">
      <div
        className="rs-eyebrow text-[11.5px]"
        style={{ color: accent }}
      >
        — Casa di —
      </div>
      <h2
        className="rs-display mt-1 text-[24px] font-bold leading-tight"
        style={{ color: primary }}
      >
        {name}
      </h2>
      {subtitle && (
        <p
          className="mt-1 text-[12.5px]"
          style={{ color: "var(--rs-text-mid)" }}
        >
          {subtitle}
        </p>
      )}
    </section>
  );
}

function SpecialBar({
  primary,
  accent,
  onPrimary,
  message,
  cta,
  bookingUrl,
}: {
  primary: string;
  accent: string;
  onPrimary: string;
  message: string;
  cta: string;
  bookingUrl?: string;
}) {
  void accent;
  return (
    <div
      className="mx-7 mb-5 mt-5 flex items-center justify-between gap-4 rounded-2xl px-5 py-3.5"
      style={{
        background: primary,
        color: onPrimary,
        boxShadow: `0 8px 22px -10px ${primary}88`,
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Clock size={16} strokeWidth={1.8} style={{ color: onPrimary, opacity: 0.85 }} />
        <span className="rs-italic min-w-0 truncate text-[13.5px]">
          {message}
        </span>
      </div>
      {bookingUrl && (
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rs-display shrink-0 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-all hover:-translate-y-px"
          style={{
            background: onPrimary,
            color: primary,
          }}
        >
          {cta} →
        </a>
      )}
    </div>
  );
}

function QuickActions({
  cardData,
  primary,
  accent,
  onPrimary,
  onAccent,
  translations,
}: {
  cardData: TemplateProps["cardData"];
  primary: string;
  accent: string;
  onPrimary: string;
  onAccent: string;
  translations: RsCopy;
}) {
  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-7 pb-6">
      {phoneDigits && (
        <a
          href={`tel:${phoneDigits}`}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all hover:-translate-y-px"
          style={{
            background: primary,
            color: onPrimary,
            boxShadow: `0 8px 18px -8px ${primary}AA`,
          }}
        >
          <Phone size={13} strokeWidth={2} />
          {translations.callNow}
        </a>
      )}
      {waDigits && (
        <a
          href={`https://wa.me/${waDigits}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all hover:-translate-y-px"
          style={{
            background: accent,
            color: onAccent,
            boxShadow: `0 8px 18px -8px ${accent}AA`,
          }}
        >
          <MessageCircle size={13} strokeWidth={2} />
          {translations.whatsapp}
        </a>
      )}
      {cardData.address && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cardData.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold transition-all hover:-translate-y-px"
          style={{
            color: primary,
            border: `1.5px solid ${primary}`,
          }}
        >
          <MapPin size={13} strokeWidth={2} />
          {translations.directions}
        </a>
      )}
      {cardData.email && (
        <a
          href={`mailto:${cardData.email}`}
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold transition-all hover:-translate-y-px"
          style={{
            color: primary,
            border: `1.5px solid ${primary}40`,
          }}
        >
          <Mail size={13} strokeWidth={2} />
          {translations.email}
        </a>
      )}
    </div>
  );
}

function Section({
  title,
  eyebrow,
  accent,
  primary,
  children,
  background,
}: {
  title: string;
  eyebrow?: string;
  accent: string;
  primary: string;
  children: React.ReactNode;
  background?: string;
}) {
  return (
    <section
      className="px-7 py-7"
      style={{ background: background ?? PAGE_BG }}
    >
      <div className="mb-5 text-center">
        {eyebrow && (
          <div className="rs-eyebrow text-[11px]" style={{ color: accent }}>
            — {eyebrow} —
          </div>
        )}
        <h2
          className="rs-display mt-1 text-[22px] font-bold tracking-tight"
          style={{ color: primary }}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function MenuRow({
  item,
  accent,
  primary,
}: {
  item: { title: string; description?: string; priceLabel?: string };
  accent: string;
  primary: string;
}) {
  void accent;
  return (
    <li>
      <div className="flex items-baseline gap-2">
        <h3
          className="rs-display flex-shrink-0 text-[15.5px] font-semibold"
          style={{ color: "var(--rs-text)" }}
        >
          {item.title}
        </h3>
        <span
          aria-hidden
          className="rs-leader mx-1 h-3 flex-1 self-end"
          style={{ color: "#c8b89c" }}
        />
        {item.priceLabel && (
          <span
            className="rs-display flex-shrink-0 text-[14px] font-semibold"
            style={{ color: primary }}
          >
            {item.priceLabel}
          </span>
        )}
      </div>
      {item.description && (
        <p
          className="mt-1 text-[12.5px] leading-snug"
          style={{ color: "var(--rs-text-light)" }}
        >
          {item.description}
        </p>
      )}
    </li>
  );
}

function HoursTable({
  raw,
  accent,
  primary,
}: {
  raw: string;
  accent: string;
  primary: string;
}) {
  // Try to parse "Mo–Fr 8:00–12:00" style lines from the FAQ answer.
  const lines = raw
    .split(/[\n;,.]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div
      className="rounded-2xl border bg-white px-5 py-4"
      style={{ borderColor: BORDER }}
    >
      <ul className="grid gap-2.5">
        {lines.map((line, i) => {
          // Split on first occurrence of two or more spaces, en-dash, or colon-space
          const split = line.match(/^(.+?)[\s]+([0-9].*)$/);
          const day = split ? split[1] : line;
          const time = split ? split[2] : "";
          return (
            <li
              key={`${line}-${i}`}
              className="flex items-baseline justify-between gap-3 border-b border-dashed pb-2 last:border-b-0 last:pb-0"
              style={{ borderColor: BORDER }}
            >
              <span
                className="rs-eyebrow text-[12px]"
                style={{ color: accent }}
              >
                {day}
              </span>
              <span
                className="rs-display text-[13px] font-semibold"
                style={{ color: primary }}
              >
                {time || "—"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DishGrid({
  items,
  primary,
}: {
  items: Array<{ src: string; alt?: string }>;
  primary: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item, i) => {
        const src = resolveAssetUrl(item.src) ?? item.src;
        return (
          <figure
            key={`${item.src}-${i}`}
            className="group relative aspect-square overflow-hidden rounded-md ring-1"
            style={{ borderColor: BORDER, ["--tw-ring-color" as string]: BORDER }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={item.alt ?? ""}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            {item.alt && (
              <figcaption
                className="rs-italic absolute inset-x-0 bottom-0 px-2.5 py-1.5 text-[12px] text-white"
                style={{
                  background: `linear-gradient(0deg, ${primary}DD 0%, transparent 100%)`,
                }}
              >
                {item.alt}
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}

function TestimonialCard({
  item,
  accent,
  primary,
}: {
  item: { author: string; role?: string; quote: string };
  accent: string;
  primary: string;
}) {
  return (
    <figure
      className="relative overflow-hidden rounded-2xl border bg-white p-5 shadow-[0_2px_14px_-6px_rgba(60,30,15,0.15)]"
      style={{ borderColor: BORDER }}
    >
      <Quote
        aria-hidden
        size={32}
        strokeWidth={1.2}
        className="absolute right-4 top-3"
        style={{ color: accent, opacity: 0.22 }}
      />
      <div
        className="mb-2 flex items-center gap-0.5"
        style={{ color: accent }}
        aria-label="5 of 5 stars"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={11} strokeWidth={1.4} fill="currentColor" />
        ))}
      </div>
      <blockquote
        className="rs-italic text-[14.5px] leading-snug"
        style={{ color: "var(--rs-text)" }}
      >
        &ldquo;{item.quote}&rdquo;
      </blockquote>
      <figcaption
        className="rs-display mt-3 text-[12px] font-semibold"
        style={{ color: primary }}
      >
        {item.author}
        {item.role && (
          <span
            className="rs-eyebrow ml-2 text-[10.5px] font-normal"
            style={{ color: "var(--rs-text-light)" }}
          >
            · {item.role}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

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
    <section className="px-7 py-7" style={{ background: SURFACE }}>
      <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={primary} locale={locale} />
      <ExchangeSlot slug={slug} primary={accent} locale={locale} />
    </section>
  );
}

function BrochureStrip({
  url,
  accent,
  primary,
  label,
}: {
  url: string;
  accent: string;
  primary: string;
  label: string;
}) {
  void primary;
  return (
    <section className="px-7 py-5" style={{ background: SURFACE }}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between gap-3 rounded-full border-2 border-dashed px-6 py-3.5 transition-all hover:bg-white"
        style={{
          borderColor: `${accent}88`,
          background: PAGE_BG,
        }}
      >
        <span className="flex items-center gap-3">
          <FileDown size={15} strokeWidth={1.8} style={{ color: accent }} />
          <span
            className="rs-italic text-[14px] font-semibold"
            style={{ color: accent }}
          >
            {label}
          </span>
        </span>
        <ArrowUpRight
          size={15}
          strokeWidth={1.8}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          style={{ color: accent }}
        />
      </a>
    </section>
  );
}

function Footer({
  siteUrl,
  slug,
  company,
  impressumUrl,
  privacyUrl,
  primary,
  accent,
  onPrimary,
  translations,
}: {
  siteUrl: string;
  slug: string;
  company?: string;
  impressumUrl?: string;
  privacyUrl?: string;
  primary: string;
  accent: string;
  onPrimary: string;
  translations: RsCopy;
}) {
  return (
    <footer
      className="relative px-7 py-7"
      style={{
        background: primary,
        color: onPrimary,
      }}
    >
      <div className="text-center">
        <ChefHat
          size={22}
          strokeWidth={1.4}
          style={{ color: accent, margin: "0 auto 8px" }}
        />
        <div
          className="rs-display text-[14px] font-bold"
          style={{ color: onPrimary }}
        >
          {company ?? "Trattoria"}
        </div>
        <div
          className="rs-italic mt-0.5 text-[11.5px]"
          style={{ color: onPrimary, opacity: 0.75 }}
        >
          © {new Date().getFullYear()} · with care
        </div>
      </div>

      <div
        className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10.5px]"
        style={{ color: onPrimary, opacity: 0.85 }}
      >
        <FooterShare siteUrl={siteUrl} slug={slug} label={translations.share} />
        {impressumUrl && (
          <a
            href={impressumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-100"
          >
            {translations.impressum}
          </a>
        )}
        {privacyUrl && (
          <a
            href={privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-100"
          >
            {translations.privacy}
          </a>
        )}
      </div>

      <div
        className="mt-4 flex items-center justify-center gap-2 text-[10.5px]"
        style={{ color: onPrimary, opacity: 0.85 }}
      >
        <Utensils size={11} strokeWidth={1.6} />
        <span className="rs-eyebrow">{translations.poweredBy}</span>
        <a
          href="https://opsolid.de/products/digital-card"
          target="_blank"
          rel="noopener noreferrer"
          className="rs-display font-semibold"
          style={{ color: accent }}
        >
          OpSolid
        </a>
      </div>
    </footer>
  );
}

function FooterShare({
  siteUrl,
  slug,
  label,
}: {
  siteUrl: string;
  slug: string;
  label: string;
}) {
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
            // ignore
          }
        }
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        }
      }}
      className="hover:opacity-100"
    >
      {label}
    </button>
  );
}

// =============================================================================
// Registry entry & sample
// =============================================================================

export const restaurantEntry: TemplateRegistryEntry = {
  id: 14,
  key: "restaurant",
  name: "Restaurant",
  industry: "Restaurant / café / bistro",
  Component: Restaurant,
  supports: {
    services: true,
    faqs: true,
    testimonials: true,
    gallery: true,
    video: false,
    brochure: true,
    socials: true,
    themeSwitch: false,
    photo: true,
    logo: true,
  },
  defaults: {
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-restaurant",
};

// Sample persona — Trattoria del Borgo, Bologna.
// photo: Unsplash royalty-free — restaurant interior.
//   https://unsplash.com/photos/people-sitting-on-chair-near-table-during-daytime
//   (Unsplash License — free for commercial use).
// dishes: Unsplash food photography under Unsplash License.
export const restaurantSample: SampleData = {
  templateId: 14,
  slug: "demo-restaurant",
  cardData: {
    name: "Famiglia Bertolini",
    title: "Trattoria · aperto dal 1987",
    position: "Casa",
    company: "Trattoria del Borgo",
    email: "ciao@trattoriadelborgo.it",
    phone: "+39 051 234 5670",
    whatsapp: "+39 333 234 5670",
    website: "https://trattoriadelborgo.it",
    address: "Via dei Giudei 12, 40126 Bologna, Italia",
    bio:
      "Una trattoria di quartiere a due passi dalle Sette Chiese. Cucina della nonna, pasta tirata a mano ogni mattina, e un piccolo orto sul retro che ci dà erbe, pomodori e fagiolini d'estate. Ti aspettiamo per pranzo, per cena, o solo per un caffè a fine giornata.",
    bookingUrl: "https://cal.com/trattoria-del-borgo/tavolo",
    brochureUrl: "https://trattoriadelborgo.it/menu.pdf",
    impressumUrl: "https://trattoriadelborgo.it/impressum",
    privacyUrl: "https://trattoriadelborgo.it/privacy",
    sectorKey: "restaurant",
    services: [
      {
        title: "Tagliatelle al ragù",
        description: "Pasta fresca, ragù di nonna Maria, parmigiano 24 mesi",
        priceLabel: "€14",
      },
      {
        title: "Tortellini in brodo",
        description: "Tortellini fatti a mano, brodo di cappone",
        priceLabel: "€16",
      },
      {
        title: "Cotoletta alla bolognese",
        description: "Vitello, prosciutto crudo, parmigiano, fondo bruno",
        priceLabel: "€22",
      },
      {
        title: "Lasagne verdi",
        description: "Sfoglia agli spinaci, ragù, besciamella",
        priceLabel: "€15",
      },
      {
        title: "Tiramisù della casa",
        description: "Mascarpone, savoiardi, caffè dell'Eustachio",
        priceLabel: "€8",
      },
      {
        title: "Vino della casa",
        description: "Sangiovese di collina, mezzo litro",
        priceLabel: "€9",
      },
    ],
    faqs: [
      {
        q: "Öffnungszeiten?",
        a: "Mar–Sab 12:00–15:00, 19:00–23:00. Domenica 12:00–16:00. Lunedì chiuso.",
      },
      {
        q: "Vegetarisch / vegan?",
        a: "Tre opzioni vegetariane fisse, una vegana. Su richiesta facciamo di più.",
      },
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80",
        alt: "Tagliatelle al ragù",
      },
      {
        src: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80",
        alt: "Sala interna",
      },
      {
        src: "https://images.unsplash.com/photo-1572441713132-c542fc4fe282?w=600&q=80",
        alt: "Tortellini",
      },
      {
        src: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80",
        alt: "Tiramisù",
      },
    ],
    testimonials: [
      {
        author: "Anna H.",
        role: "Bologna · ottobre 2025",
        quote:
          "La cucina che cercavi senza saperlo. Ti siedi e ti senti a casa di tua nonna — anche se non l'hai mai conosciuta.",
      },
      {
        author: "Marco L.",
        role: "Gambero Rosso",
        quote:
          "Una di quelle trattorie che danno senso a un quartiere. Pasta perfetta, ragù paziente, e Maria che ti ricorda il nome la seconda volta.",
      },
    ],
    socials: {
      instagram: "https://instagram.com/trattoriadelborgo",
      facebook: "https://facebook.com/trattoriadelborgo",
    },
  },
  // photo: Unsplash — Italian trattoria interior.
  //   https://images.unsplash.com/photo-1517248135467-4c7edcad34c4 (Unsplash License).
  photoUrl:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
