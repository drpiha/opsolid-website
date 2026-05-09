"use client";

// =============================================================================
// ExchangeButton — "Kartımı Gönder" / "Send my card" CTA.
//
// Two distinct paths depending on whether the visitor has their own card:
//
//   • Has a card slug → single tap creates a CardConnection (mutual exchange)
//   • No card slug  → bottom sheet offers:
//       1. "Save to contacts" — downloads the owner's vCard (primary action)
//       2. "I have a card" — expands to enter slug for exchange
//
// Slug discovery: ?visitor=<slug> query param > localStorage["myCardSlug"]
// =============================================================================

import { useEffect, useState } from "react";
import { Send, X, CheckCircle2, AlertCircle, Info, Download, CreditCard } from "lucide-react";
import { useIsOwner } from "@/context/OwnerMode";

interface Props {
  slug: string;
  primary: string;
  locale?: "de" | "en" | "tr" | "es" | "it" | "fr" | "ar";
}

type Status = "idle" | "submitting" | "ok" | "duplicate" | "error";
type NoCardView = "choice" | "slug-input";

const STRINGS = {
  de: {
    cta: "Meine Karte senden",
    modalTitle: "Was möchten Sie tun?",
    saveContact: "Kontakt speichern",
    saveContactSub: "Visitenkarte auf Ihr Gerät laden",
    exchangeToggle: "Ich habe auch eine Karte",
    slugTitle: "Ihre Kartenadresse",
    slugPrompt: "Adresse Ihrer OpSolid-Karte:",
    slugPrefix: "opsolid.de/c/",
    slugPlaceholder: "vorname-nachname",
    slugSave: "Senden",
    slugCancel: "Abbrechen",
    success: "Ihre Karte wurde gesendet. Verbindung hergestellt.",
    duplicate: "Verbindung besteht bereits. Der Karteninhaber wurde informiert.",
    error: "Verbindung fehlgeschlagen. Bitte erneut versuchen.",
    networkError: "Netzwerkfehler. Bitte erneut versuchen.",
    selfError: "Eigene Karte kann nicht ausgetauscht werden.",
    sending: "Wird gesendet…",
    close: "Schließen",
  },
  en: {
    cta: "Send my card",
    modalTitle: "What would you like to do?",
    saveContact: "Save contact",
    saveContactSub: "Download the vCard to your device",
    exchangeToggle: "I have a card too",
    slugTitle: "Your card address",
    slugPrompt: "Enter the address of your OpSolid card:",
    slugPrefix: "opsolid.de/c/",
    slugPlaceholder: "first-last",
    slugSave: "Send",
    slugCancel: "Cancel",
    success: "Your card has been sent. Connection created.",
    duplicate: "Connection already exists. The card owner has been notified.",
    error: "Could not create connection. Please try again.",
    networkError: "Network error. Please try again.",
    selfError: "Cannot exchange a card with itself.",
    sending: "Sending…",
    close: "Close",
  },
  tr: {
    cta: "Kartımı Gönder",
    modalTitle: "Ne yapmak istersiniz?",
    saveContact: "Rehbere kaydet",
    saveContactSub: "Sahibin kartını cihazınıza indirin",
    exchangeToggle: "Benim de kartım var",
    slugTitle: "Kart adresiniz",
    slugPrompt: "Kendi OpSolid kartınızın adresini girin:",
    slugPrefix: "opsolid.de/c/",
    slugPlaceholder: "ad-soyad",
    slugSave: "Gönder",
    slugCancel: "İptal",
    success: "Kartınız gönderildi! Bağlantı oluşturuldu.",
    duplicate: "Bağlantı zaten var. Kart sahibi bilgilendirildi.",
    error: "Bağlantı oluşturulamadı. Lütfen tekrar deneyin.",
    networkError: "Ağ hatası. Lütfen tekrar deneyin.",
    selfError: "Aynı kart ile takas yapılamaz.",
    sending: "Gönderiliyor…",
    close: "Kapat",
  },
} as const;

const LS_KEY = "myCardSlug";

export function ExchangeButton({ slug, primary, locale = "de" }: Props) {
  // The exchange modal copy ships in en/de/tr today; for es/it/fr/ar we fall
  // back to en at runtime until the modal copy is widened.
  const narrowedLocale = (locale === "de" || locale === "en" || locale === "tr") ? locale : "en";
  const t = STRINGS[narrowedLocale] ?? STRINGS.en;
  const isOwner = useIsOwner();

  const [open, setOpen] = useState(false);
  const [noCardView, setNoCardView] = useState<NoCardView>("choice");
  const [mySlug, setMySlug] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [draftSlug, setDraftSlug] = useState("");

  useEffect(() => {
    try {
      const search = new URLSearchParams(window.location.search);
      const fromQuery = (search.get("visitor") ?? "").trim();
      if (fromQuery) {
        setMySlug(fromQuery);
        try { window.localStorage.setItem(LS_KEY, fromQuery); } catch { /* ignore */ }
        return;
      }
      const stored = window.localStorage.getItem(LS_KEY);
      if (stored?.trim()) setMySlug(stored.trim());
    } catch { /* SSR / privacy mode */ }
  }, []);

  useEffect(() => {
    if (status === "idle" || status === "submitting") return;
    const timer = setTimeout(() => { setStatus("idle"); setErrorMsg(""); }, 5000);
    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Hide the visitor-side exchange CTA when the card owner is previewing
  // their own card via `?owner=<editToken>`. Must come AFTER all hooks so
  // the call order stays stable across renders.
  if (isOwner) return null;

  function readSourceFromUrl() {
    try {
      const s = new URLSearchParams(window.location.search);
      return { source: s.get("src") || undefined, campaign: s.get("campaign") || undefined };
    } catch { return {}; }
  }

  async function postExchange(visitorSlug: string) {
    setStatus("submitting");
    setErrorMsg("");
    const { source, campaign } = readSourceFromUrl();
    try {
      const res = await fetch(`/api/cards/${encodeURIComponent(slug)}/exchange`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ visitorSlug, source, campaign }),
      });
      const body = await res.json().catch(() => null) as { ok?: boolean; existing?: boolean; error?: string } | null;
      if (res.ok) {
        setStatus(body?.existing === true ? "duplicate" : "ok");
        setOpen(false);
        return;
      }
      if (res.status === 400 && body?.error === "Cannot exchange with yourself.") {
        setErrorMsg(t.selfError);
        setStatus("error");
        return;
      }
      setErrorMsg(body?.error ?? t.error);
      setStatus("error");
    } catch {
      setErrorMsg(t.networkError);
      setStatus("error");
    }
  }

  function handleClick() {
    if (status === "submitting") return;
    if (mySlug) {
      void postExchange(mySlug);
    } else {
      setNoCardView("choice");
      setDraftSlug("");
      setOpen(true);
    }
  }

  function handleModalSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = draftSlug.trim();
    if (!trimmed) return;
    try { window.localStorage.setItem(LS_KEY, trimmed); } catch { /* ignore */ }
    setMySlug(trimmed);
    void postExchange(trimmed);
  }

  function handleVCardDownload() {
    window.location.href = `/api/cards/${encodeURIComponent(slug)}/vcard`;
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "submitting"}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition active:scale-[0.99] disabled:opacity-60"
        style={{ borderColor: primary, color: primary, background: `${primary}10` }}
      >
        <Send size={15} strokeWidth={2.2} />
        {status === "submitting" ? t.sending : t.cta}
      </button>

      {status !== "idle" && status !== "submitting" && (
        <StatusBanner
          status={status}
          message={status === "ok" ? t.success : status === "duplicate" ? t.duplicate : errorMsg || t.error}
          primary={primary}
        />
      )}

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/55 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exchange-modal-title"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-t-3xl bg-bg-1 ring-1 ring-line sm:rounded-3xl">
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <h3 id="exchange-modal-title" className="text-base font-semibold text-ink">
                {t.modalTitle}
              </h3>
              <button
                type="button"
                aria-label={t.close}
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-ink-300 hover:bg-bg-3 hover:text-ink"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </header>

            {noCardView === "choice" ? (
              <div className="grid gap-3 px-5 py-5">
                {/* Primary: save contact vCard */}
                <button
                  type="button"
                  onClick={handleVCardDownload}
                  className="flex items-start gap-4 rounded-2xl border-2 p-4 text-left transition hover:bg-bg-2 active:scale-[0.99]"
                  style={{ borderColor: primary }}
                >
                  <span
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: `${primary}18`, color: primary }}
                  >
                    <Download size={18} strokeWidth={2} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{t.saveContact}</span>
                    <span className="mt-0.5 block text-xs text-ink-400">{t.saveContactSub}</span>
                  </span>
                </button>

                {/* Secondary: I have a card → exchange */}
                <button
                  type="button"
                  onClick={() => setNoCardView("slug-input")}
                  className="flex items-start gap-4 rounded-2xl border border-line p-4 text-left transition hover:bg-bg-2 active:scale-[0.99]"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-bg-3 text-ink-300">
                    <CreditCard size={18} strokeWidth={2} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{t.exchangeToggle}</span>
                    <span className="mt-0.5 block text-xs text-ink-400">{t.slugPrompt}</span>
                  </span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleModalSave} className="grid gap-4 px-5 py-5 text-sm" noValidate>
                <p className="text-sm text-ink-300">{t.slugPrompt}</p>
                <label className="grid gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
                    {t.slugTitle}
                  </span>
                  <div className="flex items-stretch overflow-hidden rounded-xl border border-line bg-bg-2 focus-within:border-line-firm focus-within:ring-1 focus-within:ring-line-firm">
                    <span className="flex shrink-0 items-center bg-bg-3 px-3 font-mono text-xs text-ink-400">
                      {t.slugPrefix}
                    </span>
                    <input
                      autoFocus
                      name="visitorSlug"
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      value={draftSlug}
                      onChange={(e) => setDraftSlug(e.target.value)}
                      placeholder={t.slugPlaceholder}
                      className="w-full bg-transparent px-3 py-2 text-sm text-ink placeholder-ink-400 focus:outline-none"
                    />
                  </div>
                </label>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setNoCardView("choice")}
                    className="rounded-2xl border border-line bg-bg-2 px-4 py-2 text-sm font-medium text-ink hover:bg-bg-3"
                  >
                    ←
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-2xl border border-line bg-bg-2 px-4 py-2 text-sm font-medium text-ink hover:bg-bg-3"
                    >
                      {t.slugCancel}
                    </button>
                    <button
                      type="submit"
                      disabled={!draftSlug.trim() || status === "submitting"}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2 text-sm font-semibold text-white shadow-depth-2 transition active:scale-[0.99] disabled:opacity-60"
                      style={{ background: primary }}
                    >
                      <Send size={14} strokeWidth={2.2} />
                      {status === "submitting" ? t.sending : t.slugSave}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function StatusBanner({
  status,
  message,
  primary,
}: {
  status: Exclude<Status, "idle" | "submitting">;
  message: string;
  primary: string;
}) {
  if (status === "ok") {
    return (
      <div
        role="status"
        className="mt-2 flex items-center gap-2 rounded-xl border px-3 py-2 text-xs"
        style={{ background: `${primary}15`, color: primary, borderColor: `${primary}55` }}
      >
        <CheckCircle2 size={14} strokeWidth={2.2} />
        <span>{message}</span>
      </div>
    );
  }
  if (status === "duplicate") {
    return (
      <div role="status" className="mt-2 flex items-center gap-2 rounded-xl border border-line bg-bg-2 px-3 py-2 text-xs text-ink-300">
        <Info size={14} strokeWidth={2.2} />
        <span>{message}</span>
      </div>
    );
  }
  return (
    <div role="alert" className="mt-2 flex items-center gap-2 rounded-xl border border-signal-err/40 bg-signal-err/10 px-3 py-2 text-xs text-signal-err">
      <AlertCircle size={14} strokeWidth={2.2} />
      <span>{message}</span>
    </div>
  );
}
