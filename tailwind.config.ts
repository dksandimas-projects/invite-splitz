import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        butter: "#F5F2C0",
        lemon: "#F0E44A",
        sunflower: "#E8C800",
        "sunflower-hover": "#D4B400",
        sage: "#B5CC6E",
        garden: "#7BB040",
        // Darker than the spec #4E8A20 to clear WCAG AA contrast against
        // white backgrounds (5.97:1 vs 4.21:1).
        forest: "#3F6F19",
        offwhite: "#FAFAF5",
        charcoal: "#2C2B28",
        // Slightly darker than the spec #7A7670 to clear WCAG AA contrast
        // against the offwhite background (~5.5:1 vs 4.31:1).
        "warm-grey": "#6B6762",
        stone: "#E2DED8",
        "stone-light": "#F0EDE8",
        "surface-container-low": "#F4F4EF",
        "surface-container-high": "#E8E8E4",
        error: "#EF4444",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "label-caps": ["0.875rem", { lineHeight: "1.2", letterSpacing: "0.15em", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        "body-main": ["1rem", { lineHeight: "1.6", fontWeight: "300" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "300" }],
        "section-heading": ["1.875rem", { lineHeight: "1.4", fontWeight: "400" }],
        "hero-names-mobile": ["3rem", { lineHeight: "1.1", fontWeight: "300" }],
        "hero-names": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "300" }],
      },
      spacing: {
        "section-gap-mobile": "3rem",
        "section-gap-desktop": "5rem",
        "container-guest": "36rem",
        "container-dashboard": "64rem",
        gutter: "1.5rem",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        sm: "0.125rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      boxShadow: {
        soft: "0px 4px 20px rgba(44, 43, 40, 0.05)",
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        md: "0 4px 6px rgba(0,0,0,0.07)",
        lg: "0 10px 15px rgba(0,0,0,0.10)",
      },
      maxWidth: {
        guest: "36rem",
        dashboard: "64rem",
      },
    },
  },
  plugins: [],
};
export default config;
