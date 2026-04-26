"use client";

// =============================================================================
// Photographer — v2 template (id=4, key="photographer").
//
// Design DNA: Projekt_4k/showcase/kart_04_fotograf.html — black + gold + Inter
// + Space Mono. Re-implemented in React + Tailwind. The portfolio grid is the
// imagery story — the avatar is small, the typography mostly disappears so
// the photographs carry the page.
//
// Locked design choices (do not parameterise):
//   - Photo: circular avatar 44 px (top-left), 1.5 px gold border + 1 px black
//     inner ring. NOT a hero image.
//   - Logo wordmark: sits next to the avatar — "{name} · photography" in Space
//     Mono small caps. No separate logo upload.
//   - Palette: bg-0 surrounding chrome; near-black (#0e0e0e) article surface;
//     #fafafa text scale at 90/60/30 % opacity; gold accent (#e8c472).
//   - Typography: Inter (body, 400/500) + Space Mono (eyebrows + section
//     labels, 400/700, ALL-CAPS spaced).
//   - Section rhythm:
//       Header (avatar + wordmark + locale pill) → Filter bar
//       (Personal / Editorial / Commercial) → Portfolio masonry → About →
//       Contact + Booking → Wallet/Exchange/SendMyInfo → Social → Footer
//   - Distinctive: monospace eyebrows, ALL-CAPS spaced section labels, stark
//     black/gold contrast, gallery photos open into a Radix Dialog lightbox.
//
// Variable per card: cardData content, photoPath (avatar), brandPrimaryHex
// (overrides near-black), brandAccentHex (overrides gold).
// =============================================================================

import * as React from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Camera,
  Mail,
  MapPin,
  Phone,
  PlayCircle,
  Quote,
  X,
  Star,
} from "lucide-react";

import { encodeSource, describeSource } from "@/components/cards/smart/SmartCardSource";
import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#0e0e0e";
const LOCKED_ACCENT = "#e8c472";

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
  if (parts.length === 1) return (parts[0][0] ?? "·").toUpperCase();
  return (
    (parts[0][0] ?? "").toUpperCase() + (parts[parts.length - 1][0] ?? "").toUpperCase()
  );
}

interface PhCopy {
  portfolio: string;
  about: string;
  contact: string;
  social: string;
  walletLabel: string;
  filterAll: string;
  filterEditorial: string;
  filterPersonal: string;
  filterCommercial: string;
  voices: string;
  reel: string;
  poweredBy: string;
  impressum: string;
  privacy: string;
  share: string;
  closeLightbox: string;
}

const COPY: Record<"de" | "en" | "tr", PhCopy> = {
  de: {
    portfolio: "Portfolio",
    about: "Über mich",
    contact: "Buchung",
    social: "Folgen",
    walletLabel: "Auf das Smartphone",
    filterAll: "Alle",
    filterEditorial: "Editorial",
    filterPersonal: "Persönlich",
    filterCommercial: "Werbung",
    voices: "Stimmen",
    reel: "Showreel ansehen",
    poweredBy: "Powered by",
    impressum: "Impressum",
    privacy: "Datenschutz",
    share: "Teilen",
    closeLightbox: "Schließen",
  },
  en: {
    portfolio: "Portfolio",
    about: "About",
    contact: "Booking",
    social: "Follow",
    walletLabel: "Add to wallet",
    filterAll: "All",
    filterEditorial: "Editorial",
    filterPersonal: "Personal",
    filterCommercial: "Commercial",
    voices: "Voices",
    reel: "Watch the reel",
    poweredBy: "Powered by",
    impressum: "Imprint",
    privacy: "Privacy",
    share: "Share",
    closeLightbox: "Close",
  },
  tr: {
    portfolio: "Portföy",
    about: "Hakkımda",
    contact: "Çekim Talebi",
    social: "Takip et",
    walletLabel: "Cüzdana ekle",
    filterAll: "Tümü",
    filterEditorial: "Editöryel",
    filterPersonal: "Kişisel",
    filterCommercial: "Reklam",
    voices: "Sesler",
    reel: "Showreel",
    poweredBy: "Powered by",
    impressum: "Künye",
    privacy: "Gizlilik",
    share: "Paylaş",
    closeLightbox: "Kapat",
  },
};

type CategoryKey = "all" | "editorial" | "personal" | "commercial";

function inferCategory(alt: string | undefined): CategoryKey {
  if (!alt) return "personal";
  const lower = alt.toLowerCase();
  if (lower.includes("editorial") || lower.includes("magazine")) return "editorial";
  if (
    lower.includes("commercial") ||
    lower.includes("brand") ||
    lower.includes("product") ||
    lower.includes("campaign")
  ) {
    return "commercial";
  }
  return "personal";
}

export function Photographer({
  slug,
  cardData,
  locale = "de",
  photoPath,
  brandPrimaryHex,
  brandAccentHex,
  source,
  siteUrl,
  walletSlot,
}: TemplateProps) {
  const t = COPY[locale] ?? COPY.de;

  const primary = brandPrimaryHex || LOCKED_PRIMARY;
  const accent = brandAccentHex || LOCKED_ACCENT;

  const photoUrl = resolveAssetUrl(photoPath);
  const initials = getInitials(cardData.name);

  const sourceQs = source ? encodeSource(source) : "";
  const sourceLabel = source ? describeSource(source) : undefined;

  const gallery = React.useMemo(
    () => cardData.gallery ?? [],
    [cardData.gallery],
  );
  const [filter, setFilter] = React.useState<CategoryKey>("all");
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const filteredGallery = React.useMemo(() => {
    if (filter === "all") return gallery;
    return gallery.filter((g) => inferCategory(g.alt) === filter);
  }, [filter, gallery]);

  const lightboxItem = lightboxIndex !== null ? filteredGallery[lightboxIndex] : null;

  return (
    <article
      data-template="photographer"
      className={`ph-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[20px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6),0_8px_22px_-12px_rgba(0,0,0,0.4)]`}
      style={
        {
          ["--card-primary" as string]: primary,
          ["--card-accent" as string]: accent,
          ["--ph-bg" as string]: primary,
          ["--ph-card" as string]: "#1a1a1a",
          ["--ph-text" as string]: "#fafafa",
          ["--ph-text-90" as string]: "rgba(250,250,250,0.92)",
          ["--ph-text-60" as string]: "rgba(250,250,250,0.6)",
          ["--ph-text-30" as string]: "rgba(250,250,250,0.3)",
          ["--ph-line" as string]: "rgba(250,250,250,0.08)",
          ["--font-photographer-body" as string]: "'Inter', system-ui, sans-serif",
          ["--font-photographer-mono" as string]: "'Space Mono', 'Courier New', monospace",
          background: primary,
          color: "#fafafa",
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .ph-card {
          font-family: var(--font-photographer-body), Inter, system-ui, sans-serif;
          line-height: 1.55;
          letter-spacing: -0.005em;
        }
        .ph-card .ph-mono,
        .ph-card h1.ph-mono,
        .ph-card h2.ph-mono {
          font-family: var(--font-photographer-mono), "Space Mono", monospace;
          letter-spacing: 0.04em;
        }
        .ph-card .ph-eyebrow {
          font-family: var(--font-photographer-mono), "Space Mono", monospace;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          font-size: 9.5px;
          font-weight: 700;
        }
        .ph-card a {
          color: inherit;
        }
      `}</style>

      <Header
        photoUrl={photoUrl}
        initials={initials}
        name={cardData.name}
        company={cardData.company}
        accent={accent}
        sourceLabel={sourceLabel}
        locale={locale}
      />

      {gallery.length > 0 && (
        <FilterBar
          accent={accent}
          filter={filter}
          setFilter={setFilter}
          translations={t}
          gallery={gallery}
        />
      )}

      {gallery.length > 0 && (
        <PortfolioGrid
          items={filteredGallery}
          onOpenLightbox={(i) => setLightboxIndex(i)}
          accent={accent}
        />
      )}

      <SectionEyebrow label={t.about} accent={accent} />
      <section className="px-6 pb-7 pt-3">
        <h2
          className="ph-mono mb-4 text-[22px] font-bold leading-tight"
          style={{ color: "#fafafa", letterSpacing: "-0.01em" }}
        >
          {cardData.name}
        </h2>
        {cardData.bio && (
          <p
            className="text-[14px] leading-[1.75]"
            style={{ color: "var(--ph-text-60)" }}
          >
            {cardData.bio}
          </p>
        )}
        <div
          aria-hidden
          className="mt-6 h-px w-full"
          style={{ background: "var(--ph-line)" }}
        />
      </section>

      {cardData.testimonials && cardData.testimonials.length > 0 && (
        <>
          <SectionEyebrow label={t.voices} accent={accent} />
          <section className="space-y-3 px-6 pb-7 pt-3">
            {cardData.testimonials.slice(0, 3).map((item, i) => (
              <TestimonialCard
                key={`${item.author}-${i}`}
                item={item}
                accent={accent}
              />
            ))}
          </section>
        </>
      )}

      {cardData.videoUrl && (
        <ReelStrip url={cardData.videoUrl} accent={accent} label={t.reel} />
      )}

      <SectionEyebrow label={t.contact} accent={accent} />
      <section className="space-y-2 px-6 pb-7 pt-3">
        <ContactRows
          cardData={cardData}
          locale={locale}
          variant="hairline"
          accentHex={accent}
          renderRow={(row) => (
            <a
              href={row.href}
              {...(row.external
                ? { target: "_blank", rel: "noopener noreferrer" as const }
                : {})}
              className="group flex items-center gap-4 border-b py-3.5"
              style={{ borderColor: "var(--ph-line)" }}
            >
              <span
                aria-hidden
                className="flex h-8 w-8 shrink-0 items-center justify-center"
                style={{ color: accent }}
              >
                <row.Icon size={14} strokeWidth={1.5} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span
                  className="ph-eyebrow"
                  style={{ color: "var(--ph-text-30)" }}
                >
                  {row.label}
                </span>
                <span className="truncate text-[14px] font-medium text-[var(--ph-text-90)] group-hover:text-white">
                  {row.value}
                </span>
              </span>
            </a>
          )}
        />
      </section>

      <CTASection
        slug={slug}
        sourceQs={sourceQs}
        locale={locale}
        primary={accent}
        accent="#fafafa"
      />

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-6 py-6"
          labelClassName="ph-eyebrow mb-3"
        >
          <div style={{ ["--card-primary" as string]: accent }}>{walletSlot}</div>
        </WalletDock>
      )}

      {cardData.socials && (
        <>
          <SectionEyebrow label={t.social} accent={accent} />
          <section className="px-6 pb-7 pt-3">
            <SocialRow
              socials={cardData.socials}
              variant="icon"
              accentHex={accent}
              itemClassName="border-[color:var(--ph-line)] bg-[var(--ph-card)] text-[var(--ph-text)] hover:border-[color:var(--card-accent)]"
            />
          </section>
        </>
      )}

      <Footer
        siteUrl={siteUrl}
        slug={slug}
        accent={accent}
        impressumUrl={cardData.impressumUrl}
        privacyUrl={cardData.privacyUrl}
        translations={t}
      />

      {/* Radix Dialog lightbox. */}
      <Dialog.Root
        open={lightboxItem !== null}
        onOpenChange={(open) => !open && setLightboxIndex(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
            <Dialog.Title className="sr-only">{t.portfolio}</Dialog.Title>
            <Dialog.Description className="sr-only">
              {lightboxItem?.alt ?? "Photograph"}
            </Dialog.Description>
            {lightboxItem && (
              <div className="relative max-h-full max-w-4xl">
                <Image
                  src={resolveAssetUrl(lightboxItem.src) ?? lightboxItem.src}
                  alt={lightboxItem.alt ?? ""}
                  width={1600}
                  height={1200}
                  unoptimized
                  className="max-h-[85vh] w-auto rounded-md object-contain"
                />
                {lightboxItem.alt && (
                  <p
                    className="ph-mono mt-3 text-center text-[12px]"
                    style={{ color: accent, letterSpacing: "0.18em" }}
                  >
                    — {lightboxItem.alt} —
                  </p>
                )}
              </div>
            )}
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t.closeLightbox}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <X size={18} strokeWidth={1.6} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* unused-var hint suppress */}
      <span hidden aria-hidden>
        <Phone size={1} />
        <Mail size={1} />
        <MapPin size={1} />
        <Camera size={1} />
      </span>
    </article>
  );
}

// =============================================================================
// Subcomponents
// =============================================================================

function Header({
  photoUrl,
  initials,
  name,
  company,
  accent,
  sourceLabel,
  locale,
}: {
  photoUrl: string | null;
  initials: string;
  name: string;
  company?: string;
  accent: string;
  sourceLabel?: string;
  locale: "de" | "en" | "tr";
}) {
  return (
    <header
      className="flex items-center gap-3.5 border-b px-6 py-5"
      style={{ borderColor: "var(--ph-line)" }}
    >
      {/* Circular avatar 44px, 1.5px gold border + 1px black inner ring. */}
      <div
        className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full"
        style={{
          background: "#1a1a1a",
          border: `1.5px solid ${accent}`,
          boxShadow: "inset 0 0 0 1px #000",
        }}
      >
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt=""
            fill
            unoptimized
            sizes="44px"
            className="object-cover tpl-photo"
          />
        ) : (
          <span
            className="ph-mono text-[12px] font-bold"
            style={{ color: accent }}
          >
            {initials}
          </span>
        )}
      </div>

      {/* Wordmark — Space Mono small caps. */}
      <div className="min-w-0 flex-1">
        <h1
          className="ph-mono truncate text-[15px] font-bold leading-tight"
          style={{ color: "#fafafa", letterSpacing: "-0.01em" }}
        >
          {name}
        </h1>
        <p
          className="ph-eyebrow mt-1"
          style={{ color: accent }}
        >
          · {company ?? "photography"}
        </p>
      </div>

      {/* Locale pill. */}
      <span
        className="ph-eyebrow rounded-full border px-2.5 py-1"
        style={{
          borderColor: "var(--ph-line)",
          color: "var(--ph-text-60)",
        }}
      >
        {locale.toUpperCase()}
      </span>
      {sourceLabel && (
        <span className="sr-only">{sourceLabel}</span>
      )}
    </header>
  );
}

function FilterBar({
  accent,
  filter,
  setFilter,
  translations,
  gallery,
}: {
  accent: string;
  filter: CategoryKey;
  setFilter: (k: CategoryKey) => void;
  translations: PhCopy;
  gallery: Array<{ src: string; alt?: string }>;
}) {
  // Show only the categories that actually have entries, plus "All".
  const present = new Set<CategoryKey>(["all"]);
  gallery.forEach((g) => present.add(inferCategory(g.alt)));

  const pills: Array<{ key: CategoryKey; label: string }> = (
    [
      { key: "all", label: translations.filterAll },
      { key: "editorial", label: translations.filterEditorial },
      { key: "personal", label: translations.filterPersonal },
      { key: "commercial", label: translations.filterCommercial },
    ] as Array<{ key: CategoryKey; label: string }>
  ).filter(({ key }) => present.has(key));

  return (
    <div className="flex gap-2 overflow-x-auto px-6 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {pills.map(({ key, label }) => {
        const active = filter === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className="ph-eyebrow shrink-0 rounded-full border px-4 py-2 transition-all"
            style={{
              borderColor: active ? accent : "var(--ph-text-30)",
              background: active ? accent : "transparent",
              color: active ? "#0e0e0e" : "var(--ph-text-60)",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function PortfolioGrid({
  items,
  onOpenLightbox,
  accent,
}: {
  items: Array<{ src: string; alt?: string }>;
  onOpenLightbox: (i: number) => void;
  accent: string;
}) {
  if (items.length === 0) return null;
  // Masonry-ish using CSS columns. Two cols at 375 px, three at sm+.
  return (
    <div className="px-1 pb-1" style={{ columnCount: 2, columnGap: "4px" }}>
      {items.map((item, i) => (
        <button
          key={`${item.src}-${i}`}
          type="button"
          onClick={() => onOpenLightbox(i)}
          className="group relative mb-1 block w-full overflow-hidden rounded-[2px]"
          style={{ breakInside: "avoid" }}
          aria-label={item.alt ?? `Photo ${i + 1}`}
        >
          <Image
            src={resolveAssetUrl(item.src) ?? item.src}
            alt={item.alt ?? ""}
            width={400}
            height={i % 3 === 0 ? 540 : i % 3 === 1 ? 400 : 480}
            unoptimized
            sizes="(max-width: 460px) 50vw, 230px"
            className="w-full transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <span
            className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <span
              className="ph-eyebrow"
              style={{ color: accent }}
            >
              {item.alt ?? "·"}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

function SectionEyebrow({
  label,
  accent,
}: {
  label: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 px-6 pt-7">
      <span
        aria-hidden
        className="block h-px w-6"
        style={{ background: accent }}
      />
      <span
        className="ph-eyebrow"
        style={{ color: accent }}
      >
        {label}
      </span>
      <span
        aria-hidden
        className="block h-px flex-1"
        style={{ background: "var(--ph-line)" }}
      />
    </div>
  );
}

function TestimonialCard({
  item,
  accent,
}: {
  item: { author: string; role?: string; quote: string };
  accent: string;
}) {
  return (
    <figure
      className="rounded-md p-4"
      style={{
        background: "var(--ph-card)",
        border: "1px solid var(--ph-line)",
      }}
    >
      <Quote
        size={16}
        strokeWidth={1.4}
        style={{ color: accent, marginBottom: 8 }}
      />
      <blockquote
        className="text-[13.5px] leading-snug"
        style={{ color: "var(--ph-text-90)" }}
      >
        &ldquo;{item.quote}&rdquo;
      </blockquote>
      <figcaption
        className="ph-mono mt-3 text-[10.5px] font-bold"
        style={{ color: accent, letterSpacing: "0.04em" }}
      >
        {item.author}
        {item.role && (
          <span
            className="ph-eyebrow ml-2 font-normal"
            style={{ color: "var(--ph-text-30)" }}
          >
            · {item.role}
          </span>
        )}
      </figcaption>
      <div
        className="mt-2 flex items-center gap-0.5"
        style={{ color: accent }}
        aria-label="5 of 5 stars"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={9} strokeWidth={1.4} fill="currentColor" />
        ))}
      </div>
    </figure>
  );
}

function ReelStrip({
  url,
  accent,
  label,
}: {
  url: string;
  accent: string;
  label: string;
}) {
  return (
    <section className="px-6 py-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 rounded-md px-5 py-4 transition-all hover:-translate-y-px"
        style={{
          background: "var(--ph-card)",
          border: `1px solid ${accent}40`,
        }}
      >
        <PlayCircle
          size={26}
          strokeWidth={1.4}
          style={{ color: accent }}
        />
        <span className="ph-mono text-[13px] font-bold text-[#fafafa]">
          {label}
        </span>
      </a>
    </section>
  );
}

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
    <section className="px-6 py-7">
      <SendMyInfoSlot slug={slug} sourceQs={sourceQs} primary={primary} />
      <ExchangeSlot slug={slug} primary={accent} locale={locale} />
    </section>
  );
}

function Footer({
  siteUrl,
  slug,
  accent,
  impressumUrl,
  privacyUrl,
  translations,
}: {
  siteUrl: string;
  slug: string;
  accent: string;
  impressumUrl?: string;
  privacyUrl?: string;
  translations: PhCopy;
}) {
  return (
    <footer
      className="border-t px-6 py-6"
      style={{ borderColor: "var(--ph-line)" }}
    >
      <div
        className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10.5px]"
        style={{ color: "var(--ph-text-30)" }}
      >
        <FooterShare siteUrl={siteUrl} slug={slug} label={translations.share} />
        {impressumUrl && (
          <a
            href={impressumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--ph-text-90)]"
          >
            {translations.impressum}
          </a>
        )}
        {privacyUrl && (
          <a
            href={privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--ph-text-90)]"
          >
            {translations.privacy}
          </a>
        )}
        <span className="ml-auto inline-flex items-center gap-1.5">
          {translations.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            className="ph-mono font-bold"
            style={{ color: accent }}
          >
            OpSolid
          </a>
        </span>
      </div>
      <div
        className="ph-eyebrow mt-3"
        style={{ color: "var(--ph-text-30)" }}
      >
        © {new Date().getFullYear()} · ALL RIGHTS RESERVED
      </div>
    </footer>
  );
}

function FooterShare({
  siteUrl,
  slug,
  label,
}: {
  siteUrl: string;
  slug: string;
  label: string;
}) {
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
            // ignore
          }
        }
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        }
      }}
      className="hover:text-[var(--ph-text-90)]"
    >
      {label}
    </button>
  );
}

// =============================================================================
// Registry entry & sample
// =============================================================================

export const photographerEntry: TemplateRegistryEntry = {
  id: 4,
  key: "photographer",
  name: "Photographer",
  industry: "Fine-art / commercial photographer",
  Component: Photographer,
  supports: {
    services: false,
    faqs: false,
    testimonials: true,
    gallery: true,
    video: true,
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
  sampleSlug: "demo-photographer",
};

// Sample persona — Sera Aydın, Istanbul fine-art portrait photographer.
// All gallery photos: Unsplash License, listed below per index.
export const photographerSample: SampleData = {
  templateId: 4,
  slug: "demo-photographer",
  cardData: {
    name: "Sera Aydın",
    title: "Photographer",
    position: "Fine-art portraiture & commercial",
    company: "photography",
    email: "studio@seraaydin.co",
    phone: "+90 533 211 4408",
    whatsapp: "+90 533 211 4408",
    website: "https://seraaydin.co",
    address: "Karaköy, Beyoğlu, İstanbul, Türkiye",
    bio:
      "Istanbul-based portrait and editorial photographer. Eight years across Vogue Türkiye, GQ, Bant Mag and a handful of fashion houses I'd rather not name in case I'm working with them again. Studio in Karaköy. Available for editorial, look-book and slow-burning personal projects. I prefer film when the brief allows and natural light always.",
    bookingUrl: "https://cal.com/seraaydin/booking",
    impressumUrl: "https://seraaydin.co/imprint",
    privacyUrl: "https://seraaydin.co/privacy",
    videoUrl: "https://vimeo.com/76979871",
    sectorKey: "creator",
    testimonials: [
      {
        author: "Cansu Erol",
        role: "Editor in Chief, Bant Mag",
        quote:
          "Sera doesn't direct — she watches. The portraits arrive already true to the subject.",
      },
      {
        author: "Dino Tasselli",
        role: "Creative Director, Maison Levi",
        quote:
          "We hire fast and then hold our breath. With Sera you can let the breath out.",
      },
    ],
    gallery: [
      {
        // photo: Unsplash — Anastasia Vityukova
        // https://unsplash.com/photos/aJwWqJ-xPwY (Unsplash License)
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
        alt: "Editorial · Cosmos Issue 04",
      },
      {
        // photo: Unsplash — Houcine Ncib
        // https://unsplash.com/photos/M9-ZkjDPXLY (Unsplash License)
        src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
        alt: "Personal · Beyoğlu, June",
      },
      {
        // photo: Unsplash — Christopher Campbell
        // https://unsplash.com/photos/rDEOVtE7vOs (Unsplash License)
        src: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80",
        alt: "Editorial · Vogue Türkiye Sept 2024",
      },
      {
        // photo: Unsplash — Alexander Krivitskiy
        // https://unsplash.com/photos/UVvJkHbyXjk (Unsplash License)
        src: "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=600&q=80",
        alt: "Commercial · Maison Levi SS25",
      },
      {
        // photo: Unsplash — Joel Mott
        // https://unsplash.com/photos/G8aRvjs5Spo (Unsplash License)
        src: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=600&q=80",
        alt: "Personal · Saturday afternoon",
      },
      {
        // photo: Unsplash — Robin Worrall
        // https://unsplash.com/photos/yKDuB1qVDsw (Unsplash License)
        src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
        alt: "Editorial · Bant Mag Issue 89",
      },
      {
        // photo: Unsplash — Nathan Dumlao
        // https://unsplash.com/photos/-FT7dEr1pog (Unsplash License)
        src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80",
        alt: "Commercial · Coffee brand campaign",
      },
      {
        // photo: Unsplash — Fares Hamouche
        // https://unsplash.com/photos/9B7lVD_BxXk (Unsplash License)
        src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80",
        alt: "Personal · Studio test, 35mm",
      },
    ],
    socials: {
      instagram: "https://instagram.com/seraaydin.studio",
      x: "https://x.com/seraaydin",
      linkedin: "https://linkedin.com/in/seraaydin",
    },
  },
  // photo: Unsplash — Christina @ wocintechchat.com
  // https://unsplash.com/photos/0Zx1bDv5BNY (Unsplash License)
  photoUrl:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
