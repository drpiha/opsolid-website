"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function PublishAction({
  orderId,
  token,
}: {
  orderId: string;
  token: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [designNotes, setDesignNotes] = useState("");

  const onPublish = async () => {
    if (!confirm("Publish this card now? This assigns the public slug.")) return;
    setBusy(true);
    const res = await fetch(
      `/api/admin/orders/${orderId}/publish?token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designNotes: designNotes.trim() || undefined }),
      }
    );
    setBusy(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      alert(body.error ?? `HTTP ${res.status}`);
      return;
    }
    startTransition(() => {
      router.push(
        `/admin/orders?token=${encodeURIComponent(token)}&tab=active`
      );
      router.refresh();
    });
  };

  const disabled = busy || pending;

  return (
    <section className="mt-6 rounded-3xl border border-signal-warn/40 bg-signal-warn/10 p-6">
      <h2 className="text-heading-sm text-ink">
        Ready for design review
      </h2>
      <p className="mt-2 text-sm text-ink/70">
        Hand-design the card, then publish. Customer is promised a 48h
        hand-designed delivery.
      </p>
      <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-ink/60">
        Design notes (internal)
      </label>
      <textarea
        value={designNotes}
        onChange={(e) => setDesignNotes(e.target.value)}
        disabled={disabled}
        rows={3}
        placeholder="Adjustments you made, fonts/colors used, anything worth recording."
        className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white p-3 text-sm text-ink focus:border-ink focus:outline-none disabled:opacity-50"
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onPublish}
          disabled={disabled}
          className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-white hover:bg-ink/90 disabled:opacity-50"
        >
          {disabled ? "Publishing …" : "Publish card"}
        </button>
        <span className="text-xs text-ink/50">
          Assigns /c/&lt;slug&gt; and flips status to PUBLISHED.
        </span>
      </div>
    </section>
  );
}
