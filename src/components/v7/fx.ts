/**
 * Footer motion switch ("Hintergrundvideo"). `opsolid-fx=off` keeps every video on its still poster: no
 * video is fetched or played. prefers-reduced-motion has the same effect without a stored choice.
 * Same key and event as the v4 helper so a stored choice survives the relaunch.
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
