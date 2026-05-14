"use client";

import { Icon } from "@/components/shared/Icon";
import { useLocale } from "@/context/LocaleContext";

/**
 * "Für wen ist OpSolid geeignet?" — qualifies the prospect with a
 * five-item checklist. Copy at `t.v2.home.targetGroup.*`.
 */
export function TargetGroup() {
  const { t } = useLocale();
  const g = t.v2.home.targetGroup;

  return (
    <section className="os-section os-target-section" id="target" aria-labelledby="target-headline">
      <div className="wrap">
        <div className="os-section-head">
          <span className="meta meta-hot">{g.eyebrow}</span>
          <h2 id="target-headline">{g.headline}</h2>
          <p className="lead">{g.lead}</p>
        </div>

        <ul className="os-target-list" role="list">
          {g.items.map((item, i) => (
            <li key={i} className="os-target-item">
              <span className="os-target-check" aria-hidden="true">
                <Icon name="check" size={18} />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
