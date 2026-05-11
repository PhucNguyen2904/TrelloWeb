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
        // Mockup & Material Design Colors from code.html
        primary: "#005f98",
        "on-primary": "#ffffff",
        "primary-container": "#0079bf",
        "on-primary-container": "#fbfbff",
        secondary: "#535f73",
        "on-secondary": "#ffffff",
        "secondary-container": "#d4e0f8",
        "on-secondary-container": "#576377",
        tertiary: "#8c4a00",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#b05f01",
        "on-tertiary-container": "#fffbfa",
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        background: "#f7f9ff",
        "on-background": "#181c20",
        surface: "#f7f9ff",
        "on-surface": "#181c20",
        "surface-variant": "#e0e2e9",
        "on-surface-variant": "#404751",
        outline: "#707882",
        "outline-variant": "#c0c7d2",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f1f3fa",
        "surface-container": "#ebeef4",
        "surface-container-high": "#e6e8ee",
        "surface-container-highest": "#e0e2e9",
        "tertiary-fixed": "#ffdcc3",
        "on-tertiary-fixed-variant": "#6e3900",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      boxShadow: {
        card:  "0 1px 3px rgba(0,0,0,0.08)",
        modal: "0 20px 60px rgba(0,0,0,0.18)",
      },
      spacing: {
        topbar:  "52px",
        sidebar: "260px",
        xl: "32px",
        md: "16px",
        xs: "4px",
        gutter: "12px",
        base: "8px",
        sm: "8px",
        lg: "24px"
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
