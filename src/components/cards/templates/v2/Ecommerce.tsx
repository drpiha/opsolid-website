"use client";

// =============================================================================
// Ecommerce — v2 template (id=80, key="ecommerce").
//
// Sector: E-commerce / Online boutique — DEFAULT variant. Mood: friendly,
// product-focused, neutral cream + warm-rose accent. Inspired by
// kart_08_eticaret.html.
//
// Design DNA (different from Maker / Atelier and from EcommerceNoir/Pure/Vivid):
//   - Warm cream surface (#fdf8f3) with rose→pink gradient accent on monogram
//     and key CTAs.
//   - Rounded shop header with monogram + tagline.
//   - Profile strip floats up over header on a white pill card with avatar +
//     bio.
//   - Decorative ornament dividers between sections (✿ ✿ ✿).
//   - Product/Service grid 2-col with rounded cards + price chip + per-row
//     "Order" CTA → WhatsApp.
//   - Order info white card with green WhatsApp big button + 3 inline icon
//     rows.
//   - 2-col contact grid + social row pills (rose IG / green WA).
// =============================================================================

import * as React from "react";
import Image from "next/image";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#1a1a1a";
const LOCKED_ACCENT = "#e8c4b8";
const PAGE = "#fdf8f3";
const SURFACE = "#ffffff";
const ROSE = "#e11d48";
const PINK = "#f472b6";
const WA_GREEN = "#25d366";
const TEXT = "#3d2c2c";
const TEXT_DARK = "#2d1f1f";
const MUTED = "#a07070";
const MUTED_2 = "#b08080";
const LINE = "#f5ebe5";

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
  if (parts.length === 1) return (parts[0][0] ?? "•").toUpperCase();
  return (
    (parts[0][0] ?? "").toUpperCase() + (parts[parts.length - 1][0] ?? "").toUpperCase()
  );
}

interface Copy {
  taglineFallback: string;
  productsH: string;
  orderInfoH: string;
  orderInfoLine1: string;
  orderInfoLine2: string;
  orderInfoLine3: string;
  contactH: string;
  orderBtn: string;
  bookBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr", Copy> = {
  de: {
    taglineFallback: "Online Boutique",
    productsH: "Unsere Produkte",
    orderInfoH: "Bestellinformation",
    orderInfoLine1: "Kostenloser Versand ab €50",
    orderInfoLine2: "2–4 Werktage Lieferzeit",
    orderInfoLine3: "Geschenkverpackung verfügbar",
    contactH: "Kontakt",
    orderBtn: "Bestellen",
    bookBtn: "Über WhatsApp bestellen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    taglineFallback: "Online Boutique",
    productsH: "Our Products",
    orderInfoH: "Order Info",
    orderInfoLine1: "Free shipping over €50",
    orderInfoLine2: "2–4 business day delivery",
    orderInfoLine3: "Gift wrapping available",
    contactH: "Contact",
    orderBtn: "Order",
    bookBtn: "Order via WhatsApp",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    taglineFallback: "Online Butik",
    productsH: "Ürünlerimiz",
    orderInfoH: "Sipariş Bilgisi",
    orderInfoLine1: "€50 üzeri ücretsiz kargo",
    orderInfoLine2: "2–4 iş günü teslimat",
    orderInfoLine3: "Hediye paketi seçeneği mevcut",
    contactH: "İletişim",
    orderBtn: "Sipariş Ver",
    bookBtn: "WhatsApp ile Sipariş Verin",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
};

export function Ecommerce({
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
  void primary;
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = (cardData.services ?? []).slice(0, 6);
  const monogram = getInitials(cardData.company || cardData.name);
  const accentGrad = `linear-gradient(135deg, ${ROSE}, ${PINK})`;

  const Divider = () => (
    <div
      aria-hidden
      className="flex items-center justify-center gap-2 px-5 py-2"
      style={{ color: accent, fontSize: 10, letterSpacing: "4px" }}
    >
      <span
        className="flex-1"
        style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />
      ✿ ✿ ✿
      <span
        className="flex-1"
        style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />
    </div>
  );

  return (
    <article
      data-template="ecommerce"
      className="ecommerce-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: PAGE, color: TEXT }}
    >
      <style jsx global>{`
        .ecommerce-card {
          font-family: var(--tpl-font-body, 'Nunito', system-ui, sans-serif);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .ecommerce-card .display {
          font-family: var(--tpl-font-display, 'Poppins', 'Inter', system-ui, sans-serif);
        }
        .ecommerce-card a { color: inherit; }
      `}</style>

      {/* SHOP HEADER */}
      <header
        className="relative px-5 pt-10 pb-7 text-center"
        style={{ background: `linear-gradient(180deg, #fff9f5 0%, ${PAGE} 100%)` }}
      >
        <div
          className="display mx-auto mb-3.5 inline-flex items-center justify-center rounded-full"
          style={{
            width: 72,
            height: 72,
            background: accentGrad,
            color: "#fff",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "1px",
            boxShadow: `0 4px 20px ${ROSE}40`,
          }}
        >
          {monogram}
        </div>
        <h1
          className="display"
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: TEXT_DARK,
            letterSpacing: "0.5px",
          }}
        >
          {cardData.company || cardData.name}
        </h1>
        <p style={{ fontSize: 14, color: MUTED, marginTop: 4, fontWeight: 500 }}>
          {cardData.title || cardData.position || t.taglineFallback}
        </p>
        <span
          aria-hidden
          className="absolute"
          style={{
            bottom: 0,
            left: "20%",
            right: "20%",
            height: 1,
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />
      </header>

      {/* PROFILE STRIP — floats up */}
      <div
        className="relative z-20 mx-4 flex items-center gap-3.5 rounded-2xl px-5 py-4"
        style={{
          background: SURFACE,
          marginTop: -8,
          boxShadow: `0 2px 12px ${MUTED_2}29`,
        }}
      >
        <div style={{ width: 52, height: 52, borderRadius: "50%", flexShrink: 0 }}>
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={cardData.name}
              width={52}
              height={52}
              unoptimized
              className="block h-full w-full rounded-full object-cover tpl-photo"
              style={{ border: `2px solid ${PINK}` }}
            />
          ) : (
            <div
              className="display flex h-full w-full items-center justify-center rounded-full"
              style={{
                background: PAGE,
                color: ROSE,
                border: `2px solid ${PINK}`,
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              {(cardData.name[0] ?? "?").toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h2
            className="display truncate"
            style={{ fontSize: 15.5, fontWeight: 600, color: TEXT_DARK }}
          >
            {cardData.name}
          </h2>
          <p style={{ fontSize: 12.5, color: MUTED, marginTop: 1 }}>
            {cardData.title || cardData.position || t.taglineFallback}
          </p>
          {cardData.bio && (
            <div
              style={{ fontSize: 12, color: MUTED_2, marginTop: 4, lineHeight: 1.4 }}
            >
              {cardData.bio}
            </div>
          )}
        </div>
      </div>

      <Divider />

      {/* PRODUCTS / SERVICES */}
      {services.length > 0 && (
        <section className="px-5 py-4">
          <SectTitle title={t.productsH} accent={ROSE} pink={PINK} />
          <div className="mt-4 grid grid-cols-2 gap-3.5">
            {services.map((svc, i) => (
              <article
                key={`${svc.title}-${i}`}
                className="overflow-hidden rounded-2xl"
                style={{
                  background: SURFACE,
                  boxShadow: `0 2px 14px ${MUTED_2}1f`,
                }}
              >
                <div
                  className="relative"
                  style={{
                    aspectRatio: "1 / 1",
                    background: `linear-gradient(135deg, ${PINK}1a, ${ROSE}1a)`,
                  }}
                >
                  <div
                    className="display absolute inset-0 flex items-center justify-center"
                    style={{
                      color: ROSE,
                      fontSize: 32,
                      fontWeight: 700,
                      opacity: 0.7,
                    }}
                  >
                    {svc.title.slice(0, 1).toUpperCase()}
                  </div>
                </div>
                <div className="px-3.5 pt-3 pb-3.5">
                  <div
                    className="display"
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: TEXT_DARK,
                      lineHeight: 1.3,
                    }}
                  >
                    {svc.title}
                  </div>
                  {svc.priceLabel && (
                    <div
                      className="display"
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: ROSE,
                        marginTop: 4,
                      }}
                    >
                      {svc.priceLabel}
                    </div>
                  )}
                  {waDigits && (
                    <a
                      href={`https://wa.me/${waDigits}?text=${encodeURIComponent(`Merhaba, "${svc.title}" için sipariş vermek istiyorum.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 block w-full rounded-xl py-2.5 text-center"
                      style={{
                        background: accentGrad,
                        color: "#fff",
                        fontSize: 12.5,
                        fontWeight: 700,
                      }}
                    >
                      {t.orderBtn}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <Divider />

      {/* ORDER INFO */}
      <section className="px-5 py-4">
        <SectTitle title={t.orderInfoH} accent={ROSE} pink={PINK} />
        <div
          className="mt-4 rounded-2xl px-5 py-5"
          style={{ background: SURFACE, boxShadow: `0 2px 14px ${MUTED_2}1f` }}
        >
          {waDigits && (
            <a
              href={`https://wa.me/${waDigits}?text=${encodeURIComponent(t.bookBtn)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="display flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5"
              style={{
                background: WA_GREEN,
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <span aria-hidden>💬</span>
              {t.bookBtn}
            </a>
          )}
          <div className="mt-3 flex flex-col gap-2">
            <InfoRow icon="📦" text={t.orderInfoLine1} />
            <InfoRow icon="🚚" text={t.orderInfoLine2} />
            <InfoRow icon="🎁" text={t.orderInfoLine3} />
          </div>
        </div>
      </section>

      <Divider />

      {/* CONTACT */}
      <section className="px-5 py-4">
        <SectTitle title={t.contactH} accent={ROSE} pink={PINK} />
        <div
          className="mt-4 rounded-2xl px-5 py-3"
          style={{ background: SURFACE, boxShadow: `0 2px 14px ${MUTED_2}1f` }}
        >
          <ContactRows
            cardData={cardData}
            locale={locale}
            variant="hairline"
            accentHex={ROSE}
          />
        </div>
        {cardData.socials && (
          <div className="mt-4">
            <SocialRow socials={cardData.socials} variant="tile" accentHex={ROSE} />
          </div>
        )}
      </section>

      {/* WALLET / SEND / EXCHANGE */}
      <section className="mt-2 px-5 py-4">
        <div
          className="rounded-2xl px-5 py-5"
          style={{ background: SURFACE, boxShadow: `0 2px 14px ${MUTED_2}1f` }}
        >
          <SendMyInfoSlot slug={slug} sourceQs="" primary={ROSE} locale={locale} />
          <ExchangeSlot slug={slug} primary={ROSE} locale={locale} />
        </div>
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-5 py-6"
          labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-center"
        >
          <div
            style={{
              ["--card-primary" as string]: ROSE,
              color: TEXT,
            }}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer
        className="px-5 py-6 text-center"
        style={{ borderTop: `1px solid ${LINE}`, marginTop: 8 }}
      >
        <p style={{ fontSize: 12, color: MUTED_2 }}>
          © {new Date().getFullYear()}{" "}
          <span style={{ color: ROSE, fontWeight: 700 }}>
            {cardData.company || cardData.name}
          </span>
        </p>
        <p style={{ fontSize: 11, color: MUTED_2, marginTop: 4 }}>
          {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: ROSE, fontWeight: 600 }}
          >
            OpSolid
          </a>
        </p>
      </footer>
    </article>
  );
}

function SectTitle({
  title,
  accent,
  pink,
}: {
  title: string;
  accent: string;
  pink: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${accent}, ${pink})`,
          flexShrink: 0,
        }}
      />
      <h2
        className="display"
        style={{
          fontSize: 17,
          fontWeight: 600,
          color: "#2d1f1f",
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function InfoRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div
      className="flex items-start gap-2.5 py-1.5"
      style={{ fontSize: 13.5, color: "#5a4040", lineHeight: 1.5 }}
    >
      <span aria-hidden style={{ fontSize: 17, flexShrink: 0, marginTop: 1 }}>
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const ecommerceEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 80,
  key: "ecommerce",
  name: "E-commerce",
  industry: "E-commerce / Online boutique",
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
  sampleSlug: "demo-ecommerce",
};

// photo: Unsplash, https://unsplash.com/photos/eF7HN40WbAQ — Free, no attribution required.
export const ecommerceSample: SampleData = {
  templateId: 80,
  slug: "demo-ecommerce",
  cardData: {
    name: "Zeynep Kaya",
    position: "Gründerin & CEO",
    title: "Gründerin & CEO",
    company: "Pazar Shop",
    email: "zeynep@pazar-shop.de",
    phone: "+49 172 556 7891",
    whatsapp: "+49 172 556 7891",
    website: "pazar-shop.de",
    address: "Oranienstraße 30, 10999 Berlin",
    bio: "Kuratierte Mode & Accessoires aus der Türkei & Deutschland. Kostenloser Versand ab €50.",
    bookingUrl: "https://pazar-shop.de/shop",
    impressumUrl: "https://pazar-shop.de/impressum",
    privacyUrl: "https://pazar-shop.de/datenschutz",
    sectorKey: "retail",
    socials: {
      instagram: "https://instagram.com/pazar.shop",
      tiktok: "https://tiktok.com/@pazarshop",
    },
    services: [
      { title: "Seidenschal", description: "Handbedruckt, Premium-Seide.", priceLabel: "€89" },
      { title: "Handtasche", description: "Vollnarbenleder, handgenäht.", priceLabel: "€145" },
      { title: "Schmuckset", description: "Versilbert, kuratiert.", priceLabel: "€65" },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
