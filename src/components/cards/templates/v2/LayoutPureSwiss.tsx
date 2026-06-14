"use client";

// =============================================================================
// LayoutPureSwiss — v2 universal template (id=93, key="layout-pure-swiss").
//
// Sector: ANY. Inspired by layouts/v12_pure_swiss.html — Swiss International
// Style. DM Sans, hairline dividers, oversized name with light surname,
// red 6-px hero rail, hairline meta grid, two-column experience table,
// hairline contact rows, calculator-style QR row.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { resolveLocation, resolveTagline } from "./shared/profileExtras";
import { resolveLabels } from "./shared/resolveLabels";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#000000";
const LOCKED_ACCENT = "#cc0000";

const PAGE = "#f2f2f2";
const SURFACE = "#ffffff";
const INK = "#000000";
const MUTED = "#666666";
const HAIRLINE = "#e8e8e8";

function readableTextOn(hex: string | null | undefined): string {
  if (!hex) return "#000000";
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? "#000000" : "#ffffff";
}

function resolveAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("data:") || path.startsWith("blob:")) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return `/${path}`;
}

interface Copy {
  metaRoleLabel: string;
  metaCompanyLabel: string;
  metaLocationLabel: string;
  expertiseTitle: string;
  experienceTitle: string;
  contactTitle: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  profileLabel: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    metaRoleLabel: "Rolle",
    metaCompanyLabel: "Firma",
    metaLocationLabel: "Standort",
    expertiseTitle: "Expertise",
    experienceTitle: "Erfahrung",
    contactTitle: "Kontakt",
    saveContact: "Kontakt speichern",
    walletLabel: "In Wallet speichern",
    poweredBy: "Powered by",
    profileLabel: "Profil",
  },
  en: {
    metaRoleLabel: "Role",
    metaCompanyLabel: "Company",
    metaLocationLabel: "Location",
    expertiseTitle: "Expertise",
    experienceTitle: "Experience",
    contactTitle: "Contact",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    profileLabel: "Profil",
  },
  tr: {
    metaRoleLabel: "Ünvan",
    metaCompanyLabel: "Şirket",
    metaLocationLabel: "Şehir",
    expertiseTitle: "Uzmanlık",
    experienceTitle: "Deneyim",
    contactTitle: "İletişim",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana Ekle",
    poweredBy: "Powered by",
    profileLabel: "Profil",
  },
  es: {

    metaRoleLabel: "Rol",
    metaCompanyLabel: "Empresa",
    metaLocationLabel: "Ubicación",
    expertiseTitle: "Experiencia",
    experienceTitle: "Experiencia",
    contactTitle: "Contacto",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
    profileLabel: "Profil",

  },
  it: {

    metaRoleLabel: "Ruolo",
    metaCompanyLabel: "Azienda",
    metaLocationLabel: "Posizione",
    expertiseTitle: "Competenze",
    experienceTitle: "Esperienza",
    contactTitle: "Contatto",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
    profileLabel: "Profil",

  },
  fr: {

    metaRoleLabel: "Rôle",
    metaCompanyLabel: "Société",
    metaLocationLabel: "Lieu",
    expertiseTitle: "Expertise",
    experienceTitle: "Expérience",
    contactTitle: "Contact",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
    profileLabel: "Profil",

  },
  ar: {

    metaRoleLabel: "الدور",
    metaCompanyLabel: "الشركة",
    metaLocationLabel: "الموقع",
    expertiseTitle: "الخبرة",
    experienceTitle: "الخبرة",
    contactTitle: "اتصال",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
    profileLabel: "Profil",

  },
};

export function LayoutPureSwiss({
  slug,
  cardData,
  locale = "de",
  photoPath,
  brandPrimaryHex,
  brandAccentHex,
  walletSlot,
}: TemplateProps) {
  const t = resolveLabels(COPY[locale] ?? COPY.de, cardData.labels);
  const accent = brandAccentHex || LOCKED_ACCENT;
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  void primary;
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);
  const services = (cardData.services ?? []).slice(0, 6);
  const nameParts = cardData.name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? cardData.name;
  const surname = nameParts.slice(1).join(" ");
  const tagline = resolveTagline(cardData);
  const locationLabel = resolveLocation(cardData);
  const heroMeta = [tagline, locationLabel].filter(Boolean).join(" · ");

  return (
    <article
      data-template="layout-pure-swiss"
      className="layout-pure-swiss-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: INK }}
    >
      <style jsx global>{`
        .layout-pure-swiss-card {
          font-family: var(--tpl-font-body, 'DM Sans', system-ui, sans-serif);
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
        }
        .layout-pure-swiss-card a { color: inherit; text-decoration: none; }
      `}</style>

      {/* HERO */}
      <header
        className="flex items-start justify-between gap-5 px-8 pb-9 pt-14"
        style={{ borderLeft: `6px solid ${accent}` }}
      >
        <div className="min-w-0 flex-1">
          <h1
            style={{
              fontSize: "clamp(46px, 14vw, 60px)",
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: "-3px",
              color: INK,
              marginBottom: 14,
              wordBreak: "break-word",
            }}
          >
            {firstName}
            {surname && (
              <span
                className="block"
                style={{ fontWeight: 300 }}
              >
                {surname}
              </span>
            )}
          </h1>
          {heroMeta && (
            <div
              className="uppercase"
              style={{
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "2px",
                color: accent,
              }}
            >
              {heroMeta}
            </div>
          )}
        </div>
        {photoUrl && (
          <div
            className="relative shrink-0 overflow-hidden"
            style={{
              width: 96,
              height: 96,
              filter: "grayscale(1) contrast(1.1)",
            }}
          >
            <Image
              src={photoUrl}
              alt={cardData.name}
              fill
              unoptimized
              sizes="96px"
              className="object-cover tpl-photo"
            />
          </div>
        )}
      </header>

      {/* SOFT HAIRLINE */}
      <span
        aria-hidden
        className="block"
        style={{ height: 1, background: HAIRLINE, margin: "0 32px" }}
      />

      {/* META GRID */}
      <section className="grid grid-cols-3 gap-4 px-8 py-6">
        <div className="flex flex-col gap-1.5">
          <span
            className="uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "1.5px",
              color: MUTED,
              fontWeight: 500,
            }}
          >
            {t.metaRoleLabel}
          </span>
          <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>
            {cardData.title || cardData.position || "—"}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span
            className="uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "1.5px",
              color: MUTED,
              fontWeight: 500,
            }}
          >
            {t.metaCompanyLabel}
          </span>
          <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>
            {cardData.company || "—"}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span
            className="uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "1.5px",
              color: MUTED,
              fontWeight: 500,
            }}
          >
            {t.metaLocationLabel}
          </span>
          <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>
            {locationLabel || "—"}
          </span>
        </div>
      </section>

      {/* HARD HAIRLINE */}
      <span
        aria-hidden
        className="block"
        style={{ height: 1, background: INK, margin: "0 32px" }}
      />

      {/* EXPERTISE */}
      {services.length > 0 && (
        <section className="px-8 pb-6 pt-10">
          <h2
            className="mb-5 flex items-center gap-3 uppercase"
            style={{
              fontSize: 12,
              letterSpacing: "2.5px",
              fontWeight: 600,
              color: INK,
            }}
          >
            {t.expertiseTitle}
            <span
              aria-hidden
              className="flex-1"
              style={{ height: 1, background: INK }}
            />
          </h2>
          <ul className="flex flex-col">
            {services.map((svc, i) => (
              <ServiceLink
                key={`${svc.title}-${i}`}
                href={svc.href}
                className="flex items-baseline gap-3.5 py-2"
                style={{ fontSize: 14, color: INK }}
              >
                <span
                  aria-hidden
                  style={{ color: accent, fontWeight: 500, flexShrink: 0 }}
                >
                  —
                </span>
                <span className="flex-1">
                  <span style={{ fontWeight: 500 }}>{svc.title}</span>
                  {svc.priceLabel && (
                    <span
                      className="ml-2"
                      style={{ color: MUTED, fontSize: 12 }}
                    >
                      · {svc.priceLabel}
                    </span>
                  )}
                  {svc.description && (
                    <span
                      className="block"
                      style={{
                        color: MUTED,
                        fontSize: 12,
                        marginTop: 2,
                        lineHeight: 1.5,
                      }}
                    >
                      {svc.description}
                    </span>
                  )}
                </span>
              </ServiceLink>
            ))}
          </ul>
        </section>
      )}

      {/* BIO as experience-like table */}
      {cardData.bio && (
        <section className="px-8 pb-6 pt-4">
          <h2
            className="mb-5 flex items-center gap-3 uppercase"
            style={{
              fontSize: 12,
              letterSpacing: "2.5px",
              fontWeight: 600,
              color: INK,
            }}
          >
            {t.experienceTitle}
            <span
              aria-hidden
              className="flex-1"
              style={{ height: 1, background: INK }}
            />
          </h2>
          <div
            className="grid grid-cols-[100px_1fr] gap-y-0"
            style={{ borderTop: `1px solid ${HAIRLINE}` }}
          >
            <div
              className="uppercase"
              style={{
                padding: "14px 0",
                fontSize: 11,
                letterSpacing: "1.5px",
                color: MUTED,
                fontWeight: 500,
                borderBottom: `1px solid ${HAIRLINE}`,
              }}
            >
              {t.profileLabel}
            </div>
            <div
              style={{
                padding: "14px 0",
                fontSize: 13,
                color: INK,
                fontWeight: 500,
                borderBottom: `1px solid ${HAIRLINE}`,
                lineHeight: 1.5,
              }}
            >
              {cardData.bio}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT TABLE */}
      <section className="px-8 pb-3 pt-4">
        <h2
          className="mb-5 flex items-center gap-3 uppercase"
          style={{
            fontSize: 12,
            letterSpacing: "2.5px",
            fontWeight: 600,
            color: INK,
          }}
        >
          {t.contactTitle}
          <span
            aria-hidden
            className="flex-1"
            style={{ height: 1, background: INK }}
          />
        </h2>
      </section>
      <section className="px-8">
        <div
          style={{
            borderTop: `1px solid ${INK}`,
            borderBottom: `1px solid ${INK}`,
          }}
        >
          <ContactRows
            cardData={cardData}
            locale={locale}
            tone="light"
            accentHex={accent}
            renderRow={(row, i) => (
              <a
                href={row.href}
                {...(row.external
                  ? { target: "_blank", rel: "noopener noreferrer" as const }
                  : {})}
                className="grid items-center"
                style={{
                  gridTemplateColumns: "100px 1fr",
                  padding: "14px 0",
                  borderBottom: i < 99 ? `1px solid ${HAIRLINE}` : "none",
                  fontSize: 13,
                  color: INK,
                }}
              >
                <span
                  className="uppercase"
                  style={{
                    fontSize: 11,
                    letterSpacing: "1.5px",
                    color: MUTED,
                    fontWeight: 500,
                  }}
                >
                  {row.label}
                </span>
                <span style={{ fontWeight: 500, wordBreak: "break-word" }}>
                  {row.value}
                </span>
              </a>
            )}
          />
        </div>
      </section>

      {/* SOCIALS */}
      {cardData.socials && Object.values(cardData.socials).some(Boolean) && (
        <section className="px-8 pb-2 pt-7">
          <SocialRow
            socials={cardData.socials}
            variant="icon"
            accentHex={accent}
          />
        </section>
      )}

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="mt-7 px-8 py-7"
        style={{
          background: PAGE,
          borderTop: `1px solid ${HAIRLINE}`,
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
        <ExchangeSlot slug={slug} primary={accent} locale={locale} className="mt-3" />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-8 py-6"
          labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.2em]"
        >
          <div
            style={{
              ["--card-primary" as string]: accent,
            } as React.CSSProperties}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer
        className="flex items-center justify-between px-8 pb-9 pt-6 uppercase"
        style={{
          fontSize: 10,
          letterSpacing: "1.5px",
          color: MUTED,
          borderTop: `1px solid ${HAIRLINE}`,
        }}
      >
        <span>{cardData.name}</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </article>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const layoutPureSwissEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 93,
  key: "layout-pure-swiss",
  name: "Pure Swiss",
  industry: "Universal — any sector",
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
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-layout-pure-swiss",
};

// photo: Unsplash, https://unsplash.com/photos/photo-1560250097-0dc05888fffb — Free, no attribution required.
export const layoutPureSwissSample: SampleData = {
  templateId: 93,
  slug: "demo-layout-pure-swiss",
  cardData: {
    name: "Alex Müller",
    title: "Strategy & Innovation Consultant",
    position: "Strategy & Innovation Consultant",
    company: "AM Advisory",
    email: "alex@amadvisory.de",
    phone: "+49 30 556 7890",
    whatsapp: "+49 30 556 7890",
    website: "amadvisory.de",
    address: "Friedrichstraße 76, 10117 Berlin",
    bio: "Unternehmensberater mit Fokus auf digitale Transformation und Strategieentwicklung. 15+ Jahre Erfahrung.",
    bookingUrl: "https://cal.com/amadvisory/intro",
    impressumUrl: "https://amadvisory.de/impressum",
    privacyUrl: "https://amadvisory.de/datenschutz",
    sectorKey: "consultant",
    socials: {
      linkedin: "https://linkedin.com/in/alexmueller-de",
      instagram: "https://instagram.com/alex.advisory",
    },
    services: [
      { title: "Digital Transformation", description: "End-to-end digitale Reise.", priceLabel: "€3.500/Tag" },
      { title: "Strategy Workshop", description: "Zwei-tägige Klausur.", priceLabel: "€1.800/Tag" },
      { title: "Executive Coaching", description: "1:1 Sparring für C-Level.", priceLabel: "€400/h" },
      { title: "Strategic Audit", description: "Diagnostik in 6 Wochen.", priceLabel: "ab €18.000" },
    ],
    testimonials: [
      {
        author: "CEO, TechCorp GmbH",
        role: "Klient",
        quote: "Alex hat unser Unternehmen in 6 Monaten komplett transformiert.",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1560250097-0dc05888fffb?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
