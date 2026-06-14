"use client";

// =============================================================================
// LayoutNoirLuxury — v2 universal template (id=92, key="layout-noir-luxury").
//
// Sector: ANY (consultant, freelancer, executive, creative). Inspired by
// layouts/v11_noir_luxury.html — dark editorial, Playfair Display italic,
// gold hairline accents, monogram hero, numbered specialism list, stats
// grid, pull-quote testimonial, dual contact grid.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { ServiceLink } from "./shared/ServiceLink";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import { resolveLabels } from "./shared/resolveLabels";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#0d0d0d";
const LOCKED_ACCENT = "#c8a951";

const PAGE = "#080808";
const SURFACE = "#111111";
const SURFACE_2 = "#1a1a1a";
const TEXT = "#f0ede8";
const TEXT_MUTED = "#9a9080";
const TEXT_DIM = "#5e564a";

function readableTextOn(hex: string | null | undefined): string {
  if (!hex) return "#f0ede8";
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? "#0d0d0d" : "#f0ede8";
}

function resolveAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("data:") || path.startsWith("blob:")) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return `/${path}`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "·";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface Copy {
  expertiseTitle: string;
  contactTitle: string;
  saveContact: string;
  walletLabel: string;
  shareLabel: string;
  poweredBy: string;
  rightsReserved: string;
}

export const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    expertiseTitle: "Fachgebiete",
    contactTitle: "Kontakt",
    saveContact: "Kontakt speichern",
    walletLabel: "In Wallet speichern",
    shareLabel: "Karte Teilen",
    poweredBy: "Powered by",
    rightsReserved: "Alle Rechte vorbehalten",
  },
  en: {
    expertiseTitle: "Expertise",
    contactTitle: "Contact",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    shareLabel: "Share Card",
    poweredBy: "Powered by",
    rightsReserved: "All rights reserved",
  },
  tr: {
    expertiseTitle: "Uzmanlık Alanları",
    contactTitle: "İletişim",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana Ekle",
    shareLabel: "Kartı Paylaş",
    poweredBy: "Powered by",
    rightsReserved: "Tüm Hakları Saklıdır",
  },
  es: {
    expertiseTitle: "Experiencia",
    contactTitle: "Contacto",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    shareLabel: "Compartir tarjeta",
    poweredBy: "Desarrollado por",
    rightsReserved: "Todos los derechos reservados",
  
  },
  it: {
    expertiseTitle: "Competenze",
    contactTitle: "Contatto",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    shareLabel: "Condividi biglietto",
    poweredBy: "Realizzato con",
    rightsReserved: "Tutti i diritti riservati",
  
  },
  fr: {
    expertiseTitle: "Expertise",
    contactTitle: "Contact",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    shareLabel: "Partager la carte",
    poweredBy: "Propulsé par",
    rightsReserved: "Tous droits réservés",
  
  },
  ar: {
    expertiseTitle: "الخبرة",
    contactTitle: "اتصال",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    shareLabel: "مشاركة البطاقة",
    poweredBy: "مشغل بواسطة",
    rightsReserved: "جميع الحقوق محفوظة",
  
  },
};

export function LayoutNoirLuxury({
  slug,
  cardData,
  locale = "de",
  photoPath,
  brandPrimaryHex,
  brandAccentHex,
  walletSlot,
}: TemplateProps) {
  const t = resolveLabels(COPY[locale] ?? COPY.de, cardData.labels);
  const accent = brandAccentHex || LOCKED_ACCENT;
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  void primary;
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);
  const services = (cardData.services ?? []).slice(0, 4);
  const testimonial = cardData.testimonials?.[0];
  const initials = getInitials(cardData.name);
  const subtitleBits: string[] = [];
  if (cardData.title) subtitleBits.push(cardData.title);
  if (cardData.company) subtitleBits.push(cardData.company);
  const tagline = cardData.position || subtitleBits.join(" · ");

  return (
    <article
      data-template="layout-noir-luxury"
      className="layout-noir-luxury-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: TEXT }}
    >
      <style jsx global>{`
        .layout-noir-luxury-card {
          font-family: var(--tpl-font-body, 'Inter', system-ui, sans-serif);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        .layout-noir-luxury-card .display {
          font-family: var(--tpl-font-display, 'Playfair Display', 'Cormorant Garamond', Georgia, serif);
        }
        .layout-noir-luxury-card a { color: inherit; }
      `}</style>

      {/* MONOGRAM HEADER */}
      <header
        className="flex items-center justify-center px-7 pb-5 pt-9"
        style={{ borderBottom: `1px solid ${accent}2e` }}
      >
        <div
          className="display flex items-center justify-center"
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: `1.5px solid ${accent}`,
            color: accent,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "1px",
          }}
        >
          {initials}
        </div>
      </header>

      {/* PROFILE */}
      <section className="px-7 pb-7 pt-9 text-center">
        {photoUrl && (
          <div
            className="mx-auto mb-6 flex items-center justify-center"
            style={{
              width: 130,
              height: 130,
              borderRadius: "50%",
              border: `2px solid ${accent}`,
              padding: 4,
              boxShadow: `0 0 30px ${accent}40`,
            }}
          >
            <div
              className="relative h-full w-full overflow-hidden"
              style={{ borderRadius: "50%" }}
            >
              <Image
                src={photoUrl}
                alt={cardData.name}
                fill
                unoptimized
                sizes="130px"
                className="object-cover tpl-photo"
              />
            </div>
          </div>
        )}
        <h1
          className="display"
          style={{
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(36px, 11vw, 44px)",
            lineHeight: 1.05,
            color: TEXT,
            letterSpacing: "-1px",
            marginBottom: 14,
          }}
        >
          {cardData.name}
        </h1>
        {cardData.position && (
          <div
            className="uppercase"
            style={{
              fontSize: 11,
              letterSpacing: "4px",
              color: accent,
              fontWeight: 500,
              marginBottom: 18,
            }}
          >
            {cardData.position}
          </div>
        )}
        <div
          aria-hidden
          className="mx-auto"
          style={{
            height: 1,
            width: "60%",
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            margin: "12px auto",
          }}
        />
        <div
          className="display"
          style={{
            fontStyle: "italic",
            fontSize: 13,
            color: TEXT_MUTED,
            letterSpacing: "1px",
          }}
        >
          {tagline}
        </div>
      </section>

      {/* EXPERTISE — numbered list */}
      {services.length > 0 && (
        <section className="px-7 pb-3 pt-9">
          <h2
            className="display"
            style={{
              fontSize: 22,
              fontWeight: 400,
              color: TEXT,
              letterSpacing: "0.5px",
              marginBottom: 24,
            }}
          >
            {t.expertiseTitle}
            <span
              aria-hidden
              className="block"
              style={{
                width: 30,
                height: 1,
                background: accent,
                marginTop: 10,
              }}
            />
          </h2>
          <ol className="flex flex-col gap-3">
            {services.map((svc, i) => (
              <ServiceLink
                key={`${svc.title}-${i}`}
                href={svc.href}
                className="flex gap-4 py-3.5 pl-4 pr-3"
                style={{
                  borderLeft: `2px solid ${accent}`,
                  background: `linear-gradient(90deg, ${accent}0a, transparent)`,
                }}
              >
                <span
                  className="display shrink-0"
                  style={{
                    fontSize: 14,
                    color: accent,
                    fontWeight: 700,
                    minWidth: 24,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: TEXT,
                      marginBottom: 3,
                      letterSpacing: "0.2px",
                    }}
                  >
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div
                      style={{
                        fontSize: 12,
                        color: TEXT_MUTED,
                        lineHeight: 1.55,
                      }}
                    >
                      {svc.description}
                    </div>
                  )}
                  {svc.priceLabel && (
                    <div
                      className="display mt-1"
                      style={{
                        fontStyle: "italic",
                        fontSize: 13,
                        color: accent,
                        letterSpacing: "0.5px",
                      }}
                    >
                      {svc.priceLabel}
                    </div>
                  )}
                </div>
              </ServiceLink>
            ))}
          </ol>
        </section>
      )}

      {/* PULL QUOTE — testimonial */}
      {testimonial && (
        <section
          className="relative mt-9 overflow-hidden px-9 py-12 text-center"
          style={{ background: SURFACE_2 }}
        >
          <span
            aria-hidden
            className="display pointer-events-none absolute"
            style={{
              top: 4,
              left: 24,
              fontSize: 100,
              color: accent,
              opacity: 0.25,
              lineHeight: 1,
              fontWeight: 400,
            }}
          >
            “
          </span>
          <p
            className="display relative"
            style={{
              fontStyle: "italic",
              fontSize: 18,
              lineHeight: 1.55,
              color: TEXT,
              marginBottom: 18,
              zIndex: 1,
            }}
          >
            {testimonial.quote}
          </p>
          <div
            className="uppercase"
            style={{
              fontSize: 11,
              letterSpacing: "2.5px",
              color: accent,
              fontWeight: 500,
            }}
          >
            — {testimonial.author}
            {testimonial.role ? `, ${testimonial.role}` : ""}
          </div>
        </section>
      )}

      {/* BIO (optional) */}
      {cardData.bio && !testimonial && (
        <section className="px-7 pb-2 pt-9">
          <p
            className="display"
            style={{
              fontStyle: "italic",
              fontSize: 16,
              lineHeight: 1.55,
              color: TEXT_MUTED,
              textAlign: "center",
              padding: "16px 0",
            }}
          >
            “{cardData.bio}”
          </p>
        </section>
      )}

      {/* CONTACT GRID */}
      <section className="px-7 pb-2 pt-9">
        <h2
          className="display"
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: TEXT,
            letterSpacing: "0.5px",
            marginBottom: 24,
          }}
        >
          {t.contactTitle}
          <span
            aria-hidden
            className="block"
            style={{
              width: 30,
              height: 1,
              background: accent,
              marginTop: 10,
            }}
          />
        </h2>
      </section>
      <section className="px-0">
        <div
          className="grid grid-cols-2"
          style={{ gap: 1, background: `${accent}26` }}
        >
          <ContactRows
            cardData={cardData}
            locale={locale}
            tone="dark"
            accentHex={accent}
            renderRow={(row) => (
              <a
                href={row.href}
                {...(row.external
                  ? { target: "_blank", rel: "noopener noreferrer" as const }
                  : {})}
                className="flex flex-col gap-1.5 px-4 py-5"
                style={{
                  background: SURFACE_2,
                  textDecoration: "none",
                  color: TEXT,
                }}
              >
                <span
                  className="uppercase"
                  style={{
                    color: accent,
                    fontSize: 11,
                    letterSpacing: "2px",
                    fontWeight: 500,
                  }}
                >
                  {row.label}
                </span>
                <span
                  className="break-words"
                  style={{ fontSize: 13, fontWeight: 500, color: TEXT }}
                >
                  {row.value}
                </span>
              </a>
            )}
          />
        </div>
      </section>

      {/* SOCIALS */}
      {cardData.socials && Object.values(cardData.socials).some(Boolean) && (
        <section
          className="px-7 pb-7 pt-7"
          style={{ borderTop: `1px solid ${accent}1a` }}
        >
          <SocialRow
            socials={cardData.socials}
            variant="icon"
            accentHex={accent}
          />
        </section>
      )}

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="px-7 py-7"
        style={{
          background: SURFACE_2,
          borderTop: `1px solid ${accent}1a`,
          borderBottom: `1px solid ${accent}1a`,
        }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
        <ExchangeSlot slug={slug} primary={accent} locale={locale} className="mt-3" />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-7 py-6"
          labelClassName="mb-3 text-center text-[10px] font-medium uppercase tracking-[0.22em]"
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
        style={{ borderTop: `1px solid ${accent}1a` }}
      >
        <div
          className="display"
          style={{
            fontStyle: "italic",
            fontSize: 14,
            color: accent,
            marginBottom: 4,
          }}
        >
          {cardData.name}
        </div>
        <div
          className="uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "2px",
            color: TEXT_DIM,
          }}
        >
          © {new Date().getFullYear()} — {t.rightsReserved}
        </div>
        <div
          className="mt-1 uppercase"
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

      {/* PAGE TINT — covers any rounding gaps */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: PAGE }}
      />
    </article>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const layoutNoirLuxuryEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 92,
  key: "layout-noir-luxury",
  name: "Noir Luxury",
  industry: "Universal — any sector",
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
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-layout-noir-luxury",
};

// photo: Unsplash, https://unsplash.com/photos/photo-1560250097-0dc05888fffb — Free, no attribution required.
export const layoutNoirLuxurySample: SampleData = {
  templateId: 92,
  slug: "demo-layout-noir-luxury",
  cardData: {
    name: "Alex Müller",
    title: "Strategy & Innovation Consultant",
    position: "Strategy & Innovation Consultant",
    company: "AM Advisory",
    email: "alex@amadvisory.de",
    phone: "+49 30 556 7890",
    whatsapp: "+49 30 556 7890",
    website: "amadvisory.de",
    address: "Friedrichstraße 76, 10117 Berlin",
    bio: "Unternehmensberater mit Fokus auf digitale Transformation und Strategieentwicklung. 15+ Jahre Erfahrung.",
    bookingUrl: "https://cal.com/amadvisory/intro",
    impressumUrl: "https://amadvisory.de/impressum",
    privacyUrl: "https://amadvisory.de/datenschutz",
    sectorKey: "consultant",
    socials: {
      linkedin: "https://linkedin.com/in/alexmueller-de",
      instagram: "https://instagram.com/alex.advisory",
    },
    services: [
      {
        title: "Digital Transformation",
        description: "End-to-end Begleitung von Geschäftsmodellen ins digitale Zeitalter.",
        priceLabel: "€3.500/Tag",
      },
      {
        title: "Strategy Workshop",
        description: "Zwei-tägige Klausur mit Vorstand & Führungsteam.",
        priceLabel: "€1.800/Tag",
      },
      {
        title: "Executive Coaching",
        description: "1:1 Sparring für C-Level-Entscheider.",
        priceLabel: "€400/h",
      },
      {
        title: "Strategic Audit",
        description: "Diagnostik der Wertschöpfungskette in 6 Wochen.",
        priceLabel: "ab €18.000",
      },
    ],
    testimonials: [
      {
        author: "CEO, TechCorp GmbH",
        role: "Klient",
        quote: "Alex hat unser Unternehmen in 6 Monaten komplett transformiert.",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1560250097-0dc05888fffb?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
