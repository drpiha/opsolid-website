"use client";

// =============================================================================
// SoftwareDev — v2 template (id=34, key="software-dev").
//
// Sector: Software / IT engineer / freelance developer — DEFAULT variant.
// Mood: dark GitHub-like terminal, JetBrains Mono labels, subtle grid
// background, green availability badge. Inspired by kart_15_yazilim.html.
//
// Locked design DNA (only colors respond to brand):
//   - Top bar: macOS traffic-light dots + JetBrains-mono path "~/$USER/card.tsx".
//   - Hero: faint grid background; green pill "// available_for_hire";
//     square 84 px avatar with multi-color blur halo; @handle in mono blue;
//     bio with bold-tagged keywords.
//   - Quick actions row (Call · WA · Email).
//   - Stack chips (TS, React, Node, AWS, Postgres, etc.) — wrap.
//   - Services list: 3 cards with hourly rates, mono accents.
//   - GitHub stats strip.
//   - CTA: gradient "Schedule a call" + ghost call button.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  CalendarClock,
  Code2,
  Mail,
  MessageCircle,
  Phone,
  Shield,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#0d1117";
const LOCKED_ACCENT = "#58a6ff";
const PANEL = "#161b22";
const PANEL_2 = "#21262d";
const INK = "#e6edf3";
const INK_SOFT = "#7d8590";
const INK_DIM = "#484f58";
const HAIRLINE = "#30363d";
const HAIRLINE_SOFT = "#21262d";
const GREEN = "#3fb950";
const PURPLE = "#bc8cff";

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

interface SdCopy {
  available: string;
  call: string;
  whatsapp: string;
  email: string;
  scheduleCall: string;
  callMe: string;
  stack: string;
  services: string;
  contact: string;
  social: string;
  saveContact: string;
  walletLabel: string;
  share: string;
  poweredBy: string;
  yearsLabel: string;
  projectsLabel: string;
  starsLabel: string;
  hireMe: string;
  bookHint: string;
}

const COPY: Record<"de" | "en" | "tr", SdCopy> = {
  de: {
    available: "// available for hire",
    call: "Anrufen",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    scheduleCall: "Anruf vereinbaren",
    callMe: "Direkt anrufen",
    stack: "// stack",
    services: "// services",
    contact: "// contact",
    social: "// links",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    share: "Teilen",
    poweredBy: "Powered by",
    yearsLabel: "Jahre",
    projectsLabel: "Projekte",
    starsLabel: "GitHub ★",
    hireMe: "Hire me",
    bookHint: "Erste Sitzung kostenlos",
  },
  en: {
    available: "// available for hire",
    call: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    scheduleCall: "Schedule a call",
    callMe: "Call directly",
    stack: "// stack",
    services: "// services",
    contact: "// contact",
    social: "// links",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    share: "Share",
    poweredBy: "Powered by",
    yearsLabel: "Years",
    projectsLabel: "Projects",
    starsLabel: "GitHub ★",
    hireMe: "Hire me",
    bookHint: "First session free",
  },
  tr: {
    available: "// işe hazır",
    call: "Ara",
    whatsapp: "WhatsApp",
    email: "E-posta",
    scheduleCall: "Görüşme Planla",
    callMe: "Direkt Ara",
    stack: "// stack",
    services: "// hizmetler",
    contact: "// iletişim",
    social: "// bağlantılar",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    share: "Paylaş",
    poweredBy: "Powered by",
    yearsLabel: "Yıl",
    projectsLabel: "Proje",
    starsLabel: "GitHub ★",
    hireMe: "İşe Al",
    bookHint: "İlk görüşme ücretsiz",
  },
};

const STACK = ["TypeScript", "React", "Next.js", "Node", "AWS", "Postgres", "Tailwind"];

export function SoftwareDev({
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

  const photoUrl = resolveAssetUrl(photoPath);
  const initials = getInitials(cardData.name);

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = cardData.services ?? [];

  // Derive a handle from email or website
  const handle =
    cardData.website?.replace(/^https?:\/\//, "").replace(/\/$/, "") ||
    cardData.email?.split("@")[0] ||
    "developer";
  const usernameForPath =
    cardData.email?.split("@")[0] ||
    cardData.name.toLowerCase().split(/\s+/).join("");

  const year = new Date().getFullYear();

  return (
    <article
      data-template="software-dev"
      className="sd-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: primary,
        color: INK,
      }}
    >
      <style jsx global>{`
        .sd-card {
          font-family: var(--tpl-font-body, 'Inter', system-ui, sans-serif);
          line-height: 1.6;
        }
        .sd-card .mono { font-family: var(--tpl-font-display, 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace); }
        .sd-card a { color: inherit; }
      `}</style>

      {/* TOP BAR (terminal traffic-lights) */}
      <div
        className="mono flex items-center gap-2 px-5 py-3 text-[11px]"
        style={{ background: PANEL_2, borderBottom: `1px solid ${HAIRLINE}`, color: INK_SOFT }}
      >
        <span className="block h-3 w-3 rounded-full" style={{ background: "#ff5f57" }} />
        <span className="block h-3 w-3 rounded-full" style={{ background: "#febc2e" }} />
        <span className="block h-3 w-3 rounded-full" style={{ background: "#28c840" }} />
        <span className="ml-3 truncate" style={{ color: INK_DIM }}>
          ~/{usernameForPath}/<span style={{ color: accent }}>card.tsx</span>
        </span>
      </div>

      {/* HERO */}
      <header
        className="relative px-6 py-8"
        style={{
          borderBottom: `1px solid ${HAIRLINE}`,
          background: `radial-gradient(ellipse at top right, ${accent}14, transparent 60%), radial-gradient(ellipse at bottom left, ${GREEN}10, transparent 60%)`,
        }}
      >
        {/* Grid background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Availability pill */}
        <div
          className="mono relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium"
          style={{
            background: `${GREEN}1f`,
            borderColor: `${GREEN}4d`,
            color: GREEN,
            letterSpacing: "0.2px",
          }}
        >
          <span
            className="block h-2 w-2 rounded-full"
            style={{ background: GREEN, boxShadow: `0 0 0 3px ${GREEN}33` }}
          />
          {t.available}
        </div>

        {/* Profile row */}
        <div className="relative mt-6 flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <div
              aria-hidden
              className="absolute -inset-0.5 rounded-[18px] opacity-50"
              style={{
                background: `linear-gradient(135deg, ${accent}, ${PURPLE}, ${GREEN})`,
                filter: "blur(8px)",
              }}
            />
            <div
              className="relative h-[84px] w-[84px] overflow-hidden rounded-2xl"
              style={{ border: `1px solid ${HAIRLINE}` }}
            >
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt=""
                  fill
                  sizes="84px"
                  unoptimized
                  className="object-cover tpl-photo"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-[24px] font-bold"
                  style={{ background: PANEL, color: accent }}
                >
                  {initials}
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div
              className="text-[22px] font-semibold leading-tight"
              style={{ color: "#fff", letterSpacing: "-0.3px" }}
            >
              {cardData.name}
            </div>
            <div className="mono mt-1 text-[12.5px]" style={{ color: accent }}>
              @{handle}
            </div>
            <div className="mt-1.5 text-[13px]" style={{ color: INK_SOFT }}>
              {cardData.position || cardData.title}
            </div>
          </div>
        </div>

        {cardData.bio && (
          <p
            className="relative mt-6 text-[14px] leading-[1.75]"
            style={{ color: INK_SOFT }}
          >
            {cardData.bio}
          </p>
        )}
      </header>

      {/* QUICK ACTIONS */}
      <section
        className="grid grid-cols-3 gap-2 px-6 py-5"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        {phoneDigits && (
          <DevAction href={`tel:${phoneDigits}`} label={t.call} Icon={Phone} accent={accent} />
        )}
        {waDigits && (
          <DevAction
            href={`https://wa.me/${waDigits}`}
            external
            label={t.whatsapp}
            Icon={MessageCircle}
            accent={GREEN}
          />
        )}
        {cardData.email && (
          <DevAction
            href={`mailto:${cardData.email}`}
            label={t.email}
            Icon={Mail}
            accent={PURPLE}
          />
        )}
      </section>

      {/* STACK */}
      <section
        className="px-6 py-7"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <DevSectionTitle accent={accent}>{t.stack}</DevSectionTitle>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {STACK.map((s, i) => (
            <span
              key={s}
              className="mono inline-flex items-center rounded-md px-2.5 py-1 text-[11.5px]"
              style={{
                background: i === 0 ? `${accent}1f` : PANEL,
                border: `1px solid ${i === 0 ? `${accent}40` : HAIRLINE}`,
                color: i === 0 ? accent : INK,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      {services.length > 0 && (
        <section
          className="px-6 py-7"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <DevSectionTitle accent={accent}>{t.services}</DevSectionTitle>
          <div className="mt-4 space-y-2">
            {services.slice(0, 5).map((svc, i) => (
              <div
                key={`${svc.title}-${i}`}
                className="rounded-lg p-4 transition-colors hover:bg-[#1c2128]"
                style={{
                  background: PANEL,
                  border: `1px solid ${HAIRLINE_SOFT}`,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-semibold" style={{ color: "#fff" }}>
                      {svc.title}
                    </div>
                    {svc.description && (
                      <div className="mt-1 text-[11.5px]" style={{ color: INK_SOFT }}>
                        {svc.description}
                      </div>
                    )}
                  </div>
                  {svc.priceLabel && (
                    <span
                      className="mono whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-semibold"
                      style={{
                        background: `${accent}1a`,
                        color: accent,
                        border: `1px solid ${accent}33`,
                      }}
                    >
                      {svc.priceLabel}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* GITHUB STATS STRIP */}
      <section
        className="px-6 py-7"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="grid grid-cols-3 overflow-hidden rounded-lg"
          style={{ background: PANEL, border: `1px solid ${HAIRLINE_SOFT}` }}
        >
          {[
            { n: "7+", l: t.yearsLabel },
            { n: "60+", l: t.projectsLabel },
            { n: "1.2K", l: t.starsLabel },
          ].map((stat, i) => (
            <div
              key={stat.l}
              className="px-3 py-5 text-center"
              style={{ borderRight: i < 2 ? `1px solid ${HAIRLINE_SOFT}` : "none" }}
            >
              <div
                className="mono text-[22px] font-semibold leading-none"
                style={{ color: accent }}
              >
                {stat.n}
              </div>
              <div
                className="mono mt-1.5 text-[10px] uppercase"
                style={{ color: INK_SOFT, letterSpacing: "1.5px" }}
              >
                {stat.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="space-y-2.5 px-6 py-7"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        {(cardData.bookingUrl || waDigits) && (
          <a
            href={cardData.bookingUrl || `https://wa.me/${waDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2.5 rounded-lg px-5 py-[16px] text-[14px] font-semibold transition-all hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${accent} 0%, ${PURPLE} 100%)`,
              color: "#fff",
              boxShadow: `0 8px 24px -10px ${accent}80`,
            }}
          >
            <CalendarClock size={17} strokeWidth={2.2} />
            {t.scheduleCall}
            <ArrowUpRight size={15} strokeWidth={2.4} />
          </a>
        )}
        <p
          className="mono text-center text-[10.5px]"
          style={{ color: INK_DIM, letterSpacing: "0.5px" }}
        >
          {t.bookHint}
        </p>
      </section>

      {/* CONTACT */}
      <section
        className="px-6 py-7"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <DevSectionTitle accent={accent}>{t.contact}</DevSectionTitle>
        <div className="mt-4">
          <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={accent} />
        </div>
      </section>

      {/* SOCIAL */}
      {cardData.socials && (
        <section
          className="px-6 py-7"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <DevSectionTitle accent={accent}>{t.social}</DevSectionTitle>
          <div className="mt-4">
            <SocialRow socials={cardData.socials} variant="pill" accentHex={accent} />
          </div>
        </section>
      )}

      {/* WALLET / SEND / EXCHANGE */}
      {walletSlot && (
        <div
          className="px-6 py-6"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}
        >
          <WalletDock label={t.walletLabel}>
            <div style={{ ["--card-primary" as string]: accent }}>{walletSlot}</div>
          </WalletDock>
        </div>
      )}

      <div
        className="px-6 py-6"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={accent} locale={locale} />
        <ExchangeSlot slug={slug} primary={accent} locale={locale} />
      </div>

      {/* FOOTER */}
      <footer className="mono px-6 py-6 text-center text-[10.5px]" style={{ color: INK_DIM }}>
        <div className="inline-flex items-center gap-2">
          <Code2 size={11} />
          <span>{`// © ${year} ${cardData.name}`}</span>
        </div>
        <div className="mt-2 inline-flex items-center gap-1.5">
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
      </footer>
    </article>
  );
}

function DevSectionTitle({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: string;
}) {
  void accent;
  return (
    <h2
      className="mono text-[12px] font-medium"
      style={{ color: INK_SOFT, letterSpacing: "0.5px" }}
    >
      {children}
    </h2>
  );
}

function DevAction({
  href,
  label,
  Icon,
  accent,
  external,
}: {
  href: string;
  label: string;
  Icon: typeof Phone;
  accent: string;
  external?: boolean;
}) {
  void readableTextOn;
  const ext = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-[12px] font-medium transition-colors hover:bg-[#1c2128]"
      style={{
        background: PANEL,
        border: `1px solid ${HAIRLINE}`,
        color: INK,
      }}
    >
      <Icon size={14} strokeWidth={2} style={{ color: accent }} />
      {label}
    </a>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const softwareDevEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 34,
  key: "software-dev",
  name: "Software Dev",
  industry: "Software engineer / developer / IT freelance",
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
  sampleSlug: "demo-software-dev",
};

// photo: Unsplash, freelance developer at desk. Unsplash License — free, no attribution required.
export const softwareDevSample: SampleData = {
  templateId: 34,
  slug: "demo-software-dev",
  cardData: {
    name: "Ozan Çelik",
    position: "Full-Stack Engineer · React · Node · AWS",
    title: "Freelance Developer",
    company: "Freelance / Self",
    email: "ozan@ozancelik.dev",
    phone: "+49 176 334 5678",
    website: "https://ozancelik.dev",
    address: "Mitte, Berlin",
    bio: "Full-Stack Engineer. React, Node.js, AWS. 7+ Jahre Erfahrung. Open for remote-friendly projects.",
    bookingUrl: "https://cal.com/ozancelik/intro",
    sectorKey: "tech",
    services: [
      { title: "Web App Development", description: "Next.js · React · TypeScript", priceLabel: "ab €4.800" },
      { title: "API Integration", description: "REST · GraphQL · Stripe · Webhooks", priceLabel: "ab €1.200" },
      { title: "Tech Consulting", description: "Architecture · code review · DevOps", priceLabel: "€150/h" },
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
