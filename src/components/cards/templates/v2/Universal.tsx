"use client";

// =============================================================================
// Universal — sector-agnostic v2 template (id=13, key="universal").
//
// Phase 7.7. Designed as the safe default for any profession the curated 12
// don't directly cover (consultant, coach, freelancer, generalist…). Reads
// well at a glance: a brand-tinted top strip with the owner's name, an
// optional portrait card, a clean contact grid, optional bio, optional
// socials, and a single accent-coloured CTA. No sector-specific iconography.
//
// Locked design choices (do not parameterise):
//   - Top strip: brand primary fill, generous vertical padding, owner name in
//     Geist display, role/title beneath, light-on-dark.
//   - Logo (40 × 40, rounded square) sits top-right on the strip when present;
//     otherwise the owner's initials render as a copper badge.
//   - Photo (64 × 64 circle, hairline ring) sits in a card just below the
//     strip. When `photoPath` is null the card is omitted entirely so the
//     strip → contact grid feels intentional rather than empty.
//   - Contact rows render only the channels the customer filled out — phone,
//     email, website. Each row is a Lucide icon + value, tap-friendly.
//   - Optional bio renders in Inter as a single short paragraph.
//   - Optional socials rendered as a compact icon row beneath the bio.
//   - CTA: brand accent fill, full-width, "Contact me" label localised per
//     visitor locale.
//
// Variable per card: cardData, photoPath, logoPath, brandPrimaryHex (top
// strip), brandAccentHex (CTA / accent details).
// =============================================================================

import * as React from "react";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { SocialRow } from "./shared/SocialRow";
import type { TemplateProps } from "./types";

// -----------------------------------------------------------------------------
// Locked palette — overridable via brandPrimaryHex / brandAccentHex.
// -----------------------------------------------------------------------------
const LOCKED_PRIMARY = "#1a1a1a"; // deep ink top strip
const LOCKED_ACCENT = "#c27940"; // copper CTA / accent

function resolveAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("data:") || path.startsWith("blob:")) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return `/${path}`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "·";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function digitsOnly(value: string): string {
  return value.replace(/[^+0-9]/g, "");
}

interface ContactDef {
  Icon: LucideIcon;
  label: string;
  value: string;
  href: string;
}

interface UniCopy {
  contact: string;
  about: string;
  cta: string;
  elsewhere: string;
}

const COPY: Record<"de" | "en" | "tr", UniCopy> = {
  de: {
    contact: "Kontakt",
    about: "Über mich",
    cta: "Jetzt Kontakt aufnehmen",
    elsewhere: "Weitere Kanäle",
  },
  en: {
    contact: "Get in touch",
    about: "About",
    cta: "Contact me",
    elsewhere: "Elsewhere",
  },
  tr: {
    contact: "İletişim",
    about: "Hakkımda",
    cta: "Bana ulaşın",
    elsewhere: "Diğer kanallar",
  },
};

export function Universal({
  cardData,
  locale = "de",
  photoPath,
  logoPath,
  brandPrimaryHex,
  brandAccentHex,
}: TemplateProps) {
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;
  const copy = COPY[locale] ?? COPY.de;

  const photoUrl = resolveAssetUrl(photoPath);
  const logoUrl = resolveAssetUrl(logoPath);

  // Build the contact rows from whatever the customer actually provided.
  const contactRows: ContactDef[] = [];
  if (cardData.phone) {
    contactRows.push({
      Icon: Phone,
      label: copy.contact,
      value: cardData.phone,
      href: `tel:${digitsOnly(cardData.phone)}`,
    });
  }
  if (cardData.email) {
    contactRows.push({
      Icon: Mail,
      label: "Email",
      value: cardData.email,
      href: `mailto:${cardData.email}`,
    });
  }
  if (cardData.website) {
    const display = cardData.website.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const href = cardData.website.startsWith("http")
      ? cardData.website
      : `https://${cardData.website}`;
    contactRows.push({
      Icon: Globe,
      label: "Website",
      value: display,
      href,
    });
  }
  if (cardData.address) {
    contactRows.push({
      Icon: MapPin,
      label: "Address",
      value: cardData.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(cardData.address)}`,
    });
  }

  // Primary contact target for the CTA — phone wins (strongest intent),
  // then email, then a hash anchor as a last-resort no-op.
  const ctaHref = cardData.phone
    ? `tel:${digitsOnly(cardData.phone)}`
    : cardData.email
      ? `mailto:${cardData.email}`
      : "#contact";

  const subtitleBits: string[] = [];
  if (cardData.title) subtitleBits.push(cardData.title);
  if (cardData.company) subtitleBits.push(cardData.company);
  const subtitle = subtitleBits.join(" · ");

  return (
    <article
      className="universal-card relative mx-auto w-full overflow-hidden bg-white text-[#1a1a1a]"
      style={
        {
          // expose brand colours as custom properties so descendants inherit.
          ["--uni-primary"]: primary,
          ["--uni-accent"]: accent,
        } as React.CSSProperties
      }
    >
      {/* ============================================================
          Top strip — brand primary background, name + role.
          ============================================================ */}
      <header
        className="relative px-7 pb-10 pt-9 text-white"
        style={{ background: primary }}
      >
        {/* Logo or initials badge — top-right. */}
        <div className="absolute right-6 top-6">
          {logoUrl ? (
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white/95 ring-1 ring-white/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt=""
                className="h-full w-full object-contain p-1 tpl-logo"
              />
            </div>
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[12px] font-semibold tracking-wider"
              style={{ background: accent, color: "#1a1a1a" }}
            >
              {getInitials(cardData.name)}
            </div>
          )}
        </div>

        <p
          className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70"
          style={{ fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace" }}
        >
          {copy.contact}
        </p>
        <h1
          className="text-[1.95rem] leading-[1.05] tracking-[-0.02em]"
          style={{
            fontFamily:
              "var(--font-geist), var(--font-inter), system-ui, sans-serif",
            fontWeight: 600,
          }}
        >
          {cardData.name}
        </h1>
        {subtitle && (
          <p
            className="mt-2 text-[0.9rem] leading-snug text-white/75"
            style={{
              fontFamily:
                "var(--font-inter), system-ui, sans-serif",
              fontWeight: 400,
            }}
          >
            {subtitle}
          </p>
        )}

        {/* hairline accent — subtle premium detail */}
        <span
          aria-hidden
          className="absolute bottom-0 left-7 h-px w-12"
          style={{ background: accent }}
        />
      </header>

      {/* ============================================================
          Optional portrait card — only when photoPath is set.
          ============================================================ */}
      {photoUrl && (
        <div className="-mt-6 px-7">
          <div className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-[0_18px_36px_-22px_rgba(15,15,15,0.25)]">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt=""
                className="h-full w-full object-cover tpl-photo"
              />
            </div>
            <div className="min-w-0">
              <p
                className="text-[15px] font-semibold leading-tight text-[#1a1a1a]"
                style={{
                  fontFamily:
                    "var(--font-inter), system-ui, sans-serif",
                }}
              >
                {cardData.name}
              </p>
              {subtitle && (
                <p
                  className="mt-0.5 truncate text-[12px] text-[#6b6b6b]"
                  style={{
                    fontFamily:
                      "var(--font-inter), system-ui, sans-serif",
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          Bio — single short paragraph in Inter.
          ============================================================ */}
      {cardData.bio && (
        <section className="px-7 pt-7">
          <p
            className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#8a8a8a]"
            style={{
              fontFamily:
                "var(--font-jetbrains-mono), ui-monospace, monospace",
            }}
          >
            {copy.about}
          </p>
          <p
            className="mt-2 text-[0.9375rem] leading-relaxed text-[#3a3a3a]"
            style={{
              fontFamily:
                "var(--font-inter), system-ui, sans-serif",
            }}
          >
            {cardData.bio}
          </p>
        </section>
      )}

      {/* ============================================================
          Contact grid — only the channels the customer filled out.
          ============================================================ */}
      {contactRows.length > 0 && (
        <section className="px-7 pt-7" id="contact">
          <p
            className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#8a8a8a]"
            style={{
              fontFamily:
                "var(--font-jetbrains-mono), ui-monospace, monospace",
            }}
          >
            {copy.contact}
          </p>
          <ul className="mt-3 grid gap-2">
            {contactRows.map((row) => (
              <li key={row.label + row.value}>
                <a
                  href={row.href}
                  className="group flex items-center gap-3 rounded-xl border border-black/5 bg-[#fafafa] px-4 py-3 transition-colors hover:border-black/15 hover:bg-white"
                  style={{
                    fontFamily:
                      "var(--font-inter), system-ui, sans-serif",
                  }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: `${accent}20`,
                      color: accent,
                    }}
                  >
                    <row.Icon size={15} strokeWidth={1.9} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13.5px] text-[#1a1a1a]">
                    {row.value}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ============================================================
          Socials — compact icon row.
          ============================================================ */}
      {cardData.socials && Object.values(cardData.socials).some(Boolean) && (
        <section className="px-7 pt-7">
          <p
            className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#8a8a8a]"
            style={{
              fontFamily:
                "var(--font-jetbrains-mono), ui-monospace, monospace",
            }}
          >
            {copy.elsewhere}
          </p>
          <div className="mt-3">
            <SocialRow
              socials={cardData.socials}
              variant="icon"
              accentHex={accent}
            />
          </div>
        </section>
      )}

      {/* ============================================================
          CTA — accent fill, full width.
          ============================================================ */}
      <div className="px-7 pb-9 pt-8">
        <a
          href={ctaHref}
          className="flex w-full items-center justify-center rounded-full px-6 py-3.5 text-[14px] font-semibold tracking-tight transition-transform hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: accent,
            color: "#1a1a1a",
            fontFamily:
              "var(--font-inter), system-ui, sans-serif",
          }}
        >
          {copy.cta}
        </a>
      </div>
    </article>
  );
}

// =============================================================================
// Registry entry & sample
// =============================================================================

import type { TemplateRegistryEntry, SampleData } from "./types";

export const universalEntry: TemplateRegistryEntry = {
  id: 13,
  key: "universal",
  name: "Universal Pro",
  industry: "Any profession · sector-agnostic",
  Component: Universal,
  supports: {
    services: false,
    faqs: false,
    testimonials: false,
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
  sampleSlug: "demo-universal",
};

export const universalSample: SampleData = {
  templateId: 13,
  slug: "demo-universal",
  cardData: {
    name: "Alex Müller",
    title: "Founder & Strategist",
    company: "Müller Consulting",
    email: "alex@mueller-consulting.de",
    phone: "+49 30 1234567",
    website: "https://mueller-consulting.de",
    address: "Berlin, Germany",
    bio: "Independent consultant helping mid-market companies build scalable operations.",
    whatsapp: "+49 30 1234567",
    socials: {
      linkedin: "https://linkedin.com/in/alexmueller",
    },
    designNotes: "",
  },
  photoUrl: null,
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
