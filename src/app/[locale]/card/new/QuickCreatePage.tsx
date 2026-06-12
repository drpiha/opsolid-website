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
import { Camera, Loader2, Sparkles } from "lucide-react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { useLocale } from "@/context/LocaleContext";
import { downscaleImage } from "@/lib/images/downscale";

// Clean, sector-neutral default design. The owner can switch templates any
// time in the editor — quick create optimizes for "live now", not "perfect".
const DEFAULT_TEMPLATE_ID = 4;

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

  const [name, setName] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");

  const [photoPath, setPhotoPath] = React.useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = React.useState(false);

  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInput = React.useRef<HTMLInputElement>(null);

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError(q.errorRequired);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: DEFAULT_TEMPLATE_ID,
          billingMode: "FREE",
          locale: ["de", "en", "tr"].includes(locale) ? locale : "de",
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
          },
          photoPath: photoPath ?? undefined,
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
          {/* photo */}
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

          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder={`${q.nameLabel} *`} maxLength={120} autoComplete="name" />
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={q.titleLabel} maxLength={120} autoComplete="organization-title" />
          <input className={inputCls} value={company} onChange={(e) => setCompany(e.target.value)} placeholder={q.companyLabel} maxLength={120} autoComplete="organization" />
          <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={`${q.phoneLabel} *`} maxLength={40} inputMode="tel" autoComplete="tel" />
          <div>
            <input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder={`${q.emailLabel} *`} maxLength={200} inputMode="email" autoComplete="email" />
            <p className="mt-1.5 px-1 text-xs text-neutral-400">{q.emailHint}</p>
          </div>

          {error && <p className="text-sm text-signal-err">{error}</p>}

          <button
            type="submit"
            disabled={busy || photoUploading}
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
