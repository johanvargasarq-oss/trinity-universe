"use client";

import { motion } from "motion/react";
import { worldList } from "@/lib/brands";
import { useIsMobileViewport } from "@/hooks/useIsMobileViewport";
import IslandHotspot from "./IslandHotspot";
import PortalScene from "./portal/PortalScene";
import SoundToggle from "./portal/SoundToggle";

export default function PortalMap() {
  const isMobile = useIsMobileViewport();

  // Unknown until the client measures the viewport — hold off rendering
  // so we never flash the wrong hotspot layout.
  if (isMobile === null) return <section className="h-screen w-screen bg-black" />;

  // The mobile map image doesn't include every island yet (e.g. Vapers) —
  // only render hotspots for worlds that have a mobileHotspot defined.
  const worldsToShow = isMobile ? worldList.filter((world) => world.mobileHotspot) : worldList;

  return (
    <section className="relative h-screen w-screen overflow-hidden bg-black">
      <PortalScene>
        {worldsToShow.map((world) => (
          <IslandHotspot key={world.id} world={world} hotspot={isMobile ? world.mobileHotspot : undefined} />
        ))}
      </PortalScene>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-0 inset-x-0 pt-8 sm:pt-12 text-center z-10 pointer-events-none"
      >
        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl trinity-gradient-text uppercase tracking-wide drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
          Bienvenido al Universo Trinity
        </h1>
        <p className="text-white/70 mt-2 text-sm sm:text-base">Selecciona tu experiencia</p>
      </motion.div>

      <SoundToggle />
    </section>
  );
}
