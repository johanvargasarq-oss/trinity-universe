"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { worldList } from "@/lib/brands";
import IslandHotspot from "./IslandHotspot";

export default function PortalMap() {
  return (
    <section className="relative h-screen w-screen overflow-hidden bg-black">
      <Image
        src="/media/trinity/portal-map.png"
        alt="Universo Trinity: Barbería, Fries, Slush, Arepas y Rent"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 22%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.35) 100%)",
        }}
      />

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

      {worldList.map((world) => (
        <IslandHotspot key={world.id} world={world} />
      ))}
    </section>
  );
}
