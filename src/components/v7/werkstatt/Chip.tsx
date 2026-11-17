import type { Chip } from "@/content/v7/types";

/** A status or price chip: live (copper square), plan (dashed, "geplant"), note (neutral tag). Styles: .wk-chip in base.css. */
export function ChipTag({ chip, className, wrap }: { chip: Chip; className?: string; wrap?: boolean }) {
  return <span className={`wk-chip is-${chip.kind}${wrap ? " is-wrap" : ""}${className ? ` ${className}` : ""}`}>{chip.text}</span>;
}
