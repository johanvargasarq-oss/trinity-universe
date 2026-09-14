"use client";

import { worldList } from "@/lib/brands";
import { PortalSceneProvider } from "@/components/trinity/portal/scene-context";
import IslandHotspot from "@/components/trinity/IslandHotspot";

// Solo los negocios que ya tienen su isla calibrada en el video vertical
// (Trini Vapers todavia no aparece en el arte, igual que en el mapa viejo).
const islands = worldList.filter((world) => Boolean(world.mobileHotspot));

/**
 * Fase 2: el video sigue siendo el hero a pantalla completa, pero ahora
 * dentro de una caja que mantiene su proporcion 9:16 real (letterboxed en
 * pantallas anchas) para que las islas clicleables se calibren en % sobre
 * el propio video y no sobre toda la ventana. Reutiliza el mismo
 * IslandHotspot + transicion cinematografica que ya existia para el mapa
 * estatico, solo que ahora vive encima del video.
 */
export default function UniverseHero() {
  return (
    <section className="relative h-screen w-screen overflow-hidden bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-full" style={{ width: "min(100%, calc(100vh * 9 / 16))" }}>
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/media/trinity/universe-hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
          <PortalSceneProvider isMobile>
            {islands.map((world) => (
              <IslandHotspot key={world.id} world={world} hotspot={world.mobileHotspot} />
            ))}
          </PortalSceneProvider>
        </div>
      </div>
    </section>
  );
}
