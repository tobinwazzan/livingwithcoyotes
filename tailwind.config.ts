import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Static brand tokens — used for the dark "dusk" bands, the hero, and
        // on-dark text. These stay constant across both themes.
        sage: "#7c8a6b",
        moss: "#5a6b4a",
        dusk: "#2e3528",
        sand: "#f4f0e6",
        bark: "#3d352a",

        // Theme-aware accent (brightens slightly in dark for contrast).
        clay: "rgb(var(--clay) / <alpha-value>)",

        // Semantic surface/text tokens — flip between light and dark themes.
        surface: "rgb(var(--surface) / <alpha-value>)", // page background
        card: "rgb(var(--card) / <alpha-value>)", // raised card background
        panel: "rgb(var(--panel) / <alpha-value>)", // subtle alternating bands
        ink: "rgb(var(--ink) / <alpha-value>)", // primary text
        heading: "rgb(var(--heading) / <alpha-value>)", // section headings
        line: "rgb(var(--line) / <alpha-value>)", // borders
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
