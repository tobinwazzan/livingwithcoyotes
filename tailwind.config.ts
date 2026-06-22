import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Earthy "coyote at dusk" palette
        sage: "#7c8a6b",
        moss: "#5a6b4a",
        clay: "#b5764f",
        dusk: "#2e3528",
        sand: "#f4f0e6",
        bark: "#3d352a",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
