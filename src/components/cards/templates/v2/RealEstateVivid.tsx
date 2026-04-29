"use client";

// =============================================================================
// RealEstateVivid — v2 template (id=54, key="real-estate-vivid").
//
// Sector: real estate / broker — VIVID variant. Mood: bold blue gradient hero,
// floating glass card, mega 2-color stats, vibrant social tile grid, modern
// energetic. Inspired by kart_01_emlak_vivid.html.
//
// Design DNA (different from default RealEstate.tsx):
//   - Hero: 240 px tall blue gradient panel with radial glows, brand pill
//     with pulsing dot.
//   - Float card: rounded 24-px white card overlapping hero (-100 px), rounded
//     square avatar with brand-tinted shadow, name + title + status pill.
//   - QStats: 3-up amber-gradient pill panel with extra-bold orange numbers.
//   - Services: 2-col rounded cards with rounded icon tiles (alt blue / amber).
//   - Big CTA: gradient pill button.
//   - Testimonial: dark gradient card with giant " mark.
//   - Social-tile grid: 5-up colorful gradient tiles (Tel · WA · Mail · IG · Web).
//   - QR-style gradient panel + outlined vCard CTA.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Building,
  Building2,
  Calendar,
  Globe,
  Home,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#1a56db"; // bold electric blue
const LOCKED_ACCENT = "#60a5fa"; // light blue
const ACCENT_AMBER = "#fbbf24";
const ACCENT_AMBER_DARK = "#d97706";
const PAGE = "#f3f4f6";
const SURFACE = "#ffffff";
const INK = "#111827";
const INK_MUTED = "#6b7280";
const INK_DIM = "#9ca3af";
const HAIRLINE = "#e5e7eb";
const DARK = "#0f172a";

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
  return (parts[0][0] ?? "•").toUpperCase() + (parts[parts.length - 1]?.[0] ?? "").toUpperCase();
}

interface RevCopy {
  active: string;
  yearsLabel: string;
  closedLabel: string;
  portfolioLabel: string;
  servicesH: string;
  servicesSub: string;
  bookConsult: string;
  testimonial: string;
  contactH: string;
  contactSub: string;
  qrShare: string;
  qrSub: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  impressum: string;
  privacy: string;
  share: string;
}

const COPY: Record<"de" | "en" | "tr", RevCopy> = {
  de: {
    active: "Aktiv",
    yearsLabel: "Jahre",
    closedLabel: "Abschlüsse",
    portfolioLabel: "Portfolio",
    servicesH: "Leistungen",
    servicesSub: "Was ich für Sie tue",
    bookConsult: "Kostenfreies Erstgespräch",
    testimonial: "Mandantenstimme",
    contactH: "Kontakt",
    contactSub: "Ein Klick genügt",
    qrShare: "Karte teilen",
    qrSub: "QR scannen für Direktzugriff",
    saveContact: "In Kontakte speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    impressum: "Impressum",
    privacy: "Datenschutz",
    share: "Teilen",
  },
  en: {
    active: "Active",
    yearsLabel: "Years",
    closedLabel: "Closed",
    portfolioLabel: "Portfolio",
    servicesH: "Services",
    servicesSub: "What I do for you",
    bookConsult: "Free consultation",
    testimonial: "Client voice",
    contactH: "Get in touch",
    contactSub: "One tap away",
    qrShare: "Share my card",
    qrSub: "Scan QR for instant access",
    saveContact: "Save to contacts",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    impressum: "Imprint",
    privacy: "Privacy",
    share: "Share",
  },
  tr: {
    active: "Aktif",
    yearsLabel: "Yıl",
    closedLabel: "Satış",
    portfolioLabel: "Portföy",
    servicesH: "Hizmetler",
    servicesSub: "Sizin için yapabileceklerim",
    bookConsult: "Ücretsiz Danışma Randevusu",
    testimonial: "Müvekkil Yorumu",
    contactH: "Bana Ulaşın",
    contactSub: "Tek dokunuşla iletişim",
    qrShare: "Kartviziti Paylaş",
    qrSub: "QR kod ile hızlı erişim",
    saveContact: "Rehbere kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    impressum: "Künye",
    privacy: "Gizlilik",
    share: "Paylaş",
  },
};

export function RealEstateVivid({
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

  const services = cardData.services ?? [];
  const testimonials = cardData.testimonials ?? [];
  const reference = testimonials[0];

  const region = cardData.address?.split(",").slice(-1)[0]?.trim() || "Berlin";

  const year = new Date().getFullYear();

  return (
    <article
      data-template="real-estate-vivid"
      className="rev-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: SURFACE,
        color: INK,
        boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
      }}
    >
      <style jsx global>{`
        .rev-card {
          font-family: 'Poppins', 'Open Sans', system-ui, sans-serif;
          line-height: 1.55;
        }
        .rev-card .display { font-family: 'Poppins', system-ui, sans-serif; }
        .rev-card a { color: inherit; }
        @keyframes rev-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* HERO */}
      <header
        className="relative h-[240px] px-6 pt-7"
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, ${DARK} 50%, #1e1b4b 100%)`,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at 80% 10%, ${ACCENT_AMBER}26 0%, transparent 45%), radial-gradient(circle at 12% 70%, ${accent}33 0%, transparent 45%)`,
          }}
        />
        <div
          className="relative inline-flex items-center gap-2.5 text-[12px] font-semibold uppercase"
          style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "1.5px" }}
        >
          <span
            aria-hidden
            className="block h-2 w-2 rounded-full"
            style={{ background: accent, boxShadow: `0 0 12px ${accent}`, animation: "rev-pulse 2s ease-in-out infinite" }}
          />
          {cardData.company || "Walker & Stein"}
        </div>
      </header>

      {/* FLOATING CARD */}
      <div
        className="relative z-10 mx-6 -mt-[100px] flex items-center gap-4 rounded-3xl p-6"
        style={{
          background: SURFACE,
          boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <div
          className="relative h-[76px] w-[76px] flex-shrink-0 overflow-hidden rounded-[22px]"
          style={{
            border: `3px solid ${SURFACE}`,
            boxShadow: `0 6px 18px ${primary}40`,
            background: PAGE,
          }}
        >
          {photoUrl ? (
            <Image src={photoUrl} alt="" fill sizes="76px" unoptimized className="object-cover" />
          ) : (
            <div
              className="display flex h-full w-full items-center justify-center text-[24px] font-bold"
              style={{ color: primary }}
            >
              {initials}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="display text-[20px] font-bold leading-[1.2]"
            style={{ color: INK, letterSpacing: "-0.4px" }}
          >
            {cardData.name}
          </div>
          <div className="mt-1 text-[12.5px] font-medium" style={{ color: INK_MUTED, lineHeight: 1.4 }}>
            {[cardData.position, cardData.title].filter(Boolean).join(" · ") || "Real Estate Advisor"}
          </div>
          <div
            className="display mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-bold"
            style={{
              background: `${primary}1a`,
              color: primary,
              letterSpacing: "0.4px",
            }}
          >
            <span aria-hidden className="block h-1.5 w-1.5 rounded-full" style={{ background: primary }} />
            {t.active} · {region}
          </div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div
        className="mx-6 mt-7 grid grid-cols-3 overflow-hidden rounded-[18px] px-2 py-[18px]"
        style={{
          background: `linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)`,
          position: "relative",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-full"
          style={{ background: `${ACCENT_AMBER_DARK}1f`, transform: "translate(30px, -30px)" }}
        />
        <QStat num="12+" label={t.yearsLabel} />
        <QStat num="180+" label={t.closedLabel} divider />
        <QStat num="€2.4B" label={t.portfolioLabel} divider />
      </div>

      {/* SERVICES */}
      {services.length > 0 && (
        <section className="px-6 pt-8">
          <h2
            className="display text-[19px] font-bold"
            style={{ color: INK, letterSpacing: "-0.3px" }}
          >
            {t.servicesH}
          </h2>
          <p
            className="mb-5 mt-1 text-[12.5px]"
            style={{ color: INK_MUTED }}
          >
            {t.servicesSub}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {services.slice(0, 5).map((svc, i, arr) => {
              const amber = i % 2 === 1;
              const full = arr.length === 5 && i === 4;
              return (
                <div
                  key={`${svc.title}-${i}`}
                  className={`rounded-2xl px-3.5 py-[18px] transition-all hover:-translate-y-0.5 ${full ? "col-span-2" : ""}`}
                  style={{
                    background: SURFACE,
                    border: `1.5px solid ${HAIRLINE}`,
                  }}
                >
                  <div
                    className="mb-3 flex h-9 w-9 items-center justify-center rounded-[10px]"
                    style={{
                      background: amber ? `${ACCENT_AMBER}29` : `${primary}1f`,
                      color: amber ? ACCENT_AMBER_DARK : primary,
                    }}
                  >
                    {amber ? <Building size={18} strokeWidth={2} /> : <Home size={18} strokeWidth={2} />}
                  </div>
                  <div
                    className="display text-[13.5px] font-semibold leading-[1.25]"
                    style={{ color: INK }}
                  >
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div
                      className="mt-1 text-[11.5px] leading-[1.4]"
                      style={{ color: INK_MUTED }}
                    >
                      {svc.description}
                    </div>
                  )}
                  {svc.priceLabel && (
                    <div
                      className="display mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10.5px] font-bold"
                      style={{
                        background: amber ? `${ACCENT_AMBER}29` : `${primary}1f`,
                        color: amber ? ACCENT_AMBER_DARK : primary,
                      }}
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
      <section className="mx-6 my-5">
        <a
          href={cardData.bookingUrl || (waDigits ? `https://wa.me/${waDigits}` : `mailto:${cardData.email ?? ""}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="display flex w-full items-center justify-center gap-2.5 rounded-2xl px-6 py-[18px] text-[15px] font-bold transition-all hover:-translate-y-0.5"
          style={{
            background: `linear-gradient(135deg, ${primary} 0%, #1e3a8a 100%)`,
            color: "#fff",
            boxShadow: `0 8px 22px -4px ${primary}80`,
            letterSpacing: "0.2px",
          }}
        >
          <Calendar size={20} strokeWidth={2.2} />
          {t.bookConsult}
        </a>
      </section>

      {/* TESTIMONIAL */}
      {reference && (
        <div
          className="relative mx-6 overflow-hidden rounded-[20px] px-[22px] py-7 text-white"
          style={{
            background: `linear-gradient(135deg, ${DARK} 0%, #1e3a8a 100%)`,
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -left-1 -top-3 select-none"
            style={{
              fontFamily: "'Poppins', system-ui, sans-serif",
              fontSize: 110,
              fontWeight: 800,
              color: `${ACCENT_AMBER}3a`,
              lineHeight: 1,
            }}
          >
            &ldquo;
          </span>
          <p
            className="relative text-[14.5px] font-medium leading-[1.6]"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            {reference.quote}
          </p>
          <div className="relative mt-4 flex items-center gap-3">
            <div
              className="display flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full text-[14px] font-bold"
              style={{
                background: `linear-gradient(135deg, ${ACCENT_AMBER} 0%, ${ACCENT_AMBER_DARK} 100%)`,
                color: DARK,
              }}
            >
              {reference.author.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </div>
            <div className="min-w-0">
              <div
                className="display text-[13px] font-semibold"
                style={{ color: ACCENT_AMBER }}
              >
                {reference.author}
              </div>
              {reference.role && (
                <div
                  className="text-[11px]"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  {reference.role}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONTACT */}
      <section className="px-6 pb-2 pt-8 text-center">
        <h2
          className="display text-[19px] font-bold"
          style={{ color: INK, letterSpacing: "-0.3px" }}
        >
          {t.contactH}
        </h2>
        <p
          className="mt-1 text-[12.5px]"
          style={{ color: INK_MUTED }}
        >
          {t.contactSub}
        </p>
      </section>

      <div className="grid grid-cols-5 gap-2.5 px-6 pt-3">
        {phoneDigits && (
          <SocialTile
            href={`tel:${phoneDigits}`}
            grad="linear-gradient(135deg, #34d399 0%, #059669 100%)"
            ariaLabel="Call"
            Icon={Phone}
          />
        )}
        {waDigits && (
          <SocialTile
            href={`https://wa.me/${waDigits}`}
            external
            grad="linear-gradient(135deg, #25d366 0%, #128c7e 100%)"
            ariaLabel="WhatsApp"
            Icon={MessageCircle}
          />
        )}
        {cardData.email && (
          <SocialTile
            href={`mailto:${cardData.email}`}
            grad="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
            ariaLabel="Email"
            Icon={Mail}
          />
        )}
        {cardData.socials?.instagram && (
          <SocialTile
            href={cardData.socials.instagram}
            external
            grad="linear-gradient(135deg, #f58529 0%, #dd2a7b 50%, #8134af 100%)"
            ariaLabel="Instagram"
            Icon={Instagram}
          />
        )}
        {cardData.website && (
          <SocialTile
            href={cardData.website.startsWith("http") ? cardData.website : `https://${cardData.website}`}
            external
            grad={`linear-gradient(135deg, ${primary} 0%, #4338ca 100%)`}
            ariaLabel="Website"
            Icon={Globe}
          />
        )}
      </div>

      <section className="px-6 pt-5">
        <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={primary} />
      </section>

      {/* CTA Slots */}
      <section className="px-6 pb-2 pt-3">
        <SendMyInfoSlot slug={slug} sourceQs="" primary={primary} locale={locale} />
        <ExchangeSlot slug={slug} primary={primary} locale={locale} />
      </section>

      {/* QR-style panel */}
      <div
        className="mx-6 mt-6 rounded-[20px] px-[22px] py-7 text-center"
        style={{
          background: `linear-gradient(135deg, ${primary}14 0%, ${ACCENT_AMBER}14 100%)`,
          border: `1.5px solid ${HAIRLINE}`,
        }}
      >
        <div
          className="display text-[14px] font-bold"
          style={{ color: INK }}
        >
          {t.qrShare}
        </div>
        <p
          className="mt-1 text-[11.5px]"
          style={{ color: INK_MUTED }}
        >
          {t.qrSub}
        </p>
      </div>

      {/* vCard CTA */}
      <a
        href={`/api/cards/${encodeURIComponent(slug)}/vcard`}
        download
        className="display mx-6 mt-[18px] flex items-center justify-center gap-2.5 rounded-2xl px-6 py-4 text-[14px] font-bold transition-all hover:-translate-y-0.5"
        style={{
          background: SURFACE,
          color: INK,
          border: `2px solid ${INK}`,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        {t.saveContact}
      </a>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="mx-6 mt-5 rounded-[20px] p-5"
          labelClassName="mb-3 text-center text-[10.5px] font-semibold uppercase tracking-[0.18em]"
          style={{ background: PAGE, border: `1px solid ${HAIRLINE}` }}
        >
          <div style={{ ["--card-primary" as string]: primary }}>{walletSlot}</div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer className="mt-7 px-6 pb-8 pt-7 text-center">
        <div
          className="display text-[13px] font-bold"
          style={{ color: INK }}
        >
          {cardData.name}
          {cardData.company && (
            <span style={{ color: INK_MUTED, fontWeight: 500 }}> · {cardData.company}</span>
          )}
        </div>
        <div
          className="mt-1 text-[11px]"
          style={{ color: INK_MUTED }}
        >
          © {year} · {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold"
            style={{ color: primary }}
          >
            OpSolid
          </a>
        </div>
        <div className="mt-2 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10.5px]" style={{ color: INK_DIM }}>
          {cardData.impressumUrl && (
            <a href={cardData.impressumUrl} target="_blank" rel="noopener noreferrer">
              {t.impressum}
            </a>
          )}
          {cardData.privacyUrl && (
            <a href={cardData.privacyUrl} target="_blank" rel="noopener noreferrer">
              {t.privacy}
            </a>
          )}
          <span className="inline-flex items-center gap-1">
            <Shield size={11} strokeWidth={1.6} />
            opsolid.de/c/{slug}
          </span>
        </div>
        {/* unused-tree-shake markers */}
        <span className="hidden">
          <Building2 size={1} />
          <Sparkles size={1} />
          <TrendingUp size={1} />
          <ArrowUpRight size={1} />
        </span>
      </footer>
    </article>
  );
}

function QStat({ num, label, divider }: { num: string; label: string; divider?: boolean }) {
  return (
    <div className="relative px-2 text-center">
      {divider && (
        <span
          aria-hidden
          className="absolute left-0 top-[10%] block h-[80%] w-px"
          style={{ borderLeft: `1px dashed ${ACCENT_AMBER_DARK}50` }}
        />
      )}
      <div
        className="display text-[26px] font-extrabold leading-none"
        style={{ color: ACCENT_AMBER_DARK, letterSpacing: "-0.5px" }}
      >
        {num}
      </div>
      <div
        className="mt-1.5 text-[10.5px] font-semibold"
        style={{ color: "#92400e", letterSpacing: "0.3px" }}
      >
        {label}
      </div>
    </div>
  );
}

function SocialTile({
  href,
  grad,
  ariaLabel,
  Icon,
  external,
}: {
  href: string;
  grad: string;
  ariaLabel: string;
  Icon: typeof Phone;
  external?: boolean;
}) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" as const } : {};
  return (
    <a
      href={href}
      {...ext}
      aria-label={ariaLabel}
      className="flex aspect-square items-center justify-center rounded-2xl transition-transform hover:-translate-y-1"
      style={{ background: grad }}
    >
      <Icon size={22} strokeWidth={2} color="#ffffff" />
    </a>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const realEstateVividEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 54,
  key: "real-estate-vivid",
  name: "Real Estate — Vivid",
  industry: "Real estate agent / broker",
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
    brandPrimaryHex: LOCKED_PRIMARY,
    brandAccentHex: LOCKED_ACCENT,
  },
  sampleSlug: "demo-real-estate-vivid",
};

// photo: Unsplash, by Christina Wocintechchat — Unsplash License, no attribution required.
export const realEstateVividSample: SampleData = {
  templateId: 54,
  slug: "demo-real-estate-vivid",
  cardData: {
    name: "Hannah Walker",
    position: "Senior Listing Agent",
    title: "Real Estate Advisor",
    company: "Walker & Stein",
    email: "hannah@walker-stein.de",
    phone: "+49 30 1234 5678",
    whatsapp: "+49 170 1234 567",
    website: "walker-stein.de",
    address: "Kurfürstendamm 188, 10707 Berlin",
    bio: "Twelve years pairing discerning clients with Berlin's most distinctive homes.",
    bookingUrl: "https://cal.com/walker-stein/intro",
    brochureUrl: "https://walker-stein.de/portfolio.pdf",
    impressumUrl: "https://walker-stein.de/impressum",
    privacyUrl: "https://walker-stein.de/datenschutz",
    sectorKey: "real-estate",
    socials: {
      linkedin: "https://linkedin.com/in/hannahwalker-de",
      instagram: "https://instagram.com/walker.stein.berlin",
      youtube: "https://youtube.com/@walkerstein",
    },
    services: [
      { title: "Charlottenburg Townhouse", description: "5 bed · 240 m² · pre-war altbau", priceLabel: "€2.85M" },
      { title: "Wannsee Waterfront", description: "Architect-built · private dock", priceLabel: "FOR SALE" },
      { title: "Mitte Penthouse", description: "180 m² · roof terrace", priceLabel: "€1.65M" },
      { title: "Investment Advisory", description: "Strategic property investments" },
      { title: "Property Valuation", description: "Professional appraisal & market analysis" },
    ],
    testimonials: [
      {
        author: "Sebastian & Marie L.",
        role: "Bought — Mitte penthouse",
        quote: "Hannah understood us before we did. She turned eight months of dead-end viewings into a single home that felt inevitable.",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
