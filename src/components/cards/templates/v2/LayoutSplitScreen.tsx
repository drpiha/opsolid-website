"use client";

// =============================================================================
// LayoutSplitScreen — v2 universal template (id=96, key="layout-split-screen").
//
// Sector: ANY. Inspired by layouts/v15_split_screen.html — dark hero panel with
// circular portrait, diagonal divider, floating amber pill badge, numbered
// service list on the light bottom panel, accent bio block, primary/accent/
// WhatsApp action buttons, dark contact card, framed QR-style closing.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { resolveLabels } from "./shared/resolveLabels";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#1a1a2e";
const LOCKED_ACCENT = "#f59e0b";

const DARK_2 = "#232342";
const SURFACE = "#ffffff";
const PAGE = "#f8f9fc";
const TEXT_LIGHT = "#f0f0f0";
const TEXT_MUTED_LIGHT = "#a8a8c0";
const TEXT_DARK = "#111111";
const TEXT_MUTED = "#555555";
const HAIRLINE = "#e2e8f0";

function readableTextOn(hex: string | null | undefined): string {
  if (!hex) return "#1a1a2e";
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? "#1a1a2e" : "#ffffff";
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
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface Copy {
  heroEyebrow: string;
  servicesTitle: string;
  bioTitle: string;
  ctaCall: string;
  ctaEmail: string;
  ctaWhatsApp: string;
  contactTitle: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    heroEyebrow: "Strategie · Innovation · Wachstum",
    servicesTitle: "Leistungen",
    bioTitle: "Meine Vision",
    ctaCall: "Anrufen",
    ctaEmail: "E-Mail",
    ctaWhatsApp: "WhatsApp",
    contactTitle: "Kontakt-Daten",
    saveContact: "Kontakt speichern",
    walletLabel: "In Wallet speichern",
    poweredBy: "Powered by",
  },
  en: {
    heroEyebrow: "Strategy · Innovation · Growth",
    servicesTitle: "Services",
    bioTitle: "My Vision",
    ctaCall: "Call",
    ctaEmail: "Email",
    ctaWhatsApp: "WhatsApp",
    contactTitle: "Contact details",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    heroEyebrow: "Strateji · İnovasyon · Büyüme",
    servicesTitle: "Hizmetler",
    bioTitle: "Vizyonum",
    ctaCall: "Ara",
    ctaEmail: "E-posta",
    ctaWhatsApp: "WhatsApp",
    contactTitle: "İletişim Bilgileri",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana Ekle",
    poweredBy: "Powered by",
  },
  es: {

    heroEyebrow: "Strategy · Innovation · Growth",
    servicesTitle: "Servicios",
    bioTitle: "Mi visión",
    ctaCall: "Llamar",
    ctaEmail: "Correo",
    ctaWhatsApp: "WhatsApp",
    contactTitle: "Datos de contacto",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    heroEyebrow: "Strategy · Innovation · Growth",
    servicesTitle: "Servizi",
    bioTitle: "La mia visione",
    ctaCall: "Chiama",
    ctaEmail: "Email",
    ctaWhatsApp: "WhatsApp",
    contactTitle: "Dettagli di contatto",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    heroEyebrow: "Strategy · Innovation · Growth",
    servicesTitle: "Services",
    bioTitle: "Ma vision",
    ctaCall: "Appeler",
    ctaEmail: "E-mail",
    ctaWhatsApp: "WhatsApp",
    contactTitle: "Coordonnées",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    heroEyebrow: "Strategy · Innovation · Growth",
    servicesTitle: "الخدمات",
    bioTitle: "رؤيتي",
    ctaCall: "اتصال",
    ctaEmail: "البريد الإلكتروني",
    ctaWhatsApp: "واتساب",
    contactTitle: "تفاصيل الاتصال",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

export function LayoutSplitScreen({
  slug,
  cardData,
  locale = "de",
  photoPath,
  brandPrimaryHex,
  brandAccentHex,
  walletSlot,
}: TemplateProps) {
  const t = resolveLabels(COPY[locale] ?? COPY.de, cardData.labels);
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);
  const services = (cardData.services ?? []).slice(0, 4);
  const initials = getInitials(cardData.name);

  const callHref = cardData.phone ? `tel:${digitsOnly(cardData.phone)}` : undefined;
  const mailHref = cardData.email ? `mailto:${cardData.email}` : undefined;
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";
  const waHref = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(cardData.name)}`
    : undefined;

  return (
    <article
      data-template="layout-split-screen"
      className="layout-split-screen-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: TEXT_DARK }}
    >
      <style jsx global>{`
        .layout-split-screen-card {
          font-family: var(--tpl-font-body, 'Open Sans', system-ui, sans-serif);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        .layout-split-screen-card .display {
          font-family: var(--tpl-font-display, 'Montserrat', system-ui, sans-serif);
        }
        .layout-split-screen-card a { color: inherit; text-decoration: none; }
      `}</style>

      {/* DARK HERO */}
      <section
        className="relative px-7 pt-10 text-center"
        style={{
          background: primary,
          color: TEXT_LIGHT,
          paddingBottom: 100,
        }}
      >
        <div
          className="display uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "4px",
            color: accent,
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          {cardData.position || t.heroEyebrow}
        </div>
        {photoUrl ? (
          <div
            className="relative mx-auto mb-5 overflow-hidden"
            style={{
              width: 130,
              height: 130,
              borderRadius: "50%",
              border: `4px solid ${DARK_2}`,
              boxShadow: `0 0 0 2px ${accent}`,
            }}
          >
            <Image
              src={photoUrl}
              alt={cardData.name}
              fill
              unoptimized
              sizes="130px"
              className="object-cover tpl-photo"
            />
          </div>
        ) : (
          <div
            className="display mx-auto mb-5 flex items-center justify-center"
            style={{
              width: 130,
              height: 130,
              borderRadius: "50%",
              border: `4px solid ${DARK_2}`,
              boxShadow: `0 0 0 2px ${accent}`,
              background: DARK_2,
              color: accent,
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: "1px",
            }}
          >
            {initials}
          </div>
        )}
        <h1
          className="display"
          style={{
            fontSize: "clamp(26px, 8vw, 30px)",
            fontWeight: 800,
            marginBottom: 6,
            letterSpacing: "-0.5px",
            color: "#ffffff",
          }}
        >
          {cardData.name}
        </h1>
        <div
          style={{
            fontSize: 13,
            color: TEXT_MUTED_LIGHT,
            letterSpacing: "1px",
          }}
        >
          {[cardData.title, cardData.address?.split(",").slice(-1)[0].trim()]
            .filter(Boolean)
            .join(" · ")}
        </div>
      </section>

      {/* DIAGONAL DIVIDER */}
      <div
        className="relative"
        style={{
          background: primary,
          height: 70,
          marginTop: -1,
          overflow: "hidden",
        }}
      >
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background: SURFACE,
            clipPath: "polygon(0 100%, 100% 50%, 100% 100%)",
          }}
        />
      </div>

      {/* BOTTOM PANEL */}
      <section
        className="relative px-7 pb-9"
        style={{ background: SURFACE, paddingTop: 50 }}
      >
        {/* Floating badge */}
        {(cardData.position || cardData.title) && (
          <div
            className="display absolute uppercase"
            style={{
              top: -28,
              left: "50%",
              transform: "translateX(-50%)",
              background: accent,
              color: primary,
              padding: "12px 24px",
              borderRadius: 100,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "2px",
              boxShadow: `0 8px 24px ${accent}66`,
              whiteSpace: "nowrap",
              zIndex: 5,
            }}
          >
            {cardData.position || cardData.title}
          </div>
        )}

        {/* SERVICES — numbered */}
        {services.length > 0 && (
          <div className="mb-8">
            <h2
              className="display uppercase text-center"
              style={{
                fontSize: 11,
                letterSpacing: "3px",
                color: accent,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              — {t.servicesTitle} —
            </h2>
            {services.map((svc, i, arr) => (
              <ServiceLink
                key={`svc-${i}`}
                href={svc.href}
                className="flex items-center gap-4 py-3.5"
                style={{
                  borderBottom:
                    i < arr.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                }}
              >
                <div
                  className="display"
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: accent,
                    minWidth: 36,
                    lineHeight: 1,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <div
                    className="display"
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: TEXT_DARK,
                      marginBottom: 2,
                    }}
                  >
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div style={{ fontSize: 12, color: TEXT_MUTED }}>
                      {svc.description}
                    </div>
                  )}
                </div>
                {svc.priceLabel && (
                  <div
                    className="display"
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: primary,
                    }}
                  >
                    {svc.priceLabel}
                  </div>
                )}
              </ServiceLink>
            ))}
          </div>
        )}

        {/* BIO CARD */}
        {cardData.bio && (
          <div
            className="mb-7"
            style={{
              background: PAGE,
              borderRadius: 18,
              padding: 22,
              borderLeft: `4px solid ${accent}`,
            }}
          >
            <h3
              className="display"
              style={{
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 8,
                color: primary,
              }}
            >
              {t.bioTitle}
            </h3>
            <p
              style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.7 }}
            >
              {cardData.bio}
            </p>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 24 }}
        >
          {callHref && (
            <a
              href={callHref}
              className="display flex items-center justify-center"
              style={{
                background: primary,
                color: "#fff",
                padding: "14px 16px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              {t.ctaCall}
            </a>
          )}
          {mailHref && (
            <a
              href={mailHref}
              className="display flex items-center justify-center"
              style={{
                background: accent,
                color: primary,
                padding: "14px 16px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              {t.ctaEmail}
            </a>
          )}
          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="display flex items-center justify-center"
              style={{
                gridColumn: "span 2",
                background: "#25d366",
                color: "#fff",
                padding: "14px 16px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              {t.ctaWhatsApp}
            </a>
          )}
        </div>

        {/* DARK CONTACT CARD */}
        <div
          className="mb-6"
          style={{
            background: DARK_2,
            borderRadius: 18,
            padding: 22,
            color: TEXT_LIGHT,
          }}
        >
          <h3
            className="display uppercase"
            style={{
              fontSize: 11,
              letterSpacing: "2.5px",
              color: accent,
              marginBottom: 14,
              fontWeight: 700,
            }}
          >
            {t.contactTitle}
          </h3>
          <ContactRows
            cardData={cardData}
            locale={locale}
            tone="dark"
            accentHex={accent}
            renderRow={(row, i) => (
              <a
                href={row.href}
                {...(row.external
                  ? { target: "_blank", rel: "noopener noreferrer" as const }
                  : {})}
                className="flex items-center gap-3"
                style={{
                  padding: "10px 0",
                  borderBottom:
                    i < 99 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  color: TEXT_LIGHT,
                  fontSize: 13,
                }}
              >
                <span
                  className="uppercase"
                  style={{
                    fontSize: 10,
                    color: TEXT_MUTED_LIGHT,
                    letterSpacing: "1.5px",
                    minWidth: 70,
                  }}
                >
                  {row.label}
                </span>
                <span
                  className="flex-1"
                  style={{
                    fontWeight: 500,
                    wordBreak: "break-word",
                  }}
                >
                  {row.value}
                </span>
              </a>
            )}
          />
        </div>

        {/* SOCIAL ROW */}
        {cardData.socials && Object.values(cardData.socials).some(Boolean) && (
          <div className="mb-6">
            <SocialRow
              socials={cardData.socials}
              variant="pill"
              accentHex={accent}
            />
          </div>
        )}

        {/* WALLET / SEND / EXCHANGE */}
        <div
          style={{
            background: PAGE,
            borderRadius: 18,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
          <ExchangeSlot
            slug={slug}
            primary={accent}
            locale={locale}
            className="mt-3"
          />
        </div>

        {walletSlot && (
          <div
            style={{
              background: PAGE,
              borderRadius: 18,
              padding: 20,
            }}
          >
            <WalletDock
              label={t.walletLabel}
              className=""
              labelClassName="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em]"
              {...{}}
            >
              <div
                style={{
                  ["--card-primary" as string]: accent,
                } as React.CSSProperties}
              >
                {walletSlot}
              </div>
            </WalletDock>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer
        className="display px-7 pb-9 pt-5 text-center uppercase"
        style={{
          background: SURFACE,
          fontSize: 10,
          letterSpacing: "2px",
          color: TEXT_MUTED,
          borderTop: `1px solid ${HAIRLINE}`,
        }}
      >
        © {new Date().getFullYear()} {cardData.name}
        <div
          style={{ marginTop: 4, fontSize: 9, letterSpacing: "1.5px" }}
        >
          {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: accent }}
          >
            OpSolid
          </a>
        </div>
      </footer>
    </article>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const layoutSplitScreenEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 96,
  key: "layout-split-screen",
  name: "Split Screen",
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
  sampleSlug: "demo-layout-split-screen",
};

// photo: Unsplash, https://unsplash.com/photos/photo-1560250097-0dc05888fffb — Free, no attribution required.
export const layoutSplitScreenSample: SampleData = {
  templateId: 96,
  slug: "demo-layout-split-screen",
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
      { title: "Digital Transformation", description: "Begleitung bis zum Roll-out.", priceLabel: "€3.500/Tag" },
      { title: "Strategy Workshop", description: "Klausur · 2 Tage", priceLabel: "€1.800/Tag" },
      { title: "Executive Coaching", description: "1:1 Sparring", priceLabel: "€400/h" },
      { title: "Strategic Audit", description: "Diagnostik · 6 Wochen", priceLabel: "€18.000" },
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

