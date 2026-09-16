"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { worldList, type WorldId } from "@/lib/brands";
import { PortalSceneProvider } from "@/components/trinity/portal/scene-context";
import IslandHotspot from "@/components/trinity/IslandHotspot";
import VideoTransitionHotspot from "@/components/trinity/universe/VideoTransitionHotspot";
import { preloadVideo } from "@/lib/video-preload";

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
const VIDEO_TRANSITIONS: Partial<
  Record<WorldId, { video: string; href: string; preload?: string[] }>
> = {
  fries: { video: "/media/trinity/transitions/fries.mp4", href: "/trini-fries" },
  slush: { video: "/media/trinity/transitions/slush.mp4", href: "/trini-slush" },
  // `preload`: assets pesados de la pagina de destino que conviene empezar a
  // bajar ya mismo, en paralelo con los ~5s de transicion cinematografica,
  // para que esten listos (o casi) cuando el usuario realmente los vea. Ver
  // handleEnter mas abajo y src/lib/video-preload.ts.
  barberia: {
    video: "/media/trinity/transitions/barberia.mp4",
    href: "/trini-barberia",
    preload: ["/media/barberia/services-video.mp4"],
  },
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
  //
  // Se escucha en fase de captura (y en varios eventos) porque el overlay
  // nativo de "play" de Safari puede consumir el toque antes de que
  // burbujee hasta document en fase normal; la captura se dispara primero,
  // asi que igual alcanzamos a lanzar play() dentro del mismo gesto real.
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    video.muted = true;
    const tryPlay = () => {
      video.play().catch(() => {});
    };

    function removeListeners() {
      document.removeEventListener("touchstart", tryPlay, true);
      document.removeEventListener("pointerdown", tryPlay, true);
      document.removeEventListener("click", tryPlay, true);
    }

    tryPlay();
    document.addEventListener("touchstart", tryPlay, { capture: true, passive: true });
    document.addEventListener("pointerdown", tryPlay, { capture: true });
    document.addEventListener("click", tryPlay, { capture: true });
    video.addEventListener("playing", removeListeners);

    return () => {
      removeListeners();
      video.removeEventListener("playing", removeListeners);
    };
  }, []);

  // Los 6 videos de transicion NO se precargan al entrar (preload="none"):
  // bajarlos todos de una junto con el video del universo satura datos/CPU
  // del celular desde el primer segundo, aunque el usuario use como mucho
  // uno. En su lugar, arrancamos el buffer de UNO solo cuando el usuario
  // muestra intencion real sobre esa isla (primer hover/focus/touch).
  function handlePreload(worldId: WorldId) {
    const video = videoRefs.current[worldId];
    if (!video || video.preload === "auto") return;
    // preload="none" en el markup evita la descarga de arranque; cambiar a
    // "auto" + load() recien aca es lo que realmente le pide al navegador
    // que empiece a bufferizar este video puntual.
    video.preload = "auto";
    video.load();
  }

  function handleEnter(worldId: WorldId) {
    if (activeTransition) return;
    setActiveTransition(worldId);
    videoRefs.current[worldId]?.play();
    // El click ya confirma hacia donde va el usuario, asi que aprovechamos
    // los ~5s de esta transicion (mas lo que dure el scroll hasta esa
    // seccion en la pagina de destino) para bajar en paralelo los videos
    // pesados que esa pagina va a necesitar.
    VIDEO_TRANSITIONS[worldId]?.preload?.forEach(preloadVideo);
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

          {/* Cada video de transicion empieza sin descargar nada
              (preload="none") y se pone en pausa una vez que el usuario
              enfoca esa isla (VideoTransitionHotspot llama a handlePreload
              en el primer hover/touch), asi el click lo arranca casi al
              instante sin haber tenido que bajar los 6 videos de una. Se
              superpone al video del universo con un crossfade. */}
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
                preload="none"
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
                  onHoverStart={() => handlePreload(world.id)}
                />
              ))}
            </PortalSceneProvider>
          </div>
        </div>
      </div>
    </section>
  );
}
