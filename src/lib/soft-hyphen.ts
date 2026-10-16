/**
 * Long German compounds ("Automatisierungspotenzial", "Prozessautomatisierung") do not fit a phone column at
 * heading size, and browsers hyphenate them unreliably. Insert a soft hyphen before a known stem when the word
 * is long, so the break lands on a morpheme boundary instead of mid-syllable. Invisible when the word fits.
 * `npm run audit:headings` fails if any h1/h2 still needs a mid-word break.
 */
const STEMS =
  /(automatisierung|potenzial|vereinbarung|verordnung|kompetenz|kommunikation|integration|unternehmen|dokumentation|schulung|beratung|steuerung|werkzeug|anbindung|plattform|einführung|sicherheit|architektur|angebot|projekt|lösung|entwicklung|verbindung|datenschutz|anwendung|analyse|bewertung|verwaltung|abrechnung|beschaffung|software|grundlage|prozess|geschäft)/gi;

export function soft(text: string): string {
  return text.replace(/[A-Za-zÄÖÜäöüßÇçĞğİıŞş]{12,}/g, (word) =>
    word.replace(STEMS, (m, _g, offset: number) => {
      const piece = m.replace(/^(automati)(sierung)$/i, "$1­$2");
      return offset >= 4 ? "­" + piece : piece;
    }),
  );
}
