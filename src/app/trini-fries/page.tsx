import type { Metadata } from "next";
import Link from "next/link";
import { worlds } from "@/lib/brands";

const world = worlds.fries;

export const metadata: Metadata = {
  title: world.name,
  description: world.description,
};

/**
 * Pagina base de aterrizaje para la nueva entrada cinematografica desde el
 * universo (video de transicion -> /trini-fries). Placeholder minimo:
 * el objetivo de esta fase es que la navegacion funcione, no el contenido
 * final del negocio (eso ya vive en /fries).
 */
export default function TriniFriesPage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center"
      style={{ background: world.theme.bg, color: world.theme.text }}
    >
      <span className="text-6xl">{world.emoji}</span>
      <h1 className="font-display text-4xl sm:text-5xl" style={{ color: world.theme.accent }}>
        {world.name}
      </h1>
      <p className="max-w-md text-base" style={{ color: world.theme.textMuted }}>
        {world.tagline}
      </p>
      <Link
        href="/"
        className="mt-4 rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-wide"
        style={{ background: world.theme.accent, color: "#0a0a0a" }}
      >
        Volver al universo
      </Link>
    </main>
  );
}
