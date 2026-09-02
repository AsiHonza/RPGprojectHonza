import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        rpg: {
          paper: '#f4ecd8',
          obsidian: '#1b262c',
          blood: '#b74b4b',
          magic: '#c5a059',
          muted: '#90a4ae'
        }
      },
      fontFamily: {
        cinzel: ['var(--font-cinzel)', 'serif'],
        lora: ['var(--font-lora)', 'serif'],
      }
    },
  },
  plugins: [],
};
export default config;
