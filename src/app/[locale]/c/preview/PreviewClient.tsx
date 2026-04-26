"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { CardDataSchema } from "@/lib/validation";
import type { CardData } from "@/lib/validation";
import { SmartCard } from "@/components/cards/smart/SmartCard";
import { getTemplateEntry } from "@/components/cards/templates/v2/registry";
import { getTypographyPreset } from "@/lib/typographyPresets";

interface SharePayload {
  templateId: number;
  cardData: CardData;
  photoPath?: string;
  logoPath?: string;
  brandPrimaryHex?: string;
  brandAccentHex?: string;
  locale: "de" | "en" | "tr";
}

function decodeShareHash(hash: string): SharePayload | null {
  try {
    const trimmed = hash.replace(/^#/, "").replace(/^d=/, "");
    if (!trimmed) return null;
    // base64url → base64
    const b64 = trimmed.replace(/-/g, "+").replace(/_/g, "/");
    // pad
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const json = new TextDecoder().decode(bytes);
    const raw = JSON.parse(json) as SharePayload;
    if (!raw || typeof raw !== "object") return null;
    if (typeof raw.templateId !== "number") return null;
    const cardOk = CardDataSchema.safeParse(raw.cardData);
    if (!cardOk.success) return null;
    return { ...raw, cardData: cardOk.data };
  } catch {
    return null;
  }
}

export function PreviewClient({ pageLocale }: { pageLocale: string }) {
  const [payload, setPayload] = useState<SharePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [siteUrl, setSiteUrl] = useState("https://opsolid.de");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSiteUrl(window.location.origin);
    const decoded = decodeShareHash(window.location.hash);
    if (!decoded) {
      setError(
        "Geçersiz veya boş önizleme bağlantısı. Lütfen bağlantının tamamını kullanın."
      );
      return;
    }
    setPayload(decoded);
  }, []);

  // Wire up the same wrapper CSS variables LivePreview uses, so photo position
  // and typography overrides render identically here.
  const wrapperStyle = useMemo<React.CSSProperties>(() => {
    if (!payload) return {};
    const photoPos = payload.cardData.photoPosition;
    const logoPos = payload.cardData.logoPosition;
    const tpKey = payload.cardData.typographyPreset;
    const style: Record<string, string | number> = {
      "--tpl-photo-x": `${photoPos?.x ?? 50}%`,
      "--tpl-photo-y": `${photoPos?.y ?? 50}%`,
      "--tpl-photo-scale": String(photoPos?.scale ?? 1),
      "--tpl-logo-x": `${logoPos?.x ?? 50}%`,
      "--tpl-logo-y": `${logoPos?.y ?? 50}%`,
      "--tpl-logo-scale": String(logoPos?.scale ?? 1),
    };
    if (tpKey && tpKey !== "default") {
      const preset = getTypographyPreset(tpKey);
      if (preset.displayFamily) style["--tpl-font-display"] = preset.displayFamily;
      if (preset.bodyFamily) style["--tpl-font-body"] = preset.bodyFamily;
    }
    return style as React.CSSProperties;
  }, [payload]);

  const orderHref = `/${pageLocale}/products/digital-card#order`;

  if (error) {
    return (
      <main className="min-h-screen bg-bg-0 px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <p className="mb-2 text-2xl">⚠️</p>
          <h1 className="font-serif text-heading-md text-ink">Önizleme yüklenemedi</h1>
          <p className="mt-3 text-sm text-ink/65">{error}</p>
          <Link
            href={orderHref}
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-neutral-50"
          >
            Karta dön
          </Link>
        </div>
      </main>
    );
  }

  if (!payload) {
    return (
      <main className="grid min-h-screen place-items-center bg-bg-0">
        <div className="text-center text-ink/55">
          <Eye className="mx-auto mb-2" size={20} />
          <p className="text-sm">Önizleme yükleniyor…</p>
        </div>
      </main>
    );
  }

  const entry = getTemplateEntry(payload.templateId);
  const Template = entry?.Component ?? SmartCard;

  return (
    <main className="min-h-screen bg-bg-0 px-4 py-8 pb-24 sm:py-12">
      {/* Preview banner */}
      <div className="mx-auto mb-5 flex w-full max-w-[460px] items-center justify-between gap-2 rounded-2xl border border-copper/30 bg-copper/10 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2">
          <Eye size={13} className="text-copper" />
          <span className="font-semibold text-ink">Önizleme</span>
          <span className="text-ink/55">— ödeme yapana kadar yayında değil</span>
        </div>
        <Link
          href={orderHref}
          className="rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-semibold text-neutral-50 hover:bg-neutral-800"
        >
          Yayınla
        </Link>
      </div>

      <div className="mx-auto w-full max-w-[460px]" data-card-tpl style={wrapperStyle}>
        <Template
          slug="preview"
          cardData={payload.cardData}
          photoPath={payload.photoPath ?? null}
          logoPath={payload.logoPath ?? null}
          brandPrimaryHex={payload.brandPrimaryHex ?? null}
          brandAccentHex={payload.brandAccentHex ?? null}
          siteUrl={siteUrl}
          locale={payload.locale}
        />
      </div>
    </main>
  );
}
