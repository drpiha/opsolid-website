// =============================================================================
// /c/[slug] — public Smart Card page.
//
// This route is reachable on three hostnames:
//   • opsolid.de/c/[slug]        — internal canonical (used by /api routes)
//   • card.opsolid.de/[slug]     — host-rewritten by middleware to /c/[slug]
//   • go.opsolid.de/[slug]       — Phase 3 will switch this to short-link gateway
//
// Renders the Smart Card layout with full feature set (services, gallery,
// FAQ, testimonials, video, brochure). Source query parameters
// (?src=…&campaign=…&event=…) are captured here so:
//   - the vCard download link inherits them (NOTE field gets the source label)
//   - lead form posts include them
//   - we can record a CardView with `source=` for analytics
// =============================================================================

import { existsSync } from "node:fs";
import { join } from "node:path";
import type * as React from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CardDataSchema } from "@/lib/validation";
import { SmartCard } from "@/components/cards/smart/SmartCard";
import { WalletButtons } from "@/components/cards/smart/WalletButtons";
import { readSourceFromSearchParams } from "@/components/cards/smart/SmartCardSource";
import { getSiteUrl } from "@/lib/stripe";
import { getTemplateEntry, LOGO_NATIVE_KEYS } from "@/components/cards/templates/v2/registry";
import { CustomSectionsBlock } from "@/components/cards/templates/v2/shared/CustomSectionsBlock";
import { VideoBlock } from "@/components/cards/templates/v2/shared/VideoBlock";
import { LogoBlock } from "@/components/cards/templates/v2/shared/LogoBlock";
import { OwnerModeProvider } from "@/context/OwnerMode";
import { QRFlipOverlay } from "@/components/cards/QRFlipOverlay";
import { ShareButton } from "@/components/cards/ShareButton";
import { OwnerToolbar } from "@/components/cards/OwnerToolbar";
import { StatusBanner } from "@/components/cards/StatusBanner";
import { LocaleSwitcher } from "@/components/cards/LocaleSwitcher";
import { SaveCardButton } from "@/components/cards/SaveCardButton";
import { SaveToContactsButton } from "@/components/cards/SaveToContactsButton";
import { FeedbackWidget } from "@/components/cards/FeedbackWidget";
import { CreateYoursBanner } from "@/components/cards/CreateYoursBanner";
import { EmbedsBlock } from "@/components/cards/EmbedsBlock";
import { CustomButtonsBlock } from "@/components/cards/CustomButtonsBlock";
import { TipJarBlock } from "@/components/cards/TipJarBlock";
import { FaqBlock } from "@/components/cards/FaqBlock";
import { ContactFormBlock } from "@/components/cards/ContactFormBlock";
import { LockScreen } from "@/components/cards/LockScreen";
import { isPro } from "@/lib/auth/pro";
import { constantTimeEquals } from "@/lib/constantTime";
import { contents } from "@/content";
import { unlockCookieName } from "@/lib/cards/unlock-cookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function loadOrder(slug: string) {
  const order = await prisma.cardOrder.findUnique({
    where: { slug },
    include: {
      user: {
        select: { proSince: true, role: true },
      },
    },
  });
  if (!order || order.status !== "PUBLISHED") return null;
  return order;
}

/**
 * Phase 8 — when a slug doesn't resolve directly, look it up in slug_history
 * (populated when the owner renames their card). Returns the current slug
 * so the caller can issue a 308 redirect.
 */
async function findRenamedSlug(oldSlug: string): Promise<string | null> {
  const order = await prisma.cardOrder.findFirst({
    where: {
      status: "PUBLISHED",
      slugHistory: { has: oldSlug },
    },
    select: { slug: true },
  });
  return order?.slug ?? null;
}

/**
 * Public-facing canonical URL — prefers the `card.opsolid.de` subdomain when
 * the page was accessed from there, otherwise falls back to opsolid.de/c/[slug].
 * Used in <link rel="canonical"> and Open Graph URLs to keep social previews
 * pointing at the prettier hostname.
 */
async function publicCardUrl(slug: string): Promise<string> {
  const h = await headers();
  const host = (h.get("host") || "").toLowerCase();
  if (host === "card.opsolid.de" || host === "go.opsolid.de") {
    return `https://card.opsolid.de/${slug}`;
  }
  const site = getSiteUrl().replace(/\/$/, "");
  return `${site}/c/${slug}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const order = await loadOrder(slug);
  // Phase 8.1 — private cards must not leak metadata to crawlers/scrapers.
  if (!order || order.visibility === 'private') return { title: "OpSolid Smart Card", robots: { index: false } };

  const card = CardDataSchema.safeParse(order.cardData);
  const name = card.success ? card.data.name : order.contactName;
  const title = card.success ? card.data.title : "";
  const company = card.success ? card.data.company : "";
  const bio = card.success ? card.data.bio : undefined;

  const url = await publicCardUrl(slug);
  const siteOrigin = getSiteUrl().replace(/\/$/, "");

  // Phase 7.5 — per-template thumbnail as the primary OG image. The
  // thumbnails are static PNGs generated by `npm run generate-thumbnails`
  // and committed under `public/images/templates/`. We probe the file
  // system once per metadata call to decide whether to advertise the
  // static thumbnail at all — if it isn't on disk (templateId without a
  // generated thumbnail, or a fresh checkout that hasn't run the script
  // yet), we omit it and let the dynamic OG do the work. This keeps
  // social-platform unfurls from following a 404 to the static asset.
  //
  // `existsSync` runs server-side at request time and is cheap (one
  // stat() per render). The file path is derived from `templateId`
  // which is validated by Prisma — no path-traversal surface.
  const thumbFilename = `card-${String(order.templateId).padStart(2, "0")}.png`;
  const thumbDiskPath = join(
    process.cwd(),
    "public",
    "images",
    "templates",
    thumbFilename,
  );
  const templateThumbExists = existsSync(thumbDiskPath);
  const templateThumbUrl = `${siteOrigin}/images/templates/${thumbFilename}`;

  // Build the OG image array. Order matters: most social platforms pick
  // the first image they can fetch successfully.
  //   1. Personalized wa.png 1080×1350 4:5 — tall hero with the card's
  //      actual photo + name, what users actually want to see in chats.
  //   2. Personalized og.png 1200×630 — wide card for Twitter/LinkedIn.
  //   3. Per-template static thumbnail — last-resort fallback if the
  //      dynamic routes are slow or rate-limited; not picked first
  //      because it's a generic template image, not the user's card.
  const altText = `${name}${company ? " · " + company : ""}`;
  // Cache-busting: every save updates `order.updatedAt` (Prisma @updatedAt).
  // Social scrapers (WhatsApp, Telegram, LinkedIn) hash the URL to key their
  // preview cache — appending the epoch timestamp ensures each save produces
  // a URL that scrapers treat as a new resource, bypassing stale previews.
  // The image route handlers ignore query parameters; Next.js revalidate=60
  // remains in effect and is keyed on the path only (no behaviour change).
  const v = order.updatedAt.getTime();
  const ogImages: NonNullable<NonNullable<Metadata["openGraph"]>["images"]> = [
    {
      url: `/c/${slug}/wa.png?v=${v}`,
      width: 1080,
      height: 1350,
      alt: altText,
    },
    {
      url: `/c/${slug}/og.png?v=${v}`,
      width: 1200,
      height: 630,
      alt: altText,
    },
  ];
  if (templateThumbExists) {
    ogImages.push({
      url: templateThumbUrl,
      width: 540,
      height: 960,
      alt: altText,
    });
  }

  const twitterImages: string[] = [`/c/${slug}/og.png?v=${v}`];
  if (templateThumbExists) twitterImages.push(templateThumbUrl);

  return {
    title: `${name}${title ? " — " + title : ""} · OpSolid Smart Card`,
    description: bio ?? company ?? "Digital business card — OpSolid Smart Card",
    alternates: { canonical: url },
    openGraph: {
      title: `${name}${company ? " · " + company : ""}`,
      description: bio,
      type: "profile",
      url,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      images: twitterImages,
    },
    robots: { index: true, follow: true },
  };
}

export default async function CardPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const order = await loadOrder(slug);
  if (!order) {
    // Phase 8 — owner may have renamed their card. Try slug_history before
    // giving up, then 308-redirect so old WhatsApp / QR links keep working.
    const renamed = await findRenamedSlug(slug);
    if (renamed) permanentRedirect(`/c/${renamed}`);
    notFound();
  }

  // Phase 8.1 — visibility enforcement on the page route.
  // "private" cards return 404 to all visitors. Owners can still reach their
  // card via the dashboard edit link (which uses a different route). This is
  // an MVP-safe check: no session reading, consistent with API route behaviour.
  // "unlisted" cards are accessible by direct link — no action needed here.
  if (order.visibility === 'private') {
    notFound();
  }

  const parsed = CardDataSchema.safeParse(order.cardData);
  if (!parsed.success) {
    // Phase 8 — log the parse failure so prod logs surface the bad field
    // instead of silently 404-ing. The slug is a public identifier; the
    // issue list is a small zod report. Safe to log.
    console.error("[card render] CardDataSchema parse failed", {
      slug,
      orderId: order.id,
      issues: parsed.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
    notFound();
  }

  const source = readSourceFromSearchParams(sp);

  // -------------------------------------------------------------------------
  // M5 — password-protected card gate.
  // The password hash lives in `cardData.password`. When set + visitor isn't
  // authenticated as the owner (via `?owner=<editToken>`) and doesn't carry
  // the `verso_unlock_<slug>` cookie, render the lock screen. The owner
  // bypass uses the existing editToken constant-time check to avoid leaking
  // hash existence on a wrong owner token.
  // -------------------------------------------------------------------------
  const cardDataRaw = parsed.data as Record<string, unknown>;
  const passwordHash =
    typeof cardDataRaw.password === "string" && cardDataRaw.password.length > 0
      ? (cardDataRaw.password as string)
      : null;

  if (passwordHash) {
    const ownerTokenRaw0 = sp.owner;
    const ownerToken0 =
      typeof ownerTokenRaw0 === "string" ? ownerTokenRaw0 : ownerTokenRaw0?.[0];
    const isOwner0 = Boolean(
      ownerToken0 &&
        order.editToken &&
        constantTimeEquals(ownerToken0, order.editToken),
    );
    const cookieHeader0 = (await headers()).get("cookie") ?? "";
    const cookieName0 = unlockCookieName(slug);
    const hasUnlockCookie = cookieHeader0
      .split(";")
      .map((c) => c.trim())
      .some((c) => c.startsWith(`${cookieName0}=`));
    if (!isOwner0 && !hasUnlockCookie) {
      const lockLocaleKey =
        order.locale === "en" || order.locale === "tr" ? order.locale : "de";
      const labels =
        lockLocaleKey === "de"
          ? {
              title: "Geschützte Karte",
              subtitle: "Bitte gib das Passwort ein, um diese Karte zu sehen.",
              placeholder: "Passwort",
              submit: "Entsperren",
              submitting: "…",
              error: "Falsches Passwort.",
            }
          : lockLocaleKey === "tr"
            ? {
                title: "Şifreli kart",
                subtitle: "Bu kartı görmek için şifreyi gir.",
                placeholder: "Şifre",
                submit: "Aç",
                submitting: "…",
                error: "Yanlış şifre.",
              }
            : {
                title: "Locked card",
                subtitle: "Enter the password to view this card.",
                placeholder: "Password",
                submit: "Unlock",
                submitting: "…",
                error: "Wrong password.",
              };
      return <LockScreen slug={slug} labels={labels} />;
    }
  }

  // Strip the password hash from the data passed to the renderer — it must
  // never reach the browser bundle.
  if ("password" in cardDataRaw) {
    delete (cardDataRaw as Record<string, unknown>).password;
  }

  // Fire-and-forget view tracking. We deliberately await on a Promise.race
  // so a slow DB write can't block the page render — the render proceeds
  // either way, and Prisma queues the insert.
  void prisma.cardView
    .create({
      data: {
        orderId: order.id,
        source: source.src ?? source.medium ?? null,
        ua: ((await headers()).get("user-agent") ?? "").slice(0, 200) || null,
        referer: (await headers()).get("referer")?.slice(0, 500) ?? null,
      },
    })
    .catch(() => {});

  const siteUrl = getSiteUrl();

  // Faz 6.7 B4 — visitor language priority: ?lang= > order.locale > "de" default.
  // Validate against the supported locale set so ?lang=foo gracefully falls
  // back instead of blowing up downstream consumers.
  const requestedLang = (sp.lang ?? "").toString().toLowerCase();
  const validLang = (["de", "en", "tr"] as const).includes(
    requestedLang as "de" | "en" | "tr",
  )
    ? (requestedLang as "de" | "en" | "tr")
    : null;
  const localeKey: "de" | "en" | "tr" =
    validLang ??
    (order.locale === "en" || order.locale === "tr" ? order.locale : "de");

  // v2 registry lookup. Falls back to SmartCard when the order's templateId
  // hasn't been ported yet — preserves existing live cards 1:1.
  const entry = getTemplateEntry(order.templateId);
  const Template = entry?.Component ?? SmartCard;

  // Phase 7.9 — image position + typography preset wiring (CSS variables on a
  // wrapper). Same logic as the form-side LivePreview so what the customer
  // configured renders identically here.
  const photoPos = parsed.data.photoPosition;
  const logoPos = parsed.data.logoPosition;
  const wrapperStyle: React.CSSProperties = {
    "--tpl-photo-x": `${photoPos?.x ?? 50}%`,
    "--tpl-photo-y": `${photoPos?.y ?? 50}%`,
    "--tpl-photo-scale": String(photoPos?.scale ?? 1),
    "--tpl-photo-fit": photoPos?.fit ?? "cover",
    "--tpl-logo-x": `${logoPos?.x ?? 50}%`,
    "--tpl-logo-y": `${logoPos?.y ?? 50}%`,
    "--tpl-logo-scale": String(logoPos?.scale ?? 1),
  } as React.CSSProperties;
  // Phase 8 — typography preset is best-effort. A missing/renamed preset
  // file or font value used to crash the SSR render; we now log + ignore.
  if (parsed.data.typographyPreset && parsed.data.typographyPreset !== "default") {
    try {
      const { getTypographyPreset } = await import("@/lib/typographyPresets");
      const preset = getTypographyPreset(parsed.data.typographyPreset);
      if (preset?.displayFamily) {
        (wrapperStyle as Record<string, string>)["--tpl-font-display"] =
          preset.displayFamily;
      }
      if (preset?.bodyFamily) {
        (wrapperStyle as Record<string, string>)["--tpl-font-body"] =
          preset.bodyFamily;
      }
    } catch (e) {
      console.error("[card render] typography preset load failed", {
        slug,
        preset: parsed.data.typographyPreset,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  const isDarkTemplate = entry
    ? ["barber", "developer", "music-producer", "studio", "tech-startup"].includes(
        entry.key
      )
    : false;

  // Sprint 6 — `?preview=1` mode lets the mobile edit screen render an unsaved
  // configuration without a DB write. Each design knob is read from
  // searchParams and, if present, overrides the persisted value before the
  // template renders. No auth gate (the preview overlay is signed-in-only on
  // the mobile side, and the underlying card must already be public for the
  // page to render at all).
  const isPreview = sp.preview === "1" || sp.preview === "true";
  const previewParam = (key: string): string | undefined => {
    const v = sp[key];
    if (typeof v === "string" && v.trim().length > 0) return v;
    return undefined;
  };
  const overrideLayout = isPreview ? previewParam("layout") : undefined;
  const overrideTheme = isPreview ? previewParam("theme") : undefined;
  const overrideQr = isPreview ? previewParam("qr") : undefined;
  const overridePrimary = isPreview ? previewParam("primary") : undefined;
  const overrideAccent = isPreview ? previewParam("accent") : undefined;
  // Text-field overrides — allow the mobile live-preview to reflect unsaved
  // name/title/company/bio changes without a server round-trip. Only applied
  // when ?preview=1 is set so the public render path is not affected.
  const overrideName = isPreview ? previewParam("name") : undefined;
  const overrideTitle = isPreview ? previewParam("title") : undefined;
  const overrideCompany = isPreview ? previewParam("company") : undefined;
  const overrideBio = isPreview ? previewParam("bio") : undefined;

  const effectivePrimaryHex = overridePrimary ?? order.brandPrimaryHex;
  const effectiveAccentHex = overrideAccent ?? order.brandAccentHex;

  // Templates read themeKey/layoutKey/name/title/company/bio off cardData.
  // Build a shallow override object so any combination of design + text
  // overrides flows through without disturbing the parsed schema.
  const hasAnyOverride =
    overrideTheme || overrideLayout ||
    overrideName || overrideTitle || overrideCompany || overrideBio;
  const renderedCardData = hasAnyOverride
    ? {
        ...parsed.data,
        ...(overrideTheme   ? { themeKey:  overrideTheme }   : {}),
        ...(overrideLayout  ? { layoutKey: overrideLayout }  : {}),
        ...(overrideName    ? { name:      overrideName }    : {}),
        ...(overrideTitle   ? { title:     overrideTitle }   : {}),
        ...(overrideCompany ? { company:   overrideCompany } : {}),
        ...(overrideBio     ? { bio:       overrideBio }     : {}),
      }
    : parsed.data;
  // Avoid an unused-var warning when qr override is absent.
  void overrideQr;

  // TipJarBlock gate — computed server-side so the client component doesn't
  // need to call /api/auth/me. The tip API route enforces Pro independently.
  const ownerIsPro = order.user
    ? isPro({ proSince: order.user.proSince, role: order.user.role })
    : false;

  const publicUrl = await publicCardUrl(slug);
  const shareTitle = `${parsed.data.name}${parsed.data.company ? " · " + parsed.data.company : ""}`;
  const qrLabels = contents[localeKey].card.qr;

  // Phase 8 — owner toolbar. Visitors who arrive with `?owner=<editToken>` are
  // promoted to "owner view": a small floating bar with edit + share affordances
  // appears at the top of the page. The token is verified in constant time
  // against `order.editToken`; mismatched values silently fall through to the
  // public render path.
  const ownerTokenRaw = sp.owner;
  const ownerToken =
    typeof ownerTokenRaw === "string" ? ownerTokenRaw : ownerTokenRaw?.[0];
  const isOwner = Boolean(
    ownerToken &&
      order.editToken &&
      constantTimeEquals(ownerToken, order.editToken),
  );
  const ownerLabels = contents[localeKey].card.owner;
  const langSwitcherLabel = contents[localeKey].card.languageSwitcher;
  const editHref = `/${localeKey}/card/edit/${order.id}?t=${order.editToken ?? ""}`;

  return (
    <OwnerModeProvider isOwner={isOwner}>
      <main className="flex min-h-[100dvh] flex-col bg-bg-0 px-4 py-6 pb-24 sm:py-10">
        {isOwner && (
          <OwnerToolbar
            editHref={editHref}
            publicUrl={publicUrl}
            shareTitle={shareTitle}
            labels={{
              publicBannerLabel: ownerLabels.publicBannerLabel,
              editLabel: ownerLabels.editLabel,
              shareLabel: ownerLabels.shareLabel,
            }}
          />
        )}
        {/* Status banner — prefer the new Sprint 6 `statusBanner` shape (with
            `enabled` flag + 4 tones), fall back to the legacy `statusMessage`
            for cards saved before the schema reconciliation. */}
        {parsed.data.statusBanner?.enabled &&
        parsed.data.statusBanner.text.trim() ? (
          <StatusBanner
            text={parsed.data.statusBanner.text}
            tone={parsed.data.statusBanner.tone}
            accentHex={effectiveAccentHex}
          />
        ) : parsed.data.statusMessage?.text?.trim() ? (
          <StatusBanner
            text={parsed.data.statusMessage.text}
            tone={parsed.data.statusMessage.tone}
            accentHex={effectiveAccentHex}
          />
        ) : null}
        <div
          className="mx-auto w-full max-w-[420px] flex-1"
          data-card-tpl
          style={wrapperStyle}
        >
          {/* Universal brand strip — shows the logo above any template that
              doesn't render one natively (e.g. Maker). */}
          <LogoBlock
            logoPath={order.logoPath}
            tone={isDarkTemplate ? "dark" : "light"}
            suppress={!entry || LOGO_NATIVE_KEYS.has(entry.key)}
          />
          <Template
            slug={slug}
            cardData={renderedCardData}
            photoPath={order.photoPath}
            logoPath={order.logoPath}
            brandPrimaryHex={effectivePrimaryHex}
            brandAccentHex={effectiveAccentHex}
            source={source}
            siteUrl={siteUrl}
            locale={localeKey}
            walletSlot={<WalletButtons slug={slug} />}
          />
          <CustomSectionsBlock
            sections={parsed.data.customSections}
            accentHex={effectiveAccentHex ?? undefined}
            tone={isDarkTemplate ? "dark" : "light"}
          />
          {/* Universal video — self-hosted clip + YouTube/Vimeo embed. The embed
              is suppressed for the few templates that render videoUrl natively
              (SmartCard fallback, Athlete, Photographer) to avoid duplication. */}
          <VideoBlock
            videoUrl={parsed.data.videoUrl}
            videoPath={(parsed.data as Record<string, unknown>).videoPath as string | undefined}
            tone={isDarkTemplate ? "dark" : "light"}
            heading={
              localeKey === "de" ? "Video" : localeKey === "tr" ? "Video" : "Video"
            }
            suppressEmbed={!entry || entry.key === "athlete" || entry.key === "photographer"}
          />
          {/* M3 — Curated embeds (Carrd amendment). The block self-hides
              when `cardData.embeds` is empty or every entry fails the host
              re-validation done client-side. Heading is inlined per locale
              (no current `card.embeds` key in src/content). */}
          <EmbedsBlock
            embeds={(parsed.data as Record<string, unknown>).embeds}
            accentHex={effectiveAccentHex ?? undefined}
            locale={localeKey}
            heading={
              localeKey === "de"
                ? "Eingebettet"
                : localeKey === "tr"
                  ? "Öne çıkan"
                  : "Featured"
            }
          />
          {/* Wrapper-level blocks — render uniformly across ALL 96 templates.
              Each reads cardData fields that individual templates may not
              implement. The blocks self-hide when data is absent / disabled. */}
          <CustomButtonsBlock
            buttons={parsed.data.customButtons}
            primaryHex={effectivePrimaryHex}
            accentHex={effectiveAccentHex}
          />
          <TipJarBlock
            slug={slug}
            tipJar={parsed.data.tipJar}
            ownerIsPro={ownerIsPro}
            primaryHex={effectivePrimaryHex}
          />
          <FaqBlock
            faqs={parsed.data.faqs}
            accentHex={effectiveAccentHex}
            heading={
              localeKey === "de"
                ? "Häufige Fragen"
                : localeKey === "tr"
                  ? "Sık Sorulan Sorular"
                  : "FAQ"
            }
          />
          <ContactFormBlock
            slug={slug}
            contactForm={parsed.data.contactForm}
            primaryHex={effectivePrimaryHex}
            accentHex={effectiveAccentHex}
            locale={localeKey}
            heading={
              localeKey === "de"
                ? "Kontakt"
                : localeKey === "tr"
                  ? "İletişim"
                  : "Get in touch"
            }
          />
          {/* Phase 8.3 — save + locale row below card content */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {/* Only show save button to non-owners — owners manage via dashboard */}
            {!isOwner && (
              <SaveCardButton slug={slug} locale={localeKey} />
            )}
            {/* M7 — vCard download. Public endpoint, hits /api/v1/cards/:id/vcard
                and triggers the native Contacts import sheet on iOS/Android. */}
            <SaveToContactsButton cardId={order.id} locale={localeKey} />
            <LocaleSwitcher current={localeKey} ariaLabel={langSwitcherLabel} />
          </div>
          {/* Phase 8.4 — feedback widget. Self-hides when enabled:false from API */}
          <FeedbackWidget slug={slug} locale={localeKey} />
        </div>
        {/* Hide the bottom corner floaters in mobile live-preview mode —
            they would otherwise cover the design area the user is actively
            editing. Mirrors the CreateYoursBanner gate below. */}
        {!isPreview && (
          <QRFlipOverlay
            slug={slug}
            publicUrl={publicUrl}
            shareTitle={shareTitle}
            accentHex={effectiveAccentHex ?? undefined}
            labels={qrLabels}
          />
        )}
        {/* Phase 5 — share drawer trigger (bottom-left, QR occupies bottom-right) */}
        {!isPreview && (
          <ShareButton
            slug={slug}
            accentHex={effectiveAccentHex ?? undefined}
            locale={localeKey}
          />
        )}
        {/* M3 — viral loop hook for unauthenticated visitors. Self-hides
            for owners (handled by `isOwner` short-circuit), visitors who
            already have a Verso session (the component pings /api/auth/me
            on mount), AND the live-preview WebView (?preview=1) which has no
            auth cookie and would otherwise overlay the preview pane. */}
        {!isOwner && !isPreview && (
          <CreateYoursBanner slug={slug} locale={localeKey} />
        )}
      </main>
    </OwnerModeProvider>
  );
}
