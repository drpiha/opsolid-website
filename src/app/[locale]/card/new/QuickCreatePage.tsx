"use client";

// =============================================================================
// QuickCreatePage — the 60-second card flow at /[locale]/card/new.
//
// Built for the fair case: someone opens the invite link on their phone in a
// queue and needs a live card before they reach the booth. Five fields + an
// optional photo, one button, instant publish. Everything else (design,
// gallery, services, colors…) is one click away in the editor afterwards —
// the success redirect lands on the live card in owner mode where the
// OwnerWelcome tour takes over.
//
// Posts to the same /api/orders endpoint as the full form (billingMode FREE,
// a clean default template), so validation, e-mail, event attach and the
// draft-vs-publish logic stay in one place.
// =============================================================================

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Camera, ChevronDown, ChevronUp, ImageIcon, Loader2, Sparkles } from "lucide-react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import {
  CardLanguageSelector,
  type CardLocale,
} from "@/components/cards/order-form/CardLanguageSelector";
import { useLocale } from "@/context/LocaleContext";
import { downscaleImage } from "@/lib/images/downscale";

// Three clean, sector-neutral starter designs (universal layouts, ids 92-94).
// Quick create optimizes for "live now" — the owner can switch to any of the
// 90+ designs later in the editor.
const STARTER_DESIGNS = [
  { id: 93, labelKey: "designClassic" }, // Pure Swiss
  { id: 92, labelKey: "designModern" }, // Noir Luxury
  { id: 94, labelKey: "designVisual" }, // Vivid Bold
] as const;

const EVENT_SLUG_RE = /^[a-z0-9-]{3,80}$/;

interface EventInfo {
  slug: string;
  name: string;
  city: string;
  venue: string | null;
}

export function QuickCreatePage() {
  const { t, locale } = useLocale();
  const q = t.card.quickCreate;
  const search = useSearchParams();

  // Fair flow — same client-side event resolution as the full order page.
  const eventSlugRaw = search?.get("event")?.trim().toLowerCase() ?? null;
  const eventSlug =
    eventSlugRaw && EVENT_SLUG_RE.test(eventSlugRaw) ? eventSlugRaw : null;
  const [event, setEvent] = React.useState<EventInfo | null>(null);
  const [joinDirectory, setJoinDirectory] = React.useState(true);
  React.useEffect(() => {
    if (!eventSlug) return;
    let cancelled = false;
    fetch(`/api/v1/events/${encodeURIComponent(eventSlug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { event?: EventInfo } | null) => {
        if (!cancelled && json?.event?.slug) setEvent(json.event);
      })
      .catch(() => {
        /* event banner is a bonus — never block creation */
      });
    return () => {
      cancelled = true;
    };
  }, [eventSlug]);

  // Template pre-selection from ?template= query param (arriving from gallery).
  const templateFromUrl = React.useMemo(() => {
    const raw = search?.get("template");
    if (!raw) return null;
    const parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [search]);

  const [name, setName] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  // Explicit card language — defaults to the page locale but is the owner's
  // visible choice (was previously taken silently from the URL).
  const [cardLocale, setCardLocale] = React.useState<CardLocale>(
    (["de", "en", "tr"].includes(locale) ? locale : "de") as CardLocale,
  );
  // Starter design — initialized from ?template= if valid, else first generic layout.
  const [templateId, setTemplateId] = React.useState<number>(
    templateFromUrl ?? STARTER_DESIGNS[0].id,
  );

  // Photo upload state.
  const [photoPath, setPhotoPath] = React.useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = React.useState(false);
  const fileInput = React.useRef<HTMLInputElement>(null);

  // Logo upload state.
  const [logoPath, setLogoPath] = React.useState<string | null>(null);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const [logoUploading, setLogoUploading] = React.useState(false);
  const logoInput = React.useRef<HTMLInputElement>(null);

  // Social media state.
  const [socials, setSocials] = React.useState({
    linkedin: "",
    instagram: "",
    x: "",
    youtube: "",
    facebook: "",
    tiktok: "",
  });

  // Collapsible "more details" state.
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [whatsapp, setWhatsapp] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [videoUrl, setVideoUrl] = React.useState("");

  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onPhoto = async (file: File) => {
    setPhotoUploading(true);
    setError(null);
    try {
      // Instant local preview while the upload runs.
      setPhotoPreview(URL.createObjectURL(file));
      const small = await downscaleImage(file);
      const form = new FormData();
      form.append("file", small);
      form.append("kind", "photo");
      const res = await fetch("/api/uploads", { method: "POST", body: form });
      const json = (await res.json()) as { path?: string; error?: string };
      if (!res.ok || !json.path) {
        setPhotoPreview(null);
        setError(q.photoError);
        return;
      }
      setPhotoPath(json.path);
    } catch {
      setPhotoPreview(null);
      setError(q.photoError);
    } finally {
      setPhotoUploading(false);
    }
  };

  const onLogo = async (file: File) => {
    setLogoUploading(true);
    setError(null);
    try {
      setLogoPreview(URL.createObjectURL(file));
      const small = await downscaleImage(file);
      const form = new FormData();
      form.append("file", small);
      form.append("kind", "logo");
      const res = await fetch("/api/uploads", { method: "POST", body: form });
      const json = (await res.json()) as { path?: string; error?: string };
      if (!res.ok || !json.path) {
        setLogoPreview(null);
        setError(q.photoError);
        return;
      }
      setLogoPath(json.path);
    } catch {
      setLogoPreview(null);
      setError(q.photoError);
    } finally {
      setLogoUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError(q.errorRequired);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      // Build socials object — only include non-empty keys.
      const socialsObj = Object.fromEntries(
        Object.entries(socials).filter(([, v]) => v.trim() !== ""),
      ) as Record<string, string>;

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          billingMode: "FREE",
          locale: cardLocale,
          contactName: name.trim(),
          contactEmail: email.trim(),
          contactPhone: phone.trim(),
          callMeBack: false,
          cardData: {
            name: name.trim(),
            title: title.trim() || undefined,
            company: company.trim() || undefined,
            phone: phone.trim(),
            email: email.trim(),
            ...(website.trim() ? { website: website.trim() } : {}),
            ...(whatsapp.trim() ? { whatsapp: whatsapp.trim() } : {}),
            ...(address.trim() ? { address: address.trim() } : {}),
            ...(bio.trim() ? { bio: bio.trim() } : {}),
            ...(videoUrl.trim() ? { videoUrl: videoUrl.trim() } : {}),
            ...(Object.keys(socialsObj).length > 0 ? { socials: socialsObj } : {}),
          },
          photoPath: photoPath ?? undefined,
          logoPath: logoPath ?? undefined,
          eventSlug: event && joinDirectory ? event.slug : undefined,
        }),
      });
      const json = (await res.json()) as {
        cardUrl?: string;
        editToken?: string;
        error?: string;
      };
      if (!res.ok || !json.cardUrl || !json.editToken) {
        setError(json.error ?? q.errorGeneric);
        setBusy(false);
        return;
      }
      window.location.href = `${json.cardUrl}?owner=${encodeURIComponent(json.editToken)}`;
    } catch {
      setError(q.errorGeneric);
      setBusy(false);
    }
  };

  const inputCls =
    "w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-copper focus:outline-none";

  return (
    <main className="editor-light min-h-screen bg-neutral-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <p className="text-eyebrow uppercase tracking-wider text-neutral-400">
          OpSolid · Digital Card
        </p>
        <h1 className="mt-2 font-display text-3xl text-neutral-900">
          {q.title}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">{q.subtitle}</p>

        {event && (
          <div className="mt-4 rounded-2xl border border-copper/35 bg-copper/10 px-4 py-3">
            <p className="text-sm font-semibold text-neutral-900">
              🎪 {event.name}
              <span className="font-normal text-neutral-500"> · {event.city}</span>
            </p>
            <label className="mt-2 flex cursor-pointer items-start gap-2 text-sm text-neutral-600">
              <input
                type="checkbox"
                checked={joinDirectory}
                onChange={(e) => setJoinDirectory(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-copper"
              />
              <span>{t.products.digitalCard.order.form.eventJoinLabel}</span>
            </label>
          </div>
        )}

        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          {/* Photo upload */}
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="flex items-center gap-4 rounded-2xl border border-dashed border-neutral-300 bg-white p-4 text-left hover:border-copper/60"
          >
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoPreview}
                alt=""
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                {photoUploading ? (
                  <Loader2 size={20} className="animate-spin text-neutral-400" />
                ) : (
                  <Camera size={20} className="text-neutral-400" />
                )}
              </span>
            )}
            <span className="min-w-0">
              <span className="block text-sm font-medium text-neutral-900">
                {photoPreview ? q.photoChange : q.photoLabel}
              </span>
              <span className="block text-xs text-neutral-400">{q.photoHint}</span>
            </span>
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onPhoto(f);
              e.target.value = "";
            }}
          />

          {/* Logo upload */}
          <button
            type="button"
            onClick={() => logoInput.current?.click()}
            className="flex items-center gap-4 rounded-2xl border border-dashed border-neutral-300 bg-white p-4 text-left hover:border-copper/60"
          >
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoPreview}
                alt=""
                className="h-16 w-16 shrink-0 rounded-2xl object-contain bg-white"
              />
            ) : (
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-neutral-100">
                {logoUploading ? (
                  <Loader2 size={20} className="animate-spin text-neutral-400" />
                ) : (
                  <ImageIcon size={20} className="text-neutral-400" />
                )}
              </span>
            )}
            <span className="min-w-0">
              <span className="block text-sm font-medium text-neutral-900">
                {logoPreview ? q.logoChange : q.logoLabel}
              </span>
              <span className="block text-xs text-neutral-400">{q.logoHint}</span>
            </span>
          </button>
          <input
            ref={logoInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onLogo(f);
              e.target.value = "";
            }}
          />

          {/* Starter design — three clean, generic layouts. The owner can
              switch to any of the 90+ designs later in the editor. */}
          <div>
            <p className="mb-1.5 px-1 text-sm font-medium text-neutral-700">
              {q.designSectionLabel}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {STARTER_DESIGNS.map((d) => {
                const selected = templateId === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setTemplateId(d.id)}
                    aria-pressed={selected}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl border p-2 transition-colors ${
                      selected
                        ? "border-copper ring-2 ring-copper/40"
                        : "border-neutral-300 hover:border-copper/50"
                    }`}
                  >
                    <span className="relative block aspect-[3/5] w-full overflow-hidden rounded-xl bg-neutral-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/images/templates/card-${d.id}.png`}
                        alt={q[d.labelKey]}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                      {/* Fallback shown behind the image if the thumbnail 404s. */}
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center px-2 text-center text-xs font-medium text-neutral-400">
                        {q[d.labelKey]}
                      </span>
                    </span>
                    <span className="text-xs font-medium text-neutral-700">
                      {q[d.labelKey]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder={`${q.nameLabel} *`} maxLength={120} autoComplete="name" />
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={q.titleLabel} maxLength={120} autoComplete="organization-title" />
          <input className={inputCls} value={company} onChange={(e) => setCompany(e.target.value)} placeholder={q.companyLabel} maxLength={120} autoComplete="organization" />
          <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={`${q.phoneLabel} *`} maxLength={40} inputMode="tel" autoComplete="tel" />
          <div>
            <input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder={`${q.emailLabel} *`} maxLength={200} inputMode="email" autoComplete="email" />
            <p className="mt-1.5 px-1 text-xs text-neutral-400">{q.emailHint}</p>
          </div>

          {/* Social media block — always visible */}
          <div className="flex flex-col gap-2">
            <p className="px-1 text-sm font-medium text-neutral-500">
              {q.socialSectionLabel}
            </p>
            <input
              className={inputCls}
              value={socials.linkedin}
              onChange={(e) => setSocials((s) => ({ ...s, linkedin: e.target.value }))}
              placeholder={q.linkedinLabel}
              maxLength={300}
              inputMode="url"
              autoComplete="off"
            />
            <input
              className={inputCls}
              value={socials.instagram}
              onChange={(e) => setSocials((s) => ({ ...s, instagram: e.target.value }))}
              placeholder={q.instagramLabel}
              maxLength={300}
              inputMode="url"
              autoComplete="off"
            />
            <input
              className={inputCls}
              value={socials.x}
              onChange={(e) => setSocials((s) => ({ ...s, x: e.target.value }))}
              placeholder={q.xLabel}
              maxLength={300}
              inputMode="url"
              autoComplete="off"
            />
            <input
              className={inputCls}
              value={socials.youtube}
              onChange={(e) => setSocials((s) => ({ ...s, youtube: e.target.value }))}
              placeholder={q.youtubeLabel}
              maxLength={300}
              inputMode="url"
              autoComplete="off"
            />
            <input
              className={inputCls}
              value={socials.facebook}
              onChange={(e) => setSocials((s) => ({ ...s, facebook: e.target.value }))}
              placeholder={q.facebookLabel}
              maxLength={300}
              inputMode="url"
              autoComplete="off"
            />
            <input
              className={inputCls}
              value={socials.tiktok}
              onChange={(e) => setSocials((s) => ({ ...s, tiktok: e.target.value }))}
              placeholder={q.tiktokLabel}
              maxLength={300}
              inputMode="url"
              autoComplete="off"
            />
          </div>

          {/* Collapsible "more details" section */}
          <div className="rounded-2xl border border-neutral-200 bg-white">
            <button
              type="button"
              onClick={() => setMoreOpen((o) => !o)}
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-neutral-700"
              aria-expanded={moreOpen}
            >
              <span>{q.moreToggle}</span>
              {moreOpen ? (
                <ChevronUp size={16} className="text-neutral-400" />
              ) : (
                <ChevronDown size={16} className="text-neutral-400" />
              )}
            </button>
            {moreOpen && (
              <div className="flex flex-col gap-2 border-t border-neutral-100 px-3 pb-3 pt-2">
                <input
                  className={inputCls}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder={q.whatsappLabel}
                  maxLength={40}
                  inputMode="tel"
                  autoComplete="tel"
                />
                <input
                  className={inputCls}
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder={q.websiteLabel}
                  maxLength={300}
                  inputMode="url"
                  autoComplete="url"
                />
                <input
                  className={inputCls}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={q.addressLabel}
                  maxLength={300}
                  autoComplete="street-address"
                />
                <textarea
                  className={`${inputCls} resize-none`}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={q.bioLabel}
                  rows={3}
                  maxLength={600}
                />
                <input
                  className={inputCls}
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder={q.videoLabel}
                  maxLength={300}
                  inputMode="url"
                  autoComplete="off"
                />
              </div>
            )}
          </div>

          <CardLanguageSelector
            value={cardLocale}
            onChange={setCardLocale}
            compact
            L={(k, fb) =>
              ((t.products.digitalCard.order.form ?? {}) as Record<string, string>)[k] ?? fb
            }
          />

          {error && <p className="text-sm text-signal-err">{error}</p>}

          <button
            type="submit"
            disabled={busy || photoUploading || logoUploading}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-copper px-6 py-3.5 text-base font-semibold text-white shadow-[0_8px_24px_-8px_rgba(194,121,64,0.55)] transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            {busy ? q.submitting : q.submit}
          </button>
          <p className="text-center text-xs text-neutral-400">{q.designHint}</p>
        </form>

        <div className="mt-8 flex flex-col items-center gap-3 border-t border-neutral-200 pt-6">
          <Link
            href={`/products/digital-card${event ? `?event=${encodeURIComponent(event.slug)}` : ""}`}
            className="text-sm text-neutral-500 underline underline-offset-4 hover:text-neutral-700"
          >
            {q.fullFormLink}
          </Link>
          <p className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs text-neutral-400">
            <span aria-hidden>📱</span>
            {t.card.mobileAppSoon}
          </p>
        </div>
      </div>
    </main>
  );
}
