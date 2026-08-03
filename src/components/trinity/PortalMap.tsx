"use client";

import { motion } from "motion/react";
import { worldList } from "@/lib/brands";
import IslandHotspot from "./IslandHotspot";
import PortalScene from "./portal/PortalScene";

export default function PortalMap() {
  return (
    <section className="relative h-screen w-screen overflow-hidden bg-black">
      <PortalScene>
        {worldList.map((world) => (
          <IslandHotspot key={world.id} world={world} />
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
    </section>
  );
}
