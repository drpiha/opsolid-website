"use client";

// =============================================================================
// FitnessStone — v2 template (id=91, key="fitness-stone").
//
// Sector: Fitness / personal training — STONE variant. Mood: outdoor / nature
// holistic coaching with sage-green warmth, Fraunces italic display + Nunito
// body. Inspired by kart_10_fitness_stone.html.
//
// Design DNA (different from Athlete.tsx id=10, FitnessNoir/Pure/Vivid):
//   - Sage gradient header with double-dot italic divider.
//   - Wave SVG transition into card surface.
//   - Centred 116px circular photo on cream halo with italic Fraunces name.
//   - Italic philosophy block referencing body / nutrition / mind.
//   - Stacked rounded service cards with green-gradient icon tile + price col.
//   - Numbered journey timeline (4 steps) with green→gold rule.
//   - Linen-gradient testimonial with avatar + result line.
//   - Pill-rounded contact rows + filled/outlined CTA pair.
// =============================================================================

import * as React from "react";
import Image from "next/image";

import { ContactRows } from "./shared/ContactRows";
import { ExchangeSlot } from "./shared/ExchangeSlot";
import { SendMyInfoSlot } from "./shared/SendMyInfoSlot";
import { SocialRow } from "./shared/SocialRow";
import { WalletDock } from "./shared/WalletDock";
import type { SampleData, TemplateProps, TemplateRegistryEntry } from "./types";

const LOCKED_PRIMARY = "#5c5040";
const LOCKED_ACCENT = "#c4a882";
const SURFACE = "#faf7f2";
const SURFACE_2 = "#f3eee2";
const INK = "#1f2a1d";
const GREEN = "#4a6741";
const GREEN_SOFT = "#6c8462";
const GOLD = "#c8a500";
const GOLD_SOFT = "#d9be3c";
const MUTE = "#748373";
const MUTE_2 = "#a3ada0";
const LINE = "#d8d4c5";
const LINE_SOFT = "#e3dfce";

const JOURNEY_KEYS = ["intro", "plan", "weekly", "habit"] as const;

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
  taglineFallback: string;
  atelierLabel: string;
  philLabel: string;
  servicesH: string;
  servicesSub: string;
  journeyH: string;
  journeySub: string;
  contactH: string;
  ctaPrimary: string;
  ctaSecondary: string;
  yearsLabel: string;
  transformationsLabel: string;
  igLabel: string;
  ytLabel: string;
  testiText: string;
  testiName: string;
  testiResult: string;
  bookBtn: string;
  saveContact: string;
  walletLabel: string;
  poweredBy: string;
  journey: Record<(typeof JOURNEY_KEYS)[number], { ttl: string; desc: string }>;
}

const COPY: Record<"de" | "en" | "tr", Copy> = {
  de: {
    taglineFallback: "Holistic Fitness Coach",
    atelierLabel: "Holistic · Berlin",
    philLabel: "Mein Ansatz",
    servicesH: "Service-Spektrum",
    servicesSub: "Einzel- und Gruppen-Coaching",
    journeyH: "Transformations-Reise",
    journeySub: "Schritt für Schritt gemeinsam",
    contactH: "Lass uns verbinden",
    ctaPrimary: "Kostenloses Gespräch",
    ctaSecondary: "WhatsApp",
    yearsLabel: "Jahre",
    transformationsLabel: "Transformationen",
    igLabel: "Instagram",
    ytLabel: "YouTube",
    testiText:
      "Cans Unterschied: keine Zahlen-Obsession sondern Gespür für den Körper. In 12 Wochen körperlich und mental neu geboren.",
    testiName: "Selin K.",
    testiResult: "12 Wochen · -14 kg, neues Selbstwertgefühl",
    bookBtn: "Termin reservieren",
    saveContact: "Kontakt speichern",
    walletLabel: "Auf Smartphone speichern",
    poweredBy: "Powered by",
    journey: {
      intro: { ttl: "Kostenlose Erst-Beratung", desc: "Wir verstehen deine Bedürfnisse und Ziele in einem 30-Minuten-Gespräch." },
      plan: { ttl: "Persönlicher Plan", desc: "Trainings- und Ernährungsplan, abgestimmt auf Lebensstil und Stoffwechsel." },
      weekly: { ttl: "Wöchentliches Check-in", desc: "Messung, Energie- und Stimmungs-Update — kurze Telefon-Sessions." },
      habit: { ttl: "Nachhaltige Gewohnheit", desc: "Mentale Werkzeuge für lebenslange Veränderung und Begleitung." },
    },
  },
  en: {
    taglineFallback: "Holistic Fitness Coach",
    atelierLabel: "Holistic · Berlin",
    philLabel: "My approach",
    servicesH: "Service Range",
    servicesSub: "1-1 and small-group coaching",
    journeyH: "Transformation Journey",
    journeySub: "Step by step together",
    contactH: "Let's connect",
    ctaPrimary: "Free intro call",
    ctaSecondary: "WhatsApp",
    yearsLabel: "Years",
    transformationsLabel: "Transformations",
    igLabel: "Instagram",
    ytLabel: "YouTube",
    testiText:
      "What set Can apart was the focus on how the body felt, not just the numbers. 12 weeks reborn — physically and mentally.",
    testiName: "Selin K.",
    testiResult: "12 weeks · -14 kg, regained self-respect",
    bookBtn: "Book appointment",
    saveContact: "Save contact",
    walletLabel: "Add to wallet",
    poweredBy: "Powered by",
    journey: {
      intro: { ttl: "Free intro call", desc: "We understand your needs and goals in a 30-minute conversation." },
      plan: { ttl: "Personal plan", desc: "Training + nutrition tailored to your lifestyle and metabolic profile." },
      weekly: { ttl: "Weekly check-in", desc: "Measurement, energy and mindset update on short calls." },
      habit: { ttl: "Sustainable habit", desc: "Mental tools and lifelong guidance for lasting change." },
    },
  },
  tr: {
    taglineFallback: "Holistic Fitness Coach",
    atelierLabel: "Holistic · İstanbul",
    philLabel: "Yaklaşımım",
    servicesH: "Hizmet Yelpazesi",
    servicesSub: "Bireysel ve grup koçluk programları",
    journeyH: "Dönüşüm Süreci",
    journeySub: "Adım adım birlikte ilerliyoruz",
    contactH: "Bağlantı Kuralım",
    ctaPrimary: "Ücretsiz Görüşme",
    ctaSecondary: "WhatsApp",
    yearsLabel: "Yıl",
    transformationsLabel: "Dönüşüm",
    igLabel: "Instagram",
    ytLabel: "YouTube",
    testiText:
      "Can'ın en büyük farkı sayılara değil bedensel hisse odaklanmasıydı. 12 haftada hem fiziksel hem zihinsel olarak yeniden doğdum.",
    testiName: "Selin K.",
    testiResult: "12 haftada -14 kg, kazanılmış öz-saygı",
    bookBtn: "Randevu Al",
    saveContact: "Kişiyi Kaydet",
    walletLabel: "Cüzdana ekle",
    poweredBy: "Powered by",
    journey: {
      intro: { ttl: "Ücretsiz Konsültasyon", desc: "İhtiyaçlarını ve hedeflerini birlikte anlıyoruz. 30 dakikalık tanışma görüşmesi." },
      plan: { ttl: "Kişisel Plan", desc: "Yaşam tarzına ve metabolik profile göre özel antrenman + beslenme şablonu." },
      weekly: { ttl: "Haftalık Takip", desc: "Her hafta ölçüm, zihin durumu ve enerji üzerine kısa check-in görüşmeleri." },
      habit: { ttl: "Sürdürülebilir Alışkanlık", desc: "Kalıcı değişim için zihinsel araçlar ve yaşam boyu sürecek rehberlik." },
    },
  },
};

export function FitnessStone({
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
  void primary;
  void accent;
  void readableTextOn;

  const photoUrl = resolveAssetUrl(photoPath);
  const waDigits = cardData.whatsapp
    ? digitsOnly(cardData.whatsapp).replace(/^\+/, "")
    : "";
  const callHref = cardData.phone
    ? `tel:${digitsOnly(cardData.phone)}`
    : undefined;
  const waHref = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(t.bookBtn)}`
    : undefined;

  const services = (cardData.services ?? []).slice(0, 5);
  const nameParts = cardData.name.trim().split(/\s+/);
  const nameFirst = nameParts[0] ?? cardData.name;
  const nameLast = nameParts.slice(1).join(" ");

  return (
    <article
      data-template="fitness-stone"
      className="fitness-stone-card relative mx-auto w-full max-w-[460px] overflow-hidden"
      style={{ background: SURFACE, color: INK }}
    >
      <style jsx global>{`
        .fitness-stone-card {
          font-family: var(--tpl-font-body, 'Nunito', system-ui, sans-serif);
          line-height: 1.65;
          -webkit-font-smoothing: antialiased;
        }
        .fitness-stone-card .serif {
          font-family: var(--tpl-font-display, 'Fraunces', 'Cormorant Garamond', serif);
        }
        .fitness-stone-card a { color: inherit; }
      `}</style>

      {/* SAGE HEADER */}
      <header
        className="relative overflow-hidden px-7 pb-16 pt-9 text-center"
        style={{
          background:
            "linear-gradient(180deg, #c5d2ad 0%, #b3c596 60%, #a8be8a 100%)",
          color: INK,
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(245,250,225,0.4), transparent 50%), radial-gradient(circle at 80% 70%, rgba(74,103,65,0.18), transparent 60%)",
          }}
        />
        <div className="relative z-[2]">
          <div
            className="serif italic"
            style={{
              fontWeight: 400,
              fontSize: 18,
              letterSpacing: "1px",
              color: GREEN,
              marginBottom: 6,
            }}
          >
            {cardData.company || cardData.name}
          </div>
          <div
            className="serif uppercase"
            style={{
              fontSize: 13,
              letterSpacing: "4px",
              color: GREEN_SOFT,
            }}
          >
            {t.atelierLabel}
          </div>
          <div
            aria-hidden
            className="relative mx-auto mt-3.5"
            style={{ width: 60, height: 1, background: GREEN_SOFT }}
          >
            <span
              aria-hidden
              className="absolute"
              style={{
                top: "50%",
                left: -10,
                transform: "translateY(-50%)",
                width: 4,
                height: 4,
                background: GREEN,
                borderRadius: "50%",
              }}
            />
            <span
              aria-hidden
              className="absolute"
              style={{
                top: "50%",
                right: -10,
                transform: "translateY(-50%)",
                width: 4,
                height: 4,
                background: GREEN,
                borderRadius: "50%",
              }}
            />
          </div>
        </div>
      </header>

      {/* WAVE DIVIDER */}
      <div
        className="relative"
        style={{ height: 38, marginTop: -1, background: SURFACE }}
      >
        <svg
          viewBox="0 0 460 38"
          preserveAspectRatio="none"
          className="absolute left-0 block"
          style={{ top: -38, width: "100%", height: 38 }}
          aria-hidden
        >
          <path
            d="M0,0 C115,38 230,38 345,18 C390,10 425,8 460,0 L460,38 L0,38 Z"
            fill={SURFACE}
          />
        </svg>
      </div>

      {/* PROFILE */}
      <section className="relative z-[5] -mt-10 px-7 text-center">
        <div
          className="relative inline-block"
          style={{
            padding: 6,
            background: SURFACE,
            borderRadius: "50%",
            boxShadow: "0 8px 24px rgba(74,103,65,0.18)",
          }}
        >
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={cardData.name}
              width={116}
              height={116}
              unoptimized
              className="rounded-full object-cover"
              style={{
                width: 116,
                height: 116,
                border: `3px solid ${SURFACE}`,
              }}
            />
          ) : (
            <div
              className="serif italic flex items-center justify-center rounded-full"
              style={{
                width: 116,
                height: 116,
                border: `3px solid ${SURFACE}`,
                background: `${GREEN}1a`,
                color: GREEN,
                fontSize: 36,
                fontWeight: 400,
              }}
            >
              {nameFirst[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <h1
          className="serif italic"
          style={{
            fontSize: 32,
            color: INK,
            marginTop: 18,
            lineHeight: 1.1,
          }}
        >
          <strong
            style={{
              fontStyle: "normal",
              color: GREEN,
              fontWeight: 400,
            }}
          >
            {nameFirst}
          </strong>{" "}
          {nameLast}
        </h1>
        <div
          className="mt-2 uppercase"
          style={{
            fontSize: 12,
            letterSpacing: "2.5px",
            color: GREEN_SOFT,
            fontWeight: 600,
          }}
        >
          {cardData.position || t.taglineFallback}
        </div>
      </section>

      {/* PHILOSOPHY */}
      {cardData.bio && (
        <section className="px-7 pb-3 pt-9 text-center">
          <div
            className="serif italic"
            style={{
              fontSize: 14,
              color: GREEN,
              marginBottom: 12,
            }}
          >
            {t.philLabel}
          </div>
          <p
            className="serif italic"
            style={{
              fontSize: 19,
              lineHeight: 1.55,
              color: INK,
              fontWeight: 400,
            }}
          >
            {cardData.bio}
          </p>
        </section>
      )}

      {/* SERVICES */}
      {services.length > 0 && (
        <>
          <SectionHead
            ornament={
              <path
                d="M12 2C7 6 7 12 12 16C17 12 17 6 12 2zM12 16v6M8 22h8"
                strokeWidth={1.5}
              />
            }
            h={t.servicesH}
            sub={t.servicesSub}
          />
          <section className="flex flex-col gap-3.5 px-6 pb-2">
            {services.map((svc, i) => (
              <div
                key={`${svc.title}-${i}`}
                className="grid items-center gap-3.5"
                style={{
                  background: SURFACE_2,
                  borderRadius: 18,
                  padding: 18,
                  border: `1px solid ${LINE}`,
                  boxShadow: "0 2px 8px rgba(74,103,65,0.05)",
                  gridTemplateColumns: "44px 1fr auto",
                }}
              >
                <div
                  className="flex shrink-0 items-center justify-center"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: `linear-gradient(135deg, ${GREEN_SOFT}, ${GREEN})`,
                    color: "#fff",
                  }}
                >
                  <ServiceGlyph idx={i} />
                </div>
                <div className="min-w-0">
                  <div
                    className="serif"
                    style={{
                      fontSize: 16,
                      color: INK,
                      fontWeight: 400,
                    }}
                  >
                    {svc.title}
                  </div>
                  {svc.description && (
                    <div
                      className="mt-0.5"
                      style={{
                        fontSize: 12,
                        color: MUTE,
                        lineHeight: 1.5,
                      }}
                    >
                      {svc.description}
                    </div>
                  )}
                </div>
                {svc.priceLabel && (
                  <div
                    className="serif shrink-0 text-right"
                    style={{
                      fontSize: 16,
                      fontWeight: 400,
                      color: GREEN,
                    }}
                  >
                    {svc.priceLabel}
                  </div>
                )}
              </div>
            ))}
          </section>
        </>
      )}

      {/* JOURNEY */}
      <SectionHead
        ornament={
          <>
            <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
            <polyline points="8 12 11 15 16 9" strokeWidth={1.5} />
          </>
        }
        h={t.journeyH}
        sub={t.journeySub}
      />
      <section
        className="mx-6 px-5 py-5"
        style={{
          background: SURFACE_2,
          borderRadius: 22,
          border: `1px solid ${LINE}`,
          boxShadow: "0 4px 12px rgba(74,103,65,0.06)",
        }}
      >
        <ul className="relative" style={{ paddingLeft: 36 }}>
          <span
            aria-hidden
            className="absolute"
            style={{
              left: 13,
              top: 12,
              bottom: 12,
              width: 2,
              background: `linear-gradient(180deg, ${GREEN_SOFT}, ${GOLD_SOFT})`,
              borderRadius: 2,
            }}
          />
          {JOURNEY_KEYS.map((k, i) => (
            <li
              key={k}
              className="relative pb-5 pt-2"
              style={{ paddingBottom: i === JOURNEY_KEYS.length - 1 ? 0 : 18 }}
            >
              <span
                aria-hidden
                className="serif italic absolute flex items-center justify-center"
                style={{
                  left: -36,
                  top: 8,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: SURFACE,
                  border: `2px solid ${GREEN}`,
                  color: GREEN,
                  fontWeight: 400,
                  fontSize: 14,
                }}
              >
                {i + 1}
              </span>
              <div
                className="serif"
                style={{
                  fontSize: 16,
                  color: INK,
                  lineHeight: 1.3,
                }}
              >
                {t.journey[k].ttl}
              </div>
              <div
                className="mt-1"
                style={{
                  fontSize: 12,
                  color: MUTE,
                  lineHeight: 1.55,
                }}
              >
                {t.journey[k].desc}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* TESTIMONIAL */}
      <section
        className="relative mx-6 mt-7 px-5 py-7 text-center"
        style={{
          background: "linear-gradient(180deg, #e9efd8, #dbe5c2)",
          borderRadius: 22,
          border: `1px solid ${LINE}`,
        }}
      >
        <span
          aria-hidden
          className="serif absolute"
          style={{
            top: 8,
            left: 18,
            fontSize: 70,
            color: GREEN,
            opacity: 0.35,
            lineHeight: 1,
          }}
        >
          &ldquo;
        </span>
        <p
          className="serif italic"
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            color: INK,
          }}
        >
          {t.testiText}
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <div
            className="flex shrink-0 items-center justify-center rounded-full"
            style={{
              width: 42,
              height: 42,
              background: `linear-gradient(135deg, ${GREEN_SOFT}, ${GREEN})`,
              color: "#fff",
              fontWeight: 700,
              border: `2px solid ${SURFACE}`,
            }}
          >
            {t.testiName[0]}
          </div>
          <div className="text-left">
            <div
              style={{
                fontSize: 12,
                color: GREEN,
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              {t.testiName}
            </div>
            <div
              className="mt-0.5"
              style={{ fontSize: 11, color: MUTE }}
            >
              {t.testiResult}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-4 gap-1.5 px-7 py-8 text-center">
        {[
          { num: "8", label: t.yearsLabel },
          { num: "600+", label: t.transformationsLabel },
          { num: "45K", label: t.igLabel },
          { num: "28K", label: t.ytLabel },
        ].map((s, i) => (
          <div key={i}>
            <div
              className="serif italic"
              style={{
                fontSize: 30,
                color: GREEN,
                lineHeight: 1,
              }}
            >
              {s.num}
            </div>
            <div
              className="mt-1.5 uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "1.5px",
                color: MUTE,
                fontWeight: 600,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* CONTACT */}
      <SectionHead
        ornament={
          <path
            d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
            strokeWidth={1.5}
          />
        }
        h={t.contactH}
      />
      <section className="px-6 pb-2">
        <div
          style={{
            ["--card-primary" as string]: GREEN,
          } as React.CSSProperties}
        >
          <ContactRows
            cardData={cardData}
            locale={locale}
            variant="compact"
            tone="light"
            accentHex={GREEN}
          />
        </div>
        {cardData.socials && (
          <div className="mt-5">
            <SocialRow
              socials={cardData.socials}
              variant="pill"
              accentHex={GREEN}
            />
          </div>
        )}
      </section>

      {/* CTA */}
      {(callHref || waHref) && (
        <section className="mx-6 mt-7 flex gap-2.5">
          {callHref && (
            <a
              href={callHref}
              className="flex-1 px-4 py-3.5 text-center"
              style={{
                background: GREEN,
                color: "#fff",
                borderRadius: 50,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.3px",
                boxShadow: "0 4px 14px rgba(74,103,65,0.25)",
              }}
            >
              {t.ctaPrimary}
            </a>
          )}
          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3.5 text-center"
              style={{
                background: "transparent",
                color: GREEN,
                border: `1.5px solid ${GREEN}`,
                borderRadius: 50,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {t.ctaSecondary}
            </a>
          )}
        </section>
      )}

      {/* WALLET / SEND / EXCHANGE */}
      <section
        className="mt-9 px-7 py-7"
        style={{
          background: SURFACE_2,
          borderTop: `1px solid ${LINE}`,
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <SendMyInfoSlot slug={slug} sourceQs="" primary={GREEN} locale={locale} />
        <ExchangeSlot slug={slug} primary={GREEN} locale={locale} />
      </section>

      {walletSlot && (
        <WalletDock
          label={t.walletLabel}
          className="px-7 py-6"
          labelClassName="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-center"
        >
          <div
            style={{
              ["--card-primary" as string]: GREEN,
              color: INK,
            } as React.CSSProperties}
          >
            {walletSlot}
          </div>
        </WalletDock>
      )}

      {/* FOOTER */}
      <footer
        className="px-7 pb-9 pt-6 text-center"
        style={{ borderTop: `1px solid ${LINE_SOFT}` }}
      >
        <div
          className="serif italic"
          style={{ fontSize: 18, color: GREEN }}
        >
          {cardData.company || cardData.name}
        </div>
        <div
          className="mt-1"
          style={{
            fontSize: 10,
            color: MUTE_2,
            letterSpacing: "0.5px",
          }}
        >
          &copy; {new Date().getFullYear()} — {t.atelierLabel}
        </div>
        <div
          className="mt-1"
          style={{ fontSize: 10, color: MUTE_2, letterSpacing: "0.5px" }}
        >
          {t.poweredBy}{" "}
          <a
            href="https://opsolid.de/products/digital-card"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: GREEN }}
          >
            OpSolid
          </a>
        </div>
      </footer>
    </article>
  );
}

function SectionHead({
  h,
  sub,
  ornament,
}: {
  h: string;
  sub?: string;
  ornament: React.ReactNode;
}) {
  return (
    <div className="px-7 pb-4 pt-9 text-center">
      <svg
        viewBox="0 0 24 24"
        width={28}
        height={28}
        fill="none"
        stroke={GOLD}
        className="mx-auto mb-2.5"
        style={{ opacity: 0.85 }}
        aria-hidden
      >
        {ornament}
      </svg>
      <h2
        className="serif"
        style={{ fontSize: 24, color: INK, lineHeight: 1.2 }}
      >
        {h}
      </h2>
      {sub && (
        <div
          className="mt-1.5"
          style={{
            fontSize: 12,
            color: MUTE,
            letterSpacing: "0.5px",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function ServiceGlyph({ idx }: { idx: number }) {
  const paths = [
    "M20 12V8a4 4 0 00-4-4H8a4 4 0 00-4 4v4 M20 12v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4 M2 12h20",
    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7m-4 0a4 4 0 1 1 8 0 a4 4 0 1 1 -8 0 M23 21v-2a4 4 0 00-3-3.87",
    "M3 12c1.5-2 4-3 6-3M21 12c-1.5-2-4-3-6-3M12 5v14M9 19h6",
    "M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4",
    "M22 12h-4l-3 9L9 3l-3 9H2",
  ];
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      stroke="currentColor"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={paths[idx % paths.length]} />
    </svg>
  );
}

// =============================================================================
// Registry & sample
// =============================================================================

export const fitnessStoneEntry: Omit<TemplateRegistryEntry, "Component"> = {
  id: 91,
  key: "fitness-stone",
  name: "Fitness — Stone",
  industry: "Fitness coach / outdoor holistic atelier",
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
  sampleSlug: "demo-fitness-stone",
};

// photo: Unsplash, https://unsplash.com/photos/8mqOw4DBBSg — Free, no attribution required.
export const fitnessStoneSample: SampleData = {
  templateId: 91,
  slug: "demo-fitness-stone",
  cardData: {
    name: "Can Öztürk",
    position: "Holistic Fitness Coach",
    title: "Holistic Fitness Coach",
    company: "CanFit Berlin",
    email: "can@canfit.de",
    phone: "+49 176 778 9012",
    whatsapp: "+49 176 778 9012",
    website: "canfit.de",
    address: "Kastanienallee 24, 10435 Berlin",
    bio: "Sağlık sayılardan ibaret değildir. Beden, beslenme ve zihin birlikte iyileşir. Sürdürülebilir alışkanlıklar üzerine kurulu nazik ama kararlı bir yolculuk.",
    bookingUrl: "https://cal.com/canfit/intro",
    impressumUrl: "https://canfit.de/impressum",
    privacyUrl: "https://canfit.de/datenschutz",
    sectorKey: "fitness",
    socials: {
      instagram: "https://instagram.com/canfit.berlin",
      youtube: "https://youtube.com/CanFit",
    },
    services: [
      { title: "1-1 Online Koçluk", description: "Kişiye özel, haftalık takip", priceLabel: "€199/ay" },
      { title: "Grup Koçluk", description: "Topluluk + online dersler", priceLabel: "€69/ay" },
      { title: "Beslenme Planı", description: "Kişiye özel makro çizelge", priceLabel: "€129" },
      { title: "12 Hafta Dönüşüm", description: "Antrenman + beslenme + zihin", priceLabel: "€899" },
    ],
  },
  photoUrl:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=920&q=80&auto=format&fit=crop",
  logoUrl: null,
  brandPrimaryHex: LOCKED_PRIMARY,
  brandAccentHex: LOCKED_ACCENT,
};
