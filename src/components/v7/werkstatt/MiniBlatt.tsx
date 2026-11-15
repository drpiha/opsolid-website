import { Stamp } from "./Stamp";

/**
 * A small sheet for the mega-menu features (a sample agenda, a sample report outline). Decorative copy of content
 * that is said elsewhere: the whole sheet is one image with `ariaLabel` as its name, so its small type stays out of
 * the reading order (the 11-12 px document meta is allowed only inside such a role="img" piece).
 */
export function MiniBlatt({
  title,
  sub,
  stamp,
  items,
  rotate = 0,
  ariaLabel,
  className,
}: {
  title: string;
  sub: string;
  stamp: string;
  items: { time?: string; text: string }[];
  rotate?: number;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={`wk-blatt wk-mini-blatt${className ? ` ${className}` : ""}`}
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    >
      <div className="wk-blatt-head" aria-hidden="true">
        <div className="min-w-0">
          <p className="wk-blatt-title">{title}</p>
          <p className="wk-blatt-sub">{sub}</p>
        </div>
        <Stamp>{stamp}</Stamp>
      </div>
      <ul className="wk-mini-blatt-list" aria-hidden="true">
        {items.map((it, i) => (
          <li key={i}>
            {it.time && <span className="wk-mini-blatt-time">{it.time}</span>}
            <span>{it.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
