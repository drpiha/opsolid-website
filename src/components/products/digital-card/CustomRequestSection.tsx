"use client";

// =============================================================================
// CustomRequestSection — the "prefer we design it for you?" block on the OpSo
// Smart product page. Two done-for-you paths (white-glove €299 + bespoke/team
// on request), the direct-contact channels (WhatsApp ×2 / phone / email), and a
// quote-on-request form that posts to the existing /api/contact endpoint
// (source="digital-card-custom"). Copy comes from t.v2.digitalCard.customRequest.
// =============================================================================

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { LocaleLink } from "@/components/shared/LocaleLink";
import { ContactChannels } from "./ContactChannels";

type Status = "idle" | "submitting" | "success" | "error";

export function CustomRequestSection() {
  const { t } = useLocale();
  const d = t.v2.digitalCard.customRequest;
  const f = d.form;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const canSubmit =
    name.trim() && email.trim() && message.trim() && consent && status !== "submitting";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");

    // Fold the card-specific fields into the message body — /api/contact only
    // has name/email/company/message + short source/teamSize buckets.
    const composed = [
      "[ OpSo Smart — custom card request ]",
      industry.trim() ? `Industry: ${industry.trim()}` : null,
      teamSize ? `Cards: ${teamSize}` : null,
      "",
      message.trim(),
    ]
      .filter((l) => l !== null)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || undefined,
          message: composed,
          source: "digital-card-custom",
          teamSize: teamSize || undefined,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="os-section" id="custom" data-screen-label="Custom request">
      <div className="wrap">
        <div className="os-process-intro" style={{ marginBottom: 28 }}>
          <span className="meta meta-hot">{d.eyebrow}</span>
          <h2>{d.headline}</h2>
          <p className="lead">{d.lead}</p>
        </div>

        {/* Two done-for-you option cards */}
        <div className="grid gap-4 md:grid-cols-2" style={{ marginBottom: 28 }}>
          {d.options.map((opt, i) => (
            <div key={i} className="panel" style={{ padding: 22 }}>
              <div className="flex items-center justify-between gap-3">
                <span className="chip">{opt.tag}</span>
                <span className="text-sm font-semibold text-copper">{opt.price}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-ink">{opt.title}</h3>
              <p className="mt-1.5 text-sm text-ink-200">{opt.body}</p>
            </div>
          ))}
        </div>

        {/* Channels + request form, side by side on desktop */}
        <div className="grid gap-4 lg:grid-cols-2">
          <ContactChannels
            heading={d.channels.heading}
            note={d.channels.note}
            prefill={d.channels.prefill}
            labels={d.channels.labels}
          />

          <form className="panel" style={{ padding: 22 }} onSubmit={handleSubmit}>
            <div className="meta meta-hot mb-3">{f.heading}</div>

            {status === "success" ? (
              <p className="rounded-xl border border-line bg-bg-2 px-4 py-6 text-center text-sm text-ink-200">
                {f.success}
              </p>
            ) : (
              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-xs text-ink-300">{f.name}</span>
                    <input
                      className="field w-full"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-ink-300">{f.email}</span>
                    <input
                      type="email"
                      className="field w-full"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-xs text-ink-300">{f.company}</span>
                    <input
                      className="field w-full"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      autoComplete="organization"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-ink-300">{f.industry}</span>
                    <input
                      className="field w-full"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1 block text-xs text-ink-300">{f.teamSize}</span>
                  <select
                    className="field w-full"
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                  >
                    <option value="">—</option>
                    {f.teamSizeOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-ink-300">{f.message}</span>
                  <textarea
                    className="field w-full"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </label>
                <label className="flex items-start gap-2 text-xs text-ink-300">
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                  />
                  <span>
                    {f.consent}{" "}
                    <LocaleLink href="/privacy" className="underline">
                      ↗
                    </LocaleLink>
                  </span>
                </label>

                {status === "error" && (
                  <p className="text-xs text-signal-err">{f.error}</p>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!canSubmit}
                >
                  {status === "submitting" ? f.submitting : f.submit}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
