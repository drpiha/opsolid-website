import type { CSSProperties, ReactNode } from "react";
import type { Ground } from "@/content/v7/types";

/**
 * The section shell of the home blocks whose head sits inside their own grid (doors, check, products, about, form):
 * the same band as Section (ground class, optional mat with its mask, `aria-labelledby` on `<id>-h`), without the
 * standard head. The block renders its H2 with id `<id>-h`.
 */
export function HomeSection({
  id,
  ground = "paper",
  mat,
  className,
  children,
}: {
  id: string;
  ground?: Ground;
  mat?: boolean | string;
  className?: string;
  children: ReactNode;
}) {
  const style = typeof mat === "string" ? ({ ["--mat-mask" as string]: mat } as CSSProperties) : undefined;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-h`}
      data-ground={ground}
      style={style}
      className={`wk-sec wk-on-${ground}${mat ? " wk-mat" : ""}${className ? ` ${className}` : ""}`}
    >
      {children}
    </section>
  );
}
