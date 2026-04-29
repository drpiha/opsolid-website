"use client";

// =============================================================================
// DJStone — v2 template (id=75, key="dj-stone").
//
// Sector: DJ / Music — STONE variant. Mood: warm charcoal + cream parchment,
// vintage vinyl + analog studio aesthetic. Inspired by kart_06_dj_stone.html.
//
// Design DNA (different from default Studio.tsx, MusicProducer, DJNoir/Pure/Vivid):
//   - Warm cream parchment surface with sepia-toned accents.
//   - Centred Playfair "DÜNDEN BUGÜNE" eyebrow + "Music & Sessions" name lockup
//     and ornament glyph rules.
//   - Wave-divider between header and a 140 px circular photo with rotating
//     dashed gold ring.
//   - Italic Playfair bio quote framed by serif quote glyphs.
//   - Philosophy block on parchment-2 — italic title + emphasised "10 yıldır".
//   - Centred "Müzik Türlerim" + "Hizmetlerim" sections with serif-italic tags
//     and parchment service rows that hover-lift.
//   - Testimonial in linen gradient with oversized gold quote-mark.
//   - Pill CTA in deep cocoa with light-gold ghost row.
// =============================================================================

import * as React from "react";
import Image from "next/image";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#2d2926";
const LOCKED_ACCENT = "#c4a882";
const PAGE = "#f0e8da";
const SURFACE = "#faf4ea";
const SURFACE_2 = "#f5ecd9";
const SURFACE_3 = "#f0e2c9";
const ACCENT = "#6b3a2a";
const ACCENT_2 = "#c8a500";
const ACCENT_2_WARM = "#b8951e";
const INK = "#3a2618";
const INK_2 = "#6e553e";
const MUTED = "#9d846b";
const LINE = "#e3d6c0";
const LINE_2 = "#d4c4a8";

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
  headerEyebrow: string;
  headerH: string;
  estLine: string;
  philoLabel: string;
  philoH: string;
  philoText: string;
  genresH: string;
  genresSub: string;
  servicesH: string;
  servicesSub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  scanLabel: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  philoEmphasis: string;
}

const COPY: Record<"de" | "en" | "tr", Copy> = {
  de: {
    headerEyebrow: "Von gestern auf heute",
    headerH: "Music & Sessions",
    estLine: "EST. 2016 · BERLIN",
    philoLabel: "— Musikphilosophie —",
    philoH: "Die Wärme des Analogen",
    philoText:
      "arbeite ich mit Vinyl und Modular-Synth. House, deep techno und afro house — statt digitaler Geschwindigkeit suche ich die Langsamkeit der Zeit. Musik ist ein Lebensrhythmus.",
    philoEmphasis: "Seit 10 Jahren",
    genresH: "Genres",
    genresSub: "— was ich auflege —",
    servicesH: "Leistungen",
    servicesSub: "— Sets & Sessions —",
    ctaPrimary: "Bühnenanfrage senden",
    ctaSecondary: "E-Mail",
    scanLabel: "— Höre meine Musik —",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    headerEyebrow: "From yesterday to today",
    headerH: "Music & Sessions",
    estLine: "EST. 2016 · BERLIN",
    philoLabel: "— Music philosophy —",
    philoH: "The warmth of analog",
    philoText:
      "I have been working with vinyl and modular synth. House, deep techno and afro house sets — instead of digital speed, I seek the slowness of time. Music, for me, is a life rhythm.",
    philoEmphasis: "For 10 years",
    genresH: "Genres",
    genresSub: "— what I play —",
    servicesH: "Services",
    servicesSub: "— sets & sessions —",
    ctaPrimary: "Send stage request",
    ctaSecondary: "Email",
    scanLabel: "— Listen to my music —",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    headerEyebrow: "Dünden bugüne",
    headerH: "Music & Sessions",
    estLine: "EST. 2016 · BERLIN",
    philoLabel: "— Müzik felsefem —",
    philoH: "Analog'un Sıcaklığı",
    philoText:
      "vinyl ve modular synth ile çalışıyorum. House, deep techno ve afro house tabanlı setlerimde, dijital hızın yerine zamanın yavaşlığını arıyorum. Müzik benim için bir yaşam ritmi.",
    philoEmphasis: "10 yıldır",
    genresH: "Müzik Türlerim",
    genresSub: "— sahnede çaldıklarım —",
    servicesH: "Hizmetlerim",
    servicesSub: "— nelerle ilgileniyorum —",
    ctaPrimary: "Sahne Teklifi Gönder",
    ctaSecondary: "E-posta",
    scanLabel: "— Müziğime ulaşın —",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
};

const GENRES = ["House", "Deep Techno", "Afro House", "Melodic", "Progressive"];

export function DJStone({
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
  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = (cardData.services ?? []).slice(0, 3);
  const testimonial = cardData.testimonials?.[0];

  const stagePrefix = cardData.name.split(/\s+/)[0] ?? cardData.name;
  const stageRest = cardData.name.replace(/^\S+\s*/, "");

  return (
    <article
      data-template="dj-stone"
      className="djstone-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: PAGE, color: INK }}
    >
      <style jsx global>{`
        .djstone-card {
          font-family: var(--tpl-font-body, 'Nunito', 'Inter', system-ui, sans-serif);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        .djstone-card .serif {
          font-family: var(--tpl-font-display, 'Playfair Display', 'Lora', Georgia, serif);
        }
        .djstone-card a { color: inherit; }
        @keyframes djstone-rot {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .djstone-card .vinyl-ring { animation: none !important; }
        }
      `}</style>

      <div style={{ background: SURFACE }}>
        {/* HEADER */}
        <header
          className="relative px-6 pb-14 pt-12 text-center"
          style={{
            background: `radial-gradient(ellipse 600px 300px at 50% 0%, rgba(200,165,0,0.12), transparent 60%), ${SURFACE_2}`,
            borderBottom: `1px solid ${LINE}`,
          }}
        >
          <div
            className="serif mb-3.5 text-[18px]"
            style={{ color: ACCENT_2, letterSpacing: "8px" }}
          >
            § § §
          </div>
          <div
            className="serif mb-1.5 text-[14px] italic"
            style={{ color: ACCENT }}
          >
            {t.headerEyebrow}
          </div>
          <h1
            className="serif text-[40px] leading-[1.05]"
            style={{ color: INK, letterSpacing: "1px", fontWeight: 700 }}
          >
            <span className="block">{cardData.name}</span>
            <span
              className="serif mt-1 block text-[24px] italic"
              style={{ color: ACCENT, fontWeight: 400 }}
            >
              {t.headerH}
            </span>
          </h1>
          <div
            className="mt-4 text-[11px] uppercase"
            style={{ color: MUTED, letterSpacing: "3px" }}
          >
            {t.estLine}
          </div>
        </header>

        {/* WAVE */}
        <svg
          aria-hidden
          viewBox="0 0 460 30"
          preserveAspectRatio="none"
          className="-mt-px block h-[30px] w-full"
          style={{ background: SURFACE_2 }}
        >
          <path
            d="M0,15 Q57.5,0 115,15 T230,15 T345,15 T460,15 L460,30 L0,30 Z"
            fill={SURFACE}
          />
        </svg>

        {/* PHOTO with vinyl ring */}
        {photoUrl && (
          <div
            className="relative z-[2] mx-auto -mt-[70px] h-[140px] w-[140px] rounded-full p-[6px]"
            style={{
              background: SURFACE,
              boxShadow: "0 10px 28px rgba(107,58,42,0.2)",
            }}
          >
            <span
              aria-hidden
              className="vinyl-ring pointer-events-none absolute inset-0 rounded-full"
              style={{
                border: `2px dashed ${ACCENT_2}`,
                opacity: 0.4,
                animation: "djstone-rot 30s linear infinite",
              }}
            />
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <Image
                src={photoUrl}
                alt={cardData.name}
                fill
                unoptimized
                className="rounded-full object-cover"
                style={{ filter: "sepia(0.18) contrast(1.04) saturate(0.92)" }}
                sizes="140px"
              />
            </div>
          </div>
        )}

        {/* BIO */}
        <section className="px-7 pb-7 pt-6 text-center">
          <h2
            className="serif text-[26px]"
            style={{ color: INK, letterSpacing: "0.5px", fontWeight: 700 }}
          >
            {cardData.name}
          </h2>
          <p
            className="serif mt-1.5 text-[15px] italic"
            style={{ color: ACCENT }}
          >
            {cardData.position || cardData.title || "DJ & Producer"}
          </p>
          {cardData.bio && (
            <p
              className="mt-4 text-[13.5px] font-medium"
              style={{ color: INK_2, lineHeight: 1.7 }}
            >
              <span className="serif" style={{ color: ACCENT_2 }}>
                &ldquo;
              </span>
              {cardData.bio}
              <span className="serif" style={{ color: ACCENT_2 }}>
                &rdquo;
              </span>
            </p>
          )}
        </section>

        {/* PHILOSOPHY */}
        <div
          className="mx-5 mb-6 rounded-[16px] border p-6"
          style={{ background: SURFACE_2, borderColor: LINE }}
        >
          <div
            className="serif text-center text-[14px] italic"
            style={{ color: ACCENT, letterSpacing: "1px" }}
          >
            {t.philoLabel}
          </div>
          <h3
            className="serif mt-1.5 text-center text-[22px]"
            style={{ color: INK, fontWeight: 700 }}
          >
            {t.philoH}
          </h3>
          <p
            className="mt-3.5 text-[13.5px] font-medium"
            style={{ color: INK_2, lineHeight: 1.75 }}
          >
            <strong style={{ color: ACCENT, fontWeight: 700 }}>
              {t.philoEmphasis}
            </strong>{" "}
            {t.philoText}
          </p>
        </div>

        {/* GENRES */}
        <section className="px-5 pb-6 text-center">
          <h3
            className="serif text-[24px]"
            style={{ color: INK, fontWeight: 700, letterSpacing: "0.5px" }}
          >
            {t.genresH}
          </h3>
          <p
            className="serif mt-1.5 text-[13px] italic"
            style={{ color: MUTED }}
          >
            {t.genresSub}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {GENRES.map((g) => (
              <span
                key={g}
                className="serif rounded-full border-[1.5px] px-4 py-2 text-[13px] italic"
                style={{
                  background: SURFACE,
                  borderColor: ACCENT_2,
                  color: ACCENT,
                }}
              >
                {g}
              </span>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        {services.length > 0 && (
          <section className="px-5 pb-6 text-center">
            <h3
              className="serif text-[24px]"
              style={{ color: INK, fontWeight: 700, letterSpacing: "0.5px" }}
            >
              {t.servicesH}
            </h3>
            <p
              className="serif mt-1.5 text-[13px] italic"
              style={{ color: MUTED }}
            >
              {t.servicesSub}
            </p>
            <div className="mt-5 grid gap-3.5 text-left">
              {services.map((svc, i) => (
                <div
                  key={`${svc.title}-${i}`}
                  className="flex items-start gap-3.5 rounded-[14px] border p-[18px]"
                  style={{ background: SURFACE_2, borderColor: LINE }}
                >
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[12px] text-white"
                    style={{ background: ACCENT }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4
                      className="serif text-[15px] leading-tight"
                      style={{ color: INK, fontWeight: 700 }}
                    >
                      {svc.title}
                    </h4>
                    {svc.description && (
                      <p
                        className="mt-1 text-[12.5px]"
                        style={{ color: INK_2, lineHeight: 1.5 }}
                      >
                        {svc.description}
                      </p>
                    )}
                    {svc.priceLabel && (
                      <div
                        className="serif mt-2 text-[12.5px] italic"
                        style={{ color: ACCENT_2_WARM, fontWeight: 600 }}
                      >
                        {svc.priceLabel}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TESTIMONIAL */}
        {testimonial && (
          <div
            className="relative mx-5 mb-6 overflow-hidden rounded-[18px] border p-6 text-center"
            style={{
              background: `linear-gradient(135deg, ${SURFACE_2} 0%, ${SURFACE_3} 100%)`,
              borderColor: LINE_2,
            }}
          >
            <div
              className="serif text-[60px] leading-[0.6]"
              style={{ color: ACCENT_2, opacity: 0.5 }}
              aria-hidden
            >
              &ldquo;
            </div>
            <p
              className="serif mt-2 text-[15px] italic"
              style={{ color: INK, lineHeight: 1.6 }}
            >
              {testimonial.quote}
            </p>
            <div
              className="mt-3.5 text-[12px] font-bold uppercase"
              style={{ color: ACCENT, letterSpacing: "2px" }}
            >
              — {testimonial.author}
              {testimonial.role && ` · ${testimonial.role}`}
            </div>
          </div>
        )}

        {/* CTA */}
        <section className="px-5 pb-6">
          <a
            href={
              waDigits
                ? `https://wa.me/${waDigits}?text=${encodeURIComponent(
                    "Booking",
                  )}`
                : phoneDigits
                  ? `tel:${phoneDigits}`
                  : `mailto:${cardData.email ?? ""}`
            }
            target={waDigits ? "_blank" : undefined}
            rel={waDigits ? "noopener noreferrer" : undefined}
            className="serif flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-[18px] text-[15px]"
            style={{
              background: ACCENT,
              color: "#fff7ea",
              fontWeight: 700,
              letterSpacing: "0.5px",
              boxShadow: "0 8px 22px rgba(107,58,42,0.28)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
            </svg>
            {t.ctaPrimary}
          </a>
          {cardData.email && (
            <a
              href={`mailto:${cardData.email}`}
              className="serif mt-3 flex w-full items-center justify-center rounded-full border-[1.5px] px-5 py-3.5 text-[13px] italic"
              style={{
                background: "transparent",
                borderColor: ACCENT_2,
                color: ACCENT,
              }}
            >
              {cardData.email}
            </a>
          )}
        </section>

        {/* CONTACT */}
        <section
          className="px-5 pb-6"
          style={{ borderTop: `1px solid ${LINE}` }}
        >
          <div className="pt-6">
            <ContactRows
              cardData={cardData}
              locale={locale}
              variant="hairline"
              accentHex={ACCENT}
            />
          </div>
        </section>

        {/* WALLET / SEND / EXCHANGE */}
        <section
          className="px-5 py-7"
          style={{ background: SURFACE_2, borderTop: `1px solid ${LINE}` }}
        >
          <SendMyInfoSlot slug={slug} sourceQs="" primary={ACCENT} locale={locale} />
          <ExchangeSlot slug={slug} primary={ACCENT} locale={locale} />
        </section>

        {walletSlot && (
          <WalletDock
            label={t.walletLabel}
            className="border-t px-5 py-6"
            labelClassName="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-center"
          >
            <div style={{ ["--card-primary" as string]: ACCENT }}>{walletSlot}</div>
          </WalletDock>
        )}

        {cardData.socials && (
          <section
            className="px-5 py-6"
            style={{ borderTop: `1px solid ${LINE}` }}
          >
            <div className="flex justify-center">
              <SocialRow
                socials={cardData.socials}
                variant="icon"
                accentHex={ACCENT}
              />
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer
          className="px-5 py-7 text-center"
          style={{ borderTop: `1px solid ${LINE}` }}
        >
          <div
            className="serif mb-2 text-[18px]"
            style={{ color: ACCENT_2, letterSpacing: "8px" }}
          >
            § § §
          </div>
          <p
            className="serif text-[12px] italic"
            style={{ color: MUTED }}
          >
            © {new Date().getFullYear()} {cardData.name} · {t.poweredBy}{" "}
            <a
              href="https://opsolid.de/products/digital-card"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: ACCENT, fontWeight: 700, fontStyle: "normal" }}
            >
              OpSolid
            </a>
          </p>
        </footer>
      </div>
      <span className="hidden">
        {accent} {stagePrefix} {stageRest}
      </span>
    </article>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const djStoneEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 75,
  key: "dj-stone",
  name: "DJ — Stone",
  industry: "DJ / Vintage analog",
  supports: {
    services: true,
    faqs: false,
    testimonials: true,
    gallery: false,
    video: false,
    brochure: false,
    socials: true,
    themeSwitch: false,
    photo: true,
    logo: false,
  },
  defaults: {
    brandPrimaryHex: "#2d2926",
    brandAccentHex: "#c4a882",
  },
  sampleSlug: "demo-dj-stone",
};

// photo: Unsplash, DJ at decks. Unsplash License — free, no attribution required.
export const djStoneSample: SampleData = {
  templateId: 75,
  slug: "demo-dj-stone",
  cardData: {
    name: "DJ KAYA",
    position: "DJ & Producer",
    title: "Vinyl & Modular Synth",
    company: "Kaya Music & Sessions",
    email: "booking@djkaya.de",
    phone: "+49 178 445 1234",
    whatsapp: "+49 178 445 1234",
    website: "djkaya.de",
    address: "Köpenicker Str. 70, 10179 Berlin",
    bio: "Müzik bir frekans değil, bir hatıradır. Her plağın bir hikâyesi var.",
    bookingUrl: "https://cal.com/djkaya/booking",
    impressumUrl: "https://djkaya.de/impressum",
    privacyUrl: "https://djkaya.de/datenschutz",
    sectorKey: "music",
    socials: {
      instagram: "https://instagram.com/djkaya",
      youtube: "https://youtube.com/@djkaya",
    },
    services: [
      {
        title: "Club & Festival Sets",
        description: "2–6 Stunden Live-Performance, Musikberatung.",
        priceLabel: "ab €800",
      },
      {
        title: "Hochzeit & Privatevent",
        description: "Warme, qualitätsorientierte Sets, ganze Nacht.",
        priceLabel: "ab €1.200",
      },
      {
        title: "Studio Production",
        description: "Original tracks, Remix und Mastering.",
        priceLabel: "ab €600 / Track",
      },
    ],
    testimonials: [
      {
        author: "Mert K.",
        role: "Etkinlik Organizatörü",
        quote:
          "VOLT'da Kaya'nın setiyle geçirdiğimiz gece, yılın en iyi etkinliğiydi. Atmosferi kelimelerle anlatılamaz.",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1571266028243-d220c6a35c92?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#2d2926",
  brandAccentHex: "#c4a882",
};
