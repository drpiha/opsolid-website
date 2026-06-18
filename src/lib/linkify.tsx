// =============================================================================
// linkify — turn URLs and emails inside owner-entered free text (service
// descriptions, custom sections, bio, FAQ answers) into clickable links.
//
// Card text fields are stored as plain strings and rendered as JSX children, so
// a pasted URL like "opsolid.de/hizmetler" shows up as inert text. This helper
// splits the text and wraps any URL/email it finds in a safe <a>, leaving the
// rest untouched. It returns the original string when nothing matches, so it is
// a drop-in replacement for `{text}` in JSX.
//
// Safety: external links always carry target="_blank" rel="noopener noreferrer".
// We never use dangerouslySetInnerHTML — the tree is built from React elements,
// so the matched text can't inject markup.
// =============================================================================

import * as React from "react";

// One token = an http(s)/www URL, OR a bare domain (must end in an alphabetic
// TLD so "3.5", "v4.0", "Inc." are NOT matched), OR an email address.
const LINK_RE =
  /(?:https?:\/\/|www\.)[^\s]+|[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9-]+)*\.[a-z]{2,}(?:\/[^\s]*)?|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;

function hrefFor(token: string): string {
  if (/^https?:\/\//i.test(token)) return token;
  if (token.startsWith("www.")) return `https://${token}`;
  if (token.includes("@")) return `mailto:${token}`;
  return `https://${token}`;
}

/**
 * Render `text` with any URLs/emails turned into links. Returns the input
 * unchanged (string) when there is nothing to linkify, or `null` for empty
 * input — safe to use directly as `{linkify(value)}`.
 */
export function linkify(text: string | null | undefined): React.ReactNode {
  if (!text) return text ?? null;

  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  LINK_RE.lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = LINK_RE.exec(text)) !== null) {
    const matchEnd = m.index + m[0].length;
    let token = m[0];

    // Trailing sentence punctuation (and an unbalanced close paren) belongs to
    // the surrounding prose, not the link: "see opsolid.de." → link "opsolid.de".
    let trail = "";
    while (token.length > 0) {
      const c = token[token.length - 1]!;
      if (".,;:!?".includes(c) || (c === ")" && !token.includes("("))) {
        trail = c + trail;
        token = token.slice(0, -1);
      } else break;
    }

    if (!token) {
      out.push(text.slice(last, matchEnd));
      last = matchEnd;
      continue;
    }

    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <a
        key={`lk${key++}`}
        href={hrefFor(token)}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 break-words hover:opacity-80"
      >
        {token}
      </a>,
    );
    if (trail) out.push(trail);
    last = matchEnd;
  }

  if (out.length === 0) return text;
  if (last < text.length) out.push(text.slice(last));
  return out;
}
