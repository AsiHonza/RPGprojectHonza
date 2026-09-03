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
    <html lang="cs" className={`${cinzel.variable} ${lora.variable}`}>
      <body className="font-lora bg-[#f4ecd8] text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
