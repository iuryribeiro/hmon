// src/app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";

export const metadata: Metadata = {
  title: "HMON",
  description: "Plataforma de multicálculo de seguros",
};

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${jakarta.variable} antialiased bg-brand-cream`}>
        {children}
      </body>
    </html>
  );
}
