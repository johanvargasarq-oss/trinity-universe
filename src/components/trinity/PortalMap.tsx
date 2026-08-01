"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { worldList } from "@/lib/brands";
import IslandHotspot from "./IslandHotspot";

export default function PortalMap() {
  return (
    <section className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Image + hotspots share one box so hotspot % always matches the visible image.
          Mobile: box keeps the image's own aspect ratio, centered, so all 5 islands stay visible and tappable.
          Desktop (sm+): box fills the screen and the image crops to it (full-bleed, no bars). */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 aspect-video sm:inset-0 sm:translate-y-0 sm:aspect-auto">
        <Image
          src="/media/trinity/portal-map.png"
          alt="Universo Trinity: Barbería, Fries, Slush, Arepas y Rent"
          fill
          priority
          className="object-contain sm:object-cover"
          sizes="100vw"
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 22%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.35) 100%)",
          }}
        />

        {worldList.map((world) => (
          <IslandHotspot key={world.id} world={world} />
        ))}
      </div>

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
