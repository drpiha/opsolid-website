// =============================================================================
// ContactRows — phone / WhatsApp / email / website / address row primitives.
//
// Each v2 template wants the same five contact channels but renders them
// differently — RealEstate uses gold-bordered tiles on a navy strip, Clinic
// wants a centred grid with teal icons, Atelier wants ultra-minimal hairline
// rows. Rather than 12 templates each re-implementing the data → row mapping,
// this module exposes:
//
//   - `useContactRowsModel(cardData)` — pure data: rows + channel keys
//   - `<ContactRows />` — opinionated default render with three variants
//
// Templates that need exotic layouts (drop-cap address, map preview, etc.)
// can consume only the model and render their own JSX.
// =============================================================================

"use client";

import * as React from "react";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import type { CardData } from "@/lib/validation";

export type ContactChannel =
  | "phone"
  | "whatsapp"
  | "email"
  | "website"
  | "address";

export interface ContactRow {
  channel: ContactChannel;
  Icon: LucideIcon;
  label: string;
  value: string;
  href: string;
  /** True when href starts with http(s) — open in a new tab. */
  external: boolean;
}

function digitsOnly(phone: string): string {
  return phone.replace(/[^+0-9]/g, "");
}

function getWhatsAppNumber(value: string): string {
  return digitsOnly(value).replace(/^\+/, "");
}

const LABELS: Record<ContactChannel, Record<"de" | "en" | "tr", string>> = {
  phone: { de: "Telefon", en: "Phone", tr: "Telefon" },
  whatsapp: { de: "WhatsApp", en: "WhatsApp", tr: "WhatsApp" },
  email: { de: "E-Mail", en: "Email", tr: "E-posta" },
  website: { de: "Website", en: "Website", tr: "Web sitesi" },
  address: { de: "Adresse", en: "Address", tr: "Adres" },
};

/** Build the canonical row list for a card. Pure data; no JSX. */
export function buildContactRows(
  cardData: CardData,
  locale: "de" | "en" | "tr" = "de",
): ContactRow[] {
  const rows: ContactRow[] = [];
  if (cardData.phone) {
    rows.push({
      channel: "phone",
      Icon: Phone,
      label: LABELS.phone[locale],
      value: cardData.phone,
      href: `tel:${digitsOnly(cardData.phone)}`,
      external: false,
    });
  }
  if (cardData.whatsapp) {
    rows.push({
      channel: "whatsapp",
      Icon: MessageCircle,
      label: LABELS.whatsapp[locale],
      value: cardData.whatsapp,
      href: `https://wa.me/${getWhatsAppNumber(cardData.whatsapp)}`,
      external: true,
    });
  }
  if (cardData.email) {
    rows.push({
      channel: "email",
      Icon: Mail,
      label: LABELS.email[locale],
      value: cardData.email,
      href: `mailto:${cardData.email}`,
      external: false,
    });
  }
  if (cardData.website) {
    rows.push({
      channel: "website",
      Icon: Globe,
      label: LABELS.website[locale],
      value: cardData.website.replace(/^https?:\/\//, ""),
      href: cardData.website,
      external: true,
    });
  }
  if (cardData.address) {
    rows.push({
      channel: "address",
      Icon: MapPin,
      label: LABELS.address[locale],
      value: cardData.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cardData.address)}`,
      external: true,
    });
  }
  return rows;
}

export type ContactRowsVariant = "tile" | "hairline" | "compact";

export interface ContactRowsProps {
  cardData: CardData;
  locale?: "de" | "en" | "tr";
  /** Visual variant. Templates can pass `className` instead for full control. */
  variant?: ContactRowsVariant;
  /**
   * Phase 7.8 — surface tone. Default `"light"` (ink text on light bg).
   * `"dark"` flips the default text/border colors so contact rows stay
   * legible on black / dark-brand surfaces (Studio, MusicProducer, etc).
   */
  tone?: "light" | "dark";
  /** Hex used for the icon-tile background tint and active border. */
  accentHex?: string;
  /** Extra Tailwind classes appended to each row's wrapper. */
  rowClassName?: string;
  /** Extra Tailwind classes appended to the outer container. */
  className?: string;
  /**
   * Optional render-prop escape hatch. Receives the row model and returns
   * fully custom JSX — used by templates whose contact layout doesn't fit
   * any of the built-in variants.
   */
  renderRow?: (row: ContactRow, index: number) => React.ReactNode;
}

/**
 * Default contact rows render. Pick a `variant` to match the template's tone,
 * or pass `renderRow` for fully bespoke output.
 */
export function ContactRows({
  cardData,
  locale = "de",
  variant = "tile",
  tone = "light",
  accentHex,
  rowClassName,
  className,
  renderRow,
}: ContactRowsProps) {
  const rows = React.useMemo(
    () => buildContactRows(cardData, locale),
    [cardData, locale],
  );
  if (rows.length === 0) return null;

  if (renderRow) {
    return (
      <div className={className ?? "grid gap-2"}>
        {rows.map((row, i) => (
          <React.Fragment key={`${row.channel}-${i}`}>
            {renderRow(row, i)}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className={className ?? "grid gap-2"}>
      {rows.map((row, i) => (
        <ContactRowDefault
          key={`${row.channel}-${i}`}
          row={row}
          variant={variant}
          tone={tone}
          accentHex={accentHex}
          className={rowClassName}
        />
      ))}
    </div>
  );
}

function ContactRowDefault({
  row,
  variant,
  tone,
  accentHex,
  className,
}: {
  row: ContactRow;
  variant: ContactRowsVariant;
  tone: "light" | "dark";
  accentHex?: string;
  className?: string;
}) {
  const { Icon } = row;
  const target = row.external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};

  // Phase 7.8 — tone-aware base text/border colors so dark-canvas templates
  // (Studio, MusicProducer, Developer, TechStartup) get legible contact rows
  // without each having to override every Tailwind class via rowClassName.
  const isDark = tone === "dark";
  const labelClass = isDark ? "text-white/72" : "text-ink-400";
  const valueClass = isDark ? "text-white/90" : "text-ink";
  const hairlineBorder = isDark ? "border-white/10" : "border-black/8";
  const compactHover = isDark ? "hover:bg-white/[0.04]" : "hover:bg-black/[0.04]";
  const tileBg = isDark ? "bg-white/[0.03]" : "bg-bg-2";
  const tileBorder = isDark ? "border-white/8" : "border-line";
  const tileHoverBg = isDark ? "hover:bg-white/[0.06]" : "hover:bg-bg-3";
  const tileHoverBorder = isDark ? "hover:border-white/15" : "hover:border-line-firm";
  const ringClass = isDark ? "ring-white/8" : "ring-black/5";

  if (variant === "hairline") {
    return (
      <a
        href={row.href}
        {...target}
        className={`flex items-center justify-between gap-4 border-b ${hairlineBorder} py-3 transition-colors hover:text-[var(--card-primary)] ${className ?? ""}`}
      >
        <span className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center"
            style={accentHex ? { color: accentHex } : undefined}
          >
            <Icon size={15} strokeWidth={1.6} />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className={`text-[10px] uppercase tracking-[0.18em] font-semibold ${labelClass}`}>
              {row.label}
            </span>
            <span className={`truncate text-sm ${valueClass}`}>{row.value}</span>
          </span>
        </span>
      </a>
    );
  }

  if (variant === "compact") {
    return (
      <a
        href={row.href}
        {...target}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${compactHover} ${className ?? ""}`}
      >
        <span
          aria-hidden
          className="flex h-7 w-7 items-center justify-center rounded-md"
          style={
            accentHex
              ? { background: `${accentHex}1A`, color: accentHex }
              : undefined
          }
        >
          <Icon size={13} strokeWidth={2} />
        </span>
        <span className={`truncate text-sm font-medium ${valueClass}`}>
          {row.value}
        </span>
      </a>
    );
  }

  // Default: "tile" — premium framed row, used by RealEstate, LegalCounsel, etc.
  return (
    <a
      href={row.href}
      {...target}
      className={`group flex items-center gap-4 rounded-2xl border ${tileBorder} ${tileBg} px-4 py-3 transition-all hover:-translate-y-px ${tileHoverBorder} ${tileHoverBg} ${className ?? ""}`}
    >
      <span
        aria-hidden
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${ringClass}`}
        style={
          accentHex
            ? {
                background: `${accentHex}14`,
                color: accentHex,
              }
            : { background: isDark ? "rgba(255,255,255,0.05)" : "var(--bg-3, #ECE6D8)" }
        }
      >
        <Icon size={15} strokeWidth={2} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${labelClass}`}>
          {row.label}
        </span>
        <span className={`truncate text-sm font-medium ${valueClass}`}>
          {row.value}
        </span>
      </span>
    </a>
  );
}
