"use client";

// =============================================================================
// Atelier — v2 template (id=12, key="atelier").  Cross-industry minimalist.
//
// Design DNA: layouts/v10_minimal.html + the brief "single sheet of cream
// stationery from a Parisian advisor — typography-only, breath, and
// restraint." Designers, advisors, executives, anyone whose brand is
// "less is more".
//
// Locked design choices (do not parameterise):
//   - Photo: OPTIONAL framed portrait — 96 × 120 px hairline-bordered rect,
//     top-right of the hero so typography breathes left. Omit entirely if null.
//   - Logo: top-left wordmark in Instrument Serif italic, smaller than the
//     name. Personal letterhead feel.
//   - Palette: bg #fafaf7 (barely-warm cream), text #1a1a1a, accent muted-rust
//     #9a4f3e. NO bold serif. NO mono. Restraint is the entire game.
//   - Section rhythm:
//       Header (italic wordmark) → Display name (Instrument Serif) →
//       optional framed portrait → About (one short paragraph) →
//       Selected work / services (3-4 plain entries with hairline rules
//       between, no decoration) → Contact (3 lines, no icons) →
//       Wallet/Exchange/SendMyInfo → Social (text-link list) → Footer.
//   - Typography: Instrument Serif (h, 400 — italic for wordmark) + Inter
//     (b, 400/500). Scoped via `.at-card`.
//   - Hover states are subtle text-color shifts only — no transforms.
//
// Variable per card: cardData, photoPath (optional), logoPath, brandPrimaryHex
// (overrides #1a1a1a), brandAccentHex (overrides muted-rust).
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { Shield } from "lucide-react";

import { encodeSource, describeSource } from "@/components/cards/smart/SmartCardSource";
import { getSectorPreset } from "@/config/card-sectors";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { WalletDock } from "./shared/WalletDock";
import type { TemplateProps } from "./types";

// -----------------------------------------------------------------------------
// Locked palette.
// -----------------------------------------------------------------------------
const LOCKED_PRIMARY = "#1a1a1a"; // ink
const LOCKED_ACCENT = "#9a4f3e"; // muted rust
const SURFACE = "#fafaf7"; // barely-warm cream
const TEXT_DARK = "#1a1a1a";
const TEXT_MID = "#4a4a4a";
const TEXT_LIGHT = "#8a8a8a";
const HAIRLINE = "rgba(26,26,26,0.10)";

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

interface AtCopy {
  selectedWork: string;
  contact: string;
  social: string;
  walletLabel: string;
  saveContact: string;
  brochure: string;
  impressum: string;
  privacy: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr", AtCopy> = {
  de: {
    selectedWork: "Ausgewählte Arbeiten",
    contact: "Kontakt",
    social: "Verbindung",
    walletLabel: "Auf Smartphone speichern",
    saveContact: "Speichern",
    brochure: "Mappe",
    impressum: "Impressum",
    privacy: "Datenschutz",
    poweredBy: "Powered by",
  },
  en: {
    selectedWork: "Selected work",
    contact: "Contact",
    social: "Elsewhere",
    walletLabel: "Add to wallet",
    saveContact: "Save contact",
    brochure: "Folio",
    impressum: "Imprint",
    privacy: "Privacy",
    poweredBy: "Powered by",
  },
  tr: {
    selectedWork: "Seçilmiş çalışmalar",
    contact: "İletişim",
    social: "Diğer mecralar",
    walletLabel: "Cüzdana ekle",
    saveContact: "Rehbere kaydet",
    brochure: "Klasör",
    impressum: "Künye",
    privacy: "Gizlilik",
    poweredBy: "Powered by",
  },
};

const SOCIAL_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  x: "X",
  youtube: "YouTube",
  tiktok: "TikTok",
  github: "GitHub",
  facebook: "Facebook",
  xing: "Xing",
};

export function Atelier({
  slug,
  cardData,
  locale = "de",
  photoPath,
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

  const photoUrl = resolveAssetUrl(photoPath);
  const logoUrl = resolveAssetUrl(logoPath);

  const services =
    cardData.services && cardData.services.length > 0
      ? cardData.services.slice(0, 4)
      : sector?.services?.slice(0, 4);

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  const subtitle = [cardData.position, cardData.title].filter(Boolean).join(" · ");

  return (
    <article
      data-template="atelier"
      className={`at-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(26,26,26,0.20),0_8px_22px_-12px_rgba(26,26,26,0.10)] ring-1 ring-black/[0.04]`}
      style={
        {
          background: SURFACE,
          color: TEXT_DARK,
          ["--at-primary" as string]: primary,
          ["--at-accent" as string]: accent,
          ["--at-hairline" as string]: HAIRLINE,
          ["--font-atelier-display" as string]: "'Instrument Serif', Georgia, serif",
          ["--font-atelier-body" as string]: "'Inter', system-ui, sans-serif",
          fontFamily: "var(--font-atelier-body), 'Inter', system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .at-card {
          font-family: var(--font-atelier-body), "Inter", system-ui, sans-serif;
          line-height: 1.7;
          color: ${TEXT_DARK};
        }
        .at-card .at-display {
          font-family: var(--font-atelier-display), "Instrument Serif", "Cormorant Garamond", Georgia, serif;
          font-weight: 400;
          letter-spacing: -0.005em;
        }
        .at-card .at-italic {
          font-family: var(--font-atelier-display), "Instrument Serif", "Cormorant Garamond", Georgia, serif;
          font-weight: 400;
          font-style: italic;
        }
        .at-card a.at-link {
          color: ${TEXT_DARK};
          transition: color 0.18s ease;
        }
        .at-card a.at-link:hover {
          color: var(--at-accent);
        }
      `}</style>

      <Hero
        photoUrl={photoUrl}
        logoUrl={logoUrl}
        company={cardData.company}
        name={cardData.name}
        subtitle={subtitle}
        accent={accent}
        sectorBadge={sector?.name}
        sourceLabel={sourceLabel}
      />

      {cardData.bio && <AboutSection bio={cardData.bio} />}

      {services && services.length > 0 && (
        <SelectedWork items={services} title={t.selectedWork} accent={accent} />
      )}

      <ContactBlock
        cardData={cardData}
        title={t.contact}
        accent={accent}
      />

      <CTABlock
        slug={slug}
        sourceQs={sourceQs}
        locale={locale}
        primary={primary}
        accent={accent}
        saveContactLabel={t.saveContact}
      />

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="border-t px-7 py-6"
          labelClassName="at-italic mb-3 text-[12px] text-[var(--at-accent)]"
        >
          {walletSlot}
        </WalletDock>
      )}

      {cardData.socials && (
        <SocialBlock
          socials={cardData.socials}
          title={t.social}
          accent={accent}
        />
      )}

      {cardData.brochureUrl && (
        <BrochureBlock url={cardData.brochureUrl} label={t.brochure} accent={accent} />
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
// HERO — italic wordmark left, optional framed portrait right, display name
// below as the visual anchor. Generous breath.
// =============================================================================

function Hero({
  photoUrl,
  logoUrl,
  company,
  name,
  subtitle,
  accent,
  sectorBadge,
  sourceLabel,
}: {
  photoUrl: string | null;
  logoUrl: string | null;
  company?: string;
  name: string;
  subtitle: string;
  accent: string;
  sectorBadge?: string;
  sourceLabel?: string;
}) {
  return (
    <header className="relative px-7 pb-9 pt-9">
      {/* Top row: wordmark left + sector pill right */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              width={56}
              height={56}
              className="h-7 w-7 object-contain opacity-90 tpl-logo"
              unoptimized
            />
          ) : null}
          {company && (
            <span
              className="at-italic text-[16px] leading-none"
              style={{ color: TEXT_DARK }}
            >
              {company}
            </span>
          )}
        </div>
        {(sectorBadge || sourceLabel) && (
          <div className="flex flex-col items-end gap-1.5">
            {sectorBadge && (
              <span
                className="text-[10px] uppercase tracking-[0.32em]"
                style={{ color: TEXT_LIGHT }}
              >
                {sectorBadge}
              </span>
            )}
            {sourceLabel && (
              <span
                className="text-[10px]"
                style={{ color: TEXT_LIGHT }}
              >
                {sourceLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hairline beneath wordmark */}
      <div
        aria-hidden
        className="mt-6 h-px w-full"
        style={{ background: HAIRLINE }}
      />

      {/* Display name + optional framed portrait. Layout flexes to give the
          typography the left, the portrait the right. */}
      <div className="mt-9 flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <h1
            className="at-display text-[42px] leading-[1.05]"
            style={{ color: TEXT_DARK }}
          >
            {name}
          </h1>
          {subtitle && (
            <p
              className="at-italic mt-3 text-[16px] leading-snug"
              style={{ color: accent }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {photoUrl && (
          <div
            className="relative shrink-0 overflow-hidden"
            style={{
              width: 96,
              height: 120,
              border: `1px solid ${HAIRLINE}`,
              boxShadow: "0 2px 14px rgba(26,26,26,0.06)",
            }}
          >
            <Image
              src={photoUrl}
              alt=""
              fill
              sizes="96px"
              unoptimized
              className="object-cover tpl-photo"
            />
          </div>
        )}
      </div>
    </header>
  );
}

// =============================================================================
// About — single short paragraph. Breath above and below.
// =============================================================================

function AboutSection({ bio }: { bio: string }) {
  return (
    <section className="px-7 pb-9">
      <p
        className="text-[14px] leading-[1.85]"
        style={{ color: TEXT_MID, maxWidth: "44ch" }}
      >
        {bio}
      </p>
    </section>
  );
}

// =============================================================================
// Selected work / services — plain text-only entries with hairline rules.
// =============================================================================

function SelectedWork({
  items,
  title,
  accent,
}: {
  items: Array<{ title: string; description?: string; priceLabel?: string }>;
  title: string;
  accent: string;
}) {
  return (
    <section className="px-7 pb-9">
      <h2
        className="at-italic mb-5 text-[15px] leading-none"
        style={{ color: accent }}
      >
        {title}
      </h2>
      <div>
        {items.map((item, i) => (
          <div
            key={`${item.title}-${i}`}
            className="border-t py-4"
            style={{
              borderColor: HAIRLINE,
              borderTopWidth: i === 0 ? 1 : 1,
            }}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3
                className="at-display text-[19px] leading-tight"
                style={{ color: TEXT_DARK }}
              >
                {item.title}
              </h3>
              {item.priceLabel && (
                <span
                  className="shrink-0 text-[12px]"
                  style={{ color: TEXT_LIGHT }}
                >
                  {item.priceLabel}
                </span>
              )}
            </div>
            {item.description && (
              <p
                className="mt-2 text-[13.5px] leading-[1.7]"
                style={{ color: TEXT_MID, maxWidth: "48ch" }}
              >
                {item.description}
              </p>
            )}
          </div>
        ))}
        {/* Closing hairline */}
        <div
          aria-hidden
          className="h-px w-full"
          style={{ background: HAIRLINE }}
        />
      </div>
    </section>
  );
}

// =============================================================================
// Contact block — phone + email + website on three lines, no icons.
// =============================================================================

function ContactBlock({
  cardData,
  title,
  accent,
}: {
  cardData: TemplateProps["cardData"];
  title: string;
  accent: string;
}) {
  const lines: Array<{ label: string; value: string; href: string; external: boolean }> = [];
  if (cardData.phone) {
    lines.push({
      label: "tel",
      value: cardData.phone,
      href: `tel:${digitsOnly(cardData.phone)}`,
      external: false,
    });
  }
  if (cardData.email) {
    lines.push({
      label: "email",
      value: cardData.email,
      href: `mailto:${cardData.email}`,
      external: false,
    });
  }
  if (cardData.website) {
    lines.push({
      label: "web",
      value: cardData.website.replace(/^https?:\/\//, ""),
      href: cardData.website,
      external: true,
    });
  }
  if (cardData.address) {
    lines.push({
      label: "atelier",
      value: cardData.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cardData.address)}`,
      external: true,
    });
  }
  if (lines.length === 0) return null;

  return (
    <section className="px-7 pb-9">
      <h2
        className="at-italic mb-5 text-[15px] leading-none"
        style={{ color: accent }}
      >
        {title}
      </h2>
      <ul className="flex flex-col gap-3">
        {lines.map((l, i) => {
          const ext = l.external
            ? { target: "_blank", rel: "noopener noreferrer" as const }
            : {};
          return (
            <li
              key={`${l.label}-${i}`}
              className="flex items-baseline gap-5"
            >
              <span
                className="shrink-0 text-[10px] uppercase tracking-[0.32em]"
                style={{ color: TEXT_LIGHT, width: 56 }}
              >
                {l.label}
              </span>
              <a
                href={l.href}
                {...ext}
                className="at-link truncate text-[14px]"
              >
                {l.value}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// =============================================================================
// CTA block — Wallet/Exchange/SendMyInfo, restrained.
// =============================================================================

function CTABlock({
  slug,
  sourceQs,
  locale,
  primary,
  accent,
  saveContactLabel,
}: {
  slug: string;
  sourceQs: string;
  locale: "de" | "en" | "tr";
  primary: string;
  accent: string;
  saveContactLabel: string;
}) {
  return (
    <section className="px-7 pb-7">
      {/* Save-contact: subtle wide button — only decorated CTA on the card */}
      <a
        href={`/api/cards/${encodeURIComponent(slug)}/vcard${sourceQs}`}
        download
        className="at-display group flex w-full items-center justify-center gap-3 px-5 py-3.5 text-[15px] transition-colors"
        style={{
          background: TEXT_DARK,
          color: SURFACE,
          letterSpacing: "0.01em",
        }}
      >
        {saveContactLabel}
      </a>

      <div className="mt-3">
        <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={primary} />
        <ExchangeSlot slug={slug} primary={accent} locale={locale} />
      </div>
    </section>
  );
}

// =============================================================================
// Social — text-link list, no icons.
// =============================================================================

function SocialBlock({
  socials,
  title,
  accent,
}: {
  socials: NonNullable<TemplateProps["cardData"]["socials"]>;
  title: string;
  accent: string;
}) {
  const entries = (Object.entries(socials) as Array<[string, string | undefined]>)
    .filter(([, v]) => typeof v === "string" && v.length > 0)
    .map(([k, v]) => ({ key: k, label: SOCIAL_LABELS[k] ?? k, href: v as string }));
  if (entries.length === 0) return null;

  return (
    <section className="border-t px-7 py-7" style={{ borderColor: HAIRLINE }}>
      <h2
        className="at-italic mb-5 text-[15px] leading-none"
        style={{ color: accent }}
      >
        {title}
      </h2>
      <ul className="flex flex-col gap-2.5">
        {entries.map((e) => (
          <li key={e.key}>
            <a
              href={e.href}
              target="_blank"
              rel="noopener noreferrer"
              className="at-link inline-flex items-baseline gap-3 text-[14px]"
            >
              <span
                aria-hidden
                className="block h-px w-5"
                style={{ background: HAIRLINE }}
              />
              <span>{e.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

// =============================================================================
// Brochure — simple text link.
// =============================================================================

function BrochureBlock({
  url,
  label,
  accent,
}: {
  url: string;
  label: string;
  accent: string;
}) {
  return (
    <section className="border-t px-7 py-6" style={{ borderColor: HAIRLINE }}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="at-italic inline-flex items-baseline gap-2 text-[15px] transition-colors hover:opacity-70"
        style={{ color: accent }}
      >
        {label}
        <span aria-hidden style={{ fontFamily: "inherit" }}>
          →
        </span>
      </a>
    </section>
  );
}

// =============================================================================
// Footer — ultra-minimal hairline credits.
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
  translations: AtCopy;
}) {
  return (
    <footer
      className="border-t px-7 pb-8 pt-6"
      style={{ borderColor: HAIRLINE }}
    >
      <div
        className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10.5px]"
        style={{ color: TEXT_LIGHT }}
      >
        <FooterShare siteUrl={siteUrl} slug={slug} />
        {impressumUrl && (
          <>
            <span>·</span>
            <a
              href={impressumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="at-link"
              style={{ color: TEXT_LIGHT }}
            >
              {translations.impressum}
            </a>
          </>
        )}
        {privacyUrl && (
          <>
            <span>·</span>
            <a
              href={privacyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="at-link"
              style={{ color: TEXT_LIGHT }}
            >
              {translations.privacy}
            </a>
          </>
        )}
        <span className="ml-auto inline-flex items-center gap-1.5">
          <Shield size={10} strokeWidth={1.6} />
          {translations.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="at-italic"
            style={{ color: accent }}
          >
            OpSolid
          </a>
        </span>
      </div>
      <div className="mt-2 text-[10px]" style={{ color: TEXT_LIGHT }}>
        {`opsolid.de/c/${slug}`}
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
            // fall through
          }
        }
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        }
      }}
      className="at-link"
      style={{ color: TEXT_LIGHT }}
    >
      Share
    </button>
  );
}

// =============================================================================
// Registry entry + sample data.
// =============================================================================

import type { TemplateRegistryEntry, SampleData } from "./types";

export const atelierEntry: TemplateRegistryEntry = {
  id: 12,
  key: "atelier",
  name: "Atelier",
  industry: "Designer / advisor / executive — minimalist personal brand",
  Component: Atelier,
  supports: {
    services: true,
    faqs: false,
    testimonials: true,
    gallery: false,
    video: false,
    brochure: true,
    socials: true,
    themeSwitch: true,
    photo: true,
    logo: true,
  },
  defaults: {
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-atelier",
};

export const atelierSample: SampleData = {
  templateId: 12,
  slug: "demo-atelier",
  // Atelier deliberately ships sample with no photo — typography carries the
  // card. Customers can opt in by uploading one in the order form.
  photoUrl: null,
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
  cardData: {
    name: "Adrien Mercier",
    position: "Independent design consultant",
    title: "Brand systems & product strategy",
    company: "Mercier",
    email: "adrien@mercier.studio",
    phone: "+33 6 24 18 03 47",
    website: "https://mercier.studio",
    address: "11 rue de Sévigné, 75004 Paris",
    bio: "I work with founders and small leadership teams on brand systems, product strategy, and the unglamorous parts of design that hold a company together. Independent since 2019. Three to four engagements a year.",
    sectorKey: "consultant",
    socials: {
      linkedin: "https://linkedin.com/in/adrienmercier",
      x: "https://x.com/adrienmercier",
    },
    services: [
      {
        title: "Brand system",
        description:
          "Complete identity. Six to ten weeks. Includes positioning, naming guidance if needed, mark, type system, colour, voice, and a working set of templates.",
        priceLabel: "from €38 000",
      },
      {
        title: "Product strategy",
        description:
          "Roadmap, IA, and the first two design sprints in tandem with your product team. Eight weeks, on-site one day per week.",
        priceLabel: "from €32 000",
      },
      {
        title: "Advisory retainer",
        description:
          "One half-day per week for six months. Reviews, hiring panels, sparring on hard calls. Capped at three concurrent retainers.",
        priceLabel: "from €4 800 / month",
      },
      {
        title: "One-day audit",
        description:
          "A single working day at your office. Brand and product, end to end. Written notes the following week.",
        priceLabel: "€2 800",
      },
    ],
    testimonials: [
      {
        author: "C. Larue",
        role: "CEO, Maison Calque",
        quote:
          "Adrien is the only consultant I have worked with who said less than I expected and delivered more.",
      },
    ],
    brochureUrl: "https://mercier.studio/folio.pdf",
    impressumUrl: "https://mercier.studio/impressum",
    privacyUrl: "https://mercier.studio/privacy",
  },
};
