"use client";

// =============================================================================
// AutoDealerPure — v2 template (id=47, key="auto-dealer-pure").
//
// Sector: Premium pre-owned auto dealer — PURE variant. Mood: white minimal,
// clean dealership portfolio, gold accents. Inspired by
// kart_19_oto_galeri_pure.html.
//
// Locked design DNA (only colors respond to brand):
//   - Header: gold caplabel + hairline rule, two-row name block (avatar +
//     name 26 px + role 13 px). Credential sentence below.
//   - 3-up icon action grid divided by hairlines.
//   - Portfolio strip: horizontal scrollable cards (3 cars × 200 px).
//   - Stats: 3-up gold-soft cells.
//   - Services list: numbered hairline rows.
//   - Contact list + booking CTA.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ChevronRight,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  Wrench,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#374151"; // soft graphite
const LOCKED_ACCENT = "#6b7280"; // muted gray (chrome-soft)
const PAGE = "#f4f4f2";
const SURFACE = "#ffffff";
const SURFACE_2 = "#fbfaf6";
const ACCENT_SOFT = "#f5efde";
const INK = "#111111";
const INK_SOFT = "#6b6b6b";
const HAIRLINE = "#e5e5e3";
const HAIRLINE_2 = "#d4d4d2";

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
  brandMark: string;
  callBtn: string;
  whatsappBtn: string;
  emailBtn: string;
  portfolioH: string;
  servicesH: string;
  statsH: string;
  yearsLabel: string;
  carsLabel: string;
  warrantyLabel: string;
  contactH: string;
  cta: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  credential: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    brandMark: "Premium · Geprüft · Garantiert",
    callBtn: "Anrufen",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-Mail",
    portfolioH: "Aktuelle Fahrzeuge",
    servicesH: "Services",
    statsH: "Auf einen Blick",
    yearsLabel: "Jahre",
    carsLabel: "Fahrzeuge",
    warrantyLabel: "Garantie",
    contactH: "Kontakt",
    cta: "Termin vereinbaren",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    credential: "BMW · Mercedes · Audi · 12 Monate Garantie auf jedes Fahrzeug",
  },
  en: {
    brandMark: "Premium · Inspected · Warranted",
    callBtn: "Call",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    portfolioH: "Current inventory",
    servicesH: "Services",
    statsH: "At a glance",
    yearsLabel: "Years",
    carsLabel: "Cars sold",
    warrantyLabel: "Warranty",
    contactH: "Contact",
    cta: "Book a viewing",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    credential: "BMW · Mercedes · Audi · 12-month warranty on every car",
  },
  tr: {
    brandMark: "Premium · Kontrollü · Garantili",
    callBtn: "Ara",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-posta",
    portfolioH: "Güncel Araçlar",
    servicesH: "Hizmetler",
    statsH: "Özet",
    yearsLabel: "Yıl",
    carsLabel: "Araç",
    warrantyLabel: "Garanti",
    contactH: "İletişim",
    cta: "Test Sürüşü Al",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    credential: "BMW · Mercedes · Audi · her araca 12 ay garanti",
  },
  es: {

    brandMark: "Premium · Inspected · Warranted",
    callBtn: "Llamar",
    whatsappBtn: "WhatsApp",
    emailBtn: "Correo",
    portfolioH: "Inventario actual",
    servicesH: "Servicios",
    statsH: "De un vistazo",
    yearsLabel: "Años",
    carsLabel: "Coches vendidos",
    warrantyLabel: "Garantía",
    contactH: "Contacto",
    cta: "Reservar una visita",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
    credential: "BMW · Mercedes · Audi · 12-month warranty on every car",
  
  },
  it: {

    brandMark: "Premium · Inspected · Warranted",
    callBtn: "Chiama",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    portfolioH: "Inventario attuale",
    servicesH: "Servizi",
    statsH: "In sintesi",
    yearsLabel: "Anni",
    carsLabel: "Auto vendute",
    warrantyLabel: "Garanzia",
    contactH: "Contatto",
    cta: "Prenota una visita",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
    credential: "BMW · Mercedes · Audi · 12-month warranty on every car",
  
  },
  fr: {

    brandMark: "Premium · Inspected · Warranted",
    callBtn: "Appeler",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-mail",
    portfolioH: "Stock actuel",
    servicesH: "Services",
    statsH: "En un coup d'œil",
    yearsLabel: "Années",
    carsLabel: "Voitures vendues",
    warrantyLabel: "Garantie",
    contactH: "Contact",
    cta: "Réserver une visite",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
    credential: "BMW · Mercedes · Audi · 12-month warranty on every car",
  
  },
  ar: {

    brandMark: "Premium · Inspected · Warranted",
    callBtn: "اتصال",
    whatsappBtn: "واتساب",
    emailBtn: "البريد الإلكتروني",
    portfolioH: "المخزون الحالي",
    servicesH: "الخدمات",
    statsH: "نظرة سريعة",
    yearsLabel: "سنوات",
    carsLabel: "السيارات المباعة",
    warrantyLabel: "الضمان",
    contactH: "اتصال",
    cta: "احجز معاينة",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
    credential: "BMW · Mercedes · Audi · 12-month warranty on every car",
  
  },
};

export function AutoDealerPure({
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
  void readableTextOn(primary);

  const photoUrl = resolveAssetUrl(photoPath);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];
  const cars = services.filter((s) => s.priceLabel).slice(0, 3);
  const otherSvcs = services.filter((s) => !s.priceLabel);
  const year = new Date().getFullYear();

  return (
    <article
      data-template="auto-dealer-pure"
      className="adp-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: INK }}
    >
      <style jsx global>{`
        .adp-card {
          font-family: var(--tpl-font-body, 'DM Sans', 'Inter', system-ui, sans-serif);
          line-height: 1.6;
          background: ${PAGE};
        }
        .adp-card a { color: inherit; }
        .adp-portfolio::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ background: SURFACE }}>
        {/* HEADER */}
        <header
          className="px-8 pb-8 pt-14"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <div
            className="mb-7 flex items-center gap-2 text-[12px] font-medium uppercase"
            style={{ color: accent, letterSpacing: "1.5px" }}
          >
            <span
              aria-hidden
              className="block h-px w-6"
              style={{ background: INK }}
            />
            {t.brandMark}
          </div>
          <div className="flex items-start gap-4">
            <div
              className="relative h-[68px] w-[68px] flex-shrink-0 overflow-hidden rounded-full"
              style={{ background: PAGE }}
            >
              {photoUrl ? (
                <Image src={photoUrl} alt="" fill sizes="68px" unoptimized className="object-cover tpl-photo" />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-[22px] font-bold"
                  style={{ color: primary }}
                >
                  {cardData.name.slice(0, 1)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[26px] font-bold leading-[1.15] tracking-[-0.6px]">
                {cardData.name}
              </div>
              <div className="mt-1 text-[13px]" style={{ color: INK_SOFT }}>
                {cardData.position || "Premium Auto Dealer"}
              </div>
            </div>
          </div>
          <div className="mt-4 text-[13px]" style={{ color: INK }}>
            <strong style={{ color: accent, fontWeight: 700 }}>{cardData.company}</strong>
            {" · "}
            {t.credential}
          </div>
        </header>

        {/* ACTIONS */}
        <div
          className="grid grid-cols-3"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          {phoneDigits && (
            <ActionTile href={`tel:${phoneDigits}`} Icon={Phone} label={t.callBtn} hairlineRight />
          )}
          {waDigits && (
            <ActionTile
              href={`https://wa.me/${waDigits}`}
              external
              Icon={MessageCircle}
              label={t.whatsappBtn}
              hairlineRight={!!cardData.email}
            />
          )}
          {cardData.email && (
            <ActionTile href={`mailto:${cardData.email}`} Icon={Mail} label={t.emailBtn} />
          )}
        </div>

        {/* PORTFOLIO */}
        {cars.length > 0 && (
          <section className="px-8 py-11" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
            <SectionLabel>{t.portfolioH}</SectionLabel>
            <div className="adp-portfolio mt-5 flex gap-3 overflow-x-auto pb-1.5">
              {cars.map((car, i) => (
                <div
                  key={`${car.title}-${i}`}
                  className="flex-shrink-0 overflow-hidden rounded-xl transition-all hover:-translate-y-0.5"
                  style={{
                    width: 200,
                    background: SURFACE,
                    border: `1px solid ${HAIRLINE}`,
                  }}
                >
                  <div
                    className="h-[120px]"
                    style={{
                      background: `linear-gradient(135deg, ${accent}33 0%, ${ACCENT_SOFT} 100%)`,
                      position: "relative",
                    }}
                  >
                    {photoUrl && i === 0 ? (
                      <Image
                        src={photoUrl}
                        alt=""
                        fill
                        sizes="200px"
                        unoptimized
                        className="object-cover tpl-photo"
                      />
                    ) : null}
                  </div>
                  <div className="px-4 py-3">
                    <div className="text-[14px] font-semibold" style={{ color: INK }}>
                      {car.title}
                    </div>
                    {car.description && (
                      <div className="mt-0.5 text-[11px]" style={{ color: INK_SOFT }}>
                        {car.description}
                      </div>
                    )}
                    <div
                      className="mt-2 text-[14px] font-bold"
                      style={{ color: primary }}
                    >
                      {car.priceLabel}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SERVICES */}
        {otherSvcs.length > 0 && (
          <section className="px-8 py-11" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
            <SectionLabel>{t.servicesH}</SectionLabel>
            <div className="mt-5">
              {otherSvcs.slice(0, 6).map((svc, i, arr) => (
                <ServiceLink
                  key={`${svc.title}-${i}`}
                  href={svc.href}
                  className="flex items-center gap-4 py-4"
                  style={{
                    borderBottom: i < arr.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                  }}
                >
                  <span
                    className="text-[12px] font-semibold tabular-nums"
                    style={{ color: accent, minWidth: 28 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Wrench size={14} style={{ color: accent }} strokeWidth={1.6} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-medium" style={{ color: INK }}>
                      {svc.title}
                    </div>
                    {svc.description && (
                      <div className="mt-0.5 text-[12px]" style={{ color: INK_SOFT }}>
                        {svc.description}
                      </div>
                    )}
                  </div>
                  <ChevronRight size={14} style={{ color: INK_SOFT }} strokeWidth={1.6} />
                </ServiceLink>
              ))}
            </div>
          </section>
        )}

        {/* STATS */}
        <section className="px-8 py-11" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
          <SectionLabel>{t.statsH}</SectionLabel>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <StatCell num="15" label={t.yearsLabel} primary={primary} />
            <StatCell num="800+" label={t.carsLabel} primary={primary} />
            <StatCell num="12mo" label={t.warrantyLabel} primary={primary} />
          </div>
        </section>

        {/* CONTACT */}
        <section className="px-8 py-11" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
          <SectionLabel>{t.contactH}</SectionLabel>
          <div className="mt-5">
            <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={primary} />
          </div>
          <a
            href={
              cardData.bookingUrl ||
              (waDigits ? `https://wa.me/${waDigits}` : `mailto:${cardData.email ?? ""}`)
            }
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block w-full rounded-xl px-5 py-4 text-center text-[14px] font-semibold transition-all hover:-translate-y-0.5"
            style={{ background: INK, color: "#ffffff" }}
          >
            {t.cta}
          </a>
        </section>

        {cardData.socials && (
          <section className="px-8 py-7" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
            <SocialRow socials={cardData.socials} variant="pill" accentHex={primary} />
          </section>
        )}

        {/* WALLET / SEND / EXCHANGE */}
        <section
          className="mx-8 my-9 rounded-2xl p-5"
          style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE_2}` }}
        >
          <SendMyInfoSlot slug={slug} sourceQs="" primary={primary} locale={locale} />
          <ExchangeSlot slug={slug} primary={primary} locale={locale} />
        </section>

        {walletSlot && (
          <WalletDock
            label={t.walletLabel}
            className="mx-8 mb-9 rounded-2xl p-5"
            labelClassName="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-center"
          >
            <div style={{ ["--card-primary" as string]: primary, background: PAGE }}>
              {walletSlot}
            </div>
          </WalletDock>
        )}

        {/* FOOTER */}
        <footer
          className="px-8 py-7 text-center text-[11px]"
          style={{ color: INK_SOFT, letterSpacing: "1px" }}
        >
          © {year} {cardData.company || cardData.name} · {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold"
            style={{ color: primary }}
          >
            OpSolid
          </a>
        </footer>
      </div>
    </article>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[11px] font-medium uppercase"
      style={{ color: INK, letterSpacing: "2px" }}
    >
      {children}
    </div>
  );
}

function ActionTile({
  href,
  Icon,
  label,
  hairlineRight,
  external,
}: {
  href: string;
  Icon: typeof Phone | typeof Globe;
  label: string;
  hairlineRight?: boolean;
  external?: boolean;
}) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" as const } : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex flex-col items-center justify-center gap-1.5 px-3 py-5 text-center transition-colors hover:bg-[--hover]"
      style={{
        color: INK,
        borderRight: hairlineRight ? `1px solid ${HAIRLINE}` : undefined,
        ["--hover" as string]: ACCENT_SOFT,
      }}
    >
      <Icon size={18} strokeWidth={1.6} />
      <span
        className="text-[11px] font-medium uppercase"
        style={{ letterSpacing: "1.2px" }}
      >
        {label}
      </span>
    </a>
  );
}

function StatCell({
  num,
  label,
  primary,
}: {
  num: string;
  label: string;
  primary: string;
}) {
  return (
    <div
      className="rounded-xl py-5 text-center"
      style={{ background: ACCENT_SOFT }}
    >
      <div
        className="text-[26px] font-bold leading-none tracking-[-0.5px]"
        style={{ color: primary }}
      >
        {num}
      </div>
      <div
        className="mt-2 text-[11px] uppercase"
        style={{ color: INK_SOFT, letterSpacing: "1px" }}
      >
        {label}
      </div>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const autoDealerPureEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 47,
  key: "auto-dealer-pure",
  name: "Auto Dealer — Pure",
  industry: "Premium auto dealer / showroom",
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
  sampleSlug: "demo-auto-dealer-pure",
};

// photo: Unsplash, premium car. Unsplash License — free, no attribution required.
export const autoDealerPureSample: SampleData = {
  templateId: 47,
  slug: "demo-auto-dealer-pure",
  cardData: {
    name: "Tarık Arslan",
    position: "Otomotiv Danışmanı",
    title: "Founder",
    company: "Arslan Automobile",
    email: "tarik@arslanautomobile.de",
    phone: "+49 30 882 3456",
    whatsapp: "+49 170 882 3456",
    website: "arslanautomobile.de",
    address: "Charlottenburg, Berlin",
    bio: "Spezialist für Premium-Gebrauchtwagen — geprüft und mit Garantie.",
    bookingUrl: "https://cal.com/arslanautomobile/intro",
    sectorKey: "retail",
    services: [
      { title: "BMW 530i", description: "2021 · 48.000 km", priceLabel: "â‚¬38.900" },
      { title: "Mercedes E220d", description: "2020 · 62.000 km", priceLabel: "â‚¬42.500" },
      { title: "Audi A6 Avant", description: "2022 · 24.000 km", priceLabel: "â‚¬49.800" },
      { title: "Garantie", description: "12 Monate auf alle Fahrzeuge" },
      { title: "Inzahlungnahme", description: "Faire Bewertung in 24 h" },
      { title: "Finanzierung", description: "Ab 2,9 % effektiv" },
    ],
    socials: {
      instagram: "https://instagram.com/arslanautomobile",
      facebook: "https://facebook.com/arslanautomobile",
    },
  },
  photoUrl:
    "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

