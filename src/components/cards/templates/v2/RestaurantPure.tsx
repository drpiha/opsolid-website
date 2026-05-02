"use client";

// =============================================================================
// RestaurantPure â€” v2 template (id=61, key="restaurant-pure").
//
// Sector: Restaurant â€” PURE variant. Mood: white menu-card, oversized
// Bricolage display type with EB Garamond italic, hairline tables.
// Inspired by kart_03_restoran_pure.html.
//
// Design DNA (distinct from KitchenAtelier and Restaurant defaults):
//   - Mega type header â€” "Open Â· Tueâ€“Sun" + city meta line, then huge
//     Bricolage name with italic last word in mustard accent.
//   - Chef strip â€” small grayscale photo (80Ã—80) + name + role + stat row.
//   - About â€” italic Garamond pull-paragraph with signature.
//   - Dishes â€” 3-square thumbnail row + tabular dish list with prices.
//   - Hours table â€” dashed hairline rows.
//   - Contact table â€” left-aligned key column, right value column.
//   - 2Ã—2 CTA grid â€” primary black + ghost.
//   - QR / share strip.
// =============================================================================

import * as React from "react";
import Image from "next/image";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#f9f7f2";
const LOCKED_ACCENT = "#1a1a1a";
const PAGE = "#f8f6f3";
const SURFACE = "#ffffff";
const ACCENT_2 = "#c8a500";
const INK = "#111111";
const INK_SOFT = "#888888";
const HAIRLINE = "#e8e4df";
const HAIRLINE_SOFT = "#efece6";

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
  metaOpen: string;
  philosophy: string;
  dishes: string;
  hours: string;
  contact: string;
  reserveBtn: string;
  whatsappBtn: string;
  menuBtn: string;
  directionsBtn: string;
  servicesLabel: string;
  reviewsLabel: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr", Copy> = {
  de: {
    metaOpen: "GeÃ¶ffnet Â· Di â€“ So",
    philosophy: "Philosophie",
    dishes: "Saisonale SpezialitÃ¤ten",
    hours: "Adresse",
    contact: "Kontakt",
    reserveBtn: "Reservierung",
    whatsappBtn: "WhatsApp",
    menuBtn: "MenÃ¼",
    directionsBtn: "Anfahrt",
    servicesLabel: "Gerichte",
    reviewsLabel: "Bewertungen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    metaOpen: "Open Â· Tue â€“ Sun",
    philosophy: "Philosophy",
    dishes: "Seasonal Specials",
    hours: "Address",
    contact: "Contact",
    reserveBtn: "Reserve",
    whatsappBtn: "WhatsApp",
    menuBtn: "Menu",
    directionsBtn: "Directions",
    servicesLabel: "Dishes",
    reviewsLabel: "Reviews",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    metaOpen: "AÃ§Ä±k Â· SalÄ± â€“ Pazar",
    philosophy: "Felsefemiz",
    dishes: "Sezon Ã–zellikleri",
    hours: "Adres",
    contact: "Ä°letiÅŸim",
    reserveBtn: "Rezervasyon",
    whatsappBtn: "WhatsApp",
    menuBtn: "MenÃ¼",
    directionsBtn: "Konum",
    servicesLabel: "Yemek",
    reviewsLabel: "Yorum",
    saveContact: "KiÅŸiyi Kaydet",
    walletLabel: "CÃ¼zdana ekle",
    poweredBy: "Powered by",
  },
};

export function RestaurantPure({
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
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = (cardData.services ?? []).slice(0, 5);
  const testimonials = cardData.testimonials ?? [];
  const restaurantName = cardData.company || cardData.name;
  const tagline = cardData.title || cardData.position || "";
  const city = cardData.address?.split(",").slice(-2)[0]?.trim() || "Berlin";

  // Display name split â€” first word(s) plain, last word italic / mustard
  const nameParts = restaurantName.trim().split(/\s+/);
  const nameLead = nameParts[0] ?? restaurantName;
  const nameTail = nameParts.slice(1).join(" ");

  return (
    <article
      data-template="restaurant-pure"
      className="rsp-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: PAGE, color: INK }}
    >
      <style jsx global>{`
        .rsp-card {
          font-family: var(--tpl-font-body, 'Bricolage Grotesque', 'Inter', system-ui, sans-serif);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .rsp-card .serif-i {
          font-family: var(--tpl-font-display, 'EB Garamond', 'Cormorant Garamond', Georgia, serif);
          font-style: italic;
          font-weight: 400;
        }
        .rsp-card a { color: inherit; }
      `}</style>

      {/* MEGA TYPE HEADER */}
      <header className="px-7 pb-7 pt-12">
        <div className="mb-9 flex items-center justify-between text-[11px] font-medium uppercase" style={{ color: INK_SOFT, letterSpacing: "1.5px" }}>
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className="block h-1.5 w-1.5 rounded-full"
              style={{ background: ACCENT_2 }}
            />
            {t.metaOpen}
          </span>
          <span>{city}</span>
        </div>
        <h1
          className="text-[60px] leading-[0.92]"
          style={{ color: accent, letterSpacing: "-3px", fontWeight: 700 }}
        >
          {nameLead}
          {nameTail && (
            <>
              <br />
              <em
                className="serif-i font-normal italic"
                style={{ color: ACCENT_2 }}
              >
                {nameTail}
              </em>
            </>
          )}
        </h1>
        {tagline && (
          <div
            className="serif-i mt-2 text-[18px]"
            style={{ color: INK_SOFT }}
          >
            {tagline}
          </div>
        )}
      </header>

      {/* CHEF STRIP */}
      <div
        className="grid items-center gap-4 px-7 py-5"
        style={{
          gridTemplateColumns: "80px 1fr",
          borderTop: `1px solid ${HAIRLINE}`,
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={cardData.name}
            width={80}
            height={80}
            unoptimized
            className="object-cover tpl-photo"
            style={{
              width: 80,
              height: 80,
              filter: "grayscale(1) contrast(1.05)",
              borderRadius: 2,
            }}
          />
        ) : (
          <div
            className="flex items-center justify-center text-[26px] font-semibold"
            style={{
              width: 80,
              height: 80,
              background: SURFACE,
              color: accent,
              borderRadius: 2,
            }}
          >
            {cardData.name.slice(0, 1)}
          </div>
        )}
        <div className="min-w-0">
          <h2
            className="text-[16px] font-semibold leading-tight"
            style={{ color: INK, letterSpacing: "-0.3px" }}
          >
            {cardData.name}
          </h2>
          {cardData.position && (
            <p
              className="serif-i mt-0.5 text-[13.5px]"
              style={{ color: INK_SOFT }}
            >
              {cardData.position}
            </p>
          )}
          {(services.length > 0 || testimonials.length > 0) && (
            <div
              className="mt-2 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11px] font-medium"
              style={{ color: INK, letterSpacing: "0.5px" }}
            >
              {services.length > 0 && <span>{services.length} {t.servicesLabel}</span>}
              {services.length > 0 && testimonials.length > 0 && <span style={{ color: INK_SOFT }}>Â·</span>}
              {testimonials.length > 0 && <span>{testimonials.length} {t.reviewsLabel}</span>}
            </div>
          )}
        </div>
      </div>

      {/* ABOUT */}
      {cardData.bio && (
        <section className="px-7 py-9">
          <PureLabel>{t.philosophy}</PureLabel>
          <p
            className="serif-i mt-3 text-[19px] leading-[1.55]"
            style={{ color: INK }}
          >
            {"â€œ"}
            {cardData.bio}
            {"â€"}
          </p>
          <div
            className="serif-i mt-3 text-[14px]"
            style={{ color: INK_SOFT }}
          >
            â€” {cardData.name}
          </div>
        </section>
      )}

      {/* DISHES */}
      {services.length > 0 && (
        <section className="px-7 pb-9">
          <PureLabel>{t.dishes}</PureLabel>

          {/* 3 thumbnails */}
          {photoUrl && (
            <div className="mt-4 grid gap-2" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className="relative aspect-square overflow-hidden"
                  style={{ background: SURFACE, borderRadius: 2 }}
                >
                  <Image
                    src={photoUrl}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover tpl-photo"
                    style={{
                      filter: idx === 1 ? "saturate(1.1)" : "grayscale(0.2)",
                    }}
                    sizes="150px"
                  />
                </div>
              ))}
            </div>
          )}

          {/* dish list */}
          <div className="mt-5">
            {services.map((svc, i) => (
              <div
                key={`${svc.title}-${i}`}
                className="grid items-baseline gap-3 py-3.5"
                style={{
                  gridTemplateColumns: "1fr auto",
                  borderBottom:
                    i === services.length - 1 ? "none" : `1px solid ${HAIRLINE}`,
                }}
              >
                <div className="min-w-0">
                  <div
                    className="text-[15px] font-medium"
                    style={{ color: INK, letterSpacing: "-0.2px" }}
                  >
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div
                      className="serif-i mt-0.5 text-[13px]"
                      style={{ color: INK_SOFT }}
                    >
                      {svc.description}
                    </div>
                  )}
                </div>
                {svc.priceLabel && (
                  <div
                    className="text-[14px] font-semibold"
                    style={{ color: accent }}
                  >
                    {svc.priceLabel}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ADDRESS */}
      {cardData.address && (
        <section
          className="mx-7 mb-9 pt-5"
          style={{ borderTop: `1px solid ${HAIRLINE}` }}
        >
          <PureLabel>{t.hours}</PureLabel>
          <div className="mt-3.5 text-[14px]" style={{ color: INK }}>{cardData.address}</div>
        </section>
      )}

      {/* CONTACT TABLE */}
      <section
        className="mx-7 mb-9 pt-5"
        style={{ borderTop: `1px solid ${HAIRLINE}` }}
      >
        <PureLabel>{t.contact}</PureLabel>
        <div className="mt-4">
          <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={accent} />
        </div>
      </section>

      {/* CTA GRID 2Ã—2 */}
      <div className="grid grid-cols-2 gap-2 px-7 pb-7">
        {phoneDigits && (
          <a
            href={`tel:${phoneDigits}`}
            className="flex items-center justify-center px-4 py-4 text-[13px] font-semibold"
            style={{
              background: accent,
              color: PAGE,
              border: `1px solid ${accent}`,
              borderRadius: 2,
              letterSpacing: "0.3px",
            }}
          >
            {t.reserveBtn}
          </a>
        )}
        {waDigits && (
          <a
            href={`https://wa.me/${waDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 py-4 text-[13px] font-semibold"
            style={{
              background: "transparent",
              color: accent,
              border: `1px solid ${accent}`,
              borderRadius: 2,
              letterSpacing: "0.3px",
            }}
          >
            {t.whatsappBtn}
          </a>
        )}
        {cardData.brochureUrl && (
          <a
            href={cardData.brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 py-4 text-[13px] font-semibold"
            style={{
              background: "transparent",
              color: accent,
              border: `1px solid ${accent}`,
              borderRadius: 2,
              letterSpacing: "0.3px",
            }}
          >
            {t.menuBtn}
          </a>
        )}
        {cardData.address && (
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(cardData.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 py-4 text-[13px] font-semibold"
            style={{
              background: "transparent",
              color: accent,
              border: `1px solid ${accent}`,
              borderRadius: 2,
              letterSpacing: "0.3px",
            }}
          >
            {t.directionsBtn}
          </a>
        )}
      </div>

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="px-7 py-7"
        style={{ background: SURFACE, borderTop: `1px solid ${HAIRLINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
        <ExchangeSlot slug={slug} primary={accent} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="border-t px-7 py-6"
          labelClassName="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-center"
        >
          <div style={{ ["--card-primary" as string]: accent }}>{walletSlot}</div>
        </WalletDock>
      )}

      {cardData.socials && (
        <section
          className="px-7 py-6"
          style={{ borderTop: `1px solid ${HAIRLINE}` }}
        >
          <SocialRow socials={cardData.socials} variant="pill" accentHex={accent} />
        </section>
      )}

      {/* FOOTER */}
      <footer
        className="flex items-center justify-between px-7 py-5 text-[11px]"
        style={{ borderTop: `1px solid ${HAIRLINE}`, color: INK_SOFT, letterSpacing: "1px" }}
      >
        <span>
          {restaurantName} Â© {new Date().getFullYear()}
        </span>
        <span>
          {city} Â·{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: accent, fontWeight: 600 }}
          >
            OpSolid
          </a>
        </span>
      </footer>

      <span className="hidden">{HAIRLINE_SOFT}</span>
    </article>
  );
}

function PureLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[10px] font-semibold uppercase"
      style={{ color: ACCENT_2, letterSpacing: "2.5px" }}
    >
      {children}
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const restaurantPureEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 61,
  key: "restaurant-pure",
  name: "Restaurant â€” Pure",
  industry: "Restaurant / Fine dining",
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
    brandPrimaryHex: "#f9f7f2",
    brandAccentHex: "#1a1a1a",
  },
  sampleSlug: "demo-restaurant-pure",
};

export const restaurantPureSample: SampleData = {
  templateId: 61,
  slug: "demo-restaurant-pure",
  cardData: {
    name: "Marco Bianchi",
    position: "KÃ¼chenchef & Inhaber",
    title: "Trattoria Â· seit 2012",
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
        description: "tagliatelle frische Â· trÃ¼ffel Â· parmigiano",
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
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#f9f7f2",
  brandAccentHex: "#1a1a1a",
};

