/**
 * The drawn "way" schema (Unternehmen menu card, door, About): four stations on a base line. Inline SVG; the text
 * uses the page fonts through CSS variables (no literal family names). One image with `ariaLabel` as its name; the
 * caller adds the Etikett ("Schema · ..."). A label may hold one line break ("\n") for a second line.
 *
 * - variant "wide" (default): 480 x 176, numbers above the stations, the last station filled in copper.
 * - variant "card": 288 x 150 for the 328 px mega-menu card (prototype geometry), numbers inside the stations, so
 *   the 11.5-unit labels render at about 11.5 px.
 */
export function WaySchema({
  labels,
  base,
  ariaLabel,
  className,
  variant = "wide",
}: {
  labels: [string, string, string, string];
  base: string;
  ariaLabel: string;
  className?: string;
  variant?: "wide" | "card";
}) {
  const cls = `wk-way${variant === "card" ? " is-card" : ""}${className ? ` ${className}` : ""}`;
  const lines = (s: string) => s.split("\n");

  if (variant === "card") {
    const xs = [30, 106, 182, 258];
    return (
      <svg viewBox="0 0 288 150" role="img" aria-label={ariaLabel} className={cls}>
        <path d="M30 44h228" stroke="var(--wk-copper-deep)" strokeWidth="1.5" fill="none" />
        {xs.map((x, i) => (
          <g key={x}>
            <rect x={x - 14} y={30} width={28} height={28} rx={8} fill="var(--wk-sheet)" stroke="var(--wk-ink)" strokeWidth="1.5" />
            <text x={x} y={48.5} textAnchor="middle" fill="var(--wk-copper-deep)" fontSize="12" style={{ fontFamily: "var(--wk-mono)" }}>
              {i + 1}
            </text>
            {lines(labels[i]).map((line, j) => (
              <text key={j} x={x} y={78 + j * 14} textAnchor="middle" fill="var(--wk-text)" fontSize="11.5" fontWeight={600} style={{ fontFamily: "var(--wk-sans)" }}>
                {line}
              </text>
            ))}
          </g>
        ))}
        <path d="M16 116h256" stroke="var(--wk-line-2)" strokeWidth="1.5" strokeDasharray="3 4" fill="none" />
        <text x="16" y="136" fill="var(--wk-muted)" fontSize="11" style={{ fontFamily: "var(--wk-mono)" }}>
          {base}
        </text>
      </svg>
    );
  }

  const xs = [48, 176, 304, 432];
  return (
    <svg viewBox="0 0 480 176" role="img" aria-label={ariaLabel} className={cls}>
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
          {lines(labels[i]).map((line, j) => (
            <text key={j} x={x} y={112 + j * 18} textAnchor="middle" fill="var(--wk-text)" fontSize="15" fontWeight={600} style={{ fontFamily: "var(--wk-sans)" }}>
              {line}
            </text>
          ))}
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
