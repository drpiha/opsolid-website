"use client";

// =============================================================================
// RealEstatePure — v2 template (id=53, key="real-estate-pure").
//
// Sector: real estate / broker — PURE variant. Mood: Swiss minimal, white
// canvas, hairline rules, DM Sans + Lora italic, grid-stats. Inspired by
// kart_01_emlak_pure.html — re-implemented natively in React + Tailwind.
//
// Design DNA (different from default RealEstate.tsx):
//   - Header: tall portrait photo (92×110 px) on the left, big ultra-tight
//     name on the right with a small gold eyebrow and italic Lora subtitle.
//   - Meta row: 3 light hairlines (Year · Region · Lic.).
//   - About: italic serif paragraph.
//   - Slogan strip with hairlines top/bottom.
//   - Specialisation list: line + label rows with bottom-hairlines.
//   - Stats grid: 2×2 with hairline cell dividers.
//   - Testimonial section.
//   - Contact: hairline list with right-aligned values.
//   - Footer row: small QR placeholder + vCard CTA.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { ArrowUpRight, Shield } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#1a365d"; // deep ink-blue
const LOCKED_ACCENT = "#c8a951"; // muted gold accent

const SURFACE = "#ffffff";
const PAGE = "#f2f2f0";
const INK = "#111111";
const INK_MUTED = "#666666";
const HAIRLINE = "#e0e0e0";
const HAIRLINE_LIGHT = "#ececea";

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

interface RepCopy {
  about: string;
  specialisation: string;
  serviceRange: string;
  contact: string;
  contactReach: string;
  ref: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  impressum: string;
  privacy: string;
  share: string;
  yearsLabel: string;
  closedLabel: string;
  portfolioLabel: string;
  satisfactionLabel: string;
  metaActive: string;
  metaActiveValue: string;
  metaRegion: string;
  metaRegionValue: string;
  metaLic: string;
  metaLicValue: string;
}

const COPY: Record<"de" | "en" | "tr", RepCopy> = {
  de: {
    about: "Über mich",
    specialisation: "Spezialgebiete",
    serviceRange: "Leistungsspektrum",
    contact: "Kontakt",
    contactReach: "Erreichen Sie mich",
    ref: "Mandantenstimme",
    saveContact: "In Kontakte speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    impressum: "Impressum",
    privacy: "Datenschutz",
    share: "Teilen",
    yearsLabel: "Jahre Erfahrung",
    closedLabel: "Abschlüsse",
    portfolioLabel: "Portfolio Volumen",
    satisfactionLabel: "Zufriedenheit",
    metaActive: "Aktiv",
    metaActiveValue: "2014",
    metaRegion: "Region",
    metaRegionValue: "Berlin",
    metaLic: "Lizenziert",
    metaLicValue: "DE",
  },
  en: {
    about: "About",
    specialisation: "Specialisations",
    serviceRange: "Service range",
    contact: "Contact",
    contactReach: "Reach out",
    ref: "Client voice",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    impressum: "Imprint",
    privacy: "Privacy",
    share: "Share",
    yearsLabel: "Years",
    closedLabel: "Closed deals",
    portfolioLabel: "Portfolio volume",
    satisfactionLabel: "Satisfaction",
    metaActive: "Active",
    metaActiveValue: "2014",
    metaRegion: "Region",
    metaRegionValue: "Berlin",
    metaLic: "Licensed",
    metaLicValue: "DE",
  },
  tr: {
    about: "Hakkımda",
    specialisation: "Uzmanlık Alanları",
    serviceRange: "Hizmet Yelpazesi",
    contact: "İletişim",
    contactReach: "Bana Ulaşın",
    ref: "Müvekkil Yorumu",
    saveContact: "Rehbere kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    impressum: "Künye",
    privacy: "Gizlilik",
    share: "Paylaş",
    yearsLabel: "Yıl Deneyim",
    closedLabel: "Tamamlanan Satış",
    portfolioLabel: "Portföy Hacmi",
    satisfactionLabel: "Memnuniyet",
    metaActive: "Aktif",
    metaActiveValue: "2014",
    metaRegion: "Bölge",
    metaRegionValue: "Berlin",
    metaLic: "Lisanslı",
    metaLicValue: "DE",
  },
};

export function RealEstatePure({
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
  const onPrimary = readableTextOn(primary);

  const photoUrl = resolveAssetUrl(photoPath);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const nameParts = cardData.name.trim().split(/\s+/);
  const firstName = nameParts.slice(0, -1).join(" ") || cardData.name;
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  const services = cardData.services ?? [];
  const testimonials = cardData.testimonials ?? [];
  const reference = testimonials[0];

  const year = new Date().getFullYear();

  return (
    <article
      data-template="real-estate-pure"
      className="rep-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: SURFACE,
        color: INK,
        boxShadow: "0 20px 50px rgba(15,15,30,0.10)",
      }}
    >
      <style jsx global>{`
        .rep-card {
          font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
          line-height: 1.55;
        }
        .rep-card .serif-italic {
          font-family: 'Lora', 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
        }
        .rep-card a { color: inherit; }
      `}</style>

      {/* HEADER */}
      <header className="flex items-start gap-5 px-8 pb-7 pt-10">
        {photoUrl ? (
          <div
            className="relative h-[110px] w-[92px] flex-shrink-0 overflow-hidden"
            style={{ background: PAGE }}
          >
            <Image
              src={photoUrl}
              alt=""
              fill
              sizes="92px"
              unoptimized
              className="object-cover"
              style={{ filter: "grayscale(20%) contrast(1.05)" }}
            />
          </div>
        ) : (
          <div
            className="h-[110px] w-[92px] flex-shrink-0"
            style={{ background: PAGE }}
            aria-hidden
          />
        )}
        <div className="min-w-0 flex-1">
          <div
            className="mb-2.5 text-[10px] font-medium uppercase"
            style={{ color: accent, letterSpacing: "2.5px" }}
          >
            {cardData.company || "Walker & Stein"}
          </div>
          <h1
            className="text-[40px] font-medium leading-[0.95]"
            style={{ color: primary, letterSpacing: "-2px" }}
          >
            {firstName}
            {lastName && (
              <>
                <br />
                {lastName}
              </>
            )}
          </h1>
          <div
            className="serif-italic mt-3.5 text-[13px]"
            style={{ color: INK_MUTED, lineHeight: 1.5 }}
          >
            {[cardData.position, cardData.address?.split(",").slice(-1)[0]?.trim()].filter(Boolean).join(" — ")}
          </div>
        </div>
      </header>

      <div aria-hidden className="mx-8 h-px" style={{ background: HAIRLINE }} />

      {/* META ROW */}
      <div
        className="flex justify-between px-8 py-4 text-[11px] font-medium"
        style={{ color: INK_MUTED, letterSpacing: "0.5px" }}
      >
        <span>
          <strong style={{ color: INK, fontWeight: 600 }}>{t.metaActiveValue}</strong> {t.metaActive}
        </span>
        <span>
          <strong style={{ color: INK, fontWeight: 600 }}>{t.metaRegionValue}</strong> {t.metaRegion}
        </span>
        <span>
          <strong style={{ color: INK, fontWeight: 600 }}>{t.metaLicValue}</strong> {t.metaLic}
        </span>
      </div>

      <div aria-hidden className="mx-8 h-px" style={{ background: HAIRLINE }} />

      {/* ABOUT */}
      {cardData.bio && (
        <section className="px-8 py-8">
          <SectionLabel>{t.about}</SectionLabel>
          <p
            className="serif-italic text-[15px] leading-[1.7]"
            style={{ color: INK }}
          >
            {cardData.bio}
          </p>
        </section>
      )}

      {/* SLOGAN STRIP */}
      <div
        className="px-8 py-7 text-center"
        style={{ borderTop: `1px solid ${HAIRLINE}`, borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <p
          className="serif-italic text-[16px]"
          style={{ color: primary, lineHeight: 1.5 }}
        >
          &ldquo;{cardData.title || "Bringing every brief to its right address."}&rdquo;
        </p>
      </div>

      {/* SPECIALISATION LIST */}
      {services.length > 0 && (
        <section className="px-8 py-8">
          <SectionLabel>{t.specialisation}</SectionLabel>
          <SectionH primary={primary}>{t.serviceRange}</SectionH>
          <div className="flex flex-col">
            {services.slice(0, 6).map((svc, i, arr) => (
              <div
                key={`${svc.title}-${i}`}
                className="flex items-center gap-4 py-3.5"
                style={{
                  borderBottom: i < arr.length - 1 ? `1px solid ${HAIRLINE_LIGHT}` : "none",
                }}
              >
                <span
                  aria-hidden
                  className="block h-px w-7 flex-shrink-0"
                  style={{ background: accent }}
                />
                <span
                  className="flex-1 text-[14px] font-medium"
                  style={{ color: INK, letterSpacing: "-0.1px" }}
                >
                  {svc.title}
                </span>
                {svc.priceLabel && (
                  <span
                    className="text-[12px] font-medium"
                    style={{ color: INK_MUTED }}
                  >
                    {svc.priceLabel}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STATS GRID 2×2 */}
      <div
        className="grid grid-cols-2"
        style={{ borderTop: `1px solid ${HAIRLINE}` }}
      >
        <StatCell num="12" label={t.yearsLabel} primary={primary} divRight />
        <StatCell num="180+" label={t.closedLabel} primary={primary} />
        <StatCell num="€2.4B" label={t.portfolioLabel} primary={primary} divRight last />
        <StatCell num="98%" label={t.satisfactionLabel} primary={primary} last />
      </div>

      {/* TESTIMONIAL */}
      {reference && (
        <section className="px-8 py-8" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <SectionLabel>{t.ref}</SectionLabel>
          <p
            className="serif-italic text-[14px] leading-[1.7]"
            style={{ color: INK }}
          >
            &ldquo;{reference.quote}&rdquo;
          </p>
          <div
            className="mt-3.5 text-[11.5px] font-semibold"
            style={{ color: primary, letterSpacing: "0.4px" }}
          >
            {reference.author}
            {reference.role && <span style={{ color: INK_MUTED, fontWeight: 400 }}> — {reference.role}</span>}
          </div>
        </section>
      )}

      {/* CONTACT TABLE */}
      <section className="px-8 py-8" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
        <SectionLabel>{t.contact}</SectionLabel>
        <SectionH primary={primary}>{t.contactReach}</SectionH>
        <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={accent} />
      </section>

      {/* CTAs */}
      <section
        className="px-8 pb-2"
        style={{ borderTop: `1px solid ${HAIRLINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={primary} locale={locale} />
        <ExchangeSlot slug={slug} primary={primary} locale={locale} />
      </section>

      {/* FOOTER ROW — vCard CTA */}
      <div
        className="flex flex-col gap-4 px-8 py-8 sm:flex-row sm:items-center"
        style={{ borderTop: `1px solid ${HAIRLINE}` }}
      >
        <div className="min-w-0 flex-1">
          <div
            className="mb-1.5 text-[10px] font-semibold uppercase"
            style={{ color: INK_MUTED, letterSpacing: "2.5px" }}
          >
            {t.about}
          </div>
          <div
            className="text-[16px] font-medium"
            style={{ color: primary, letterSpacing: "-0.4px", lineHeight: 1.25 }}
          >
            {cardData.name}
          </div>
        </div>
        <a
          href={`/api/cards/${encodeURIComponent(slug)}/vcard`}
          download
          className="inline-flex items-center justify-center gap-2 px-5 py-3 text-[12px] font-semibold transition-all hover:opacity-90"
          style={{
            background: primary,
            color: onPrimary,
            border: `1px solid ${primary}`,
            letterSpacing: "0.3px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {t.saveContact}
          <ArrowUpRight size={12} strokeWidth={2.2} />
        </a>
      </div>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-8 py-6"
          labelClassName="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-center"
          style={{ borderTop: `1px solid ${HAIRLINE}`, color: INK_MUTED }}
        >
          <div style={{ ["--card-primary" as string]: primary }}>{walletSlot}</div>
        </WalletDock>
      )}

      {cardData.socials && Object.values(cardData.socials).some(Boolean) && (
        <section className="px-8 py-6" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <SocialRow socials={cardData.socials} variant="pill" accentHex={primary} />
        </section>
      )}

      {/* FOOTER */}
      <footer
        className="px-8 py-5 text-center"
        style={{ background: PAGE, borderTop: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="text-[12px] font-semibold"
          style={{ color: primary, letterSpacing: "0.3px" }}
        >
          {cardData.name}
          {cardData.company && ` — ${cardData.company}`}
        </div>
        <div
          className="mt-1 text-[10.5px]"
          style={{ color: INK_MUTED, letterSpacing: "0.5px" }}
        >
          © {year} · {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: primary }}
          >
            OpSolid
          </a>
        </div>
        <div className="mt-2 inline-flex items-center gap-3 text-[10px]" style={{ color: INK_MUTED }}>
          {cardData.impressumUrl && (
            <a href={cardData.impressumUrl} target="_blank" rel="noopener noreferrer">
              {t.impressum}
            </a>
          )}
          {cardData.privacyUrl && (
            <a href={cardData.privacyUrl} target="_blank" rel="noopener noreferrer">
              {t.privacy}
            </a>
          )}
          <span className="inline-flex items-center gap-1">
            <Shield size={10} strokeWidth={1.6} />
            opsolid.de/c/{slug}
          </span>
        </div>
      </footer>
    </article>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-4 text-[10px] font-semibold uppercase"
      style={{ color: INK_MUTED, letterSpacing: "3px" }}
    >
      {children}
    </div>
  );
}

function SectionH({
  children,
  primary,
}: {
  children: React.ReactNode;
  primary: string;
}) {
  return (
    <h2
      className="mb-4 text-[22px] font-medium"
      style={{ color: primary, letterSpacing: "-0.5px", lineHeight: 1.2 }}
    >
      {children}
    </h2>
  );
}

function StatCell({
  num,
  label,
  primary,
  divRight,
  last,
}: {
  num: string;
  label: string;
  primary: string;
  divRight?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className="px-6 py-6"
      style={{
        borderRight: divRight ? `1px solid ${HAIRLINE}` : undefined,
        borderBottom: last ? "none" : `1px solid ${HAIRLINE}`,
      }}
    >
      <div
        className="text-[28px] font-medium"
        style={{ color: primary, letterSpacing: "-1px", lineHeight: 1 }}
      >
        {num}
      </div>
      <div
        className="mt-1.5 text-[11px] font-medium"
        style={{ color: INK_MUTED, letterSpacing: "0.5px" }}
      >
        {label}
      </div>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const realEstatePureEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 53,
  key: "real-estate-pure",
  name: "Real Estate — Pure",
  industry: "Real estate agent / broker",
  supports: {
    services: true,
    faqs: false,
    testimonials: true,
    gallery: false,
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
  sampleSlug: "demo-real-estate-pure",
};

// photo: Unsplash, by Christina Wocintechchat — Unsplash License, no attribution required.
export const realEstatePureSample: SampleData = {
  templateId: 53,
  slug: "demo-real-estate-pure",
  cardData: {
    name: "Hannah Walker",
    position: "Senior Listing Agent",
    title: "Bringing every brief to its right address.",
    company: "Walker & Stein",
    email: "hannah@walker-stein.de",
    phone: "+49 30 1234 5678",
    whatsapp: "+49 170 1234 567",
    website: "walker-stein.de",
    address: "Kurfürstendamm 188, 10707 Berlin",
    bio: "A property's true value is measured in its owner's intention. Twelve years across Berlin's most prestigious districts — calm, accurate, long-horizon advice.",
    bookingUrl: "https://cal.com/walker-stein/intro",
    brochureUrl: "https://walker-stein.de/portfolio.pdf",
    impressumUrl: "https://walker-stein.de/impressum",
    privacyUrl: "https://walker-stein.de/datenschutz",
    sectorKey: "real-estate",
    socials: {
      linkedin: "https://linkedin.com/in/hannahwalker-de",
      instagram: "https://instagram.com/walker.stein.berlin",
    },
    services: [
      { title: "Charlottenburg Townhouse", priceLabel: "€2.85M" },
      { title: "Wannsee Waterfront Build", priceLabel: "FOR SALE" },
      { title: "Mitte Penthouse", priceLabel: "€1.65M" },
      { title: "Investment Advisory", priceLabel: "—" },
      { title: "Property Valuation", priceLabel: "—" },
    ],
    testimonials: [
      {
        author: "Sebastian & Marie L.",
        role: "Mitte penthouse",
        quote: "Hannah understood us before we did. Eight months of dead-end viewings became a single home that felt inevitable.",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
