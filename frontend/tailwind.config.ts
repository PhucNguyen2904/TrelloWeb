import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        // Brand — static, not theme-dependent
        brand: {
          DEFAULT: "#0079BF",
          light: "#E6F4FF",
          dark: "#005A8E",
        },
        // Surfaces — wired to CSS vars so dark mode works automatically
        surface: {
          app:     "var(--primary)",
          card:    "var(--surface)",
          sidebar: "var(--surface)",
          muted:   "var(--surface-2)",
        },
        // Border
        border: "var(--border)",
        // Text — wired to CSS vars
        text: {
          heading: "var(--text-primary)",
          body:    "var(--text-secondary)",
          muted:   "var(--text-tertiary)",
          link:    "#0079BF",
        },
        // Mockup Colors
        primary: "#005f98",
        "primary-container": "#0079bf",
        "surface-container-low": "#f1f3fa",
        "on-background": "#181c20",
        "surface-variant": "#e0e2e9",
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
        full: "9999px",
      },
      boxShadow: {
        card:  "0 1px 3px rgba(0,0,0,0.08)",
        modal: "0 20px 60px rgba(0,0,0,0.18)",
      },
      spacing: {
        topbar:  "52px",
        sidebar: "240px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "pulse":   "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
