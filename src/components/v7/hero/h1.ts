/**
 * Joins the three H1 parts with exactly one space between words, none before punctuation (. , : ; ! ? …)
 * and no doubled spaces, whatever spacing the content strings carry at their seams.
 */
export function h1Parts([pre, em, post]: [string, string, string]): [string, string, string] {
  const a = pre.trim();
  const b = em.trim();
  const c = post.trim();
  const before = a + (a && b ? " " : "");
  const gap = (before || b) && c && !/^[.,:;!?…]/.test(c) ? " " : "";
  return [before, b, gap + c];
}

/** The H1 as one plain string (design C sets no italic or copper emphasis in the heading). */
export function h1Text(h1: [string, string, string]): string {
  return h1Parts(h1).join("");
}
