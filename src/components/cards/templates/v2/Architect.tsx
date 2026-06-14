"use client";

// =============================================================================
// Architect — architecture practice / interior design (id=9, key="architect").
//
// Design DNA: Projekt_4k/showcase/kart_09_mimar.html. Bauhaus-meets-warm:
// warm beige (`#f5f5f0`) background, terracotta `#c4654a` accent, deep ink
// `#15120f` text. Manrope across all weights — no serif. Mathematical
// restraint, generous whitespace, hairline rules. The geometric mark in the
// header (square + small terracotta triangle in the corner) is the single
// piece of "decoration" the design allows itself.
//
// Locked design choices (do not parameterise):
//   - No photo. Header-only.
//   - Top-left geometric mark: 32 × 32 ink-square + 8 × 8 terracotta triangle
//     overlapping the bottom-right corner. Replaced by `logoPath` if provided.
//   - Manrope 300/400/500/600/700/800. NO serif anywhere.
//   - Selected projects render text-only with year + location + brief.
//   - Hairline terracotta rules (1 px) between sections.
//   - No backgrounds beyond the warm beige and a single white surface for
//     elevated cards.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Calendar,
  FileDown,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  Shield,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

import { encodeSource, describeSource } from "@/components/cards/smart/SmartCardSource";
import { getSectorPreset } from "@/config/card-sectors";
import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { resolveLabels } from "./shared/resolveLabels";
import type { TemplateProps, TemplateRegistryEntry, SampleData } from "./types";

// -----------------------------------------------------------------------------
// Locked palette — Lisbon Bauhaus letterhead.
// -----------------------------------------------------------------------------
const LOCKED_PRIMARY = "#15120f"; // deep ink
const LOCKED_ACCENT = "#c4654a"; // terracotta
const SURFACE_BEIGE = "#f5f5f0";
const SURFACE_BEIGE_SOFT = "#fafaf6";
const INK_LIGHT = "#5e5852";
const INK_MUTED = "#8c8780";

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

interface ArCopy {
  saveContact: string;
  callNow: string;
  whatsapp: string;
  email: string;
  book: string;
  selectedProjects: string;
  about: string;
  contact: string;
  voices: string;
  social: string;
  studio: string;
  walletLabel: string;
  portfolioCta: string;
  portfolioHint: string;
  impressum: string;
  privacy: string;
  poweredBy: string;
  philosophy: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", ArCopy> = {
  de: {
    saveContact: "Speichern",
    callNow: "Anrufen",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    book: "Termin",
    selectedProjects: "Ausgewählte Projekte",
    about: "Studio",
    contact: "Kontakt",
    voices: "Stimmen",
    social: "Social",
    studio: "Studio",
    walletLabel: "Auf Smartphone speichern",
    portfolioCta: "Portfolio (PDF)",
    portfolioHint: "Vollständige Projektliste",
    impressum: "Impressum",
    privacy: "Datenschutz",
    poweredBy: "Powered by",
    philosophy: "Haltung",
  },
  en: {
    saveContact: "Save contact",
    callNow: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    book: "Book",
    selectedProjects: "Selected projects",
    about: "Studio",
    contact: "Contact",
    voices: "Voices",
    social: "Social",
    studio: "Studio",
    walletLabel: "Add to wallet",
    portfolioCta: "Portfolio (PDF)",
    portfolioHint: "Full project list",
    impressum: "Imprint",
    privacy: "Privacy",
    poweredBy: "Powered by",
    philosophy: "Approach",
  },
  tr: {
    saveContact: "Rehbere kaydet",
    callNow: "Ara",
    whatsapp: "WhatsApp",
    email: "E-posta",
    book: "Randevu",
    selectedProjects: "Seçili projeler",
    about: "Stüdyo",
    contact: "İletişim",
    voices: "Yorumlar",
    social: "Sosyal",
    studio: "Stüdyo",
    walletLabel: "Cüzdana ekle",
    portfolioCta: "Portföy (PDF)",
    portfolioHint: "Tüm projelerin listesi",
    impressum: "Künye",
    privacy: "Gizlilik",
    poweredBy: "Powered by",
    philosophy: "Yaklaşım",
  },
  es: {

    saveContact: "Guardar contacto",
    callNow: "Llamar",
    whatsapp: "WhatsApp",
    email: "Correo",
    book: "Reservar",
    selectedProjects: "Proyectos seleccionados",
    about: "Estudio",
    contact: "Contacto",
    voices: "Voces",
    social: "Redes",
    studio: "Estudio",
    walletLabel: "Añadir a la cartera",
    portfolioCta: "Portafolio (PDF)",
    portfolioHint: "Lista completa de proyectos",
    impressum: "Aviso legal",
    privacy: "Privacidad",
    poweredBy: "Desarrollado por",
    philosophy: "Enfoque",
  
  },
  it: {

    saveContact: "Salva contatto",
    callNow: "Chiama",
    whatsapp: "WhatsApp",
    email: "Email",
    book: "Prenota",
    selectedProjects: "Progetti selezionati",
    about: "Studio",
    contact: "Contatto",
    voices: "Voci",
    social: "Social",
    studio: "Studio",
    walletLabel: "Aggiungi al wallet",
    portfolioCta: "Portfolio (PDF)",
    portfolioHint: "Elenco completo dei progetti",
    impressum: "Impressum",
    privacy: "Privacy",
    poweredBy: "Realizzato con",
    philosophy: "Approccio",
  
  },
  fr: {

    saveContact: "Enregistrer le contact",
    callNow: "Appeler",
    whatsapp: "WhatsApp",
    email: "E-mail",
    book: "Réserver",
    selectedProjects: "Projets sélectionnés",
    about: "Studio",
    contact: "Contact",
    voices: "Témoignages",
    social: "Réseaux",
    studio: "Studio",
    walletLabel: "Ajouter au portefeuille",
    portfolioCta: "Portfolio (PDF)",
    portfolioHint: "Liste complète des projets",
    impressum: "Mentions légales",
    privacy: "Confidentialité",
    poweredBy: "Propulsé par",
    philosophy: "Approche",
  
  },
  ar: {

    saveContact: "حفظ جهة الاتصال",
    callNow: "اتصال",
    whatsapp: "واتساب",
    email: "البريد الإلكتروني",
    book: "احجز",
    selectedProjects: "مشاريع مختارة",
    about: "استوديو",
    contact: "اتصال",
    voices: "أصوات",
    social: "التواصل",
    studio: "استوديو",
    walletLabel: "إضافة إلى المحفظة",
    portfolioCta: "المعرض (PDF)",
    portfolioHint: "قائمة المشاريع الكاملة",
    impressum: "بيانات النشر",
    privacy: "الخصوصية",
    poweredBy: "مشغل بواسطة",
    philosophy: "النهج",
  
  },
};

export function Architect({
  slug,
  cardData,
  locale = "de",
  logoPath,
  brandPrimaryHex,
  brandAccentHex,
  source,
  siteUrl,
  walletSlot,
}: TemplateProps) {
  // Architect is photo-less by design — `photoPath` intentionally not consumed.
  const t = resolveLabels(COPY[locale] ?? COPY.de, cardData.labels);

  const sector = getSectorPreset(cardData.sectorKey);
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;

  const logoUrl = resolveAssetUrl(logoPath);

  const projects =
    cardData.services ?? sector?.services;

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  return (
    <article
      data-template="architect"
      className={`ar-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(21,18,15,0.22),0_8px_20px_-12px_rgba(21,18,15,0.10)] ring-1 ring-[rgba(21,18,15,0.06)]`}
      style={
        {
          ["--ar-primary" as string]: primary,
          ["--ar-accent" as string]: accent,
          ["--ar-accent-soft" as string]: `${accent}1A`,
          ["--card-primary" as string]: primary,
          ["--card-accent" as string]: accent,
          ["--font-architect" as string]: "'Manrope', sans-serif",
          background: SURFACE_BEIGE,
          color: primary,
          fontFamily: "var(--font-architect), system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .ar-card {
          font-family:var(--tpl-font-body,  var(--font-architect), "Manrope", system-ui, sans-serif);
          line-height: 1.65;
        }
        .ar-card .ar-display {
          font-family:var(--tpl-font-body,  var(--font-architect), "Manrope", system-ui, sans-serif);
          letter-spacing: -0.018em;
          font-weight: 700;
        }
        .ar-card .ar-mono {
          font-family:var(--tpl-font-body,  var(--font-architect), "Manrope", system-ui, sans-serif);
          letter-spacing: 0.32em;
          text-transform: uppercase;
          font-feature-settings: "tnum";
          font-weight: 600;
        }
      `}</style>

      <Header
        logoUrl={logoUrl}
        company={cardData.company || cardData.name}
        primary={primary}
        accent={accent}
        sectorBadge={sector?.name}
        sourceLabel={sourceLabel}
        translations={t}
      />

      <Profile
        name={cardData.name}
        title={cardData.position || cardData.title}
        bio={cardData.bio}
        accent={accent}
      />

      {projects && projects.length > 0 && (
        <SelectedProjects items={projects} accent={accent} title={t.selectedProjects} />
      )}

      <Philosophy
        bio={cardData.bio}
        accent={accent}
        title={t.philosophy}
      />

      <QuickActionStrip
        slug={slug}
        sourceQs={sourceQs}
        phoneDigits={phoneDigits}
        waDigits={waDigits}
        email={cardData.email}
        bookingUrl={cardData.bookingUrl}
        primary={primary}
        accent={accent}
        translations={t}
      />

      {cardData.testimonials && cardData.testimonials.length > 0 && (
        <Testimonials items={cardData.testimonials} accent={accent} title={t.voices} />
      )}

      {cardData.brochureUrl && (
        <BrochureStrip
          url={cardData.brochureUrl}
          accent={accent}
          translations={t}
        />
      )}

      <Section title={t.contact} accent={accent}>
        <ContactRows
          cardData={cardData}
          locale={locale}
          variant="hairline"
          accentHex={accent}
          rowClassName="!border-[rgba(21,18,15,0.10)] hover:text-[var(--ar-accent)]"
        />
      </Section>

      <CTASection
        slug={slug}
        sourceQs={sourceQs}
        locale={locale}
        primary={primary}
        accent={accent}
      />

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="border-t border-[rgba(21,18,15,0.10)] px-7 py-5"
          labelClassName="ar-mono mb-3 text-[9.5px]"
        >
          {walletSlot}
        </WalletDock>
      )}

      {cardData.socials && (
        <Section title={t.social} accent={accent}>
          <SocialRow
            socials={cardData.socials}
            variant="pill"
            accentHex={primary}
            itemClassName="!border-[rgba(21,18,15,0.12)] !bg-white !text-[var(--ar-primary)] hover:!border-[var(--ar-accent)] hover:!text-[var(--ar-accent)]"
          />
        </Section>
      )}

      <Footer
        siteUrl={siteUrl}
        slug={slug}
        impressumUrl={cardData.impressumUrl}
        privacyUrl={cardData.privacyUrl}
        accent={accent}
        translations={t}
      />
    </article>
  );
}

// =============================================================================
// HEADER — geometric mark or logo, studio name in Manrope semibold.
// =============================================================================

function Header({
  logoUrl,
  company,
  primary,
  accent,
  sectorBadge,
  sourceLabel,
  translations,
}: {
  logoUrl: string | null;
  company: string;
  primary: string;
  accent: string;
  sectorBadge?: string;
  sourceLabel?: string;
  translations: ArCopy;
}) {
  return (
    <header
      className="relative flex items-start gap-4 px-7 py-7"
      style={{ background: "white" }}
    >
      {/* Geometric mark — 32 × 32 ink square + 8 × 8 terracotta triangle. */}
      <div className="relative h-[34px] w-[34px] shrink-0">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${company} logo`}
            width={68}
            height={68}
            unoptimized
            className="h-[34px] w-[34px] object-contain tpl-logo"
          />
        ) : (
          <>
            <div
              className="absolute left-0 top-0 h-[26px] w-[26px]"
              style={{ border: `2px solid ${primary}` }}
              aria-hidden
            />
            <div
              className="absolute bottom-0 right-0 h-0 w-0"
              aria-hidden
              style={{
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderBottom: `12px solid ${accent}`,
              }}
            />
          </>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <span
          className="ar-mono block text-[8.5px]"
          style={{ color: INK_MUTED }}
        >
          {translations.studio}
        </span>
        <h1
          className="ar-display mt-1 text-[1.05rem] leading-tight"
          style={{ color: primary, letterSpacing: "0.02em" }}
        >
          {company}
        </h1>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        {sectorBadge && (
          <span
            className="ar-mono inline-block border px-2 py-1 text-[8.5px] font-semibold"
            style={{
              borderColor: `${accent}55`,
              color: accent,
              background: `${accent}0d`,
            }}
          >
            {sectorBadge}
          </span>
        )}
        {sourceLabel && (
          <span
            className="ar-mono inline-block border px-2 py-1 text-[8.5px]"
            style={{
              borderColor: "rgba(21,18,15,0.10)",
              color: INK_MUTED,
            }}
          >
            {sourceLabel}
          </span>
        )}
      </div>
    </header>
  );
}

// =============================================================================
// Profile — architect name + role + bio. Calm, generous whitespace.
// =============================================================================

function Profile({
  name,
  title,
  bio,
  accent,
}: {
  name: string;
  title?: string;
  bio?: string;
  accent: string;
}) {
  return (
    <section
      className="px-7 py-9"
      style={{ borderTop: "1px solid rgba(21,18,15,0.08)" }}
    >
      <h2
        className="ar-display text-[1.7rem] leading-[1.15]"
        style={{ color: LOCKED_PRIMARY, letterSpacing: "-0.02em" }}
      >
        {name}
      </h2>
      {title && (
        <p
          className="mt-2 text-[12.5px] font-medium"
          style={{ color: INK_LIGHT }}
        >
          {title}
        </p>
      )}

      <div
        aria-hidden
        className="mt-6 h-px w-12"
        style={{ background: accent }}
      />

      {bio && (
        <p
          className="mt-6 text-[13.5px] leading-[1.85]"
          style={{ color: INK_LIGHT }}
        >
          {bio}
        </p>
      )}
    </section>
  );
}

// =============================================================================
// Section — minimal frame, Manrope mono uppercase title + terracotta rule.
// =============================================================================

function Section({
  title,
  accent,
  children,
  background,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
  background?: string;
}) {
  return (
    <section
      className="px-7 py-8"
      style={{
        background: background ?? "transparent",
        borderTop: "1px solid rgba(21,18,15,0.08)",
      }}
    >
      <div className="mb-6 flex items-center gap-3">
        <h2
          className="ar-mono text-[10px]"
          style={{ color: accent }}
        >
          {title}
        </h2>
        <span
          aria-hidden
          className="block h-px flex-1"
          style={{ background: "rgba(21,18,15,0.12)" }}
        />
      </div>
      {children}
    </section>
  );
}

// =============================================================================
// SelectedProjects — text-only ledger. Number + name + year + location + brief.
//   Uses services: title (project name), priceLabel (year), description (brief
//   that may contain "Lisbon · Restoration" — keeping data flexible).
// =============================================================================

function SelectedProjects({
  items,
  accent,
  title,
}: {
  items: Array<{ title: string; description?: string; priceLabel?: string }>;
  accent: string;
  title: string;
}) {
  return (
    <section
      className="px-7 py-8"
      style={{ borderTop: "1px solid rgba(21,18,15,0.08)" }}
    >
      <div className="mb-6 flex items-center gap-3">
        <h2
          className="ar-mono text-[10px]"
          style={{ color: accent }}
        >
          {title}
        </h2>
        <span
          aria-hidden
          className="block h-px flex-1"
          style={{ background: "rgba(21,18,15,0.12)" }}
        />
      </div>

      <ol className="space-y-5">
        {items.slice(0, 6).map((item, i) => (
          <li
            key={`${item.title}-${i}`}
            className="grid grid-cols-[28px_1fr_auto] gap-x-4 gap-y-1"
          >
            <span
              className="ar-mono pt-0.5 text-[10px] tabular-nums"
              style={{ color: INK_MUTED }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3
              className="ar-display text-[14.5px] leading-tight"
              style={{ color: LOCKED_PRIMARY, fontWeight: 600 }}
            >
              {item.title}
            </h3>
            {item.priceLabel && (
              <span
                className="ar-mono shrink-0 self-start pt-1 text-[9px] tabular-nums"
                style={{ color: accent }}
              >
                {item.priceLabel}
              </span>
            )}
            {item.description && (
              <p
                className="col-start-2 col-end-4 text-[12.5px] leading-snug"
                style={{ color: INK_LIGHT }}
              >
                {item.description}
              </p>
            )}
            {/* Terracotta hairline rule — the single decorative gesture. */}
            <span
              aria-hidden
              className="col-start-2 col-end-4 mt-3 block h-px"
              style={{
                background: `linear-gradient(90deg, ${accent}55 0%, transparent 60%)`,
              }}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}

// =============================================================================
// Philosophy — single-paragraph studio statement. Italic-style emphasis.
// =============================================================================

function Philosophy({
  bio,
  accent,
  title,
}: {
  bio?: string;
  accent: string;
  title: string;
}) {
  if (!bio) return null;
  // Re-derives a "philosophy" sentence by taking the longest sentence in the bio.
  // For sample/demo we just truncate. Real cards can put their statement in
  // designNotes if they want a different shape — keeping this template simple.
  return (
    <section
      className="px-7 py-9"
      style={{
        background: SURFACE_BEIGE_SOFT,
        borderTop: "1px solid rgba(21,18,15,0.08)",
      }}
    >
      <div className="mb-5 flex items-center gap-3">
        <h2
          className="ar-mono text-[10px]"
          style={{ color: accent }}
        >
          {title}
        </h2>
        <span
          aria-hidden
          className="block h-px flex-1"
          style={{ background: "rgba(21,18,15,0.12)" }}
        />
      </div>

      <blockquote
        className="border-l-2 pl-5 text-[14px] leading-[1.85]"
        style={{
          borderColor: accent,
          color: LOCKED_PRIMARY,
          fontWeight: 400,
        }}
      >
        {bio}
      </blockquote>
    </section>
  );
}

// =============================================================================
// Quick action pills — minimal, hairline borders, terracotta accent on save.
// =============================================================================

function QuickActionStrip({
  slug,
  sourceQs,
  phoneDigits,
  waDigits,
  email,
  bookingUrl,
  primary,
  accent,
  translations,
}: {
  slug: string;
  sourceQs: string;
  phoneDigits: string;
  waDigits: string;
  email?: string;
  bookingUrl?: string;
  primary: string;
  accent: string;
  translations: ArCopy;
}) {
  void primary;
  type Pill = {
    label: string;
    href: string;
    Icon: LucideIcon;
    tone: "accent" | "neutral";
    download?: boolean;
    external?: boolean;
  };

  const pills: Pill[] = [
    {
      label: translations.saveContact,
      href: `/api/cards/${encodeURIComponent(slug)}/vcard${sourceQs}`,
      Icon: UserPlus,
      tone: "accent",
      download: true,
    },
  ];
  if (phoneDigits) {
    pills.push({
      label: translations.callNow,
      href: `tel:${phoneDigits}`,
      Icon: Phone,
      tone: "neutral",
    });
  }
  if (waDigits) {
    pills.push({
      label: translations.whatsapp,
      href: `https://wa.me/${waDigits}`,
      Icon: MessageCircle,
      tone: "neutral",
      external: true,
    });
  }
  if (email) {
    pills.push({
      label: translations.email,
      href: `mailto:${email}`,
      Icon: Mail,
      tone: "neutral",
    });
  }
  if (bookingUrl) {
    pills.push({
      label: translations.book,
      href: bookingUrl,
      Icon: Calendar,
      tone: "neutral",
      external: true,
    });
  }

  return (
    <div
      className="grid grid-cols-2 gap-2 px-7 pb-6 pt-7 sm:grid-cols-3"
      style={{ borderTop: "1px solid rgba(21,18,15,0.08)" }}
    >
      {pills.map((p, i) => {
        const isAccent = p.tone === "accent";
        const ext = p.external
          ? { target: "_blank", rel: "noopener noreferrer" as const }
          : {};
        return (
          <a
            key={`${p.label}-${i}`}
            href={p.href}
            download={p.download}
            {...ext}
            className="ar-mono group relative flex items-center justify-center gap-2 border px-3 py-3 text-[9.5px] font-semibold transition-all hover:-translate-y-px"
            style={
              isAccent
                ? {
                    background: accent,
                    borderColor: accent,
                    color: "white",
                    boxShadow: `0 6px 16px -10px ${accent}A6`,
                  }
                : {
                    background: "white",
                    borderColor: "rgba(21,18,15,0.12)",
                    color: LOCKED_PRIMARY,
                  }
            }
          >
            <p.Icon size={12} strokeWidth={1.8} />
            <span className="leading-none">{p.label}</span>
          </a>
        );
      })}
    </div>
  );
}

// =============================================================================
// Testimonials — minimal hairline cards.
// =============================================================================

function Testimonials({
  items,
  accent,
  title,
}: {
  items: Array<{ author: string; role?: string; quote: string }>;
  accent: string;
  title: string;
}) {
  return (
    <Section title={title} accent={accent} background={SURFACE_BEIGE_SOFT}>
      <div className="grid gap-4">
        {items.slice(0, 3).map((item, i) => (
          <figure
            key={`${item.author}-${i}`}
            className="relative border bg-white p-5"
            style={{ borderColor: "rgba(21,18,15,0.10)" }}
          >
            <Quote
              aria-hidden
              size={20}
              strokeWidth={1.4}
              className="absolute right-4 top-4 opacity-30"
              style={{ color: accent }}
            />
            <blockquote
              className="text-[13px] leading-[1.75]"
              style={{ color: LOCKED_PRIMARY }}
            >
              {item.quote}
            </blockquote>
            <figcaption
              className="ar-mono mt-4 text-[9px]"
              style={{ color: accent }}
            >
              {item.author}
              {item.role && (
                <span
                  className="ml-2 font-medium"
                  style={{ color: INK_MUTED }}
                >
                  · {item.role}
                </span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

// =============================================================================
// BrochureStrip — portfolio PDF download in restrained terracotta.
// =============================================================================

function BrochureStrip({
  url,
  accent,
  translations,
}: {
  url: string;
  accent: string;
  translations: ArCopy;
}) {
  return (
    <section
      className="px-7 py-7"
      style={{ borderTop: "1px solid rgba(21,18,15,0.08)" }}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 border px-5 py-4 transition-all hover:-translate-y-px"
        style={{
          borderColor: `${accent}55`,
          background: `${accent}0d`,
        }}
      >
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm"
          style={{ background: accent, color: "white" }}
        >
          <FileDown size={16} strokeWidth={1.8} />
        </span>
        <span className="flex-1">
          <span
            className="ar-display block text-[14px]"
            style={{ color: LOCKED_PRIMARY }}
          >
            {translations.portfolioCta}
          </span>
          <span
            className="ar-mono mt-0.5 block text-[9px]"
            style={{ color: accent }}
          >
            {translations.portfolioHint}
          </span>
        </span>
        <ArrowUpRight
          size={16}
          strokeWidth={1.8}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          style={{ color: accent }}
        />
      </a>
    </section>
  );
}

// =============================================================================
// CTA section — Wallet/Exchange/SendMyInfo wrappers.
// =============================================================================

function CTASection({
  slug,
  sourceQs,
  locale,
  primary,
  accent,
}: {
  slug: string;
  sourceQs: string;
  locale: "de" | "en" | "tr" | "es" | "it" | "fr" | "ar";
  primary: string;
  accent: string;
}) {
  void primary;
  return (
    <section
      className="px-7 py-3"
      style={{ borderTop: "1px solid rgba(21,18,15,0.08)" }}
    >
      <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={accent} locale={locale} />
      <ExchangeSlot slug={slug} primary={accent} locale={locale} />
    </section>
  );
}

// =============================================================================
// Footer — beige band signature.
// =============================================================================

function Footer({
  siteUrl,
  slug,
  impressumUrl,
  privacyUrl,
  accent,
  translations,
}: {
  siteUrl: string;
  slug: string;
  impressumUrl?: string;
  privacyUrl?: string;
  accent: string;
  translations: ArCopy;
}) {
  return (
    <footer
      className="relative px-7 pb-7 pt-7"
      style={{
        background: "white",
        color: INK_MUTED,
        borderTop: "1px solid rgba(21,18,15,0.10)",
      }}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10.5px]">
        <FooterShare siteUrl={siteUrl} slug={slug} />
        {impressumUrl && (
          <a
            href={impressumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--ar-primary)]"
          >
            {translations.impressum}
          </a>
        )}
        {privacyUrl && (
          <a
            href={privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--ar-primary)]"
          >
            {translations.privacy}
          </a>
        )}
        <span className="ml-auto inline-flex items-center gap-1.5">
          <Shield size={11} strokeWidth={1.8} />
          {translations.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="ar-mono font-semibold transition-colors hover:text-[var(--ar-primary)]"
            style={{ color: accent }}
          >
            OpSolid
          </a>
        </span>
      </div>

      <div
        className="mt-4 flex items-center gap-2 pt-4"
        style={{ borderTop: "1px solid rgba(21,18,15,0.08)" }}
      >
        <MapPin size={11} strokeWidth={1.6} style={{ color: accent }} />
        <span className="ar-mono text-[9.5px]" style={{ color: INK_MUTED }}>
          {`opsolid.de/c/${slug}`}
        </span>
      </div>
    </footer>
  );
}

function FooterShare({ siteUrl, slug }: { siteUrl: string; slug: string }) {
  const url = `${siteUrl}/c/${slug}`;
  return (
    <button
      type="button"
      onClick={async () => {
        if (typeof navigator !== "undefined" && "share" in navigator) {
          try {
            await navigator.share({ url, title: "Smart Card" });
            return;
          } catch {
            // User cancelled — fall through.
          }
        }
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        }
      }}
      className="hover:text-[var(--ar-primary)]"
      style={{ color: INK_MUTED }}
    >
      Share
    </button>
  );
}

// =============================================================================
// Registry entry + sample data.
// =============================================================================

export const architectEntry: TemplateRegistryEntry = {
  id: 9,
  key: "architect",
  name: "Architect",
  industry: "Architect / design studio / interior designer",
  Component: Architect,
  supports: {
    services: true, // selected projects
    faqs: false,
    testimonials: true,
    gallery: false,
    video: false,
    brochure: true,
    socials: true,
    themeSwitch: false,
    photo: false,
    logo: true,
  },
  defaults: {
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "sample-architect",
};

export const architectSample: SampleData = {
  templateId: 9,
  slug: "sample-architect",
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
  cardData: {
    name: "Maya Ikari",
    title: "Founder, principal architect",
    position: "Founder · Principal architect",
    company: "Studio Ikari",
    email: "studio@studioikari.pt",
    phone: "+351 21 888 4204",
    whatsapp: "+351 91 472 0188",
    website: "https://studioikari.pt",
    address: "Rua das Flores 88, 1200-194 Lisboa",
    bio: "Studio Ikari is a Lisbon-based architecture practice working at the intersection of restoration and contemporary intervention. Founded in 2017, the studio takes on a small number of projects each year — typically townhouses, ateliers and pavilions — and treats each as a sustained conversation with the place it sits in.",
    bookingUrl: "https://cal.com/studio-ikari/intro",
    brochureUrl: "https://studioikari.pt/portfolio.pdf",
    sectorKey: "consultant",
    services: [
      {
        title: "Casa Pelourinho",
        description:
          "Restoration of an 18th-century townhouse in Alfama. Original chestnut floors retained; rear façade rebuilt in lime-rendered concrete. 320 m².",
        priceLabel: "2024 · Lisbon",
      },
      {
        title: "Algés Townhouse",
        description:
          "Ground-up four-storey family house overlooking the Tagus estuary. Reinforced concrete frame, charred-cedar cladding, garden wall in handmade brick.",
        priceLabel: "2023 · Algés",
      },
      {
        title: "Setúbal Atelier",
        description:
          "Conversion of a former cooperage into a ceramicist's studio and apartment. North-light skylights, exposed king-post roof.",
        priceLabel: "2023 · Setúbal",
      },
      {
        title: "Sintra Studio",
        description:
          "Garden studio for a translator working in three languages. 28 m² in granite block with a single tall window facing the Serra de Sintra.",
        priceLabel: "2022 · Sintra",
      },
      {
        title: "Belém Pavilion",
        description:
          "Temporary exhibition pavilion for the Lisbon Architecture Triennale. Cross-laminated timber and corrugated polycarbonate.",
        priceLabel: "2021 · Belém",
      },
    ],
    testimonials: [
      {
        author: "Tiago Salgueiro",
        role: "Casa Pelourinho client",
        quote:
          "Maya treated the building's age as an asset. We kept everything we expected to lose and gained a house that feels older and lighter at once.",
      },
      {
        author: "Architecture Today",
        role: "Editorial, 2024",
        quote:
          "Studio Ikari's restraint is the substance of the work, not the absence of it. Few practices read a place this carefully.",
      },
    ],
    gallery: [
      { src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80", alt: "Casa Pelourinho façade" },
      { src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80", alt: "Algés Townhouse interior" },
      { src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80", alt: "Setúbal Atelier light study" },
    ],
    socials: {
      instagram: "https://instagram.com/studio.ikari",
      linkedin: "https://linkedin.com/company/studio-ikari",
    },
    impressumUrl: "https://studioikari.pt/imprint",
    privacyUrl: "https://studioikari.pt/privacy",
  },
};
