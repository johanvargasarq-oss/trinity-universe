import type { Metadata } from "next";
import { Geist, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/trinity/SmoothScrollProvider";
import TransitionOverlay from "@/components/trinity/TransitionOverlay";
import TrinityCorner from "@/components/trinity/TrinityCorner";

const bodyFont = Geist({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trinity-bga.vercel.app"),
  title: {
    template: "%s | Trinity",
    default: "Trinity | Universo de marcas — Bucaramanga",
  },
  description:
    "Trinity es el universo de marcas de Bucaramanga: Barbería, TriniFries, TriniSlush, TriniArepas y TriniRent. Elige tu experiencia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SmoothScrollProvider>
          <TrinityCorner />
          {children}
          <TransitionOverlay />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
