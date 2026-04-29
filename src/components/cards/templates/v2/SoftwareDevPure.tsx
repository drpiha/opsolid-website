"use client";

// =============================================================================
// SoftwareDevPure — v2 template (id=35, key="software-dev-pure").
//
// Sector: Software engineer — PURE variant. Mood: editorial whitespace, blue
// accent, JetBrains Mono labels, light surface, oversized hero name. Inspired
// by kart_15_yazilim_pure.html.
//
// Locked design DNA (only colors respond to brand):
//   - Massive light-weight name (56 px, font-light, letter-spacing -2px) on
//     white with mono meta-row above; @handle in mono blue accent.
//   - Avatar strip: small 56 px circle + role label.
//   - Numbered sections with mono num + uppercase tracked title aligned right.
//   - Stack badges: pill outlines with hover accent.
//   - Services list: numbered, hairline rows, right-aligned price.
//   - Big availability mark + "scheduled call" CTA.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { ArrowRight, Shield } from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#1a56db";
const LOCKED_ACCENT = "#93c5fd";
const INK = "#0f172a";
const INK_SOFT = "#475569";
const INK_DIM = "#94a3b8";
const HAIRLINE = "#e5e7eb";
const HAIRLINE_SOFT = "#f1f5f9";

function _readableTextOn(hex: string | null | undefined): string {
  if (!hex) return "#1a1a1a";
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? "#1a1a1a" : "#ffffff";
}
void _readableTextOn;

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

interface SdpCopy {
  available: string;
  contact: string;
  about: string;
  stack: string;
  services: string;
  scheduleCall: string;
  callMe: string;
  saveContact: string;
  walletLabel: string;
  share: string;
  poweredBy: string;
  yearsLabel: string;
  projectsLabel: string;
  responseLabel: string;
  developer: string;
  remote: string;
}

const COPY: Record<"de" | "en" | "tr", SdpCopy> = {
  de: {
    available: "Verfügbar",
    contact: "Kontakt",
    about: "Profil",
    stack: "Stack",
    services: "Leistungen",
    scheduleCall: "Anruf vereinbaren",
    callMe: "Direkt anrufen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    share: "Teilen",
    poweredBy: "Powered by",
    yearsLabel: "Jahre",
    projectsLabel: "Projekte",
    responseLabel: "Antwort",
    developer: "Developer",
    remote: "Remote · Berlin",
  },
  en: {
    available: "Available",
    contact: "Contact",
    about: "Profile",
    stack: "Stack",
    services: "Services",
    scheduleCall: "Schedule a call",
    callMe: "Call directly",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    share: "Share",
    poweredBy: "Powered by",
    yearsLabel: "Years",
    projectsLabel: "Projects",
    responseLabel: "Response",
    developer: "Developer",
    remote: "Remote · Berlin",
  },
  tr: {
    available: "Müsait",
    contact: "İletişim",
    about: "Profil",
    stack: "Stack",
    services: "Hizmetler",
    scheduleCall: "Görüşme Planla",
    callMe: "Direkt Ara",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    share: "Paylaş",
    poweredBy: "Powered by",
    yearsLabel: "Yıl",
    projectsLabel: "Proje",
    responseLabel: "Yanıt",
    developer: "Geliştirici",
    remote: "Remote · Berlin",
  },
};

const STACK = ["TypeScript", "React", "Next.js", "Node", "AWS", "Postgres", "Tailwind", "Docker"];

export function SoftwareDevPure({
  slug,
  cardData,
  locale = "de",
  photoPath,
  brandPrimaryHex,
  walletSlot,
}: TemplateProps) {
  const t = COPY[locale] ?? COPY.de;
  const accent = brandPrimaryHex || LOCKED_PRIMARY;

  const photoUrl = resolveAssetUrl(photoPath);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  // Split first vs last word for the giant typography
  const nameParts = cardData.name.trim().split(/\s+/);
  const firstName = nameParts.slice(0, -1).join(" ") || cardData.name;
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  // handle from website / email
  const handle =
    cardData.website?.replace(/^https?:\/\//, "").replace(/\/$/, "") ||
    cardData.email?.split("@")[0] ||
    "developer";

  const services = cardData.services ?? [];
  const year = new Date().getFullYear();

  return (
    <article
      data-template="software-dev-pure"
      className="sdp-card relative mx-auto w-full max-w-[460px]"
      style={{
        background: "#ffffff",
        color: INK,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <style jsx global>{`
        .sdp-card { line-height: 1.6; }
        .sdp-card .mono { font-family: var(--tpl-font-display, 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace); }
        .sdp-card a { color: inherit; }
      `}</style>

      {/* HEADER */}
      <header
        className="px-8 pb-9 pt-14"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="mono mb-7 flex items-center gap-3 text-[10.5px] uppercase"
          style={{ color: INK_DIM, letterSpacing: "1.5px" }}
        >
          <span aria-hidden className="block h-px w-8" style={{ background: INK_DIM }} />
          <span>{t.developer}</span>
          <span aria-hidden className="block h-px flex-1" style={{ background: INK_DIM }} />
          <span
            className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10.5px] font-semibold"
            style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a" }}
          >
            <span className="block h-1.5 w-1.5 rounded-full" style={{ background: "#16a34a" }} />
            {t.available}
          </span>
        </div>

        <h1
          className="text-[44px] font-light leading-[1] tracking-[-1.6px]"
          style={{ color: INK }}
        >
          {firstName}
          {lastName && (
            <>
              <br />
              <strong className="font-bold">{lastName}</strong>
            </>
          )}
        </h1>
        <div className="mt-3 text-[14px]" style={{ color: INK_SOFT }}>
          {cardData.position || cardData.title || "Full-Stack Engineer"}
        </div>
        <div className="mono mt-2 text-[12.5px] font-medium" style={{ color: accent }}>
          @{handle}
        </div>
      </header>

      {/* PROFILE STRIP */}
      <div
        className="flex items-center gap-4 px-8 py-6"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full"
          style={{ background: HAIRLINE_SOFT, border: `2px solid ${HAIRLINE_SOFT}` }}
        >
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt=""
              width={120}
              height={120}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-[14px] font-bold" style={{ color: accent }}>
              {cardData.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div
            className="mono text-[10px] uppercase"
            style={{ color: INK_DIM, letterSpacing: "1.2px" }}
          >
            {t.remote}
          </div>
          <div className="mt-0.5 text-[14px] font-medium" style={{ color: INK }}>
            {cardData.company || cardData.position}
          </div>
        </div>
      </div>

      {/* ABOUT */}
      {cardData.bio && (
        <PureSection num="01" title={t.about}>
          <p className="text-[15px] leading-[1.85]" style={{ color: INK_SOFT }}>
            {cardData.bio}
          </p>
        </PureSection>
      )}

      {/* STACK */}
      <PureSection num="02" title={t.stack}>
        <div className="flex flex-wrap gap-2">
          {STACK.map((s) => (
            <span
              key={s}
              className="mono inline-flex items-center rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors"
              style={{
                background: "#fff",
                border: `1px solid ${HAIRLINE}`,
                color: INK,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </PureSection>

      {/* SERVICES */}
      {services.length > 0 && (
        <PureSection num="03" title={t.services}>
          <div>
            {services.map((s, i) => (
              <div
                key={`${s.title}-${i}`}
                className={`grid grid-cols-[36px_1fr_auto] items-baseline gap-4 py-3.5 ${i < services.length - 1 ? "border-b" : ""}`}
                style={{ borderColor: HAIRLINE_SOFT }}
              >
                <span
                  className="mono text-[11px] font-medium tabular-nums"
                  style={{ color: accent, letterSpacing: "1px" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="text-[14px] font-medium" style={{ color: INK }}>
                    {s.title}
                  </div>
                  {s.description && (
                    <div
                      className="mono mt-1 text-[11.5px]"
                      style={{ color: INK_SOFT }}
                    >
                      {s.description}
                    </div>
                  )}
                </div>
                {s.priceLabel && (
                  <span
                    className="mono whitespace-nowrap text-[11px] font-semibold uppercase tabular-nums"
                    style={{ color: INK, letterSpacing: "1px" }}
                  >
                    {s.priceLabel}
                  </span>
                )}
              </div>
            ))}
          </div>
        </PureSection>
      )}

      {/* STATS 3-up */}
      <div
        className="grid grid-cols-3"
        style={{
          borderTop: `1px solid ${HAIRLINE}`,
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        <PureStat n="7+" l={t.yearsLabel} />
        <PureStat n="60+" l={t.projectsLabel} />
        <PureStat n="< 24h" l={t.responseLabel} last />
      </div>

      {/* CONTACT */}
      <PureSection num="04" title={t.contact}>
        <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={accent} />
      </PureSection>

      {/* CTA */}
      <div
        className="space-y-2.5 px-8 py-9"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        {(cardData.bookingUrl || waDigits) && (
          <a
            href={cardData.bookingUrl || `https://wa.me/${waDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between px-5 py-[18px] text-[13px] font-semibold tracking-[0.4px] transition-opacity hover:opacity-90"
            style={{ background: INK, color: "#fff" }}
          >
            <span>{t.scheduleCall}</span>
            <ArrowRight size={16} />
          </a>
        )}
        {phoneDigits && (
          <a
            href={`tel:${phoneDigits}`}
            className="flex w-full items-center justify-between px-5 py-[18px] text-[13px] font-semibold tracking-[0.4px] transition-colors hover:bg-[#f8fafc]"
            style={{ background: "transparent", color: INK, border: `1px solid ${HAIRLINE}` }}
          >
            <span>{t.callMe}</span>
            <ArrowRight size={16} />
          </a>
        )}
      </div>

      {/* SOCIAL */}
      {cardData.socials && (
        <div
          className="px-8 py-7"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <SocialRow socials={cardData.socials} variant="pill" accentHex={accent} />
        </div>
      )}

      {/* WALLET / SEND / EXCHANGE */}
      {walletSlot && (
        <div
          className="px-8 py-6"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <WalletDock label={t.walletLabel}>
            <div style={{ ["--card-primary" as string]: accent }}>{walletSlot}</div>
          </WalletDock>
        </div>
      )}

      <div
        className="px-8 py-6"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
        <ExchangeSlot slug={slug} primary={accent} locale={locale} />
      </div>

      {/* FOOTER */}
      <footer
        className="mono flex items-center justify-between px-8 py-7 text-[10px] uppercase"
        style={{ color: INK_DIM, letterSpacing: "1.5px" }}
      >
        <span>© {year}</span>
        <span>{handle}</span>
      </footer>
      <div
        className="flex items-center justify-center gap-1.5 px-8 pb-7 text-[10px]"
        style={{ color: INK_DIM }}
      >
        <Shield size={11} strokeWidth={1.6} />
        {t.poweredBy}{" "}
        <a
          href="https://opsolid.de/products/digital-card"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold"
          style={{ color: accent }}
        >
          OpSolid
        </a>
      </div>
    </article>
  );
}

function PureSection({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-8 py-9" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
      <div className="mb-6 flex items-baseline justify-between">
        <span
          className="mono text-[11px] font-medium tabular-nums"
          style={{ color: INK_DIM, letterSpacing: "1px" }}
        >
          {num}
        </span>
        <span
          className="text-[11px] font-semibold uppercase"
          style={{ color: INK, letterSpacing: "2px" }}
        >
          {title}
        </span>
      </div>
      {children}
    </section>
  );
}

function PureStat({
  n,
  l,
  last,
}: {
  n: string;
  l: string;
  last?: boolean;
}) {
  return (
    <div
      className="px-1.5 py-7 text-center"
      style={{ borderRight: last ? "none" : `1px solid ${HAIRLINE_SOFT}` }}
    >
      <div
        className="text-[24px] font-medium tabular-nums tracking-[-0.6px]"
        style={{ color: INK }}
      >
        {n}
      </div>
      <div
        className="mono mt-1.5 text-[9.5px] uppercase"
        style={{ color: INK_DIM, letterSpacing: "1.4px" }}
      >
        {l}
      </div>
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const softwareDevPureEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 35,
  key: "software-dev-pure",
  name: "Software Dev — Pure",
  industry: "Software engineer / developer (editorial pure variant)",
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
  sampleSlug: "demo-software-dev-pure",
};

export const softwareDevPureSample: SampleData = {
  templateId: 35,
  slug: "demo-software-dev-pure",
  cardData: {
    name: "Ozan Çelik",
    position: "Full-Stack Engineer",
    title: "React · Node · AWS",
    company: "Freelance",
    email: "ozan@ozancelik.dev",
    phone: "+49 176 334 5678",
    website: "ozancelik.dev",
    address: "Mitte, Berlin",
    bio: "Full-Stack Engineer with 7+ Jahre Erfahrung. Spezialisiert auf React, Node.js und AWS. Open for remote-friendly projects across Europe.",
    bookingUrl: "https://cal.com/ozancelik/intro",
    sectorKey: "tech",
    services: [
      { title: "Web App Development", description: "Next.js · React · TypeScript", priceLabel: "ab €4.800" },
      { title: "API Integration", description: "REST · GraphQL · Stripe", priceLabel: "ab €1.200" },
      { title: "Tech Consulting", description: "Architecture · code review", priceLabel: "€150/h" },
    ],
    socials: {
      github: "https://github.com/ozancelik",
      linkedin: "https://linkedin.com/in/ozancelik-dev",
      x: "https://x.com/ozancelikdev",
    },
  },
  photoUrl:
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
