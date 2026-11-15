import type { ReactNode } from "react";
import { Stamp } from "./Stamp";

/**
 * A Blatt (signature 3): a document drawn in HTML/CSS, lying on the ground with a sheet shadow. Head with title,
 * optional mono sub line and the stamp; body; optional mono foot. `ariaLabel` names it as a sample ("Muster: ...")
 * so a screen reader never takes it for a real document.
 */
export function Blatt({
  title,
  sub,
  stamp,
  foot,
  ariaLabel,
  className,
  children,
  titleAs = "p",
}: {
  title: ReactNode;
  sub?: ReactNode;
  stamp?: ReactNode;
  foot?: ReactNode;
  ariaLabel: string;
  className?: string;
  children?: ReactNode;
  /** The title element: a plain line by default, h3 when the sheet is a section's main piece. */
  titleAs?: "p" | "h3";
}) {
  const Title = titleAs;
  return (
    <article aria-label={ariaLabel} className={`wk-blatt${className ? ` ${className}` : ""}`}>
      <div className="wk-blatt-head">
        <div className="min-w-0">
          <Title className="wk-blatt-title">{title}</Title>
          {sub && <p className="wk-blatt-sub">{sub}</p>}
        </div>
        {stamp && <Stamp>{stamp}</Stamp>}
      </div>
      {children}
      {foot && <div className="wk-blatt-foot">{foot}</div>}
    </article>
  );
}
