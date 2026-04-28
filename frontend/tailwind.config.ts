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
        brand: {
          DEFAULT: "#0079BF",
          light: "#E6F4FF",
          dark: "#005A8E",
        },
        surface: {
          app: "#F7F9FF",
          card: "#FFFFFF",
          sidebar: "#FFFFFF",
          muted: "#F1F3FA",
        },
        border: "#E2E8F0",
        text: {
          heading: "#0F172A",
          body: "#475569",
          muted: "#94A3B8",
          link: "#0079BF",
        },
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08)",
        modal: "0 20px 60px rgba(0,0,0,0.18)",
      },
      spacing: {
        topbar: "52px",
        sidebar: "240px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
