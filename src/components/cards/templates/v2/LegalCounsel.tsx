"use client";

// =============================================================================
// LegalCounsel — v2 template (id=2, key="legal-counsel").
//
// Design DNA: Projekt_4k/showcase/kart_02_avukat.html — austere navy + muted
// gold + IBM Plex Serif/Sans. Re-implemented natively in React + Tailwind so
// nothing was literally ported.
//
// Locked design choices (do not parameterise):
//   - No photo. Even when `photoPath` is provided we don't render an avatar:
//     the design is anchored on the logo + typographic restraint.
//   - Logo: top-left squared gradient badge, locked at 44 × 44 px, blue→navy
//     gradient with a 1.5 px gold inner stroke. Monogram fallback when
//     `logoPath` is null.
//   - Palette: dark navy (#0b1426), accent blue (#3b82f6), muted gold
//     (#c8a951). Article surface near-black-blue; light text; gold accents.
//   - Typography: IBM Plex Serif (display, 500/600) + IBM Plex Sans (body,
//     400/500), via `next/font`.
//   - Section rhythm:
//       Header → Profile (name, title, firm) → Practice areas → Testimonials →
//       Contact rows → Wallet/Exchange/SendMyInfo → Social → Footer
//   - Distinctive: muted-gold hairline rules between sections (1 px); 24 × 1.5 px
//     gold underline strip on key headings.
//
// Variable per card: cardData content, logoPath, brandPrimaryHex (overrides
// navy), brandAccentHex (overrides muted gold).
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  FileDown,
  MapPin,
  Quote,
  Scale,
  Shield,
  Star,
} from "lucide-react";

import { encodeSource, describeSource } from "@/components/cards/smart/SmartCardSource";
import { getSectorPreset } from "@/config/card-sectors";
import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { ServiceLink } from "./shared/ServiceLink";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#0b1426";
const LOCKED_ACCENT = "#c8a951";
const ACCENT_BLUE = "#3b82f6";

function resolveAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("data:") || path.startsWith("blob:")) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return `/${path}`;
}

function getInitials(name: string): string {
  const parts = name
    .replace(/^(Dr\.?|Av\.?|Prof\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "·";
  if (parts.length === 1) return (parts[0][0] ?? "·").toUpperCase();
  return (
    (parts[0][0] ?? "").toUpperCase() + (parts[parts.length - 1][0] ?? "").toUpperCase()
  );
}

interface LcCopy {
  practiceAreas: string;
  testimonials: string;
  contact: string;
  social: string;
  walletLabel: string;
  about: string;
  brochureCta: string;
  impressum: string;
  privacy: string;
  poweredBy: string;
  share: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", LcCopy> = {
  de: {
    practiceAreas: "Praxisgebiete",
    testimonials: "Empfehlungen",
    contact: "Kontakt",
    social: "Sozial",
    walletLabel: "Auf das Smartphone speichern",
    about: "Profil",
    brochureCta: "Kanzlei-Profil ansehen",
    impressum: "Impressum",
    privacy: "Datenschutz",
    poweredBy: "Powered by",
    share: "Teilen",
  },
  en: {
    practiceAreas: "Practice Areas",
    testimonials: "Voices",
    contact: "Contact",
    social: "Connect",
    walletLabel: "Add to wallet",
    about: "Profile",
    brochureCta: "View firm profile",
    impressum: "Imprint",
    privacy: "Privacy",
    poweredBy: "Powered by",
    share: "Share",
  },
  tr: {
    practiceAreas: "Uzmanlık Alanları",
    testimonials: "Referanslar",
    contact: "İletişim",
    social: "Sosyal",
    walletLabel: "Cüzdana ekle",
    about: "Profil",
    brochureCta: "Büro profili",
    impressum: "Künye",
    privacy: "Gizlilik",
    poweredBy: "Powered by",
    share: "Paylaş",
  },
  es: {

    practiceAreas: "Áreas de práctica",
    testimonials: "Voces",
    contact: "Contacto",
    social: "Conectar",
    walletLabel: "Añadir a la cartera",
    about: "Perfil",
    brochureCta: "Ver perfil del despacho",
    impressum: "Aviso legal",
    privacy: "Privacidad",
    poweredBy: "Desarrollado por",
    share: "Compartir",
  
  },
  it: {

    practiceAreas: "Aree di pratica",
    testimonials: "Voci",
    contact: "Contatto",
    social: "Connetti",
    walletLabel: "Aggiungi al wallet",
    about: "Profilo",
    brochureCta: "Vedi profilo dello studio",
    impressum: "Impressum",
    privacy: "Privacy",
    poweredBy: "Realizzato con",
    share: "Condividi",
  
  },
  fr: {

    practiceAreas: "Domaines de pratique",
    testimonials: "Témoignages",
    contact: "Contact",
    social: "Connecter",
    walletLabel: "Ajouter au portefeuille",
    about: "Profil",
    brochureCta: "Voir le profil du cabinet",
    impressum: "Mentions légales",
    privacy: "Confidentialité",
    poweredBy: "Propulsé par",
    share: "Partager",
  
  },
  ar: {

    practiceAreas: "مجالات الممارسة",
    testimonials: "أصوات",
    contact: "اتصال",
    social: "تواصل",
    walletLabel: "إضافة إلى المحفظة",
    about: "الملف الشخصي",
    brochureCta: "عرض ملف المكتب",
    impressum: "بيانات النشر",
    privacy: "الخصوصية",
    poweredBy: "مشغل بواسطة",
    share: "مشاركة",
  
  },
};

export function LegalCounsel({
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
  const t = COPY[locale] ?? COPY.de;

  const sector = getSectorPreset(cardData.sectorKey);
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;

  const logoUrl = resolveAssetUrl(logoPath);
  const initials = getInitials(cardData.name);

  const services =
    cardData.services ?? sector?.services;

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  const titleParts = [cardData.position, cardData.title].filter(
    (s): s is string => Boolean(s),
  );

  return (
    <article
      data-template="legal-counsel"
      className={`lc-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[24px] shadow-[0_30px_80px_-30px_rgba(11,20,38,0.55),0_8px_22px_-12px_rgba(11,20,38,0.35)]`}
      style={
        {
          ["--card-primary" as string]: primary,
          ["--card-accent" as string]: accent,
          ["--lc-blue" as string]: ACCENT_BLUE,
          ["--lc-panel" as string]: "#131f38",
          ["--lc-panel-soft" as string]: "#192747",
          ["--lc-panel-border" as string]: "#1e2d4a",
          ["--lc-text" as string]: "#e8ecf2",
          ["--lc-text-mid" as string]: "#8896aa",
          ["--lc-text-dim" as string]: "#5a6a80",
          ["--font-legal-display" as string]: "'IBM Plex Serif', Georgia, serif",
          ["--font-legal-body" as string]: "'IBM Plex Sans', system-ui, sans-serif",
          background: primary,
          color: "#e8ecf2",
        } as React.CSSProperties
      }
    >
      {/* Scoped per-template typography. Only inside `.lc-card`. */}
      <style jsx global>{`
        .lc-card {
          font-family:var(--tpl-font-body,  var(--font-legal-body), "IBM Plex Sans", system-ui, sans-serif);
          line-height: 1.6;
          font-feature-settings: "ss01";
          letter-spacing: 0.005em;
        }
        .lc-card .lc-serif,
        .lc-card h1.lc-serif,
        .lc-card h2.lc-serif,
        .lc-card h3.lc-serif {
          font-family:var(--tpl-font-body,  var(--font-legal-display), "IBM Plex Serif", "Cormorant Garamond", Georgia, serif);
          letter-spacing: -0.005em;
        }
        .lc-card .lc-mono {
          font-family:var(--tpl-font-body,  var(--font-legal-body), "IBM Plex Sans", monospace);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-feature-settings: "ss01", "tnum";
        }
        .lc-card a {
          color: inherit;
        }
      `}</style>

      <Header
        logoUrl={logoUrl}
        initials={initials}
        company={cardData.company}
        firmType={cardData.title}
        accent={accent}
      />

      <ProfileBlock
        name={cardData.name}
        titleParts={titleParts}
        company={cardData.company}
        accent={accent}
        sectorBadge={sector?.name}
        sourceLabel={sourceLabel}
      />

      {cardData.bio && (
        <Section title={t.about} accent={accent}>
          <p className="text-[13.5px] leading-[1.85] text-[var(--lc-text-mid)]">
            {cardData.bio}
          </p>
        </Section>
      )}

      {services && services.length > 0 && (
        <Section title={t.practiceAreas} accent={accent}>
          <ul className="grid gap-2.5">
            {services.slice(0, 6).map((item, i) => (
              <PracticeItem
                key={`${item.title}-${i}`}
                index={i + 1}
                item={item}
                accent={accent}
              />
            ))}
          </ul>
        </Section>
      )}

      {cardData.testimonials && cardData.testimonials.length > 0 && (
        <Section title={t.testimonials} accent={accent}>
          <div className="grid gap-3">
            {cardData.testimonials.slice(0, 3).map((item, i) => (
              <TestimonialCard
                key={`${item.author}-${i}`}
                item={item}
                accent={accent}
              />
            ))}
          </div>
        </Section>
      )}

      <Section title={t.contact} accent={accent}>
        <ContactRows
          cardData={cardData}
          locale={locale}
          variant="hairline"
          accentHex={accent}
          renderRow={(row) => (
            <a
              href={row.href}
              {...(row.external
                ? { target: "_blank", rel: "noopener noreferrer" as const }
                : {})}
              className="group flex items-center gap-4 border-b border-[var(--lc-panel-border)] py-3.5 last:border-b-0"
            >
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md ring-1 ring-inset"
                style={{
                  background: `${accent}12`,
                  color: accent,
                  borderColor: `${accent}33`,
                }}
              >
                <row.Icon size={15} strokeWidth={1.6} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span
                  className="lc-mono text-[9.5px] font-medium"
                  style={{ color: "var(--lc-text-dim)" }}
                >
                  {row.label}
                </span>
                <span className="truncate text-[13.5px] font-medium text-[var(--lc-text)] group-hover:text-white">
                  {row.value}
                </span>
              </span>
              <ArrowUpRight
                size={13}
                strokeWidth={1.8}
                className="ml-auto text-[var(--lc-text-dim)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: accent }}
              />
            </a>
          )}
        />
      </Section>

      <CTASection
        slug={slug}
        sourceQs={sourceQs}
        locale={locale}
        primary={accent}
        accent={ACCENT_BLUE}
      />

      {cardData.brochureUrl && (
        <BrochureStrip
          url={cardData.brochureUrl}
          accent={accent}
          label={t.brochureCta}
        />
      )}

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="border-t border-[var(--lc-panel-border)] px-7 py-6"
          labelClassName="lc-mono mb-3 text-[10px] font-medium"
        >
          <div style={{ ["--card-primary" as string]: accent }}>
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {cardData.socials && (
        <Section title={t.social} accent={accent}>
          <SocialRow
            socials={cardData.socials}
            variant="icon"
            accentHex={accent}
            itemClassName="border-[var(--lc-panel-border)] bg-[var(--lc-panel)] text-[var(--lc-text)] hover:bg-[var(--lc-panel-soft)]"
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
        company={cardData.company}
      />
    </article>
  );
}

// =============================================================================
// Subcomponents
// =============================================================================

function Header({
  logoUrl,
  initials,
  company,
  firmType,
  accent,
}: {
  logoUrl: string | null;
  initials: string;
  company?: string;
  firmType?: string;
  accent: string;
}) {
  return (
    <header
      className="relative flex items-center gap-4 px-7 py-5"
      style={{
        background: "var(--lc-panel)",
        borderBottom: "1px solid var(--lc-panel-border)",
      }}
    >
      {/* Logo badge — locked top-left, 44px square. Blue→navy gradient, gold inner stroke. */}
      <div
        className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[10px]"
        style={{
          background: `linear-gradient(135deg, ${ACCENT_BLUE} 0%, #1d4cab 60%, #0b1426 100%)`,
          boxShadow: `inset 0 0 0 1.5px ${accent}66, 0 6px 14px -6px rgba(0,0,0,0.6)`,
        }}
      >
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={company ? `${company} logo` : "Firm logo"}
            width={64}
            height={64}
            className="h-7 w-7 object-contain tpl-logo"
            unoptimized
          />
        ) : (
          <span
            className="lc-serif text-[14px] font-semibold tracking-[0.06em] text-white"
            style={{ textShadow: "0 1px 1px rgba(0,0,0,0.35)" }}
          >
            {initials}
          </span>
        )}
        {/* Subtle gold corner mark — restraint, not decoration. */}
        <span
          aria-hidden
          className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full"
          style={{ background: accent, opacity: 0.85 }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div
          className="lc-serif truncate text-[15.5px] font-semibold leading-tight"
          style={{ color: accent }}
        >
          {company ?? "Counsel"}
        </div>
        <div
          className="lc-mono mt-1 text-[9.5px] font-medium"
          style={{ color: "var(--lc-text-mid)" }}
        >
          {firmType ?? "Rechtsanwälte"}
        </div>
      </div>

      {/* Right-rail signal: a thin gold rule. */}
      <div
        aria-hidden
        className="h-9 w-[2px] rounded-sm"
        style={{
          background: `linear-gradient(180deg, transparent, ${accent}, transparent)`,
        }}
      />
    </header>
  );
}

function ProfileBlock({
  name,
  titleParts,
  company,
  accent,
  sectorBadge,
  sourceLabel,
}: {
  name: string;
  titleParts: string[];
  company?: string;
  accent: string;
  sectorBadge?: string;
  sourceLabel?: string;
}) {
  return (
    <section
      className="relative px-7 pb-9 pt-10"
      style={{ borderBottom: "1px solid var(--lc-panel-border)" }}
    >
      {/* Gold filigree decoration — top-right corner, restrained */}
      <div
        aria-hidden
        className="absolute right-7 top-7 flex items-center gap-1.5"
      >
        <Scale
          size={13}
          strokeWidth={1.6}
          style={{ color: accent, opacity: 0.85 }}
        />
        <span
          className="block h-px w-6"
          style={{ background: `${accent}66` }}
        />
      </div>

      {sectorBadge && (
        <span
          className="lc-mono mb-5 inline-flex items-center gap-1.5 text-[9.5px] font-semibold"
          style={{ color: accent, opacity: 0.95 }}
        >
          <span
            aria-hidden
            className="block h-px w-6"
            style={{ background: accent }}
          />
          {sectorBadge}
        </span>
      )}

      <h1
        className="lc-serif text-[28px] font-semibold leading-[1.08] text-white"
        style={{ letterSpacing: "-0.01em" }}
      >
        {name}
      </h1>

      {titleParts.length > 0 && (
        <p
          className="mt-2.5 text-[14px] font-medium"
          style={{ color: ACCENT_BLUE }}
        >
          {titleParts.join(" · ")}
        </p>
      )}

      {company && (
        <p
          className="mt-1 text-[12.5px]"
          style={{ color: "var(--lc-text-mid)" }}
        >
          {company}
        </p>
      )}

      {/* Decorative gold strip — kart_02 signature. */}
      <div className="mt-6 flex items-center gap-3">
        <span
          aria-hidden
          className="block h-[1.5px] w-6 rounded-sm"
          style={{ background: accent }}
        />
        <span
          className="lc-mono text-[9px] font-semibold"
          style={{ color: "var(--lc-text-dim)" }}
        >
          Counsel · Strategy · Discretion
        </span>
        <span
          aria-hidden
          className="block h-px flex-1"
          style={{ background: "var(--lc-panel-border)" }}
        />
      </div>

      {sourceLabel && (
        <span
          className="lc-mono absolute right-7 bottom-7 inline-flex rounded-sm border px-2 py-0.5 text-[8.5px] font-medium"
          style={{
            color: "var(--lc-text-mid)",
            borderColor: "var(--lc-panel-border)",
            background: "var(--lc-panel)",
          }}
        >
          {sourceLabel}
        </span>
      )}
    </section>
  );
}

function Section({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="px-7 py-7"
      style={{ borderBottom: "1px solid var(--lc-panel-border)" }}
    >
      <h2 className="lc-serif mb-5 flex items-center gap-3 text-[14px] font-semibold tracking-tight text-white">
        {/* 24 × 1.5 px gold underline strip — kart_02 signature. */}
        <span
          aria-hidden
          className="block h-[1.5px] w-6 rounded-sm"
          style={{ background: accent }}
        />
        {title}
        <span
          aria-hidden
          className="block h-px flex-1"
          style={{ background: "var(--lc-panel-border)" }}
        />
      </h2>
      {children}
    </section>
  );
}

function PracticeItem({
  index,
  item,
  accent,
}: {
  index: number;
  item: { title: string; description?: string; priceLabel?: string; href?: string | null };
  accent: string;
}) {
  return (
    <ServiceLink
      href={item.href}
      className="flex items-start gap-4 rounded-md border px-4 py-3.5 transition-colors hover:border-[color:var(--lc-blue)]"
      style={{
        background: "var(--lc-panel)",
        borderColor: "var(--lc-panel-border)",
      }}
    >
      <span
        className="lc-mono mt-0.5 inline-block min-w-[22px] text-[10px] font-semibold tracking-[0.18em]"
        style={{ color: accent }}
      >
        {String(index).padStart(2, "0")}
      </span>
      <div className="flex-1">
        <h3
          className="lc-serif text-[14px] font-semibold leading-snug text-white"
          style={{ letterSpacing: "-0.005em" }}
        >
          {item.title}
        </h3>
        {item.description && (
          <p
            className="mt-1 text-[12.5px] leading-relaxed"
            style={{ color: "var(--lc-text-mid)" }}
          >
            {item.description}
          </p>
        )}
        {item.priceLabel && (
          <p
            className="lc-mono mt-2 text-[9.5px] font-semibold"
            style={{ color: accent }}
          >
            {item.priceLabel}
          </p>
        )}
      </div>
    </ServiceLink>
  );
}

function TestimonialCard({
  item,
  accent,
}: {
  item: { author: string; role?: string; quote: string };
  accent: string;
}) {
  return (
    <figure
      className="relative rounded-md border px-5 py-5"
      style={{
        background: "var(--lc-panel)",
        borderColor: "var(--lc-panel-border)",
      }}
    >
      <Quote
        aria-hidden
        size={28}
        strokeWidth={1.4}
        className="absolute right-4 top-4"
        style={{ color: accent, opacity: 0.35 }}
      />
      <div
        className="mb-2.5 flex items-center gap-0.5"
        style={{ color: accent }}
        aria-label="5 of 5 stars"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={11} strokeWidth={1.6} fill="currentColor" />
        ))}
      </div>
      <blockquote
        className="lc-serif text-[14px] italic leading-snug"
        style={{ color: "var(--lc-text)" }}
      >
        &ldquo;{item.quote}&rdquo;
      </blockquote>
      <figcaption
        className="lc-mono mt-3 text-[9.5px] font-semibold"
        style={{ color: accent }}
      >
        {item.author}
        {item.role && (
          <span
            className="ml-2 font-normal"
            style={{ color: "var(--lc-text-dim)", letterSpacing: "0.18em" }}
          >
            {item.role}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

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
  return (
    <section
      className="px-7 py-7"
      style={{ borderBottom: "1px solid var(--lc-panel-border)" }}
    >
      <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={primary} locale={locale} />
      <ExchangeSlot slug={slug} primary={accent} locale={locale} />
    </section>
  );
}

function BrochureStrip({
  url,
  accent,
  label,
}: {
  url: string;
  accent: string;
  label: string;
}) {
  return (
    <section
      className="px-7 py-6"
      style={{ borderBottom: "1px solid var(--lc-panel-border)" }}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between gap-3 rounded-md border px-5 py-4 transition-all hover:border-[var(--lc-blue)] hover:bg-[var(--lc-panel-soft)]"
        style={{
          background: "var(--lc-panel)",
          borderColor: "var(--lc-panel-border)",
        }}
      >
        <span className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-md ring-1 ring-inset"
            style={{
              background: `${accent}14`,
              color: accent,
              borderColor: `${accent}33`,
            }}
          >
            <FileDown size={15} strokeWidth={1.8} />
          </span>
          <span className="lc-serif text-[13.5px] font-semibold text-white">
            {label}
          </span>
        </span>
        <ArrowUpRight
          size={16}
          strokeWidth={1.8}
          className="text-[var(--lc-text-mid)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>
    </section>
  );
}

function Footer({
  siteUrl,
  slug,
  impressumUrl,
  privacyUrl,
  accent,
  translations,
  company,
}: {
  siteUrl: string;
  slug: string;
  impressumUrl?: string;
  privacyUrl?: string;
  accent: string;
  translations: LcCopy;
  company?: string;
}) {
  return (
    <footer
      className="relative px-7 pb-7 pt-6"
      style={{ background: "var(--lc-panel)" }}
    >
      <div
        className="lc-serif mb-1 text-[12px] font-semibold"
        style={{ color: accent }}
      >
        {company ?? "Counsel"}
      </div>
      <p
        className="lc-mono mb-4 text-[9px]"
        style={{ color: "var(--lc-text-dim)" }}
      >
        © {new Date().getFullYear()} · All rights reserved
      </p>

      <div
        className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10.5px]"
        style={{ color: "var(--lc-text-dim)" }}
      >
        <FooterShare siteUrl={siteUrl} slug={slug} label={translations.share} />
        {impressumUrl && (
          <a
            href={impressumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            {translations.impressum}
          </a>
        )}
        {privacyUrl && (
          <a
            href={privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            {translations.privacy}
          </a>
        )}
        <span className="ml-auto inline-flex items-center gap-1.5">
          <Shield size={11} strokeWidth={1.6} style={{ color: accent }} />
          {translations.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="lc-serif font-semibold transition-colors hover:opacity-80"
            style={{ color: accent }}
          >
            OpSolid
          </a>
        </span>
      </div>

      <div
        className="mt-4 flex items-center gap-2 border-t pt-4"
        style={{ borderColor: "var(--lc-panel-border)" }}
      >
        <MapPin size={11} strokeWidth={1.6} style={{ color: accent }} />
        <span
          className="lc-mono text-[9.5px]"
          style={{ color: "var(--lc-text-dim)" }}
        >{`opsolid.de/c/${slug}`}</span>
      </div>
    </footer>
  );
}

function FooterShare({
  siteUrl,
  slug,
  label,
}: {
  siteUrl: string;
  slug: string;
  label: string;
}) {
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
            // ignore
          }
        }
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        }
      }}
      className="hover:text-white"
    >
      {label}
    </button>
  );
}

// =============================================================================
// Registry entry & sample
// =============================================================================

export const legalCounselEntry: TemplateRegistryEntry = {
  id: 2,
  key: "legal-counsel",
  name: "Legal Counsel",
  industry: "Lawyer / law firm",
  Component: LegalCounsel,
  supports: {
    services: true,
    faqs: true,
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
  sampleSlug: "demo-legal-counsel",
};

// Sample persona — Munich M&A senior partner, bilingual DE/EN.
// No photo: this template ignores `photoPath` by design.
export const legalCounselSample: SampleData = {
  templateId: 2,
  slug: "demo-legal-counsel",
  cardData: {
    name: "Dr. Konstantin Vogel",
    title: "Senior Partner · LL.M. (Cambridge)",
    position: "Senior Partner",
    company: "Vogel & Reiter Rechtsanwälte",
    email: "k.vogel@vogel-reiter.de",
    phone: "+49 89 4477 1290",
    whatsapp: "+49 172 4477 129",
    website: "https://vogel-reiter.de",
    address: "Maximilianstraße 12, 80539 München, Deutschland",
    bio:
      "Cross-border M&A and corporate counsel for mid-market industrial groups across the DACH region. 18 years at the negotiation table — from carve-outs to joint ventures — and a quiet preference for short letters over long memos. Admitted in Munich and registered with the Solicitors Regulation Authority of England & Wales.",
    bookingUrl: "https://cal.com/vogel-reiter/intro",
    brochureUrl: "https://vogel-reiter.de/profil.pdf",
    impressumUrl: "https://vogel-reiter.de/impressum",
    privacyUrl: "https://vogel-reiter.de/datenschutz",
    sectorKey: "lawyer",
    services: [
      {
        title: "Cross-border M&A",
        description:
          "Sell-side and buy-side mandates for industrial groups. SPA negotiation, regulatory clearance, post-closing integration.",
        priceLabel: "From €450 / hour",
      },
      {
        title: "Corporate & Joint Ventures",
        description:
          "Group restructurings, JV documentation, shareholder dispute resolution. Munich and London playbooks combined.",
      },
      {
        title: "Commercial Litigation",
        description:
          "DIS, ICC and ad-hoc arbitration. Pre-arbitration mediation when the relationship is worth keeping.",
      },
      {
        title: "Compliance & Investigations",
        description:
          "BaFin / Bundeskartellamt enquiries, internal investigations, whistleblower frameworks under the HinSchG.",
      },
    ],
    testimonials: [
      {
        author: "Dr. Helene Brand",
        role: "CFO, Brand Industriegruppe",
        quote:
          "Konstantin negotiates with a calm that the room remembers afterwards. Our €240M divestiture closed three weeks ahead of timeline.",
      },
      {
        author: "Markus Reiter-Holm",
        role: "General Counsel, Reiter Holm AG",
        quote:
          "The shortest, sharpest legal opinions I have ever paid for. He says no when no is the correct answer.",
      },
    ],
    socials: {
      linkedin: "https://linkedin.com/in/konstantin-vogel",
      xing: "https://xing.com/profile/Konstantin_Vogel",
    },
  },
  // No `photoUrl` — template ignores it anyway.
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
