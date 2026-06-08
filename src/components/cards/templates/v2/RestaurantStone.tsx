"use client";

// =============================================================================
// RestaurantStone — v2 template (id=63, key="restaurant-stone").
//
// Sector: Restaurant — STONE variant. Mood: warm beige / linen, rustic-premium
// trattoria with hand-drawn ornaments. Inspired by kart_03_restoran_stone.html.
//
// Design DNA:
//   - Warm cream gradient header with italic Lora "Established" line and
//     restaurant name (italic last word in copper accent).
//   - Decorative hairline+dot+hairline ornament above wave divider.
//   - Oval portrait frame (rounded-blob shape) with sepia photo.
//   - Story block — italic Lora paragraph centered, signature line.
//   - Specialty service cards on warm parchment surface, copper price chip.
//   - 3-up stat tiles on cream cards.
//   - CTA: large copper button + 2 ghost buttons.
//   - Hours block on linen card with dot list.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { ArrowUpRight, Calendar } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { ServiceLink } from "./shared/ServiceLink";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#8b7355";
const LOCKED_ACCENT = "#c4a882";
const PAGE = "#f2ebe0";
const SURFACE = "#fdf9f3";
const SURFACE_2 = "#f6efe1";
const ACCENT_DEEP = "#5c3d1e";
const ACCENT_2 = "#e8a838";
const TEXT = "#2a1c0e";
const TEXT_SOFT = "#7a6449";
const BORDER = "#ddd0be";
const BORDER_SOFT = "#e8ddc8";

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
  est: string;
  storyLabel: string;
  storyH: string;
  storySig: string;
  servicesLabel: string;
  servicesH: string;
  hoursLabel: string;
  hoursMain: string;
  hoursWeekend: string;
  hoursClosed: string;
  hoursMainTime: string;
  hoursWeekendTime: string;
  hoursClosedTime: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaTertiary: string;
  dishesLabel: string;
  reviewsLabel: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    est: "Eröffnet 2012",
    storyLabel: "Unsere Geschichte",
    storyH: "Aus Liebe zur Küche",
    storySig: "— vom Hause Bianchi",
    servicesLabel: "Spezialitäten",
    servicesH: "Saisonale Highlights",
    hoursLabel: "Öffnungszeiten",
    hoursMain: "Di – Sa",
    hoursWeekend: "Sonntag",
    hoursClosed: "Montag",
    hoursMainTime: "12:00 – 23:00",
    hoursWeekendTime: "11:00 – 17:00",
    hoursClosedTime: "Geschlossen",
    ctaPrimary: "Tisch reservieren",
    ctaSecondary: "Karte ansehen",
    ctaTertiary: "Anfahrt",
    dishesLabel: "Gerichte",
    reviewsLabel: "Bewertungen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    est: "Established 2012",
    storyLabel: "Our story",
    storyH: "Made with love",
    storySig: "— from House Bianchi",
    servicesLabel: "Specialties",
    servicesH: "Seasonal highlights",
    hoursLabel: "Opening Hours",
    hoursMain: "Tue – Sat",
    hoursWeekend: "Sunday",
    hoursClosed: "Monday",
    hoursMainTime: "12:00 – 23:00",
    hoursWeekendTime: "11:00 – 17:00",
    hoursClosedTime: "Closed",
    ctaPrimary: "Reserve a table",
    ctaSecondary: "View menu",
    ctaTertiary: "Directions",
    dishesLabel: "Dishes",
    reviewsLabel: "Reviews",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    est: "Kuruluş 2012",
    storyLabel: "Hikayemiz",
    storyH: "Mutfağa duyulan sevgiyle",
    storySig: "— Bianchi ailesinden",
    servicesLabel: "Özelliklerimiz",
    servicesH: "Sezonun favorileri",
    hoursLabel: "Çalışma Saatleri",
    hoursMain: "Salı – Cumartesi",
    hoursWeekend: "Pazar",
    hoursClosed: "Pazartesi",
    hoursMainTime: "12:00 – 23:00",
    hoursWeekendTime: "11:00 – 17:00",
    hoursClosedTime: "Kapalı",
    ctaPrimary: "Rezervasyon yap",
    ctaSecondary: "Menüyü gör",
    ctaTertiary: "Konum",
    dishesLabel: "Yemek",
    reviewsLabel: "Yorum",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
  es: {

    est: "Establecido en 2012",
    storyLabel: "Nuestra historia",
    storyH: "Hecho con amor",
    storySig: "— de House Bianchi",
    servicesLabel: "Especialidades",
    servicesH: "Destacados de temporada",
    hoursLabel: "Horario de apertura",
    hoursMain: "Mar – Sáb",
    hoursWeekend: "Domingo",
    hoursClosed: "Lunes",
    hoursMainTime: "12:00 – 23:00",
    hoursWeekendTime: "11:00 – 17:00",
    hoursClosedTime: "Cerrado",
    ctaPrimary: "Reservar mesa",
    ctaSecondary: "Ver carta",
    ctaTertiary: "Cómo llegar",
    dishesLabel: "Platos",
    reviewsLabel: "Reseñas",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    est: "Fondato nel 2012",
    storyLabel: "La nostra storia",
    storyH: "Fatto con amore",
    storySig: "— da House Bianchi",
    servicesLabel: "Specialità",
    servicesH: "Punti salienti stagionali",
    hoursLabel: "Orari di apertura",
    hoursMain: "Mar – Sab",
    hoursWeekend: "Domenica",
    hoursClosed: "Lunedì",
    hoursMainTime: "12:00 – 23:00",
    hoursWeekendTime: "11:00 – 17:00",
    hoursClosedTime: "Chiuso",
    ctaPrimary: "Prenota un tavolo",
    ctaSecondary: "Vedi il menù",
    ctaTertiary: "Indicazioni",
    dishesLabel: "Piatti",
    reviewsLabel: "Recensioni",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    est: "Établi en 2012",
    storyLabel: "Notre histoire",
    storyH: "Fait avec amour",
    storySig: "— de House Bianchi",
    servicesLabel: "Spécialités",
    servicesH: "Points forts de saison",
    hoursLabel: "Horaires d'ouverture",
    hoursMain: "Mar – Sam",
    hoursWeekend: "Dimanche",
    hoursClosed: "Lundi",
    hoursMainTime: "12:00 – 23:00",
    hoursWeekendTime: "11:00 – 17:00",
    hoursClosedTime: "Fermé",
    ctaPrimary: "Réserver une table",
    ctaSecondary: "Voir le menu",
    ctaTertiary: "Itinéraire",
    dishesLabel: "Plats",
    reviewsLabel: "Avis",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    est: "تأسس في 2012",
    storyLabel: "قصتنا",
    storyH: "صنع بحب",
    storySig: "— من هاوس بيانكي",
    servicesLabel: "التخصصات",
    servicesH: "أبرز الموسم",
    hoursLabel: "ساعات الافتتاح",
    hoursMain: "ثلاثاء – سبت",
    hoursWeekend: "الأحد",
    hoursClosed: "الاثنين",
    hoursMainTime: "12:00 – 23:00",
    hoursWeekendTime: "11:00 – 17:00",
    hoursClosedTime: "مغلق",
    ctaPrimary: "احجز طاولة",
    ctaSecondary: "عرض القائمة",
    ctaTertiary: "الاتجاهات",
    dishesLabel: "الأطباق",
    reviewsLabel: "التقييمات",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

export function RestaurantStone({
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
  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";

  const allServices = cardData.services ?? [];
  const services = allServices.slice(0, 4);
  const testimonials = cardData.testimonials ?? [];
  const restaurantName = cardData.company || cardData.name;
  const tagline = cardData.title || cardData.position || "";
  const city = cardData.address?.split(",").slice(-2)[0]?.trim() || "Berlin";

  const nameParts = restaurantName.trim().split(/\s+/);
  const nameLead = nameParts.slice(0, -1).join(" ") || restaurantName;
  const nameTail = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  return (
    <article
      data-template="restaurant-stone"
      className="rss-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: PAGE, color: TEXT }}
    >
      <style jsx global>{`
        .rss-card {
          font-family: var(--tpl-font-body, 'Nunito', 'Inter', system-ui, sans-serif);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        .rss-card .serif {
          font-family: var(--tpl-font-display, 'Lora', 'Cormorant Garamond', Georgia, serif);
        }
        .rss-card a { color: inherit; }
      `}</style>

      {/* HEADER */}
      <header
        className="relative px-7 pt-12 text-center"
        style={{
          background: `linear-gradient(180deg, #f0e3cf 0%, ${PAGE} 100%)`,
        }}
      >
        <div
          className="serif mb-2.5 text-[13px] italic"
          style={{ color: ACCENT_2, letterSpacing: "1px" }}
        >
          {t.est}
        </div>
        <h1
          className="serif text-[38px] leading-[1.05]"
          style={{ color: ACCENT_DEEP, letterSpacing: "-0.5px", fontWeight: 600 }}
        >
          {nameLead}
          {nameTail && (
            <em
              className="font-normal italic"
              style={{ color: ACCENT_2, marginLeft: 8 }}
            >
              {nameTail}
            </em>
          )}
        </h1>
        {tagline && (
          <div
            className="serif mt-1 text-[16px] italic"
            style={{ color: TEXT_SOFT }}
          >
            {tagline}
          </div>
        )}

        {/* ornament */}
        <div className="mt-6 flex items-center justify-center gap-2.5">
          <span
            aria-hidden
            className="block h-px w-12"
            style={{ background: ACCENT_DEEP, opacity: 0.4 }}
          />
          <span
            aria-hidden
            className="block h-1.5 w-1.5 rounded-full"
            style={{ background: ACCENT_2 }}
          />
          <span
            aria-hidden
            className="block h-px w-12"
            style={{ background: ACCENT_DEEP, opacity: 0.4 }}
          />
        </div>

        {/* wave */}
        <svg
          aria-hidden
          viewBox="0 0 460 50"
          preserveAspectRatio="none"
          className="mt-6 block h-[50px] w-full"
        >
          <path
            d="M0,25 Q57.5,0 115,25 T230,25 T345,25 T460,25 L460,50 L0,50 Z"
            fill={PAGE}
          />
        </svg>
      </header>

      {/* OVAL PHOTO */}
      {photoUrl && (
        <div className="-mt-3 px-7 text-center">
          <div
            className="relative mx-auto overflow-hidden"
            style={{
              width: 200,
              height: 240,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              border: `6px solid ${SURFACE}`,
              boxShadow: "0 12px 40px -10px rgba(92,61,30,0.3)",
            }}
          >
            <Image
              src={photoUrl}
              alt={cardData.name}
              fill
              unoptimized
              className="object-cover tpl-photo"
              style={{ filter: "sepia(0.12) contrast(1.05) saturate(1.05)" }}
              sizes="200px"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 60%, rgba(92,61,30,0.15) 100%)",
                borderRadius: "inherit",
              }}
            />
          </div>
          <div className="mt-5">
            <div
              className="serif text-[19px]"
              style={{ color: ACCENT_DEEP, fontWeight: 600 }}
            >
              {cardData.name}
            </div>
            {cardData.position && (
              <div
                className="serif mt-0.5 text-[14px] italic"
                style={{ color: TEXT_SOFT }}
              >
                {cardData.position}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STORY */}
      {cardData.bio && (
        <section className="px-8 py-9 text-center">
          <div
            className="serif mb-3 text-[14px] italic"
            style={{ color: ACCENT_2, letterSpacing: "0.5px" }}
          >
            {t.storyLabel}
          </div>
          <h2
            className="serif mb-4 text-[24px]"
            style={{ color: ACCENT_DEEP, letterSpacing: "-0.3px", fontWeight: 600 }}
          >
            {t.storyH}
          </h2>
          <p
            className="serif text-[15px] leading-[1.7]"
            style={{ color: TEXT, fontWeight: 400 }}
          >
            {cardData.bio}
          </p>
          <div
            className="serif mt-4 text-[14px] italic"
            style={{ color: ACCENT_2, fontWeight: 500 }}
          >
            {t.storySig}
          </div>
        </section>
      )}

      {/* STATS */}
      {(() => {
        const statsItems = [
          ...(allServices.length > 0 ? [{ n: String(allServices.length), l: t.dishesLabel }] : []),
          ...(testimonials.length > 0 ? [{ n: String(testimonials.length), l: t.reviewsLabel }] : []),
        ];
        if (statsItems.length === 0) return null;
        return (
          <div className="grid gap-2 px-6 pb-7" style={{ gridTemplateColumns: `repeat(${statsItems.length}, 1fr)` }}>
            {statsItems.map((stat) => (
              <StoneStat key={stat.l} num={stat.n} label={stat.l} />
            ))}
          </div>
        );
      })()}

      {/* SPECIALTIES */}
      {services.length > 0 && (
        <section className="px-6 pb-7">
          <div
            className="serif mb-1 text-center text-[14px] italic"
            style={{ color: ACCENT_2, letterSpacing: "0.5px" }}
          >
            {t.servicesLabel}
          </div>
          <h3
            className="serif mb-5 text-center text-[22px]"
            style={{ color: ACCENT_DEEP, letterSpacing: "-0.3px", fontWeight: 600 }}
          >
            {t.servicesH}
          </h3>
          <div className="flex flex-col gap-3">
            {services.map((svc, i) => (
              <ServiceLink
                key={`${svc.title}-${i}`}
                href={svc.href}
                className="rounded-[14px] px-5 py-4"
                style={{
                  background: SURFACE,
                  border: `1px solid ${BORDER_SOFT}`,
                  boxShadow: "0 4px 16px rgba(92,61,30,0.06)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4
                      className="serif text-[17px] leading-tight"
                      style={{ color: ACCENT_DEEP, fontWeight: 600 }}
                    >
                      {svc.title}
                    </h4>
                    {svc.description && (
                      <p
                        className="mt-1 text-[13px] leading-snug"
                        style={{ color: TEXT_SOFT, fontWeight: 500 }}
                      >
                        {svc.description}
                      </p>
                    )}
                  </div>
                  {svc.priceLabel && (
                    <span
                      className="serif flex-shrink-0 rounded-full px-3 py-1.5 text-[13px]"
                      style={{
                        background: SURFACE_2,
                        color: ACCENT_DEEP,
                        border: `1px solid ${BORDER}`,
                        fontWeight: 600,
                      }}
                    >
                      {svc.priceLabel}
                    </span>
                  )}
                </div>
              </ServiceLink>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-6 pb-7">
        {phoneDigits && (
          <a
            href={`tel:${phoneDigits}`}
            className="serif mb-2.5 flex items-center justify-center gap-2 rounded-[14px] px-5 py-4 text-[16px]"
            style={{
              background: ACCENT_DEEP,
              color: SURFACE,
              fontWeight: 600,
              boxShadow: "0 8px 24px -8px rgba(92,61,30,0.45)",
              letterSpacing: "0.2px",
            }}
          >
            <Calendar size={18} strokeWidth={2.2} />
            {t.ctaPrimary}
            <ArrowUpRight size={16} strokeWidth={2.2} />
          </a>
        )}
        <div className="grid grid-cols-2 gap-2">
          {cardData.brochureUrl && (
            <a
              href={cardData.brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="serif rounded-[14px] px-4 py-3.5 text-center text-[14px]"
              style={{
                background: SURFACE,
                color: ACCENT_DEEP,
                border: `1px solid ${BORDER}`,
                fontWeight: 500,
              }}
            >
              {t.ctaSecondary}
            </a>
          )}
          {cardData.address && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(cardData.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="serif rounded-[14px] px-4 py-3.5 text-center text-[14px]"
              style={{
                background: SURFACE,
                color: ACCENT_DEEP,
                border: `1px solid ${BORDER}`,
                fontWeight: 500,
              }}
            >
              {t.ctaTertiary}
            </a>
          )}
        </div>
      </section>

      {/* HOURS */}
      <section className="px-6 pb-7">
        <div
          className="rounded-[14px] px-5 py-5"
          style={{
            background: SURFACE,
            border: `1px solid ${BORDER_SOFT}`,
          }}
        >
          <h3
            className="serif mb-3 text-[16px]"
            style={{ color: ACCENT_DEEP, fontWeight: 600 }}
          >
            {t.hoursLabel}
          </h3>
          <StoneHourLine day={t.hoursMain} time={t.hoursMainTime} />
          <StoneHourLine day={t.hoursWeekend} time={t.hoursWeekendTime} />
          <StoneHourLine day={t.hoursClosed} time={t.hoursClosedTime} muted last />
        </div>
      </section>

      {/* CONTACT */}
      <section className="px-6 pb-7">
        <ContactRows cardData={cardData} locale={locale} variant="tile" accentHex={ACCENT_DEEP} />
      </section>

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="px-6 py-7"
        style={{ background: SURFACE_2, borderTop: `1px solid ${BORDER_SOFT}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={ACCENT_DEEP} locale={locale} />
        <ExchangeSlot slug={slug} primary={ACCENT_DEEP} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="border-t px-6 py-6"
          labelClassName="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-center"
        >
          <div style={{ ["--card-primary" as string]: ACCENT_DEEP }}>{walletSlot}</div>
        </WalletDock>
      )}

      {cardData.socials && (
        <section
          className="px-6 py-6"
          style={{ borderTop: `1px solid ${BORDER_SOFT}` }}
        >
          <SocialRow socials={cardData.socials} variant="pill" accentHex={ACCENT_DEEP} />
        </section>
      )}

      {/* FOOTER */}
      <footer
        className="px-6 py-5 text-center"
        style={{ borderTop: `1px solid ${BORDER_SOFT}` }}
      >
        <div
          className="serif text-[14px] italic"
          style={{ color: ACCENT_DEEP, fontWeight: 500 }}
        >
          {restaurantName}
        </div>
        <div
          className="mt-1 text-[10.5px] font-semibold"
          style={{ color: TEXT_SOFT, letterSpacing: "1px" }}
        >
          {city} · MMXII · {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: ACCENT_2, fontWeight: 700 }}
          >
            OpSolid
          </a>
        </div>
      </footer>

      <span className="hidden">{accent}</span>
    </article>
  );
}

function StoneStat({ num, label }: { num: string; label: string }) {
  return (
    <div
      className="rounded-[14px] px-3 py-4 text-center"
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER_SOFT}`,
        boxShadow: "0 4px 16px rgba(92,61,30,0.06)",
      }}
    >
      <div
        className="serif text-[24px] leading-none"
        style={{ color: ACCENT_DEEP, fontWeight: 600 }}
      >
        {num}
      </div>
      <div
        className="mt-2 text-[10px] font-bold uppercase"
        style={{ color: TEXT_SOFT, letterSpacing: "1.5px" }}
      >
        {label}
      </div>
    </div>
  );
}

function StoneHourLine({
  day,
  time,
  muted,
  last,
}: {
  day: string;
  time: string;
  muted?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className="serif flex items-center justify-between py-2 text-[14px]"
      style={{
        borderBottom: last ? "none" : `1px dashed ${BORDER}`,
      }}
    >
      <span style={{ color: TEXT, fontWeight: 500 }}>{day}</span>
      <span
        style={{
          color: muted ? TEXT_SOFT : ACCENT_2,
          fontWeight: 600,
        }}
      >
        {time}
      </span>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const restaurantStoneEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 63,
  key: "restaurant-stone",
  name: "Restaurant — Stone",
  industry: "Restaurant / Trattoria",
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
    brandPrimaryHex: "#8b7355",
    brandAccentHex: "#c4a882",
  },
  sampleSlug: "demo-restaurant-stone",
};

export const restaurantStoneSample: SampleData = {
  templateId: 63,
  slug: "demo-restaurant-stone",
  cardData: {
    name: "Marco Bianchi",
    position: "Küchenchef & Inhaber",
    title: "Trattoria · seit 2012",
    company: "Trattoria Bianchi",
    email: "marco@trattoriabianchi.de",
    phone: "+49 30 776 5432",
    whatsapp: "+49 30 776 5432",
    website: "trattoriabianchi.de",
    address: "Schöneberger Ufer 14, 10785 Berlin",
    bio: "Authentische italienische Küche seit 2012. Saisonale Produkte, hausgemachte Pasta, warme Atmosphäre.",
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
        description: "Tagliatelle frische, schwarzer Trüffel, Parmigiano 24M.",
        priceLabel: "€24",
      },
      {
        title: "Tagliata di Manzo",
        description: "Rinderfilet, Rucola, Balsamico-Reduktion.",
        priceLabel: "€32",
      },
      {
        title: "Tiramisù della Nonna",
        description: "Hausgemacht — Mascarpone, Espresso, Marsala.",
        priceLabel: "€9",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#8b7355",
  brandAccentHex: "#c4a882",
};
