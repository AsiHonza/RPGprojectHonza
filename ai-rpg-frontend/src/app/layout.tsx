import type { Metadata } from "next";
import { Cinzel, Lora } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin", "latin-ext"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Aethelgard RPG",
  description: "High Fantasy AI RPG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`${cinzel.variable} ${lora.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('aethelgard_theme');
                const prefDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = saved === 'dark' || (saved === 'auto' && prefDark) || (!saved && prefDark) ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', theme);
                if (theme === 'dark') document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-lora bg-[#f4ecd8] dark:bg-[#0b0f16] text-slate-900 dark:text-[#e2d9c8] antialiased transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
