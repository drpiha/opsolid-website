"use client";

// =============================================================================
// AutoDealerVivid — v2 template (id=48, key="auto-dealer-vivid").
//
// Sector: Premium pre-owned auto dealer — VIVID variant. Mood: bold red /
// black, sporty and energetic. Inspired by kart_19_oto_galeri_vivid.html.
//
// Locked design DNA (only colors respond to brand):
//   - Hero: gradient (black→primary→deep) with radial glow + bottom hairline,
//     pill tag, oversized uppercase Rajdhani name, tagline, and a horizontal
//     hero-stats row (3 numbers).
//   - Profile strip floats over hero (-36 px) with avatar + white card chip.
//   - 3 quick action pills.
//   - Featured car card with subtle red border-tab.
//   - Brand pill grid: 6 chips on light surface.
//   - Services list with chevrons.
//   - CTA: red gradient button.
// =============================================================================

import * as React from "react";
import { linkify } from "@/lib/linkify";
import Image from "next/image";
import {
  ArrowUpRight,
  ChevronRight,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
  Wrench,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { resolveStats, resolveTagline } from "./shared/profileExtras";
import { resolveLabels } from "./shared/resolveLabels";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#dc2626"; // bold red
const LOCKED_ACCENT = "#1c1c1e"; // jet black
const PAGE = "#fbf6f5";
const SURFACE = "#ffffff";
const INK = "#111111";
const INK_SOFT = "#6b6b6b";
const HAIRLINE = "#e8e6e1";

function readableTextOn(hex: string | null | undefined): string {
  if (!hex) return "#1a1a1a";
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? "#1a1a1a" : "#ffffff";
}

function shade(hex: string, amount: number): string {
  const h = hex.replace("#", "");
  const r = Math.max(0, Math.min(255, parseInt(h.slice(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(h.slice(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(h.slice(4, 6), 16) + amount));
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
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
  tag: string;
  callBtn: string;
  whatsappBtn: string;
  emailBtn: string;
  featuredH: string;
  featuredBadge: string;
  brandsH: string;
  servicesH: string;
  cta: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  contact: string;
  priceLabel2: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    tag: "Premium Auto",
    callBtn: "Anrufen",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-Mail",
    featuredH: "Bestseller",
    featuredBadge: "Top-Pick",
    brandsH: "Marken",
    servicesH: "Services",
    cta: "Termin vereinbaren",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    contact: "Kontakt",
    priceLabel2: "Price",
  },
  en: {
    tag: "Premium Auto",
    callBtn: "Call",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    featuredH: "Featured",
    featuredBadge: "Top Pick",
    brandsH: "Brands",
    servicesH: "Services",
    cta: "Book a viewing",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    contact: "Contact",
    priceLabel2: "Price",
  },
  tr: {
    tag: "Premium Auto",
    callBtn: "Ara",
    whatsappBtn: "WhatsApp",
    emailBtn: "Mail",
    featuredH: "Öne Çıkan",
    featuredBadge: "Top Pick",
    brandsH: "Markalar",
    servicesH: "Hizmetler",
    cta: "Test Sürüşü Al",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    contact: "İletişim",
    priceLabel2: "Price",
  },
  es: {

    tag: "Auto premium",
    callBtn: "Llamar",
    whatsappBtn: "WhatsApp",
    emailBtn: "Correo",
    featuredH: "Destacado",
    featuredBadge: "Selección destacada",
    brandsH: "Marcas",
    servicesH: "Servicios",
    cta: "Reservar una visita",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
    contact: "Contacto",
    priceLabel2: "Price",

  },
  it: {

    tag: "Auto premium",
    callBtn: "Chiama",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    featuredH: "In evidenza",
    featuredBadge: "Top scelta",
    brandsH: "Brand",
    servicesH: "Servizi",
    cta: "Prenota una visita",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
    contact: "Contatto",
    priceLabel2: "Price",

  },
  fr: {

    tag: "Auto premium",
    callBtn: "Appeler",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-mail",
    featuredH: "À la une",
    featuredBadge: "Coup de cœur",
    brandsH: "Marques",
    servicesH: "Services",
    cta: "Réserver une visite",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
    contact: "Contact",
    priceLabel2: "Price",

  },
  ar: {

    tag: "سيارات فاخرة",
    callBtn: "اتصال",
    whatsappBtn: "واتساب",
    emailBtn: "البريد الإلكتروني",
    featuredH: "مميز",
    featuredBadge: "الأفضل اختياراً",
    brandsH: "علامات تجارية",
    servicesH: "الخدمات",
    cta: "احجز معاينة",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
    contact: "اتصال",
    priceLabel2: "Price",

  },
};

export function AutoDealerVivid({
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
  const onPrimary = readableTextOn(primary);
  const primaryDeep = shade(primary, -40);

  const photoUrl = resolveAssetUrl(photoPath);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];
  const featured = services.find((s) => s.priceLabel) ?? services[0];
  const otherSvcs = services.filter((s) => s !== featured && !s.priceLabel).slice(0, 4);
  const stats = resolveStats(cardData.stats);
  const tagline = resolveTagline(cardData);
  // Brand chips come from the owner's tags — no invented brand list.
  const brandTags = (cardData.tags ?? []).slice(0, 6);
  const year = new Date().getFullYear();

  return (
    <article
      data-template="auto-dealer-vivid"
      className="adv-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: SURFACE,
        color: INK,
        boxShadow: "0 20px 50px rgba(220,38,38,0.18)",
      }}
    >
      <style jsx global>{`
        .adv-card {
          font-family: var(--tpl-font-body, 'Poppins', 'Inter', system-ui, sans-serif);
          line-height: 1.6;
          background: ${PAGE};
        }
        .adv-card .display {
          font-family: var(--tpl-font-display, 'Rajdhani', 'Poppins', system-ui, sans-serif);
          font-weight: 700;
        }
        .adv-card a { color: inherit; }
      `}</style>

      <div style={{ background: SURFACE }}>
        {/* HERO BOLD */}
        <header
          className="relative overflow-hidden px-7 pb-16 pt-14"
          style={{
            background: `linear-gradient(135deg, ${accent} 0%, ${shade(accent, 10)} 50%, ${primary} 100%)`,
            color: "#fff",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full"
            style={{
              background: `radial-gradient(circle, ${primary}66, transparent 65%)`,
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-px w-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${primary}, transparent)`,
            }}
          />

          <div className="relative">
            <span
              className="display inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase"
              style={{
                background: "rgba(255,255,255,0.12)",
                borderColor: `${primary}66`,
                color: primary === LOCKED_PRIMARY ? "#fca5a5" : primary,
                letterSpacing: "3px",
              }}
            >
              <Sparkles size={12} strokeWidth={2.4} />
              {t.tag}
            </span>
            <h1
              className="display mt-5 text-[38px] font-bold uppercase leading-none"
              style={{ letterSpacing: "1.5px" }}
            >
              {cardData.name}
            </h1>
            {(tagline || cardData.company) && (
              <div
                className="mt-2 text-[13px]"
                style={{ color: "rgba(255,255,255,0.78)" }}
              >
                {tagline || cardData.company}
              </div>
            )}
            {stats && (
              <div className="mt-7 flex gap-6">
                {stats.map((s) => (
                  <HeroStat
                    key={s.label}
                    num={s.value}
                    label={s.label}
                    accent={primary === LOCKED_PRIMARY ? "#fca5a5" : primary}
                  />
                ))}
              </div>
            )}
          </div>
        </header>

        {/* PROFILE STRIP */}
        <section className="relative z-[2] -mt-9 flex items-center gap-4 px-7">
          <div
            className="relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-full"
            style={{
              border: "4px solid #fff",
              boxShadow: "0 8px 28px rgba(17,17,17,0.18)",
              background: PAGE,
            }}
          >
            {photoUrl ? (
              <Image src={photoUrl} alt="" fill sizes="72px" unoptimized className="object-cover tpl-photo" />
            ) : (
              <div
                className="display flex h-full w-full items-center justify-center text-[20px] font-bold"
                style={{ color: primary }}
              >
                {cardData.name.slice(0, 1)}
              </div>
            )}
          </div>
          <div
            className="min-w-0 flex-1 rounded-2xl px-4 py-3"
            style={{
              background: "#fff",
              boxShadow: "0 8px 28px rgba(17,17,17,0.12)",
            }}
          >
            <div
              className="display text-[13px] font-bold uppercase"
              style={{ color: INK, letterSpacing: "1.5px" }}
            >
              {cardData.name}
            </div>
            {cardData.position && (
              <div
                className="mt-1 text-[11px] uppercase"
                style={{ color: primary, letterSpacing: "1.5px" }}
              >
                {cardData.position}
              </div>
            )}
          </div>
        </section>

        {/* QUICK */}
        <section className="flex gap-2.5 px-7 pb-2 pt-6">
          {phoneDigits && (
            <Pill href={`tel:${phoneDigits}`} Icon={Phone} label={t.callBtn} bg={accent} fg="#fff" />
          )}
          {waDigits && (
            <Pill
              href={`https://wa.me/${waDigits}`}
              external
              Icon={MessageCircle}
              label={t.whatsappBtn}
              bg="#25d366"
              fg="#fff"
            />
          )}
          {cardData.email && (
            <Pill
              href={`mailto:${cardData.email}`}
              Icon={Mail}
              label={t.emailBtn}
              bg={primary}
              fg={onPrimary}
            />
          )}
        </section>

        {/* FEATURED CAR */}
        {featured && (
          <section className="px-7 pt-7">
            <SectionTitle primary={primary}>{t.featuredH}</SectionTitle>
            <div
              className="relative mt-4 overflow-hidden rounded-[18px]"
              style={{
                background: SURFACE,
                border: `1px solid ${HAIRLINE}`,
                boxShadow: "0 8px 28px rgba(17,17,17,0.06)",
              }}
            >
              <div
                aria-hidden
                className="absolute left-0 top-0 h-full w-1"
                style={{ background: primary }}
              />
              <div className="px-6 py-6">
                <span
                  className="display inline-block px-3 py-1 text-[10px] font-bold uppercase"
                  style={{
                    background: primary,
                    color: onPrimary,
                    letterSpacing: "2px",
                  }}
                >
                  {t.featuredBadge}
                </span>
                <div
                  className="display mt-3 text-[20px] font-bold uppercase"
                  style={{ color: INK, letterSpacing: "1px" }}
                >
                  {featured.title}
                </div>
                {featured.description && (
                  <div className="mt-1 text-[12px]" style={{ color: INK_SOFT }}>
                    {featured.description}
                  </div>
                )}
                {featured.priceLabel && (
                  <div
                    className="mt-5 flex items-baseline justify-between pt-4"
                    style={{ borderTop: `1px solid ${HAIRLINE}` }}
                  >
                    <span
                      className="text-[10px] uppercase"
                      style={{ color: INK_SOFT, letterSpacing: "2px" }}
                    >
                      {t.priceLabel2}
                    </span>
                    <span
                      className="display text-[26px] font-bold"
                      style={{ color: primary }}
                    >
                      {featured.priceLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* BRAND CHIPS — owner tags only; hidden when the owner set none. */}
        {brandTags.length > 0 && (
          <section className="px-7 pt-7">
            <SectionTitle primary={primary}>{t.brandsH}</SectionTitle>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {brandTags.map((b) => (
                <span
                  key={b}
                  className="display rounded-full px-3 py-2 text-center text-[12px] font-bold uppercase"
                  style={{
                    background: SURFACE,
                    border: `1px solid ${HAIRLINE}`,
                    color: INK,
                    letterSpacing: "1.5px",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* SERVICES */}
        {otherSvcs.length > 0 && (
          <section className="px-7 pt-7">
            <SectionTitle primary={primary}>{t.servicesH}</SectionTitle>
            <div
              className="mt-4 overflow-hidden rounded-2xl"
              style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
            >
              {otherSvcs.map((svc, i, arr) => (
                <ServiceLink
                  key={`${svc.title}-${i}`}
                  href={svc.href}
                  className="flex items-center gap-3 px-5 py-4"
                  style={{
                    borderBottom: i < arr.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                  }}
                >
                  <span
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: `${primary}1a`,
                      color: primary,
                    }}
                  >
                    <Wrench size={16} strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-semibold" style={{ color: INK }}>
                      {svc.title}
                    </div>
                    {svc.description && (
                      <div className="mt-0.5 text-[12px]" style={{ color: INK_SOFT }}>
                        {linkify(svc.description)}
                      </div>
                    )}
                  </div>
                  <ChevronRight size={14} style={{ color: INK_SOFT }} strokeWidth={1.8} />
                </ServiceLink>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="px-7 pt-7">
          <a
            href={
              cardData.bookingUrl ||
              (waDigits ? `https://wa.me/${waDigits}` : `mailto:${cardData.email ?? ""}`)
            }
            target="_blank"
            rel="noopener noreferrer"
            className="display flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-[18px] text-[14px] font-bold uppercase transition-all hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${primaryDeep} 0%, ${primary} 100%)`,
              color: onPrimary,
              boxShadow: `0 18px 36px ${primary}66`,
              letterSpacing: "3px",
            }}
          >
            {t.cta}
            <ArrowUpRight size={16} strokeWidth={2.4} />
          </a>
        </section>

        {/* CONTACT */}
        <section className="px-7 pt-7">
          <SectionTitle primary={primary}>{t.contact}</SectionTitle>
          <div className="mt-3">
            <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={primary} />
          </div>
        </section>

        {cardData.socials && (
          <section className="px-7 pt-7">
            <SocialRow socials={cardData.socials} variant="pill" accentHex={primary} />
          </section>
        )}

        {/* WALLET / SEND / EXCHANGE */}
        <section
          className="mx-7 mt-7 rounded-3xl p-5"
          style={{ background: PAGE, border: `1px solid ${HAIRLINE}` }}
        >
          <SendMyInfoSlot slug={slug} sourceQs="" primary={primary} locale={locale} />
          <ExchangeSlot slug={slug} primary={primary} locale={locale} />
        </section>

        {walletSlot && (
          <WalletDock
            label={t.walletLabel}
            className="mx-7 mt-4 rounded-3xl p-5"
            labelClassName="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-center"
          >
            <div style={{ ["--card-primary" as string]: primary, background: PAGE }}>
              {walletSlot}
            </div>
          </WalletDock>
        )}

        {/* FOOTER */}
        <footer
          className="mt-7 px-7 py-7 text-center"
          style={{ background: accent, color: "rgba(255,255,255,0.7)" }}
        >
          <div
            className="display text-[13px] font-bold uppercase"
            style={{ color: primary === LOCKED_PRIMARY ? "#fca5a5" : primary, letterSpacing: "4px" }}
          >
            {(cardData.company || cardData.name).toUpperCase()}
          </div>
          <div
            className="mt-1.5 text-[10.5px]"
            style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "1px" }}
          >
            © {year} · {t.poweredBy}{" "}
            <a
              href="https://opsolid.de/products/digital-card"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold"
              style={{ color: primary === LOCKED_PRIMARY ? "#fca5a5" : primary }}
            >
              OpSolid
            </a>
          </div>
        </footer>
      </div>
    </article>
  );
}

function SectionTitle({
  children,
  primary,
}: {
  children: React.ReactNode;
  primary: string;
}) {
  return (
    <h2
      className="display flex items-center gap-2.5 text-[16px] font-bold uppercase"
      style={{ color: INK, letterSpacing: "1.5px" }}
    >
      <span
        aria-hidden
        className="block h-[22px] w-1 rounded-[2px]"
        style={{ background: primary }}
      />
      {children}
    </h2>
  );
}

function HeroStat({
  num,
  label,
  accent,
}: {
  num: string;
  label: string;
  accent: string;
}) {
  return (
    <div>
      <div
        className="display text-[26px] font-bold leading-none tracking-[-0.5px]"
        style={{ color: accent }}
      >
        {num}
      </div>
      <div
        className="mt-0.5 text-[10px] uppercase"
        style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "1.5px" }}
      >
        {label}
      </div>
    </div>
  );
}

function Pill({
  href,
  Icon,
  label,
  bg,
  fg,
  external,
}: {
  href: string;
  Icon: typeof Phone;
  label: string;
  bg: string;
  fg: string;
  external?: boolean;
}) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" as const } : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl px-2 py-3 text-[13px] font-semibold transition-all hover:-translate-y-0.5"
      style={{ background: bg, color: fg }}
    >
      <Icon size={15} strokeWidth={2.2} />
      {label}
    </a>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const autoDealerVividEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 48,
  key: "auto-dealer-vivid",
  name: "Auto Dealer — Vivid",
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
  sampleSlug: "demo-auto-dealer-vivid",
  nameRules: { transform: "uppercase" },
};

// photo: Unsplash, premium car. Unsplash License — free, no attribution required.
export const autoDealerVividSample: SampleData = {
  templateId: 48,
  slug: "demo-auto-dealer-vivid",
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
    bio: "Premium Auto Dealership — geprüft, garantiert, ehrlich verhandelt.",
    bookingUrl: "https://cal.com/arslanautomobile/intro",
    sectorKey: "retail",
    services: [
      { title: "BMW M5 Competition", description: "2022 · 18.000 km · Carbon Black", priceLabel: "€89.500" },
      { title: "Mercedes E220d", description: "2020 · 62.000 km · Silber", priceLabel: "€42.500" },
      { title: "Audi A6 Avant", description: "2022 · 24.000 km · Grau", priceLabel: "€49.800" },
      { title: "Garantie 12 Monate", description: "Auf alle Premium-Modelle" },
      { title: "Inzahlungnahme", description: "Faire Bewertung in 24 h" },
      { title: "Finanzierung", description: "Ab 2,9 % effektiv" },
    ],
    socials: {
      instagram: "https://instagram.com/arslanautomobile",
      tiktok: "https://tiktok.com/@arslanautomobile",
    },
    stats: [
      { value: "15", label: "Jahre" },
      { value: "800+", label: "Fahrzeuge" },
      { value: "12 Mo.", label: "Garantie" },
    ],
    tags: ["bmw", "mercedes", "audi", "porsche", "volvo"],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

