"use client";

// =============================================================================
// EcommercePure — v2 template (id=82, key="ecommerce-pure").
//
// Sector: E-commerce / Online boutique — PURE variant. Mood: white editorial
// product showcase, DM Sans + DM Mono. Inspired by kart_08_eticaret_pure.html.
//
// Design DNA (different from default Ecommerce, EcommerceNoir/Vivid):
//   - Hero block with tiny ink "logo-mark" square + EST tag, then mega
//     DM-Sans 64px name with tracked-tight kerning + accent dot.
//   - Profile band: 96px square photo (no rounding) + role chip pill.
//   - Categories list as numbered rows (01, 02, 03…) with sub-mono labels and
//     right arrow on hover-padding-shift.
//   - 130px-wide order-info table with mono uppercase keys + body values.
//   - 2x2 stat grid with extra-large DM Sans digits.
//   - Channels rows: name | mono-uppercase link.
//   - CTA: ink fill primary + ghost mono-tracked secondary.
// =============================================================================

import * as React from "react";
import Image from "next/image";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { resolveStats, resolveTagline, resolveLocation } from "./shared/profileExtras";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#ffffff";
const LOCKED_ACCENT = "#1a1a1a";
const PAGE = "#f4f4f2";
const SURFACE = "#ffffff";
const INK = "#111111";
const INK_2 = "#444444";
const MUTED = "#888888";
const LINE = "#e5e5e3";
const LINE_2 = "#d4d4d0";
const ACCENT = "#e8a838";
const ACCENT_2 = "#a86d10";

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
  categoriesH: string;
  channelsH: string;
  orderRefH: string;
  bookBtn: string;
  websiteCta: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    categoriesH: "Kategorien",
    channelsH: "Channels",
    orderRefH: "Order",
    bookBtn: "Bestellung starten",
    websiteCta: "Website",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    categoriesH: "Categories",
    channelsH: "Channels",
    orderRefH: "Order",
    bookBtn: "Start order",
    websiteCta: "Website",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    categoriesH: "Kategoriler",
    channelsH: "Kanallar",
    orderRefH: "Order",
    bookBtn: "Siparişe Başla",
    websiteCta: "Website",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
  es: {

    categoriesH: "Categorías",
    channelsH: "Canales",
    orderRefH: "Pedido",
    bookBtn: "Iniciar pedido",
    websiteCta: "Sitio web",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    categoriesH: "Categorie",
    channelsH: "Canali",
    orderRefH: "Ordine",
    bookBtn: "Inizia ordine",
    websiteCta: "Sito web",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    categoriesH: "Catégories",
    channelsH: "Canaux",
    orderRefH: "Commande",
    bookBtn: "Démarrer la commande",
    websiteCta: "Site web",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    categoriesH: "الفئات",
    channelsH: "القنوات",
    orderRefH: "طلب",
    bookBtn: "ابدأ الطلب",
    websiteCta: "الموقع",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

export function EcommercePure({
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
  void primary;
  void brandAccentHex;
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = (cardData.services ?? []).slice(0, 5);
  const stats = resolveStats(cardData.stats);
  const tagline = resolveTagline(cardData);
  const locationLabel = resolveLocation(cardData);
  const monogram = getInitials(cardData.company || cardData.name);
  const nameParts = (cardData.company || cardData.name).trim().split(/\s+/);
  const nameFirst = nameParts[0] ?? cardData.name;
  const nameLast = nameParts.slice(1).join(" ");

  return (
    <article
      data-template="ecommerce-pure"
      className="ecommerce-pure-card relative mx-auto w-full max-w-[460px]"
      style={{ background: SURFACE, color: INK }}
    >
      <style jsx global>{`
        .ecommerce-pure-card {
          font-family: var(--tpl-font-body, 'DM Sans', system-ui, sans-serif);
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
        }
        .ecommerce-pure-card .mono {
          font-family: var(--tpl-font-display, 'DM Mono', 'JetBrains Mono', monospace);
        }
        .ecommerce-pure-card a { color: inherit; }
      `}</style>

      {/* HERO */}
      <section className="px-7 pt-12 pb-9">
        <div className="mb-9 flex items-center justify-between">
          <div
            className="flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              background: INK,
              color: SURFACE,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.5px",
            }}
          >
            {monogram}
          </div>
          {locationLabel && (
            <span
              className="mono uppercase"
              style={{ fontSize: 10, color: MUTED, letterSpacing: "1.5px" }}
            >
              {locationLabel}
            </span>
          )}
        </div>
        <h1
          style={{
            fontWeight: 700,
            fontSize: "clamp(48px, 14vw, 64px)",
            lineHeight: 0.92,
            letterSpacing: "-3px",
            color: INK,
          }}
        >
          {nameFirst}
          {nameLast && (
            <>
              <br />
              {nameLast}
            </>
          )}
          <span style={{ color: ACCENT }}>.</span>
        </h1>
        {cardData.bio && (
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.55,
              color: INK_2,
              marginTop: 20,
              fontWeight: 400,
              maxWidth: 360,
            }}
          >
            {cardData.bio}
          </p>
        )}
        {tagline && (
          <div
            className="mono uppercase"
            style={{ fontSize: 11, letterSpacing: "2px", color: MUTED, marginTop: 20 }}
          >
            {tagline}
          </div>
        )}
      </section>

      <div style={{ height: 1, background: INK }} />

      {/* PROFILE */}
      <section className="grid items-center gap-[18px] px-7 py-7" style={{ gridTemplateColumns: "96px 1fr" }}>
        <div style={{ width: 96, height: 96, background: PAGE, overflow: "hidden" }}>
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={cardData.name}
              width={96}
              height={96}
              unoptimized
              className="block h-full w-full object-cover tpl-photo"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ background: PAGE, color: INK, fontSize: 36, fontWeight: 700 }}
            >
              {(cardData.name[0] ?? "?").toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h2
            style={{ fontWeight: 600, fontSize: 18, color: INK, letterSpacing: "-0.3px" }}
          >
            {cardData.name}
          </h2>
          {tagline && (
            <div
              className="mono uppercase"
              style={{ fontSize: 10, color: MUTED, letterSpacing: "1.5px", marginTop: 4 }}
            >
              {tagline}
            </div>
          )}
        </div>
      </section>

      <div style={{ height: 1, background: LINE }} />

      {/* CATEGORIES / PRODUCTS */}
      {services.length > 0 && (
        <section className="px-7 py-9">
          <div
            className="mb-5 flex items-baseline justify-between border-b pb-3.5"
            style={{ borderColor: LINE }}
          >
            <span
              className="uppercase"
              style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: INK }}
            >
              {t.categoriesH}
            </span>
            <span
              className="mono"
              style={{ fontSize: 10, color: MUTED, letterSpacing: "1.5px" }}
            >
              / 01
            </span>
          </div>
          <div className="flex flex-col">
            {services.map((svc, i) => (
              <a
                key={`${svc.title}-${i}`}
                href={waDigits ? `https://wa.me/${waDigits}` : "#"}
                target={waDigits ? "_blank" : undefined}
                rel={waDigits ? "noopener noreferrer" : undefined}
                className="grid items-center gap-3.5 py-4"
                style={{
                  gridTemplateColumns: "32px 1fr auto auto",
                  borderBottom:
                    i < services.length - 1 ? `1px solid ${LINE}` : "none",
                  textDecoration: "none",
                  color: INK,
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: 11, color: MUTED }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span style={{ fontSize: 15, fontWeight: 500, color: INK }}>
                    {svc.title}
                  </span>
                  {svc.description && (
                    <span
                      className="mono uppercase"
                      style={{
                        display: "block",
                        fontSize: 10,
                        color: MUTED,
                        letterSpacing: "1px",
                        marginTop: 2,
                        fontWeight: 400,
                      }}
                    >
                      {svc.description}
                    </span>
                  )}
                </span>
                {svc.priceLabel && (
                  <span
                    className="mono"
                    style={{ fontSize: 11, color: INK }}
                  >
                    {svc.priceLabel}
                  </span>
                )}
                <span
                  className="mono"
                  style={{ fontSize: 14, color: ACCENT_2 }}
                >
                  →
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      <div style={{ height: 1, background: LINE }} />

      {/* STATS — owner-entered numbers only (resolveStats). */}
      {stats && (
        <div
          className="grid grid-cols-2"
          style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="px-7 py-6"
              style={{
                borderRight: i % 2 === 0 ? `1px solid ${LINE}` : "none",
                borderTop: i >= 2 ? `1px solid ${LINE}` : "none",
              }}
            >
              <div
                style={{ fontWeight: 600, fontSize: 28, letterSpacing: "-1px", color: INK }}
              >
                {s.value}
              </div>
              <div
                className="mono uppercase"
                style={{ fontSize: 10, color: MUTED, letterSpacing: "1.5px", marginTop: 4 }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CHANNELS / CONTACT */}
      <section className="px-7 py-9">
        <div
          className="mb-5 flex items-baseline justify-between border-b pb-3.5"
          style={{ borderColor: LINE }}
        >
          <span
            className="uppercase"
            style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: INK }}
          >
            {t.channelsH}
          </span>
          <span
            className="mono"
            style={{ fontSize: 10, color: MUTED, letterSpacing: "1.5px" }}
          >
            / 02
          </span>
        </div>
        <ContactRows
          cardData={cardData}
          locale={locale}
          variant="hairline"
          accentHex={ACCENT_2}
        />
        {cardData.socials && (
          <div className="mt-5">
            <SocialRow socials={cardData.socials} variant="tile" accentHex={ACCENT_2} />
          </div>
        )}
      </section>

      <div style={{ height: 1, background: LINE }} />

      {/* CTA */}
      <section className="px-7 py-9">
        <div
          className="mb-5 flex items-baseline justify-between border-b pb-3.5"
          style={{ borderColor: LINE }}
        >
          <span
            className="uppercase"
            style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: INK }}
          >
            {t.orderRefH}
          </span>
          <span
            className="mono"
            style={{ fontSize: 10, color: MUTED, letterSpacing: "1.5px" }}
          >
            / 03
          </span>
        </div>
        {(cardData.bookingUrl || waDigits) && (
          <a
            href={
              cardData.bookingUrl ||
              `https://wa.me/${waDigits}?text=${encodeURIComponent(t.bookBtn)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-5 py-4 text-center"
            style={{
              background: INK,
              color: SURFACE,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.5px",
            }}
          >
            {t.bookBtn}
          </a>
        )}
        {cardData.website && (
          <a
            href={`https://${cardData.website.replace(/^https?:\/\//, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mono mt-2.5 block w-full px-5 py-4 text-center uppercase"
            style={{
              background: "transparent",
              border: `1px solid ${LINE_2}`,
              color: INK,
              fontSize: 11,
              letterSpacing: "1.5px",
            }}
          >
            {cardData.website}
          </a>
        )}
      </section>

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="px-7 py-7"
        style={{ borderTop: `1px solid ${LINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={ACCENT_2} locale={locale} />
        <ExchangeSlot slug={slug} primary={ACCENT_2} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-7 py-6"
          labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-center"
        >
          <div
            style={{
              ["--card-primary" as string]: ACCENT_2,
              color: INK,
            }}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer
        className="flex items-center justify-between px-7 py-6"
        style={{ borderTop: `1px solid ${INK}` }}
      >
        <span
          className="mono uppercase"
          style={{ fontSize: 10, color: MUTED, letterSpacing: "1.5px" }}
        >
          © {new Date().getFullYear()}
        </span>
        <span
          className="uppercase"
          style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1px", color: INK }}
        >
          {(cardData.company || cardData.name).toUpperCase()}
        </span>
      </footer>
      <div className="px-7 py-3" style={{ background: PAGE }}>
        <div
          className="mono text-center"
          style={{ fontSize: 10, color: MUTED, letterSpacing: "1px" }}
        >
          {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: INK }}
          >
            OpSolid
          </a>
        </div>
      </div>
    </article>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const ecommercePureEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 82,
  key: "ecommerce-pure",
  name: "E-commerce — Pure",
  industry: "E-commerce / Editorial product showcase",
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
  sampleSlug: "demo-ecommerce-pure",
};

// photo: Unsplash, https://unsplash.com/photos/eF7HN40WbAQ — Free, no attribution required.
export const ecommercePureSample: SampleData = {
  templateId: 82,
  slug: "demo-ecommerce-pure",
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
    stats: [
      { value: "2.400+", label: "Bestellungen" },
      { value: "4,9★", label: "Bewertung" },
      { value: "5", label: "Jahre" },
      { value: "48h", label: "Versand" },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

