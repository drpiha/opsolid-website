import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Greyscale — Popl-style neutral ramp
        neutral: {
          50:  "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#3F3F3F",
          800: "#262626",
          900: "#111111",
          950: "#050505",
        },
        // Primary red CTA accent (Popl / editorial red)
        brand: {
          DEFAULT: "#E63946",
          50:  "#FDECEE",
          100: "#FBD5D9",
          200: "#F6AAB2",
          300: "#F17F8B",
          400: "#EC5464",
          500: "#E63946",
          600: "#C81E2B",
          700: "#971723",
          800: "#670F18",
          900: "#37080C",
        },
        // Map product surfaces
        ink: {
          DEFAULT: "#0A0A0A",
          900: "#0A0A0A",
          800: "#171717",
          700: "#262626",
          600: "#404040",
          500: "#737373",
          400: "#A3A3A3",
          300: "#D4D4D4",
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
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 10vw, 7rem)",    { lineHeight: "0.95", letterSpacing: "-0.045em", fontWeight: "700" }],
        "display-lg": ["clamp(2.5rem, 8vw, 5.5rem)",  { lineHeight: "0.98", letterSpacing: "-0.04em", fontWeight: "700" }],
        "display":    ["clamp(2rem, 6vw, 4rem)",      { lineHeight: "1.02", letterSpacing: "-0.035em", fontWeight: "700" }],
        "display-sm": ["clamp(1.75rem, 4.5vw, 3rem)", { lineHeight: "1.08", letterSpacing: "-0.03em", fontWeight: "700" }],
        "heading-lg": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.18", letterSpacing: "-0.02em", fontWeight: "600" }],
        "heading":    ["clamp(1.25rem, 2.4vw, 1.75rem)", { lineHeight: "1.22", letterSpacing: "-0.015em", fontWeight: "600" }],
        "heading-sm": ["1.125rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg":    ["1.125rem", { lineHeight: "1.6" }],
        "body":       ["1rem",     { lineHeight: "1.6" }],
        "body-sm":    ["0.875rem", { lineHeight: "1.55" }],
        "eyebrow":    ["0.75rem",  { lineHeight: "1.4", letterSpacing: "0.04em", fontWeight: "600" }],
      },
      borderRadius: {
        "xl":  "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "soft":    "0 1px 2px rgba(10, 10, 10, 0.04), 0 1px 3px rgba(10, 10, 10, 0.06)",
        "card":    "0 4px 12px rgba(10, 10, 10, 0.06), 0 1px 3px rgba(10, 10, 10, 0.04)",
        "lifted":  "0 20px 40px -12px rgba(10, 10, 10, 0.14), 0 8px 16px -8px rgba(10, 10, 10, 0.08)",
        "pop":     "0 30px 60px -20px rgba(10, 10, 10, 0.25)",
        "cta":     "0 8px 24px -6px rgba(230, 57, 70, 0.35)",
      },
      animation: {
        "fade-in":  "fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "rise":     "rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "ticker":   "ticker 40s linear infinite",
        "dash":     "dash 1.4s linear infinite",
        "pulse-ring": "pulse-ring 2.4s ease-out infinite",
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
        "ticker": {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "dash": {
          to: { strokeDashoffset: "-12" },
        },
        "pulse-ring": {
          "0%":   { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
