"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { worldList } from "@/lib/brands";
import { PortalSceneProvider } from "@/components/trinity/portal/scene-context";
import IslandHotspot from "@/components/trinity/IslandHotspot";
import FriesHotspot from "@/components/trinity/universe/FriesHotspot";

// Solo los negocios que ya tienen su isla calibrada en el video vertical
// (Trini Vapers todavia no aparece en el arte, igual que en el mapa viejo).
const islands = worldList.filter((world) => Boolean(world.mobileHotspot));
const friesWorld = islands.find((world) => world.id === "fries")!;
const otherIslands = islands.filter((world) => world.id !== "fries");

/**
 * Fase 3: el video del universo sigue siendo el hero de fondo. Trini Fries
 * es la unica isla con interaccion completa por ahora: hover/focus la
 * resalta (y atenua el resto via el mismo focusedWorldId compartido), y el
 * click hace un crossfade hacia el video de transicion de Trini Fries;
 * al terminar ese video, navega a /trini-fries. Las demas islas siguen
 * usando IslandHotspot tal como estaba (sin cambios de comportamiento).
 */
export default function UniverseHero() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionVideoRef = useRef<HTMLVideoElement>(null);

  function handleFriesEnter() {
    if (isTransitioning) return;
    setIsTransitioning(true);
    transitionVideoRef.current?.play();
  }

  function handleTransitionEnded() {
    router.push("/trini-fries");
  }

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

          {/* Video de transicion de Trini Fries: precargado y en pausa desde
              el inicio para que el click lo arranque al instante, sin salto
              a negro. Se superpone al video del universo con un crossfade. */}
          <video
            ref={transitionVideoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out ${
              isTransitioning ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            src="/media/trinity/fries-transition.mp4"
            muted
            playsInline
            preload="auto"
            onEnded={handleTransitionEnded}
          />

          <div className={isTransitioning ? "pointer-events-none" : undefined}>
            <PortalSceneProvider isMobile>
              {otherIslands.map((world) => (
                <IslandHotspot key={world.id} world={world} hotspot={world.mobileHotspot} />
              ))}
              <FriesHotspot
                world={friesWorld}
                hotspot={friesWorld.mobileHotspot!}
                disabled={isTransitioning}
                onEnter={handleFriesEnter}
              />
            </PortalSceneProvider>
          </div>
        </div>
      </div>
    </section>
  );
}
