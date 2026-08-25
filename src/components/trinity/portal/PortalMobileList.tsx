"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { worlds, type WorldConfig } from "@/lib/brands";
import { useTrinityTransition } from "@/hooks/useTrinityTransition";
import SoundToggle from "./SoundToggle";

// Matches the vertical order the client asked for — not the same order as
// worldList (which follows brands.ts declaration order).
const MOBILE_ORDER: WorldConfig["id"][] = ["barberia", "fries", "slush", "arepas", "vapers", "licores", "rent"];

const ISLAND_IMAGE: Record<string, string> = {
  barberia: "/media/trinity/islands/barberia.jpg",
  fries: "/media/trinity/islands/fries.jpg",
  slush: "/media/trinity/islands/slush.jpg",
  arepas: "/media/trinity/islands/arepas.jpg",
  vapers: "/media/trinity/islands/vapers.jpg",
  licores: "/media/trinity/islands/licores.jpg",
  rent: "/media/trinity/islands/rent.jpg",
};

export default function PortalMobileList() {
  const { activate, enterWorld, phase } = useTrinityTransition();

  function handleTap(world: WorldConfig, el: HTMLElement) {
    if (!activate(world.id)) return;
    enterWorld(world.id, el);
  }

  return (
    <section className="relative min-h-screen w-full overflow-y-auto bg-black px-4 pt-10 pb-16">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-center mb-8"
      >
        <h1 className="font-display text-2xl trinity-gradient-text uppercase tracking-wide">
          Bienvenido al Universo Trinity
        </h1>
        <p className="text-white/70 mt-2 text-sm">Selecciona tu experiencia</p>
      </motion.div>

      <div className="flex flex-col gap-5 max-w-md mx-auto">
        {MOBILE_ORDER.map((id, i) => {
          const world = worlds[id];
          return (
            <motion.button
              key={id}
              type="button"
              disabled={phase !== "idle"}
              onClick={(e) => handleTap(world, e.currentTarget)}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.06 }}
              className="relative rounded-2xl overflow-hidden aspect-[16/9] border disabled:opacity-60"
              style={{ borderColor: world.theme.border, boxShadow: `0 0 24px -8px ${world.theme.accent}` }}
            >
              <Image
                src={ISLAND_IMAGE[id]}
                alt={world.name}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i < 2}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }}
              />
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="text-center mt-10 text-white/50 text-sm"
      >
        👆 Explora cada mundo
      </motion.div>

      <SoundToggle />
    </section>
  );
}
