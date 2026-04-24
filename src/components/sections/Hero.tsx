import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { KineticMechanism } from "@/components/sections/hero/KineticMechanism";
import { Icon } from "@/components/shared/Icon";

/**
 * Homepage hero — verbatim port of the Claude Design v2 mock
 * (opsolid-design-system/project/ui_kits/website/index.html).
 * Copy, structure, and class names are 1:1 with the design.
 */
export function Hero() {
  return (
    <section className="os-hero" data-screen-label="Hero">
      <div className="os-hero-inner">
        <div>
          <div className="os-hero-meta">
            <span className="chip chip-hot">
              <span className="chip-dot chip-dot-live" /> AUTOMATION STUDIO
            </span>
            <span className="meta">[ 01 / 04 ] HAMBURG · DE</span>
          </div>
          <h1 className="os-hero-title">
            Automation that <span className="editorial">actually</span>
            <br />
            runs your operations — not the other way round.
          </h1>
          <p className="os-hero-lead">
            OpSolid builds the systems your operations already pretend to have.
            Workflow automation, systems integration, internal tools, and
            AI-assisted processes for mid-sized teams. No rebuild of your stack.
            No AI theater.
          </p>
          <div className="os-hero-ctas">
            <Link href="/contact" className="btn btn-primary btn-lg">
              Book a discovery call <Icon name="arrow" size={18} />
            </Link>
            <Link href="#capabilities" className="btn btn-ghost btn-lg">
              See what OpSolid builds
            </Link>
          </div>
          <div className="os-hero-stats">
            <div>
              <div className="os-stat-num">
                <span className="metallic-copper">42</span>
              </div>
              <div className="os-stat-label">Workflows in production</div>
            </div>
            <div>
              <div className="os-stat-num">
                <span className="metallic-copper">3.4M</span>
              </div>
              <div className="os-stat-label">Events routed / month</div>
            </div>
            <div>
              <div className="os-stat-num">
                <span className="metallic-copper">EU</span>
              </div>
              <div className="os-stat-label">Hosted in Frankfurt</div>
            </div>
          </div>
        </div>
        <KineticMechanism />
      </div>
    </section>
  );
}
