/**
 * The drawn "way" schema (Unternehmen door, About): four stations on a base line, the last one filled in copper.
 * Inline SVG; the text uses the page fonts through CSS variables (no literal family names). One image with
 * `ariaLabel` as its name; the caller adds the Etikett ("Schema · ...").
 */
export function WaySchema({ labels, base, ariaLabel, className }: { labels: [string, string, string, string]; base: string; ariaLabel: string; className?: string }) {
  const xs = [48, 176, 304, 432];
  return (
    <svg viewBox="0 0 480 176" role="img" aria-label={ariaLabel} className={`wk-way${className ? ` ${className}` : ""}`}>
      <line x1="48" y1="72" x2="432" y2="72" stroke="var(--wk-copper-deep)" strokeWidth="1.5" />
      {xs.map((x, i) => (
        <g key={x}>
          <rect
            x={x - 14}
            y={58}
            width={28}
            height={28}
            rx={8}
            fill={i === 3 ? "var(--wk-copper)" : "var(--wk-sheet)"}
            stroke={i === 3 ? "var(--wk-copper)" : "var(--wk-ink)"}
            strokeWidth="1.5"
          />
          <text x={x} y={112} textAnchor="middle" fill="var(--wk-text)" fontSize="15" fontWeight={600} style={{ fontFamily: "var(--wk-sans)" }}>
            {labels[i]}
          </text>
          <text x={x} y={38} textAnchor="middle" fill="var(--wk-muted)" fontSize="12" style={{ fontFamily: "var(--wk-mono)" }}>
            {String(i + 1).padStart(2, "0")}
          </text>
        </g>
      ))}
      <line x1="24" y1="150" x2="456" y2="150" stroke="var(--wk-line-2)" strokeWidth="1" />
      <text x="240" y="170" textAnchor="middle" fill="var(--wk-muted)" fontSize="12" style={{ fontFamily: "var(--wk-mono)" }}>
        {base}
      </text>
    </svg>
  );
}
