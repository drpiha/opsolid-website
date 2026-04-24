"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";

/**
 * Recurring closing CTA — appears at the bottom of home and every product
 * page. Copy driven by `t.v2.home.finalCta.*`.
 */
export function FinalCTA() {
  const { t } = useLocale();
  const f = t.v2.home.finalCta;

  return (
    <section className="os-final-cta">
      <div className="wrap">
        <span
          className="meta meta-hot"
          style={{ marginBottom: 20, display: "inline-block" }}
        >
          {f.eyebrow}
        </span>
        <h2>
          {f.title.pre}
          <span className="editorial">{f.title.italic}</span>
          {f.title.post}
        </h2>
        <p className="lead" style={{ marginLeft: "auto", marginRight: "auto" }}>
          {f.lead}
        </p>
        <div className="os-hero-ctas">
          <Link href="/contact" className="btn btn-primary btn-lg">
            {f.ctaPrimary} <Icon name="arrow" size={18} />
          </Link>
          <Link href="/blog" className="btn btn-ghost btn-lg">
            {f.ctaSecondary}
          </Link>
        </div>
        <div
          style={{
            marginTop: 32,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.12em",
            color: "var(--ink-500)",
          }}
        >
          {f.trustLine}
        </div>
      </div>
    </section>
  );
}
