"use client";

// =============================================================================
// RealEstateNoir — v2 template (id=52, key="real-estate-noir").
//
// Sector: real estate / broker — NOIR variant. Mood: editorial luxury,
// near-black canvas, gold (#c8a951) hairline ornaments, Playfair Display
// serif italic, Roman-numeral service list, gold-rim circular avatar,
// stats bar with serif numerals + sup markers. Inspired by
// kart_01_emlak_noir.html — re-implemented natively.
//
// Design DNA (different from the default RealEstate.tsx):
//   - No big hero photo. Compact 64 px circular avatar with gold ring.
//   - Header: "SINCE YYYY" badge, serif name with italic last word in gold,
//     thin gold rule sweeping side-to-side.
//   - Stats bar 3-up: serif numerals + small superscript markers.
//   - Services: editorial Roman-numeral list (I · II · III…), serif names,
//     2px gold left-bar.
//   - Pull-quote section: oversized gold open-quote, italic serif quote.
//   - Italic serif slogan strip.
//   - Contact: 2-up panel grid with gold uppercase labels.
//   - Footer: gold italic name, dim copyright.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  Shield,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#0d0d0d";
const LOCKED_ACCENT = "#c8a951";

// Locked dark canvas constants — only `primary` and `accent` respond to brand.
const CARD = "#111111";
const PANEL = "#1a1a1d";
const PANEL_2 = "#16161a";
const FOOTER_BG = "#0a0a0a";
const TEXT_PRIMARY = "#f0ede8";
const TEXT_MUTED = "#9a9090";
const TEXT_DIMMED = "#6b6260";

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

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

interface RenCopy {
  since: string;
  experience: string;
  closed: string;
  portfolio: string;
  services: string;
  servicesTitle: string;
  voices: string;
  contact: string;
  contactTitle: string;
  social: string;
  saveContact: string;
  callTile: string;
  whatsappTile: string;
  emailTile: string;
  webTile: string;
  walletLabel: string;
  poweredBy: string;
  impressum: string;
  privacy: string;
  share: string;
}

const COPY: Record<"de" | "en" | "tr", RenCopy> = {
  de: {
    since: "Seit",
    experience: "Jahre",
    closed: "Abschlüsse",
    portfolio: "Portfolio",
    services: "Leistungen",
    servicesTitle: "Spezialgebiete",
    voices: "Empfehlungen",
    contact: "Kontakt",
    contactTitle: "Sprechen wir",
    social: "Social",
    saveContact: "In Kontakte speichern",
    callTile: "Anruf",
    whatsappTile: "WhatsApp",
    emailTile: "E-Mail",
    webTile: "Website",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    impressum: "Impressum",
    privacy: "Datenschutz",
    share: "Teilen",
  },
  en: {
    since: "Since",
    experience: "Years",
    closed: "Closed",
    portfolio: "Portfolio",
    services: "Services",
    servicesTitle: "Specialisations",
    voices: "Voices",
    contact: "Contact",
    contactTitle: "Let's talk",
    social: "Connect",
    saveContact: "Save to contacts",
    callTile: "Call",
    whatsappTile: "WhatsApp",
    emailTile: "Email",
    webTile: "Website",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    impressum: "Imprint",
    privacy: "Privacy",
    share: "Share",
  },
  tr: {
    since: "Sektörde",
    experience: "Yıl",
    closed: "Satış",
    portfolio: "Portföy",
    services: "Hizmetler",
    servicesTitle: "Uzmanlık Alanlarım",
    voices: "Referanslar",
    contact: "İletişim",
    contactTitle: "Bana Ulaşın",
    social: "Sosyal",
    saveContact: "Rehbere kaydet",
    callTile: "Telefon",
    whatsappTile: "WhatsApp",
    emailTile: "E-posta",
    webTile: "Web Sitesi",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    impressum: "Künye",
    privacy: "Gizlilik",
    share: "Paylaş",
  },
};

export function RealEstateNoir({
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

  // Split name into first / italic-last token for the "Hannah / Walker" feel.
  const nameParts = cardData.name.trim().split(/\s+/);
  const firstName = nameParts.slice(0, -1).join(" ") || cardData.name;
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  const services = cardData.services ?? [];
  const testimonials = cardData.testimonials ?? [];
  const featuredQuote = testimonials[0];

  const year = new Date().getFullYear();
  const sinceYear = year - 12;

  return (
    <article
      data-template="real-estate-noir"
      className="ren-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: CARD,
        color: TEXT_PRIMARY,
        boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
      }}
    >
      <style jsx global>{`
        .ren-card {
          font-family: 'Inter', system-ui, sans-serif;
          line-height: 1.6;
        }
        .ren-card .serif {
          font-family: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
        }
        .ren-card a { color: inherit; }
      `}</style>

      {/* HEADER */}
      <header
        className="relative px-7 pb-7 pt-9"
        style={{
          background: `linear-gradient(180deg, ${primary} 0%, #131313 100%)`,
          borderBottom: `1px solid ${accent}26`,
        }}
      >
        {/* top gold sweep rule */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accent} 50%, transparent 100%)`,
          }}
        />

        <div className="flex items-center gap-[18px]">
          <div
            className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full"
            style={{
              border: `1.5px solid ${accent}`,
              boxShadow: `0 0 0 3px ${accent}14`,
            }}
          >
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt=""
                fill
                sizes="64px"
                unoptimized
                className="object-cover"
              />
            ) : (
              <div
                className="serif flex h-full w-full items-center justify-center text-[16px] font-bold"
                style={{ background: PANEL, color: accent }}
              >
                {initials}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div
              className="mb-1 inline-flex items-center gap-2 text-[10px] font-medium uppercase"
              style={{ color: accent, letterSpacing: "3px" }}
            >
              <span aria-hidden style={{ display: "inline-block", width: 18, height: 1, background: accent }} />
              {t.since} {sinceYear}
            </div>
            <div
              className="text-[11px] font-normal"
              style={{ color: TEXT_DIMMED, letterSpacing: "0.8px" }}
            >
              {(cardData.company || "BERLIN").toUpperCase()}
            </div>
          </div>
        </div>

        <h1
          className="serif mt-7 text-[34px] font-bold leading-[1.05]"
          style={{ color: TEXT_PRIMARY, letterSpacing: "-1px" }}
        >
          {firstName}
          {lastName && (
            <>
              <br />
              <em
                className="font-normal italic"
                style={{ color: accent }}
              >
                {lastName}
              </em>
            </>
          )}
        </h1>
        <div
          className="mt-2.5 text-[12.5px] font-light"
          style={{ color: TEXT_MUTED, letterSpacing: "0.4px", lineHeight: 1.55 }}
        >
          {[cardData.position, cardData.title].filter(Boolean).join(" · ")}
        </div>
      </header>

      {/* gold rule */}
      <div
        aria-hidden
        className="h-px"
        style={{
          marginInline: 28,
          background: `linear-gradient(90deg, transparent 0%, ${accent}99 30%, ${accent}99 70%, transparent 100%)`,
        }}
      />

      {/* STATS BAR */}
      <div
        className="grid grid-cols-3 py-7"
        style={{
          background: PANEL_2,
          borderBottom: `1px solid ${accent}26`,
        }}
      >
        <StatCell num="12" sup="+" label={t.experience} accent={accent} />
        <StatCell num="180" sup="+" label={t.closed} accent={accent} divider />
        <StatCell num="€2.4" sup="B" label={t.portfolio} accent={accent} divider />
      </div>

      {/* SERVICES — Roman numerals */}
      {services.length > 0 && (
        <Section accent={accent} eyebrow={t.services} title={t.servicesTitle}>
          <div className="flex flex-col gap-2.5">
            {services.slice(0, 6).map((svc, i) => (
              <div
                key={`${svc.title}-${i}`}
                className="flex items-stretch px-[18px] py-4"
                style={{
                  background: PANEL,
                  borderLeft: `2px solid ${accent}`,
                }}
              >
                <span
                  className="serif min-w-[28px] pt-0.5 text-[13px] italic"
                  style={{ color: accent, letterSpacing: "1px", marginRight: 18 }}
                >
                  {ROMAN[i] ?? `${i + 1}`}
                </span>
                <div className="min-w-0 flex-1">
                  <div
                    className="serif text-[15px] leading-[1.45]"
                    style={{ color: TEXT_PRIMARY }}
                  >
                    {svc.title}
                  </div>
                  {svc.priceLabel && (
                    <div
                      className="mt-1 text-[11px] font-medium uppercase"
                      style={{ color: accent, letterSpacing: "1.5px" }}
                    >
                      {svc.priceLabel}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* PULL QUOTE */}
      {featuredQuote && (
        <section
          className="px-7 pb-12 pt-12 text-center"
          style={{
            background: PANEL_2,
            borderBottom: `1px solid ${accent}26`,
          }}
        >
          <div
            aria-hidden
            className="serif mx-auto mb-1 text-[64px] leading-[0.5]"
            style={{ color: accent, opacity: 0.5 }}
          >
            &ldquo;
          </div>
          <p
            className="serif mx-auto mb-[22px] max-w-[360px] text-[19px] italic leading-[1.5]"
            style={{ color: TEXT_PRIMARY, letterSpacing: "-0.2px" }}
          >
            {featuredQuote.quote}
          </p>
          <div
            className="inline-flex items-center gap-3 text-[10.5px] font-medium uppercase"
            style={{ color: accent, letterSpacing: "2.5px" }}
          >
            <span aria-hidden style={{ display: "inline-block", width: 24, height: 1, background: `${accent}99` }} />
            {featuredQuote.author}
            {featuredQuote.role && <span style={{ color: TEXT_MUTED }}>· {featuredQuote.role}</span>}
            <span aria-hidden style={{ display: "inline-block", width: 24, height: 1, background: `${accent}99` }} />
          </div>
        </section>
      )}

      {/* SLOGAN */}
      {cardData.bio && (
        <div className="px-7 py-8 text-center">
          <p
            className="serif text-[17px] italic font-normal leading-[1.5]"
            style={{ color: accent, letterSpacing: "0.2px" }}
          >
            &ldquo;{cardData.bio.split(/[.!?]/)[0].trim()}&rdquo;
          </p>
        </div>
      )}

      {/* CONTACT — 2-up tile grid */}
      <Section accent={accent} eyebrow={t.contact} title={t.contactTitle}>
        <div className="grid grid-cols-2 gap-2.5">
          {phoneDigits && (
            <ContactTile href={`tel:${phoneDigits}`} label={t.callTile} value={cardData.phone ?? ""} accent={accent} Icon={Phone} />
          )}
          {waDigits && (
            <ContactTile
              href={`https://wa.me/${waDigits}`}
              external
              label={t.whatsappTile}
              value="Mesaj"
              accent={accent}
              Icon={MessageCircle}
            />
          )}
          {cardData.email && (
            <ContactTile
              href={`mailto:${cardData.email}`}
              label={t.emailTile}
              value={cardData.email}
              accent={accent}
              Icon={Mail}
            />
          )}
          {cardData.website && (
            <ContactTile
              href={cardData.website.startsWith("http") ? cardData.website : `https://${cardData.website}`}
              external
              label={t.webTile}
              value={cardData.website.replace(/^https?:\/\//, "")}
              accent={accent}
              Icon={Globe}
              full
            />
          )}
        </div>

        <div className="mt-6">
          <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={accent} />
        </div>
      </Section>

      {/* CTAs */}
      <section className="px-7 pb-2">
        <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
        <ExchangeSlot slug={slug} primary={accent} locale={locale} />
      </section>

      {/* FOOTER PANEL — vCard */}
      <div
        className="px-7 pb-8 pt-9 text-center"
        style={{ background: PANEL_2 }}
      >
        <a
          href={`/api/cards/${encodeURIComponent(slug)}/vcard`}
          download
          className="inline-flex w-full items-center justify-center gap-3 px-6 py-4 text-[12px] font-semibold uppercase transition-all hover:-translate-y-px"
          style={{
            background: "transparent",
            color: accent,
            border: `1px solid ${accent}`,
            letterSpacing: "2.5px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {t.saveContact}
        </a>
      </div>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="border-t px-7 py-6"
          labelClassName="mb-3 text-center text-[10px] font-medium uppercase"
        >
          <div style={{ ["--card-primary" as string]: accent }}>{walletSlot}</div>
        </WalletDock>
      )}

      {/* SOCIAL */}
      {cardData.socials && Object.values(cardData.socials).some(Boolean) && (
        <Section accent={accent} eyebrow={t.social}>
          <SocialRow socials={cardData.socials} variant="icon" accentHex={accent} />
        </Section>
      )}

      {/* FOOTER */}
      <footer
        className="px-7 py-6 text-center"
        style={{ background: FOOTER_BG }}
      >
        <div
          className="serif text-[13px] italic"
          style={{ color: accent }}
        >
          {cardData.name}
          {cardData.company && (
            <span style={{ color: TEXT_MUTED, fontStyle: "normal" }}>
              {" · "}
              {cardData.company}
            </span>
          )}
        </div>
        <div
          className="mt-1 text-[10px]"
          style={{ color: TEXT_DIMMED, letterSpacing: "1px" }}
        >
          © {year} · {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: accent }}
          >
            OpSolid
          </a>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px]" style={{ color: TEXT_DIMMED }}>
          {cardData.impressumUrl && (
            <a href={cardData.impressumUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              {t.impressum}
            </a>
          )}
          {cardData.privacyUrl && (
            <a href={cardData.privacyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              {t.privacy}
            </a>
          )}
          <span className="inline-flex items-center gap-1">
            <Shield size={10} strokeWidth={1.6} />
            opsolid.de/c/{slug}
          </span>
        </div>
        {/* unused but kept for tree-shaking */}
        <span className="hidden">
          <MapPin size={1} />
          <Quote size={1} />
        </span>
      </footer>
    </article>
  );
}

// =============================================================================
// Subcomponents
// =============================================================================

function StatCell({
  num,
  sup,
  label,
  accent,
  divider,
}: {
  num: string;
  sup?: string;
  label: string;
  accent: string;
  divider?: boolean;
}) {
  return (
    <div className="relative px-3 text-center">
      {divider && (
        <span
          aria-hidden
          className="absolute left-0 top-[12%] block w-px"
          style={{ height: "76%", background: `${accent}26` }}
        />
      )}
      <div
        className="serif text-[28px] font-bold leading-none"
        style={{ color: accent, letterSpacing: "-0.5px" }}
      >
        {num}
        {sup && (
          <sup className="serif" style={{ fontSize: 13, color: "#b87333", marginLeft: 2, top: 4, position: "relative", verticalAlign: "top" }}>
            {sup}
          </sup>
        )}
      </div>
      <div
        className="mt-2 text-[10px] font-medium uppercase"
        style={{ color: TEXT_MUTED, letterSpacing: "1.5px" }}
      >
        {label}
      </div>
    </div>
  );
}

function Section({
  accent,
  eyebrow,
  title,
  children,
}: {
  accent: string;
  eyebrow: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="px-7 py-9"
      style={{ borderBottom: `1px solid ${accent}26` }}
    >
      <div
        className="mb-3 flex items-center gap-[10px] text-[10px] font-medium uppercase"
        style={{ color: accent, letterSpacing: "3px" }}
      >
        <span>{eyebrow}</span>
        <span aria-hidden className="block h-px flex-1" style={{ background: `${accent}26` }} />
      </div>
      {title && (
        <h2
          className="serif mb-6 text-[24px] italic font-normal"
          style={{ color: TEXT_PRIMARY, letterSpacing: "-0.3px" }}
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function ContactTile({
  href,
  label,
  value,
  accent,
  Icon,
  external,
  full,
}: {
  href: string;
  label: string;
  value: string;
  accent: string;
  Icon: typeof Phone;
  external?: boolean;
  full?: boolean;
}) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" as const } : {};
  return (
    <a
      href={href}
      {...ext}
      className={`flex flex-col gap-2 px-3.5 py-4 transition-all hover:-translate-y-px ${full ? "col-span-2" : ""}`}
      style={{
        background: PANEL,
        border: `1px solid ${accent}26`,
        textDecoration: "none",
      }}
    >
      <span
        className="flex items-center gap-2 text-[9.5px] font-medium uppercase"
        style={{ color: accent, letterSpacing: "2px" }}
      >
        <Icon size={13} strokeWidth={1.6} />
        {label}
      </span>
      <span
        className="break-words text-[13px]"
        style={{ color: TEXT_PRIMARY, lineHeight: 1.4 }}
      >
        {value}
      </span>
    </a>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const realEstateNoirEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 52,
  key: "real-estate-noir",
  name: "Real Estate — Noir",
  industry: "Real estate agent / broker",
  supports: {
    services: true,
    faqs: false,
    testimonials: true,
    gallery: false,
    video: false,
    brochure: true,
    socials: true,
    themeSwitch: false,
    photo: true,
    logo: true,
  },
  defaults: {
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-real-estate-noir",
};

// Persona: Hannah Walker, Senior Listing Agent, Walker & Stein, Berlin.
// photo: Unsplash, by Christina Wocintechchat — Unsplash License, no attribution required.
export const realEstateNoirSample: SampleData = {
  templateId: 52,
  slug: "demo-real-estate-noir",
  cardData: {
    name: "Hannah Walker",
    position: "Senior Listing Agent",
    title: "Real Estate Advisor",
    company: "Walker & Stein",
    email: "hannah@walker-stein.de",
    phone: "+49 30 1234 5678",
    whatsapp: "+49 170 1234 567",
    website: "walker-stein.de",
    address: "Kurfürstendamm 188, 10707 Berlin",
    bio: "Twelve years pairing discerning clients with Berlin's most distinctive homes. Discreet representation, decisive negotiation, lasting trust.",
    bookingUrl: "https://cal.com/walker-stein/intro",
    brochureUrl: "https://walker-stein.de/portfolio.pdf",
    impressumUrl: "https://walker-stein.de/impressum",
    privacyUrl: "https://walker-stein.de/datenschutz",
    sectorKey: "real-estate",
    socials: {
      linkedin: "https://linkedin.com/in/hannahwalker-de",
      instagram: "https://instagram.com/walker.stein.berlin",
    },
    services: [
      { title: "Charlottenburg Townhouse", priceLabel: "€2.85M" },
      { title: "Wannsee Waterfront Build", priceLabel: "FOR SALE" },
      { title: "Mitte Penthouse", priceLabel: "€1.65M" },
    ],
    testimonials: [
      {
        author: "Sebastian & Marie L.",
        role: "Mitte penthouse",
        quote:
          "Hannah understood us before we did. Eight months of dead-end viewings became a single home that felt inevitable.",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
