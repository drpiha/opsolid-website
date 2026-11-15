import type { ReactNode } from "react";

/** The rotated mono stamp on a drawn document ("Muster", "Beispiel, fiktiv"). Styles: .wk-stamp in base.css. */
export function Stamp({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={`wk-stamp${className ? ` ${className}` : ""}`}>{children}</span>;
}
