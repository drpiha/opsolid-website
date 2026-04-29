"use client";

// =============================================================================
// ContentCreator — v2 template (id=37, key="content-creator").
//
// Sector: Influencer / content creator / YouTuber — DEFAULT variant. Mood:
// warm orange/coral hero with bold display name, gigantic follower count,
// red record-dot pulse, social-media energy. Inspired by
// kart_16_icerik_uretici.html.
//
// Locked design DNA (only colors respond to brand):
//   - Hero: warm gradient panel (primary → coral → near-black) with subtle
//     ring decoration top-right and amber glow bottom-left; "LIVE" pill,
//     huge bold display name, channel handle, and giant follower count.
//   - Profile strip floats over hero (-36 px) with 72 px round avatar +
//     white card chip showing role + niche.
//   - Quick contact row: 3 outline pill buttons (DM · Mail · Web).
//   - Platforms grid: 3 platform cards (IG · TikTok · YouTube) each with
//     follower count + handle.
//   - Bio paragraph in serif feel.
//   - Collab packages list (services).
//   - CTA: amber gradient "Let's collab".
// =============================================================================

import * as React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#f97316";
const LOCKED_ACCENT = "#fbbf24";
const PRIMARY_DEEP = "#c2410c";
const DARK = "#1a1a2e";
const PAGE = "#f4f5f9";
const SURFACE = "#ffffff";
const INK = "#111827";
const INK_SOFT = "#6b7280";
const HAIRLINE = "#e5e7eb";

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

function platformHandleFromUrl(url: string | undefined, fallback: string): string {
  if (!url) return fallback;
  const m = url.replace(/\/$/, "").split("/").pop();
  return m && m.startsWith("@") ? m : m ? `@${m}` : fallback;
}

interface CcCopy {
  live: string;
  followers: string;
  collab: string;
  callDm: string;
  email: string;
  web: string;
  about: string;
  platforms: string;
  collabPackages: string;
  contact: string;
  saveContact: string;
  walletLabel: string;
  share: string;
  poweredBy: string;
  partnerCta: string;
  totalReach: string;
  niche: string;
  nicheValue: string;
}

const COPY: Record<"de" | "en" | "tr", CcCopy> = {
  de: {
    live: "On Air",
    followers: "Follower",
    collab: "DM",
    callDm: "DM senden",
    email: "Booking",
    web: "Website",
    about: "Über mich",
    platforms: "Plattformen",
    collabPackages: "Collab-Pakete",
    contact: "Kontakt",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    share: "Teilen",
    poweredBy: "Powered by",
    partnerCta: "Lass uns zusammenarbeiten",
    totalReach: "Gesamtreichweite",
    niche: "Niche",
    nicheValue: "Lifestyle · Travel",
  },
  en: {
    live: "On Air",
    followers: "Followers",
    collab: "DM",
    callDm: "Send DM",
    email: "Booking",
    web: "Website",
    about: "About",
    platforms: "Platforms",
    collabPackages: "Collab packages",
    contact: "Contact",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    share: "Share",
    poweredBy: "Powered by",
    partnerCta: "Let's collab",
    totalReach: "Total reach",
    niche: "Niche",
    nicheValue: "Lifestyle · Travel",
  },
  tr: {
    live: "Yayında",
    followers: "Takipçi",
    collab: "DM",
    callDm: "DM Gönder",
    email: "Booking",
    web: "Website",
    about: "Hakkımda",
    platforms: "Platformlar",
    collabPackages: "İş Birliği Paketleri",
    contact: "İletişim",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    share: "Paylaş",
    poweredBy: "Powered by",
    partnerCta: "Hadi Birlikte Çalışalım",
    totalReach: "Toplam Erişim",
    niche: "Alan",
    nicheValue: "Lifestyle · Travel",
  },
};

export function ContentCreator({
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

  const igHandle = platformHandleFromUrl(cardData.socials?.instagram, "@creator");
  const tikHandle = platformHandleFromUrl(cardData.socials?.tiktok, "@creator");
  const ytHandle = platformHandleFromUrl(cardData.socials?.youtube, "@creator");

  const year = new Date().getFullYear();

  return (
    <article
      data-template="content-creator"
      className="cc-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{
        background: SURFACE,
        color: INK,
        boxShadow: "0 14px 40px rgba(15,15,26,0.16)",
      }}
    >
      <style jsx global>{`
        .cc-card {
          font-family: var(--tpl-font-body, 'Poppins', 'Inter', system-ui, sans-serif);
          line-height: 1.6;
        }
        .cc-card .display { font-family: var(--tpl-font-display, 'Poppins', system-ui, sans-serif); }
        .cc-card a { color: inherit; }
        @keyframes cc-pulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
      `}</style>

      {/* HERO */}
      <header
        className="relative overflow-hidden px-7 pb-20 pt-12"
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, ${PRIMARY_DEEP} 30%, ${DARK} 100%)`,
          color: "#fff",
        }}
      >
        {/* Decorative ring top-right */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full"
          style={{ border: "1px solid rgba(255,255,255,0.14)" }}
        />
        {/* Amber glow bottom-left */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full"
          style={{
            background: `radial-gradient(circle, ${accent}33, transparent 65%)`,
          }}
        />

        <div className="relative">
          {/* LIVE pill */}
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase backdrop-blur-sm"
            style={{
              background: "rgba(255,255,255,0.12)",
              borderColor: "rgba(255,255,255,0.22)",
              color: "#fff",
              letterSpacing: "1.5px",
            }}
          >
            <span
              className="block h-2 w-2 rounded-full"
              style={{
                background: "#ff4444",
                boxShadow: "0 0 0 3px rgba(255,68,68,0.3)",
                animation: "cc-pulse 1.6s ease-in-out infinite",
              }}
            />
            {t.live}
          </div>

          {/* Display name */}
          <h1
            className="display mt-4 text-[30px] font-extrabold leading-[1.05] tracking-[-0.6px]"
            style={{ color: "#fff" }}
          >
            {cardData.name}
          </h1>
          <div
            className="mt-1.5 text-[14px] font-medium"
            style={{ color: "rgba(255,255,255,0.82)" }}
          >
            {cardData.company || cardData.title || "Content Creator"}
          </div>

          {/* Mega follower count */}
          <div className="mt-7 flex items-baseline gap-3">
            <div
              className="text-[52px] font-extrabold leading-none tracking-[-2px]"
              style={{ color: accent }}
            >
              120K
            </div>
            <div
              className="text-[12px] font-medium uppercase"
              style={{ color: "rgba(255,255,255,0.78)", letterSpacing: "1.5px" }}
            >
              {t.followers}
            </div>
          </div>
          <div
            className="mt-1.5 text-[12.5px]"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {t.totalReach} · 3.5M{" "}
            <span style={{ color: accent, fontWeight: 600 }}>
              monthly views
            </span>
          </div>
        </div>
      </header>

      {/* PROFILE STRIP overlapping */}
      <section
        className="relative z-10 -mt-10 flex items-center gap-4 px-7"
      >
        <div className="relative flex-shrink-0">
          <div
            className="relative h-[72px] w-[72px] overflow-hidden rounded-full"
            style={{
              border: `4px solid ${SURFACE}`,
              boxShadow: "0 6px 20px rgba(0,0,0,0.16)",
              background: PAGE,
            }}
          >
            {photoUrl ? (
              <Image src={photoUrl} alt="" fill sizes="72px" unoptimized className="object-cover" />
            ) : (
              <div
                className="display flex h-full w-full items-center justify-center text-[22px] font-bold"
                style={{ color: primary }}
              >
                {initials}
              </div>
            )}
          </div>
        </div>
        <div
          className="min-w-0 flex-1 rounded-2xl px-4 py-3"
          style={{
            background: SURFACE,
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          }}
        >
          <div
            className="text-[12px] font-semibold uppercase"
            style={{ color: primary, letterSpacing: "0.6px" }}
          >
            {cardData.position?.split("·")[0]?.trim() || "Content Creator"}
          </div>
          <div className="mt-0.5 text-[13px]" style={{ color: INK_SOFT }}>
            {t.nicheValue}
          </div>
        </div>
      </section>

      {/* QUICK CONTACT */}
      <section className="grid grid-cols-3 gap-2.5 px-7 py-7">
        {(waDigits || phoneDigits) && (
          <CcAction
            href={waDigits ? `https://wa.me/${waDigits}` : `tel:${phoneDigits}`}
            external={!!waDigits}
            label={t.callDm}
            Icon={MessageCircle}
            primary={primary}
          />
        )}
        {cardData.email && (
          <CcAction
            href={`mailto:${cardData.email}`}
            label={t.email}
            Icon={Mail}
            primary={primary}
          />
        )}
        {cardData.website && (
          <CcAction
            href={cardData.website.startsWith("http") ? cardData.website : `https://${cardData.website}`}
            external
            label={t.web}
            Icon={Globe}
            primary={primary}
          />
        )}
      </section>

      {/* PLATFORMS GRID */}
      <section className="px-7 pt-2">
        <CcSectionTitle primary={primary}>{t.platforms}</CcSectionTitle>
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <PlatformCard
            label="Instagram"
            handle={igHandle}
            count="120K"
            color={primary}
            href={cardData.socials?.instagram}
          />
          <PlatformCard
            label="TikTok"
            handle={tikHandle}
            count="85K"
            color={DARK}
            href={cardData.socials?.tiktok}
          />
          <PlatformCard
            label="YouTube"
            handle={ytHandle}
            count="22K"
            color="#ff0000"
            href={cardData.socials?.youtube}
          />
        </div>
      </section>

      {/* BIO */}
      {cardData.bio && (
        <section className="px-7 pt-7">
          <CcSectionTitle primary={primary}>{t.about}</CcSectionTitle>
          <p
            className="mt-3 text-[14.5px] leading-[1.75]"
            style={{ color: INK_SOFT }}
          >
            {cardData.bio}
          </p>
        </section>
      )}

      {/* COLLAB PACKAGES */}
      {services.length > 0 && (
        <section className="px-7 pt-7">
          <CcSectionTitle primary={primary}>{t.collabPackages}</CcSectionTitle>
          <div
            className="mt-4 overflow-hidden rounded-2xl"
            style={{ background: PAGE, border: `1px solid ${HAIRLINE}` }}
          >
            {services.slice(0, 5).map((svc, i, arr) => (
              <div
                key={`${svc.title}-${i}`}
                className="flex items-center gap-3 px-4 py-3.5"
                style={{
                  borderBottom: i < arr.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                  background: SURFACE,
                }}
              >
                <span
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: `${primary}1a`,
                    color: primary,
                  }}
                >
                  <Sparkles size={16} strokeWidth={2.2} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-semibold" style={{ color: INK }}>
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div className="mt-0.5 text-[11.5px]" style={{ color: INK_SOFT }}>
                      {svc.description}
                    </div>
                  )}
                </div>
                {svc.priceLabel && (
                  <span
                    className="display whitespace-nowrap rounded-full px-3 py-1 text-[12px] font-extrabold"
                    style={{
                      background: `${primary}1a`,
                      color: primary,
                    }}
                  >
                    {svc.priceLabel}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* REACH / REVIEWS STRIP */}
      <section className="px-7 pt-7">
        <div
          className="flex items-center justify-between rounded-2xl px-4 py-3.5"
          style={{ background: PAGE, border: `1px solid ${HAIRLINE}` }}
        >
          <div className="flex items-center gap-2">
            <Users size={16} style={{ color: primary }} />
            <span className="text-[12.5px] font-semibold" style={{ color: INK }}>
              {t.totalReach}
            </span>
          </div>
          {testimonials.length > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex" style={{ color: accent }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <span className="text-[11.5px] font-bold" style={{ color: INK }}>
                {testimonials.length}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-7 pt-7">
        <a
          href={
            cardData.bookingUrl ||
            (waDigits ? `https://wa.me/${waDigits}` : `mailto:${cardData.email ?? ""}`)
          }
          target="_blank"
          rel="noopener noreferrer"
          className="display flex w-full items-center justify-center gap-2.5 rounded-2xl px-5 py-[18px] text-[15px] font-extrabold transition-all hover:-translate-y-0.5"
          style={{
            background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
            color: onPrimary,
            boxShadow: `0 18px 36px -10px ${primary}80`,
          }}
        >
          <Sparkles size={18} strokeWidth={2.2} />
          {t.partnerCta}
          <ArrowUpRight size={16} strokeWidth={2.4} />
        </a>
      </section>

      {/* CONTACT */}
      <section className="px-7 pt-7">
        <CcSectionTitle primary={primary}>{t.contact}</CcSectionTitle>
        <div className="mt-3">
          <ContactRows cardData={cardData} locale={locale} variant="hairline" accentHex={primary} />
        </div>
      </section>

      {/* SOCIAL ALL */}
      {cardData.socials && (
        <section className="px-7 pt-7">
          <SocialRow socials={cardData.socials} variant="pill" accentHex={primary} />
        </section>
      )}

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="mx-7 mt-7 rounded-3xl p-5"
        style={{ background: PAGE, border: `1px solid ${HAIRLINE}` }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={primary} locale={locale} />
        <ExchangeSlot slug={slug} primary={primary} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="mx-7 mt-4 rounded-3xl p-5"
          labelClassName="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-center"
        >
          <div style={{ ["--card-primary" as string]: primary, background: PAGE }}>
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer
        className="mt-7 px-7 py-7 text-center"
        style={{ borderTop: `1px solid ${HAIRLINE}` }}
      >
        <div
          className="display text-[13px] font-extrabold"
          style={{ color: primary }}
        >
          {cardData.name}
        </div>
        <div className="mt-1 text-[10.5px]" style={{ color: INK_SOFT }}>
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
        <div
          className="mt-2 inline-flex items-center gap-1.5 text-[10.5px]"
          style={{ color: INK_SOFT }}
        >
          <Shield size={11} strokeWidth={1.6} />
          {t.niche}: {t.nicheValue}
        </div>
      </footer>
    </article>
  );
}

function CcSectionTitle({
  children,
  primary,
}: {
  children: React.ReactNode;
  primary: string;
}) {
  return (
    <h2
      className="display flex items-center gap-3 text-[15px] font-extrabold"
      style={{ color: INK }}
    >
      <span
        aria-hidden
        className="block h-[3px] w-7 rounded-full"
        style={{ background: primary }}
      />
      {children}
    </h2>
  );
}

function CcAction({
  href,
  label,
  Icon,
  primary,
  external,
}: {
  href: string;
  label: string;
  Icon: typeof Phone;
  primary: string;
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
      className="flex items-center justify-center gap-1.5 rounded-2xl px-2 py-3 text-[12.5px] font-bold transition-all hover:-translate-y-0.5"
      style={{
        background: SURFACE,
        border: `1.5px solid ${primary}33`,
        color: primary,
      }}
    >
      <Icon size={15} strokeWidth={2.2} />
      {label}
    </a>
  );
}

function PlatformCard({
  label,
  handle,
  count,
  color,
  href,
}: {
  label: string;
  handle: string;
  count: string;
  color: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="text-[10.5px] font-semibold uppercase" style={{ color: INK_SOFT, letterSpacing: "1.2px" }}>
        {label}
      </div>
      <div
        className="display mt-2 text-[20px] font-extrabold leading-none"
        style={{ color: color }}
      >
        {count}
      </div>
      <div className="mt-1 truncate text-[10.5px]" style={{ color: INK_SOFT }}>
        {handle}
      </div>
    </>
  );
  const className =
    "block rounded-2xl px-3 py-4 text-center transition-all hover:-translate-y-0.5";
  const style: React.CSSProperties = {
    background: SURFACE,
    border: `1px solid ${HAIRLINE}`,
  };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {inner}
      </a>
    );
  }
  return (
    <div className={className} style={style}>
      {inner}
    </div>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const contentCreatorEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 37,
  key: "content-creator",
  name: "Content Creator",
  industry: "Influencer / content creator / YouTuber",
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
  sampleSlug: "demo-content-creator",
};

// photo: Unsplash, content creator portrait. Unsplash License — free, no attribution required.
export const contentCreatorSample: SampleData = {
  templateId: 37,
  slug: "demo-content-creator",
  cardData: {
    name: "Tuna Yılmaz",
    position: "Content Creator · Lifestyle & Travel",
    title: "120K · Instagram",
    company: "Tuna Yılmaz Media",
    email: "tuna@tunayilmaz.de",
    phone: "+49 178 556 7890",
    whatsapp: "+49 178 556 7890",
    website: "tunayilmaz.de",
    address: "Friedrichshain, Berlin",
    bio: "Lifestyle & Travel Content Creator. 120K Follower auf Instagram. Storytelling, das verkauft. Kooperationen ab €450 — schreib mir gerne eine DM.",
    bookingUrl: "https://cal.com/tunayilmaz/collab",
    sectorKey: "creator",
    services: [
      { title: "Instagram Post", description: "1× Feed + 3 Stories", priceLabel: "€450" },
      { title: "TikTok Video", description: "Konzept + Cut, 30–60s", priceLabel: "€380" },
      { title: "YouTube Integration", description: "60–90s Mention im Long-Form", priceLabel: "€800" },
      { title: "Story Series", description: "5-Story Take-Over · 24h", priceLabel: "€250" },
    ],
    socials: {
      instagram: "https://instagram.com/tunayilmaz",
      tiktok: "https://tiktok.com/@tunayilmaz",
      youtube: "https://youtube.com/@tunayilmaz",
      x: "https://x.com/tunayilmaz",
    },
  },
  photoUrl:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
