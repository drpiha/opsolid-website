"use client";

// =============================================================================
// SmartCard — premium mobile-first public card layout.
//
// Renders the full Smart Card surface for /c/[slug]: cover, avatar, identity,
// CTA bar (Save/Call/WhatsApp/Email/Book/Send Info), contact rows, custom
// buttons, services, gallery, video, brochure, FAQ, testimonials, footer.
//
// All optional fields render only when present. A minimal card with just
// name + phone still looks intentional (no empty sections rendered).
// =============================================================================

import Image from "next/image";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  MessageCircle,
  Calendar,
  UserPlus,
  Share2,
  FileDown,
  Shield,
} from "lucide-react";
import type { CardData } from "@/lib/validation";
import type { SmartCardSource } from "./SmartCardSource";
import { encodeSource, describeSource } from "./SmartCardSource";
import { SendMyInfoSlot } from "@/components/cards/templates/v2/shared/SendMyInfoSlot";
import { getSectorPreset } from "@/config/card-sectors";
import { ExchangeButton } from "./ExchangeButton";

export interface SmartCardProps {
  slug: string;
  cardData: CardData;
  photoPath?: string | null;
  logoPath?: string | null;
  brandPrimaryHex?: string | null;
  brandAccentHex?: string | null;
  source?: SmartCardSource;
  /** Site origin for absolute URLs (Open Graph, share). */
  siteUrl: string;
  /** Card owner's locale — used by visitor-facing CTAs (e.g. ExchangeButton). */
  locale?: "de" | "en" | "tr";
  /**
   * Optional server-rendered slot for Apple/Google Wallet buttons. SmartCard
   * is a client component, so it cannot read non-public env vars at render
   * time — the parent (server) computes the buttons and passes them in via
   * this slot. Renders directly above the footer when provided.
   *
   * Producer: `<WalletButtons slug={slug} />` from
   * `@/components/cards/smart/WalletButtons`.
   */
  walletSlot?: React.ReactNode;
}

const DEFAULT_PRIMARY = "#C27940"; // copper
const DEFAULT_ACCENT = "#1F2530"; // graphite

function resolveAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return `/${path}`;
}

function digitsOnly(phone: string): string {
  return phone.replace(/[^+0-9]/g, "");
}

/**
 * Returns true when running on an Android browser.
 * Safe to call server-side (SSR) — returns false when navigator is undefined.
 */
function isAndroidUA(): boolean {
  if (typeof navigator === "undefined") return false;
  return /android/i.test(navigator.userAgent);
}

/**
 * Build the vCard endpoint URL, appending ?v=3 for Android clients and
 * stitching any existing sourceQs onto the query string correctly.
 *
 * sourceQs is either "" or starts with "?" (e.g. "?src=nfc&event=messe").
 */
function vcardHref(slug: string, sourceQs: string): string {
  const base = `/api/cards/${encodeURIComponent(slug)}/vcard`;
  const android = isAndroidUA();
  if (!android && !sourceQs) return base;
  if (android && !sourceQs) return `${base}?v=3`;
  // sourceQs starts with "?" — merge with version param when needed
  if (android) return `${base}?v=3&${sourceQs.replace(/^\?/, "")}`;
  return `${base}${sourceQs}`;
}

function getWhatsAppNumber(value: string): string {
  return digitsOnly(value).replace(/^\+/, "");
}

export function SmartCard({
  slug,
  cardData,
  photoPath,
  logoPath,
  brandPrimaryHex,
  brandAccentHex,
  source,
  siteUrl,
  locale = "de",
  walletSlot,
}: SmartCardProps) {
  const sector = getSectorPreset(cardData.sectorKey);
  const primary =
    brandPrimaryHex ?? sector?.primaryHex ?? DEFAULT_PRIMARY;
  const accent = brandAccentHex ?? sector?.accentHex ?? DEFAULT_ACCENT;

  // Sector preset fills empty blocks. Owner-supplied content always wins —
  // applySectorPreset() ran at apply-time and produced cardData; here we only
  // fall back when the owner cleared a block in the editor afterwards.
  const services =
    cardData.services && cardData.services.length > 0
      ? cardData.services
      : sector?.services ?? undefined;
  const customButtons =
    cardData.customButtons && cardData.customButtons.length > 0
      ? cardData.customButtons
      : sector?.customButtons ?? undefined;
  const faqs =
    cardData.faqs && cardData.faqs.length > 0
      ? cardData.faqs
      : sector?.faqs ?? undefined;

  const photoUrl = resolveAssetUrl(photoPath ?? undefined);
  const logoUrl = resolveAssetUrl(logoPath ?? undefined);
  const coverUrl = resolveAssetUrl(cardData.coverImage);

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  const titleParts = [cardData.position, cardData.title, cardData.company]
    .filter((s): s is string => !!s);

  const initials = cardData.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp ? getWhatsAppNumber(cardData.whatsapp) : "";

  // Theme key drives `[data-theme="..."]` CSS in cards/smart/themes.css. The
  // CardData type may not yet include themeKey (Agent D extends it); fall back
  // to "default" so the selector always matches a real bucket.
  const themeKey =
    (cardData as { themeKey?: string }).themeKey ?? "default";

  return (
    <article
      data-theme={themeKey}
      className="mx-auto w-full max-w-[440px] overflow-hidden rounded-[28px] bg-bg-1 text-ink shadow-depth-3 ring-1 ring-line"
      style={
        {
          // CSS vars exposed for child elements that need brand color (rings,
          // CTA accents). Kept as inline style so per-card overrides work
          // without a Tailwind config change.
          ["--card-primary" as string]: primary,
          ["--card-accent" as string]: accent,
        } as React.CSSProperties
      }
    >
      <SmartCardCover
        coverUrl={coverUrl}
        primary={primary}
        accent={accent}
        sourceLabel={sourceLabel}
        sectorBadge={sector?.name}
      />

      <div className="relative -mt-14 px-6 pb-6">
        <SmartCardAvatar
          photoUrl={photoUrl}
          name={cardData.name}
          initials={initials || "•"}
          ringColor={primary}
        />

        {logoUrl && (
          <div className="absolute right-6 top-2 flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-bg-1/90 ring-1 ring-line backdrop-blur">
            <Image
              src={logoUrl}
              alt={cardData.company ? `${cardData.company} logo` : "Logo"}
              width={56}
              height={56}
              // Phase 6.7 A5 — `tpl-logo` honours --tpl-logo-x/y/scale.
              className="tpl-logo h-9 w-auto object-contain"
              unoptimized
            />
          </div>
        )}

        <div className="mt-5">
          <h1 className="font-editorial text-[2rem] leading-[1.05] tracking-tight text-ink">
            {cardData.name}
          </h1>
          {titleParts.length > 0 && (
            <p className="mt-1.5 text-body-sm text-ink-300">
              {titleParts.join(" · ")}
            </p>
          )}
          {cardData.bio && (
            <p className="mt-4 text-body-sm leading-relaxed text-ink-200">
              {cardData.bio}
            </p>
          )}
        </div>

        <SmartCardCTAs
          slug={slug}
          cardData={cardData}
          phoneDigits={phoneDigits}
          waDigits={waDigits}
          sourceQs={sourceQs}
          primary={primary}
          locale={locale}
          customButtons={customButtons}
        />

        <SendMyInfoSlot
          slug={slug}
          sourceQs={sourceQs}
          primary={primary}
          locale={locale}
        />
        <ExchangeButton slug={slug} primary={primary} locale={locale} />
      </div>

      <SmartCardContactRows cardData={cardData} />

      {cardData.socials && <SmartCardSocialRow socials={cardData.socials} />}

      {services && services.length > 0 && (
        <SmartCardServices services={services} accent={primary} />
      )}

      {cardData.gallery && cardData.gallery.length > 0 && (
        <SmartCardGallery gallery={cardData.gallery} />
      )}

      {cardData.videoUrl && <SmartCardVideo url={cardData.videoUrl} />}

      {cardData.brochureUrl && (
        <div className="border-t border-line px-6 py-5">
          <a
            href={cardData.brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-2xl border border-line bg-bg-2 px-4 py-3.5 text-sm font-medium text-ink transition hover:border-line-firm hover:bg-bg-3"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg-3 text-ink-200">
                <FileDown size={16} strokeWidth={2} />
              </span>
              Broschüre / Portfolio
            </span>
            <span className="text-xs text-ink-400">PDF</span>
          </a>
        </div>
      )}

      {faqs && faqs.length > 0 && <SmartCardFaq faqs={faqs} />}

      {cardData.testimonials && cardData.testimonials.length > 0 && (
        <SmartCardTestimonials items={cardData.testimonials} />
      )}

      {walletSlot && (
        <div className="border-t border-line px-6 pt-5">{walletSlot}</div>
      )}

      <SmartCardFooter
        siteUrl={siteUrl}
        slug={slug}
        impressumUrl={cardData.impressumUrl}
        privacyUrl={cardData.privacyUrl}
        locale={locale}
      />
    </article>
  );
}

// -----------------------------------------------------------------------------
// Sub-components — kept in this file for fewer imports + faster review. Each is
// a pure function of its props and can be extracted later if reused.
// -----------------------------------------------------------------------------

function SmartCardCover({
  coverUrl,
  primary,
  accent,
  sourceLabel,
  sectorBadge,
}: {
  coverUrl: string | null;
  primary: string;
  accent: string;
  sourceLabel?: string;
  sectorBadge?: string;
}) {
  return (
    <div className="relative h-36 w-full overflow-hidden">
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt="Card cover"
          fill
          priority
          unoptimized
          className="object-cover"
        />
      ) : (
        <div
          className="h-full w-full"
          style={{
            background: `radial-gradient(120% 120% at 0% 0%, ${primary}40, transparent 55%), radial-gradient(120% 120% at 100% 100%, ${accent}66, transparent 60%), linear-gradient(135deg, ${accent} 0%, #11151C 100%)`,
          }}
        />
      )}
      {/* Top scrim — keeps the dark theme readable when cover photo is bright. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-bg-1" />

      <div className="relative flex items-start justify-between gap-2 p-4">
        <span className="rounded-full bg-bg-1/70 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink-300 backdrop-blur">
          OpSolid · Smart Card
        </span>
        <div className="flex flex-col items-end gap-1">
          {sectorBadge && (
            <span className="rounded-full bg-bg-1/70 px-3 py-1 text-[10px] font-medium tracking-wide text-ink-200 backdrop-blur">
              {sectorBadge}
            </span>
          )}
          {sourceLabel && (
            <span className="rounded-full bg-bg-1/70 px-3 py-1 font-mono text-[10px] font-medium tracking-wide text-ink-300 backdrop-blur">
              {sourceLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SmartCardAvatar({
  photoUrl,
  name,
  initials,
  ringColor,
}: {
  photoUrl: string | null;
  name: string;
  initials: string;
  ringColor: string;
}) {
  if (photoUrl) {
    return (
      <div
        className="relative h-28 w-28 overflow-hidden rounded-3xl shadow-depth-2"
        style={{ outline: `3px solid ${ringColor}`, outlineOffset: "-3px" }}
      >
        <Image
          src={photoUrl}
          alt={name}
          width={224}
          height={224}
          // Phase 6.7 A5 — `tpl-photo` wires this <img> into the
          // --tpl-photo-x/y/scale variables set by the page wrapper, so the
          // owner's saved pan/zoom is rendered on the public card.
          className="tpl-photo h-full w-full object-cover"
          unoptimized
          priority
        />
      </div>
    );
  }
  return (
    <div
      className="flex h-28 w-28 items-center justify-center rounded-3xl bg-bg-3 font-editorial text-4xl text-ink shadow-depth-2"
      style={{ outline: `3px solid ${ringColor}`, outlineOffset: "-3px" }}
    >
      {initials}
    </div>
  );
}

const SAVE_LABELS: Record<"de" | "en" | "tr", string> = {
  de: "Speichern",
  en: "Save Contact",
  tr: "Kaydet",
};

function SmartCardCTAs({
  slug,
  cardData,
  phoneDigits,
  waDigits,
  sourceQs,
  primary,
  locale = "de",
  customButtons,
}: {
  slug: string;
  cardData: CardData;
  phoneDigits: string;
  waDigits: string;
  sourceQs: string;
  primary: string;
  locale?: "de" | "en" | "tr";
  customButtons?: CardData["customButtons"];
}) {
  const saveLabel = SAVE_LABELS[locale];

  const secondaryItems: Array<{
    icon: React.ReactNode;
    label: string;
    href: string;
  }> = [];

  if (phoneDigits) {
    secondaryItems.push({
      icon: <Phone size={18} strokeWidth={2.2} />,
      label: "Anrufen",
      href: `tel:${phoneDigits}`,
    });
  }
  if (waDigits) {
    secondaryItems.push({
      icon: <MessageCircle size={18} strokeWidth={2.2} />,
      label: "WhatsApp",
      href: `https://wa.me/${waDigits}`,
    });
  }
  if (cardData.email) {
    secondaryItems.push({
      icon: <Mail size={18} strokeWidth={2.2} />,
      label: "E-Mail",
      href: `mailto:${cardData.email}`,
    });
  }
  if (cardData.bookingUrl) {
    secondaryItems.push({
      icon: <Calendar size={18} strokeWidth={2.2} />,
      label: "Termin",
      href: cardData.bookingUrl,
    });
  }

  // Cap secondary grid at 4 items so the auto-fit grid stays tidy.
  const visibleSecondary = secondaryItems.slice(0, 4);
  const secondaryCols =
    visibleSecondary.length <= 2 ? visibleSecondary.length : 4;

  return (
    <div className="mt-6">
      {/* Primary action — full-width, 52pt minimum touch target */}
      <a
        href={vcardHref(slug, sourceQs)}
        className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-6 py-4 text-base font-semibold text-neutral-50 shadow-[0_8px_24px_-8px_rgba(20,18,15,0.4)] transition-transform active:scale-[0.98]"
        aria-label={saveLabel}
      >
        <UserPlus size={20} />
        <span>{saveLabel}</span>
      </a>

      {/* Custom buttons — below primary, above secondary grid */}
      {customButtons && customButtons.length > 0 && (
        <div
          className={`mt-3 grid gap-2 ${
            customButtons.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {customButtons.map((btn, i) => (
            <a
              key={`${btn.label}-${i}`}
              href={btn.href}
              target="_blank"
              rel="noopener noreferrer"
              className={ctaButtonClass(btn.style)}
              style={
                btn.style === "primary"
                  ? { background: primary, color: "#fff" }
                  : undefined
              }
            >
              {btn.label}
            </a>
          ))}
        </div>
      )}

      {/* Secondary actions — 2-4 column auto-fit grid */}
      {visibleSecondary.length > 0 && (
        <div
          className={`mt-3 grid gap-2`}
          style={{ gridTemplateColumns: `repeat(${secondaryCols}, minmax(0, 1fr))` }}
        >
          {visibleSecondary.map((item, i) => (
            <a
              key={`${item.label}-${i}`}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={
                item.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className="group flex flex-col items-center justify-center gap-1 rounded-xl border border-ink/15 bg-white px-3 py-2.5 min-h-[64px] text-xs font-medium text-ink/80 transition-colors hover:border-ink/40 hover:text-ink active:scale-[0.97]"
              aria-label={item.label}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-3 text-ink-200 group-hover:text-ink">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function SmartCardContactRows({ cardData }: { cardData: CardData }) {
  const rows: Array<{
    icon: React.ReactNode;
    label: string;
    value: string;
    href: string;
  }> = [];
  if (cardData.phone) {
    rows.push({
      icon: <Phone size={15} strokeWidth={2} />,
      label: "Telefon",
      value: cardData.phone,
      href: `tel:${digitsOnly(cardData.phone)}`,
    });
  }
  if (cardData.whatsapp) {
    rows.push({
      icon: <MessageCircle size={15} strokeWidth={2} />,
      label: "WhatsApp",
      value: cardData.whatsapp,
      href: `https://wa.me/${getWhatsAppNumber(cardData.whatsapp)}`,
    });
  }
  if (cardData.email) {
    rows.push({
      icon: <Mail size={15} strokeWidth={2} />,
      label: "E-Mail",
      value: cardData.email,
      href: `mailto:${cardData.email}`,
    });
  }
  if (cardData.website) {
    rows.push({
      icon: <Globe size={15} strokeWidth={2} />,
      label: "Website",
      value: cardData.website.replace(/^https?:\/\//, ""),
      href: cardData.website,
    });
  }
  if (cardData.address) {
    rows.push({
      icon: <MapPin size={15} strokeWidth={2} />,
      label: "Adresse",
      value: cardData.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cardData.address)}`,
    });
  }
  if (rows.length === 0) return null;
  return (
    <div className="border-t border-line px-6 py-5">
      <h2 className="mb-3 text-eyebrow uppercase text-ink-400">Kontakt</h2>
      <div className="grid gap-2">
        {rows.map((row, i) => (
          <a
            key={`${row.label}-${i}`}
            href={row.href}
            target={row.href.startsWith("http") ? "_blank" : undefined}
            rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex items-center gap-4 rounded-2xl border border-line bg-bg-2 px-4 py-3 transition hover:border-line-firm hover:bg-bg-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-3 text-ink-200">
              {row.icon}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-[10px] font-medium uppercase tracking-wider text-ink-400">
                {row.label}
              </span>
              <span className="truncate text-sm font-medium text-ink">{row.value}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

const SOCIAL_ORDER = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "instagram", label: "Instagram" },
  { key: "x", label: "X" },
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
  { key: "github", label: "GitHub" },
  { key: "facebook", label: "Facebook" },
  { key: "xing", label: "Xing" },
] as const;

function SmartCardSocialRow({
  socials,
}: {
  socials: NonNullable<CardData["socials"]>;
}) {
  const items = SOCIAL_ORDER.filter(({ key }) => {
    const value = (socials as Record<string, string | undefined>)[key];
    return typeof value === "string" && value.length > 0;
  });
  if (items.length === 0) return null;
  return (
    <div className="border-t border-line px-6 py-5">
      <h2 className="mb-3 text-eyebrow uppercase text-ink-400">Social</h2>
      <div className="flex flex-wrap gap-2">
        {items.map(({ key, label }) => {
          const href = (socials as Record<string, string>)[key];
          return (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-pill border border-line bg-bg-2 px-3.5 py-1.5 text-xs font-medium text-ink transition hover:border-line-firm hover:bg-bg-3"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-line-firm"
              />
              {label}
            </a>
          );
        })}
      </div>
    </div>
  );
}

function SmartCardServices({
  services,
  accent,
}: {
  services: NonNullable<CardData["services"]>;
  accent: string;
}) {
  return (
    <div className="border-t border-line px-6 py-5">
      <h2 className="mb-3 text-eyebrow uppercase text-ink-400">Leistungen</h2>
      <ul className="grid gap-2">
        {services.map((s, i) => (
          <li
            key={`${s.title}-${i}`}
            className="rounded-2xl border border-line bg-bg-2 px-4 py-3"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-ink">{s.title}</h3>
              {s.priceLabel && (
                <span
                  className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                  style={{ background: `${accent}22`, color: accent }}
                >
                  {s.priceLabel}
                </span>
              )}
            </div>
            {s.description && (
              <p className="mt-1.5 text-xs leading-relaxed text-ink-300">
                {s.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SmartCardGallery({
  gallery,
}: {
  gallery: NonNullable<CardData["gallery"]>;
}) {
  return (
    <div className="border-t border-line px-6 py-5">
      <h2 className="mb-3 text-eyebrow uppercase text-ink-400">Galerie</h2>
      <div className="-mx-6 flex snap-x snap-mandatory gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {gallery.map((g, i) => {
          const src = resolveAssetUrl(g.src);
          if (!src) return null;
          return (
            <div
              key={`${g.src}-${i}`}
              className="relative aspect-square h-32 shrink-0 snap-start overflow-hidden rounded-2xl bg-bg-2"
            >
              <Image
                src={src}
                alt={g.alt ?? ""}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const YT_RE = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([A-Za-z0-9_-]{6,16})/;
const VIMEO_RE = /vimeo\.com\/(?:video\/)?(\d{5,12})/;

function videoEmbedSrc(url: string): string | null {
  const ytMatch = url.match(YT_RE);
  if (ytMatch) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0`;
  }
  const vMatch = url.match(VIMEO_RE);
  if (vMatch) {
    return `https://player.vimeo.com/video/${vMatch[1]}`;
  }
  return null;
}

function SmartCardVideo({ url }: { url: string }) {
  const src = videoEmbedSrc(url);
  if (!src) return null;
  return (
    <div className="border-t border-line px-6 py-5">
      <h2 className="mb-3 text-eyebrow uppercase text-ink-400">Video</h2>
      <div className="overflow-hidden rounded-2xl border border-line bg-black">
        <div className="relative aspect-video w-full">
          <iframe
            src={src}
            title="Embedded video"
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            // Sandbox isolates the embedded YouTube/Vimeo frame from our origin.
            // - allow-scripts: required for the player runtime.
            // - allow-same-origin: required for the player postMessage
            //   handshake (without it the player treats itself as null
            //   origin and refuses to load).
            // - allow-presentation: enables AirPlay / Cast surface.
            // - allow-popups + allow-popups-to-escape-sandbox: lets the
            //   "Watch on YouTube" link open without inheriting sandbox.
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}

function SmartCardFaq({
  faqs,
}: {
  faqs: NonNullable<CardData["faqs"]>;
}) {
  return (
    <div className="border-t border-line px-6 py-5">
      <h2 className="mb-3 text-eyebrow uppercase text-ink-400">FAQ</h2>
      <ul className="grid gap-2">
        {faqs.map((f, i) => (
          <li
            key={`${i}-${f.q.slice(0, 8)}`}
            className="rounded-2xl border border-line bg-bg-2"
          >
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-ink">
                <span>{f.q}</span>
                <span
                  aria-hidden
                  className="text-ink-400 transition-transform group-open:rotate-180"
                >
                  ▾
                </span>
              </summary>
              <div className="border-t border-line px-4 py-3 text-xs leading-relaxed text-ink-300">
                {f.a}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SmartCardTestimonials({
  items,
}: {
  items: NonNullable<CardData["testimonials"]>;
}) {
  return (
    <div className="border-t border-line px-6 py-5">
      <h2 className="mb-3 text-eyebrow uppercase text-ink-400">Stimmen</h2>
      <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((t, i) => (
          <figure
            key={`${t.author}-${i}`}
            className="w-[80%] shrink-0 snap-start rounded-2xl border border-line bg-bg-2 p-4 sm:w-[60%]"
          >
            <blockquote className="font-editorial text-base leading-snug text-ink">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-3 text-xs text-ink-300">
              <span className="font-semibold text-ink">{t.author}</span>
              {t.role ? ` · ${t.role}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

const FOOTER_SHARE_LABELS: Record<"de" | "en" | "tr", string> = {
  de: "Teilen",
  en: "Share",
  tr: "Paylaş",
};

function SmartCardFooter({
  siteUrl,
  slug,
  impressumUrl,
  privacyUrl,
  locale = "de",
}: {
  siteUrl: string;
  slug: string;
  impressumUrl?: string;
  privacyUrl?: string;
  locale?: "de" | "en" | "tr";
}) {
  return (
    <footer className="border-t border-line bg-bg-2/40 px-6 py-5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-ink-400">
        <ShareButton siteUrl={siteUrl} slug={slug} locale={locale} />
        {impressumUrl && (
          <a
            href={impressumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:text-ink hover:underline"
          >
            Impressum
          </a>
        )}
        {privacyUrl && (
          <a
            href={privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:text-ink hover:underline"
          >
            Datenschutz
          </a>
        )}
        <span className="ml-auto inline-flex items-center gap-1.5 text-ink-400">
          <Shield size={11} strokeWidth={2.2} />
          Powered by{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink hover:underline"
          >
            OpSolid
          </a>
        </span>
      </div>
    </footer>
  );
}

function ShareButton({
  siteUrl,
  slug,
  locale = "de",
}: {
  siteUrl: string;
  slug: string;
  locale?: "de" | "en" | "tr";
}) {
  const url = `${siteUrl}/c/${slug}`;
  const label = FOOTER_SHARE_LABELS[locale];
  return (
    <button
      type="button"
      aria-label={label}
      onClick={async () => {
        if (typeof navigator !== "undefined" && "share" in navigator) {
          try {
            await navigator.share({ url, title: "Smart Card" });
            return;
          } catch {
            // User cancelled — fall through to clipboard.
          }
        }
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        }
      }}
      className="inline-flex items-center gap-1.5 underline-offset-2 hover:text-ink hover:underline"
    >
      <Share2 size={11} strokeWidth={2.2} />
      {label}
    </button>
  );
}

function ctaButtonClass(style: "primary" | "secondary" | "ghost"): string {
  const base =
    "inline-flex items-center justify-center rounded-pill px-4 py-2 text-xs font-medium transition active:scale-[0.97]";
  if (style === "primary") {
    return `${base} text-white shadow-depth-2`;
  }
  if (style === "ghost") {
    return `${base} text-ink-300 hover:text-ink`;
  }
  return `${base} border border-line bg-bg-2 text-ink hover:border-line-firm hover:bg-bg-3`;
}
