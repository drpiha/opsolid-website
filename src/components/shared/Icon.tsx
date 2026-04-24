/**
 * Inline-SVG Lucide icons. Mirrors the design bundle's Icon helper so
 * Capabilities, CTAs, and other surfaces all draw from the same glyph set.
 */
type IconName =
  | "workflow"
  | "plug"
  | "bot"
  | "radio"
  | "ship"
  | "shield"
  | "arrow"
  | "book";

export function Icon({
  name,
  size = 22,
  stroke = 2,
}: {
  name: IconName;
  size?: number;
  stroke?: number;
}) {
  const paths: Record<IconName, JSX.Element> = {
    workflow: (
      <g>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <path d="M14 17h3a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <path d="M7 10v2a2 2 0 0 0 2 2h3" />
      </g>
    ),
    plug: (
      <g>
        <path d="M12 22v-5" />
        <path d="M9 8V2" />
        <path d="M15 8V2" />
        <path d="M18 8v6a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
      </g>
    ),
    bot: (
      <g>
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </g>
    ),
    radio: (
      <g>
        <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
        <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
        <circle cx="12" cy="12" r="2" />
        <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
        <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
      </g>
    ),
    ship: (
      <g>
        <path d="M10 4V2" />
        <path d="M14 4V2" />
        <path d="M4.2 15h15.6" />
        <path d="M10 18v2" />
        <path d="M14 18v2" />
        <path d="M3 11h18l-1.5 7a2 2 0 0 1-2 1.5h-11A2 2 0 0 1 4.5 18Z" />
        <path d="M5 11V6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5V11" />
      </g>
    ),
    shield: (
      <g>
        <path d="M20 13c0 5-3.5 7.5-8 8.5-4.5-1-8-3.5-8-8.5V6l8-3 8 3v7Z" />
        <path d="m9 12 2 2 4-4" />
      </g>
    ),
    arrow: (
      <g>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </g>
    ),
    book: (
      <g>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2Z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7Z" />
      </g>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
