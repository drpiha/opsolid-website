/**
 * Footer motion switch ("Bewegung"). `opsolid-fx=off` keeps the hero on its still poster: no video is
 * fetched or played. prefers-reduced-motion has the same effect without a stored choice.
 */
export const FX_STORAGE_KEY = "opsolid-fx";
export const FX_EVENT = "opsolid-fx-change";

/** True when the visitor (or the system setting) asked for no moving background. */
export function motionOff(): boolean {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  try {
    return window.localStorage.getItem(FX_STORAGE_KEY) === "off";
  } catch {
    return false;
  }
}
