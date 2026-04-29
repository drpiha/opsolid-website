"use client";

// =============================================================================
// Maker — e-commerce / artisan / small-batch maker (id=8, key="maker").
//
// Design DNA: Projekt_4k/showcase/kart_08_eticaret.html. Cream surface, warm
// crimson accent, hand-feel rounded cards. Refined for OpSolid into Norwegian
// ceramic-studio mood: cream `#fdf8f3` base, warm crimson `#e11d48`, muted
// claret `#7c2d3c`, Poppins display + Nunito body. The signature flourish is
// the "floating profile strip" — an elevated card sitting -16px overlapping
// into the surface below, with a 10–12 px shadow blur.
//
// Locked design choices (do not parameterise):
//   - Cream background. Centered 72px circular monogram in the header.
//     Photo (if provided) goes inside the circle with a hairline border and
//     subtle drop-shadow.
//   - Floating profile strip overlapping with -16px translate.
//   - 2-col product grid (services as products), each rounded-2xl with a
//     hairline cream border and a "Buy" external link.
//   - Warm hand-feel — generous whitespace, no harsh blacks.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  Shield,
  ShoppingBag,
  Star,
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
import type { TemplateProps, TemplateRegistryEntry, SampleData } from "./types";

// -----------------------------------------------------------------------------
// Locked palette — Norwegian ceramic studio, not pop-art.
// -----------------------------------------------------------------------------
const LOCKED_PRIMARY = "#e11d48"; // warm crimson
const LOCKED_ACCENT = "#7c2d3c"; // muted claret support tone
const SURFACE_CREAM = "#fdf8f3";
const SURFACE_WARM = "#fff9f5";
const INK = "#3d2c2c";
const INK_SOFT = "#a07070";

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
  if (parts.length === 1) return (parts[0][0] ?? "•").toUpperCase();
  return (
    (parts[0][0] ?? "").toUpperCase() + (parts[parts.length - 1][0] ?? "").toUpperCase()
  );
}

interface MkCopy {
  saveContact: string;
  callNow: string;
  whatsapp: string;
  email: string;
  shop: string;
  shopAll: string;
  about: string;
  contact: string;
  voices: string;
  social: string;
  walletLabel: string;
  ctaWhatsapp: string;
  ctaWhatsappHint: string;
  productsTitle: string;
  galleryTitle: string;
  buy: string;
  impressum: string;
  privacy: string;
  poweredBy: string;
  handmade: string;
}

const COPY: Record<"de" | "en" | "tr", MkCopy> = {
  de: {
    saveContact: "Speichern",
    callNow: "Anrufen",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    shop: "Shop",
    shopAll: "Alles ansehen",
    about: "Über die Werkstatt",
    contact: "Kontakt",
    voices: "Stimmen",
    social: "Social",
    walletLabel: "Auf Smartphone speichern",
    ctaWhatsapp: "Bestellen via WhatsApp",
    ctaWhatsappHint: "Antwort innerhalb von 24 Stunden",
    productsTitle: "Aktuelle Stücke",
    galleryTitle: "Aus der Werkstatt",
    buy: "Kaufen",
    impressum: "Impressum",
    privacy: "Datenschutz",
    poweredBy: "Powered by",
    handmade: "Handgefertigt · Kleinserie",
  },
  en: {
    saveContact: "Save contact",
    callNow: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    shop: "Shop",
    shopAll: "Browse all",
    about: "About the studio",
    contact: "Contact",
    voices: "Voices",
    social: "Social",
    walletLabel: "Add to wallet",
    ctaWhatsapp: "Order via WhatsApp",
    ctaWhatsappHint: "Reply within 24 hours",
    productsTitle: "Current pieces",
    galleryTitle: "From the studio",
    buy: "Buy",
    impressum: "Imprint",
    privacy: "Privacy",
    poweredBy: "Powered by",
    handmade: "Handmade · small batch",
  },
  tr: {
    saveContact: "Rehbere kaydet",
    callNow: "Ara",
    whatsapp: "WhatsApp",
    email: "E-posta",
    shop: "Mağaza",
    shopAll: "Tümünü gör",
    about: "Atölye hakkında",
    contact: "İletişim",
    voices: "Yorumlar",
    social: "Sosyal",
    walletLabel: "Cüzdana ekle",
    ctaWhatsapp: "WhatsApp ile sipariş",
    ctaWhatsappHint: "24 saat içinde yanıt",
    productsTitle: "Atölyeden",
    galleryTitle: "Atölyeden kareler",
    buy: "Satın al",
    impressum: "Künye",
    privacy: "Gizlilik",
    poweredBy: "Powered by",
    handmade: "El yapımı · küçük seri",
  },
};

export function Maker({
  slug,
  cardData,
  locale = "de",
  photoPath,
  brandPrimaryHex,
  brandAccentHex,
  source,
  siteUrl,
  walletSlot,
}: TemplateProps) {
  // Maker treats the monogram as its logo — `logoPath` is intentionally not consumed.
  const t = COPY[locale] ?? COPY.de;

  const sector = getSectorPreset(cardData.sectorKey);
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;

  const photoUrl = resolveAssetUrl(photoPath);
  const initials = getInitials(cardData.name);

  const products =
    cardData.services && cardData.services.length > 0
      ? cardData.services
      : sector?.services;

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const galleryItems = (cardData.gallery ?? []).slice(0, 6);

  return (
    <article
      data-template="maker"
      className={`mk-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(120,80,60,0.30),0_8px_20px_-12px_rgba(120,80,60,0.18)] ring-1 ring-[rgba(120,80,60,0.12)]`}
      style={
        {
          ["--mk-primary" as string]: primary,
          ["--mk-accent" as string]: accent,
          ["--mk-primary-soft" as string]: `${primary}1A`,
          ["--card-primary" as string]: primary,
          ["--card-accent" as string]: accent,
          ["--font-maker-display" as string]: "'Poppins', system-ui, sans-serif",
          ["--font-maker-body" as string]: "'Nunito', system-ui, sans-serif",
          background: SURFACE_CREAM,
          color: INK,
          fontFamily: "var(--font-maker-body), system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .mk-card {
          font-family:var(--tpl-font-body,  var(--font-maker-body), "Nunito", system-ui, sans-serif);
          line-height: 1.65;
        }
        .mk-card .mk-display {
          font-family:var(--tpl-font-body,  var(--font-maker-display), "Poppins", system-ui, sans-serif);
          letter-spacing: -0.01em;
        }
        .mk-card .mk-mono {
          font-family:var(--tpl-font-body,  var(--font-maker-display), "Poppins", system-ui, sans-serif);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-feature-settings: "tnum";
        }
      `}</style>

      <ShopHeader
        photoUrl={photoUrl}
        initials={initials}
        company={cardData.company || cardData.name}
        tagline={cardData.title || cardData.position}
        primary={primary}
        accent={accent}
        sectorBadge={sector?.name}
        sourceLabel={sourceLabel}
        translations={t}
      />

      <FloatingProfile
        name={cardData.name}
        title={cardData.position || cardData.title}
        bio={cardData.bio}
        accent={accent}
      />

      {products && products.length > 0 && (
        <ProductGrid
          items={products.slice(0, 4)}
          primary={primary}
          accent={accent}
          title={t.productsTitle}
          buyLabel={t.buy}
        />
      )}

      <QuickActionStrip
        slug={slug}
        sourceQs={sourceQs}
        phoneDigits={phoneDigits}
        waDigits={waDigits}
        email={cardData.email}
        primary={primary}
        accent={accent}
        translations={t}
      />

      {cardData.bio && (
        <Section title={t.about} accent={accent}>
          <p className="text-[13.5px] leading-[1.85] text-[color:var(--mk-ink-body,#5d4444)]" style={{ color: "#5d4444" }}>
            {cardData.bio}
          </p>
        </Section>
      )}

      {galleryItems.length > 0 && (
        <GalleryStrip items={galleryItems} title={t.galleryTitle} accent={accent} />
      )}

      {cardData.testimonials && cardData.testimonials.length > 0 && (
        <Testimonials items={cardData.testimonials} accent={accent} title={t.voices} />
      )}

      <WhatsAppCTA
        waDigits={waDigits}
        primary={primary}
        translations={t}
      />

      <Section title={t.contact} accent={accent}>
        <ContactRows
          cardData={cardData}
          locale={locale}
          variant="compact"
          accentHex={primary}
          rowClassName="hover:!bg-[rgba(225,29,72,0.04)]"
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
          className="border-t border-[rgba(120,80,60,0.10)] px-7 py-5"
          labelClassName="mk-mono mb-3 text-[10px] font-semibold"
        >
          {walletSlot}
        </WalletDock>
      )}

      {cardData.socials && (
        <Section title={t.social} accent={accent}>
          <SocialRow
            socials={cardData.socials}
            variant="icon"
            accentHex={primary}
            itemClassName="!border-[rgba(120,80,60,0.18)] !bg-white hover:!border-[var(--mk-primary)] hover:!bg-[var(--mk-primary-soft)]"
          />
        </Section>
      )}

      <Footer
        siteUrl={siteUrl}
        slug={slug}
        impressumUrl={cardData.impressumUrl}
        privacyUrl={cardData.privacyUrl}
        primary={primary}
        accent={accent}
        translations={t}
      />
    </article>
  );
}

// =============================================================================
// HEADER — centered monogram (or photo), shop name, hairline divider.
// =============================================================================

function ShopHeader({
  photoUrl,
  initials,
  company,
  tagline,
  primary,
  accent,
  sectorBadge,
  sourceLabel,
  translations,
}: {
  photoUrl: string | null;
  initials: string;
  company: string;
  tagline?: string;
  primary: string;
  accent: string;
  sectorBadge?: string;
  sourceLabel?: string;
  translations: MkCopy;
}) {
  return (
    <header
      className="relative px-7 pb-10 pt-9 text-center"
      style={{
        background: `linear-gradient(180deg, ${SURFACE_WARM} 0%, ${SURFACE_CREAM} 100%)`,
      }}
    >
      <div className="mb-3 flex items-center justify-center gap-2">
        {sectorBadge && (
          <span
            className="mk-mono inline-block rounded-full border px-2.5 py-1 text-[8.5px] font-semibold"
            style={{
              borderColor: `${primary}33`,
              color: primary,
              background: `${primary}0d`,
            }}
          >
            {sectorBadge}
          </span>
        )}
        {sourceLabel && (
          <span className="mk-mono inline-block rounded-full border border-[rgba(120,80,60,0.15)] bg-white/40 px-2.5 py-1 text-[8.5px] text-[color:var(--mk-ink-soft)]" style={{ color: INK_SOFT }}>
            {sourceLabel}
          </span>
        )}
      </div>

      {/* Centered 72 px monogram circle. Photo (if any) inside; otherwise initials. */}
      <div
        className="relative mx-auto mb-4 flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full"
        style={{
          background: photoUrl
            ? "white"
            : `linear-gradient(135deg, ${primary} 0%, ${primary}cc 100%)`,
          boxShadow: `0 6px 24px -8px ${primary}80, 0 0 0 4px white, 0 0 0 5px ${primary}26`,
        }}
      >
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={company}
            width={144}
            height={144}
            unoptimized
            className="h-full w-full object-cover tpl-photo"
          />
        ) : (
          <span
            className="mk-display text-[1.4rem] font-bold"
            style={{ color: "white", letterSpacing: "0.02em" }}
          >
            {initials}
          </span>
        )}
      </div>

      <h1
        className="mk-display text-[1.55rem] font-bold leading-tight"
        style={{ color: INK }}
      >
        {company}
      </h1>
      {tagline && (
        <p
          className="mt-1.5 text-[13px] font-medium"
          style={{ color: INK_SOFT }}
        >
          {tagline}
        </p>
      )}
      <p
        className="mk-mono mt-3 text-[8.5px] font-semibold"
        style={{ color: accent }}
      >
        {translations.handmade}
      </p>

      {/* Hairline divider — fades out toward the edges. */}
      <div
        aria-hidden
        className="absolute inset-x-12 bottom-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accent}55 50%, transparent 100%)`,
        }}
      />
    </header>
  );
}

// =============================================================================
// FloatingProfile — the signature flourish: elevated card overlapping -16px.
// =============================================================================

function FloatingProfile({
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
    <section className="relative px-5">
      <div
        className="relative -mt-4 rounded-2xl border bg-white px-5 py-4"
        style={{
          borderColor: "rgba(120,80,60,0.10)",
          boxShadow:
            "0 12px 28px -16px rgba(120,80,60,0.18), 0 2px 8px -4px rgba(120,80,60,0.10)",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="block h-7 w-1 rounded-full"
            style={{ background: accent }}
          />
          <div className="min-w-0 flex-1">
            <h2
              className="mk-display text-[14px] font-semibold leading-tight"
              style={{ color: INK }}
            >
              {name}
            </h2>
            {title && (
              <p
                className="mt-0.5 text-[12px] font-medium"
                style={{ color: INK_SOFT }}
              >
                {title}
              </p>
            )}
          </div>
          <Heart
            size={14}
            strokeWidth={1.6}
            style={{ color: accent }}
            aria-hidden
          />
        </div>
        {bio && (
          <p
            className="mt-3 line-clamp-3 text-[12px] leading-relaxed"
            style={{ color: "#5d4444" }}
          >
            {bio}
          </p>
        )}
      </div>
    </section>
  );
}

// =============================================================================
// Section frame — Poppins title + warm hairline.
// =============================================================================

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
    <section className="px-7 py-7">
      <div className="mb-4 flex items-center gap-3">
        <span
          aria-hidden
          className="block h-px w-6"
          style={{ background: accent }}
        />
        <h2
          className="mk-display text-[14px] font-semibold"
          style={{ color: INK }}
        >
          {title}
        </h2>
        <span
          aria-hidden
          className="block h-px flex-1"
          style={{
            background: `linear-gradient(90deg, ${accent}33 0%, transparent 100%)`,
          }}
        />
      </div>
      {children}
    </section>
  );
}

// =============================================================================
// ProductGrid — 2-col warm cards with image / monogram + name + price + buy.
// =============================================================================

function ProductGrid({
  items,
  primary,
  accent,
  title,
  buyLabel,
}: {
  items: Array<{ title: string; description?: string; priceLabel?: string }>;
  primary: string;
  accent: string;
  title: string;
  buyLabel: string;
}) {
  return (
    <section className="px-5 pt-7">
      <div className="mb-4 flex items-center gap-3 px-2">
        <ShoppingBag size={14} strokeWidth={1.8} style={{ color: primary }} />
        <h2
          className="mk-display text-[14px] font-semibold"
          style={{ color: INK }}
        >
          {title}
        </h2>
        <span
          aria-hidden
          className="block h-px flex-1"
          style={{
            background: `linear-gradient(90deg, ${accent}33 0%, transparent 100%)`,
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <article
            key={`${item.title}-${i}`}
            className="group flex flex-col overflow-hidden rounded-2xl border bg-white transition-all hover:-translate-y-0.5"
            style={{
              borderColor: "rgba(120,80,60,0.10)",
              boxShadow:
                "0 4px 14px -10px rgba(120,80,60,0.14), 0 1px 3px -1px rgba(120,80,60,0.06)",
            }}
          >
            <div
              aria-hidden
              className="relative aspect-square w-full"
              style={{
                background: `linear-gradient(135deg, ${primary}10 0%, ${accent}14 100%)`,
              }}
            >
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ color: primary, opacity: 0.55 }}
              >
                <ShoppingBag
                  size={32}
                  strokeWidth={1.2}
                  aria-hidden
                />
              </div>
              {item.priceLabel && (
                <span
                  className="mk-mono absolute bottom-2.5 left-2.5 rounded-full bg-white px-2.5 py-1 text-[9px] font-bold"
                  style={{
                    color: primary,
                    boxShadow: "0 2px 6px -2px rgba(120,80,60,0.18)",
                  }}
                >
                  {item.priceLabel}
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col p-3.5">
              <h3
                className="mk-display line-clamp-2 text-[12.5px] font-semibold leading-snug"
                style={{ color: INK }}
              >
                {item.title}
              </h3>
              {item.description && (
                <p
                  className="mt-1.5 line-clamp-2 text-[11px] leading-snug"
                  style={{ color: INK_SOFT }}
                >
                  {item.description}
                </p>
              )}
              <div
                className="mt-3 flex items-center gap-1 text-[10px] font-bold transition-colors"
                style={{ color: primary }}
              >
                <span className="mk-mono" style={{ letterSpacing: "0.18em" }}>
                  {buyLabel}
                </span>
                <ArrowUpRight
                  size={12}
                  strokeWidth={2.4}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// =============================================================================
// Quick actions — soft pills on cream. Crimson primary.
// =============================================================================

function QuickActionStrip({
  slug,
  sourceQs,
  phoneDigits,
  waDigits,
  email,
  primary,
  accent,
  translations,
}: {
  slug: string;
  sourceQs: string;
  phoneDigits: string;
  waDigits: string;
  email?: string;
  primary: string;
  accent: string;
  translations: MkCopy;
}) {
  void accent;
  type Pill = {
    label: string;
    href: string;
    Icon: LucideIcon;
    tone: "primary" | "neutral";
    download?: boolean;
    external?: boolean;
  };

  const pills: Pill[] = [
    {
      label: translations.saveContact,
      href: `/api/cards/${encodeURIComponent(slug)}/vcard${sourceQs}`,
      Icon: UserPlus,
      tone: "primary",
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

  return (
    <div className="grid grid-cols-2 gap-2 px-7 pb-2 pt-7 sm:grid-cols-4">
      {pills.map((p, i) => {
        const isPrimary = p.tone === "primary";
        const ext = p.external
          ? { target: "_blank", rel: "noopener noreferrer" as const }
          : {};
        return (
          <a
            key={`${p.label}-${i}`}
            href={p.href}
            download={p.download}
            {...ext}
            className="group relative flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-[12px] font-semibold transition-all hover:-translate-y-px"
            style={
              isPrimary
                ? {
                    background: primary,
                    color: "white",
                    boxShadow: `0 6px 16px -8px ${primary}A6`,
                  }
                : {
                    background: "white",
                    color: INK,
                    border: "1px solid rgba(120,80,60,0.12)",
                  }
            }
          >
            <p.Icon size={13} strokeWidth={2} />
            <span className="leading-none">{p.label}</span>
          </a>
        );
      })}
    </div>
  );
}

// =============================================================================
// GalleryStrip — extra product photos / studio shots, horizontal snap row.
// =============================================================================

function GalleryStrip({
  items,
  accent,
  title,
}: {
  items: Array<{ src: string; alt?: string }>;
  accent: string;
  title: string;
}) {
  return (
    <section className="pt-2">
      <div className="mb-4 flex items-center gap-3 px-7">
        <span
          aria-hidden
          className="block h-px w-6"
          style={{ background: accent }}
        />
        <h2
          className="mk-display text-[14px] font-semibold"
          style={{ color: INK }}
        >
          {title}
        </h2>
        <span
          aria-hidden
          className="block h-px flex-1"
          style={{
            background: `linear-gradient(90deg, ${accent}33 0%, transparent 100%)`,
          }}
        />
      </div>

      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-7 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item, i) => {
          const url = resolveAssetUrl(item.src);
          return (
            <div
              key={`${item.src}-${i}`}
              className="relative aspect-square w-[120px] shrink-0 snap-start overflow-hidden rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(225,29,72,0.06) 0%, rgba(124,45,60,0.10) 100%)",
                border: "1px solid rgba(120,80,60,0.10)",
              }}
            >
              {url && (
                <Image
                  src={url}
                  alt={item.alt ?? ""}
                  fill
                  unoptimized
                  sizes="120px"
                  className="object-cover"
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// =============================================================================
// Testimonials — cream cards with crimson stars.
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
    <Section title={title} accent={accent}>
      <div className="grid gap-3">
        {items.slice(0, 3).map((item, i) => (
          <figure
            key={`${item.author}-${i}`}
            className="relative rounded-2xl border bg-white p-4"
            style={{
              borderColor: "rgba(120,80,60,0.10)",
              boxShadow: "0 2px 10px -6px rgba(120,80,60,0.10)",
            }}
          >
            <Quote
              aria-hidden
              size={28}
              strokeWidth={1.4}
              className="absolute right-3 top-3 opacity-20"
              style={{ color: accent }}
            />
            <div
              className="mb-2 flex items-center gap-0.5"
              style={{ color: accent }}
              aria-label="5 of 5 stars"
            >
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} size={11} strokeWidth={1.5} fill="currentColor" />
              ))}
            </div>
            <blockquote
              className="text-[13px] leading-snug"
              style={{ color: INK }}
            >
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <figcaption
              className="mk-display mt-3 text-[11.5px] font-semibold"
              style={{ color: INK }}
            >
              {item.author}
              {item.role && (
                <span
                  className="ml-2 font-normal"
                  style={{ color: INK_SOFT }}
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
// WhatsApp CTA — primary order funnel.
// =============================================================================

function WhatsAppCTA({
  waDigits,
  primary,
  translations,
}: {
  waDigits: string;
  primary: string;
  translations: MkCopy;
}) {
  if (!waDigits) return null;
  return (
    <section className="px-7 py-2">
      <a
        href={`https://wa.me/${waDigits}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-4 overflow-hidden rounded-2xl px-5 py-4 transition-all hover:-translate-y-px"
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, ${primary}cc 100%)`,
          boxShadow: `0 18px 40px -22px ${primary}A6`,
        }}
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20"
          aria-hidden
        >
          <MessageCircle size={18} strokeWidth={1.8} className="text-white" />
        </span>
        <span className="flex-1 text-white">
          <span className="mk-display block text-[15px] font-semibold">
            {translations.ctaWhatsapp}
          </span>
          <span className="mk-mono mt-0.5 block text-[9px] font-semibold opacity-80">
            {translations.ctaWhatsappHint}
          </span>
        </span>
        <ArrowUpRight
          size={18}
          strokeWidth={2}
          className="text-white/80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
  locale: "de" | "en" | "tr";
  primary: string;
  accent: string;
}) {
  void accent;
  return (
    <section className="px-7 py-2">
      <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={primary} locale={locale} />
      <ExchangeSlot slug={slug} primary={primary} locale={locale} />
    </section>
  );
}

// =============================================================================
// Footer — claret band signature on warm cream.
// =============================================================================

function Footer({
  siteUrl,
  slug,
  impressumUrl,
  privacyUrl,
  primary,
  accent,
  translations,
}: {
  siteUrl: string;
  slug: string;
  impressumUrl?: string;
  privacyUrl?: string;
  primary: string;
  accent: string;
  translations: MkCopy;
}) {
  void primary;
  return (
    <footer
      className="relative px-7 pb-7 pt-7"
      style={{
        background: SURFACE_WARM,
        color: INK_SOFT,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-x-7 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accent}55 50%, transparent 100%)`,
        }}
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10.5px]">
        <FooterShare siteUrl={siteUrl} slug={slug} />
        {impressumUrl && (
          <a
            href={impressumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[color:var(--mk-ink,#3d2c2c)]"
            style={{ color: INK_SOFT }}
          >
            {translations.impressum}
          </a>
        )}
        {privacyUrl && (
          <a
            href={privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[color:var(--mk-ink,#3d2c2c)]"
            style={{ color: INK_SOFT }}
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
            className="mk-display font-semibold transition-colors"
            style={{ color: accent }}
          >
            OpSolid
          </a>
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t pt-4" style={{ borderColor: "rgba(120,80,60,0.10)" }}>
        <MapPin size={11} strokeWidth={1.6} style={{ color: accent }} />
        <span className="mk-mono text-[9.5px]" style={{ color: INK_SOFT }}>
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
      className="hover:text-[color:var(--mk-ink,#3d2c2c)]"
      style={{ color: INK_SOFT }}
    >
      Share
    </button>
  );
}

// =============================================================================
// Registry entry + sample data.
// =============================================================================

export const makerEntry: TemplateRegistryEntry = {
  id: 8,
  key: "maker",
  name: "Maker",
  industry: "E-commerce / artisan / small-batch maker",
  Component: Maker,
  supports: {
    services: true, // products
    faqs: false,
    testimonials: true,
    gallery: true,
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
  sampleSlug: "sample-maker",
};

export const makerSample: SampleData = {
  templateId: 8,
  slug: "sample-maker",
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
  cardData: {
    name: "Tilde Aas",
    title: "Founder & ceramicist",
    position: "Småbruk Studio",
    company: "Tilde Småbruk",
    email: "hei@tildesmaabruk.no",
    phone: "+47 91 24 88 02",
    whatsapp: "+47 91 24 88 02",
    website: "https://tildesmaabruk.no",
    address: "Sløvågveien 14, 5961 Brekke, Norway",
    bio: "Hand-thrown stoneware from a converted dairy barn on the Sognefjord. Each piece is wood-fired in batches of twelve, glazed with locally foraged ash. Stocked at Frama Copenhagen, Norse Store Oslo and Toast London.",
    sectorKey: "creator",
    services: [
      {
        title: "Hand-thrown bowl, oat",
        description:
          "1.2 L stoneware bowl, glazed in ash-grey 'Havre'. Each piece subtly different.",
        priceLabel: "kr 690",
      },
      {
        title: "Oak-fired vase, fjord",
        description:
          "32 cm tall, single-flower silhouette. Reduction-fired in oak embers, cobalt rim.",
        priceLabel: "kr 1 240",
      },
      {
        title: "Coffee tumbler set / 4",
        description:
          "Wheel-thrown 220 ml tumblers. Cream interior, iron-speckle exterior.",
        priceLabel: "kr 1 480",
      },
      {
        title: "Serving platter, drift",
        description:
          "38 cm oval platter for tables that take dinner seriously.",
        priceLabel: "kr 1 990",
      },
    ],
    gallery: [
      { src: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80", alt: "Studio shelf" },
      { src: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80", alt: "Hands at the wheel" },
      { src: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=400&q=80", alt: "Oak-fired kiln" },
      { src: "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=400&q=80", alt: "Glazing batch" },
    ],
    testimonials: [
      {
        author: "Frama",
        role: "Copenhagen",
        quote:
          "Tilde's wares have been on our shelves since 2022. Customers come back specifically for them — the wait list runs three months.",
      },
      {
        author: "Astrid M.",
        role: "Oslo",
        quote:
          "I bought a single tumbler at Norse Store and ended up emailing Tilde for a complete service. Two months later it arrived in straw.",
      },
      {
        author: "Wallpaper*",
        role: "Editorial, 2025",
        quote:
          "A quietly serious studio working in the older Norwegian idiom — slow, fired with what's nearby, stocked where it matters.",
      },
    ],
    socials: {
      instagram: "https://instagram.com/tilde.smaabruk",
    },
    impressumUrl: "https://tildesmaabruk.no/info",
    privacyUrl: "https://tildesmaabruk.no/privacy",
  },
};
