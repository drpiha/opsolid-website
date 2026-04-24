"use client";

import { useState } from "react";
import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { useLocale } from "@/context/LocaleContext";

/**
 * Journal index — industrial-luxury v2 port of blog.html.
 *
 * Real informational posts (from t.blog.posts) render in the v2 journal
 * aesthetic: the most recent as a feature block with a lattice art panel,
 * the rest as a grid. The subscribe panel posts through /api/contact so
 * anyone interested hears about new pieces.
 *
 * If the posts list is empty the surface falls back to the "Vol. 0 —
 * coming" scaffold so the page still reads as a finished journal shell.
 */
export function BlogPage() {
  const { t } = useLocale();
  const b = t.v2.blog;
  const posts = t.blog.posts ?? [];
  const sorted = [...posts].sort((a, b) =>
    (b.date ?? "").localeCompare(a.date ?? ""),
  );
  const [feature, ...rest] = sorted;

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"idle" | "ok" | "error">("idle");

  const onSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting || !email.trim()) return;
    setSubmitting(true);
    setResult("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Journal subscriber",
          email,
          topics: ["journal-subscribe"],
          message:
            "Subscribe to the OpSolid journal — notify on new long-form piece.",
        }),
      });
      setResult(res.ok ? "ok" : "error");
      if (res.ok) setEmail("");
    } catch {
      setResult("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="jn-head" data-screen-label="Journal Head">
        <div className="wrap">
          <span className="meta meta-hot">{b.head.eyebrow}</span>
          <h1 className="jn-title">
            {b.head.title.pre}
            <span className="editorial">{b.head.title.italic}</span>
            {b.head.title.post}
          </h1>
          <p className="lead" style={{ maxWidth: "62ch", marginTop: 16 }}>
            {b.head.intro}
          </p>
        </div>
      </section>

      {feature ? (
        <section className="os-section">
          <div className="wrap">
            <Link
              href={`/blog/${feature.slug}`}
              className="jn-feature"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="jn-feature-body">
                <span className="meta meta-hot">
                  FEATURED · {(feature.category ?? "NOTE").toUpperCase()}
                </span>
                <div className="jn-feature-h" style={{ marginTop: 14 }}>
                  {feature.title}
                </div>
                <p className="jn-feature-lede">{feature.excerpt}</p>
                <div className="jn-feature-meta">
                  {feature.date} · {feature.readTime} MIN
                </div>
              </div>
              <div className="jn-feature-art">
                <svg className="jn-art-lattice" viewBox="0 0 320 200">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <line
                      key={i}
                      x1={20 + i * 34}
                      y1={20}
                      x2={20 + i * 34}
                      y2={180}
                    />
                  ))}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <line
                      key={`h-${i}`}
                      x1={20}
                      y1={20 + i * 32}
                      x2={292}
                      y2={20 + i * 32}
                    />
                  ))}
                  {Array.from({ length: 54 }).map((_, i) => {
                    const x = 20 + (i % 9) * 34;
                    const y = 20 + Math.floor(i / 9) * 32;
                    const on = (i * 37) % 7 < 3;
                    return on ? (
                      <circle
                        key={`d-${i}`}
                        cx={x}
                        cy={y}
                        r="2.5"
                        className="jn-art-dot"
                      />
                    ) : null;
                  })}
                </svg>
              </div>
            </Link>
          </div>
        </section>
      ) : (
        <section className="os-section">
          <div className="wrap">
            <article className="jn-feature" style={{ pointerEvents: "none" }}>
              <div className="jn-feature-body">
                <span className="meta meta-hot">{b.emptyFeature.tag}</span>
                <div className="jn-feature-h" style={{ marginTop: 14 }}>
                  {b.emptyFeature.headline}
                </div>
                <p className="jn-feature-lede">{b.emptyFeature.lede}</p>
                <div className="jn-feature-meta">{b.emptyFeature.meta}</div>
              </div>
              <div className="jn-feature-art" />
            </article>
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="os-section">
          <div className="wrap">
            <div className="jn-grid">
              {rest.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="jn-post"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="jn-post-meta">
                    <span>{(p.category ?? "NOTE").toUpperCase()}</span>
                    <span>{p.readTime} MIN</span>
                  </div>
                  <div className="jn-post-h">{p.title}</div>
                  <div className="jn-post-s">{p.excerpt}</div>
                  <div className="jn-post-foot">{p.date}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="os-section">
        <div className="wrap">
          <div className="jn-series">
            <div className="jn-series-copy">
              <h3 style={{ marginBottom: 12 }}>{b.series.title}</h3>
              <p className="lead" style={{ maxWidth: "52ch" }}>
                {b.series.body}
              </p>
            </div>
            <form
              onSubmit={onSubscribe}
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <input
                type="email"
                required
                className="field"
                style={{ maxWidth: 320, flex: "1 1 220px" }}
                placeholder={b.series.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "…" : b.series.cta}
              </button>
              <span
                className="meta"
                style={{ color: "var(--ink-500)", width: "100%" }}
              >
                {b.series.legal}
              </span>
              {result === "ok" && (
                <span
                  className="meta"
                  style={{ color: "var(--copper-200)", width: "100%" }}
                >
                  ✓ {b.series.cta} — thanks.
                </span>
              )}
              {result === "error" && (
                <span
                  className="meta"
                  style={{ color: "var(--signal-err, #B8514B)", width: "100%" }}
                >
                  Something didn&rsquo;t send. Try again later.
                </span>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
