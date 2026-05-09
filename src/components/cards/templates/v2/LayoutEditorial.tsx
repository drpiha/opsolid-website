"use client";

// =============================================================================
// LayoutEditorial — v2 universal template (id=95, key="layout-editorial").
//
// Sector: ANY. Inspired by layouts/v14_editorial.html — magazine layout with
// red side rail "ISSUE 04", Fraunces serif italic display name, full-width
// editorial cover photo, big italic manifesto quote with red accent words,
// asymmetric two-column "About / Skills" block, year-stamped portfolio rows,
// dark contact wrap with red rail, framed QR-style closing block.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#111111";
const LOCKED_ACCENT = "#e63946";

const PAGE = "#f8f5f0";
const SURFACE = "#ffffff";
const INK = "#111111";
const MUTED = "#666666";
const HAIRLINE = "#d8d4cc";

function readableTextOn(hex: string | null | undefined): string {
  if (!hex) return "#111111";
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? "#111111" : "#f8f5f0";
}

function resolveAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("data:") || path.startsWith("blob:")) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return `/${path}`;
}

interface Copy {
  issueLabel: string;
  manifestoLabel: string;
  manifestoLine1Pre: string;
  manifestoLine1Em: string;
  manifestoLine2: string;
  aboutLabel: string;
  skillsLabel: string;
  selectedTitle: string;
  selectedSuffix: string;
  contactTitle: string;
  closingLine1: string;
  closingLine2: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    issueLabel: "ISSUE 04",
    manifestoLabel: "Manifest Nr. 04",
    manifestoLine1Pre: "Gute Strategie ist",
    manifestoLine1Em: "leise",
    manifestoLine2: "schlechte Strategie schreit.",
    aboutLabel: "Über",
    skillsLabel: "Kompetenzen",
    selectedTitle: "Ausgewählte Projekte",
    selectedSuffix: "Nr.",
    contactTitle: "Kontakt.",
    closingLine1: "Speichern,",
    closingLine2: "in Kontakt bleiben.",
    saveContact: "Kontakt speichern",
    walletLabel: "In Wallet speichern",
    poweredBy: "Powered by",
  },
  en: {
    issueLabel: "ISSUE 04",
    manifestoLabel: "Manifesto No. 04",
    manifestoLine1Pre: "Good strategy is",
    manifestoLine1Em: "quiet",
    manifestoLine2: "bad strategy shouts.",
    aboutLabel: "About",
    skillsLabel: "Skills",
    selectedTitle: "Selected Work",
    selectedSuffix: "No.",
    contactTitle: "Contact.",
    closingLine1: "Save,",
    closingLine2: "stay in touch.",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    issueLabel: "ISSUE 04",
    manifestoLabel: "Manifesto No. 04",
    manifestoLine1Pre: "İyi strateji",
    manifestoLine1Em: "sessizdir",
    manifestoLine2: "kötü strateji bağırır.",
    aboutLabel: "Hakkında",
    skillsLabel: "Yetkinlikler",
    selectedTitle: "Seçili Projeler",
    selectedSuffix: "No.",
    contactTitle: "İletişim.",
    closingLine1: "Kaydet,",
    closingLine2: "bağlantıda kal.",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana Ekle",
    poweredBy: "Powered by",
  },
  es: {

    issueLabel: "EDICIÓN 04",
    manifestoLabel: "Manifiesto n.º 04",
    manifestoLine1Pre: "Una buena estrategia es",
    manifestoLine1Em: "tranquilo",
    manifestoLine2: "la mala estrategia grita.",
    aboutLabel: "Acerca de",
    skillsLabel: "Habilidades",
    selectedTitle: "Trabajo seleccionado",
    selectedSuffix: "N.º",
    contactTitle: "Contacto.",
    closingLine1: "Guardar,",
    closingLine2: "mantente en contacto.",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    issueLabel: "NUMERO 04",
    manifestoLabel: "Manifesto n. 04",
    manifestoLine1Pre: "Una buona strategia è",
    manifestoLine1Em: "tranquillo",
    manifestoLine2: "la cattiva strategia urla.",
    aboutLabel: "Chi siamo",
    skillsLabel: "Competenze",
    selectedTitle: "Lavori selezionati",
    selectedSuffix: "N.",
    contactTitle: "Contatto.",
    closingLine1: "Salva,",
    closingLine2: "resta in contatto.",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    issueLabel: "NUMÉRO 04",
    manifestoLabel: "Manifeste nº 04",
    manifestoLine1Pre: "Une bonne stratégie est",
    manifestoLine1Em: "calme",
    manifestoLine2: "la mauvaise stratégie crie.",
    aboutLabel: "À propos",
    skillsLabel: "Compétences",
    selectedTitle: "Travaux sélectionnés",
    selectedSuffix: "Nº",
    contactTitle: "Contact.",
    closingLine1: "Enregistrer,",
    closingLine2: "restez en contact.",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    issueLabel: "العدد 04",
    manifestoLabel: "بيان رقم 04",
    manifestoLine1Pre: "الاستراتيجية الجيدة",
    manifestoLine1Em: "هادئ",
    manifestoLine2: "الاستراتيجية السيئة تصرخ.",
    aboutLabel: "حول",
    skillsLabel: "المهارات",
    selectedTitle: "أعمال مختارة",
    selectedSuffix: "رقم",
    contactTitle: "اتصال.",
    closingLine1: "حفظ،",
    closingLine2: "ابقَ على تواصل.",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

export function LayoutEditorial({
  slug,
  cardData,
  locale = "de",
  photoPath,
  brandPrimaryHex,
  brandAccentHex,
  walletSlot,
}: TemplateProps) {
  const t = COPY[locale] ?? COPY.de;
  const accent = brandAccentHex || LOCKED_ACCENT;
  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  void primary;
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);
  const services = (cardData.services ?? []).slice(0, 5);
  const nameParts = cardData.name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? cardData.name;
  const surname = nameParts.slice(1).join(" ");
  const currentYear = new Date().getFullYear() % 100;
  const yearStamps = services.map((_, i) =>
    String(currentYear - i).padStart(2, "0"),
  );

  return (
    <article
      data-template="layout-editorial"
      className="layout-editorial-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: INK }}
    >
      <style jsx global>{`
        .layout-editorial-card {
          font-family: var(--tpl-font-body, 'DM Sans', system-ui, sans-serif);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        .layout-editorial-card .display {
          font-family: var(--tpl-font-display, 'Fraunces', 'Cormorant Garamond', Georgia, serif);
        }
        .layout-editorial-card a { color: inherit; text-decoration: none; }
      `}</style>

      {/* TOP — sidebar + name */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "20px 1fr",
          minHeight: 200,
        }}
      >
        <div
          className="relative"
          style={{ background: accent }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute uppercase"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-90deg)",
              fontSize: 9,
              letterSpacing: "4px",
              color: "rgba(255,255,255,0.85)",
              whiteSpace: "nowrap",
              fontWeight: 600,
            }}
          >
            {t.issueLabel}
          </span>
        </div>
        <div className="flex flex-col justify-center px-7 py-9">
          <div
            className="uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "3px",
              color: accent,
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            {cardData.position || cardData.title || "Consultant"}
          </div>
          <h1
            className="display"
            style={{
              fontWeight: 700,
              fontSize: "clamp(40px, 13vw, 54px)",
              lineHeight: 0.95,
              letterSpacing: "-2px",
              color: INK,
              wordBreak: "break-word",
            }}
          >
            <span
              className="block"
              style={{ fontStyle: "italic", fontWeight: 400 }}
            >
              {firstName}
            </span>
            {surname}
          </h1>
        </div>
      </div>

      {/* COVER PHOTO */}
      {photoUrl && (
        <div
          className="relative w-full overflow-hidden"
          style={{ height: 200 }}
        >
          <Image
            src={photoUrl}
            alt={cardData.name}
            fill
            unoptimized
            sizes="(max-width: 460px) 100vw, 460px"
            className="object-cover tpl-photo"
            style={{ filter: "contrast(1.05)" }}
          />
        </div>
      )}

      {/* MANIFESTO QUOTE */}
      <section
        className="px-8 pb-11 pt-12 text-center"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "3px",
            color: accent,
            fontWeight: 600,
            marginBottom: 18,
          }}
        >
          {t.manifestoLabel}
        </div>
        <p
          className="display"
          style={{
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(24px, 7.5vw, 30px)",
            lineHeight: 1.2,
            color: INK,
            letterSpacing: "-0.5px",
          }}
        >
          {cardData.bio
            ? cardData.bio
            : (
              <>
                {t.manifestoLine1Pre}{" "}
                <em style={{ fontStyle: "normal", color: accent }}>
                  {t.manifestoLine1Em}
                </em>
                ; <br />
                {t.manifestoLine2}
              </>
            )}
        </p>
      </section>

      {/* TWO COLS — about / skills */}
      <section
        className="grid"
        style={{
          gridTemplateColumns: "1fr 1fr",
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        <div
          className="px-6 py-8"
          style={{ borderRight: `1px solid ${HAIRLINE}` }}
        >
          <h3
            className="uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "2.5px",
              fontWeight: 600,
              color: accent,
              marginBottom: 14,
            }}
          >
            {t.aboutLabel}
          </h3>
          <p
            className="display"
            style={{
              fontSize: 14,
              lineHeight: 1.55,
              color: INK,
              fontWeight: 400,
            }}
          >
            {cardData.bio ||
              `${cardData.title || "Consultant"}${cardData.company ? ` · ${cardData.company}` : ""}.`}
          </p>
        </div>
        <div className="px-6 py-8">
          <h3
            className="uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "2.5px",
              fontWeight: 600,
              color: accent,
              marginBottom: 14,
            }}
          >
            {t.skillsLabel}
          </h3>
          <ul className="flex flex-col">
            {services.length > 0
              ? services.slice(0, 5).map((svc, i, arr) => (
                  <li
                    key={`skill-${i}`}
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: INK,
                      padding: "6px 0",
                      borderBottom:
                        i < arr.length - 1
                          ? `1px dashed ${HAIRLINE}`
                          : "none",
                    }}
                  >
                    {svc.title}
                  </li>
                ))
              : (cardData.position || cardData.title || "")
                  .split(/\s*[,·]\s*/)
                  .slice(0, 5)
                  .map((skill, i, arr) => (
                    <li
                      key={`skill-${i}`}
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: INK,
                        padding: "6px 0",
                        borderBottom:
                          i < arr.length - 1
                            ? `1px dashed ${HAIRLINE}`
                            : "none",
                      }}
                    >
                      {skill}
                    </li>
                  ))}
          </ul>
        </div>
      </section>

      {/* PORTFOLIO / SERVICES */}
      {services.length > 0 && (
        <section className="px-7 py-9">
          <h2
            className="display"
            style={{
              fontWeight: 700,
              fontSize: 26,
              marginBottom: 18,
              lineHeight: 1,
              letterSpacing: "-1px",
            }}
          >
            {t.selectedTitle}{" "}
            <span
              style={{
                fontSize: 12,
                color: accent,
                verticalAlign: "super",
                fontWeight: 600,
                fontFamily: "'DM Sans', system-ui, sans-serif",
                letterSpacing: "2px",
              }}
            >
              {t.selectedSuffix} {String(services.length).padStart(2, "0")}
            </span>
          </h2>
          <div>
            {services.map((svc, i) => (
              <div
                key={`proj-${i}`}
                className="grid items-center gap-4 py-3.5"
                style={{
                  gridTemplateColumns: "56px 1fr auto",
                  borderTop: `1px solid ${HAIRLINE}`,
                  ...(i === services.length - 1
                    ? { borderBottom: `1px solid ${HAIRLINE}` }
                    : {}),
                }}
              >
                <div
                  className="display"
                  style={{
                    fontStyle: "italic",
                    fontSize: 18,
                    color: accent,
                    fontWeight: 400,
                  }}
                >
                  &lsquo;{yearStamps[i]}
                </div>
                <div className="min-w-0">
                  <div
                    className="display"
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: INK,
                      lineHeight: 1.2,
                      marginBottom: 2,
                    }}
                  >
                    {svc.title}
                  </div>
                  <div
                    className="uppercase"
                    style={{
                      fontSize: 10,
                      letterSpacing: "1.5px",
                      color: MUTED,
                      fontWeight: 500,
                    }}
                  >
                    {svc.priceLabel || svc.description?.slice(0, 32) || ""}
                  </div>
                </div>
                <span
                  aria-hidden
                  style={{ fontSize: 18, color: INK }}
                >
                  →
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT — DARK */}
      <section
        className="relative px-7 py-9"
        style={{ background: INK, color: PAGE }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            background: accent,
          }}
        />
        <h2
          className="display"
          style={{
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 28,
            marginBottom: 20,
            color: PAGE,
          }}
        >
          {t.contactTitle}
        </h2>
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
              className="flex items-baseline justify-between gap-3 pb-3"
              style={{
                borderBottom: `1px dashed rgba(248, 245, 240, 0.2)`,
                color: PAGE,
                paddingTop: 6,
              }}
            >
              <span
                className="uppercase"
                style={{
                  fontSize: 10,
                  letterSpacing: "2.5px",
                  color: accent,
                  fontWeight: 600,
                }}
              >
                {row.label}
              </span>
              <span
                className="display"
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  textAlign: "right",
                  wordBreak: "break-word",
                }}
              >
                {row.value}
              </span>
            </a>
          )}
        />
        {cardData.socials && Object.values(cardData.socials).some(Boolean) && (
          <div className="mt-6">
            <SocialRow
              socials={cardData.socials}
              variant="icon"
              accentHex={accent}
            />
          </div>
        )}
      </section>

      {/* QR-LIKE CLOSING — framed mark */}
      <section
        className="flex items-center gap-5 px-7 py-9"
        style={{ background: PAGE, borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="relative"
          style={{
            padding: 10,
            background: SURFACE,
            border: `2px solid ${INK}`,
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              inset: -8,
              border: `1px solid ${accent}`,
            }}
          />
          <div
            className="display flex items-center justify-center"
            style={{
              width: 80,
              height: 80,
              fontStyle: "italic",
              fontSize: 32,
              color: INK,
              fontWeight: 700,
              letterSpacing: "-1px",
            }}
          >
            {firstName.charAt(0)}
            {surname.charAt(0)}
          </div>
        </div>
        <div className="flex-1">
          <h3
            className="display"
            style={{
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 22,
              marginBottom: 6,
              color: INK,
              lineHeight: 1.15,
            }}
          >
            {t.closingLine1}
            <br />
            {t.closingLine2}
          </h3>
          <p style={{ fontSize: 12, color: MUTED }}>
            {cardData.website || cardData.email || ""}
          </p>
        </div>
      </section>

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="px-7 py-7"
        style={{ background: SURFACE, borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
        <ExchangeSlot slug={slug} primary={accent} locale={locale} className="mt-3" />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-7 py-6"
          labelClassName="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em]"
        >
          <div
            style={{
              ["--card-primary" as string]: accent,
            } as React.CSSProperties}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer
        className="px-7 pb-9 pt-7 text-center uppercase"
        style={{
          fontSize: 10,
          letterSpacing: "2.5px",
          color: MUTED,
        }}
      >
        {cardData.name} <span style={{ color: accent }}>·</span>{" "}
        {cardData.address?.split(",").slice(-1)[0].trim() || cardData.company || ""}{" "}
        <span style={{ color: accent }}>·</span> {new Date().getFullYear()}
        <div style={{ marginTop: 6, fontSize: 9, letterSpacing: "1.5px" }}>
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

// =============================================================================
// Registry & sample
// =============================================================================

export const layoutEditorialEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 95,
  key: "layout-editorial",
  name: "Editorial",
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
    logo: true,
  },
  defaults: {
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-layout-editorial",
};

// photo: Unsplash, https://unsplash.com/photos/photo-1560250097-0dc05888fffb — Free, no attribution required.
export const layoutEditorialSample: SampleData = {
  templateId: 95,
  slug: "demo-layout-editorial",
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
      { title: "Digital Transformation", description: "Vorstand-Begleitung", priceLabel: "€3.500/Tag" },
      { title: "Strategy Workshop", description: "Klausur · 2 Tage", priceLabel: "€1.800/Tag" },
      { title: "Executive Coaching", description: "1:1 Sparring", priceLabel: "€400/h" },
      { title: "Strategic Audit", description: "Diagnostik · 6 Wochen", priceLabel: "€18.000" },
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
