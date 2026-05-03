"use client";

// =============================================================================
// PhotographerStone — v2 template (id=67, key="photographer-stone").
//
// Sector: Creator / Photographer — STONE variant. Mood: warm film-grain,
// analog film aesthetic, sepia-toned editorial. Inspired by
// kart_04_fotograf_stone.html.
//
// Design DNA:
//   - Warm cream gradient header — italic Lora "Established" line, oversized
//     name with italic last word in copper accent.
//   - Hairline+dot+hairline ornament + decorative wave divider.
//   - Oval blob portrait frame (sepia-toned).
//   - Story block with italic Lora paragraph + signature line.
//   - 3-up stat tiles (years / shoots / countries) on cream cards.
//   - Service cards on parchment surface with copper price chip.
//   - Large brown CTA + ghost row.
//   - Hours on linen card.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { ArrowUpRight, Calendar } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#6b5744";
const LOCKED_ACCENT = "#c4a882";
const PAGE = "#ede9e2";
const SURFACE = "#f9f6f0";
const SURFACE_2 = "#f3eee2";
const ACCENT_DEEP = "#3d2b1f";
const ACCENT_2 = "#c8956c";
const TEXT = "#1e1410";
const TEXT_SOFT = "#6b5c4e";
const BORDER = "#d6cdbd";
const BORDER_SOFT = "#e3d9c4";

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
  ctaPrimary: string;
  ctaSecondary: string;
  ctaTertiary: string;
  statYears: string;
  statShoots: string;
  statCountries: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr", Copy> = {
  de: {
    est: "Etabliert 2018",
    storyLabel: "Manifest",
    storyH: "Echte Momente, ehrlich erzählt",
    storySig: "— mit Liebe gemacht",
    servicesLabel: "Pakete",
    servicesH: "Investition",
    ctaPrimary: "Termin buchen",
    ctaSecondary: "Portfolio",
    ctaTertiary: "Anfahrt",
    statYears: "Jahre",
    statShoots: "Shootings",
    statCountries: "Länder",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    est: "Established 2018",
    storyLabel: "Manifesto",
    storyH: "Real moments, honestly told",
    storySig: "— made with love",
    servicesLabel: "Packages",
    servicesH: "Investment",
    ctaPrimary: "Book a session",
    ctaSecondary: "Portfolio",
    ctaTertiary: "Directions",
    statYears: "Years",
    statShoots: "Shoots",
    statCountries: "Countries",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    est: "Kuruluş 2018",
    storyLabel: "Manifesto",
    storyH: "Gerçek anlar, dürüst anlatılır",
    storySig: "— sevgiyle hazırlandı",
    servicesLabel: "Paketler",
    servicesH: "Yatırım",
    ctaPrimary: "Randevu al",
    ctaSecondary: "Portföy",
    ctaTertiary: "Konum",
    statYears: "Yıl",
    statShoots: "Çekim",
    statCountries: "Ülke",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
};

export function PhotographerStone({
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
  const services = (cardData.services ?? []).slice(0, 4);
  const tagline = cardData.title || cardData.position || "";
  const city = cardData.address?.split(",").slice(-2)[0]?.trim() || "Berlin";

  const nameParts = cardData.name.trim().split(/\s+/);
  const nameLead = nameParts.slice(0, -1).join(" ") || cardData.name;
  const nameTail = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  return (
    <article
      data-template="photographer-stone"
      className="phs-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: PAGE, color: TEXT }}
    >
      <style jsx global>{`
        .phs-card {
          font-family: var(--tpl-font-body, 'Nunito', 'Inter', system-ui, sans-serif);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        .phs-card .serif {
          font-family: var(--tpl-font-display, 'Lora', 'Cormorant Garamond', Georgia, serif);
        }
        .phs-card a { color: inherit; }
      `}</style>

      {/* HEADER */}
      <header
        className="relative px-7 pt-12 text-center"
        style={{
          background: `linear-gradient(180deg, #e3dccb 0%, ${PAGE} 100%)`,
        }}
      >
        <div
          className="serif mb-2.5 text-[13px] italic"
          style={{ color: ACCENT_2, letterSpacing: "1px" }}
        >
          {t.est}
        </div>
        <h1
          className="serif text-[36px] leading-[1.05]"
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
              boxShadow: "0 12px 40px -10px rgba(61,43,31,0.3)",
            }}
          >
            <Image
              src={photoUrl}
              alt={cardData.name}
              fill
              unoptimized
              className="object-cover tpl-photo"
              style={{ filter: "sepia(0.16) contrast(1.05) saturate(1.05)" }}
              sizes="200px"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 60%, rgba(61,43,31,0.15) 100%)",
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
      <div className="grid grid-cols-3 gap-2 px-6 pb-7">
        <StoneStat num="7" label={t.statYears} />
        <StoneStat num="280+" label={t.statShoots} />
        <StoneStat num="15" label={t.statCountries} />
      </div>

      {/* SERVICES */}
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
              <div
                key={`${svc.title}-${i}`}
                className="rounded-[14px] px-5 py-4"
                style={{
                  background: SURFACE,
                  border: `1px solid ${BORDER_SOFT}`,
                  boxShadow: "0 4px 16px rgba(61,43,31,0.06)",
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
              </div>
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
              boxShadow: "0 8px 24px -8px rgba(61,43,31,0.45)",
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
          {cardData.name}
        </div>
        <div
          className="mt-1 text-[10.5px] font-semibold"
          style={{ color: TEXT_SOFT, letterSpacing: "1px" }}
        >
          {city} · MMXVIII · {t.poweredBy}{" "}
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
        boxShadow: "0 4px 16px rgba(61,43,31,0.06)",
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

// =============================================================================
// Registry & sample
// =============================================================================

export const photographerStoneEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 67,
  key: "photographer-stone",
  name: "Photographer — Stone",
  industry: "Photographer / Film & analog",
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
    brandPrimaryHex: "#6b5744",
    brandAccentHex: "#c4a882",
  },
  sampleSlug: "demo-photographer-stone",
};

export const photographerStoneSample: SampleData = {
  templateId: 67,
  slug: "demo-photographer-stone",
  cardData: {
    name: "Lena Schwarz",
    position: "Fotografin / Videografin",
    title: "Film · Portrait · Berlin",
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
        description: "Ganzer Tag, zwei Fotografen, hand-edited Album.",
        priceLabel: "ab €2.800",
      },
      {
        title: "Porträtshooting",
        description: "Studio oder natürliches Licht, 2 Stunden.",
        priceLabel: "€350 / 2h",
      },
      {
        title: "Produktfotografie",
        description: "Kampagnen, Lookbooks, E-Commerce.",
        priceLabel: "ab €480",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#6b5744",
  brandAccentHex: "#c4a882",
};
