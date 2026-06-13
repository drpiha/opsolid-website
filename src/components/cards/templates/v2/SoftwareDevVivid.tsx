"use client";

// =============================================================================
// SoftwareDevVivid — v2 template (id=36, key="software-dev-vivid").
//
// Sector: Software engineer — VIVID variant. Mood: bold purple/electric blue
// gradient hero, oversized Syne display name, mint-green availability accent,
// floating white card overlap. Inspired by kart_15_yazilim_vivid.html.
//
// Locked design DNA (only colors respond to brand):
//   - Hero: dark→purple→primary diagonal gradient with mint and purple radial
//     blob halos; Syne 42 px display name with mint accent on lastname; mono
//     handle below; tagline.
//   - Floating card (-80 px overlap) with avatar, gradient border ring, role,
//     full name, exp; quick-stats row (Years / Projects / Clients).
//   - Action buttons row (large rounded chips, 3-up).
//   - Stack badges: gradient outline pills.
//   - Service cards: 2-up grid with Syne titles.
//   - Big CTA (gradient).
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Code2,
  Mail,
  MessageCircle,
  Phone,
  Rocket,
  Sparkles,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { ServiceLink } from "./shared/ServiceLink";
import { resolveStats, resolveTagline, resolveLocation } from "./shared/profileExtras";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#7c3aed";
const LOCKED_ACCENT = "#a78bfa";
const PRIMARY_DEEP = "#3730a3";
const SECONDARY = "#06d6a0"; // mint
const PAGE = "#f4f3ff";
const SURFACE = "#ffffff";
const INK = "#1e293b";
const INK_SOFT = "#64748b";
const DARK = "#0f172a";
const HAIRLINE = "#e2e8f0";

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

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "•";
  return (parts[0][0] ?? "•").toUpperCase() + (parts[parts.length - 1]?.[0] ?? "").toUpperCase();
}

interface SdvCopy {
  available: string;
  hireMe: string;
  call: string;
  whatsapp: string;
  email: string;
  scheduleCta: string;
  ctaSub: string;
  stack: string;
  services: string;
  contact: string;
  social: string;
  saveContact: string;
  walletLabel: string;
  share: string;
  poweredBy: string;
  yearsLabel: string;
  projectsLabel: string;
  clientsLabel: string;
  experience: string;
  experienceVal: string;
  tagline: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", SdvCopy> = {
  de: {
    available: "Verfügbar für neue Projekte",
    hireMe: "Hire me",
    call: "Anrufen",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    scheduleCta: "Kostenloses Tech-Gespräch",
    ctaSub: "30 Min · Online · Unverbindlich",
    stack: "Stack",
    services: "Services",
    contact: "Kontakt",
    social: "Folgen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    share: "Teilen",
    poweredBy: "Powered by",
    yearsLabel: "Jahre",
    projectsLabel: "Projekte",
    clientsLabel: "Kunden",
    experience: "Erfahrung",
    experienceVal: "7+ Jahre",
    tagline: "Web-Apps, die skalieren. APIs, die halten.",
  },
  en: {
    available: "Available for new projects",
    hireMe: "Hire me",
    call: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    scheduleCta: "Free tech intro call",
    ctaSub: "30 min · online · no commitment",
    stack: "Stack",
    services: "Services",
    contact: "Contact",
    social: "Follow",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    share: "Share",
    poweredBy: "Powered by",
    yearsLabel: "Years",
    projectsLabel: "Projects",
    clientsLabel: "Clients",
    experience: "Experience",
    experienceVal: "7+ years",
    tagline: "Web apps that scale. APIs that last.",
  },
  tr: {
    available: "Yeni Projeler İçin Müsait",
    hireMe: "İşe Al",
    call: "Ara",
    whatsapp: "WhatsApp",
    email: "E-posta",
    scheduleCta: "Ücretsiz Teknoloji Görüşmesi",
    ctaSub: "30 dk · Online · Bağlayıcı Değil",
    stack: "Stack",
    services: "Hizmetler",
    contact: "İletişim",
    social: "Sosyal",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    share: "Paylaş",
    poweredBy: "Powered by",
    yearsLabel: "Yıl",
    projectsLabel: "Proje",
    clientsLabel: "Müşteri",
    experience: "Tecrübe",
    experienceVal: "7+ Yıl",
    tagline: "Ölçeklenebilir web uygulamaları. Sağlam API'ler.",
  },
  es: {

    available: "Disponible para nuevos proyectos",
    hireMe: "Contrátame",
    call: "Llamar",
    whatsapp: "WhatsApp",
    email: "Correo",
    scheduleCta: "Llamada técnica gratuita",
    ctaSub: "30 min · online · no commitment",
    stack: "Stack",
    services: "Servicios",
    contact: "Contacto",
    social: "Seguir",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    share: "Compartir",
    poweredBy: "Desarrollado por",
    yearsLabel: "Años",
    projectsLabel: "Proyectos",
    clientsLabel: "Clientes",
    experience: "Experiencia",
    experienceVal: "7+ años",
    tagline: "Apps web escalables. APIs duraderas.",
  
  },
  it: {

    available: "Disponibile per nuovi progetti",
    hireMe: "Assumimi",
    call: "Chiama",
    whatsapp: "WhatsApp",
    email: "Email",
    scheduleCta: "Chiamata tecnica introduttiva gratuita",
    ctaSub: "30 min · online · no commitment",
    stack: "Stack",
    services: "Servizi",
    contact: "Contatto",
    social: "Segui",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    share: "Condividi",
    poweredBy: "Realizzato con",
    yearsLabel: "Anni",
    projectsLabel: "Progetti",
    clientsLabel: "Clienti",
    experience: "Esperienza",
    experienceVal: "7+ anni",
    tagline: "App web scalabili. API durature.",
  
  },
  fr: {

    available: "Disponible pour de nouveaux projets",
    hireMe: "M'embaucher",
    call: "Appeler",
    whatsapp: "WhatsApp",
    email: "E-mail",
    scheduleCta: "Appel technique d'introduction gratuit",
    ctaSub: "30 min · online · no commitment",
    stack: "Stack",
    services: "Services",
    contact: "Contact",
    social: "Suivre",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    share: "Partager",
    poweredBy: "Propulsé par",
    yearsLabel: "Années",
    projectsLabel: "Projets",
    clientsLabel: "Clients",
    experience: "Expérience",
    experienceVal: "7+ ans",
    tagline: "Applications web qui scalent. APIs durables.",
  
  },
  ar: {

    available: "متاح لمشاريع جديدة",
    hireMe: "وظفني",
    call: "اتصال",
    whatsapp: "واتساب",
    email: "البريد الإلكتروني",
    scheduleCta: "مكالمة تقنية تعريفية مجانية",
    ctaSub: "30 min · online · no commitment",
    stack: "المنظومة",
    services: "الخدمات",
    contact: "اتصال",
    social: "متابعة",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    share: "مشاركة",
    poweredBy: "مشغل بواسطة",
    yearsLabel: "سنوات",
    projectsLabel: "المشاريع",
    clientsLabel: "العملاء",
    experience: "الخبرة",
    experienceVal: "7+ سنوات",
    tagline: "تطبيقات ويب قابلة للتوسع. واجهات برمجية باقية.",
  
  },
};

const STACK = ["TypeScript", "React", "Next.js", "Node", "AWS", "Postgres"];

export function SoftwareDevVivid({
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
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);
  const initials = getInitials(cardData.name);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";
  const stats = resolveStats(cardData.stats);
  const tagline = resolveTagline(cardData);
  const locationLabel = resolveLocation(cardData);

  const services = cardData.services ?? [];

  // Split first vs last word
  const nameParts = cardData.name.trim().split(/\s+/);
  const firstName = nameParts.slice(0, -1).join(" ") || cardData.name;
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  const handle =
    cardData.website?.replace(/^https?:\/\//, "").replace(/\/$/, "") ||
    cardData.email?.split("@")[0] ||
    cardData.name.toLowerCase().replace(/[^a-z0-9]+/g, "");

  const year = new Date().getFullYear();

  return (
    <article
      data-template="software-dev-vivid"
      className="sdv-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: PAGE,
        color: INK,
      }}
    >
      <style jsx global>{`
        .sdv-card {
          font-family: var(--tpl-font-body, 'Inter', system-ui, sans-serif);
          line-height: 1.6;
        }
        .sdv-card .display { font-family: var(--tpl-font-display, 'Syne', 'Inter', sans-serif); }
        .sdv-card .mono { font-family: var(--tpl-font-display, 'JetBrains Mono', monospace); }
        .sdv-card a { color: inherit; }
      `}</style>

      {/* HERO with diagonal gradient */}
      <header
        className="relative overflow-hidden px-6 pb-24 pt-9"
        style={{
          background: `linear-gradient(135deg, ${DARK} 0%, ${PRIMARY_DEEP} 50%, ${primary} 100%)`,
          color: "#fff",
        }}
      >
        {/* Mint blob halo */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full"
          style={{
            background: `radial-gradient(circle, ${SECONDARY}66, transparent 60%)`,
            filter: "blur(40px)",
          }}
        />
        {/* Purple blob halo */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-12 bottom-20 h-52 w-52 rounded-full"
          style={{
            background: `radial-gradient(circle, ${accent}66, transparent 60%)`,
            filter: "blur(40px)",
          }}
        />

        <div className="relative">
          {/* Availability pill */}
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11.5px] font-semibold backdrop-blur-sm"
            style={{
              background: `${SECONDARY}33`,
              borderColor: `${SECONDARY}66`,
              color: SECONDARY,
            }}
          >
            <span
              className="block h-2 w-2 rounded-full"
              style={{
                background: SECONDARY,
                boxShadow: `0 0 0 4px ${SECONDARY}33`,
              }}
            />
            {t.available}
          </div>

          {/* Big display name */}
          <h1
            className="display mt-5 text-[42px] font-extrabold leading-[1] tracking-[-1.5px]"
            style={{ color: "#fff" }}
          >
            {firstName}
            {lastName && (
              <>
                <br />
                <span style={{ color: SECONDARY }}>{lastName}.</span>
              </>
            )}
          </h1>
          <div
            className="mono mt-3 text-[13px]"
            style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "1px" }}
          >
            @{handle}
          </div>
          {tagline && (
            <p
              className="mt-4 max-w-[320px] text-[15px] font-medium leading-[1.6]"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              {tagline}
            </p>
          )}
        </div>
      </header>

      {/* FLOATING CARD with overlap */}
      <section className="relative -mt-20 px-5">
        <div
          className="rounded-3xl p-6"
          style={{
            background: SURFACE,
            boxShadow: `0 30px 60px -20px ${primary}33, 0 8px 24px -10px ${primary}22`,
          }}
        >
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <div
                aria-hidden
                className="absolute -inset-1 rounded-[22px] opacity-70"
                style={{
                  background: `linear-gradient(135deg, ${primary}, ${SECONDARY})`,
                  filter: "blur(7px)",
                }}
              />
              <div
                className="relative h-[72px] w-[72px] overflow-hidden rounded-[18px]"
                style={{ border: `3px solid ${SURFACE}` }}
              >
                {photoUrl ? (
                  <Image src={photoUrl} alt="" fill sizes="72px" unoptimized className="object-cover tpl-photo" />
                ) : (
                  <div
                    className="display flex h-full w-full items-center justify-center text-[24px] font-bold"
                    style={{ background: PAGE, color: primary }}
                  >
                    {initials}
                  </div>
                )}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              {(cardData.position || cardData.title) && (
                <div
                  className="text-[12px] font-semibold uppercase"
                  style={{ color: primary, letterSpacing: "1.2px" }}
                >
                  {cardData.position?.split("·")[0]?.trim() || cardData.title}
                </div>
              )}
              <div
                className="display text-[22px] font-bold leading-[1.15]"
                style={{ color: DARK }}
              >
                {cardData.name}
              </div>
              {locationLabel && (
                <div className="mt-1 text-[12px]" style={{ color: INK_SOFT }}>
                  {locationLabel}
                </div>
              )}
            </div>
          </div>

          {/* Quick stats — owner-entered numbers only (resolveStats). */}
          {stats && (
            <div
              className="mt-5 grid gap-2 border-t pt-5"
              style={{
                borderColor: HAIRLINE,
                borderStyle: "dashed",
                gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
              }}
            >
              {stats.map((q) => (
                <div key={q.label} className="text-center">
                  <div className="display text-[22px] font-extrabold leading-none" style={{ color: primary }}>
                    {q.value}
                  </div>
                  <div
                    className="mt-1 text-[10px] font-semibold uppercase"
                    style={{ color: INK_SOFT, letterSpacing: "1px" }}
                  >
                    {q.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="grid grid-cols-3 gap-2.5 px-6 pt-6">
        {phoneDigits && (
          <VividAction
            href={`tel:${phoneDigits}`}
            label={t.call}
            Icon={Phone}
            primary={primary}
          />
        )}
        {waDigits && (
          <VividAction
            href={`https://wa.me/${waDigits}`}
            external
            label={t.whatsapp}
            Icon={MessageCircle}
            primary={SECONDARY}
          />
        )}
        {cardData.email && (
          <VividAction
            href={`mailto:${cardData.email}`}
            label={t.email}
            Icon={Mail}
            primary={accent}
          />
        )}
      </section>

      {/* STACK */}
      <section className="px-6 pt-7">
        <VividTitle primary={primary}>{t.stack}</VividTitle>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {STACK.map((s) => (
            <span
              key={s}
              className="mono inline-flex items-center rounded-full px-3 py-1.5 text-[11.5px] font-semibold"
              style={{
                background: SURFACE,
                border: `1px solid ${primary}33`,
                color: primary,
                boxShadow: `0 1px 2px ${primary}1a`,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* SERVICES — 2-col grid */}
      {services.length > 0 && (
        <section className="px-6 pt-7">
          <VividTitle primary={primary}>{t.services}</VividTitle>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {services.slice(0, 6).map((svc, i) => {
              const fullWidth = services.length % 2 === 1 && i === services.length - 1;
              return (
                <ServiceLink
                  key={`${svc.title}-${i}`}
                  href={svc.href}
                  className={`rounded-2xl p-4 ${fullWidth ? "col-span-2" : ""}`}
                  style={{
                    background: SURFACE,
                    border: `1px solid ${HAIRLINE}`,
                  }}
                >
                  <span
                    className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${primary}, ${accent})`,
                      color: "#fff",
                    }}
                  >
                    <Sparkles size={16} strokeWidth={2.2} />
                  </span>
                  <h3
                    className="display text-[14px] font-bold leading-snug"
                    style={{ color: DARK }}
                  >
                    {svc.title}
                  </h3>
                  {svc.description && (
                    <p
                      className="mt-1 text-[11.5px] leading-snug"
                      style={{ color: INK_SOFT }}
                    >
                      {svc.description}
                    </p>
                  )}
                  {svc.priceLabel && (
                    <span
                      className="mono mt-2 inline-block text-[11px] font-semibold"
                      style={{ color: primary }}
                    >
                      {svc.priceLabel}
                    </span>
                  )}
                </ServiceLink>
              );
            })}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-6 pt-7">
        <a
          href={
            cardData.bookingUrl ||
            (waDigits ? `https://wa.me/${waDigits}` : `mailto:${cardData.email ?? ""}`)
          }
          target="_blank"
          rel="noopener noreferrer"
          className="display flex w-full items-center justify-center gap-2.5 rounded-2xl px-5 py-[18px] text-[15px] font-bold transition-all hover:-translate-y-0.5"
          style={{
            background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
            color: "#fff",
            boxShadow: `0 18px 36px -10px ${primary}80`,
          }}
        >
          <Rocket size={18} strokeWidth={2.2} />
          {t.scheduleCta}
          <ArrowUpRight size={16} strokeWidth={2.4} />
        </a>
        <p
          className="mono mt-2 text-center text-[11px]"
          style={{ color: INK_SOFT }}
        >
          {t.ctaSub}
        </p>
      </section>

      {/* CONTACT */}
      <section className="px-6 pt-7">
        <VividTitle primary={primary}>{t.contact}</VividTitle>
        <div
          className="mt-3 rounded-2xl p-4"
          style={{
            background: SURFACE,
            border: `1px solid ${HAIRLINE}`,
          }}
        >
          <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={primary} />
        </div>
      </section>

      {/* SOCIAL */}
      {cardData.socials && (
        <section className="px-6 pt-7">
          <VividTitle primary={primary}>{t.social}</VividTitle>
          <div className="mt-3">
            <SocialRow socials={cardData.socials} variant="pill" accentHex={primary} />
          </div>
        </section>
      )}

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="mx-6 mt-7 rounded-3xl p-5"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={primary} locale={locale} />
        <ExchangeSlot slug={slug} primary={primary} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="mx-6 mt-4 rounded-3xl p-5"
          labelClassName="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-center"
        >
          <div style={{ ["--card-primary" as string]: primary, background: SURFACE }}>{walletSlot}</div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer
        className="mt-7 px-6 py-7 text-center"
        style={{ borderTop: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="display inline-flex items-center gap-2 text-[13px] font-bold"
          style={{ color: primary }}
        >
          <Code2 size={14} />
          <span>{cardData.name}</span>
        </div>
        <div className="mt-2 text-[10.5px]" style={{ color: INK_SOFT }}>
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
      </footer>
    </article>
  );
}

function VividTitle({
  children,
  primary,
}: {
  children: React.ReactNode;
  primary: string;
}) {
  return (
    <h2
      className="display flex items-baseline gap-3 text-[16px] font-bold"
      style={{ color: DARK, letterSpacing: "-0.3px" }}
    >
      <span
        aria-hidden
        className="block h-[2px] w-6 rounded-full"
        style={{ background: primary }}
      />
      {children}
    </h2>
  );
}

function VividAction({
  href,
  label,
  Icon,
  primary,
  external,
}: {
  href: string;
  label: string;
  Icon: typeof Phone;
  primary: string;
  external?: boolean;
}) {
  const ext = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-3.5 text-[12px] font-semibold transition-all hover:-translate-y-0.5"
      style={{
        background: SURFACE,
        border: `1px solid ${HAIRLINE}`,
        color: INK,
      }}
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ background: `${primary}1a`, color: primary }}
      >
        <Icon size={16} strokeWidth={2.2} />
      </span>
      {label}
    </a>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const softwareDevVividEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 36,
  key: "software-dev-vivid",
  name: "Software Dev — Vivid",
  industry: "Software engineer / developer (vivid gradient variant)",
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
  sampleSlug: "demo-software-dev-vivid",
};

export const softwareDevVividSample: SampleData = {
  templateId: 36,
  slug: "demo-software-dev-vivid",
  cardData: {
    name: "Ozan Çelik",
    position: "Full-Stack · Cloud · DX",
    title: "Senior Engineer",
    company: "Freelance",
    email: "ozan@ozancelik.dev",
    phone: "+49 176 334 5678",
    whatsapp: "+49 176 334 5678",
    website: "ozancelik.dev",
    address: "Mitte, Berlin",
    bio: "Web-Apps, die skalieren. APIs, die halten. 7+ Jahre Engineering-Erfahrung.",
    bookingUrl: "https://cal.com/ozancelik/intro",
    sectorKey: "tech",
    services: [
      { title: "Web App Development", description: "Next.js · React · TypeScript", priceLabel: "ab €4.800" },
      { title: "API Integration", description: "REST · GraphQL · Stripe", priceLabel: "ab €1.200" },
      { title: "Tech Consulting", description: "Architecture · code review", priceLabel: "€150/h" },
    ],
    tagline: "Web-Apps, die skalieren. APIs, die halten.",
    stats: [
      { value: "7+", label: "Jahre" },
      { value: "60+", label: "Projekte" },
      { value: "30+", label: "Kunden" },
    ],
    socials: {
      github: "https://github.com/ozancelik",
      linkedin: "https://linkedin.com/in/ozancelik-dev",
      x: "https://x.com/ozancelikdev",
    },
  },
  photoUrl:
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

