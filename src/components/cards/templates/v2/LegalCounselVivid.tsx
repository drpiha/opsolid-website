"use client";

// =============================================================================
// LegalCounselVivid â€” v2 template (id=58, key="legal-counsel-vivid").
//
// Sector: Lawyer / Rechtsanwalt â€” VIVID variant. Mood: deep navy gradient
// hero with electric blue + amber accents, energetic modern,
// Poppins display + Open Sans body. Inspired by kart_02_avukat_vivid.html.
//
// Design DNA:
//   - HERO: 240 px navy gradient with subtle radial-blue + amber glows.
//   - FLOATING CARD: rounded-3xl white card overlapping hero, avatar + name +
//     pill badge.
//   - QSTATS: navy-gradient pill with amber serif numerals, dashed dividers.
//   - SERVICES GRID 2-col + full-width row, alternating accent / amber tints.
//   - BIG CTA: blue gradient with shadow.
//   - TESTIMONIAL: navy-gradient card with oversized amber quote glyph.
//   - SOCIAL TILE GRID: 5 brand-tinted square tiles.
//   - QR section: soft tinted card with vCard CTA below.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Calendar,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#1a2b9e";
const LOCKED_ACCENT = "#4a90d9";
const SURFACE = "#ffffff";
const NAVY = "#0f172a";
const NAVY_2 = "#1e3a5f";
const ACCENT = "#3b82f6";
const ACCENT_DARK = "#2563eb";
const AMBER = "#f59e0b";
const AMBER_DARK = "#d97706";
const TEXT = "#111827";
const TEXT_SOFT = "#6b7280";
const BORDER = "#e5e7eb";

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
  const parts = name.replace(/^(Dr\.?|Av\.?|Prof\.?)\s+/i, "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Â·";
  return (parts[0][0] ?? "").toUpperCase() + (parts[parts.length - 1]?.[0] ?? "").toUpperCase();
}

interface Copy {
  servicesH: string;
  servicesSub: string;
  contactH: string;
  contactSub: string;
  ctaLabel: string;
  pillActive: string;
  yearsLabel: string;
  casesLabel: string;
  winRateLabel: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr" | "es" | "it" | "fr" | "ar", Copy> = {
  de: {
    servicesH: "Praxisgebiete",
    servicesSub: "Strategische Rechtsberatung fÃ¼r Sie und Ihr Unternehmen",
    contactH: "Kontakt",
    contactSub: "Mit einem Klick Verbindung aufnehmen",
    ctaLabel: "Kostenloses ErstgesprÃ¤ch",
    pillActive: "Aktiv Â· Berlin",
    yearsLabel: "Jahre",
    casesLabel: "Mandate",
    winRateLabel: "Erfolg",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    servicesH: "Practice Areas",
    servicesSub: "Strategic legal counsel for you and your business",
    contactH: "Reach out",
    contactSub: "One-tap contact",
    ctaLabel: "Free initial consultation",
    pillActive: "Active Â· Berlin",
    yearsLabel: "Years",
    casesLabel: "Mandates",
    winRateLabel: "Win rate",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    servicesH: "UzmanlÄ±k AlanlarÄ±",
    servicesSub: "Stratejik hukuki Ã§Ã¶zÃ¼mler",
    contactH: "Bize UlaÅŸÄ±n",
    contactSub: "Tek dokunuÅŸla iletiÅŸim",
    ctaLabel: "Ãœcretsiz Ã–n GÃ¶rÃ¼ÅŸme",
    pillActive: "Aktif Â· Berlin",
    yearsLabel: "YÄ±l",
    casesLabel: "Dava",
    winRateLabel: "BaÅŸarÄ±",
    saveContact: "KiÅŸiyi Kaydet",
    walletLabel: "CÃ¼zdana ekle",
    poweredBy: "Powered by",
  },
  es: {

    servicesH: "Áreas de práctica",
    servicesSub: "Asesoría jurídica estratégica para ti y tu negocio",
    contactH: "Contacta",
    contactSub: "Contacto con un toque",
    ctaLabel: "Consulta inicial gratuita",
    pillActive: "Active Â· Berlin",
    yearsLabel: "Años",
    casesLabel: "Mandatos",
    winRateLabel: "Tasa de éxito",
    saveContact: "Guardar contacto",
    walletLabel: "Añadir a la cartera",
    poweredBy: "Desarrollado por",
  
  },
  it: {

    servicesH: "Aree di pratica",
    servicesSub: "Consulenza legale strategica per te e la tua attività",
    contactH: "Contattaci",
    contactSub: "Contatto con un tap",
    ctaLabel: "Prima consulenza gratuita",
    pillActive: "Active Â· Berlin",
    yearsLabel: "Anni",
    casesLabel: "Mandati",
    winRateLabel: "Tasso di successo",
    saveContact: "Salva contatto",
    walletLabel: "Aggiungi al wallet",
    poweredBy: "Realizzato con",
  
  },
  fr: {

    servicesH: "Domaines de pratique",
    servicesSub: "Conseil juridique stratégique pour vous et votre entreprise",
    contactH: "Nous contacter",
    contactSub: "Contact en un clic",
    ctaLabel: "Première consultation gratuite",
    pillActive: "Active Â· Berlin",
    yearsLabel: "Années",
    casesLabel: "Mandats",
    winRateLabel: "Taux de réussite",
    saveContact: "Enregistrer le contact",
    walletLabel: "Ajouter au portefeuille",
    poweredBy: "Propulsé par",
  
  },
  ar: {

    servicesH: "مجالات الممارسة",
    servicesSub: "استشارة قانونية استراتيجية لك ولأعمالك",
    contactH: "تواصل",
    contactSub: "اتصال بنقرة",
    ctaLabel: "استشارة أولية مجانية",
    pillActive: "Active Â· Berlin",
    yearsLabel: "سنوات",
    casesLabel: "تكليفات",
    winRateLabel: "معدل النجاح",
    saveContact: "حفظ جهة الاتصال",
    walletLabel: "إضافة إلى المحفظة",
    poweredBy: "مشغل بواسطة",
  
  },
};

export function LegalCounselVivid({
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
  const onPrimary = readableTextOn(primary);

  const photoUrl = resolveAssetUrl(photoPath);
  const initials = getInitials(cardData.name);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = (cardData.services ?? []).slice(0, 5);
  const testimonial = cardData.testimonials?.[0];

  return (
    <article
      data-template="legal-counsel-vivid"
      className="lcv-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: TEXT }}
    >
      <style jsx global>{`
        .lcv-card {
          font-family: var(--tpl-font-body, 'Open Sans', system-ui, sans-serif);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .lcv-card .display {
          font-family: var(--tpl-font-display, 'Poppins', 'Inter', system-ui, sans-serif);
        }
        .lcv-card a { color: inherit; }
      `}</style>

      {/* HERO */}
      <section
        className="relative px-6 pt-7"
        style={{
          height: 240,
          background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_2} 50%, ${NAVY} 100%)`,
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              `radial-gradient(circle at 80% 10%, rgba(245,158,11,0.16) 0%, transparent 45%), radial-gradient(circle at 12% 70%, ${accent}33 0%, transparent 45%)`,
          }}
        />
        <div
          className="display relative flex items-center gap-2.5 text-[12px] font-semibold uppercase"
          style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "1.5px" }}
        >
          <span
            aria-hidden
            className="block h-2 w-2 rounded-full"
            style={{
              background: ACCENT,
              boxShadow: `0 0 12px ${ACCENT}`,
            }}
          />
          {cardData.company || "Legal Counsel"}
        </div>
      </section>

      {/* FLOATING CARD */}
      <div
        className="relative -mt-[100px] mx-6 flex items-center gap-4 rounded-[24px] p-6"
        style={{
          background: SURFACE,
          boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={cardData.name}
            width={76}
            height={76}
            unoptimized
            className="flex-shrink-0 object-cover tpl-photo"
            style={{
              width: 76,
              height: 76,
              borderRadius: 22,
              border: `3px solid ${SURFACE}`,
              boxShadow: `0 6px 18px ${ACCENT}33`,
            }}
          />
        ) : (
          <div
            className="display flex flex-shrink-0 items-center justify-center text-[24px] font-bold"
            style={{
              width: 76,
              height: 76,
              borderRadius: 22,
              background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`,
              color: "#fff",
            }}
          >
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div
            className="display mb-1 truncate text-[19px] font-bold leading-tight"
            style={{ color: TEXT, letterSpacing: "-0.4px" }}
          >
            {cardData.name}
          </div>
          <div
            className="mb-2 truncate text-[12px] font-medium leading-snug"
            style={{ color: TEXT_SOFT }}
          >
            {[cardData.position, cardData.title].filter(Boolean).join(" Â· ") ||
              "Senior Counsel"}
          </div>
          <span
            className="display inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-bold"
            style={{
              background: `${ACCENT}1f`,
              color: ACCENT_DARK,
              letterSpacing: "0.4px",
            }}
          >
            <span
              aria-hidden
              className="block h-1.5 w-1.5 rounded-full"
              style={{ background: ACCENT }}
            />
            {t.pillActive}
          </span>
        </div>
      </div>

      {/* QSTATS â€” navy gradient */}
      <div
        className="relative mx-6 mt-7 grid grid-cols-3 overflow-hidden rounded-[18px] px-2 py-4.5"
        style={{
          background: `linear-gradient(135deg, ${NAVY_2} 0%, ${NAVY} 100%)`,
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-full"
          style={{
            background: "rgba(245,158,11,0.18)",
            transform: "translate(30px, -30px)",
          }}
        />
        <VividQStat num="20+" label={t.yearsLabel} />
        <VividQStat num="800+" label={t.casesLabel} divider />
        <VividQStat num="94%" label={t.winRateLabel} divider />
      </div>

      {/* SERVICES GRID */}
      {services.length > 0 && (
        <section className="px-6 pt-8">
          <h2
            className="display text-[19px] font-bold leading-tight"
            style={{ color: TEXT, letterSpacing: "-0.3px" }}
          >
            {t.servicesH}
          </h2>
          <p className="mb-5 mt-1 text-[12.5px]" style={{ color: TEXT_SOFT }}>
            {t.servicesSub}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {services.map((svc, i) => {
              const isAmber = i % 2 === 1;
              const fullWidth = i === 4 || (services.length === 5 && i === 4);
              return (
                <div
                  key={`${svc.title}-${i}`}
                  className={`rounded-[16px] px-3.5 py-4.5 transition-all hover:-translate-y-0.5 ${fullWidth ? "col-span-2" : ""}`}
                  style={{
                    background: SURFACE,
                    border: `1.5px solid ${BORDER}`,
                  }}
                >
                  <div
                    className="mb-3 flex h-9 w-9 items-center justify-center rounded-[10px]"
                    style={{
                      background: isAmber
                        ? "rgba(245,158,11,0.16)"
                        : `${accent}1f`,
                    }}
                  >
                    <span
                      className="display text-[15px] font-bold"
                      style={{ color: isAmber ? AMBER_DARK : ACCENT_DARK }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div
                    className="display mb-1 text-[13.5px] font-semibold leading-tight"
                    style={{ color: TEXT }}
                  >
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div
                      className="text-[11.5px] leading-snug"
                      style={{ color: TEXT_SOFT }}
                    >
                      {svc.description}
                    </div>
                  )}
                  {svc.priceLabel && (
                    <div
                      className="display mt-2 text-[11px] font-bold"
                      style={{ color: isAmber ? AMBER_DARK : accent, letterSpacing: "0.3px" }}
                    >
                      {svc.priceLabel}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* BIG CTA */}
      <a
        href={
          cardData.bookingUrl ||
          (waDigits ? `https://wa.me/${waDigits}` : `mailto:${cardData.email ?? ""}`)
        }
        target="_blank"
        rel="noopener noreferrer"
        className="display mx-6 mt-5 flex items-center justify-center gap-2.5 rounded-[16px] px-6 py-4.5 text-[15px] font-bold transition-all hover:-translate-y-0.5"
        style={{
          background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`,
          color: "#fff",
          boxShadow: `0 8px 22px ${ACCENT}52`,
          letterSpacing: "0.2px",
        }}
      >
        <Calendar size={18} strokeWidth={2.2} />
        {t.ctaLabel}
        <ArrowUpRight size={16} strokeWidth={2.4} />
      </a>

      {/* TESTIMONIAL */}
      {testimonial && (
        <div
          className="relative mx-6 mt-6 overflow-hidden rounded-[20px] px-5.5 py-7 text-white"
          style={{
            background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_2} 100%)`,
          }}
        >
          <span
            aria-hidden
            className="display pointer-events-none absolute -top-2.5 left-3.5 leading-none"
            style={{
              fontSize: 110,
              fontWeight: 800,
              color: "rgba(245,158,11,0.22)",
            }}
          >
            {"â€œ"}
          </span>
          <p
            className="relative mb-4 text-[14.5px] font-medium leading-[1.6]"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            {testimonial.quote}
          </p>
          <div className="relative flex items-center gap-3">
            <div
              className="display flex h-9.5 w-9.5 flex-shrink-0 items-center justify-center rounded-full text-[14px] font-bold"
              style={{
                background: `linear-gradient(135deg, ${AMBER} 0%, ${AMBER_DARK} 100%)`,
                color: NAVY,
                width: 38,
                height: 38,
              }}
            >
              {testimonial.author
                .split(/\s+/)
                .slice(0, 2)
                .map((p) => p[0])
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <div
                className="display text-[13px] font-semibold"
                style={{ color: AMBER }}
              >
                {testimonial.author}
              </div>
              {testimonial.role && (
                <div
                  className="text-[11px]"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  {testimonial.role}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONTACT */}
      <section className="px-6 pt-8 text-center">
        <h2
          className="display text-[19px] font-bold leading-tight"
          style={{ color: TEXT, letterSpacing: "-0.3px" }}
        >
          {t.contactH}
        </h2>
        <p className="mt-1 text-[12.5px]" style={{ color: TEXT_SOFT }}>
          {t.contactSub}
        </p>
      </section>

      {/* SOCIAL TILE GRID */}
      <div className="grid grid-cols-5 gap-2.5 px-6 pt-5">
        {phoneDigits && (
          <VividTile
            href={`tel:${phoneDigits}`}
            color={`linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`}
            ariaLabel="Call"
          >
            <Phone size={22} strokeWidth={2.2} color="#fff" />
          </VividTile>
        )}
        {waDigits && (
          <VividTile
            href={`https://wa.me/${waDigits}`}
            external
            color="linear-gradient(135deg, #25d366 0%, #128c7e 100%)"
            ariaLabel="WhatsApp"
          >
            <MessageCircle size={22} strokeWidth={2.2} color="#fff" />
          </VividTile>
        )}
        {cardData.email && (
          <VividTile
            href={`mailto:${cardData.email}`}
            color={`linear-gradient(135deg, ${AMBER} 0%, ${AMBER_DARK} 100%)`}
            ariaLabel="Email"
          >
            <Mail size={22} strokeWidth={2.2} color="#fff" />
          </VividTile>
        )}
        {cardData.bookingUrl && (
          <VividTile
            href={cardData.bookingUrl}
            external
            color="linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
            ariaLabel="Book"
          >
            <Calendar size={22} strokeWidth={2.2} color="#fff" />
          </VividTile>
        )}
        {cardData.website && (
          <VividTile
            href={
              cardData.website.startsWith("http")
                ? cardData.website
                : `https://${cardData.website}`
            }
            external
            color={`linear-gradient(135deg, ${primary} 0%, ${NAVY_2} 100%)`}
            ariaLabel="Website"
          >
            <ArrowUpRight size={22} strokeWidth={2.4} color="#fff" />
          </VividTile>
        )}
      </div>

      {/* CONTACT ROWS */}
      <section className="px-6 pt-7">
        <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={accent} />
      </section>

      {/* WALLET / SEND / EXCHANGE â€” soft tinted card */}
      <section
        className="mx-6 mt-7 rounded-[20px] p-5.5"
        style={{
          background: `linear-gradient(135deg, ${ACCENT}14 0%, ${AMBER}14 100%)`,
          border: `1.5px solid ${BORDER}`,
        }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
        <ExchangeSlot slug={slug} primary={accent} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="mx-6 mt-4 rounded-[20px] p-5"
          labelClassName="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-center"
        >
          <div style={{ ["--card-primary" as string]: accent }}>{walletSlot}</div>
        </WalletDock>
      )}

      {cardData.socials && (
        <section className="px-6 pt-7">
          <SocialRow socials={cardData.socials} variant="pill" accentHex={accent} />
        </section>
      )}

      {/* FOOTER */}
      <footer className="px-6 pb-8 pt-7 text-center">
        <div
          className="display text-[13px] font-bold"
          style={{ color: TEXT }}
        >
          {cardData.name}
          {cardData.company ? ` Â· ${cardData.company}` : ""}
        </div>
        <div
          className="mt-1 text-[11px]"
          style={{ color: TEXT_SOFT }}
        >
          Â© {new Date().getFullYear()} Â· {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold"
            style={{ color: ACCENT_DARK }}
          >
            OpSolid
          </a>
        </div>
        {/* keep onPrimary referenced for theming */}
        <span className="hidden" style={{ color: onPrimary }}>Â·</span>
      </footer>
    </article>
  );
}

function VividQStat({
  num,
  label,
  divider,
}: {
  num: string;
  label: string;
  divider?: boolean;
}) {
  return (
    <div
      className="relative px-2 text-center text-white"
      style={{
        borderLeft: divider ? "1px dashed rgba(245,158,11,0.3)" : "none",
      }}
    >
      <div
        className="display text-[26px] font-extrabold leading-none"
        style={{ color: AMBER, letterSpacing: "-0.5px" }}
      >
        {num}
      </div>
      <div
        className="mt-1.5 text-[10.5px] font-semibold"
        style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "0.3px" }}
      >
        {label}
      </div>
    </div>
  );
}

function VividTile({
  href,
  color,
  ariaLabel,
  external,
  children,
}: {
  href: string;
  color: string;
  ariaLabel: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const ext = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...ext}
      className="flex aspect-square items-center justify-center rounded-[14px] transition-transform hover:-translate-y-1"
      style={{ background: color }}
    >
      {children}
    </a>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const legalCounselVividEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 58,
  key: "legal-counsel-vivid",
  name: "Legal Counsel â€” Vivid",
  industry: "Lawyer / Rechtsanwalt",
  supports: {
    services: true,
    faqs: false,
    testimonials: true,
    gallery: false,
    video: false,
    brochure: true,
    socials: true,
    themeSwitch: false,
    photo: true,
    logo: true,
  },
  defaults: {
    brandPrimaryHex: "#1a2b9e",
    brandAccentHex: "#4a90d9",
  },
  sampleSlug: "demo-legal-counsel-vivid",
};

export const legalCounselVividSample: SampleData = {
  templateId: 58,
  slug: "demo-legal-counsel-vivid",
  cardData: {
    name: "Dr. Klaus Bauer",
    position: "Rechtsanwalt",
    title: "Fachanwalt fÃ¼r Strafrecht",
    company: "Bauer & Partner",
    email: "bauer@bauer-partner.de",
    phone: "+49 30 555 7890",
    whatsapp: "+49 170 555 7890",
    website: "bauer-partner.de",
    address: "Unter den Linden 21, 10117 Berlin",
    bio: "Strafrecht, Familienrecht und Arbeitsrecht â€” pragmatisch, prÃ¤zise und persÃ¶nlich.",
    bookingUrl: "https://cal.com/bauer-partner/intro",
    brochureUrl: "https://bauer-partner.de/profil.pdf",
    impressumUrl: "https://bauer-partner.de/impressum",
    privacyUrl: "https://bauer-partner.de/datenschutz",
    sectorKey: "lawyer",
    socials: {
      linkedin: "https://linkedin.com/in/klausbauer-de",
      xing: "https://xing.com/profile/Klaus_Bauer",
    },
    services: [
      { title: "Strafrecht", description: "Verteidigung im Ermittlungsverfahren.", priceLabel: "â‚¬200 Erstberatung" },
      { title: "Familienrecht", description: "Scheidung & Sorgerecht.", priceLabel: "ab â‚¬300/h" },
      { title: "Arbeitsrecht", description: "KÃ¼ndigungsschutz & Aufhebung.", priceLabel: "Erfolgshonorar" },
      { title: "M&A", description: "Vertragsgestaltung & Due Diligence." },
      { title: "Compliance", description: "BaFin / HinSchG, Investigations & Whistleblower-Frameworks." },
    ],
    testimonials: [
      {
        author: "Mehmet T.",
        role: "CEO Â· Holding",
        quote: "Dr. Bauer hat ruhig, prÃ¤zise und mit unfehlbarem GespÃ¼r fÃ¼r den richtigen Moment verhandelt.",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#1a2b9e",
  brandAccentHex: "#4a90d9",
};

