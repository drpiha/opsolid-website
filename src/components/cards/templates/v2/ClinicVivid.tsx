"use client";

// =============================================================================
// ClinicVivid — v2 template (id=70, key="clinic-vivid").
//
// Sector: Doctor / Clinic — VIVID variant. Mood: modern health-tech, bold
// teal-to-turquoise gradient, rounded geometry, Poppins display.
// Inspired by kart_05_doktor_vivid.html.
//
// Design DNA (different from default Clinic.tsx):
//   - 200px gradient hero with circle decorations + tag pill + clinic strip.
//   - Floating profile card overlapping hero with name/role/badges.
//   - 3-up rounded stat tiles below profile.
//   - Big online-CTA gradient block (book WhatsApp).
//   - Specialty 2×2 grid of soft-tinted icon tiles.
//   - Hours block with today highlight.
//   - Testimonial card with gradient quote glyph.
//   - 2×2 contact grid with colored icon chips.
//   - QR-style gradient block.
// =============================================================================

import * as React from "react";
import Image from "next/image";
import { Calendar, Heart, Mail, MapPin, MessageCircle, Phone, Stethoscope } from "lucide-react";

import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#0891b2";
const LOCKED_ACCENT = "#22d3ee";
const PAGE = "#f0f5fb";
const SURFACE = "#ffffff";
const INK = "#0f172a";
const INK_SOFT = "#64748b";
const GREEN = "#06d6a0";
const BLUE = "#0f4c75";

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
  heroTag: string;
  yearsLabel: string;
  patientsLabel: string;
  satisfactionLabel: string;
  servicesH: string;
  testimonialsH: string;
  contactH: string;
  bookH: string;
  bookSub: string;
  bookBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
}

const COPY: Record<"de" | "en" | "tr", Copy> = {
  de: {
    heroTag: "Allgemeinmedizin · Berlin",
    yearsLabel: "Jahre",
    patientsLabel: "Patienten",
    satisfactionLabel: "Zufrieden",
    servicesH: "Leistungen",
    testimonialsH: "Stimmen",
    contactH: "Kontakt",
    bookH: "Online-Termin",
    bookSub: "WhatsApp · schneller Antwort, sofortige Bestätigung.",
    bookBtn: "Termin anfragen",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
  },
  en: {
    heroTag: "Family medicine · Berlin",
    yearsLabel: "Years",
    patientsLabel: "Patients",
    satisfactionLabel: "Satisfied",
    servicesH: "Services",
    testimonialsH: "Testimonials",
    contactH: "Contact",
    bookH: "Online booking",
    bookSub: "WhatsApp — fast reply, instant confirmation.",
    bookBtn: "Request appointment",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
  },
  tr: {
    heroTag: "Aile Hekimliği · Berlin",
    yearsLabel: "Yıl",
    patientsLabel: "Hasta",
    satisfactionLabel: "Memnun",
    servicesH: "Hizmetler",
    testimonialsH: "Hasta Sesi",
    contactH: "İletişim",
    bookH: "Online Randevu",
    bookSub: "WhatsApp üzerinden hızlı randevu, anında onay.",
    bookBtn: "Randevu Al",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
  },
};

const TILE_TINTS = [
  { bg: "rgba(8,145,178,0.12)", color: "#0891b2" },
  { bg: "rgba(6,214,160,0.12)", color: "#08a87f" },
  { bg: "rgba(15,76,117,0.12)", color: BLUE },
  { bg: "rgba(245,166,35,0.12)", color: "#f5a623" },
  { bg: "rgba(233,69,96,0.12)", color: "#e94560" },
  { bg: "rgba(34,211,238,0.12)", color: "#22d3ee" },
];

export function ClinicVivid({
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
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);
  const phoneDigits = cardData.phone ? digitsOnly(cardData.phone) : "";
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";

  const services = (cardData.services ?? []).slice(0, 6);
  const testimonial = cardData.testimonials?.[0];
  const cityFromAddress = cardData.address?.split(",").slice(-1)[0]?.trim();
  const HERO_GRAD = `linear-gradient(135deg, ${BLUE} 0%, ${primary} 50%, ${GREEN} 100%)`;

  return (
    <article
      data-template="clinic-vivid"
      className="cvivid-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: PAGE, color: INK }}
    >
      <style jsx global>{`
        .cvivid-card {
          font-family: var(--tpl-font-body, 'Open Sans', 'Inter', system-ui, sans-serif);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .cvivid-card .display {
          font-family: var(--tpl-font-display, 'Poppins', 'Inter', sans-serif);
        }
        .cvivid-card a { color: inherit; }
      `}</style>

      {/* HERO */}
      <header
        className="relative h-[200px] overflow-hidden"
        style={{ background: HERO_GRAD }}
      >
        <span
          aria-hidden
          className="absolute"
          style={{
            top: -40,
            right: -40,
            width: 180,
            height: 180,
            border: "3px solid rgba(255,255,255,0.12)",
            borderRadius: "50%",
          }}
        />
        <span
          aria-hidden
          className="absolute"
          style={{
            bottom: 30,
            left: -30,
            width: 80,
            height: 80,
            border: "2px solid rgba(255,255,255,0.15)",
            borderRadius: "50%",
          }}
        />
        <div className="absolute left-6 top-6 text-white">
          <div
            className="display mb-2 inline-block px-2.5 py-1 text-[10px] font-semibold uppercase"
            style={{
              background: "rgba(255,255,255,0.2)",
              borderRadius: 999,
              letterSpacing: "1.5px",
            }}
          >
            {t.heroTag}
          </div>
          <div
            className="display text-[14px] font-medium opacity-95"
            style={{ color: "#ffffff" }}
          >
            {cardData.company}
            {cityFromAddress && ` · ${cityFromAddress}`}
          </div>
        </div>
      </header>

      {/* FLOATING PROFILE CARD */}
      <div
        className="relative z-10 mx-4"
        style={{ marginTop: -90 }}
      >
        <div
          className="grid items-center gap-[18px] p-6"
          style={{
            background: SURFACE,
            borderRadius: 24,
            gridTemplateColumns: "88px 1fr",
            boxShadow: "0 20px 60px -20px rgba(15,76,117,0.3)",
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              padding: 3,
              borderRadius: "50%",
              background: HERO_GRAD,
            }}
          >
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={cardData.name}
                width={88}
                height={88}
                unoptimized
                className="block h-full w-full rounded-full object-cover"
                style={{ border: `3px solid ${SURFACE}` }}
              />
            ) : (
              <div
                className="display flex h-full w-full items-center justify-center rounded-full text-[24px] font-bold"
                style={{ background: SURFACE, color: primary, border: `3px solid ${SURFACE}` }}
              >
                {cardData.name
                  .replace(/^(Dr\.?|Prof\.?)\s+/i, "")
                  .split(" ")
                  .map((p) => p[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h1
              className="display mb-1 truncate text-[22px] font-bold leading-[1.1]"
              style={{ color: INK }}
            >
              {cardData.name}
            </h1>
            {(cardData.title || cardData.position) && (
              <div
                className="mb-2 text-[12.5px] font-semibold"
                style={{ color: primary }}
              >
                {cardData.title || cardData.position}
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              <Badge primary={primary} green={GREEN}>M.D.</Badge>
              <Badge primary={primary} green={GREEN} variant="green">PhD</Badge>
              <Badge primary={primary} green={GREEN}>12y+</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="mx-4 mt-5 grid grid-cols-3 gap-2.5">
        {[
          { num: "12", label: t.yearsLabel },
          { num: "3.2K+", label: t.patientsLabel },
          { num: "98%", label: t.satisfactionLabel },
        ].map((s, i) => (
          <div
            key={i}
            className="rounded-2xl px-3 py-[18px] text-center"
            style={{
              background: SURFACE,
              boxShadow: "0 4px 16px -4px rgba(15,76,117,0.08)",
            }}
          >
            <div
              className="display mb-1.5 text-[24px] font-extrabold leading-none"
              style={{
                background: HERO_GRAD,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {s.num}
            </div>
            <div
              className="text-[10px] font-semibold uppercase"
              style={{ color: INK_SOFT, letterSpacing: "0.5px" }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* SERVICES GRID */}
      {services.length > 0 && (
        <section className="mx-4 mt-7">
          <SectionHead green={GREEN}>{t.servicesH}</SectionHead>
          <div className="grid grid-cols-2 gap-3">
            {services.map((svc, i) => {
              const tint = TILE_TINTS[i % TILE_TINTS.length];
              return (
                <div
                  key={`${svc.title}-${i}`}
                  className="rounded-2xl p-[18px]"
                  style={{
                    background: SURFACE,
                    boxShadow: "0 4px 16px -4px rgba(15,76,117,0.08)",
                  }}
                >
                  <div
                    className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-[10px]"
                    style={{ background: tint.bg, color: tint.color }}
                  >
                    {i % 2 === 0 ? (
                      <Heart size={18} strokeWidth={2} />
                    ) : (
                      <Stethoscope size={18} strokeWidth={2} />
                    )}
                  </div>
                  <div
                    className="display mb-1 text-[13px] font-semibold leading-tight"
                    style={{ color: INK }}
                  >
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div
                      className="text-[11px] leading-tight"
                      style={{ color: INK_SOFT }}
                    >
                      {svc.description}
                    </div>
                  )}
                  {svc.priceLabel && (
                    <div
                      className="display mt-2 text-[11px] font-bold"
                      style={{ color: tint.color }}
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

      {/* BIG ONLINE CTA */}
      <div
        className="relative mx-4 mt-7 overflow-hidden p-6 text-center text-white"
        style={{
          background: HERO_GRAD,
          borderRadius: 20,
          boxShadow: "0 12px 32px -8px rgba(15,76,117,0.4)",
        }}
      >
        <span
          aria-hidden
          className="absolute"
          style={{
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            border: "2px solid rgba(255,255,255,0.15)",
            borderRadius: "50%",
          }}
        />
        <h3 className="display relative mb-1.5 text-[18px] font-bold">{t.bookH}</h3>
        <p className="relative mb-4 text-[13px] opacity-90">{t.bookSub}</p>
        {(cardData.bookingUrl || waDigits) && (
          <a
            href={
              cardData.bookingUrl ||
              `https://wa.me/${waDigits}?text=${encodeURIComponent(t.bookBtn)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="display relative inline-flex items-center gap-2 px-7 py-3.5 text-[13.5px] font-bold"
            style={{
              background: SURFACE,
              color: BLUE,
              borderRadius: 999,
            }}
          >
            <Calendar size={14} strokeWidth={2.4} />
            {t.bookBtn}
          </a>
        )}
      </div>

      {/* TESTIMONIAL */}
      {testimonial && (
        <div
          className="relative mx-4 mt-7 px-6 py-7"
          style={{
            background: SURFACE,
            borderLeft: `4px solid ${GREEN}`,
            borderRadius: 20,
            boxShadow: "0 4px 16px -4px rgba(15,76,117,0.08)",
          }}
        >
          <span
            aria-hidden
            className="display absolute"
            style={{
              top: -12,
              left: 18,
              fontSize: 80,
              fontWeight: 800,
              lineHeight: 1,
              background: HERO_GRAD,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {"“"}
          </span>
          <p
            className="mb-3 text-[14.5px] font-medium leading-[1.6]"
            style={{ color: INK }}
          >
            {testimonial.quote}
          </p>
          <div
            className="display text-[11.5px] font-bold uppercase"
            style={{ color: primary, letterSpacing: "0.5px" }}
          >
            — {testimonial.author}
            {testimonial.role ? ` · ${testimonial.role}` : ""}
          </div>
        </div>
      )}

      {/* CONTACT GRID */}
      <section className="mx-4 mt-7">
        <SectionHead green={GREEN}>{t.contactH}</SectionHead>
        <div className="grid grid-cols-2 gap-2.5">
          {phoneDigits && (
            <ContactTile
              href={`tel:${phoneDigits}`}
              Icon={Phone}
              label={cardData.phone || ""}
              keyLabel={t.contactH}
              gradient="linear-gradient(135deg,#06d6a0,#08a87f)"
            />
          )}
          {cardData.email && (
            <ContactTile
              href={`mailto:${cardData.email}`}
              Icon={Mail}
              label={cardData.email}
              keyLabel="E-Mail"
              gradient={`linear-gradient(135deg, ${primary}, ${BLUE})`}
            />
          )}
          {cardData.address && (
            <ContactTile
              href={`https://maps.google.com/?q=${encodeURIComponent(cardData.address)}`}
              Icon={MapPin}
              label={cityFromAddress || cardData.address}
              keyLabel="Adress"
              gradient="linear-gradient(135deg,#f5a623,#e94560)"
              external
            />
          )}
          {waDigits && (
            <ContactTile
              href={`https://wa.me/${waDigits}`}
              Icon={MessageCircle}
              label="WhatsApp"
              keyLabel="Chat"
              gradient={`linear-gradient(135deg, ${accent}, ${primary})`}
              external
            />
          )}
        </div>
      </section>

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="mx-4 mt-7 rounded-2xl px-6 py-6"
        style={{
          background: SURFACE,
          boxShadow: "0 4px 16px -4px rgba(15,76,117,0.08)",
        }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={primary} locale={locale} />
        <ExchangeSlot slug={slug} primary={primary} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="mx-4 mt-4 rounded-2xl px-6 py-6"
          labelClassName="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-center"
        >
          <div
            style={{
              ["--card-primary" as string]: primary,
              background: SURFACE,
              borderRadius: 16,
            }}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {cardData.socials && (
        <section
          className="mx-4 mt-4 rounded-2xl px-6 py-5"
          style={{
            background: SURFACE,
            boxShadow: "0 4px 16px -4px rgba(15,76,117,0.08)",
          }}
        >
          <SocialRow socials={cardData.socials} variant="icon" accentHex={primary} />
        </section>
      )}

      {/* FOOTER */}
      <footer
        className="px-4 py-7 text-center text-[11px] font-medium"
        style={{ color: INK_SOFT }}
      >
        © {new Date().getFullYear()} {cardData.company || cardData.name} · {t.poweredBy}{" "}
        <a
          href="https://opsolid.de/products/digital-card"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: primary, fontWeight: 700 }}
        >
          OpSolid
        </a>
      </footer>
    </article>
  );
}

function SectionHead({
  children,
  green,
}: {
  children: React.ReactNode;
  green: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5 px-1">
      <span
        aria-hidden
        className="block"
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: green,
          boxShadow: `0 0 0 4px ${green}33`,
        }}
      />
      <h2
        className="display text-[18px] font-bold"
        style={{ color: INK }}
      >
        {children}
      </h2>
    </div>
  );
}

function Badge({
  children,
  primary,
  green: _green,
  variant,
}: {
  children: React.ReactNode;
  primary: string;
  green: string;
  variant?: "green";
}) {
  return (
    <span
      className="display inline-flex items-center px-2 py-[3px] text-[9.5px] font-bold uppercase"
      style={{
        borderRadius: 999,
        background:
          variant === "green" ? "rgba(6,214,160,0.12)" : `${primary}1a`,
        color: variant === "green" ? "#08a87f" : primary,
        letterSpacing: "0.5px",
      }}
    >
      {children}
    </span>
  );
}

function ContactTile({
  href,
  Icon,
  label,
  keyLabel,
  gradient,
  external,
}: {
  href: string;
  Icon: typeof Phone;
  label: string;
  keyLabel: string;
  gradient: string;
  external?: boolean;
}) {
  const ext = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  return (
    <a
      href={href}
      {...ext}
      className="flex items-center gap-2.5 p-3.5"
      style={{
        background: SURFACE,
        borderRadius: 14,
        boxShadow: "0 4px 16px -4px rgba(15,76,117,0.08)",
        textDecoration: "none",
      }}
    >
      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-white"
        style={{ background: gradient, borderRadius: 10 }}
      >
        <Icon size={16} strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className="display text-[9.5px] font-semibold uppercase leading-tight"
          style={{ color: INK_SOFT, letterSpacing: "0.5px" }}
        >
          {keyLabel}
        </div>
        <div
          className="display truncate text-[12px] font-semibold leading-tight"
          style={{ color: INK }}
        >
          {label}
        </div>
      </div>
    </a>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const clinicVividEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 70,
  key: "clinic-vivid",
  name: "Clinic — Vivid",
  industry: "Doctor / Health-tech clinic",
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
    brandPrimaryHex: "#0891b2",
    brandAccentHex: "#22d3ee",
  },
  sampleSlug: "demo-clinic-vivid",
};

// photo: Unsplash, doctor portrait. Unsplash License — free, no attribution required.
export const clinicVividSample: SampleData = {
  templateId: 70,
  slug: "demo-clinic-vivid",
  cardData: {
    name: "Dr. Ayşe Demir",
    position: "Fachärztin",
    title: "Allgemeinmedizin & Präventivmedizin",
    company: "Praxis am Ku'damm",
    email: "ayse@praxis-demir.de",
    phone: "+49 30 334 5678",
    whatsapp: "+49 170 334 5678",
    website: "praxis-demir.de",
    address: "Kurfürstendamm 188, 10707 Berlin",
    bio: "Fachärztin für Allgemeinmedizin & Präventivmedizin. Individuell, ganzheitlich, digital erreichbar.",
    bookingUrl: "https://cal.com/praxis-demir/intro",
    brochureUrl: "https://praxis-demir.de/profil.pdf",
    impressumUrl: "https://praxis-demir.de/impressum",
    privacyUrl: "https://praxis-demir.de/datenschutz",
    sectorKey: "clinic",
    socials: {
      linkedin: "https://linkedin.com/in/ayse-demir-md",
      instagram: "https://instagram.com/praxis.demir",
    },
    services: [
      { title: "Vorsorge", description: "Check-up & Labor", priceLabel: "ab €80" },
      { title: "Reisemedizin", description: "Impfung & Beratung", priceLabel: "€120" },
      { title: "Online", description: "Videosprechstunde", priceLabel: "€60" },
      { title: "Hausbesuch", description: "Premium-Service", priceLabel: "€180" },
    ],
    testimonials: [
      {
        author: "Mehmet K.",
        role: "Patient",
        quote:
          "Sehr aufmerksam, nimmt sich Zeit und erklärt alles verständlich.",
      },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: "#0891b2",
  brandAccentHex: "#22d3ee",
};
