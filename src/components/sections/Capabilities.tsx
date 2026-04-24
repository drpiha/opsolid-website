import { Icon } from "@/components/shared/Icon";

type IconName = "workflow" | "plug" | "bot" | "radio" | "ship" | "shield";

function CapabilityCard({
  icon,
  title,
  body,
  tag,
}: {
  icon: IconName;
  title: string;
  body: string;
  tag?: string;
}) {
  return (
    <article className="os-cap">
      <div className="os-cap-icon">
        <Icon name={icon} />
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
      {tag && <span className="os-cap-tag">{tag}</span>}
    </article>
  );
}

export function Capabilities() {
  return (
    <section
      className="os-section"
      id="capabilities"
      data-screen-label="Capabilities"
    >
      <div className="wrap">
        <div className="os-section-head">
          <span className="meta meta-hot">[ 02 / 04 ] CAPABILITIES</span>
          <h2>Four surfaces OpSolid owns end-to-end.</h2>
          <p className="lead">
            Not a platform. Not a marketplace. A small studio that takes
            operations as they are — manual, half-automated, stitched together —
            and leaves them running as systems that don&rsquo;t need
            babysitting.
          </p>
        </div>
        <div className="os-cap-grid">
          <CapabilityCard
            icon="workflow"
            title="Workflow automation"
            body="Orders, documents, approvals, communications. Built on n8n, Make, and custom connectors where those fall short — never on black-box SaaS."
            tag="N8N · MAKE · CUSTOM"
          />
          <CapabilityCard
            icon="plug"
            title="Systems integration"
            body="ERP, CRM, warehouse, billing, messaging — wired together so data moves once and reconciles automatically. Adapters owned by you, not rented."
            tag="ADAPTERS · WEBHOOKS · APIS"
          />
          <CapabilityCard
            icon="bot"
            title="AI-assisted processes"
            body="Where routing, extraction, or classification earns its keep — and only there. Advised against where it doesn't. Every model call audited and logged."
            tag="LLM · RETELL · VAPI"
          />
          <CapabilityCard
            icon="ship"
            title="Internal tools"
            body="Admin consoles, ops dashboards, approval queues. Built on the systems you already run so your team has one place to work from."
            tag="REACT · POSTGRES · CAL"
          />
          <CapabilityCard
            icon="radio"
            title="Voice & chat agents"
            body="Phone answering, WhatsApp triage, web chat. Transferred to humans when the script runs out — never when it's inconvenient for you."
            tag="24/7 · EN · DE · TR"
          />
          <CapabilityCard
            icon="shield"
            title="GDPR-native infrastructure"
            body="German hosting, EU data residency, ISO 27001-aligned practices. Every customer owns their data, their workflows, and their escape hatch."
            tag="FRA · AV-DSGVO · ISO 27001"
          />
        </div>
      </div>
    </section>
  );
}
