"use client";

const STORAGE_KEY = "opsolid.consent";
const VERSION = 1;

export type ConsentState = {
  version: number;
  analytics: boolean;
  timestamp: number;
};

export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== VERSION) return null; // policy changed, new consent required
    return parsed;
  } catch {
    return null;
  }
}

export function setConsent(analytics: boolean) {
  if (typeof window === "undefined") return;
  const state: ConsentState = {
    version: VERSION,
    analytics,
    timestamp: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("consent-changed", { detail: state }));
}
