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
        ink: {
          DEFAULT: "#15120F",
          50:  "#F4EFE6",
          100: "#E8E1D2",
          200: "#D9D4C7",
          300: "#B9B2A3",
          400: "#8A8376",
          500: "#5C564C",
          600: "#3E3930",
          700: "#2A2621",
          800: "#1F1C18",
          900: "#15120F",
        },
        paper: {
          DEFAULT: "#F4EFE6",
          warm: "#FAF6EF",
          cool: "#ECE6D8",
        },
        amber: {
          DEFAULT: "#E8A252",
          400: "#F1B977",
          500: "#E8A252",
          600: "#C07E30",
          700: "#8E5A1E",
        },
        olive: {
          DEFAULT: "#B8C48A",
          400: "#CCD4A8",
          500: "#B8C48A",
          600: "#8E9A63",
          700: "#5F6A3E",
        },
        steel: {
          DEFAULT: "#9CA3A0",
          300: "#BFC4C1",
          500: "#9CA3A0",
          700: "#5A615E",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        serif: ["var(--font-instrument-serif)", "Georgia", "serif"],
        mono: [
          "var(--font-geist-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      fontSize: {
        "display-lg": ["clamp(2.75rem, 9vw, 5.5rem)", { lineHeight: "0.98", letterSpacing: "-0.04em" }],
        "display":    ["clamp(2.25rem, 7vw, 4.25rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        "display-sm": ["clamp(1.875rem, 5.5vw, 3.25rem)", { lineHeight: "1.08", letterSpacing: "-0.028em" }],
        "heading-lg": ["clamp(1.75rem, 3.5vw, 2.5rem)", { lineHeight: "1.18", letterSpacing: "-0.02em" }],
        "heading":    ["clamp(1.375rem, 2.6vw, 1.875rem)", { lineHeight: "1.22", letterSpacing: "-0.015em" }],
        "heading-sm": ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "body-lg":    ["1.125rem", { lineHeight: "1.65" }],
        "body":       ["1rem", { lineHeight: "1.65" }],
        "body-sm":    ["0.875rem", { lineHeight: "1.55" }],
        "mono-xs":    ["0.6875rem", { lineHeight: "1.3", letterSpacing: "0.08em" }],
        "mono-sm":    ["0.75rem", { lineHeight: "1.35", letterSpacing: "0.06em" }],
      },
      borderRadius: {
        "xl": "0.5rem",
        "2xl": "0.625rem",
        "3xl": "0.875rem",
        "4xl": "1rem",
      },
      boxShadow: {
        "soft":        "0 1px 2px rgba(21, 18, 15, 0.04), 0 1px 1px rgba(21, 18, 15, 0.03)",
        "medium":      "0 10px 30px -12px rgba(21, 18, 15, 0.12), 0 4px 10px -6px rgba(21, 18, 15, 0.06)",
        "hair":        "inset 0 0 0 1px rgba(21, 18, 15, 0.08)",
        "hair-strong": "inset 0 0 0 1px rgba(21, 18, 15, 0.16)",
      },
      animation: {
        "fade-in":  "fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "rise":     "rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "ticker":   "ticker 40s linear infinite",
        "dash":     "dash 1.4s linear infinite",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "rise": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "ticker": {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "dash": {
          to: { strokeDashoffset: "-12" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
