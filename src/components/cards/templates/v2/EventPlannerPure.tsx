"use client";

// =============================================================================
// EventPlannerPure â€” v2 template (id=45, key="event-planner-pure").
//
// Sector: Wedding & event planner â€” PURE variant. Mood: white minimal,
// modern weddings, editorial portfolio. Inspired by
// kart_18_organizasyon_pure.html.
//
// Locked design DNA (only colors respond to brand):
//   - Header: tiny brand-mark caplabel with hairline, then a horizontal name
//     block (avatar 72 px + name 26 px + role 13 px). Credential line below
//     with primary-bold spans.
//   - 3-up icon action grid divided by hairlines.
//   - Sections: hairline-divided 44 px-padded blocks. Section labels: 11 px
//     uppercase 2 px-tracked primary.
//   - Services list: numbered 01-N + name + description hairline rows.
//   - Stats grid: 3-up cells on accent-soft background.
//   - Client tag chips (white border).
//   - Contact rows + booking CTA button.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { Globe, Mail, MessageCircle, Phone } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#2d3748"; // soft charcoal-navy
const LOCKED_ACCENT = "#c8a951"; // gold
const PAGE = "#fbfaf6";
const SURFACE = "#ffffff";
const INK = "#2a1430";
const INK_SOFT = "#6b5c75";
const HAIRLINE = "#efe5f3";
const HAIRLINE_2 = "#e0cce8";
const ACCENT_SOFT = "#fef3c7";

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
  brandMark: string;
  callBtn: string;
  whatsappBtn: string;
  emailBtn: string;
  servicesH: string;
  statsH: string;
  yearsLabel: string;
  eventsLabel: string;
  weddingsLabel: string;
  clientsH: string;
  contactH: string;
  cta: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  credential: string;
}

const COPY: Record<"de" | "en" | "tr", Copy> = {
  de: {
    brandMark: "Wedding & Events Studio",
    callBtn: "Anrufen",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-Mail",
    servicesH: "Leistungen",
    statsH: "Auf einen Blick",
    yearsLabel: "Jahre",
    eventsLabel: "Events",
    weddingsLabel: "Hochzeiten",
    clientsH: "Vertrauen mir",
    contactH: "Kontakt",
    cta: "ErstgesprÃ¤ch buchen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    credential: "9 Jahre Â· 400+ Events Â· 180 Hochzeiten",
  },
  en: {
    brandMark: "Wedding & Events Studio",
    callBtn: "Call",
    whatsappBtn: "WhatsApp",
    emailBtn: "Email",
    servicesH: "Services",
    statsH: "At a glance",
    yearsLabel: "Years",
    eventsLabel: "Events",
    weddingsLabel: "Weddings",
    clientsH: "Trusted by",
    contactH: "Contact",
    cta: "Book a consultation",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    credential: "9 years Â· 400+ events Â· 180 weddings",
  },
  tr: {
    brandMark: "Wedding & Events Studio",
    callBtn: "Ara",
    whatsappBtn: "WhatsApp",
    emailBtn: "E-posta",
    servicesH: "Hizmetler",
    statsH: "Ã–zet",
    yearsLabel: "YÄ±l",
    eventsLabel: "Etkinlik",
    weddingsLabel: "DÃ¼ÄŸÃ¼n",
    clientsH: "Ã‡alÄ±ÅŸtÄ±ÄŸÄ±m Markalar",
    contactH: "Ä°letiÅŸim",
    cta: "GÃ¶rÃ¼ÅŸme Talep Et",
    saveContact: "KiÅŸiyi Kaydet",
    walletLabel: "CÃ¼zdana ekle",
    poweredBy: "Powered by",
    credential: "9 yÄ±l Â· 400+ etkinlik Â· 180 dÃ¼ÄŸÃ¼n",
  },
};

const CLIENT_TAGS = ["Mandarin Oriental", "Soho House", "Four Seasons", "Vakko", "Mercedes-Benz"];

export function EventPlannerPure({
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

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];
  const year = new Date().getFullYear();

  return (
    <article
      data-template="event-planner-pure"
      className="epp-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: INK }}
    >
      <style jsx global>{`
        .epp-card {
          font-family: var(--tpl-font-body, 'DM Sans', 'Inter', system-ui, sans-serif);
          line-height: 1.6;
          background: ${PAGE};
        }
        .epp-card a { color: inherit; }
      `}</style>

      <div style={{ background: SURFACE }}>
        {/* HEADER */}
        <header
          className="px-8 pb-8 pt-14"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <div
            className="mb-7 flex items-center gap-2 text-[12px] font-medium uppercase"
            style={{ color: primary, letterSpacing: "1.5px" }}
          >
            <span
              aria-hidden
              className="block h-px w-6"
              style={{ background: primary }}
            />
            {t.brandMark}
          </div>
          <div className="flex items-start gap-4">
            <div
              className="relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-full"
              style={{ background: PAGE }}
            >
              {photoUrl ? (
                <Image src={photoUrl} alt="" fill sizes="72px" unoptimized className="object-cover tpl-photo" />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-[24px] font-bold"
                  style={{ color: primary }}
                >
                  {cardData.name.slice(0, 1)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[26px] font-bold leading-[1.15] tracking-[-0.6px]">
                {cardData.name}
              </div>
              <div className="mt-1 text-[13px]" style={{ color: INK_SOFT }}>
                {cardData.position || cardData.title}
              </div>
            </div>
          </div>
          <div className="mt-4 text-[13px]" style={{ color: INK }}>
            <strong style={{ color: primary, fontWeight: 700 }}>{cardData.company}</strong>
            {" Â· "}
            {t.credential}
          </div>
        </header>

        {/* ACTIONS */}
        <div
          className="grid grid-cols-3"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          {phoneDigits && (
            <ActionTile href={`tel:${phoneDigits}`} Icon={Phone} label={t.callBtn} accent={primary} hairlineRight />
          )}
          {waDigits && (
            <ActionTile
              href={`https://wa.me/${waDigits}`}
              external
              Icon={MessageCircle}
              label={t.whatsappBtn}
              accent={primary}
              hairlineRight={!!cardData.email}
            />
          )}
          {cardData.email && (
            <ActionTile href={`mailto:${cardData.email}`} Icon={Mail} label={t.emailBtn} accent={primary} />
          )}
        </div>

        {/* SERVICES */}
        {services.length > 0 && (
          <section className="px-8 py-11" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
            <SectionLabel primary={primary}>{t.servicesH}</SectionLabel>
            <div className="mt-5">
              {services.slice(0, 6).map((svc, i, arr) => (
                <div
                  key={`${svc.title}-${i}`}
                  className="flex items-center gap-4 py-4"
                  style={{
                    borderBottom: i < arr.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                  }}
                >
                  <span
                    className="text-[12px] font-semibold tabular-nums"
                    style={{ color: accent, minWidth: 28 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-semibold" style={{ color: INK }}>
                      {svc.title}
                    </div>
                    {svc.description && (
                      <div className="mt-0.5 text-[12px]" style={{ color: INK_SOFT }}>
                        {svc.description}
                      </div>
                    )}
                  </div>
                  {svc.priceLabel && (
                    <div className="text-[13px] font-bold" style={{ color: primary }}>
                      {svc.priceLabel}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* STATS */}
        <section className="px-8 py-11" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
          <SectionLabel primary={primary}>{t.statsH}</SectionLabel>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <StatCell num="9" label={t.yearsLabel} primary={primary} />
            <StatCell num="400+" label={t.eventsLabel} primary={primary} />
            <StatCell num="180" label={t.weddingsLabel} primary={primary} />
          </div>
        </section>

        {/* CLIENT TAGS */}
        <section className="px-8 py-11" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
          <SectionLabel primary={primary}>{t.clientsH}</SectionLabel>
          <div className="mt-5 flex flex-wrap gap-2">
            {CLIENT_TAGS.map((c) => (
              <span
                key={c}
                className="rounded-full px-3.5 py-2 text-[12px] font-medium"
                style={{
                  background: SURFACE,
                  border: `1px solid ${HAIRLINE_2}`,
                  color: INK,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section className="px-8 py-11" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
          <SectionLabel primary={primary}>{t.contactH}</SectionLabel>
          <div className="mt-5">
            <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={primary} />
          </div>
          <a
            href={
              cardData.bookingUrl ||
              (waDigits ? `https://wa.me/${waDigits}` : `mailto:${cardData.email ?? ""}`)
            }
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block w-full rounded-xl px-5 py-4 text-center text-[14px] font-semibold transition-all hover:-translate-y-0.5"
            style={{ background: primary, color: onPrimary }}
          >
            {t.cta}
          </a>
        </section>

        {cardData.socials && (
          <section className="px-8 py-7" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
            <SocialRow socials={cardData.socials} variant="pill" accentHex={primary} />
          </section>
        )}

        {/* WALLET / SEND / EXCHANGE */}
        <section
          className="mx-8 my-9 rounded-2xl p-5"
          style={{ background: ACCENT_SOFT, border: `1px solid ${HAIRLINE_2}` }}
        >
          <SendMyInfoSlot slug={slug} sourceQs="" primary={primary} locale={locale} />
          <ExchangeSlot slug={slug} primary={primary} locale={locale} />
        </section>

        {walletSlot && (
          <WalletDock
            label={t.walletLabel}
            className="mx-8 mb-9 rounded-2xl p-5"
            labelClassName="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-center"
          >
            <div style={{ ["--card-primary" as string]: primary, background: PAGE }}>
              {walletSlot}
            </div>
          </WalletDock>
        )}

        {/* FOOTER */}
        <footer
          className="px-8 py-7 text-center text-[11px]"
          style={{ color: INK_SOFT, letterSpacing: "1px" }}
        >
          Â© {year} {cardData.company || cardData.name} Â· {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold"
            style={{ color: primary }}
          >
            OpSolid
          </a>
        </footer>
      </div>
    </article>
  );
}

function SectionLabel({
  children,
  primary,
}: {
  children: React.ReactNode;
  primary: string;
}) {
  return (
    <div
      className="text-[11px] font-medium uppercase"
      style={{ color: primary, letterSpacing: "2px" }}
    >
      {children}
    </div>
  );
}

function ActionTile({
  href,
  Icon,
  label,
  hairlineRight,
  external,
  accent,
}: {
  href: string;
  Icon: typeof Phone | typeof Globe;
  label: string;
  hairlineRight?: boolean;
  external?: boolean;
  accent: string;
}) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" as const } : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex flex-col items-center justify-center gap-1.5 px-3 py-5 text-center transition-colors hover:bg-[--hover]"
      style={{
        color: INK,
        borderRight: hairlineRight ? `1px solid ${HAIRLINE}` : undefined,
        ["--hover" as string]: ACCENT_SOFT,
      }}
    >
      <Icon size={18} strokeWidth={1.6} style={{ color: accent }} />
      <span
        className="text-[11px] font-medium uppercase"
        style={{ letterSpacing: "1.2px" }}
      >
        {label}
      </span>
    </a>
  );
}

function StatCell({
  num,
  label,
  primary,
}: {
  num: string;
  label: string;
  primary: string;
}) {
  return (
    <div
      className="rounded-xl py-5 text-center"
      style={{ background: ACCENT_SOFT }}
    >
      <div
        className="text-[26px] font-bold leading-none tracking-[-0.5px]"
        style={{ color: primary }}
      >
        {num}
      </div>
      <div
        className="mt-2 text-[11px] uppercase"
        style={{ color: INK_SOFT, letterSpacing: "1px" }}
      >
        {label}
      </div>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const eventPlannerPureEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 45,
  key: "event-planner-pure",
  name: "Event Planner â€” Pure",
  industry: "Wedding & event planner",
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
  sampleSlug: "demo-event-planner-pure",
};

// photo: Unsplash, wedding planner. Unsplash License â€” free, no attribution required.
export const eventPlannerPureSample: SampleData = {
  templateId: 45,
  slug: "demo-event-planner-pure",
  cardData: {
    name: "Naz ErdoÄŸan",
    position: "Wedding & Event Planner",
    title: "Naz Events",
    company: "Naz Events",
    email: "naz@nazevents.de",
    phone: "+49 172 667 8901",
    whatsapp: "+49 172 667 8901",
    website: "nazevents.de",
    address: "Berlin Â· Europa",
    bio: "Modern, kuratierte Hochzeiten und private Events â€” von der ersten Idee bis zum letzten Glas Champagner.",
    bookingUrl: "https://cal.com/nazevents/intro",
    sectorKey: "events",
    services: [
      { title: "Komplettpaket", description: "Konzept Â· Logistik Â· Koordination", priceLabel: "ab â‚¬4.800" },
      { title: "Tageskoordination", description: "Day-of mit komplettem Team", priceLabel: "ab â‚¬1.200" },
      { title: "Beratung", description: "Strategie & Sourcing", priceLabel: "â‚¬150 / h" },
      { title: "Konzeptdesign", description: "Locations Â· Decor Â· AtmosphÃ¤re", priceLabel: "ab â‚¬900" },
      { title: "Foto & Video", description: "Premium-Team, kuratiert", priceLabel: "ab â‚¬1.800" },
    ],
    testimonials: [
      {
        author: "Lena & Max K.",
        role: "Wedding 2025",
        quote:
          "Das schÃ¶nste Event unseres Lebens â€” Naz hat jedes Detail perfekt umgesetzt.",
      },
    ],
    socials: {
      instagram: "https://instagram.com/naz.events",
      linkedin: "https://linkedin.com/in/nazerdogan",
    },
  },
  photoUrl:
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};

