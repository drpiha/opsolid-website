import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { Icon } from "@/components/shared/Icon";

export function FinalCTA() {
  return (
    <section className="os-final-cta">
      <div className="wrap">
        <span
          className="meta meta-hot"
          style={{ marginBottom: 20, display: "inline-block" }}
        >
          [ LET&rsquo;S TALK ]
        </span>
        <h2>
          Let&rsquo;s see what can{" "}
          <span className="editorial">actually</span> be automated.
        </h2>
        <p className="lead" style={{ marginLeft: "auto", marginRight: "auto" }}>
          30 minutes. Operations walkthrough, candid opinion, and a written
          plan. No pitch deck, no sales motion — and no obligation if
          automation isn&rsquo;t the right tool for the job.
        </p>
        <div className="os-hero-ctas">
          <Link href="/contact" className="btn btn-primary btn-lg">
            Book a discovery call <Icon name="arrow" size={18} />
          </Link>
          <Link href="/blog" className="btn btn-ghost btn-lg">
            Read the journal
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
          BUILT IN GERMANY · GDPR-NATIVE · NO VENDOR LOCK-IN · EN · DE · TR
        </div>
      </div>
    </section>
  );
}
