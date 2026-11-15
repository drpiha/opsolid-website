import type { ReactNode } from "react";

/**
 * The Etikett (signature 1 of design C): a mono label with a 9 px outlined square that says what a piece is
 * ("Render · Muster-Agenda", "Schema", "Beispiel"). `solid` fills the square in copper (a section's own label).
 * Styles: .wk-etikett in src/styles/werkstatt/base.css.
 */
export function Etikett({
  children,
  solid,
  as = "span",
  className,
  id,
}: {
  children: ReactNode;
  solid?: boolean;
  as?: "span" | "p" | "figcaption";
  className?: string;
  id?: string;
}) {
  const Tag = as;
  return (
    <Tag id={id} className={`wk-etikett${solid ? " is-solid" : ""}${className ? ` ${className}` : ""}`}>
      {children}
    </Tag>
  );
}
