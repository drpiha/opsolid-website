import type { Config } from "tailwindcss";

/**
 * OpSolid v2 — industrial-luxury dark-first.
 * Canonical tokens live in src/styles/opsolid-tokens.css (CSS variables).
 * Tailwind maps those vars so utilities like `bg-bg-1`, `text-ink-200`,
 * `border-line-firm`, `text-copper-400` resolve to the design system.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Graphite ground
        "bg-0": "#07090C",
        "bg-1": "#0B0E13",
        "bg-2": "#11151C",
        "bg-3": "#171C26",
        "bg-4": "#1F2530",
        "bg-5": "#2A3140",

        // Warm off-white ink on dark
        ink: {
          DEFAULT: "#F4F3F0",
          100: "#F4F3F0",
          200: "#D8D6D1",
          300: "#9FA2A9",
          400: "#6B717B",
          500: "#454B56",
        },

        // Oxidized copper accent
        copper: {
          DEFAULT: "#C27940",
          50:  "#FBEFE0",
          100: "#F5D9B8",
          200: "#EBBE8A",
          300: "#DDA266",
          400: "#CF8A4E",
          500: "#C27940",
          600: "#A46230",
          700: "#7E4A24",
          800: "#56321A",
          900: "#331D10",
        },

        // Semantic signals (sparing use only)
        signal: {
          ok:   "#7FB286",
          warn: "#D4A23A",
          err:  "#B8514B",
        },

        // Line alpha helpers (Tailwind can't read rgba css vars directly)
        line: {
          soft: "rgba(255,255,255,0.04)",
          DEFAULT: "rgba(255,255,255,0.08)",
          firm: "rgba(255,255,255,0.14)",
          hot:  "rgba(212,143,88,0.35)",
        },

        // Legacy brand names kept so existing code still resolves —
        // mapped to copper so nothing paints old red.
        brand: {
          DEFAULT: "#C27940",
          50:  "#FBEFE0",
          100: "#F5D9B8",
          200: "#EBBE8A",
          300: "#DDA266",
          400: "#CF8A4E",
          500: "#C27940",
          600: "#A46230",
          700: "#7E4A24",
          800: "#56321A",
          900: "#331D10",
        },
        // Legacy neutral palette retained but shifted to graphite scale.
        neutral: {
          50:  "#F4F3F0",
          100: "#D8D6D1",
          200: "#9FA2A9",
          300: "#6B717B",
          400: "#454B56",
          500: "#2A3140",
          600: "#1F2530",
          700: "#171C26",
          800: "#11151C",
          900: "#0B0E13",
          950: "#07090C",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "var(--font-geist)",
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
        editorial: [
          "var(--font-instrument-serif)",
          "Times New Roman",
          "serif",
        ],
        mono: [
          "var(--font-jetbrains-mono)",
          "ui-monospace",
          "SF Mono",
          "Menlo",
          "monospace",
        ],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 10vw, 7.5rem)", { lineHeight: "0.98", letterSpacing: "-0.035em", fontWeight: "500" }],
        "display":    ["clamp(2.75rem, 7vw, 5rem)",   { lineHeight: "1.02", letterSpacing: "-0.032em", fontWeight: "500" }],
        "h1":         ["clamp(2.25rem, 5.5vw, 4rem)", { lineHeight: "1.04", letterSpacing: "-0.028em", fontWeight: "500" }],
        "h2":         ["clamp(1.75rem, 3.6vw, 2.75rem)", { lineHeight: "1.06", letterSpacing: "-0.024em", fontWeight: "500" }],
        "h3":         ["clamp(1.25rem, 2.4vw, 1.625rem)", { lineHeight: "1.2",  letterSpacing: "-0.018em", fontWeight: "500" }],
        "h4":         ["1.125rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "500" }],
        "body-lg":    ["1.0625rem", { lineHeight: "1.6" }],
        "body":       ["0.9375rem", { lineHeight: "1.6" }],
        "body-sm":    ["0.8125rem", { lineHeight: "1.55" }],
        "eyebrow":    ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.1em", fontWeight: "500" }],
        "meta":       ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.1em", fontWeight: "500" }],
      },
      borderRadius: {
        "sm":  "4px",
        "md":  "8px",
        "lg":  "12px",
        "xl":  "16px",
        "2xl": "22px",
        "pill": "9999px",
      },
      boxShadow: {
        "depth-1": "0 1px 1px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.2)",
        "depth-2": "0 2px 4px rgba(0,0,0,0.4), 0 6px 12px rgba(0,0,0,0.35)",
        "depth-3": "0 6px 14px rgba(0,0,0,0.45), 0 20px 40px rgba(0,0,0,0.4)",
        "depth-4": "0 12px 28px rgba(0,0,0,0.5), 0 40px 80px rgba(0,0,0,0.5)",
        "rim":     "inset 0 1px 0 rgba(255,255,255,0.08)",
        "rim-strong": "inset 0 1px 0 rgba(255,255,255,0.12)",
        "bloom-sm": "0 0 12px rgba(194,121,64,0.45)",
        "bloom-md": "0 0 28px rgba(194,121,64,0.35), 0 0 8px rgba(194,121,64,0.5)",
        "bloom-lg": "0 0 60px rgba(194,121,64,0.28), 0 0 20px rgba(194,121,64,0.4)",
        // Keep legacy names pointing at something sensible on dark
        "soft":   "0 1px 1px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.2)",
        "card":   "0 2px 4px rgba(0,0,0,0.4), 0 6px 12px rgba(0,0,0,0.35)",
        "lifted": "0 6px 14px rgba(0,0,0,0.45), 0 20px 40px rgba(0,0,0,0.4)",
        "pop":    "0 12px 28px rgba(0,0,0,0.5), 0 40px 80px rgba(0,0,0,0.5)",
        "cta":    "0 0 28px rgba(194,121,64,0.35), 0 0 8px rgba(194,121,64,0.5)",
      },
      transitionTimingFunction: {
        "mech": "cubic-bezier(0.16, 0.84, 0.24, 1)",
        "snap": "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      transitionDuration: {
        "fast":   "180ms",
        "base":   "280ms",
        "mech":   "720ms",
        "settle": "900ms",
      },
      animation: {
        "fade-in":  "fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "rise":     "rise 0.7s cubic-bezier(0.16, 0.84, 0.24, 1) forwards",
        "pulse-bloom": "pulseBloom 2.2s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "rise": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "pulseBloom": {
          "0%, 100%": { boxShadow: "0 0 4px rgba(194,121,64,0.5)" },
          "50%":      { boxShadow: "0 0 14px rgba(194,121,64,0.9), 0 0 24px rgba(194,121,64,0.4)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
