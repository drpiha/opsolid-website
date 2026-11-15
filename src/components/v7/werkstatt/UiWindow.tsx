import type { ReactNode } from "react";

/**
 * A UI snippet window (always labelled Beispiel or Schema by the caller): a bar with two slots (left with the three
 * window dots, right), the body, and an optional role foot ("Entwurf: KI · Freigabe: Mensch"). `role="img"` turns
 * the whole window into one named picture; `group` keeps its text readable.
 */
export function UiWindow({
  bar,
  foot,
  ariaLabel,
  role = "img",
  className,
  children,
}: {
  bar: [ReactNode, ReactNode];
  foot?: { label: string; who: string }[];
  ariaLabel: string;
  role?: "img" | "group";
  className?: string;
  children: ReactNode;
}) {
  const hide = role === "img" ? true : undefined;
  return (
    <div role={role} aria-label={ariaLabel} className={`wk-ui${className ? ` ${className}` : ""}`}>
      <div className="wk-ui-bar" aria-hidden={hide}>
        <span className="inline-flex min-w-0 items-center">
          <span className="wk-ui-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          {bar[0]}
        </span>
        <span>{bar[1]}</span>
      </div>
      <div className="wk-ui-body" aria-hidden={hide}>
        {children}
      </div>
      {foot && foot.length > 0 && (
        <div className="wk-ui-foot" aria-hidden={hide}>
          {foot.map((f) => (
            <span key={f.label}>
              {f.label}: <b>{f.who}</b>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
