"use client";

// =============================================================================
// FitnessNoir — v2 template (id=88, key="fitness-noir").
//
// Sector: Fitness / personal training — NOIR variant. Mood: premium gym /
// dark studio with neon-green accents and Oswald industrial display + Inter
// body. Inspired by kart_10_fitness_noir.html.
//
// Design DNA (different from Athlete.tsx id=10):
//   - Black hero with red radial glow, tracked Oswald eyebrow + giant CEREN/
//     Demir display (surname in mid-grey).
//   - Hero CTA line with arrow chip in red.
//   - 3-cell stat strip with mid-grey unit superscripts.
//   - Full-width grayscale photo with neon-green dash label overlay.
//   - Service list with red/orange alternating left-border + Oswald headlines.
//   - Pull-quote panel with red→orange top stroke.
//   - Before/after split images with Oswald stamps.
//   - Red-orange gradient CTA panel with black solid + ghost ghost-white CTAs.
//   - Hairline contact list with coloured icon tiles.
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
const LOCKED_ACCENT = "#84cc16";
const PAGE = "#050505";
const SURFACE = "#0d0d0d";
const SURFACE_2 = "#131313";
const RED = "#dc2626";
const ORANGE = "#f97316";
const TEXT = "#f5f5f5";
const TEXT_SOFT = "#d4d4d4";
const TEXT_VDIM = "#737373";
const TEXT_VVDIM = "#525252";
const LINE = "#1f1f1f";

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
  taglineFallback: string;
  ctaLine1: string;
  ctaLine2: string;
  experienceLabel: string;
  clientsLabel: string;
  conversionLabel: string;
  programsTag: string;
  programsH: string;
  resultsTag: string;
  resultsH: string;
  before: string;
  after: string;
  ctaPanelTitle: string;
  ctaPanelSub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  contactTag: string;
  contactH: string;
  bookBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr", Copy> = {
  de: {
    taglineFallback: "Personal Coach",
    ctaLine1: "Get",
    ctaLine2: "Results",
    experienceLabel: "Erfahrung",
    clientsLabel: "Kunden",
    conversionLabel: "Erfolg",
    programsTag: "— 01 / Programme",
    programsH: "Leistungen",
    resultsTag: "— 02 / Ergebnisse",
    resultsH: "Vorher / Nachher",
    before: "Vorher",
    after: "Nachher",
    ctaPanelTitle: "Programm starten",
    ctaPanelSub: "Erste Beratung kostenlos. Jetzt schreiben.",
    ctaPrimary: "Anrufen",
    ctaSecondary: "WhatsApp",
    contactTag: "— 03 / Kontakt",
    contactH: "Verbindung",
    bookBtn: "Programm starten",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    taglineFallback: "Personal Coach",
    ctaLine1: "Get",
    ctaLine2: "Results",
    experienceLabel: "Years",
    clientsLabel: "Clients",
    conversionLabel: "Success",
    programsTag: "— 01 / Programs",
    programsH: "Services",
    resultsTag: "— 02 / Results",
    resultsH: "Before / After",
    before: "Before",
    after: "After",
    ctaPanelTitle: "Start the program",
    ctaPanelSub: "First consult is free. Drop us a line.",
    ctaPrimary: "Call now",
    ctaSecondary: "WhatsApp",
    contactTag: "— 03 / Contact",
    contactH: "Connection",
    bookBtn: "Start now",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    taglineFallback: "Personal Coach",
    ctaLine1: "Get",
    ctaLine2: "Results",
    experienceLabel: "Tecrübe",
    clientsLabel: "Müşteri",
    conversionLabel: "Dönüşüm",
    programsTag: "— 01 / Programlar",
    programsH: "Hizmetler",
    resultsTag: "— 02 / Sonuçlar",
    resultsH: "Önce / Sonra",
    before: "Önce",
    after: "Sonra",
    ctaPanelTitle: "Programa Başla",
    ctaPanelSub: "İlk konsültasyon ücretsiz. Şimdi yaz.",
    ctaPrimary: "Hemen Ara",
    ctaSecondary: "WhatsApp",
    contactTag: "— 03 / İletişim",
    contactH: "Bağlantı",
    bookBtn: "Programa Başla",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
};

export function FitnessNoir({
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
  const callHref = cardData.phone
    ? `tel:${digitsOnly(cardData.phone)}`
    : undefined;
  const waHref = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(t.ctaPanelTitle)}`
    : undefined;

  const services = (cardData.services ?? []).slice(0, 5);
  const nameParts = cardData.name.trim().split(/\s+/);
  const nameFirst = nameParts[0] ?? cardData.name;
  const nameLast = nameParts.slice(1).join(" ");

  return (
    <article
      data-template="fitness-noir"
      className="fitness-noir-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: PAGE, color: TEXT_SOFT }}
    >
      <style jsx global>{`
        .fitness-noir-card {
          font-family: var(--tpl-font-body, 'Inter', system-ui, sans-serif);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .fitness-noir-card .display {
          font-family: var(--tpl-font-display, 'Oswald', 'Bebas Neue', system-ui, sans-serif);
        }
        .fitness-noir-card a { color: inherit; }
      `}</style>

      {/* HERO */}
      <section
        className="relative overflow-hidden px-7 pb-10 pt-14"
        style={{
          background: SURFACE,
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: "-50%",
            right: "-30%",
            width: 360,
            height: 360,
            background: `radial-gradient(circle, ${accent}33, transparent 70%)`,
          }}
        />
        <div className="relative z-[2]">
          <div
            className="display flex items-center gap-3 uppercase"
            style={{
              fontSize: 12,
              letterSpacing: "6px",
              color: accent,
              fontWeight: 600,
              marginBottom: 18,
            }}
          >
            <span
              aria-hidden
              style={{ width: 32, height: 2, background: accent }}
            />
            {cardData.position || t.taglineFallback}
          </div>
          <h1
            className="display uppercase"
            style={{
              fontSize: "clamp(48px, 16vw, 64px)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 0.9,
              letterSpacing: "-2px",
            }}
          >
            {nameFirst}
            {nameLast && (
              <span
                className="block"
                style={{
                  color: TEXT_VDIM,
                  fontWeight: 500,
                  fontSize: "0.875em",
                }}
              >
                {nameLast}
              </span>
            )}
          </h1>
          <div
            className="mt-7 flex items-center justify-between gap-3 pt-5"
            style={{ borderTop: `1px solid ${LINE}` }}
          >
            <div
              className="display uppercase"
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "1px",
              }}
            >
              {t.ctaLine1}{" "}
              <span style={{ color: accent }}>{t.ctaLine2}</span>.
            </div>
            <a
              href={callHref || waHref || "#"}
              {...(callHref || waHref
                ? { target: "_blank", rel: "noopener noreferrer" as const }
                : {})}
              aria-label={t.ctaLine2}
              className="flex shrink-0 items-center justify-center"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: accent,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={16}
                height={16}
                stroke="#0a0a0a"
                fill="none"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        className="grid grid-cols-3 px-7 py-8"
        style={{ background: SURFACE }}
      >
        {[
          { num: "8", unit: "YR", label: t.experienceLabel, alt: false },
          { num: "600", unit: "+", label: t.clientsLabel, alt: true },
          { num: "94", unit: "%", label: t.conversionLabel, alt: false },
        ].map((s, i, arr) => (
          <div
            key={i}
            className="relative px-1.5 py-1 text-center"
          >
            <div
              className="display"
              style={{
                fontSize: 44,
                fontWeight: 700,
                color: s.alt ? ORANGE : "#fff",
                lineHeight: 1,
                letterSpacing: "-1px",
              }}
            >
              {s.num}
              <span
                style={{
                  fontSize: 18,
                  color: accent,
                  fontWeight: 500,
                  marginLeft: 2,
                }}
              >
                {s.unit}
              </span>
            </div>
            <div
              className="display mt-2 uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "2px",
                color: TEXT_VDIM,
                fontWeight: 500,
              }}
            >
              {s.label}
            </div>
            {i < arr.length - 1 && (
              <span
                aria-hidden
                className="absolute"
                style={{
                  right: 0,
                  top: "14%",
                  width: 1,
                  height: "72%",
                  background: LINE,
                }}
              />
            )}
          </div>
        ))}
      </section>

      {/* FULL PHOTO */}
      {photoUrl && (
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "4/3" }}
        >
          <Image
            src={photoUrl}
            alt={cardData.name}
            fill
            unoptimized
            sizes="(max-width: 460px) 100vw, 460px"
            className="object-cover tpl-photo"
            style={{ filter: "grayscale(0.85) contrast(1.15) brightness(0.85)" }}
          />
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 60%, rgba(5,5,5,0.95) 100%)",
            }}
          />
          <div
            className="display absolute z-[2] uppercase"
            style={{
              left: 24,
              bottom: 22,
              fontSize: 12,
              letterSpacing: "4px",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            <span
              aria-hidden
              className="inline-block align-middle"
              style={{
                width: 24,
                height: 2,
                background: accent,
                marginRight: 12,
              }}
            />
            Train. Push. Repeat.
          </div>
        </div>
      )}

      {/* SERVICES */}
      {services.length > 0 && (
        <>
          <SectHead tag={t.programsTag} h={t.programsH} accent={accent} />
          <ul className="flex flex-col gap-3 px-7 pb-2">
            {services.map((svc, i) => {
              const tint = i % 2 === 0 ? accent : ORANGE;
              return (
                <li
                  key={`${svc.title}-${i}`}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                  style={{
                    background: SURFACE,
                    borderLeft: `4px solid ${tint}`,
                  }}
                >
                  <div className="min-w-0">
                    <div
                      className="display uppercase"
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#fff",
                        letterSpacing: "0.8px",
                      }}
                    >
                      {svc.title}
                    </div>
                    {svc.description && (
                      <div
                        className="mt-1"
                        style={{ fontSize: 12, color: TEXT_VDIM }}
                      >
                        {svc.description}
                      </div>
                    )}
                  </div>
                  {svc.priceLabel && (
                    <div
                      className="display shrink-0 text-right"
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: tint,
                        letterSpacing: "0.5px",
                      }}
                    >
                      {svc.priceLabel}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* PULL QUOTE */}
      {cardData.bio && (
        <section
          className="relative mx-7 mt-9 px-6 py-8"
          style={{ background: SURFACE, border: `1px solid ${LINE}` }}
        >
          <span
            aria-hidden
            className="absolute"
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg, ${accent}, ${ORANGE})`,
            }}
          />
          <p
            className="display uppercase"
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#fff",
              lineHeight: 1.25,
              letterSpacing: "-0.3px",
            }}
          >
            &ldquo;{cardData.bio}&rdquo;
          </p>
          <div
            className="mt-5 pt-3.5"
            style={{
              borderTop: `1px solid ${LINE}`,
              fontSize: 11,
              letterSpacing: "2px",
              color: TEXT_VDIM,
              textTransform: "uppercase",
            }}
          >
            <strong
              className="display block"
              style={{
                color: ORANGE,
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: "1.5px",
                marginBottom: 2,
              }}
            >
              {cardData.name}
            </strong>
            {cardData.position}
          </div>
        </section>
      )}

      {/* CTA PANEL */}
      {(callHref || waHref) && (
        <section
          className="relative mx-7 mt-9 overflow-hidden px-6 py-8 text-center"
          style={{
            background: `linear-gradient(135deg, ${RED} 0%, ${ORANGE} 100%)`,
          }}
        >
          <span
            aria-hidden
            className="absolute"
            style={{
              top: "-60%",
              right: "-30%",
              width: 240,
              height: 240,
              background: "rgba(255,255,255,0.08)",
              borderRadius: "50%",
            }}
          />
          <div className="relative z-[2]">
            <div
              className="display uppercase"
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "0.5px",
                lineHeight: 1.1,
              }}
            >
              {t.ctaPanelTitle}
            </div>
            <div
              className="mt-2"
              style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}
            >
              {t.ctaPanelSub}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {callHref && (
                <a
                  href={callHref}
                  className="display uppercase"
                  style={{
                    background: "#000",
                    color: "#fff",
                    padding: "13px 14px",
                    fontWeight: 600,
                    fontSize: 13,
                    letterSpacing: "1.5px",
                  }}
                >
                  {t.ctaPrimary}
                </a>
              )}
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="display uppercase"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    color: "#fff",
                    border: "1.5px solid rgba(255,255,255,0.5)",
                    padding: "13px 14px",
                    fontWeight: 600,
                    fontSize: 13,
                    letterSpacing: "1.5px",
                  }}
                >
                  {t.ctaSecondary}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <SectHead tag={t.contactTag} h={t.contactH} accent={accent} />
      <section className="px-7 pb-2">
        <ul
          className="flex flex-col"
          style={{ gap: 1, background: LINE, border: `1px solid ${LINE}` }}
        >
          <ContactRows
            cardData={cardData}
            locale={locale}
            tone="dark"
            accentHex={accent}
            renderRow={(row, i) => (
              <a
                href={row.href}
                {...(row.external
                  ? { target: "_blank", rel: "noopener noreferrer" as const }
                  : {})}
                className="flex items-center gap-3.5 px-4 py-3.5"
                style={{
                  background: SURFACE,
                  fontSize: 13,
                  color: TEXT_SOFT,
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                <span
                  aria-hidden
                  className="flex shrink-0 items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    background: i % 2 === 0 ? `${accent}1f` : `${ORANGE}1f`,
                    color: i % 2 === 0 ? accent : ORANGE,
                  }}
                >
                  <row.Icon size={16} strokeWidth={2} />
                </span>
                <span className="break-words">{row.value}</span>
              </a>
            )}
          />
        </ul>
        {cardData.socials && (
          <div className="mt-5">
            <SocialRow
              socials={cardData.socials}
              variant="icon"
              accentHex={accent}
            />
          </div>
        )}
      </section>

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="mt-9 px-7 py-7"
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
          className="px-7 py-6"
          labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-center"
        >
          <div
            style={{
              ["--card-primary" as string]: accent,
              color: TEXT,
            } as React.CSSProperties}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer
        className="px-7 pb-9 pt-7 text-center"
        style={{ borderTop: `1px solid ${LINE}` }}
      >
        <div
          className="display uppercase"
          style={{
            fontSize: 18,
            color: "#fff",
            letterSpacing: "3px",
            fontWeight: 600,
          }}
        >
          {(cardData.company || cardData.name).split(" ")[0]}{" "}
          <span style={{ color: accent }}>
            {(cardData.company || cardData.name).split(" ").slice(1).join(" ")}
          </span>
        </div>
        <div
          className="mt-2 uppercase"
          style={{
            fontSize: 9,
            color: TEXT_VVDIM,
            letterSpacing: "2px",
          }}
        >
          All Rights Reserved &copy; {new Date().getFullYear()}
        </div>
        <div
          className="mt-1 uppercase"
          style={{ fontSize: 9, letterSpacing: "1.5px", color: TEXT_VVDIM }}
        >
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
}

function SectHead({
  tag,
  h,
  accent,
}: {
  tag: string;
  h: string;
  accent: string;
}) {
  return (
    <div className="px-7 pb-4 pt-9">
      <div
        className="display uppercase"
        style={{
          fontSize: 10,
          letterSpacing: "3px",
          color: accent,
          fontWeight: 600,
          marginBottom: 6,
        }}
      >
        {tag}
      </div>
      <h2
        className="display uppercase"
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "0.5px",
          lineHeight: 1.05,
        }}
      >
        {h}
      </h2>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const fitnessNoirEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 88,
  key: "fitness-noir",
  name: "Fitness — Noir",
  industry: "Fitness coach / premium dark studio",
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
  sampleSlug: "demo-fitness-noir",
};

// photo: Unsplash, https://unsplash.com/photos/8mqOw4DBBSg — Free, no attribution required.
export const fitnessNoirSample: SampleData = {
  templateId: 88,
  slug: "demo-fitness-noir",
  cardData: {
    name: "Can Öztürk",
    position: "Personal Trainer & Fitness Coach",
    title: "Fitness Coach",
    company: "CanFit Berlin",
    email: "can@canfit.de",
    phone: "+49 176 778 9012",
    whatsapp: "+49 176 778 9012",
    website: "canfit.de",
    address: "Kastanienallee 24, 10435 Berlin",
    bio: "Zertifizierter Personal Trainer. Gewichtsreduktion, Muskelaufbau, Ausdauer. Online & in Berlin.",
    bookingUrl: "https://cal.com/canfit/intro",
    impressumUrl: "https://canfit.de/impressum",
    privacyUrl: "https://canfit.de/datenschutz",
    sectorKey: "fitness",
    socials: {
      instagram: "https://instagram.com/canfit.berlin",
      youtube: "https://youtube.com/CanFit",
    },
    services: [
      { title: "Personal Training", description: "1-on-1 Coaching im Studio.", priceLabel: "€75/h" },
      { title: "Ernährungscoaching", description: "Makros, Habit-Loops, Nachhaltigkeit.", priceLabel: "€45/h" },
      { title: "Online-Coaching", description: "Programm + wöchentliches Check-in.", priceLabel: "€199/Monat" },
      { title: "12-Wochen Transformation", description: "Training + Ernährung + Mindset.", priceLabel: "€899" },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
