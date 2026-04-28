"use client";

// =============================================================================
// InteriorDesign — v2 template (id=49, key="interior-design").
//
// Sector: Interior designer — DEFAULT variant. Mood: warm taupe / walnut,
// luxury interior magazine. Inspired by kart_20_ic_mimar.html.
//
// Locked design DNA (only colors respond to brand):
//   - Hero: large 320 px photo with dark overlay gradient, an "ISSUE Nº 04"
//     issue mark, then a serif italic headline "Räume mit Seele" with one
//     accent-colored word.
//   - Profile strip floats (-36 px) with avatar + warm-paper card chip
//     (italic name + small role).
//   - 3 quick action pills (Call · WhatsApp · Email).
//   - Editorial bio text with left accent rule.
//   - Featured project: tall photo card with badge + title + description.
//   - Services list: hairline-divided rows.
//   - Process: 3 steps numbered.
//   - CTA: subdued accent-on-walnut.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Compass,
  Hammer,
  Mail,
  MessageCircle,
  PenTool,
  Phone,
  Sparkles,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#7c6450"; // walnut/taupe
const LOCKED_ACCENT = "#d4b896"; // warm sand
const PAGE = "#f5ede4";
const SURFACE = "#fdf8f3";
const SURFACE_WARM = "#f5ebe0";
const INK = "#2a1d12";
const INK_SOFT = "#5a4a3a";
const HAIRLINE = "#e3d5c2";

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
  issueMark: string;
  headlineLead: string;
  headlineAccent: string;
  headlineTail: string;
  callBtn: string;
  whatsappBtn: string;
  emailBtn: string;
  philosophyH: string;
  philosophyLabel: string;
  featuredH: string;
  featuredLabel: string;
  featuredBadge: string;
  servicesH: string;
  processH: string;
  step1: string;
  step2: string;
  step3: string;
  cta: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  contact: string;
}

const COPY: Record<"de" | "en" | "tr", Copy> = {
  de: {
    issueMark: "Issue Nº 04 · Wohnen",
    headlineLead: "Räume",
    headlineAccent: "mit Seele",
    headlineTail: "— still,\nbewohnt, ehrlich.",
    callBtn: "Anrufen",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-Mail",
    philosophyH: "Haltung",
    philosophyLabel: "Editorial",
    featuredH: "Aktuelles Projekt",
    featuredLabel: "Featured",
    featuredBadge: "On Going",
    servicesH: "Leistungen",
    processH: "Prozess",
    step1: "Begehung & Briefing",
    step2: "Konzept & Material",
    step3: "Umsetzung & Übergabe",
    cta: "Erstgespräch buchen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    contact: "Kontakt",
  },
  en: {
    issueMark: "Issue Nº 04 · Living",
    headlineLead: "Rooms",
    headlineAccent: "with soul",
    headlineTail: "— quiet,\nlived in, honest.",
    callBtn: "Call",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    philosophyH: "Voice",
    philosophyLabel: "Editorial",
    featuredH: "Current project",
    featuredLabel: "Featured",
    featuredBadge: "On Going",
    servicesH: "Services",
    processH: "Process",
    step1: "Walk-through & brief",
    step2: "Concept & materials",
    step3: "Build & hand-over",
    cta: "Book a consultation",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    contact: "Contact",
  },
  tr: {
    issueMark: "Issue Nº 04 · Yaşam",
    headlineLead: "Ruhu olan",
    headlineAccent: "mekânlar",
    headlineTail: "— sakin,\nyaşanmış, dürüst.",
    callBtn: "Ara",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-posta",
    philosophyH: "Tasarım Anlayışı",
    philosophyLabel: "Editöryal",
    featuredH: "Güncel Proje",
    featuredLabel: "Öne Çıkan",
    featuredBadge: "Devam Eden",
    servicesH: "Hizmetler",
    processH: "Süreç",
    step1: "Yerinde inceleme & brief",
    step2: "Konsept & malzeme",
    step3: "Uygulama & teslim",
    cta: "Görüşme Talep Et",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    contact: "İletişim",
  },
};

const PROCESS_ICONS = [Compass, PenTool, Hammer];

export function InteriorDesign({
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

  const services = cardData.services ?? [];
  const featured = services.find((s) => s.priceLabel) ?? services[0];
  const otherSvcs = services.filter((s) => s !== featured);
  const year = new Date().getFullYear();

  return (
    <article
      data-template="interior-design"
      className="id-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: INK }}
    >
      <style jsx global>{`
        .id-card {
          font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
          line-height: 1.7;
          background: ${PAGE};
        }
        .id-card .serif {
          font-family: 'Fraunces', Georgia, serif;
          font-style: italic;
          font-weight: 400;
        }
        .id-card a { color: inherit; }
      `}</style>

      <div style={{ background: SURFACE }}>
        {/* HERO */}
        <header className="relative h-[320px] overflow-hidden">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt=""
              fill
              sizes="460px"
              unoptimized
              priority
              className="object-cover"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{
                background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
              }}
            />
          )}
          <div
            className="absolute inset-0 flex flex-col justify-end px-7 pb-14 pt-7"
            style={{
              background:
                "linear-gradient(180deg, rgba(42,29,18,0.1) 0%, rgba(42,29,18,0.55) 100%)",
              color: "#fff",
            }}
          >
            <div
              className="mb-3 flex items-center gap-2.5 text-[11px] font-medium uppercase"
              style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "3.5px" }}
            >
              <span
                aria-hidden
                className="block h-px w-7"
                style={{ background: accent }}
              />
              {t.issueMark}
            </div>
            <h1 className="serif text-[32px] leading-[1.1] tracking-[-0.5px]">
              {t.headlineLead}{" "}
              <em className="serif" style={{ color: accent }}>
                {t.headlineAccent}
              </em>
              <span className="block whitespace-pre-line">{t.headlineTail}</span>
            </h1>
          </div>
        </header>

        {/* PROFILE */}
        <section className="relative z-[2] -mt-9 flex items-center gap-4 px-7">
          <div
            className="relative h-[76px] w-[76px] flex-shrink-0 overflow-hidden rounded-full"
            style={{
              border: `4px solid ${SURFACE}`,
              boxShadow: "0 8px 24px rgba(92,61,30,0.18)",
              background: PAGE,
            }}
          >
            {photoUrl ? (
              <Image src={photoUrl} alt="" fill sizes="76px" unoptimized className="object-cover" />
            ) : (
              <div
                className="serif flex h-full w-full items-center justify-center text-[22px]"
                style={{ color: primary }}
              >
                {cardData.name.slice(0, 1)}
              </div>
            )}
          </div>
          <div
            className="min-w-0 flex-1 rounded-2xl px-4 py-3"
            style={{
              background: SURFACE,
              boxShadow: "0 8px 24px rgba(92,61,30,0.12)",
            }}
          >
            <div className="serif text-[20px]" style={{ color: primary }}>
              {cardData.name}
            </div>
            <div className="mt-0.5 text-[12px]" style={{ color: INK_SOFT, letterSpacing: "0.5px" }}>
              {cardData.position || "Interior Designer"}
            </div>
          </div>
        </section>

        {/* QUICK */}
        <section className="flex gap-2.5 px-7 pb-2 pt-6">
          {phoneDigits && (
            <Pill href={`tel:${phoneDigits}`} Icon={Phone} label={t.callBtn} bg={primary} fg={onPrimary} />
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
              bg={accent}
              fg={readableTextOn(accent)}
            />
          )}
        </section>

        {/* PHILOSOPHY */}
        {cardData.bio && (
          <section className="px-7 pt-9">
            <SectionLabel accent={primary}>{t.philosophyLabel}</SectionLabel>
            <h3
              className="serif mt-2 text-[26px] leading-[1.2]"
              style={{ color: primary }}
            >
              {t.philosophyH}
            </h3>
            <p
              className="serif mt-5 border-l-2 pl-4 text-[17px] leading-[1.65]"
              style={{ color: INK, borderColor: accent }}
            >
              {cardData.bio}
            </p>
          </section>
        )}

        {/* FEATURED PROJECT */}
        {featured && (
          <section className="px-7 pt-9">
            <SectionLabel accent={primary}>{t.featuredLabel}</SectionLabel>
            <h3
              className="serif mt-2 text-[26px] leading-[1.2]"
              style={{ color: primary }}
            >
              {t.featuredH}
            </h3>
            <div
              className="mt-5 overflow-hidden rounded-[22px]"
              style={{ background: SURFACE_WARM }}
            >
              <div className="relative h-[230px] overflow-hidden">
                {photoUrl ? (
                  <Image src={photoUrl} alt="" fill sizes="460px" unoptimized className="object-cover" />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{
                      background: `linear-gradient(135deg, ${primary}33 0%, ${accent}55 100%)`,
                    }}
                  />
                )}
              </div>
              <div className="px-6 py-7">
                <span
                  className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase"
                  style={{
                    background: primary,
                    color: SURFACE,
                    letterSpacing: "2px",
                  }}
                >
                  {t.featuredBadge}
                </span>
                <div
                  className="serif mt-3 text-[22px]"
                  style={{ color: primary }}
                >
                  {featured.title}
                </div>
                {featured.description && (
                  <p className="mt-2 text-[13px]" style={{ color: INK_SOFT }}>
                    {featured.description}
                  </p>
                )}
                {featured.priceLabel && (
                  <div
                    className="serif mt-3 text-[18px]"
                    style={{ color: primary }}
                  >
                    {featured.priceLabel}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* SERVICES */}
        {otherSvcs.length > 0 && (
          <section className="px-7 pt-9">
            <SectionLabel accent={primary}>{t.servicesH}</SectionLabel>
            <h3
              className="serif mt-2 text-[26px] leading-[1.2]"
              style={{ color: primary }}
            >
              {t.servicesH}
            </h3>
            <div className="mt-5">
              {otherSvcs.slice(0, 5).map((svc, i, arr) => (
                <div
                  key={`${svc.title}-${i}`}
                  className="flex items-baseline justify-between py-4"
                  style={{
                    borderBottom: i < arr.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                  }}
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <div className="text-[14px] font-semibold" style={{ color: INK }}>
                      {svc.title}
                    </div>
                    {svc.description && (
                      <div className="mt-0.5 text-[12px]" style={{ color: INK_SOFT }}>
                        {svc.description}
                      </div>
                    )}
                  </div>
                  {svc.priceLabel && (
                    <div className="serif text-[16px]" style={{ color: primary }}>
                      {svc.priceLabel}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROCESS */}
        <section className="px-7 pt-9">
          <SectionLabel accent={primary}>{t.processH}</SectionLabel>
          <h3
            className="serif mt-2 text-[26px] leading-[1.2]"
            style={{ color: primary }}
          >
            {t.processH}
          </h3>
          <ol className="mt-5 space-y-3">
            {[t.step1, t.step2, t.step3].map((step, i) => {
              const Icon = PROCESS_ICONS[i];
              return (
                <li
                  key={step}
                  className="flex items-center gap-4 rounded-2xl px-4 py-4"
                  style={{ background: SURFACE_WARM, border: `1px solid ${HAIRLINE}` }}
                >
                  <span
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ background: primary, color: SURFACE }}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                  </span>
                  <span
                    className="serif text-[16px]"
                    style={{ color: INK }}
                  >
                    {step}
                  </span>
                  <span
                    className="ml-auto text-[10px] font-semibold uppercase"
                    style={{ color: primary, letterSpacing: "2px" }}
                  >
                    0{i + 1}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        {/* CTA */}
        <section className="px-7 pt-9">
          <a
            href={
              cardData.bookingUrl ||
              (waDigits ? `https://wa.me/${waDigits}` : `mailto:${cardData.email ?? ""}`)
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl px-5 py-[18px] text-[14px] font-semibold transition-all hover:-translate-y-0.5"
            style={{
              background: primary,
              color: onPrimary,
              boxShadow: `0 14px 30px ${primary}55`,
            }}
          >
            {t.cta}
            <ArrowUpRight size={16} strokeWidth={2.2} />
          </a>
        </section>

        {/* CONTACT */}
        <section className="px-7 pt-9">
          <SectionLabel accent={primary}>{t.contact}</SectionLabel>
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
          className="mx-7 mt-9 rounded-3xl p-5"
          style={{ background: SURFACE_WARM, border: `1px solid ${HAIRLINE}` }}
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
            <div style={{ ["--card-primary" as string]: primary, background: SURFACE_WARM }}>
              {walletSlot}
            </div>
          </WalletDock>
        )}

        {/* FOOTER */}
        <footer
          className="mt-7 px-7 py-7 text-center"
          style={{ borderTop: `1px solid ${HAIRLINE}`, color: INK_SOFT }}
        >
          <div
            className="serif text-[18px]"
            style={{ color: primary }}
          >
            {cardData.name}
          </div>
          <div
            className="mt-1 text-[10.5px]"
            style={{ letterSpacing: "1px" }}
          >
            © {year} · {t.poweredBy}{" "}
            <a
              href="https://opsolid.de/products/digital-card"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold"
              style={{ color: primary }}
            >
              OpSolid
            </a>
          </div>
          <div
            className="mt-2 inline-flex items-center gap-1.5 text-[10.5px]"
            style={{ color: INK_SOFT }}
          >
            <Sparkles size={11} strokeWidth={1.6} />
            {cardData.address || "Berlin"}
          </div>
        </footer>
      </div>
    </article>
  );
}

function SectionLabel({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <div
      className="text-[11px] font-medium uppercase"
      style={{ color: accent, letterSpacing: "3px" }}
    >
      {children}
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
      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[13px] font-semibold transition-all hover:-translate-y-0.5"
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

export const interiorDesignEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 49,
  key: "interior-design",
  name: "Interior Design",
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
  sampleSlug: "demo-interior-design",
};

// photo: Unsplash, modern interior. Unsplash License — free, no attribution required.
export const interiorDesignSample: SampleData = {
  templateId: 49,
  slug: "demo-interior-design",
  cardData: {
    name: "Elif Yaman",
    position: "Interior Designerin",
    title: "Wohn- & Bürogestaltung",
    company: "Elif Design Studio",
    email: "elif@elifdesign.de",
    phone: "+49 173 778 9012",
    whatsapp: "+49 173 778 9012",
    website: "elifdesign.de",
    address: "Mitte, Berlin",
    bio:
      "Interior Designerin mit Leidenschaft für zeitlose Räume. Wohnprojekte, Bürogestaltung, Hoteldesign — eine Handschrift, die ruhig bleibt, aber nicht leise wirkt.",
    bookingUrl: "https://cal.com/elifdesign/intro",
    sectorKey: "architecture",
    services: [
      { title: "Penthouse · Charlottenburg", description: "180 m² · komplett neu gedacht", priceLabel: "ab €8.000" },
      { title: "Raumplanung", description: "Concept · Layout · Materialien", priceLabel: "ab €1.500" },
      { title: "Vollprojekt", description: "Konzept bis Umsetzung", priceLabel: "ab €8.000" },
      { title: "Online-Beratung", description: "60 min Strategie pro Stunde", priceLabel: "€120 / h" },
      { title: "Hospitality Design", description: "Hotellerie · Boutique-Cafés", priceLabel: "auf Anfrage" },
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
