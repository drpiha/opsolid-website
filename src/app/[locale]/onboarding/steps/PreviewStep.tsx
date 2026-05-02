"use client";

// =============================================================================
// PreviewStep — Faz 7.0a B0.7
//
// Final step. Renders a live, read-only preview of the card using the same
// template entry the user picked in Step 1 (falls back to SmartCard if the
// id is somehow unknown). Shows the suggested slug with a debounced
// availability check; on collision we fall through to numeric suffixes
// (-2, -3, …) so the user never sees a hard "taken" wall.
//
// Two CTAs:
//   - Publish     → POST /api/onboarding/cards { publish: true }   → /c/<slug>
//   - Save draft  → POST /api/onboarding/cards { publish: false }  → dashboard
// =============================================================================

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Save, Edit2 } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { SmartCard } from "@/components/cards/smart/SmartCard";
import { getTemplateEntry } from "@/components/cards/templates/v2/registry";
import type { CardData } from "@/lib/validation";
import type { OnboardingState } from "../OnboardingClient";

interface Props {
  value: OnboardingState;
  userEmail: string;
  userLocale: string;
  onBack: () => void;
}

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function PreviewStep({ value, userEmail, userLocale, onBack }: Props) {
  const { t } = useLocale();
  const router = useRouter();

  const initialBase = useMemo(() => slugify(value.name) || "card", [value.name]);
  const [slug, setSlug] = useState(initialBase);
  const [slugDirty, setSlugDirty] = useState(false);
  const [slugStatus, setSlugStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");
  const [submitting, setSubmitting] = useState<null | "publish" | "draft">(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Build the CardData blob shown in the preview (and sent to the API).
  const cardData = useMemo<CardData>(() => {
    const out: CardData = {
      name: value.name.trim() || t.onboarding.preview.previewFallbackName,
    };
    if (value.jobTitle.trim()) out.title = value.jobTitle.trim();
    if (value.company.trim()) out.company = value.company.trim();
    if (value.bio.trim()) out.bio = value.bio.trim();
    if (value.phone.trim()) out.phone = value.phone.trim();
    if (userEmail) out.email = userEmail;
    return out;
  }, [value, userEmail, t]);

  const entry = value.templateId != null ? getTemplateEntry(value.templateId) : undefined;
  const Template = entry?.Component ?? SmartCard;

  // -------------------------------------------------------------------------
  // Slug availability — debounced. Whenever the slug input changes we wait
  // 300ms then probe /api/orders/slug-available. On 200 we read available;
  // on collision the helper below auto-suggests -2/-3/... up to -8.
  // -------------------------------------------------------------------------
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const findAvailableNumeric = useCallback(
    async (base: string): Promise<string | null> => {
      for (let n = 2; n <= 8; n++) {
        const candidate = `${base}-${n}`;
        try {
          const res = await fetch(
            `/api/orders/slug-available?s=${encodeURIComponent(candidate)}`,
          );
          const j = (await res.json()) as { available?: boolean };
          if (j.available) return candidate;
        } catch {
          /* ignore — try next */
        }
      }
      return null;
    },
    [],
  );

  useEffect(() => {
    const trimmed = slug.trim();
    if (!trimmed) {
      setSlugStatus("invalid");
      return;
    }
    if (!SLUG_RE.test(trimmed) || trimmed.length < 3) {
      setSlugStatus("invalid");
      return;
    }
    setSlugStatus("checking");
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/orders/slug-available?s=${encodeURIComponent(trimmed)}`,
        );
        const j = (await res.json()) as { available?: boolean; ok?: boolean };
        if (j.ok === false) {
          setSlugStatus("invalid");
          return;
        }
        if (j.available) {
          setSlugStatus("available");
        } else {
          // Auto-suggest a numeric suffix when the user hasn't manually edited
          // — keeps the <60s flow fluid. If they did edit, just flag taken.
          if (!slugDirty) {
            const suggestion = await findAvailableNumeric(trimmed);
            if (suggestion) {
              setSlug(suggestion);
              setSlugStatus("available");
              return;
            }
          }
          setSlugStatus("taken");
        }
      } catch {
        setSlugStatus("idle");
      }
    }, 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [slug, slugDirty, findAvailableNumeric]);

  // Re-seed slug when the user edits their name on a previous step and
  // returns here without manually editing the slug field.
  useEffect(() => {
    if (slugDirty) return;
    setSlug(initialBase);
  }, [initialBase, slugDirty]);

  const submit = async (publish: boolean) => {
    setServerError(null);
    if (slugStatus === "invalid" || slugStatus === "taken") return;
    if (!value.templateId) return;
    setSubmitting(publish ? "publish" : "draft");
    try {
      const res = await fetch("/api/onboarding/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: value.templateId,
          cardData,
          desiredSlug: slug,
          brandPrimaryHex: value.brandPrimaryHex ?? undefined,
          photoPath: value.photoPath ?? undefined,
          publish,
          locale: userLocale,
        }),
      });
      const j = (await res.json()) as {
        card?: { slug: string };
        error?: { code: string };
      };
      if (!res.ok) {
        if (j.error?.code === "slug_taken") {
          setSlugStatus("taken");
          setServerError(t.onboarding.errors.slug_taken);
        } else {
          setServerError(t.onboarding.errors.network_error);
        }
        return;
      }
      if (publish && j.card?.slug) {
        // Hard navigation so the public card page boots fresh.
        window.location.assign(`/c/${j.card.slug}`);
      } else {
        router.push(`/${userLocale}/dashboard/cards`);
      }
    } catch {
      setServerError(t.onboarding.errors.network_error);
    } finally {
      setSubmitting(null);
    }
  };

  const canPublish =
    slugStatus === "available" && !!value.templateId && !submitting;

  return (
    <section className="mx-auto grid w-full max-w-[1080px] gap-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-12">
      {/* Left: meta + slug + actions */}
      <div className="order-2 lg:order-1">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t.onboarding.preview.title}
          </h1>
          <p className="mt-2 text-sm text-ink-300 sm:text-base">
            {t.onboarding.preview.subtitle}
          </p>
        </div>

        <div className="space-y-5 rounded-3xl border border-line bg-bg-1 p-6 sm:p-7">
          <div>
            <span className="mb-2 flex items-center justify-between text-sm font-semibold text-ink">
              {t.onboarding.preview.slugLabel}
              <SlugStatusBadge status={slugStatus} t={t} />
            </span>
            <div className="flex items-center overflow-hidden rounded-2xl border border-line bg-bg-0 px-4 transition-colors focus-within:border-copper focus-within:ring-2 focus-within:ring-copper/20">
              <span className="font-mono text-xs text-ink-300">opsolid.de/c/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setSlugDirty(true);
                }}
                className="flex-1 bg-transparent py-3 pl-1 font-mono text-sm text-ink focus:outline-none"
                maxLength={40}
                spellCheck={false}
              />
              {slugDirty && (
                <button
                  type="button"
                  onClick={() => {
                    setSlugDirty(false);
                    setSlug(initialBase);
                  }}
                  className="ml-2 text-ink-300 transition-colors hover:text-copper"
                  aria-label={t.onboarding.preview.slugReset}
                  title={t.onboarding.preview.slugReset}
                >
                  <Edit2 size={14} />
                </button>
              )}
            </div>
            {slugStatus === "taken" && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {t.onboarding.preview.slugTakenHint}
              </p>
            )}
            {slugStatus === "invalid" && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {t.onboarding.errors.slug_invalid}
              </p>
            )}
          </div>

          {/* Quick summary */}
          <div className="space-y-2 border-t border-line-soft pt-5 text-sm">
            <SummaryRow
              label={t.onboarding.preview.summaryName}
              value={value.name || "—"}
            />
            <SummaryRow
              label={t.onboarding.preview.summaryTitle}
              value={value.jobTitle || "—"}
            />
            {value.company && (
              <SummaryRow
                label={t.onboarding.preview.summaryCompany}
                value={value.company}
              />
            )}
            {value.phone && (
              <SummaryRow
                label={t.onboarding.preview.summaryPhone}
                value={value.phone}
              />
            )}
            <SummaryRow label={t.onboarding.preview.summaryEmail} value={userEmail} />
          </div>
        </div>

        {serverError && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </p>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 self-start text-sm font-medium text-ink-300 transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} />
            {t.onboarding.back}
          </button>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => submit(false)}
              disabled={!!submitting || slugStatus === "invalid"}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-bg-1 px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-copper hover:text-copper disabled:opacity-50"
            >
              <Save size={14} />
              {submitting === "draft"
                ? t.onboarding.preview.draftingState
                : t.onboarding.preview.draftCta}
            </button>
            <button
              type="button"
              onClick={() => submit(true)}
              disabled={!canPublish}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-copper px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(194,121,64,0.6)] transition-all hover:bg-copper-700 hover:shadow-[0_12px_30px_-12px_rgba(194,121,64,0.7)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
            >
              {submitting === "publish"
                ? t.onboarding.preview.publishingState
                : t.onboarding.preview.publishCta}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Right: live preview */}
      <div className="order-1 lg:order-2">
        <div className="sticky top-24">
          <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-ink-300">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-copper" />
            {t.onboarding.preview.livePreviewLabel}
          </div>
          <div className="rounded-3xl border border-line bg-bg-1 p-3 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.25)]">
            <div className="overflow-hidden rounded-2xl bg-bg-0">
              <Template
                slug={slug || "preview"}
                cardData={cardData}
                photoPath={value.photoPath ?? null}
                logoPath={null}
                brandPrimaryHex={value.brandPrimaryHex ?? null}
                brandAccentHex={null}
                siteUrl={
                  typeof window !== "undefined"
                    ? window.location.origin
                    : "https://opsolid.de"
                }
                locale={userLocale as "de" | "en" | "tr"}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <span className="text-ink-300">{label}</span>
      <span className="truncate text-right font-medium text-ink">{value}</span>
    </div>
  );
}

function SlugStatusBadge({
  status,
  t,
}: {
  status: "idle" | "checking" | "available" | "taken" | "invalid";
  t: ReturnType<typeof useLocale>["t"];
}) {
  if (status === "checking") {
    return (
      <span className="text-[11px] font-medium text-ink-300">
        {t.onboarding.preview.slugChecking}
      </span>
    );
  }
  if (status === "available") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
        ● {t.onboarding.preview.slugAvailable}
      </span>
    );
  }
  if (status === "taken") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700">
        ● {t.onboarding.preview.slugTaken}
      </span>
    );
  }
  return null;
}
