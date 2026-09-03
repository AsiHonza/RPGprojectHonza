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
          paper: '#f9f6e6',
          obsidian: '#2d3748', // Lighter for text
          blood: '#e53e3e',    // Brighter red
          magic: '#d97706',    // Amber 600
          muted: '#718096'     // Slate 500
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
