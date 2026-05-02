"use client";

// =============================================================================
// BarberStone â€” v2 template (id=79, key="barber-stone").
//
// Sector: Barber / Men's grooming â€” STONE variant. Mood: heritage / nostalgic
// barbershop, warm cream + mahogany, Playfair Display + Nunito sans.
// Inspired by kart_07_berber_stone.html.
//
// Design DNA (different from Barber.tsx id=7, BarberNoir/Pure/Vivid):
//   - Warm cream gradient header with stamped pill eyebrow + tracked uppercase
//     subtitle + Playfair shop name + italic est. line.
//   - SVG wave divider into card surface.
//   - 140 px circular mahoganyâ†’gold-warm avatar with sepia photo.
//   - Centred Playfair name with italic accent + ornament rule.
//   - Cards on rounded panels with mahogany borders and warm shadows.
//   - Vintage double-bordered price list with â˜˜ ornament caps.
//   - Quote block on linen gradient with oversized faded quote-mark.
//   - Pill-shaped mahogany primary CTA and cream-line ghost row.
// =============================================================================

import * as React from "react";
import Image from "next/image";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#3d3530";
const LOCKED_ACCENT = "#c4a882";
const PAGE = "#f5efe3";
const SURFACE = "#fdf8f0";
const SURFACE_2 = "#f6ecd9";
const MAHOG = "#5c3317";
const MAHOG_DARK = "#3e220f";
const MAHOG_SOFT = "#7a4d2b";
const GOLD = "#d4a017";
const GOLD_WARM = "#b8851e";
const TEXT = "#2a1c0e";
const MUTED = "#7a6449";
const LINE = "#dcc9a8";

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

interface Copy {
  stamp: string;
  prefix: string;
  estPrefix: string;
  taglineFallback: string;
  philoLabel: string;
  philoSub: string;
  servicesH: string;
  servicesSub: string;
  craftH: string;
  craftSub: string;
  bookBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr", Copy> = {
  de: {
    stamp: "Heritage Â· Handwerk Â· Tradition",
    prefix: "Klassische Herrenpflege",
    estPrefix: "Est.",
    taglineFallback: "Master Barber & Stylist",
    philoLabel: "Atelier Philosophie",
    philoSub: "Jedes Detail verdient seine Zeit",
    servicesH: "Leistungsliste",
    servicesSub: "Stets ausgewogen, stets sorgfÃ¤ltig",
    craftH: "Handwerk",
    craftSub: "Was im Atelier zÃ¤hlt",
    bookBtn: "Termin reservieren",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    stamp: "Heritage Â· Craft Â· Tradition",
    prefix: "Classic Men's Grooming",
    estPrefix: "Est.",
    taglineFallback: "Master Barber & Stylist",
    philoLabel: "Atelier Philosophy",
    philoSub: "Every detail deserves its time",
    servicesH: "Service List",
    servicesSub: "Always balanced, always meticulous",
    craftH: "Craft",
    craftSub: "What we specialise in",
    bookBtn: "Book appointment",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    stamp: "Heritage Â· Zanaat Â· Gelenek",
    prefix: "Klasik Erkek BakÄ±mÄ±",
    estPrefix: "Est.",
    taglineFallback: "Master Berber & Stylist",
    philoLabel: "Atelye Felsefesi",
    philoSub: "Her detay, hak ettiÄŸi Ã¶zeni ister",
    servicesH: "Hizmet Listesi",
    servicesSub: "Her zaman dengeli, her zaman Ã¶zenli",
    craftH: "ZanaatÄ±m",
    craftSub: "Atelyenin uzmanlÄ±k alanlarÄ±",
    bookBtn: "Randevu Al",
    saveContact: "KiÅŸiyi Kaydet",
    walletLabel: "CÃ¼zdana ekle",
    poweredBy: "Powered by",
  },
};

export function BarberStone({
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
  void accent;
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = (cardData.services ?? []).slice(0, 5);
  const cityFromAddress = cardData.address?.split(",").slice(-1)[0]?.trim();
  const nameParts = cardData.name.trim().split(/\s+/);
  const nameFirst = nameParts[0] ?? cardData.name;
  const nameLast = nameParts.slice(1).join(" ");

  return (
    <article
      data-template="barber-stone"
      className="barber-stone-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: PAGE, color: TEXT }}
    >
      <style jsx global>{`
        .barber-stone-card {
          font-family: var(--tpl-font-body, 'Nunito', system-ui, sans-serif);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .barber-stone-card .serif {
          font-family: var(--tpl-font-display, 'Playfair Display', 'Cormorant Garamond', serif);
        }
        .barber-stone-card a { color: inherit; }
      `}</style>

      {/* WARM HEADER */}
      <header
        className="px-7 pt-9 text-center"
        style={{
          background: `linear-gradient(180deg, #ead7b6 0%, ${PAGE} 100%)`,
        }}
      >
        <span
          className="serif italic inline-block px-4 py-1.5 mb-3.5 rounded-full"
          style={{
            border: `1px solid ${MAHOG}`,
            fontSize: 11,
            letterSpacing: "1px",
            color: MAHOG,
            background: `${MAHOG}0a`,
          }}
        >
          {t.stamp}
        </span>
        <h1
          className="serif uppercase mb-2"
          style={{
            fontWeight: 400,
            fontSize: 13,
            letterSpacing: "5px",
            color: MAHOG_SOFT,
          }}
        >
          {t.prefix}
        </h1>
        <div
          className="serif"
          style={{
            fontWeight: 700,
            fontSize: 30,
            color: MAHOG_DARK,
            lineHeight: 1.1,
            marginBottom: 8,
          }}
        >
          {cardData.company || cardData.name}
        </div>
        <div
          className="serif italic"
          style={{ fontSize: 13, color: GOLD_WARM, marginBottom: 24 }}
        >
          â€” {t.estPrefix} {new Date().getFullYear() - 14}
          {cityFromAddress ? ` Â· ${cityFromAddress}` : ""} â€”
        </div>
      </header>

      {/* WAVE */}
      <svg
        viewBox="0 0 460 60"
        preserveAspectRatio="none"
        aria-hidden
        style={{ display: "block", width: "100%", height: 60 }}
      >
        <path
          d="M0,30 C115,60 230,0 345,30 C400,45 430,40 460,30 L460,60 L0,60 Z"
          fill={SURFACE}
        />
      </svg>

      {/* PROFILE */}
      <section
        className="px-7 pt-2 pb-9 text-center"
        style={{ background: SURFACE }}
      >
        <div
          className="mx-auto mb-5"
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            padding: 5,
            background: `linear-gradient(135deg, ${MAHOG} 0%, ${GOLD_WARM} 100%)`,
            boxShadow: `0 8px 32px -8px ${MAHOG}66`,
          }}
        >
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={cardData.name}
              width={130}
              height={130}
              unoptimized
              className="block h-full w-full rounded-full object-cover tpl-photo"
              style={{
                border: `4px solid ${SURFACE}`,
                filter: "sepia(0.18) saturate(0.9) contrast(1.05)",
              }}
            />
          ) : (
            <div
              className="serif flex h-full w-full items-center justify-center rounded-full"
              style={{
                background: SURFACE,
                color: MAHOG_DARK,
                border: `4px solid ${SURFACE}`,
                fontSize: 56,
                fontWeight: 700,
              }}
            >
              {nameFirst[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <h2
          className="serif"
          style={{
            fontWeight: 700,
            fontSize: 32,
            lineHeight: 1.1,
            color: MAHOG_DARK,
            marginBottom: 6,
          }}
        >
          <span style={{ color: GOLD_WARM, fontStyle: "italic", fontWeight: 400 }}>
            {nameFirst.charAt(0)}.
          </span>{" "}
          {nameLast || nameFirst.slice(1)}
        </h2>
        <p
          className="serif italic"
          style={{
            fontWeight: 400,
            fontSize: 15,
            color: MAHOG_SOFT,
            marginBottom: 14,
          }}
        >
          {cardData.title || cardData.position || t.taglineFallback}
        </p>
        <div
          aria-hidden
          className="flex items-center justify-center gap-3.5"
          style={{ color: GOLD_WARM, fontSize: 14 }}
        >
          <span style={{ width: 40, height: 1, background: GOLD_WARM, opacity: 0.4 }} />
          âœ¿
          <span style={{ width: 40, height: 1, background: GOLD_WARM, opacity: 0.4 }} />
        </div>
      </section>

      {/* PHILOSOPHY */}
      {cardData.bio && (
        <section
          className="mx-4 mb-5 rounded-2xl px-6 py-7"
          style={{
            background: SURFACE,
            border: `1px solid ${LINE}`,
            boxShadow: `0 4px 16px -4px ${MAHOG}14`,
          }}
        >
          <h3
            className="serif text-center"
            style={{ fontWeight: 700, fontSize: 22, color: MAHOG_DARK, marginBottom: 6 }}
          >
            {t.philoLabel}
          </h3>
          <p
            className="serif italic text-center"
            style={{ fontSize: 13, color: MAHOG_SOFT, marginBottom: 22, letterSpacing: "0.3px" }}
          >
            {t.philoSub}
          </p>
          <div
            aria-hidden
            style={{ width: 32, height: 1, background: GOLD_WARM, margin: "0 auto 18px", opacity: 0.5 }}
          />
          <p
            className="serif italic text-center"
            style={{ fontSize: 16, lineHeight: 1.7, color: TEXT }}
          >
            {cardData.bio}
          </p>
          <div
            aria-hidden
            style={{ width: 32, height: 1, background: GOLD_WARM, margin: "18px auto 0", opacity: 0.5 }}
          />
        </section>
      )}

      {/* PRICE LIST */}
      {services.length > 0 && (
        <section
          className="mx-4 mb-5 rounded-2xl px-6 py-7"
          style={{
            background: SURFACE,
            border: `1px solid ${LINE}`,
            boxShadow: `0 4px 16px -4px ${MAHOG}14`,
          }}
        >
          <h3
            className="serif text-center"
            style={{ fontWeight: 700, fontSize: 22, color: MAHOG_DARK, marginBottom: 6 }}
          >
            {t.servicesH}
          </h3>
          <p
            className="serif italic text-center"
            style={{ fontSize: 13, color: MAHOG_SOFT, marginBottom: 22, letterSpacing: "0.3px" }}
          >
            {t.servicesSub}
          </p>
          <div
            className="relative px-5 py-6"
            style={{
              border: `2px double ${MAHOG}`,
              background: SURFACE_2,
              borderRadius: 6,
            }}
          >
            <span
              aria-hidden
              className="absolute"
              style={{
                top: -12,
                left: "50%",
                transform: "translateX(-50%)",
                background: SURFACE,
                padding: "0 12px",
                color: GOLD_WARM,
                fontSize: 16,
              }}
            >
              â˜˜
            </span>
            <span
              aria-hidden
              className="absolute"
              style={{
                bottom: -12,
                left: "50%",
                transform: "translateX(-50%)",
                background: SURFACE,
                padding: "0 12px",
                color: GOLD_WARM,
                fontSize: 16,
              }}
            >
              â˜˜
            </span>
            {services.map((svc, i) => {
              const featured = i === services.length - 1 && services.length > 2;
              return (
                <div
                  key={`${svc.title}-${i}`}
                  className="flex items-baseline gap-2.5"
                  style={{
                    padding: featured ? "14px 12px" : "12px 0",
                    borderBottom:
                      !featured && i < services.length - 1
                        ? `1px dashed ${MAHOG}40`
                        : "none",
                    paddingTop: i === 0 ? 0 : undefined,
                    margin: featured ? "8px -8px" : "0",
                    background: featured ? `${GOLD}1a` : "transparent",
                    borderRadius: featured ? 6 : 0,
                    border: featured ? `1px solid ${GOLD_WARM}` : "none",
                  }}
                >
                  <span
                    className="serif"
                    style={{
                      fontWeight: featured ? 700 : 500,
                      fontSize: 15,
                      color: featured ? MAHOG_DARK : TEXT,
                      letterSpacing: "0.3px",
                    }}
                  >
                    {svc.title}
                  </span>
                  <span
                    aria-hidden
                    className="flex-1"
                    style={{
                      borderBottom: `1px dotted ${MAHOG}66`,
                      alignSelf: "center",
                      marginBottom: 5,
                    }}
                  />
                  {svc.priceLabel && (
                    <span
                      className="serif"
                      style={{
                        fontWeight: 700,
                        fontSize: featured ? 19 : 17,
                        color: featured ? GOLD_WARM : MAHOG,
                        letterSpacing: "0.5px",
                      }}
                    >
                      {svc.priceLabel}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* QUOTE */}
      {cardData.bio && (
        <div
          className="relative mx-4 mb-5 overflow-hidden rounded-2xl px-7 py-8 text-center"
          style={{
            background: `linear-gradient(135deg, #ead7b6 0%, #dec5a0 100%)`,
          }}
        >
          <span
            aria-hidden
            className="serif absolute"
            style={{
              top: -12,
              left: 18,
              fontSize: 90,
              color: MAHOG,
              opacity: 0.4,
              lineHeight: 1,
              fontWeight: 700,
            }}
          >
            â€œ
          </span>
          <p
            className="serif italic relative"
            style={{
              fontWeight: 400,
              fontSize: 16,
              lineHeight: 1.7,
              color: MAHOG_DARK,
              marginBottom: 14,
            }}
          >
            {cardData.bio}
          </p>
          <cite
            className="not-italic uppercase"
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: "2px",
              color: MAHOG,
            }}
          >
            â€” {cardData.name}
          </cite>
        </div>
      )}

      {/* CTA STACK */}
      <section className="mx-4 mb-5 flex flex-col gap-3">
        {(cardData.bookingUrl || waDigits) && (
          <a
            href={
              cardData.bookingUrl ||
              `https://wa.me/${waDigits}?text=${encodeURIComponent(t.bookBtn)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 rounded-full px-6 py-4"
            style={{
              background: MAHOG,
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.5px",
              boxShadow: `0 6px 20px -6px ${MAHOG}80`,
            }}
          >
            {t.bookBtn}
          </a>
        )}
        {cardData.email && (
          <a
            href={`mailto:${cardData.email}`}
            className="flex items-center justify-center gap-2.5 rounded-full px-6 py-4"
            style={{
              background: SURFACE,
              color: TEXT,
              border: `1.5px solid ${LINE}`,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            {cardData.email}
          </a>
        )}
      </section>

      {/* CONTACT */}
      <section
        className="mx-4 mb-5 rounded-2xl px-6 py-6"
        style={{
          background: SURFACE,
          border: `1px solid ${LINE}`,
          boxShadow: `0 4px 16px -4px ${MAHOG}14`,
        }}
      >
        <ContactRows
          cardData={cardData}
          locale={locale}
          variant="hairline"
          accentHex={MAHOG}
        />
        {cardData.socials && (
          <div className="mt-4">
            <SocialRow socials={cardData.socials} variant="tile" accentHex={MAHOG} />
          </div>
        )}
      </section>

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="mx-4 mb-5 rounded-2xl px-6 py-6"
        style={{ background: SURFACE_2, border: `1px solid ${LINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={MAHOG} locale={locale} />
        <ExchangeSlot slug={slug} primary={MAHOG} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-4 py-6"
          labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-center"
        >
          <div
            style={{
              ["--card-primary" as string]: MAHOG,
              color: TEXT,
            }}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer
        className="serif italic px-6 pt-5 pb-7 text-center"
        style={{ fontSize: 12, color: MAHOG_SOFT }}
      >
        â€” {cardData.company || cardData.name} Â· {new Date().getFullYear()}
        {cityFromAddress ? ` Â· ${cityFromAddress}` : ""} â€”
        <div className="mt-2" style={{ color: MUTED }}>
          {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: MAHOG }}
          >
            OpSolid
          </a>
        </div>
      </footer>
    </article>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const barberStoneEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 79,
  key: "barber-stone",
  name: "Barber â€” Stone",
  industry: "Barber / Heritage classic barbershop",
  supports: {
    services: true,
    faqs: false,
    testimonials: false,
    gallery: false,
    video: false,
    brochure: true,
    socials: true,
    themeSwitch: false,
    photo: true,
    logo: false,
  },
  defaults: {
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-barber-stone",
};

// photo: Unsplash, https://unsplash.com/photos/jqe5lY4ROMQ â€” Free, no attribution required.
export const barberStoneSample: SampleData = {
  templateId: 79,
  slug: "demo-barber-stone",
  cardData: {
    name: "Tarkan Arslan",
    position: "Master Barber & Inhaber",
    title: "Master Barber & Inhaber",
    company: "TA Barbershop Berlin",
    email: "tarkan@tabarbershop.de",
    phone: "+49 176 223 4568",
    whatsapp: "+49 176 223 4568",
    website: "tabarbershop.de",
    address: "FriedrichstraÃŸe 88, 10117 Berlin",
    bio: "Master Barber seit 15 Jahren. Klassischer Herrenschnitt, HeiÃŸrasur, Premium Fades. Termine online.",
    bookingUrl: "https://cal.com/tabarbershop/booking",
    impressumUrl: "https://tabarbershop.de/impressum",
    privacyUrl: "https://tabarbershop.de/datenschutz",
    sectorKey: "salon",
    socials: {
      instagram: "https://instagram.com/ta.barbershop",
    },
    services: [
      { title: "Premium Haarschnitt", description: "Beratung, Schnitt, Styling.", priceLabel: "â‚¬35" },
      { title: "HeiÃŸrasur", description: "Klassische Rasur mit heiÃŸem Tuch.", priceLabel: "â‚¬28" },
      { title: "Kombination", description: "Schnitt + HeiÃŸrasur in einem Termin.", priceLabel: "â‚¬55" },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

