"use client";

// =============================================================================
// LayoutVividBold — v2 universal template (id=94, key="layout-vivid-bold").
//
// Sector: ANY. Inspired by layouts/v13_vivid_bold.html — Poppins + bold gradient
// hero, floating profile card with copper-ringed avatar, chip row of services,
// 3-stat grid, 2x2 service tiles with coloured icon squares, gradient CTA,
// gradient testimonial bubble, stacked social row, gradient QR strip.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#7c3aed";
const LOCKED_ACCENT = "#f59e0b";

const ACCENT2 = "#0891b2";
const PAGE = "#f7f8fc";
const SURFACE = "#ffffff";
const TEXT = "#0f172a";
const MUTED = "#64748b";
const BORDER = "#e2e8f0";

function readableTextOn(hex: string | null | undefined): string {
  if (!hex) return "#0f172a";
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? "#0f172a" : "#ffffff";
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
  heroTag: string;
  heroLine1Pre: string;
  heroLine1Em: string;
  heroLine2: string;
  servicesTitlePre: string;
  servicesTitleEm: string;
  packagesTitlePre: string;
  packagesTitleEm: string;
  ctaLabel: string;
  qrTitle: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  statClients: string;
  statRoas: string;
  statReach: string;
  testimonialTitle: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    heroTag: "Strategie · Wachstum · Innovation",
    heroLine1Pre: "Wir gestalten",
    heroLine1Em: "mutige",
    heroLine2: "Geschäftsstrategien.",
    servicesTitlePre: "Was ich",
    servicesTitleEm: "anbiete",
    packagesTitlePre: "Service",
    packagesTitleEm: "Pakete",
    ctaLabel: "Kostenlose Strategie-Session",
    qrTitle: "Bleiben wir in Kontakt",
    saveContact: "Kontakt speichern",
    walletLabel: "In Wallet speichern",
    poweredBy: "Powered by",
    statClients: "Kunden",
    statRoas: "Ø ROI",
    statReach: "Jahre",
    testimonialTitle: "Stimmen",
  },
  en: {
    heroTag: "Strategy · Growth · Innovation",
    heroLine1Pre: "We craft",
    heroLine1Em: "bold",
    heroLine2: "business strategies.",
    servicesTitlePre: "What I",
    servicesTitleEm: "offer",
    packagesTitlePre: "Service",
    packagesTitleEm: "packages",
    ctaLabel: "Free Strategy Call",
    qrTitle: "Let's stay connected",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    statClients: "Clients",
    statRoas: "Avg ROI",
    statReach: "Years",
    testimonialTitle: "What clients say",
  },
  tr: {
    heroTag: "Strateji · Büyüme · İnovasyon",
    heroLine1Pre: "Cesur",
    heroLine1Em: "iş",
    heroLine2: "stratejileri tasarlıyoruz.",
    servicesTitlePre: "Benim",
    servicesTitleEm: "sunduklarım",
    packagesTitlePre: "Hizmet",
    packagesTitleEm: "paketleri",
    ctaLabel: "Ücretsiz Strateji Görüşmesi",
    qrTitle: "Bağlantıda kalalım",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana Ekle",
    poweredBy: "Powered by",
    statClients: "Müşteri",
    statRoas: "Ort. ROI",
    statReach: "Yıl",
    testimonialTitle: "Görüşler",
  },
  es: {

    heroTag: "Strategy · Growth · Innovation",
    heroLine1Pre: "Creamos",
    heroLine1Em: "audaz",
    heroLine2: "estrategias de negocio.",
    servicesTitlePre: "Lo que",
    servicesTitleEm: "oferta",
    packagesTitlePre: "Servicio",
    packagesTitleEm: "paquetes",
    ctaLabel: "Llamada estratégica gratuita",
    qrTitle: "Mantengámonos en contacto",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
    statClients: "Clientes",
    statRoas: "ROI medio",
    statReach: "Años",
    testimonialTitle: "Lo que dicen los clientes",
  
  },
  it: {

    heroTag: "Strategy · Growth · Innovation",
    heroLine1Pre: "Realizziamo",
    heroLine1Em: "audace",
    heroLine2: "strategie di business.",
    servicesTitlePre: "Cosa",
    servicesTitleEm: "offerta",
    packagesTitlePre: "Servizio",
    packagesTitleEm: "pacchetti",
    ctaLabel: "Chiamata strategica gratuita",
    qrTitle: "Restiamo in contatto",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
    statClients: "Clienti",
    statRoas: "ROI medio",
    statReach: "Anni",
    testimonialTitle: "Cosa dicono i clienti",
  
  },
  fr: {

    heroTag: "Strategy · Growth · Innovation",
    heroLine1Pre: "Nous créons",
    heroLine1Em: "audacieux",
    heroLine2: "stratégies d'affaires.",
    servicesTitlePre: "Ce que je",
    servicesTitleEm: "offre",
    packagesTitlePre: "Service",
    packagesTitleEm: "forfaits",
    ctaLabel: "Appel stratégique gratuit",
    qrTitle: "Restons en contact",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
    statClients: "Clients",
    statRoas: "ROI moyen",
    statReach: "Années",
    testimonialTitle: "Ce que disent les clients",
  
  },
  ar: {

    heroTag: "Strategy · Growth · Innovation",
    heroLine1Pre: "نصنع",
    heroLine1Em: "جريء",
    heroLine2: "استراتيجيات الأعمال.",
    servicesTitlePre: "ما",
    servicesTitleEm: "عرض",
    packagesTitlePre: "خدمة",
    packagesTitleEm: "حزم",
    ctaLabel: "مكالمة استراتيجية مجانية",
    qrTitle: "لنبقَ على تواصل",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
    statClients: "العملاء",
    statRoas: "متوسط العائد",
    statReach: "سنوات",
    testimonialTitle: "ماذا يقول العملاء",
  
  },
};

export function LayoutVividBold({
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
  const heroGrad = `linear-gradient(135deg, ${primary} 0%, #2563eb 50%, ${ACCENT2} 100%)`;
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);
  const services = (cardData.services ?? []).slice(0, 4);
  const testimonial = cardData.testimonials?.[0];
  const initials = getInitials(cardData.name);
  const tileColors = [primary, accent, ACCENT2, "#db2777"];
  const chipColors: { bg: string; fg: string }[] = [
    { bg: "#ede9fe", fg: primary },
    { bg: "#fef3c7", fg: "#b45309" },
    { bg: "#cffafe", fg: "#0e7490" },
    { bg: "#fce7f3", fg: "#be185d" },
    { bg: "#dcfce7", fg: "#15803d" },
    { bg: "#ffe4e6", fg: "#be123c" },
  ];

  const callHref = cardData.phone ? `tel:${digitsOnly(cardData.phone)}` : undefined;
  const bookHref = cardData.bookingUrl;
  const ctaHref = bookHref || callHref || (cardData.email ? `mailto:${cardData.email}` : "#");

  return (
    <article
      data-template="layout-vivid-bold"
      className="layout-vivid-bold-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: TEXT }}
    >
      <style jsx global>{`
        .layout-vivid-bold-card {
          font-family: var(--tpl-font-body, 'Poppins', system-ui, sans-serif);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        .layout-vivid-bold-card a { color: inherit; text-decoration: none; }
      `}</style>

      {/* HERO */}
      <section
        className="relative px-6 pb-20 pt-7"
        style={{ background: heroGrad, height: 220 }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at top right, ${accent}33, transparent 50%)`,
          }}
        />
        <div className="relative z-[1]">
          <div
            className="uppercase"
            style={{
              fontSize: 11,
              letterSpacing: "2px",
              color: "rgba(255,255,255,0.85)",
              fontWeight: 600,
            }}
          >
            {cardData.position || t.heroTag}
          </div>
          <h1
            className="mt-2"
            style={{
              fontSize: "clamp(26px, 8vw, 32px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-1px",
              color: "#fff",
            }}
          >
            {t.heroLine1Pre}{" "}
            <em style={{ fontStyle: "normal", color: "#fde68a" }}>
              {t.heroLine1Em}
            </em>
            <br />
            {t.heroLine2}
          </h1>
        </div>
      </section>

      {/* FLOATING PROFILE CARD */}
      <div className="-mt-[68px] px-6">
        <div
          className="relative z-[2] flex items-center gap-4 px-5 py-5"
          style={{
            background: SURFACE,
            borderRadius: 22,
            boxShadow: `0 16px 48px ${primary}30, 0 4px 12px rgba(0,0,0,0.06)`,
          }}
        >
          {photoUrl ? (
            <div
              className="relative shrink-0 overflow-hidden"
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: `3px solid ${SURFACE}`,
                boxShadow: `0 0 0 3px ${primary}`,
              }}
            >
              <Image
                src={photoUrl}
                alt={cardData.name}
                fill
                unoptimized
                sizes="64px"
                className="object-cover tpl-photo"
              />
            </div>
          ) : (
            <div
              className="flex shrink-0 items-center justify-center font-bold"
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: heroGrad,
                color: "#fff",
                fontSize: 22,
                letterSpacing: "1px",
                boxShadow: `0 0 0 3px ${primary}`,
              }}
            >
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: TEXT,
                marginBottom: 2,
                lineHeight: 1.2,
              }}
            >
              {cardData.name}
            </div>
            {cardData.title && (
              <div
                style={{
                  fontSize: 12.5,
                  color: primary,
                  fontWeight: 600,
                }}
              >
                {cardData.title}
              </div>
            )}
            {(cardData.company || cardData.address) && (
              <div
                style={{
                  fontSize: 11,
                  color: MUTED,
                  marginTop: 4,
                }}
              >
                {[cardData.company, cardData.address?.split(",").slice(-1)[0].trim()]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SERVICE CHIPS */}
      {services.length > 0 && (
        <section className="px-6 pt-8">
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: TEXT,
              marginBottom: 14,
            }}
          >
            {t.servicesTitlePre}{" "}
            <span style={{ color: primary }}>{t.servicesTitleEm}</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {services.map((svc, i) => {
              const c = chipColors[i % chipColors.length];
              return (
                <span
                  key={`${svc.title}-${i}`}
                  className="inline-flex items-center"
                  style={{
                    background: c.bg,
                    color: c.fg,
                    padding: "8px 14px",
                    borderRadius: 100,
                    fontSize: 12,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {svc.title}
                </span>
              );
            })}
          </div>
        </section>
      )}

      {/* STATS */}
      <section className="grid grid-cols-3 gap-3 px-6 pb-1.5 pt-6">
        {[
          { num: "120+", label: t.statClients, color: primary },
          { num: "8x", label: t.statRoas, color: accent },
          { num: "15+", label: t.statReach, color: ACCENT2 },
        ].map((s, i) => (
          <div
            key={i}
            className="text-center"
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: 16,
              padding: "18px 12px",
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                lineHeight: 1,
                marginBottom: 6,
                color: s.color,
              }}
            >
              {s.num}
            </div>
            <div style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* SERVICE TILES */}
      {services.length > 0 && (
        <section className="px-6 pt-8">
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: TEXT,
              marginBottom: 14,
            }}
          >
            {t.packagesTitlePre}{" "}
            <span style={{ color: primary }}>{t.packagesTitleEm}</span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {services.slice(0, 4).map((svc, i) => (
              <ServiceLink
                key={`tile-${i}`}
                href={svc.href}
                style={{
                  padding: "16px 14px",
                  borderRadius: 16,
                  background: "linear-gradient(135deg, #faf5ff 0%, #f3f4f6 100%)",
                  border: `1px solid ${BORDER}`,
                }}
              >
                <div
                  className="flex items-center justify-center font-bold"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: tileColors[i % tileColors.length],
                    color: "#fff",
                    fontSize: 14,
                    marginBottom: 10,
                  }}
                >
                  {svc.title.charAt(0).toUpperCase()}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: TEXT,
                    lineHeight: 1.3,
                    marginBottom: 4,
                  }}
                >
                  {svc.title}
                </div>
                {svc.priceLabel && (
                  <div
                    style={{
                      fontSize: 11,
                      color: tileColors[i % tileColors.length],
                      fontWeight: 600,
                      marginBottom: 2,
                    }}
                  >
                    {svc.priceLabel}
                  </div>
                )}
                {svc.description && (
                  <div style={{ fontSize: 11, color: MUTED }}>
                    {svc.description}
                  </div>
                )}
              </ServiceLink>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-6 pb-7 pt-6">
        <a
          href={ctaHref}
          {...(bookHref ? { target: "_blank", rel: "noopener noreferrer" as const } : {})}
          className="flex w-full items-center justify-center"
          style={{
            background: heroGrad,
            color: "#fff",
            padding: "18px 24px",
            borderRadius: 18,
            fontWeight: 700,
            fontSize: 15,
            boxShadow: `0 10px 26px ${primary}4d`,
          }}
        >
          {t.ctaLabel}
          <span aria-hidden style={{ marginLeft: 8 }}>â†’</span>
        </a>
      </section>

      {/* TESTIMONIAL */}
      {testimonial && (
        <section
          className="relative mx-6 mb-7 px-6 py-7"
          style={{
            background: "#ede9fe",
            borderRadius: 20,
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              top: -8,
              left: 16,
              fontFamily: "Georgia, serif",
              fontSize: 80,
              color: primary,
              opacity: 0.4,
              lineHeight: 1,
            }}
          >
            “
          </span>
          <p
            className="relative"
            style={{
              fontSize: 14,
              color: TEXT,
              fontWeight: 500,
              lineHeight: 1.55,
              marginBottom: 14,
            }}
          >
            {testimonial.quote}
          </p>
          <div className="flex items-center gap-2.5">
            <div
              className="flex shrink-0 items-center justify-center font-bold"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: primary,
                color: "#fff",
                fontSize: 11,
              }}
            >
              {testimonial.author
                .split(/\s+/)
                .map((p) => p[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div style={{ fontSize: 12 }}>
              <div style={{ fontWeight: 700, color: TEXT }}>
                {testimonial.author}
              </div>
              {testimonial.role && (
                <div style={{ color: MUTED }}>{testimonial.role}</div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SOCIAL ROW */}
      {cardData.socials && Object.values(cardData.socials).some(Boolean) && (
        <section className="px-6 pb-5">
          <SocialRow
            socials={cardData.socials}
            variant="pill"
            accentHex={primary}
          />
        </section>
      )}

      {/* CONTACT TILES */}
      <section className="px-6 pb-2">
        <ContactRows
          cardData={cardData}
          locale={locale}
          variant="tile"
          accentHex={primary}
          tone="light"
        />
      </section>

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="mt-7 px-6 py-7"
        style={{
          background: PAGE,
          borderTop: `1px solid ${BORDER}`,
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={primary} locale={locale} />
        <ExchangeSlot slug={slug} primary={primary} locale={locale} className="mt-3" />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-6 py-6"
          labelClassName="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em]"
        >
          <div
            style={{
              ["--card-primary" as string]: primary,
            } as React.CSSProperties}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* QR-LIKE GRADIENT FOOTER STRIP */}
      <footer
        className="px-6 py-7 text-center"
        style={{
          background: "linear-gradient(135deg, #faf5ff 0%, #fef3c7 100%)",
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <div
          className="uppercase"
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: primary,
            marginBottom: 6,
            letterSpacing: "1px",
          }}
        >
          {t.qrTitle}
        </div>
        <div style={{ fontSize: 11, color: MUTED }}>
          {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: primary, fontWeight: 600 }}
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

export const layoutVividBoldEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 94,
  key: "layout-vivid-bold",
  name: "Vivid Bold",
  industry: "Universal — any sector",
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
    logo: true,
  },
  defaults: {
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-layout-vivid-bold",
};

// photo: Unsplash, https://unsplash.com/photos/photo-1560250097-0dc05888fffb — Free, no attribution required.
export const layoutVividBoldSample: SampleData = {
  templateId: 94,
  slug: "demo-layout-vivid-bold",
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
      { title: "Digital Transformation", description: "Aylık yönetim", priceLabel: "â‚¬3.500/Tag" },
      { title: "Strategy Workshop", description: "Vorstand-Klausur", priceLabel: "â‚¬1.800/Tag" },
      { title: "Executive Coaching", description: "1:1 Sparring", priceLabel: "â‚¬400/h" },
      { title: "Strategic Audit", description: "6-Wochen-Audit", priceLabel: "ab â‚¬18.000" },
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

