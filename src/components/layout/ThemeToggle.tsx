"use client";

import { useTheme, THEMES, type Theme } from "@/context/ThemeContext";

const LABELS: Record<Theme, string> = {
  light: "☼",   // ☼
  hybrid: "◐",  // ◐
  dark: "☾",    // ☾
};

const TITLES: Record<Theme, string> = {
  light: "Light",
  hybrid: "Hybrid",
  dark: "Dark",
};

interface ThemeToggleProps {
  /** Optional extra class for mobile/compact layouts. */
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps = {}) {
  const { theme, setTheme } = useTheme();
  return (
    <div
      className={["os-theme-switch", className].filter(Boolean).join(" ")}
      role="group"
      aria-label="Theme"
    >
      {THEMES.map((t) => {
        const active = theme === t;
        return (
          <button
            key={t}
            type="button"
            aria-pressed={active}
            aria-label={TITLES[t]}
            title={TITLES[t]}
            onClick={() => setTheme(t)}
            className={active ? "is-active" : undefined}
          >
            <span aria-hidden="true">{LABELS[t]}</span>
          </button>
        );
      })}
    </div>
  );
}
