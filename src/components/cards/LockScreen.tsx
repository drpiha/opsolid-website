"use client";

// =============================================================================
// LockScreen — password gate for password-protected cards (M5).
//
// Renders a single password input + submit button. Posts to
// /api/cards/[slug]/unlock; on success the server sets a 24h cookie and we
// reload the page (the SSR re-renders the actual card content because the
// cookie now resolves to "unlocked").
// =============================================================================

import { useState } from "react";

export function LockScreen({
  slug,
  labels,
}: {
  slug: string;
  labels: {
    title: string;
    subtitle: string;
    placeholder: string;
    submit: string;
    submitting: string;
    error: string;
  };
}) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim() || busy) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/cards/${encodeURIComponent(slug)}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        // Reload — the cookie is now set; SSR will render the card.
        window.location.reload();
        return;
      }
      setErr(labels.error);
    } catch {
      setErr(labels.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        background: "var(--bg-0, #faf7f1)",
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: "100%",
          maxWidth: 360,
          background: "var(--bg-1, #fff)",
          border: "1px solid var(--line, #e5e1d8)",
          borderRadius: 16,
          padding: 24,
          textAlign: "center",
        }}
      >
        <div
          aria-hidden
          style={{
            width: 48,
            height: 48,
            margin: "0 auto 16px",
            borderRadius: "50%",
            background: "var(--copper-50, #f5e6d3)",
            color: "var(--copper-600, #C27940)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}
        >
          {/* lock glyph as text since we can't pull a fresh icon dep here */}
          <span>🔒</span>
        </div>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 600,
            margin: "0 0 6px",
            color: "var(--ink, #1a1a1a)",
          }}
        >
          {labels.title}
        </h1>
        <p
          style={{
            fontSize: 13,
            margin: "0 0 18px",
            color: "var(--ink-300, #6b6b6b)",
          }}
        >
          {labels.subtitle}
        </p>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={labels.placeholder}
          disabled={busy}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid var(--line, #e5e1d8)",
            background: "var(--bg-0, #faf7f1)",
            fontSize: 14,
            marginBottom: 12,
          }}
        />
        {err ? (
          <p style={{ color: "#c0392b", fontSize: 12, margin: "0 0 10px" }}>
            {err}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy || password.trim().length === 0}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 10,
            border: "none",
            background: "var(--copper-600, #C27940)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: busy ? "default" : "pointer",
            opacity: busy ? 0.7 : 1,
          }}
        >
          {busy ? labels.submitting : labels.submit}
        </button>
      </form>
    </main>
  );
}
