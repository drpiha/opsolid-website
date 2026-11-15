/**
 * The sample KI-Check questionnaire drawn on the Beratung door: title, "Frage 3 · Muster" (no total), one question and
 * two options, the first ticked. One named picture (`role="img"`); its small type stays out of the reading order.
 */
export function Fragebogen({ title, sub, q, options, ariaLabel }: { title: string; sub: string; q: string; options: { text: string; on?: boolean }[]; ariaLabel: string }) {
  return (
    <div role="img" aria-label={ariaLabel} className="wk-blatt wk-bogen">
      <div className="wk-bogen-head" aria-hidden="true">
        <p className="wk-blatt-title">{title}</p>
        <p className="wk-blatt-sub">{sub}</p>
      </div>
      <p className="wk-bogen-q" aria-hidden="true">
        {q}
      </p>
      <ul className="wk-bogen-a" aria-hidden="true">
        {options.map((o) => (
          <li key={o.text} className={o.on ? "is-on" : undefined}>
            {o.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
