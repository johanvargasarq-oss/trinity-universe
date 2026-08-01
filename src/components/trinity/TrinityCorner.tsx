"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import EmblemMark from "./EmblemMark";

export default function TrinityCorner() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <Link
      href="/"
      className="fixed top-4 left-4 z-50 flex items-center gap-2 text-world-text opacity-80 hover:opacity-100 transition-opacity rounded-full bg-black/30 backdrop-blur-sm px-2.5 py-2 sm:px-3"
      aria-label="Volver al universo Trinity"
    >
      <EmblemMark size={28} />
      <span className="font-display text-sm tracking-wide hidden sm:inline">TRINITY</span>
    </Link>
  );
}
