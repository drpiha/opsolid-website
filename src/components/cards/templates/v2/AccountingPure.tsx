"use client";

// =============================================================================
// AccountingPure — v2 template (id=33, key="accounting-pure").
//
// Sector: tax advisor / CPA — PURE variant. Mood: editorial whitespace, near-
// zero surface decoration, hairline rules, blue-on-white. A clean dossier feel
// rather than corporate. Aimed at modern self-employed clients who want a
// tech-forward Steuerberater.
//
// Locked design DNA (only colors respond to brand):
//   - Generous whitespace header: meta line (DE / BERLIN · EST. YYYY), serif
//     light/bold split-name typography, position + title in muted text.
//   - Avatar strip: small 56 px circle + role label + status dot.
//   - Section heads: number + uppercase tracked title with trailing rule.
//   - Two-column key facts grid (Leistung / Honorar).
//   - Numbered services list, right-aligned price, no icons.
//   - Stats row in 4-up using hairline dividers.
//   - Testimonial: large pull-quote, no card.
//   - CTA pair: solid blue button → ghost outline.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { ArrowRight, Shield } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#1a2b4a";
const LOCKED_ACCENT = "#4a90d9";
const INK = "#0f172a";
const INK_SOFT = "#475569";
const INK_DIM = "#94a3b8";
const HAIRLINE = "#e5e7eb";
const HAIRLINE_SOFT = "#f1f5f9";

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

interface AcpCopy {
  contact: string;
  about: string;
  services: string;
  highlights: string;
  testimonial: string;
  bookConsult: string;
  callOffice: string;
  saveContact: string;
  walletLabel: string;
  share: string;
  poweredBy: string;
  yearsLabel: string;
  clientsLabel: string;
  ratingLabel: string;
  responseLabel: string;
  online: string;
  practitioner: string;
  practitionerValue: string;
}

const COPY: Record<"de" | "en" | "tr", AcpCopy> = {
  de: {
    contact: "Kontakt",
    about: "Profil",
    services: "Leistungen",
    highlights: "Highlights",
    testimonial: "Mandantenstimme",
    bookConsult: "Erstgespräch buchen",
    callOffice: "Kanzlei anrufen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    share: "Teilen",
    poweredBy: "Powered by",
    yearsLabel: "Jahre",
    clientsLabel: "Mandanten",
    ratingLabel: "Bewertung",
    responseLabel: "Antwort",
    online: "Online",
    practitioner: "Kanzlei",
    practitionerValue: "Geschäftsführer",
  },
  en: {
    contact: "Contact",
    about: "Profile",
    services: "Services",
    highlights: "Highlights",
    testimonial: "Client review",
    bookConsult: "Book consultation",
    callOffice: "Call the office",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    share: "Share",
    poweredBy: "Powered by",
    yearsLabel: "Years",
    clientsLabel: "Clients",
    ratingLabel: "Rating",
    responseLabel: "Response",
    online: "Online",
    practitioner: "Practice",
    practitionerValue: "Managing partner",
  },
  tr: {
    contact: "İletişim",
    about: "Profil",
    services: "Hizmetler",
    highlights: "Öne Çıkanlar",
    testimonial: "Müvekkil Yorumu",
    bookConsult: "Görüşme Talep Et",
    callOffice: "Ofisi Ara",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    share: "Paylaş",
    poweredBy: "Powered by",
    yearsLabel: "Yıl",
    clientsLabel: "Müvekkil",
    ratingLabel: "Puan",
    responseLabel: "Yanıt",
    online: "Online",
    practitioner: "Ofis",
    practitionerValue: "Yönetici Ortak",
  },
};

export function AccountingPure({
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

  const photoUrl = resolveAssetUrl(photoPath);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  // Split name into first / last (last word becomes the bold weight).
  const nameParts = cardData.name.trim().split(/\s+/);
  const firstName = nameParts.slice(0, -1).join(" ") || cardData.name;
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  const services = cardData.services ?? [];
  const testimonials = cardData.testimonials ?? [];

  const year = new Date().getFullYear();
  const cityFromAddress = cardData.address?.split(",").slice(-1)[0]?.trim() || "DE / BERLIN";

  return (
    <article
      data-template="accounting-pure"
      className="acp-card relative mx-auto w-full max-w-[460px]"
      style={{
        background: "#ffffff",
        color: INK,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <style jsx global>{`
        .acp-card { line-height: 1.6; }
        .acp-card .serif { font-family: 'IBM Plex Serif', 'Cormorant Garamond', Georgia, serif; }
        .acp-card a { color: inherit; }
      `}</style>

      {/* HEADER */}
      <header
        className="px-9 pb-8 pt-12"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="mb-7 flex items-center gap-3 text-[10.5px] font-medium uppercase"
          style={{ color: INK_DIM, letterSpacing: "1.6px" }}
        >
          <span>{cityFromAddress}</span>
          <span aria-hidden className="block h-px flex-1" style={{ background: HAIRLINE }} />
          <span>EST. {year - 12}</span>
        </div>
        <h1
          className="serif text-[36px] leading-[1.05] tracking-[-1.2px]"
          style={{ color: INK, fontWeight: 300 }}
        >
          {firstName}
          {lastName && (
            <>
              <br />
              <strong className="font-bold">{lastName}</strong>
            </>
          )}
        </h1>
        <div className="mt-3 text-[14px]" style={{ color: INK_SOFT }}>
          {cardData.position}
        </div>
        {cardData.company && (
          <div
            className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase"
            style={{ color: accent, letterSpacing: "1.5px" }}
          >
            <span aria-hidden className="block h-px w-3.5" style={{ background: accent }} />
            {cardData.company}
          </div>
        )}
      </header>

      {/* PROFILE STRIP */}
      <div
        className="flex items-center gap-4 px-9 py-6"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full"
          style={{ background: HAIRLINE_SOFT, border: `2px solid ${HAIRLINE_SOFT}` }}
        >
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt=""
              width={120}
              height={120}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-[14px] font-bold" style={{ color: accent }}>
              {cardData.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div
            className="text-[10px] font-semibold uppercase"
            style={{ color: INK_DIM, letterSpacing: "1.5px" }}
          >
            {t.practitioner}
          </div>
          <div className="mt-0.5 text-[14px] font-medium" style={{ color: INK }}>
            {t.practitionerValue}
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-semibold uppercase"
          style={{
            color: "#16a34a",
            background: "rgba(34,197,94,0.1)",
            letterSpacing: "1px",
          }}
        >
          <span className="block h-1.5 w-1.5 rounded-full" style={{ background: "#16a34a" }} />
          {t.online}
        </div>
      </div>

      {/* ABOUT */}
      {cardData.bio && (
        <PureSection num="01" title={t.about}>
          <p className="text-[15px] leading-[1.8]" style={{ color: INK_SOFT }}>
            {cardData.bio}
          </p>
        </PureSection>
      )}

      {/* HIGHLIGHTS GRID 2-up */}
      <div
        className="grid grid-cols-2 px-9"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="py-7 pr-7"
          style={{ borderRight: `1px solid ${HAIRLINE}` }}
        >
          <div
            className="text-[10px] font-semibold uppercase"
            style={{ color: INK_DIM, letterSpacing: "1.5px" }}
          >
            DATEV
          </div>
          <div className="mt-2 text-[14px] font-medium" style={{ color: INK }}>
            {locale === "tr" ? "Sertifikalı kullanım" : locale === "de" ? "Zertifizierte Nutzung" : "Certified usage"}
          </div>
        </div>
        <div className="py-7 pl-7">
          <div
            className="text-[10px] font-semibold uppercase"
            style={{ color: INK_DIM, letterSpacing: "1.5px" }}
          >
            {t.responseLabel}
          </div>
          <div className="mt-2 text-[14px] font-medium" style={{ color: INK }}>
            &lt; 24h
          </div>
        </div>
      </div>

      {/* SERVICES — numbered list */}
      {services.length > 0 && (
        <PureSection num="02" title={t.services}>
          <div>
            {services.map((s, i) => (
              <div
                key={`${s.title}-${i}`}
                className={`grid grid-cols-[36px_1fr_auto] items-baseline gap-4 py-3.5 ${i < services.length - 1 ? "border-b" : ""}`}
                style={{ borderColor: HAIRLINE_SOFT }}
              >
                <span
                  className="text-[11px] font-semibold tabular-nums"
                  style={{ color: accent, letterSpacing: "1px" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="text-[14px] font-medium" style={{ color: INK }}>
                    {s.title}
                  </div>
                  {s.description && (
                    <div className="mt-0.5 text-[12px]" style={{ color: INK_SOFT }}>
                      {s.description}
                    </div>
                  )}
                </div>
                {s.priceLabel && (
                  <span
                    className="text-[11px] font-semibold uppercase tabular-nums"
                    style={{ color: INK, letterSpacing: "1px" }}
                  >
                    {s.priceLabel}
                  </span>
                )}
              </div>
            ))}
          </div>
        </PureSection>
      )}

      {/* STATS 4-up */}
      <div
        className="grid grid-cols-4"
        style={{
          borderTop: `1px solid ${HAIRLINE}`,
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        <PureStat n="15" l={t.yearsLabel} />
        <PureStat n="200+" l={t.clientsLabel} />
        <PureStat n="98%" l={locale === "tr" ? "Memnun" : locale === "de" ? "Zufrieden" : "Happy"} />
        <PureStat n="4.9" l={t.ratingLabel} last />
      </div>

      {/* TESTIMONIAL */}
      {testimonials.length > 0 && (
        <div
          className="px-9 py-10"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <p
            className="serif text-[20px] leading-[1.55] tracking-[-0.3px]"
            style={{ color: INK }}
          >
            &ldquo;{testimonials[0].quote}&rdquo;
          </p>
          <div
            className="mt-5 flex items-center justify-between text-[11px] font-semibold uppercase"
            style={{ color: INK_DIM, letterSpacing: "1.3px" }}
          >
            <span>— {testimonials[0].author}</span>
            <span style={{ color: accent }}>★★★★★</span>
          </div>
        </div>
      )}

      {/* CONTACT */}
      <PureSection num="03" title={t.contact}>
        <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={accent} />
      </PureSection>

      {/* CTA */}
      <div
        className="space-y-2.5 px-9 py-9"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        {(cardData.bookingUrl || waDigits) && (
          <a
            href={cardData.bookingUrl || `https://wa.me/${waDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between px-5 py-[18px] text-[13px] font-semibold tracking-[0.4px] transition-colors hover:opacity-90"
            style={{ background: primary, color: readableTextOn(primary) }}
          >
            <span>{t.bookConsult}</span>
            <ArrowRight size={16} />
          </a>
        )}
        {phoneDigits && (
          <a
            href={`tel:${phoneDigits}`}
            className="flex w-full items-center justify-between px-5 py-[18px] text-[13px] font-semibold tracking-[0.4px] transition-colors hover:bg-[#f8fafc]"
            style={{ background: "transparent", color: INK, border: `1px solid ${HAIRLINE}` }}
          >
            <span>{t.callOffice}</span>
            <ArrowRight size={16} />
          </a>
        )}
      </div>

      {/* SOCIAL */}
      {cardData.socials && (
        <div
          className="px-9 py-7"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <SocialRow socials={cardData.socials} variant="pill" accentHex={accent} />
        </div>
      )}

      {/* WALLET / SEND / EXCHANGE */}
      {walletSlot && (
        <div
          className="px-9 py-6"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <WalletDock label={t.walletLabel}>
            <div style={{ ["--card-primary" as string]: accent }}>{walletSlot}</div>
          </WalletDock>
        </div>
      )}

      <div
        className="px-9 py-6"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
        <ExchangeSlot slug={slug} primary={accent} locale={locale} />
      </div>

      {/* FOOTER */}
      <footer
        className="flex items-center justify-between px-9 py-7 text-[10px] font-semibold uppercase"
        style={{ color: INK_DIM, letterSpacing: "1.5px" }}
      >
        <span>© {year}</span>
        <span>{cardData.company || cardData.name}</span>
      </footer>
      <div
        className="flex items-center justify-center gap-1.5 px-9 pb-7 text-[10px]"
        style={{ color: INK_DIM }}
      >
        <Shield size={11} strokeWidth={1.6} />
        {t.poweredBy}{" "}
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
    </article>
  );
}

function PureSection({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-9 py-9" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
      <div className="mb-6 flex items-baseline justify-between">
        <span
          className="text-[11px] font-medium tabular-nums"
          style={{ color: INK_DIM, letterSpacing: "1px" }}
        >
          {num}
        </span>
        <span
          className="text-[11px] font-semibold uppercase"
          style={{ color: INK, letterSpacing: "2px" }}
        >
          {title}
        </span>
      </div>
      {children}
    </section>
  );
}

function PureStat({
  n,
  l,
  last,
}: {
  n: string;
  l: string;
  last?: boolean;
}) {
  return (
    <div
      className="px-1.5 py-7 text-center"
      style={{ borderRight: last ? "none" : `1px solid ${HAIRLINE_SOFT}` }}
    >
      <div
        className="text-[24px] font-medium tabular-nums tracking-[-0.6px]"
        style={{ color: INK }}
      >
        {n}
      </div>
      <div
        className="mt-1.5 text-[9.5px] font-semibold uppercase"
        style={{ color: INK_DIM, letterSpacing: "1.4px" }}
      >
        {l}
      </div>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const accountingPureEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 33,
  key: "accounting-pure",
  name: "Accounting — Pure",
  industry: "Accounting / tax advisor (editorial pure variant)",
  supports: {
    services: true,
    faqs: false,
    testimonials: true,
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
  sampleSlug: "demo-accounting-pure",
};

export const accountingPureSample: SampleData = {
  templateId: 33,
  slug: "demo-accounting-pure",
  cardData: {
    name: "Mehmet Şahin",
    position: "Steuerberater",
    title: "GmbH & Steuerexperte",
    company: "Şahin Steuerberatung",
    email: "mehmet@sahin-steuer.de",
    phone: "+49 30 889 2345",
    whatsapp: "+49 170 889 2345",
    website: "sahin-steuer.de",
    address: "Potsdamer Platz 3, 10785 Berlin",
    bio: "Verlässlicher Partner für Steuern, GmbH-Gründung und digitale Buchhaltung. Erstgespräch kostenlos. 200+ zufriedene Mandanten in Berlin.",
    bookingUrl: "https://cal.com/sahin-steuer/intro",
    impressumUrl: "https://sahin-steuer.de/impressum",
    privacyUrl: "https://sahin-steuer.de/datenschutz",
    sectorKey: "consultant",
    services: [
      { title: "Steuererklärung", description: "Privat & Selbständige", priceLabel: "ab €350" },
      { title: "GmbH-Gründung", description: "Komplettpaket inkl. Notar", priceLabel: "€980" },
      { title: "Buchhaltung monatlich", description: "DATEV · digital", priceLabel: "ab €180" },
      { title: "Lohnbuchhaltung", description: "Monatliche Abrechnung", priceLabel: "ab €120" },
      { title: "Jahresabschluss", description: "Bilanz · GuV", priceLabel: "ab €1.200" },
    ],
    testimonials: [
      {
        author: "Caroline B.",
        role: "Geschäftsführerin · Berlin",
        quote:
          "Schnell, transparent und freundlich. Mehmet hat mir bei der GmbH-Gründung enorm geholfen.",
      },
    ],
    socials: {
      linkedin: "https://linkedin.com/in/mehmet-sahin-steuerberater",
    },
  },
  photoUrl:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
