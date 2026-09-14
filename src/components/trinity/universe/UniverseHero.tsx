"use client";

/**
 * Fase 1: solo el video del universo a pantalla completa, en loop.
 * `children` queda listo para las fases siguientes (hotspots de islas,
 * overlays de hover, transiciones de clic) sin tener que tocar este layout.
 */
export default function UniverseHero({ children }: { children?: React.ReactNode }) {
  return (
    <section className="relative h-screen w-screen overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full object-contain"
        src="/media/trinity/universe-hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      {children}
    </section>
  );
}
