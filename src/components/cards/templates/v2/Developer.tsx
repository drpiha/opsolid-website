"use client";

// =============================================================================
// Developer — software engineer / open-source maintainer (id=17, key="developer").
//
// Design DNA: terminal/IDE inspired. Pure-black canvas, monospace everywhere
// (JetBrains Mono), prompt-style "$ contact —" labels, code-comment "//" bios,
// brand-tinted accent strip across the top, pseudo "// run command" CTA.
// GitHub is the prominent social. No hero photo by design — the developer
// aesthetic is identity-by-handle, not identity-by-portrait.
//
// Locked design choices (do not parameterise beyond brand colors):
//   - Black canvas (`#08080a`), all text monospace.
//   - 4 px brand-color top strip + tiny "window-controls" row (faux red/yellow/
//     green dots that retint to brand on hover) for terminal-window framing.
//   - Logo (if any) sits in a square pill in the header.
//   - Section labels formatted as "$ <label> —" prompts.
//   - Bio rendered as a `// multi-line comment` block.
//   - CTA reads "// run command" → "npm run hire" or similar.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Calendar,
  ChevronRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Terminal,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

import { encodeSource, describeSource } from "@/components/cards/smart/SmartCardSource";
import { getSectorPreset } from "@/config/card-sectors";
import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { TemplateProps, TemplateRegistryEntry, SampleData } from "./types";

// -----------------------------------------------------------------------------
// Default palette — terminal green + cyan. Override-able via props.
// -----------------------------------------------------------------------------
const DEFAULT_PRIMARY = "#10b981"; // terminal green
const DEFAULT_ACCENT = "#0ea5e9"; // cyan
const SURFACE_TERMINAL = "#08080a"; // near-black
const SURFACE_PANEL = "#101014"; // raised panel
const SURFACE_PANEL_2 = "#16161c"; // deeper panel
const INK_HIGH = "#e6edf3";
const INK_MID = "rgba(230,237,243,0.72)";
const INK_LOW = "rgba(230,237,243,0.50)";
const INK_FAINT = "rgba(230,237,243,0.32)";
const COMMENT = "rgba(230,237,243,0.42)"; // editor-style comment grey

// -----------------------------------------------------------------------------
// Contrast helper — return a readable text colour for any hex background.
// -----------------------------------------------------------------------------
function readableTextOn(hex: string | null | undefined): string {
  if (!hex) return "#1a1a1a";
  const h = hex.replace("#", "");
  const r = parseInt(h.substr(0, 2), 16);
  const g = parseInt(h.substr(2, 2), 16);
  const b = parseInt(h.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#1a1a1a" : "#ffffff";
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

interface DvCopy {
  saveContact: string;
  callNow: string;
  whatsapp: string;
  email: string;
  book: string;
  about: string;
  contact: string;
  workTitle: string;
  social: string;
  walletLabel: string;
  runCmd: string;
  cmdLabel: string;
  cmdHint: string;
  status: string;
  uptime: string;
  impressum: string;
  privacy: string;
  poweredBy: string;
  shellPrompt: string;
  available: string;
}

const COPY: Record<"de" | "en" | "tr", DvCopy> = {
  de: {
    saveContact: "Kontakt sichern",
    callNow: "Anrufen",
    whatsapp: "WhatsApp",
    email: "Mail",
    book: "Termin",
    about: "über",
    contact: "kontakt",
    workTitle: "projekte",
    social: "social",
    walletLabel: "Auf Smartphone speichern",
    runCmd: "npm run hire",
    cmdLabel: "Lass uns reden",
    cmdHint: "Antwort meist innerhalb von 24 Stunden",
    status: "status",
    uptime: "verfügbar",
    impressum: "impressum",
    privacy: "datenschutz",
    poweredBy: "powered by",
    shellPrompt: "~",
    available: "available",
  },
  en: {
    saveContact: "Save contact",
    callNow: "Call",
    whatsapp: "WhatsApp",
    email: "Mail",
    book: "Book",
    about: "about",
    contact: "contact",
    workTitle: "work",
    social: "social",
    walletLabel: "Add to wallet",
    runCmd: "npm run hire",
    cmdLabel: "Let's talk",
    cmdHint: "Replies usually within 24 hours",
    status: "status",
    uptime: "available",
    impressum: "imprint",
    privacy: "privacy",
    poweredBy: "powered by",
    shellPrompt: "~",
    available: "available",
  },
  tr: {
    saveContact: "Rehbere kaydet",
    callNow: "Ara",
    whatsapp: "WhatsApp",
    email: "Mail",
    book: "Randevu",
    about: "hakkında",
    contact: "iletişim",
    workTitle: "çalışmalar",
    social: "social",
    walletLabel: "Cüzdana ekle",
    runCmd: "npm run hire",
    cmdLabel: "Konuşalım",
    cmdHint: "Yanıt genellikle 24 saat içinde",
    status: "status",
    uptime: "müsait",
    impressum: "künye",
    privacy: "gizlilik",
    poweredBy: "powered by",
    shellPrompt: "~",
    available: "available",
  },
};

export function Developer({
  slug,
  cardData,
  locale = "de",
  logoPath,
  brandPrimaryHex,
  brandAccentHex,
  source,
  siteUrl,
  walletSlot,
}: TemplateProps) {
  // Developer is photo-less by design — `photoPath` intentionally not consumed.
  const t = COPY[locale] ?? COPY.de;

  const sector = getSectorPreset(cardData.sectorKey);
  const primary = brandPrimaryHex || DEFAULT_PRIMARY;
  const accent = brandAccentHex || DEFAULT_ACCENT;

  const logoUrl = resolveAssetUrl(logoPath);

  const projects =
    cardData.services && cardData.services.length > 0
      ? cardData.services
      : sector?.services;

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  // Derive a dev-style handle: company → lowercase, no spaces; or split name.
  const handle = (() => {
    const source = cardData.company || cardData.name;
    return source.toLowerCase().replace(/[^a-z0-9-]/g, "");
  })();
  const hostname = (() => {
    if (!cardData.address) return "earth";
    const parts = cardData.address.split(",").map((p) => p.trim()).filter(Boolean);
    const city = parts.length >= 2 ? parts[parts.length - 2] : parts[0] ?? "earth";
    return city.toLowerCase().replace(/[^a-z0-9-]/g, "");
  })();

  return (
    <article
      data-template="developer"
      className={`dv-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[20px] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.85),0_8px_20px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/8`}
      style={
        {
          ["--dv-primary" as string]: primary,
          ["--dv-accent" as string]: accent,
          ["--dv-primary-soft" as string]: `${primary}1F`,
          ["--dv-accent-soft" as string]: `${accent}1F`,
          ["--card-primary" as string]: primary,
          ["--card-accent" as string]: accent,
          ["--font-dev-mono" as string]: "'JetBrains Mono', 'Courier New', monospace",
          background: SURFACE_TERMINAL,
          color: INK_HIGH,
          fontFamily: "var(--font-dev-mono), ui-monospace, monospace",
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .dv-card {
          font-family: var(--font-dev-mono), "JetBrains Mono", ui-monospace, monospace;
          line-height: 1.6;
          font-feature-settings: "tnum", "ss01", "cv01";
        }
        .dv-card .dv-prompt {
          color: var(--dv-primary);
          user-select: none;
        }
        .dv-card .dv-comment {
          color: ${COMMENT};
          font-style: italic;
        }
        @keyframes dv-caret {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
        .dv-card .dv-caret {
          display: inline-block;
          width: 0.55em;
          height: 1em;
          vertical-align: text-bottom;
          background: currentColor;
          animation: dv-caret 1.05s steps(1) infinite;
        }
        @keyframes dv-status {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        .dv-card .dv-status-dot {
          animation: dv-status 2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .dv-card .dv-caret,
          .dv-card .dv-status-dot { animation: none; }
        }
      `}</style>

      {/* Brand-color accent strip (4px) */}
      <div
        aria-hidden
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${primary} 0%, ${accent} 100%)`,
        }}
      />

      <TerminalChrome
        handle={handle}
        hostname={hostname}
        primary={primary}
        accent={accent}
        sectorBadge={sector?.name}
        sourceLabel={sourceLabel}
      />

      <Identity
        logoUrl={logoUrl}
        company={cardData.company}
        name={cardData.name}
        title={cardData.position || cardData.title}
        handle={handle}
        hostname={hostname}
        primary={primary}
        accent={accent}
        translations={t}
      />

      {cardData.bio && (
        <CommentBlock bio={cardData.bio} primary={primary} accent={accent} translations={t} />
      )}

      <QuickActionStrip
        slug={slug}
        sourceQs={sourceQs}
        phoneDigits={phoneDigits}
        waDigits={waDigits}
        email={cardData.email}
        bookingUrl={cardData.bookingUrl}
        primary={primary}
        accent={accent}
        translations={t}
      />

      {projects && projects.length > 0 && (
        <ProjectList
          items={projects}
          primary={primary}
          accent={accent}
          title={t.workTitle}
        />
      )}

      <RunCommandCTA
        bookingUrl={cardData.bookingUrl}
        email={cardData.email}
        primary={primary}
        accent={accent}
        translations={t}
      />

      <Section title={t.contact} primary={primary}>
        <ContactRows
          cardData={cardData}
          locale={locale}
          variant="hairline"
          tone="dark"
          accentHex={accent}
          rowClassName="hover:text-[var(--dv-accent)]"
        />
      </Section>

      <CTASection
        slug={slug}
        sourceQs={sourceQs}
        locale={locale}
        primary={primary}
        accent={accent}
      />

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="border-t border-white/8 px-6 py-5"
          labelClassName="mb-3 text-[10.5px] font-medium"
        >
          {walletSlot}
        </WalletDock>
      )}

      {cardData.socials && (
        <Section title={t.social} primary={primary}>
          <SocialRow
            socials={cardData.socials}
            variant="pill"
            accentHex={accent}
            itemClassName="!border-white/12 !bg-white/[0.04] !text-white/82 hover:!border-[var(--dv-primary)] hover:!text-[var(--dv-primary)] hover:!bg-white/[0.06]"
          />
        </Section>
      )}

      <Footer
        siteUrl={siteUrl}
        slug={slug}
        impressumUrl={cardData.impressumUrl}
        privacyUrl={cardData.privacyUrl}
        primary={primary}
        accent={accent}
        translations={t}
      />
    </article>
  );
}

// =============================================================================
// TerminalChrome — fake window controls + tab strip with handle@hostname.
// =============================================================================

function TerminalChrome({
  handle,
  hostname,
  primary,
  accent,
  sectorBadge,
  sourceLabel,
}: {
  handle: string;
  hostname: string;
  primary: string;
  accent: string;
  sectorBadge?: string;
  sourceLabel?: string;
}) {
  return (
    <div
      className="flex items-center gap-3 border-b px-4 py-2.5"
      style={{
        background: SURFACE_PANEL_2,
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      {/* "Window controls" — three dots, one tinted brand. */}
      <div className="flex items-center gap-1.5" aria-hidden>
        <span className="block h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
        <span className="block h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
        <span
          className="block h-2.5 w-2.5 rounded-full"
          style={{ background: primary, boxShadow: `0 0 6px ${primary}` }}
        />
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Terminal size={11} strokeWidth={1.8} style={{ color: accent }} aria-hidden />
        <span className="truncate text-[10.5px] font-medium" style={{ color: INK_LOW }}>
          {handle}@{hostname}: ~
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {sectorBadge && (
          <span
            className="hidden rounded border px-1.5 py-0.5 text-[8.5px] font-medium sm:inline-block"
            style={{
              borderColor: `${accent}40`,
              color: accent,
              background: `${accent}14`,
            }}
          >
            {sectorBadge}
          </span>
        )}
        {sourceLabel && (
          <span
            className="hidden rounded border px-1.5 py-0.5 text-[8.5px] font-medium sm:inline-block"
            style={{
              borderColor: "rgba(255,255,255,0.10)",
              color: INK_FAINT,
            }}
          >
            {sourceLabel}
          </span>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Identity — name, role, handle line. Logo (if any) in a small monogram square.
// =============================================================================

function Identity({
  logoUrl,
  company,
  name,
  title,
  handle,
  hostname,
  primary,
  accent,
  translations,
}: {
  logoUrl: string | null;
  company?: string;
  name: string;
  title?: string;
  handle: string;
  hostname: string;
  primary: string;
  accent: string;
  translations: DvCopy;
}) {
  return (
    <header className="px-6 pb-6 pt-7">
      {/* Faux shell line. */}
      <div className="mb-5 flex items-center gap-2 text-[11px]">
        <span className="dv-prompt font-semibold" style={{ color: primary }}>
          $
        </span>
        <span style={{ color: INK_LOW }}>whoami</span>
      </div>

      <div className="flex items-start gap-4">
        {logoUrl ? (
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border"
            style={{
              background: SURFACE_PANEL,
              borderColor: `${primary}40`,
            }}
          >
            <Image
              src={logoUrl}
              alt={company ? `${company} logo` : "Logo"}
              width={96}
              height={96}
              unoptimized
              className="h-9 w-9 object-contain tpl-logo"
            />
          </div>
        ) : (
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border text-[14px] font-bold"
            style={{
              background: SURFACE_PANEL,
              borderColor: `${primary}40`,
              color: primary,
            }}
            aria-hidden
          >
            {">_"}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1
            className="text-[1.6rem] font-bold leading-tight tracking-tight"
            style={{ color: INK_HIGH }}
          >
            {name}
          </h1>
          {title && (
            <p
              className="mt-1 text-[12px] font-medium"
              style={{ color: INK_MID }}
            >
              {title}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px]">
        <span style={{ color: COMMENT }}>{"// handle"}</span>
        <span className="font-semibold" style={{ color: accent }}>
          @{handle}
        </span>
        <span style={{ color: INK_FAINT }}>·</span>
        <span style={{ color: COMMENT }}>{"// host"}</span>
        <span className="font-medium" style={{ color: INK_MID }}>
          {hostname}
        </span>
      </div>

      {/* Status row — green dot + "available". */}
      <div className="mt-3 flex items-center gap-2 text-[10.5px]">
        <span
          aria-hidden
          className="dv-status-dot block h-2 w-2 rounded-full"
          style={{ background: primary, boxShadow: `0 0 8px ${primary}` }}
        />
        <span style={{ color: COMMENT }}>{`// ${translations.status}:`}</span>
        <span className="font-semibold" style={{ color: primary }}>
          {translations.available}
        </span>
        <span className="dv-caret" style={{ color: primary }} aria-hidden />
      </div>
    </header>
  );
}

// =============================================================================
// CommentBlock — bio rendered as an editor-style multi-line comment.
// =============================================================================

function CommentBlock({
  bio,
  primary,
  accent,
  translations,
}: {
  bio: string;
  primary: string;
  accent: string;
  translations: DvCopy;
}) {
  return (
    <section className="px-6 pb-2 pt-2">
      <div
        className="relative rounded-md border px-4 py-4"
        style={{
          background: SURFACE_PANEL,
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        {/* Left brand-color rule. */}
        <span
          aria-hidden
          className="absolute inset-y-2 left-0 w-[2px] rounded-r"
          style={{ background: `linear-gradient(180deg, ${primary}, ${accent})` }}
        />
        <div className="flex items-center gap-2 text-[10.5px]">
          <span className="dv-prompt font-semibold" style={{ color: primary }}>
            $
          </span>
          <span style={{ color: INK_LOW }}>cat</span>
          <span style={{ color: accent }}>{translations.about}.md</span>
        </div>
        <p
          className="mt-3 text-[12.5px] leading-[1.85]"
          style={{ color: INK_MID }}
        >
          <span style={{ color: COMMENT }}>{"/**\n"}</span>
          <span className="dv-comment block whitespace-pre-wrap" style={{ color: INK_MID }}>
            {bio.split("\n").map((line, i) => (
              <span key={i} className="block">
                <span style={{ color: COMMENT }}>{" * "}</span>
                {line}
              </span>
            ))}
          </span>
          <span style={{ color: COMMENT }}>{" */"}</span>
        </p>
      </div>
    </section>
  );
}

// =============================================================================
// Quick action pills — terminal-button style.
// =============================================================================

function QuickActionStrip({
  slug,
  sourceQs,
  phoneDigits,
  waDigits,
  email,
  bookingUrl,
  primary,
  accent,
  translations,
}: {
  slug: string;
  sourceQs: string;
  phoneDigits: string;
  waDigits: string;
  email?: string;
  bookingUrl?: string;
  primary: string;
  accent: string;
  translations: DvCopy;
}) {
  type Pill = {
    label: string;
    href: string;
    Icon: LucideIcon;
    tone: "primary" | "accent" | "neutral";
    download?: boolean;
    external?: boolean;
  };

  const pills: Pill[] = [
    {
      label: translations.saveContact,
      href: `/api/cards/${encodeURIComponent(slug)}/vcard${sourceQs}`,
      Icon: UserPlus,
      tone: "primary",
      download: true,
    },
  ];
  if (phoneDigits) {
    pills.push({
      label: translations.callNow,
      href: `tel:${phoneDigits}`,
      Icon: Phone,
      tone: "neutral",
    });
  }
  if (waDigits) {
    pills.push({
      label: translations.whatsapp,
      href: `https://wa.me/${waDigits}`,
      Icon: MessageCircle,
      tone: "neutral",
      external: true,
    });
  }
  if (email) {
    pills.push({
      label: translations.email,
      href: `mailto:${email}`,
      Icon: Mail,
      tone: "neutral",
    });
  }
  if (bookingUrl) {
    pills.push({
      label: translations.book,
      href: bookingUrl,
      Icon: Calendar,
      tone: "accent",
      external: true,
    });
  }

  return (
    <div className="grid grid-cols-2 gap-2 px-6 pb-3 pt-6 sm:grid-cols-3">
      {pills.map((p, i) => {
        const isPrimary = p.tone === "primary";
        const isAccent = p.tone === "accent";
        const ext = p.external
          ? { target: "_blank", rel: "noopener noreferrer" as const }
          : {};
        let bg = "rgba(255,255,255,0.04)";
        let border = "rgba(255,255,255,0.10)";
        let color = INK_HIGH;
        let shadow = "none";
        if (isPrimary) {
          bg = primary;
          border = primary;
          color = readableTextOn(primary);
          shadow = `0 6px 16px -10px ${primary}`;
        } else if (isAccent) {
          bg = "transparent";
          border = accent;
          color = accent;
        }
        return (
          <a
            key={`${p.label}-${i}`}
            href={p.href}
            download={p.download}
            {...ext}
            className="group relative flex items-center justify-center gap-2 rounded-md border px-3 py-3 text-[10.5px] font-semibold transition-all hover:-translate-y-px"
            style={{
              background: bg,
              borderColor: border,
              color: color,
              boxShadow: shadow,
            }}
          >
            <p.Icon size={12} strokeWidth={2} />
            <span className="leading-none">{p.label}</span>
          </a>
        );
      })}
    </div>
  );
}

// =============================================================================
// Section frame — "$ <title> —" prompt-style label.
// =============================================================================

function Section({
  title,
  primary,
  children,
}: {
  title: string;
  primary: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative px-6 py-7">
      <div className="mb-5 flex items-center gap-2 text-[11px]">
        <span className="font-semibold" style={{ color: primary }}>
          $
        </span>
        <h2 className="font-semibold" style={{ color: INK_HIGH }}>
          {title}
        </h2>
        <span className="ml-1" style={{ color: COMMENT }}>
          —
        </span>
        <span
          aria-hidden
          className="ml-1 block h-px flex-1"
          style={{
            background: `linear-gradient(90deg, ${primary}55 0%, transparent 100%)`,
          }}
        />
      </div>
      {children}
    </section>
  );
}

// =============================================================================
// ProjectList — services as repo-style entries.
// =============================================================================

function ProjectList({
  items,
  primary,
  accent,
  title,
}: {
  items: Array<{ title: string; description?: string; priceLabel?: string }>;
  primary: string;
  accent: string;
  title: string;
}) {
  return (
    <Section title={title} primary={primary}>
      <ul className="space-y-2">
        {items.slice(0, 5).map((item, i) => (
          <li
            key={`${item.title}-${i}`}
            className="group relative flex items-stretch gap-3 rounded-md border px-3.5 py-3 transition-all hover:-translate-y-px"
            style={{
              background: SURFACE_PANEL,
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <span
              className="flex shrink-0 items-start pt-0.5 text-[11px]"
              style={{ color: accent }}
              aria-hidden
            >
              <ChevronRight size={13} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[13px] font-semibold leading-tight" style={{ color: INK_HIGH }}>
                {item.title}
              </h3>
              {item.description && (
                <p
                  className="mt-1.5 line-clamp-2 text-[11.5px] leading-snug"
                  style={{ color: INK_MID }}
                >
                  <span style={{ color: COMMENT }}>{"// "}</span>
                  {item.description}
                </p>
              )}
              {item.priceLabel && (
                <span
                  className="mt-2 inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[9px] font-semibold"
                  style={{
                    borderColor: `${primary}55`,
                    color: primary,
                    background: `${primary}14`,
                  }}
                >
                  {item.priceLabel}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

// =============================================================================
// RunCommandCTA — pseudo-terminal command line that doubles as the booking CTA.
// =============================================================================

function RunCommandCTA({
  bookingUrl,
  email,
  primary,
  accent,
  translations,
}: {
  bookingUrl?: string;
  email?: string;
  primary: string;
  accent: string;
  translations: DvCopy;
}) {
  const href = bookingUrl ?? (email ? `mailto:${email}` : null);
  if (!href) return null;
  const external = bookingUrl ? true : false;
  const onPrimary = readableTextOn(primary);

  return (
    <section className="px-6 py-6">
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="group relative block overflow-hidden rounded-lg border transition-all hover:-translate-y-px"
        style={{
          background: SURFACE_PANEL,
          borderColor: `${primary}55`,
          boxShadow: `0 18px 40px -22px ${primary}, 0 0 0 1px ${primary}1A inset`,
        }}
      >
        {/* Top "tab" strip with brand strip. */}
        <div
          className="flex items-center justify-between px-4 py-2 text-[9.5px] font-semibold"
          style={{
            background: SURFACE_PANEL_2,
            borderBottom: `1px solid ${primary}33`,
            color: COMMENT,
          }}
        >
          <span style={{ color: COMMENT }}>{"// run command"}</span>
          <span style={{ color: accent }}>{translations.cmdHint}</span>
        </div>

        <div className="flex items-center gap-3 px-5 py-5">
          <span className="text-[14px] font-bold" style={{ color: primary }}>
            $
          </span>
          <div className="min-w-0 flex-1">
            <span
              className="block text-[15px] font-bold leading-tight"
              style={{ color: INK_HIGH }}
            >
              {translations.runCmd}
              <span className="dv-caret ml-0.5" style={{ color: primary }} aria-hidden />
            </span>
            <span className="mt-1 block text-[11px] font-medium" style={{ color: INK_MID }}>
              {translations.cmdLabel}
            </span>
          </div>
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-transform group-hover:translate-x-0.5"
            style={{ background: primary, color: onPrimary }}
            aria-hidden
          >
            <ArrowUpRight size={16} strokeWidth={2} />
          </span>
        </div>
      </a>
    </section>
  );
}

// =============================================================================
// CTA section — Wallet/Exchange/SendMyInfo wrappers.
// =============================================================================

function CTASection({
  slug,
  sourceQs,
  locale,
  primary,
  accent,
}: {
  slug: string;
  sourceQs: string;
  locale: "de" | "en" | "tr";
  primary: string;
  accent: string;
}) {
  return (
    <section className="px-6 py-2">
      <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={accent} />
      <ExchangeSlot slug={slug} primary={primary} locale={locale} />
    </section>
  );
}

// =============================================================================
// Footer — terminal status bar style.
// =============================================================================

function Footer({
  siteUrl,
  slug,
  impressumUrl,
  privacyUrl,
  primary,
  accent,
  translations,
}: {
  siteUrl: string;
  slug: string;
  impressumUrl?: string;
  privacyUrl?: string;
  primary: string;
  accent: string;
  translations: DvCopy;
}) {
  return (
    <footer
      className="relative px-6 pb-7 pt-7"
      style={{
        background: "#050507",
        color: INK_LOW,
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10.5px]">
        <FooterShare siteUrl={siteUrl} slug={slug} />
        {impressumUrl && (
          <a
            href={impressumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            {translations.impressum}
          </a>
        )}
        {privacyUrl && (
          <a
            href={privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            {translations.privacy}
          </a>
        )}
        <span className="ml-auto inline-flex items-center gap-1.5">
          <Shield size={11} strokeWidth={1.8} />
          <span style={{ color: COMMENT }}>{translations.poweredBy}</span>
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold transition-colors hover:text-white"
            style={{ color: primary }}
          >
            OpSolid
          </a>
        </span>
      </div>

      <div
        className="mt-4 flex items-center justify-between gap-2 border-t pt-4 text-[9.5px]"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <span className="inline-flex items-center gap-1.5" style={{ color: INK_FAINT }}>
          <MapPin size={10} strokeWidth={1.6} style={{ color: accent }} />
          {`opsolid.de/c/${slug}`}
        </span>
        <span className="inline-flex items-center gap-1.5" style={{ color: INK_FAINT }}>
          <span
            aria-hidden
            className="dv-status-dot block h-1.5 w-1.5 rounded-full"
            style={{ background: primary }}
          />
          {translations.uptime}
        </span>
      </div>
    </footer>
  );
}

function FooterShare({ siteUrl, slug }: { siteUrl: string; slug: string }) {
  const url = `${siteUrl}/c/${slug}`;
  return (
    <button
      type="button"
      onClick={async () => {
        if (typeof navigator !== "undefined" && "share" in navigator) {
          try {
            await navigator.share({ url, title: "Smart Card" });
            return;
          } catch {
            // User cancelled.
          }
        }
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        }
      }}
      className="hover:text-white"
    >
      Share
    </button>
  );
}

// =============================================================================
// Registry entry + sample data.
// =============================================================================

export const developerEntry: TemplateRegistryEntry = {
  id: 17,
  key: "developer",
  name: "Developer",
  industry: "Software engineer / open-source maintainer",
  Component: Developer,
  supports: {
    services: true,
    faqs: false,
    testimonials: false,
    gallery: false,
    video: false,
    brochure: false,
    socials: true,
    themeSwitch: false,
    photo: false,
    logo: true,
  },
  defaults: {
    brandPrimaryHex: DEFAULT_PRIMARY,
    brandAccentHex: DEFAULT_ACCENT,
  },
  sampleSlug: "sample-developer",
};

export const developerSample: SampleData = {
  templateId: 17,
  slug: "sample-developer",
  brandPrimaryHex: DEFAULT_PRIMARY,
  brandAccentHex: DEFAULT_ACCENT,
  cardData: {
    name: "Kai Ström",
    title: "Staff engineer · Distributed systems",
    position: "Staff engineer · Distributed systems",
    company: "kaistrom.dev",
    email: "kai@kaistrom.dev",
    phone: "+46 70 552 4109",
    whatsapp: "+46 70 552 4109",
    website: "https://kaistrom.dev",
    address: "Götgatan 33, 116 21 Stockholm, Sweden",
    bio: "Independent contractor. I write infrastructure code in Go and Rust for teams whose backend is the product. Twelve years across Spotify, Stripe and a handful of seed-stage startups. Currently maintaining `litequeue` (1.8k stars) and `tenant-iso`. Open to small, deep retainers — typically 1-2 days a week, 3-month minimum.",
    bookingUrl: "https://cal.com/kaistrom/intro",
    sectorKey: "consultant",
    services: [
      {
        title: "litequeue",
        description:
          "Embedded persistent job queue for SQLite, written in Go. Drop-in for ops jobs that don't justify Redis. Used in production by 40+ teams.",
        priceLabel: "v0.9.2 · 1.8k ★",
      },
      {
        title: "tenant-iso",
        description:
          "Postgres row-level multi-tenancy enforcement library. Compile-time guarantees against cross-tenant leaks. Battle-tested at scale.",
        priceLabel: "v1.4.0 · 920 ★",
      },
      {
        title: "Backend retainer",
        description:
          "1-2 days/week embedded with your team. Code reviews, architecture sessions, on-call hand-holding for tricky production incidents.",
        priceLabel: "from €4,800/mo",
      },
      {
        title: "Migration sprints",
        description:
          "Two-week focused engagements. Postgres tuning, RDBMS → distributed migrations, observability stack rebuilds.",
        priceLabel: "fixed-fee · 2wk",
      },
    ],
    socials: {
      github: "https://github.com/kaistrom",
      linkedin: "https://linkedin.com/in/kaistrom",
      x: "https://x.com/kaistrom",
    },
    impressumUrl: "https://kaistrom.dev/imprint",
    privacyUrl: "https://kaistrom.dev/privacy",
  },
};
