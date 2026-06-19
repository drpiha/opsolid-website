"use client";

// =============================================================================
// InteriorDesignNoir — v2 template (id=50, key="interior-design-noir").
//
// Sector: Interior designer — NOIR variant. Mood: black / marble, editorial
// luxury, magazine-style centered hero. Inspired by the noir layout in the
// reference HTML set.
//
// Locked design DNA (only colors respond to brand):
//   - Hero is a centered "magazine cover": tiny gold tracked eyebrow between
//     two short hairlines, oversized italic Cormorant name with a subtle
//     gold gradient over white text, a vertical 32 px gold rule, then a
//     centered serif tagline (max-width 320 px).
//   - Profile is a 2-column row: bordered avatar (1 px gold ring + 3 px
//     padding) + italic name + small gold uppercase role.
//   - Sections sit on the dark surface with 48 px padding and section
//     labels: 10 px / 4 px tracked / gold uppercase + flex-1 hairline.
//   - Featured project: full-bleed photo + gold rule + italic title +
//     brief description. No prices.
//   - Services: hairline-divided italic name list with right-aligned 01/02
//     gold counters.
//   - CTA: gold-on-transparent hairline button with letter-spacing.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { resolveLabels } from "./shared/resolveLabels";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#0d0d0d";
const LOCKED_ACCENT = "#c8a951";
const PAGE = "#080508";
const SURFACE = "#100b0a";
const SURFACE_2 = "#1a1410";
const TEXT = "#f5f0ed";
const TEXT_SOFT = "rgba(245,240,237,0.78)";
const TEXT_MUTED = "rgba(245,240,237,0.5)";
const HAIRLINE = "rgba(255,255,255,0.08)";
const HAIRLINE_GOLD = "rgba(200,169,100,0.22)";

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
  eyebrow: string;
  callBtn: string;
  whatsappBtn: string;
  emailBtn: string;
  featuredH: string;
  featuredCaption: string;
  servicesH: string;
  contactH: string;
  cta: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    eyebrow: "INTERIOR ATELIER · BERLIN",
    callBtn: "Anrufen",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-Mail",
    featuredH: "Ausgewählt",
    featuredCaption: "Mitte Penthouse · 2026",
    servicesH: "Atelier",
    contactH: "Kontakt",
    cta: "Erstgespräch anfragen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    eyebrow: "INTERIOR ATELIER · BERLIN",
    callBtn: "Call",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    featuredH: "Selected",
    featuredCaption: "Mitte Penthouse · 2026",
    servicesH: "Atelier",
    contactH: "Contact",
    cta: "Request a consultation",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    eyebrow: "INTERIOR ATELIER · BERLIN",
    callBtn: "Ara",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-posta",
    featuredH: "Seçilmiş",
    featuredCaption: "Mitte Penthouse · 2026",
    servicesH: "Atölye",
    contactH: "İletişim",
    cta: "Görüşme Talep Et",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
  es: {

    eyebrow: "INTERIOR ATELIER · BERLIN",
    callBtn: "Llamar",
    whatsappBtn: "WhatsApp",
    emailBtn: "Correo",
    featuredH: "Selección",
    featuredCaption: "Mitte Penthouse · 2026",
    servicesH: "Atelier",
    contactH: "Contacto",
    cta: "Solicitar una consulta",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    eyebrow: "INTERIOR ATELIER · BERLIN",
    callBtn: "Chiama",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    featuredH: "Selezionati",
    featuredCaption: "Mitte Penthouse · 2026",
    servicesH: "Atelier",
    contactH: "Contatto",
    cta: "Richiedi una consulenza",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    eyebrow: "INTERIOR ATELIER · BERLIN",
    callBtn: "Appeler",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-mail",
    featuredH: "Sélection",
    featuredCaption: "Mitte Penthouse · 2026",
    servicesH: "Atelier",
    contactH: "Contact",
    cta: "Demander une consultation",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    eyebrow: "INTERIOR ATELIER · BERLIN",
    callBtn: "اتصال",
    whatsappBtn: "واتساب",
    emailBtn: "البريد الإلكتروني",
    featuredH: "مختار",
    featuredCaption: "Mitte Penthouse · 2026",
    servicesH: "أتيليه",
    contactH: "اتصال",
    cta: "اطلب استشارة",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

export function InteriorDesignNoir({
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
  void (brandPrimaryHex || LOCKED_PRIMARY);
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];
  const featured = services[0];
  const otherSvcs = services.slice(1);
  const year = new Date().getFullYear();

  return (
    <article
      data-template="interior-design-noir"
      className="idn-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: SURFACE,
        color: TEXT,
        boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
      }}
    >
      <style jsx global>{`
        .idn-card {
          font-family: var(--tpl-font-body, 'Inter', system-ui, sans-serif);
          font-weight: 300;
          line-height: 1.7;
          background: ${PAGE};
        }
        .idn-card .serif {
          font-family: var(--tpl-font-display, 'Cormorant Garamond', Georgia, serif);
          font-style: italic;
          font-weight: 400;
        }
        .idn-card a { color: inherit; }
      `}</style>

      <div style={{ background: SURFACE }}>
        {/* HERO */}
        <header
          className="relative overflow-hidden px-8 py-20 text-center"
          style={{
            background: `radial-gradient(ellipse at top right, ${accent}24, transparent 55%),
                         radial-gradient(ellipse at bottom left, ${accent}14, transparent 55%)`,
          }}
        >
          <div
            aria-hidden
            className="absolute left-1/2 top-6 h-px w-16 -translate-x-1/2"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
          />
          <div
            aria-hidden
            className="absolute bottom-6 left-1/2 h-px w-16 -translate-x-1/2"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
          />

          <div
            className="text-[10px] font-medium uppercase"
            style={{ color: accent, letterSpacing: "5px" }}
          >
            {t.eyebrow}
          </div>
          <h1
            className="serif mx-auto mt-6 text-[44px] leading-[1.05] tracking-[-1px]"
            style={{
              backgroundImage: `linear-gradient(135deg, ${TEXT} 0%, ${accent} 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {cardData.name}
          </h1>
          <div
            aria-hidden
            className="mx-auto my-5 h-8 w-px"
            style={{ background: accent }}
          />
          {(cardData.bio || cardData.tagline) && (
          <p
            className="serif mx-auto max-w-[320px] text-[16px] leading-[1.5]"
            style={{ color: TEXT_SOFT }}
          >
            {cardData.bio || cardData.tagline}
          </p>
          )}
        </header>

        {/* PROFILE */}
        <section
          className="flex items-center gap-5 px-8 py-7"
          style={{
            background: SURFACE_2,
            borderTop: `1px solid ${HAIRLINE}`,
            borderBottom: `1px solid ${HAIRLINE}`,
          }}
        >
          <div
            className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full"
            style={{
              border: `1px solid ${accent}`,
              padding: 3,
              background: SURFACE,
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-full">
              {photoUrl ? (
                <Image src={photoUrl} alt="" fill sizes="64px" unoptimized className="object-cover tpl-photo" />
              ) : (
                <div
                  className="serif flex h-full w-full items-center justify-center text-[18px]"
                  style={{ color: accent, background: SURFACE_2 }}
                >
                  {cardData.name.slice(0, 1)}
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="serif text-[22px]" style={{ color: TEXT }}>
              {cardData.name}
            </div>
            {cardData.position && (
            <div
              className="mt-1 text-[11px] uppercase"
              style={{ color: accent, letterSpacing: "2.5px" }}
            >
              {cardData.position}
            </div>
            )}
          </div>
        </section>

        {/* QUICK ACTIONS — hairline strip */}
        <section
          className="grid grid-cols-3 text-center"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          {phoneDigits && (
            <NoirAction href={`tel:${phoneDigits}`} Icon={Phone} label={t.callBtn} accent={accent} right />
          )}
          {waDigits && (
            <NoirAction
              href={`https://wa.me/${waDigits}`}
              external
              Icon={MessageCircle}
              label={t.whatsappBtn}
              accent={accent}
              right={!!cardData.email}
            />
          )}
          {cardData.email && (
            <NoirAction href={`mailto:${cardData.email}`} Icon={Mail} label={t.emailBtn} accent={accent} />
          )}
        </section>

        {/* FEATURED PROJECT */}
        {featured && (
          <section className="px-8 py-12">
            <NoirSectionLabel accent={accent}>{t.featuredH}</NoirSectionLabel>
            <div className="mt-6 overflow-hidden">
              <div
                className="relative h-[260px]"
                style={{ background: SURFACE_2 }}
              >
                {photoUrl ? (
                  <Image src={photoUrl} alt="" fill sizes="460px" unoptimized className="object-cover tpl-photo" />
                ) : null}
              </div>
              <div
                aria-hidden
                className="my-5 h-px w-12"
                style={{ background: accent }}
              />
              <div
                className="serif text-[26px] leading-[1.15]"
                style={{ color: TEXT }}
              >
                {featured.title}
              </div>
              <div
                className="mt-2 text-[11px] uppercase"
                style={{ color: TEXT_MUTED, letterSpacing: "2.5px" }}
              >
                {t.featuredCaption}
              </div>
              {featured.description && (
                <p
                  className="mt-4 max-w-[420px] text-[14px] leading-[1.6]"
                  style={{ color: TEXT_SOFT }}
                >
                  {featured.description}
                </p>
              )}
            </div>
          </section>
        )}

        {/* SERVICES */}
        {otherSvcs.length > 0 && (
          <section
            className="px-8 py-12"
            style={{ borderTop: `1px solid ${HAIRLINE}` }}
          >
            <NoirSectionLabel accent={accent}>{t.servicesH}</NoirSectionLabel>
            <div className="mt-7">
              {otherSvcs.slice(0, 6).map((svc, i, arr) => (
                <ServiceLink
                  key={`${svc.title}-${i}`}
                  href={svc.href}
                  className="flex items-baseline justify-between py-4"
                  style={{
                    borderBottom: i < arr.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                  }}
                >
                  <span className="serif text-[18px]" style={{ color: TEXT }}>
                    {svc.title}
                  </span>
                  <span
                    className="text-[11px] font-medium tabular-nums"
                    style={{ color: accent, letterSpacing: "2px" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </ServiceLink>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="px-8 pb-12">
          <a
            href={
              cardData.bookingUrl ||
              (waDigits ? `https://wa.me/${waDigits}` : `mailto:${cardData.email ?? ""}`)
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-3 px-5 py-[18px] text-[12px] font-medium uppercase transition-all hover:opacity-90"
            style={{
              border: `1px solid ${accent}`,
              color: accent,
              letterSpacing: "3.5px",
              background: "transparent",
            }}
          >
            {t.cta}
            <ArrowUpRight size={14} strokeWidth={1.6} />
          </a>
        </section>

        {/* CONTACT */}
        <section className="px-8 pb-12">
          <NoirSectionLabel accent={accent}>{t.contactH}</NoirSectionLabel>
          <div className="mt-5">
            <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={accent} />
          </div>
        </section>

        {cardData.socials && (
          <section className="px-8 pb-12">
            <SocialRow socials={cardData.socials} variant="pill" accentHex={accent} />
          </section>
        )}

        {/* WALLET / SEND / EXCHANGE */}
        <section
          className="mx-8 mb-9 p-5"
          style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}
        >
          <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
          <ExchangeSlot slug={slug} primary={accent} locale={locale} />
        </section>

        {walletSlot && (
          <WalletDock
            label={t.walletLabel}
            className="mx-8 mb-9 p-5"
            labelClassName="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-center"
          >
            <div style={{ ["--card-primary" as string]: accent, background: SURFACE_2 }}>
              {walletSlot}
            </div>
          </WalletDock>
        )}

        {/* FOOTER */}
        <footer
          className="px-8 py-7 text-center"
          style={{ borderTop: `1px solid ${HAIRLINE}` }}
        >
          <div className="serif text-[16px]" style={{ color: accent }}>
            {cardData.company || cardData.name}
          </div>
          <div
            className="mt-2 text-[10px] uppercase"
            style={{ color: TEXT_MUTED, letterSpacing: "2px" }}
          >
            © {year} · {t.poweredBy}{" "}
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
      </div>
    </article>
  );
}

function NoirSectionLabel({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <div
      className="flex items-center gap-3 text-[10px] font-medium uppercase"
      style={{ color: accent, letterSpacing: "4px" }}
    >
      {children}
      <span
        aria-hidden
        className="block h-px flex-1"
        style={{ background: HAIRLINE_GOLD }}
      />
    </div>
  );
}

function NoirAction({
  href,
  Icon,
  label,
  external,
  accent,
  right,
}: {
  href: string;
  Icon: typeof Phone;
  label: string;
  external?: boolean;
  accent: string;
  right?: boolean;
}) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" as const } : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex items-center justify-center gap-2 px-4 py-5 text-[11px] font-medium uppercase transition-colors hover:bg-[--hover]"
      style={{
        color: TEXT_SOFT,
        borderRight: right ? `1px solid ${HAIRLINE}` : undefined,
        letterSpacing: "2.5px",
        ["--hover" as string]: `${accent}1a`,
      }}
    >
      <Icon size={14} strokeWidth={1.6} style={{ color: accent }} />
      {label}
    </a>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const interiorDesignNoirEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 50,
  key: "interior-design-noir",
  name: "Interior — Noir",
  industry: "Interior designer / studio",
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
  sampleSlug: "demo-interior-design-noir",
};

// photo: Unsplash, modern interior. Unsplash License — free, no attribution required.
export const interiorDesignNoirSample: SampleData = {
  templateId: 50,
  slug: "demo-interior-design-noir",
  cardData: {
    name: "Elif Yaman",
    position: "Interior Designerin",
    title: "Atelier",
    company: "Elif Yaman Atelier",
    email: "elif@elifdesign.de",
    phone: "+49 173 778 9012",
    whatsapp: "+49 173 778 9012",
    website: "elifdesign.de",
    address: "Mitte, Berlin",
    bio:
      "Räume, die langsam reifen. Materialien, die altern dürfen. Ein Atelier für ruhige, dauerhafte Wohnarchitektur.",
    bookingUrl: "https://cal.com/elifdesign/intro",
    sectorKey: "architecture",
    services: [
      { title: "Mitte Penthouse", description: "Vollprojekt · 240 m² · Marmor · Eichenholz · Bronze.", priceLabel: undefined },
      { title: "Residential" },
      { title: "Hospitality" },
      { title: "Office" },
      { title: "Bespoke Furniture" },
      { title: "Art Direction" },
    ],
    socials: {
      instagram: "https://instagram.com/elifdesign.interior",
      linkedin: "https://linkedin.com/in/elifyaman",
    },
  },
  photoUrl:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

