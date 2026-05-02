"use client";

// =============================================================================
// PersonalStep — Faz 7.0a B0.7
//
// Pre-fills name from the User account; email is shown read-only (it's already
// owned by the account and we don't let onboarding diverge from it). Required
// fields: name + jobTitle. Phone is optional — the user can skip the whole
// step except name + jobTitle via "Skip & finish".
//
// Photo upload uses POST /api/uploads (kind=photo). Brand color is 6 swatches
// + a free-form hex input. Inline validation on blur, submit re-validates.
// =============================================================================

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Mail, ArrowLeft, ArrowRight, ImageIcon } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import type { OnboardingState } from "../OnboardingClient";

interface Props {
  value: OnboardingState;
  userEmail: string;
  onChange: (patch: Partial<OnboardingState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SWATCHES: readonly string[] = [
  "#1a365d", // navy
  "#7c2d12", // copper
  "#0e7490", // teal
  "#1f2937", // graphite
  "#9d174d", // burgundy
  "#15803d", // forest
];

const HEX_RE = /^#[0-9a-fA-F]{6}$/;
const PHONE_RE = /^[+0-9 ()\-\/.]{5,32}$/;

interface FieldErrors {
  name?: string;
  jobTitle?: string;
  phone?: string;
  brand?: string;
  photo?: string;
}

export function PersonalStep({
  value,
  userEmail,
  onChange,
  onNext,
  onBack,
}: Props) {
  const { t } = useLocale();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [customHex, setCustomHex] = useState(
    value.brandPrimaryHex && !SWATCHES.includes(value.brandPrimaryHex.toLowerCase())
      ? value.brandPrimaryHex
      : "",
  );

  const validate = useCallback(
    (skipOptional = false): FieldErrors => {
      const next: FieldErrors = {};
      const name = value.name.trim();
      if (name.length < 2) next.name = t.onboarding.errors.name_too_short;
      else if (name.length > 100) next.name = t.onboarding.errors.name_too_long;

      if (!skipOptional) {
        if (value.jobTitle.trim().length < 2)
          next.jobTitle = t.onboarding.errors.title_required;
      }

      if (value.phone.trim() && !PHONE_RE.test(value.phone.trim())) {
        next.phone = t.onboarding.errors.phone_invalid;
      }
      if (
        value.brandPrimaryHex &&
        !HEX_RE.test(value.brandPrimaryHex)
      ) {
        next.brand = t.onboarding.errors.brand_invalid;
      }
      return next;
    },
    [value, t],
  );

  const handleNext = (skip: boolean) => {
    const errs = validate(skip);
    setErrors(errs);
    if (Object.keys(errs).length === 0) onNext();
  };

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setErrors((e) => ({ ...e, photo: t.onboarding.errors.upload_failed }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((e) => ({ ...e, photo: t.onboarding.errors.upload_too_large }));
        return;
      }
      setUploading(true);
      setErrors((e) => ({ ...e, photo: undefined }));
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("kind", "photo");
        const res = await fetch("/api/uploads", { method: "POST", body: fd });
        if (!res.ok) throw new Error("upload_failed");
        const j = (await res.json()) as { path?: string };
        if (!j.path) throw new Error("upload_failed");
        onChange({ photoPath: j.path });
      } catch {
        setErrors((e) => ({ ...e, photo: t.onboarding.errors.upload_failed }));
      } finally {
        setUploading(false);
      }
    },
    [onChange, t],
  );

  const handleSwatch = (hex: string) => {
    setCustomHex("");
    onChange({ brandPrimaryHex: hex });
    setErrors((e) => ({ ...e, brand: undefined }));
  };

  const handleCustomHex = (raw: string) => {
    let hex = raw.trim();
    if (hex && !hex.startsWith("#")) hex = `#${hex}`;
    setCustomHex(hex);
    if (HEX_RE.test(hex)) {
      onChange({ brandPrimaryHex: hex });
      setErrors((e) => ({ ...e, brand: undefined }));
    } else if (hex.length > 0) {
      setErrors((e) => ({ ...e, brand: t.onboarding.errors.brand_invalid }));
    }
  };

  return (
    <section className="mx-auto max-w-[680px]">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {t.onboarding.personal.title}
        </h1>
        <p className="mt-2 text-sm text-ink-300 sm:text-base">
          {t.onboarding.personal.subtitle}
        </p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleNext(false);
        }}
        noValidate
      >
        {/* Two-column on sm+ for name + job title */}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={t.onboarding.personal.nameLabel}
            error={errors.name}
            required
          >
            <input
              type="text"
              value={value.name}
              onChange={(e) => {
                onChange({ name: e.target.value });
                setErrors((er) => ({ ...er, name: undefined }));
              }}
              placeholder={t.onboarding.personal.namePlaceholder}
              maxLength={100}
              className={inputClass(!!errors.name)}
              required
              autoFocus
            />
          </Field>
          <Field
            label={t.onboarding.personal.titleLabel}
            error={errors.jobTitle}
            required
          >
            <input
              type="text"
              value={value.jobTitle}
              onChange={(e) => {
                onChange({ jobTitle: e.target.value });
                setErrors((er) => ({ ...er, jobTitle: undefined }));
              }}
              placeholder={t.onboarding.personal.titlePlaceholder}
              maxLength={120}
              className={inputClass(!!errors.jobTitle)}
              required
            />
          </Field>
        </div>

        <Field
          label={t.onboarding.personal.emailLabel}
          hint={t.onboarding.personal.emailHint}
        >
          <div className="relative">
            <Mail
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300"
            />
            <input
              type="email"
              value={userEmail}
              readOnly
              disabled
              className={`${inputClass(false)} cursor-not-allowed bg-bg-1 pl-10 text-ink-300`}
            />
          </div>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t.onboarding.personal.phoneLabel} error={errors.phone}>
            <input
              type="tel"
              value={value.phone}
              onChange={(e) => {
                onChange({ phone: e.target.value });
                setErrors((er) => ({ ...er, phone: undefined }));
              }}
              placeholder="+49 ..."
              maxLength={32}
              className={inputClass(!!errors.phone)}
            />
          </Field>
          <Field label={t.onboarding.personal.companyLabel}>
            <input
              type="text"
              value={value.company}
              onChange={(e) => onChange({ company: e.target.value })}
              placeholder={t.onboarding.personal.companyPlaceholder}
              maxLength={160}
              className={inputClass(false)}
            />
          </Field>
        </div>

        <Field label={t.onboarding.personal.bioLabel}>
          <textarea
            value={value.bio}
            onChange={(e) => onChange({ bio: e.target.value })}
            placeholder={t.onboarding.personal.bioPlaceholder}
            rows={3}
            maxLength={600}
            className={`${textareaClass()} resize-none`}
          />
          <div className="mt-1 text-right text-[11px] text-ink-300">
            {value.bio.length}/600
          </div>
        </Field>

        {/* Photo */}
        <Field label={t.onboarding.personal.photoLabel} error={errors.photo}>
          <div
            className={[
              "relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition-all",
              dragOver
                ? "border-copper bg-copper-50/50"
                : value.photoPath
                ? "border-line bg-bg-1"
                : "border-line bg-bg-1 hover:border-copper hover:bg-copper-50/40",
            ].join(" ")}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFile(file);
            }}
          >
            {value.photoPath ? (
              <div className="flex w-full items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full border border-line">
                  <Image
                    src={value.photoPath}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-display text-sm font-semibold text-ink">
                    {t.onboarding.personal.photoUploaded}
                  </div>
                  <div className="text-xs text-ink-300">
                    {t.onboarding.personal.photoChange}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onChange({ photoPath: null })}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-300 transition-colors hover:border-copper hover:text-copper"
                  aria-label={t.onboarding.personal.photoRemove}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-0 text-ink-300">
                  {uploading ? (
                    <Upload size={18} className="animate-pulse text-copper" />
                  ) : (
                    <ImageIcon size={18} />
                  )}
                </span>
                <div className="space-y-1">
                  <div className="font-display text-sm font-semibold text-ink">
                    {uploading
                      ? t.onboarding.personal.photoUploading
                      : t.onboarding.personal.photoCta}
                  </div>
                  <div className="text-xs text-ink-300">
                    {t.onboarding.personal.photoHint}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="mt-1 inline-flex items-center gap-2 rounded-full border border-line bg-bg-0 px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-copper hover:text-copper disabled:opacity-50"
                >
                  <Upload size={12} />
                  {t.onboarding.personal.photoBrowse}
                </button>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
          </div>
        </Field>

        {/* Brand color */}
        <Field label={t.onboarding.personal.brandColorLabel} error={errors.brand}>
          <div className="flex flex-wrap items-center gap-3">
            {SWATCHES.map((hex) => {
              const selected = value.brandPrimaryHex?.toLowerCase() === hex;
              return (
                <button
                  key={hex}
                  type="button"
                  onClick={() => handleSwatch(hex)}
                  className={[
                    "relative h-9 w-9 rounded-full border-2 transition-transform",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper/40",
                    selected
                      ? "scale-110 border-copper shadow-md"
                      : "border-line hover:scale-105",
                  ].join(" ")}
                  style={{ backgroundColor: hex }}
                  aria-label={hex}
                  aria-pressed={selected}
                />
              );
            })}
            <div className="ml-2 flex items-center gap-2">
              <span
                className="inline-block h-7 w-7 rounded-md border border-line"
                style={{
                  backgroundColor: HEX_RE.test(customHex) ? customHex : "transparent",
                }}
                aria-hidden
              />
              <input
                type="text"
                value={customHex}
                onChange={(e) => handleCustomHex(e.target.value)}
                placeholder="#1a365d"
                maxLength={7}
                className="h-9 w-28 rounded-full border border-line bg-bg-1 px-3 text-xs font-mono text-ink placeholder:text-ink-300 focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20"
              />
            </div>
          </div>
        </Field>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-line-soft pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 self-start text-sm font-medium text-ink-300 transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} />
            {t.onboarding.back}
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNext(true)}
              className="text-sm font-medium text-ink-300 transition-colors hover:text-ink"
            >
              {t.onboarding.personal.skipCta}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-copper px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(194,121,64,0.6)] transition-all hover:bg-copper-700 hover:shadow-[0_12px_30px_-12px_rgba(194,121,64,0.7)]"
            >
              {t.onboarding.next}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Internal field primitives — kept inline (vs reaching for the global Input
// component) because the onboarding visual style differs slightly: longer
// padding, copper focus ring, hint row below the input. These won't be reused
// outside this step.
// -----------------------------------------------------------------------------

function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1 text-sm font-semibold text-ink">
        {label}
        {required && <span className="text-copper">*</span>}
      </span>
      {children}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-ink-300">{hint}</p>
      )}
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return [
    "block w-full rounded-2xl border bg-bg-1 px-4 py-3 text-sm text-ink placeholder:text-ink-300 transition-colors",
    "focus:outline-none focus:ring-2",
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
      : "border-line focus:border-copper focus:ring-copper/20",
  ].join(" ");
}

function textareaClass() {
  return "block w-full rounded-2xl border border-line bg-bg-1 px-4 py-3 text-sm text-ink placeholder:text-ink-300 transition-colors focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20";
}
