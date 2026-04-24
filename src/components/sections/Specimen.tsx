export function Specimen() {
  return (
    <section className="os-specimen" data-screen-label="Specimen">
      <div className="os-specimen-inner">
        <div className="os-specimen-copy">
          <span className="meta meta-hot">[ 03 / 04 ] SPECIMEN</span>
          <h2>
            The operations your business{" "}
            <span className="editorial">already</span> pretends to have.
          </h2>
          <p>
            Three months into a typical engagement: quotes move from inbox to
            CRM without copy-paste, invoices reconcile themselves against POs,
            customer calls get answered before the second ring. Before &rarr;
            after, written as numbers instead of claims.
          </p>
          <div
            style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            <span className="chip">BEFORE · Manual overhead</span>
            <span className="chip chip-hot">AFTER · Operational clarity</span>
          </div>
        </div>
        <div className="os-metric-card">
          <div className="os-metric-row">
            <div className="os-metric-label">
              Median cycle time
              <small>Order &rarr; invoice, across all channels</small>
            </div>
            <div>
              <span className="os-metric-value">4h</span>
              <span className="os-metric-delta">&darr; 3 days</span>
            </div>
          </div>
          <div className="os-metric-row">
            <div className="os-metric-label">
              Manual touches per order
              <small>Real engagement, EU distributor</small>
            </div>
            <div>
              <span className="os-metric-value os-metric-value-sm">1.2</span>
              <span className="os-metric-delta">&darr; 6.8</span>
            </div>
          </div>
          <div className="os-metric-row">
            <div className="os-metric-label">
              First response, off-hours
              <small>Voice agent + WhatsApp triage</small>
            </div>
            <div>
              <span className="os-metric-value os-metric-value-sm">
                &lt;30s
              </span>
              <span className="os-metric-delta">from 14h</span>
            </div>
          </div>
          <div className="os-metric-row">
            <div className="os-metric-label">
              Vendor lock-in
              <small>Measured as weeks to exit</small>
            </div>
            <div>
              <span className="os-metric-value os-metric-value-sm">0</span>
              <span className="os-metric-delta">you own it</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
