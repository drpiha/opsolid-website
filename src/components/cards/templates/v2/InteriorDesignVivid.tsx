"use client";

// =============================================================================
// InteriorDesignVivid — v2 template (id=51, key="interior-design-vivid").
//
// Sector: Interior designer — VIVID variant. Mood: bold contemporary primary
// (default electric blue) with white surfaces, large photo block, color
// pops. Inspired by the vivid-architect / interior layouts.
//
// Locked design DNA (only colors respond to brand):
//   - Hero: gradient panel (deepâ†’primaryâ†’accent) with bold tag pill,
//     uppercase chunky name, role line, and 3 hero stats.
//   - Profile strip floats over hero.
//   - 3 quick action pills.
//   - Featured project card: large photo with overlaid badge + caption.
//   - Services grid: 2×2 cards with icons in primary-tinted squircle.
//   - Process: timeline of 3 numbered nodes connected by accent rule.
//   - CTA: gradient bold button.
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

const LOCKED_PRIMARY = "#2563eb"; // bold blue
const LOCKED_ACCENT = "#93c5fd"; // sky blue
const PAGE = "#f4f7ff";
const SURFACE = "#ffffff";
const INK = "#0f172a";
const INK_SOFT = "#475569";
const HAIRLINE = "#e2e8f0";

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
  servicesH: string;
  processH: string;
  step1: string;
  step2: string;
  step3: string;
  yearsLabel: string;
  projectsLabel: string;
  awardsLabel: string;
  cta: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  contact: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    tag: "Interior Studio",
    callBtn: "Anrufen",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-Mail",
    featuredH: "Aktuelles Projekt",
    featuredBadge: "Featured",
    servicesH: "Leistungen",
    processH: "Prozess",
    step1: "Brief",
    step2: "Konzept",
    step3: "Umsetzung",
    yearsLabel: "Jahre",
    projectsLabel: "Projekte",
    awardsLabel: "Awards",
    cta: "Erstgespräch buchen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    contact: "Kontakt",
  },
  en: {
    tag: "Interior Studio",
    callBtn: "Call",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    featuredH: "Current project",
    featuredBadge: "Featured",
    servicesH: "Services",
    processH: "Process",
    step1: "Brief",
    step2: "Concept",
    step3: "Build",
    yearsLabel: "Years",
    projectsLabel: "Projects",
    awardsLabel: "Awards",
    cta: "Book a consultation",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    contact: "Contact",
  },
  tr: {
    tag: "Interior Studio",
    callBtn: "Ara",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-posta",
    featuredH: "Güncel Proje",
    featuredBadge: "Öne Çıkan",
    servicesH: "Hizmetler",
    processH: "Süreç",
    step1: "Brief",
    step2: "Konsept",
    step3: "Uygulama",
    yearsLabel: "Yıl",
    projectsLabel: "Proje",
    awardsLabel: "Ödül",
    cta: "Görüşme Talep Et",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    contact: "İletişim",
  },
  es: {

    tag: "Estudio de interiorismo",
    callBtn: "Llamar",
    whatsappBtn: "WhatsApp",
    emailBtn: "Correo",
    featuredH: "Proyecto actual",
    featuredBadge: "Destacado",
    servicesH: "Servicios",
    processH: "Proceso",
    step1: "Resumen",
    step2: "Concepto",
    step3: "Construir",
    yearsLabel: "Años",
    projectsLabel: "Proyectos",
    awardsLabel: "Premios",
    cta: "Reservar una consulta",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
    contact: "Contacto",
  
  },
  it: {

    tag: "Studio di interior design",
    callBtn: "Chiama",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    featuredH: "Progetto in corso",
    featuredBadge: "In evidenza",
    servicesH: "Servizi",
    processH: "Processo",
    step1: "Brief",
    step2: "Concept",
    step3: "Costruire",
    yearsLabel: "Anni",
    projectsLabel: "Progetti",
    awardsLabel: "Premi",
    cta: "Prenota una consulenza",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
    contact: "Contatto",
  
  },
  fr: {

    tag: "Studio d'intérieur",
    callBtn: "Appeler",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-mail",
    featuredH: "Projet en cours",
    featuredBadge: "À la une",
    servicesH: "Services",
    processH: "Processus",
    step1: "Brief",
    step2: "Concept",
    step3: "Construire",
    yearsLabel: "Années",
    projectsLabel: "Projets",
    awardsLabel: "Récompenses",
    cta: "Réserver une consultation",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
    contact: "Contact",
  
  },
  ar: {

    tag: "استوديو التصميم الداخلي",
    callBtn: "اتصال",
    whatsappBtn: "واتساب",
    emailBtn: "البريد الإلكتروني",
    featuredH: "المشروع الحالي",
    featuredBadge: "مميز",
    servicesH: "الخدمات",
    processH: "العملية",
    step1: "موجز",
    step2: "المفهوم",
    step3: "بناء",
    yearsLabel: "سنوات",
    projectsLabel: "المشاريع",
    awardsLabel: "جوائز",
    cta: "احجز استشارة",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
    contact: "اتصال",
  
  },
};

const PROCESS_ICONS = [Compass, PenTool, Hammer];

export function InteriorDesignVivid({
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
  const primaryDeep = shade(primary, -50);

  const photoUrl = resolveAssetUrl(photoPath);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];
  const featured = services.find((s) => s.priceLabel) ?? services[0];
  const otherSvcs = services.filter((s) => s !== featured).slice(0, 4);
  const year = new Date().getFullYear();

  return (
    <article
      data-template="interior-design-vivid"
      className="idv-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: SURFACE,
        color: INK,
        boxShadow: "0 18px 50px rgba(37,99,235,0.18)",
      }}
    >
      <style jsx global>{`
        .idv-card {
          font-family: var(--tpl-font-body, 'Poppins', 'Inter', system-ui, sans-serif);
          line-height: 1.6;
          background: ${PAGE};
        }
        .idv-card a { color: inherit; }
      `}</style>

      <div style={{ background: SURFACE }}>
        {/* HERO */}
        <header
          className="relative overflow-hidden px-7 py-14"
          style={{
            background: `linear-gradient(135deg, ${primaryDeep} 0%, ${primary} 50%, ${accent} 100%)`,
            color: "#fff",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-12 -left-10 h-44 w-44 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)",
            }}
          />

          <div className="relative">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase"
              style={{
                background: "rgba(255,255,255,0.18)",
                borderColor: "rgba(255,255,255,0.32)",
                letterSpacing: "2px",
              }}
            >
              <Sparkles size={12} strokeWidth={2.4} />
              {t.tag}
            </span>
            <h1
              className="mt-5 text-[36px] font-extrabold uppercase leading-none tracking-[-0.5px]"
            >
              {cardData.name}
            </h1>
            <div
              className="mt-2.5 text-[14px] font-medium"
              style={{ color: "rgba(255,255,255,0.88)" }}
            >
              {cardData.position || "Interior Designer"}
            </div>
            <div className="mt-7 flex gap-6">
              <HeroStat num="11" label={t.yearsLabel} accent={accent} />
              <HeroStat num="48" label={t.projectsLabel} accent={accent} />
              <HeroStat num="6" label={t.awardsLabel} accent={accent} />
            </div>
          </div>
        </header>

        {/* PROFILE STRIP */}
        <section className="relative z-[2] -mt-9 flex items-center gap-4 px-7">
          <div
            className="relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-full"
            style={{
              border: "4px solid #fff",
              boxShadow: "0 8px 28px rgba(15,23,42,0.18)",
              background: PAGE,
            }}
          >
            {photoUrl ? (
              <Image src={photoUrl} alt="" fill sizes="72px" unoptimized className="object-cover tpl-photo" />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-[22px] font-extrabold"
                style={{ color: primary }}
              >
                {cardData.name.slice(0, 1)}
              </div>
            )}
          </div>
          <div
            className="min-w-0 flex-1 rounded-2xl px-4 py-3"
            style={{ background: "#fff", boxShadow: "0 8px 28px rgba(37,99,235,0.18)" }}
          >
            <div
              className="text-[12px] font-semibold uppercase"
              style={{ color: primary, letterSpacing: "0.8px" }}
            >
              {cardData.company || "Interior Studio"}
            </div>
            <div className="mt-0.5 text-[13px]" style={{ color: INK_SOFT }}>
              {cardData.title || "Wohn · Office · Hotel"}
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
              bg={primaryDeep}
              fg="#fff"
            />
          )}
        </section>

        {/* FEATURED PROJECT */}
        {featured && (
          <section className="px-7 pt-7">
            <SectionTitle primary={primary}>{t.featuredH}</SectionTitle>
            <div
              className="relative mt-4 overflow-hidden rounded-[20px]"
              style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
            >
              <div className="relative h-[200px]">
                {photoUrl ? (
                  <Image src={photoUrl} alt="" fill sizes="460px" unoptimized className="object-cover tpl-photo" />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{
                      background: `linear-gradient(135deg, ${primary}33 0%, ${accent}66 100%)`,
                    }}
                  />
                )}
                <span
                  className="absolute left-4 top-4 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase"
                  style={{
                    background: primary,
                    color: onPrimary,
                    letterSpacing: "2px",
                  }}
                >
                  {t.featuredBadge}
                </span>
              </div>
              <div className="px-5 py-5">
                <div
                  className="text-[18px] font-extrabold leading-tight"
                  style={{ color: INK }}
                >
                  {featured.title}
                </div>
                {featured.description && (
                  <p className="mt-2 text-[12.5px]" style={{ color: INK_SOFT }}>
                    {featured.description}
                  </p>
                )}
                {featured.priceLabel && (
                  <div
                    className="mt-3 inline-block rounded-full px-3 py-1 text-[11.5px] font-bold"
                    style={{
                      background: `${primary}1a`,
                      color: primary,
                    }}
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
          <section className="px-7 pt-7">
            <SectionTitle primary={primary}>{t.servicesH}</SectionTitle>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {otherSvcs.map((svc, i) => (
                <div
                  key={`${svc.title}-${i}`}
                  className="rounded-2xl px-4 py-5 transition-all hover:-translate-y-0.5"
                  style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
                >
                  <div
                    className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      background: `${primary}1a`,
                      color: primary,
                    }}
                  >
                    <Sparkles size={18} strokeWidth={2.2} />
                  </div>
                  <div className="text-[13.5px] font-extrabold" style={{ color: INK }}>
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div className="mt-1 text-[11.5px] leading-[1.5]" style={{ color: INK_SOFT }}>
                      {svc.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROCESS TIMELINE */}
        <section className="px-7 pt-7">
          <SectionTitle primary={primary}>{t.processH}</SectionTitle>
          <div className="relative mt-5">
            <span
              aria-hidden
              className="absolute left-[18px] top-3 h-[calc(100%-24px)] w-px"
              style={{ background: `${primary}55` }}
            />
            <ol className="space-y-3">
              {[t.step1, t.step2, t.step3].map((step, i) => {
                const Icon = PROCESS_ICONS[i];
                return (
                  <li key={step} className="flex items-center gap-4">
                    <span
                      className="relative z-[1] flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                      style={{ background: primary, color: onPrimary }}
                    >
                      <Icon size={15} strokeWidth={2} />
                    </span>
                    <span
                      className="flex-1 rounded-2xl px-4 py-3 text-[13.5px] font-semibold"
                      style={{
                        background: SURFACE,
                        border: `1px solid ${HAIRLINE}`,
                        color: INK,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")} · {step}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="px-7 pt-7">
          <a
            href={
              cardData.bookingUrl ||
              (waDigits ? `https://wa.me/${waDigits}` : `mailto:${cardData.email ?? ""}`)
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl px-5 py-[18px] text-[14px] font-extrabold transition-all hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${primaryDeep} 0%, ${primary} 100%)`,
              color: onPrimary,
              boxShadow: `0 18px 36px ${primary}66`,
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
          className="mt-7 px-7 py-6 text-center"
          style={{ background: INK, color: "rgba(255,255,255,0.6)" }}
        >
          <div
            className="text-[13px] font-extrabold uppercase"
            style={{ color: accent, letterSpacing: "2.5px" }}
          >
            {(cardData.company || cardData.name).toUpperCase()}
          </div>
          <div className="mt-1.5 text-[10.5px]" style={{ color: "rgba(255,255,255,0.55)" }}>
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

function SectionTitle({
  children,
  primary,
}: {
  children: React.ReactNode;
  primary: string;
}) {
  return (
    <h2
      className="flex items-center gap-2.5 text-[16px] font-extrabold"
      style={{ color: INK }}
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
        className="text-[26px] font-extrabold leading-none tracking-[-0.5px]"
        style={{ color: accent }}
      >
        {num}
      </div>
      <div
        className="mt-0.5 text-[10px] uppercase"
        style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "1.5px" }}
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
      className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl px-2 py-3 text-[13px] font-bold transition-all hover:-translate-y-0.5"
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

export const interiorDesignVividEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 51,
  key: "interior-design-vivid",
  name: "Interior — Vivid",
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
  sampleSlug: "demo-interior-design-vivid",
};

// photo: Unsplash, modern interior. Unsplash License — free, no attribution required.
export const interiorDesignVividSample: SampleData = {
  templateId: 51,
  slug: "demo-interior-design-vivid",
  cardData: {
    name: "Elif Yaman",
    position: "Interior Designerin",
    title: "Wohn · Büro · Hotel",
    company: "Elif Design Studio",
    email: "elif@elifdesign.de",
    phone: "+49 173 778 9012",
    whatsapp: "+49 173 778 9012",
    website: "elifdesign.de",
    address: "Mitte, Berlin",
    bio:
      "Mutige, zeitgenössische Interiors mit einer klaren Materialhaltung. Wir entwerfen Räume, die Haltung zeigen — ohne laut zu werden.",
    bookingUrl: "https://cal.com/elifdesign/intro",
    sectorKey: "architecture",
    services: [
      { title: "Mitte Penthouse", description: "240 m² · Marmor · Eiche · Bronze", priceLabel: "ab â‚¬18.000" },
      { title: "Raumplanung", description: "Concept · Layout · Materialien" },
      { title: "Vollprojekt", description: "Konzept bis Umsetzung" },
      { title: "Online-Beratung", description: "Strategie pro Stunde" },
      { title: "Hospitality Design", description: "Hotellerie & Boutique-Cafés" },
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

