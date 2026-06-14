"use client";

// =============================================================================
// KitchenAtelier — v2 template (id=3, key="kitchen-atelier").
//
// Design DNA: Projekt_4k/showcase/kart_03_restoran.html — cream/olive/terracotta
// trattoria palette + Playfair display + Source Sans body. Re-implemented in
// React + Tailwind with a wax-stamp logo seal sitting half-into the hero, and
// burnt-umber hand-rule dividers as the signature thread.
//
// Locked design choices (do not parameterise):
//   - Hero: full-bleed 220 px, warm-olive (#3d5a3e) → terracotta (#c4654a)
//     gradient washing over the photo. Olive-leaf SVG silhouette decorates the
//     fallback when no photo is uploaded.
//   - Logo: centered initials seal (40 × 40 px, locked) — circular wax-stamp
//     badge in cream on terracotta with a hairline cream stroke. Sits
//     half-into the hero / half-into the cream bio strip.
//   - Palette: cream (#faf6f0) page, olive (#3d5a3e) headings, terracotta
//     (#c4654a) accents.
//   - Typography: Playfair Display (display, 600/700) + Source Sans 3 (body,
//     400/500), via `next/font`.
//   - Section rhythm:
//       Hero → Chef bio (cream) → Today's tasting menu (services with course
//       names + price) → Dish gallery → Testimonials → Contact + Reservation
//       CTA → Wallet/Exchange/SendMyInfo → Social → Footer
//   - Distinctive: burnt-umber hand-rule dividers (slightly imperfect SVG paths)
//     and small terracotta serif eyebrows above each section.
//
// Variable per card: cardData content, photoPath (hero), logoPath (replaces
// the wax-stamp seal when uploaded), brandPrimaryHex (overrides olive),
// brandAccentHex (overrides terracotta).
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  CalendarHeart,
  ChefHat,
  Clock,
  FileDown,
  Flame,
  MapPin,
  Quote,
  Star,
  Utensils,
  Wine,
} from "lucide-react";

import { encodeSource, describeSource } from "@/components/cards/smart/SmartCardSource";
import { getSectorPreset } from "@/config/card-sectors";
import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { resolveLabels } from "./shared/resolveLabels";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#3d5a3e";
const LOCKED_ACCENT = "#c4654a";
const CREAM = "#faf6f0";
const CREAM_SURFACE = "#ffffff";

function resolveAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("data:") || path.startsWith("blob:")) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return `/${path}`;
}

function getInitials(name: string): string {
  const parts = name
    .replace(/^(Chef|Dr\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "·";
  if (parts.length === 1) return (parts[0][0] ?? "·").toUpperCase();
  return (
    (parts[0][0] ?? "").toUpperCase() + (parts[parts.length - 1][0] ?? "").toUpperCase()
  );
}

interface KaCopy {
  tastingMenu: string;
  dishes: string;
  testimonials: string;
  contact: string;
  social: string;
  walletLabel: string;
  reservation: string;
  about: string;
  brochureCta: string;
  impressum: string;
  privacy: string;
  poweredBy: string;
  share: string;
  pairingNote: string;
  heroTagline: string;
  chefEyebrow: string;
  reservationCta: string;
  whatsappLabel: string;
  findUsLabel: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", KaCopy> = {
  de: {
    tastingMenu: "Heute am Pass",
    dishes: "Aus der Küche",
    testimonials: "Gäste sagen",
    contact: "Reservierung",
    social: "Folgen",
    walletLabel: "Auf das Smartphone",
    reservation: "Tisch reservieren",
    about: "Die Köchin",
    brochureCta: "Vollständiges Menü (PDF)",
    impressum: "Impressum",
    privacy: "Datenschutz",
    poweredBy: "Powered by",
    share: "Teilen",
    pairingNote: "Wine pairing on request — kitchen closes at 22:30",
    heroTagline: "Cucina · Stagione · Memoria",
    chefEyebrow: "à la carte di…",
    reservationCta: "Reservation",
    whatsappLabel: "WhatsApp",
    findUsLabel: "Find us",
  },
  en: {
    tastingMenu: "Tonight's Tasting",
    dishes: "From the Pass",
    testimonials: "Guests say",
    contact: "Reservations",
    social: "Follow",
    walletLabel: "Add to wallet",
    reservation: "Book a table",
    about: "The Chef",
    brochureCta: "Full menu (PDF)",
    impressum: "Imprint",
    privacy: "Privacy",
    poweredBy: "Powered by",
    share: "Share",
    pairingNote: "Wine pairing on request — kitchen closes at 22:30",
    heroTagline: "Cucina · Stagione · Memoria",
    chefEyebrow: "à la carte di…",
    reservationCta: "Reservation",
    whatsappLabel: "WhatsApp",
    findUsLabel: "Find us",
  },
  tr: {
    tastingMenu: "Bu Akşam",
    dishes: "Mutfaktan",
    testimonials: "Konuklar",
    contact: "Rezervasyon",
    social: "Takip et",
    walletLabel: "Cüzdana ekle",
    reservation: "Masa rezervasyonu",
    about: "Şef",
    brochureCta: "Tam menü (PDF)",
    impressum: "Künye",
    privacy: "Gizlilik",
    poweredBy: "Powered by",
    share: "Paylaş",
    pairingNote: "Wine pairing on request — kitchen closes at 22:30",
    heroTagline: "Cucina · Stagione · Memoria",
    chefEyebrow: "à la carte di…",
    reservationCta: "Reservation",
    whatsappLabel: "WhatsApp",
    findUsLabel: "Find us",
  },
  es: {

    tastingMenu: "Cata de esta noche",
    dishes: "Desde el pase",
    testimonials: "Nuestros huéspedes dicen",
    contact: "Reservas",
    social: "Seguir",
    walletLabel: "Añadir a la cartera",
    reservation: "Reservar mesa",
    about: "El chef",
    brochureCta: "Carta completa (PDF)",
    impressum: "Aviso legal",
    privacy: "Privacidad",
    poweredBy: "Desarrollado por",
    share: "Compartir",
    pairingNote: "Wine pairing on request — kitchen closes at 22:30",
    heroTagline: "Cucina · Stagione · Memoria",
    chefEyebrow: "à la carte di…",
    reservationCta: "Reservation",
    whatsappLabel: "WhatsApp",
    findUsLabel: "Find us",

  },
  it: {

    tastingMenu: "Degustazione di stasera",
    dishes: "Dal passaggio",
    testimonials: "I nostri ospiti dicono",
    contact: "Prenotazioni",
    social: "Segui",
    walletLabel: "Aggiungi al wallet",
    reservation: "Prenota un tavolo",
    about: "Lo chef",
    brochureCta: "Menù completo (PDF)",
    impressum: "Impressum",
    privacy: "Privacy",
    poweredBy: "Realizzato con",
    share: "Condividi",
    pairingNote: "Wine pairing on request — kitchen closes at 22:30",
    heroTagline: "Cucina · Stagione · Memoria",
    chefEyebrow: "à la carte di…",
    reservationCta: "Reservation",
    whatsappLabel: "WhatsApp",
    findUsLabel: "Find us",

  },
  fr: {

    tastingMenu: "Dégustation du soir",
    dishes: "Depuis le passe",
    testimonials: "Nos hôtes témoignent",
    contact: "Réservations",
    social: "Suivre",
    walletLabel: "Ajouter au portefeuille",
    reservation: "Réserver une table",
    about: "Le chef",
    brochureCta: "Menu complet (PDF)",
    impressum: "Mentions légales",
    privacy: "Confidentialité",
    poweredBy: "Propulsé par",
    share: "Partager",
    pairingNote: "Wine pairing on request — kitchen closes at 22:30",
    heroTagline: "Cucina · Stagione · Memoria",
    chefEyebrow: "à la carte di…",
    reservationCta: "Reservation",
    whatsappLabel: "WhatsApp",
    findUsLabel: "Find us",

  },
  ar: {

    tastingMenu: "ذواقة هذه الليلة",
    dishes: "من الممر",
    testimonials: "ماذا يقول الضيوف",
    contact: "الحجوزات",
    social: "متابعة",
    walletLabel: "إضافة إلى المحفظة",
    reservation: "احجز طاولة",
    about: "الشيف",
    brochureCta: "القائمة الكاملة (PDF)",
    impressum: "بيانات النشر",
    privacy: "الخصوصية",
    poweredBy: "مشغل بواسطة",
    share: "مشاركة",
    pairingNote: "Wine pairing on request — kitchen closes at 22:30",
    heroTagline: "Cucina · Stagione · Memoria",
    chefEyebrow: "à la carte di…",
    reservationCta: "Reservation",
    whatsappLabel: "WhatsApp",
    findUsLabel: "Find us",

  },
};

export function KitchenAtelier({
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
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;

  const photoUrl = resolveAssetUrl(photoPath);
  const logoUrl = resolveAssetUrl(logoPath);
  const initials = getInitials(cardData.name);

  const services =
    cardData.services ?? sector?.services;

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  const titleParts = [cardData.position, cardData.title].filter(
    (s): s is string => Boolean(s),
  );

  return (
    <article
      data-template="kitchen-atelier"
      className={`ka-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] shadow-[0_30px_70px_-30px_rgba(60,40,20,0.45),0_8px_22px_-12px_rgba(60,40,20,0.18)] ring-1 ring-[#e8d8c1]`}
      style={
        {
          ["--card-primary" as string]: primary,
          ["--card-accent" as string]: accent,
          ["--ka-cream" as string]: CREAM,
          ["--ka-white" as string]: CREAM_SURFACE,
          ["--ka-text" as string]: "#2c2417",
          ["--ka-text-mid" as string]: "#5a5040",
          ["--ka-text-dim" as string]: "#8a7d68",
          ["--ka-border" as string]: "#e8d8c1",
          ["--font-kitchen-display" as string]: "'Playfair Display', Georgia, serif",
          ["--font-kitchen-body" as string]: "'Source Sans 3', system-ui, sans-serif",
          background: CREAM,
          color: "#2c2417",
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .ka-card {
          font-family:var(--tpl-font-body,  var(--font-kitchen-body), "Source Sans 3", system-ui, sans-serif);
          line-height: 1.65;
        }
        .ka-card .ka-display,
        .ka-card h1.ka-display,
        .ka-card h2.ka-display,
        .ka-card h3.ka-display {
          font-family:var(--tpl-font-body,  var(--font-kitchen-display), "Playfair Display", Georgia, serif);
        }
        .ka-card .ka-italic {
          font-family:var(--tpl-font-body,  var(--font-kitchen-display), "Playfair Display", Georgia, serif);
          font-style: italic;
        }
        .ka-card .ka-eyebrow {
          font-family:var(--tpl-font-body,  var(--font-kitchen-display), "Playfair Display", Georgia, serif);
          font-style: italic;
          letter-spacing: 0.04em;
        }
        .ka-card a {
          color: inherit;
        }
      `}</style>

      <Hero
        photoUrl={photoUrl}
        company={cardData.company || cardData.name}
        primary={primary}
        accent={accent}
        sourceLabel={sourceLabel}
        tagline={t.heroTagline}
      />

      {/* Wax-stamp seal — overlaps hero / cream strip. */}
      <SealOverlay
        logoUrl={logoUrl}
        initials={initials}
        accent={accent}
        primary={primary}
      />

      <ChefStrip
        name={cardData.name}
        titleParts={titleParts}
        company={cardData.company || cardData.name}
        accent={accent}
        primary={primary}
      />

      <QuickActions
        cardData={cardData}
        primary={primary}
        accent={accent}
        translations={t}
      />

      <HandRule color={accent} />

      {cardData.bio && (
        <Section
          title={t.about}
          eyebrow="Carta del Cuoco"
          accent={accent}
          primary={primary}
        >
          <p className="text-[14px] leading-[1.85] text-[var(--ka-text-mid)]">
            <span className="ka-display float-left mr-2 mt-1 text-[42px] font-bold leading-[0.85] text-[var(--card-primary)]">
              {cardData.bio.charAt(0)}
            </span>
            {cardData.bio.slice(1)}
          </p>
        </Section>
      )}

      {services && services.length > 0 && (
        <Section
          title={t.tastingMenu}
          eyebrow="Sette Portate"
          accent={accent}
          primary={primary}
          background={CREAM_SURFACE}
        >
          <ol className="grid gap-3.5">
            {services.slice(0, 7).map((item, i) => (
              <CourseRow
                key={`${item.title}-${i}`}
                index={i + 1}
                item={item}
                accent={accent}
                primary={primary}
              />
            ))}
          </ol>
          {/* Pairing note */}
          <div className="mt-5 flex items-center justify-center gap-2.5">
            <Wine size={13} strokeWidth={1.6} style={{ color: accent }} />
            <span
              className="ka-italic text-[12.5px]"
              style={{ color: "var(--ka-text-mid)" }}
            >
              {t.pairingNote}
            </span>
          </div>
        </Section>
      )}

      <HandRule color={accent} />

      {cardData.gallery && cardData.gallery.length > 0 && (
        <Section
          title={t.dishes}
          eyebrow="Dal Forno"
          accent={accent}
          primary={primary}
        >
          <DishGrid items={cardData.gallery.slice(0, 4)} primary={primary} />
        </Section>
      )}

      {cardData.testimonials && cardData.testimonials.length > 0 && (
        <Section
          title={t.testimonials}
          eyebrow="Voci"
          accent={accent}
          primary={primary}
          background={CREAM_SURFACE}
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

      <HandRule color={accent} />

      <Section
        title={t.contact}
        eyebrow="Per Riservare"
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
              style={{ borderColor: "var(--ka-border)" }}
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
                  className="ka-eyebrow text-[10.5px]"
                  style={{ color: accent }}
                >
                  {row.label}
                </span>
                <span className="truncate text-[13.5px] font-medium text-[var(--ka-text)]">
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
            className="mt-5 flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[14px] font-semibold tracking-tight text-white transition-all hover:-translate-y-px"
            style={{
              background: `linear-gradient(135deg, ${primary} 0%, #2d4a2e 100%)`,
              boxShadow: `0 10px 22px -10px ${primary}99`,
            }}
          >
            <CalendarHeart size={15} strokeWidth={2} />
            {t.reservation}
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
          className="border-t border-[var(--ka-border)] px-7 py-5"
          labelClassName="ka-eyebrow mb-3 text-[11px]"
        >
          <div style={{ ["--card-primary" as string]: primary }}>
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {cardData.socials && (
        <Section
          title={t.social}
          eyebrow="Restiamo in Contatto"
          accent={accent}
          primary={primary}
          background={CREAM_SURFACE}
        >
          <SocialRow
            socials={cardData.socials}
            variant="pill"
            accentHex={primary}
            itemClassName="border-[var(--ka-border)] bg-[var(--ka-cream)] text-[var(--ka-text)] hover:border-[color:var(--card-primary)] hover:bg-white"
          />
        </Section>
      )}

      <Footer
        siteUrl={siteUrl}
        slug={slug}
        company={cardData.company || cardData.name}
        impressumUrl={cardData.impressumUrl}
        privacyUrl={cardData.privacyUrl}
        accent={accent}
        primary={primary}
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
  sourceLabel,
  tagline,
}: {
  photoUrl: string | null;
  company?: string;
  primary: string;
  accent: string;
  sourceLabel?: string;
  tagline: string;
}) {
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
              background: `linear-gradient(135deg, ${primary} 0%, #2d4a2e 50%, ${accent} 100%)`,
            }}
          >
            {/* Olive-leaf silhouette decoration. */}
            <svg
              className="absolute -left-8 bottom-0 h-[150px] w-[150px] opacity-25"
              viewBox="0 0 100 100"
              fill="none"
              stroke="white"
              strokeWidth="0.6"
            >
              <ellipse cx="50" cy="20" rx="6" ry="14" transform="rotate(-22 50 20)" />
              <ellipse cx="35" cy="35" rx="6" ry="14" transform="rotate(-50 35 35)" />
              <ellipse cx="65" cy="35" rx="6" ry="14" transform="rotate(40 65 35)" />
              <ellipse cx="22" cy="55" rx="6" ry="14" transform="rotate(-65 22 55)" />
              <ellipse cx="78" cy="55" rx="6" ry="14" transform="rotate(60 78 55)" />
              <path d="M50 12 L50 80" />
            </svg>
            <svg
              className="absolute -right-12 top-0 h-[180px] w-[180px] opacity-20"
              viewBox="0 0 100 100"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            >
              <ellipse cx="50" cy="50" rx="35" ry="35" />
              <ellipse cx="50" cy="50" rx="22" ry="22" />
            </svg>
          </div>
        )}

        {/* Olive→terracotta wash overlay, kart_03 signature. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(61,90,62,0.25) 0%, rgba(196,101,74,0.35) 65%, rgba(30,20,10,0.78) 100%)`,
          }}
        />

        {/* Hero text — bottom-left. */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-7 pb-9 pt-9">
          <div
            className="ka-italic text-[13px]"
            style={{
              color: "rgba(255,255,255,0.92)",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            {tagline}
          </div>
          <h1
            className="ka-display mt-2 text-[36px] font-bold leading-[1.05] text-white"
            style={{
              textShadow: "0 2px 14px rgba(0,0,0,0.5)",
              letterSpacing: "0.005em",
            }}
          >
            {company}
          </h1>
        </div>

        {sourceLabel && (
          <span
            className="ka-eyebrow absolute right-6 top-5 z-10 rounded-full bg-black/35 px-3 py-1 text-[10.5px] text-white/95 backdrop-blur-md"
          >
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
  accent,
  primary,
}: {
  logoUrl: string | null;
  initials: string;
  accent: string;
  primary: string;
}) {
  return (
    <div
      className="relative -mt-7 flex justify-center"
      style={{ zIndex: 5 }}
    >
      <div
        className="relative flex h-[58px] w-[58px] items-center justify-center rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${accent} 0%, #a04a32 70%, #7e3a26 100%)`,
          boxShadow: `0 8px 18px -8px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18), 0 0 0 4px ${primary}15`,
        }}
      >
        {/* Hairline cream stroke inside seal. */}
        <span
          aria-hidden
          className="absolute inset-1.5 rounded-full"
          style={{ border: "1px solid rgba(250,246,240,0.85)" }}
        />
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt=""
            width={64}
            height={64}
            unoptimized
            className="relative z-10 h-8 w-8 rounded-full object-contain tpl-logo"
          />
        ) : (
          <span
            className="ka-display relative z-10 text-[15px] font-bold"
            style={{ color: CREAM, letterSpacing: "0.04em" }}
          >
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}

function ChefStrip({
  name,
  titleParts,
  company,
  accent,
  primary,
}: {
  name: string;
  titleParts: string[];
  company?: string;
  accent: string;
  primary: string;
}) {
  void company;
  return (
    <section className="px-7 pb-2 pt-5 text-center">
      <div
        className="ka-eyebrow text-[11.5px]"
        style={{ color: accent }}
      >
        à la carte di…
      </div>
      <h2
        className="ka-display mt-1 text-[24px] font-bold leading-tight"
        style={{ color: primary, letterSpacing: "-0.005em" }}
      >
        {name}
      </h2>
      {titleParts.length > 0 && (
        <p
          className="mt-1 text-[13px]"
          style={{ color: "var(--ka-text-mid)" }}
        >
          {titleParts.join(" · ")}
        </p>
      )}
    </section>
  );
}

function QuickActions({
  cardData,
  primary,
  accent,
  translations,
}: {
  cardData: TemplateProps["cardData"];
  primary: string;
  accent: string;
  translations: KaCopy;
}) {
  void translations;
  const phoneDigits = cardData.phone?.replace(/[^+0-9]/g, "");
  const waDigits = cardData.whatsapp?.replace(/[^+0-9]/g, "").replace(/^\+/, "");

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-7 pb-6 pt-3">
      {phoneDigits && (
        <a
          href={`tel:${phoneDigits}`}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:-translate-y-px"
          style={{
            background: primary,
            boxShadow: `0 8px 18px -8px ${primary}AA`,
          }}
        >
          <Flame size={14} strokeWidth={2} />
          Reservation
        </a>
      )}
      {waDigits && (
        <a
          href={`https://wa.me/${waDigits}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:-translate-y-px"
          style={{
            background: accent,
            boxShadow: `0 8px 18px -8px ${accent}AA`,
          }}
        >
          WhatsApp
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
          <MapPin size={14} strokeWidth={2} />
          Find us
        </a>
      )}
    </div>
  );
}

function HandRule({ color }: { color: string }) {
  // Slightly imperfect hand-drawn divider — the kart_03 signature thread.
  return (
    <div
      aria-hidden
      className="px-7 py-2"
      style={{ background: CREAM }}
    >
      <svg
        viewBox="0 0 400 8"
        preserveAspectRatio="none"
        className="h-2 w-full"
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.55"
      >
        <path d="M2 4 Q 80 2 160 4 T 320 4 T 398 4" />
        <circle cx="200" cy="4" r="1.5" fill={color} stroke="none" />
      </svg>
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
      className="px-7 py-8"
      style={{ background: background ?? CREAM }}
    >
      <div className="mb-5 text-center">
        {eyebrow && (
          <div
            className="ka-eyebrow text-[11px]"
            style={{ color: accent }}
          >
            — {eyebrow} —
          </div>
        )}
        <h2
          className="ka-display mt-1 text-[22px] font-bold tracking-tight"
          style={{ color: primary }}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function CourseRow({
  index,
  item,
  accent,
  primary,
}: {
  index: number;
  item: { title: string; description?: string; priceLabel?: string };
  accent: string;
  primary: string;
}) {
  return (
    <li className="group">
      <div className="flex items-baseline gap-2">
        <span
          className="ka-display text-[12px] font-semibold"
          style={{ color: accent, letterSpacing: "0.06em" }}
        >
          {String(index).padStart(2, "0")}
        </span>
        <h3
          className="ka-display flex-shrink-0 text-[15.5px] font-semibold"
          style={{ color: "var(--ka-text)" }}
        >
          {item.title}
        </h3>
        <span
          aria-hidden
          className="mx-1 flex-1 self-end overflow-hidden"
          style={{ height: "1px", borderBottom: "1px dotted #b8a890" }}
        />
        {item.priceLabel && (
          <span
            className="ka-display flex-shrink-0 text-[14px] font-semibold"
            style={{ color: primary }}
          >
            {item.priceLabel}
          </span>
        )}
      </div>
      {item.description && (
        <p
          className="mt-1 pl-7 text-[12.5px] leading-snug"
          style={{ color: "var(--ka-text-dim)" }}
        >
          {item.description}
        </p>
      )}
    </li>
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
      {items.map((item, i) => (
        <figure
          key={`${item.src}-${i}`}
          className="group relative aspect-square overflow-hidden rounded-md ring-1 ring-[var(--ka-border)]"
        >
          <Image
            src={resolveAssetUrl(item.src) ?? item.src}
            alt={item.alt ?? ""}
            fill
            unoptimized
            sizes="(max-width: 460px) 50vw, 230px"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {item.alt && (
            <figcaption
              className="ka-italic absolute inset-x-0 bottom-0 px-2.5 py-1.5 text-[12px] text-white"
              style={{
                background: `linear-gradient(0deg, ${primary}DD 0%, transparent 100%)`,
              }}
            >
              {item.alt}
            </figcaption>
          )}
        </figure>
      ))}
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
      className="relative overflow-hidden rounded-2xl border bg-white p-5 shadow-[0_2px_14px_-6px_rgba(60,40,20,0.15)]"
      style={{ borderColor: "var(--ka-border)" }}
    >
      <Quote
        aria-hidden
        size={32}
        strokeWidth={1.2}
        className="absolute right-4 top-3"
        style={{ color: accent, opacity: 0.18 }}
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
        className="ka-italic text-[14.5px] leading-snug"
        style={{ color: "var(--ka-text)" }}
      >
        &ldquo;{item.quote}&rdquo;
      </blockquote>
      <figcaption
        className="ka-display mt-3 text-[12px] font-semibold"
        style={{ color: primary }}
      >
        {item.author}
        {item.role && (
          <span
            className="ka-eyebrow ml-2 text-[10.5px] font-normal"
            style={{ color: "var(--ka-text-dim)" }}
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
    <section className="px-7 py-7" style={{ background: CREAM_SURFACE }}>
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
    <section className="px-7 py-5" style={{ background: CREAM_SURFACE }}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between gap-3 rounded-full border-2 border-dashed px-6 py-3.5 transition-all hover:bg-white"
        style={{
          borderColor: `${accent}66`,
          background: CREAM,
        }}
      >
        <span className="flex items-center gap-3">
          <FileDown size={15} strokeWidth={1.8} style={{ color: accent }} />
          <span
            className="ka-italic text-[14px] font-semibold"
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
  accent,
  primary,
  translations,
}: {
  siteUrl: string;
  slug: string;
  company?: string;
  impressumUrl?: string;
  privacyUrl?: string;
  accent: string;
  primary: string;
  translations: KaCopy;
}) {
  return (
    <footer
      className="relative px-7 py-7"
      style={{
        background: `linear-gradient(180deg, ${primary} 0%, #2d4a2e 100%)`,
        color: CREAM,
      }}
    >
      <div className="text-center">
        <ChefHat
          size={20}
          strokeWidth={1.4}
          style={{ color: accent, margin: "0 auto 8px" }}
        />
        <div
          className="ka-display text-[14px] font-bold"
          style={{ color: CREAM }}
        >
          {company}
        </div>
        <div className="ka-italic mt-0.5 text-[11.5px] opacity-75">
          © {new Date().getFullYear()} · with care
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10.5px] opacity-75">
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

      <div className="mt-4 flex items-center justify-center gap-2 text-[10.5px] opacity-75">
        <Clock size={11} strokeWidth={1.6} />
        <span className="ka-eyebrow">{translations.poweredBy}</span>
        <a
          href="https://opsolid.de/products/digital-card"
          target="_blank"
          rel="noopener noreferrer"
          className="ka-display font-semibold"
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

// Avoid unused-import warnings on certain icons that we keep available for
// future variants (Utensils used in `--card-accent` chip if ever needed).
void Utensils;

// =============================================================================
// Registry entry & sample
// =============================================================================

export const kitchenAtelierEntry: TemplateRegistryEntry = {
  id: 3,
  key: "kitchen-atelier",
  name: "Kitchen Atelier",
  industry: "Restaurant / chef",
  Component: KitchenAtelier,
  supports: {
    services: true,
    faqs: false,
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
  sampleSlug: "demo-kitchen-atelier",
};

// Sample persona — Chef Eleonora Conti, Atelier Conti, Florence.
// photo: Unsplash royalty-free — Jonathan Borba, kitchen scene.
//   https://unsplash.com/photos/Y5n1MTpEbiQ (Unsplash License — free use).
// dishes: Unsplash food photos by various photographers under Unsplash License.
export const kitchenAtelierSample: SampleData = {
  templateId: 3,
  slug: "demo-kitchen-atelier",
  cardData: {
    name: "Eleonora Conti",
    title: "Chef-patronne · Slow Food guida 2025",
    position: "Chef-patronne",
    company: "Atelier Conti",
    email: "prenotazioni@atelier-conti.it",
    phone: "+39 055 234 1180",
    whatsapp: "+39 392 234 1180",
    website: "https://atelier-conti.it",
    address: "Via dei Velluti 18r, 50125 Firenze, Italia",
    bio:
      "Una piccola sala per dodici coperti nel cuore dell'Oltrarno. Cucino quello che il mercato di Sant'Ambrogio mi suggerisce la mattina — niente carta fissa, soltanto la stagione. Vengo da Borgo San Lorenzo, ho cucinato a Roma per cinque anni, e poi sono tornata a casa nel 2019.",
    bookingUrl: "https://cal.com/atelier-conti/dinner",
    brochureUrl: "https://atelier-conti.it/menu-degustazione.pdf",
    impressumUrl: "https://atelier-conti.it/note-legali",
    privacyUrl: "https://atelier-conti.it/privacy",
    sectorKey: "restaurant",
    services: [
      {
        title: "Crudo di mare",
        description: "Tonno rosso, agrumi del Gargano, pepe di Timur",
        priceLabel: "€32",
      },
      {
        title: "Tortelli di erbe",
        description: "Bietola, ricotta di Pienza, burro nocciola",
        priceLabel: "€28",
      },
      {
        title: "Ribollita 2024",
        description: "La ricetta della nonna Adelina, in versione consommé",
        priceLabel: "€24",
      },
      {
        title: "Pollanca arrosto",
        description: "Pollanca di Mugello, patate al rosmarino, salsa al porto",
        priceLabel: "€38",
      },
      {
        title: "Cinghiale brasato",
        description: "Cinghiale dell'Appennino, polenta di otto file, mirtilli",
        priceLabel: "€42",
      },
      {
        title: "Pre-dessert",
        description: "Sorbetto di melagrana, biscotto al cardamomo",
      },
      {
        title: "Cremoso al cioccolato",
        description: "Cioccolato di Modica 70%, olio Laudemio, sale Maldon",
        priceLabel: "€18",
      },
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
        alt: "Crudo di mare",
      },
      {
        src: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80",
        alt: "Tortelli di erbe",
      },
      {
        src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
        alt: "Pollanca arrosto",
      },
      {
        src: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80",
        alt: "Cremoso al cioccolato",
      },
    ],
    testimonials: [
      {
        author: "Marta Brüning",
        role: "Sterne-Tagebuch · München",
        quote:
          "Eleonora cooks the kind of meal that makes you postpone the next morning. Twelve seats, no menu in hand, just trust.",
      },
      {
        author: "Luca Ferraro",
        role: "Gambero Rosso",
        quote:
          "L'Oltrarno ha trovato la sua voce. Una sala intima, una cucina che ricorda da dove viene.",
      },
    ],
    socials: {
      instagram: "https://instagram.com/atelier.conti",
      facebook: "https://facebook.com/atelier.conti",
    },
  },
  // photo: Unsplash — kitchen / chef scene, Jonathan Borba.
  // https://unsplash.com/photos/Y5n1MTpEbiQ (Unsplash License).
  photoUrl:
    "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?w=900&q=80",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
