/** Only return a local path suitable for Next router navigation. */
export function safeAuthNextPath(value: string | null, fallback: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u0020\u007f]/.test(value)) return fallback;
  try {
    const base = "https://opsolid.invalid";
    const target = new URL(value, base);
    if (target.origin !== base) return fallback;
    let path = target.pathname;
    // Reject alternate encodings of protocol-relative paths and separators,
    // including nested percent encodings, before handing anything to a router.
    for (let i = 0; i < 4; i++) {
      if (path.startsWith("//") || /[\\\u0000-\u0020\u007f]/.test(path)) return fallback;
      const decoded = decodeURIComponent(path);
      if (decoded === path) return `${target.pathname}${target.search}${target.hash}`;
      path = decoded;
    }
    return fallback;
  } catch {
    return fallback;
  }
}
