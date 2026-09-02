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
        background: "var(--background)",
        foreground: "var(--foreground)",
        rpg: {
          paper: '#f4ecd8',    // Barva pozadí textů (pergamen)
          obsidian: '#1b262c', // Tmavé pozadí panelů
          blood: '#b74b4b',    // HP a zranění
          magic: '#d4af37',    // Zlato / magie
          muted: '#90a4ae'     // Šedé texty
        }
      },
      fontFamily: {
        medieval: ['Cinzel', 'serif'], // Pro nadpisy (přidáme do layout.tsx jestli bude chybět)
      }
    },
  },
  plugins: [],
};
export default config;
