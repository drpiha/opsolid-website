"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";

/**
 * Contact page — industrial-luxury v2 port of contact.html.
 * Single `ct-hero` section with left column (meta + headline + contacts +
 * trust panel) and right column (discovery-call form). POSTs to
 * /api/contact — the same endpoint the old page used, so SMTP handling
 * stays intact.
 */
export function ContactPage() {
  const { t } = useLocale();
  const c = t.v2.contact;

  const [topics, setTopics] = useState<Set<string>>(
    new Set(["automation" as string]),
  );
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"idle" | "ok" | "error">("idle");

  const toggle = (k: string) => {
    const n = new Set(topics);
    if (n.has(k)) n.delete(k);
    else n.add(k);
    setTopics(n);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      company: String(fd.get("company") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      message: String(fd.get("message") || ""),
      topics: Array.from(topics),
    };
    setSubmitting(true);
    setResult("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setResult(res.ok ? "ok" : "error");
      if (res.ok) e.currentTarget.reset();
    } catch {
      setResult("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="ct-hero" data-screen-label="Contact">
      <div className="ct-grid">
        <div>
          <div className="os-hero-meta">
            <span className="chip chip-hot">
              <span className="chip-dot chip-dot-live" /> {c.hero.metaChip}
            </span>
            <span className="meta">{c.hero.metaLabel}</span>
          </div>
          <h1 className="ct-headline">
            {c.hero.title.pre}
            <span className="editorial">{c.hero.title.italic}</span>
            {c.hero.title.post}
          </h1>
          <p className="lead" style={{ maxWidth: "50ch" }}>
            {c.hero.lead}
          </p>

          <div className="ct-contact-list">
            {c.hero.contacts.map((item, i) => (
              <div key={i} className="ct-contact">
                <span className="ct-contact-k">{item.key}</span>
                {item.href ? (
                  <a
                    className="ct-contact-v"
                    href={item.href}
                    style={{
                      color: "var(--ink-100)",
                      textDecoration: "none",
                    }}
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="ct-contact-v">{item.value}</span>
                )}
                <span className="ct-contact-meta">{item.meta}</span>
              </div>
            ))}
          </div>

          <div className="ct-trust">
            {c.hero.trust.map((t, i) => (
              <div key={i} className="ct-trust-item">
                <em>{t.em}</em> {t.rest}
              </div>
            ))}
          </div>
        </div>

        <form className="ct-form-panel" onSubmit={onSubmit}>
          <div className="ct-form-header">
            <span className="ct-form-title">{c.form.title}</span>
            <span className="meta">{c.form.meta}</span>
          </div>
          <div className="ct-row">
            <label className="ct-field">
              <span>{c.form.fields.name.label}</span>
              <input
                name="name"
                required
                className="field"
                placeholder={c.form.fields.name.placeholder}
              />
            </label>
            <label className="ct-field">
              <span>{c.form.fields.company.label}</span>
              <input
                name="company"
                className="field"
                placeholder={c.form.fields.company.placeholder}
              />
            </label>
          </div>
          <div className="ct-row">
            <label className="ct-field">
              <span>{c.form.fields.email.label}</span>
              <input
                name="email"
                type="email"
                required
                className="field"
                placeholder={c.form.fields.email.placeholder}
              />
            </label>
            <label className="ct-field">
              <span>{c.form.fields.phone.label}</span>
              <input
                name="phone"
                className="field"
                placeholder={c.form.fields.phone.placeholder}
              />
            </label>
          </div>
          <div className="ct-field">
            <span>{c.form.fields.interest.label}</span>
            <div className="ct-topics">
              {c.form.topics.map((tp) => (
                <button
                  key={tp.key}
                  type="button"
                  className={"ct-topic" + (topics.has(tp.key) ? " is-on" : "")}
                  onClick={() => toggle(tp.key)}
                >
                  {tp.label}
                </button>
              ))}
            </div>
          </div>
          <div className="ct-field">
            <span>{c.form.fields.message.label}</span>
            <textarea
              name="message"
              className="field"
              placeholder={c.form.fields.message.placeholder}
            />
          </div>
          <div className="ct-form-foot">
            <p className="ct-legal">{c.form.legal}</p>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
            >
              {submitting ? "…" : c.form.submitCta}{" "}
              <Icon name="arrow" size={18} />
            </button>
          </div>
          {result === "ok" && (
            <p
              className="meta"
              style={{ color: "var(--signal-ok, #7FB286)", marginTop: 12 }}
            >
              {c.form.success}
            </p>
          )}
          {result === "error" && (
            <p
              className="meta"
              style={{ color: "var(--signal-err, #B8514B)", marginTop: 12 }}
            >
              {c.form.error}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
