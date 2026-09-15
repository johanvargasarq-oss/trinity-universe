"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { worldList, type WorldId } from "@/lib/brands";
import { PortalSceneProvider } from "@/components/trinity/portal/scene-context";
import IslandHotspot from "@/components/trinity/IslandHotspot";
import VideoTransitionHotspot from "@/components/trinity/universe/VideoTransitionHotspot";

// Solo los negocios que ya tienen su isla calibrada en el video vertical
// (Trini Vapers todavia no aparece en el arte, igual que en el mapa viejo).
const islands = worldList.filter((world) => Boolean(world.mobileHotspot));

/**
 * Islas que ya tienen su propio video de transicion cinematografica hacia
 * la pagina interna real del negocio (en vez del "wash" de color generico
 * que usan las demas via IslandHotspot).
 *
 * Para agregar una isla nueva a este sistema:
 *   1. Poner su video en public/media/trinity/transitions/<worldId>.mp4
 *      (no se re-renderiza ni se modifica, se usa tal cual).
 *   2. Agregar aca su entrada con la ruta real de la pagina del negocio.
 *   3. Si esa pagina todavia no existe, crearla junto con un layout.tsx
 *      con data-world="<worldId>" (ver src/app/trini-fries para el patron).
 *
 * Las islas que no estan en este mapa siguen usando IslandHotspot sin
 * ningun cambio de comportamiento.
 */
const VIDEO_TRANSITIONS: Partial<Record<WorldId, { video: string; href: string }>> = {
  fries: { video: "/media/trinity/transitions/fries.mp4", href: "/trini-fries" },
  slush: { video: "/media/trinity/transitions/slush.mp4", href: "/trini-slush" },
  barberia: { video: "/media/trinity/transitions/barberia.mp4", href: "/trini-barberia" },
  rent: { video: "/media/trinity/transitions/rent.mp4", href: "/rent/trini-house" },
  arepas: { video: "/media/trinity/transitions/arepas.mp4", href: "/trini-arepas" },
  licores: { video: "/media/trinity/transitions/licores.mp4", href: "/trini-licores" },
};

const videoIslands = islands.filter((world) => VIDEO_TRANSITIONS[world.id]);
const washIslands = islands.filter((world) => !VIDEO_TRANSITIONS[world.id]);

/**
 * El video del universo sigue siendo el hero de fondo. Las islas listadas
 * en VIDEO_TRANSITIONS tienen interaccion completa: hover/focus las
 * resalta (y atenua el resto via el mismo focusedWorldId compartido), y el
 * click hace un crossfade hacia su propio video de transicion; al
 * terminar ese video, navega a su pagina real. El resto de las islas
 * siguen usando IslandHotspot tal como estaba.
 */
export default function UniverseHero() {
  const router = useRouter();
  const [activeTransition, setActiveTransition] = useState<WorldId | null>(null);
  const videoRefs = useRef<Partial<Record<WorldId, HTMLVideoElement | null>>>({});
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  // Algunos navegadores moviles (Low Power Mode de iOS, ciertos webviews)
  // bloquean el autoplay incluso con muted+playsInline y dejan el boton de
  // play nativo. Forzamos el play apenas monta y, si el navegador lo
  // rechaza, reintentamos en el primer toque/click que haga el usuario en
  // cualquier parte de la pantalla — asi arranca solo, sin que el usuario
  // tenga que encontrar y tocar el boton del video.
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    video.muted = true;
    const tryPlay = () => {
      video.play().catch(() => {});
    };
    tryPlay();

    document.addEventListener("touchstart", tryPlay, { once: true, passive: true });
    document.addEventListener("pointerdown", tryPlay, { once: true });
    return () => {
      document.removeEventListener("touchstart", tryPlay);
      document.removeEventListener("pointerdown", tryPlay);
    };
  }, []);

  function handleEnter(worldId: WorldId) {
    if (activeTransition) return;
    setActiveTransition(worldId);
    videoRefs.current[worldId]?.play();
  }

  function handleEnded(worldId: WorldId) {
    const config = VIDEO_TRANSITIONS[worldId];
    if (config) router.push(config.href);
  }

  return (
    <section className="relative h-screen w-screen overflow-hidden bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-full" style={{ width: "min(100%, calc(100vh * 9 / 16))" }}>
          <video
            ref={heroVideoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src="/media/trinity/universe-hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />

          {/* Cada video de transicion esta precargado y en pausa desde el
              inicio para que el click lo arranque al instante, sin salto a
              negro. Se superpone al video del universo con un crossfade. */}
          {videoIslands.map((world) => {
            const config = VIDEO_TRANSITIONS[world.id]!;
            const isActive = activeTransition === world.id;
            return (
              <video
                key={world.id}
                ref={(el) => {
                  videoRefs.current[world.id] = el;
                }}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out ${
                  isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                src={config.video}
                muted
                playsInline
                preload="auto"
                onEnded={() => handleEnded(world.id)}
              />
            );
          })}

          <div className={activeTransition ? "pointer-events-none" : undefined}>
            <PortalSceneProvider isMobile>
              {washIslands.map((world) => (
                <IslandHotspot key={world.id} world={world} hotspot={world.mobileHotspot} />
              ))}
              {videoIslands.map((world) => (
                <VideoTransitionHotspot
                  key={world.id}
                  world={world}
                  hotspot={world.mobileHotspot!}
                  disabled={activeTransition !== null}
                  onEnter={() => handleEnter(world.id)}
                />
              ))}
            </PortalSceneProvider>
          </div>
        </div>
      </div>
    </section>
  );
}
