"use client";

// =============================================================================
// EcommerceNoir — v2 template (id=81, key="ecommerce-noir").
//
// Sector: E-commerce / Online boutique — NOIR variant. Mood: dark luxury
// boutique, deep ink surface, champagne-gold trim, Playfair Display + Inter
// light. Inspired by kart_08_eticaret_noir.html.
//
// Design DNA (different from default Ecommerce, EcommercePure/Vivid):
//   - 80px circular monogram in gold-stroke ring with horizontal hairline ears.
//   - Centred Playfair brand-h1 with mono-uppercase eyebrow + italic French
//     "Maison fondée…" tag.
//   - Profile band with 62px gold-ring avatar + Founder—Curator role caps.
//   - Featured-piece card: 4:3 image with limited-edition gold badge over
//     darkened gradient.
//   - Collection 2x2 category grid with hover gold inner-frame and SVG icons.
//   - 2x2 stats with Playfair gold digits.
//   - Service rows on hairline-divided dark stripes.
//   - Letter-spacing-on-hover gold-outline CTA.
// =============================================================================

import * as React from "react";
import Image from "next/image";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#0d0d0d";
const LOCKED_ACCENT = "#f0c04a";
const SURFACE = "#080808";
const SURFACE_2 = "#111111";
const SURFACE_3 = "#1a1a1a";
const LINE = "#222222";
const LINE_2 = "#2e2e2e";
const TEXT = "#f0ebe0";
const MUTED = "#8a8478";
const DIM = "#5a554a";

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
  brandPre: string;
  brandTag: string;
  taglineFallback: string;
  featuredEyebrow: string;
  collectionPre: string;
  collectionH: string;
  collectionSub: string;
  servicesLabel: string;
  reviewsLabel: string;
  serviceH: string;
  serviceSub: string;
  bookBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  qrLabel: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    brandPre: "Premium Kollektion",
    brandTag: "Maison fondée en 2021",
    taglineFallback: "Founder & Curator",
    featuredEyebrow: "— Featured Piece —",
    collectionPre: "FW26",
    collectionH: "Kollektion",
    collectionSub: "Kuratierte Mode & Accessoires",
    servicesLabel: "Produkte",
    reviewsLabel: "Bewertungen",
    serviceH: "Le Service",
    serviceSub: "— Unsere Leistungen —",
    bookBtn: "Bestellung aufgeben",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    qrLabel: "Scan to shop",
  },
  en: {
    brandPre: "Premium Collection",
    brandTag: "Maison fondée en 2021",
    taglineFallback: "Founder & Curator",
    featuredEyebrow: "— Featured Piece —",
    collectionPre: "FW26",
    collectionH: "Collection",
    collectionSub: "Curated fashion & accessories",
    servicesLabel: "Products",
    reviewsLabel: "Reviews",
    serviceH: "Le Service",
    serviceSub: "— What we offer —",
    bookBtn: "Place order",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    qrLabel: "Scan to shop",
  },
  tr: {
    brandPre: "Premium Koleksiyon",
    brandTag: "Maison fondée en 2021",
    taglineFallback: "Founder & Curator",
    featuredEyebrow: "— Featured Piece —",
    collectionPre: "SS26",
    collectionH: "Koleksiyon",
    collectionSub: "Kuratörlü moda ve aksesuar",
    servicesLabel: "Ürünler",
    reviewsLabel: "Yorum",
    serviceH: "Le Service",
    serviceSub: "— Hizmetlerimiz —",
    bookBtn: "Sipariş Ver",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    qrLabel: "Scan to shop",
  },
  es: {

    brandPre: "Colección Premium",
    brandTag: "Maison fondée en 2021",
    taglineFallback: "Fundador y curador",
    featuredEyebrow: "— Featured Piece —",
    collectionPre: "FW26",
    collectionH: "Colección",
    collectionSub: "Moda y accesorios seleccionados",
    servicesLabel: "Productos",
    reviewsLabel: "Reseñas",
    serviceH: "El servicio",
    serviceSub: "— What we offer —",
    bookBtn: "Realizar pedido",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
    qrLabel: "Escanear para comprar",
  
  },
  it: {

    brandPre: "Collezione Premium",
    brandTag: "Maison fondée en 2021",
    taglineFallback: "Fondatore e curatore",
    featuredEyebrow: "— Featured Piece —",
    collectionPre: "FW26",
    collectionH: "Collezione",
    collectionSub: "Moda e accessori selezionati",
    servicesLabel: "Prodotti",
    reviewsLabel: "Recensioni",
    serviceH: "Il servizio",
    serviceSub: "— What we offer —",
    bookBtn: "Effettua ordine",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
    qrLabel: "Scansiona per acquistare",
  
  },
  fr: {

    brandPre: "Collection Premium",
    brandTag: "Maison fondée en 2021",
    taglineFallback: "Fondateur et curateur",
    featuredEyebrow: "— Featured Piece —",
    collectionPre: "FW26",
    collectionH: "Collection",
    collectionSub: "Mode et accessoires sélectionnés",
    servicesLabel: "Produits",
    reviewsLabel: "Avis",
    serviceH: "Le service",
    serviceSub: "— What we offer —",
    bookBtn: "Passer commande",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
    qrLabel: "Scanner pour acheter",
  
  },
  ar: {

    brandPre: "المجموعة المميزة",
    brandTag: "Maison fondée en 2021",
    taglineFallback: "مؤسس ومنسق",
    featuredEyebrow: "— Featured Piece —",
    collectionPre: "FW26",
    collectionH: "مجموعة",
    collectionSub: "أزياء وإكسسوارات مختارة",
    servicesLabel: "المنتجات",
    reviewsLabel: "التقييمات",
    serviceH: "الخدمة",
    serviceSub: "— What we offer —",
    bookBtn: "إتمام الطلب",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
    qrLabel: "امسح للتسوق",
  
  },
};

export function EcommerceNoir({
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

  const allServices = cardData.services ?? [];
  const services = allServices.slice(0, 5);
  const testimonials = cardData.testimonials ?? [];
  const featured = services[0];
  const remaining = services.slice(1, 5);
  const monogram = getInitials(cardData.company || cardData.name);
  const cityFromAddress = cardData.address?.split(",").slice(-1)[0]?.trim();

  return (
    <article
      data-template="ecommerce-noir"
      className="ecommerce-noir-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: TEXT }}
    >
      <style jsx global>{`
        .ecommerce-noir-card {
          font-family: var(--tpl-font-body, 'Inter', system-ui, sans-serif);
          font-weight: 300;
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .ecommerce-noir-card .serif {
          font-family: var(--tpl-font-display, 'Playfair Display', 'Cormorant Garamond', serif);
        }
        .ecommerce-noir-card a { color: inherit; }
      `}</style>

      {/* HEADER */}
      <header
        className="px-6 pt-14 pb-9 text-center"
        style={{ borderBottom: `1px solid ${LINE}` }}
      >
        <div
          className="serif relative mx-auto mb-5 flex items-center justify-center rounded-full"
          style={{
            width: 80,
            height: 80,
            border: `1.5px solid ${accent}`,
            color: accent,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: "2px",
          }}
        >
          {monogram}
          <span
            aria-hidden
            className="absolute"
            style={{ left: -22, top: "50%", width: 14, height: 1, background: accent }}
          />
          <span
            aria-hidden
            className="absolute"
            style={{ right: -22, top: "50%", width: 14, height: 1, background: accent }}
          />
        </div>
        <div
          className="uppercase"
          style={{ fontSize: 10, fontWeight: 500, color: accent, letterSpacing: "5px", marginBottom: 8 }}
        >
          {t.brandPre}
        </div>
        <h1
          className="serif"
          style={{
            fontWeight: 400,
            fontSize: "clamp(28px, 9vw, 36px)",
            letterSpacing: "1px",
            color: TEXT,
            lineHeight: 1.05,
          }}
        >
          {cardData.company || cardData.name}
        </h1>
        <p
          className="serif italic"
          style={{ fontSize: 13, color: MUTED, marginTop: 14, letterSpacing: "0.5px" }}
        >
          {t.brandTag}
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <span style={{ width: 40, height: 1, background: accent, opacity: 0.5 }} />
          <span
            aria-hidden
            style={{ width: 4, height: 4, background: accent, transform: "rotate(45deg)" }}
          />
          <span style={{ width: 40, height: 1, background: accent, opacity: 0.5 }} />
        </div>
      </header>

      {/* PROFILE */}
      <section
        className="flex items-center gap-4 px-6 py-6"
        style={{ background: SURFACE_2, borderBottom: `1px solid ${LINE}` }}
      >
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: "50%",
            border: `1.5px solid ${accent}`,
            padding: 3,
            flexShrink: 0,
          }}
        >
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={cardData.name}
              width={56}
              height={56}
              unoptimized
              className="block h-full w-full rounded-full object-cover tpl-photo"
            />
          ) : (
            <div
              className="serif flex h-full w-full items-center justify-center rounded-full"
              style={{ background: SURFACE_3, color: accent, fontSize: 22, fontWeight: 700 }}
            >
              {(cardData.name[0] ?? "?").toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h3
            className="serif"
            style={{ fontWeight: 400, fontSize: 17, color: TEXT }}
          >
            {cardData.name}
          </h3>
          <p
            className="uppercase"
            style={{ fontSize: 11, color: accent, letterSpacing: "2px", marginTop: 3 }}
          >
            {cardData.title || cardData.position || t.taglineFallback}
          </p>
        </div>
      </section>

      {/* FEATURED PIECE */}
      {featured && (
        <section className="px-5 py-9">
          <div
            className="uppercase mb-3.5 text-center"
            style={{ fontSize: 10, color: accent, letterSpacing: "4px" }}
          >
            {t.featuredEyebrow}
          </div>
          <article
            className="overflow-hidden"
            style={{ background: SURFACE_2, border: `1px solid ${LINE_2}` }}
          >
            <div
              className="relative w-full"
              style={{ aspectRatio: "4 / 3", overflow: "hidden" }}
            >
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={featured.title}
                  fill
                  unoptimized
                  className="object-cover tpl-photo"
                  style={{ filter: "brightness(0.9)" }}
                />
              ) : (
                <div
                  className="serif flex h-full w-full items-center justify-center"
                  style={{ background: SURFACE_3, color: accent, fontSize: 64 }}
                >
                  {featured.title[0]?.toUpperCase()}
                </div>
              )}
              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.6) 100%)",
                }}
              />
              <span
                className="uppercase absolute"
                style={{
                  top: 14,
                  left: 14,
                  padding: "5px 10px",
                  background: "rgba(8,8,8,0.85)",
                  border: `1px solid ${accent}`,
                  fontSize: 9,
                  letterSpacing: "2px",
                  color: accent,
                }}
              >
                Limited / 12
              </span>
            </div>
            <div className="px-6 py-6">
              <h2
                className="serif"
                style={{ fontWeight: 400, fontSize: 22, color: TEXT, letterSpacing: "0.5px", marginBottom: 8 }}
              >
                {featured.title}
              </h2>
              {featured.description && (
                <p style={{ fontSize: 13, lineHeight: 1.65, color: MUTED, marginBottom: 18 }}>
                  {featured.description}
                </p>
              )}
              {featured.priceLabel && (
                <div
                  className="serif"
                  style={{
                    fontSize: 22,
                    color: accent,
                    fontWeight: 400,
                    letterSpacing: "0.5px",
                    marginBottom: 18,
                  }}
                >
                  {featured.priceLabel}
                </div>
              )}
              {(cardData.bookingUrl || waDigits) && (
                <a
                  href={
                    cardData.bookingUrl ||
                    `https://wa.me/${waDigits}?text=${encodeURIComponent(t.bookBtn)}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 px-4 py-4 uppercase"
                  style={{
                    background: "transparent",
                    border: `1.5px solid ${accent}`,
                    color: accent,
                    fontSize: 12,
                    letterSpacing: "3px",
                    fontWeight: 500,
                  }}
                >
                  {t.bookBtn}
                </a>
              )}
            </div>
          </article>
        </section>
      )}

      {/* COLLECTION */}
      {remaining.length > 0 && (
        <>
          <div className="px-6 pt-6 pb-2 text-center">
            <div
              className="uppercase"
              style={{ fontSize: 10, letterSpacing: "4px", color: accent, marginBottom: 8 }}
            >
              {t.collectionPre}
            </div>
            <div
              className="serif italic"
              style={{ fontSize: 24, color: TEXT }}
            >
              {t.collectionH}
            </div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 8, letterSpacing: "0.5px" }}>
              {t.collectionSub}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 px-5 py-5">
            {remaining.map((svc, i) => (
              <div
                key={`${svc.title}-${i}`}
                className="relative px-4 py-6 text-center"
                style={{
                  background: SURFACE_2,
                  border: `1px solid ${LINE_2}`,
                }}
              >
                <div
                  className="serif mx-auto mb-3 flex h-10 w-10 items-center justify-center"
                  style={{ color: accent, fontSize: 22, fontWeight: 700 }}
                >
                  {svc.title.slice(0, 1).toUpperCase()}
                </div>
                <div
                  className="serif"
                  style={{ fontSize: 14, color: TEXT, marginBottom: 6 }}
                >
                  {svc.title}
                </div>
                {svc.priceLabel && (
                  <div
                    className="uppercase"
                    style={{
                      fontSize: 11,
                      color: accent,
                      letterSpacing: "1.5px",
                    }}
                  >
                    {svc.priceLabel}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* STATS — driven by real data */}
      {(() => {
        const statsItems = [
          ...(allServices.length ? [{ num: String(allServices.length), label: t.servicesLabel }] : []),
          ...(testimonials.length ? [{ num: String(testimonials.length), label: t.reviewsLabel }] : []),
        ];
        if (statsItems.length === 0) return null;
        return (
          <div
            className="grid grid-cols-2"
            style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}
          >
            {statsItems.map((s, i) => (
              <div
                key={s.label}
                className="px-3 py-6 text-center"
                style={{
                  borderRight: i % 2 === 0 ? `1px solid ${LINE}` : "none",
                  borderTop: i >= 2 ? `1px solid ${LINE}` : "none",
                }}
              >
                <div
                  className="serif"
                  style={{ fontSize: 26, color: accent, fontWeight: 400 }}
                >
                  {s.num}
                </div>
                <div
                  className="uppercase"
                  style={{
                    fontSize: 9,
                    color: MUTED,
                    letterSpacing: "2px",
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* SERVICES */}
      <section
        className="px-5 py-9"
        style={{ borderBottom: `1px solid ${LINE}` }}
      >
        <h3
          className="serif italic text-center"
          style={{ fontSize: 20, color: TEXT, marginBottom: 6 }}
        >
          {t.serviceH}
        </h3>
        <p
          className="uppercase text-center"
          style={{ fontSize: 10, letterSpacing: "4px", color: accent, marginBottom: 18 }}
        >
          {t.serviceSub}
        </p>
        <div
          className="flex flex-col"
          style={{ background: LINE, gap: 1 }}
        >
          <SvcRow k="Kargo" v="Free / Closed Box" v_gold />
          <SvcRow k="Lieferung" v="2 — 4 Werktage" />
          <SvcRow k="Geschenkverpackung" v="Inklusive" v_gold />
          <SvcRow k="Custom" v="2 — 3 Wochen" />
          <SvcRow k="Zahlung" v="Karte, Banküberweisung" />
        </div>
      </section>

      {/* CONTACT */}
      <section className="px-6 py-7">
        <ContactRows
          cardData={cardData}
          locale={locale}
          variant="hairline"
          accentHex={accent}
        />
        {cardData.socials && (
          <div className="mt-5">
            <SocialRow socials={cardData.socials} variant="tile" accentHex={accent} />
          </div>
        )}
      </section>

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="px-6 py-6"
        style={{
          background: SURFACE_2,
          borderTop: `1px solid ${LINE}`,
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
        <ExchangeSlot slug={slug} primary={accent} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-6 py-6"
          labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-center"
        >
          <div
            style={{
              ["--card-primary" as string]: accent,
              color: TEXT,
            }}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer
        className="serif italic px-6 py-6 text-center"
        style={{ fontSize: 13, color: MUTED, borderTop: `1px solid ${LINE}` }}
      >
        © {new Date().getFullYear()} — {cardData.company || cardData.name} Maison
        {cityFromAddress ? ` · ${cityFromAddress}` : ""}
        <div className="mt-2" style={{ color: DIM, fontStyle: "normal" }}>
          {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: accent }}
          >
            OpSolid
          </a>
        </div>
      </footer>
    </article>
  );

  function SvcRow({ k, v, v_gold }: { k: string; v: string; v_gold?: boolean }) {
    return (
      <div
        className="flex justify-between px-4 py-3.5"
        style={{ background: SURFACE_2, fontSize: 13 }}
      >
        <span style={{ color: MUTED }}>{k}</span>
        <span style={{ color: v_gold ? accent : TEXT, fontWeight: 400 }}>{v}</span>
      </div>
    );
  }
}

// =============================================================================
// Registry & sample
// =============================================================================

export const ecommerceNoirEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 81,
  key: "ecommerce-noir",
  name: "E-commerce — Noir",
  industry: "E-commerce / Dark luxury boutique",
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
  sampleSlug: "demo-ecommerce-noir",
};

// photo: Unsplash, https://unsplash.com/photos/eF7HN40WbAQ — Free, no attribution required.
export const ecommerceNoirSample: SampleData = {
  templateId: 81,
  slug: "demo-ecommerce-noir",
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
    bio: "Kuratierte Mode & Accessoires aus der Türkei & Deutschland. Kostenloser Versand ab â‚¬50.",
    bookingUrl: "https://pazar-shop.de/shop",
    impressumUrl: "https://pazar-shop.de/impressum",
    privacyUrl: "https://pazar-shop.de/datenschutz",
    sectorKey: "retail",
    socials: {
      instagram: "https://instagram.com/pazar.shop",
      tiktok: "https://tiktok.com/@pazarshop",
    },
    services: [
      { title: "Seidenschal", description: "Handbedruckt, Premium-Seide.", priceLabel: "â‚¬89" },
      { title: "Handtasche", description: "Vollnarbenleder, handgenäht.", priceLabel: "â‚¬145" },
      { title: "Schmuckset", description: "Versilbert, kuratiert.", priceLabel: "â‚¬65" },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

