"use client";

// =============================================================================
// ArchitectNoir — v2 template (id=84, key="architect-noir").
//
// Sector: Architecture — NOIR variant. Mood: brutalist editorial monograph,
// near-black surfaces, hairline grid background, Space Grotesk display +
// Fraunces italic surname. Inspired by kart_09_mimar_noir.html.
//
// Design DNA (different from Architect.tsx id=9):
//   - 48px grid background tile across the whole card surface.
//   - Header strip with diamond-in-square logomark + tracked firm caption.
//   - Hero name block: pre-built rule + giant Space Grotesk surname over
//     italic Fraunces second word.
//   - Featured frame with grayscale photo, gold-bordered corner tag and
//     italic project name overlaid in a meta grid.
//   - Numbered specialties list with dot bullets and roman numerals.
//   - 4-cell italic stat strip with hairline dividers.
//   - Centred italic philosophy quote with gold quote marks.
//   - 2-column hairline contact grid with full-width address cell.
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
const LOCKED_ACCENT = "#c8a964";
const PAGE = "#080808";
const SURFACE = "#111111";
const SURFACE_2 = "#161616";
const TEXT = "#f0f0f0";
const TEXT_SOFT = "#8a8a8a";
const TEXT_DIM = "#5a5a5a";
const LINE = "#232323";
const LINE_SOFT = "#1a1a1a";

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
  estPrefix: string;
  taglineFallback: string;
  yearsLabel: string;
  projectsLabel: string;
  countriesLabel: string;
  awardsLabel: string;
  featuredTag: string;
  specsEyebrow: string;
  philEyebrow: string;
  contactEyebrow: string;
  bookBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  studioLabel: string;
}

const COPY: Record<"de" | "en" | "tr", Copy> = {
  de: {
    estPrefix: "Est.",
    taglineFallback: "Architekt",
    yearsLabel: "Jahre",
    projectsLabel: "Projekte",
    countriesLabel: "Länder",
    awardsLabel: "Preise",
    featuredTag: "Featured",
    specsEyebrow: "01 Spezialgebiete",
    philEyebrow: "02 Philosophie",
    contactEyebrow: "03 Kontakt",
    bookBtn: "Termin reservieren",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    studioLabel: "Studio",
  },
  en: {
    estPrefix: "Est.",
    taglineFallback: "Architect",
    yearsLabel: "Years",
    projectsLabel: "Projects",
    countriesLabel: "Countries",
    awardsLabel: "Awards",
    featuredTag: "Featured",
    specsEyebrow: "01 Specialties",
    philEyebrow: "02 Philosophy",
    contactEyebrow: "03 Contact",
    bookBtn: "Book appointment",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    studioLabel: "Studio",
  },
  tr: {
    estPrefix: "Est.",
    taglineFallback: "Mimar",
    yearsLabel: "Yıl",
    projectsLabel: "Proje",
    countriesLabel: "Ülke",
    awardsLabel: "Ödül",
    featuredTag: "Featured",
    specsEyebrow: "01 Uzmanlık",
    philEyebrow: "02 Felsefe",
    contactEyebrow: "03 İletişim",
    bookBtn: "Randevu Al",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    studioLabel: "Stüdyo",
  },
};

export function ArchitectNoir({
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

  const services = (cardData.services ?? []).slice(0, 5);
  const cityFromAddress = cardData.address?.split(",").slice(-1)[0]?.trim();
  const nameParts = cardData.name.trim().split(/\s+/);
  const nameFirst = nameParts[0] ?? cardData.name;
  const nameLast = nameParts.slice(1).join(" ");
  const startYear = new Date().getFullYear() - 14;

  const featuredService = services[0];
  const heroImage = photoUrl;

  const romans = ["i", "ii", "iii", "iv", "v"];

  return (
    <article
      data-template="architect-noir"
      className="architect-noir-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: PAGE,
        color: TEXT,
        backgroundImage: `linear-gradient(${LINE_SOFT} 1px, transparent 1px), linear-gradient(90deg, ${LINE_SOFT} 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
        backgroundPosition: "-1px -1px",
      }}
    >
      <style jsx global>{`
        .architect-noir-card {
          font-family: var(--tpl-font-body, 'Space Grotesk', system-ui, sans-serif);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .architect-noir-card .serif {
          font-family: var(--tpl-font-display, 'Fraunces', 'Cormorant Garamond', serif);
        }
        .architect-noir-card a { color: inherit; }
      `}</style>

      {/* HEADER */}
      <header
        className="relative px-7 pb-5 pt-7"
        style={{
          background: SURFACE,
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <div
          aria-hidden
          className="absolute left-7 right-7 -bottom-px"
          style={{
            height: 1,
            background: `linear-gradient(90deg, ${accent} 0%, transparent 60%)`,
          }}
        />
        <div className="flex items-center justify-between gap-4">
          <div
            aria-hidden
            className="relative"
            style={{
              width: 38,
              height: 38,
              border: `1.5px solid ${accent}`,
            }}
          >
            <span
              aria-hidden
              className="absolute"
              style={{
                inset: 5,
                border: `1.5px solid ${accent}`,
                transform: "rotate(45deg)",
              }}
            />
          </div>
          <div className="text-right">
            <div
              className="uppercase"
              style={{
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "3px",
                color: TEXT_SOFT,
              }}
            >
              {cardData.company || cardData.name}
            </div>
            <div
              className="mt-1"
              style={{
                fontSize: 10,
                letterSpacing: "2px",
                color: accent,
              }}
            >
              {t.estPrefix.toUpperCase()} {startYear}
              {cityFromAddress ? ` — ${cityFromAddress.toUpperCase()}` : ""}
            </div>
          </div>
        </div>
      </header>

      {/* HERO NAME */}
      <section
        className="relative px-7 pb-6 pt-12"
        style={{ background: SURFACE }}
      >
        <div
          className="mb-3.5 flex items-center gap-3 uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "4px",
            color: accent,
            fontWeight: 600,
          }}
        >
          <span
            aria-hidden
            style={{ width: 32, height: 1, background: accent }}
          />
          {cardData.position || cardData.title || t.taglineFallback}
        </div>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(40px, 12vw, 48px)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 0.95,
            letterSpacing: "-1.5px",
          }}
        >
          {nameFirst.toUpperCase()}
          {nameLast && (
            <span
              className="serif italic block"
              style={{
                fontWeight: 300,
                color: accent,
                letterSpacing: "-1px",
              }}
            >
              {nameLast}
            </span>
          )}
        </h1>
        <div
          className="mt-5 flex items-center justify-between uppercase"
          style={{
            fontSize: 11,
            letterSpacing: "2.5px",
            color: TEXT_SOFT,
            paddingTop: 14,
            borderTop: `1px solid ${LINE}`,
          }}
        >
          <span>Architecture / Interior</span>
          <span style={{ color: accent }}>14 {t.yearsLabel.toLowerCase()}</span>
        </div>
      </section>

      {/* FEATURED FRAME */}
      {heroImage && (
        <section className="px-7 py-6" style={{ background: SURFACE }}>
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: "4/5" }}
          >
            <Image
              src={heroImage}
              alt={featuredService?.title || cardData.name}
              fill
              unoptimized
              sizes="(max-width: 460px) 100vw, 460px"
              className="object-cover tpl-photo"
              style={{ filter: "grayscale(0.2) contrast(1.05)" }}
            />
            <span
              className="absolute uppercase"
              style={{
                top: 14,
                left: 14,
                padding: "6px 12px",
                background: "rgba(8,8,8,0.85)",
                color: accent,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "2px",
                border: `1px solid ${accent}`,
              }}
            >
              {t.featuredTag} 01
            </span>
          </div>
          <div
            className="mt-[18px] grid items-end gap-4"
            style={{ gridTemplateColumns: "1fr auto" }}
          >
            <div
              className="serif italic"
              style={{
                fontSize: 24,
                fontWeight: 300,
                color: "#fff",
                lineHeight: 1.1,
              }}
            >
              {featuredService?.title || cardData.bio?.slice(0, 60) || cardData.name}
            </div>
            {cityFromAddress && (
              <div
                className="text-right uppercase"
                style={{ fontSize: 10, letterSpacing: "2px", color: TEXT_SOFT }}
              >
                {cityFromAddress}
                <strong
                  className="block mt-1"
                  style={{ color: accent, fontWeight: 600 }}
                >
                  {new Date().getFullYear()}
                </strong>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SPECIALTIES */}
      {services.length > 0 && (
        <section
          className="px-7 py-9"
          style={{
            background: SURFACE_2,
            borderTop: `1px solid ${LINE}`,
            borderBottom: `1px solid ${LINE}`,
          }}
        >
          <SectEyebrow accent={accent} num={t.specsEyebrow.split(" ")[0]} text={t.specsEyebrow.split(" ").slice(1).join(" ")} />
          <ul className="mt-5 flex flex-col">
            {services.map((svc, i) => (
              <li
                key={`${svc.title}-${i}`}
                className="flex items-center justify-between gap-4 py-3.5"
                style={{
                  borderBottom:
                    i < services.length - 1 ? `1px solid ${LINE}` : "none",
                  fontSize: 13,
                  color: TEXT,
                  letterSpacing: "0.3px",
                }}
              >
                <span
                  aria-hidden
                  className="shrink-0 rounded-full"
                  style={{ width: 5, height: 5, background: accent }}
                />
                <span className="flex-1">{svc.title}</span>
                <span
                  className="serif italic"
                  style={{ color: TEXT_DIM, fontSize: 12 }}
                >
                  {romans[i] ?? `${i + 1}.`}.
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* STATS */}
      <section
        className="grid grid-cols-4 px-7 py-8"
        style={{ background: SURFACE }}
      >
        {[
          { num: "14", label: t.yearsLabel },
          { num: "85", sup: "+", label: t.projectsLabel },
          { num: "8", label: t.countriesLabel },
          { num: "4", label: t.awardsLabel },
        ].map((s, i, arr) => (
          <div
            key={i}
            className="relative px-1 py-2 text-center"
            style={{
              borderRight:
                i < arr.length - 1 ? `1px solid ${LINE}` : "none",
            }}
          >
            <div
              className="serif italic"
              style={{
                fontWeight: 300,
                fontSize: 36,
                color: accent,
                lineHeight: 1,
              }}
            >
              {s.num}
              {s.sup && (
                <sup
                  style={{
                    fontSize: 16,
                    color: TEXT_SOFT,
                    marginLeft: 2,
                    top: "-0.7em",
                  }}
                >
                  {s.sup}
                </sup>
              )}
            </div>
            <div
              className="mt-2 uppercase"
              style={{
                fontSize: 9,
                letterSpacing: "2px",
                color: TEXT_SOFT,
                fontWeight: 500,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* PHILOSOPHY */}
      {cardData.bio && (
        <section
          className="px-7 py-10"
          style={{ borderTop: `1px solid ${LINE}` }}
        >
          <SectEyebrow
            accent={accent}
            num={t.philEyebrow.split(" ")[0]}
            text={t.philEyebrow.split(" ").slice(1).join(" ")}
          />
          <p
            className="serif italic mt-5"
            style={{
              fontWeight: 300,
              fontSize: 22,
              color: "#fff",
              lineHeight: 1.5,
              letterSpacing: "-0.3px",
            }}
          >
            <span style={{ color: accent, marginRight: 4 }}>&ldquo;</span>
            {cardData.bio}
            <span style={{ color: accent, marginLeft: 4 }}>&rdquo;</span>
          </p>
          <div
            className="mt-5 uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "2px",
              color: TEXT_SOFT,
            }}
          >
            —{" "}
            <strong style={{ color: accent, fontWeight: 600 }}>
              {cardData.name}
            </strong>
            {cardData.position ? `, ${cardData.position}` : ""}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section
        className="px-7 py-9"
        style={{
          background: SURFACE,
          borderTop: `1px solid ${LINE}`,
        }}
      >
        <SectEyebrow
          accent={accent}
          num={t.contactEyebrow.split(" ")[0]}
          text={t.contactEyebrow.split(" ").slice(1).join(" ")}
        />
        <div
          className="mt-5"
          style={{
            ["--card-primary" as string]: accent,
          } as React.CSSProperties}
        >
          <ContactRows
            cardData={cardData}
            locale={locale}
            variant="hairline"
            tone="dark"
            accentHex={accent}
          />
        </div>
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

      {/* CTA */}
      {(cardData.bookingUrl || waDigits) && (
        <section className="px-7 pb-2 pt-6" style={{ background: SURFACE }}>
          <a
            href={
              cardData.bookingUrl ||
              `https://wa.me/${waDigits}?text=${encodeURIComponent(t.bookBtn)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-6 py-4 uppercase"
            style={{
              background: "transparent",
              color: accent,
              border: `1.5px solid ${accent}`,
              fontSize: 12,
              letterSpacing: "3px",
              fontWeight: 600,
            }}
          >
            {t.bookBtn}
          </a>
        </section>
      )}

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="mt-6 px-7 py-7"
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
        className="px-7 pb-9 pt-6 text-center"
        style={{ borderTop: `1px solid ${LINE}` }}
      >
        <div
          className="serif italic"
          style={{
            fontWeight: 300,
            fontSize: 14,
            color: accent,
            letterSpacing: "1px",
          }}
        >
          {cardData.company || cardData.name}
        </div>
        <div
          className="mt-2 uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "2px",
            color: TEXT_DIM,
          }}
        >
          All Rights Reserved &copy; {new Date().getFullYear()}
        </div>
        <div
          className="mt-2 uppercase"
          style={{ fontSize: 9, letterSpacing: "1.5px", color: TEXT_DIM }}
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

function SectEyebrow({
  num,
  text,
  accent,
}: {
  num: string;
  text: string;
  accent: string;
}) {
  return (
    <div
      className="flex items-center gap-3 uppercase"
      style={{
        fontSize: 10,
        letterSpacing: "4px",
        color: accent,
        fontWeight: 600,
      }}
    >
      <span aria-hidden style={{ width: 24, height: 1, background: accent }} />
      <span style={{ color: TEXT_DIM }}>{num}</span>
      <span>{text}</span>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const architectNoirEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 84,
  key: "architect-noir",
  name: "Architect — Noir",
  industry: "Architecture / brutalist editorial monograph",
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
  sampleSlug: "demo-architect-noir",
};

// photo: Unsplash, https://unsplash.com/photos/Q9y3LRuuxmg — Free, no attribution required.
export const architectNoirSample: SampleData = {
  templateId: 84,
  slug: "demo-architect-noir",
  cardData: {
    name: "Mehmet Yıldız",
    position: "Architekt & Gründer",
    title: "Architekt & Gründer",
    company: "YıldızArch Architekten Berlin",
    email: "mehmet@yildizarch.de",
    phone: "+49 30 445 6780",
    whatsapp: "+49 30 445 6780",
    website: "yildizarch.de",
    address: "Linienstraße 142, 10115 Berlin",
    bio: "Architekt mit Fokus auf nachhaltiges Bauen und minimalistische Raumkonzepte. 15+ Projekte realisiert.",
    bookingUrl: "https://cal.com/yildizarch/intro",
    impressumUrl: "https://yildizarch.de/impressum",
    privacyUrl: "https://yildizarch.de/datenschutz",
    sectorKey: "architecture",
    socials: {
      instagram: "https://instagram.com/yildizarch",
      linkedin: "https://linkedin.com/in/mehmetyildiz-arch",
    },
    services: [
      { title: "Neubauplanung", description: "Architektonische Gesamtplanung von Grund auf.", priceLabel: "ab €8.000" },
      { title: "Innenarchitektur", description: "Räume, die Charakter und Funktion verbinden.", priceLabel: "ab €3.500" },
      { title: "Beratung", description: "Strategische Bauberatung pro Stunde.", priceLabel: "€200/h" },
      { title: "Sustainable Design", description: "LEED- und DGNB-orientierte Konzepte." },
      { title: "Urban Renewal", description: "Quartiersbezogene Stadtentwicklung." },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
