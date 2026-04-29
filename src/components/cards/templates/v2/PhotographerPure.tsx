"use client";

// =============================================================================
// PhotographerPure — v2 template (id=65, key="photographer-pure").
//
// Sector: Creator / Photographer — PURE variant. Mood: white gallery wall,
// minimal, work-forward. Inspired by kart_04_fotograf_pure.html.
//
// Design DNA:
//   - Mega Bricolage type header — meta line + huge sans name with last
//     word in italic Garamond (muted gold).
//   - Profile strip — small grayscale photo + name + role + stat row.
//   - About — italic Garamond paragraph, signature dash.
//   - Portfolio 2×2 grid with grayscale → color hover (4:5 aspect).
//   - Packages list — hairline rows, right-aligned price.
//   - Hours/availability table — dashed dividers.
//   - Contact table.
//   - 2-column ghost CTA grid.
// =============================================================================

import * as React from "react";
import Image from "next/image";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#ffffff";
const LOCKED_ACCENT = "#1a1a1a";
const PAGE = "#f2f2f2";
const SURFACE = "#ffffff";
const ACCENT_2 = "#d4af37";
const INK = "#111111";
const INK_SOFT = "#777777";
const HAIRLINE = "#e3e3e3";

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
  metaAvailable: string;
  metaCity: string;
  philosophy: string;
  portfolio: string;
  portfolioMore: string;
  packages: string;
  contact: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaTertiary: string;
  ctaQuad: string;
  servicesLabel: string;
  reviewsLabel: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr", Copy> = {
  de: {
    metaAvailable: "Verfügbar 2026",
    metaCity: "Berlin · DE",
    philosophy: "Manifest",
    portfolio: "Portfolio",
    portfolioMore: "Mehr ansehen",
    packages: "Pakete",
    contact: "Kontakt",
    ctaPrimary: "Termin buchen",
    ctaSecondary: "WhatsApp",
    ctaTertiary: "Portfolio",
    ctaQuad: "Anfahrt",
    servicesLabel: "Pakete",
    reviewsLabel: "Bewertungen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    metaAvailable: "Available 2026",
    metaCity: "Berlin · DE",
    philosophy: "Manifesto",
    portfolio: "Portfolio",
    portfolioMore: "View more",
    packages: "Packages",
    contact: "Contact",
    ctaPrimary: "Book a session",
    ctaSecondary: "WhatsApp",
    ctaTertiary: "Portfolio",
    ctaQuad: "Directions",
    servicesLabel: "Packages",
    reviewsLabel: "Reviews",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    metaAvailable: "2026 Müsait",
    metaCity: "Berlin · DE",
    philosophy: "Manifesto",
    portfolio: "Portföy",
    portfolioMore: "Daha fazla",
    packages: "Paketler",
    contact: "İletişim",
    ctaPrimary: "Randevu al",
    ctaSecondary: "WhatsApp",
    ctaTertiary: "Portföy",
    ctaQuad: "Konum",
    servicesLabel: "Paketler",
    reviewsLabel: "Yorum",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
};

export function PhotographerPure({
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

  const nameParts = cardData.name.trim().split(/\s+/);
  const nameFirst = nameParts.slice(0, -1).join(" ") || cardData.name;
  const nameLast = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  return (
    <article
      data-template="photographer-pure"
      className="phpure-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: PAGE, color: INK }}
    >
      <style jsx global>{`
        .phpure-card {
          font-family: var(--tpl-font-body, 'Bricolage Grotesque', 'Inter', system-ui, sans-serif);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .phpure-card .serif-i {
          font-family: var(--tpl-font-display, 'EB Garamond', 'Cormorant Garamond', Georgia, serif);
          font-style: italic;
          font-weight: 400;
        }
        .phpure-card a { color: inherit; }
      `}</style>

      {/* MEGA TYPE HEADER */}
      <header className="px-7 pb-7 pt-12">
        <div
          className="mb-9 flex items-center justify-between text-[11px] font-medium uppercase"
          style={{ color: INK_SOFT, letterSpacing: "1.5px" }}
        >
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className="block h-1.5 w-1.5 rounded-full"
              style={{ background: ACCENT_2 }}
            />
            {t.metaAvailable}
          </span>
          <span>{t.metaCity}</span>
        </div>
        <h1
          className="text-[58px] leading-[0.92]"
          style={{ color: accent, letterSpacing: "-3px", fontWeight: 700 }}
        >
          {nameFirst}
          {nameLast && (
            <>
              <br />
              <em className="serif-i font-normal italic" style={{ color: INK_SOFT }}>
                {nameLast}
              </em>
            </>
          )}
        </h1>
        {(cardData.position || cardData.title) && (
          <div className="serif-i mt-2.5 text-[18px]" style={{ color: INK_SOFT }}>
            {[cardData.position, cardData.title].filter(Boolean).join(" — ")}
          </div>
        )}
      </header>

      {/* PROFILE STRIP */}
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
            className="object-cover"
            style={{
              width: 80,
              height: 80,
              filter: "grayscale(1) contrast(1.05)",
            }}
          />
        ) : (
          <div
            className="flex items-center justify-center text-[26px] font-semibold"
            style={{ width: 80, height: 80, background: SURFACE, color: accent }}
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
              {services.length > 0 && (
                <span>{services.length} {t.servicesLabel}</span>
              )}
              {services.length > 0 && testimonials.length > 0 && (
                <span style={{ color: INK_SOFT }}>·</span>
              )}
              {testimonials.length > 0 && (
                <span>{testimonials.length} {t.reviewsLabel}</span>
              )}
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
            {"“"}
            {cardData.bio}
            {"”"}
          </p>
          <div className="serif-i mt-3 text-[14px]" style={{ color: INK_SOFT }}>
            — {cardData.name}
          </div>
        </section>
      )}

      {/* PORTFOLIO 2×2 */}
      {photoUrl && (
        <section className="px-7 pb-9">
          <div className="mb-4 flex items-end justify-between">
            <PureLabel>{t.portfolio}</PureLabel>
            {cardData.brochureUrl && (
              <a
                href={cardData.brochureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-semibold uppercase"
                style={{ color: INK, letterSpacing: "1.5px", textDecoration: "underline", textUnderlineOffset: 3 }}
              >
                {t.portfolioMore}
              </a>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="relative overflow-hidden"
                style={{
                  aspectRatio: "4 / 5",
                  background: SURFACE,
                }}
              >
                <Image
                  src={photoUrl}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                  style={{ filter: "grayscale(1)" }}
                  sizes="220px"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PACKAGES LIST */}
      {services.length > 0 && (
        <section className="px-7 pb-9" style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: 32 }}>
          <PureLabel>{t.packages}</PureLabel>
          <div className="mt-4">
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

      {/* CONTACT TABLE */}
      <section
        className="px-7 pb-9 pt-7"
        style={{ borderTop: `1px solid ${HAIRLINE}` }}
      >
        <PureLabel>{t.contact}</PureLabel>
        <div className="mt-4">
          <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={accent} />
        </div>
      </section>

      {/* CTA GRID */}
      <div className="grid grid-cols-2 gap-2 px-7 pb-7">
        {phoneDigits && (
          <a
            href={`tel:${phoneDigits}`}
            className="flex items-center justify-center px-4 py-4 text-[13px] font-semibold"
            style={{
              background: accent,
              color: PAGE,
              border: `1px solid ${accent}`,
              letterSpacing: "0.3px",
            }}
          >
            {t.ctaPrimary}
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
              letterSpacing: "0.3px",
            }}
          >
            {t.ctaSecondary}
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
              letterSpacing: "0.3px",
            }}
          >
            {t.ctaTertiary}
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
              letterSpacing: "0.3px",
            }}
          >
            {t.ctaQuad}
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
          {cardData.name} © {new Date().getFullYear()}
        </span>
        <span>
          {t.poweredBy}{" "}
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

export const photographerPureEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 65,
  key: "photographer-pure",
  name: "Photographer — Pure",
  industry: "Photographer / Wedding & portrait",
  supports: {
    services: true,
    faqs: false,
    testimonials: false,
    gallery: true,
    video: false,
    brochure: true,
    socials: true,
    themeSwitch: false,
    photo: true,
    logo: true,
  },
  defaults: {
    brandPrimaryHex: "#ffffff",
    brandAccentHex: "#1a1a1a",
  },
  sampleSlug: "demo-photographer-pure",
};

export const photographerPureSample: SampleData = {
  templateId: 65,
  slug: "demo-photographer-pure",
  cardData: {
    name: "Lena Schwarz",
    position: "Fotografin / Videografin",
    title: "Berlin · Worldwide",
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
        title: "Hochzeitsfotografie",
        description: "ganzer tag · zwei fotografen",
        priceLabel: "ab €2.800",
      },
      {
        title: "Porträtshooting",
        description: "studio oder natürliches licht",
        priceLabel: "€350 / 2h",
      },
      {
        title: "Produktfotografie",
        description: "kampagnen · lookbooks · e-commerce",
        priceLabel: "ab €480",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#ffffff",
  brandAccentHex: "#1a1a1a",
};
