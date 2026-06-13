"use client";

// =============================================================================
// RestaurantNoir — v2 template (id=60, key="restaurant-noir").
//
// Sector: Restaurant — NOIR variant. Mood: midnight black, warm amber, fine
// dining editorial. Distinct from KitchenAtelier (id=3, terracotta palette,
// chef-patron portfolio) and Restaurant (id=14, warm trattoria with gallery).
//
// Inspired by kart_03_restoran_noir.html — Cormorant Garamond italics on a
// near-black surface with gold pinstripes.
//
// Design DNA:
//   - Insignia header — small EST-cap, circular monogram with double gold
//     ring, restaurant name in oversized italic serif, italic tagline.
//   - Hero photo (320 px) with inner gold frame and editorial caption.
//   - Chef block — eyebrow + serif name + bio + hairline gold divider rule.
//   - Numbered menu (Roman numerals I–IV) on dark card surface, gold prices.
//   - Stats row — 3 cells (years · award · rating) with gold serif numerals.
//   - Hours grid — 2 cells separated by vertical gold rule.
//   - Reservation CTA — bordered gold pill button.
//   - Contact list on near-black with serif rows.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { Mail, MessageCircle, Phone } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { ServiceLink } from "./shared/ServiceLink";
import { resolveLocation } from "./shared/profileExtras";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#0d0d0d";
const LOCKED_ACCENT = "#c8a951";
const SURFACE = "#0d0d0d";
const SURFACE_2 = "#141414";
const SURFACE_3 = "#181818";
const COPPER = "#b87333";
const TEXT = "#f0ede8";
const TEXT_SOFT = "rgba(240,237,232,0.72)";
const TEXT_MUTED = "rgba(240,237,232,0.45)";
const HAIRLINE = "rgba(200,169,81,0.18)";

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

function getInitial(name: string): string {
  const parts = name
    .replace(/^(Chef|Sef|Şef|Dr\.?|Mr\.?)\s+/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "·";
  return (parts[parts.length - 1][0] ?? parts[0][0] ?? "·").toUpperCase();
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

interface Copy {
  est: string;
  chefEyebrow: string;
  menuEyebrow: string;
  menuH: string;
  hoursEyebrow: string;
  hoursMain: string;
  hoursMainSub: string;
  hoursWeekend: string;
  hoursWeekendSub: string;
  ctaEyebrow: string;
  ctaBtn: string;
  contactEyebrow: string;
  callBtn: string;
  whatsappBtn: string;
  emailBtn: string;
  servicesLabel: string;
  reviewsLabel: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    est: "Established 2012",
    chefEyebrow: "Unsere Küche",
    menuEyebrow: "Empfehlungen",
    menuH: "À la carte",
    hoursEyebrow: "Öffnungszeiten",
    hoursMain: "Di – Sa",
    hoursMainSub: "Abendservice",
    hoursWeekend: "Sonntag",
    hoursWeekendSub: "Brunch",
    ctaEyebrow: "Reservieren Sie einen Tisch",
    ctaBtn: "Reservierung",
    contactEyebrow: "Kontakt",
    callBtn: "Anrufen",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-Mail",
    servicesLabel: "Gerichte",
    reviewsLabel: "Bewertungen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    est: "Established 2012",
    chefEyebrow: "Our Kitchen",
    menuEyebrow: "Seasonal Picks",
    menuH: "À la carte",
    hoursEyebrow: "Opening Hours",
    hoursMain: "Tue – Sat",
    hoursMainSub: "Dinner Service",
    hoursWeekend: "Sunday",
    hoursWeekendSub: "Brunch Only",
    ctaEyebrow: "Reserve a table",
    ctaBtn: "Reservation",
    contactEyebrow: "Contact",
    callBtn: "Call",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    servicesLabel: "Dishes",
    reviewsLabel: "Reviews",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    est: "Kuruluş 2012",
    chefEyebrow: "Mutfağımız",
    menuEyebrow: "Sezon Önerileri",
    menuH: "À la carte",
    hoursEyebrow: "Çalışma Saatleri",
    hoursMain: "Salı – Cumartesi",
    hoursMainSub: "Akşam Servisi",
    hoursWeekend: "Pazar",
    hoursWeekendSub: "Sadece Brunch",
    ctaEyebrow: "Bir masa ayırtın",
    ctaBtn: "Rezervasyon",
    contactEyebrow: "İletişim",
    callBtn: "Ara",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-posta",
    servicesLabel: "Yemek",
    reviewsLabel: "Yorum",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
  es: {

    est: "Establecido en 2012",
    chefEyebrow: "Nuestra cocina",
    menuEyebrow: "Selección de temporada",
    menuH: "À la carte",
    hoursEyebrow: "Horario de apertura",
    hoursMain: "Mar – Sáb",
    hoursMainSub: "Servicio de cena",
    hoursWeekend: "Domingo",
    hoursWeekendSub: "Solo brunch",
    ctaEyebrow: "Reservar mesa",
    ctaBtn: "Reserva",
    contactEyebrow: "Contacto",
    callBtn: "Llamar",
    whatsappBtn: "WhatsApp",
    emailBtn: "Correo",
    servicesLabel: "Platos",
    reviewsLabel: "Reseñas",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    est: "Fondato nel 2012",
    chefEyebrow: "La nostra cucina",
    menuEyebrow: "Selezioni stagionali",
    menuH: "À la carte",
    hoursEyebrow: "Orari di apertura",
    hoursMain: "Mar – Sab",
    hoursMainSub: "Servizio cena",
    hoursWeekend: "Domenica",
    hoursWeekendSub: "Solo brunch",
    ctaEyebrow: "Prenota un tavolo",
    ctaBtn: "Prenotazione",
    contactEyebrow: "Contatto",
    callBtn: "Chiama",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    servicesLabel: "Piatti",
    reviewsLabel: "Recensioni",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    est: "Établi en 2012",
    chefEyebrow: "Notre cuisine",
    menuEyebrow: "Sélections de saison",
    menuH: "À la carte",
    hoursEyebrow: "Horaires d'ouverture",
    hoursMain: "Mar – Sam",
    hoursMainSub: "Service du dîner",
    hoursWeekend: "Dimanche",
    hoursWeekendSub: "Brunch uniquement",
    ctaEyebrow: "Réserver une table",
    ctaBtn: "Réservation",
    contactEyebrow: "Contact",
    callBtn: "Appeler",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-mail",
    servicesLabel: "Plats",
    reviewsLabel: "Avis",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    est: "تأسس في 2012",
    chefEyebrow: "مطبخنا",
    menuEyebrow: "مختارات الموسم",
    menuH: "حسب الطلب",
    hoursEyebrow: "ساعات الافتتاح",
    hoursMain: "ثلاثاء – سبت",
    hoursMainSub: "خدمة العشاء",
    hoursWeekend: "الأحد",
    hoursWeekendSub: "برانش فقط",
    ctaEyebrow: "احجز طاولة",
    ctaBtn: "حجز",
    contactEyebrow: "اتصال",
    callBtn: "اتصال",
    whatsappBtn: "واتساب",
    emailBtn: "البريد الإلكتروني",
    servicesLabel: "الأطباق",
    reviewsLabel: "التقييمات",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

export function RestaurantNoir({
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
  const initial = getInitial(cardData.company || cardData.name);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const allServices = cardData.services ?? [];
  const services = allServices.slice(0, 5);
  const testimonials = cardData.testimonials ?? [];
  const restaurantName = cardData.company || cardData.name;
  const tagline = cardData.title || cardData.position || "";
  const city = resolveLocation(cardData);

  return (
    <article
      data-template="restaurant-noir"
      className="rsn-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: TEXT }}
    >
      <style jsx global>{`
        .rsn-card {
          font-family: var(--tpl-font-body, 'Inter', system-ui, sans-serif);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        .rsn-card .serif {
          font-family: var(--tpl-font-display, 'Cormorant Garamond', 'Playfair Display', Georgia, serif);
        }
        .rsn-card a { color: inherit; }
      `}</style>

      {/* INSIGNIA HEADER */}
      <header
        className="relative px-6 pb-8 pt-12 text-center"
        style={{
          background: `linear-gradient(180deg, ${SURFACE} 0%, #101010 100%)`,
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        <span
          aria-hidden
          className="absolute left-1/2 top-7 block h-px w-8 -translate-x-1/2"
          style={{ background: accent, opacity: 0.6 }}
        />
        <div
          className="mb-5 mt-2 text-[9.5px] font-medium uppercase"
          style={{ color: accent, letterSpacing: "4px" }}
        >
          {t.est}
        </div>

        {/* Monogram — circle with double gold ring */}
        <div className="relative mx-auto mb-4 h-16 w-16">
          <span
            aria-hidden
            className="absolute -inset-1.5 block rounded-full"
            style={{ border: `1px solid ${HAIRLINE}` }}
          />
          <div
            className="serif relative flex h-full w-full items-center justify-center rounded-full text-[30px] italic"
            style={{
              border: `1px solid ${accent}`,
              color: accent,
              fontWeight: 300,
            }}
          >
            {initial}
          </div>
        </div>

        <h1
          className="serif mb-1.5 text-[34px] leading-none"
          style={{
            color: TEXT,
            letterSpacing: "1.5px",
            fontWeight: 300,
            textTransform: "uppercase",
          }}
        >
          {restaurantName}
        </h1>
        {tagline && (
          <div
            className="serif text-[16px] italic"
            style={{ color: TEXT_SOFT, letterSpacing: "0.6px", fontWeight: 400 }}
          >
            {tagline}
          </div>
        )}
        {city && (
          <div
            className="mt-4 text-[10px] font-medium uppercase"
            style={{ color: "rgba(200,169,81,0.55)", letterSpacing: "3px" }}
          >
            {city}
          </div>
        )}
      </header>

      {/* HERO PHOTO with gold inner frame */}
      {photoUrl && (
        <div className="relative h-[300px] w-full overflow-hidden">
          <Image
            src={photoUrl}
            alt={restaurantName}
            fill
            unoptimized
            className="object-cover tpl-photo"
            style={{ filter: "brightness(0.78) contrast(1.05)" }}
            sizes="460px"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(180deg, rgba(13,13,13,0.05) 0%, rgba(13,13,13,0.6) 100%), linear-gradient(135deg, rgba(200,169,81,0.18) 0%, transparent 60%)`,
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-[18px]"
            style={{ border: `1px solid rgba(200,169,81,0.35)` }}
          />
          <div className="absolute bottom-7 left-7 z-10 max-w-[260px]">
            <div
              className="mb-1.5 text-[9.5px] font-medium uppercase"
              style={{ color: accent, letterSpacing: "3px" }}
            >
              {t.chefEyebrow}
            </div>
            {cardData.bio && (
              <div
                className="serif text-[16px] italic leading-snug"
                style={{ color: TEXT, fontWeight: 400 }}
              >
                {"“"}
                {cardData.bio.split(/[.!?]/)[0]?.trim()}
                {"”"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHEF BLOCK */}
      <section
        className="px-7 py-9 text-center"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="mb-3 text-[10px] font-medium uppercase"
          style={{ color: accent, letterSpacing: "4px" }}
        >
          {t.chefEyebrow}
        </div>
        <h2
          className="serif mb-3 text-[24px]"
          style={{ color: TEXT, letterSpacing: "0.5px", fontWeight: 300 }}
        >
          {cardData.name}
        </h2>
        {cardData.bio && (
          <p
            className="text-[13px]"
            style={{ color: TEXT_SOFT, lineHeight: 1.7, fontWeight: 300 }}
          >
            {cardData.bio}
          </p>
        )}
        <span
          aria-hidden
          className="mx-auto mt-5 block h-7 w-px"
          style={{ background: accent, opacity: 0.5 }}
        />
      </section>

      {/* NUMBERED MENU */}
      {services.length > 0 && (
        <section
          className="px-7 py-9"
          style={{
            background: SURFACE_2,
            borderBottom: `1px solid ${HAIRLINE}`,
          }}
        >
          <div
            className="mb-1 text-center text-[11px] font-medium uppercase"
            style={{ color: accent, letterSpacing: "5px" }}
          >
            {t.menuEyebrow}
          </div>
          <h3
            className="serif mb-7 text-center text-[28px] italic"
            style={{ color: TEXT, fontWeight: 300 }}
          >
            {t.menuH}
          </h3>
          <div>
            {services.map((svc, i) => (
              <ServiceLink
                key={`${svc.title}-${i}`}
                href={svc.href}
                className="grid items-baseline gap-4 py-4"
                style={{
                  gridTemplateColumns: "28px 1fr auto",
                  borderBottom:
                    i === services.length - 1 ? "none" : `1px solid ${HAIRLINE}`,
                }}
              >
                <span
                  className="serif text-[18px] italic"
                  style={{ color: accent, fontWeight: 300, letterSpacing: "1px" }}
                >
                  {ROMAN[i] ?? `${i + 1}`}
                </span>
                <div className="min-w-0">
                  <div
                    className="serif text-[18px] leading-tight"
                    style={{ color: TEXT, fontWeight: 600 }}
                  >
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div
                      className="serif mt-1 text-[12.5px] italic"
                      style={{ color: TEXT_MUTED, fontWeight: 400 }}
                    >
                      {svc.description}
                    </div>
                  )}
                </div>
                {svc.priceLabel && (
                  <div
                    className="text-[13px] font-medium"
                    style={{ color: accent, letterSpacing: "0.8px" }}
                  >
                    {svc.priceLabel}
                  </div>
                )}
              </ServiceLink>
            ))}
          </div>
        </section>
      )}

      {/* STATS ROW — driven by real data */}
      {(() => {
        const statsItems = [
          ...(allServices.length ? [{ num: String(allServices.length), label: t.servicesLabel }] : []),
          ...(testimonials.length ? [{ num: String(testimonials.length), label: t.reviewsLabel }] : []),
        ];
        if (statsItems.length === 0) return null;
        return (
          <div
            className="py-7"
            style={{
              background: SURFACE_3,
              borderBottom: `1px solid ${HAIRLINE}`,
              display: "grid",
              gridTemplateColumns: `repeat(${statsItems.length}, 1fr)`,
            }}
          >
            {statsItems.map((s, i) => (
              <NoirStat key={s.label} num={s.num} label={s.label} accent={accent} divider={i > 0} />
            ))}
          </div>
        );
      })()}

      {/* HOURS — 2-cell grid with vertical rule */}
      <section
        className="px-7 py-9 text-center"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="mb-5 text-[10px] font-medium uppercase"
          style={{ color: accent, letterSpacing: "4px" }}
        >
          {t.hoursEyebrow}
        </div>
        <div
          className="grid items-center gap-6"
          style={{ gridTemplateColumns: "1fr 1px 1fr" }}
        >
          <HoursCell
            label={t.hoursMain}
            time="12:00 — 23:00"
            meta={t.hoursMainSub}
            accent={accent}
          />
          <span
            aria-hidden
            className="block h-14 w-px"
            style={{ background: accent, opacity: 0.3 }}
          />
          <HoursCell
            label={t.hoursWeekend}
            time="11:00 — 17:00"
            meta={t.hoursWeekendSub}
            accent={accent}
          />
        </div>
      </section>

      {/* RESERVATION CTA */}
      <section
        className="px-7 py-9 text-center"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="serif mb-5 text-[16px] italic"
          style={{ color: TEXT_SOFT, fontWeight: 400 }}
        >
          {t.ctaEyebrow}
        </div>
        {phoneDigits && (
          <a
            href={`tel:${phoneDigits}`}
            className="inline-block px-12 py-4 text-[11px] font-medium uppercase transition-colors"
            style={{
              border: `1px solid ${accent}`,
              color: accent,
              letterSpacing: "5px",
            }}
          >
            {t.ctaBtn}
          </a>
        )}
        <div className="mt-5 flex justify-center gap-6 text-[11px] uppercase">
          {waDigits && (
            <a
              href={`https://wa.me/${waDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: TEXT_MUTED, letterSpacing: "2px" }}
            >
              {t.whatsappBtn}
            </a>
          )}
          {cardData.email && (
            <a
              href={`mailto:${cardData.email}`}
              style={{ color: TEXT_MUTED, letterSpacing: "2px" }}
            >
              {t.emailBtn}
            </a>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section
        className="px-7 py-9"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="mb-5 text-center text-[10px] font-medium uppercase"
          style={{ color: accent, letterSpacing: "4px" }}
        >
          {t.contactEyebrow}
        </div>
        <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={accent} />
      </section>

      {/* QUICK ACTIONS */}
      <section className="grid grid-cols-3 gap-2 px-7 py-6">
        {phoneDigits && (
          <NoirAction href={`tel:${phoneDigits}`} Icon={Phone} label={t.callBtn} accent={accent} />
        )}
        {waDigits && (
          <NoirAction
            href={`https://wa.me/${waDigits}`}
            Icon={MessageCircle}
            label={t.whatsappBtn}
            accent={accent}
            external
          />
        )}
        {cardData.email && (
          <NoirAction
            href={`mailto:${cardData.email}`}
            Icon={Mail}
            label={t.emailBtn}
            accent={accent}
          />
        )}
      </section>

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="px-7 py-7"
        style={{
          background: SURFACE_3,
          borderTop: `1px solid ${HAIRLINE}`,
        }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
        <ExchangeSlot slug={slug} primary={accent} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="border-t px-7 py-6"
          labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-center"
        >
          <div
            style={{
              ["--card-primary" as string]: accent,
              color: TEXT,
              borderColor: HAIRLINE,
            }}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {cardData.socials && (
        <section
          className="px-7 py-6"
          style={{ borderTop: `1px solid ${HAIRLINE}` }}
        >
          <SocialRow socials={cardData.socials} variant="icon" accentHex={accent} />
        </section>
      )}

      {/* FOOTER */}
      <footer
        className="px-7 py-6 text-center"
        style={{ background: "#080808" }}
      >
        <div className="serif mb-1 text-[14px] italic" style={{ color: accent, fontWeight: 400 }}>
          {restaurantName}
        </div>
        <div
          className="text-[9.5px]"
          style={{ color: TEXT_MUTED, letterSpacing: "2px", textTransform: "uppercase" }}
        >
          {city ? `${city} · ` : ""}{t.poweredBy}{" "}
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

      <span className="hidden">{COPPER}</span>
    </article>
  );
}

function NoirStat({
  num,
  label,
  accent,
  divider,
}: {
  num: string;
  label: string;
  accent: string;
  divider?: boolean;
}) {
  return (
    <div className="relative px-3 text-center">
      {divider && (
        <span
          aria-hidden
          className="absolute left-0 top-[12%] h-[76%] w-px"
          style={{ background: HAIRLINE }}
        />
      )}
      <div
        className="serif text-[28px] leading-none"
        style={{ color: accent, fontWeight: 300 }}
      >
        {num}
      </div>
      <div
        className="mt-2 text-[9.5px] font-medium uppercase"
        style={{ color: TEXT_MUTED, letterSpacing: "1.5px" }}
      >
        {label}
      </div>
    </div>
  );
}

function HoursCell({
  label,
  time,
  meta,
  accent,
}: {
  label: string;
  time: string;
  meta: string;
  accent: string;
}) {
  return (
    <div>
      <div
        className="serif text-[13px] italic"
        style={{ color: TEXT_MUTED, marginBottom: 6, fontWeight: 400 }}
      >
        {label}
      </div>
      <div
        className="serif text-[19px]"
        style={{ color: TEXT, letterSpacing: "0.5px", fontWeight: 400 }}
      >
        {time}
      </div>
      <div
        className="mt-2 text-[9.5px] font-medium uppercase"
        style={{ color: accent, letterSpacing: "2px" }}
      >
        {meta}
      </div>
    </div>
  );
}

function NoirAction({
  href,
  label,
  Icon,
  accent,
  external,
}: {
  href: string;
  label: string;
  Icon: typeof Phone;
  accent: string;
  external?: boolean;
}) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" as const } : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex items-center justify-center gap-2 border px-3 py-3 text-[11.5px] font-medium uppercase transition-colors"
      style={{
        background: SURFACE_2,
        borderColor: HAIRLINE,
        color: accent,
        letterSpacing: "1.5px",
      }}
    >
      <Icon size={13} strokeWidth={1.7} />
      {label}
    </a>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const restaurantNoirEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 60,
  key: "restaurant-noir",
  name: "Restaurant — Noir",
  industry: "Restaurant / Fine dining",
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
    brandPrimaryHex: "#0d0d0d",
    brandAccentHex: "#c8a951",
  },
  sampleSlug: "demo-restaurant-noir",
};

// photo: Unsplash, restaurant interior. Unsplash License — free, no attribution.
export const restaurantNoirSample: SampleData = {
  templateId: 60,
  slug: "demo-restaurant-noir",
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
        description: "Rinderfilet, Rucola, Balsamico-Reduktion, Parmigiano.",
        priceLabel: "€32",
      },
      {
        title: "Tiramisù",
        description: "Hausgemacht — Mascarpone, Espresso, Marsala.",
        priceLabel: "€9",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#0d0d0d",
  brandAccentHex: "#c8a951",
};
